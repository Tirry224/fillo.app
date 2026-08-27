import type { HTMLAttributes, ReactNode } from "react";

// Noms des styles de texte disponibles dans toute l'application.
export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "lead"
  | "body-lg"
  | "body-base"
  | "body-sm"
  | "caption1"
  | "caption2"
  | "caption3"
  | "caption4";

// Balises HTML autorisees par le composant Typography.
type TypographyComponent =
  | "div"
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "label";

// Chaque variante associe un nom simple a ses classes Tailwind.
const variants: Record<TypographyVariant, string> = {
  display: "font-display text-4xl font-bold leading-tight text-text",
  h1: "font-display text-3xl font-bold leading-tight text-text",
  h2: "font-display text-2xl font-bold leading-tight text-text",
  h3: "font-display text-xl font-bold leading-tight text-text",
  h4: "font-display text-lg font-bold leading-tight text-text",
  h5: "font-display text-base font-bold leading-tight text-text",
  lead: "text-lg leading-relaxed text-text",
  "body-lg": "text-base leading-relaxed text-text",
  "body-base": "text-sm leading-relaxed text-text",
  "body-sm": "text-xs leading-relaxed text-text",
  caption1: "text-xs font-bold leading-normal text-text",
  caption2: "text-xs leading-normal text-ink-muted",
  caption3: "text-[11px] font-bold leading-normal text-ink-muted",
  caption4: "text-[10px] leading-normal text-ink-muted",
};

// Styles communs aux composants UI, centralises avec la typographie.
export const uiStyles = {
  controlRadius: "rounded-[var(--radius-control)]",
  cardRadius: "rounded-[var(--radius-card)]",
  cardRadiusResponsive: "sm:rounded-[var(--radius-card)]",
  field: "min-h-11 px-3 text-base",
  button: "font-bold transition-colors",
  sectionGap: "gap-8",
  formGap: "gap-4",
} as const;

// Props communes : style choisi, balise HTML, contenu et classe exceptionnelle.
export type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  component?: TypographyComponent;
  children?: ReactNode;
};

// Composant principal : il applique une variante a la balise choisie.
export function Typography({
  variant = "body-base",
  component = "p",
  children,
  className = "",
  ...props
}: TypographyProps) {
  const Component = component;

  return (
    <Component
      className={`${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
