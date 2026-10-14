# Reza Alami: SEO Strategy & Search Architecture

The search plan for the German-first, founder-led studio described in [`STRATEGY.md`](./STRATEGY.md). It sits alongside [`UX-DIRECTION.md`](./UX-DIRECTION.md), which covers structure and behaviour, and `FRONTEND-PLAN.md`, which covers the build.

> **Decisions, October 2026:** the decision log in `STRATEGY.md` §11 is binding. Where anything below differs from it, the decision log wins.

- **Status:** v1 · October 2026 · pre-implementation
- **Goal:** qualified inquiries from organic search, not traffic. Every URL has a commercial job or directly feeds one.
- **Language rule:** real titles, H1s, slugs, meta descriptions and article titles are in German. Explanations are in English.
- **Honesty rule:** there are no invented search volumes, KD scores, results, reviews or facts about Reza or his clients. Priorities are relative (High/Medium/Low). Each keyword marked "validate" has to be checked in a keyword tool (Sistrix, Ahrefs or Google Keyword Planner, location Germany plus Austria/Switzerland, language German) before content production.
- **Placeholders:** The base city is decided: **Ratingen** (next to Düsseldorf), see §9.1. The studio name is decided: **dotMind**, domain `dotmind.de`.
- **Framework note:** the stack is Next.js 16 App Router. Wording here is framework-agnostic where possible. Wherever a Next.js API is named, the frontend developer must check it against `node_modules/next/dist/docs/` (per `AGENTS.md`). For example, middleware is now `proxy.ts`, and `generate-metadata.md` describes how metadata merges.

---

## Contents

1. [SEO strategy](#1--seo-strategy)
2. [Keyword architecture](#2--keyword-architecture)
3. [Site architecture & cannibalization rules](#3--site-architecture--cannibalization-rules)
4. [Homepage SEO](#4--homepage-seo)
5. [Service pages](#5--service-pages)
6. [Case study framework](#6--case-study-framework)
7. [Technical SEO](#7--technical-seo)
8. [Multilingual SEO](#8--multilingual-seo)
9. [Local & credibility SEO](#9--local--credibility-seo)
10. [Content roadmap](#10--content-roadmap)
11. [Handoff checklists](#11--handoff-checklists)

---

## 0 · Audit of the current code (what search engines see today)

### Already in place

| Item | Where | Assessment |
| --- | --- | --- |
| `metadataBase` + canonical paths from `NEXT_PUBLIC_SITE_URL` | `src/content/site.ts:21`, `src/app/layout.tsx:24–30` | Good mechanism. The localhost fallback is a risk (see P0 below). |
| `sitemap.xml` generated from the content model | `src/app/sitemap.ts` | Good mechanism. Wrong paths and incomplete fields. |
| `robots.txt` | `src/app/robots.ts` | Allows everything and references the sitemap. `host` is a Yandex-only directive and harmless. |
| OG images generated per page and per project | `src/app/opengraph-image.tsx`, `src/app/projects/[slug]/opengraph-image.tsx`, `src/lib/og.tsx` | Good. Copy is English and generic. |
| JSON-LD helper with `<` escaping | `src/components/ui/JsonLd.tsx` | Good. Keep it. |
| `Person` on home, `ProfilePage` on `/about`, `CreativeWork` on projects | `src/app/page.tsx:16–35`, `src/app/about/page.tsx:72–91`, `src/app/projects/[slug]/page.tsx:51–63` | Wrong entity model for a studio, and English. |
| Self-hosted fonts via `next/font` | `src/app/layout.tsx:11–19` | Good for DSGVO and performance. |
| AVIF/WebP image formats | `next.config.ts:5` | Good. |
| 404 page with `noindex` | `src/app/not-found.tsx:7–8` | Fine. Copy is English. |
| Hero text revealed with CSS (LCP-safe) | `src/components/home/Hero.tsx:11–14` | Good. |

### Wrong for SEO now (all of this must be fixed before launch)

| # | Issue | Where | Fix |
| --- | --- | --- | --- |
| 1 | `<html lang="en">` | `src/app/layout.tsx:51` | `lang="de"` (locale layout, see §8) |
| 2 | `locale: "en_US"` used for `og:locale` | `src/content/site.ts:22` | `de_DE` |
| 3 | Default title „Reza Alami — Software Engineer, AI & Web Developer": English, no buyer keyword | `src/app/layout.tsx:21` | See §4 |
| 4 | Description sells „AI-powered websites, apps and smart home experiences" | `src/content/site.ts:18–19` | German, outcome-led, no smart home |
| 5 | **Root layout sets `alternates.canonical: "/"`.** Any page that doesn't override it inherits a canonical pointing at the homepage. One forgotten override on a new service page would tell Google to drop that page. | `src/app/layout.tsx:30` | Remove canonical from the root layout. Set it per page through one `buildMetadata()` helper that requires a path. |
| 6 | Child pages define partial `openGraph` (`{ url, type }`), which by Next's metadata merge rules **replaces** the parent's `openGraph` object, so `/about`, `/projects` and `/contact` lose `og:title`, `og:description`, `og:site_name` and `og:locale` (verify against `generate-metadata.md` → merging). | `src/app/about/page.tsx:19`, `src/app/projects/page.tsx:13`, `src/app/contact/page.tsx:14`, `src/app/projects/[slug]/page.tsx:36` | Build the full OG object in the helper on every page. |
| 7 | H1 = „Reza Alami" plus an `sr-only` list of four job titles. That is visually hidden keyword text inside the H1. | `src/components/home/Hero.tsx:44–56` | Visible keyword line inside the H1 (§4). No `sr-only` copy in headings. |
| 8 | English routes `/projects`, `/about`, `/contact`; nav labels Work/About/Contact | `src/content/site.ts:39–43` | German routes + 308 redirects (§7.9) |
| 9 | Sitemap lists hard-coded English paths with no `lastModified` or `alternates`. `priority`/`changeFrequency` are ignored by Google. | `src/app/sitemap.ts` | Generate from the route registry: canonical, indexable URLs only, `lastModified` from content, `alternates.languages` once locales exist. |
| 10 | If `NEXT_PUBLIC_SITE_URL` is missing in production, canonicals, sitemap and OG URLs all point to `http://localhost:3000`. | `src/content/site.ts:21` | Fail the production build when it's unset, or when it isn't `https://`. |
| 11 | Generic positioning: „age of AI", smart home, four numbered job titles with no outcome headline | `src/content/site.ts:15–19`, `src/content/profile.ts:38,107–114` | Per STRATEGY §11: keep the four approved titles as the role line under an outcome headline. Remove smart home everywhere, including `knowsAbout` in JSON-LD. |
| 12 | Image alt text is English and generic („Power Bowls website on a desktop screen") | `src/content/projects.ts:74–78` | German, descriptive, per image (§7.8) |
| 13 | Project OG `alt = "Project case study"` (same alt for every project) | `src/app/projects/[slug]/opengraph-image.tsx:4` | Per-project German alt |
| 14 | Case-study metadata uses the bare client name as the title („Power Bowls — Reza Alami"), so there's no solution or industry keyword | `src/app/projects/[slug]/page.tsx:27–39` | §6 pattern |
| 15 | Case studies have no challenge, solution or result content (`null`), only feature lists | `src/content/projects.ts:110–111,138–139,165–166` | Content task (§6). Thin pages until filled. |
| 16 | No `BreadcrumbList`, `WebSite`, `Organization`/`ProfessionalService` or `Service` schema | (absent) | §7.7 |

### Observations from the live client sites (inspected via fetch, October 2026)

- **powerbowls.de:** the fetched HTML returned almost nothing but the title „Power Bowls", with no meta description and no visible headings. That is consistent with a client-rendered React/Vite SPA. **Verify** with URL Inspection or a rendered crawl before making *any* SEO claim in the Power Bowls case study. Present the case study as an ordering-system (web-app) case, not an SEO case.
- **foodigastro24.de:** good German title („Foodigastro24 – Frische Lebensmittel & Lieferung für Gastronomie und Unternehmen"). The address is Mercatorstr. 66, Duisburg, **the same address as Power Bowls** (`projects.ts:109`). If the two businesses are related or have the same owner, the case studies should say so. Buyers and journalists will notice, and presenting them as two unrelated client wins would cost trust.
- **rundumdienst.de:** strong local title and headings („… in Neuss"). Service area: Neuss, Düsseldorf, Meerbusch, Kaarst, Dormagen, Korschenbroich, Mönchengladbach, Grevenbroich. LocalBusiness schema (per `projects.ts:156`). This is the best SEO proof asset of the three.
- **No client site credits Reza today.** See §9.6 for how to add a credit cleanly.

---

## 1 · SEO strategy

### 1.1 Position in search

Sell **outcomes the buyer types into Google**, not the category name the studio uses internally. Nobody searches „Conversion-Website" or „digitales Wachstumssystem". People search „Website erstellen lassen", „Website Relaunch", „Bestellsystem für Restaurant", „Web-App entwickeln lassen", „SEO für Handwerker". The brand language stays in headlines and copy, and the search language goes into titles, slugs, first paragraphs and H2s.

Search positioning in one sentence: **the site that ranks for the problem-plus-solution queries of owner-led SMEs (orders, bookings, inquiries, local visibility), proven by case studies from the same industries.**

### 1.2 Where search demand is winnable (from SERP research)

| Query family | What the German SERP shows | Implication |
| --- | --- | --- |
| „Webdesign Agentur", „Webdesign Ratingen" | Local pack + established agencies with city landing pages (e.g. kopfundstift.de, wedeon.de, pickdigital.de for Düsseldorf) | Winnable **only locally** via GBP plus the homepage. National head term is out of reach for years. |
| „Website Relaunch (Agentur/Kosten/Ablauf)" | Agency blog guides and service pages, many 2026-dated (jungmut, webnique, ostend.digital, ucentric-media) | Mid-competition and **high intent from the core audience** (SMEs with 5+ year-old sites). A dedicated page is worth it. |
| „Online-Bestellsystem ohne Provision" | **SaaS products** (orderio, Dishly, GiniCART, Famedo, RestaurantOS, GastroSprint) at roughly 49–120 €/month | A 15 k € custom build loses that head term and *should*: those searchers want SaaS. Target **„eigenes Bestellsystem entwickeln lassen"**, „individuelles Bestellsystem" and comparison intent („Bestellsystem-Software oder Eigenentwicklung"). |
| „Web-App / Kundenportal entwickeln lassen" | Dev agencies with cost guides (tj-labs, unit-m, codeguides, saschafix) | Competitive but very high value. One strong service page plus a cost-led FAQ. |
| „Next.js Agentur / Webentwicklung Next.js" | Specialist agencies (BRANDUNG, foobar, TJ Labs, Wibify) | This is **developer/agency intent, not SME-buyer intent**. Don't build a landing page in phase 1. Next.js appears as proof on service pages and a „So ist diese Website gebaut" page. |
| „Local SEO Agentur", „Google Unternehmensprofil optimieren" | Agencies with local and city pages | Go after it through **industry long tail** („SEO für Handwerker", „Local SEO für Restaurants"), not the agency head term. |
| „KI Automatisierung KMU" | New AI agencies and consulting blogs, very crowded, plus a Handelsblatt advertorial | Delay a standalone page until two AI case studies exist (STRATEGY §02). |
| „Was kostet eine Website" | Saturated with 2026 price guides and several calculators (websitekostenrechner.de, evario.at, pixagentur.de) | A **calculator plus honest ranges** on one URL can compete on usefulness and doubles as the lead magnet. |

### 1.3 Personal brand vs. agency intent

| Query type | Example | Owner URL | Rule |
| --- | --- | --- | --- |
| Navigational, person | „Reza Alami", „Reza Alami Webentwickler" | `/` (and `/ueber` as the second sitelink) | The homepage title contains the brand. `Person` schema on `/ueber` with `sameAs` (LinkedIn, GitHub). |
| Navigational, studio | „dotMind" | `/` | Same. Once the name exists, dotMind leads the title in phase 2. |
| Commercial, local | „Webdesign Ratingen", „Webagentur Ratingen" | `/` + GBP | The homepage is the local landing page. There is **no** separate city page for the home city. |
| Commercial, DACH-wide | „Website Relaunch Agentur", „Web-App entwickeln lassen" | `/leistungen/*` | Service pages carry these. They don't mention the city in their titles. |
| Commercial, industry × solution | „Bestellsystem Restaurant entwickeln lassen", „Website für Reinigungsfirma" | Case studies (phase 1), `/branchen/*` (phase 2) | §2.4 |
| Informational, buyer-adjacent | „Website Relaunch Checkliste", „Was kostet eine Website" | `/wissen/*`, `/website-kosten` | Only topics a buyer researches *before hiring*. No developer tutorials. |

**Domain decision (decided):** launch on **`dotmind.de` from day one**, with dotMind as the leading brand. If Reza owns a personal domain, 301 it to `/ueber`. Secure `dotmind.com` (301 to `.de`) if available.

### 1.4 What we measure (and what we don't)

- **North-star metric:** organic-sourced qualified inquiries (form, booking, Schnellcheck), tracked with cookieless analytics goals by landing page (STRATEGY §08).
- **Leading indicators:** GSC impressions and average position for the **commercial clusters only** (regex filter on the cluster terms), the number of commercial queries in the top 10, GBP calls/website clicks/direction requests, and branded search impressions (does „Reza Alami"/„dotMind" grow?).
- **Not a KPI:** total sessions, blog traffic, Domain Rating. Informational traffic counts only through the Schnellcheck or Kostenrechner conversions it produces.
- **Realistic timeline:** branded and long-tail case-study queries within 1–3 months, local pack for the home city within 3–6 months (depending on reviews), service head terms within 6–12+ months.

---

## 2 · Keyword architecture

All volumes are unknown until validated. Priority is relative business value × winnability, judged from the SERPs above. **Validate:** monthly volume (DE, AT, CH separately), keyword difficulty, CPC (a strong proxy for commercial value) and spelling variants („Web-App" vs. „Webapp" vs. „Web App", „Relaunch" vs. „Neugestaltung").

### 2.1 Homepage

| Role | Keyword | Intent | Priority |
| --- | --- | --- | --- |
| Primary (local) | Webdesign Ratingen / Webagentur Ratingen | Commercial, local | High |
| Primary (brand) | Reza Alami · dotMind | Navigational | High |
| Secondary | Webdesign und Webentwicklung für Unternehmen · Websites und Web-Apps für KMU | Commercial | Medium |
| **Must not target** | Website erstellen lassen, Website Relaunch, Web-App entwickeln lassen, SEO-Agentur | | Owned by service pages |

If Reza works fully remote with no meaningful local market, the homepage primary falls back to „Webdesign & Webentwicklung für KMU" plus brand, and local SEO shrinks to GBP hygiene (see §9.1).

### 2.2 Service clusters

**A. `/leistungen/website-erstellen-lassen`: Conversion-Website (new build)**

| Type | Keywords | Intent | Priority |
| --- | --- | --- | --- |
| Head | Website erstellen lassen | Commercial/transactional | High (validate) |
| Secondary | Firmenwebsite erstellen lassen · Unternehmenswebsite erstellen lassen · Webdesign für Unternehmen · professionelle Website für KMU | Commercial | High |
| Long tail | Website erstellen lassen ohne Baukasten · Website mit Festpreis für Dienstleister · Website die Anfragen bringt · Website individuell programmieren lassen statt WordPress | Commercial | Medium |
| Questions (FAQ/H2) | Wie lange dauert es, eine Website erstellen zu lassen? · Wem gehört der Code? · Brauche ich ein CMS? | Commercial investigation | Medium |

**B. `/leistungen/website-relaunch`: Relaunch (same service, own URL)**

Relaunch is a distinct SERP with its own buyer anxiety (losing rankings, redirects), and it describes the core primary segment exactly (STRATEGY §04: „Website 5+ years old"). It gets its own page in phase 1.

| Type | Keywords | Intent | Priority |
| --- | --- | --- | --- |
| Head | Website Relaunch | Commercial | High |
| Secondary | Website Relaunch Agentur · Website Relaunch Kosten · Website neu gestalten lassen · Relaunch ohne Rankingverlust | Commercial | High |
| Long tail | WordPress Website Relaunch · Relaunch von Baukasten-Website · SEO-Migration beim Relaunch | Commercial | Medium |
| **Must not target** | Relaunch Checkliste (→ Wissen article) | | |

**C. `/leistungen/web-app-entwicklung`: Web-Apps & Portale**

| Type | Keywords | Intent | Priority |
| --- | --- | --- | --- |
| Head | Web-App entwickeln lassen | Commercial | High (validate spelling) |
| Secondary | Webanwendung entwickeln lassen · Individualsoftware für KMU · Kundenportal entwickeln lassen · Buchungssystem entwickeln lassen | Commercial | High |
| Long tail | eigenes Bestellsystem entwickeln lassen · Bestellsystem für Restaurant individuell · Excel durch Web-App ersetzen · internes Tool entwickeln lassen · QR-Code-Tischbestellung entwickeln lassen | Commercial | High (low volume, very high fit) |
| Phase 2 spokes | `/leistungen/bestellsystem-entwickeln-lassen` · `/leistungen/kundenportal-entwickeln-lassen` | | Only after validation plus a second proof project per spoke |

**D. `/leistungen/seo`: SEO & Sichtbarkeit**

| Type | Keywords | Intent | Priority |
| --- | --- | --- | --- |
| Head | SEO für Unternehmen / SEO-Betreuung KMU | Commercial | Medium (crowded) |
| Secondary | Local SEO · Google Unternehmensprofil optimieren lassen · technisches SEO Audit · SEO Audit Kosten | Commercial | High (audit is the entry offer at 990 €) |
| Long tail | Local SEO für Handwerker · SEO für Restaurants · SEO für Reinigungsfirmen · bei Google in Ratingen gefunden werden | Commercial | High |
| **Must not target** | SEO-Agentur Ratingen in the title (the homepage owns the local term; the SEO page may mention the city in body copy) | | |

**E. Secondary service pages (launch, low SEO priority):** `/leistungen/wartung-hosting` → „Website Wartung Kosten", „Website-Wartungsvertrag", „Website Hosting Betreuung" (Medium, high retention value). „Wachstumsbetreuung" and „KI-Integration" get no standalone page in phase 1 (see §5.1).

### 2.3 Utility and lead-magnet URLs

| URL | Keywords | Intent | Phase | Priority |
| --- | --- | --- | --- | --- |
| `/website-check` | Website Check kostenlos · Website analysieren lassen · Website prüfen lassen | Transactional (free) | 1 | High |
| `/website-kosten` | Was kostet eine Website · Website Kosten · Website Kostenrechner · Homepage Kosten Unternehmen | Commercial investigation | 1.5 (month 3) | High |
| `/wissen/website-relaunch-checkliste` | Website Relaunch Checkliste · Relaunch Checkliste PDF | Informational, pre-purchase | 1.5 (month 2) | High |

### 2.4 Case-study long tail (industry × solution × place)

These are low-volume queries with near-perfect buyer fit. Case studies rank for them because they are the only pages with genuinely specific content.

| Case study | Long-tail targets | Proof needed |
| --- | --- | --- |
| Power Bowls (Duisburg) | Bestellsystem für Bowl-Restaurant · QR-Code-Tischbestellung Restaurant · Bestell-App für Restaurant mit Abholung und Lieferung · eigenes Bestellsystem statt Lieferportal · Liefergebiete im Bestellsystem verwalten | Order count, share of orders via own system, commission saved (only if the client provides them) |
| Foodigastro24 (Duisburg) | Website für Gastro-Großhändler · B2B-Website Lebensmittellieferant · Anfrageformular für Gastronomie-Lieferant · Website für Frischelieferant Gastronomie | Quote requests per month before/after |
| Rundumdienst (Neuss) | Website für Entrümpelungsfirma · Website für Hausmeisterservice · Local SEO für Gebäudereinigung · Website für Reinigungsfirma Neuss | Rankings for „Entrümpelung Neuss" and similar queries, calls/WhatsApp clicks |

### 2.5 Supporting informational topics (feed service pages only)

| Topic | Feeds | Lead magnet |
| --- | --- | --- |
| Website-Kosten, Baukasten vs. Freelancer vs. Agentur | A, B | Kostenrechner |
| Relaunch checklist, redirects, SEO migration | B | Relaunch-Checkliste |
| Why a website generates no inquiries | A, Schnellcheck | Schnellcheck |
| Own ordering system vs. delivery platform vs. SaaS | C, `/branchen/gastronomie` | Schnellcheck / Erstgespräch |
| Google Business Profile & Local SEO for service businesses | D, `/branchen/handwerk-dienstleister` | Schnellcheck |
| BFSG (accessibility law) and DSGVO for SME websites | A, B | Relaunch-Checkliste |
| AI automation for SMEs (phase 2) | KI page | KI-Potenzial-Check |

### 2.6 Intent map

| Query | Intent | Target URL | Funnel stage |
| --- | --- | --- | --- |
| Reza Alami / dotMind | Navigational | `/` | Convince |
| Webdesign Ratingen | Commercial, local | `/` + GBP | Attract → Convince |
| Website erstellen lassen | Commercial | `/leistungen/website-erstellen-lassen` | Convince |
| Website Relaunch Agentur | Commercial | `/leistungen/website-relaunch` | Convince |
| Website Relaunch Kosten | Commercial investigation | `/leistungen/website-relaunch` (Investition section) | Convince |
| Website Relaunch Checkliste | Informational | `/wissen/website-relaunch-checkliste` | Attract → Capture |
| Was kostet eine Website | Commercial investigation | `/website-kosten` | Attract → Capture |
| Web-App entwickeln lassen | Commercial | `/leistungen/web-app-entwicklung` | Convince |
| Kundenportal entwickeln lassen | Commercial | `/leistungen/web-app-entwicklung` (phase 2: own spoke) | Convince |
| eigenes Bestellsystem entwickeln lassen | Commercial | `/leistungen/web-app-entwicklung` → Power Bowls | Convince |
| Bestellsystem oder Lieferando | Commercial investigation | `/wissen/eigenes-bestellsystem-oder-lieferportal` | Attract |
| QR-Code-Tischbestellung Restaurant | Commercial investigation | `/projekte/power-bowls-bestellsystem` | Convince |
| Website für Restaurant erstellen lassen | Commercial | `/branchen/gastronomie` (phase 2) | Convince |
| Local SEO für Handwerker | Commercial | `/leistungen/seo` (phase 2: `/branchen/handwerk-dienstleister`) | Convince |
| SEO Audit Kosten | Commercial | `/leistungen/seo` | Convince |
| Website Check kostenlos | Transactional | `/website-check` | Capture |
| Website Wartung Kosten | Commercial | `/leistungen/wartung-hosting` | Expand |
| KI Automatisierung KMU | Commercial investigation | phase 2: `/leistungen/ki-automatisierung` | Attract |

---

## 3 · Site architecture & cannibalization rules

### 3.1 Pages per phase

| Phase | URL | Indexed | Primary keyword (owner) |
| --- | --- | --- | --- |
| 1 | `/` | yes | Brand + Webdesign Ratingen |
| 1 | `/leistungen` | yes | none (navigational hub; „Leistungen dotMind") |
| 1 | `/leistungen/website-erstellen-lassen` | yes | Website erstellen lassen |
| 1 | `/leistungen/website-relaunch` | yes | Website Relaunch |
| 1 | `/leistungen/web-app-entwicklung` | yes | Web-App entwickeln lassen |
| 1 | `/leistungen/seo` | yes | SEO für Unternehmen / Local SEO |
| 1 | `/leistungen/wartung-hosting` | yes | Website Wartung |
| 1 | `/projekte` | yes | Referenzen Webdesign (weak, hub only) |
| 1 | `/projekte/power-bowls-bestellsystem` | yes | Bestellsystem Bowl-Restaurant / QR-Tischbestellung |
| 1 | `/projekte/foodigastro24-b2b-website` | yes | B2B-Website Lebensmittellieferant |
| 1 | `/projekte/rundumdienst-website-neuss` | yes | Website für Entrümpelung/Hausmeisterservice |
| 1 | `/ueber` | yes | Reza Alami (person) |
| 1 | `/kontakt` | yes | Kontakt dotMind |
| 1 | `/website-check` | yes | Website Check kostenlos |
| 1 | `/kontakt/danke`, `/website-check/danke` | **noindex** | |
| 1 | `/impressum` | yes | |
| 1 | `/datenschutz` | noindex, follow | |
| 1.5 | `/wissen` + first articles | yes | per article |
| 1.5 | `/website-kosten` | yes | Website Kosten / Kostenrechner |
| 1.5 | `/so-gebaut` („So ist diese Website gebaut") | yes | link asset, no commercial keyword |
| 2 | `/branchen/gastronomie` | yes | Website/Webdesign für Gastronomie |
| 2 | `/branchen/handwerk-dienstleister` | yes | Website für Handwerker & Dienstleister |
| 2 | `/branchen/praxen` | yes, **only after a Praxis project** | Website für Arztpraxis/Zahnarzt |
| 2 | `/leistungen/ki-automatisierung` | yes, after 2 AI case studies | KI-Automatisierung für KMU |
| 2 | `/leistungen/bestellsystem-entwickeln-lassen`, `/leistungen/kundenportal-entwickeln-lassen` | yes, after validation | as named |
| 2 | `/en/…` | yes | English equivalents |
| 3 | `/team`, `/karriere`, `/ar/…`, `/fa/…` | yes | |

**Resolved (October 2026): keyword slugs adopted across all documents.** Background: UX proposed the slugs `/leistungen/conversion-website` and `/leistungen/web-apps`. SEO recommends keyword-bearing slugs instead: `/leistungen/website-erstellen-lassen` (plus a separate `/leistungen/website-relaunch`) and `/leistungen/web-app-entwicklung`. „Conversion-Website" has no search demand. The slug is a minor ranking signal, but it shows up in SERP breadcrumbs and in shared links, and changing it after launch costs a redirect. Nav labels and page H1s can stay as UX designed them („Conversion-Website & Relaunch", „Web-Apps & Portale"). `/leistungen/seo` matches. If the team prefers fewer pages, relaunch can be a section of the Website page at launch, but then the Relaunch cluster has no owner. I recommend the separate page.

### 3.2 Internal link model (hub-and-spoke)

```
                     ┌────────────── / (brand + local hub) ──────────────┐
                     │                                                    │
        /leistungen/* (service hubs) ◄────────► /projekte/* (proof spokes)
             ▲    │                                   ▲     │
             │    ▼                                   │     ▼
        /wissen/* (buyer questions) ──────────► /branchen/* (phase 2: industry hubs)
```

| From | Must link to | Anchor style |
| --- | --- | --- |
| Homepage | All 3 lead services (service blocks), 2–3 case studies, `/website-check`, `/ueber` | Descriptive („Website-Relaunch planen", not „Mehr") |
| Service page | 1–2 matching case studies (embedded), sibling service where relevant (Website ↔ Relaunch ↔ SEO), 1–3 Wissen articles, `/website-kosten` (phase 1.5), `/kontakt?leistung=` | Keyword-relevant, varied |
| Case study | Every service it used (`project.services`), its industry page (phase 2), next case study | „Mehr zur Web-App-Entwicklung" |
| Wissen article | **Exactly one primary service page** (the money page for that cluster), plus the lead magnet and 1–2 related articles | Primary keyword of the service page, used once |
| Industry page | Relevant services + all case studies in that industry + industry Wissen articles | |
| Footer | Services, Projekte, Über, Kontakt, Schnellcheck, legal | Nav labels |

Rules: every indexable page is reachable within 3 clicks of `/`. There are no orphans (CI check: every sitemap URL has at least one internal inbound link). Internal links never carry `nofollow`.

### 3.3 Cannibalization rules

1. **One primary keyword per URL.** The registry in §3.1 is the source of truth. Store `primaryKeyword` in each content file (`services.ts`, `projects.ts`, articles) and fail CI if two URLs share one.
2. **Title/H1 deconfliction:** no two pages share their primary keyword in both `<title>` and H1.
3. **Homepage vs. `/leistungen/website-erstellen-lassen`:** the homepage owns *brand + local* („Webdesign Ratingen"). The service page owns the *non-local* service term („Website erstellen lassen"). The homepage's service block for websites uses the outcome headline and links out with the anchor „Website erstellen lassen". It never puts that phrase in its own title or H1.
4. **Service page vs. `/branchen/gastronomie` (phase 2):** the service page owns the *solution* („Web-App entwickeln lassen", „Bestellsystem entwickeln lassen"). The industry page owns *industry + website* („Website für Restaurant", „Webdesign Gastronomie"). The industry page summarises ordering systems in one section and links to the service page/spoke for depth.
5. **Service page vs. Wissen article:** the article owns the informational modifier (Checkliste, Kosten-Vergleich, „oder"). The service page owns „lassen/Agentur/Anbieter". Example: the Relaunch-Checkliste article must not be titled „Website Relaunch – Ablauf & Agentur".
6. **`/website-kosten` vs. service „Investition" sections:** service pages state their own „ab" price and link to `/website-kosten` for the general question. No Wissen article targets „Was kostet eine Website"; that intent has one URL.
7. **Case studies vs. service pages:** case studies never use the head terms in titles („Web-App entwickeln lassen"). They use the specific long tail (§2.4).
8. **Monthly check (once GSC has data):** GSC export with dimensions page + query, filtered on cluster terms. Flag any query where two URLs both rank in the top 20 with split clicks. Resolve by de-optimising the non-owner and adding a link from it to the owner.

### 3.4 Programmatic city pages: don't

`/webdesign-duisburg`, `/webdesign-neuss` and so on, with templated copy, are **doorway pages** under Google's spam policies. They are widespread among competitors, but a new domain with no authority is exactly where they fail or get demoted. Don't create them.

**A city page becomes legitimate (phase 2+) only when all of these are true:**
- Reza really serves clients there and can meet in person (or there is a real office).
- There is at least one **completed project in that city or region** with a case study (e.g. Neuss via Rundumdienst, Duisburg via Power Bowls/Foodigastro24 *if* Reza actually operates in that area).
- The page has **substantially unique content**: the local projects, local market specifics (e.g. the sectors served there), the travel/meeting setup, and local testimonials.
- It is linked naturally (from the case study and the footer's service area line), not from a 40-link city footer block.

Cap it at 2–3 such pages, ever, unless a real second office exists.

---

## 4 · Homepage SEO

### 4.1 Title tag (≤ 60 characters)

| Option | Use when |
| --- | --- |
| **A (recommended at launch):** `Webdesign & Web-Apps für KMU \| dotMind · Reza Alami` | City not yet decided, or remote-first DACH positioning |
| **B (as soon as the GBP is live; recommended for Ratingen):** `Webdesign in Ratingen: Websites & Web-Apps \| dotMind` | Local SEO is active (§9) |
| C (once „dotMind" has brand searches): `dotMind: Websites, die verkaufen – Webdesign Ratingen` | Studio name has its own brand searches |

Alignment with UX-DIRECTION: the UX idea „Webdesign, Web-Apps & SEO für KMU im DACH-Raum | Reza Alami" runs to about 68 characters and gets truncated in the SERP. Its keyword direction is right. Use option A, or drop „im DACH-Raum" (DACH relevance comes from `.de`, German content and `areaServed`). Keep the brand at the end. Check the final length with the real studio name.

### 4.2 Meta description (≤ 155 characters)

> Websites, die Anfragen bringen, und Web-Apps, die Handarbeit ersetzen – für inhabergeführte Unternehmen. Antwort in 24 Std. Jetzt Erstgespräch vereinbaren.

Local variant: replace „für inhabergeführte Unternehmen" with „für Unternehmen in Ratingen und im DACH-Raum".

### 4.3 H1: decision

Keep the brand line as the visual headline, as UX-DIRECTION decided, **and include a keyword-bearing line inside the same `<h1>`** as a small, visible eyebrow-style first line:

```html
<h1>
  <span class="t-label">Webdesign & Web-Apps für Unternehmen in Ratingen</span>
  <span class="t-display">Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen.</span>
</h1>
```

Why: the brand line carries no search term, and an H1 that only names the brand wastes a relevance signal. Both spans are visible, so this is not hidden text. That is the difference from the current `sr-only` approach in `Hero.tsx:55`, which must go. The decorative eyebrow above the hero (status dot, „Portfolio") is removed or becomes non-heading text. The sub-line names the audience and all three services in plain words: „Für inhabergeführte Unternehmen: Conversion-Websites, Web-Apps wie Bestell- und Buchungssysteme, und SEO, das Sie in Ihrer Region sichtbar macht."

### 4.4 H2 outline mapped to the 12 sections (STRATEGY §05)

| # | Section | H2 (German) | SEO job |
| --- | --- | --- | --- |
| 1 | Hero | (H1 above) | Keyword + brand |
| 2 | Proof strip | none (list with `aria-label`) | Named clients = entity mentions |
| 3 | Problem | „Kommt Ihnen das bekannt vor?" | Problem language, matching query wording („keine Anfragen über die Website") |
| 4 | Leistungen | „Leistungen: Website, Web-App und SEO aus einer Hand"; H3 per service: „Conversion-Website & Relaunch", „Web-Apps & Portale", „SEO & Sichtbarkeit" | Links to the 3 service pages with descriptive anchors |
| 5 | Projekte | „Projekte: Bestellsystem, B2B-Website, Local SEO" (or „Ausgewählte Projekte" + descriptive H3s per case: „Power Bowls: eigenes Bestellsystem in Duisburg") | Long-tail anchors to case studies |
| 6 | Der Unterschied | „Agentur, Freelancer, Baukasten – oder ein Partner, der für das Ergebnis geradesteht" | Commercial-investigation terms |
| 7 | Ablauf | „So läuft Ihr Projekt ab" | Process query match |
| 8 | Founder | „Über Reza Alami" (link to `/ueber`) | Person entity, E-E-A-T |
| 9 | Testimonials | „Was Kunden sagen" (only with real quotes) | Trust; **no Review markup** |
| 10 | Schnellcheck | „Kostenloser Website-Schnellcheck" (link to `/website-check`) | |
| 11 | FAQ | „Häufige Fragen zu Kosten, Ablauf und Datenschutz" | Answer-first blocks (AI search, §11.3) |
| 12 | Final CTA | „Lassen Sie uns über Ihr Projekt sprechen" | |

Visible copy: 900–1,400 words in total. The homepage must explain the offer in text, not just in visuals.

---

## 5 · Service pages

### 5.1 Which exist at launch

| Page | Launch? | Reason |
| --- | --- | --- |
| `/leistungen/website-erstellen-lassen` | **Yes** | Lead service, biggest commercial cluster |
| `/leistungen/website-relaunch` | **Yes** | Distinct SERP and the core audience's situation |
| `/leistungen/web-app-entwicklung` | **Yes** | Highest deal value, Power Bowls proof |
| `/leistungen/seo` | **Yes** | Lead service. The audit (990 €) is the entry product. Proof: Rundumdienst. |
| `/leistungen/wartung-hosting` | **Yes** (lower priority) | Care plan sold at launch. Small but real commercial query set. |
| KI-Integration | **No** standalone page | No case studies yet, and the SERP is crowded with AI agencies. Make it a section on the Web-App page („KI-Integration: Anfragen vorqualifizieren, Assistenten, Automatisierung") and a line in the overview. Own page in phase 2 after 2 AI case studies. |
| Wachstumsbetreuung | **No** | Sold to existing clients. Section on `/leistungen` + mention on the Website pages. |

### 5.2 Template: section by section (aligned with UX-DIRECTION §2.3)

| # | Section (UX) | SEO purpose | Requirement |
| --- | --- | --- | --- |
| 1 | Outcome hero | H1 + first 100 words contain the primary keyword | Eyebrow can carry the service name; the H1 must include the keyword (see 5.4) |
| 2 | Passt / passt nicht | Qualifies, adds unique copy | Real criteria, e.g. budget, decision maker |
| 3 | Problem → Ergebnis | Matches problem-phrased queries | Client language |
| 4 | Leistungsumfang | Secondary keywords as H3s and list items | Concrete deliverables (e.g. „Weiterleitungsplan für alle alten URLs") |
| 5 | Passendes Projekt | **Proof block:** named client, link to case study | Must exist. A service page without a case study is thin. |
| 6 | Ablauf | Process specifics with durations | Real durations only (placeholder until confirmed) |
| 7 | Investition | Answers „Kosten" queries on the page | „ab" price, 3 price drivers, link to `/website-kosten` |
| 8 | FAQ | Long-tail questions, answer-first | 4–6 questions **from real sales calls**, each answer starting with a direct one-sentence answer |
| 9 | Schnellcheck strip | Capture | |
| 10 | Final CTA | | |

**Word count: 1,200–2,000 words of visible copy.** The ranking competitors' service pages (relaunch and web-app agencies) carry substantial copy plus FAQ. Going below about 1,000 words leaves cost, process and objection queries unanswered. Going above about 2,500 turns a landing page into an article and pushes down conversion. Depth comes from specifics, not padding.

**Anti-thin rules:** no sentence that could appear on any agency site („Wir setzen auf Qualität"). Every page needs at least one named project, one number (price floor, duration, or a real metric), one process artefact (e.g. a sample redirect map excerpt or a timeline), and FAQ answers that name trade-offs honestly („Für einen Onepager unter 3.000 € bin ich nicht der richtige Partner").

### 5.3 Per-page metadata

| URL | Title (≤ 60) | H1 | Meta description (≤ 155) |
| --- | --- | --- | --- |
| `/leistungen/website-erstellen-lassen` | `Website erstellen lassen – für mehr Anfragen \| dotMind` | „Website erstellen lassen, die aus Besuchern Anfragen macht" | „Individuelle Firmenwebsite statt Baukasten: Konzept, Design, Entwicklung und SEO-Basis aus einer Hand. Festpreis ab 7.500 €. Code gehört Ihnen." |
| `/leistungen/website-relaunch` | `Website-Relaunch ohne Rankingverlust \| dotMind` | „Website-Relaunch: neu aufbauen, Rankings behalten" | „Relaunch mit Weiterleitungsplan, SEO-Migration und messbarem Ziel: mehr Anfragen. Ablauf, Dauer und Kosten transparent. Jetzt Erstgespräch." |
| `/leistungen/web-app-entwicklung` | `Web-App entwickeln lassen: Portale & Tools \| dotMind` | „Web-App entwickeln lassen: Software, die Handarbeit ersetzt" | „Bestellsysteme, Buchung, Kundenportale und interne Tools – individuell entwickelt, DSGVO-konform, in der EU gehostet. Projekte ab 15.000 €." |
| `/leistungen/seo` | `SEO & Local SEO für Unternehmen \| dotMind` | „SEO & Sichtbarkeit: gefunden werden, wo Ihre Kunden suchen" | „Technisches SEO, Local SEO und Google-Unternehmensprofil – mit Audit ab 990 € und klarem Maßnahmenplan. Für Dienstleister, Gastronomie und KMU." |
| `/leistungen/wartung-hosting` | `Website-Wartung & Hosting ab 149 €/Monat \| dotMind` | „Wartung, Hosting & Sicherheit für Ihre Website" | „Updates, Monitoring, Backups und kleine Änderungen zum festen Monatspreis. EU-Hosting, AV-Vertrag, feste Ansprechperson." |
| `/leistungen` | `Leistungen: Website, Web-App & SEO \| dotMind` | „Leistungen" + sub-line | „Conversion-Websites, Web-Apps und SEO für inhabergeführte Unternehmen – mit Festpreisen ab 7.500 € und klarer Verantwortung." |

All prices are STRATEGY planning anchors. Replace them with confirmed figures before launch. If the prices change, update the titles and descriptions too.

---

## 6 · Case study framework

### 6.1 Structure (aligned with UX-DIRECTION §2.4)

1. Breadcrumb (`Projekte › Power Bowls`)
2. Eyebrow: Branche · Stadt · Jahr
3. **H1: outcome + solution + client**
4. Results band (only real numbers, see 6.4)
5. Fact sheet: Kunde (linked), Branche, Ort, Leistungen (linked to service pages), Zeitraum, Rolle/Team credits
6. H2 „Ausgangslage", H2 „Ansatz", H2 „Umsetzung" (features as H3s/list), H2 „Ergebnis"
7. Client quote (real, named; no Review markup)
8. H2 „Technik" (short; this is where Next.js/React details belong)
9. Links: live site, related service(s), industry page (phase 2), next case study
10. Final CTA: „Ähnliches Projekt? Erstgespräch vereinbaren"

Length: 800–1,500 words. The feature lists in `projects.ts` are a good factual base but need the narrative (Ausgangslage/Ansatz/Ergebnis), which is currently `null`.

### 6.2 Title/H1 pattern

- **Title:** `[Lösung] für [Branche] in [Ort]: [Kunde] \| dotMind`
- **H1:** `[Kunde]: [Lösung als Ergebnis]`

| Slug | Title | H1 |
| --- | --- | --- |
| `/projekte/power-bowls-bestellsystem` | `Bestellsystem für Bowl-Restaurant in Duisburg \| dotMind` | „Power Bowls: eigenes Bestellsystem für Tisch, Abholung und Lieferung" |
| `/projekte/foodigastro24-b2b-website` | `B2B-Website für Gastro-Lieferanten: Foodigastro24 \| dotMind` | „Foodigastro24: B2B-Website, die Angebotsanfragen von Gastronomen sammelt" |
| `/projekte/rundumdienst-website-neuss` | `Local-SEO-Website für Dienstleister in Neuss \| dotMind` | „Rundumdienst: Website für Entrümpelung und Hausmeisterservice, gebaut für lokale Anfragen" |

Check every claim in an H1 against facts. „sammelt Angebotsanfragen" is supported by the quote form described in `projects.ts:128`. Claims of *more* inquiries need numbers.

### 6.3 Long-tail optimization

- Use the §2.4 long tail in H2/H3s and in alt text, phrased naturally („Tischbestellung per QR-Code").
- Name the place where the client operates. That creates relevant local co-occurrence without a city page.
- Add a short „Für wen eignet sich diese Lösung?" paragraph that generalises the case to similar businesses (bowl bars, Imbisse, Lieferdienste). This is what ranks for industry × solution queries.

### 6.4 Missing metrics, handled honestly

- Show only metrics the client confirms in writing, with timeframe and measurement source („laut Shop-Statistik, März–August 2026").
- Without metrics, the results band shows **verifiable deliverables** instead: „3 Bestellarten live", „Admin-Backoffice für Menü, Tische, Team", „Selbst gehostete Schriften". These come from `projects.ts`.
- Mark pending results as a designed state, per UX-DIRECTION §04.5 („Ergebnisse werden nach 6 Monaten Betrieb ergänzt"), and set a `dateModified` when they are added.
- Never put a Lighthouse score for a client site in the results band unless it was measured on the date stated.
- Power Bowls: until rendered-HTML SEO is verified (§0), make no SEO or ranking claims.

### 6.5 Schema per case study

`Article` (headline = H1, `author` → Person `@id`, `publisher` → studio `@id`, `datePublished`, `dateModified`, `image`) with `about` → the client `Organization` (`name`, `url`, `address.addressLocality`) and `mentions` → the `Service` entities used. Plus `BreadcrumbList`. Replace the current `CreativeWork` (`src/app/projects/[slug]/page.tsx:51–63`); the `technologies` → `keywords` field can go.

---

## 7 · Technical SEO

### 7.1 Performance and Core Web Vitals

| Metric | Budget (STRATEGY §10) | Main risks in the current code |
| --- | --- | --- |
| LCP | < 2.0 s mobile (field p75) | Hero canvas (`HeroField`) and multiple ambient blur layers. UX-DIRECTION already removes them. Keep the hero H1 as server-rendered text. |
| INP | < 200 ms | `CustomCursor`, magnetic buttons, Framer-style providers on every page. Removing them is in UX-DIRECTION. Also lazy-load the booking embed on click (two-click). |
| CLS | < 0.05 | Fonts: keep `display: swap` with metric-matched fallback (`next/font` adjusts it). Reserve dimensions for screenshots (`projects.ts` already carries width/height). |

- **Field data first:** monitor CrUX via PageSpeed Insights/GSC once traffic allows. Until then, run lab Lighthouse in CI on `/`, one service page and one case study.
- The page transition in `template.tsx` must not delay content paint (UX: opacity only, 200 ms).
- Third parties: none before interaction. Analytics must be cookieless and small (Plausible/Matomo).

### 7.2 Crawlability

- Every indexable page is **server-rendered HTML with its full copy** (no client-only content, no content behind tabs that load on click). FAQ accordions use `<details>` or render their content in the HTML.
- Real `<a href>` links for all navigation, including case-study cards (no `onClick` routing).
- Reveal animations may start at `opacity: 0`, but the text must be in the HTML (it is today). The `<noscript>` override in `layout.tsx:57–59` stays.
- No query-parameter filters on `/projekte`. With fewer than 10 projects, filtering adds nothing. If added later, filter client-side without URL changes, or use `?branche=` with `noindex` + a canonical to `/projekte`.

### 7.3 Indexing rules

| URL type | Directive | In sitemap |
| --- | --- | --- |
| Home, services, case studies, `/ueber`, `/kontakt`, `/website-check`, `/website-kosten`, Wissen, Branchen | index, follow | yes |
| `/kontakt/danke`, `/website-check/danke`, any form confirmation | **noindex** (meta robots) | no |
| `/impressum` | index, follow (entity/NAP verification, legally required to be reachable) | no |
| `/datenschutz` | **noindex, follow**. *Disagreement with UX-DIRECTION §2.1, which marks it indexed:* it has no search value and is long boilerplate. Low stakes either way. | no |
| 404 | `noindex` + real 404 status (already) | no |
| Preview/staging deployments | `X-Robots-Tag: noindex` header **plus** password protection | no |
| API routes, server-action endpoints | `Disallow` in robots.txt | no |
| Locale pages without a real translation | **do not exist** (404), see §8.5 | no |

Never `noindex` a page that is also `Disallow`ed in robots.txt: Google can't see the `noindex` if it can't crawl the page.

### 7.4 Metadata system

One `buildMetadata({ path, title, description, locale, ogImage?, noindex? })` helper used by every route. It:
- sets a self-referencing canonical from `path` (no default canonical in the root layout, see §0 #5),
- builds the **complete** `openGraph` object every time (`type`, `url`, `title`, `description`, `siteName`, `locale: de_DE`, `images`) and `twitter`,
- adds `alternates.languages` only for locales where the page exists (§8),
- uses the title template `%s | dotMind` (UX uses „—"; either works, just keep it consistent).

| Page type | Title pattern | Description pattern |
| --- | --- | --- |
| Service | `[Primärkeyword] – [Nutzen] \| dotMind` | Deliverables + „ab" price + trust signal |
| Case study | `[Lösung] für [Branche] in [Ort] \| dotMind` | Client, problem, what was built, result if available |
| Wissen | `[Frage/Thema]: [konkretes Versprechen] (2026)` (year only when content is time-sensitive, e.g. costs) | Direct answer in sentence one |
| Branche | `Website für [Branche]: [Lösungen] \| dotMind` | Industry problems + named case |
| Utility | `Kostenloser Website-Schnellcheck \| dotMind` | What you get, by when |

### 7.5 Structured data: entity model

**Decision: `ProfessionalService` as the site-wide business entity (a LocalBusiness subtype), with `founder` → `Person`.** This matches UX-DIRECTION §1.3. Why not plain `Organization`: local relevance and GBP matching benefit from a LocalBusiness subtype. Why not generic `LocalBusiness`: `ProfessionalService` is more precise.

| Type | Where | Key properties |
| --- | --- | --- |
| `ProfessionalService` (`@id: https://domain/#organization`) | Homepage (full), referenced by `@id` everywhere else | `name` (dotMind; phase 1 can be „dotMind by Reza Alami"), `url`, `logo`, `image`, `description` (DE), `founder` → Person `@id`, `address` = **exactly the Impressum address** (see §9.2), `areaServed` (Ratingen region as `City`/`AdministrativeArea` + `Country` DE, AT, CH), `telephone`, `email`, `priceRange` („ab 7.500 €" or „€€€"), `sameAs` (GBP URL, LinkedIn company, Clutch etc. once they exist), `knowsAbout` (Webdesign, Webentwicklung, Web-Apps, SEO; **no smart home**) |
| `Person` (`@id: https://domain/ueber#reza-alami`) | `/ueber` (full, as `ProfilePage.mainEntity`), referenced elsewhere | `name`, `jobTitle` (`["Software Engineer", "AI Specialist", "Web & App Developer", "Digital Marketer"]`, the approved titles), `worksFor` → org `@id`, `image`, `sameAs` (LinkedIn, GitHub, only real URLs; `site.socials` is `null` today), `knowsAbout`, `alumniOf` only if Reza confirms details |
| `WebSite` | Homepage | `name`, `url`, `inLanguage: "de"`, `publisher` → org. **No `SearchAction`**: the sitelinks search box was retired by Google. |
| `Service` | Each service page | `serviceType`, `name`, `description`, `provider` → org `@id`, `areaServed`, `offers` → `Offer` with `priceSpecification` (`minPrice`, `priceCurrency: EUR`). No rich result, but it gives entity clarity for search and AI systems. |
| `BreadcrumbList` | All pages except home | Matches the visible breadcrumb |
| `Article` | Case studies (§6.5), Wissen articles | `author` → Person, `publisher` → org, dates |
| `FAQPage` | Homepage + service FAQ | **Google stopped showing FAQ rich results in May 2026** (finishing the 2023 restriction to government/health sites). The markup is harmless and still parsed, and other engines and AI systems may use it. Treat it as P2, never as a reason to write FAQs. The visible, answer-first FAQ text is what matters. |
| Review / AggregateRating | **Never** on the studio's own pages | Self-serving reviews for your own business aren't eligible and break guidelines. Show testimonials as plain text. Google reviews live on GBP. |

Remove the current `Person`-as-homepage-entity (`src/app/page.tsx:16–35`) and the English `jobTitle`. All JSON-LD in German, single source of truth in one `schema.ts` module that reads `site.ts`, null-safe (skip properties that are `null`, never output placeholders).

### 7.6 Image SEO

- **Filenames:** descriptive German, hyphenated: `/projekte/power-bowls/bestellseite-mobil.avif`, not `mobile.jpg`. P2 for existing assets (`public/projects/*`), required for new ones. Filenames are a weak signal. Alt text matters far more.
- **Alt text (German, describes what's visible, written per image after looking at it):** e.g. „Bestellseite von Power Bowls auf dem Smartphone mit Auswahl zwischen Tischbestellung, Abholung und Lieferung". Replace the generated English pattern in `projects.ts:74–78` with per-image `alt` fields. Decorative images get `alt=""`.
- **Formats:** AVIF/WebP via the image pipeline (already configured in `next.config.ts`). Serve full-page screenshots (`fullPage`, up to 9003 px tall) lazily, never above the fold.
- **OG images:** one per page, generated in German (§0 #13). Template: page H1 + dotMind + „by Reza Alami". Per locale in phase 2. Arabic/Persian OG needs the script fonts loaded into the image renderer plus RTL layout (`src/lib/og.tsx` currently uses a generic sans-serif).
- **Founder portrait:** real photo, `alt="Reza Alami, Gründer von dotMind"`, used in `Person.image`.

### 7.7 Internal linking rules (technical)

- Breadcrumbs on all non-home pages (visible + schema).
- „Verwandte Leistungen" and „Passendes Projekt" are data-driven: `project.services[]` ↔ `service.slug`, `project.industry` ↔ `/branchen/[industry]`. Links come from content relations, not hand-maintained lists.
- Max one link per target per section. No sitewide keyword-anchor footers.

### 7.8 Redirects from current English routes

Permanent redirects (308 via the framework's `permanent: true` redirect config is equivalent to a 301 for Google). No chains: each old URL goes straight to its final URL.

| From | To |
| --- | --- |
| `/projects` | `/projekte` |
| `/projects/powerbowls` | `/projekte/power-bowls-bestellsystem` |
| `/projects/foodigastro24` | `/projekte/foodigastro24-b2b-website` |
| `/projects/rundumdienst` | `/projekte/rundumdienst-website-neuss` |
| `/projects/:slug` (fallback) | `/projekte` |
| `/about` | `/ueber` |
| `/contact` | `/kontakt` |
| `/de/:path*` | `/:path*` (per UX-DIRECTION §8.1 proxy rule) |
| `http://`, `www`/non-`www` variant | the one canonical host (`https://`, pick www or apex once) |
| personal domain (if any) | `https://dotmind.de/ueber` |

Keep redirects for at least 12 months. Since the site may never have been indexed under the English routes, the cost is near zero. If the project slugs change, update the old `projects.ts` slugs in a `legacySlugs` field so the redirect map is generated, not hand-written.

### 7.9 Sitemap, robots, webmaster tools

- **Sitemap:** generated from the route registry. Only canonical, indexable, 200-status URLs. `lastModified` = real content change date (from content files), not build time. `alternates.languages` per URL once `/en` exists. Drop `priority`/`changeFrequency` (Google ignores them; harmless if kept). Split into a sitemap index if more than ~1,000 URLs (not foreseeable).
- **robots.txt:** `Allow: /`; `Disallow: /api/`; sitemap line. AI-crawler policy in §11.3. No `Disallow` for thank-you pages (they use `noindex`).
- **Google Search Console:** a **Domain property** (DNS TXT), so http/https/www/subdomains are covered. Submit the sitemap. Check URL Inspection for `/`, one service page and one case study at launch. Set up email alerts. Watch the Page indexing report weekly in the first 8 weeks.
- **Bing Webmaster Tools:** import from GSC (one click). Submit the sitemap. Bing data also feeds ChatGPT search and Copilot visibility. Optional IndexNow ping on deploy (P2).
- **GBP ↔ website:** the GBP website link points to `/` (with a `?utm_source=gbp` parameter if the analytics tool tracks it; the canonical handles the duplicate).

---

## 8 · Multilingual SEO

### 8.1 URL structure (aligned with UX-DIRECTION §8.1)

- **German at the root, unprefixed** (`/leistungen/seo`), with other locales in **subfolders** (`/en/`, `/ar/`, `/fa/`) **on one domain**. Why: German is the market and should get the shortest URLs and all of the authority. Subfolders pool link equity on one domain, which matters because a new studio has very little. ccTLDs (`.at`, `.ch`) or subdomains would split authority and multiply GBP/maintenance work for no gain. AT and CH users are served by the same German pages.
- `/de/...` 308-redirects to the unprefixed path (no duplicate URLs). Implementation: rewrite in `proxy.ts`, per UX-DIRECTION. The developer must verify this against `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.
- **Never redirect by `Accept-Language` or IP.** The Next.js i18n guide's example *does* redirect by `Accept-Language`. Do not copy that for the root: Googlebot crawls mostly from the US without German language headers and must always receive the German page at `/`. Agreed with UX-DIRECTION §8.1. A dismissible language hint is fine.

### 8.2 Localized slugs

| Locale | Slugs | Example |
| --- | --- | --- |
| `de` | German | `/leistungen/web-app-entwicklung`, `/projekte/power-bowls-bestellsystem`, `/ueber` |
| `en` | English | `/en/services/web-app-development`, `/en/work/power-bowls-ordering-system`, `/en/about`, `/en/imprint` |
| `ar`, `fa` | **English slugs** (agreed with UX-DIRECTION §8.1) | `/ar/services/web-app-development` |

Non-Latin slugs are valid for Google, but they percent-encode into unreadable shared links, and keyword-in-slug value is minimal. Titles, H1s and content carry the language. One `pathnames` map serves the proxy, the link helper, hreflang and the sitemap.

### 8.3 hreflang

- **Codes:** `de` (language-only, **not** `de-DE`/`de-AT`/`de-CH`), `en`, `ar`, `fa`, plus `x-default`. There is one German version for all of DACH, and region codes would only make sense with differing content (e.g. CHF prices, different legal pages). If CH demand later justifies CHF pricing, add `de-CH` then, along with real differences.
- **x-default:** while only German exists, there's no hreflang at all (a single language needs none). Once `/en` exists, **x-default points to the English version of each page pair.** *Resolved (October 2026), adopted across all documents:* x-default only serves users whose language matches none of the listed ones (e.g. Italian or Polish speakers), and they are far more likely to read English than German. German speakers anywhere already get `de`. For pages without an English version, x-default isn't emitted (the page has no hreflang set).
- **Reciprocity:** every page in a set lists all members including itself. Generated from one translation registry, never written by hand. Add a CI test that, for every URL with alternates, each alternate lists it back.
- **Where:** HTML `<link rel="alternate">` via page metadata. Also adding them to the sitemap is optional, and you should pick one method as the source of truth to avoid conflicts. Recommendation: HTML head, plus sitemap alternates generated from the same registry.
- `og:locale`: `de_DE`, `en_GB` (or `en_US`; decide once), `ar`, `fa_IR`, with `og:locale:alternate` for existing translations only.

### 8.4 Canonicals

Every locale page has a **self-referencing canonical**. Never point `/en/...` canonical at the German page (that tells Google to drop the English page and breaks hreflang). Canonical and hreflang URLs must be identical absolute URLs (same protocol, host and trailing-slash convention).

### 8.5 Launching a locale

- Launch `/en` only when the **money pages** exist in genuinely localized English: home, `/en/services/*`, the 3 case studies, about, contact, imprint/privacy. Wissen articles can follow selectively.
- Machine translation is a draft, not a publication. A native or fluent reviewer adapts claims, prices (EUR, net/gross, whether an English-speaking client is likely a business), CTAs and examples. Unedited machine output at scale is treated as low-value content.
- **Untranslated pages:** don't create the locale URL at all (404, no fallback to German content under `/en/`, no hreflang to it). The language switcher links to that locale's home with a note (UX-DIRECTION §8.2).
- **`ar`/`fa` (phase 3):** the audience is diaspora businesses in DACH, who often search in German anyway. These locales are about conversion and trust first, with small search volume. Launch only with a native-speaker reviewer and at least one case study or testimonial relevant to that audience.

### 8.6 RTL-specific SEO notes

- `<html lang="ar" dir="rtl">` / `lang="fa"` per locale layout. Persian is `fa`, not `ar`.
- Latin brand and tech terms inside RTL text are wrapped in `<bdi>` (UX §8.3). This is a display issue, not a ranking issue, but broken titles hurt CTR.
- Titles and meta descriptions in Arabic script take more pixels per character in the SERP. Keep titles ≤ 50 characters.
- Use the correct numerals per locale in content (UX §8.6) but Western digits in prices inside structured data (`"minPrice": 7500`).
- Self-host Vazirmatn / IBM Plex Sans Arabic, loaded only on RTL routes (no CWV cost for `de`).

### 8.7 Maintenance process

1. Every content entry carries `translations: { en?: { slug, status: "published" | "draft" }, … }`. Only `published` emits a URL, sitemap entry and hreflang.
2. When German content changes materially (prices, services, claims), a CI warning lists stale translations (compare `dateModified`).
3. Quarterly: crawl with a tool that validates hreflang (Screaming Frog/Sitebulb), and check the GSC page indexing report per locale folder.

---

## 9 · Local & credibility SEO

### 9.1 Do local SEO: yes, as a hybrid

**Recommendation:** combine **city-level local SEO for Ratingen** (GBP, homepage, reviews, citations) with **DACH-wide topical SEO** (service pages, case studies, Wissen). Local is the fastest path to the first organic inquiries, because the local pack for „Webdesign Ratingen" is winnable with a well-kept GBP and reviews, while national head terms take a year or more. Remote work stays the default promise („Projekte im ganzen DACH-Raum, Termine remote oder vor Ort in Ratingen und Umgebung").

**Decided (October 2026): base = Ratingen** (Am Kämpchen 8, 40885 Ratingen), directly next to Düsseldorf. Ratingen (about 90,000 inhabitants) fits the „small town next to a big city" case: the homepage targets „Webdesign Ratingen" (winnable), the Google Business Profile sets a service area of Ratingen, Düsseldorf, Neuss, Duisburg, Mülheim an der Ruhr, Essen and Mettmann, and the rest of the site stays DACH-wide. Two client projects already sit inside that radius (Power Bowls and Foodigastro24 in Duisburg, Rundumdienst in Neuss), so legitimate city pages for Düsseldorf, Duisburg or Neuss (§3.4) become possible in phase 2. „Webdesign Düsseldorf" is highly competitive: reach it through the GBP service area first, not through a thin city page. Switch the homepage title to option B as soon as the Google Business Profile is live.

How the plan would adapt in other cases (kept for reference):
- **City with real demand (e.g. a large city or a Rhein-Ruhr location):** homepage title option B, GBP service area across the city and neighbouring cities, and later 1–2 legitimate city pages (§3.4).
- **Small town / rural:** GBP with the service area set to the surrounding district plus the nearest large city (within the roughly 2-hour-drive limit). The homepage stays DACH-wide (title option A). Local SEO is a supporting channel, not the main one.
- **Fully remote, no local market:** GBP still created (branded search, reviews, Maps presence), and the homepage stays DACH-wide.

The client cities Duisburg and Neuss are about 20–25 km from Ratingen, so they are genuinely in reach and may appear in the GBP service area.

### 9.2 Google Business Profile

- **Primary category:** „Webdesigner" (Website designer). **Secondary:** „Internetmarketing-Service", „Softwareentwickler"/„Softwareunternehmen", „Marketingagentur", whichever the German GBP UI offers. Category names are localized and change, so confirm them in the UI. Fewer, more accurate categories beat many.
- **Service-area business, address hidden**, if Reza works from home and doesn't receive clients there. Google's guidelines require hiding an address that customers don't visit, and showing a home address is a common suspension cause. Set up to ~20 service areas (cities/districts), within reasonable reach.
- **No virtual office or c/o address for GBP verification.** It is ineligible unless staffed. Verify at the real address (hidden).
- **Interaction with the Impressum (§ 5 DDG):** the Impressum legally needs a **ladungsfähige Anschrift** (street, number, postcode, city; a P.O. box isn't enough). Options: (a) the home address, which is legal but public, or (b) a **c/o business address with Zustellvollmacht** for privacy, which satisfies § 5 DDG. Either way, **schema `address` and every citation must use the same address as the Impressum**, and GBP keeps its address hidden. NAP consistency then effectively means **Name + Telefon + Stadt + Website** everywhere, and the full street address only where it's already public (Impressum-identical). Legal check by Reza or an advisor, not SEO.
- **Profile content:** a German description (750 characters, offer + audience + area, no keyword lists), services with „ab" prices, photos (founder, work setting, project screenshots), opening hours = reachable hours, booking link → `/kontakt`. Monthly posts that summarise a new case study or article. Q&A seeded with real FAQ answers.
- **Business name** = the real name as used on the site and in the Impressum. No keywords appended („dotMind – Webdesign Ratingen" violates the guidelines).

### 9.3 Citations (legitimate ones only)

| Priority | Directory | Why |
| --- | --- | --- |
| P0 | Google Business Profile, Bing Places, Apple Business Connect | Maps on all major platforms |
| P1 | Gelbe Seiten, Das Örtliche, 11880.com | German consumer/business directories, often used as data sources |
| P1 | LinkedIn company page, GitHub org/profile | Entity `sameAs`, E-E-A-T |
| P1 | IHK-Firmenverzeichnis / IHK member services (if registered as a Gewerbe) | Authoritative local entity |
| P2 | Clutch (verified client reviews), Sortlist, Wer liefert was (B2B) | Agency-buyer directories with editorial verification |
| P2 | Local Wirtschaftsförderung / Gründerzentrum listings, regional business associations | Local relevance links |
| Skip | Mass citation services, pay-to-rank „Top 10 Agenturen" lists, unmoderated directories | Low value or link-scheme risk |

The same exact name, phone, website and (where shown) address everywhere. Keep a citation sheet with logins.

### 9.4 Reviews

1. Ask after every launch and again at day 30 (STRATEGY §08), via a direct GBP review link in a personal email, never incentivised.
2. Ask the three existing clients first. Five real reviews is the phase-1 target.
3. Reply to every review in German within 48 h, mentioning the project type naturally.
4. Never review-gate (asking only happy clients via a filter), never buy reviews, never write them for clients. Under German UWG rules, undisclosed incentivised reviews are also misleading commercial practice.
5. Mirror selected reviews on the site as **text testimonials with permission**, without Review schema.

### 9.5 E-E-A-T signals

- `/ueber`: real photo, background (software engineering degree, about one year of professional training in Germany, Meta-scholarship marketing training, per `profile.ts:136–173`; add dates once confirmed), how he works, what he refuses to do. Person schema with `sameAs`.
- Author byline on every Wissen article → `/ueber`, with a short bio and „zuletzt aktualisiert" date.
- Case studies with **named clients, live links, credits** (collaborators by name, STRATEGY §06).
- „So ist diese Website gebaut" (`/so-gebaut`): the stack, CWV/Lighthouse measured on a date, privacy setup. This is premium proof and a natural link target for developers and journalists.
- Off-site: an active LinkedIn with case-study posts, GitHub (only if the repos are presentable), guest articles or talks (local IHK/Gründer events, Gastro or Handwerk trade media).

### 9.6 Links and digital PR that fit

- **Client credits:** one branded credit per client site, with the client's consent, best placed in the **client's Impressum** („Website: dotMind"), linking to the matching case study. A followed link here is fine: it's a single, editorially plausible link. If a sitewide footer credit is also wanted, use a branded anchor and `rel="nofollow"`. Google's spam policies name „widely distributed links in the footers or templates of various sites" as link spam. Never use keyword anchors („Webdesign Duisburg") in credits.
- **Partner links:** tax advisors, photographers, copywriters and hosting partners who refer clients (STRATEGY §08). Mutual „Netzwerk" mentions are fine when the partnerships are real and few. No link exchanges at scale.
- **Local institutions:** IHK, Handwerkskammer events, Gründernetzwerke, Wirtschaftsförderung, local business associations (member directory links, event speaker pages).
- **Linkable assets:** the Website-Kostenrechner (`/website-kosten`), the Relaunch-Checkliste, and `/so-gebaut`. Pitch them to regional business media and industry newsletters (Gastro, Handwerk).
- **Data PR (phase 2):** e.g. „Wie schnell sind die Websites von [Branche] in Düsseldorf und Umgebung?", a CWV analysis of public sites for one industry, published with method. Only if executed rigorously.
- **Avoid:** paid links, PBNs, guest-post farms, „Agentur-Rankings" that charge for placement.

---

## 10 · Content roadmap

Authority compounds in this order: **case studies (proof) → service pages (conversion) → Wissen (reach) linking back to services → industry pages once the proof clusters exist.** Each Wissen article links to exactly one service page and one lead magnet.

### 10.1 Months 1–6

| Month | Publish | Cluster / purpose | Lead magnet |
| --- | --- | --- | --- |
| 1 (launch) | Home, `/leistungen` + 5 service pages, 3 case studies (with Ausgangslage/Ansatz/Ergebnis filled in), `/ueber`, `/kontakt`, `/website-check`, legal | Foundation. GSC, Bing, GBP live. | Schnellcheck |
| 2 | **„Website-Relaunch-Checkliste: 30 Punkte vor dem Go-live (mit PDF)"** · `/so-gebaut` · first citations + review requests | Relaunch (B) | Relaunch-Checkliste |
| 3 | **`/website-kosten`: „Was kostet eine Website? Kostenrechner & ehrliche Preise für KMU"** (tool + answer-first explainer on one URL) | Website (A) | Kostenrechner |
| 4 | **„Eigenes Bestellsystem oder Lieferportal? Provision, Kosten und Kontrolle im Vergleich"** · case-study metric updates if available | Web-App (C) | Erstgespräch |
| 5 | **„Warum Ihre Website keine Anfragen bringt: 12 Ursachen und wie Sie sie prüfen"** · **„Barrierefreiheitsstärkungsgesetz (BFSG): Was gilt für Ihre Unternehmenswebsite?"** (legal facts checked, no legal advice) | Website (A), Relaunch (B) | Schnellcheck, Relaunch-Checkliste |
| 6 | **„Google-Unternehmensprofil für Dienstleister: Die Einrichtung, die Anfragen bringt"** · `/branchen/gastronomie` (2 case studies exist) | SEO (D), Gastronomie | Schnellcheck |

STRATEGY schedules Wissen for phase 2. This plan pulls about 5 articles into months 2–6 because organic results lag 3–6 months. Content written in month 2 starts paying off when phase 2 begins. If capacity is short, protect case studies and service pages first and delay articles.

### 10.2 Then quarterly

| Quarter | Publish |
| --- | --- |
| Q3 (months 7–9) | `/en` money pages (phase 2 trigger) · `/branchen/handwerk-dienstleister` · „Website-Relaunch ohne Rankingverlust: Weiterleitungen richtig planen" · „QR-Code-Tischbestellung im Restaurant: Ablauf, Kosten, Fallstricke" |
| Q4 (months 10–12) | „Baukasten, Freelancer oder Agentur? Die ehrliche Entscheidungshilfe für KMU" · „WordPress oder individuelle Entwicklung: Was 2027 für KMU-Websites sinnvoll ist" · `/leistungen/kundenportal-entwickeln-lassen` (if validated + proof) · 1 new case study |
| Months 13–18 | `/leistungen/ki-automatisierung` + „KI im Kundenservice: 5 Automatisierungen, die sich für KMU rechnen" (only with 2 AI case studies; KI-Potenzial-Check) · `/branchen/praxen` (only after a Praxis project) · data-PR piece |
| Phase 3 | `/ar`, `/fa` money pages · `/team`, `/karriere` · resource hub |

Cadence: one in-depth article per month at most, plus one case study per quarter. Two strong pieces beat eight average ones. Refresh cost and legal articles every 12 months (`dateModified` + visible „Stand: [Monat Jahr]").

### 10.3 Delay or never do

- **Delay:** KI page, Praxen page, city pages, Next.js landing page, English Wissen translations.
- **Never:** developer tutorials, generic „SEO-Tipps" listicles, AI-generated bulk articles, news-jacking posts. They attract the wrong audience and dilute topical focus.

---

## 11 · Handoff checklists

Priority: **P0** = before launch / blocks launch, **P1** = within phase 1, **P2** = later or optional.

### 11.1 Frontend Developer

| Pri | Phase | Task |
| --- | --- | --- |
| P0 | 1 | `lang="de"`, `og:locale de_DE`. Locale layout per UX-DIRECTION §8.1 (verify `proxy.ts` and root params in `node_modules/next/dist/docs/`). |
| P0 | 1 | Remove `alternates.canonical: "/"` from the root layout. Add a `buildMetadata()` helper with a required path, a full OG object and self-canonical (§7.4). |
| P0 | 1 | Fail the production build if `NEXT_PUBLIC_SITE_URL` is unset or not `https://` |
| P0 | 1 | Routes and slugs per §3.1 (keyword slugs, not `/conversion-website`). 308 redirects per §7.8 generated from `legacySlugs`. |
| P0 | 1 | Hero H1 = keyword line + brand line, both visible. Remove the `sr-only` H1 text (`Hero.tsx:55`). |
| P0 | 1 | `noindex` on `/kontakt/danke`, `/website-check/danke`, `/datenschutz`. `X-Robots-Tag: noindex` on preview deployments. |
| P0 | 1 | Sitemap from the route registry: indexable canonical URLs only, real `lastModified` |
| P0 | 1 | JSON-LD module: `ProfessionalService` + `Person` + `WebSite` + `Service` + `BreadcrumbList` + `Article` (§7.5). Null-safe, no smart home, no Review markup. |
| P0 | 1 | All copy server-rendered. Real `<a href>` links. FAQ content in the HTML. |
| P1 | 1 | Per-image German alt fields in `projects.ts`. German per-page OG images and alts. |
| P1 | 1 | Content model fields: `primaryKeyword`, `services[]`, `industry`, `results[]`, `translations`, `dateModified`. CI check for duplicate primary keywords and orphan pages. |
| P1 | 1 | Performance budget in CI (LCP < 2.0 s, CLS < 0.05, INP proxy via TBT). Booking embed two-click. |
| P1 | 1 | Breadcrumb component (visible + schema) |
| P1 | 1.5 | `/website-kosten` calculator: server-rendered explainer, the tool as progressive enhancement, result → booking CTA |
| P2 | 1 | `FAQPage` markup (no Google rich result since May 2026, harmless) |
| P2 | 1 | Rename screenshot files to German descriptive names. IndexNow ping on deploy. |
| P1 | 2 | hreflang from the translation registry (`de`, `en`, x-default → `en` for pairs). Reciprocity CI test. Sitemap alternates. |
| P1 | 3 | RTL locale layouts, OG renderer with Arabic/Persian fonts |

### 11.2 Content Strategist

| Pri | Phase | Task |
| --- | --- | --- |
| P0 | 1 | Validate all §2 keywords in Sistrix/Ahrefs/Keyword Planner (DE/AT/CH volume, KD, CPC, spelling variants). Adjust slugs **before** launch. |
| P0 | 1 | Confirm the Impressum address option (Ratingen address given), and the „ab" prices. Then finalise the titles and descriptions in §4–5. |
| P0 | 1 | Write the 5 service pages per the §5.2 template (1,200–2,000 words, real FAQ from sales calls, named proof) |
| P0 | 1 | Complete the 3 case studies: Ausgangslage, Ansatz, Ergebnis, role, client quote, confirmed metrics. Clarify the Power Bowls/Foodigastro24 relationship. |
| P0 | 1 | German homepage copy per the §4 H2 outline. `/ueber` founder story with dates. |
| P1 | 1 | Set up GBP (§9.2), citations P0/P1 (§9.3), review requests to 3 clients |
| P1 | 1 | Client credit links in the client Impressums (§9.6) |
| P1 | 1.5 | Months 2–6 roadmap (§10.1): Relaunch-Checkliste + PDF, Kostenrechner copy, 3 articles, `/so-gebaut` |
| P1 | 1.5 | Monthly GSC cannibalization check (page × query) once data exists |
| P2 | 2 | Industry pages, English localization brief with native reviewer, data-PR piece |

### 11.3 Future AEO / AI-search specialist

| Pri | Phase | Task |
| --- | --- | --- |
| P0 | 1 | **Crawler policy: allow all major AI crawlers**, both search/answer bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot) and training bots (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended). Why: this is a marketing site with nothing proprietary to protect. Being known to models as „dotMind, Reza Alami, Websites/Web-Apps für KMU im DACH-Raum" is a benefit, and blocking training bots costs future brand recall. Note: `Google-Extended` does not affect Google Search or AI Overviews. Revisit if gated or paid content appears (Wissen PDFs stay behind email anyway). |
| P0 | 1 | **Entity consistency:** identical studio name, founder name, descriptor („Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen"), city, and service names across the site, schema, GBP, LinkedIn, directories. One `@id` graph. |
| P1 | 1 | **Answer-first blocks:** every FAQ answer and every Wissen H2 opens with a 1–2 sentence direct answer, then detail. Price questions answered with the real „ab" numbers. |
| P1 | 1 | **Citation-worthy facts** on one page each: prices (ab), process durations, what's included, hosting location, ownership terms. Put them in plain HTML tables with a „Stand" date. AI systems quote explicit, dated facts. |
| P1 | 1.5 | Track AI referrals (chatgpt.com, perplexity.ai, claude.ai, copilot) as a source segment in analytics. Monitor brand answers manually each quarter with a fixed prompt set („Wer entwickelt Bestellsysteme für Restaurants in Ratingen?"). |
| P1 | 1 | **llms.txt:** generated and shipped at launch (AEO-FOUNDATIONS §3; decided October 2026). There's no confirmed effect on Google, and it must mirror the site exactly. |
| P2 | 2 | Structured data kept complete (`Service` offers, `Person` sameAs, `Article` dates). Bing Webmaster health (feeds Copilot/ChatGPT search). |
| P2 | 2 | Earn third-party mentions (directories with reviews, local media, partner sites). AI answers lean on corroborating sources, not just the site. |

---

## Sources (research, October 2026)

- SERP checks: [orderio](https://www.orderio.de/), [Dishly](https://www.dishly.de/online-bestellsystem), [GiniCART](https://ginicart.de/), [RestaurantOS](https://restaurantos.de/), [jungmut – Relaunch](https://www.jungmut.com/blog/website-relaunch-agentur/), [webnique – Relaunch](https://www.webnique.de/blog/website-relaunch-kosten-dauer-agentur), [saschafix – Kundenportal](https://saschafix.de/wissen/blog-articles/kundenportal-entwickeln-lassen/), [unit-m – B2B-Kundenportal](https://www.unit-m.de/b2b-kundenportal-entwickeln-lassen/), [tj-labs – Web-App](https://tj-labs.de/leistungen/web-app-entwicklung), [BRANDUNG – Vercel/Next.js](https://www.brandung.de/de/partner/vercel), [kopfundstift – Webdesign Düsseldorf](https://kopfundstift.de/webdesign-duesseldorf/), [websitekostenrechner.de](https://websitekostenrechner.de/), [seokratie – Relaunch-Checkliste](https://www.seokratie.de/website-relaunch-seo-checkliste/), [terranovaai – KI-Automatisierung KMU](https://www.terranovaai.de/blog/ki-automatisierung-fur-kmu-welche-prozesse-sich-sofort-automatisieren-lassen)
- Google guidance: [Spam policies (link spam, footer links)](https://developers.google.com/search/docs/essentials/spam-policies), [Localized versions / hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions), [GBP guidelines](https://support.google.com/business/answer/3038177?hl=en), [FAQ rich results removal (SEJ)](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)
- Impressum: [zerodox – ladungsfähige Anschrift § 5 DDG](https://zerodox.de/blog/ladungsfaehige-adresse)
- AI crawlers: [nohacks – AI user-agent landscape 2026](https://nohacks.co/blog/ai-user-agents-landscape-2026)
