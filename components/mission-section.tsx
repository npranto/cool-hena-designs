import { Container, Text } from "@/components/ui";
import { SectionHeading } from "@/components/section-heading";

export function MissionSection() {
  return (
    <section id="mission" className="py-24">
      <Container size="3xl" className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Our Mission"
          title="Art that connects and celebrates"
        />
        <Text muted lead className="text-center">
          We believe henna is more than decoration — it&apos;s a bridge between
          cultures, a mark of celebration, and an expression of identity. Our
          mission is to bring that ancient tradition to life through modern,
          accessible artistry that every person can enjoy.
        </Text>
        <Text muted className="text-center">
          From intimate bridal ceremonies to lively community events, we pour
          passion and precision into every single design.
        </Text>
      </Container>
    </section>
  );
}
