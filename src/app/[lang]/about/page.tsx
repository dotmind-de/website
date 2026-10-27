import type { Metadata } from "next";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Timeline } from "@/components/home/Timeline";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollText } from "@/components/motion/ScrollText";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { AiBadge } from "@/components/ui/AiBadge";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { localeMeta, localePath } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { rich, toSegments } from "@/i18n/segments";
import { getLocale, getLocalizedProfile, getMessages } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { meta } = await getMessages();
  return {
    title: meta.aboutTitle,
    description: meta.aboutDescription,
    alternates: alternatesFor("/about", lang),
    openGraph: { url: localePath(lang, "/about"), type: "profile" },
  };
}

/** Accent style per headline line: AI line gets the gradient, the last one the ember tone. */
const lineAccent = ["serif-accent font-normal", "serif-accent font-normal", "ai-gradient-text serif-accent font-normal", "serif-accent font-normal text-ember"];
/** Index of the "Artificial Intelligence" chapter. */
const AI = 2;

export default async function AboutPage() {
  const lang = await getLocale();
  const m = await getMessages();
  const t = m.about;
  const { journey } = await getLocalizedProfile();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          inLanguage: localeMeta[lang].intl,
          mainEntity: {
            "@type": "Person",
            "@id": `${site.url}/about#founder`,
            name: site.founder,
            url: `${site.url}${localePath(lang, "/about")}`,
            jobTitle: [...site.roles],
            worksFor: { "@type": "ProfessionalService", "@id": `${site.url}/#organization`, name: site.name },
            sameAs: site.socials.flatMap((s) => (s.href ? [s.href] : [])),
            knowsAbout: ["Artificial Intelligence", "Software Engineering", "Web Development", "App Design", "Digital Marketing"],
          },
        }}
      />

      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">({t.label})</span>
            <span>{site.founder}</span>
          </>
        }
        lines={t.lines.map((line, n) => <>{rich(line, lineAccent[n])}</>)}
      />

      <section aria-label={t.inShort} className="shell pb-24 md:pb-36">
        <div className="grid-editorial gap-y-10 border-t border-line pt-6">
          <p className="t-label col-span-4 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(—)</span> {t.inShort}
          </p>
          <div className="col-span-4 md:col-span-6 lg:col-span-9">
            <ScrollText
              className="text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.03em]"
              text={t.summary}
            />
          </div>
        </div>
      </section>

      {/* Story chapters */}
      <section aria-labelledby="story-title" className="shell pb-16 md:pb-24">
        <SectionHeading id="story-title" index="01" label={t.storyLabel} title={toSegments(t.storyTitle)} />
        <div className="mt-16 md:mt-24">
          {t.chapters.map((c, n) => (
            <Reveal as="article" key={c.title} className="group grid-editorial gap-y-5 border-t border-line py-12 md:py-16">
              <p className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
                <span className="text-ember">0{n + 1}</span> {c.kicker}
              </p>
              <div className="col-span-4 md:col-span-6 lg:col-span-4">
                <h3 className="t-h3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                  {c.title}
                </h3>
                {n === AI && <AiBadge label={t.coreFocus} className="mt-4" />}
              </div>
              <div className="col-span-4 space-y-4 text-muted md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8">
                {c.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey-title" className="shell py-24 md:py-36">
        <SectionHeading id="journey-title" index="02" label={t.journeyLabel} title={toSegments(t.journeyTitle)} />
        <div className="mt-16 md:mt-24">
          <Timeline journey={journey} datesLabel={t.dates} />
        </div>
      </section>

      {/* Details still to add */}
      <section aria-labelledby="details-title" className="shell pb-16">
        <div className="grid-editorial gap-y-8 border-t border-line pt-6">
          <h2 id="details-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(03)</span> {t.details}
          </h2>
          <dl className="col-span-4 grid gap-8 sm:grid-cols-3 md:col-span-6 lg:col-span-9">
            <div>
              <dt className="t-label text-muted">{t.basedIn}</dt>
              <dd className="mt-3 text-lg">{m.common.location}</dd>
            </div>
            <div>
              <dt className="t-label text-muted">{t.languagesLabel}</dt>
              <dd className="mt-3 text-lg">
                {site.languages?.join(", ") ?? <Placeholder>{t.languagesLabel}</Placeholder>}
              </dd>
            </div>
            <div>
              <dt className="t-label text-muted">{t.cv}</dt>
              <dd className="mt-3 text-lg">
                {site.cv ? <ArrowLink href={site.cv}>{t.downloadCv}</ArrowLink> : <Placeholder>{t.cv}</Placeholder>}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <ClosingCTA title={m.cta.aboutTitle} accentLine={m.cta.aboutAccent} />
    </>
  );
}
