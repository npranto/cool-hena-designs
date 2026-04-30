import { describe, expect, it } from "vitest";
import {
  MAX_RECENTLY_VIEWED,
  mergeRecentlyViewedAfterView,
  parseRecentlyViewedProductsJson,
  type RecentlyViewedProduct,
} from "./recently-viewed-products-storage";

const base = (over: Partial<RecentlyViewedProduct>): RecentlyViewedProduct => ({
  id: "a",
  title: "A",
  slug: "a",
  path: "/services/a",
  viewedAt: 1,
  ...over,
});

describe("parseRecentlyViewedProductsJson", () => {
  it("returns [] for null or empty", () => {
    expect(parseRecentlyViewedProductsJson(null)).toEqual([]);
    expect(parseRecentlyViewedProductsJson("")).toEqual([]);
  });

  it("returns [] for invalid JSON", () => {
    expect(parseRecentlyViewedProductsJson("{")).toEqual([]);
  });

  it("returns [] for non-array JSON", () => {
    expect(parseRecentlyViewedProductsJson("{}")).toEqual([]);
    expect(parseRecentlyViewedProductsJson('"x"')).toEqual([]);
  });

  it("filters out malformed items and keeps valid ones", () => {
    const raw = JSON.stringify([
      base({ id: "ok", title: "OK", slug: "ok", path: "/ok", viewedAt: 10 }),
      { id: 1 },
      null,
      { id: "bad", title: "no slug" },
    ]);
    expect(parseRecentlyViewedProductsJson(raw)).toEqual([
      base({ id: "ok", title: "OK", slug: "ok", path: "/ok", viewedAt: 10 }),
    ]);
  });

  it("preserves optional price and imageUrl when present", () => {
    const item = base({
      id: "x",
      price: "$10",
      imageUrl: "https://example.com/x.jpg",
    });
    expect(parseRecentlyViewedProductsJson(JSON.stringify([item]))).toEqual([
      item,
    ]);
  });
});

describe("mergeRecentlyViewedAfterView", () => {
  it("prepends a new product", () => {
    const existing = [base({ id: "old", viewedAt: 2 })];
    const next = mergeRecentlyViewedAfterView(
      existing,
      { id: "new", title: "N", slug: "n", path: "/n" },
      99,
    );
    expect(next.map((p) => p.id)).toEqual(["new", "old"]);
    expect(next[0].viewedAt).toBe(99);
  });

  it("moves an existing id to the front without duplicating", () => {
    const existing = [
      base({ id: "b", viewedAt: 2 }),
      base({ id: "a", title: "A1", viewedAt: 1 }),
    ];
    const next = mergeRecentlyViewedAfterView(
      existing,
      { id: "a", title: "A2", slug: "a", path: "/services/a" },
      50,
    );
    expect(next.map((p) => p.id)).toEqual(["a", "b"]);
    expect(next[0].title).toBe("A2");
    expect(next[0].viewedAt).toBe(50);
    expect(next).toHaveLength(2);
  });

  it(`caps at ${MAX_RECENTLY_VIEWED} items`, () => {
    const existing: RecentlyViewedProduct[] = Array.from(
      { length: MAX_RECENTLY_VIEWED },
      (_, i) =>
        base({
          id: `id-${i}`,
          title: `T${i}`,
          slug: `s${i}`,
          path: `/p${i}`,
          viewedAt: i,
        }),
    );
    const next = mergeRecentlyViewedAfterView(
      existing,
      { id: "fresh", title: "F", slug: "f", path: "/f" },
      999,
      MAX_RECENTLY_VIEWED,
    );
    expect(next).toHaveLength(MAX_RECENTLY_VIEWED);
    expect(next[0].id).toBe("fresh");
    expect(next.map((p) => p.id)).not.toContain("id-7");
  });
});
