import { Typography } from "@/components";

export function RegisterIntro() {
  return (
    <div className="grid gap-2">
      <Typography component="p" variant="caption1" className="text-orange">
        BIENVENUE SUR FILLO
      </Typography>
      <Typography component="h1" variant="h2">
        Entrez votre numéro de téléphone
      </Typography>
    </div>
  );
}
