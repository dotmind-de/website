import type { Metadata } from "next";
import { LegalPage, LegalSection, legalMetadata } from "@/components/legal/LegalPage";
import { site } from "@/content/site";
import { getLocale, getMessages } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { legal } = await getMessages();
  return legalMetadata("/impressum", legal.imprint, lang);
}

export default async function ImprintPage() {
  const lang = await getLocale();
  const { legal } = await getMessages();
  const { street, postalCode, city } = site.address;

  return (
    <LegalPage label={legal.label} title="Impressum" note={lang === "de" ? null : legal.germanOnly} updated="November 2026">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <address className="not-italic">
          {site.founder} – {site.name}
          <br />
          {street}
          <br />
          {postalCode} {city}
          <br />
          Deutschland
        </address>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          {site.phone && (
            <>
              Telefon: <a href={site.phone.href}>{site.phone.display}</a>
              <br />
            </>
          )}
          E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </LegalSection>

      {site.vatId && (
        <LegalSection title="Umsatzsteuer">
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {site.vatId}</p>
        </LegalSection>
      )}

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>{site.founder}, Anschrift wie oben</p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </LegalSection>
    </LegalPage>
  );
}
