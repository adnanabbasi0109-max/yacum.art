import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = (formData.get("slug") as string | null) || "artwork";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPEG, or WebP." },
        { status: 400 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Vercel Blob is not configured. Install @vercel/blob and set BLOB_READ_WRITE_TOKEN.",
        },
        { status: 500 }
      );
    }

    // Dynamic import so the build doesn't fail if the package isn't installed yet.
    const blobModule: { put: (key: string, body: File, opts: unknown) => Promise<{ url: string }> } =
      await import("@vercel/blob" as string).catch(() => {
        throw new Error(
          "The @vercel/blob package is not installed. Run: npm i @vercel/blob"
        );
      });

    const ext =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const key = `artworks/${safeSlug}-${Date.now()}.${ext}`;

    const blob = await blobModule.put(key, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Admin upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
