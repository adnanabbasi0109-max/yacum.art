import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, name, items, shippingAddress } = body;

    if (!email || !name || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `YA-${Date.now().toString(36).toUpperCase()}`;

    // Create order in DB
    const order = await Order.create({
      orderNumber,
      email,
      name,
      items,
      total,
      paymentStatus: 'pending',
      shippingAddress: shippingAddress || undefined,
    });

    // Create Stripe checkout session
    const stripe = getStripe();
    const lineItems = items.map((item: { title: string; type: string; printSize?: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: `${item.title} (${item.type === 'digital' ? 'Digital Download' : `Print — ${item.printSize}`})`,
        },
        unit_amount: item.price, // Already in cents
      },
      quantity: item.quantity,
    }));

    const origin = request.headers.get('origin') || 'https://yacum.art';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${origin}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    // Save stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
