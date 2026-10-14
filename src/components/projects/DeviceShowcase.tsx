"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { DeviceScreens } from "@/content/projects";
import { ease } from "@/lib/motion";
import { DesktopFrame, LaptopFrame, PhoneFrame } from "./DeviceFrames";

/**
 * Desktop, laptop and phone arranged as one composition. Devices arrive from
 * their own side, then drift apart slightly with scroll (depth parallax).
 */
export function DeviceShowcase({ screens, priority }: { screens: DeviceScreens; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const laptopY = useTransform(scrollYProgress, [0, 1], ["4%", "-6%"]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ["10%", "-14%"]);

  const enter = (x: number, delay: number) => ({
    initial: { opacity: 0, x, y: 24 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 1.1, ease: ease.out, delay },
  });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[1400px] pb-[4%]" aria-label="Screenshots on desktop, laptop and mobile" role="group">
      {/* Glow */}
      <div aria-hidden className="absolute inset-x-[10%] top-[15%] h-[60%] rounded-full bg-ember/10 blur-[100px]" />

      {/* Desktop — centre, behind */}
      <motion.div {...enter(0, 0)} className="relative mx-auto w-[74%]">
        <DesktopFrame image={screens.desktop} sizes="(min-width: 1024px) 60vw, 80vw" priority={priority} />
      </motion.div>

      {/* Laptop — front left */}
      <motion.div style={reduced ? undefined : { y: laptopY }} className="absolute bottom-0 left-0 w-[46%]">
        <motion.div {...enter(-40, 0.15)}>
          <LaptopFrame image={screens.laptop} sizes="(min-width: 1024px) 40vw, 50vw" />
        </motion.div>
      </motion.div>

      {/* Phone — front right */}
      <motion.div style={reduced ? undefined : { y: phoneY }} className="absolute bottom-[2%] right-[3%] w-[15%] min-w-[74px]">
        <motion.div {...enter(40, 0.3)}>
          <PhoneFrame image={screens.mobile} sizes="(min-width: 1024px) 14vw, 24vw" />
        </motion.div>
      </motion.div>
    </div>
  );
}
