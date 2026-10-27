import type { MetadataRoute } from "next";
import { getProjects } from "@/content/projects";
import { site } from "@/content/site";
import { localePath, locales } from "@/i18n/config";

/** One entry per language and page, each listing every language version. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...["/", "/projects", "/about", "/contact"].map((path) => ({ path, priority: path === "/" ? 1 : 0.8, changeFrequency: "monthly" as const })),
    ...getProjects().map((p) => ({ path: `/projects/${p.slug}`, priority: 0.7, changeFrequency: "yearly" as const })),
  ];
  const url = (l: (typeof locales)[number], path: string) => `${site.url}${localePath(l, path)}`.replace(/\/$/, "") || site.url;
  return paths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((l) => ({
      url: url(l, path),
      changeFrequency,
      priority: l === "de" ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: { languages: { ...Object.fromEntries(locales.map((x) => [x, url(x, path)])), "x-default": url("en", path) } },
    })),
  );
}
