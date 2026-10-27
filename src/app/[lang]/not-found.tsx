import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/content/site";
import { rich } from "@/i18n/segments";
import { getHref, getMessages } from "@/i18n/server";

export default async function NotFound() {
  const m = await getMessages();
  const t = m.notFound;
  const href = await getHref();
  return (
    <>
      <title>{`${m.meta.notFoundTitle} — ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <PageHeader eyebrow={<span className="text-ember">(404)</span>} lines={[t.lines[0], <>{rich(t.lines.slice(1))}</>]} intro={t.intro}>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href={href("/")}>{t.home}</ButtonLink>
          <ButtonLink href={href("/projects")} variant="ghost">
            {t.work}
          </ButtonLink>
        </div>
      </PageHeader>
    </>
  );
}
