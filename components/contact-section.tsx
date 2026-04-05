import { BookingForm } from "@/components/booking-form";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/section-heading";

export function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <Container size="xl" className="flex flex-col gap-10 text-center">
        <SectionHeading
          eyebrow="Contact"
          title="Book your henna artist"
          description={
            <p>Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
          }
        />
        <BookingForm />
      </Container>
    </section>
  );
}
