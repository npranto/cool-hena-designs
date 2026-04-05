import { SERVICES } from "@/content";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";

export function ServicesSection() {
  return (
    <section id="services" className="bg-amber-50 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Services" title="What we offer" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
