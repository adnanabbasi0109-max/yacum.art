import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Generate a secure download token
    const downloadToken = randomUUID();

    // Mark order as paid and store the download token
    await connectToDatabase();
    await Order.findOneAndUpdate(
      { orderNumber },
      {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        downloadToken,
      }
    );

    return NextResponse.json({ success: true, orderNumber, downloadToken });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
