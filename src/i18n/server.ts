import { lang } from "next/root-params";
import { aiDomains, expertise, journey, process, technologies } from "@/content/profile";
import { getProject, getProjects, type Project } from "@/content/projects";
import { isLocale, localePath, defaultLocale, type Locale } from "./config";
import type { LocaleContent } from "./content-types";
import type { Messages } from "./messages/en";
import { loadMessages } from "./messages";

const content: Record<Exclude<Locale, "en">, () => Promise<LocaleContent>> = {
  de: () => import("./content/de").then((m) => m.de),
  tr: () => import("./content/tr").then((m) => m.tr),
  fa: () => import("./content/fa").then((m) => m.fa),
  ar: () => import("./content/ar").then((m) => m.ar),
};

/** The current language, read from the `[lang]` root segment. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : defaultLocale;
}

export async function getMessages(): Promise<Messages> {
  return loadMessages(await getLocale());
}

/** Locale-aware path builder for the current request. */
export async function getHref() {
  const locale = await getLocale();
  return (path: string) => localePath(locale, path);
}

async function getContent(): Promise<LocaleContent | null> {
  const locale = await getLocale();
  return locale === "en" ? null : content[locale]();
}

/** Project with its text fields in the current language (falls back to English). */
function translate(p: Project, c: LocaleContent | null): Project {
  const t = c?.projects[p.slug];
  if (!t) return p;
  return { ...p, ...t };
}

export async function getLocalizedProjects() {
  const c = await getContent();
  return getProjects().map((p) => translate(p, c));
}

export async function getLocalizedProject(slug: string) {
  const p = getProject(slug);
  return p ? translate(p, await getContent()) : undefined;
}

export async function getLocalizedProfile() {
  const c = await getContent();
  const t = c?.profile;
  return {
    expertise: expertise.map((e, i) => ({ ...e, ...(t?.expertise[i] ?? {}) })),
    aiDomains: aiDomains.map((d, i) => ({ ...d, ...(t?.aiDomains[i] ?? {}) })),
    process: process.map((s, i) => ({ ...s, ...(t?.process[i] ?? {}) })),
    journey: journey.map((j, i) => ({ ...j, ...(t?.journey[i] ?? {}) })),
    technologies: technologies.map((g) => ({
      ...g,
      name: t?.techGroups[g.name] ?? g.name,
      key: g.name,
      items: g.items.map((item) => t?.techItems[item] ?? item),
    })),
  };
}
