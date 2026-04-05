import { Card, Text } from "@/components/ui";

type FactCardProps = {
  label: string;
  icon?: string;
};

export function FactCard({ label, icon = "✦" }: FactCardProps) {
  return (
    <Card padding="sm" className="gap-2">
      <span className="text-xl text-amber-600">{icon}</span>
      <Text as="span" className="text-sm font-medium text-henna-ink">
        {label}
      </Text>
    </Card>
  );
}
