# Reza Alami — Frontend Implementation Plan

The engineering plan for turning the current English portfolio into the German-first, founder-led studio site described in [`STRATEGY.md`](./STRATEGY.md), using the UX and UI decisions in [`UX-DIRECTION.md`](./UX-DIRECTION.md) and the design system in [`DESIGN.md`](./DESIGN.md).

> **Decisions, October 2026:** the decision log in `STRATEGY.md` §11 is binding. Where anything below differs from it, the decision log wins.

- **Stack (installed):** Next.js 16.3.6 · React 19.2.8 · Tailwind CSS 4.3.3 · Motion 13.4.1 · TypeScript 5.9.3
- **Scope:** the engineering side of the work: folder structure, component APIs, performance, accessibility, i18n, forms, testing, CI and build order. It doesn't repeat the page blueprints, copy or visual specs in UX-DIRECTION.md; it points to them by section (`UX §x.y`).
- **Version:** v1 · October 2026

**How to read this with UX-DIRECTION.md.** UX-DIRECTION owns *what* each page and component is: names, section order, copy, states, tokens and the light theme. This document owns *how* it's built, and adds what UX-DIRECTION doesn't cover: the folder tree, prop types, budgets, a11y mechanics, the server-action pipeline, CI, and effort estimates. Component names are UX-DIRECTION's (§10.4). Where the two disagree, the disagreement is listed in [Alignment with UX-DIRECTION.md](#alignment-with-ux-directionmd) at the end, with a resolution.

### Next.js 16 docs this plan relies on

Every framework recommendation below was checked against the installed docs in `node_modules/next/dist/docs/01-app/`. They're cited inline as `docs:<path>`.

| Topic | Doc path | What's different from older Next.js |
| --- | --- | --- |
| i18n routing | `02-guides/internationalization.md` | Routes under `app/[lang]`; locale resolution happens in **Proxy**, not Middleware |
| Proxy | `01-getting-started/16-proxy.md`, `03-api-reference/03-file-conventions/proxy.md` | `middleware.ts` is **deprecated and renamed `proxy.ts`**, with export `proxy`. The runtime is **Node.js only**, and `runtime` can't be configured. Server Functions are POSTs to the page route, so a matcher that excludes a path also skips its actions. |
| Root params | `03-api-reference/04-functions/next-root-params.md` | New: `import { lang } from 'next/root-params'` in any Server Component. **Not** available in Client Components, Server Actions or Route Handlers. |
| Upgrade notes | `02-guides/upgrading/version-16.md` | Async `params` everywhere; `next lint` removed (use the ESLint CLI); `images.qualities` defaults to `[75]`; `revalidateTag` needs a 2nd argument |
| Images | `03-api-reference/02-components/image.md` | **`priority` is deprecated** in favour of `preload`, and the docs prefer `loading="eager"` / `fetchPriority="high"` in most cases |
| Fonts | `01-getting-started/13-fonts.md` | `next/font/google` self-hosts at build time, so the browser never contacts Google (DSGVO) |
| Forms | `02-guides/forms.md`, `02-guides/server-actions.md` | `useActionState(action, initial)` returns `[state, formAction, pending]`. Built-in CSRF origin check; 1 MB body limit; `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` for self-hosting |
| Data security | `02-guides/data-security.md` | Rate limiting is your job; every action is a public endpoint |
| `after()` | `03-api-reference/04-functions/after.md` | Run work after the response (logging, secondary mails) |
| Not-found | `03-api-reference/03-file-conventions/not-found.md` | `global-not-found.js` (experimental flag `globalNotFound`) exists for apps whose root layout is a dynamic segment such as `app/[lang]` |
| Redirects | `03-api-reference/05-config/01-next-config-js/redirects.md` | `permanent: true` → 308 |
| Metadata | `03-api-reference/04-functions/generate-metadata.md`, `…/01-metadata/sitemap.md` | `alternates.languages` for hreflang; sitemap entries support `alternates.languages` |
| JSON-LD | `02-guides/json-ld.md` | Escape `<` as `<` (the existing `JsonLd` component already does this) |
| Flash prevention | `02-guides/preventing-flash-before-hydration.md` | Inline `<script>` plus `suppressHydrationWarning` for the theme attribute |
| View transitions | `02-guides/view-transitions.md` | React `<ViewTransition>` works in the App Router **without config**; route navigations are transitions |
| Bundle analysis | `02-guides/package-bundling.md` | `next experimental-analyze` (Turbopack-native analyzer) |
| Analytics / vitals | `02-guides/analytics.md` | `useReportWebVitals`, `instrumentation-client.ts` |
| Scripts | `02-guides/scripts.md` | `strategy="worker"` doesn't work in the App Router, so don't plan around Partytown |

---

## 1 · Implementation strategy

### 1.1 Principles

1. **Server Components by default.** Client code is limited to small, named islands (the list is in §5.4). No section component is `"use client"` as a whole. Today 6 section or layout components are (`Intelligence`, `Process`, `Timeline`, `Navigation`, `DeviceShowcase`, `HeroField`).
2. **Content is data, UI is code.** Components never contain German strings. Copy comes from `src/content/de/*` (long-form, keyed by entity) and `src/i18n/dictionaries/de.ts` (UI strings). Facts that don't depend on language (prices, slugs, images, metrics) live once, in `src/content/facts/*`.
3. **Honest by construction.** Keep the `null → <Placeholder>` philosophy. Add the UX distinction between a *missing fact* (a placeholder, which blocks launch) and a *pending fact* (a designed state, which can be published) (UX §4.5), and enforce it with a script in CI (§11, step 4).
4. **Grow by adding data, not code.** Services, industries, team members, locales and the brand phase are configuration. Adding a fourth service or the `en` locale must not touch a component.
5. **One mechanism per concern.** One link helper (`href()`), one formatter module (`format.ts`), one CTA component family, one analytics listener, one reveal mechanism (CSS), one placeholder component.

### 1.2 Separation of concerns

| Layer | Folder | May import | Must not import |
| --- | --- | --- | --- |
| Routes | `src/app/[lang]/**` | everything below | — |
| Sections (page-level blocks) | `src/components/sections/**` | `ui`, `layout`, `content`, `i18n`, `lib` | other sections |
| Layout chrome | `src/components/layout/**` | `ui`, `content`, `i18n`, `lib` | sections |
| UI primitives | `src/components/ui/**` | `lib`, other primitives | `content`, `i18n` (strings come in as props) |
| Client islands | `src/components/islands/**` | `ui`, `lib` | `content/de/*` (copy passes in as serialisable props) |
| Content | `src/content/**` | `content/types.ts` | React, components |
| i18n | `src/i18n/**` | `content/types.ts` | components |
| Server-only | `src/server/**` (`import 'server-only'`) | `lib`, `content` | components |
| Utilities | `src/lib/**` | — | everything else |

Enforce the boundaries with `eslint-plugin-import`'s `no-restricted-paths` zones (no extra plugin is needed if you use ESLint's `no-restricted-imports` with `patterns` per folder via `overrides`).

### 1.3 Scaling from portfolio to agency: config, not rebuild

`src/content/facts/site.ts` gains a `brand` block (extends UX §10.2 `brandPhase`):

```ts
export const brand = {
  phase: 1 as 1 | 2 | 3,
  studioName: null as string | null,      // decision pending (STRATEGY §01)
  founder: "Reza Alami",
  voice: "ich" as "ich" | "wir",           // switch the day a 2nd person works on client projects
} as const;
```

| Lever | Phase 1 | Phase 2 | Phase 3 | Implemented by |
| --- | --- | --- | --- | --- |
| Brand weight | Person leads | Studio leads, "gegründet von" | Founder appears on `/team` | `BrandMark phase` (UX §10.4), `metadata.title.template`, OG artwork, JSON-LD `@type` mix |
| Voice | `ich` | `wir` | `wir` | `Voiced<T>` content type (below) |
| Services | 3 lead + 3 secondary | + KI-Integration as lead | full menu | rows in `facts/services.ts` + copy in `de/services.ts` |
| Industries | — | `/branchen/[industry]` | more | `facts/industries.ts` (empty array now, with the route gated by `published`) |
| Team | founder only | network page | `/team`, `/karriere` | `facts/people.ts` (founder entry now, so JSON-LD and credits use it) |
| Locales | `de` | `+ en` | `+ ar, fa` | `src/i18n/config.ts` `enabled` flag |

**`ich`/`wir` without forking copy.** Only strings with first-person grammar get both variants:

```ts
// content/types.ts
export type Voiced<T = string> = T | { ich: T; wir: T };
export const voiced = <T,>(v: Voiced<T>, voice: "ich" | "wir"): T =>
  typeof v === "object" && v !== null && "ich" in v ? v[voice] : (v as T);
```

Authors write `{ ich: "Ich melde mich innerhalb von 24 Stunden.", wir: "Wir melden uns …" }` only where needed. A CI check (`scripts/check-content.ts`) fails if `brand.voice === "wir"` while any `Voiced` value lacks `wir`.

### 1.4 Target folder tree

Files marked `(new)`, `(from X)` or `(delete)`. Everything else is kept as it is.

```
src/
  proxy.ts                               (new) locale rewrite/redirect (§7)
  instrumentation-client.ts              (new) web-vitals beacon (§5)
  app/
    robots.ts                            (from app/robots.ts, German routes)
    sitemap.ts                           (from app/sitemap.ts, alternates)
    og/[...key]/route.tsx                (new) OG images, see §7.6 / Alignment A3
    api/vitals/route.ts                  (new) RUM sink, no cookies, no IP stored
    [lang]/
      layout.tsx                         (from app/layout.tsx) html lang/dir/theme, chrome
      not-found.tsx                      (from app/not-found.tsx, German)
      [...rest]/page.tsx                 (new) → notFound(), so unmatched URLs get the localized 404
      template.tsx                       (delete; see §5.6)
      page.tsx                           (from app/page.tsx) Homepage
      leistungen/page.tsx                (new)
      leistungen/[service]/page.tsx      (new)
      projekte/page.tsx                  (from app/projects/page.tsx)
      projekte/[slug]/page.tsx           (from app/projects/[slug]/page.tsx)
      ueber/page.tsx                     (from app/about/page.tsx)
      kontakt/page.tsx                   (from app/contact/page.tsx)
      kontakt/actions.ts                 (new) submitInquiry
      kontakt/danke/page.tsx             (new, noindex)
      website-check/page.tsx             (new)
      website-check/actions.ts           (new) submitSchnellcheck
      website-check/danke/page.tsx       (new, noindex)
      impressum/page.tsx                 (new)
      datenschutz/page.tsx               (new)
      (dev)/styleguide/page.tsx          (new) notFound() in production
      (dev)/qa/typo/page.tsx             (new) UX §10.6 overflow test
  components/
    layout/   SiteHeader, MobileMenu*, MobileCtaBar*, SiteFooter, BrandMark, SkipLink, Breadcrumbs
    sections/
      home/     HomeHero, ProofStrip, ProblemStatements, ServiceList, SelectedWork,
                ComparisonTable, ProcessSteps, FounderSection, Testimonials, FaqList, FinalCta
      service/  ServiceHero, FitList, ProblemOutcomeList, DeliverablesList, InvestmentBlock, SchnellcheckStrip
      case/     CaseHeader, FactSheet, ResultsBand, CaseSection, DecisionList, Artefact, BeforeAfter,
                FeatureGroups, ClientQuote, CreditsList, NextProject, CaseToc
      contact/  IntentSelector, ContactDirect, NextSteps
      legal/    LegalPage
    projects/ DeviceFrames, DeviceShowcase*, ProjectImage, ScrollPreview*, TechnologyList,
              CaseStudyFeature (from ProjectCard feature), CaseStudyCard (from ProjectCard archive), LiveLink
    forms/    Field, TextInput, TextArea, ChoiceGroup, Checkbox, ErrorSummary*, SubmitButton*,
              InquiryForm*, SchnellcheckForm*, Honeypot, FormStatus
    islands/  BookingEmbed*, ThemeToggle*, PrimaryCtaObserver*, AnalyticsListener*, Magnetic* (optional)
    ui/       Container, Section, Grid, Stack, Eyebrow, Heading, Lead, Prose, ButtonLink, Button,
              ArrowLink, CtaLink, PriceFrom, MetricItem, Microcopy, Disclosure, Icon, Placeholder,
              OrPlaceholder, JsonLd, VisuallyHidden
    motion/   (delete the folder except Magnetic → islands/, Parallax only if still used)
  content/
    types.ts                             (new) Locale-neutral + localized types (UX §10.2)
    facts/    site.ts (from content/site.ts), projects.ts (from content/projects.ts),
              services.ts, industries.ts, people.ts, comparison.ts, site-metrics.json
    de/       home.ts, services.ts, projects.ts, faq.ts, testimonials.ts, about.ts, legal.ts, process.ts
    media/projects/<slug>/{desktop,laptop,mobile,full}.jpg   (moved from public/projects, static imports)
    profile.ts                           (delete after migrating journey/tools into de/about.ts)
  i18n/
    config.ts      locales, enabled, dir, intlLocale, ogLocale, font
    pathnames.ts   routeKey → per-locale pattern (UX §8.1)
    href.ts        href(locale, routeKey, params) + localized Link
    dictionaries/  de.ts (source of truth, `as const`), en.ts (typed `Dictionary`, phase 2)
    get-dictionary.ts  reads `lang` from next/root-params
    format.ts      Intl helpers + typo()
  server/
    mail/          provider.ts (interface), brevo.ts, dev-console.ts, templates/
    forms/         schemas.ts (zod), spam.ts (honeypot + signed time trap), rate-limit.ts
    env.ts         validated env (throws on missing SITE_URL in production)
  lib/
    cn.ts, cva.ts (20-line variant helper), hooks.ts, analytics.ts (track())
  styles/
    tokens.css, type.css, layout.css, motion.css, print.css   (split from app/globals.css)
* = client component
```

**Why `src/content/media/` instead of `public/projects/`:** static imports (`import desktop from "@/content/media/projects/powerbowls/desktop.jpg"`) give `next/image` the intrinsic width and height automatically. That removes the hand-maintained sizes in `projects.ts:71–81` (where `screens()` hard-codes 1920/2880/1179) and frees the `/projects/*` URL space, so the 308 redirect `/projects/:slug → /projekte/:slug` can't shadow a screenshot path.

---

## 2 · Page and component architecture

Page anatomies are defined in UX §02–§04 and §10.3. This section maps each block to a component, its content source and its render mode, and adds the engineering notes.

### 2.1 Homepage (`src/app/[lang]/page.tsx`)

| # | Section (UX §03) | Component | Content source | Server / client | Engineering notes |
| --- | --- | --- | --- | --- | --- |
| 01 | Hero | `HomeHero` | `de/home.ts` hero, `facts/site.ts`, `getFeaturedProjects()[0]` | Server | H1 = brand line with CSS `line-mask` (keep `globals.css` `.line-mask`). Visual = static `DesktopFrame` + `PhoneFrame` (no Motion). **LCP = H1 text**, so no image preload on home. Primary CTA carries `data-primary-cta`. |
| 02 | Proof strip | `ProofStrip` → `ProofItem` | `facts/projects.ts` `results` where `verified` | Server | `MetricItem` refuses `verified:false`. Falls back to the `technical`/`pending` label (UX §4.4). |
| 03 | Problem | `ProblemStatements` | `de/home.ts` problems | Server | `<ul>` of quotes; each links to the matching service. |
| 04 | Leistungen | `ServiceList variant="compact"` | `facts/services.ts` + `de/services.ts` | Server | Price via `PriceFrom` → `format.ts`. |
| 05 | Ausgewählte Projekte | `SelectedWork` → `CaseStudyFeature` | `getFeaturedProjects()` | Server | Images lazy; `sizes` per §5.2. |
| 06 | Der Unterschied | `ComparisonTable` | `facts/comparison.ts` + `de/home.ts` labels | Server | Real `<table>` ≥ md, criterion blocks < md (UX §7.4), **same DOM order**, switched with CSS only (§3.5). |
| 07 | Ablauf | `ProcessSteps` | `de/process.ts` | Server | `<ol>`; the static rail is CSS (delete the `useScroll` rail in `Process.tsx:12–14`). |
| 08 | Founder | `FounderSection variant="home"` | `de/about.ts`, `facts/people.ts` | Server | Portrait `null` → `Placeholder` art. |
| 09 | Testimonials | `Testimonials` | `de/testimonials.ts` | Server | Returns `null` if fewer than 2 (pending fact, not a placeholder). |
| 10 | Schnellcheck | `SchnellcheckForm variant="inline"` | dictionary `forms.schnellcheck` | Client island inside a server section | Works without JS (§9.4). |
| 11 | FAQ | `FaqList withJsonLd` | `de/faq.ts` | Server | Native `<details>`. |
| 12 | Final CTA | `FinalCta` | `de/home.ts` | Server | Optional `Magnetic` (UX §5.7). |

The page file stays a flat list with no logic:

```tsx
export default async function HomePage() {
  const [dict, home, projects] = await Promise.all([getDictionary(), getHome(), getFeaturedProjects()]);
  return (<>
    <HomeJsonLd />
    <HomeHero hero={home.hero} project={projects[0]} />
    {/* … sections in UX §2.2 order … */}
  </>);
}
```

### 2.2 Service page (`leistungen/[service]/page.tsx`)

`generateStaticParams()` comes from `facts/services.ts` (lead tier), with `dynamicParams = false`. The section order follows UX §2.3: `ServiceHero` → `FitList` → `ProblemOutcomeList` → `DeliverablesList` → `CaseStudyFeature` (omitted if `relatedProject` is null) → `ProcessSteps` (service steps) → `InvestmentBlock` → `FaqList` → `SchnellcheckStrip` → `FinalCta`. All are server components. `InvestmentBlock`'s CTA builds `href(lang, "contact", { query: { leistung: slug }, hash: "anfrage" })`.

### 2.3 Case study (`projekte/[slug]/page.tsx`)

Order per UX §4.2 (results band before the device composition). Engineering additions:

- **`CaseToc`** (desktop ≥ 1280 only): a sticky `<nav aria-label="Inhalt">` in the rail column listing Ausgangslage · Ansatz · Umsetzung · Ergebnis · Einblicke. It's server-rendered anchors with **no scroll-spy JS**. The current section is shown via `:target` styling only. It's hidden below `xl`, where the rail collapses.
- `DeviceShowcase` is the only above-the-fold image on this route. The desktop screen gets `fetchPriority="high"` and is **visible in the server HTML** (fixes the LCP defect in §10, item 3).
- `ScrollPreview` gets the mobile "Ganze Seite anzeigen" expand (UX §7.5) as a `<details>`-based disclosure, so no JS is needed.
- The `Gallery` and `NextProject` inner functions in today's `app/projects/[slug]/page.tsx` (lines 223–309) move to `sections/case/*`. The page file only composes.

### 2.4 About, contact, Schnellcheck, legal

| Route | Components (UX §2.5, §2.6, §10.3) | Client islands |
| --- | --- | --- |
| `/ueber` | `PageHeader` (with portrait media slot), `CaseSection`-style rail sections, `Disclosure` (Werkzeuge), `FinalCta` | none |
| `/kontakt` | `PageHeader`, `IntentSelector` (anchor rows), `BookingEmbed`, `InquiryForm`, `ContactDirect`, `NextSteps` | `BookingEmbed`, `InquiryForm` |
| `/kontakt/danke` | `NextSteps`, `CtaLink` | none. Reads `searchParams.typ`, which makes the route dynamic (acceptable: it's `noindex` and low-traffic) |
| `/website-check` | `PageHeader`, `SchnellcheckForm variant="page"`, `FaqList` | `SchnellcheckForm` |
| `/website-check/danke` | delivery date via `addBusinessDays` | none |
| `/impressum`, `/datenschutz` | `LegalPage` | none |

### 2.5 Navigation and chrome

- **`SiteHeader` is a Server Component.** It renders the brand, nav (`aria-current="page"` computed from a client child, since `usePathname` is client-only; see below) and the CTA. Three small islands sit inside it:
  - `NavLinks*`: about 0.5 kB, uses `usePathname()` only to set `aria-current`.
  - `HeaderCta*`: switches ghost/filled by subscribing to `PrimaryCtaObserver` (UX §6.2).
  - `MobileMenu*`: built on native `<dialog>` + `showModal()`. That gives a free focus trap, `inert` background, Esc-to-close and a top layer (fixes the missing focus trap at `Navigation.tsx:128–140`). The animation is CSS (`@starting-style`, `transition-behavior: allow-discrete`); there is no `AnimatePresence`.
- **Scrolled header state without JS:** the header background is solid `canvas/96` from the start (UX §9.2 removes the glass). The current `useMotionValueEvent(scrollY)` (`Navigation.tsx:18–24`) is deleted.
- **`MobileCtaBar*`** (UX §7.3): visibility = `!primaryCtaVisible && !finalCtaVisible && !routeHidden`. Input-focus hiding is pure CSS: `body:has(:is(input,textarea,select):focus) .mobile-cta-bar { translate: 0 100% }`, so the `useInputFocused` hook isn't needed. `<main>` gets `padding-block-end: var(--cta-bar-h)` below `md`, and `html` gets `scroll-padding-block: var(--header-h) var(--cta-bar-h)` so focused elements are never hidden (WCAG 2.4.11).
- **`SiteFooter`**: Server Component; columns per UX §2.1. The performance line reads `facts/site-metrics.json` (written by Lighthouse CI, §5.7). If the file is missing, the line is omitted, never invented.

---

## 3 · Component system

### 3.1 Layout primitives (`src/components/ui`)

They're thin wrappers over the existing utilities (`shell`, `grid-editorial`), so tokens stay in CSS:

```ts
type SectionProps = {
  id?: string;                         // anchor target, also used for aria-labelledby `${id}-title`
  labelledBy?: string;                 // defaults to `${id}-title`
  rhythm?: "sm" | "md" | "lg" | "none";// UX §5.2 tokens section-sm / section / section-lg
  tone?: "canvas" | "surface";         // at most one surface block per page (UX §5.5)
  as?: "section" | "div" | "aside";
  className?: string;                  // layout-only overrides (see 3.6)
  children: React.ReactNode;
};
type ContainerProps = { width?: "shell" | "prose" | "full"; className?: string; children: React.ReactNode };
type GridProps = { as?: "div" | "ul" | "ol" | "dl"; className?: string; children: React.ReactNode }; // grid-editorial
type StackProps = { gap?: 2 | 3 | 4 | 6 | 8 | 12; as?: keyof React.JSX.IntrinsicElements; className?: string; children: React.ReactNode };
```

The rail pattern (label in cols 1–3, content in cols 4–12, UX §5.2) becomes one component, which replaces `SectionHeading`'s grid:

```ts
type RailSectionProps = {
  label: string;                       // plain word, no index (UX §9.2)
  title?: React.ReactNode;             // rendered as `as` heading
  as?: "h2" | "h3";
  aside?: React.ReactNode;
  id: string;
  children?: React.ReactNode;
};
```

### 3.2 Typography primitives

```ts
type HeadingProps = {
  as: "h1" | "h2" | "h3" | "h4";       // semantics
  size?: "h1" | "h2" | "h3" | "metric";// visual, defaults to `as`; decoupled so outline ≠ style
  id?: string;
  balance?: boolean;                   // default true (text-wrap: balance)
  className?: string;
  children: React.ReactNode;           // may contain <Accent> (serif-accent), max 1 per heading (UX §5.4)
};
type EyebrowProps = { children: React.ReactNode; as?: "p" | "span" };   // t-label, fg-muted
type LeadProps = { children: React.ReactNode; className?: string };     // t-lead, max 52ch
type ProseProps = { children: React.ReactNode };                        // body 66ch, hyphens:auto (UX §5.4 CSS)
```

`Heading` never animates per word. `AnimatedText` (`motion/AnimatedText.tsx`) is deleted (§10, items 4–5).

### 3.3 Actions: CTA intent tiers

The existing `ButtonLink` (`ui/Button.tsx`) is the base. It keeps `children: string` (good: it forces text labels) and gains intent semantics. **Intent decides label, destination and tracking; emphasis decides the look.** Labels come from the dictionary by intent, so "Erstgespräch vereinbaren" can't be misspelled in 9 places.

```ts
type CtaIntent = "erstgespraech" | "anfrage" | "schnellcheck" | "projekte";   // UX §10.2 + projekte
type Emphasis = "primary" | "secondary" | "tertiary";

type CtaLinkProps = {
  intent: CtaIntent;
  emphasis: Emphasis;                  // primary → filled pill · secondary → ghost pill · tertiary → ArrowLink
  position: string;                    // data-cta-position, e.g. "hero" | "header" | "service-hero"
  primaryCta?: boolean;                // adds data-primary-cta (only page-level primaries)
  labelOverride?: string;              // in-context primaries: "Projekt anfragen", "Anfrage senden" (UX §6.2)
  query?: Record<string, string>;      // e.g. { leistung: "seo" }
  size?: "sm" | "md";
  fullWidthMobile?: boolean;
  className?: string;
};
// Resolves href via href(lang, INTENT_ROUTE[intent]), renders ButtonLink or ArrowLink,
// emits data-cta={intent} data-cta-position={position}.

type ButtonProps = {                   // real <button>, for forms and the booking facade
  type?: "button" | "submit";
  emphasis?: "primary" | "secondary";
  pending?: boolean;                   // aria-busy + aria-disabled, label swap
  pendingLabel?: string;
  children: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;
```

`INTENT_ROUTE` lives in `src/i18n/href.ts`: `erstgespraech → contact#termin`, `anfrage → contact#anfrage`, `schnellcheck → websiteCheck`, `projekte → home#projekte`.

**Variant maps, not a library.** `Button.tsx` already uses plain `Record<Variant, string>` maps (lines 23–31). Keep that pattern. Add `lib/cva.ts`, a 20-line typed helper (`variants({ base, variants, defaults })`), only to share it across Button, Field and MetricItem. **No `class-variance-authority` and no `tailwind-merge`.** Instead, there's a rule: `className` on primitives may only carry layout (margin, grid placement, width), never colour, type or padding (§3.6).

### 3.4 Media

```ts
type MediaProps = {
  image: StaticImageData | ProjectImage | null;      // null → art-directed placeholder (existing ScreenshotPlaceholder)
  alt: string;                                       // required, even when decorative ("" allowed explicitly)
  sizes: string;                                     // required: no default, forces thought (§5.2)
  ratio?: "16/10" | "4/5" | "1/1" | "intrinsic";
  loading?: "lazy" | "eager";                        // default lazy
  fetchPriority?: "high";                            // only the single LCP image of a route
  className?: string;
};
// DeviceFrames (existing): replace `priority?: boolean` (DeviceFrames.tsx:11) with
type FrameProps = { image: ProjectImage; sizes: string; fetchPriority?: "high"; className?: string };
```

`DeviceShowcase` keeps its composition (UX keeps it) but changes in three ways. (1) The desktop frame renders without an `initial={{ opacity: 0 }}` wrapper. (2) Laptop and phone parallax becomes CSS scroll-driven (`animation-timeline: view()`, §5.6). (3) Below 768 px it switches to the stacked mobile layout of UX §7.5 with CSS (`hidden md:block`). Both layouts are in the DOM, but images in the hidden one are `loading="lazy"`, so they're never fetched.

### 3.5 Data display

```ts
type MetricItemProps = {
  metric: Metric;                      // UX §10.2 type
  label: string;
  lead?: boolean;                      // the one ember metric per band (UX §5.3 accent rule)
};
// Renders null unless metric.verified && metric.value !== null; always renders source + measuredAt
// as a <p> (not a tooltip). Numbers via formatMetric(lang, metric).

type ComparisonTableProps = {
  caption: string;                     // visible or sr-only <caption>; required
  columns: { key: string; label: string; highlight?: boolean }[];
  rows: { criterion: string; values: Record<string, string> }[];
};
// ≥ md: <table> with <th scope="col"> headers and <th scope="row"> criteria; highlight column gets
// aria-describedby on its header pointing to "Empfehlung". < md: the SAME <table>, restyled with
// `display:block` per row group into criterion blocks (UX §7.4). Because the DOM stays a table,
// screen readers keep table semantics; add role="table"/"row"/"cell" explicitly, since display:block strips them in Safari.

type DisclosureProps = {               // FAQ, "Technik im Detail", "Werkzeuge"
  summary: string;
  headingLevel?: 3 | 4;                // summary wraps <hN> for the outline
  name?: string;                       // exclusive accordion via <details name> (supported in all evergreen browsers)
  defaultOpen?: boolean;
  children: React.ReactNode;
};

type TestimonialQuoteProps = { testimonial: Testimonial; size: "lg" | "sm" };
// <figure><blockquote lang={…}>…</blockquote><figcaption>Name, Rolle, Firma</figcaption></figure>
// Never marked up as schema.org Review (self-serving reviews aren't eligible for rich results).

type PlaceholderProps = { children: string; className?: string };     // existing, unchanged API
type PriceFromProps = { amount: number | null; unit: "once" | "month"; prefix?: "ab" | "auditAb" };
```

### 3.6 Enforcing consistency

| Rule | Mechanism |
| --- | --- |
| Semantic tokens only (`bg-canvas`, `text-fg-muted`; UX §5.3) | `@theme` exposes only semantic names. Palette primitives live in `:root` as `--palette-*`, which are **not** Tailwind theme keys, so `bg-ink` stops compiling. |
| Logical properties only | ESLint `no-restricted-syntax` on string literals and template elements matching `/(^|\s)-?(m\|p)[lr]-\|(^|\s)-?(left\|right)-\|(^|\s)(border\|rounded)-[lr](\b\|-)\|text-(left\|right)\|origin-(left\|right)/`. Message: "Use ms/me/ps/pe/inset-s/inset-e/border-s/text-start (UX §8.3)". |
| No deprecated `next/image` `priority` | `no-restricted-syntax`: `JSXAttribute[name.name="priority"]` |
| Motion discipline | `no-restricted-imports`: `motion/react` is banned everywhere except `src/components/islands/**`, and there only `LazyMotion`, `domAnimation` and `motion/react-m` are allowed |
| No German strings in components | `no-restricted-syntax`: `JSXText[value=/[äöüßÄÖÜ]\|\b(und\|der\|die\|Sie)\b/]` in `src/components/**` (cheap heuristic, catches most cases) |
| One H1 per page | Playwright test (§6.8) |
| Visual review | `(dev)/styleguide`: every primitive and variant, both themes, `dir="rtl"` toggle, pseudo-locale toggle. The route calls `notFound()` when `process.env.NODE_ENV === "production"`. |

`eslint.config.mjs` already uses the flat config (`docs:…/upgrading/version-16.md`, ESLint Flat Config). Add the rules there, and add `"lint": "eslint ."` and `"typecheck": "next typegen && tsc --noEmit"` scripts (`next lint` was removed in 16).

---

## 4 · Responsive strategy

### 4.1 Breakpoints and grid

Keep the Tailwind defaults from DESIGN.md (640 / 768 / 1024 / 1280 / 1536) and the 4 → 8 → 12 `grid-editorial`. **Author mobile-first:** unprefixed classes are the 375 px layout, and `md:` and `lg:` only add to it. The test widths are 320 (overflow floor), 375, 768, 1024, 1440 and 1920.

| Range | Layout | Navigation | CTA |
| --- | --- | --- | --- |
| < 768 | 4 cols, rail label stacks above content, split 7/5 stacks text-first (visual second, except the case-study hero, where results come first) | `MobileMenu` dialog | `MobileCtaBar` after the hero CTA leaves view |
| 768–1023 | 8 cols, rail = cols 1–2 / 3–8 | Inline nav; header CTA uses the short label **Erstgespräch** (accessible name „Erstgespräch vereinbaren" starts with the visible text, so WCAG 2.5.3 passes) | Header CTA |
| ≥ 1024 | 12 cols, rail 1–3 / 4–12, split 7/5 | Full nav + CTA | Header CTA, ghost/filled switching |
| ≥ 1280 | + `CaseToc` sticky rail on case studies | | |

### 4.2 Fluid type and spacing

UX §5.4 defines the revised `clamp()` scale. Implement it in `styles/type.css` as `@utility` blocks, as the current `globals.css` does. Two engineering rules:

- **Every `clamp()` minimum is tested at 320 px with the German long-word set** in `(dev)/qa/typo`. The current `t-display` (`clamp(3.4rem, 15.5vw, 15rem)` + `whitespace-nowrap`, `Hero.tsx:45`) fails this and is retired (UX §5.4).
- **Rhythm tokens** `section-sm` / `section` / `section-lg` (UX §5.2) are `@utility` classes with `padding-block`, used through `Section rhythm`. Delete the scattered `py-28 md:py-40` (12 occurrences).

### 4.3 Keeping the premium feel at 375 px

- **Spacing doesn't collapse proportionally.** Section rhythm drops from 8 to 5 rem, not to 3. Whitespace is the premium signal.
- **One visual per screen.** Device compositions switch to the stacked layout (UX §7.5); the ProofStrip becomes a 3-row list. Hairlines replace boxes.
- **Touch targets:** at least 44×44 px for nav, the CTA bar and form controls (inputs are 48 px tall, UX §6.3). Footer links get `py-1.5` to reach the 24 px WCAG 2.5.8 minimum with spacing.
- **No hover-only information.** `ScrollPreview`'s "Hover to scroll" behaviour (`ScrollPreview.tsx:25,42`) is replaced on touch by the expand disclosure. Everything the pointer reveals must also be reachable by focus and tap.
- **Viewport units:** use `svh` for hero minimum heights (UX: `min-h-[88svh]` ≥ lg, auto on mobile). Never use `vh` on mobile.

### 4.4 Text expansion

Components may never assume one line (UX §8.5). Buttons use `min-h` + `py`, never a fixed `h-14` with text. Today `Button.tsx:24–25` uses `h-14`/`h-10`; change it to `min-h-14`/`min-h-10` with `py-3` and `text-balance`. The pseudo-locale `de-XA` (×1.3 strings, generated from `de.ts` by a script) is selectable in the styleguide.

---

## 5 · Performance

### 5.1 Budgets (CI-enforced)

| Metric | Budget (mobile, Moto G Power / Slow 4G Lighthouse profile) | Source |
| --- | --- | --- |
| LCP | < 2.0 s on `/`, `/leistungen/*`, `/projekte/*` | STRATEGY §10 |
| CLS | < 0.05 | STRATEGY §10 |
| INP | < 200 ms (RUM, p75) · TBT < 150 ms (lab proxy) | Core Web Vitals |
| Lighthouse | ≥ 95 in all four categories, a11y = 100 | STRATEGY §10, UX §10.6 |
| JS transferred (gzip), first load | ≤ 120 kB on content routes · ≤ 145 kB on `/kontakt`, `/website-check` | this plan |
| CSS transferred | ≤ 25 kB | this plan |
| Fonts on first load | ≤ 3 files, ≤ 110 kB total | this plan |
| Third-party requests before interaction | **0** | STRATEGY §07, UX §6.5 |

The JS budget includes the React 19 + Next 16 runtime, which is the bulk of it. Route-specific JS must stay under about 15 kB on content routes. That's realistic only if the shared chunk contains **no Motion**. Today `Providers.tsx` (`MotionConfig`), `Navigation.tsx` (`motion`, `AnimatePresence`, `useScroll`), `ScrollProgress` and `CustomCursor` are mounted in `app/layout.tsx:68–76`, so the full Motion bundle ships on every route.

### 5.2 Images

- **Remove `priority` everywhere** (deprecated, `docs:03-api-reference/02-components/image.md` §priority): `DeviceFrames.tsx:16`, `ProjectImage.tsx:43`, `DeviceShowcase.tsx:34`, `app/projects/[slug]/page.tsx:106,113`, `app/projects/page.tsx:41`. Per the docs' own advice ("In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`"), use `fetchPriority="high"` on **exactly one** image per route, and only where an image is the LCP candidate (the case-study desktop screen). On `/` and `/leistungen/*` the LCP is the H1, so no image is prioritised. The current archive page prioritises two images (`n < 2`), and on mobile the second one is off-screen.
- **Formats:** keep `images.formats: ["image/avif", "image/webp"]` (`next.config.ts:5`). Keep `qualities: [75, 90]`. Use 75 by default and 90 only for `DeviceFrames` screens, where small UI text in screenshots must stay legible.
- **Cap variants:** `images.deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560]`, `imageSizes: [64, 128, 256, 384]`. The largest rendered screenshot is about 1036 CSS px × 2 DPR, so 3840 px variants are never needed, which saves optimizer CPU and cache.
- **`sizes` must describe the real layout.** Current values are approximate (`DeviceShowcase.tsx:34` says `80vw` under 1024, but the frame is 74 % of a max-1400 container). Required values:

| Image | `sizes` |
| --- | --- |
| Case hero desktop frame | `(min-width: 1600px) 1036px, (min-width: 768px) 65vw, 100vw` |
| Laptop frame | `(min-width: 1600px) 644px, (min-width: 768px) 40vw, 100vw` |
| Phone frame (showcase) | `(min-width: 768px) 14vw, 64vw` |
| `CaseStudyFeature` cover | `(min-width: 1024px) 56vw, 100vw` |
| `CaseStudyCard` cover | `(min-width: 768px) 45vw, 100vw` |
| Peeking phone on cards | `128px` |
| Full-page `ScrollPreview` | `(min-width: 1024px) 66vw, 100vw` |
| Founder portrait (hero byline 56 px) | `56px` |

- **Screenshot pipeline (the captures are large).** Today's `public/projects/*` totals about 7.1 MB, and the `full.jpg` files are 0.83–1.07 MB at 1440×5734–9003 px. Add `scripts/capture-screens.ts` (Playwright, dev dependency) that:
  1. captures desktop 1920×1080 @1x, laptop 1440×900 @2x, mobile 393×852 @3x and full page at 1440 wide, against the live client URL, with cookie banners dismissed via a per-project selector in `facts/projects.ts`;
  2. post-processes with `sharp` (already a Next dependency): sRGB, `mozjpeg` q88 masters, and full-page captures capped at 1440 × 8000 px;
  3. writes into `src/content/media/projects/<slug>/` and prints the import snippet.
  The masters stay in git (fewer than 10 MB in total). `next/image` serves AVIF derivatives. No blur placeholders: dark UI plus light screenshots would flash. The reserved `aspect-ratio` is the CLS guard, and it already exists (`DeviceFrames.tsx:15`).
- **Lazy by default.** Everything except the one prioritised image uses the default `loading="lazy"`. Hidden responsive duplicates (`ScrollPreview`'s touch and pointer variants, `DeviceShowcase` mobile vs. desktop layout) must stay lazy, so the `display:none` copy is never fetched.

### 5.3 Fonts (DSGVO-safe self-hosting)

`next/font/google` downloads at build time and serves from our origin (`docs:01-getting-started/13-fonts.md`: "no requests are sent to Google by the browser"). So the current setup (`app/[lang]/layout.tsx`, today `app/layout.tsx:11–19`) is compliant. Tighten it:

| Family | Load | `preload` | Notes |
| --- | --- | --- | --- |
| Geist (variable) | `subsets: ["latin"]` | yes | Covers äöüß, „ " and € (all in Latin-1 / General Punctuation in the latin subset). Expose `--font-sans` **and** `--font-display` (UX §5.4) pointing to the same variable for now. |
| Geist Mono | `subsets: ["latin"]` | **no** | Labels only; never LCP |
| Instrument Serif Italic | `weight: "400", style: ["italic"]` | **no** | Accent words only; `display: "swap"` + `adjustFontFallback` (default) keep CLS low |
| IBM Plex Sans Arabic (`ar`) | `subsets: ["arabic"], weight: ["400","500","600"]` | no | Phase 3; class applied only when `lang === "ar"` |
| Vazirmatn (`fa`) | `subsets: ["arabic"]` (variable) | no | Phase 3; only when `lang === "fa"` |
| Parastoo (`fa` accent) / Markazi Text (`ar` accent) | `subsets: ["arabic"]` (variable), `--font-script-serif` | no | `serif-accent` on RTL routes only |

Fonts must be declared at module scope. Declare the Arabic and Persian fonts in `src/i18n/fonts.ts` with `preload: false`, and apply their `variable` class to `<html>` only for those locales. A `@font-face` rule that no element uses never downloads. Verify that `de` pages make no Arabic font request (UX §8.4).

### 5.4 JavaScript: client islands only

The complete list of client components after the refactor. Anything else marked `"use client"` fails review:

| Island | Why it's client | Size target (gzip) |
| --- | --- | --- |
| `NavLinks` | `usePathname` for `aria-current` | < 1 kB |
| `MobileMenu` | `dialog.showModal()` | < 1.5 kB |
| `PrimaryCtaObserver` + `HeaderCta` + `MobileCtaBar` | one shared IntersectionObserver context | < 2 kB |
| `ThemeToggle` | `localStorage` + `data-theme` | < 1 kB |
| `AnalyticsListener` | one delegated click listener (§9.6) | < 1 kB |
| `InquiryForm`, `SchnellcheckForm`, `ErrorSummary`, `SubmitButton` | `useActionState`, focus management | < 6 kB together |
| `BookingEmbed` | two-click facade | < 2 kB (the vendor script loads only after the click) |
| `ScrollPreview` | none (the disclosure is `<details>`), so it **becomes a server component** | 0 |
| `DeviceShowcase` | none (parallax becomes CSS), so it **becomes a server component** | 0 |
| `Magnetic` (optional, `FinalCta` only) | pointer math; rewrite vanilla, writing CSS variables like `Spotlight` did | < 0.5 kB |

**Motion's role becomes "available, not loaded."** Keep the dependency for future choreography. Any use must go through `src/components/islands/motion.tsx`, which wraps `LazyMotion features={domAnimation} strict` and re-exports `m` from `motion/react-m` (both verified in the installed `motion@13.4.1` exports: `./react-m`, `LazyMotion`, `domAnimation`). Phase 1 ships **zero** Motion code.

### 5.5 Third parties

| Item | Approach |
| --- | --- |
| Booking (Cal.com, EU instance or self-hosted; Reza decides: `site.booking`) | Two-click facade (UX §6.5). The vendor script is injected by `BookingEmbed` only after the click, with a skeleton at fixed min-height (prevents CLS). `next/script` isn't used for it, because it must not load on route entry. |
| Analytics | **Plausible (EU, cookieless), proxied through our origin** with `next.config.ts` `rewrites()`: `/stats/js/script.js → https://plausible.io/js/script.js` and `/stats/api/event → https://plausible.io/api/event`. The browser then talks only to our domain, which keeps the "0 third-party requests" promise and survives ad-blockers. Load it with `<Script src="/stats/js/script.js" strategy="lazyOnload" data-domain=…>`. The proxy matcher (§7.2) excludes `/stats`. |
| RUM / Web Vitals | `instrumentation-client.ts` (`docs:02-guides/analytics.md`) imports `onLCP/onINP/onCLS` from `next/web-vitals`' `useReportWebVitals` equivalent, or registers a tiny `PerformanceObserver`. It sends `navigator.sendBeacon('/api/vitals', …)` with `{route, metric, value, rating}`. **No IP, no user agent stored.** The route handler aggregates daily percentiles into a log or SQLite. This is the DSGVO-safe replacement for Vercel Speed Insights. |
| Maps, video, social embeds | None in phase 1. The Schnellcheck sample video is self-hosted MP4 with `preload="none"` and a poster image. |

### 5.6 CSS-first motion

All motion that survives UX §5.7 is CSS:

- **Hero `line-mask` / `fade-in`**: keep (`globals.css`). It runs before hydration, so it's LCP-safe.
- **`Reveal` reimplemented without JS.** It keeps the same name and API (`<Reveal as variant>`), but as a Server Component that renders `data-reveal`. The CSS:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      [data-reveal] { animation: reveal-in linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; }
    }
  }
  @keyframes reveal-in { from { opacity: 0; translate: 0 8px; } }  /* UX §5.7: 8 px travel */
  ```
  Browsers without scroll-driven animations, users without JS, and reduced-motion users all see the content immediately. That removes the `<noscript>` hack (`app/layout.tsx:57–59`) and fixes the hidden-heading bug (§10, item 4).
- **`DeviceShowcase` parallax**: same technique, with `translate` keyed to `view()`, max 6 % travel (UX §5.7), disabled below `md`.
- **Page transitions**: delete `template.tsx` (a 0.6 s fade on *every* load, including the first, which delays all paint). Use React `<ViewTransition>` around `{children}` in the layout (`docs:02-guides/view-transitions.md`: "work in the App Router with no configuration"). It's an opacity-only, 200 ms crossfade (UX §5.7), scoped by `@media (prefers-reduced-motion: no-preference)` on `::view-transition-*`. It only runs on client navigations, never on first load.

### 5.7 Measurement

| Layer | Tool | Gate |
| --- | --- | --- |
| Lab, per PR | **Lighthouse CI** (`@lhci/cli`, GitHub Actions) against `next build && next start`, 3 runs median, mobile preset, URLs: `/`, `/leistungen/website-erstellen-lassen`, `/projekte/powerbowls`, `/kontakt` | Assertions from §5.1. `resource-summary:script:size` ≤ budget; `third-party-summary` = 0 |
| Bundle, per PR | `next experimental-analyze` (`docs:02-guides/package-bundling.md`). A script fails the build if `motion` or `framer-motion` appears in a route's client graph without an allowlisted island. | |
| Field | `/api/vitals` p75 per route, weekly summary | INP p75 < 200 ms, LCP p75 < 2.0 s |
| Proof on site | The CI job writes `src/content/facts/site-metrics.json` (`{ lighthouse: {perf, a11y, bp, seo}, lcpMs, measuredAt }`) on `main`; `SiteFooter` renders „Lighthouse 98 · LCP 1,4 s (mobil, gemessen am …)" via `format.ts` (STRATEGY §07) | |

---

## 6 · Accessibility (WCAG 2.2 AA)

### 6.1 Landmarks and skip link

`app/[lang]/layout.tsx` renders: `SkipLink` („Zum Inhalt springen", from the dictionary; today it's English at `app/layout.tsx:66`) → `<header>` (`SiteHeader`, containing `<nav aria-label="Hauptnavigation">`) → `<main id="main" tabIndex={-1}>` → `<footer>` (`<nav aria-label="Fußzeile">`) → `MobileCtaBar` as `<aside aria-label="Schnellkontakt">` (outside `main`). The skip link uses `inset-s-4` (logical), not `left-4`.

### 6.2 Heading outline per page type

Exactly one `h1` per page, enforced by a Playwright test. Section eyebrow labels are **not** headings (they're `<p>`); the section title is the `h2`.

| Page | h1 | h2 (in order) | h3 |
| --- | --- | --- | --- |
| `/` | keyword line + „Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen." (brand line decided Oct 2026) | one per section 02–12 (ProofStrip gets a visually hidden h2 „Projekte in Zahlen") | service names, project names, process steps, FAQ questions (inside `summary`) |
| `/leistungen/[service]` | outcome headline | Passt / Passt nicht, Problem → Ergebnis, Leistungsumfang, Passendes Projekt, Ablauf, Investition, Häufige Fragen, Schnellcheck, Final CTA | deliverable groups, steps, questions |
| `/projekte/[slug]` | outcome headline (client name is an eyebrow `<p>`) | Ergebnisse, Ausgangslage, Ansatz, Umsetzung, Ergebnis, Einblicke, Rolle & Credits, Nächstes Projekt | decisions, feature groups |
| `/kontakt` | „Erzählen Sie mir von Ihrem Projekt." | Erstgespräch vereinbaren, Projekt schriftlich anfragen, Direkt, So geht es weiter | form fieldset legends are *not* headings |
| `/impressum`, `/datenschutz` | page title | legal sections | sub-sections |

### 6.3 Keyboard

- **Mobile menu:** native `<dialog>` gives a focus trap, `Esc`, `inert` background, and focus returning to the trigger on close (re-implement only the return-focus fallback). The trigger has `aria-expanded` and `aria-controls`.
- **Disclosures and FAQ:** native `<details>/<summary>` (keyboard and screen-reader support for free). No custom accordion.
- **Booking facade:** a real `<button>`. After the iframe loads, move focus to the iframe's container heading (`tabIndex={-1}`), so keyboard users aren't left on a removed button.
- **Duplicate image links** (`ProjectCard.tsx:54`: `tabIndex={-1} aria-hidden`): keep the pattern in `CaseStudyFeature` and `CaseStudyCard`, and remove the `data-cursor*` attributes.
- **`ScrollPreview`**: the current focusable `div` with `aria-label` and no role (`ScrollPreview.tsx:20–23`) is invalid ARIA. It becomes a `<figure>` with the expand `<details>`, and the image keeps a real `alt`.

### 6.4 Focus visible

Keep the global `:focus-visible { outline: 2px solid … }` (`globals.css`), switched to the semantic `--color-accent` token. In the light theme that resolves to `ember-deep` (UX §5.3: ember on Papier is 1.9:1 and fails the 3:1 non-text minimum). On the filled primary button, the outline sits outside (`outline-offset: 3px`) on `canvas`, so contrast is against the page, not the button. Never use `outline: none` without a replacement. `main`'s `outline-none` is fine, because it's only a programmatic focus target.

### 6.5 Contrast discipline

- `fg-muted` is for metadata only, never running body copy (UX §5.3). `fg-subtle` (3.2:1) is **decorative only**: hairline glyphs and `aria-hidden` separators. Add a styleguide check: every text-colour token is shown on both canvases with its computed ratio.
- Remove opacity-modified text tokens (`text-muted/70` at `Navigation.tsx:65`, `text-bone/90` and others). Opacity on text makes the ratio unpredictable across themes.
- `ScrollText` (20 % opacity until scrolled; `Intro.tsx:18`, `about/page.tsx:122`) is deleted (UX §9.2). It fails 1.4.3 for most of its life.

### 6.6 Forms

Specified in §9.3. In short: visible `<label for>`, hints and errors linked via `aria-describedby` (hint id first, then error id), `aria-invalid` on invalid fields, `<fieldset>/<legend>` for radio groups, an error summary focused on submit with in-page links to fields, a `role="status"` live region for pending and success, and `autocomplete` tokens on every personal field.

### 6.7 Reduced motion and pointer effects

- CSS: the existing global `prefers-reduced-motion` block (`globals.css`, end) stays. The new `Reveal`, parallax and view transitions are opt-in under `no-preference`, so they're off by default.
- **Custom cursor:** deleted (UX §9.2), including `html.has-custom-cursor * { cursor: none }`. Hiding the native cursor fails users with cursor-size OS settings.
- **Magnetic:** if kept on `FinalCta`, it checks `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` (the existing `useFinePointerMotion` in `lib/hooks.ts` does this) and clamps travel to 6 px.
- **No auto-cycling content.** `Intelligence.tsx:25–29` (3.2 s interval) is deleted with the section.

### 6.8 `lang` and `dir`

`<html lang={lang} dir={config[lang].dir}>` in `app/[lang]/layout.tsx`. Inline foreign-language runs (English tech names in German copy don't count; full English quotes do) get `lang="en"`. In RTL locales, Latin runs (URLs, emails, phone numbers) are wrapped in `<bdi>` or `dir="ltr"` (UX §8.3).

### 6.9 Testing

| Level | Tool | When |
| --- | --- | --- |
| Static | `eslint-plugin-jsx-a11y` (ships with `eslint-config-next`), `strict` preset on `src/components/**` | every commit |
| Automated | `@axe-core/playwright`: every route × {375, 1440} × {dark, light}, plus the menu-open, form-error and booking-loaded states | every PR, 0 violations |
| Structural | Playwright assertions: one `h1`; no skipped heading levels; every `img` has `alt`; every form control has an accessible name; focus is visible after `Tab` (screenshot diff of a focus ring) | every PR |
| Manual | VoiceOver + Safari (macOS and iOS), NVDA + Firefox: all three conversion flows, the comparison table, the case study. Keyboard-only run. 200 % zoom and 320 px reflow. | before launch, then per release |

---

## 7 · Multilingual readiness

UX §08 makes the product decisions: German unprefixed at the root, `/en|/ar|/fa` prefixed, English slugs for all three non-German locales, no `Accept-Language` redirect, and no switcher in phase 1. This section is the implementation.

### 7.1 Decision: build the `[lang]` segment now, with one locale

Do it in phase 1 even though only `de` ships. Moving every route under `app/[lang]` later means touching every page, layout, metadata export and link, which is exactly the refactor STRATEGY wants to avoid. The cost now is one folder level and a 40-line proxy.

**Segment name: `[lang]`** (aligned with UX §8.1 and `docs:02-guides/internationalization.md`). The `next/root-params` getter is then `lang()`. Root-param names must be valid JS identifiers (`docs:…/next-root-params.md`), which `lang` is.

### 7.2 `src/proxy.ts`

`middleware.ts` is deprecated in 16; the file is `proxy.ts` with the named export `proxy`, on the Node.js runtime (`docs:02-guides/upgrading/version-16.md` §middleware to proxy). The logic is pure string mapping with no I/O, so it adds about 1 ms:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, enabledLocales } from "@/i18n/config";
import { toInternalPath } from "@/i18n/pathnames";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // 1. /de or /de/… → 308 to the unprefixed URL (no duplicate content)
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  // 2. /en/services/seo → rewrite to the canonical folder /en/leistungen/seo
  const seg = pathname.split("/")[1];
  const locale = enabledLocales.find((l) => l !== defaultLocale && l === seg);
  const target = locale
    ? toInternalPath(locale, pathname.slice(locale.length + 1) || "/")   // localized slug → German folder
    : toInternalPath(defaultLocale, pathname);
  if (target === null) return;                                           // unknown pattern → [...rest] 404
  return NextResponse.rewrite(new URL(`/${locale ?? defaultLocale}${target}${search}`, req.url));
}

export const config = {
  matcher: ["/((?!_next/|api/|og/|stats/|.*\\.[a-z0-9]+$).*)"],         // skip assets, OG, analytics proxy, files
};
```

- `NextResponse.rewrite()` propagates the RSC headers automatically (`proxy.md` §RSC requests and rewrites), so client navigations work.
- Server Actions are POSTs to the page route, so they pass through the same rewrite (`proxy.md` §Execution order note). Exclusions in the matcher would also exclude actions; none of the excluded prefixes host forms.
- **The legacy English redirects** (`/projects → /projekte`, etc., UX §10.3) go in `next.config.ts` `redirects()` (`permanent: true` → 308), not in the proxy. Config redirects run before the proxy and stay declarative.
- `app/[lang]/layout.tsx`: `export const dynamicParams = false; export function generateStaticParams() { return enabledLocales.map((lang) => ({ lang })); }`. Every page stays statically prerendered.
- Unmatched URLs: `/foo` → rewrite `/de/foo` → `app/[lang]/[...rest]/page.tsx` → `notFound()` → the localized `app/[lang]/not-found.tsx` inside the real layout. `global-not-found.tsx` (experimental) isn't needed while every path funnels through the proxy; keep it as a fallback option only.

### 7.3 Pathnames and links

```ts
// src/i18n/pathnames.ts
export const pathnames = {
  home:          { de: "/",                       en: "/" },
  services:      { de: "/leistungen",             en: "/services" },
  service:       { de: "/leistungen/[service]",   en: "/services/[service]" },
  projects:      { de: "/projekte",               en: "/work" },
  project:       { de: "/projekte/[slug]",        en: "/work/[slug]" },
  about:         { de: "/ueber",                  en: "/about" },
  contact:       { de: "/kontakt",                en: "/contact" },
  contactThanks: { de: "/kontakt/danke",          en: "/contact/thanks" },
  websiteCheck:  { de: "/website-check",          en: "/website-check" },
  imprint:       { de: "/impressum",              en: "/imprint" },
  privacy:       { de: "/datenschutz",            en: "/privacy" },
} as const satisfies Record<string, Partial<Record<Locale, string>>>;
// ar and fa reuse the `en` pattern (UX §8.1); folders are always the `de` pattern.
export type RouteKey = keyof typeof pathnames;
```

- `href(lang, key, { params?, query?, hash? })` returns the public URL. It's typed so `href("de", "service", {})` is a compile error (missing `service`).
- **Don't enable `typedRoutes`.** It types the *internal* `/[lang]/…` file paths, not the public localized URLs, so it would type-check the wrong thing. `href()` is the typed layer.
- `LocaleLink` = `next/link` + `href()`. ESLint bans string literals starting with `/` in `href=` inside `src/components/**` (`no-restricted-syntax` on `JSXAttribute[name.name="href"] > Literal[value=/^\//]`).
- Slugs of entities (services, projects) are locale-neutral English-ish strings already (`website-erstellen-lassen`, `powerbowls`), so they don't need per-locale mapping. If a localized entity slug is ever needed, add `slugs: Partial<Record<Locale,string>>` to the fact entity and resolve it in `toInternalPath`.

### 7.4 Dictionaries and content

- `src/i18n/dictionaries/de.ts` is the source of truth: `export const de = { nav: {…}, cta: {…}, forms: {…}, a11y: {…}, placeholder: {…} } as const`.
- `type Dictionary = DeepStringify<typeof de>`. `en.ts` is `export const en: Dictionary = {…}`, so a missing or extra key is a **type error**, which is free key typing without a library.
- `getDictionary()` follows `docs:02-guides/internationalization.md` §Sharing the locale: `const l = await lang(); return dictionaries[l]()` with dynamic `import()`. The dictionaries are server-only (root-params imports fail in client components at build time), so they add 0 bytes of client JS. Client islands receive the strings they need as props.
- **Plurals and variables:** dictionary values may be functions: `projectsLive: (n: number) => pluralDe(n, "Projekt live", "Projekte live")`, built on `Intl.PluralRules` in `format.ts`. That's enough for six Arabic plural categories later. No ICU library.
- **Server Actions can't call `lang()`** (`docs:…/next-root-params.md`). Forms post a hidden `lang` field, validated against `enabledLocales` (UX §10.3 agrees).
- **Placeholder copy** (`Placeholder.tsx:15` "Placeholder: " for screen readers; `ProjectImage.tsx:96–99` English instructions) moves to `dict.placeholder.*`.

### 7.5 Metadata, hreflang, sitemap

- A single helper `buildMetadata({ key, params, title, description, availableIn })` returns `alternates: { canonical, languages: { de, en?, ar?, fa?, "x-default": enUrl (only once English exists; SEO §8.3) } }` (`docs:…/generate-metadata.md` §alternates), plus `openGraph.locale` (`de_DE`) and `alternateLocale`. It lists only locales where the content exists (`availableIn` from the content entity), never enabled-but-untranslated pages (UX §8.1).
- `sitemap.ts` emits `alternates.languages` per entry (`docs:…/01-metadata/sitemap.md` §Generate a localized Sitemap) and real `lastModified` values from a `updatedAt` field on content entities. It excludes `danke` and dev routes.
- `metadataBase` comes from `server/env.ts`, which **throws in production if `NEXT_PUBLIC_SITE_URL` is missing**. Today `site.ts:21` silently falls back to `http://localhost:3000`, so a misconfigured deploy emits localhost canonicals.
- `robots.ts`: drop `host: site.url` (`robots.ts:8`; the directive expects a host, not a URL) and add no disallow for `/danke` pages: they are `noindex` only, so crawlers can read the directive (SEO §7.3).

### 7.6 OG images

UX §10.3 keeps the `opengraph-image.tsx` file convention. Inside `app/[lang]`, the generated `og:image` URL is built from the *internal* route (`/de/projekte/powerbowls/opengraph-image…`). The proxy then 308-redirects that to an unprefixed path that has no file behind it. **Use `src/app/og/[...key]/route.tsx` instead:** a Route Handler returning `ImageResponse` (reusing `lib/og.tsx`) for known keys only, with `generateStaticParams` so images prerender at build. `buildMetadata` sets `openGraph.images` explicitly. The proxy matcher excludes `og/`. This is listed as alignment point A3. If a test shows Next 16 emits the public path for segment OG files, the file convention can stay.

The OG artwork gets German copy, uses Geist loaded from the font file (`readFile` of the `.woff` from `node_modules/geist` or a checked-in TTF) instead of `fontFamily: "sans-serif"` (`og.tsx:23`), and shows the four approved role titles from `site.roles` (`opengraph-image.tsx:12`), in order and unnumbered.

### 7.7 RTL readiness now

- Sweep the physical utilities (UX §8.3 counts about 40; locations listed in §10, item 12). Tailwind 4.3.3 provides `ms-/me-/ps-/pe-`, **`inset-s-*` / `inset-e-*`** (preferred; `start-*`/`end-*` still compile through a separate legacy code path), `border-s`, `rounded-s`, `text-start`, `scroll-ms`, plus `rtl:`/`ltr:` variants (verified in `node_modules/tailwindcss/dist/lib.js`).
- **Direction-aware motion in one place:** define `--dir: 1` on `:root` and `--dir: -1` on `[dir="rtl"]`, plus a utility `@utility nudge-x { translate: calc(var(--dir) * 0.25rem) 0; }`. Replace every `group-hover:translate-x-1` on arrows (`Button.tsx:57,106`, `NextProject`, `Footer`) with `group-hover:nudge-x`.
- `Icon` gets `directional?: boolean`, which applies `rtl:-scale-x-100`. `ArrowRight`, `ArrowLeft` and `ArrowUpRight` (`Icons.tsx:25–42`) are directional; `Plus` and `ArrowUp` aren't.
- `origin-left` (`ScrollProgress.tsx:13`, `Timeline.tsx:25`): CSS has no logical `transform-origin` keyword, so wherever a scale-from-start effect survives, use `origin-left rtl:origin-right` (allowlisted in the lint rule with an inline disable comment). Both current usages are deleted anyway.
- RTL type overrides (UX §8.4: tracking 0, no uppercase `t-label`, accent via weight) live in `styles/type.css` under `:root[dir="rtl"]`, so they're tested from day one with the styleguide's `dir` toggle.

### 7.8 `Intl` everywhere

`src/i18n/format.ts` is the only place that formats. The locale map follows UX §8.6 (`de-DE`, `en-GB`, `ar-u-nu-arab`, `fa-IR-u-nu-arabext-ca-gregory`).

```ts
formatPriceFrom(lang, amount: number | null, unit: "once" | "month"): string | null  // "ab 7.500 €", NBSP-joined
formatNumber(lang, n, opts?) · formatPercent(lang, n) · formatDuration(lang, ms)      // "1,4 s"
formatDate(lang, iso, style: "day" | "month")   // "8. Oktober 2026" / "Januar 2027"
addBusinessDays(date, n, holidays?: string[])    // Schnellcheck +2 (UX §6.4); DE public holidays list in facts
formatList(lang, items)                           // Intl.ListFormat: "Konzept, Design und Entwicklung"
typo(text)                                        // NBSP rules from UX §5.4: "ab 7.500 €", "z. B.", "§ 5 DDG"
```

`Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })` already outputs `7.500 €` with a narrow no-break space. Snapshot-test the exact output, because Node ICU updates have changed spacing characters before.

---

## 8 · Case study implementation

### 8.1 Content model

Use UX §10.2's types (`Metric`, `resultsStatus`, per-slug German copy) as specified. The engineering additions on top:

```ts
// content/facts/projects.ts (locale-neutral)
export type ProjectFacts = {
  slug: string;
  client: { name: string; city: string | null; industry: IndustryKey | null; url: string | null };
  services: ServiceSlug[];                       // drives service-page "Passendes Projekt" + FactSheet links
  launch: string | null;                         // "2026-03"
  role: RoleKey[] | null;                        // keys → dictionary labels; null = launch-blocking placeholder
  technologies: string[];                        // kept, rendered only inside "Technik im Detail"
  media: {
    screens: { desktop: StaticImageData; laptop: StaticImageData; mobile: StaticImageData; full?: StaticImageData };
    before?: { image: StaticImageData; year: string | null };
    artefacts: { image: StaticImageData; captionKey: string }[];
  };
  resultsStatus: Array<"measured" | "technical" | "pending" | "qualitative">;
  results: Metric[];                             // never invented; verified=false → not rendered
  testimonialId: string | null;
  links: { live: string | null; github: string | null };
  featured: boolean; order: number;
  availableIn: Locale[];                         // ["de"] — drives hreflang
  updatedAt: string;                             // sitemap lastModified
  capture?: { dismissSelector?: string };        // for scripts/capture-screens.ts
};
```

**Migration of `src/content/projects.ts`:** `title` → `client.name`. `category` splits into `industry` + `services`. `summary`, `overview`, `challenge` and `solution` move to `de/projects.ts`. `features` become `featureGroups` (German, grouped per UX §4.2). `screens()` is replaced by static imports. `ai` is dropped (`AiBadge` is deleted). The English facts currently in `projects.ts:88–173` were verified from the live sites (comment at line 83). Translate them, don't rewrite them, and keep `role`, `challenge` and `solution` as `null` until Reza fills them in.

### 8.2 Page composition

```
CaseHeader → FactSheet → ResultsBand → DeviceShowcase (fetchPriority on desktop screen)
→ CaseSection "Ausgangslage" (+ ClientQuote?) → CaseSection "Ansatz" (DecisionList, Artefact*, BeforeAfter?)
→ CaseSection "Umsetzung" (FeatureGroups + Disclosure "Technik im Detail" → TechnologyList)
→ CaseSection "Ergebnis" → Einblicke (ScrollPreview + PhoneFrame) → CreditsList → NextProject → FinalCta
```

- **Narrative vs. scannability.** The first screen answers everything a skimmer needs: H1 outcome, fact sheet, results band. `CaseToc` (≥ 1280) gives the long read a structure without JS. Each `CaseSection` opens with a one-sentence `Lead`, then detail. Decisions use a fixed **Entscheidung / Warum** pair, so they scan as a list.
- **`ResultsBand` state machine** (UX §4.4) is a pure function `resolveResults(project): {kind: "measured", metrics} | {kind: "technical", metrics} | {kind: "pending", plan} | {kind: "qualitative", items} | {kind: "mixed", …}`. It's unit-tested, so the four honest states can't regress into a fabricated number.
- **Technical metrics Reza can measure himself today** (PageSpeed mobile, LCP, CLS on the client sites) enter as `Metric` with `kind: "technical"`, `source: "PageSpeed Insights, mobil"`, `measuredAt` and `verified: true` **only after he has measured them**. The plan doesn't pre-fill any values.

### 8.3 Visuals

Keep `DesktopFrame`, `LaptopFrame` and `PhoneFrame` (pure CSS bezels, aspect-true) unchanged except for logical properties (`DeviceFrames.tsx:41,47,62–64` → `inset-s-1/2` with `rtl:translate-x-1/2`, though device chrome isn't mirrored per UX §8.3, so wrap device internals in `dir="ltr"`). Remove the glow (`DeviceShowcase.tsx:30`). The mobile stacked layout follows UX §7.5.

### 8.4 Structured data

`Article` (replaces today's `CreativeWork` in `projects/[slug]/page.tsx:51–63`; adds `author`, `datePublished`, `dateModified`) plus `about: { "@type": "Organization", name: client.name, address }`, `publisher: { "@id": "https://dotmind.de/#organization" }` (ProfessionalService from the root JSON-LD), `author: { "@id": "https://dotmind.de/ueber#reza-alami" }`, `inLanguage: "de"`, `dateCreated: launch`. Add `BreadcrumbList` (via `Breadcrumbs`). **No `Review`/`AggregateRating`** from testimonials (self-serving review policy). Stable `@id`s live in `lib/schema.ts`, so all pages reference one `Organization` and one `Person`.

---

## 9 · Trust and conversion implementation

UX §06 specifies fields, copy and states. This section is the pipeline behind them.

### 9.1 CTA components by intent

`CtaLink` (§3.3) is the only way to render a CTA. `FinalCta`, `ServiceHero`, `HomeHero`, `InvestmentBlock` and `MobileCtaBar` all compose it, so label, route and tracking are consistent. The "one primary per viewport" rule is mechanical: `PrimaryCtaObserver` (a single `IntersectionObserver` over `[data-primary-cta]`, exposed through React context) drives `HeaderCta` ghost/filled and `MobileCtaBar` visibility (UX §6.2, §7.3). A Playwright test scrolls `/` at 375 and 1440 in 200 px steps and asserts that at most one filled primary is in the viewport at each step.

### 9.2 Trust modules

| Module | Component | Data rule |
| --- | --- | --- |
| Proof strip | `ProofStrip` | verified metrics only; technical or pending fallback |
| Testimonial | `TestimonialQuote` / `Testimonials` | full name + role + company required by the type (no optional fields), so an anonymous quote can't compile |
| Founder card | `FounderSection` | portrait `StaticImageData \| null` |
| Process | `ProcessSteps` | `duration: string \| null` → placeholder (launch-blocking per UX §4.5) |
| Guarantees and ownership | `de/home.ts` `promises[]` rendered in `FinalCta` microcopy and `InvestmentBlock` | only true statements; Reza signs them off |
| Capacity / availability | `facts/site.ts` `capacity`, `availability` | rendered only when non-null (pending fact) |
| Site performance proof | `SiteFooter` | from `site-metrics.json` (CI-measured) |

### 9.3 Inquiry form (`InquiryForm`, UX §6.3)

**Files:** `src/components/forms/InquiryForm.tsx` (client), `src/app/[lang]/kontakt/actions.ts` (`"use server"`), `src/server/forms/schemas.ts`, `src/server/forms/spam.ts`, `src/server/forms/rate-limit.ts`, `src/server/mail/*`.

**Validation: zod v4 on the server only** (`docs:02-guides/forms.md` §Form validation names Zod). The schema never ships to the client, so it costs 0 bytes there. The client gets native constraint attributes (`required`, `type="email"`, `minLength={20}`) as progressive enhancement, plus `noValidate` once hydrated, so server messages (German, from the dictionary) are the single source of error copy.

```ts
// server/forms/schemas.ts
export const inquirySchema = z.object({
  lang: z.enum(enabledLocales),
  projectType: z.enum(["neu", "relaunch", "webapp", "seo", "anderes"]),
  website: z.string().trim().max(200).transform(normalizeUrl).optional(),   // accepts "firma.de"
  goal: z.string().trim().min(20).max(3000),
  budget: z.enum(["5-10", "10-20", "20-40", "40+", "unklar"]),
  start: z.enum(["asap", "1-3", "3-6", "offen"]).optional(),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.enum(serviceSlugs).optional(),                                  // from ?leistung=
});
export type InquiryState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<keyof z.infer<typeof inquirySchema>, ErrorKey>>; values: Record<string, string> }
  | { status: "error"; values: Record<string, string> };                     // success → redirect()
```

**Action pipeline** (`submitInquiry(prev, formData)`):

1. **Rate limit**: key = SHA-256(IP + daily rotating salt), never stored in clear. Limit 5 submissions per 10 min and 20 per day, in an in-memory LRU (single-instance EU host, §9.7). The interface `RateLimiter` allows swapping in a Redis store (EU region) if the deploy scales out. Over the limit → `{status:"error"}` with the direct-email fallback copy.
2. **Spam checks** (no third-party CAPTCHA, UX §6.3):
   - Honeypot: `<input name="firma_website" tabIndex={-1} autoComplete="off">` inside a wrapper with `aria-hidden` and `display:none` via a class (not inline `style`, which some bots skip). If it's filled, return a fake success: `redirect` to danke (UX: "don't teach bots").
   - Time trap: a hidden `ts` field = `${issuedAt}.${hmac(issuedAt, FORM_SECRET)}`, rendered server-side. Reject if the signature is invalid, faster than 3 s, or older than 24 h. A too-old token gets the normal error state ("Bitte erneut senden"), because it's a real user who left the tab open.
   - Content heuristic: more than 3 URLs in `goal` → silent drop.
3. **Validate** with `safeParse`. On failure, return `invalid` with errors and the **echoed values**, so inputs survive (UX: "inputs preserved").
4. **Deliver**: `await mail.send(notificationToReza)`. If that fails, return `{status:"error", values}`. Only after it succeeds, `after(() => mail.send(confirmationToSender))` (`docs:…/04-functions/after.md`). A failed confirmation never loses a lead.
5. `redirect(href(lang, "contactThanks", { query: { typ: "anfrage" } }))`. No PII in the URL.

`serverActions.bodySizeLimit` stays at the default 1 MB (no uploads). Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` in the deployment (`docs:02-guides/server-actions.md` §Security), because action IDs must stay stable across instances and restarts on a self-hosted deploy.

**Client component:**

```tsx
"use client";
export function InquiryForm({ dict, lang, defaultService, ts }: Props) {
  const [state, formAction, pending] = useActionState(submitInquiry, { status: "idle" });
  // On "invalid": focus <ErrorSummary> (tabIndex=-1, role="alert" not needed since focus announces it).
  // Each Field: id, <label htmlFor>, hint id, error id; aria-describedby="hint err"; aria-invalid.
  // <p role="status" aria-live="polite" className="sr-only">{pending ? dict.sending : ""}</p>
  // SubmitButton uses useFormStatus() → aria-busy, label "Wird gesendet …".
}
```

**Without JavaScript:** the `<form action={formAction}>` rendered by the server posts natively. The action runs, and either redirects (success) or re-renders the page with the returned state (React 19 progressive enhancement for `useActionState`). This is tested in Playwright with `javaScriptEnabled: false` (UX acceptance: "submits and validates without JavaScript").

**Prefill:** `/kontakt?leistung=seo#anfrage`. The page reads `searchParams` (this makes `/kontakt` dynamic). The alternative is a tiny client effect that reads `location.search` and sets `defaultChecked`, which keeps `/kontakt` static. **Decision: the client effect**, since `/kontakt` is a high-traffic conversion page and should be served static.

### 9.4 Schnellcheck form (UX §6.4)

The same pipeline with its own schema (`url` required and normalised, `email`, optional `firstName`, optional `newsletter` checkbox, default unchecked). If `newsletter` is ticked, the action calls `mail.subscribeDoubleOptIn(email, list)` (the provider sends the DOI mail; the contact isn't on the list until it's confirmed). Redirect to `/website-check/danke`, where the delivery date comes from `addBusinessDays(today, 2, deHolidays)`. To keep the page static, the date is computed **client-side** in a tiny inline script plus `suppressHydrationWarning` (`docs:02-guides/preventing-flash-before-hydration.md`), with server-rendered text „innerhalb von zwei Werktagen" as the no-JS fallback.

### 9.5 Email delivery

- **Provider: Brevo** (EU-based, AV-Vertrag available, transactional + DOI lists), called with `fetch` from `src/server/mail/brevo.ts`, so there's **no SDK dependency**. The interface `MailProvider { send(msg); subscribeDoubleOptIn(email, listId) }` lets you swap it. `dev-console.ts` logs instead of sending when `MAIL_PROVIDER=console` (local, preview).
- Templates are plain TS functions returning `{subject, text, html}` in German. The notification to Reza includes all fields plus `service`, `lang` and the referring route (from a hidden field). It never includes the IP.
- Reply-To on the notification = the sender's address, so Reza replies straight from his mail client.

### 9.6 Booking facade and analytics events

- `BookingEmbed` (UX §6.5): the idle panel is server-rendered markup passed in as children. The button click sets state → injects the provider's embed script → shows a skeleton at fixed `min-h` → on load, focuses the calendar heading. Optional "Kalender künftig direkt laden" goes to `localStorage` in a try/catch. If loading fails after 8 s, show the error state from UX §6.5. Booking success: the provider redirects to `/kontakt/danke?typ=termin` (configure that in the provider), and a `message` listener also fires the `booking_scheduled` goal where the provider posts events.
- **Event tracking (non-pushy):** `AnalyticsListener` adds **one** delegated `click` listener on `document`. For `[data-cta]` it sends `track("CTA", { intent, position, route })`. Further goals come from page code via `track()`: `Booking geöffnet`, `Termin gebucht`, `Anfrage gesendet` (fired on the danke page for `typ=anfrage`, so only completed submits count), `Schnellcheck angefordert`, `Live-Seite geöffnet` (`LiveLink`). `track()` is a no-op when Plausible isn't loaded or DNT is set. **There are no popups, exit-intent, countdowns, scroll-triggered modals or chat widgets**, and lint can't catch those, so they're on the PR review checklist.

### 9.7 Hosting assumption (affects §9.3 and §5.5)

STRATEGY §07 promises "EU hosting". The plan assumes a single-region EU Node deployment (`output: "standalone"` behind a reverse proxy on an EU provider, for example in Germany). That's what makes the in-memory rate limiter, `/api/vitals` storage and "EU hosting" claim true. If Reza chooses a global edge platform instead, three things change: the rate limiter moves to an EU Redis, the vitals sink moves to the platform's EU-region storage, and the FAQ wording on hosting must be reviewed. This is a decision for Reza, recorded as alignment point A8.

---

## 10 · Technical anti-patterns

### 10.1 Rules for the codebase going forward

1. **No content invented to fill a layout.** Use `null` → `Placeholder` (missing fact) or a designed pending state.
2. **No section-level `"use client"`.** Islands only (§5.4).
3. **No JS-gated visibility.** Server HTML must show every word and the LCP element at full opacity.
4. **No physical direction utilities** (lint, §3.6).
5. **No hard-coded routes or UI strings in components** (lint, §3.6, §7.3).
6. **No `next/image` `priority`**, and at most one `fetchPriority="high"` per route.
7. **No third-party request before an explicit user action** (fonts self-hosted, analytics proxied, booking two-click).
8. **No scroll-jacking, auto-cycling content, custom cursors or moving click targets.**
9. **No client-side form validation as the source of truth.** The server schema decides.
10. **No `Date` at render time in static pages** without accepting that the value freezes at build (see 10.2, item 14).

### 10.2 Found in the current code

UX §9.2 lists the visual and positioning anti-patterns (AI layer, numbering, glows, smart home, wordmark). These are the **technical** ones, which UX §9.2 doesn't cover or covers only partly:

| # | File:line | Problem | Fix (step in §11) |
| --- | --- | --- | --- |
| 1 | `components/projects/DeviceFrames.tsx:11,16`, `ProjectImage.tsx:12,43`, `DeviceShowcase.tsx:13,34`, `app/projects/[slug]/page.tsx:106,113`, `app/projects/page.tsx:41` | `priority` prop is **deprecated in Next 16** (`image.md` §priority) | `fetchPriority="high"` on the single LCP image (S7) |
| 2 | `app/projects/page.tsx:41` | `priority={n < 2}` preloads two images; on mobile the second is below the fold | none on the index (S7) |
| 3 | `components/projects/DeviceShowcase.tsx:20–25,33` | The **LCP image** sits inside `motion.div initial={{opacity:0}}`, so it's invisible until hydration + `whileInView` + a 1.1 s animation, and LCP is delayed by the whole JS boot | render visible on the server; CSS-only entrance under `no-preference` (S7) |
| 4 | `components/motion/AnimatedText.tsx:47` + `lib/motion.ts:55–58` (`reveal.line` = `y:"110%"`, no opacity) with `app/layout.tsx:57–59` | The `<noscript>` fallback only un-hides `[style*="opacity:0"]`, but `AnimatedText` hides words with a **transform only**. **Every `SectionHeading` h2 stays clipped without JS**, and on slow connections until hydration. | delete `AnimatedText`; CSS `Reveal` (S1) |
| 5 | `components/motion/Reveal.tsx:21–27`, `TokenStream.tsx:44` | Content server-rendered at `opacity:0` and revealed by JS | CSS `animation-timeline: view()` reveal (S1) |
| 6 | `app/layout.tsx:68–76`, `components/motion/Providers.tsx:8`, `components/layout/Navigation.tsx:3` | Full Motion bundle (`MotionConfig`, `AnimatePresence`, `useScroll`) in the shared chunk of every route | no Motion in phase 1; `LazyMotion` gate (S1, S5) |
| 7 | `app/template.tsx:6` | 0.6 s fade-up on **every** render including first load, so all content paints at opacity 0 | delete; `<ViewTransition>` on navigations only (S1) |
| 8 | `components/layout/Navigation.tsx:128–140` | Mobile menu `role="dialog" aria-modal` without a focus trap or `inert` background; Tab escapes into the page | native `<dialog>.showModal()` (S5) |
| 9 | `components/layout/Navigation.tsx:18–24` | Whole header is a client component to toggle a background on scroll | server header + islands (S5) |
| 10 | `components/projects/ScrollPreview.tsx:20–25` | Focusable `div` with `aria-label` and no role (ARIA prohibits names on generic elements); hover-only reveal | `figure` + `<details>` expand (S7) |
| 11 | `components/motion/ScrollText.tsx:44` (used `home/Intro.tsx:18`, `app/about/page.tsx:122`) | Body text at 20 % opacity until scrolled fails 1.4.3 | delete (S1) |
| 12 | `layout.tsx:64` (skip link `left-4`), `ui/Button.tsx:24–25` (`pl-7 pr-6`), `layout/Navigation.tsx:87,96,102`, `home/Process.tsx:29,35,38`, `home/Timeline.tsx:25,32,35,38`, `home/Intelligence.tsx:81,88`, `home/Expertise.tsx:24`, `home/Hero.tsx:23–24`, `projects/ProjectCard.tsx:70`, `projects/DeviceShowcase.tsx:38,45`, `projects/ScrollPreview.tsx:18`, `projects/ProjectImage.tsx:81`, `projects/DeviceFrames.tsx:41,47,62–64`, `motion/ScrollProgress.tsx:13`, `motion/CustomCursor.tsx:71,100` | Physical direction utilities (RTL blocker) | logical sweep + lint (S3) |
| 13 | `ui/Icons.tsx:25–42`, `ui/Button.tsx:57,106` | Directional arrows and hover nudges not direction-aware | `Icon directional`, `nudge-x` (S3) |
| 14 | `layout/Footer.tsx:7`, `home/Hero.tsx:39` | `new Date().getFullYear()` in statically prerendered pages freezes at build time; it would also error under `cacheComponents` | Footer year from build time is acceptable with a note; the Hero usage is deleted (S5) |
| 15 | `content/site.ts:21` | `NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000`, so a missing env var silently ships localhost canonicals, sitemap and OG URLs | `server/env.ts` throws in production (S2) |
| 16 | `app/layout.tsx:51`, `content/site.ts:22`, `app/layout.tsx:21,66` | `lang="en"`, `en_US`, English title and skip link | `[lang]` layout + dictionary (S2) |
| 17 | `app/robots.ts:8` | `host` set to a full URL | remove (S11) |
| 18 | `app/sitemap.ts:6–16` | Hard-coded route list, no `lastModified`, no alternates | generated from `pathnames` + content (S11) |
| 19 | `app/opengraph-image.tsx:12`, `lib/og.tsx:23` | OG footer uses `site.roles` (keep, with the four approved titles); generic `sans-serif` instead of Geist | `og/[...key]` route + Geist font (S11) |
| 20 | `app/not-found.tsx:7–8` | Manual `<title>` and `<meta robots>`; Next already injects `noindex` for 404 responses (`not-found.md` §Metadata) | localized `[lang]/not-found.tsx` with `metadata` (S10) |
| 21 | `app/contact/page.tsx:25–29,50` | Primary CTA falls back to `#channels` when the email is null: a primary button that does nothing | `InquiryForm` + booking (S9) |
| 22 | `home/SectionHeading` callers (`Expertise.tsx:12`, `Background.tsx:10`, `Technologies.tsx:13`, …) | Hard-coded section indices `"03"`, `"06"`, … break whenever sections are reordered | index prop removed (UX) (S1) |
| 23 | `components/home/HeroField.tsx:205–208` | Global `pointermove` listener stays attached while the hero is offscreen | component deleted (S1) |
| 24 | `components/home/Intelligence.tsx:1`, `Process.tsx:1`, `Timeline.tsx:1` | Whole sections client-rendered for one effect | deleted or rebuilt as server components (S1, S6) |
| 25 | `app/projects/[slug]/opengraph-image.tsx` + future `app/[lang]` | Segment OG files would emit internal `/de/…` URLs under the proxy rewrite | §7.6 (S11) |

---

## 11 · Final handoff: roadmap and build order

### 11.1 Phases (aligned with STRATEGY §09)

| Phase | Frontend scope | Exit trigger (STRATEGY) |
| --- | --- | --- |
| **1 · months 0–6** | Steps S0–S12 below: German site, 3 service pages, 3 case studies, forms, booking, legal, analytics, CI | ≥ 2 qualified inquiries/week |
| **2 · months 6–18** | `en` locale (dictionary + content, `enabled`), `LanguageSwitcher`, `/branchen/[industry]` (service template), `/wissen/[article]` (MDX, `docs:02-guides/mdx.md`), Kostenrechner (client island with a server-side price table), brand phase 2 (`BrandMark`, `voice: "wir"`), network page | recurring revenue covers fixed costs |
| **3 · month 18+** | `ar`, `fa` (fonts, RTL QA), `/team`, `/karriere`, client portal (separate app or route group with auth; out of scope here) | — |

### 11.2 Build order, phase 1

This refines UX §10.5 with engineering steps, dependencies, effort (focused days, one developer) and definitions of done. It adds S0 (tooling) and moves the i18n skeleton before the tokens, because every later file is created under `app/[lang]`.

| Step | Work | Depends on | Effort | Files changed | Definition of done |
| --- | --- | --- | --- | --- | --- |
| **S0 · Tooling and CI** | ESLint rules (§3.6), `typecheck` script, Playwright + axe, Lighthouse CI workflow, `next experimental-analyze` check, `check-content` script stub | — | 1.5 d | `package.json`, `eslint.config.mjs`, new `.github/workflows/ci.yml`, `lighthouserc.json`, `playwright.config.ts`, `scripts/*` | CI runs on PRs; lint passes on a clean tree (physical-utility rule in warn mode until S3) |
| **S1 · Clean-up** (UX §10.5-1) | Delete per UX §9.2 and §10.2 items 4–7, 11, 22–24: `HeroField`, `NeuralDiagram`, `Intelligence`, `Intro`, `Expertise`, `Technologies`, `Background`, `TokenStream`, `ScrambleText`, `ScrollText`, `Spotlight`, `CustomCursor`, `ScrollProgress`, `AiBadge`, `AnimatedText`, `Providers`, `template.tsx`, `.ai-*` and `.grain` CSS. CSS `Reveal`. | S0 | 1 d | `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/motion/*`, `components/home/*`, `components/ui/SectionHeading.tsx` | build passes; `grep -r "motion/react" src` → 0; pages fully visible with JS disabled |
| **S2 · i18n skeleton** (UX §10.5-3) | `app/[lang]` move, `proxy.ts`, `i18n/config`, `pathnames`, `href`, `get-dictionary` (root params), `format.ts` + tests, `[...rest]` 404, legacy 308s in `next.config.ts`, `server/env.ts` | S1 | 2 d | all `app/**` files move; `next.config.ts`; new `src/proxy.ts`, `src/i18n/*`, `src/server/env.ts` | `/leistungen` resolves (stub); `/de/leistungen` → 308; `/projects/powerbowls` → 308 `/projekte/powerbowls`; `<html lang="de">`; unknown URL → German 404 |
| **S3 · Tokens, type, logical CSS** (UX §10.5-2) | Split `globals.css` into `styles/*`; semantic tokens + light theme + no-flash script + `ThemeToggle`; UX type scale + hyphenation; rhythm tokens; logical sweep (§10.2 items 12–13); `Icon directional`; print CSS | S2 | 2.5 d | `app/globals.css` → `src/styles/*`, every component using palette classes, `ui/Icons.tsx`, `ui/Button.tsx` | 0 physical utilities (lint at error level); `accent` ≥ 4.5:1 in both themes; `(dev)/styleguide` renders both themes + RTL toggle |
| **S4 · Content models** (UX §10.5-4) | `content/types.ts`, `facts/*`, `de/*`, static-import media (move `public/projects` → `content/media`), `check-placeholders`/`check-content` scripts, `resolveResults` + tests; delete `profile.ts` and the smart home content | S2 | 2 d | `content/site.ts`, `content/projects.ts`, `content/profile.ts` (delete), new `content/facts/*`, `content/de/*`, `public/projects/*` (move) | `tsc` passes; placeholder report lists every launch-critical `null`; no "Smart Home" string in `src` |
| **S5 · Global chrome** (UX §10.5-5) | `SiteHeader` (server) + `NavLinks`, `HeaderCta`, `MobileMenu` (`<dialog>`), `PrimaryCtaObserver`, `MobileCtaBar`, `SiteFooter`, `BrandMark`, `SkipLink`, `Breadcrumbs`, `AnalyticsListener`, `LegalPage` + `/impressum`, `/datenschutz` shells | S3, S4 | 2.5 d | `layout/Navigation.tsx` → `SiteHeader.tsx`, `layout/Footer.tsx` → `SiteFooter.tsx`, `app/[lang]/layout.tsx` | keyboard: menu traps and returns focus; axe 0; only one filled primary per viewport (Playwright) |
| **S6 · Homepage** (UX §10.5-6) | 12 sections in order; `ComparisonTable`, `ProcessSteps`, `FaqList` + JSON-LD | S5 | 4 d | `app/[lang]/page.tsx`, `components/sections/home/*`, `components/home/*` (delete remainder) | UX §10.3 home acceptance; LHCI budgets green on `/`; 320 px overflow test green |
| **S7 · Case studies** (UX §10.5-7) | `/projekte`, `/projekte/[slug]`, `ResultsBand` states, `CaseToc`, `DeviceShowcase` server + CSS parallax + mobile layout, `ScrollPreview` disclosure, capture script, remove `priority` | S5 | 3.5 d | `app/[lang]/projekte/**`, `components/projects/*`, `components/sections/case/*`, `scripts/capture-screens.ts` | LCP < 2.0 s on `/projekte/powerbowls` (mobile LHCI); no `verified:false` metric rendered (unit test); works without JS |
| **S8 · Service pages** (UX §10.5-8) | `/leistungen`, `/leistungen/[service]`, `PriceFrom`, `InvestmentBlock`, `SchnellcheckStrip` | S6 (shared sections), S7 (`CaseStudyFeature`) | 2.5 d | `app/[lang]/leistungen/**`, `components/sections/service/*` | UX §10.3 service acceptance; `?leistung` prefill; `Service` JSON-LD validates |
| **S9 · Conversion flows** (UX §10.5-9) | Forms primitives, `InquiryForm` + action, `SchnellcheckForm` + action, spam/rate-limit, Brevo provider + templates, `BookingEmbed`, both danke pages, Plausible proxy + goals, `/api/vitals` | S5, S8 | 4.5 d | `app/[lang]/kontakt/**`, `app/[lang]/website-check/**`, `components/forms/*`, `components/islands/*`, `src/server/**`, `next.config.ts` (rewrites), `instrumentation-client.ts` | both forms submit and validate with JS off; axe 0 in error states; no third-party request before "Kalender laden" (Playwright network assertion); honeypot and fast-submit are silently accepted; mail failure keeps the inputs |
| **S10 · About + 404** (UX §10.5-10) | `/ueber` founder page, localized 404 | S5 | 1.5 d | `app/[lang]/ueber/page.tsx` (from `app/about`), `app/[lang]/not-found.tsx` | `ProfilePage` JSON-LD; "ich" voice check passes |
| **S11 · SEO** (UX §10.5-11) | `buildMetadata`, hreflang, sitemap + robots, `og/[...key]` route, JSON-LD graph with stable `@id`s | S6–S10 | 1.5 d | `app/sitemap.ts`, `app/robots.ts`, `lib/og.tsx`, `app/opengraph-image.tsx` + `app/projects/[slug]/opengraph-image.tsx` (delete), new `app/og/**`, `lib/schema.ts` | Rich Results Test passes for home/service/case; OG URLs return 200 without redirects; sitemap excludes danke |
| **S12 · QA and launch gate** (UX §10.6) | Full axe + manual screen-reader pass, LHCI on all routes, placeholder gate at 0 on launch-critical routes, pseudo-locale and RTL smoke test, print check, cookie check, `site-metrics.json` published | all | 2 d | — | every UX §10.6 item checked; STRATEGY §10 budgets met |

**Total: about 32 focused days** (≈ 6.5 weeks for one developer). That's longer than STRATEGY's "weeks 3–5 build" estimate. The difference is S0, S9's no-JS, spam and mail hardening, and S12. The critical path is S0 → S1 → S2 → S3 → S5 → S6 → S8 → S9 → S12. S4 runs in parallel with S3, and S7 and S10 in parallel with S6 if a second person is available. **Reza's decisions (STRATEGY §10) block only content, never the build.** Every step ships with placeholders until the facts arrive, and S12 is the gate that requires them.

---

## Alignment with UX-DIRECTION.md

*Update, October 2026: the cross-document decisions (service URLs, `Article` schema, absolute `@id`s, noindex-only thank-you pages, x-default, role titles) are recorded in `STRATEGY.md` §11 and override this plan where they differ.*

This plan follows UX-DIRECTION.md's routes, component names, section orders, copy, tokens and i18n strategy. The points below are where engineering adds a constraint or disagrees. Each one has a proposed resolution.

| # | Topic | UX-DIRECTION says | This plan | Resolution |
| --- | --- | --- | --- | --- |
| A1 | Image priority props | `priority?` on `CaseStudyFeature`, `CaseStudyCard`, `DeviceShowcase` (§10.4) | `priority` is deprecated in Next 16; use `fetchPriority="high"` on one image per route | Rename the props to `fetchPriority`; drop them on cards |
| A2 | `Reveal` / `Stagger` | Keep (shorter distances), Motion-based | Same API, CSS scroll-driven, no JS; fixes no-JS invisibility (§10.2, items 4–5) | Adopt the CSS version; the UX visual spec (8 px, 0.45 s) is unchanged |
| A3 | OG images | Keep `opengraph-image.tsx` per project (§10.3) | Inside `app/[lang]` under a rewrite, emitted URLs would include `/de/`, which the proxy 308s to a non-existent path | Use a route handler at `app/og/[...key]`; revisit if a build test proves otherwise |
| A4 | `SiteHeader` | Client component (§10.1) | Server component with three small islands (`NavLinks`, `HeaderCta`, `MobileMenu`) | Same behaviour, less JS; no UX change |
| A5 | Theme default | §5.3: no `data-theme` = dark, not "system"; §10.4: toggle „Hell · Dunkel · System" | Three-state toggle; *initial* state = Dunkel; "System" is opt-in | Resolves the internal UX inconsistency in favour of §5.3 |
| A6 | `useInputFocused` hook | Hook for `MobileCtaBar` | CSS `body:has(:focus)` instead, so no JS | Behaviour identical |
| A7 | Prefill on `/kontakt` | Reads `?leistung` (implies `searchParams` → dynamic) | Client-side prefill keeps `/kontakt` static | Behaviour identical; better TTFB |
| A8 | Hosting | Not specified | "EU hosting" claim (STRATEGY §07) implies a single-region EU Node deploy; the rate-limiter and vitals sink depend on it | **Reza decides**; §9.7 lists what changes otherwise |
| A9 | Build order | §10.5: clean-up → tokens → i18n → content | S0 tooling first; i18n before tokens (every file moves into `app/[lang]` once) | Reorder only; same deliverables |
| A10 | Legal pages | MDX acceptable | Structured TS first (no MDX dependency); MDX only if the generator delivers long prose | Defer the decision to when the legal text arrives |
| A11 | `ScrollPreview`, `DeviceShowcase` | Listed as client components | Both become server components (the `<details>` expand and CSS parallax need no JS) | No visual change |
