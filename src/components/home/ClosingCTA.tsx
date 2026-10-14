import { AnimatedText } from "@/components/motion/AnimatedText";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { ButtonLink } from "@/components/ui/Button";

/** Final call to action, reused at the end of most pages. */
export function ClosingCTA({
  title = "Have a project in mind?",
  accentLine = "Let's build it properly.",
}: {
  title?: string;
  accentLine?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="shell py-20 md:py-28">
      <Spotlight className="overflow-hidden rounded-[2px] border border-line px-6 py-20 md:px-14 md:py-32">
        <p className="t-label flex gap-3 text-muted">
          <span className="text-ember">(→)</span> Next step
        </p>
        <h2 id="cta-title" className="t-h1 mt-8 max-w-[14ch]">
          <AnimatedText as="span" text={title} className="block" />
          <AnimatedText as="span" text={accentLine} delay={0.25} className="serif-accent block font-normal text-ember" />
        </h2>
        <Reveal delay={0.3} className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-muted">
            An AI-powered product, a website, an app or a smart home idea — tell me what you&apos;re building and where
            it stands. I&apos;ll reply with honest thoughts on the approach and the next steps.
          </p>
          <Magnetic>
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </Magnetic>
        </Reveal>
      </Spotlight>
    </section>
  );
}
