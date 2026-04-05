import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/section-heading";

const PLACEHOLDER_COUNT = 6;

export function GallerySection() {
  return (
    <section id="gallery" className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Gallery"
          title="Our work"
          description={<p>A glimpse of the designs we&apos;ve created</p>}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-5xl text-amber-200 transition-colors duration-200 hover:bg-amber-100"
            >
              ❋
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
