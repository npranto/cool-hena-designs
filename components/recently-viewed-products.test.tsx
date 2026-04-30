import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecentlyViewedProducts } from "./recently-viewed-products";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/useRecentlyViewedProducts", () => ({
  useRecentlyViewedProducts: vi.fn(),
}));

import { useRecentlyViewedProducts } from "@/hooks/useRecentlyViewedProducts";

const mockHook = vi.mocked(useRecentlyViewedProducts);

const noop = vi.fn();

describe("RecentlyViewedProducts", () => {
  it("renders nothing when the list is empty", () => {
    mockHook.mockReturnValue({
      products: [],
      addProduct: noop,
      clearProducts: noop,
    });
    const { container } = render(<RecentlyViewedProducts />);
    expect(container.firstChild).toBeNull();
  });

  it("hides products that match currentProductId", () => {
    mockHook.mockReturnValue({
      products: [
        {
          id: "here",
          title: "Current",
          slug: "here",
          path: "/services/here",
          viewedAt: 10,
        },
      ],
      addProduct: noop,
      clearProducts: noop,
    });
    const { container } = render(
      <RecentlyViewedProducts currentProductId="here" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders up to maxVisible items as links in a landmark", () => {
    mockHook.mockReturnValue({
      products: [
        {
          id: "a",
          title: "Alpha",
          slug: "a",
          path: "/services/a",
          price: "$1",
          viewedAt: 1000,
        },
        {
          id: "b",
          title: "Beta",
          slug: "b",
          path: "/services/b",
          viewedAt: 2000,
        },
        {
          id: "c",
          title: "Gamma",
          slug: "c",
          path: "/services/c",
          viewedAt: 3000,
        },
      ],
      addProduct: noop,
      clearProducts: noop,
    });
    render(<RecentlyViewedProducts maxVisible={2} />);

    const region = screen.getByRole("region", {
      name: /recently viewed services/i,
    });
    const list = within(region).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);

    const alpha = screen.getByRole("link", { name: /view alpha/i });
    expect(alpha).toHaveAttribute("href", "/services/a");
    expect(
      screen.queryByRole("link", { name: /view gamma/i }),
    ).not.toBeInTheDocument();
  });
});
