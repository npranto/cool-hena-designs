# Recently Viewed Products

Tracks the last services a visitor viewed and surfaces them on service detail pages.

## What it does

When a user opens a service detail page (e.g. `/services/bridal-henna`), the page records that visit in `localStorage`. On subsequent service pages the visitor sees a **"Recently Viewed"** strip showing up to four of their previous services, excluding the current one.

## localStorage

| Key                            | Value                                                       |
| ------------------------------ | ----------------------------------------------------------- |
| `chd:recently-viewed-products` | JSON array of `RecentlyViewedProduct` objects, newest first |

At most **8 items** are retained. Viewing the same service again moves it to the front instead of creating a duplicate. Corrupted or non-array data is silently discarded.

## Components / hooks

| File                                      | Purpose                                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `hooks/useRecentlyViewedProducts.ts`      | Read, add, and clear recently viewed products. SSR-safe — no `window` access during server render.                              |
| `components/product-view-tracker.tsx`     | Client-only side-effect component. Drop into any service page to record a view on mount.                                        |
| `components/recently-viewed-products.tsx` | Renders the "Recently Viewed" UI strip. Hides itself when the list is empty. Accepts `currentProductId` and `maxVisible` props. |

## Where it's integrated

`app/services/[slug]/page.tsx` — the service detail page. Both `<ProductViewTracker>` and `<RecentlyViewedProducts>` are included there automatically.

The `ServicesSection` on the home page links each service card to its detail page so tracking begins from the first click.

## Analytics

No analytics system exists yet. A `// TODO` comment lives on the `<Link onClick>` handler inside `RecentlyViewedProducts`. When an analytics provider is added, fire an event there:

```ts
// Suggested event name: recently_viewed_product_clicked
// Payload: { id, title, path, source: "recently_viewed_products" }
```

## Clearing data during testing

In the browser console:

```js
localStorage.removeItem("chd:recently-viewed-products");
```

Or call `clearProducts()` from the `useRecentlyViewedProducts` hook.
