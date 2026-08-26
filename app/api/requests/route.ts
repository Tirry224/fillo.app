import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    shopSlug?: unknown;
    name?: unknown;
    phone?: unknown;
    request?: unknown;
    photo?: unknown;
  };

  if (
    typeof body.shopSlug !== "string" ||
    typeof body.name !== "string" ||
    typeof body.phone !== "string" ||
    typeof body.request !== "string" ||
    !body.name.trim() ||
    !body.phone.trim() ||
    !body.request.trim()
  ) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const supabase = await createClient();
  let photoUrl: string | null = null;

  if (typeof body.photo === "string" && body.photo.startsWith("data:image/")) {
    try {
      const matches = body.photo.match(
        /^data:image\/([a-zA-Z0-9]+);base64,(.+)$/,
      );
      if (matches && matches[2]) {
        const mimeSubtype = matches[1] || "jpeg";
        const ext = mimeSubtype === "jpeg" ? "jpg" : mimeSubtype;
        const buffer = Buffer.from(matches[2], "base64");
        const fileName = `${body.shopSlug}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("request-photos")
          .upload(fileName, buffer, {
            contentType: `image/${mimeSubtype}`,
            upsert: false,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("request-photos")
            .getPublicUrl(fileName);
          photoUrl = publicUrlData.publicUrl;
        }
      }
    } catch {
      // En cas de problème de décodage ou de réseau, poursuivre sans bloquer la demande
    }
  }

  const { error } = await supabase.rpc("submit_public_request", {
    target_shop_slug: body.shopSlug,
    customer_name: body.name,
    customer_phone: body.phone,
    request_text: body.request,
    request_photo_path: photoUrl,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
