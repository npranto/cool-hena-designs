import type { AnchorHTMLAttributes } from "react";
import { cn } from "./cn";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./button";

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(buttonClasses(variant, size), className)} {...props} />
  );
}
