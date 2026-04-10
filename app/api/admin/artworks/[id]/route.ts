import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Artwork from "@/models/Artwork";
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
      "title",
      "slug",
      "arabic",
      "translation",
      "theme",
      "previewImageUrl",
      "highResS3Key",
      "digitalPrice",
      "printPriceBase",
      "status",
      "orientation",
      "description",
      "isAuctionPiece",
      "isFeatured",
    ] as const;
    for (const f of fields) {
      if (body[f] !== undefined) allowed[f] = body[f];
    }

    const artwork = await Artwork.findByIdAndUpdate(id, allowed, { new: true });
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ artwork });
  } catch (error) {
    console.error("Admin artwork update error:", error);
    return NextResponse.json(
      { error: "Failed to update artwork" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Artwork.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin artwork delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork" },
      { status: 500 }
    );
  }
}
