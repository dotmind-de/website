import { Background } from "@/components/home/Background";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Expertise } from "@/components/home/Expertise";
import { Hero } from "@/components/home/Hero";
import { Intelligence } from "@/components/home/Intelligence";
import { Intro } from "@/components/home/Intro";
import { Process } from "@/components/home/Process";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Technologies } from "@/components/home/Technologies";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": `${site.url}/#organization`,
          name: site.name,
          alternateName: `${site.name} by ${site.founder}`,
          url: site.url,
          logo: `${site.url}/brand/dotmind-mark-dark.svg`,
          description: site.description,
          founder: {
            "@type": "Person",
            "@id": `${site.url}/about#founder`,
            name: site.founder,
            jobTitle: [...site.roles],
            sameAs: site.socials.flatMap((s) => (s.href ? [s.href] : [])),
          },
          knowsAbout: ["Artificial Intelligence", "Software Engineering", "Web Development", "App Design", "Digital Marketing"],
          ...(site.email ? { email: site.email } : {}),
          ...(site.phone ? { telephone: site.phone.href.replace("tel:", "") } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.street,
            postalCode: site.address.postalCode,
            addressLocality: site.address.city,
            addressCountry: site.address.country,
          },
          areaServed: [
            { "@type": "Country", name: "Germany" },
            { "@type": "Country", name: "Austria" },
            { "@type": "Country", name: "Switzerland" },
          ],
        }}
      />
      <Hero />
      <Intro />
      <Intelligence />
      <Expertise />
      <SelectedWork />
      <Process />
      <Background />
      <Technologies />
      <ClosingCTA />
    </>
  );
}
