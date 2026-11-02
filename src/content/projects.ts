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
  /** "contain" shows the whole artwork (logos, print designs) instead of cropping it. */
  fit?: "cover" | "contain";
};

/** Where a project stands. Only `live` projects show a live-site link. */
export type ProjectStatus = "live" | "in-progress" | "concept" | "completed";

/** Drives the filter on /projects. */
export type ProjectKind = "website" | "web-app" | "app" | "branding";

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  concept: "Concept",
  completed: "Completed",
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
  /** Phone screens of a native/mobile app (shown instead of the device composition). */
  appScreens?: ProjectImage[];
  gallery: ProjectImage[];
  /** Defaults to "live". */
  status?: ProjectStatus;
  kind: ProjectKind;
  links: {
    live: string | null;
    /** Public repository. `null` = not public; no link is shown. */
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
    role: ["Project management", "UX & UI design", "Frontend & backend development", "Admin back office"],
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
    challenge: "A restaurant with dine-in, pickup and delivery needs one ordering flow that guests understand in seconds on their phone — and a back office the team can run during the lunch rush, without depending on third-party ordering platforms.",
    solution: "I planned the project in stages and designed one flow for all three order modes: table QR code, pickup and delivery, with live status so guests always know when their food is ready. Behind it sits a back office for menu, photos, tables, delivery zones, team and analytics. Customer accounts with one-time login codes make re-ordering fast, and self-hosted fonts keep the app GDPR-friendly.",
    screens: screens("powerbowls", "Power Bowls", 5734),
    gallery: [],
    links: { live: "https://www.powerbowls.de/", github: null },
    status: "live",
    kind: "web-app",
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
    role: ["Project management", "Web design", "Frontend development", "Forms & SEO setup", "Logo & business card"],
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
    challenge: "A B2B supplier serves very different customers — restaurants, hotels, kindergartens, care homes and offices. The website had to speak to each group, present a broad product range clearly and turn visits into concrete quote requests instead of phone calls.",
    solution: "I structured the site around customer groups and service pages, and built a GDPR-compliant quote form that is processed on the server. A gallery, scroll-triggered reveals and Open Graph tags make the range look good on screen and when shared, and a matching logo and business card give the brand one consistent appearance.",
    screens: screens("foodigastro24", "Foodigastro24", 9003),
    gallery: [],
    links: { live: "https://foodigastro24.de/", github: null },
    status: "live",
    kind: "website",
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
    role: ["Project management", "Web design", "Frontend development", "Local SEO", "Logo"],
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
    challenge: "Home and building services are searched locally and booked on short notice. The company needed to be found in Neuss and the surrounding towns, and getting in touch had to be as easy as a phone call.",
    solution: "I built the site for local search: LocalBusiness structured data with services, opening hours, service area and coordinates, plus a service-area section with a map. Every page offers three ways to make contact — form, WhatsApp and click-to-call — and the form is handled on the server.",
    screens: screens("rundumdienst", "Rundumdienst", 6877),
    gallery: [],
    links: { live: "https://www.rundumdienst.de/", github: null },
    status: "live",
    kind: "website",
    featured: true,
    order: 3,
  },

  /*
   * Projects below were reviewed from Reza's project folders (October 2026) and approved
   * for the gallery. Screens were captured from the running code or exported from the
   * original design files. Facts come from each project's README and source code.
   */
  {
    slug: "lavin-couture",
    title: "Lavin Couture",
    category: "Online shop · Evening & bridal wear",
    summary:
      "Online shop for evening, bridal and engagement dresses — collections, online payment, appointment booking and a full admin panel, in German, English and Turkish.",
    year: "2026",
    role: ["Project management", "Concept & UX", "UI design", "Frontend & backend development", "Payment & admin panel"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "next-intl", "Drizzle ORM", "SQLite (libSQL)", "Stripe", "JWT"],
    features: [
      "Storefront with collections for evening, bridal and engagement wear",
      "Product pages, shopping cart and checkout",
      "Online payment with Stripe — or order via WhatsApp when payment is switched off",
      "Appointment booking for personal fittings and a customer account area",
      "Admin panel: dashboard, products and orders, protected login",
      "Automatic invoice printing for orders",
      "Three languages: German (default), English and Turkish",
      "Dark luxury design in black and gold with page and scroll animations",
    ],
    overview:
      "Lavin Couture sells evening, bridal and engagement dresses. The shop combines an atmospheric storefront with everything the boutique needs to run online: product management, orders, payment, invoices and appointment booking for fittings.",
    challenge: "Evening and bridal wear is an emotional, high-value purchase that customers usually make in person. The shop had to feel as exclusive as a boutique, work in three languages, and still give the owner simple tools to manage products, orders and fittings.",
    solution: "I delivered the shop in five phases: storefront, database and admin panel, Stripe payment, automatic invoice printing, and finally languages, customer accounts and appointment booking. A dark black-and-gold design with calm animations carries the luxury feel, and a WhatsApp ordering mode keeps the shop usable even without online payment.",
    screens: screens("lavin-couture", "Lavin Couture", 4489),
    gallery: [
      { src: "/projects/lavin-couture/product.jpg", alt: "Lavin Couture product page for the evening gown „Goldene Stunde“", width: 1440, height: 900 },
      { src: "/projects/lavin-couture/collection.jpg", alt: "Lavin Couture bridal collection page", width: 1440, height: 900 },
      { src: "/projects/lavin-couture/appointment.jpg", alt: "Lavin Couture appointment booking page", width: 1440, height: 900 },
    ],
    links: { live: null, github: null },
    status: "in-progress",
    kind: "web-app",
    featured: false,
    order: 4,
  },
  {
    slug: "garten-glanz",
    title: "Garten Glanz",
    category: "Website · Garden care & cleaning",
    summary:
      "Brand website with two portals — garden care and building cleaning — for a service company in Cologne, with a live price calculator and project galleries.",
    year: "2026",
    role: ["Project management", "Brand & logo", "UX & UI design", "Frontend development", "SEO"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Schema.org", "SEO"],
    features: [
      "Split-gateway homepage leading to two full portals: Garten and Glanz",
      "Interactive seasonal calendar for garden care",
      "Before / after slider",
      "Live price calculator for cleaning services",
      "Self-updating project galleries — new photos appear without code changes",
      "Request forms, WhatsApp and click-to-call",
      "Sitemap, robots.txt, Open Graph and structured data",
      "Logo and brand identity",
    ],
    overview:
      "Garten Glanz offers garden care and building cleaning from one source. The website gives each service its own portal with tailored content and tools, while one brand ties both together.",
    challenge: "One company, two very different services: garden care and building cleaning. Mixing both on one page would confuse visitors; splitting them into two websites would weaken the brand.",
    solution: "I designed a split-gateway homepage that lets visitors choose their service at first glance and leads into two full portals under one brand. Each portal has its own tools — a seasonal calendar for gardens, a live price calculator for cleaning — and galleries that update themselves when new photos are added, so new references never need a developer.",
    screens: screens("garten-glanz", "Garten Glanz", 5207),
    gallery: [
      { src: "/projects/garten-glanz/garden-portal.jpg", alt: "Garten Glanz garden-care portal", width: 1440, height: 900 },
      { src: "/projects/garten-glanz/cleaning-portal.jpg", alt: "Garten Glanz cleaning portal", width: 1440, height: 900 },
    ],
    links: { live: null, github: null },
    status: "in-progress",
    kind: "website",
    featured: false,
    order: 5,
  },
  {
    slug: "martins",
    title: "Martin's Hausmeister & Garten",
    category: "Branding & web design · Home services",
    summary:
      "Complete brand for a caretaker and garden service in Neuss — logo, business card, flyer and website design.",
    year: "2023",
    role: ["Project management", "Brand identity & logo", "Print design", "Web design"],
    technologies: ["Logo design", "Print design", "Web design", "Adobe Photoshop"],
    features: [
      "Logo combining house, tree and heart",
      "Business card in portrait format",
      "DIN long flyer, front and back",
      "Website design for desktop and mobile",
    ],
    overview:
      "Martin's Hausmeister & Garten Service needed a recognisable appearance across print and web. The identity carries the same green, the same mark and the same photo style from business card to website.",
    challenge: "A new caretaker and garden service had to look established from day one — on business cards, on flyers and online — without an existing brand to build on.",
    solution: "I created a logo that combines house, tree and heart, and built every touchpoint on the same green, the same mark and the same photo style. Business card, DIN long flyer and website design were delivered together, so the brand looks the same wherever customers meet it.",
    cover: { src: "/projects/martins/cover.jpg", alt: "Martin's Hausmeister & Garten: website, business card and flyer", width: 1920, height: 1200 },
    gallery: [
      { src: "/projects/martins/flyer-front.jpg", alt: "Martin's flyer, front", width: 1800, height: 925, fit: "contain" },
      { src: "/projects/martins/business-card.jpg", alt: "Martin's business card", width: 720, height: 1075, fit: "contain" },
      { src: "/projects/martins/flyer-back.jpg", alt: "Martin's flyer, back with services", width: 1800, height: 925, fit: "contain" },
      { src: "/projects/martins/website.jpg", alt: "Martin's website design, homepage", width: 1391, height: 1800, fit: "contain" },
    ],
    links: { live: null, github: null },
    status: "completed",
    kind: "branding",
    featured: false,
    order: 6,
  },
  {
    slug: "pantochi",
    title: "PantoChi",
    category: "Mobile app · Party game",
    summary:
      "Pantomime party game for groups — teams, categories, difficulty levels, timer and scoring, built as a cross-platform mobile app.",
    year: "2026",
    role: ["Product concept", "Project management", "UX & UI design", "App development"],
    technologies: ["React Native", "Expo", "TypeScript", "Zustand", "React Navigation"],
    features: [
      "2 to 6 teams, adjustable number of rounds",
      "Automatic 90-second timer or manual timing from 30 to 300 seconds",
      "15 categories with 1,445 words on three difficulty levels",
      "Scoring with a time bonus for fast guesses",
      "One word swap per team and game",
      "Right-to-left Persian interface with its own typography scale",
      "Custom logo, icons and confetti animations",
    ],
    overview:
      "PantoChi turns the classic pantomime game into a guided app: it builds the teams, picks the words, runs the timer and keeps the score, so the group can focus on acting and guessing.",
    challenge: "Pantomime is usually played with paper slips, a stopwatch and someone keeping score — and somebody always loses track. The app had to take all of that over without getting in the way of a loud group game, and read naturally in a right-to-left language.",
    solution: "I designed a guided game flow: teams and rounds, category and difficulty, timer and automatic scoring with a time bonus. 1,445 words in 15 categories on three levels keep every game fresh, large buttons and clear colours work in a busy room, and a dedicated Persian type scale makes the right-to-left interface easy to read.",
    cover: { src: "/projects/pantochi/cover.jpg", alt: "PantoChi app screens: home, categories and score lobby", width: 1920, height: 1200 },
    appScreens: [
      { src: "/projects/pantochi/01-home.jpg", alt: "PantoChi home screen", width: 1179, height: 2556 },
      { src: "/projects/pantochi/03-setup.jpg", alt: "PantoChi game setup with teams and rounds", width: 1179, height: 2556 },
      { src: "/projects/pantochi/04-scores.jpg", alt: "PantoChi score lobby before a turn", width: 1179, height: 2556 },
      { src: "/projects/pantochi/05-category.jpg", alt: "PantoChi category selection", width: 1179, height: 2556 },
      { src: "/projects/pantochi/02-rules.jpg", alt: "PantoChi game rules", width: 1179, height: 2556 },
    ],
    gallery: [],
    links: { live: null, github: null },
    status: "in-progress",
    kind: "app",
    featured: false,
    order: 7,
  },
  {
    slug: "fixio",
    title: "FixIO",
    category: "Mobile app · AI for car repair",
    summary:
      "App for drivers and workshops that recognises car parts from a photo with AI, finds the right spare part and guides through the installation.",
    year: "2025",
    role: ["Product concept", "Project management", "UX & UI design (Figma)", "App & API development", "AI model training"],
    technologies: ["React Native", "Expo", "TypeScript", "NativeWind", "Fastify", "PostgreSQL", "OpenAI API", "YOLOv8", "Python", "Figma"],
    features: [
      "Car-part recognition from a photo with a custom-trained YOLOv8 model",
      "Search by licence plate, QR code or photo upload",
      "Vehicle profiles by brand and model",
      "Spare-part pages with step-by-step installation guides",
      "AI assistant that answers questions about the identified part",
      "Backend with authentication, image upload and PostgreSQL database",
      "Complete UI design in Figma",
    ],
    overview:
      "FixIO started from a simple question: what if you could photograph a car part and immediately know what it is, which replacement fits and how to install it? The project combines a mobile app, an API and a computer-vision model trained on car parts.",
    challenge: "Drivers and small workshops often can't tell exactly which part they are looking at, which replacement fits their car, or how to install it. Answering that takes image recognition, a parts database and clear guidance — in one mobile app.",
    solution: "I trained a YOLOv8 model on a custom car-parts dataset to recognise parts from a photo, and combined it with search by licence plate or QR code. A Fastify API with PostgreSQL stores vehicles, scans and parts, step-by-step guides walk through the installation, and an AI assistant answers follow-up questions. The whole interface was designed in Figma before development.",
    cover: { src: "/projects/fixio/cover.jpg", alt: "FixIO app screens: photo scan, AI assistant and vehicle search", width: 1920, height: 1200 },
    appScreens: [
      { src: "/projects/fixio/screen-02.jpg", alt: "FixIO scan screen: take a photo, upload or scan a QR code", width: 1178, height: 2551 },
      { src: "/projects/fixio/screen-06.jpg", alt: "FixIO vehicle search by brand", width: 1178, height: 2551 },
      { src: "/projects/fixio/screen-10.jpg", alt: "FixIO vehicle profile", width: 1181, height: 2555 },
      { src: "/projects/fixio/screen-11.jpg", alt: "FixIO spare-part page for an LED headlight kit", width: 1178, height: 2551 },
      { src: "/projects/fixio/screen-22.jpg", alt: "FixIO AI assistant introduction", width: 1178, height: 2550 },
      { src: "/projects/fixio/screen-23.jpg", alt: "FixIO AI assistant chat", width: 1178, height: 2550 },
      { src: "/projects/fixio/screen-04.jpg", alt: "FixIO photo upload", width: 1178, height: 2551 },
    ],
    gallery: [],
    links: { live: null, github: null },
    status: "concept",
    kind: "app",
    ai: true,
    featured: false,
    order: 8,
  },
];

const sorted = [...projects].sort((a, b) => a.order - b.order);

export const getProjects = () => sorted;
/** The image used on cards and as the case-study hero. */
export const coverOf = (p: Project) => p.cover ?? p.screens?.desktop;
export const getFeaturedProjects = () => sorted.filter((p) => p.featured);
export const getProject = (slug: string) => sorted.find((p) => p.slug === slug);
export const statusOf = (p: Project): ProjectStatus => p.status ?? "live";

/** Filters on /projects (`?filter=<key>`). */
export const projectFilters = [
  { key: "all", label: "All", test: () => true },
  { key: "live", label: "Live", test: (p: Project) => statusOf(p) === "live" },
  { key: "in-progress", label: "In progress", test: (p: Project) => ["in-progress", "concept"].includes(statusOf(p)) },
  { key: "apps", label: "Apps", test: (p: Project) => p.kind === "app" || p.kind === "web-app" },
  { key: "branding", label: "Branding & design", test: (p: Project) => p.kind === "branding" },
] as const;
export type ProjectFilterKey = (typeof projectFilters)[number]["key"];

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
