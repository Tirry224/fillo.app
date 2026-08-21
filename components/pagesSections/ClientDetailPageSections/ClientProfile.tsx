import Link from "next/link";
import { Avatar, Button, Typography } from "@/components";

export function ClientProfile() {
  return (
    <section className="grid justify-items-center gap-3 text-center">
      <Avatar initials="MB" className="size-14 text-xl" />
      <div className="grid gap-1">
        <Typography component="h1" variant="h3">
          Mamadou Bah
        </Typography>
        <Typography component="p" variant="caption2">
          +224 621 45 89 12
        </Typography>
      </div>
      <Link className="w-full" href="https://wa.me/224621458912">
        <Button fullWidth variant="success">
          Discuter sur WhatsApp
        </Button>
      </Link>
    </section>
  );
}
