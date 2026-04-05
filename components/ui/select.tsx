import type { SelectHTMLAttributes } from "react";
import { cn } from "./cn";
import { inputClasses } from "./input";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(inputClasses(), className)} {...props} />;
}
