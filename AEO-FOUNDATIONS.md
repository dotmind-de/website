# AEO Foundations: AI discoverability, parsability and agent readiness

The infrastructure layer that lets AI crawlers, AI answer engines (ChatGPT search, Perplexity, Claude, Google AI Overviews/AI Mode, Copilot) and browsing agents **find**, **understand**, **cite** and **act on** the dotMind by Reza Alami website.

> **Decisions, October 2026:** the decision log in `STRATEGY.md` §11 is binding. Where anything below differs from it, the decision log wins.

- **Reads with:** [`STRATEGY.md`](./STRATEGY.md) (business), [`UX-DIRECTION.md`](./UX-DIRECTION.md) (routes, forms), [`SEO-STRATEGY.md`](./SEO-STRATEGY.md) (search architecture, schema), [`FRONTEND-PLAN.md`](./FRONTEND-PLAN.md) (implementation). This document owns the AI-specific layer and defers to SEO-STRATEGY on shared foundations. Disagreements are listed in [Alignment notes](#alignment-notes).
- **Scope:** a 15–30 page premium service site, not a docs portal. Every file proposed here has to earn its maintenance cost, and every AI-facing asset is **generated from the content models** (`src/content/…`), never hand-written.
- **Honesty rule:** no invented facts. dotMind, `dotmind.de`, the Ratingen address and prices marked „zu validieren" are placeholders until Reza confirms them (STRATEGY §10).
- **Status:** v1 · October 2026 (evidence checked 5 Oct 2026).

### Evidence levels used in this document

| Level | Meaning | Examples |
| --- | --- | --- |
| **Standard** | Formally standardized or universally implemented; consumers are documented | robots.txt (RFC 9309), sitemaps.org, schema.org JSON-LD, hreflang, semantic HTML, HTTP content negotiation |
| **Convention, partial adoption** | Public proposal, some publishers and some consumers, no vendor commitment | `llms.txt` (llmstxt.org), `llms-full.txt`, `.md` page variants, Cloudflare Content Signals |
| **Emerging / speculative** | Draft or vendor experiment; consumers unproven | WebMCP (W3C Community Group draft, Chrome origin trial), agent-permissions files, `ai.txt`, `/mcp-actions.json`, schema.org `potentialAction` for real-world task completion |

### Decisions at a glance

| Question | Decision |
| --- | --- |
| llms.txt | **Yes**, one generated `/llms.txt` (German), < 1,500 tokens, launched with phase 1. Cheap, low expected impact, kept honest by generation. |
| llms-full.txt | **No.** Not in phase 1 or 2. Revisit only if `/wissen` exceeds ~15 articles and logs show demand. |
| `.md` page variants | **No in phase 1.** Phase 2 option for `/wissen/*` only, via `Accept: text/markdown` content negotiation, if crawl logs justify it. |
| AI crawler policy | **Allow all** documented AI crawlers: training, search/citation and user-triggered. Explicit named groups in robots.txt. Optional block of Bytespider. Same as SEO-STRATEGY §11.3. |
| Agent guidance file | **No separate public agent file.** A „Hinweise für KI-Assistenten" block inside `/llms.txt` plus well-labelled native HTML forms and schema.org `ContactPoint`. Never serve anything at `/AGENTS.md` (name collision with the repo's coding-agent file). |
| Schema | One `@id` graph: `ProfessionalService` (studio) ← `founder` `Person` (Reza), `WebSite`, `WebPage` per page, `Service` per service, `Article` per case study, `BreadcrumbList`, `ContactPoint`. Built in `src/lib/schema.ts` from the same facts as llms.txt. |
| Multilingual | One llms.txt **per published locale** (`/llms.txt` = German, `/en/llms.txt` later); the root file links the others. Shared fact layer, translated prose only, language-neutral `@id`s. |

---

## Contents

1. [AEO foundation strategy](#1--aeo-foundation-strategy)
2. [AI discovery layer](#2--ai-discovery-layer)
3. [llms.txt](#3--llmstxt)
4. [llms-full.txt and Markdown page variants](#4--llms-fulltxt-and-markdown-page-variants)
5. [AI-aware robots.txt](#5--ai-aware-robotstxt)
6. [Structured, AI-readable content](#6--structured-ai-readable-content)
7. [Agent guidance and actions](#7--agent-guidance-and-actions)
8. [Schema & semantics alignment](#8--schema--semantics-alignment)
9. [Multilingual AEO](#9--multilingual-aeo)
10. [Priority roadmap](#10--priority-roadmap)
11. [Handoff checklists and monitoring](#11--handoff-checklists-and-monitoring)
- [Alignment notes](#alignment-notes)
- [Sources](#sources)

---

## 0 · Current state (code audit)

What a machine sees today. Line references are to the current working tree.

### Machine-readable surfaces that exist

| Surface | File | State | AEO verdict |
| --- | --- | --- | --- |
| robots.txt | `src/app/robots.ts` | `User-agent: * / Allow: /`, sitemap line, `host: site.url` | AI crawlers are **implicitly allowed** (good). No explicit AI policy. `Host:` is a non-standard Yandex directive and receives a full URL here; remove (also FRONTEND-PLAN). |
| sitemap.xml | `src/app/sitemap.ts` | `/`, `/projects`, `/about`, `/contact`, `/projects/[slug]`; `priority`/`changeFrequency`, no `lastModified` | English routes that will be 308-redirected; no real modification dates. |
| Metadata | `src/app/layout.tsx` | `lang="en"`, `locale: "en_US"`, title „Software Engineer, AI & Web Developer", root canonical `/` | Contradicts the strategy (German, studio, three services). |
| JSON-LD (home) | `src/app/page.tsx:16–35` | `Person`, `jobTitle` „Software Engineer & AI Specialist", `knowsAbout` incl. „Smart Home Technology", no `@id` | Wrong primary entity, off-strategy facts, not linkable. |
| JSON-LD (about) | `src/app/about/page.tsx:72–91` | `ProfilePage` → second, unlinked `Person` | Duplicate entity without `@id`. |
| JSON-LD (case study) | `src/app/projects/[slug]/page.tsx:177–189` | `CreativeWork`, `creator` Person, `genre` in English, `keywords` = tech stack | No `@id`, no client entity, no dates, no language. |
| OG image | `src/app/opengraph-image.tsx` | alt: „Software Engineer, Web Developer & Digital Marketer"; footer = `site.roles` | A **third** descriptor variant. AI systems reading OG data get yet another self-description. |
| JSON-LD helper | `src/components/ui/JsonLd.tsx` | Escapes `<` (matches `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`) | Keep. |
| Server rendering | all pages | Copy is in the HTML; `ScrambleText` renders final text on the server; `<noscript>` reveals hidden reveal-animations | **Good parsability baseline.** Text-only crawlers get full copy. |
| 404 | `src/app/not-found.tsx` | `noindex` | Good. |

### Missing or harmful

1. **Self-descriptions contradict each other** in five places (`site.description`, `site.roles`, layout title, OG alt, JSON-LD `jobTitle`). AI answer engines synthesize from all of them; contradictions produce vague or wrong summaries. This is the single biggest AEO problem today.
2. **`site.url` falls back to `http://localhost:3000`** (`src/content/site.ts:21`). If `NEXT_PUBLIC_SITE_URL` is unset in production, sitemap, robots, canonicals, JSON-LD `@id`s and the future llms.txt all point at localhost. Needs a build-time guard.
3. **Placeholders ship in production HTML.** `<Placeholder>` renders text such as „Add a short project description" or „What Reza actually did on this project" (`projects/[slug]/page.tsx:214, 276`). A crawler can ingest and an answer engine can quote that. Production builds must not emit placeholder copy in indexable pages (render the designed pending state from UX-DIRECTION §04.5, or omit the block).
4. **No actionable surface at all.** Contact is `mailto:` and `site.email` is `null`: no form, no booking link. An agent acting for a user cannot complete any task.
5. No `/llms.txt`, no `WebSite`/`ProfessionalService`/`Service`/`BreadcrumbList`/`ContactPoint`, no `lastModified`, no hreflang, no German content.
6. `public/` holds only project screenshots. That is right: no discovery file should be a hand-maintained static file in `public/` (see §2).

**Foundation score today (scale below, 15 points):** Discovery 2/6 · Parsability 3/6 · Capability 0/3 → **5/15 (33 %)**. Target at phase-1 launch: **13/15**.

| Layer | Checks (1 point each) |
| --- | --- |
| Discovery (6) | AI crawlers allowed explicitly · sitemap correct with `lastModified` · llms.txt live and valid · no CDN/WAF block on AI agents · canonical domain in all machine URLs · AI hits visible in logs |
| Parsability (6) | Copy in server HTML · one H1 + logical H2/H3 · consistent entity facts · no placeholder text in prod · answer-first summary on money pages · `@id` JSON-LD graph |
| Capability (3) | Native, labelled HTML forms for the three conversion actions · `ContactPoint` + booking fallback link · documented agent rules (llms.txt block) and server-side abuse controls |

---

## 1 · AEO foundation strategy

### 1.1 What AEO is for on this site

Buyers in this market increasingly ask an assistant before they search: „Wer baut ein Bestellsystem für mein Restaurant?", „Was kostet ein Website-Relaunch für eine Zahnarztpraxis?", „Ist dotMind seriös?". AEO makes sure that when an AI system answers those questions it can (a) reach the site, (b) extract correct, quotable facts, (c) attribute them to the right entity, and (d) send the user to a working next step.

For a founder-led studio with three case studies, the realistic goals are:

| Goal | Realistic in phase 1? | Measured by |
| --- | --- | --- |
| **Correct brand answers**: „Wer ist dotMind/Reza Alami?" returns the right descriptor, services, region and founder | Yes, highest priority | Monthly prompt panel (§11.3) |
| **Citations for long-tail commercial questions** (Bestellsystem Restaurant, Website Praxis, Relaunch-Kosten) | Partly; depends on content depth and third-party corroboration | Prompt panel, AI referrals in analytics |
| **Agent task completion**: an agent books an Erstgespräch or submits the Schnellcheck for a user | The foundations, yes; real agent traffic will be rare | Form submissions with AI-referrer or agent UA; manual agent test per quarter |

### 1.2 Relationship to traditional SEO

About 80 % of AEO is shared foundation with SEO. AI answer engines largely retrieve from search indexes (ChatGPT search and Copilot via Bing, AI Overviews/AI Mode via Google's index, Perplexity and Claude via their own crawlers plus partners). If a page isn't crawlable, indexed and clear for search, it won't be cited.

| Shared foundation (owned by SEO-STRATEGY) | AEO-specific work (owned here) |
| --- | --- |
| Server-rendered HTML, crawlability, canonicals, redirects | Named AI crawler groups in robots.txt and CDN/WAF bot settings |
| Sitemap, Search Console, **Bing Webmaster Tools** (feeds ChatGPT search and Copilot) | `/llms.txt` generated from content |
| JSON-LD entity graph | Entity-consistency test across HTML, JSON-LD, OG, llms.txt |
| Keyword architecture, service pages | Answer-first summary blocks, fact boxes, dated facts, glossary |
| Local SEO, GBP, reviews | Third-party corroboration that AI systems use to trust claims |
| Core Web Vitals | Agent-operable forms, booking fallback link, abuse controls that don't block legitimate agents |

**Rule:** never trade an SEO foundation for an AEO idea. Nothing in this document creates duplicate indexable URLs or a parallel content source.

### 1.3 Preparing for three kinds of AI contact

1. **Discovery (crawl and index):** search/citation crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, Googlebot) and training crawlers (GPTBot, ClaudeBot, Google-Extended token, Applebot-Extended token). Requirements: robots policy, sitemap, fast 200 responses, no WAF blocks.
2. **Citation (retrieve and quote):** user-triggered fetchers (ChatGPT-User, Claude-User, Perplexity-User) open one page while answering a live question. Requirements: the answer in the first screen of text, self-contained facts with units, dates and the entity name, clean headings.
3. **Action (agents operating the site):** browser agents (ChatGPT agent, Google-Agent, Claude in a browser, Perplexity Comet and similar) fill forms for a user. Requirements: native HTML forms with real `<label>`s, server-side validation with readable error messages, no CAPTCHA wall, no JS-only widgets for the essential path, a plain booking link as fallback for the third-party calendar, clear consent text. Example tasks to support: „Buche mir ein Erstgespräch bei dotMind nächste Woche" and „Fordere für meine Website praxis-beispiel.de einen Schnellcheck an".

---

## 2 · AI discovery layer

### 2.1 Root files: what to publish

| File / URL | Evidence level | Verdict | Implementation |
| --- | --- | --- | --- |
| `/robots.txt` | Standard | **Essential now** | Existing metadata route `src/app/robots.ts` (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`). Since v16.3 the `other` field supports non-standard per-agent lines. |
| `/sitemap.xml` | Standard | **Essential now** | Existing `src/app/sitemap.ts` (`…/01-metadata/sitemap.md`); real `lastModified` from content, `alternates.languages` once `/en` exists. |
| JSON-LD in every page | Standard | **Essential now** | `src/lib/schema.ts` + existing `JsonLd` component (`…/02-guides/json-ld.md`). |
| `/llms.txt` | Convention | **Yes, phase 1** (cheap; see §3) | Route Handler `src/app/llms.txt/route.ts` with `export const dynamic = 'force-static'`. Next 16 lists `llms.txt` explicitly as a custom Route Handler endpoint (`…/01-app/02-guides/backend-for-frontend.md` §Content types); GET handlers are uncached unless opted in (`…/01-app/01-getting-started/15-route-handlers.md` §Caching). |
| `/en/llms.txt` | Convention | Phase 2, with `/en` | Same handler pattern; see §9. |
| `/llms-full.txt` | Convention | **Not worth it** (§4) | none |
| `.md` alternates | Convention | **Not now**; phase-2 option for `/wissen` (§4) | Content negotiation per `backend-for-frontend.md` §Content negotiation |
| `/AGENTS.md`, `/agents.json`, `/agent-permissions.json`, `/ai.txt`, `/mcp-actions.json` | Speculative | **Do not publish** (§7) | none |
| `/.well-known/security.txt` | Standard (RFC 9116) | Optional P2, trust signal, 5 lines | Route handler or static; not AEO-relevant |
| `/humans.txt` | Informal | Not worth it | none |

### 2.2 How they relate

```
robots.txt  ── who may crawl what, points to ──►  sitemap.xml  (every indexable URL, lastModified, hreflang)
     │                                                 ▲
     │ (allows)                                        │ same route registry
     ▼                                                 │
llms.txt  ── curated, annotated subset of the sitemap (money pages + case studies + actions)
     │
     └── every link must be a canonical, indexable, 200 URL that is also in sitemap.xml
HTML pages ── visible facts ══ JSON-LD (@id graph) ══ OG/meta  (all rendered from one fact layer)
```

- robots.txt governs access; sitemap.xml is the **complete** list; llms.txt is a **curated, annotated** list for language models. llms.txt never contains a URL that isn't in the sitemap, and never contains a fact that isn't visible on the linked page.
- The IA (UX-DIRECTION §2.1, SEO-STRATEGY §3) is the single route registry. robots.ts, sitemap.ts, llms.txt and breadcrumb JSON-LD are all generated from it.

### 2.3 Serving rules (Next.js 16 specifics)

- **Do not put discovery files in `public/`.** Static files there are served with `Cache-Control: public, max-age=0` (`…/03-file-conventions/public-folder.md`) and, more importantly, would be hand-maintained copies of content. Generate them.
- **Proxy matcher must not touch them.** The i18n guide's example matcher `'/((?!_next).*)'` (`…/02-guides/internationalization.md`) would run the locale proxy on `/llms.txt` and `/robots.txt`. FRONTEND-PLAN §7.2's matcher `"/((?!_next/|api/|og/|stats/|.*\\.[a-z0-9]+$).*)"` excludes any path with a file extension, which correctly covers `/llms.txt`, `/robots.txt`, `/sitemap.xml`. Keep that exclusion and add an acceptance test: `curl -sI https://dotmind.de/llms.txt` → `200`, no redirect, `content-type: text/plain; charset=utf-8`.
- **Route handlers for root files sit outside `app/[lang]`.** `src/app/llms.txt/route.ts`, `src/app/robots.ts`, `src/app/sitemap.ts` stay at the `app/` root (route handlers need no layout). `/en/llms.txt` is `src/app/[lang]/llms.txt/route.ts` with `generateStaticParams` restricted to published non-German locales, or a dedicated `src/app/en/llms.txt/route.ts`; FRONTEND decides based on the final folder layout.

---

## 3 · llms.txt

### 3.1 Decision: yes, small and generated

**What the evidence says (October 2026):**
- llms.txt is a community proposal (Jeremy Howard / Answer.AI, Sept 2024; spec at llmstxt.org). It is not a W3C/IETF standard.
- **Google** has said repeatedly that no Google Search system, including AI Overviews/AI Mode, uses it. Google-related benefit: zero.
- Third-party log studies in 2026 report that only a small share of AI-bot requests target llms.txt, and that most published files receive no requests at all; the fetches that do happen come mostly from OpenAI and Microsoft agents and from coding/IDE agents. Treat these numbers as indicative (vendor blogs, not peer-reviewed).
- Next.js itself publishes `/docs/llms.txt` and names `llms.txt` as a first-class custom endpoint (`backend-for-frontend.md`).

**Why still yes:** generated from the content models, it costs about one hour to build and nothing to maintain. When a user pastes the domain into an assistant („Was bietet dotmind.de?"), the user-triggered fetcher and agentic browsers do sometimes read `/llms.txt`, and a 1,200-token file answers the question better than a 15,000-token homepage. **What it is not:** an SEO lever, a ranking factor, or a substitute for clear pages. Expected impact: low. Risk: none, provided it is generated and never says anything the pages don't.

Agrees with SEO-STRATEGY §11.3 (there P2 „low-cost experiment"); this document raises it to **P1, phase 1** because generation makes it effectively free and it doubles as the agent-guidance carrier (§7).

### 3.2 Format (llmstxt.org spec)

Order: H1 (the only required element) → blockquote summary → optional paragraphs/lists **without headings** → zero or more H2 sections, each a Markdown list of `[name](url): notes` → an optional `## Optional` section whose links an agent may skip.

### 3.3 Draft content (German, phase 1)

Values in `[…]` come from the fact layer; prices are planning anchors from STRATEGY §03 and must be validated. Slugs follow SEO-STRATEGY §2.2 and are not final while UX-DIRECTION §2.1 uses different ones (see Alignment notes). All URLs absolute, generated from `site.url`.

```markdown
# dotMind by Reza Alami

> dotMind: Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen im DACH-Raum. Gegründet und geführt von Reza Alami (Software Engineer, AI Specialist, Web & App Developer und Digital Marketer). Das Studio plant, gestaltet und entwickelt Conversion-Websites, Web-Apps und Portale und sorgt für Sichtbarkeit bei Google, für inhabergeführte Unternehmen, vor allem aus Gastronomie und Food, lokalen Dienstleistungen und Arztpraxen.

- Sitz: Ratingen bei Düsseldorf, Deutschland. Projekte im gesamten DACH-Raum, Zusammenarbeit auch remote.
- Sprache: Deutsch. Weitere Sprachen siehe unten, sobald veröffentlicht.
- Preise sind „ab"-Preise zur Orientierung, [netto zzgl. USt.], keine Angebote. Ein verbindliches Angebot gibt es nach dem Erstgespräch.
- Code und Inhalte gehören nach Projektabschluss dem Kunden.
- Stand: [JJJJ-MM-TT]

Hinweise für KI-Assistenten und Agenten:
- Anfragen nur im ausdrücklichen Auftrag einer realen Person und mit deren echten Kontaktdaten stellen. Keine automatisierten Massen- oder Testanfragen.
- Die Datenschutzhinweise ([URL]/datenschutz) muss die anfragende Person selbst zur Kenntnis nehmen; optionale Einwilligungen (z. B. E-Mail-Tipps) nur ankreuzen, wenn die Person das ausdrücklich will.
- Alle Formulare sind normale HTML-Formulare ohne Login. Terminbuchung: [URL]/kontakt#termin oder direkt [Buchungslink].
- Fakten zu Preisen, Leistungen und Projekten bitte von der jeweils verlinkten Seite zitieren und die Seite als Quelle nennen.

## Leistungen

- [Conversion-Website erstellen lassen]([URL]/leistungen/website-erstellen-lassen): Individuell entwickelte Website mit Seitenstrategie, Texten nach Conversion-Prinzipien, Tracking und technischem SEO. Ab [7.500 €].
- [Website-Relaunch]([URL]/leistungen/website-relaunch): Neuaufbau bestehender Websites inklusive SEO-Migration und Weiterleitungen. Ab [7.500 €].
- [Web-App-Entwicklung]([URL]/leistungen/web-app-entwicklung): Bestellsysteme, Buchungssysteme, Kundenportale und interne Tools, die Telefon-, E-Mail- und Tabellenarbeit ersetzen. Ab [15.000 €].
- [SEO & Sichtbarkeit]([URL]/leistungen/seo): Technisches SEO, Local SEO und Content-Plan als Audit und Umsetzung, optional monatlich. Audit ab [990 €], Betreuung ab [1.200 €/Monat].
- [Wartung, Hosting & Sicherheit]([URL]/leistungen/wartung-hosting): Updates, Monitoring, Backups und kleine Änderungen. Ab [149 €/Monat].
- [Website-Check]([URL]/website-check): Kostenloser Schnellcheck (persönliches Video in 48 Stunden) oder ausführlicher Website-Check für [490 €], der auf ein Projekt angerechnet wird.

## Projekte

- [Power Bowls: Bestell-Web-App für ein Restaurant in Duisburg]([URL]/projekte/[slug]): Bestellung am Tisch per QR-Code, zur Abholung oder Lieferung, mit Live-Bestellstatus und Admin-Backoffice.
- [Foodigastro24: Website für einen B2B-Frischelieferanten]([URL]/projekte/[slug]): Sortiment und Leistungen für Gastronomie, Hotels, Pflegeeinrichtungen und Firmen, mit Angebotsanfrage-Formular.
- [Rundumdienst: Lead-Website für einen Hausdienstleister in Neuss]([URL]/projekte/[slug]): Local SEO mit strukturierten Daten, Kontaktformular, WhatsApp- und Telefonkontakt.

## Über das Studio

- [Über Reza Alami]([URL]/ueber): Gründer, Arbeitsweise und Hintergrund in Softwareentwicklung und digitalem Marketing.
- [Kontakt]([URL]/kontakt): Erstgespräch (30 Minuten, kostenlos) buchen oder Projekt anfragen (Projektart, Budgetrahmen, Zeitplan, aktuelle Website).

## Optional

- [Impressum]([URL]/impressum): Anbieterkennzeichnung mit Anschrift.
- [Datenschutz]([URL]/datenschutz): Datenschutzhinweise, EU-Hosting, cookielose Statistik.
```

Size check: ~2,700 characters ≈ 900–1,100 tokens (German tokenizes at roughly 1.5–2 tokens per word). Hard budget: **≤ 1,500 tokens** for the root file. Phase 2 adds `## Branchen` and `## Wissen` (max. 10 links, newest/most important) and a `## Weitere Sprachen` section.

### 3.4 Which page categories first

1. Phase 1: services (lead + those secondary services that have a page), the 3 case studies, `/ueber`, `/kontakt`, `/website-check`. Legal pages under `## Optional`.
2. Phase 2: `/branchen/*` (only published ones), top 5–10 `/wissen/*` articles, `/website-kosten`.
3. Never: `/danke` pages, filtered or paginated URLs, `/api/*`, OG image routes, drafts, untranslated locale URLs.

### 3.5 Signal-only rules

- Every link: canonical, indexable, in the sitemap, returns 200. Every note: one sentence, outcome first, ≤ 160 characters, and only facts that appear on the linked page.
- No marketing superlatives („führend", „beste"), no claims without proof, no keyword lists, no instructions that try to manipulate model behaviour beyond the four agent notes.
- Prices only from the fact layer and only with „ab" and the net/gross note. If a price is `null`, omit the price, never print a placeholder.
- A `Stand` date that changes only when content changes (max of all content `updatedAt`), not on every build.
- No phone number or personal email in llms.txt (contact via page links; reduces scraping value).

### 3.6 Generation from content

```
src/content/facts/site.ts        brand, descriptor, founder, location, priceNote   (FRONTEND-PLAN §2)
src/content/facts/services.ts    slug, tier, priceFrom, priceUnit, published, updatedAt
src/content/facts/projects.ts    slug, client, industry, place, services, updatedAt
src/content/de/*.ts              llmsSummary (one sentence per entity, German)
src/lib/routes.ts                route registry (shared with sitemap, hreflang, breadcrumbs)
src/lib/llms.ts                  buildLlmsTxt(locale) → string   (pure, unit-testable)
src/app/llms.txt/route.ts        export const dynamic = 'force-static'; GET → new Response(buildLlmsTxt('de'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
```

- Each service, project and page entry gets an optional `llmsSummary` field (German, one sentence). If absent, fall back to the entity's meta description. This keeps the summary next to the content it describes, so editors update both together.
- `buildLlmsTxt` filters `published === true` and skips `null` facts. A unit/CI test asserts: H1 present, blockquote present, every URL in `sitemap()` output, no `null`/`undefined`/`[`placeholder text, ≤ 1,500 tokens (approximate as characters ÷ 3).

---

## 4 · llms-full.txt and Markdown page variants

### 4.1 llms-full.txt: no

`llms-full.txt` (a single file containing the full text of the site) is a community extension, popular with documentation sites (Next.js, Stripe, Anthropic docs) where developers load an entire manual into an IDE agent. This site has the opposite profile:

| Factor | This site |
| --- | --- |
| Consumers | Coding agents read llms-full for docs. No evidence that answer engines use it for service businesses. |
| Content size | ~15–30 pages; each page is already small and server-rendered. Nothing an agent can't fetch directly. |
| Risk: staleness | A second full copy of every price and claim; one missed regeneration = contradictory facts in the one file built for machines. |
| Risk: scraping | Hands competitors and template farms the complete copy, case studies and pricing in one request. |
| Risk: duplicate content | Low for Google (a `.txt` file is rarely indexed prominently), but it can be indexed and outrank nothing useful. |

**Decision: do not publish.** Revisit only if `/wissen` grows past ~15 substantial articles **and** logs show repeated requests for `/llms-full.txt` (404s from AI agents are the signal).

### 4.2 `.md` alternates: not now; phase-2 option for Wissen

Options, if ever needed:
1. **Content negotiation (preferred):** the same URL returns Markdown when the request sends `Accept: text/markdown`, via a `next.config.ts` `rewrites()` header match and a Route Handler returning `Content-Type: text/markdown; charset=utf-8` with `Vary: Accept` (`node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md` §Content negotiation). No new indexable URL, so no duplicate-content risk.
2. `.md` suffix URLs (`/wissen/foo.md`, the llmstxt.org convention): new URLs that need `X-Robots-Tag: noindex` and a `Link: <…>; rel="canonical"` header pointing at the HTML page. More surface, more risk.
3. CDN-level conversion (e.g. Cloudflare „Markdown for Agents"): zero code, but only if the site sits behind that CDN.

**Decision:** phase 1 no. The pages are clean server-rendered HTML with semantic headings, which every AI pipeline parses well; a Markdown twin adds maintenance and a second rendering path for a marginal gain. Phase 2: if `/wissen` launches and logs show agents sending `Accept: text/markdown`, implement option 1 for `/wissen/*` only, generated from the same MDX/content source as the HTML. Never for service or case-study pages (prices and claims must have exactly one rendering path).

---

## 5 · AI-aware robots.txt

### 5.1 Crawler taxonomy (verified against vendor documentation, October 2026)

| Token | Operator | Category | Honors robots.txt | Effect of blocking |
| --- | --- | --- | --- | --- |
| `GPTBot` | OpenAI | Training | Yes | Content not used to train OpenAI foundation models. **Does not** remove the site from ChatGPT search. |
| `OAI-SearchBot` | OpenAI | Search/citation | Yes | Site is **not shown in ChatGPT search answers**. |
| `ChatGPT-User` | OpenAI | User-triggered | „may not apply" (OpenAI) | Unreliable; user-initiated fetches and GPT actions. |
| `ClaudeBot` | Anthropic | Training | Yes | Excluded from future Anthropic training data. |
| `Claude-SearchBot` | Anthropic | Search/citation | Yes | Lower visibility and accuracy in Claude's search results. |
| `Claude-User` | Anthropic | User-triggered | Yes (Anthropic states all three honor it) | Claude can't fetch the page when a user asks about it. |
| `PerplexityBot` | Perplexity | Search/citation (not training, per Perplexity) | Yes | Site not surfaced/linked in Perplexity. |
| `Perplexity-User` | Perplexity | User-triggered | Generally ignores | n/a |
| `Google-Extended` | Google | Control token (no own crawler): Gemini training **and grounding** | Yes | No effect on Google Search, AI Overviews or ranking (Google). |
| `Google-Agent` | Google | User-triggered agent (listed since March 2026) | Ignores (user-triggered fetcher) | n/a; identify it in logs, don't block in WAF. |
| `Applebot` | Apple | Search (Siri, Spotlight, Safari) | Yes | Gone from Apple search features. |
| `Applebot-Extended` | Apple | Control token: Apple foundation-model training | Yes | No effect on Siri/Spotlight visibility (Apple). |
| `Meta-WebIndexer` | Meta | Search for Meta AI | Yes | Lower visibility in Meta AI answers. |
| `Meta-ExternalAgent` | Meta | Training | Yes | Excluded from Meta AI training. |
| `Meta-ExternalFetcher` | Meta | User-triggered | „may bypass" (Meta) | n/a |
| `CCBot` | Common Crawl | Open dataset (feeds many training sets) | Yes | Out of future Common Crawl snapshots. |
| `Bytespider` | ByteDance | Training | Widely reported as unreliable | Little; DACH audience gains nothing from it. |
| `Bingbot` | Microsoft | Search; also feeds Copilot and ChatGPT search's Bing layer | Yes | Covered by `*`; never block. |

Two facts worth internalising: (1) **user-triggered fetchers mostly ignore robots.txt by design**, so robots.txt can't stop a user's assistant from reading a page, and a WAF block is the only thing that does (and that's the mistake to avoid); (2) training and search are **separately controllable** at OpenAI, Anthropic, Google and Apple.

### 5.2 Recommendation: allow everything except, optionally, Bytespider

**Allow training crawlers too.** Reasons specific to this business:
- There is nothing proprietary on the site. It's marketing content whose purpose is to be repeated accurately.
- A new studio has near-zero brand recall. Being in training data is the only route into a model's built-in knowledge („parametric memory") for answers produced without live search. Benefit is plausible but unproven; cost is zero.
- OpenAI states that if both GPTBot and OAI-SearchBot are allowed, one crawl may serve both purposes: less crawl load, not more.
- Same decision as SEO-STRATEGY §11.3.

**When to revisit:** paid or gated content (Wissen PDFs, Kostenrechner results), or a client contract that restricts how case-study material is reused. Then disallow training tokens for those paths only, never search/citation tokens.

### 5.3 How the business decision affects citation visibility

| If you block… | Training data | ChatGPT search | Claude answers with search | Perplexity | Google AI Overviews / AI Mode | Gemini app grounding |
| --- | --- | --- | --- | --- | --- | --- |
| Nothing (recommended) | in | eligible | eligible | eligible | eligible | eligible |
| GPTBot, ClaudeBot, Meta-ExternalAgent, CCBot | out | eligible | eligible | eligible | eligible | eligible |
| + Google-Extended | out | eligible | eligible | eligible | **eligible** (Search unaffected) | **reduced** (token also governs grounding) |
| + OAI-SearchBot / Claude-SearchBot / PerplexityBot | out | **gone** | **reduced** | **gone** | eligible | reduced |

Most common real-world error: a „block AI" template that lists `OAI-SearchBot`, `Claude-SearchBot` and `PerplexityBot` next to the training bots, which silently removes the site from the answer engines it wants citations from.

### 5.4 Proposed robots.txt (rendered output)

```txt
# robots.txt – dotMind by Reza Alami – Richtlinie Stand [JJJJ-MM-TT]
# Grundsatz: Inhalte dürfen gecrawlt, zitiert und für KI-Training genutzt werden.

User-Agent: *
Allow: /
Disallow: /api/

# KI-Suche und Zitate
User-Agent: OAI-SearchBot
User-Agent: Claude-SearchBot
User-Agent: PerplexityBot
User-Agent: Applebot
User-Agent: Meta-WebIndexer
Allow: /
Disallow: /api/

# Abrufe im Auftrag einer Person (ignorieren robots.txt teilweise; hier dokumentiert)
User-Agent: ChatGPT-User
User-Agent: Claude-User
User-Agent: Perplexity-User
User-Agent: Meta-ExternalFetcher
Allow: /
Disallow: /api/

# KI-Training (bewusste Entscheidung: erlaubt)
User-Agent: GPTBot
User-Agent: ClaudeBot
User-Agent: Google-Extended
User-Agent: Applebot-Extended
User-Agent: Meta-ExternalAgent
User-Agent: CCBot
Allow: /
Disallow: /api/

# Optional (Geschäftsentscheidung): kein Nutzen im DACH-Markt
User-Agent: Bytespider
Disallow: /

Sitemap: https://dotmind.de/sitemap.xml
```

Notes:
- **Why repeat `Disallow: /api/` in every group:** under RFC 9309 a crawler follows only the most specific group that names it and ignores `*`. A named group without the disallow would open `/api/` to that bot.
- **Why name bots that are allowed anyway:** it documents the decision, survives a later edit of the `*` group, and makes intent visible to anyone auditing (including AI vendors' compliance tooling). Cost: 30 lines.
- **No `Host:` line** (remove from `robots.ts:8`). **No `Crawl-delay`** (Google ignores it; a small site doesn't need it).
- **No disallow for `/danke` pages.** They use `noindex`, which a crawler can only see if it may crawl the page (SEO-STRATEGY §7.3). FRONTEND-PLAN §7 proposes `Disallow: /*/danke`; see Alignment notes.
- **Content-Signal** lines (Cloudflare's emerging `search=yes, ai-input=yes, ai-train=yes` vocabulary) can be emitted through the `other` field (`robots.md` §Non-standard directives, Next ≥ 16.3). Add them only if the site is proxied by Cloudflare; otherwise skip (no other consumer documented).

Implementation sketch for `src/app/robots.ts` (rules from a typed constant in `src/content/facts/crawlers.ts`, so the policy table above and the file can't drift):

```ts
const groups = { search: [...], user: [...], training: [...] } as const; // from facts/crawlers.ts
rules: [
  { userAgent: "*", allow: "/", disallow: "/api/" },
  ...Object.values(groups).map((ua) => ({ userAgent: [...ua], allow: "/", disallow: "/api/" })),
  { userAgent: "Bytespider", disallow: "/" },   // only if Reza confirms
],
sitemap: `${site.url}/sitemap.xml`,
```

### 5.5 Common mistakes to avoid

1. **Blocking search bots while trying to block training** (table 5.3, last row).
2. **Disallowing `/_next/`.** Rendering crawlers (Googlebot, Bingbot, browser agents) need `/_next/static/` CSS/JS to render the page and judge layout; blocking it degrades indexing and can break agent interaction. Never disallow it.
3. **CDN/WAF bot modes blocking silently.** Cloudflare „Bot Fight Mode"/„Block AI bots", Vercel Firewall/Bot protection challenge rules, and hosting-provider „AI scraper" toggles return 403 or JS challenges that robots.txt can't override. Cloudflare in particular: since 15 Sept 2026 it blocks Training and Agent crawler categories by default on ad-displaying pages for new domains (this site shows no ads, but check the zone setting), and treats multi-purpose crawlers under the strictest applicable rule. **Acceptance test after every infrastructure change:** `curl -A "<UA string>"` from §11.3 returns 200 for `/`, `/llms.txt`, one service and one case study.
4. **JS challenges or CAPTCHAs on forms** that stop legitimate user-triggered agents (§7.3).
5. **`noindex` on pages also disallowed** (Google never sees the `noindex`).
6. **Staging/preview URLs crawlable.** Previews need `X-Robots-Tag: noindex` plus password protection (SEO-STRATEGY §7.3); otherwise AI crawlers index a second copy with placeholder content.
7. **IP blocking instead of robots.txt.** Anthropic notes that blocking IPs also prevents bots from reading robots.txt, so they can't learn the intended policy.

---

## 6 · Structured, AI-readable content

AI answer engines retrieve **passages**, not pages. A passage gets cited when it is self-contained (makes sense without the surrounding page), names the entity, carries a concrete fact with a unit, and sits under a heading that matches the question. Everything below serves that.

### 6.1 Universal page rules

| Rule | Implementation |
| --- | --- |
| **Answer-first summary block** under every H1 of a money page: 2–3 sentences, 40–80 words, answering „Was ist das, für wen, was kostet es, was kommt heraus?" | `<p class="lead">` directly after `<h1>`, rendered from `de/*.ts` `summary`; the same string feeds meta description (shortened) and llms.txt (one sentence). |
| **Fact box** (`<dl>`) with label/value pairs | Service: Leistung, Für wen, Preis ab, Dauer, Ergebnis, Stand. Case study: Kunde, Branche, Ort, Leistungen, Zeitraum, Ergebnis. Values from the fact layer only. |
| **Entity named in full** at least once per page section that could be quoted alone | „dotMind (Reza Alami) entwickelt …", not „Wir"/„Ich" only. Phase 1 writes „ich" (STRATEGY §06); add the name in the summary and fact box so passages still attribute. |
| **Dates** | Visible „Stand: 5. Oktober 2026" on service pages (prices) and Wissen articles; `<time datetime="2026-10-05">`; `dateModified` in JSON-LD from the same `updatedAt`. Never auto-bump dates on build. |
| **Question-shaped H2s** where it is natural („Was kostet eine Web-App für ein Restaurant?"), statement H2s elsewhere | One H1 per page; H2 → H3 without skipping; no headings used for styling (the current `t-label` „(01) Overview" H2s are acceptable but should be German, descriptive and not just numbers). |
| **Tables for comparisons and prices** | Real `<table>` with `<caption>` and `<th scope>` (the „Der Unterschied" table is already planned as a real table, FRONTEND-PLAN). |
| **No facts only in images, animations or canvas** | `ScrambleText`, `TokenStream`, device screenshots: the text equivalent must be in plain HTML. Results never only in an image. |
| **Units and numbers unambiguous** | „ab 7.500 € netto", „6–10 Wochen", „Lighthouse 98 (mobil, gemessen am 2. Oktober 2026)". German number format in prose, ISO/numeric in JSON-LD. |
| **Token budget per page** (main content, measured as text) | Home ≤ 3,500 tokens · Service ≤ 4,000 · Case study ≤ 3,500 · Wissen article ≤ 6,000 (split longer topics) · `/ueber` ≤ 2,500 · llms.txt ≤ 1,500. Generous for any 2026 context window; the point is that the summary and fact box come within the **first 300 tokens** of main content, where fetchers truncate. |

### 6.2 Per page type

**Service page (`/leistungen/[service]`)**
- H1 = outcome + service name. Summary block, then fact box:

```html
<dl class="fact-box">
  <dt>Leistung</dt><dd>Web-App-Entwicklung (Bestellsysteme, Buchung, Kundenportale, interne Tools)</dd>
  <dt>Für wen</dt><dd>Inhabergeführte Unternehmen im DACH-Raum, u. a. Gastronomie und Lieferdienste</dd>
  <dt>Preis</dt><dd>ab [15.000 €] [netto] · <a href="#investition">Was den Preis bestimmt</a></dd>
  <dt>Dauer</dt><dd>[noch offen]</dd>   <!-- null → row omitted in production, never invented -->
  <dt>Ergebnis</dt><dd>Eigene Software, die Telefon-, E-Mail- und Tabellenarbeit ersetzt; Code gehört Ihnen</dd>
  <dt>Stand</dt><dd><time datetime="2026-10-05">5. Oktober 2026</time></dd>
</dl>
```

- FAQ answers start with a one-sentence direct answer, then detail (SEO-STRATEGY §11.3). Use `<details><summary>` with the answer in the HTML.
- Link to the matching case study with a sentence that carries the fact: „Für Power Bowls in Duisburg habe ich ein Bestellsystem mit QR-Code-Bestellung am Tisch entwickelt."

**Case study (`/projekte/[slug]`)**
- H1 pattern per SEO-STRATEGY §6.2 („[Lösung] für [Branche] in [Ort]"). Summary block: client, place, problem, what was built, result.
- Fact box: Kunde (linked to live site), Branche, Ort, Leistungen (linked to service pages), Zeitraum, Rolle, Ergebnis.
- **Results:** only verified numbers, each with metric, period and source („Bestellungen über die Web-App: [Zahl] im [Zeitraum], laut Admin-Dashboard"). If none exist, say what is verifiable (features, Lighthouse score with date) and never imply outcomes. AI systems repeat numbers verbatim; a wrong number becomes a durable wrong citation.
- Technologies in a list at the end, not in the summary.

**About / founder (`/ueber`)**
- First paragraph disambiguates both entities: „Reza Alami ist Gründer von dotMind, einem Studio für Webdesign, Web-Apps und SEO mit Sitz in Ratingen bei Düsseldorf. Er verbindet Softwareentwicklung (Studium Software Engineering) mit digitalem Marketing (sechsmonatige Weiterbildung bei Meta über ein Stipendium)." Facts from `src/content/profile.ts` only; periods stay `null` until Reza confirms them.
- Links to real profiles (LinkedIn, GitHub) that match `sameAs`. Remove smart home (STRATEGY §00).

**Contact (`/kontakt`) and `/website-check`**
- Plain-language „Was passiert danach" list with timings that are true („Antwort innerhalb von 24 Stunden an Werktagen", „Video innerhalb von 48 Stunden"). Agents relay these to users.
- Business details in text (name, Impressum address, email) matching `ContactPoint` JSON-LD.

**Wissen article (phase 2)**
- Title answers a buyer question. Summary block = the answer. Each H2 opens with the direct answer sentence. Visible author (Reza, linked to `/ueber`), `datePublished`, `dateModified`, sources linked. One claim per sentence where numbers are involved.

### 6.3 Terminology glossary (enforced everywhere)

Inconsistent names are the main cause of wrong AI summaries. One term per concept, stored in `src/content/facts/glossary.ts` and used by copy, schema, llms.txt and OG.

| Concept | Use exactly | Never use |
| --- | --- | --- |
| Business entity | **dotMind** (phase 1 lockup „dotMind by Reza Alami") | „Reza Alami Agentur", „RA Studio", English variants |
| Brand line | **Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen.** | shortened or reworded variants |
| Descriptor | **Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen** | „Studio für digitale Wachstumssysteme", „Agentur", „Freelancer", „AI agency", the role titles (they describe the founder, not the studio) |
| Founder | **Reza Alami · Software Engineer · AI Specialist · Web & App Developer · Digital Marketer** (all four, in this order) | „Full-Stack-Entwickler", „Smart-Home-Experte", partial or reordered title lists, invented titles |
| Lead service 1 | **Conversion-Website & Relaunch** | „Webdesign-Paket", „Homepage" |
| Lead service 2 | **Web-Apps & Portale** | „Software-Entwicklung" (too broad) |
| Lead service 3 | **SEO & Sichtbarkeit** | „Online-Marketing" |
| Free lead magnet | **Website-Schnellcheck** (kostenlos, Video in 48 Stunden) | „Website-Check" for the free one |
| Paid entry offer | **Website-Check** (490 €, wird angerechnet) | „Audit", „Schnellcheck" for the paid one |
| First call | **Erstgespräch** (30 Minuten, kostenlos) | „Beratung", „Discovery Call" |
| Written inquiry | **Projekt anfragen** | „Angebot anfordern" |
| Price format | **ab 7.500 € [netto]** | „from", „ca.", ranges without basis |
| Region | **DACH-Raum** (Deutschland, Österreich, Schweiz) | „Europa", „weltweit" |

The free „Website-Schnellcheck" and paid „Website-Check" share the URL `/website-check` (UX-DIRECTION §2.1). That is fine for users but a real ambiguity for machines: the page must present them as two named offers with separate fact boxes, and the JSON-LD must model them as two `Offer`s with different prices (0 € and 490 €).

### 6.4 Studio vs. person: avoiding ambiguity

- In JSON-LD the studio and Reza are two linked entities (`founder` / `worksFor`), never merged.
- In phase 1 the visible brand is „dotMind by Reza Alami"; `name` in schema is **dotMind** and `alternateName` is „dotMind by Reza Alami". Reza's `Person.name` is „Reza Alami". dotMind leads from day one, so the graph never changes when the endorsement drops in phase 3.
- Case studies: `publisher`/`creator` = studio; `author`/`contributor` = Reza. Copy: „Projekt von dotMind, umgesetzt von Reza Alami".
- Don't launch with „Reza Alami" as a stand-in Organization name and switch later: that creates two entities in AI memory and in third-party listings. The studio name is a single build-time constant, and a production build fails while it is unset (STRATEGY §10 makes it the first decision).

### 6.5 Semantic HTML that helps extraction

`<main>` with one `<h1>`; `<article>` for case studies and Wissen; `<section aria-labelledby>` per content block; `<nav aria-label="Brotkrumen">` with an ordered list for breadcrumbs; `<dl>` for fact boxes; `<table>` for comparisons; `<details>` for FAQ; `<address>` for contact data in the footer and Impressum; `<time datetime>` for dates; `<figure>`/`<figcaption>` for screenshots with a caption that states what the image proves. Decorative motion layers get `aria-hidden` (already the case for `TokenStream`).

---

## 7 · Agent guidance and actions

### 7.1 Decision: no standalone public agent file

| Option | Evidence | Verdict |
| --- | --- | --- |
| Public `/AGENTS.md` | AGENTS.md is a convention for **coding agents in a repository** (as used by this repo's root `AGENTS.md`, auto-written by `next dev`, see `node_modules/next/dist/server/lib/generate-agent-files.js`). No browsing agent looks for it on websites. | **No.** Serving `public/AGENTS.md` would also put a second `AGENTS.md` into the repo tree, which coding agents might read as project instructions. Never create `public/AGENTS.md` or an `/AGENTS.md` route. |
| `/agent-permissions.json`, `/agents.json`, `/ai.txt`, `/mcp-actions.json` | Proposals without documented consumers | No. Watch list (§7.5). |
| Block inside `/llms.txt` („Hinweise für KI-Assistenten und Agenten") | Rides on the one AI file that some agents do fetch; costs four lines | **Yes** (draft in §3.3) |
| Robust HTML + schema.org | Standard; this is what every agent actually uses today | **Yes, P0** |

If a standalone human-readable policy is ever wanted (e.g. once real agent traffic appears), publish it as an ordinary page `/ki-richtlinie` linked from the footer and llms.txt, not as a pseudo-standard root file.

### 7.2 Supported actions and how they are declared today

| Action | URL | Declared by | Agent requirements |
| --- | --- | --- | --- |
| **Erstgespräch buchen** | `/kontakt#termin` | Visible link + `ContactPoint` (`contactType: "Erstgespräch"`, `url`), llms.txt | The two-click embed (UX-DIRECTION, DSGVO) is hard for agents. Add a plain fallback link „Termin direkt beim Kalenderanbieter öffnen" (`<a href="[booking URL]" rel="noopener">`), rendered in HTML, no JS needed. |
| **Projekt anfragen** | `/kontakt#anfrage` (`?leistung=` prefill) | Native `<form method="post">` via Server Action, `ContactPoint` | Every field has a `<label for>`, `name`, `autocomplete` (`name`, `email`, `organization`, `url`, `tel`), native `required`/`type`; budget and timeline as `<select>` or radio groups with visible text values; error messages as text next to the field (`aria-describedby`); success = redirect to `/kontakt/danke` with an H1 that states the outcome. |
| **Website-Schnellcheck anfordern** | `/website-check` | Native form (UX-DIRECTION §6.4) | Same rules; `type="url"` field accepts a bare domain (normalise server-side, don't reject „praxis-beispiel.de"). The optional newsletter checkbox stays **unchecked** by default. |

**Progressive enhancement is the agent-readiness strategy.** Server Actions work as plain form POSTs without JavaScript (`node_modules/next/dist/docs/01-app/02-guides/forms.md`, per UX-DIRECTION/FRONTEND-PLAN), which means every agent, from text-only fetchers to full browsers, can complete the flow.

### 7.3 Boundaries: consent, abuse, rate limits

- **Consent:** DSGVO consent must come from the data subject. An agent may submit on behalf of its user; the form text states that data is processed to answer the request (Art. 6(1)(b) GDPR, pre-contractual), so no consent checkbox is needed for the inquiry itself. Marketing emails require the separate, unchecked opt-in plus double opt-in (STRATEGY §08), which an agent can't complete without the user's mailbox, which is the right outcome.
- **Spam protection that doesn't block legitimate agents:** honeypot field (`aria-hidden`, `tabindex="-1"`, labelled „Bitte leer lassen"), minimum submit time (> 3 s after render, signed timestamp), server-side rate limit per IP and per email (e.g. 5 submissions/hour/IP, 3/day/email), duplicate-URL check for Schnellcheck. **No reCAPTCHA/hCaptcha** (blocks agents, third-party data transfer). A privacy-friendly proof-of-work challenge (e.g. self-hosted ALTCHA-style) only if spam becomes a real problem.
- **Bulk/automated submissions** are rejected by the rate limit and stated in llms.txt. Requests that arrive via agents still reach Reza as normal inquiries; tag them (`user-agent`, `referer`) in the notification email for monitoring, not for rejection.
- **No action requires login.** Guest flows only (phase 3 client portal is out of scope for agents).

### 7.4 schema.org declarations (standard, modest expectations)

- `ContactPoint` on the studio entity: `contactType` „Erstgespräch" and „Projektanfrage", `url`, `email`, `availableLanguage` (`de`, plus `en`/`fa`/`ar` only if Reza actually offers calls in those languages), `areaServed`.
- `Offer` entries under each `Service` (see §8) and two `Offer`s for Schnellcheck (price 0) and Website-Check (490).
- `potentialAction`: schema.org allows e.g. `ReserveAction`/`CommunicateAction` with an `EntryPoint`. No major engine or agent documents using it for service businesses. **P2, optional**: a single `potentialAction` of type `ReserveAction` on the organization pointing to `/kontakt#termin` is harmless; don't invest more.

### 7.5 Emerging protocols: watch, don't build yet

| Protocol | State (Oct 2026) | Trigger to act |
| --- | --- | --- |
| **WebMCP** (sites expose callable tools to in-browser agents; declarative form annotations and imperative JS API) | W3C Community Group draft report (not standards track); Chrome origin trial behind a flag; API renamed `navigator.modelContext` → `document.modelContext`. Firefox/Safari uncommitted. | Chrome ships it enabled by default **and** at least one mainstream agent uses it. Then add the declarative annotations to the two forms (an afternoon of work, because the forms are already native and well-labelled). Phase 2–3. |
| Agent identity / Web Bot Auth (signed agent requests) | Vendor implementations (Cloudflare, OpenAI) rolling out | Only relevant if the WAF starts challenging agents; then allow verified agents. |
| Cloudflare Content Signals | Cloudflare-specific robots.txt extension | Only if proxied by Cloudflare. |
| agent-permissions.json, ai.txt, mcp-actions.json | Proposals without consumers | Re-check twice a year; adopt only with a named consumer. |

---

## 8 · Schema & semantics alignment

### 8.1 Entity graph with stable `@id`s

`@id`s are opaque identifiers: absolute, on the canonical domain, never changed after launch, language-neutral. They follow SEO-STRATEGY §7.5.

| Entity | Type | `@id` | Rendered on | Links |
| --- | --- | --- | --- | --- |
| Studio | `ProfessionalService` | `https://dotmind.de/#organization` | `/` (full), referenced elsewhere | `founder` → Person, `contactPoint`, `makesOffer`/`hasOfferCatalog` → Services, `sameAs` |
| Founder | `Person` | `https://dotmind.de/ueber#reza-alami` | `/ueber` (full, as `ProfilePage.mainEntity`) | `worksFor` → Studio, `sameAs` |
| Website | `WebSite` | `https://dotmind.de/#website` | `/` | `publisher` → Studio, `inLanguage: "de"` |
| Page | `WebPage` (`ProfilePage`, `ContactPage`, `CollectionPage` where apt) | `{canonical}#webpage` | every page | `isPartOf` → WebSite, `about`/`mainEntity`, `breadcrumb`, `inLanguage`, `dateModified` |
| Service | `Service` | `https://dotmind.de/leistungen/{slug}#service` | service page | `provider` → Studio, `offers` → `Offer` (`priceSpecification.minPrice`, `priceCurrency: "EUR"`, `valueAddedTaxIncluded`), `areaServed` |
| Case study | `Article` (SEO-STRATEGY §6.5) | `https://dotmind.de/projekte/{slug}#article` | case study | `publisher` → Studio, `author` → Person, `about` → client `Organization` (with own `@id` `…#client`, `url` = live site), `mentions` → Services, `datePublished`, `dateModified`, `inLanguage` |
| Breadcrumb | `BreadcrumbList` | `{canonical}#breadcrumb` | all except `/` | — |
| Contact | `ContactPoint` (nested in Studio) | — | `/` | — |
| FAQ | `FAQPage` | `{canonical}#faq` | home, service pages | P2 (no Google rich result since 2026; harmless) |

Compact example for the homepage (values from the fact layer; `null` facts are omitted, never emitted as `null`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://dotmind.de/#organization",
      "name": "dotMind",
      "alternateName": "dotMind by Reza Alami",
      "description": "Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen im DACH-Raum.",
      "url": "https://dotmind.de/",
      "founder": { "@id": "https://dotmind.de/ueber#reza-alami" },
      "address": { "@type": "PostalAddress", "streetAddress": "Am Kämpchen 8", "postalCode": "40885", "addressLocality": "Ratingen", "addressCountry": "DE" },
      "areaServed": [{ "@type": "Country", "name": "Deutschland" }, { "@type": "Country", "name": "Österreich" }, { "@type": "Country", "name": "Schweiz" }],
      "contactPoint": [{ "@type": "ContactPoint", "contactType": "Erstgespräch", "url": "https://dotmind.de/kontakt#termin", "availableLanguage": ["de"] }],
      "knowsAbout": ["Webdesign", "Webentwicklung", "Web-Apps", "Suchmaschinenoptimierung", "Local SEO"],
      "sameAs": []
    },
    { "@type": "Person", "@id": "https://dotmind.de/ueber#reza-alami", "name": "Reza Alami", "jobTitle": ["Software Engineer", "AI Specialist", "Web & App Developer", "Digital Marketer"], "worksFor": { "@id": "https://dotmind.de/#organization" } },
    { "@type": "WebSite", "@id": "https://dotmind.de/#website", "url": "https://dotmind.de/", "name": "dotMind", "inLanguage": "de", "publisher": { "@id": "https://dotmind.de/#organization" } }
  ]
}
```

Emit **one `@graph` per page** from `src/lib/schema.ts` (page-specific nodes plus `@id` references to the global ones), not several unrelated script tags.

### 8.2 `sameAs` strategy

- Only profiles that exist, are controlled by Reza/the studio, and show the same name and descriptor: LinkedIn (person and, later, company page), GitHub, Google Business Profile URL, later Clutch/Sortlist/Provenexpert or chamber/association listings.
- Person `sameAs` ≠ Organization `sameAs`. Reza's LinkedIn goes on the Person; the company page and GBP go on the Studio.
- `site.socials` currently holds `null` hrefs; the schema builder filters them out (already done in `page.tsx:33`). Keep that behaviour.
- Add a profile to `sameAs` only after its bio has been updated to the glossary wording. Corroboration across sources is what AI systems use to trust an entity description.

### 8.3 How llms.txt and schema complement each other

| | JSON-LD | llms.txt |
| --- | --- | --- |
| Audience | Search engines, entity graphs, any parser | LLM-based agents and assistants that fetch it |
| Granularity | Per page, typed properties | Site-wide, prose summaries with links |
| Unique job | Machine-precise relations (`founder`, `provider`, prices as numbers, `@id`) | Orientation: what exists, where, in what order, rules for agents |
| Must never | Contradict visible content | Contain a fact not on the linked page |

Both are rendered from the same fact objects; neither is the source of truth.

### 8.4 Single source of truth

```
src/content/facts/site.ts      brand.name, brand.alternateName, descriptor, founder, address (= Impressum),
                               email, phone, areaServed, priceNote ("netto"), sameAs, studioNameDecided
src/content/facts/services.ts  id, slug, tier, priceFrom, priceUnit, published, updatedAt
src/content/facts/projects.ts  slug, client {name, url, place}, industry, services[], results[] (verified only), updatedAt
src/content/facts/glossary.ts  canonical terms (§6.3)
src/content/de/*.ts            German prose: summaries, llmsSummary, FAQ
         │
         ├─► pages (HTML, fact boxes)        ├─► src/lib/schema.ts (JSON-LD @graph)
         ├─► src/lib/metadata.ts (title, description, OG, hreflang)
         ├─► src/lib/llms.ts (llms.txt)      └─► sitemap.ts / robots.ts
         └─► manual: Google Business Profile, LinkedIn, directories  (checked by the monthly checklist)
```

Rules: components never hard-code a price, name, descriptor or contact datum. OG alt/footer text uses `facts/site.ts` (removes the third descriptor in `opengraph-image.tsx`). GBP is the only surface that can't be generated, so it's on the manual checklist.

### 8.5 Consistency checks

**Automated (CI, `scripts/verify-ai-surfaces.ts`, run against `next build && next start`):**
1. Fetch `/sitemap.xml`; every URL returns 200, is self-canonical, has exactly one `<h1>`.
2. Every page: parse all `application/ld+json`; valid JSON; every `@id` reference resolves to a node defined on that page or on `/`; no value is `null`, `""`, `"undefined"` or contains `localhost`.
3. Studio `name`, `descriptor`, founder name, and each service's `minPrice` are **string-equal** across: JSON-LD, the visible fact box (`[data-fact="price"]`), meta description where used, `og:site_name`, and `/llms.txt`.
4. Production HTML contains no `Placeholder` marker (add `data-placeholder` to the component and assert zero occurrences on indexable pages).
5. `/llms.txt`: 200, `text/plain; charset=utf-8`, no redirect, valid structure, every link in the sitemap, ≤ 1,500 tokens.
6. `/robots.txt`: contains the named groups from `facts/crawlers.ts`; does not disallow `/_next/`; sitemap URL on the production domain.
7. Banned terms from the glossary („Smart Home", „Full-Stack", „Studio für digitale Wachstumssysteme") absent from all rendered output, and the four role titles appear only as the complete, ordered set.

**Manual (monthly, 10 minutes):** GBP name/category/description/website vs. `facts/site.ts`; LinkedIn headline; directory listings; Rich Results Test and validator.schema.org for `/`, one service, one case study.

---

## 9 · Multilingual AEO

### 9.1 Decision: one llms.txt per published locale, root file links the others

| Option | Pro | Con | Verdict |
| --- | --- | --- | --- |
| One `/llms.txt` with language sections | One file to find | Mixed languages confuse summarisation; grows with every locale; an agent answering in German loads English/Arabic/Persian noise | No |
| **`/llms.txt` (German) + `/en/llms.txt`, later `/ar/llms.txt`, `/fa/llms.txt`** | Each file is coherent, short and in the user's language; mirrors the URL structure (German unprefixed, others in subfolders: UX-DIRECTION §8.1, SEO-STRATEGY §8.1) | Agents only probe `/llms.txt` | **Yes**, and the root file solves discovery with a section: |

```markdown
## Weitere Sprachen

- [English](https://dotmind.de/en/llms.txt): Site overview in English.
```

Rules: a locale's llms.txt exists only when that locale is published (SEO-STRATEGY §8.5: money pages genuinely localized). It lists only pages that exist in that locale; never links German pages from `/en/llms.txt` as if they were English (it may link `/` under `## Optional` as „German original").

### 9.2 Shared fact layer, translated prose only

- **Language-neutral facts** (`src/content/facts/*`): prices as numbers, slugs per locale map, dates, client names, results, contact data, `@id`s. Exactly one copy.
- **Per-locale prose** (`src/content/{de,en,ar,fa}/*`): summaries, FAQ, `llmsSummary`. Translations carry `sourceUpdatedAt`; CI warns when the German source changed after the translation (SEO-STRATEGY §8.7). Stale translations with price-related text block the build, because a contradicting price in English is exactly what an answer engine might quote.
- Numbers are formatted per locale at render time (`Intl.NumberFormat`), never typed into prose: „ab 7.500 €" (de), „from €7,500" (en), Persian/Arabic digits in visible text per UX-DIRECTION, Western digits in JSON-LD.

### 9.3 Entity names and `@id`s across languages

- `@id`s are identical in every locale (`https://dotmind.de/#organization`, `…/ueber#reza-alami`, `…/leistungen/{de-slug}#service`). An English service page references the **same** Service `@id` (anchored on the German canonical URL) and adds its own `WebPage` node with `inLanguage: "en"`. One entity, many pages.
- The studio name is never translated. Service names may be translated in `name` per locale page, with the German name kept in `alternateName` on the shared node.
- **Persian/Arabic names:** whether to show Reza's name in Persian/Arabic script, and its exact spelling, is Reza's decision; add it as `alternateName` on the Person only after he confirms it. Don't transliterate automatically.
- `inLanguage` on `WebSite` (de, later array of all published), every `WebPage` and every `Article`. `<html lang>` and `dir` per locale layout. hreflang codes and x-default per SEO-STRATEGY §8.3 (AEO has no stake in the x-default disagreement).

### 9.4 RTL and AI extraction notes

- Latin brand/tech terms inside RTL text wrapped in `<bdi>` (UX §8.3) also keeps extracted text in logical order.
- Arabic and Persian tokenise at 2–4× the token count of English for the same content. Apply the token budgets in §6.1 per locale, measured, not assumed; keep `/fa/llms.txt` and `/ar/llms.txt` to the same link set as the English file rather than more text.
- Phase 3 locales target diaspora businesses that often search in German (SEO-STRATEGY §8.5). Their AEO value is mostly in user-triggered fetches („Erkläre mir diese Seite auf Persisch"), which works from the German page anyway. Don't publish `ar`/`fa` llms files before those locales launch.

---

## 10 · Priority roadmap

### Now: with the phase-1 launch (STRATEGY §09 phase 1, weeks 3–6 of the build)

1. Fact layer (`src/content/facts/*`) with studio name, descriptor, founder, address = Impressum, prices; production build fails on a `localhost` or non-`https://dotmind.de` site URL.
2. Remove contradictory self-descriptions (layout title, OG alt, `site.roles`, Person `jobTitle`, smart home).
3. robots.ts with named AI groups (§5.4); sitemap with real `lastModified`; Bing Webmaster Tools.
4. JSON-LD `@graph` builder with the `@id` scheme (§8.1).
5. Answer-first summary + fact box on home, services, case studies; glossary enforced.
6. Native, labelled forms for Projekt anfragen and Schnellcheck; booking fallback link; honeypot + rate limit, no CAPTCHA.
7. `/llms.txt` generated (§3.3, §3.6) and `verify-ai-surfaces` CI script (§8.5).
8. CDN/WAF check with AI user agents; log access in place.
9. First monthly prompt-panel baseline (§11.3), recorded **before** launch and again 4 weeks after.

### After the site structure is final (end of phase 1, once slugs and studio name are frozen)

- Freeze `@id`s; no more slug changes without 308s and an llms.txt regeneration check.
- Add `sameAs` profiles as they get updated bios; GBP live and matching.
- Case-study results added as soon as verified (biggest citation lever after the entity basics).
- Quarterly review of crawler table (§5.1) against vendor docs.

### Phase 2 (months 6–18)

- `/wissen` with answer-first articles, author + dates; add top articles to llms.txt.
- `/branchen/*` pages in llms.txt when published.
- `/en` locale and `/en/llms.txt`; translation staleness gate.
- Decide on `Accept: text/markdown` for `/wissen` based on logs (§4.2).
- Re-evaluate WebMCP if Chrome ships it by default (§7.5).
- Brand switch (studio name leads): only copy weight changes; graph untouched.

### Phase 3 (month 18+)

- `/ar`, `/fa` locales and llms files; Persian/Arabic `alternateName` if confirmed.
- `/team`: additional `Person` nodes with `worksFor`; `founder` unchanged.
- Client portal stays out of crawl and agent scope (`Disallow` + auth).
- WebMCP declarative tools on the forms if adoption is real.

---

## 11 · Handoff checklists and monitoring

### 11.1 Frontend Developer

| Pri | Phase | Item | File / route | Acceptance criteria |
| --- | --- | --- | --- | --- |
| P0 | 1 | Production URL guard | `src/content/facts/site.ts`, `next.config.ts` | `next build` with `NODE_ENV=production` fails if `NEXT_PUBLIC_SITE_URL` is unset or contains `localhost`, or if the studio name is unset. |
| P0 | 1 | No placeholder text in production | `src/components/ui/Placeholder.tsx` (+ `data-placeholder`) | Indexable pages in a production build contain zero `data-placeholder` elements; missing facts render the designed pending state or nothing. |
| P0 | 1 | robots.txt with AI groups | `src/app/robots.ts`, `src/content/facts/crawlers.ts` | Output matches §5.4; no `Host:`; no `/_next/` disallow; `/api/` disallowed in every group; no disallow for `/danke` pages. |
| P0 | 1 | Root files bypass the proxy | `src/proxy.ts` matcher | `curl -sI /robots.txt /sitemap.xml /llms.txt` → 200, no 3xx, correct content type. |
| P0 | 1 | JSON-LD `@graph` builder | `src/lib/schema.ts`, all page files; delete `src/app/page.tsx:16–35`, `about/page.tsx:72–91`, `projects/[slug]/page.tsx:177–189` blocks | One `@graph` per page; `@id`s per §8.1; null-safe; passes validator.schema.org without errors; German values from facts. |
| P0 | 1 | Native, agent-operable forms | `/kontakt`, `/website-check`, form components | Submits and redirects with JS disabled; every input has a `<label>`, `name`, `autocomplete`; errors are text with `aria-describedby`; no CAPTCHA; honeypot + min-time + rate limit server-side. |
| P0 | 1 | Booking fallback link | `/kontakt#termin` | A plain `<a href>` to the booking provider exists in server HTML next to the two-click embed. |
| P1 | 1 | `/llms.txt` route | `src/app/llms.txt/route.ts`, `src/lib/llms.ts` | `force-static`; `text/plain; charset=utf-8`; matches §3.2 structure; generated from facts + `de/*` `llmsSummary`; ≤ 1,500 tokens; every link in sitemap. |
| P1 | 1 | Sitemap with real dates | `src/app/sitemap.ts` | Only canonical 200 URLs; `lastModified` from content `updatedAt`; no `/danke`, no `/api`. |
| P1 | 1 | Fact box + summary components | `FactSheet`/`InvestmentBlock` (FRONTEND-PLAN), service + case templates | `<dl>` markup, values from facts, `<time datetime>` for Stand; summary within the first 300 tokens of `<main>`. |
| P1 | 1 | Single descriptor everywhere | `layout.tsx`, `opengraph-image.tsx`/`og` route, `lib/metadata.ts` | Banned terms (§8.5 check 7) absent; `og:site_name`, title template and JSON-LD `name` identical. |
| P1 | 1 | CI surface verification | `scripts/verify-ai-surfaces.ts`, CI workflow | All checks in §8.5 pass on every PR to `main`. |
| P2 | 1 | `ContactPoint` + optional `ReserveAction` | `src/lib/schema.ts` | Present on `/`; URLs resolve. |
| P2 | 2 | `/en/llms.txt` + „Weitere Sprachen" | `src/app/[lang]/llms.txt/route.ts` or `src/app/en/llms.txt/route.ts` | Exists only when `en` is published; root file links it. |
| P2 | 2 | Markdown negotiation for Wissen (conditional) | `next.config.ts` rewrites, `src/app/wissen/md/[slug]/route.ts` | Only if logs show demand; `Vary: Accept`; no new indexable URL. |
| P2 | 2–3 | WebMCP annotations (conditional) | form components | Only after default-on in Chrome and a real consumer. |

### 11.2 SEO Specialist

| Pri | Phase | Item | Where | Acceptance criteria |
| --- | --- | --- | --- | --- |
| P0 | 1 | Glossary approved and applied | `src/content/facts/glossary.ts`, all copy | §6.3 terms used verbatim in copy, schema, OG, llms.txt, GBP, LinkedIn. |
| P0 | 1 | Crawler policy signed off | §5.2 | Reza confirms „training allowed" and the Bytespider choice in writing (one line in `facts/crawlers.ts` comment with date). |
| P0 | 1 | CDN/WAF bot settings verified | Hosting/CDN dashboard | `curl -A` tests (§11.3) return 200 for GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, ChatGPT-User. |
| P0 | 1 | Bing Webmaster Tools + GSC | external | Sitemap submitted to both; no crawl errors on money pages. |
| P1 | 1 | Answer-first summaries written | `src/content/de/services.ts`, `de/projects.ts`, `de/home.ts` | Each 40–80 words, names the studio, contains the price or outcome, no claims without proof. |
| P1 | 1 | `llmsSummary` per entity | same files | One sentence ≤ 160 characters per service, project and key page. |
| P1 | 1 | Verified results for case studies | `src/content/facts/projects.ts` `results[]` | Each result has metric, value, period, source; unverifiable ones absent. |
| P1 | 1 | Prompt panel baseline | monitoring sheet | 12 prompts × 4 engines recorded before launch. |
| P1 | 1.5 | AI referral segment | analytics (Plausible) | Sources chatgpt.com, perplexity.ai, claude.ai, copilot.microsoft.com, gemini.google.com grouped as „KI-Assistenten". |
| P1 | 1–2 | `sameAs` profiles aligned | LinkedIn, GBP, directories | Bios use glossary wording; URL added to facts only after update. |
| P2 | 2 | Wissen articles answer-first, dated | `/wissen/*` | Each H2 starts with a direct answer; `datePublished`/`dateModified` visible and in JSON-LD. |
| P2 | 2 | Third-party corroboration | directories, partner sites, local press | ≥ 5 consistent external mentions with the same descriptor by end of phase 2. |

### 11.3 Monitoring plan

**A. AI crawler hits in server logs (weekly, 5 minutes).** FRONTEND-PLAN §9.7 assumes a self-hosted EU Node app behind a reverse proxy, so access logs exist (nginx/Caddy). Log `user-agent`, path, status; anonymise or truncate IPs after 7 days (DSGVO).

```bash
# Hits per AI agent, last 7 days (combined log format)
grep -hiE 'GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|Google-Agent|Applebot|Meta-External|Meta-WebIndexer|CCBot|Bytespider|bingbot' access.log* \
 | grep -oiE 'GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|Google-Agent|Applebot|Meta-External[A-Za-z]+|Meta-WebIndexer|CCBot|Bytespider|bingbot' \
 | sort | uniq -c | sort -rn

# Non-200 responses served to AI agents (the important one)
grep -iE 'GPTBot|OAI-SearchBot|ClaudeBot|Claude-SearchBot|PerplexityBot|ChatGPT-User|Claude-User' access.log | awk '$9 != 200 && $9 != 304 {print $9, $7}' | sort | uniq -c | sort -rn

# Who reads llms.txt / asks for Markdown
grep -E '"GET /(en/)?llms(-full)?\.txt' access.log | awk -F'"' '{print $6}' | sort | uniq -c
```

Signals: 403/429/503 to any AI agent = WAF problem (fix immediately). 404s on `/llms-full.txt` or `.md` URLs from AI agents = demand signal for §4. User agents can be spoofed; verify against vendor-published IP lists (OpenAI, Perplexity and Google publish JSON ranges) before acting on surprising numbers.

**Pre-launch and after infra changes:**

```bash
for ua in "GPTBot/1.1" "OAI-SearchBot/1.0" "ChatGPT-User/1.0" "ClaudeBot/1.0" "Claude-SearchBot/1.0" "PerplexityBot/1.0"; do
  for p in / /llms.txt /leistungen/seo /projekte/[slug]; do
    printf "%-20s %-28s %s\n" "$ua" "$p" "$(curl -s -o /dev/null -w '%{http_code}' -A "Mozilla/5.0 (compatible; $ua)" "https://dotmind.de$p")"
  done
done
```

**B. Citation check (monthly, ~45 minutes, first Monday).** Fixed German prompt set, run in ChatGPT (search on), Perplexity, Google (AI Overview/AI Mode, logged-out, location set to Ratingen), Claude (web search on), Copilot quarterly. Fresh session, no personalisation. Record per prompt and engine: mentioned (yes/no), cited URL, accuracy of facts (correct / outdated / wrong), competitors named. Spreadsheet with one tab per month.

| # | Prompt | Tests |
| --- | --- | --- |
| 1 | Wer ist Reza Alami und was macht dotMind? | Entity basics, descriptor |
| 2 | Was kostet bei dotMind eine neue Website? | Price facts, „ab", net/gross |
| 3 | Wer entwickelt Bestellsysteme für Restaurants in Düsseldorf? | Service + industry + local |
| 4 | Welche Agentur in Ratingen macht Websites für Arztpraxen mit Online-Terminbuchung? | Launch industry 3 |
| 5 | Website-Relaunch für ein mittelständisches Unternehmen: worauf achten und wer kann das in Düsseldorf? | Relaunch + SEO migration |
| 6 | Webdesign Ratingen: Empfehlungen für inhabergeführte Unternehmen | Local head term |
| 7 | Was ist der Website-Schnellcheck von dotMind und wie fordere ich ihn an? | Action discoverability |
| 8 | Buche mir ein Erstgespräch bei dotMind. | Agent path (note where it stops) |
| 9 | Wer hat die Website von Rundumdienst in Neuss gebaut? | Case-study attribution |
| 10 | Power Bowls Duisburg Bestell-App: wer hat sie entwickelt? | Case-study attribution |
| 11 | Web-App statt Excel für Bestellungen: lohnt sich das für einen Lieferdienst? | Informational, Wissen readiness |
| 12 | Ist dotMind seriös? Erfahrungen? | Trust, reviews, corroboration |

Act when: a fact is wrong (find the source: own page, outdated profile or directory; fix there), a competitor is cited for a query a case study answers (strengthen that page's summary and fact box), or the engine can't reach the site (check logs, §A).

**C. Quarterly:** re-verify §5.1 against vendor docs; check llmstxt.org and WebMCP status; review whether llms.txt is fetched at all (if zero fetches for 12 months, keep it anyway; cost is nil).

---

## Alignment notes

Checked against `UX-DIRECTION.md`, `SEO-STRATEGY.md` and `FRONTEND-PLAN.md` as present on 5 Oct 2026.

**Aligned**
- German unprefixed at root, `/en|/ar|/fa` subfolders, routing via `proxy.ts`; no Accept-Language redirect at `/` (UX §8.1, SEO §8.1, FRONTEND §7). Important for AI fetchers too: they rarely send German language headers.
- `ProfessionalService` + `founder` `Person`, `WebSite`, `Service` with `minPrice`, `BreadcrumbList`, no Review markup, `FAQPage` as P2 (SEO §7.5, FRONTEND §8).
- AI crawler policy „allow all, including training" (SEO §11.3).
- Single source of truth in `src/content/facts/*` + locale prose (FRONTEND §2). This document adds `facts/crawlers.ts`, `facts/glossary.ts` and the `llmsSummary` field.
- FRONTEND's proxy matcher already excludes paths with file extensions, so `/llms.txt`, `/robots.txt`, `/sitemap.xml` bypass the proxy.

**Disagreements / to reconcile**

*All nine points below were resolved in October 2026 in favour of the AEO recommendation (AL5: SEO keyword slugs; AL6: x-default → English; AL8: still open with Reza). See `STRATEGY.md` §11.*

| # | Topic | Positions | AEO recommendation |
| --- | --- | --- | --- |
| AL1 | llms.txt priority | SEO §11.3: P2, phase 1.5 | **P1, phase 1**: generated, near-zero cost, carries the agent notes. |
| AL2 | Case-study type | SEO §6.5: `Article`; FRONTEND §8: keep `CreativeWork` | `Article` (gives `author`, `datePublished`, `dateModified`, which citation engines use). |
| AL3 | `@id` scheme | SEO: absolute `https://dotmind.de/#organization`, `/ueber#reza-alami`; FRONTEND: `#studio`, `#founder` (relative) | SEO's absolute IDs. Relative fragment IDs resolve per page and fragment the entity. |
| AL4 | robots.txt and thank-you pages | FRONTEND §7: `Disallow: /*/danke`; SEO §7.3: `noindex` only, no disallow | SEO's: crawlers must be able to fetch the page to see its `noindex`. Use `noindex` only, no robots.txt rule. |
| AL5 | Service slugs | UX §2.1: `/leistungen/conversion-website`, `/web-apps`, `/seo`; SEO §2.2: `/website-erstellen-lassen`, `/website-relaunch`, `/web-app-entwicklung`, `/seo`, `/wartung-hosting` | AEO-neutral; must be decided **once** before launch because `@id`s derive from them. Draft llms.txt uses SEO's slugs. |
| AL6 | x-default | UX/FRONTEND: → German; SEO: → English | AEO-neutral; follow the final SEO decision. |
| AL7 | Schnellcheck vs. Website-Check on one URL | UX §2.1 puts both on `/website-check` | Fine, but model as two named offers with separate fact boxes and two `Offer`s (§6.3). |
| AL8 | Net vs. gross prices | Not specified anywhere | Decide („netto zzgl. USt." is standard for B2B) and set `valueAddedTaxIncluded` accordingly; same wording in every surface. |
| AL9 | Placeholders in production | UX §04.5 distinguishes placeholder vs. pending state | Add a CI assertion (§8.5 check 4) so nothing marked placeholder reaches indexable production HTML. |

---

## Sources

Vendor and spec documentation (checked 5 Oct 2026):
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawlers: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity crawlers: https://docs.perplexity.ai/guides/bots
- Google common crawlers and Google-Extended: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- Google user-triggered fetchers (incl. Google-Agent): https://developers.google.com/search/docs/crawling-indexing/google-user-triggered-fetchers
- Apple Applebot / Applebot-Extended: https://support.apple.com/en-us/119829
- Meta crawlers: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/
- llms.txt proposal: https://llmstxt.org/
- Cloudflare AI traffic categories (July 2026): https://blog.cloudflare.com/content-independence-day-ai-options/ and https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/
- Next.js 16 bundled docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`, `…/01-metadata/sitemap.md`, `…/03-file-conventions/route.md`, `…/03-file-conventions/public-folder.md`, `01-app/01-getting-started/15-route-handlers.md`, `01-app/02-guides/backend-for-frontend.md`, `01-app/02-guides/json-ld.md`, `01-app/02-guides/internationalization.md`, `01-app/02-guides/ai-agents.md`

Secondary sources (indicative, not authoritative):
- llms.txt adoption and request data 2026: https://aisaasradar.com/article/llms-txt-adoption-data-2026, https://www.geoly.ai/blog/does-llms-txt-work
- WebMCP status: https://studiomeyer.io/en/blog/webmcp-reality-check-may-2026, https://dev.to/ai-agent-economy/webmcp-in-2026-which-browsers-support-navigatormodelcontext-complete-compatibility-status-1oe4
- Google-Agent: https://ppc.land/google-agent-joins-the-crawler-list-as-ai-browsing-gets-an-official-identity/
