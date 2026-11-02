import type { Metadata } from "next";
import { Magnetic } from "@/components/motion/Magnetic";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/content/site";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { localePath } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { rich, toSegments } from "@/i18n/segments";
import { getLocale, getMessages } from "@/i18n/server";
import { ContactForm } from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { meta } = await getMessages();
  return {
    title: meta.contactTitle,
    description: meta.contactDescription,
    alternates: alternatesFor("/contact", lang),
    openGraph: { url: localePath(lang, "/contact") },
  };
}

export default async function ContactPage() {
  const lang = await getLocale();
  const m = await getMessages();
  const t = m.contact;
  const channels = [
    { label: t.email, value: site.email, href: site.email ? `mailto:${site.email}` : null },
    { label: t.phone, value: site.phone?.display ?? null, href: site.phone?.href ?? null },
    { label: t.whatsapp, value: site.whatsapp ? site.phone?.display ?? t.chatOnWhatsApp : null, href: site.whatsapp },
    ...site.socials.map((s) => ({ label: s.label, value: s.href?.replace(/^https?:\/\/(www\.)?/, "") ?? null, href: s.href })),
  ];

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className="text-ember">({t.label})</span>
            <span>{t.eyebrow}</span>
          </>
        }
        lines={[t.lines[0], <>{rich(t.lines.slice(1), "serif-accent font-normal text-ember")}</>]}
        intro={t.intro}
      >
        <div className="fade-in mt-12 flex flex-wrap items-center gap-4" style={{ "--i": 5 } as React.CSSProperties}>
          <Magnetic>
            <ButtonLink href="#inquiry">{t.start}</ButtonLink>
          </Magnetic>
          <a href="#channels" className="link-underline text-sm text-muted hover:text-bone">
            {t.orDirect}
          </a>
        </div>
      </PageHeader>

      {/* Inquiry form */}
      <section id="inquiry" aria-labelledby="inquiry-title" className="shell scroll-mt-24 pb-24 md:pb-36">
        <SectionHeading id="inquiry-title" index="01" label={t.formLabel} title={toSegments(t.formTitle)} aside={t.formAside} />
        <div className="mt-14 md:mt-20 lg:ms-[25%]">
          <ContactForm lang={lang} t={t} privacyLabel={m.legal.privacy} />
        </div>
      </section>

      {/* Channels */}
      <section id="channels" aria-labelledby="channels-title" className="shell scroll-mt-24 pb-24 md:pb-36">
        <h2 id="channels-title" className="t-label border-t border-line pt-6 text-muted">
          <span className="text-ember">(02)</span> {t.channels}
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
                    className="text-muted transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember rtl:-scale-x-100"
                  />
                  {c.href.startsWith("http") && <span className="sr-only">({m.common.opensNewTab})</span>}
                </a>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4 py-7 md:py-9">
                  <span className="t-label w-32 text-muted">{c.label}</span>
                  <span className="flex-1">
                    <Placeholder>{c.label}</Placeholder>
                  </span>
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
        {site.whatsapp && (
          <p className="mt-6 max-w-[60ch] text-sm text-muted">
            {t.whatsappNote}
          </p>
        )}
        <p className="t-label mt-10 text-muted">
          {t.basedIn} {m.common.location} · {t.workingAcross}
        </p>
      </section>

    </>
  );
}
