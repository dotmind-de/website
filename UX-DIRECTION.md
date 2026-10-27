# Reza Alami: UX & UI Direction

The UX, UI and implementation plan for turning the current English portfolio into the German-first, founder-led client-acquisition site described in [`STRATEGY.md`](./STRATEGY.md), built on the visual system in [`DESIGN.md`](./DESIGN.md).

> **Decisions, October 2026:** the decision log in `STRATEGY.md` §11 is binding. Where anything below differs from it, the decision log wins.

- **Status:** v1 · October 2026 · pre-implementation
- **Reads with:** `STRATEGY.md` (what and why), `DESIGN.md` (tokens and look). This document covers the **how**: structure, behaviour, components, states.
- **Audience:** the Frontend Developer implementing it, and Reza for content decisions.
- **Language rule:** real UI strings are written in German, ready to ship. Explanations are in English.
- **Honesty rule:** no invented results, quotes, metrics, durations or prices. Anything Reza has not confirmed is a `null` in content and renders through the existing `<Placeholder>`. Section 04.5 separates a *missing fact* (placeholder) from a *fact that doesn't exist yet* (a designed, publishable pending state).

---

## Contents

1. [UX strategy](#01--ux-strategy)
2. [Site architecture](#02--site-architecture)
3. [Homepage blueprint](#03--homepage-blueprint)
4. [Case study UX](#04--case-study-ux)
5. [UI direction](#05--ui-direction)
6. [Trust & conversion design](#06--trust--conversion-design)
7. [Mobile-first](#07--mobile-first)
8. [Multilingual UX](#08--multilingual-ux)
9. [Anti-patterns (and what's in the code today)](#09--anti-patterns)
10. [Developer handoff](#10--developer-handoff)

---

## 00 · Verdict on the current build

The foundation is good: editorial grid, restrained palette, CSS-driven hero reveals that run before hydration, full reduced-motion handling, an honest placeholder system and a solid device-screenshot pipeline. The problem is what the system currently *says*. The homepage sells "AI specialist, four disciplines, smart home" to nobody in particular, and the decorative AI layer (neural canvas, token stream, scramble text, gradient sheen) makes the site look like the generic AI-era portfolio it wants to avoid.

| Keep | Change | Remove |
| --- | --- | --- |
| `shell`, `grid-editorial`, 4 → 8 → 12 columns | Colour tokens move to semantic names, and a light theme is added (§05.3) | `HeroField`, `NeuralDiagram`, `TokenStream`, `ScrambleText`, `.ai-gradient-text`, `.ai-sheen`, `AiBadge` |
| `Placeholder` / `OrPlaceholder` | `SectionHeading`: drop the `(01)` index prop | `CustomCursor` and `cursor: none` |
| `DeviceFrames`, `DeviceShowcase`, `ScrollPreview`, `ProjectImage` | `ProjectCard` becomes `CaseStudyFeature`: outcome first, tech list removed | `ScrollText` (word-by-word opacity scrubbing) |
| `ButtonLink`, `ArrowLink`, `link-underline` | `ButtonLink` gains `intent` + `data-cta` tracking, a `<button>` variant, and ghost/filled switching for the header | `Spotlight` and the boxed `ClosingCTA` |
| CSS `line-mask` hero reveal, `fade-in` | `Process` becomes 5 steps with duration and deliverable; the scroll-filled rail is replaced by a static rail | `Intelligence`, `Expertise`, `Intro`, `Technologies`, `Background` from the homepage |
| `Reveal` / `Stagger` (shorter distances) | `Navigation`: German labels, no numbering, the CTA routes to booking | `ambient-drift` gradient blobs, the `animate-ping` dot, the scroll cue |
| Reduced-motion strategy | `Footer`: legal links, contact details, language and theme controls | Oversized gradient footer wordmark, `ScrollProgress` |
| Mobile menu focus management | `PageHeader`: no forced multi-line slogans | Smart home from every content file and from the JSON-LD |
| `next/font` (self-hosted at build, so no Google requests) | Contact page: booking plus a qualifying form instead of `mailto` | Grain overlay at `z-90` above content |

---

## 01 · UX strategy

### 1.1 The one job

Every page answers one question: **"Is this the person who will get my business more qualified inquiries, and what do I do next?"** Decoration that doesn't help answer it gets cut.

### 1.2 Entry points and what each visitor needs first

| Entry | Lands on | Mindset | First 5 seconds must show | Path to inquiry |
| --- | --- | --- | --- | --- |
| **Google, service search** („Webdesign Duisburg", „Bestellsystem Restaurant", „Website Relaunch Agentur") | `/leistungen/[service]` (phase 2: `/branchen/[industry]`) | Comparing vendors, price-sensitive, wary | The service named as an outcome, an „ab" price, one matching case study visible on scroll | Service hero → case study → Investition → **Projekt anfragen** (prefilled) or **Erstgespräch** |
| **Google, local / brand search** („Reza Alami", Google Business Profile) | `/` | Checking legitimacy after a referral or GBP view | Real face and name, real projects, location, response promise | Hero → proof strip → projects → founder → **Erstgespräch** |
| **LinkedIn** (Reza's posts, profile link) | `/` or a case study linked from a post | Knows Reza personally, curious what he sells | The offer in three items, prices, the founder link back to the person | Services → projects → **Erstgespräch** |
| **Referral** (client, tax advisor, partner agency) | `/` or `/kontakt` directly | Already half-convinced; needs confirmation and a low-friction next step | Booking within one click, availability, what happens next | Header CTA → **Erstgespräch**, or contact form |
| **Direct / return visit** (after a proposal, before a call) | `/projekte/[slug]`, `/ueber`, `/leistungen/*` | Verifying before signing; often a second decision maker (Geschäftsführer, partner) | Depth: process, ownership, DSGVO, FAQ, legal polish | FAQ → **Projekt anfragen** |
| **Researching, not ready** | Any page | Low intent | A no-risk way to get value now | **Website-Schnellcheck** |

**Design consequence:** service pages and case studies are landing pages, not sub-pages. Each one stands alone: own hero CTA, own proof, own FAQ, own final CTA. The homepage is the hub for brand and referral traffic. It is not the only door in.

### 1.3 Personal brand vs. future agency

Use one endorsed-brand rule, built as data, so phases 1 → 2 → 3 are config changes and not redesigns.

| Element | Phase 1 (now) | Phase 2 | Phase 3 |
| --- | --- | --- | --- |
| Header wordmark | **dotMind** wordmark + „by Reza Alami" as a mono label beside it (desktop; mobile: wordmark only, endorsement in the menu and footer) | same | **dotMind** only |
| Voice | „ich" / „Sie" | „wir" / „Sie" | „wir" |
| Hero byline | Portrait + „Reza Alami · Software Engineer · AI Specialist · Web & App Developer · Digital Marketer" | Portrait + „Gegründet von Reza Alami" | None (moves to `/ueber`) |
| Founder section on home | Full section (strongest trust element) | Shorter, plus a network strip | Moves to `/ueber` and `/team` |
| `/ueber` label | „Über mich" | „Über uns" | „Über uns" |
| JSON-LD | `ProfessionalService` with `founder: Person` | Same | Same plus `employee[]` |

Implement this with `site.brandPhase: 1 | 2 | 3` and a `BrandMark` component that reads it. One constant switches the whole site's voice-dependent labels, using dictionary keys like `nav.about.p1` / `nav.about.p2`.

**"wir" check:** "wir" meaning Reza *and the client together* („Gemeinsam klären wir Ihre Ziele") is fine in phase 1. "wir" meaning a company („Wir sind ein Team aus…") is forbidden until phase 2.

### 1.4 From first impression to inquiry

How a cautious owner moves through the page:

```
Recognition      "This is for businesses like mine."        → Hero headline + sub-line naming the audience
Credibility      "They've done it for real businesses."      → Proof strip, then case studies
Relevance        "They understand my problem."               → Problem section in the client's words
Offer clarity    "I know what I'd buy and roughly the cost." → Three services with "ab" prices
Risk reduction   "I won't get burned."                       → Comparison, process, founder, FAQ (ownership, DSGVO)
Action           "The next step is small and clear."         → One primary CTA per viewport; three intent levels
Reassurance      "I know what happens after I click."        → Confirmation state with the next 3 steps
```

Three rules come out of this:

1. **Show price before the call.** „ab" prices on the homepage, the service pages and in the FAQ. Hiding them costs trust with German owners.
2. **Say what happens next at every CTA.** Each primary CTA has a line of microcopy under or beside it („30 Minuten · kostenlos · Antwort in 24 Std.").
3. **Never dead-end.** Every page ends in the final CTA block. Every success state offers the next intent level.

---

## 02 · Site architecture

### 2.1 Route map (phase 1)

German slugs at the root, no locale prefix. Existing English routes get 308 redirects.

| Route | Page | Replaces | Indexed |
| --- | --- | --- | --- |
| `/` | Homepage | `/` | yes |
| `/leistungen` | Services overview | (new) | yes |
| `/leistungen/website-erstellen-lassen` | Conversion-Website (new build) | (new) | yes |
| `/leistungen/website-relaunch` | Website-Relaunch | (new) | yes |
| `/leistungen/web-app-entwicklung` | Web-Apps & Portale | (new) | yes |
| `/leistungen/seo` | SEO & Sichtbarkeit | (new) | yes |
| `/leistungen/wartung-hosting` | Wartung, Hosting & Sicherheit | (new) | yes |
| `/projekte` | Case study index | `/projects` (308) | yes |
| `/projekte/[slug]` | Case study | `/projects/[slug]` (308) | yes |
| `/ueber` | Founder page | `/about` (308) | yes |
| `/kontakt` | Booking + qualifying form | `/contact` (308) | yes |
| `/kontakt/danke` | Inquiry / booking confirmation | (new) | **noindex** |
| `/website-check` | Free Schnellcheck + paid Website-Check | (new) | yes |
| `/website-check/danke` | Schnellcheck confirmation | (new) | **noindex** |
| `/impressum` | Legal notice (§ 5 DDG) | (new) | yes |
| `/datenschutz` | Privacy policy | (new) | **noindex, follow** |
| `not-found` | 404 | existing, German copy | no |

**Navigation (desktop):** `Leistungen · Projekte · Über mich · Kontakt` plus the CTA button **Erstgespräch vereinbaren**. There is no dropdown in phase 1. „Leistungen" goes to the overview, because three services don't need a mega-menu. Add a disclosure menu in phase 2 once there are five or more service and industry pages.

**Footer:** Leistungen (3 links) · Projekte · Über mich · Kontakt · Website-Schnellcheck · Impressum · Datenschutz · contact details · languages (phase 2) · Darstellung (theme).

**Phase 2/3 routes** follow `STRATEGY.md` §06 without changes. `/branchen/[industry]` and `/wissen/[article]` reuse the service-page and case-study templates.

### 2.2 Homepage section order

The 12 sections from `STRATEGY.md` §05, in that order. Full blueprint in §03.

```
01 Hero · 02 Proof strip · 03 Problem · 04 Leistungen · 05 Ausgewählte Projekte
06 Der Unterschied · 07 Ablauf · 08 Founder · 09 Testimonials* · 10 Schnellcheck
11 FAQ · 12 Final CTA + Footer
* rendered only when ≥ 2 real testimonials exist
```

### 2.3 Service page structure (`/leistungen/[service]`)

One template for all three services, driven by `services.ts`.

| # | Section | Content | CTA |
| --- | --- | --- | --- |
| 1 | **Outcome hero** | Eyebrow: service name. Byline: the role titles this service draws on (CONTENT-SYSTEM Part 5). H1: outcome („Eine Website, die aus Besuchern Anfragen macht."). Lead: who it's for + what's included in one sentence. Price line: „ab 7.500 € · Festpreis nach Analyse". Microcopy. | Primary **Erstgespräch vereinbaren** · text link „Oder schriftlich anfragen →" |
| 2 | **Passt, wenn … / Passt nicht, wenn …** | Two short lists, 3 items each. Selectivity signals premium and filters out mismatches. | none |
| 3 | **Problem → Ergebnis** | 3 rows: the client's pain in their words → what changes. | none |
| 4 | **Leistungsumfang** | Deliverables grouped into 3–4 groups (Strategie · Design · Entwicklung · Sichtbarkeit), each a short list. Ends with „Code und Inhalte gehören Ihnen." | none |
| 5 | **Passendes Projekt** | One `CaseStudyFeature` (`project.services` includes this slug), results band visible. | „Projekt ansehen →" |
| 6 | **Ablauf** | Service-specific steps with duration and deliverable (shared `ProcessSteps` component). | none |
| 7 | **Investition** | „ab" price, what drives the price (3 factors), the care plan as an add-on („Wartung & Hosting ab 149 €/Monat"), payment terms placeholder. | Primary **Projekt anfragen** (prefills `?leistung=<slug>`) |
| 8 | **FAQ** | 4–6 service-specific questions. | none |
| 9 | **Schnellcheck strip** | One-line tertiary offer with an inline URL field. | Tertiary **Schnellcheck anfordern** |
| 10 | **Final CTA** | Shared `FinalCta`. | Primary **Erstgespräch vereinbaren** |

`/leistungen` (overview): H1, the three lead services as large rows (same `ServiceRow` as the homepage, expanded), a „Für bestehende Kunden" block with the three secondary services and prices, the Schnellcheck strip, 3 general cost FAQs, and the final CTA.

### 2.4 Case study structure (`/projekte/[slug]`)

Results first, then Ausgangslage → Ansatz → Umsetzung → Ergebnis. Full spec in §04.

```
Breadcrumb · Eyebrow (Branche · Stadt · Jahr) · H1 outcome headline · Fact sheet
Results band (3 metrics, or the designed pending state)
Device composition
Ausgangslage (+ client quote if available)
Ansatz: 2–4 key decisions with reasons + artefacts
Umsetzung: what the client got (features grouped) · "Technik im Detail" (collapsed)
Ergebnis: metrics in context · quote · what happened next
Screens (full-page scroll preview + mobile)
Rolle & Credits
Next project · Final CTA
```

### 2.5 About page structure (`/ueber`)

A founder page, not a CV. Order:

1. **Header:** portrait (4:5, large) beside H1 „Warum ich Entwicklung und Marketing nicht trenne." Role line under the H1: **Software Engineer · AI Specialist · Web & App Developer · Digital Marketer**. Lead: one-sentence promise.
2. **Warum es mich gibt:** 2–3 paragraphs: background in software engineering → professional web development → Meta digital-marketing training → why one accountable person beats three vendors. Uses only facts already in `profile.ts`. Everything else is a placeholder.
3. **Wie ich arbeite:** 4 principles as numbered-free rows: *Ein Ansprechpartner* · *Code und Inhalte gehören Ihnen* · *Messbar statt gefühlt* · *Datenschutz von Anfang an*.
4. **Was ich nicht mache:** 3–4 refusals („Keine Baukasten-Templates.", „Keine Versprechen auf Platz 1 bei Google.", „Keine Verträge, die Sie an mich binden.").
5. **Kapazität:** „Ich übernehme maximal [4] neue Projekte pro Quartal. Nächster freier Projektstart: [Monat]." (both placeholders until Reza confirms).
6. **Werdegang:** compact factual list (existing `journey` data, periods as placeholders), *below* the story.
7. **Fakten:** Standort · Sprachen · Rechtsform · Arbeitsweise (remote / vor Ort im Raum Düsseldorf/Ratingen).
8. **Werkzeuge:** collapsed `<details>` with confirmed tools only (moved from the homepage `Technologies`).
9. **Netzwerk:** hidden until named specialists exist (phase 2).
10. **Final CTA.**

The smart home interest is optional: at most one line in "Fakten" („Privat: Smart-Home-Bastler").

### 2.6 Contact flow

Three intents, one destination: a conversation with Reza.

```
                 ┌─────────────────────────── Header / hero / final CTA ───────────────────────────┐
                 │                                                                                  │
   Erstgespräch vereinbaren                 Projekt anfragen                     Website-Schnellcheck
   → /kontakt#termin                        → /kontakt#anfrage(?leistung=…)       → /website-check (or inline form)
         │                                        │                                       │
   Two-click booking embed                Qualifying form (server action)          URL + E-Mail (server action)
   (loads only after click)                     │                                       │
         │                                  validation ─ error state                 validation ─ error state
   Booking tool confirms                         │                                       │
   → redirect /kontakt/danke?typ=termin     → redirect /kontakt/danke?typ=anfrage    → redirect /website-check/danke
         │                                        │                                       │
   Next steps + "Vorbereitung"             Next steps + "Termin gleich buchen"     Delivery date + "Erstgespräch"
```

**`/kontakt` page order:**

1. **Header:** H1 „Erzählen Sie mir von Ihrem Projekt." Lead: „Antwort innerhalb von 24 Stunden (werktags). Kein Verkaufsdruck – wenn es nicht passt, sage ich das ehrlich."
2. **Intent selector:** three large rows, anchor links rather than tabs, so all content stays indexable and works without JS:
   - **Erstgespräch vereinbaren**: „30 Minuten per Video oder Telefon. Kostenlos." → `#termin`
   - **Projekt schriftlich anfragen**: „Fünf kurze Fragen, ca. 3 Minuten." → `#anfrage`
   - **Website-Schnellcheck**: „Noch nicht so weit? Persönliches Video zu Ihrer Website in 48 Stunden." → `/website-check`
3. **`#termin`:** `BookingEmbed`, two-click (see §06.5).
4. **`#anfrage`:** `InquiryForm`.
5. **Direkt:** email, phone (placeholders), response promise, business address (placeholder; needed for the Impressum anyway).
6. **What happens next:** the 3 numbered steps (a real sequence, so numbering is allowed).

**Confirmation pages** (`/kontakt/danke`, `/website-check/danke`): `noindex`, no personal data in the URL (only `?typ=termin|anfrage`), greeting without the name. Specs in §10.

---

## 03 · Homepage blueprint

Format per section: **Answers** (the visitor's question) · **Content** · **Purpose** · **CTA** · **Component** · **Notes**. German strings are ship-ready unless shown as `[placeholder]`.

### 01 · Hero

- **Answers:** "Is this for me, and what do they do?"
- **Content:**
  - H1 keyword line (small, visible, inside the H1, replaces the eyebrow): **Webdesign & Web-Apps für Unternehmen in Ratingen**. The descriptor „Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen" sits under the wordmark.
  - H1: **Moderne Websites, Apps und KI-Erlebnisse, die Kunden *überzeugen.*** (Brand line chosen by Reza, October 2026. Instrument Serif Italic on „überzeugen" only. At 63 characters it is the one approved exception to the H1 budget in §08.5: test it at 320 / 375 px with the hyphenation rules from §05.4.)
  - Lead: **Ich gestalte, entwickle und vermarkte Websites und Web-Apps für Unternehmen im DACH-Raum – als ein System, gebaut für mehr qualifizierte Anfragen.**
  - CTAs: primary **Erstgespräch vereinbaren** · secondary (ghost) **Projekte ansehen**
  - Micro-proof line (label size, `fg-muted`): **Antwort innerhalb von 24 Stunden · Projekte für Gastronomie, B2B-Handel und lokale Dienstleister live · Ratingen bei Düsseldorf**
  - Availability (only if confirmed): **Nächster freier Projektstart: `[Monat]`**
  - Founder byline: 56 px square portrait (2 px radius) + **Reza Alami** / **Software Engineer · AI Specialist · Web & App Developer · Digital Marketer.** Second line: **Ich betreue jedes Projekt persönlich.** (role titles approved by Reza; never numbered)
  - Visual (right, 5 cols): one real device composition from the strongest case study (Power Bowls phone + desktop crop) with the caption link **Power Bowls · Bestellsystem, Duisburg →**
- **Purpose:** recognition plus proof in the first viewport. The visual is *evidence*, not atmosphere.
- **CTA:** primary → `/kontakt#termin` (`data-cta="erstgespraech" data-cta-position="hero"`); secondary → `#projekte`.
- **Component:** `HomeHero` (replaces `Hero` + `HeroField`).
- **Notes:** Height `min-h-[88svh]` at ≥ lg, auto on mobile, so the proof strip peeks above the fold and signals that the page scrolls. Remove the name-as-H1, the numbered role list (the four approved titles move to the founder byline, unnumbered), the scroll cue, the AI eyebrow, the drifting glows and the neural canvas. Keep the CSS `line-mask` reveal for the H1 only.

### 02 · Proof strip

- **Answers:** "Have they done this for real businesses?"
- **Content:** 3 items, one per live project: **client name** · *Branche, Stadt* · one hard figure with its source. Figures Reza can measure honestly today, without asking the client: PageSpeed mobile score, LCP, launch year, number of order channels. Example structure (values are placeholders):
  - **Power Bowls**: Gastronomie, Duisburg: `[PageSpeed mobil]` · „PageSpeed Insights, mobil, `[Datum]`"
  - **Foodigastro24**: B2B-Lebensmittelhandel: `[Kennzahl]`
  - **Rundumdienst**: Haus- & Gebäudeservice, Neuss: `[Kennzahl]`
- **Purpose:** front-load credibility before the pitch.
- **CTA:** none. Each item links to its case study (text link, no button).
- **Component:** `ProofStrip` → `ProofItem`.
- **Notes:** No logo wall. Three named clients set in type are more credible than three grey logos. Upgrade figures to business results (inquiries, orders) once clients confirm them. Hairline-separated row on desktop, a 3-row list on mobile. `section-sm` rhythm.

### 03 · Problem

- **Answers:** "Do they understand my situation?"
- **Content:**
  - Label: **Ausgangslage**
  - H2: **Gute Website. Kaum Anfragen?**
  - Three statements, set large (`t-h3`), in the owner's voice, **without** quotation attribution (they are typical statements, not testimonials, so no names, no quote marks that suggest a real person):
    1. **Unsere Website sieht ordentlich aus – aber über sie meldet sich kaum jemand.**
    2. **In unserer eigenen Stadt finden uns Kunden bei Google nicht.**
    3. **Bestellungen und Anfragen kommen per Telefon, Mail und WhatsApp – und wir tippen alles von Hand ab.**
  - Bridge line: **Das sind selten Designprobleme. Meist fehlt die Verbindung zwischen Gestaltung, Technik und Vertrieb. Genau dort setze ich an.**
- **Purpose:** relevance. Names the problem before the solution.
- **CTA:** none. The next section is the answer.
- **Component:** `ProblemStatements`.
- **Notes:** Each statement maps to a service (Website → Conversion-Website, Google → SEO, manual work → Web-Apps). A small `→ Conversion-Website` text link under each makes the map explicit.

### 04 · Leistungen

- **Answers:** "What exactly would I buy, and roughly what does it cost?"
- **Content:**
  - Label: **Leistungen** · H2: **Drei Leistungen. Ein Ziel: mehr qualifizierte Anfragen.**
  - Three `ServiceRow`s, each: service name (label) · outcome headline (`t-h3`) · 4 included items · price · link.

| Service | Outcome headline | Included (4) | Price line |
| --- | --- | --- | --- |
| Conversion-Website & Relaunch | **Eine Website, die aus Besuchern Anfragen macht.** | Seitenstrategie & Textkonzept · Individuelles Design · Entwicklung mit Next.js · Technisches SEO & Tracking | **ab `[7.500]` €** |
| Web-Apps & Portale | **Software, die Handarbeit ersetzt.** | Bestell- & Buchungssysteme · Kundenportale · Interne Tools · Schnittstellen & Automatisierung | **ab `[15.000]` €** |
| SEO & Sichtbarkeit | **Gefunden werden, wo Ihre Kunden suchen.** | Technisches SEO-Audit · Local SEO & Google-Unternehmensprofil · Content-Plan · Monatliches Reporting | **Audit ab `[990]` € · Betreuung ab `[1.200]` €/Monat** |

  - Quiet line beneath: **Für Kunden nach dem Launch außerdem: Wartung & Hosting · KI-Integration · Wachstumsbetreuung →** (→ `/leistungen#weitere`)
- **Purpose:** offer clarity plus price anchoring, which also filters out low budgets.
- **CTA:** per row „Mehr zu Conversion-Websites →" (ArrowLink). No buttons, so the hero CTA stays the only primary above.
- **Component:** `ServiceList` → `ServiceRow` → `PriceFrom`.
- **Notes:** Prices are `null` → placeholder until Reza confirms (values from `STRATEGY.md` §03 go into content comments as suggestions). AI is a line item inside Web-Apps („Schnittstellen & Automatisierung"), never a fourth row.

### 05 · Ausgewählte Projekte

- **Answers:** "Have they done this for someone like me, and did it work?"
- **Content:** Label **Projekte** · H2 **Echte Betriebe, live im Einsatz.** · three `CaseStudyFeature`s in alternating asymmetric rows (existing `flip` logic). Each shows:
  1. Eyebrow: Branche · Stadt · Leistungen (linked labels)
  2. Title: client name (`t-h2`)
  3. Outcome headline (`t-lead`)
  4. Challenge → Lösung → Ergebnis as three one-line rows with labels **Aufgabe**, **Lösung**, **Ergebnis**. `Ergebnis` shows the lead metric, or the pending state „In Messung seit `[Monat Jahr]`".
  5. Link **Case Study lesen →** + live link „powerbowls.de ↗"
  6. Visual: existing cover + peeking phone frame.
- **Purpose:** proof with context. Results first, visuals support.
- **CTA:** after the third project, a section-closing row: primary **Erstgespräch vereinbaren** + text link **Alle Projekte →**. Strategy puts a primary CTA "after case studies", and it's the only primary in that viewport.
- **Component:** `SelectedWork` (refactor) → `CaseStudyFeature` (refactor of `ProjectCard layout="feature"`).
- **Notes:** Remove `TechnologyList` and the `01 / 03` counter from the cards. `id="projekte"` for the hero secondary CTA.

### 06 · Der Unterschied

- **Answers:** "Why him and not an agency, a cheap freelancer or Wix?"
- **Content:** Label **Der Unterschied** · H2 **Ein Ansprechpartner statt drei Dienstleister.** · `ComparisonTable`:

| Kriterium | Klassische Agentur | Günstiger Freelancer | Baukasten (Wix & Co.) | **Reza Alami** |
| --- | --- | --- | --- | --- |
| Verantwortung für das Ergebnis | Projektleitung, wechselnde Teams | Endet meist mit dem Launch | Liegt bei Ihnen | **Eine Person, von der Analyse bis zum Ranking** |
| Individuell entwickelt | Ja | Oft Theme-basiert | Vorlage | **Ja, ohne Page-Builder** |
| Technisches SEO im Code | Oft separat beauftragt | Selten | Eingeschränkt | **Von Anfang an eingebaut** |
| Code & Inhalte gehören Ihnen | Je nach Vertrag | Je nach Vertrag | Nein, an die Plattform gebunden | **Ja, vollständig** |
| Betreuung nach dem Launch | Ja, oft teuer | Unklar | Selbst | **Wartungsplan ab `[149]` €/Monat** |
| Investition | ab ca. `[x]` € | ab ca. `[x]` € | ab ca. `[x]` €/Monat | **ab `[7.500]` €** |

- **Purpose:** handle the comparison objection explicitly. German buyers compare.
- **CTA:** none.
- **Notes:** Compare **categories only, never named competitors**. Under § 6 UWG, comparative advertising must be objective and verifiable, so keep the wording factual and avoid absolute claims. Competitor-category prices are placeholders; leave the row out if Reza doesn't want to estimate them. Text values, no ✓/✗ emoji. The Reza column gets the `surface` background and `fg` text; other columns are `fg-muted`. Real `<table>` with `<caption class="sr-only">`, `<th scope>`. Mobile pattern: §07.

### 07 · Ablauf

- **Answers:** "How does it work, how long does it take, what do I get at each step?"
- **Content:** Label **Ablauf** · H2 **So läuft ein Projekt ab.** · 5 steps (a real sequence, so numbers stay):

| # | Schritt | Text | Dauer | Sie erhalten |
| --- | --- | --- | --- | --- |
| 1 | **Analyse** | Gemeinsam klären wir Ziele, Zielgruppe und Ausgangslage. | `[1 Woche]` | Analyse & schriftliches Angebot |
| 2 | **Konzept** | Seitenstruktur, Inhalte und Nutzerwege – bevor gestaltet wird. | `[1–2 Wochen]` | Sitemap, Wireframes, Textplan |
| 3 | **Design & Entwicklung** | Gestaltung und Umsetzung in kurzen Schritten. Sie sehen jeden Stand. | `[3–6 Wochen]` | Testlink zum Mitverfolgen |
| 4 | **Launch** | Go-live, Weiterleitungen, Tracking, Übergabe. | `[1 Woche]` | Einweisung & Dokumentation |
| 5 | **Wachstum** | Messen, verbessern, sichtbarer werden. | laufend | Monatlicher Bericht (optional) |

- **Purpose:** risk reduction through predictability.
- **CTA:** none.
- **Component:** `ProcessSteps` (refactor of `Process`).
- **Notes:** Durations are `null` until confirmed. Static hairline rail. The scroll-scrubbed fill goes, because it adds motion without information.

### 08 · Founder

- **Answers:** "Who exactly will I be working with, and can I trust them?"
- **Content:** Label **Wer dahintersteht** · portrait (4:5, real photo; `[Foto]` placeholder until the shoot) · H2 **Ich verantworte Ihr Projekt – von der ersten Analyse bis zur Sichtbarkeit bei Google.** · role line **Software Engineer · AI Specialist · Web & App Developer · Digital Marketer** · two short paragraphs from known facts (software-engineering background, professional web development, Meta digital-marketing training) · capacity line **Ich übernehme maximal `[4]` neue Projekte pro Quartal.** · signature line „Reza Alami, Gründer dotMind".
- **Purpose:** the strongest phase-1 trust element: a face, a name, accountability.
- **CTA:** text link **Mehr über mich →** (`/ueber`).
- **Component:** `FounderSection`.
- **Notes:** Asymmetric: portrait spans cols 1–5, text cols 7–12. No "passionate", no skills list.

### 09 · Testimonials (conditional)

- **Answers:** "What do clients say?"
- **Content:** 2–3 `TestimonialQuote`s: quote · full name · role · company · photo (or video with captions). Label **Stimmen** · H2 **Was Kunden sagen.**
- **Purpose:** third-party proof.
- **CTA:** none.
- **Rule:** **the section renders only when `testimonials.length >= 2` with every field filled.** No placeholder quotes on the homepage, because a dashed placeholder where a testimonial should be reads as "no happy clients". Until then the section is simply absent. Quotes still appear in case studies as soon as a single one exists.

### 10 · Website-Schnellcheck

- **Answers:** "I'm not ready to talk. Can I get something useful first?"
- **Content:** Label **Kostenlos** · H2 **Noch nicht bereit für ein Gespräch?** · Lead **Schicken Sie mir Ihre Website. Ich sehe sie mir persönlich an und sende Ihnen innerhalb von 48 Stunden ein kurzes Video mit den drei wichtigsten Hebeln.** · inline form: **Ihre Website** / **E-Mail-Adresse** / button **Schnellcheck anfordern** · microcopy **Kostenlos und unverbindlich. Kein Newsletter, außer Sie möchten ihn.**
- **Purpose:** the safety net for researchers. Captures email + URL.
- **CTA:** tertiary intent, but in *this* section the submit is the primary button, because it is the only action in the viewport.
- **Component:** `SchnellcheckForm variant="inline"`.
- **Notes:** The full-width band uses `surface` as the one tonal block on the page. Validation and success are inline (success replaces the form; a redirect to `/website-check/danke` happens only without JS).

### 11 · FAQ

- **Answers:** last objections: cost, time, ownership, data protection.
- **Content:** Label **FAQ** · H2 **Häufige Fragen.** · 7–8 items:
  1. **Was kostet eine Website bei Ihnen?**
  2. **Wie lange dauert ein Projekt?**
  3. **Gehören mir Code und Inhalte?**
  4. **Wo wird meine Website gehostet?**
  5. **Ist die Website DSGVO-konform?**
  6. **Was passiert nach dem Launch?**
  7. **Arbeiten Sie mit WordPress?**
  8. **Arbeiten Sie remote oder vor Ort?**
- **Purpose:** objection handling + FAQPage structured data.
- **CTA:** after the list: **Ihre Frage ist nicht dabei? Schreiben Sie mir →** (`/kontakt#anfrage`).
- **Component:** `FaqList` (native `<details>`/`<summary>`; no JS needed).
- **Notes:** Answers are `null` → placeholder until written. Google shows FAQ rich results only for a narrow set of authoritative sites since 2023. Keep the `FAQPage` markup anyway for AI answer engines and consistency, but don't expect SERP accordions.

### 12 · Final CTA + Footer

- **Answers:** "OK, what now?"
- **Content:** H2 **Lassen Sie uns über Ihr Projekt sprechen.** · Lead **30 Minuten, kostenlos, ohne Verkaufsdruck.** · primary **Erstgespräch vereinbaren** · secondary text links **Lieber schriftlich? Projekt anfragen →** and the email address · availability line if confirmed.
- **Component:** `FinalCta` (replaces `ClosingCTA`). Full-bleed section, **no bordered box, no spotlight**. Left-aligned H2 on cols 1–8, actions on cols 9–12 (stacked on mobile).
- **Footer:** see §10 `SiteFooter`.

### Homepage CTA map

```
Viewport:     Hero        Proof  Problem  Services   Projects       Diff  Process  Founder  Check        FAQ    Final
Primary:      Erstgespr.  –      –        –          Erstgespr.     –     –        –        Schnellcheck –      Erstgespr.
Header CTA:   ghost       filled ───────────────────────────────────────────────────────────────────────────────── ghost
Mobile bar:   hidden      shown ───────────────────────────────────────────────────────── hidden (form) ── shown  hidden
```

---

## 04 · Case study UX

### 4.1 Principles

1. **Lead with the result, then earn it.** The results band sits directly under the hero, before the device composition. A decision maker who reads nothing else still leaves with the outcome.
2. **Show the thinking, not just the screens.** The "Ansatz" section shows decisions and the reason behind each one. That's what separates a studio from a template seller.
3. **Role clarity.** State exactly what Reza did and credit everyone else by name. It makes the studio look bigger, honestly.
4. **Every number has a source and a timeframe.** „+38 % Anfragen" without context is a red flag. „Formularanfragen, 90 Tage nach Launch vs. 90 Tage davor, Quelle: Formular-Logs" is proof. (This example is illustrative wording only, not a claim.)

### 4.2 Page anatomy

| # | Block | Content | Component | Notes |
| --- | --- | --- | --- | --- |
| 1 | **Breadcrumb** | „Projekte / Power Bowls" | `Breadcrumbs` | + `BreadcrumbList` JSON-LD |
| 2 | **Header** | Eyebrow: Branche · Stadt · Jahr. H1: outcome headline („Ein eigenes Bestellsystem statt Bestellungen per Telefon"). Client name sits as a large label above the H1. Lead: summary. | `CaseHeader` | H1 = outcome, not the client name, which helps SEO and persuasion |
| 3 | **Fact sheet** | `<dl>`: Kunde · Branche · Leistungen (links to service pages) · Meine Rolle · Zeitraum · Live | `FactSheet` | Replaces the current `Meta` grid |
| 4 | **Results band** | 3 metrics: value (`t-metric`), label, context line (source + period). | `ResultsBand` → `MetricItem` | See 4.4 for the no-metrics state |
| 5 | **Main visual** | Existing `DeviceShowcase` | keep | Mobile behaviour in §07.5 |
| 6 | **Ausgangslage** | `challenge` text (2–3 short paragraphs) + optional `ClientQuote` | `CaseSection` | |
| 7 | **Ansatz** | 2–4 `decisions[]`: **Entscheidung** (title) + **Warum** (1–2 sentences). Interleaved `artefacts[]` (sketch, sitemap, wireframe, before/after) as captioned figures. | `DecisionList`, `Artefact`, `BeforeAfter` | Best place to show marketing + engineering thinking together |
| 8 | **Umsetzung** | Features grouped by audience: **Für Gäste/Kunden** · **Für das Team** · **Technik & Datenschutz**. Then a collapsed `<details>` „Technik im Detail" holding the technology list. | `FeatureGroups`, `TechnologyList` (existing) | Tech stays available for technical readers but out of the sales path |
| 9 | **Ergebnis** | Metrics again, now with narrative context; full client quote with photo; „Was danach kam" (care plan, next phase). | `CaseSection`, `ClientQuote` | |
| 10 | **Screens** | Existing `ScrollPreview` + `PhoneFrame` | keep | Label „Einblicke" |
| 11 | **Rolle & Credits** | „Konzept, Design, Entwicklung, SEO: Reza Alami. Fotografie: `[Name]`. Texte: `[Kunde / Name]`." | `CreditsList` | Never imply a team that doesn't exist |
| 12 | **Next project** | Existing `NextProject` | keep, translated | Remove `data-cursor` |
| 13 | **Final CTA** | H2 variant: **Ähnliches Vorhaben?** + **Lassen Sie uns darüber sprechen.** | `FinalCta` | |

Section labels are plain words (**Ausgangslage · Ansatz · Umsetzung · Ergebnis · Einblicke · Credits**), with no `(01)…(07)` indices.

### 4.3 Making it premium and credible

- **Real numbers only**, each with `source`, `period` and `verified: true`. `MetricItem` refuses to render a value whose `verified` is false.
- **Client quote with full name, role, company, photo.** Get written permission (a short email the client replies "Ja" to is enough). Store `permission: { date, channel }` in content for your own records; it isn't rendered.
- **Artefacts:** one real sketch or wireframe beats five polished mockups. Use what exists: Figma frames, a whiteboard photo, a sitemap.
- **Before/after:** if the client had a previous site, capture it from the client's archive or the Wayback Machine (with client permission). Show two stills side by side, labelled **Vorher (`[Jahr]`)** / **Nachher (`[Jahr]`)**. No drag sliders; they're a gimmick and break on touch.
- **The live link is the ultimate proof.** Keep the existing `LiveLink`, restyled as a text link with ↗ (not a pill).
- **Restraint in visuals:** one composition, one scroll preview, one phone. More screenshots don't add trust.

### 4.4 Projects without metrics yet (all three today)

Four honest states, in descending strength. `project.resultsStatus` selects one:

| `resultsStatus` | Results band shows | Example copy |
| --- | --- | --- |
| `"measured"` | 3 verified business metrics | (real values only) |
| `"technical"` | Metrics Reza measured himself: PageSpeed mobile, LCP, CLS, accessibility score. Each with tool + date. | **`[95]`** PageSpeed mobil · „gemessen mit PageSpeed Insights am `[Datum]`" |
| `"pending"` | Measurement plan instead of numbers | **In Messung.** „Launch `[Monat Jahr]`. Gemessen werden Bestellungen über das eigene System und Anfragen über das Formular. Ergebnisse folgen im `[Monat Jahr]`." |
| `"qualitative"` | 2–3 client-confirmed outcomes without numbers, plus the quote | „Bestellungen kommen jetzt direkt über das eigene System." (only if the client confirms the statement) |

`"technical"` and `"pending"` can combine. That's the realistic launch state for all three projects: technical figures now, a measurement plan for the business figures.

### 4.5 Missing fact vs. pending fact

This distinction keeps the placeholder philosophy and still allows a launch:

- **Missing fact** (exists, Reza hasn't entered it: role, launch month, city, price) → `null` → `<Placeholder>`. **A page cannot launch with these on the critical path.**
- **Pending fact** (doesn't exist yet: post-launch results, testimonials) → a designed state (`"pending"`, a hidden testimonials section), publishable as-is.

Add `scripts/check-placeholders.ts` (§10.6), which lists every `null` on launch-critical routes so the launch checklist can be objective.

---

## 05 · UI direction

### 5.1 Visual tone

**"Quiet authority."** A senior consultancy's report crossed with a film title sequence: dark, warm, typographic, unhurried, with one warm light source (ember). The tone comes from **typography, spacing and real evidence**, not effects. If an element would still look good with a different client's name on it, it's decoration. Cut it.

| More of | Less of |
| --- | --- |
| Large confident German headlines with real claims | Atmospheric canvases, glows, sheens |
| Hairlines, rails, tabular numbers | Pills, chips, badges (pill = button only, per `DESIGN.md`) |
| Real screenshots, a real portrait, real names | AI iconography, sparkles, gradients |
| One tonal block per page (`surface`) | Bordered "cards", boxed CTAs |
| Fades of 8–12 px | Scroll-scrubbed text, magnetic pull, custom cursor |

### 5.2 Layout approach

- **Grid:** keep `grid-editorial` (4 / 8 / 12 cols, 16 / 24 px gaps) and `shell` (max 1600, gutters 20 / 32 / 48).
- **The rail pattern** is the site's signature and stays: section label in cols 1–3, content in cols 4–12 (`SectionHeading`). Use it for *every* standard section so the page reads like a well-set report.
- **Asymmetry with rules:** alternate only between three compositions, not freestyle:
  1. **Rail + wide** (label 1–3 / content 4–12): default for text sections, FAQ, process.
  2. **Split 7/5** (text 1–7 / visual 8–12, or flipped): hero, case-study features, founder.
  3. **Full-bleed band**: proof strip, Schnellcheck, final CTA.
- **Rhythm tokens** (replace the uniform `py-28 md:py-40`, which makes a 12-section page about 20 % too long):

| Token | Mobile | ≥ md | Use |
| --- | --- | --- | --- |
| `section-sm` | 4rem | 6rem | Proof strip, Schnellcheck strip on service pages |
| `section` | 5rem | 8rem | Default |
| `section-lg` | 6rem | 10rem | Selected work, founder, final CTA |

- **Measure:** body copy max `66ch`, lead max `52ch`, H1 max `20ch`, H2 max `22ch`. German needs about 10 % more than the current `18ch` / `14ch`.
- **Keep the fixed column guides** (they're quiet and editorial), but at `line/40` and only at ≥ md.

### 5.3 Colour and theme

**Recommendation (deviation from `DESIGN.md`): keep dark as the default brand theme, and add a light theme ("Papier") with a user toggle.**

Why dark stays the default: it's the differentiator in a market full of white template sites, and light client screenshots read well against it. Why light must exist: (a) many decision makers in the DACH Mittelstand are 45+, read on bright office monitors, and find long light-on-dark copy tiring (halation); (b) case studies and legal pages get forwarded to a second decision maker and printed; (c) people who set their OS to light should be able to choose. The toggle is cheap once tokens are semantic.

**Token refactor (required before any theme work).** Today components use palette names (`bg-ink`, `text-bone`), so a light theme is impossible without touching every file. Introduce semantic tokens and keep the palette as primitives:

| Semantic token | Dark (default) | Light („Papier") | Notes |
| --- | --- | --- | --- |
| `canvas` | `#0A0A0B` (ink) | `#F4F2EE` | Page background |
| `surface` | `#111113` (ink-2) | `#EAE7E1` | The one tonal block per page |
| `surface-2` | `#18181B` (ink-3) | `#E0DDD6` | Inputs, hover wash |
| `fg` | `#EDEBE6` (bone) | `#0A0A0B` | Body + headings (17.7:1 light) |
| `fg-muted` | `#9A9893` (6.9:1) | `#5E5C57` (6.0:1) | Meta only, **never running body copy** |
| `fg-subtle` | `#63615D` (3.2:1) | `#8D8A84` | Decorative only |
| `line` / `line-strong` | bone 10 % / 18 % | ink 10 % / 18 % | Hairlines |
| `accent` (text-safe) | `#F2A05B` ember (9.4:1) | `#9A4A0C` ember-deep (5.6:1) | Links on hover, focus ring, active nav, key metric |
| `accent-fill` | `#F2A05B` | `#F2A05B` | Button hover wipe, selection, with `on-accent` text |
| `on-accent` | `#0A0A0B` (9.4:1) | `#0A0A0B` | |

Ember `#F2A05B` on the light canvas is **1.9:1**, which fails. That's why `accent` and `accent-fill` are separate tokens.

**Accent restraint:** ember is currently on every index number, label prefix, dot and bullet, so it no longer signals anything. New rule: ember appears only in (1) the primary-button hover wipe, (2) link hover/focus, (3) the focus ring, (4) the active nav item, (5) the single lead metric in a results band, (6) the serif accent words when emphasis is needed (optional). Everything else is `fg` / `fg-muted`.

**Theme mechanics:** `data-theme="light|dark"` on `<html>`, absent = dark default (not "system": the brand's first impression is dark; the choice persists). An inline `<head>` script sets the attribute before paint (see `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`), `suppressHydrationWarning` on `<html>`, preference in `localStorage` (wrapped in try/catch). Also update `viewport.themeColor` / `colorScheme` to list both.

**Print stylesheet** for `/projekte/*`, `/leistungen/*`, `/impressum`, `/datenschutz`: light tokens, hide header / CTA bar / footer chrome, show link URLs after links. Proposals get printed in this market.

### 5.4 Typography

**Families: keep the system, with two adjustments.**

- **Geist** stays for display and body in phase 1. It's well hinted, has tabular figures and complete German glyphs, and is already self-hosted via `next/font`. **But it is a very common choice** (the Vercel / Next.js default look), so it can't carry distinctiveness alone. **Recommendation:** when the studio name and logo are commissioned (STRATEGY §10), license one display grotesk for headlines and the wordmark (e.g. a Swiss-style grotesk from an independent foundry). Body stays Geist. Make the switch a single token change: `--font-display` separate from `--font-sans` from day one.
- **Geist Mono** for labels only (`t-label`), and less of it. Mono uppercase at +0.14 em is a strong "developer portfolio" signal. Use it for section labels, metadata and form hints, never for nav or buttons.
- **Instrument Serif Italic**: max **one accent word per heading** (hero is the one exception), only in H1/H2, never in body, buttons, nav or labels, and never on a word that may hyphenate. Drop the ember-coloured "." after the name.

**Revised scale** (German-first: looser leading for umlauts, smaller max sizes because German words are long):

| Token | Size | Leading | Tracking | Weight | Change vs. today |
| --- | --- | --- | --- | --- | --- |
| `t-display` | (retired) | | | | 15 rem `whitespace-nowrap` name can't carry German headlines. 404 only. |
| `t-h1` | `clamp(2.375rem, 6vw, 6.25rem)` | 1.0 | −0.035em | 600 | was 8 rem / 0.92 |
| `t-h2` | `clamp(1.875rem, 4vw, 4rem)` | 1.04 | −0.03em | 600 | was 4.75 rem / 0.98 |
| `t-h3` | `clamp(1.375rem, 2.2vw, 2rem)` | 1.18 | −0.02em | 550 | |
| `t-lead` | `clamp(1.125rem, 1.4vw, 1.375rem)` | 1.5 | −0.01em | 400 | |
| `t-metric` (new) | `clamp(2.5rem, 5vw, 4.5rem)` | 1 | −0.03em | 500, `tabular-nums` | for `MetricItem` / prices |
| body | **1.0625rem** (17 px) | 1.65 | 0 | 400 | was 16 px: older readers, dark theme |
| small | 0.875rem | 1.5 | 0 | 400 | |
| `t-label` | 0.75rem mono, uppercase | 1.4 | +0.1em | 400 | slightly less tracking |

Why leading ≥ 1.0 on headings: at 0.86–0.92, capital umlauts (Ä Ö Ü) on line 2 collide with descenders on line 1 („Gefunden werden, / Über …").

**German compounds and hyphenation:**

```css
/* <html lang="de"> is a prerequisite — browsers pick the hyphenation dictionary from lang. */
:where(p, li, dd, td, figcaption, blockquote) {
  -webkit-hyphens: auto;
  hyphens: auto;
  hyphenate-limit-chars: 10 4 4;   /* only split words ≥10 chars, ≥4 on each side (progressive) */
}
:where(h1, h2, h3, .t-metric, .t-label, button, nav a) {
  hyphens: manual;                 /* headlines break only at &shy; we place */
  overflow-wrap: break-word;       /* last-resort safety, never overflow */
}
```

Problem words at 375 px. For example, „Suchmaschinenoptimierung" at `t-h2` mobile (30 px) is about 400 px wide against 335 px available.

- **Content convention:** long compounds in headings carry a soft hyphen in the content file: `"Suchmaschinen­optimierung"`, `"Wachstums­betreuung"`, `"Datenschutz­erklärung"`, `"Unternehmens­website"`. Hyphenated compounds („Conversion-Website", „DSGVO-konform") break at the hyphen already.
- **Non-breaking rules** (put them in a `typo()` helper): `ab 7.500 €` → `ab 7.500 €`; `z. B.` → `z. B.`; `24 Std.`; `§ 5 DDG`. German quotes „…", spaced en dash „ – ".
- **Test string set** for QA (§10.6): every H1/H2 in the content plus „Suchmaschinenoptimierung", „Datenschutzerklärung", „Wachstumsbetreuung", „Inhabergeführte", „Barrierefreiheitsstärkungsgesetz" at 320 / 375 / 768 px.

### 5.5 Spacing philosophy

4 px base (unchanged). **Space is the hierarchy:** related items 8–16 px, within-section groups 32–48 px, between sections the rhythm tokens. Never separate sections with both a hairline *and* a background change; pick one. Headings sit closer to their content (24–32 px) than to the previous section, so grouping reads instantly.

### 5.6 Image and content balance

- **Text leads, images prove.** At most one major visual per section. Text sections have no decorative imagery.
- **Allowed imagery:** client screenshots (device frames), the founder portrait, real process artefacts, and phase 2 client photos (with permission). **Nothing else:** no stock, no illustrations, no 3D, no AI-generated imagery.
- **Portrait direction** (for the shoot): natural light, working context (desk, client meeting, screen visible), not arms-crossed; 4:5 and 1:1 crops; warm grade so it sits on `canvas` next to ember; one horizontal 3:2 for OG and `/ueber`.
- **Image ratios:** device composition (existing), covers 16:10, portraits 4:5, artefacts native ratio with 2 px radius and a hairline border.

### 5.7 Motion (tightened)

Keep `DESIGN.md`'s motion tokens and reduced-motion rules. Change usage:

- Hero H1: CSS `line-mask` reveal (keep, LCP-safe). Everything else: `Reveal` with 8 px travel, 0.45 s, `once`.
- Section H2s: **no per-word `AnimatedText`**. Word-staggered reveals of long German words look broken mid-animation and delay reading. Use a single block fade.
- Page transition (`template.tsx`): opacity only, 200 ms (was a 0.6 s fade-up).
- `DeviceShowcase` parallax: keep, max 6 % travel.
- Magnetic: final CTA button only, or none at all. Never in the header (moving targets lose clicks).
- Button text-roll: keep. It's subtle and the duplicate label is already `aria-hidden`.

---

## 06 · Trust & conversion design

### 6.1 Where trust signals live

| Signal (STRATEGY §08 priority) | Homepage | Service page | Case study | Contact / Check | Footer |
| --- | --- | --- | --- | --- | --- |
| 1 Named case studies with results | Proof strip, §05 | Matching project | the page itself | (none) | (none) |
| 2 Testimonials (name, company, photo) | §09 (conditional) | Inline quote near Investition | Ausgangslage / Ergebnis | One quote beside the form | (none) |
| 3 Founder photo + story | Hero byline, §08 | Small byline near the hero CTA | Credits | Beside the form: „Sie sprechen direkt mit mir." | (none) |
| 4 „Antwort innerhalb von 24 Stunden" | Hero micro-proof, final CTA | Hero microcopy | (none) | Header + submit microcopy | yes |
| 5 Process with timelines | §07 | §6 Ablauf | Ansatz | „So geht es weiter" | (none) |
| 6 Google reviews (≥ 5) | Proof strip (phase 1.5) | (none) | (none) | yes | (none) |
| 7 EU hosting, DSGVO, no tracking cookies | FAQ | FAQ | Umsetzung (for that client) | Form privacy line | „Gehostet in der EU · Ohne Tracking-Cookies" |
| 8 „Code und Inhalte gehören Ihnen" | Comparison | Leistungsumfang | (none) | (none) | (none) |
| 9 Site's own performance | (none) | (none) | (none) | (none) | „Diese Website: PageSpeed `[x]` mobil →" (phase 1.5: „So ist diese Website gebaut") |
| 10 Clean Impressum, real address | (none) | (none) | (none) | Address block | Impressum link |

**Proof without clutter:** each signal appears **once per viewport**, in plain type. No badge rows, no "trusted by" logo carousels, no star graphics until real reviews exist.

### 6.2 CTA hierarchy

| Level | Visual | Label(s) | Rule |
| --- | --- | --- | --- |
| **Primary** | Pill, `fg` fill / `canvas` text, ember wipe on hover, `h-14` (md) / `h-12` (mobile, full-width) | **Erstgespräch vereinbaren** · in-context: **Projekt anfragen**, **Anfrage senden**, **Schnellcheck anfordern** | **One per viewport.** Always followed by microcopy. |
| **Secondary** | Ghost pill (`line-strong` border) | **Projekte ansehen** · **Termin gleich buchen** | Max one next to a primary. |
| **Tertiary** | `ArrowLink` (underline on hover, arrow) | **Mehr zu …** · **Lieber schriftlich? Projekt anfragen** · **Alle Projekte** | Unlimited, but never styled as a button. |
| **Header CTA** | Small pill (`h-10`) | **Erstgespräch vereinbaren** | Ghost while a page-level primary is in view; filled otherwise. |
| **Mobile CTA bar** | Full-width primary + icon button | **Erstgespräch vereinbaren** + phone icon (`aria-label="Anrufen"`) | Appears after the hero CTA leaves view (§07.3). |

**Header CTA switching:** every page-level primary button gets `data-primary-cta`. A small client hook (`usePrimaryCtaVisible`) uses `IntersectionObserver` on those elements. While any one is in view, the header CTA renders as ghost and the mobile bar is hidden. That keeps the "one primary per viewport" rule mechanical rather than a matter of discipline.

**Tracking:** every CTA carries `data-cta="erstgespraech|anfrage|schnellcheck|projekte"` and `data-cta-position="header|hero|work|final|service-hero|…"`. One delegated click listener sends cookieless analytics events (Plausible or self-hosted Matomo, per STRATEGY §08).

### 6.3 Qualifying inquiry form (`InquiryForm`)

One page and one column. The fields are grouped into three `fieldset`s with visible legends, so it feels short. No multi-step wizard: wizards hide the total effort and get abandoned on step 3.

| # | Field (label, German) | Type | Required | Options / hint |
| --- | --- | --- | --- | --- |
| **Fieldset: Ihr Vorhaben** | | | | |
| 1 | **Worum geht es?** | radio group (full-width rows) | yes | Neue Website · Relaunch einer bestehenden Website · Web-App, Bestell- oder Buchungssystem · SEO & Sichtbarkeit · KI oder Automatisierung · Etwas anderes. Prefilled from `?leistung=`. |
| 2 | **Ihre aktuelle Website** | `type="url"` `inputmode="url"` | no | Placeholder „www.ihre-firma.de". Accept without `https://`, normalize server-side. |
| 3 | **Was soll das Projekt erreichen?** | textarea (4 rows, auto-grow) | yes, ≥ 20 chars | Hint: „Zwei, drei Sätze reichen – z. B. mehr Anfragen aus der Region oder weniger Handarbeit bei Bestellungen." |
| **Fieldset: Rahmen** | | | | |
| 4 | **Budgetrahmen** | radio group, options depend on Q1 | yes | Website/Relaunch/Web-App: 5.000–10.000 € · 10.000–20.000 € · 20.000–40.000 € · über 40.000 € · Noch unklar. SEO: SEO-Audit (ab `[990]` €) · Laufende Betreuung (ab `[1.200]` €/Monat) · Noch unklar. KI: unter 5.000 € · 5.000–15.000 € · Noch unklar. Hint: „Projekte starten in der Regel ab `[7.500]` €. Das hilft mir, Ihnen einen passenden Vorschlag zu machen." |
| 5 | **Gewünschter Start** | radio group | no | So bald wie möglich · In 1–3 Monaten · In 3–6 Monaten · Noch offen |
| **Fieldset: Kontakt** | | | | |
| 6 | **Vor- und Nachname** | text, `autocomplete="name"` | yes | |
| 7 | **Unternehmen** | text, `autocomplete="organization"` | yes | |
| 8 | **E-Mail-Adresse** | email, `autocomplete="email"` | yes | |
| 9 | **Telefon** | tel, `autocomplete="tel"` `inputmode="tel"` | no | Hint: „Optional – falls Sie lieber telefonieren." |
| – | Privacy line (no checkbox) | text | | „Ihre Angaben verwende ich nur zur Bearbeitung Ihrer Anfrage. Mehr dazu in der **Datenschutzerklärung**." Processing for pre-contract steps (Art. 6 (1) b DSGVO) needs no consent checkbox; Reza's privacy policy must state this. |
| – | Honeypot + time trap | hidden | | No third-party CAPTCHA (that would be a third-party request before consent). |

- **Submit:** **Anfrage senden** + microcopy **Antwort innerhalb von 24 Stunden (werktags).**
- **Labels above fields, always visible.** No placeholder-as-label. Inputs at 16 px or larger (prevents iOS zoom), 48 px tall, `surface-2` fill, 1 px `line-strong` border, 2 px radius. Focus: 2 px `accent` ring.
- **Implementation:** Server Action + `useActionState` (read `node_modules/next/dist/docs/01-app/02-guides/forms.md` first), with server-side validation as the source of truth and native constraint attributes as progressive enhancement. On success: `redirect('/kontakt/danke?typ=anfrage')`. Email notification to Reza plus a confirmation email to the sender, via an EU-hosted mail provider with an AV-Vertrag.

**States and microcopy:**

| State | UI | German copy |
| --- | --- | --- |
| Idle | (none) | (none) |
| Field error (on blur after first submit, and on submit) | Red-free: `accent` left border + message under the field, linked via `aria-describedby`, `aria-invalid` | „Bitte wählen Sie aus, worum es geht." · „Bitte geben Sie Ihre E-Mail-Adresse an." · „Diese E-Mail-Adresse scheint unvollständig zu sein, z. B. name@firma.de." · „Ein, zwei Sätze mehr helfen mir, Ihr Vorhaben einzuschätzen." |
| Error summary (on submit) | Box at the top of the form, focused, with links to fields | „Bitte prüfen Sie **2 Angaben**:" + list |
| Pending | Button disabled, `aria-busy`, label swap | „Wird gesendet …" |
| Server / network error | Inline banner above the submit; **inputs preserved** | „Das hat leider nicht geklappt. Ihre Eingaben sind noch da – bitte versuchen Sie es erneut oder schreiben Sie direkt an `[E-Mail]`." |
| Spam rejected (honeypot / too fast) | Show the success page anyway (don't teach bots) | (none) |
| Success | Redirect to `/kontakt/danke?typ=anfrage` | see below |

**Confirmation page (`/kontakt/danke`):**

- H1 (`typ=anfrage`): **Danke – Ihre Anfrage ist angekommen.**
- H1 (`typ=termin`): **Danke – Ihr Termin steht.**
- **So geht es weiter** (numbered, a real sequence):
  1. **Sie erhalten gleich eine Bestätigung per E-Mail.**
  2. **Ich lese Ihre Anfrage persönlich und melde mich innerhalb von 24 Stunden (werktags).** / termin: **Sie erhalten eine Kalendereinladung mit dem Link zum Gespräch.**
  3. **Passt es, sprechen wir 30 Minuten über Ziele, Umfang und Budget – ohne Verkaufsdruck.**
- **Zur Vorbereitung (optional):** „Notieren Sie sich drei Websites, die Ihnen gefallen, und Ihre wichtigste Kennzahl (z. B. Anfragen pro Monat)."
- Actions: anfrage → secondary **Termin gleich buchen**; termin → tertiary **Projekte ansehen**.
- No email confirmation arrived? „Keine E-Mail erhalten? Schauen Sie bitte im Spam-Ordner nach oder schreiben Sie an `[E-Mail]`."

### 6.4 Schnellcheck form (`SchnellcheckForm`)

Fields: **Ihre Website** (url, required) · **E-Mail-Adresse** (required) · **Vorname** (optional, for the video greeting) · checkbox (optional, **unchecked**): „Ja, schicken Sie mir in den nächsten zwei Wochen bis zu drei E-Mails mit Praxistipps. Abmeldung jederzeit." (needs double opt-in, per STRATEGY §08). Submit **Schnellcheck anfordern**.

**Confirmation (`/website-check/danke`):** H1 **Ihr Schnellcheck ist eingeplant.** Lead: **Sie erhalten Ihr persönliches Video bis spätestens `{Datum}` per E-Mail.** Compute the date as +2 business days, formatted `Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })` → „Mittwoch, 8. Oktober". Then: **Was Sie bekommen:** ca. 5 Minuten Video · die drei wichtigsten Hebel · eine kurze schriftliche Liste. Secondary CTA: **Nicht warten? Erstgespräch vereinbaren.** If the opt-in was ticked: „Bitte bestätigen Sie noch Ihre E-Mail-Adresse – der Link ist unterwegs."

### 6.5 Booking (`BookingEmbed`, two-click)

Third-party calendars send personal data on load, so the embed is not loaded until the visitor asks for it.

- **Idle state:** a static panel (no iframe) with H3 **30 Minuten Erstgespräch**, three bullets (**Kostenlos · Per Video oder Telefon · Sie sprechen direkt mit mir**), button **Kalender laden** and the notice: „Beim Laden wird eine Verbindung zu `[Anbieter]` hergestellt; dabei werden Daten wie Ihre IP-Adresse übertragen. **Datenschutz**". Optional checkbox „Kalender künftig direkt laden" (stored in `localStorage`).
- **Loading:** skeleton matching the calendar height (prevents CLS), label „Kalender wird geladen …".
- **Error / blocked** (ad blocker, offline): „Der Kalender konnte nicht geladen werden. Schreiben Sie mir einfach – **Projekt anfragen** – oder rufen Sie an: `[Telefon]`."
- **Success:** the booking tool redirects to `/kontakt/danke?typ=termin`.
- **Provider:** a booking tool with EU hosting and an AV-Vertrag (e.g. self-hosted Cal.com). Reza's decision, so it's a placeholder in `site.booking`.

### 6.6 Microcopy principles (German)

- „Sie" throughout. Short sentences. Verbs over nouns („Anfrage senden", not „Absenden der Anfrage").
- Every button says what happens: never „Absenden", „Mehr", „Klicken Sie hier", „Los geht's".
- Reduce risk next to every commitment: „kostenlos", „unverbindlich", „ohne Verkaufsdruck", „Antwort in 24 Std.". But only what's true, and at most one reassurance per CTA.
- No exclamation marks. No „Wir freuen uns auf Sie!". The tone is calm and competent.

---

## 07 · Mobile-first

Design at **375 px first**, then 768, then 1440 (the existing test sizes).

### 7.1 Content priority on small screens

What's kept, compressed or deferred at < 768 px:

| Section | Mobile treatment |
| --- | --- |
| Hero | H1 → lead → **primary CTA full-width** → secondary as a text link (not a second pill) → micro-proof (wraps to 2 lines max) → founder byline → visual (a single phone frame at 60 % width, *below* the CTAs) |
| Proof strip | Vertical list, 3 rows; figure right-aligned (`text-end`) |
| Problem | 3 statements at `t-lead` size rather than `t-h3` |
| Services | Rows stack: label → headline → price → 4 includes → link. **Price stays above the includes** so it's never hidden below the fold of the row. |
| Projects | Cover image → eyebrow → title → outcome → Aufgabe/Lösung/Ergebnis → links. Peeking phone removed (< 768 it's too small to read). |
| Comparison | See 7.4 |
| Process | Vertical list with a rail; duration + deliverable as a two-item `<dl>` under each step |
| Founder | Portrait first (full-width 4:5, max 420 px), then text |
| FAQ | Unchanged (accordions are native mobile) |

### 7.2 Navigation

- **Header (mobile):** 56 px tall, `canvas` at 96 % opacity with a hairline. **No blur** (glass headers are a template tell and cost GPU on low-end Android). Left: wordmark. Right: **Menü** text button (44 × 44 hit area). No CTA in the header on mobile; the CTA bar handles it.
- **Menu overlay** (keep the existing component and its focus management; change the content):
  - Top: nav items at `t-h2` (Leistungen, Projekte, Über mich, Kontakt). Remove the „Home" item (the wordmark is home) and the `01–04` numbers.
  - Under „Leistungen": the three services as smaller indented links (on mobile the overlay *is* the place for second-level links).
  - **Bottom (thumb zone):** primary full-width **Erstgespräch vereinbaren**, then phone and email as tap targets, then the language list (phase 2) and the theme switch.
  - Toggle label **Menü** / **Schließen**; `Escape` closes; body scroll locked (existing).

### 7.3 Sticky CTA bar (`MobileCtaBar`)

- **Shown** at < 768 px once the hero's `[data-primary-cta]` leaves the viewport.
- **Hidden** while any `[data-primary-cta]` is in view, on `/kontakt*` and `/website-check*` (the page is the conversion), when the final CTA section is in view, and while an input is focused (`focusin` on a form field, which covers the on-screen keyboard).
- **Layout:** fixed bottom, `padding-bottom: max(12px, env(safe-area-inset-bottom))`, `canvas` + hairline top. Contents: primary **Erstgespräch vereinbaren** (flex-1, 48 px) + square ghost icon button for phone (`aria-label="Anrufen: [Nummer]"`, rendered only if `site.phone` is set).
- **No hide-on-scroll.** A bar that appears and disappears under the thumb gets mis-tapped. Stability wins.
- Add bottom padding to `<main>` equal to the bar height so the footer is never covered.

### 7.4 Comparison table on mobile

A 5-column table can't work at 375 px, and horizontal scroll hides the key column. **Transform per criterion** into a block:

```
Code & Inhalte gehören Ihnen              ← criterion (t-h3 small)
Reza Alami   Ja, vollständig              ← highlighted row, fg
Agentur      Je nach Vertrag              ← fg-muted
Freelancer   Je nach Vertrag
Baukasten    Nein, an die Plattform gebunden
```

Same `<table>` markup with CSS (`display: block` rows + `data-label` attributes rendered by `::before`), so screen readers keep table semantics at all sizes. Verify with VoiceOver; if semantics break, render a `<dl>` per criterion on mobile instead.

### 7.5 Case-study imagery on mobile

- `DeviceShowcase` at 375 px renders the phone at about 50 px wide, which is unreadable. **Below 768 px, replace the composition** with: the mobile screenshot in `PhoneFrame` at 64 % width, centered, then the desktop screenshot full-width in `DesktopFrame`. No parallax on mobile.
- `ScrollPreview` (full page): no nested scrolling on touch. Render a **60svh crop** with a bottom fade and a button **Ganze Seite anzeigen**, which expands inline. Collapse with **Weniger anzeigen** and scroll back to the top of the figure.
- `sizes` attributes must reflect the new mobile layout (currently `80vw` for desktop frames → `100vw` below 768).

### 7.6 Forms on mobile

- Single column, labels above, 48 px controls, 16 px+ text, the correct `type` / `inputmode` / `autocomplete` (§06.3).
- Radio groups as full-width rows (whole row tappable, 52 px), never small chips.
- The error summary scrolls into view and takes focus. Field errors appear inline under the field, not as toasts.
- Submit at full width. No sticky submit (it fights the keyboard). The CTA bar is hidden on these pages.

### 7.7 Must always be reachable on mobile

The primary CTA (bar or menu) · phone/email (menu) · Impressum + Datenschutz (footer, every page: § 5 DDG requires the Impressum to be „leicht erkennbar, unmittelbar erreichbar und ständig verfügbar") · current-page context (breadcrumb on case studies and service pages).

---

## 08 · Multilingual UX

German launches alone. Everything below is built **now** as structure (routing, tokens, logical CSS, locale-aware formatting), so `en` (phase 2) and `ar` / `fa` (phase 3) are content work, not a refactor.

### 8.1 URL strategy

- **German at the root, unprefixed:** `/leistungen/seo`. Other locales are prefixed: `/en/…`, `/ar/…`, `/fa/…`.
- **Next.js 16 implementation** (per `node_modules/next/dist/docs/01-app/02-guides/internationalization.md` and `…/03-file-conventions/proxy.md`; note that `middleware` is now **`proxy.ts`**):
  - All routes live under `src/app/[lang]/…`, and the root layout moves to `src/app/[lang]/layout.tsx` (sets `<html lang dir>`).
  - `src/proxy.ts`: a request without a locale prefix is **rewritten** (not redirected) to `/de/…`. A request to `/de/…` is **redirected 308** to the unprefixed path, which avoids duplicate URLs. The matcher excludes `_next`, static files, `icon`, `opengraph-image`, `robots.txt` and `sitemap.xml`.
  - Read the locale in Server Components via `import { lang } from 'next/root-params'` (not available in Client Components or Server Actions; pass it down or include it as a hidden form field there).
  - `generateStaticParams` returns `[{ lang: 'de' }]` in phase 1; `dynamicParams = false`.
  - **No `Accept-Language` redirects on the root.** German is the root for SEO and for the DACH audience. Phase 2 may show a dismissible one-line hint („This page is also available in English →") for non-German browsers.
- **Localized slugs:** `en` uses English slugs (`/en/services/seo`, `/en/work/powerbowls`, `/en/about`, `/en/contact`, `/en/imprint`, `/en/privacy`). **`ar` and `fa` also use the English slugs** (`/ar/services/seo`): non-Latin slugs percent-encode into unreadable, unshareable URLs. Implement with one `pathnames` map (`src/i18n/pathnames.ts`) used by the proxy (rewriting the localized slug to the canonical folder) and by a `href(locale, routeKey, params)` helper. Phase 1 builds this map with `de` entries only.
- **SEO:** `alternates.languages` on every page (`de`, `en`, `ar`, `fa`, `x-default → en` once English exists; no hreflang while only German exists) for pages that exist in that locale only; sitemap entries with `alternates`; `openGraph.locale` `de_DE` / `en_GB` / `ar` / `fa_IR` with `alternateLocale`.

### 8.2 Language switcher

- **Phase 1: not rendered.** A switcher with one language, or with dead links, is noise.
- **Placement (phase 2+):** desktop header utility area between the nav and the CTA, as a disclosure button; mobile menu bottom section; footer list (always all languages).
- **Labelling:** trigger shows the current code **DE** with `aria-label="Sprache wählen – aktuell Deutsch"`. The list shows **native names only, no flags** (flags are countries, not languages; Arabic isn't one flag, and German isn't only 🇩🇪 in DACH): **Deutsch · English · العربية · فارسی**. Each item carries `lang` and `dir` attributes (`<a lang="ar" dir="rtl" hreflang="ar">`), and the current one has `aria-current="true"`.
- **Behaviour:** links go to the **equivalent page** via `pathnames`. If a page has no translation, link to that locale's home and show a muted note in the list („Diese Seite gibt es noch nicht auf English"). The choice lives in the URL; no cookie is needed.

### 8.3 RTL with logical properties (do it now)

The current code has **about 40 physical direction utilities across 15 files** (`pl-`, `left-`, `-mr-`, `right-`, `translate-x`, …). Sweep them during the refactor, not in phase 3:

| Physical (today) | Logical (use) |
| --- | --- |
| `pl-8`, `pr-4`, `ml-*`, `mr-*` | `ps-8`, `pe-4`, `ms-*`, `me-*` |
| `left-0`, `right-[3%]` | `start-0`, `end-[3%]` |
| `border-l`, `rounded-l` | `border-s`, `rounded-s` |
| `text-left` | `text-start` |
| `group-hover:translate-x-1` (arrows) | `group-hover:translate-x-1 rtl:group-hover:-translate-x-1` |
| CSS `padding-left` / `left:` | `padding-inline-start` / `inset-inline-start` |

CSS Grid and Flexbox follow `dir` automatically: `col-start-8` counts from the inline start in RTL, so the editorial grid mirrors with no changes. Add a lint rule or a pre-commit grep that flags new physical utilities.

**Mirror:** layout, the rail position, nav order, directional arrows (`ArrowRight` / `ArrowLeft` / `ArrowUpRight` via `rtl:-scale-x-100`), process sequence direction, slide-in directions of `Reveal` variants, breadcrumb separators, `DeviceShowcase` arrangement (laptop moves to the inline-end side).

**Do not mirror:**

- Logos and the wordmark (including Latin "Reza Alami" in an RTL header)
- **Screenshots and device content.** Client sites are LTR German sites; never flip images.
- Numbers and metric values (digits keep their internal order), phone numbers, postcodes, prices' digit order
- URLs, email addresses, code and technology names. Wrap them in `<bdi>` or `dir="ltr"` spans inside RTL text.
- Media controls (play / progress for the Schnellcheck sample video): playback is LTR time.
- Checkmarks, plus icons, the ↗ "external" semantics (mirror the arrow, keep the meaning)
- Charts with time axes (none planned)

### 8.4 Fonts for Arabic and Persian

Pair with Geist's neutral, slightly geometric grotesk. Both families are on Google Fonts, so they can be self-hosted via `next/font` like the current fonts:

| Locale | Family | Why |
| --- | --- | --- |
| `ar` | **IBM Plex Sans Arabic** (300–700) | Rational, low-contrast Naskh-influenced sans; reads as "engineered" like Geist; complete Arabic coverage; good small-size legibility. |
| `fa` | **Vazirmatn** (variable 100–900) | The de-facto quality Persian sans; correct Persian forms (ی ک, Persian digits), proper ZWNJ (نیم‌فاصله) handling; variable weights match Geist's range. |
| `fa` accent | **Parastoo** (variable 400–700) | Persian Naskh by Vazirmatn's designer (Saber Rastikerdar): shares its metrics and Persian forms, so the accent sits on the same line without jumping. |
| `ar` accent | **Markazi Text** (variable 400–700) | Editorial Naskh drawn for Arabic text (Borna Izadpanah); calm contrast next to Plex, the Arabic counterpart of Instrument Serif's role. |

Chosen October 2026 after comparing, with the site's real copy on ink: Estedad (fa) and Readex Pro / Noto Sans Arabic (ar) as text faces, Amiri as accent. Vazirmatn and Plex stayed (best Persian forms; most refined Arabic sans); the Naskh accents replaced the bold-sans emphasis.

- **Font stack:** `font-family: var(--font-geist), var(--font-vazirmatn | --font-plex-arabic), system-ui`. Geist has no Arabic glyphs, so Latin runs (brand names, tech terms) stay in Geist and script runs fall through to the Arabic family per glyph.
- Apply the font variable only in the RTL locale layouts, and check in the network panel that `de` pages don't preload Arabic font files.
- **RTL typography adjustments** (`:root[dir="rtl"]` overrides):
  - Body size **+1 step** (1.125 rem): Arabic script has a smaller x-height-equivalent at the same nominal size.
  - Line-height body **1.8**, headings **1.25** (stacked dots and descenders need room).
  - **`letter-spacing: 0` everywhere.** Negative or positive tracking breaks cursive joining. This overrides `t-h1` to `t-label`.
  - `t-label`: no uppercase (no case in Arabic script), no mono. Use the script family at 0.8125 rem, weight 500.
  - **`serif-accent` → Naskh accent face** (Parastoo for `fa`, Markazi Text for `ar`; `--font-script-serif`), upright, weight 600, **1.08 em** because Naskh has a smaller eye than the sans. Instrument Serif has no Arabic, and italics aren't a native Arabic-script convention.
  - `hyphens: none` (not applicable to these scripts).

### 8.5 Text expansion budgets

German is the longest locale, so **design and test everything in German +10 %**. Other locales then fit by default.

| Locale | Length vs. German (chars) | Vertical | Design rule |
| --- | --- | --- | --- |
| `de` | baseline | baseline | Button labels ≤ 26 chars · nav items ≤ 12 · H1 ≤ 60 (homepage brand line: approved exception, §03) · H2 ≤ 55 · metric labels ≤ 40 · service includes ≤ 40 |
| `en` | about −15 to −25 % | same | Don't shrink containers; let lines get shorter |
| `ar` | about −20 to −30 % | **+20–30 % line-height** | Watch fixed-height components (buttons, CTA bar, header): use min-heights, never fixed heights with text |
| `fa` | about −10 to −20 % | **+20–30 % line-height** | Same as `ar` |

No component may rely on single-line text: every button, label and nav item must survive wrapping to 2 lines without breaking the layout (test with pseudo-localization: German strings ×1.3).

### 8.6 Numerals, dates and currency

All formatting goes through **one helper module** (`src/i18n/format.ts`) built on `Intl`; components never format by hand.

| | `de` | `en` | `ar` | `fa` |
| --- | --- | --- | --- | --- |
| Intl locale | `de-DE` | `en-GB` | `ar-u-nu-arab` | `fa-IR-u-nu-arabext-ca-gregory` |
| Digits in copy, prices, metrics | 0–9 | 0–9 | Arabic-Indic ٠–٩ (U+0660–0669) | **Extended Arabic-Indic (Persian) ۰–۹ (U+06F0–06F9)**. Never mix them with Arabic ٤٥٦, which have different shapes. |
| Phone, postcode, URLs, version numbers | as is | as is | **Latin digits, `dir="ltr"`** (copy-paste and dialling) | **Latin digits, `dir="ltr"`** |
| Price „ab" | „ab 7.500 €" | „from €7,500" | `Intl` currency EUR, „ابتداءً من" | `Intl` currency EUR, „از" |
| Dates | „8. Oktober 2026" | „8 October 2026" | Gregorian, Arabic month names | **Gregorian** (forced via `-ca-gregory`; `fa-IR` defaults to the Solar Hijri calendar, but contracts, deadlines and availability are DACH-based) |
| Currency | always EUR (the business invoices in EUR) | | | |

### 8.7 Legal pages per locale

- **Impressum** (§ 5 DDG; the DDG replaced the TMG in May 2024) and **Datenschutzerklärung** exist in **every locale**: `/impressum`, `/datenschutz`, `/en/imprint`, `/en/privacy`, `/ar/imprint`, `/ar/privacy`, `/fa/imprint`, `/fa/privacy`.
- The German version is the legally binding one. Translations carry a note at the top: „Übersetzung. Maßgeblich ist die deutsche Fassung." (translated into the page language, with a link to the German page).
- The privacy policy must be understandable in the language of the page the visitor used (transparency, Art. 12 DSGVO), so it's a real translation, not a link to German.
- Footer links to both pages in every locale, on every page.
- Forms in each locale send their locale with the submission, so confirmation emails go out in the same language.

---

## 09 · Anti-patterns

### 9.1 Avoid on this project

| Anti-pattern | Why it hurts *this* site | Do instead |
| --- | --- | --- |
| Gradient blobs, glows, aurora backgrounds | The #1 "generated landing page" tell; signals style over substance to a Mittelstand buyer | Flat `canvas`, one `surface` band, real screenshots |
| Neural nets, particles, token streams, decode effects, sparkles | Says "AI startup"; contradicts STRATEGY (AI is a capability, not the pitch); DACH owners are wary of AI hype | AI appears as plain-language line items („Anfragen automatisch vorqualifizieren") |
| Bento grid of everything | Equal-weight tiles kill hierarchy; it's the 2024–26 default template | Rail + wide, split 7/5, full-bleed band (§05.2) |
| `01 / 02 / 03` numbering on non-sequences | Fake structure; mono numbers everywhere = developer-portfolio cliché | Numbers only for real sequences: Ablauf, "So geht es weiter" |
| Skill bars, percentages, tech-logo walls, tool pill clouds | Buyers don't buy React; STRATEGY §07 bans them | Outcomes; tech in collapsed case-study details |
| Emoji anywhere in UI | Unserious for the audience | Words; the existing icon set |
| Glassmorphism, frosted headers | Template tell, GPU cost, contrast loss | Solid `canvas` header with a hairline |
| Fake logos, „trusted by" with no clients, invented metrics | Fatal if discovered; possibly UWG-relevant | Named real clients; pending states |
| Stock teams, „wir" as a solo founder, invented headcount | STRATEGY §06; German buyers notice | „ich", the real portrait, named collaborators |
| „Leidenschaftlich", „passionate", „innovative Lösungen", „maßgeschneidert" filler | Says nothing; every competitor says it | Specific outcomes and constraints |
| Scroll-jacking, pinned sections, scroll-scrubbed text | Fights the reader; inaccessible; slow | Native scroll, block fades |
| Custom cursors, magnetic UI, cursor-following glows | Hide or move click targets; useless on touch; accessibility cost | Native cursor; hover = colour/underline |
| Carousels/sliders for testimonials or projects | Hidden content, low engagement | Show 2–3 items, stacked |
| Boxed "card" sections with border + radius + glow | Violates `DESIGN.md` (no card boxes) | Hairlines and space |
| Exit-intent popups, chat bubbles, countdowns, fake scarcity | Pushy; erodes the "ohne Verkaufsdruck" promise | Honest availability line |
| Cookie banner | Unneeded if analytics are cookieless and embeds are two-click | No banner at all (itself a trust signal) |
| Placeholder text that looks real („+300 %", „Max Mustermann, CEO") | Reads as fabricated proof | Dashed `<Placeholder>` or a pending state |
| Giant name as the hero H1 | Ego-first; zero SEO and outcome value | Outcome H1, name in the byline |
| Oversized cropped footer wordmark | 2024–26 trend tell | Compact footer; the studio wordmark at normal size in phase 2 |

### 9.2 Found in the current codebase

| Where | Anti-pattern | Action |
| --- | --- | --- |
| `components/home/HeroField.tsx`, `NeuralDiagram.tsx`, `components/motion/TokenStream.tsx`, `ScrambleText.tsx` | Neural mesh, token streaming, decode text (AI-aesthetic tells) | **Delete** |
| `globals.css` `.ai-gradient-text`, `.ai-sheen`, `@keyframes sheen`; `components/ui/AiBadge.tsx`; `Sparkle` icon | Gradient sheen text, AI badges, sparkles | **Delete** |
| `Hero.tsx` ambient layers (`ambient-drift` radial blobs with `blur-2xl`); `DeviceShowcase.tsx` `bg-ember/10 blur-[100px]` glow; `Intelligence.tsx` `bg-ember/5 blur-3xl` | Gradient blobs / glows | **Delete** (`DeviceShowcase` keeps the devices, loses the glow) |
| `Hero.tsx` `animate-ping` dot + „Built for the age of AI — software, web, apps & smart home"; „Portfolio · {year}" | Meaningless status pulse; off-strategy eyebrow | Replace with the factual eyebrow + availability line |
| `Hero.tsx` name at `t-display` (15 rem, `whitespace-nowrap`) as H1 + four roles numbered `01–04` | Name-as-hero, fake numbering | Outcome H1 (§03); the four approved role titles move to the founder byline, unnumbered |
| `Hero.tsx` „Scroll to explore" cue; „Design → AI → Build → Market" rail | Filler | Delete |
| `Navigation.tsx` `01/02/03` on nav items, „SE · AI · WD · DM" next to the name; mobile menu `0n` numbers | Fake numbering; cryptic abbreviations | German labels, `BrandMark` |
| `Navigation.tsx` `bg-ink/75 backdrop-blur-md` | Glass header | Solid `canvas/96` |
| `SectionHeading.tsx` `({index})`, used `(01)`–`(07)` across sections; `Expertise`, `Technologies`, `Intelligence`, `Intro`, `contact/page.tsx` brief, case-study `CaseSection` `(01)`–`(07)` | Numbering on non-sequences | Remove the `index` prop |
| `components/motion/CustomCursor.tsx` + `html.has-custom-cursor * { cursor: none }` | Hides the native cursor; label bubble over projects | **Delete** (and `data-cursor*` attributes) |
| `components/motion/ScrollText.tsx` (words at 20 % opacity until scrolled) | Scroll-scrubbed reading; key copy fails contrast until scrolled | **Delete**; plain paragraphs |
| `components/motion/Spotlight.tsx` in `ClosingCTA` (bordered box + pointer glow) | Card box + cursor glow | Replace with `FinalCta` |
| `Magnetic` on header CTA, hero CTA, contact CTA, closing CTA | Moving click targets | Remove except optionally `FinalCta` |
| `Intelligence.tsx`, `Intro.tsx` capability/chain **pills** | Pill clouds; violates "pill = button only" | Delete with the sections |
| `Technologies.tsx` on the homepage (with empty groups and placeholders) | Tech list on a sales page | Move confirmed tools to `/ueber` `<details>` |
| `Background.tsx` + `Timeline` on the homepage | CV timeline in the sales path | Move to the bottom of `/ueber` |
| `Footer.tsx` 19.5 vw gradient-clipped wordmark | Trend tell | Delete |
| `ScrollProgress` (global) | Decoration on short pages | Delete |
| `.grain` at `z-index: 90` above all content | Tints client screenshots and text | Delete, or move to `z-[-1]` on the hero only |
| `ProjectCard` `01 / 03` counter; `TechnologyList` on cards; `LiveLink` pill with dot | Numbering, tech-first, extra pill | Per §03-05 |
| `profile.ts` smart home in `expertise`, `aiDomains`, `technologies`; `page.tsx` / `about/page.tsx` JSON-LD `knowsAbout: "Smart Home Technology"`; `layout.tsx` title „Software Engineer, AI & Web Developer" | Off-positioning | Remove (STRATEGY §10) |
| `layout.tsx` `lang="en"`, `site.locale = "en_US"`, English UI everywhere, „Skip to content" | Wrong language for the market | `lang="de"`, `de_DE`, German dictionary, „Zum Inhalt springen" |
| `contact/page.tsx` „Start a Project" → `mailto` or `#channels`; no form | No qualification, no confirmation state | `/kontakt` per §02.6 |
| about 40 physical-direction utilities in 15 files | RTL blocker | Logical sweep (§08.3) |

---

## 10 · Developer handoff

### 10.1 Conventions

- **Next.js 16.** Read the relevant guide in `node_modules/next/dist/docs/` before each feature (per `AGENTS.md`): `02-guides/internationalization.md`, `03-api-reference/03-file-conventions/proxy.md`, `04-functions/next-root-params.md`, `02-guides/forms.md`, `02-guides/server-actions.md`, `02-guides/json-ld.md`, `02-guides/preventing-flash-before-hydration.md`.
- **Server Components by default.** Client components only for: `SiteHeader` (scroll/CTA state), `MobileMenu`, `MobileCtaBar`, `ThemeToggle`, `LanguageSwitcher` (phase 2), `BookingEmbed`, form wrappers (`useActionState`), `ScrollPreview` expand, `DeviceShowcase` (existing).
- **No hard-coded UI strings in components.** Everything comes from the dictionary or content.
- **Logical CSS only** (§08.3). **Semantic colour tokens only** (§05.3).
- Every CTA: `data-cta`, `data-cta-position`; page-level primaries: `data-primary-cta`.

### 10.2 Content architecture

```
src/
  i18n/
    config.ts          locales = ['de'] (phase 1), defaultLocale = 'de', dir map, Intl locale map
    pathnames.ts       routeKey → { de: '/leistungen/[service]', en: '/services/[service]', … }
    href.ts            href(locale, routeKey, params)
    format.ts          formatPrice, formatPriceFrom, formatDate, formatNumber, addBusinessDays, typo()
    dictionaries.ts    getDictionary() via next/root-params `lang`
  content/
    types.ts           all shared types below
    facts/             locale-neutral data
      site.ts          contact, address, socials, brandPhase, studio, booking, capacity, availability
      projects.ts      slug, images, links, client facts, results (numbers), order, services[]
      services.ts      slug, tier, priceFrom, priceUnit, order, relatedProject
    de/                German copy, keyed by slug
      ui.ts            nav, CTA labels, microcopy, form labels/hints/errors, states
      home.ts          section headings, problem statements, comparison rows
      services.ts      per-service copy (hero, fit, includes, process, faq)
      projects.ts      per-project copy (headline, summary, challenge, decisions, features, credits)
      faq.ts           global FAQ
      testimonials.ts  (empty array until real)
      about.ts         founder story, principles, refusals, journey
      legal.ts         Impressum + Datenschutz (or MDX, see below)
```

`src/content/site.ts`, `profile.ts` and `projects.ts` migrate into this structure. Legal texts: MDX is acceptable (check `02-guides/mdx.md`) if Reza's lawyer/generator delivers long prose; otherwise structured TS.

**Key types (new and extended fields):**

```ts
type Locale = 'de' | 'en' | 'ar' | 'fa';
type ServiceSlug = 'website-erstellen-lassen' | 'website-relaunch' | 'web-app-entwicklung' | 'seo' | 'wartung-hosting';
type CtaIntent = 'erstgespraech' | 'anfrage' | 'schnellcheck';

// facts/site.ts additions
brandPhase: 1 | 2 | 3;
studio: { name: string | null; legalForm: string | null };
phone: string | null;                 // E.164, rendered dir="ltr"
address: { street: string | null; zip: string | null; city: string | null; country: 'DE' | 'AT' | 'CH' | null };
capacity: { projectsPerQuarter: number | null };
availability: { nextStart: string | null };   // ISO month "2027-01"
booking: { provider: string | null; url: string | null; privacyUrl: string | null };
responsePromiseHours: 24;
// keep: roles = the four approved titles, in order; remove: smart-home wording; positioning/description move to de/ui.ts

// facts/services.ts
type Service = {
  slug: ServiceSlug; tier: 'lead' | 'secondary';
  priceFrom: number | null;           // null → placeholder; suggestion in a comment
  priceUnit: 'once' | 'month';
  secondaryPrice?: { from: number | null; unit: 'once' | 'month'; labelKey: string }; // SEO audit + retainer
  relatedProject: string | null;      // project slug
  order: number;
};

// facts/projects.ts additions
client: { name: string; city: string | null; industry: string | null };
services: ServiceSlug[];
launch: string | null;                // ISO month
resultsStatus: Array<'measured' | 'technical' | 'pending' | 'qualitative'>;
results: Metric[];
before?: ProjectImage & { year: string | null };
artefacts: Array<ProjectImage & { captionKey: string }>;
testimonialId: string | null;

type Metric = {
  id: string;
  value: number | null; unit: '%' | 'ms' | 's' | 'score' | 'count' | '€';
  verified: boolean;                  // MetricItem renders nothing unless true
  kind: 'business' | 'technical';
  source: string | null;              // "PageSpeed Insights, mobil"
  measuredAt: string | null;          // ISO date
  period: string | null;              // "90 Tage nach Launch vs. Vorjahr"
};

// de/projects.ts per slug
headline: string | null; summary: string | null; challenge: string | null;
decisions: Array<{ title: string; why: string }>;
featureGroups: Array<{ title: string; items: string[] }>;
outcome: string | null; afterLaunch: string | null;
measurementPlan: string | null;       // for 'pending'
qualitativeOutcomes: string[];        // client-confirmed only
metricLabels: Record<string, string>; // Metric.id → label
role: string[] | null;
credits: Array<{ role: string; name: string; href?: string }>;

// de/testimonials.ts
type Testimonial = {
  id: string; quote: string; name: string; role: string; company: string;
  photo: ProjectImage | null; videoUrl: string | null; projectSlug: string | null;
  permission: { date: string; channel: string };   // not rendered
};

// de/faq.ts and service faq
type FaqItem = { id: string; question: string; answer: string | null };
```

### 10.3 Page-by-page plan

#### `/` Homepage

- **Purpose:** hub for brand, LinkedIn and referral traffic; recognition → proof → offer → action.
- **Sections:** `HomeHero` → `ProofStrip` → `ProblemStatements` → `ServiceList` → `SelectedWork` → `ComparisonTable` → `ProcessSteps` → `FounderSection` → `Testimonials` (conditional) → `SchnellcheckForm variant="inline"` → `FaqList` → `FinalCta`.
- **Content:** `de/home.ts`, `de/ui.ts`, `facts/services.ts` + `de/services.ts`, `getFeaturedProjects()`, `de/faq.ts`, `de/testimonials.ts`, `facts/site.ts`.
- **CTAs:** see the CTA map in §03.
- **States:** Testimonials hidden if < 2. Proof items fall back to technical/pending. Schnellcheck: idle / field error / pending / server error / inline success.
- **Responsive:** §07.1.
- **SEO:** title **„Webdesign & Web-Apps für KMU | dotMind · Reza Alami"** (SEO §4.1 option A, 51 characters), description ≤ 155 chars with outcome + audience. JSON-LD: `WebSite`, `ProfessionalService` (name, `founder: Person`, `areaServed: ["DE","AT","CH"]`, address when set, `priceRange` when prices are confirmed, `sameAs`), `FAQPage`.
- **Acceptance:**
  - Above the fold at 1440 × 900: H1, lead, both CTAs, micro-proof, founder byline and the project visual. At 375 × 812: H1, lead, primary CTA, and the top edge of the proof strip within 1.3 viewports.
  - Exactly one filled primary button is visible in any viewport at 375 and 1440 (header CTA ghost while the hero CTA is visible).
  - No element from §9.2's delete list is shipped.
  - Lighthouse mobile ≥ 95 in all four categories; LCP < 2.0 s; CLS < 0.05 (STRATEGY §10).
  - No layout overflow at 320 px with the German test strings.

#### `/leistungen` Services overview

- **Purpose:** landing for generic service searches; directory for the three lead services and the secondary ones.
- **Sections:** `PageHeader` (H1 **Leistungen, die sich rechnen müssen.**) → `ServiceList variant="expanded"` → secondary services block (`id="weitere"`: Wartung & Hosting, KI-Integration & Automatisierung, Wachstumsbetreuung, each with price + one line) → `SchnellcheckStrip` → `FaqList` (3 cost questions) → `FinalCta`.
- **Content:** `facts/services.ts`, `de/services.ts`.
- **SEO:** `ItemList` of `Service`s; `BreadcrumbList`.
- **Acceptance:** all prices render via `formatPriceFrom` with NBSP; secondary services clearly visually subordinate (no buttons).

#### `/leistungen/[service]` Service page

- **Purpose:** standalone landing page for service search traffic.
- **Sections:** per §02.3: `ServiceHero` → `FitList` → `ProblemOutcomeList` → `DeliverablesList` → `CaseStudyFeature` (relatedProject) → `ProcessSteps` (service-specific) → `InvestmentBlock` → `FaqList` → `SchnellcheckStrip` → `FinalCta`.
- **Content:** `facts/services.ts` + `de/services.ts[slug]`; project via `relatedProject`.
- **Routing:** `generateStaticParams` from services; `dynamicParams = false`.
- **CTAs:** hero primary **Erstgespräch vereinbaren**; Investition primary **Projekt anfragen** → `/kontakt?leistung=<slug>#anfrage`; strip tertiary.
- **States:** if `relatedProject` is null, the section is omitted (not a placeholder).
- **SEO:** title pattern **„{Service} – ab {Preis} | Reza Alami"** (price only if confirmed; otherwise „{Service} für KMU | Reza Alami"). JSON-LD: `Service` (`provider` → ProfessionalService, `areaServed`, `offers.priceSpecification.minPrice` when confirmed), `FAQPage`, `BreadcrumbList`.
- **Acceptance:** H1 is an outcome, not the service name; the price is visible in the hero at 375 px without scrolling past the CTA; `?leistung` prefill works.

#### `/projekte` Case study index

- **Purpose:** proof archive.
- **Sections:** `PageHeader` (H1 **Projekte für echte Betriebe.**, intro: one line on what each case shows) → grid of `CaseStudyCard` (the existing archive layout, offset second column kept) → `FinalCta` (variant **Ähnliches Vorhaben?**).
- **Card content:** cover, client name, Branche · Stadt, outcome headline, lead metric or „In Messung", link.
- **SEO:** `CollectionPage` + `ItemList`; `BreadcrumbList`.
- **Acceptance:** no tech lists, no counters; each card fully keyboard-reachable through one link (the title), image link `tabIndex={-1}` as today.

#### `/projekte/[slug]` Case study

- **Purpose:** convince with depth; works as a standalone landing page from LinkedIn.
- **Sections:** §04.2.
- **Content:** `facts/projects.ts` + `de/projects.ts[slug]`, `de/testimonials.ts`.
- **States:** `ResultsBand` per `resultsStatus`; `ClientQuote` omitted if no testimonial; `BeforeAfter` omitted if no `before`; `Artefact`s omitted if empty; the `Credits` role is a placeholder if null (launch-critical).
- **Responsive:** §07.5.
- **SEO:** title **„{Kunde}: {Outcome-Headline kurz} | Fallstudie"**; JSON-LD `Article` (replaces today's `CreativeWork`; `author` → Person, `publisher` → ProfessionalService, `about` → client `Organization`, dates) + `BreadcrumbList`; OG image per project (existing `opengraph-image.tsx`, translated, showing client + headline).
- **Acceptance:** the results band (or the pending block) is visible without scrolling past the device composition at 1440; every rendered metric has `verified: true`, a source and a date; the live link opens in a new tab and announces it.

#### `/ueber` Founder page

- **Purpose:** trust; the place a second decision maker checks.
- **Sections:** §02.5.
- **Content:** `de/about.ts`, `facts/site.ts`, the confirmed tools list.
- **SEO:** `ProfilePage` with `mainEntity: Person` (jobTitle **["Software Engineer", "AI Specialist", "Web & App Developer", "Digital Marketer"]**, `knowsAbout` without smart home, `worksFor` → ProfessionalService).
- **Acceptance:** no timeline above the fold; the portrait is a real photo before launch; „ich" voice throughout.

#### `/kontakt` and `/kontakt/danke`

- **Purpose:** convert all three intents.
- **Sections:** §02.6; components `IntentSelector`, `BookingEmbed`, `InquiryForm`, `ContactDirect`, `NextSteps`.
- **Server:** `app/[lang]/kontakt/actions.ts` → `submitInquiry(prevState, formData)`: validate (shared schema), honeypot/time trap, send 2 emails, `redirect('/kontakt/danke?typ=anfrage')`. Locale is passed as a hidden field, because `next/root-params` isn't available in Server Actions.
- **States:** all states in §06.3 and §06.5.
- **SEO:** `ContactPage`; `/kontakt/danke` gets `robots: { index: false }`.
- **Acceptance:** the form submits and validates **without JavaScript**; errors are announced (error summary focused, `aria-invalid`, `aria-describedby`); inputs survive a server error; no third-party request before **Kalender laden** is clicked (verify in the network panel); the CTA bar is hidden; no personal data in any URL.

#### `/website-check` and `/website-check/danke`

- **Purpose:** capture researchers; upsell the paid check.
- **Sections:** `PageHeader` (H1 **Ihr kostenloser Website-Schnellcheck.**, lead with the 48-hour promise) → `SchnellcheckForm variant="page"` (immediately visible) → **Was Sie bekommen** (3 items) → sample still (`[Beispielvideo]` placeholder; real once recorded, with captions) → **Mehr Tiefe?** paid Website-Check block: „Der ausführliche Website-Check: zwei Stunden Analyse von Conversion, SEO, Ladezeit und Tracking – als Video und schriftliche Maßnahmenliste. `[490]` €, wird bei Beauftragung angerechnet." + **Website-Check anfragen** (secondary → `/kontakt?leistung=website-check#anfrage`) → mini FAQ (3) → no final CTA (the page *is* the CTA; end with the contact line).
- **Server:** `submitSchnellcheck` action; double opt-in mail only if the checkbox is ticked.
- **Acceptance:** works without JS; the danke page shows the computed delivery date (+2 business days, German format); `noindex` on danke.

#### `/impressum`, `/datenschutz`

- **Purpose:** legal compliance and trust.
- **Layout:** `LegalPage`: rail label + prose column (66ch), `h2` anchors, a table of contents for Datenschutz, last-updated date, print styles.
- **Content:** `de/legal.ts` or MDX; every unknown is a placeholder (address, register, VAT ID). **Launch-blocking.**
- **Acceptance:** reachable from every page's footer in one click; no placeholders at launch.

#### `not-found`

- German: H1 **Diese Seite gibt es nicht (mehr).** + links **Leistungen · Projekte · Kontakt** + primary **Zur Startseite**. A 308 redirect map for the old English routes prevents most 404s.

#### Global: layout, header, footer

- `app/[lang]/layout.tsx`: `<html lang={lang} dir={dir} data-theme suppressHydrationWarning>`, fonts, theme script, skip link **Zum Inhalt springen**, `SiteHeader`, `<main id="main">`, `SiteFooter`, `MobileCtaBar`. Remove `CustomCursor`, `ScrollProgress` and the grain overlay.
- `next.config.ts` `redirects()`: `/projects` → `/projekte`, `/projects/:slug` → `/projekte/:slug`, `/about` → `/ueber`, `/contact` → `/kontakt` (all 308).
- `sitemap.ts`, `robots.ts`: German routes, `alternates.languages` ready, danke pages excluded.

### 10.4 Component inventory

**Layout & global**

| Component | New / existing | Props | Notes |
| --- | --- | --- | --- |
| `SiteHeader` | refactor `Navigation` | (none; reads dict + pathname) | German nav, `BrandMark`, CTA ghost/filled via `usePrimaryCtaVisible`, solid background, no numbering |
| `MobileMenu` | refactor (inside `SiteHeader`) | `onClose`, `returnFocusTo` | Content per §07.2 |
| `MobileCtaBar` | **new** (client) | `hiddenOnRoutes?: string[]` | §07.3 |
| `BrandMark` | **new** | `phase: 1\|2\|3`, `size?: 'header'\|'footer'` | Endorsed brand logic |
| `SiteFooter` | refactor `Footer` | (none) | Columns: Leistungen · Studio · Kontakt · Rechtliches; trust line; theme toggle; no giant wordmark |
| `ThemeToggle` | **new** (client) | `variant: 'segmented'\|'icon'` | „Hell · Dunkel · System"; `role="radiogroup"` |
| `LanguageSwitcher` | **new** (phase 2) | `current: Locale`, `alternates: Partial<Record<Locale, string>>` | §08.2 |
| `Breadcrumbs` | **new** | `items: { label: string; href?: string }[]` | Emits `BreadcrumbList` JSON-LD |
| `JsonLd` | existing | `data` | keep |
| `Placeholder`, `OrPlaceholder` | existing | `children`, `className` | keep |

**Typography & actions**

| Component | New / existing | Props | Notes |
| --- | --- | --- | --- |
| `ButtonLink` | extend | `+ intent?: CtaIntent`, `+ position?: string`, `+ primaryCta?: boolean`, `+ fullWidthMobile?: boolean` | Emits `data-cta*`; add a `Button` sibling for `<button type="submit">` with a `pending` prop |
| `ArrowLink` | keep | as today + `intent?`, `position?` | RTL arrow mirroring |
| `SectionHeading` | modify | remove `index`; `label`, `title`, `aside?`, `id`, `as?: 'h2'\|'h1'` | Block fade instead of per-word `AnimatedText` |
| `PageHeader` | modify | `eyebrow`, `title: ReactNode`, `intro?`, `actions?`, `media?` | Single H1 (not forced lines) + optional media slot |
| `PriceFrom` | **new** | `amount: number\|null`, `unit: 'once'\|'month'`, `prefix?: 'ab'\|'Audit ab'` | Uses `formatPriceFrom`; placeholder when null |
| `Microcopy` | **new** | `children` | Small `fg-muted` line under CTAs |

**Home & marketing sections**

| Component | New / existing | Props |
| --- | --- | --- |
| `HomeHero` | replaces `Hero` | `featuredProject: Project` |
| `ProofStrip` / `ProofItem` | **new** | `items: { project: Project; metric?: Metric }[]` |
| `ProblemStatements` | **new** | `statements: { text: string; service: ServiceSlug }[]`, `bridge: string` |
| `ServiceList` / `ServiceRow` | **new** | `services: Service[]`, `variant: 'compact'\|'expanded'` |
| `SelectedWork` | refactor | `projects: Project[]`, `cta: boolean` |
| `CaseStudyFeature` | refactor `ProjectCard` feature | `project`, `flip?`, `priority?` |
| `CaseStudyCard` | refactor `ProjectCard` archive | `project`, `priority?` |
| `ComparisonTable` | **new** | `columns: { key; label; highlight?: boolean }[]`, `rows: { criterion; values: Record<string,string> }[]`, `caption` |
| `ProcessSteps` | refactor `Process` | `steps: { title; text; duration: string\|null; deliverable: string }[]` |
| `FounderSection` | **new** | `variant: 'home'\|'about'` |
| `Testimonials` / `TestimonialQuote` | **new** | `items: Testimonial[]` (section returns null if < 2) / `testimonial`, `size: 'lg'\|'sm'` |
| `SchnellcheckForm` | **new** (client wrapper + server action) | `variant: 'inline'\|'page'` |
| `SchnellcheckStrip` | **new** | (none) (compact single-row version for service pages) |
| `FaqList` | **new** | `items: FaqItem[]`, `withJsonLd?: boolean` |
| `FinalCta` | replaces `ClosingCTA` | `title`, `lead`, `variant?: 'default'\|'project'` |

**Service page**

| Component | New / existing | Props |
| --- | --- | --- |
| `ServiceHero` | **new** | `service: Service` |
| `FitList` | **new** | `fits: string[]`, `notFits: string[]` |
| `ProblemOutcomeList` | **new** | `rows: { problem; outcome }[]` |
| `DeliverablesList` | **new** | `groups: { title; items: string[] }[]` |
| `InvestmentBlock` | **new** | `service: Service`, `drivers: string[]`, `carePlan: Service` |

**Case study**

| Component | New / existing | Props |
| --- | --- | --- |
| `CaseHeader` | **new** (from current page header) | `project` |
| `FactSheet` | **new** (replaces `Meta`) | `items: { label; value: ReactNode }[]` |
| `ResultsBand` / `MetricItem` | **new** | `status`, `metrics: Metric[]`, `labels`, `measurementPlan?` / `metric`, `label`, `lead?: boolean` |
| `CaseSection` | modify | `label`, `children` (no index) |
| `DecisionList` | **new** | `decisions: { title; why }[]` |
| `Artefact` | **new** | `image`, `caption` |
| `BeforeAfter` | **new** | `before`, `after`, `beforeYear`, `afterYear` |
| `FeatureGroups` | **new** | `groups` + `technologies` (collapsed `<details>`) |
| `ClientQuote` | **new** (= `TestimonialQuote size="lg"`) | `testimonial` |
| `CreditsList` | **new** | `role: string[]`, `credits` |
| `DeviceShowcase` | modify | `screens`, `priority` (remove glow; mobile layout §07.5) |
| `ScrollPreview` | modify | `image`, `host` (mobile expand) |
| `DeviceFrames`, `ProjectImage`, `TechnologyList` | keep | as is |
| `NextProject` | keep (move to its own file) | `project` (drop `data-cursor`) |

**Contact & forms**

| Component | New / existing | Props |
| --- | --- | --- |
| `IntentSelector` | **new** | `items: { intent; title; text; href }[]` |
| `BookingEmbed` | **new** (client) | `provider`, `url`, `privacyUrl` |
| `InquiryForm` | **new** (client wrapper) | `defaultService?: ServiceSlug`, `locale` |
| `Field`, `TextInput`, `TextArea`, `ChoiceGroup`, `Checkbox` | **new** | `name`, `label`, `hint?`, `error?`, `required?`, `autoComplete?`, `inputMode?`, `options?` |
| `ErrorSummary` | **new** | `errors: { name; message }[]` (focus on mount) |
| `SubmitButton` | **new** | `label`, `pendingLabel` (uses `useFormStatus`) |
| `NextSteps` | **new** | `steps: string[]`, `title` |
| `ContactDirect` | **new** | (none) (reads site facts) |
| `LegalPage` | **new** | `title`, `updated`, `children`, `toc?` |

**Delete:** `HeroField`, `NeuralDiagram`, `Intelligence`, `Intro`, `Expertise`, `Technologies` (home), `Background` (home), `TokenStream`, `ScrambleText`, `ScrollText`, `Spotlight`, `CustomCursor`, `ScrollProgress`, `AiBadge`, and `AnimatedText` (once unused). `Magnetic` and `Parallax` stay only if still referenced after the refactor.

**Hooks:** `usePrimaryCtaVisible()` (IntersectionObserver over `[data-primary-cta]`, shared context for `SiteHeader` + `MobileCtaBar`), `useInputFocused()` (for the CTA bar).

### 10.5 Implementation order

Each step ships something reviewable. Steps 1–4 don't depend on any of Reza's pending decisions (STRATEGY §10).

1. **Clean-up.** Delete everything in §9.2 marked delete; strip smart home; remove numbering; replace the homepage with a temporary section list. *Done when:* build passes, no AI-layer code remains.
2. **Tokens and type.** Semantic colour tokens + light theme + `ThemeToggle` + no-flash script; revised type scale, `t-metric`, hyphenation CSS, rhythm tokens; logical-property sweep; print stylesheet. *Done when:* both themes pass contrast (`accent` text ≥ 4.5:1) and there are zero physical-direction utilities.
3. **i18n skeleton.** `app/[lang]`, `proxy.ts` rewrite/redirect, `next/root-params`, dictionaries, `pathnames`, `format.ts`, German routes + 308 redirects, `lang="de"`, `de_DE` metadata. *Done when:* `/leistungen` resolves, `/de/leistungen` 308s to it, and old English URLs 308 to German ones.
4. **Content models.** New `facts/` + `de/` structure, types, `check-placeholders` script; migrate existing project facts.
5. **Global chrome.** `SiteHeader`, `MobileMenu`, `MobileCtaBar`, `SiteFooter`, `BrandMark`, `usePrimaryCtaVisible`, `LegalPage` + `/impressum` + `/datenschutz` shells.
6. **Homepage** in section order (01 → 12).
7. **Case-study template** (`/projekte/[slug]` + `/projekte`): results states, mobile imagery.
8. **Service template** (`/leistungen/[service]` + `/leistungen`).
9. **Conversion flows.** `InquiryForm` + action + emails, `BookingEmbed`, `/kontakt/danke`, `SchnellcheckForm` + `/website-check` + danke, analytics events.
10. **`/ueber`** and the 404.
11. **SEO.** JSON-LD per page, sitemap with alternates, OG images in German, titles/descriptions.
12. **QA and launch gate** (below).

### 10.6 QA and launch gate

- **Placeholder gate:** `scripts/check-placeholders.ts` lists every `null` reachable from `/`, `/leistungen/*`, `/projekte/*`, `/kontakt`, `/website-check`, `/impressum`, `/datenschutz`. Launch requires zero on these routes, **except** fields with a designed pending state (results, testimonials).
- **German overflow test:** a dev-only route `/qa/typo` (`notFound()` when `NODE_ENV === "production"`; note that an `_qa` folder would be a private, non-routable folder in the App Router) renders every heading, button label and nav item from the dictionary plus the long-word list at 320 / 375 / 768 / 1440. No horizontal overflow, no unhyphenated compound breaking mid-syllable in body text.
- **Pseudo-localization:** a `de-XA` dev dictionary with strings ×1.3 to catch fixed-width components before `en`/`ar`/`fa` exist.
- **RTL smoke test (pre-phase 3):** a dev toggle `dir="rtl"` on the German pages to confirm mirroring and that nothing is pinned to `left`/`right`.
- **Accessibility:** axe clean; keyboard-only run through all three conversion flows; VoiceOver on the comparison table and forms; focus visible everywhere; reduced-motion run.
- **Performance:** Lighthouse mobile ≥ 95 ×4, LCP < 2.0 s, CLS < 0.05, no third-party requests on first load (network panel), fonts self-hosted.
- **Conversion:** each CTA fires its analytics event with intent + position; both forms work without JS; both danke pages are `noindex` with no PII in URLs.
- **Legal:** Impressum and Datenschutz complete; footer links on every page; no cookie banner needed (verify no cookies are set: Application panel empty).

---

*Open decisions owned by Reza that this document assumes and marks as placeholders: prices, capacity and next start, process durations, booking provider, portrait, project roles and launch months, and client results/testimonials. See STRATEGY §10.*
