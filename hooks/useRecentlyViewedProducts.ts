"use client";

import { useCallback, useSyncExternalStore } from "react";

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
const MAX_ITEMS = 8;

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
    if (!raw) return [];
    const parsed = JSON.parse(raw);
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
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
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
      const filtered = cachedProducts.filter((p) => p.id !== product.id);
      cachedProducts = [
        { ...product, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
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
