import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import type { ProjectImage as ProjectImageData } from "@/content/projects";
import { cn } from "@/lib/cn";

type Props = {
  image?: ProjectImageData;
  /** Used for the placeholder artwork and fallback alt text. */
  title: string;
  slug: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
  /** Tailwind aspect class, e.g. "aspect-[16/10]" */
  aspect?: string;
  className?: string;
  /** Hover zoom when inside a `.group` */
  hoverZoom?: boolean;
};

/**
 * Framed project screenshot with optional scroll parallax and hover zoom.
 * Falls back to an art-directed placeholder until a real screenshot is added.
 */
export function ProjectImage({
  image,
  title,
  slug,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority,
  parallax,
  aspect = "aspect-[16/10]",
  className,
  hoverZoom = true,
}: Props) {
  const visual = image ? (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className="h-full w-full object-cover"
    />
  ) : (
    <ScreenshotPlaceholder title={title} slug={slug} />
  );

  return (
    <div className={cn("relative overflow-hidden rounded-[2px] bg-ink-2 ring-1 ring-line", aspect, className)}>
      <div
        className={cn(
          "h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-out-expo)]",
          hoverZoom && "group-hover:scale-[1.035]",
        )}
      >
        {/* Parallax only for real screenshots — its overscan would crop placeholder text */}
        {parallax && image ? <Parallax amount={6}>{visual}</Parallax> : visual}
      </div>
    </div>
  );
}

/**
 * Stand-in artwork for a missing screenshot: a minimal browser frame
 * with the project name, clearly labelled as a placeholder.
 */
function ScreenshotPlaceholder({ title, slug }: { title: string; slug: string }) {
  return (
    <div
      role="img"
      aria-label={`Placeholder — screenshot of ${title} not added yet`}
      className="relative flex h-full w-full flex-col bg-[radial-gradient(120%_90%_at_85%_0%,rgb(242_160_91/0.16),transparent_55%),radial-gradient(80%_80%_at_0%_100%,rgb(237_235_230/0.06),transparent_60%)]"
    >
      {/* Browser chrome */}
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-line px-3 md:h-10 md:px-4">
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="h-2 w-2 rounded-full bg-bone/15" />
        <span className="ml-3 hidden truncate rounded-full border border-line px-3 py-0.5 font-mono text-[0.6rem] text-muted sm:block">
          /projects/{slug}
        </span>
      </div>
      {/* Faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 top-8 opacity-40 md:top-10"
        style={{
          backgroundImage:
            "linear-gradient(rgb(237 235 230 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(237 235 230 / 0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative flex flex-1 flex-col justify-between p-5 md:p-8">
        <span className="t-label text-ember/90">Screenshot placeholder</span>
        <div>
          <p className="serif-accent text-[clamp(2rem,6vw,5rem)] leading-none text-bone/90">{title}</p>
          <p className="mt-3 font-mono text-[0.65rem] text-muted">Add /public/projects/{slug}/cover.webp</p>
        </div>
      </div>
    </div>
  );
}
