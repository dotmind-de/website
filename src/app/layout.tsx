import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Providers } from "@/components/motion/Providers";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { site } from "@/content/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

const defaultTitle = `${site.name} by ${site.founder} — Websites, Apps & AI`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.founder,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      id="top"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
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
          className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-bone px-5 py-3 text-sm font-medium text-ink transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navigation />
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
