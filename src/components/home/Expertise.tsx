import { Reveal } from "@/components/motion/Reveal";
import { AiBadge } from "@/components/ui/AiBadge";
import { Plus } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toSegments } from "@/i18n/segments";
import { getLocalizedProfile, getMessages } from "@/i18n/server";

export async function Expertise() {
  const { expertise: t } = await getMessages();
  const { expertise } = await getLocalizedProfile();
  return (
    <section aria-labelledby="expertise-title" className="shell py-28 md:py-40">
      <SectionHeading
        id="expertise-title"
        index="03"
        label={t.label}
        title={toSegments(t.title)}
      />

      <ol className="mt-16 md:mt-24">
        {expertise.map((area, n) => (
          <Reveal as="li" key={area.id} className="group border-t border-line last:border-b">
            <article className="grid-editorial relative isolate gap-y-6 py-10 md:py-14">
              {/* Hover wash */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-5 -right-5 -z-10 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100 md:-left-8 md:-right-8"
              />
              <p className="col-span-1 font-mono text-xs text-ember md:col-span-1">0{n + 1}</p>
              <div className="col-span-3 md:col-span-7 lg:col-span-5">
                <h3 className="t-h2 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 rtl:group-hover:-translate-x-3">
                  {area.title}
                </h3>
                {area.id === "artificial-intelligence" && <AiBadge label={t.aiBadge} className="mt-5" />}
                <p className="mt-5 max-w-md text-muted">{area.statement}</p>
              </div>
              <ul className="col-span-4 grid gap-x-6 gap-y-3 self-end sm:grid-cols-2 md:col-span-7 md:col-start-2 lg:col-span-6 lg:col-start-7">
                {area.capabilities.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[0.95rem] text-muted transition-colors duration-300 group-hover:text-bone/85">
                    <Plus size={14} className="mt-[0.3em] shrink-0 text-ember/80" />
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
