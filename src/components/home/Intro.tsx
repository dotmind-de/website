import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ScrollText } from "@/components/motion/ScrollText";
import { Sparkle } from "@/components/ui/Icons";
import { getMessages } from "@/i18n/server";
import { cn } from "@/lib/cn";

/** Index of "Artificial Intelligence" in the chain. */
const AI = 1;

export async function Intro() {
  const { intro: t } = await getMessages();
  const chain = t.chain;
  return (
    <section id="intro" aria-labelledby="intro-title" className="shell scroll-mt-20 py-28 md:py-40">
      <div className="grid-editorial gap-y-10 border-t border-line pt-6">
        <h2 id="intro-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
          <span className="text-ember">(01)</span>
          <span>{t.label}</span>
        </h2>

        <div className="col-span-4 md:col-span-6 lg:col-span-9">
          <ScrollText
            className="text-[clamp(1.6rem,3.4vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.035em]"
            text={t.text}
          />

          <Stagger as="ol" className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-3" each={0.1}>
            {chain.map((item, n) => (
              <StaggerItem as="li" key={item} variant="slideLeft" className="flex items-center gap-4">
                <span
                  className={cn(
                    "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 hover:border-ember/50 hover:text-bone",
                    n === AI ? "ai-sheen border-ember/50 text-bone" : "border-line text-muted",
                  )}
                >
                  {n === AI ? (
                    <Sparkle size={11} className="text-ember" />
                  ) : (
                    <span className="font-mono text-[0.65rem] text-ember">0{n + 1}</span>
                  )}
                  {item}
                </span>
                {n < chain.length - 1 && (
                  <span aria-hidden className="text-ember rtl:-scale-x-100">
                    →
                  </span>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
