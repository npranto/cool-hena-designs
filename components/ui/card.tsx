import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md";
  interactive?: boolean;
};

const paddingClasses = {
  sm: "p-5",
  md: "p-7",
} as const;

export function Card({
  className,
  padding = "md",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-amber-100 bg-henna-surface",
        paddingClasses[padding],
        interactive &&
          "transition-colors duration-200 hover:border-amber-300 hover:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
