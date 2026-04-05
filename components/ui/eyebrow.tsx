import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type EyebrowProps = HTMLAttributes<HTMLSpanElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium uppercase tracking-widest text-amber-700",
        className,
      )}
      {...props}
    />
  );
}
