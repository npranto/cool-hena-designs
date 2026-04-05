import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** max-w-6xl (default), max-w-4xl, max-w-3xl, max-w-2xl, max-w-xl */
  size?: "6xl" | "4xl" | "3xl" | "2xl" | "xl";
};

const maxWidth: Record<NonNullable<ContainerProps["size"]>, string> = {
  "6xl": "max-w-6xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
  "2xl": "max-w-2xl",
  xl: "max-w-xl",
};

export function Container({
  className,
  size = "6xl",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6", maxWidth[size], className)}
      {...props}
    />
  );
}
