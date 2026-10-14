import Image from "next/image";
import type { ProjectImage } from "@/content/projects";
import { cn } from "@/lib/cn";

/*
 * Pure-CSS device mockups. Each frame keeps the screenshot's own aspect ratio,
 * so captures at 1920×1080 (desktop), 1440×900 (laptop) and 393×852 (phone)
 * sit pixel-true inside their bezels.
 */

type FrameProps = { image: ProjectImage; sizes: string; priority?: boolean; className?: string };

function Screen({ image, sizes, priority, className }: FrameProps) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-2", className)} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
    </div>
  );
}

/** External monitor on a stand. */
export function DesktopFrame({ className, ...props }: FrameProps) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="w-full rounded-[1.1%/1.9%] bg-[#1c1c1f] p-[1.4%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
        <Screen {...props} className="rounded-[0.4%]" />
      </div>
      {/* Stand */}
      <div className="w-[13%] bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1d]" style={{ aspectRatio: "3 / 1.1" }} />
      <div className="h-[0.9rem] w-[30%] rounded-t-md rounded-b-[40%] bg-gradient-to-b from-[#2e2e33] to-[#18181b] ring-1 ring-white/5" />
      <figcaption className="sr-only">Desktop · 1920 × 1080</figcaption>
    </figure>
  );
}

/** Laptop with a thin bezel, camera notch and keyboard deck. */
export function LaptopFrame({ className, ...props }: FrameProps) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="relative w-[86%] rounded-t-[2.2%/3.5%] bg-[#161618] p-[1.6%] pt-[2.4%] ring-1 ring-white/10">
        <span aria-hidden className="absolute left-1/2 top-[0.7%] h-[1.4%] w-[1.1%] -translate-x-1/2 rounded-full bg-[#2c2c30]" />
        <Screen {...props} className="rounded-[0.5%]" />
      </div>
      {/* Deck */}
      <div className="relative h-auto w-full" style={{ aspectRatio: "100 / 3.2" }}>
        <div className="absolute inset-0 rounded-b-[40%/100%] bg-gradient-to-b from-[#3a3a3f] to-[#1c1c1f] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.9)]" />
        <div className="absolute left-1/2 top-0 h-[45%] w-[14%] -translate-x-1/2 rounded-b-lg bg-[#232326]" />
      </div>
      <figcaption className="sr-only">Laptop · 1440 × 900</figcaption>
    </figure>
  );
}

/** Phone with rounded frame and dynamic island. */
export function PhoneFrame({ className, ...props }: FrameProps) {
  return (
    <figure className={className}>
      <div className="relative rounded-[14%/6.6%] bg-[#101012] p-[4.2%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.95)] ring-1 ring-white/15">
        <div className="overflow-hidden rounded-[11%/5.2%] bg-black">
          {/* Status bar: keeps the dynamic island clear of the site's header, like a real device */}
          <div aria-hidden className="relative flex items-center justify-between px-[9%] pt-[13%] text-bone">
            <span className="absolute left-[10%] top-[38%] text-[clamp(5px,0.55vw,11px)] font-semibold">9:41</span>
            <span className="absolute left-1/2 top-[22%] h-[44%] w-[30%] -translate-x-1/2 rounded-full bg-[#050505] ring-1 ring-white/5" />
            <span className="absolute right-[9%] top-[40%] flex gap-[3px]">
              <span className="h-[5px] w-[9px] rounded-[1px] border border-bone/70" />
            </span>
          </div>
          <Screen {...props} />
        </div>
      </div>
      <figcaption className="sr-only">Mobile · 393 × 852</figcaption>
    </figure>
  );
}
