import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { projectFilters, type ProjectFilterKey } from "@/content/projects";
import { localePath } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { rich } from "@/i18n/segments";
import { getLocale, getLocalizedProjects, getMessages } from "@/i18n/server";
import { cn } from "@/lib/cn";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { meta } = await getMessages();
  return {
    title: meta.workTitle,
    description: meta.workDescription,
    alternates: alternatesFor("/projects", lang),
    openGraph: { url: localePath(lang, "/projects") },
  };
}

export default async function ProjectsPage({ searchParams }: PageProps<"/[lang]/projects">) {
  const { filter } = await searchParams;
  const lang = await getLocale();
  const m = await getMessages();
  const t = m.work_page;
  const all = await getLocalizedProjects();
  const active = projectFilters.find((f) => f.key === filter) ?? projectFilters[0];
  const projects = all.filter(active.test);

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">({t.label})</span>
            <span>
              {t.archive} · {String(all.length).padStart(2, "0")} {t.projects}
            </span>
          </>
        }
        lines={[t.lines[0] as string, <>{rich(t.lines[1] as string[])}</>]}
        intro={t.intro}
      />

      <section aria-label={m.nav.work} className="shell pb-20 md:pb-32">
        <nav aria-label={t.filterLabel} className="flex flex-wrap gap-2 border-t border-line pt-8">
          {projectFilters.map((f) => {
            const count = all.filter(f.test).length;
            if (!count) return null;
            const isActive = f.key === active.key;
            return (
              <Link
                key={f.key}
                href={localePath(lang, "/projects") + (f.key === "all" ? "" : `?filter=${f.key as ProjectFilterKey}`)}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  isActive ? "border-bone bg-bone text-ink" : "border-line-strong text-muted hover:border-bone/50 hover:text-bone",
                )}
              >
                {t.filters[f.key]}
                <span className={cn("font-mono text-[0.7rem]", isActive ? "text-ink/60" : "text-subtle")}>{count}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-12 grid gap-x-6 gap-y-24 md:grid-cols-2 md:gap-y-32 lg:gap-x-12">
          {projects.map((project, n) => (
            <div key={project.slug} className={cn("pb-[8%]", n % 2 === 1 && "md:mt-48")}>
              <ProjectCard project={project} index={n} total={projects.length} layout="archive" priority={n < 2} />
            </div>
          ))}
        </div>
      </section>

      <ClosingCTA title={m.cta.workTitle} accentLine={m.cta.workAccent} />
    </>
  );
}
