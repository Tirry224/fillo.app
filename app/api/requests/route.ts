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
  const { error } = await supabase.rpc("submit_public_request", {
    target_shop_slug: body.shopSlug,
    customer_name: body.name,
    customer_phone: body.phone,
    request_text: body.request,
    request_photo_path: typeof body.photo === "string" ? body.photo : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
