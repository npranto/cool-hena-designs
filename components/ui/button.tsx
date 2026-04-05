import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

const transitionColors = "transition-colors duration-200";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-henna-canvas";

const buttonBase = cn(
  "inline-flex items-center justify-center font-medium rounded-full",
  transitionColors,
  focusRing,
);

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-amber-700 text-white hover:bg-amber-800 active:bg-amber-900",
  secondary:
    "border border-amber-200 text-henna-body hover:bg-amber-50 active:bg-amber-100",
  ghost: "text-henna-body hover:bg-amber-50 active:bg-amber-100",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-sm",
  lg: "px-8 py-3 text-base",
};

/** Shared by `Button` and `ButtonLink` */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    buttonBase,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses(variant, size), className)}
      {...props}
    />
  );
}
