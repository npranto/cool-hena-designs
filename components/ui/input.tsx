import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-henna-canvas";

const fieldBase = cn(
  "w-full rounded-xl border border-amber-200 bg-henna-surface px-4 py-2.5 text-sm text-henna-ink",
  "placeholder:text-amber-300",
  focusRing,
);

/** Shared by `Input`, `Select`, and `Textarea` */
export function inputClasses(className?: string): string {
  return cn(fieldBase, className);
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputClasses(), className)} {...props} />;
}
