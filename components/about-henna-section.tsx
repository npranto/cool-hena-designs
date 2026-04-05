import { ABOUT_FACTS } from "@/content";
import { Container, Text } from "@/components/ui";
import { FactCard } from "@/components/fact-card";
import { SectionHeading } from "@/components/section-heading";

export function AboutHennaSection() {
  return (
    <section id="about" className="bg-amber-50 py-24">
      <Container size="4xl" className="grid items-center gap-14 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeading
            align="left"
            eyebrow="About Henna"
            title="An ancient art, timeless beauty"
          />
          <Text muted>
            Henna, or mehndi, is a centuries-old tradition rooted in South Asian,
            Middle Eastern, and North African cultures. Made from the dried and
            powdered leaves of the henna plant, it creates rich, warm patterns
            on the skin that deepen over time.
          </Text>
          <Text muted>
            Completely natural and skin-safe, henna is a beautiful way to
            celebrate life&apos;s most special moments — from weddings and
            festivals to everyday expression.
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {ABOUT_FACTS.map((fact) => (
            <FactCard key={fact} label={fact} />
          ))}
        </div>
      </Container>
    </section>
  );
}
