import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type HeadingLevel = 1 | 2 | 3;

const levelTag: Record<HeadingLevel, "h1" | "h2" | "h3"> = {
  1: "h1",
  2: "h2",
  3: "h3",
};

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-5xl font-bold leading-tight tracking-tight text-henna-ink sm:text-6xl",
  2: "text-4xl font-bold text-henna-ink",
  3: "font-semibold text-henna-ink",
};

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = levelTag[level];
  return <Tag className={cn(levelClasses[level], className)} {...props} />;
}
