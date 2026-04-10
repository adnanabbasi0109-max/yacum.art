import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    const fields = [
      "fulfillmentStatus",
      "trackingNumber",
      "trackingCarrier",
      "adminNotes",
      "paymentStatus",
    ] as const;
    for (const f of fields) {
      if (body[f] !== undefined) allowed[f] = body[f];
    }

    if (body.trackingUpdate && body.trackingUpdate.status && body.trackingUpdate.message) {
      allowed.$push = {
        trackingUpdates: {
          status: body.trackingUpdate.status,
          message: body.trackingUpdate.message,
          timestamp: new Date(),
        },
      };
    }

    const order = await Order.findByIdAndUpdate(id, allowed, { new: true });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
