import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 md:pt-28">
      <div className="shell grid-editorial gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <Link href="/" aria-label={`${site.name} by ${site.founder} — home`} className="inline-block text-bone">
            <Logo title={null} className="block h-7 w-auto" />
            <span className="t-label mt-3 block text-muted">by {site.founder}</span>
          </Link>
          <p className="t-h3 mt-8 max-w-[16ch]">
            AI, software, web &amp; <span className="serif-accent">digital</span> — from idea to working product.
          </p>
        </div>

        <FooterColumn title="Navigate" className="lg:col-start-7">
          <li>
            <Link href="/" className="link-underline hover:text-bone">
              Home
            </Link>
          </li>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="link-underline hover:text-bone">
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Elsewhere">
          {site.socials.map((s) => (
            <li key={s.label}>
              {s.href ? (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 hover:text-bone"
                >
                  <span className="link-underline">{s.label}</span>
                  <ArrowUpRight size={13} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Placeholder>{`${s.label} URL`}</Placeholder>
              )}
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li>
            {site.email ? (
              <a href={`mailto:${site.email}`} className="link-underline hover:text-bone">
                {site.email}
              </a>
            ) : (
              <Placeholder>Email address</Placeholder>
            )}
          </li>
          {site.phone && (
            <li>
              <a href={site.phone.href} className="link-underline whitespace-nowrap hover:text-bone">
                {site.phone.display}
              </a>
            </li>
          )}
          {site.whatsapp && (
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 hover:text-bone">
                <span className="link-underline">WhatsApp</span>
                <ArrowUpRight size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          )}
          <li>{site.location ?? <Placeholder>Location</Placeholder>}</li>
        </FooterColumn>
      </div>

      <div className="shell mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-muted">
        <p>
          © {year} {site.name} · {site.founder}
        </p>
        <a href="#top" className="group inline-flex items-center gap-2 hover:text-bone">
          <span className="link-underline">Back to top</span>
          <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-1" />
        </a>
      </div>

      {/* Oversized wordmark, cropped at the bottom edge */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] select-none whitespace-nowrap text-center text-[19.5vw] font-semibold leading-[0.8] tracking-[-0.065em] bg-linear-to-b from-bone/15 to-bone/[0.02] bg-clip-text text-transparent"
      >
        {site.name}
      </p>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`col-span-2 md:col-span-2 ${className ?? ""}`}>
      <p className="t-label text-muted">{title}</p>
      <ul className="mt-4 space-y-2.5 text-muted">{children}</ul>
    </div>
  );
}
