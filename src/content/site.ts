/**
 * Global site facts. `null` means "not provided yet" and renders a visible
 * <Placeholder> in the UI — never replace it with invented information.
 */

export type SocialLink = {
  label: string;
  /** Full URL, e.g. "https://www.linkedin.com/in/…". `null` = placeholder. */
  href: string | null;
};

export const site = {
  /** Studio brand. Logo files: /public/brand, rules: DESIGN.md → Brand. */
  name: "dotMind",
  /** The founder, shown as the endorsement „by Reza Alami". */
  founder: "Reza Alami",
  domain: "dotmind.de",
  roles: ["Software Engineer", "AI Specialist", "Web & App Developer", "Digital Marketer"] as const,
  positioning:
    "Building intelligent digital products for the age of AI — where technology, design and digital strategy meet.",
  description:
    "dotMind is the studio of Reza Alami — software engineer, AI specialist, web & app developer and digital marketer — building modern websites, apps and AI-powered solutions that win customers.",
  /** NEXT_PUBLIC_SITE_URL overrides this (canonical URLs, sitemap, OG). Production defaults to the studio domain. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? "https://dotmind.de" : "http://localhost:3000")
  ).replace(/\/$/, ""),
  locale: "en_US",

  /** Contact email, e.g. "hello@example.com". `null` = placeholder. */
  email: "reza@dotmind.de" as string | null,
  /** Phone, shown as text and dialled via `tel:`. `null` = placeholder. */
  phone: { display: "+49 176 57799610", href: "tel:+4917657799610" } as { display: string; href: string } | null,
  /** WhatsApp chat link (plain wa.me link, no widget — nothing loads before the click). */
  whatsapp: "https://wa.me/4917657799610" as string | null,
  /** Business address (Impressum, structured data). Shown on the site only as `location`. */
  address: { street: "Am Kämpchen 8", postalCode: "40885", city: "Ratingen", country: "DE" },
  /** City / country or "Remote". `null` = placeholder. */
  location: "Ratingen, near Düsseldorf" as string | null,
  /** Spoken languages, e.g. ["English", "German"]. `null` = placeholder. */
  languages: null as string[] | null,
  /** Path to a CV in /public, e.g. "/reza-alami-cv.pdf". `null` = placeholder. */
  cv: null as string | null,

  socials: [
    { label: "LinkedIn", href: null },
    { label: "GitHub", href: null },
    /** Instagram profile URL, e.g. "https://www.instagram.com/dotmind.de". `null` = placeholder. */
    { label: "Instagram", href: null },
  ] as SocialLink[],

  nav: [
    { label: "Work", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export const mailto = (subject = "New project") =>
  site.email ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}` : null;
