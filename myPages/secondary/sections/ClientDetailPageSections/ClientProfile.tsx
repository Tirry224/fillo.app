"use client";

import Link from "next/link";
import { Avatar, Button, Typography } from "@/app/components";
import type { Client } from "@/lib/mockData";

export function ClientProfile({ client }: { client: Client }) {
  const whatsappNumber = client.phone.replace(/\D/g, "");

  return (
    <section className="grid justify-items-center gap-3 text-center">
      <Avatar
        initials={client.initials}
        color={client.color}
        className="size-14 text-xl"
      />
      <div className="grid gap-1">
        <Typography component="h1" variant="h3">
          {client.name}
        </Typography>
        <Typography component="p" variant="caption2">
          {client.phone}
        </Typography>
      </div>
      <Link
        className="w-full"
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour ${client.name}, je reviens vers vous concernant votre demande.`)}`}
        target="_blank"
      >
        <Button fullWidth variant="success">
          Discuter sur WhatsApp
        </Button>
      </Link>
    </section>
  );
}
