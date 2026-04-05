import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";
import { inputClasses } from "./input";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(inputClasses(), "resize-none", className)}
      {...props}
    />
  );
}
