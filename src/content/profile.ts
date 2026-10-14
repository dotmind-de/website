/**
 * Professional profile content. Only facts provided in the brief are stated.
 * `null` renders a visible placeholder.
 */

export type Expertise = {
  id: string;
  title: string;
  statement: string;
  capabilities: string[];
};

export const expertise: Expertise[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    statement:
      "The foundation. Structured problem-solving, clean architecture and code that stays maintainable after launch.",
    capabilities: [
      "Software development",
      "Web application development",
      "Frontend development",
      "Backend & API work, where the project needs it",
      "Modern development workflows",
      "AI-assisted development",
    ],
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    statement:
      "The multiplier. AI applied across the whole product lifecycle — from design and development to marketing and smart home technology.",
    capabilities: [
      "AI-powered websites & apps",
      "AI in UI/UX design",
      "AI-assisted development",
      "AI for marketing & content",
      "Smart home technology",
      "Intelligent automation",
    ],
  },
  {
    id: "web-development",
    title: "Web & App Development",
    statement:
      "The daily practice. Fast, responsive websites and apps, built with care for detail and performance.",
    capabilities: [
      "Modern responsive websites",
      "Web applications",
      "Web & app design",
      "UI implementation",
      "Performance",
      "SEO-aware development",
      "Interactive experiences",
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    statement:
      "The strategic lens. Building with the audience, the message and the path to conversion in mind from day one.",
    capabilities: [
      "Digital strategy",
      "Social media",
      "Content",
      "SEO",
      "Conversion thinking",
      "Online presence",
    ],
  },
];

export type AiDomain = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  points: string[];
};

/** AI across the product lifecycle — shown in the "Intelligence" section. */
export const aiDomains: AiDomain[] = [
  {
    id: "design",
    title: "Design",
    kicker: "AI × UI/UX",
    description:
      "Using AI to research, explore and prototype faster — and designing websites and apps where AI is part of the experience.",
    points: ["AI-assisted UI/UX design", "Rapid prototyping", "AI-powered product experiences"],
  },
  {
    id: "development",
    title: "Development",
    kicker: "AI × Engineering",
    description:
      "Building AI features into websites and apps, with AI-assisted engineering workflows that stay human-reviewed.",
    points: ["AI features in websites & apps", "AI-assisted development", "Automation & integrations"],
  },
  {
    id: "marketing",
    title: "Marketing",
    kicker: "AI × Growth",
    description:
      "Applying AI to content, audience insight and campaigns — so what gets built reaches the right people.",
    points: ["AI-assisted content", "Audience insight", "Campaign optimisation"],
  },
  {
    id: "smart-home",
    title: "Smart Home",
    kicker: "AI × Physical space",
    description:
      "Connecting devices, data and interfaces into smart home experiences that feel simple to live with.",
    points: ["Smart home technology", "Connected devices", "Intelligent automation"],
  },
];

export type ProcessStep = { title: string; description: string };

export const process: ProcessStep[] = [
  { title: "Understand", description: "Goals, audience, constraints and what success should look like." },
  { title: "Plan", description: "Scope, structure, content and the technical approach — agreed before building." },
  { title: "Design", description: "Interface, hierarchy and interaction — explored faster with AI-assisted prototyping." },
  { title: "Build", description: "Clean, accessible implementation — AI-assisted, human-reviewed, shipped in small steps." },
  { title: "Refine", description: "Testing across devices, performance tuning and polishing the details." },
  { title: "Launch", description: "Deployment, SEO basics and a handover you can actually maintain." },
];

export type JourneyStage = {
  title: string;
  context: string;
  description: string;
  /** e.g. "2018 — 2022". `null` = placeholder. */
  period: string | null;
};

export const journey: JourneyStage[] = [
  {
    title: "Software Engineering",
    context: "University",
    description: "Academic background in software engineering — the foundation for everything that follows.",
    period: null,
  },
  {
    title: "Professional training",
    context: "Germany",
    description: "Around one year of additional professional training in software engineering and development.",
    period: null,
  },
  {
    title: "Web Development",
    context: "Professional work",
    description: "Professional work as a web developer, building and maintaining websites and web applications.",
    period: null,
  },
  {
    title: "Digital Marketing",
    context: "Meta · Scholarship",
    description: "Six months of professional digital-marketing training under Meta through an educational scholarship.",
    period: null,
  },
  {
    title: "Artificial Intelligence",
    context: "Design → Marketing",
    description:
      "Professional work with AI across design, development and marketing — including AI-driven web & app design and smart home technology.",
    period: null,
  },
  {
    title: "Independent practice",
    context: "Freelance",
    description: "Working independently on AI, software, web and digital projects — from idea to working product.",
    period: null,
  },
];

export type TechGroup = {
  name: string;
  items: string[];
  /** Describes what still needs confirming. Rendered as a placeholder. */
  pending?: string;
};

/**
 * Only list tools Reza actually uses. Groups with `pending` show a visible
 * placeholder until they are confirmed.
 */
export const technologies: TechGroup[] = [
  { name: "Frontend", items: ["HTML", "CSS", "JavaScript"], pending: "Add frameworks & libraries" },
  { name: "Backend", items: [], pending: "Add backend languages & frameworks" },
  { name: "Database", items: [], pending: "Add databases" },
  {
    name: "AI",
    items: ["AI-assisted design", "AI-assisted development", "AI for marketing & content", "Smart home automation"],
    pending: "Add AI tools, models & platforms",
  },
  { name: "Tools", items: [], pending: "Add editors, version control, hosting" },
  { name: "Design", items: [], pending: "Add design tools" },
  {
    name: "Marketing",
    items: ["Digital strategy", "Social media", "Content", "SEO", "Conversion"],
    pending: "Add platforms & analytics tools",
  },
];
