import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Instrument_Serif,
  Markazi_Text,
  Parastoo,
  Vazirmatn,
} from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Providers } from "@/components/motion/Providers";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { site } from "@/content/site";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { getMessages } from "@/i18n/server";
import "../globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});
// Script fonts load only on the pages that use them (class applied per language).
const vazirmatn = Vazirmatn({ variable: "--font-script", subsets: ["arabic"], display: "swap", preload: false });
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-script",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});
// Naskh accents take the role Instrument Serif has in Latin: Parastoo (by Vazirmatn's designer, drawn
// for Persian) for fa, Markazi Text (editorial Arabic) for ar.
const parastoo = Parastoo({ variable: "--font-script-serif", subsets: ["arabic"], display: "swap", preload: false });
const markazi = Markazi_Text({ variable: "--font-script-serif", subsets: ["arabic"], display: "swap", preload: false });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = await getMessages();
  return {
    metadataBase: new URL(site.url),
    title: { default: m.meta.title, template: `%s — ${site.name}` },
    description: m.meta.description,
    applicationName: site.name,
    authors: [{ name: site.founder }],
    creator: site.founder,
    publisher: site.name,
    icons: { icon: "/brand/dotmind-mark-dark.svg" },
    alternates: alternatesFor("/", lang),
    openGraph: {
      type: "website",
      locale: localeMeta[lang].og,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeMeta[l].og),
      siteName: site.name,
      title: m.meta.title,
      description: m.meta.description,
    },
    twitter: { card: "summary_large_image", title: m.meta.title, description: m.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const m = await getMessages();
  const { dir } = localeMeta[lang];
  const script =
    lang === "fa"
      ? `${vazirmatn.variable} ${parastoo.variable}`
      : lang === "ar"
        ? `${plexArabic.variable} ${markazi.variable}`
        : "";

  return (
    <html
      lang={lang}
      dir={dir}
      id="top"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${script} antialiased`}
    >
      <head>
        {/* Without JS, scroll-reveal content would stay at its hidden initial state. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-4 z-[110] -translate-y-24 rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink transition-transform focus-visible:translate-y-0"
        >
          {m.nav.skip}
        </a>
        <Providers>
          <ScrollProgress />
          <Navigation
            lang={lang}
            t={m.nav}
            languages={locales.map((l) => ({ code: l, native: localeMeta[l].native, short: localeMeta[l].short }))}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CustomCursor />
        </Providers>
        {/* Fine editorial column guides (decorative, behind content) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="shell h-full">
            <div className="relative h-full">
              {["0%", "25%", "50%", "75%", "100%"].map((left, n) => (
                <span
                  key={left}
                  className={`absolute inset-y-0 w-px bg-line/50 ${n % 2 === 1 ? "hidden md:block" : ""}`}
                  style={{ left }}
                />
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
