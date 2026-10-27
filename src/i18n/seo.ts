import { defaultLocale, locales, localePath } from "./config";

/**
 * Canonical + hreflang alternates for a path that exists in every language.
 * `path` is the language-neutral path, e.g. "/projects".
 */
export function alternatesFor(path: string, current: (typeof locales)[number] = defaultLocale) {
  return {
    canonical: localePath(current, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  };
}
