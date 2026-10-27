import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Reveal } from "@/components/motion/Reveal";
import { DeviceShowcase } from "@/components/projects/DeviceShowcase";
import { PhoneFrame } from "@/components/projects/DeviceFrames";
import { ProjectStatusLink } from "@/components/projects/ProjectCard";
import { ProjectImage } from "@/components/projects/ProjectImage";
import { ScrollPreview } from "@/components/projects/ScrollPreview";
import { TechnologyList } from "@/components/projects/TechnologyList";
import { AiBadge } from "@/components/ui/AiBadge";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Plus } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { Placeholder } from "@/components/ui/Placeholder";
import { coverOf, displayHost, getNextProject, getProjects, statusOf, type Project } from "@/content/projects";
import { site } from "@/content/site";
import { localeMeta, localePath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { alternatesFor } from "@/i18n/seo";
import { getLocale, getLocalizedProject, getMessages } from "@/i18n/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getLocalizedProject(slug);
  if (!project) return {};
  const lang = await getLocale();
  const { meta } = await getMessages();
  const description = project.summary ?? `${project.title} — ${meta.caseStudyBy} ${site.name} (${site.founder}).`;
  return {
    title: project.title,
    description,
    alternates: alternatesFor(`/projects/${slug}`, lang),
    openGraph: { type: "article", url: localePath(lang, `/projects/${slug}`), title: project.title, description },
    twitter: { title: project.title, description },
  };
}

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await params;
  const project = await getLocalizedProject(slug);
  if (!project) notFound();
  const lang = await getLocale();
  const m = await getMessages();
  const t = m.caseStudy;
  const s = t.sections;
  const nextBase = getNextProject(slug);
  const next = nextBase && (await getLocalizedProject(nextBase.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          url: `${site.url}${localePath(lang, `/projects/${project.slug}`)}`,
          inLanguage: localeMeta[lang].intl,
          ...(project.summary ? { description: project.summary } : {}),
          ...(project.year ? { dateCreated: project.year } : {}),
          ...(project.category ? { genre: project.category } : {}),
          creator: { "@type": "ProfessionalService", "@id": `${site.url}/#organization`, name: site.name, url: site.url },
          author: { "@type": "Person", "@id": `${site.url}/about#founder`, name: site.founder },
          ...(project.technologies.length ? { keywords: project.technologies.join(", ") } : {}),
        }}
      />

      {/* Hero */}
      <header className="shell pb-14 pt-32 md:pb-20 md:pt-44">
        <div className="fade-in flex flex-wrap items-center justify-between gap-4" style={i(0)}>
          <Link href={localePath(lang, "/projects")} className="group inline-flex items-center gap-2 text-sm text-muted hover:text-bone">
            <ArrowLeft size={15} className="transition-transform duration-500 group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1" />
            <span className="link-underline">{t.allWork}</span>
          </Link>
          <p className="t-label flex flex-wrap items-center gap-3 text-muted">
            {project.ai && <AiBadge label={m.common.aiProject} />}
            {project.category ?? <Placeholder>Category</Placeholder>}
            <span aria-hidden>·</span>
            {project.year ?? <Placeholder>Year</Placeholder>}
          </p>
        </div>

        <h1 className="t-h1 mt-12 [overflow-wrap:anywhere] md:mt-16 lg:text-[9.5rem]">
          <span className="line-mask">
            <span style={i(1)}>{project.title}</span>
          </span>
        </h1>

        <div className="grid-editorial mt-10 gap-y-10 border-t border-line pt-8 md:mt-14">
          <div className="fade-in t-lead col-span-4 text-muted md:col-span-5 lg:col-span-6" style={i(2)}>
            {project.summary ?? <Placeholder>Add a short project description</Placeholder>}
          </div>
          <dl className="fade-in col-span-4 grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-3 lg:col-span-5 lg:col-start-8" style={i(3)}>
            <Meta label={t.role}>
              {project.role?.length ? project.role.join(lang === "fa" || lang === "ar" ? "، " : ", ") : <Placeholder>Role</Placeholder>}
            </Meta>
            <Meta label={t.year}>{project.year ?? <Placeholder>Year</Placeholder>}</Meta>
            <Meta label={t.category}>{project.category ?? <Placeholder>Category</Placeholder>}</Meta>
            <Meta label={statusOf(project) === "live" ? m.common.live : t.status}>
              <ProjectStatusLink project={project} />
            </Meta>
          </dl>
        </div>
      </header>

      {/* Main visual: device composition when screens exist, otherwise the cover */}
      <div className="shell">
        {project.screens ? (
          <DeviceShowcase screens={project.screens} priority />
        ) : project.appScreens?.length ? (
          <AppShowcase screens={project.appScreens.slice(0, 3)} />
        ) : (
        <Reveal variant="scale">
          <ProjectImage
            image={coverOf(project)}
            title={project.title}
            slug={project.slug}
            priority
            parallax
            hoverZoom={false}
            sizes="(min-width: 1600px) 1500px, 100vw"
            aspect="aspect-[4/3] md:aspect-[16/9]"
          />
        </Reveal>
        )}
      </div>

      {/* Case study */}
      <article className="shell py-24 md:py-36">
        <CaseSection index="01" label={s.overview}>
          {project.overview ?? <Placeholder>{"What the project is and who it's for"}</Placeholder>}
        </CaseSection>
        <CaseSection index="02" label={s.features}>
          {project.features.length ? (
            <ul className="grid gap-x-10 gap-y-4 text-[1.05rem] leading-snug md:grid-cols-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Plus size={16} className="mt-[0.2em] shrink-0 text-ember" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder>Key features of the product</Placeholder>
          )}
        </CaseSection>
        <CaseSection index="03" label={s.role}>
          {project.role?.length ? (
            <ul className="space-y-1">
              {project.role.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            <Placeholder>What Reza actually did on this project</Placeholder>
          )}
        </CaseSection>
        <CaseSection index="04" label={s.challenge}>
          {project.challenge ?? <Placeholder>The problem that needed solving</Placeholder>}
        </CaseSection>
        <CaseSection index="05" label={s.solution}>
          {project.solution ?? <Placeholder>How it was approached and built</Placeholder>}
        </CaseSection>
        <CaseSection index="06" label={s.technologies}>
          <TechnologyList items={project.technologies} emptyLabel="Technologies used in this project" />
        </CaseSection>
      </article>

      <Gallery project={project} t={t} lang={lang} />

      {/* Links — only for live projects or when a link exists */}
      {(statusOf(project) === "live" || project.links.github || project.links.other?.length) && (
      <section aria-labelledby="links-title" className="shell py-20 md:py-28">
        <div className="grid-editorial gap-y-8 border-t border-line pt-6">
          <h2 id="links-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(07)</span> {s.links}
          </h2>
          <div className="col-span-4 flex flex-wrap items-center gap-4 md:col-span-6 lg:col-span-9">
            {project.links.live ? (
              <ButtonLink href={project.links.live} srSuffix={`— ${project.title}`}>
                {t.visitLive}
              </ButtonLink>
            ) : (
              <Placeholder>Live project URL</Placeholder>
            )}
            {project.links.github ? (
              <ButtonLink href={project.links.github} variant="ghost" srSuffix={`— ${project.title} source code`}>
                GitHub
              </ButtonLink>
            ) : (
              <Placeholder>GitHub URL, if public</Placeholder>
            )}
            {project.links.other?.map((l) => (
              <ButtonLink key={l.href} href={l.href} variant="ghost">
                {l.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </section>
      )}

      {next && next.slug !== project.slug && <NextProject project={next} t={t} lang={lang} />}

      <ClosingCTA />
    </>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="t-label text-muted">{label}</dt>
      <dd className="mt-2 text-bone">{children}</dd>
    </div>
  );
}

function CaseSection({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="grid-editorial gap-y-5 border-t border-line py-10 md:py-14">
      <h2 className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
        <span className="text-ember">({index})</span> {label}
      </h2>
      <div className="t-lead col-span-4 max-w-3xl text-bone/90 md:col-span-6 lg:col-span-8">{children}</div>
    </Reveal>
  );
}

/** Three phone screens side by side, the middle one raised — the app equivalent of the device composition. */
function AppShowcase({ screens }: { screens: NonNullable<Project["appScreens"]> }) {
  return (
    <Reveal variant="scale">
      <div className="relative overflow-hidden rounded-[2px] bg-ink-2 px-[6%] pb-0 pt-[6%] ring-1 ring-line">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(242_160_91/0.12),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-3 items-start gap-[4%]">
          {screens.map((s, n) => (
            <PhoneFrame
              key={s.src}
              image={s}
              priority={n === 1}
              sizes="(min-width: 1024px) 22vw, 30vw"
              className={n === 1 ? "-mb-[6%]" : "mt-[12%] -mb-[18%]"}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Gallery({ project, t, lang }: { project: Project; t: Messages["caseStudy"]; lang: Locale }) {
  const { screens, gallery } = project;
  const appScreens = project.appScreens ?? [];
  const host = project.links.live ? displayHost(project.links.live) : localePath(lang, `/projects/${project.slug}`);

  return (
    <section aria-labelledby="gallery-title" className="shell">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
        <h2 id="gallery-title" className="t-label flex gap-3 text-muted">
          <span className="text-ember">(—)</span> {t.sections.screens}
        </h2>
        {!screens && gallery.length === 0 && appScreens.length === 0 && (
          <Placeholder>{`Add images to /public/projects/${project.slug}/`}</Placeholder>
        )}
      </div>

      {appScreens.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
          {appScreens.map((shot) => (
            <Reveal key={shot.src} variant="scale">
              <PhoneFrame image={shot} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw" />
              <p className="mt-4 text-center font-mono text-[0.68rem] text-muted">{shot.alt.replace(`${project.title} `, "")}</p>
            </Reveal>
          ))}
        </div>
      )}

      {screens && (
        <div className="mt-10 grid items-start gap-10 md:grid-cols-12 md:gap-8">
          {screens.fullPage && (
            <Reveal variant="scale" className="md:col-span-8">
              <ScrollPreview image={screens.fullPage} host={host} t={t} />
            </Reveal>
          )}
          <Reveal
            variant="scale"
            className={screens.fullPage ? "mx-auto w-[62%] md:col-span-4 md:w-[78%]" : "mx-auto w-[40%] md:col-span-4"}
          >
            <PhoneFrame image={screens.mobile} sizes="(min-width: 768px) 25vw, 60vw" />
            <p className="mt-5 text-center font-mono text-[0.68rem] text-muted">{t.mobile} · 393 × 852</p>
          </Reveal>
        </div>
      )}

      {gallery.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-12 md:gap-8">
          {gallery.map((shot, n) => (
            <Reveal
              key={shot.src}
              variant="scale"
              className={n % 3 === 0 ? "md:col-span-7" : n % 3 === 1 ? "md:col-span-5 md:mt-24" : "md:col-span-12"}
            >
              <ProjectImage image={shot} title={project.title} slug={project.slug} parallax hoverZoom={false} sizes="(min-width: 768px) 55vw, 100vw" />
            </Reveal>
          ))}
        </div>
      )}

      {!screens && gallery.length === 0 && appScreens.length === 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-12 md:gap-8">
          {[0, 1].map((n) => (
            <div key={n} className={n === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"}>
              <ProjectImage title={`${project.title} · 0${n + 1}`} slug={project.slug} hoverZoom={false} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function NextProject({ project, t, lang }: { project: Project; t: Messages["caseStudy"]; lang: Locale }) {
  return (
    <section aria-label={t.nextProject} className="shell">
      <Link
        href={localePath(lang, `/projects/${project.slug}`)}
        data-cursor="view"
        data-cursor-label={t.nextProject}
        className="group grid-editorial relative items-end gap-y-8 overflow-hidden border-y border-line py-14 md:py-20"
      >
        <div className="col-span-4 md:col-span-5 lg:col-span-7">
          <p className="t-label text-muted">
            <span className="text-ember">{t.nextProject}</span>
          </p>
          <p className="t-h1 mt-6 transition-colors duration-500 group-hover:text-ember">{project.title}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-muted group-hover:text-bone">
            <span>{t.viewCaseStudy}</span>
            <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5" />
          </span>
        </div>
        <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-9">
          <div className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2">
            <ProjectImage image={coverOf(project)} title={project.title} slug={project.slug} sizes="(min-width: 1024px) 30vw, 100vw" />
          </div>
        </div>
      </Link>
    </section>
  );
}
