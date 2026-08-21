import { Typography } from "@/components";

export function LoginIntro() {
  return (
    <div className="grid gap-2">
      <Typography component="p" variant="caption1" className="text-orange">
        BON RETOUR SUR FILLO
      </Typography>
      <Typography component="h1" variant="h2">
        Connectez-vous à votre compte
      </Typography>
    </div>
  );
}
