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
    </footer>
  );
}
