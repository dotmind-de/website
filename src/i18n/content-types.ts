/** Translated profile and project content. English lives in src/content/*.ts. */

export type ProfileText = {
  /** Same order as `expertise` in src/content/profile.ts */
  expertise: { title: string; statement: string; capabilities: string[] }[];
  /** Same order as `aiDomains` */
  aiDomains: { title: string; kicker: string; description: string; points: string[] }[];
  /** Same order as `process` */
  process: { title: string; description: string }[];
  /** Same order as `journey` */
  journey: { title: string; context: string; description: string }[];
  /** Technology group names, keyed by the English name */
  techGroups: Record<string, string>;
  /** Descriptive technology items (not product names), keyed by the English item */
  techItems: Record<string, string>;
};

export type ProjectText = {
  category: string;
  summary: string;
  overview: string;
  features: string[];
  role: string[];
  challenge: string;
  solution: string;
};

export type LocaleContent = {
  profile: ProfileText;
  projects: Record<string, ProjectText>;
};
