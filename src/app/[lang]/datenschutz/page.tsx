import type { Metadata } from "next";
import { LegalPage, LegalSection, legalMetadata } from "@/components/legal/LegalPage";
import { site } from "@/content/site";
import { getLocale, getMessages } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { legal } = await getMessages();
  return legalMetadata("/datenschutz", legal.privacy, lang);
}

export default async function PrivacyPage() {
  const lang = await getLocale();
  const { legal } = await getMessages();
  const { street, postalCode, city } = site.address;
  const email = <a href={`mailto:${site.email}`}>{site.email}</a>;

  return (
    <LegalPage label={legal.label} title="Datenschutz­erklärung" note={lang === "de" ? null : legal.germanOnly} updated="November 2026">
      <LegalSection title="1. Verantwortlicher">
        <address className="not-italic">
          {site.founder} – {site.name}
          <br />
          {street}, {postalCode} {city}
          <br />
          E-Mail: {email}
          {site.phone && (
            <>
              {" · "}Telefon: <a href={site.phone.href}>{site.phone.display}</a>
            </>
          )}
        </address>
      </LegalSection>

      <LegalSection title="2. Überblick">
        <p>
          Diese Website setzt keine Cookies, verwendet kein Tracking und keine Analyse-Tools und lädt keine Inhalte von
          Drittanbietern. Schriften und Bilder werden vom eigenen Server ausgeliefert.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting und Server-Logfiles">
        <p>
          Die Website läuft auf einem virtuellen Server der netcup GmbH, Emmy-Noether-Str. 10, 76131 Karlsruhe,
          Deutschland. Der Server steht in einem Rechenzentrum in Nürnberg; die Daten verlassen die EU nicht. Mit netcup
          besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
        </p>
        <p>
          Beim Aufruf der Website speichert der Server technisch notwendige Daten in Protokolldateien: IP-Adresse, Datum
          und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem sowie die zuvor besuchte Seite. Das dient dem
          sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Die Protokolle werden nach 7 Tagen automatisch
          gelöscht.
        </p>
      </LegalSection>

      <LegalSection title="4. Kontaktformular">
        <p>
          Wenn Sie das Kontaktformular nutzen, verarbeite ich Ihre Angaben: Art des Projekts, Ihre Nachricht, optional
          Website, Budget und Zeitrahmen, Ihren Namen, optional Ihr Unternehmen, Ihre E-Mail-Adresse und optional Ihre
          Telefonnummer. Die Angaben werden nicht auf dem Webserver gespeichert, sondern per E-Mail an mich gesendet; eine
          Kopie geht als Eingangsbestätigung an die von Ihnen angegebene E-Mail-Adresse. Den Versand übernimmt mein
          E-Mail-Anbieter, die checkdomain GmbH, Lübeck, Deutschland.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Anfrage auf einen Vertrag zielt, sonst Art. 6 Abs. 1
          lit. f DSGVO (Beantwortung von Anfragen). Ich lösche die Daten, sobald sie nicht mehr erforderlich sind und keine
          gesetzlichen Aufbewahrungspflichten bestehen.
        </p>
      </LegalSection>

      <LegalSection title="5. Kontakt per E-Mail und Telefon">
        <p>
          Wenn Sie mich per E-Mail oder Telefon kontaktieren, verarbeite ich Ihre Angaben, um Ihre Anfrage zu beantworten.
          Rechtsgrundlage und Löschung wie beim Kontaktformular.
        </p>
      </LegalSection>

      <LegalSection title="6. Kontakt per WhatsApp">
        <p>
          Sie können mir über WhatsApp schreiben. Anbieter ist die WhatsApp Ireland Limited, Merrion Road, Dublin 4,
          Irland. Dabei werden Ihre Telefonnummer, Ihre Nachrichten und Metadaten von WhatsApp verarbeitet, auch in den
          USA. Die Übermittlung stützt sich auf das EU-US Data Privacy Framework. Der Link auf dieser Website ist ein
          einfacher Link; Daten werden erst übertragen, wenn Sie ihn anklicken. Bitte senden Sie über WhatsApp keine
          sensiblen Daten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="7. Ihre Rechte">
        <ul>
          <li>Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17) und Einschränkung der Verarbeitung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f (Art. 21)</li>
          <li>
            Beschwerde bei einer Aufsichtsbehörde, zum Beispiel bei der Landesbeauftragten für Datenschutz und
            Informationsfreiheit Nordrhein-Westfalen (Art. 77)
          </li>
        </ul>
        <p>Für alle Anliegen genügt eine E-Mail an {email}.</p>
      </LegalSection>

      <LegalSection title="8. Verschlüsselung">
        <p>Diese Website wird ausschließlich über eine verschlüsselte Verbindung (HTTPS) ausgeliefert.</p>
      </LegalSection>
    </LegalPage>
  );
}
