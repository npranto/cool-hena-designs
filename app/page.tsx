import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  AboutHennaSection,
  ContactSection,
  GallerySection,
  HeroSection,
  MissionSection,
  ReviewsSection,
  ServicesSection,
} from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-henna-canvas font-sans text-henna-ink">
      <Header />
      <main>
        <HeroSection />
        <AboutHennaSection />
        <MissionSection />
        <ServicesSection />
        <GallerySection />
        <ReviewsSection />
        <ContactSection />
        Test
      </main>
      <Footer />
    </div>
  );
}
