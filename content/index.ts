export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About Henna", href: "#about" },
  { label: "Our Mission", href: "#mission" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export type Service = {
  title: string;
  description: string;
  icon: string;
};

export const SERVICES: Service[] = [
  {
    title: "Bridal Henna",
    description:
      "Intricate full-hand and arm designs for the most important day of your life. Traditional and fusion styles available.",
    icon: "✦",
  },
  {
    title: "Event & Party",
    description:
      "Fun, quick designs perfect for birthday parties, festivals, baby showers, and corporate events.",
    icon: "✦",
  },
  {
    title: "Custom Designs",
    description:
      "Unique patterns tailored to your vision — from minimalist fine-line to bold traditional motifs.",
    icon: "✦",
  },
  {
    title: "Mehndi Ceremony",
    description:
      "Full mehndi night packages with multiple artists to cover all your guests beautifully.",
    icon: "✦",
  },
];

export type Review = {
  name: string;
  text: string;
  rating: number;
};

export const REVIEWS: Review[] = [
  {
    name: "Priya S.",
    text: "Shakhi did my bridal henna and it was absolutely stunning. Everyone at the wedding was asking about it!",
    rating: 5,
  },
  {
    name: "Fatima R.",
    text: "Booked for my daughter's birthday party — the kids loved it and the designs were so creative and beautiful.",
    rating: 5,
  },
  {
    name: "Aisha K.",
    text: "Professional, punctual, and incredibly talented. The henna lasted for over two weeks. Highly recommend!",
    rating: 5,
  },
];

export const ABOUT_FACTS = [
  "Natural & safe",
  "Lasts 2–4 weeks",
  "Handcrafted art",
  "Rich tradition",
] as const;

export const FOOTER_LINKS: NavLink[] = [
  { label: "About Henna", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const SITE_BRAND = "Cool Henna Designs";
export const COPYRIGHT = "© 2014 by Shakhi and Akhi";
