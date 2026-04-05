import type { ReactNode } from "react";
import { cn } from "./cn";
import { Label } from "./label";

export type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ id, label, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
