import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toSegments } from "@/i18n/segments";
import { getHref, getLocalizedProfile, getMessages } from "@/i18n/server";
import { Timeline } from "./Timeline";

export async function Background() {
  const m = await getMessages();
  const t = m.background;
  const href = await getHref();
  const { journey } = await getLocalizedProfile();
  return (
    <section aria-labelledby="background-title" className="shell py-28 md:py-40">
      <SectionHeading
        id="background-title"
        index="06"
        label={t.label}
        title={toSegments(t.title)}
        aside={<ArrowLink href={href("/about")}>{t.more}</ArrowLink>}
      />
      <div className="mt-16 md:mt-24">
        <Timeline journey={journey} />
      </div>
    </section>
  );
}
