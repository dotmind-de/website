import { getProject, getProjects } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOg({
    eyebrow: project?.category ?? "Case study",
    title: project?.title ?? "Project",
    footer: project?.technologies.slice(0, 4).join(" · ") || "Case study",
  });
}
