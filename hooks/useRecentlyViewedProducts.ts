"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  MAX_RECENTLY_VIEWED,
  STORAGE_KEY,
  mergeRecentlyViewedAfterView,
  parseRecentlyViewedProductsJson,
  type RecentlyViewedProduct,
} from "@/lib/recently-viewed-products-storage";

export type { RecentlyViewedProduct };
export { STORAGE_KEY };

// ---------- module-level store so all hook instances share one snapshot ----------

let cachedProducts: RecentlyViewedProduct[] = [];
let storeInitialized = false;
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((fn) => fn());
}

function readFromStorage(): RecentlyViewedProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return parseRecentlyViewedProductsJson(raw);
  } catch {
    return [];
  }
}

function writeToStorage(products: RecentlyViewedProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
  }
}

// useSyncExternalStore requires a stable snapshot reference; only replace when
// the contents actually change so React skips unnecessary re-renders.
function getSnapshot(): RecentlyViewedProduct[] {
  if (!storeInitialized) {
    cachedProducts = readFromStorage();
    storeInitialized = true;
  }
  return cachedProducts;
}

function getServerSnapshot(): RecentlyViewedProduct[] {
  return [];
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // Also sync with storage events from other tabs/windows.
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedProducts = readFromStorage();
      notifyListeners();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

// ---------- public hook ----------

export function useRecentlyViewedProducts() {
  const products = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addProduct = useCallback(
    (product: Omit<RecentlyViewedProduct, "viewedAt">) => {
      cachedProducts = mergeRecentlyViewedAfterView(
        cachedProducts,
        product,
        Date.now(),
        MAX_RECENTLY_VIEWED,
      );
      writeToStorage(cachedProducts);
      notifyListeners();
    },
    [],
  );

  const clearProducts = useCallback(() => {
    cachedProducts = [];
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    notifyListeners();
  }, []);

  return { products, addProduct, clearProducts };
}
