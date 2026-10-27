import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toSegments } from "@/i18n/segments";
import { getHref, getLocalizedProjects, getMessages } from "@/i18n/server";

export async function SelectedWork() {
  const { work: t } = await getMessages();
  const href = await getHref();
  const projects = await getLocalizedProjects();
  const featured = projects.filter((p) => p.featured);
  const total = projects.length;

  return (
    <section id="work" aria-labelledby="work-title" className="shell scroll-mt-20 py-28 md:py-40">
      <SectionHeading
        id="work-title"
        index="04"
        label={t.label}
        title={toSegments(t.title)}
        aside={<ArrowLink href={href("/projects")}>{`${t.allProjects} (${total})`}</ArrowLink>}
      />

      <div className="mt-20 space-y-28 md:mt-28 md:space-y-44">
        {featured.map((project, n) => (
          <ProjectCard key={project.slug} project={project} index={n} total={featured.length} flip={n % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
