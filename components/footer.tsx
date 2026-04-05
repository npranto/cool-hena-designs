import { COPYRIGHT, FOOTER_LINKS, SITE_BRAND } from "@/content";
import { Container, TextLink } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-henna-canvas py-10">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm font-medium text-amber-800">{SITE_BRAND}</span>
        <span className="text-xs text-henna-muted">{COPYRIGHT}</span>
        <nav className="flex gap-5 text-xs">
          {FOOTER_LINKS.map((link) => (
            <TextLink
              key={link.href}
              href={link.href}
              className="text-henna-muted"
            >
              {link.label}
            </TextLink>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
