# dotMind by Reza Alami — Portfolio

Premium dark, editorial portfolio built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion)**.
Design decisions, tokens and motion rules are documented in [`DESIGN.md`](./DESIGN.md).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

The site runs under **dotMind** (`https://dotmind.de`). Production builds default to that URL; set `NEXT_PUBLIC_SITE_URL` only to override it (e.g. for a staging domain). Canonical URLs, the sitemap, robots.txt and OG images use it.

Brand assets (logo, lockups, favicon mark) live in `public/brand/`; the `Logo` component is `src/components/ui/Logo.tsx`. Usage rules: [`DESIGN.md`](./DESIGN.md) → Brand.

## Content: where everything lives

| File | What |
| --- | --- |
| `src/content/projects.ts` | **All projects.** Home, `/projects`, `/projects/[slug]`, sitemap and OG images are generated from it. |
| `src/content/site.ts` | Name, email, location, languages, CV, social links, navigation. |
| `src/content/profile.ts` | Expertise, process, journey (timeline) and technologies. |

Nothing about Reza is invented. Every value that is still `null` (or a technology group with `pending`) appears on the site as a dashed **[ placeholder ]**. Fill in the value and the placeholder disappears.

### Add a project

1. Capture the live site on three devices — desktop 1920×1080, laptop 1440×900 @2x, mobile 393×852 @3x — plus a full-page desktop capture.
   Save them as `public/projects/<slug>/desktop.jpg`, `laptop.jpg`, `mobile.jpg` and `full.jpg`.
2. Add an entry to `projects` in `src/content/projects.ts` with `screens: screens("<slug>", "<Title>", <full.jpg height>)`.
3. Fill in `summary`, `features`, `technologies`, `overview` and `links.live`. Live links are automatically styled as external (↗).

The case-study page then shows a desktop + laptop + phone composition, a hover-to-scroll full-page preview and a phone view; cards show the desktop shot with the phone peeking over the corner.

### Placeholders to fill

- **Contact:** `email`, LinkedIn/GitHub/other URLs, `location`, `languages`, `cv` (`site.ts`)
- **Timeline:** `period` (dates) for each stage (`profile.ts`)
- **Technologies:** the `pending` items for each group (`profile.ts`). Only list tools you actually use.
- **Projects:** Power Bowls, Foodigastro24 and Rundumdienst are filled in from the live sites (content, source code, structured data and API routes). Still to add for each: `role` (what you did), `challenge` and `solution`. Set `ai: true` on a project to show the AI badge.
- **AI:** add the specific AI tools, models and platforms you use to the `AI` technology group (`profile.ts`). The four AI domains (`aiDomains`) describe your AI work in general terms — adjust them to match your actual experience.

## Structure

```
src/
  app/                 routes, metadata, sitemap, robots, OG images, template (page transition)
  components/
    motion/            Reveal, AnimatedText, ScrollText, ScrambleText, TokenStream, Parallax, Magnetic, CustomCursor, ScrollProgress, Spotlight
    layout/            Navigation (+ mobile menu), Footer
    home/              Hero, HeroField (neural canvas), Intro, Intelligence + NeuralDiagram (AI), Expertise, SelectedWork, Process, Timeline, Background, Technologies, ClosingCTA
    projects/          ProjectCard, ProjectImage, DeviceFrames (desktop/laptop/phone), DeviceShowcase, ScrollPreview, TechnologyList
    ui/                Button, AiBadge, SectionHeading, PageHeader, Placeholder, Icons, JsonLd
  content/             the data layer (see above)
  lib/motion.ts        central motion tokens: easing, durations, staggers, springs, variants
```

## Accessibility & motion

- `prefers-reduced-motion`: transforms, parallax, magnetic pull, custom cursor and scroll-scrubbed effects are disabled. The hero canvas renders one static frame.
- The custom cursor only mounts for fine pointers; touch devices keep native behaviour.
- Skip link, visible focus rings, `aria-current` on navigation, mobile menu with focus management and Escape-to-close.
