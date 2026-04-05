import { ButtonLink, Eyebrow, Heading, Text } from "@/components/ui";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-50 via-henna-canvas to-henna-canvas" />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
        <Eyebrow>Shakhi &amp; Akhi&apos;s Henna</Eyebrow>
        <Heading level={1}>
          Keep Calm and
          <br />
          <span className="text-amber-700">Get Henna</span>
        </Heading>
        <Text muted lead className="max-w-md">
          Beautiful, natural henna art for weddings, events, and everyday
          celebrations. Handcrafted with love since 2014.
        </Text>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#contact">Book Henna Artist</ButtonLink>
          <ButtonLink href="#gallery" variant="secondary">
            View Gallery
          </ButtonLink>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 flex w-full justify-center select-none text-4xl tracking-[1.5rem] text-amber-800 opacity-20">
        ❋ ❋ ❋ ❋ ❋
      </div>
    </section>
  );
}
