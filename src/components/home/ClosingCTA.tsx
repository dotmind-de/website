import { AnimatedText } from "@/components/motion/AnimatedText";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import { ButtonLink } from "@/components/ui/Button";
import { getHref, getMessages } from "@/i18n/server";

/** Final call to action, reused at the end of most pages. */
export async function ClosingCTA({ title, accentLine }: { title?: string; accentLine?: string }) {
  const { cta: t } = await getMessages();
  const href = await getHref();
  title ??= t.title;
  accentLine ??= t.accent;
  return (
    <section aria-labelledby="cta-title" className="shell py-20 md:py-28">
      <Spotlight className="overflow-hidden rounded-[2px] border border-line px-6 py-20 md:px-14 md:py-32">
        <p className="t-label flex gap-3 text-muted">
          <span className="text-ember">(→)</span> {t.next}
        </p>
        <h2 id="cta-title" className="t-h1 mt-8 max-w-[14ch]">
          <AnimatedText as="span" text={title} className="block" />
          <AnimatedText as="span" text={accentLine} delay={0.25} className="serif-accent block font-normal text-ember" />
        </h2>
        <Reveal delay={0.3} className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-muted">
            {t.text}
          </p>
          <Magnetic>
            <ButtonLink href={href("/contact")}>{t.button}</ButtonLink>
          </Magnetic>
        </Reveal>
      </Spotlight>
    </section>
  );
}
