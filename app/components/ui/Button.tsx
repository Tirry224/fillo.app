import type { ButtonHTMLAttributes } from "react";
import { uiStyles } from "./Typography";

const buttonVariants = {
  primary: "bg-navy text-white hover:bg-[#1f2a46]",
  accent: "bg-orange text-navy hover:bg-[#e99a22]",
  success: "bg-green text-white hover:bg-[#276f2e]",
  secondary:
    "border border-border-strong bg-surface text-navy hover:bg-surface-warm",
  danger:
    "border border-transparent bg-transparent text-[#c53f3f] hover:bg-[#fff3f1]",
} as const;

const buttonSizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${uiStyles.controlRadius} ${uiStyles.button} disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${widthClass} ${className}`}
      type={type}
      {...props}
    />
  );
}
