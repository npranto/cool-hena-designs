import type { Review } from "@/content";
import { Card } from "@/components/ui";

export function ReviewCard({ name, text, rating }: Review) {
  return (
    <Card className="gap-4">
      <div className="flex gap-1 text-sm text-amber-400">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-henna-body">
        &ldquo;{text}&rdquo;
      </p>
      <span className="mt-auto text-xs font-medium text-henna-muted">
        — {name}
      </span>
    </Card>
  );
}
