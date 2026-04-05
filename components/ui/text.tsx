import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  /** Muted body copy (sections, cards) */
  muted?: boolean;
  /** Slightly larger lead paragraph */
  lead?: boolean;
  as?: "p" | "span";
};

export function Text({
  className,
  muted = false,
  lead = false,
  as: Component = "p",
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        lead && "text-lg leading-relaxed",
        muted ? "text-henna-muted" : "text-henna-body",
        "leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
