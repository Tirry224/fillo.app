import type { HTMLAttributes } from "react";

const avatarColors = {
  blue: "bg-[#e5f2fb] text-navy",
  orange: "bg-[#fff1d8] text-[#9a5d00]",
  green: "bg-[#e6f4e7] text-green",
} as const;

type AvatarColor = keyof typeof avatarColors;

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  initials: string;
  color?: AvatarColor;
};

export function Avatar({
  initials,
  color = "blue",
  className = "",
  ...props
}: AvatarProps) {
  return (
    <div
      aria-label={`Avatar de ${initials}`}
      className={`flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] font-display text-base font-bold ${avatarColors[color]} ${className}`}
      role="img"
      {...props}
    >
      {initials}
    </div>
  );
}
