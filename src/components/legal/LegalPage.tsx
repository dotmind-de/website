import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Impressum and Datenschutz exist only in German, the binding language. Every
 * language serves the same text; the German URL is canonical and the only one indexed.
 */
export function legalMetadata(path: string, title: string, lang: Locale): Metadata {
  return {
    title,
    alternates: { canonical: path },
    openGraph: { url: path },
    robots: { index: lang === defaultLocale, follow: true },
  };
}

export function LegalPage({
  label,
  title,
  note,
  updated,
  children,
}: {
  label: string;
  title: string;
  /** Explains, in the visitor's language, that the text is German. `null` on German pages. */
  note: string | null;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader
        eyebrow={<span className="text-ember">({label})</span>}
        lines={[<span key="title" lang="de">{title}</span>]}
        intro={note}
      />
      <article lang="de" dir="ltr" className="shell pb-24 md:pb-36">
        <div className="grid-editorial border-t border-line pt-6">
          <div className="col-span-4 space-y-12 md:col-span-6 md:col-start-2 lg:col-span-7 lg:col-start-4">
            {children}
            <p className="t-label text-muted">Stand: {updated}</p>
          </div>
        </div>
      </article>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium tracking-[-0.02em] text-bone md:text-2xl">{title}</h2>
      <div className="space-y-4 leading-relaxed text-muted [&_a]:link-underline [&_a]:text-bone [&_li]:ps-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-5">
        {children}
      </div>
    </section>
  );
}
