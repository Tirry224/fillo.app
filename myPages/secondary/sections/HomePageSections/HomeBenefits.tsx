import { Typography } from "@/app/components";
import { Check } from "lucide-react";

const benefits = [
  "Partagez votre lien en bio WhatsApp",
  "Recevez les demandes avec photo",
  "Suivez vos ventes sans cahier papier",
];

export function HomeBenefits() {
  return (
    <ul className="mt-8 grid gap-4">
      {benefits.map((benefit) => (
        <li className="flex items-center gap-3" key={benefit}>
          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-navy text-white">
            <Check aria-hidden="true" size={13} strokeWidth={3} />
          </span>
          <Typography component="span" variant="caption1">
            {benefit}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
