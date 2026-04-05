import { NAV_LINKS, SITE_BRAND } from "@/content";
import { ButtonLink, Container, TextLink } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-100 bg-henna-canvas/90 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 w-full items-center justify-between">
          <a
            href="#home"
            className="text-lg font-semibold tracking-tight text-amber-800 transition-colors duration-200 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-henna-canvas rounded-sm"
          >
            {SITE_BRAND}
          </a>
          <ul className="hidden items-center gap-6 text-sm md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <TextLink href={link.href}>{link.label}</TextLink>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="#contact"
            size="sm"
            className="hidden md:inline-flex"
          >
            Book Now
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}
