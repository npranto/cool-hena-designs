import type { ReactNode } from "react";
import { cn, Eyebrow, Heading } from "@/components/ui";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("flex flex-col gap-3", alignClass)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading level={2}>{title}</Heading>
      {description != null ? (
        <div
          className={cn(
            "text-henna-muted leading-relaxed [&_p]:leading-relaxed",
            alignClass,
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
