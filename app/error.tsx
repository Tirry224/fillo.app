"use client";

import { useEffect } from "react";
import { Button, Container, Typography } from "@/app/components";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="grid place-items-center gap-4 text-center">
      <Typography component="h1" variant="h3">
        Une erreur est survenue
      </Typography>
      <Typography component="p" variant="body-base">
        Impossible de charger cette page pour le moment. Merci de réessayer.
      </Typography>
      <Button onClick={reset} type="button">
        Réessayer
      </Button>
    </Container>
  );
}
