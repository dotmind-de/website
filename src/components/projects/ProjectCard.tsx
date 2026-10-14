import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { AiBadge } from "@/components/ui/AiBadge";
import { ArrowLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { coverOf, displayHost, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { PhoneFrame } from "./DeviceFrames";
import { ProjectImage } from "./ProjectImage";
import { TechnologyList } from "./TechnologyList";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Project entry. The screenshot and title both lead to the case study;
 * the live site is a separate, visibly external link (↗).
 */
export function ProjectCard({
  project,
  index,
  total,
  layout = "feature",
  flip = false,
  priority,
}: {
  project: Project;
  index: number;
  total: number;
  /** "feature" = asymmetric wide row (home) · "archive" = stacked column card (/projects) */
  layout?: "feature" | "archive";
  flip?: boolean;
  priority?: boolean;
}) {
  const href = `/projects/${project.slug}`;
  const feature = layout === "feature";

  return (
    <article
      className={cn(
        "group/card",
        feature && "grid-editorial items-end gap-y-8",
      )}
      aria-labelledby={`project-${project.slug}`}
    >
      {/* Screenshot — duplicate link, hidden from AT/tab order (title link is the accessible one) */}
      <Reveal
        variant="scale"
        className={cn(
          feature && "col-span-4 md:col-span-8 lg:col-span-7",
          feature && flip && "lg:order-2 lg:col-start-6",
        )}
      >
        <Link href={href} tabIndex={-1} aria-hidden data-cursor="view" data-cursor-label="View" className="group relative block">
          <ProjectImage
            image={coverOf(project)}
            title={project.title}
            slug={project.slug}
            parallax
            priority={priority}
            sizes={feature ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
          />
          {/* Mobile view peeking over the corner — shows the responsive build at a glance */}
          {project.screens && (
            <PhoneFrame
              image={project.screens.mobile}
              sizes="160px"
              className={cn(
                "absolute -bottom-[8%] w-[17%] min-w-[64px] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2",
                flip ? "-left-[3%]" : "-right-[3%]",
              )}
            />
          )}
        </Link>
      </Reveal>

      <Reveal
        delay={0.1}
        className={cn(
          feature ? "col-span-4 md:col-span-6 lg:col-span-5" : "mt-6",
          feature && !flip && "lg:col-start-8",
          feature && flip && "lg:order-1 lg:col-start-1",
        )}
      >
        <p className="t-label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
          <span className="text-ember">
            {pad(index + 1)} / {pad(total)}
          </span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          {project.ai && <AiBadge />}
          {project.category ?? <Placeholder>Category</Placeholder>}
          <span aria-hidden>·</span>
          {project.year ?? <Placeholder>Year</Placeholder>}
        </p>

        <h3 id={`project-${project.slug}`} className={cn("mt-4", feature ? "t-h2" : "t-h3")}>
          <Link href={href} className="transition-colors duration-300 hover:text-ember focus-visible:text-ember">
            {project.title}
          </Link>
        </h3>

        <div className="mt-4 max-w-md text-muted">
          {project.summary ?? <Placeholder>Add a one-to-two sentence summary</Placeholder>}
        </div>

        <TechnologyList items={project.technologies} className="mt-5" />

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ArrowLink href={href} srSuffix={`— ${project.title} case study`}>
            View project
          </ArrowLink>
          <LiveLink url={project.links.live} title={project.title} />
        </div>
      </Reveal>
    </article>
  );
}

/** External live-site link, visually distinct from internal navigation. */
export function LiveLink({ url, title }: { url: string | null; title: string }) {
  if (!url) return <Placeholder>Live URL</Placeholder>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 font-mono text-[0.72rem] text-muted transition-colors hover:border-ember/60 hover:text-bone"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
      Live · {displayHost(url)}
      <ArrowUpRight size={13} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <span className="sr-only">— visit {title} live site (opens in a new tab)</span>
    </a>
  );
}
