import type { AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

const transitionColors = "transition-colors duration-200";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-henna-canvas";

function textLinkClasses(className?: string): string {
  return cn(
    "rounded-sm text-henna-body hover:text-amber-700",
    transitionColors,
    focusRing,
    className,
  );
}

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function TextLink({ className, ...props }: TextLinkProps) {
  return <a className={textLinkClasses(className)} {...props} />;
}
