export type RecentlyViewedProduct = {
  id: string;
  title: string;
  slug: string;
  path: string;
  price?: string;
  imageUrl?: string;
  viewedAt: number;
};

export const STORAGE_KEY = "chd:recently-viewed-products";
export const MAX_RECENTLY_VIEWED = 8;

/**
 * Parse and validate a JSON string from localStorage.
 * Returns [] for missing, invalid, or corrupted data.
 */
export function parseRecentlyViewedProductsJson(
  raw: string | null,
): RecentlyViewedProduct[] {
  if (raw == null || raw === "") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentlyViewedProduct =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.slug === "string" &&
        typeof item.path === "string" &&
        typeof item.viewedAt === "number",
    );
  } catch {
    return [];
  }
}

/**
 * Insert or move a product to the front (dedupe by id) and cap list length.
 */
export function mergeRecentlyViewedAfterView(
  existing: RecentlyViewedProduct[],
  product: Omit<RecentlyViewedProduct, "viewedAt">,
  viewedAt: number,
  maxItems: number = MAX_RECENTLY_VIEWED,
): RecentlyViewedProduct[] {
  const filtered = existing.filter((p) => p.id !== product.id);
  return [{ ...product, viewedAt }, ...filtered].slice(0, maxItems);
}
