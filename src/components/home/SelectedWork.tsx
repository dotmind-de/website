import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading, accent } from "@/components/ui/SectionHeading";
import { getFeaturedProjects, getProjects } from "@/content/projects";

export function SelectedWork() {
  const featured = getFeaturedProjects();
  const total = getProjects().length;

  return (
    <section id="work" aria-labelledby="work-title" className="shell scroll-mt-20 py-28 md:py-40">
      <SectionHeading
        id="work-title"
        index="04"
        label="Selected work"
        title={["Real products,", accent("live"), "on every screen."]}
        aside={<ArrowLink href="/projects">{`All projects (${total})`}</ArrowLink>}
      />

      <div className="mt-20 space-y-28 md:mt-28 md:space-y-44">
        {featured.map((project, n) => (
          <ProjectCard key={project.slug} project={project} index={n} total={featured.length} flip={n % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
