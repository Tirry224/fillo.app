import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Limite de débit basique, en mémoire, par IP. Ne protège qu'une seule
 * instance de serveur (pas de partage entre instances en déploiement
 * multi-instance/serverless) : suffisant pour dissuader un abus simple,
 * mais une solution durable (ex. Upstash Redis, Vercel KV) est nécessaire
 * avant une mise à l'échelle en production.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestTimestampsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestTimestampsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestampsByIp.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestTimestampsByIp.set(ip, timestamps);
  return false;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
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

  const { data: shopCheck } = await supabase.rpc("get_public_shop", {
    shop_slug: body.shopSlug,
  });
  if (!shopCheck?.[0]) {
    return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
  }

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
