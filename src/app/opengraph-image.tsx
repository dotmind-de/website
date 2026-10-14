import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${site.name} by ${site.founder} — ${site.roles.join(", ")}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const svg = await readFile(join(process.cwd(), "public/brand/dotmind-wordmark-dark.svg"));
  return renderOg({
    eyebrow: `by ${site.founder}`,
    title: site.name,
    logo: `data:image/svg+xml;base64,${svg.toString("base64")}`,
    footer: site.roles.join(" · "),
  });
}
