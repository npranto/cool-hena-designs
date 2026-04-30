import Link from "next/link";
import type { Service } from "@/content";
import { Card, Heading, Text } from "@/components/ui";

export function ServiceCard({ title, description, icon, slug }: Service) {
  return (
    <Link
      href={`/services/${slug}`}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      aria-label={`Learn more about ${title}`}
    >
      <Card interactive className="h-full gap-4">
        <span className="text-2xl text-amber-600" aria-hidden="true">
          {icon}
        </span>
        <Heading level={3}>{title}</Heading>
        <Text muted className="text-sm">
          {description}
        </Text>
      </Card>
    </Link>
  );
}
