import type { Service } from "@/content";
import { Card, Heading, Text } from "@/components/ui";

export function ServiceCard({ title, description, icon }: Service) {
  return (
    <Card interactive className="gap-4">
      <span className="text-2xl text-amber-600">{icon}</span>
      <Heading level={3}>{title}</Heading>
      <Text muted className="text-sm">
        {description}
      </Text>
    </Card>
  );
}
