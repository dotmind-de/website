/**
 * Global site facts. `null` means "not provided yet" and renders a visible
 * <Placeholder> in the UI — never replace it with invented information.
 */

export type SocialLink = {
  label: string;
  /** Full URL, e.g. "https://github.com/…". `null` = placeholder. */
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
  /** USt-IdNr. for the Impressum, e.g. "DE123456789". `null` = none issued; the section is left out. */
  vatId: null as string | null,
  /** City / country or "Remote". `null` = placeholder. */
  location: "Ratingen, near Düsseldorf" as string | null,
  /** Spoken languages, e.g. ["English", "German"]. `null` = placeholder. */
  languages: null as string[] | null,
  /** Path to a CV in /public, e.g. "/reza-alami-cv.pdf". `null` = placeholder. */
  cv: null as string | null,

  socials: [
    { label: "GitHub", href: "https://github.com/r-alami" },
    { label: "Instagram", href: "https://www.instagram.com/dotmind_de" },
  ] as SocialLink[],

  /** Labels come from the translations (`nav.<key>`). */
  nav: [
    { key: "work", href: "/projects" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ] as const,
};

export const mailto = (subject = "New project") =>
  site.email ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}` : null;
