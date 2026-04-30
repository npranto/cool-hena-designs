"use client";

import Link from "next/link";
import { useRecentlyViewedProducts } from "@/hooks/useRecentlyViewedProducts";
import { Card, Container, Eyebrow, Heading, Text } from "@/components/ui";

type RecentlyViewedProductsProps = {
  /** Exclude a product by id (e.g. the current page's product) */
  currentProductId?: string;
  /** Max number of items to show (default: 4) */
  maxVisible?: number;
};

export function RecentlyViewedProducts({
  currentProductId,
  maxVisible = 4,
}: RecentlyViewedProductsProps) {
  const { products } = useRecentlyViewedProducts();

  const visible = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, maxVisible);

  if (visible.length === 0) return null;

  return (
    <section aria-label="Recently viewed services">
      <Container className="flex flex-col gap-8 py-16">
        <div className="flex flex-col gap-2 text-center">
          <Eyebrow>Your History</Eyebrow>
          <Heading level={2}>Recently Viewed</Heading>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {visible.map((product) => (
            <li key={product.id}>
              <Link
                href={product.path}
                className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                onClick={() => {
                  // TODO: fire analytics event when an analytics system is integrated
                  // Suggested event: recently_viewed_product_clicked
                  // Payload: { id: product.id, title: product.title, path: product.path, source: "recently_viewed_products" }
                }}
                aria-label={`View ${product.title}`}
              >
                <Card
                  interactive
                  padding="sm"
                  className="h-full justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <Text
                      as="span"
                      className="font-semibold text-henna-ink text-sm leading-snug"
                    >
                      {product.title}
                    </Text>
                    {product.price != null ? (
                      <Text as="span" muted className="text-xs">
                        {product.price}
                      </Text>
                    ) : null}
                  </div>
                  <Text as="span" muted className="text-xs">
                    {new Date(product.viewedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
