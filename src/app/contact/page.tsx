import type { Metadata } from "next";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { mailto, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with dotMind by Reza Alami — websites, web apps, AI solutions and digital marketing.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

const brief = [
  { title: "What you're building", text: "An AI feature, a website or app, a smart home setup, a rebuild — a few sentences are enough." },
  { title: "Where it stands", text: "Just an idea, a design, an existing site or a half-finished build." },
  { title: "Timing", text: "Any deadline or launch window I should know about." },
  { title: "Links", text: "Current site, references, or anything that shows the direction." },
];

export default function ContactPage() {
  const mail = mailto("New project");
  const channels = [
    { label: "Email", value: site.email, href: site.email ? `mailto:${site.email}` : null },
    { label: "Phone", value: site.phone?.display ?? null, href: site.phone?.href ?? null },
    { label: "WhatsApp", value: site.whatsapp ? site.phone?.display ?? "Chat on WhatsApp" : null, href: site.whatsapp },
    ...site.socials.map((s) => ({ label: s.label, value: s.href?.replace(/^https?:\/\/(www\.)?/, "") ?? null, href: s.href })),
  ];

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">(Contact)</span>
            <span>Currently working independently</span>
          </>
        }
        lines={[
          "Start a",
          <>
            <span className="serif-accent font-normal text-ember">project.</span>
          </>,
        ]}
        intro="Tell me what you're working on — an AI-powered product, a website or app, a smart home idea, or something that needs rebuilding. A short message is enough to start the conversation."
      >
        <div className="fade-in mt-12 flex flex-wrap items-center gap-4" style={{ "--i": 5 } as React.CSSProperties}>
          <Magnetic>
            <ButtonLink href={mail ?? "#channels"}>Start a Project</ButtonLink>
          </Magnetic>
          {!mail && <Placeholder>Add email in src/content/site.ts to activate</Placeholder>}
        </div>
      </PageHeader>

      {/* Channels */}
      <section id="channels" aria-labelledby="channels-title" className="shell scroll-mt-24 pb-24 md:pb-36">
        <h2 id="channels-title" className="t-label border-t border-line pt-6 text-muted">
          <span className="text-ember">(01)</span> Channels
        </h2>
        <Stagger as="ul" className="mt-8">
          {channels.map((c) => (
            <StaggerItem as="li" key={c.label} className="border-b border-line">
              {c.href ? (
                <a
                  href={c.href}
                  {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex flex-wrap items-center justify-between gap-4 py-7 md:py-9"
                >
                  <span className="t-label w-32 text-muted">{c.label}</span>
                  <span className="t-h3 flex-1 transition-colors duration-300 group-hover:text-ember">{c.value}</span>
                  <ArrowUpRight
                    size={28}
                    className="text-muted transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember"
                  />
                  {c.href.startsWith("http") && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4 py-7 md:py-9">
                  <span className="t-label w-32 text-muted">{c.label}</span>
                  <span className="flex-1">
                    <Placeholder>{`${c.label} ${c.label === "Email" ? "address" : "URL"}`}</Placeholder>
                  </span>
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
        {site.whatsapp && (
          <p className="mt-6 max-w-[60ch] text-sm text-muted">
            WhatsApp is operated by Meta, and Meta&apos;s privacy policy applies to messages sent there. Please don&apos;t share
            sensitive data via WhatsApp — email or phone work just as well.
          </p>
        )}
        {site.location && <p className="t-label mt-10 text-muted">Based in {site.location} · working across Germany, Austria and Switzerland</p>}
      </section>

      {/* What to include */}
      <section aria-labelledby="brief-title" className="shell pb-28 md:pb-40">
        <div className="grid-editorial gap-y-10 border-t border-line pt-6">
          <h2 id="brief-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
            <span className="text-ember">(02)</span> A good first message
          </h2>
          <ol className="col-span-4 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:col-span-6 lg:col-span-9">
            {brief.map((b, n) => (
              <Reveal as="li" key={b.title} delay={n * 0.06}>
                <p className="font-mono text-xs text-ember">0{n + 1}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">{b.title}</h3>
                <p className="mt-2 text-muted">{b.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
