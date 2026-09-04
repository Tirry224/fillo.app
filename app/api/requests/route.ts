import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNewRequestNotification } from "@/lib/email/notifications";
import { isPublicRequestRateLimited } from "@/lib/rateLimit";
import { MAX_REQUEST_PHOTOS } from "@/lib/types";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

async function uploadRequestPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  shopSlug: string,
  photoDataUrl: string,
): Promise<string | null> {
  if (!photoDataUrl.startsWith("data:image/")) {
    return null;
  }

  try {
    const matches = photoDataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches?.[2]) {
      return null;
    }

    const mimeSubtype = matches[1] || "jpeg";
    const ext = mimeSubtype === "jpeg" ? "jpg" : mimeSubtype;
    const buffer = Buffer.from(matches[2], "base64");
    const fileName = `${shopSlug}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("request-photos")
      .upload(fileName, buffer, {
        contentType: `image/${mimeSubtype}`,
        upsert: false,
      });

    if (uploadError) {
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("request-photos")
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch {
    // En cas de problème de décodage ou de réseau, poursuivre sans bloquer la demande
    return null;
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (await isPublicRequestRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes envoyées. Merci de réessayer plus tard." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as {
    shopSlug?: unknown;
    name?: unknown;
    phone?: unknown;
    request?: unknown;
    photos?: unknown;
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

  const shopSlug = body.shopSlug;
  const supabase = await createClient();

  const { data: shopCheck } = await supabase.rpc("get_public_shop", {
    shop_slug: shopSlug,
  });
  if (!shopCheck?.[0]) {
    return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
  }

  const photoDataUrls = Array.isArray(body.photos)
    ? body.photos.filter((photo): photo is string => typeof photo === "string")
    : [];

  const photoUrls = (
    await Promise.all(
      photoDataUrls
        .slice(0, MAX_REQUEST_PHOTOS)
        .map((photo) => uploadRequestPhoto(supabase, shopSlug, photo)),
    )
  ).filter((url): url is string => Boolean(url));

  const { data: submitResult, error } = await supabase.rpc("submit_public_request", {
    target_shop_slug: body.shopSlug,
    customer_name: body.name,
    customer_phone: body.phone,
    request_text: body.request,
    request_photos: photoUrls,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (submitResult?.email_notifications && submitResult.shop_email) {
    await sendNewRequestNotification({
      shopEmail: submitResult.shop_email,
      shopName: submitResult.shop_name,
      clientName: body.name,
      message: body.request,
    });
  }

  return NextResponse.json(
    { ok: true, clientId: submitResult.client_id },
    { status: 201 },
  );
}
