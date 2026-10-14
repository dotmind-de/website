/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — the single source of truth for all project UI.
 * ─────────────────────────────────────────────────────────────
 *
 *  To add a project:
 *   1. Add an entry to `projects` below.
 *   2. Put screenshots in /public/projects/<slug>/ — desktop.jpg (1920×1080),
 *      laptop.jpg (1440×900 @2x), mobile.jpg (393×852 @3x), full.jpg (full page).
 *   3. Reference them with `screens(slug, title, fullHeight)` below, or set
 *      `cover` / `gallery` by hand with real width & height.
 *   4. Done — home, /projects, /projects/<slug>, sitemap and OG images update automatically.
 *
 *  Any field set to `null` renders a clearly marked placeholder.
 *  A missing `cover` renders an art-directed "screenshot placeholder".
 *  Never fill a field with invented information.
 */

export type ProjectImage = {
  /** Path inside /public, e.g. "/projects/foodigastro24/desktop.jpg" */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Same page captured on three devices, plus an optional full-page capture. */
export type DeviceScreens = {
  desktop: ProjectImage;
  laptop: ProjectImage;
  mobile: ProjectImage;
  fullPage?: ProjectImage;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** e.g. "Web application", "Website & SEO" */
  category: string | null;
  /** One or two sentences for cards. */
  summary: string | null;
  year: string | null;
  /** What Reza actually did, e.g. ["Design", "Frontend development"] */
  role: string[] | null;
  /** Only technologies genuinely used in the project. */
  technologies: string[];
  /** Concrete, verifiable features of the shipped product. */
  features: string[];
  overview: string | null;
  challenge: string | null;
  solution: string | null;
  /** Card / hero image. Defaults to `screens.desktop`. */
  cover?: ProjectImage;
  screens?: DeviceScreens;
  gallery: ProjectImage[];
  links: {
    live: string | null;
    github: string | null;
    other?: ProjectLink[];
  };
  featured: boolean;
  /** Shows an "AI" badge and groups the project under AI work. */
  ai?: boolean;
  /** Lower first. */
  order: number;
};

/** Builds the standard device set from files in /public/projects/<slug>/. */
function screens(slug: string, title: string, fullHeight?: number): DeviceScreens {
  const src = (f: string) => `/projects/${slug}/${f}.jpg`;
  return {
    desktop: { src: src("desktop"), alt: `${title} website on a desktop screen`, width: 1920, height: 1080 },
    laptop: { src: src("laptop"), alt: `${title} website on a laptop screen`, width: 2880, height: 1800 },
    mobile: { src: src("mobile"), alt: `${title} website on a mobile phone`, width: 1179, height: 2556 },
    ...(fullHeight
      ? { fullPage: { src: src("full"), alt: `Full-page view of the ${title} website`, width: 1440, height: fullHeight } }
      : {}),
  };
}

/*
 * Facts below come from the live sites (inspected September 2026): page content,
 * HTML/CSS/JS source, structured data and API routes. `year` reflects the latest
 * deployment. Role, challenge and solution are left for Reza to fill in.
 */
export const projects: Project[] = [
  {
    slug: "powerbowls",
    title: "Power Bowls",
    category: "Web app · Online ordering",
    summary:
      "Ordering platform for a bowl & wrap restaurant in Duisburg — order at the table via QR code, for pickup or delivery, and follow the order live.",
    year: "2026",
    role: null,
    technologies: ["React", "Vite", "Tailwind CSS", "Radix UI", "Lucide", "Wouter", "REST API"],
    features: [
      "Three order modes: dine-in via table QR code, pickup and delivery",
      "Live order status with estimated ready / delivery time",
      "Delivery zones managed per area",
      "Customer accounts: registration, email verification, one-time login codes, password reset",
      "Favourites, order history and order cancellation",
      "Admin dashboard: orders, menu & categories, photo uploads, tables, team, customers, messages, analytics and store settings",
      "Self-hosted fonts — no third-party font requests (GDPR-friendly)",
      "Installable web app manifest",
    ],
    overview:
      "Power Bowls is a fresh bowls & wraps restaurant at Mercatorstraße 66 in Duisburg. The web app combines the public menu with a complete ordering flow — at the table, for pickup or delivered — and an admin back office for running the store day to day.",
    challenge: null,
    solution: null,
    screens: screens("powerbowls", "Power Bowls", 5734),
    gallery: [],
    links: { live: "https://www.powerbowls.de/", github: null },
    featured: true,
    order: 1,
  },
  {
    slug: "foodigastro24",
    title: "Foodigastro24",
    category: "B2B website · Food supply",
    summary:
      "Website for a B2B fresh-food supplier delivering fruit, vegetables and selected groceries to restaurants, hotels, care homes and companies.",
    year: "2026",
    role: null,
    technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "CSS Grid", "Open Graph"],
    features: [
      "Quote request form with GDPR consent, sent via a PHP handler",
      "Service pages for fresh produce, catering & dishes and business customers",
      "Image gallery with lightbox",
      "Scroll-triggered reveal animations (IntersectionObserver)",
      "Cookie consent banner",
      "Fully responsive layout with mobile navigation",
      "SEO metadata and Open Graph sharing tags",
    ],
    overview:
      "Foodigastro24 supplies restaurants, snack bars, hotels, kindergartens, care homes, offices and companies with fresh fruit, vegetables and selected groceries. The website presents the product range and services and turns visitors into quote requests.",
    challenge: null,
    solution: null,
    screens: screens("foodigastro24", "Foodigastro24", 9003),
    gallery: [],
    links: { live: "https://foodigastro24.de/", github: null },
    featured: true,
    order: 2,
  },
  {
    slug: "rundumdienst",
    title: "Rundumdienst",
    category: "Local business website · Home services",
    summary:
      "Lead-generation website for a home & building services company in Neuss — clearances, cleaning, caretaker service, garden care and repairs.",
    year: "2026",
    role: null,
    technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "Schema.org", "Local SEO", "Google Maps"],
    features: [
      "Local SEO: Schema.org LocalBusiness markup with service catalogue, opening hours, service area and geo coordinates",
      "Contact form with server-side PHP handling",
      "WhatsApp and click-to-call contact options",
      "Service area section with embedded Google Map",
      "Services, projects and customer testimonials sections",
      "Fully responsive layout with mobile navigation",
    ],
    overview:
      "Rundumdienst offers clearances, building cleaning, caretaker services, garden care and repairs in Neuss and the surrounding area. The website is built to be found locally and to make getting a free quote as easy as possible — by form, WhatsApp or phone.",
    challenge: null,
    solution: null,
    screens: screens("rundumdienst", "Rundumdienst", 6877),
    gallery: [],
    links: { live: "https://www.rundumdienst.de/", github: null },
    featured: true,
    order: 3,
  },
];

const sorted = [...projects].sort((a, b) => a.order - b.order);

export const getProjects = () => sorted;
/** The image used on cards and as the case-study hero. */
export const coverOf = (p: Project) => p.cover ?? p.screens?.desktop;
export const getFeaturedProjects = () => sorted.filter((p) => p.featured);
export const getProject = (slug: string) => sorted.find((p) => p.slug === slug);

export function getNextProject(slug: string) {
  const i = sorted.findIndex((p) => p.slug === slug);
  return sorted.length > 1 ? sorted[(i + 1) % sorted.length] : undefined;
}

/** "https://www.example.com/path" → "example.com" */
export const displayHost = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};
