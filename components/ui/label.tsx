import type { LabelHTMLAttributes } from "react";
import { cn } from "./cn";

function labelClasses(className?: string): string {
  return cn("text-sm font-medium text-henna-ink", className);
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return <label className={labelClasses(className)} {...props} />;
}
