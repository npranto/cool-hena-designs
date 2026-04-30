"use client";

import { useEffect } from "react";
import { useRecentlyViewedProducts } from "@/hooks/useRecentlyViewedProducts";
import type { RecentlyViewedProduct } from "@/lib/recently-viewed-products-storage";

type ProductViewTrackerProps = Omit<RecentlyViewedProduct, "viewedAt">;

/**
 * Drop this inside any server-rendered product page to record a view.
 * Renders nothing — side-effect only.
 */
export function ProductViewTracker(props: ProductViewTrackerProps) {
  const { addProduct } = useRecentlyViewedProducts();

  useEffect(() => {
    addProduct(props);
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
