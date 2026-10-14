import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ScrollText } from "@/components/motion/ScrollText";
import { Sparkle } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

const chain = ["Software Engineering", "Artificial Intelligence", "Web & App Development", "Digital Products", "Digital Marketing"];

export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-title" className="shell scroll-mt-20 py-28 md:py-40">
      <div className="grid-editorial gap-y-10 border-t border-line pt-6">
        <h2 id="intro-title" className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
          <span className="text-ember">(01)</span>
          <span>Introduction</span>
        </h2>

        <div className="col-span-4 md:col-span-6 lg:col-span-9">
          <ScrollText
            className="text-[clamp(1.6rem,3.4vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.035em]"
            text="I'm Reza — a software engineer and AI specialist. I turn ideas into intelligent websites, apps and digital products, and bring a digital-marketing perspective so what gets built also gets found, understood and used."
          />

          <Stagger as="ol" className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-3" each={0.1}>
            {chain.map((item, n) => (
              <StaggerItem as="li" key={item} variant="slideLeft" className="flex items-center gap-4">
                <span
                  className={cn(
                    "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 hover:border-ember/50 hover:text-bone",
                    item === "Artificial Intelligence" ? "ai-sheen border-ember/50 text-bone" : "border-line text-muted",
                  )}
                >
                  {item === "Artificial Intelligence" ? (
                    <Sparkle size={11} className="text-ember" />
                  ) : (
                    <span className="font-mono text-[0.65rem] text-ember">0{n + 1}</span>
                  )}
                  {item}
                </span>
                {n < chain.length - 1 && (
                  <span aria-hidden className="text-ember">
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
