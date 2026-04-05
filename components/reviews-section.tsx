import { REVIEWS } from "@/content";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/section-heading";
import { ReviewCard } from "@/components/review-card";

export function ReviewsSection() {
  return (
    <section id="reviews" className="bg-amber-50 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Reviews" title="What clients say" />
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </Container>
    </section>
  );
}
