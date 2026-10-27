import { Reveal } from "@/components/motion/Reveal";
import { Sparkle } from "@/components/ui/Icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toSegments } from "@/i18n/segments";
import { getLocalizedProfile, getMessages } from "@/i18n/server";

/** Grouped, typographic technology index — deliberately not a logo wall. */
export async function Technologies() {
  const { tech: t } = await getMessages();
  const { technologies } = await getLocalizedProfile();
  return (
    <section aria-labelledby="tech-title" className="shell py-28 md:py-40">
      <SectionHeading
        id="tech-title"
        index="07"
        label={t.label}
        title={toSegments(t.title)}
        aside={t.aside}
      />

      <dl className="mt-16 md:mt-24">
        {technologies.map((group, n) => (
          <Reveal key={group.key} className="grid-editorial group gap-y-3 border-t border-line py-6 last:border-b md:py-8">
            <dt className="col-span-4 flex items-baseline gap-3 md:col-span-2 lg:col-span-3">
              <span className="font-mono text-xs text-ember">0{n + 1}</span>
              <span className="flex items-center gap-2 text-lg font-medium tracking-[-0.02em]">
                {group.name}
                {group.key === "AI" && <Sparkle size={13} className="text-ember" />}
              </span>
            </dt>
            <dd className="col-span-4 flex flex-wrap items-center gap-x-1 gap-y-2 md:col-span-6 lg:col-span-9">
              {group.items.map((item, i) => (
                <span key={item} className="flex items-center">
                  <span className="text-[clamp(1.15rem,1.8vw,1.6rem)] tracking-[-0.02em] text-muted transition-colors duration-300 hover:text-bone">
                    {item}
                  </span>
                  {(i < group.items.length - 1 || group.pending) && (
                    <span aria-hidden className="mx-3 text-subtle">
                      /
                    </span>
                  )}
                </span>
              ))}
              {group.pending && <Placeholder>{group.pending}</Placeholder>}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
