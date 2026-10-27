/**
 * Languages of the site. German is the default and lives at the root (`/projects`);
 * every other language is prefixed (`/en/projects`, `/fa/projects`). `src/proxy.ts`
 * rewrites unprefixed URLs to the German routes under `app/[lang]`.
 */
export const locales = ["de", "en", "tr", "fa", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const localeMeta: Record<
  Locale,
  { native: string; short: string; dir: "ltr" | "rtl"; og: string; intl: string }
> = {
  de: { native: "Deutsch", short: "DE", dir: "ltr", og: "de_DE", intl: "de-DE" },
  en: { native: "English", short: "EN", dir: "ltr", og: "en_GB", intl: "en-GB" },
  tr: { native: "Türkçe", short: "TR", dir: "ltr", og: "tr_TR", intl: "tr-TR" },
  fa: { native: "فارسی", short: "FA", dir: "rtl", og: "fa_IR", intl: "fa-IR" },
  ar: { native: "العربية", short: "AR", dir: "rtl", og: "ar_AR", intl: "ar" },
};

export const isLocale = (value: string | undefined): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

/** "/projects" → "/projects" (de) or "/en/projects". Keeps hashes and queries. */
export function localePath(locale: Locale, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Removes a locale prefix: "/fa/projects" → "/projects". */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return `/${rest.join("/")}`.replace(/\/$/, "") || "/";
  return pathname || "/";
}
