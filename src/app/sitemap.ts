import type { MetadataRoute } from "next";
import { getProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const projects = getProjects().map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...pages, ...projects];
}
