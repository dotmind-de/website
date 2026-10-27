import Image from "next/image";
import type { ProjectImage } from "@/content/projects";

/**
 * Full-page screenshot in a browser frame. Hovering (or focusing) the frame
 * glides through the entire page; on touch devices the frame scrolls natively.
 */
export function ScrollPreview({
  image,
  host,
  t,
}: {
  image: ProjectImage;
  host: string;
  t: { fullPage: string; hoverToScroll: string; swipeToScroll: string; scroll: string };
}) {
  // Longer pages scroll for longer so the speed feels constant.
  const seconds = Math.min(14, Math.max(5, image.height / 900));

  return (
    <figure className="overflow-hidden rounded-[6px] bg-ink-2 ring-1 ring-line">
      <div className="flex h-9 items-center gap-1.5 border-b border-line px-4">
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="ml-3 truncate rounded-full border border-line px-3 py-0.5 font-mono text-[0.65rem] text-muted">{host}</span>
      </div>
      <div
        tabIndex={0}
        aria-label={`${image.alt}. ${t.hoverToScroll}`}
        data-cursor="view"
        data-cursor-label={t.scroll}
        className="group relative aspect-[16/10] overflow-y-auto outline-none [@media(hover:hover)]:overflow-hidden"
      >
        {/* Touch: natural-height image scrolls inside the frame */}
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="block h-auto w-full [@media(hover:hover)]:hidden"
        />
        {/* Pointer: cover-fitted image glides from top to bottom on hover/focus */}
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="hidden object-cover object-top transition-[object-position] ease-in-out group-hover:object-bottom group-focus-visible:object-bottom [@media(hover:hover)]:block"
          style={{ transitionDuration: `${seconds}s` }}
        />
      </div>
      <figcaption className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[0.68rem] text-muted">
        <span>{t.fullPage}</span>
        <span className="hidden [@media(hover:hover)]:inline">{t.hoverToScroll}</span>
        <span className="[@media(hover:hover)]:hidden">{t.swipeToScroll}</span>
      </figcaption>
    </figure>
  );
}
