import type { Metadata } from "next";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects } from "@/content/projects";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects by dotMind (Reza Alami) — Power Bowls, Foodigastro24 and Rundumdienst — with desktop, laptop and mobile screenshots, the technologies used and links to the live sites.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">(Work)</span>
            <span>Archive · {String(projects.length).padStart(2, "0")} projects</span>
          </>
        }
        lines={[
          "Selected",
          <>
            <span className="serif-accent font-normal">projects</span> &amp; builds.
          </>,
        ]}
        intro="Each project links to its own case study. Where a live version exists, it's marked separately with ↗."
      />

      <section aria-label="All projects" className="shell pb-20 md:pb-32">
        <div className="grid gap-x-6 gap-y-24 border-t border-line pt-12 md:grid-cols-2 md:gap-y-32 lg:gap-x-12">
          {projects.map((project, n) => (
            <div key={project.slug} className={cn("pb-[8%]", n % 2 === 1 && "md:mt-48")}>
              <ProjectCard project={project} index={n} total={projects.length} layout="archive" priority={n < 2} />
            </div>
          ))}
        </div>
      </section>

      <ClosingCTA title="Something similar in mind?" accentLine="Let's talk it through." />
    </>
  );
}
