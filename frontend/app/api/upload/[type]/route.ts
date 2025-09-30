// app/api/upload/[type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bucket = params.type === "cover" ? "cover-photo" : "books";
    const ext = file.name.split(".").pop();
    const filePath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60 * 24);

    if (urlError) {
      return NextResponse.json(
        { error: "Failed to get signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl, path: filePath });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
