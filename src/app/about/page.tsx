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
import { SectionHeading, accent } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reza Alami — software engineer by training, AI specialist and web & app developer by practice, with professional digital-marketing training under Meta. Working independently on AI, software, web and smart home projects.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", type: "profile" },
};

const chapters = [
  {
    index: "01",
    kicker: "Foundation",
    title: "Software Engineering",
    body: [
      "My academic background is in software engineering. It shapes how I approach every project: understand the problem first, give it a clear structure, then build.",
      "Around a year of additional professional training in Germany extended that foundation with hands-on software development practice.",
    ],
  },
  {
    index: "02",
    kicker: "Practice",
    title: "Web & App Development",
    body: [
      "Web development is my day-to-day focus. I've worked professionally as a web developer — building websites, web applications and app interfaces that need to be fast, responsive and easy to maintain.",
    ],
  },
  {
    index: "03",
    kicker: "Intelligence",
    title: "Artificial Intelligence",
    ai: true,
    body: [
      "We're living in the age of AI, and it's part of how I work professionally — across the whole lifecycle, from design and development to marketing.",
      "That includes AI-driven website and app design and smart home technology: products where intelligence and automation make everyday use simpler.",
    ],
  },
  {
    index: "04",
    kicker: "Perspective",
    title: "Digital Marketing",
    body: [
      "Six months of professional digital-marketing training under Meta, through an educational scholarship, added the other side of the screen: how people find, judge and act on what they see online.",
      "In practice it means thinking about audience, content, SEO and conversion while building — not after launch.",
    ],
  },
  {
    index: "05",
    kicker: "Independence",
    title: "Independent projects",
    body: [
      "Today I work independently on AI, software, web and smart home projects, taking them from a first idea to a working product — and combining every discipline along the way.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            "@id": `${site.url}/about#founder`,
            name: site.founder,
            url: `${site.url}/about`,
            jobTitle: [...site.roles],
            worksFor: { "@type": "ProfessionalService", "@id": `${site.url}/#organization`, name: site.name },
            knowsAbout: ["Artificial Intelligence", "Software Engineering", "Web Development", "App Design", "Digital Marketing"],
          },
        }}
      />

      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">(About)</span>
            <span>{site.founder}</span>
          </>
        }
        lines={[
          <>
            Engineer by <span className="serif-accent font-normal">training.</span>
          </>,
          <>
            Developer by <span className="serif-accent font-normal">practice.</span>
          </>,
          <>
            AI-driven by <span className="ai-gradient-text serif-accent font-normal">design.</span>
          </>,
          <>
            Marketer by <span className="serif-accent font-normal text-ember">perspective.</span>
          </>,
        ]}
      />

      <section aria-label="Introduction" className="shell pb-24 md:pb-36">
        <div className="grid-editorial gap-y-10 border-t border-line pt-6">
          <p className="t-label col-span-4 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(—)</span> In short
          </p>
          <div className="col-span-4 md:col-span-6 lg:col-span-9">
            <ScrollText
              className="text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.03em]"
              text="Software engineering is the foundation. AI is the multiplier — across design, development, marketing and smart home technology. Web and app development is where I work every day. Digital marketing keeps the work pointed at real people and real results."
            />
          </div>
        </div>
      </section>

      {/* Story chapters */}
      <section aria-labelledby="story-title" className="shell pb-16 md:pb-24">
        <SectionHeading id="story-title" index="01" label="The story" title={["How the pieces", accent("fit together.")]} />
        <div className="mt-16 md:mt-24">
          {chapters.map((c) => (
            <Reveal as="article" key={c.index} className="group grid-editorial gap-y-5 border-t border-line py-12 md:py-16">
              <p className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
                <span className="text-ember">{c.index}</span> {c.kicker}
              </p>
              <div className="col-span-4 md:col-span-6 lg:col-span-4">
                <h3 className="t-h3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                  {c.title}
                </h3>
                {"ai" in c && c.ai && <AiBadge label="Core focus" className="mt-4" />}
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
        <SectionHeading id="journey-title" index="02" label="Journey" title={["The path", accent("so far.")]} />
        <div className="mt-16 md:mt-24">
          <Timeline />
        </div>
      </section>

      {/* Details still to add */}
      <section aria-labelledby="details-title" className="shell pb-16">
        <div className="grid-editorial gap-y-8 border-t border-line pt-6">
          <h2 id="details-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(03)</span> Details
          </h2>
          <dl className="col-span-4 grid gap-8 sm:grid-cols-3 md:col-span-6 lg:col-span-9">
            <div>
              <dt className="t-label text-muted">Based in</dt>
              <dd className="mt-3 text-lg">{site.location ?? <Placeholder>Location</Placeholder>}</dd>
            </div>
            <div>
              <dt className="t-label text-muted">Languages</dt>
              <dd className="mt-3 text-lg">
                {site.languages?.join(", ") ?? <Placeholder>Languages</Placeholder>}
              </dd>
            </div>
            <div>
              <dt className="t-label text-muted">CV</dt>
              <dd className="mt-3 text-lg">
                {site.cv ? <ArrowLink href={site.cv}>Download CV</ArrowLink> : <Placeholder>CV file</Placeholder>}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <ClosingCTA title="Let's build something" accentLine="intelligent — and found." />
    </>
  );
}
