import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES } from "@/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container, Heading, Text, ButtonLink } from "@/components/ui";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { RecentlyViewedProducts } from "@/components/recently-viewed-products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Cool Henna Designs`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-henna-canvas font-sans text-henna-ink">
      <Header />

      {/* Track this view client-side without blocking server render */}
      <ProductViewTracker
        id={service.id}
        title={service.title}
        slug={service.slug}
        path={`/services/${service.slug}`}
        price={service.price}
        imageUrl={service.imageUrl}
      />

      <main>
        {/* Hero / detail section */}
        <section className="border-b border-amber-100 bg-amber-50 py-24">
          <Container className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-3xl text-amber-600" aria-hidden="true">
                {service.icon}
              </span>
              <Heading level={1}>{service.title}</Heading>
              <Text lead muted>
                {service.description}
              </Text>
              <Text className="text-lg font-semibold text-amber-700">
                {service.price}
              </Text>
            </div>

            <ButtonLink href="#contact" size="lg" className="self-start">
              Book This Service
            </ButtonLink>
          </Container>
        </section>

        {/* Recently viewed — hides itself when empty */}
        <RecentlyViewedProducts currentProductId={service.id} />
      </main>

      <Footer />
    </div>
  );
}
