import Link from "next/link";
import { Button, Typography } from "@/app/components";

export function HomeFooter() {
  return (
    <footer className="grid gap-3">
      <Link className="block" href="/register">
        <Button fullWidth size="lg">
          Créer mon compte gratuit
        </Button>
      </Link>
      <Typography component="p" className="text-center" variant="caption2">
        Gratuit - Inscription en 30 secondes
      </Typography>
      <Link className="block text-center underline" href="/confidentialite">
        <Typography component="span" variant="caption2">
          Confidentialité &amp; mentions légales
        </Typography>
      </Link>
    </footer>
  );
}
