# Reza Alami: Content & Messaging System

The words layer for the German-first, founder-led studio described in [`STRATEGY.md`](./STRATEGY.md). It reads with [`UX-DIRECTION.md`](./UX-DIRECTION.md) (structure, components, ship-ready UI strings) and [`SEO-STRATEGY.md`](./SEO-STRATEGY.md) (keywords, slugs, titles, roadmap).

> **Decisions, October 2026:** the decision log in `STRATEGY.md` §11 is binding. Where anything below differs from it, the decision log wins.

- **Status:** v1 · October 2026 · pre-implementation
- **Language rule:** explanations in English, real copy in German. German copy uses „Sie", „ich" (phase 1), German typographic quotes „…" and the spaced en dash „ – " sparingly.
- **Honesty rule:** only facts from `src/content/*.ts` and the live client sites. Everything else is a visible placeholder in square brackets, e.g. `[Kennzahl: Anfragen/Monat vorher → nachher, vom Kunden bestätigen lassen]`. A placeholder is a to-do, not copy.
- **Relationship to UX-DIRECTION:** where UX already ships a German string, this document reuses it. Every place I recommend different copy is marked **≠ UX** with the reason. Where SEO-STRATEGY fixes a title, slug or H1, it wins, and I mark it **= SEO**.

### Verified facts this document is allowed to use

| Topic | Fact | Source |
| --- | --- | --- |
| Reza | Academic background in software engineering; about one year of additional professional training in software engineering in Germany; professional work as a web developer; six months of professional digital-marketing training under Meta via a scholarship; professional AI work across design, development and marketing; now independent | `profile.ts` (all periods `null`) |
| Power Bowls | Bowls & wraps restaurant, Mercatorstraße 66, Duisburg. Web app with three order modes (table QR code, pickup, delivery), live order status with estimated time, delivery zones, customer accounts, favourites and order history, admin back office (orders, menu, photos, tables, team, customers, messages, analytics, settings), self-hosted fonts, installable. Built with React/Vite. | `projects.ts`, powerbowls.de |
| Foodigastro24 | B2B fresh-food supplier (fruit, vegetables, groceries, catering) for restaurants, hotels, kindergartens, care homes, companies. Website with service pages, quote request form with consent, gallery, SEO metadata. Address Mercatorstr. 66, Duisburg (same as Power Bowls). | `projects.ts`, foodigastro24.de |
| Rundumdienst | Home & building services in Neuss and surroundings (Düsseldorf, Meerbusch, Kaarst, Dormagen, Korschenbroich, Mönchengladbach, Grevenbroich). Website with LocalBusiness schema, contact form, WhatsApp and click-to-call, service-area map. | `projects.ts`, rundumdienst.de |
| Not known | Reza's role per project, launch dates, any business metric, any testimonial, years of experience, city, prices, capacity, tech stack beyond the project lists | `null` in content |

---

## Abgleich mit STRATEGY.md

> **Decided by Reza (October 2026):** brand line = his original tagline „Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen." (option C below) · descriptor = „Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen" · role titles = „Software Engineer · AI Specialist · Web & App Developer · Digital Marketer" (Reza's approved titles; „Full-Stack" is not used anywhere). The analysis below is kept as the record of the alternatives; where it recommends otherwise, the decision wins.

Reza's new direction is a real input. Here is a candid read of it against the approved strategy, and one recommendation per element.

### Tagline: „Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen."

| Works | Risks |
| --- | --- |
| „die Kunden überzeugen" is outcome language and sounds like a German owner would say it. It is warmer than „verkaufen" and fits service businesses (Rundumdienst, practices) where the website wins trust, not a checkout. | „Moderne" is a filler word: every competitor claims it and no buyer pays for it. |
| It names the product range, so nobody wonders what you build. | „KI-Erlebnisse" is vague for SME buyers. A dentist or a cleaning company can't picture it, and it sounds like hype, which STRATEGY §02 warns against. There is also no AI case study yet to back it. |
| | Three products plus a qualifier make it a list, not a promise. At 63 characters it is also over the 60-character H1 budget in UX §8.5. |

**Variants that keep its spirit:**

1. „Websites, die Kunden überzeugen. Software, die entlastet." *(recommended)*
2. „Websites und Web-Apps, die Kunden überzeugen."
3. „Websites, die Kunden überzeugen. Software, die Ihrem Team Arbeit abnimmt."
4. „Websites, die verkaufen. Software, die entlastet." (STRATEGY / UX original)
5. „Moderne Websites und Apps, die Kunden überzeugen – mit KI dort, wo sie Zeit spart." (closest to Reza's wording; too long for an H1, fine for LinkedIn)

**Recommendation: variant 1.** It keeps Reza's „die Kunden überzeugen", keeps STRATEGY's two-part structure (each half maps to a lead offer: websites and web apps), drops „Moderne" and „KI-Erlebnisse", and fits the H1 budget at 57 characters. AI moves into the sub-line and the services as a concrete capability. **≠ UX:** UX §03 uses variant 4. Variant 1 swaps one verb; the layout and the serif accent on the two verbs („überzeugen", „entlastet") stay the same. **= SEO §4.3:** the H1 gets a small visible keyword line above the brand line (see Part 3).

### Role line: „Freelance Web & App Designer · UI/UX · SEO · Digital Marketing"

| Works | Risks |
| --- | --- |
| Honest about what Reza does. Good for LinkedIn and marketplaces, where people search by role. | Five roles read as a generalist, the exact problem STRATEGY §00 names. |
| | „Freelance" signals marketplace pricing to German buyers and blocks the studio path (STRATEGY §06). It also invites comparison with the 500 € offers STRATEGY wants to filter out. |
| | English role labels on a German site add Denglisch where German words exist. |
| | It describes Reza, not the client's result. |

**Recommendation:** split the line into two jobs.

- **Descriptor (under the wordmark, in schema, GBP and LinkedIn headline):** „Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen". It names three offers, not five roles, and it names the buyer. This is the same wording as the UX hero eyebrow, so it already appears on the site. **Decided:** replaces STRATEGY's earlier „Studio für digitale Wachstumssysteme". Nobody searches for that, and an owner can't repeat it to a colleague. Keep it as an internal idea, not as the public descriptor. SEO §11.3 requires one identical descriptor across the site, schema, GBP and LinkedIn, so the SEO and frontend owners must update the entity string to match.
- **Role line (hero byline, founder section, `/ueber`, schema, OG):** „Reza Alami · Software Engineer · AI Specialist · Web & App Developer · Digital Marketer" (decided by Reza, October 2026). All four titles, this order, never numbered or shortened, always under the outcome headline and next to the descriptor, so they read as a profile, not a generalist list. Hero adds a second line: „Ich betreue jedes Projekt persönlich." „Full-Stack" is not used anywhere.
- **LinkedIn (English, Reza's personal channel):** „Software Engineer · AI Specialist · Web & App Developer · Digital Marketer | Websites, web apps and SEO for owner-led businesses in DACH". „Freelance" can stay in the LinkedIn „open to" settings, not in the headline.

### Six services against three lead services

Reza wants six services named. STRATEGY wants three to lead. Both can hold: all six get full messaging (Part 5), and the site shows three in phase 1.

| Reza's service | German name on the site | Phase-1 tier | Where it appears | URL (= SEO §3.1) |
| --- | --- | --- | --- | --- |
| Website Design & Development | Website & Relaunch | **Lead** | Homepage row 1, two service pages | `/leistungen/website-erstellen-lassen`, `/leistungen/website-relaunch` |
| Web Applications & Digital Products | Web-Apps & Portale | **Lead** | Homepage row 2, service page | `/leistungen/web-app-entwicklung` |
| SEO & Organic Growth | SEO & Sichtbarkeit | **Lead** | Homepage row 3, service page | `/leistungen/seo` |
| UI/UX Design | UX-Design & Nutzerführung | **Capability** inside Website and Web-App | „Design & Nutzerführung" deliverable group on both pages; „Ansatz" section of every case study | none in phase 1; `/leistungen/ux-design` in phase 2 only if startup/product demand appears |
| Digital Marketing | Wachstumsbetreuung (CRO, landing pages, analytics, content) | **Secondary** | `/leistungen` „Für bestehende Kunden" block; mentioned on the Website pages | none in phase 1. Paid ads stay **Later** (phase 2, with a partner). |
| AI-Powered Workflows & Automation | KI-Integration & Automatisierung | **Secondary** | Section on the Web-App page; line on `/leistungen` | `/leistungen/ki-automatisierung` in phase 2, after two AI case studies (= SEO §5.1) |
| (from STRATEGY) | Wartung, Hosting & Sicherheit | **Secondary** | `/leistungen` block; add-on in every „Investition" section | `/leistungen/wartung-hosting` |

Why: a visitor has to understand the offer in three items, and each lead service already has a real project behind it. UI/UX is how Reza does the work, not a separate purchase for an SME owner. Marketing and AI are what existing clients buy next.

### Other reconciliations

| Topic | Decision |
| --- | --- |
| „ich" vs. „wir" | „ich" in phase 1 (STRATEGY §06, UX §1.3). „wir" only for „Sie und ich" („Gemeinsam klären wir …"). Phase-2 swaps are shown as `→ P2:` in the copy below. |
| Hero micro-proof | **≠ UX:** UX writes „3 Projekte live". Three is true, but as a number it reads small. Use „Projekte für Gastronomie, B2B-Handel und lokale Dienstleister live" until there are 6+, then switch to the count. |
| Service name „Conversion-Website" | Keep it out of headlines. „Conversion" is Denglisch for most owners and has no search demand (SEO §1.1). On the site: „Website & Relaunch". **≠ UX/SEO H3** („Conversion-Website & Relaunch"); the meaning is the same. |
| Form budget ranges | UX §6.3 starts at 5.000 €. That doesn't fit SEO inquiries (audit ab 990 €) or AI add-ons (ab 2.500 €). Recommendation: when „SEO & Sichtbarkeit" is selected, show „SEO-Audit (ab `[990]` €) · Laufende Betreuung (ab `[1.200]` €/Monat) · Noch unklar". See Part 8. |

---

## Part 1 · Brand messaging foundation

### 1.1 Positioning statement (internal)

> Für inhabergeführte Unternehmen im DACH-Raum, deren Website Kunden gewinnen muss, gestaltet, entwickelt und vermarktet Reza Alami Websites und Web-Apps als ein System. Anders als Designagenturen, die beim Launch aufhören, oder Entwickler, die nicht an den Vertrieb denken, misst er jede Entscheidung an einer Frage: Bringt sie mehr qualifizierte Anfragen oder weniger Handarbeit?

`→ P2:` „… gestaltet, entwickelt und vermarktet dotMind …"

### 1.2 One-sentence value proposition

> **Strategie, Design, Entwicklung und Sichtbarkeit aus einer Hand – mit einem Ansprechpartner, der für das Ergebnis geradesteht.**

### 1.3 Brand promise

> **Sie wissen immer, wer verantwortlich ist, was es kostet und was es gebracht hat.**

The promise covers the three fears owners name most: no single owner of the result, unclear cost, no visible effect. Every page should be able to keep it. „was es gebracht hat" commits Reza to measuring, so analytics goals belong to every launch.

### 1.4 Elevator pitch (30 seconds, spoken, „ich")

> „Ich baue Websites und Web-Apps für inhabergeführte Unternehmen – also für Betriebe, bei denen ein neuer Kunde die Website schon bezahlt. Viele haben eine Website, die ordentlich aussieht, über die sich aber kaum jemand meldet. Oder Bestellungen und Anfragen kommen per Telefon und WhatsApp und werden von Hand abgetippt. Ich kümmere mich um beides: eine Website, die bei Google gefunden wird und Besucher zur Anfrage führt, und Software, die Handarbeit ersetzt. Für ein Restaurant in Duisburg habe ich zum Beispiel ein eigenes Bestellsystem gebaut – am Tisch per QR-Code, zur Abholung und per Lieferung. Sie haben bei mir einen Ansprechpartner von der Analyse bis zum Ranking."

`→ P2:` „Wir bauen …", „… habe ich" → „… haben wir", last sentence: „Sie haben einen festen Ansprechpartner …".

### 1.5 Tone of voice

**Ruhig, konkret, verbindlich.** A senior consultant talking to an owner at eye level: no jargon to impress, no sales pressure, every claim backed by something you can click.

| Trait | Do | Don't |
| --- | --- | --- |
| Concrete | „Bestellungen am Tisch, zur Abholung und per Lieferung – in einem System." | „Innovative digitale Lösungen für Ihr Business." |
| Outcome first | „Mehr Anfragen aus Ihrer Region." | „Responsive Next.js-Website mit SSR." |
| Honest about limits | „Für einen Onepager unter 3.000 € bin ich nicht der richtige Partner." | „Für jedes Budget die perfekte Lösung." |
| Calm | „Antwort innerhalb von 24 Stunden (werktags)." | „Jetzt zuschlagen! Nur noch 2 Plätze frei!" |
| Personal, not casual | „Ich lese jede Anfrage persönlich." | „Hey, schreib uns einfach!" |
| Proof over adjectives | „Live seit `[Monat Jahr]` · PageSpeed mobil `[x]` (gemessen am `[Datum]`)" | „Blitzschnelle, preisgekrönte Websites." |
| Short sentences | One idea per sentence. 12–18 words on average. | Nested clauses with three commas and a dash. |

### 1.6 Words to use

Anfragen · Buchungen · Bestellungen · gefunden werden · in Ihrer Region · Handarbeit ersetzen · entlasten · Ansprechpartner · gehört Ihnen · nachvollziehbar · messbar · Festpreis nach Analyse (only if true) · ab-Preis · Erstgespräch · Ablauf · live seit · Ladezeit · Datenschutz von Anfang an · in der EU gehostet (only if true) · Betrieb, Praxis, Unternehmen (not „Business") · Kundinnen und Kunden / Kunden (pick one, use consistently; recommendation: „Kunden" for readability)

### 1.7 Words to avoid

| Avoid | Why | Use instead |
| --- | --- | --- |
| Potenzial entfalten · revolutionieren · next level | Empty, AI-cadence | the concrete change („Bestellungen ohne Abtippen") |
| innovative / cutting-edge / State of the Art Lösungen | Every agency says it | name the solution („eigenes Bestellsystem") |
| maßgeschneidert (without specifics) | Unprovable | „individuell entwickelt, ohne Baukasten" + what that means |
| ganzheitlich (without specifics) | Vague | „Design, Entwicklung und SEO aus einer Hand" |
| Leidenschaft · passioniert · Herzblut | Unprovable, amateur signal (STRATEGY §07) | show care through detail |
| Moderne (as a selling adjective; exception: the approved brand line) | Everyone claims it | the measurable property („lädt mobil in `[x]` Sekunden") |
| KI-Erlebnisse · KI-gestützt (alone) · smart (exception: „KI-Erlebnisse" in the approved brand line) | Hype without content | what the AI does („beantwortet Standardfragen", „sortiert Anfragen vor") |
| Synergien · Mehrwert schaffen · digitale Transformation · im digitalen Zeitalter | Consultant filler | the result |
| nahtlos · einzigartig · pixelperfekt · Game Changer | Superlatives without proof | facts |
| Full-Service · Rundum-sorglos-Paket | Overpromises for one person | the actual scope |
| Platz 1 bei Google · garantierte Rankings · 100 % Zufriedenheit | Nobody can guarantee this; risky under UWG | „bessere Sichtbarkeit, gemessen in der Search Console" |
| günstig · billig · Rabatt | Wrong positioning | „ab"-Preis, Festpreis |
| Experte / Spezialist (self-claimed; exception: the approved title „AI Specialist") | Proof beats titles | the project |
| Freelancer (as self-description on the site) | Marketplace signal | „Ich" + founder byline |
| Denglisch: Business, Leads (in customer copy), Performance, Tools (headline); exception: the four approved English role titles | Owners use German | Betrieb, Anfragen, Ladezeit, Werkzeuge |
| Exclamation marks in headlines, emoji | Not premium | full stop |

---

## Part 2 · Audience & message segmentation

| Segment | Problems | Concerns & objections | Goals | Resonant message |
| --- | --- | --- | --- | --- |
| **Etablierte KMU** (10–250 MA, Inhaber/GF entscheidet, Website 5+ Jahre alt) | Site looks dated, nobody dares touch the WordPress stack, few inquiries, unclear what marketing spend brings | „Ein Einzelner – was, wenn er ausfällt?" · „Verlieren wir beim Relaunch unsere Rankings?" · „Wir hatten schon mal eine Agentur, die nach dem Launch weg war." | A site that represents the company, generates inquiries, can be maintained | „Ein Relaunch, der Ihre Rankings behält und mehr Anfragen bringt – mit einem Ansprechpartner, der danach erreichbar bleibt." |
| **Wachsende Dienstleister** (2–20 Personen, bisher Empfehlungen) | Referrals plateau, invisible on Google in own city, inquiries by phone at bad moments | „Lohnt sich das für uns?" · „Wir haben keine Zeit für Texte." · „7.500 € sind viel Geld." | Predictable inbound inquiries, look as professional as bigger competitors | „Werden Sie in Ihrer Stadt gefunden – und machen Sie Anfragen so einfach wie einen Anruf." |
| **Gastronomie & Food** | Orders by phone/WhatsApp, delivery platform commissions, no own customer data | „Lieferplattformen bringen uns die Kunden." · „Das Team muss das bedienen können." · „SaaS kostet nur 79 € im Monat." | Own ordering channel, less phone time, own customer relationships | „Ein eigenes Bestellsystem: am Tisch, zur Abholung und per Lieferung – und die Kundendaten bleiben bei Ihnen." |
| **Praxen & Kliniken** (no case study yet) | Phone line overloaded, outdated site, unclear what may be shown online | „Datenschutz bei Gesundheitsdaten?" · „Heilmittelwerberecht?" · „Keine Zeit für Projekte." | Fewer calls, more of the right patients, trustworthy appearance | „Weniger Anrufe am Empfang, eine Website, der Patienten vertrauen – mit Datenschutz von Anfang an." Use only when a Praxis project exists or in outreach that says so honestly. |
| **Startups (secondary)** | Need an MVP or portal fast, no in-house frontend/design | „Skaliert das?" · „Bekommen wir den Code?" · „Kann er mit unserem Team arbeiten?" | Working product, clean codebase, investor-ready look | „Ein MVP, das live geht und wartbar bleibt – Code und Rechte gehören Ihnen." |

### Objection-handling lines (reusable in FAQ, calls and service pages)

| Objection | Line |
| --- | --- |
| „Sie sind nur eine Person." | „Genau deshalb wissen Sie, wer verantwortlich ist. Code und Dokumentation gehören Ihnen, sodass auch jemand anderes weiterarbeiten kann. Für Ausfälle gibt es `[Vertretungsregelung – Reza bestätigen]`." |
| „Zu teuer." | „Der ab-Preis zeigt, wo Projekte beginnen. Ob sich die Investition lohnt, rechnen wir im Erstgespräch an Ihrem Kundenwert durch – nicht an meinem Stundensatz." |
| „Wix/Baukasten reicht doch." | „Für einen einfachen Auftritt oft ja. Wenn die Website Anfragen bringen, bei Google gefunden werden und mit Ihren Abläufen verbunden sein soll, stoßen Baukästen an Grenzen." |
| „Wir verlieren beim Relaunch Rankings." | „Jede alte URL bekommt eine Weiterleitung, bevor die neue Seite live geht. Rankings und Anfragen beobachte ich nach dem Launch mit." |
| „Keine Zeit für Inhalte." | „Ich liefere Seitenstruktur und Textkonzept. Sie geben Fakten und Freigaben, kein leeres Blatt." (Only if Reza writes copy; confirm scope.) |
| „Ist KI bei Ihnen Pflicht?" | „Nein. KI setze ich nur ein, wo sie messbar Zeit spart, und nie ohne Ihr Einverständnis bei Kundendaten." |
| „Datenschutz?" | „Selbst gehostete Schriften, Statistik ohne Tracking-Cookies, Hosting in der EU, AV-Vertrag auf Wunsch. Rechtsberatung ersetzt das nicht, aber es macht die Prüfung für Ihren Datenschutzberater einfach." |

---

## Part 3 · Homepage copy strategy

### 3.1 H1 options

The H1 has two visible lines per SEO §4.3: a small keyword line, then the brand line.

| # | Keyword line (small) | Brand line (large) | Verdict |
| --- | --- | --- | --- |
| A | Webdesign & Web-Apps für Unternehmen in Ratingen | **Websites, die Kunden überzeugen. Software, die entlastet.** | Recommended in v1; not chosen. |
| B | same | Websites, die verkaufen. Software, die entlastet. | STRATEGY/UX original. Sharper, but „verkaufen" fits shops better than service firms and practices. |
| C | same | Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen. | **Chosen (Reza, Oct 2026).** 63 chars: approved exception to the 60-char budget; test at 320 px. Back „KI-Erlebnisse" with concrete AI use cases in the lead and on the Web-App page. |
| D | same | Websites und Web-Apps, die Kunden überzeugen. | Clean, but loses the second benefit (Entlastung). |
| E | same | Mehr Anfragen über Ihre Website. Weniger Handarbeit im Betrieb. | Most concrete; reads like a sub-line, less brand. Good for ads or LinkedIn. |
| F | same | Ihre Website soll Kunden bringen. Dafür baue ich sie. | Personal, phase-1 only; doesn't survive the switch to „wir". |

### 3.2 Hero

- **Eyebrow (non-heading, if still used next to the keyword line):** drop it. The H1 keyword line does the job. **≠ UX** (UX eyebrow „Webdesign · Web-Apps · SEO für inhabergeführte Unternehmen" becomes the descriptor under the wordmark instead).
- **Lead (= SEO §4.3 intent, shortened):** „Ich gestalte, entwickle und vermarkte Websites und Web-Apps für inhabergeführte Unternehmen. Für mehr Anfragen aus Ihrer Region, eigene Bestell- und Buchungssysteme und weniger Handarbeit – mit KI dort, wo sie messbar Zeit spart."
- **Primary CTA:** Erstgespräch vereinbaren · microcopy „30 Minuten · kostenlos · Antwort in 24 Std."
- **Secondary CTA:** Projekte ansehen
- **Micro-proof:** „Antwort innerhalb von 24 Stunden · Projekte für Gastronomie, B2B-Handel und lokale Dienstleister live · Ratingen bei Düsseldorf"
- **Availability (only if confirmed):** „Nächster freier Projektstart: `[Monat]`"
- **Founder byline:** „Reza Alami · Software Engineer · AI Specialist · Web & App Developer · Digital Marketer" + second line „Ich betreue jedes Projekt persönlich."

### 3.3 Navigation

Leistungen · Projekte · Über mich · Kontakt · button **Erstgespräch vereinbaren** (= UX). `→ P2:` „Über uns".

### 3.4 Section headlines (H2)

Where UX and SEO differ, I pick one and say why.

| # | Section | H2 | Note |
| --- | --- | --- | --- |
| 3 | Problem | **Gute Website. Kaum Anfragen?** | Merges UX („Gute Website. Kaum Anfragen.") with SEO's question form. The question invites recognition; the statement reads like a verdict on the reader's site. |
| 4 | Leistungen | **Website, Web-App und SEO aus einer Hand.** | = SEO minus the „Leistungen:" prefix (the section label already says it). UX's „Drei Leistungen. Ein Ziel: mehr qualifizierte Anfragen." works as the lead sentence. |
| 5 | Projekte | **Echte Betriebe, live im Einsatz.** | = UX. Case-level H3s carry the long tail (SEO): „Power Bowls: eigenes Bestellsystem in Duisburg". |
| 6 | Der Unterschied | **Ein Ansprechpartner statt drei Dienstleister.** | = UX. SEO's longer version goes in the lead sentence. |
| 7 | Ablauf | **So läuft Ihr Projekt ab.** | = SEO („Ihr" over UX's „ein": it's about the reader). |
| 8 | Founder | **Ich verantworte Ihr Projekt – von der Analyse bis zur Sichtbarkeit bei Google.** | ≠ UX: „Platzierung bei Google" sounds like a ranking promise. Label „Über Reza Alami" carries the entity (SEO). |
| 9 | Testimonials | **Was Kunden sagen.** | Only with ≥ 2 real quotes. |
| 10 | Schnellcheck | **Noch nicht bereit für ein Gespräch?** | = UX. Label: „Kostenloser Website-Schnellcheck" (SEO). |
| 11 | FAQ | **Häufige Fragen zu Kosten, Ablauf und Datenschutz.** | = SEO. |
| 12 | Final CTA | **Lassen Sie uns über Ihr Projekt sprechen.** | = UX/SEO. |

### 3.5 Short service descriptions (homepage rows)

| Service | Outcome headline | Two-line description | Price | Link anchor (SEO) |
| --- | --- | --- | --- | --- |
| Website & Relaunch | **Eine Website, die aus Besuchern Anfragen macht.** | Seitenstrategie, Texte, Design und Entwicklung ohne Baukasten. Technisches SEO und Messung sind von Anfang an eingebaut. | ab `[7.500]` € | „Website erstellen lassen" · „Website-Relaunch planen" |
| Web-Apps & Portale | **Software, die Handarbeit ersetzt.** | Bestell- und Buchungssysteme, Kundenportale und interne Werkzeuge. Auf Wunsch mit KI, die Anfragen vorsortiert oder Standardfragen beantwortet. | ab `[15.000]` € | „Web-App entwickeln lassen" |
| SEO & Sichtbarkeit | **Gefunden werden, wo Ihre Kunden suchen.** | Technisches SEO, Local SEO und Google-Unternehmensprofil. Mit Audit, klarem Maßnahmenplan und monatlichem Bericht. | Audit ab `[990]` € · ab `[1.200]` €/Monat | „SEO für Unternehmen" |

Quiet line beneath (= UX): „Für Kunden nach dem Launch außerdem: Wartung & Hosting · KI-Integration · Wachstumsbetreuung →"

### 3.6 Case-study intro, trust, process, final CTA

- **Case-study intro:** „Drei Betriebe, drei Aufgaben: ein Bestellsystem für ein Restaurant, eine B2B-Website für einen Lebensmittellieferanten und eine lokale Website für einen Dienstleister in Neuss. Alle live, alle zum Anklicken."
- **Trust (comparison lead):** „Agentur, Freelancer, Baukasten – oder ein Partner, der für das Ergebnis geradesteht. Ein fairer Vergleich:" (comparison table = UX §03.06).
- **Process lead:** „Fünf Schritte, ein fester Ansprechpartner, sichtbare Zwischenstände. Sie wissen in jeder Phase, was als Nächstes kommt und was Sie bekommen." (steps = UX §03.07; durations stay placeholders).
- **Final CTA:** H2 above · lead „30 Minuten, kostenlos, ohne Verkaufsdruck. Wenn es nicht passt, sage ich das ehrlich." · primary **Erstgespräch vereinbaren** · tertiary „Lieber schriftlich? Projekt anfragen →".

---

## Part 4 · Homepage conversion flow

| Stage | Visitor question | Sections | What must be true on screen | Exit if it fails |
| --- | --- | --- | --- | --- |
| **First 5 seconds** | „Ist das für mich?" | Hero (keyword line, brand line, lead, byline, device visual) | Buyer type named („inhabergeführte Unternehmen"), both offers named, a real face, a real client screen, one button | Back button. Fix: test the H1 with three owners before launch („Was macht diese Person?"). |
| **Trust (5–30 s)** | „Haben die das schon mal gemacht?" | Proof strip → Problem | Three named clients with a verifiable fact each; the visitor's own problem in their words | Scrolls past; proof without numbers feels thin, so add measured PageSpeed values with date. |
| **Expertise (30 s–2 min)** | „Was genau kaufe ich, was kostet es, hat es funktioniert?" | Leistungen → Projekte → Der Unterschied → Ablauf | ab-prices visible, each service linked to a project, Aufgabe/Lösung/Ergebnis per case, process with deliverables | Leaves for a competitor comparison; the comparison table answers it on-page. |
| **Person** | „Kann ich dieser Person vertrauen?" | Founder → (Testimonials) | Photo, short story, capacity line, what Reza refuses to do | Unsure; Schnellcheck catches them. |
| **Inquiry** | „Was ist der kleinste sinnvolle Schritt?" | Mid-page CTA after Projekte, Schnellcheck, FAQ, Final CTA | One primary CTA per viewport; microcopy says what happens next; three intents (call, written inquiry, free check) | Not ready: Schnellcheck with email + URL; nurture sequence (Part 8). |

**Copy rules for the flow:** the first number a visitor sees is a price or a measured fact, never a vanity count. Every CTA has one reassurance line, no more (UX §6.6). The word „Anfragen" appears in the hero, the services and the final CTA, so the promise is repeated, not re-invented.

---

## Part 5 · Service architecture & messaging (all six)

Tier mapping is in „Abgleich mit STRATEGY.md". Prices are STRATEGY planning anchors in brackets; confirm before launch. Full page copy for each is in Part 12.2.

**Which role title powers which service** (shown as a small byline on each service page, so hero, about and services tell one story):

| Service | Role titles |
| --- | --- |
| Website & Relaunch | Web & App Developer · Digital Marketer |
| Web-Apps & Portale | Software Engineer · Web & App Developer · AI Specialist |
| SEO & Sichtbarkeit | Digital Marketer · Software Engineer |
| UX-Design & Nutzerführung | Web & App Developer |
| Wachstumsbetreuung | Digital Marketer |
| KI-Integration & Automatisierung | AI Specialist · Software Engineer |
| Wartung, Hosting & Sicherheit | Software Engineer |

### 5.1 Website & Relaunch (Website Design & Development) · Lead

| Element | Copy / content |
| --- | --- |
| Name | Website & Relaunch (two pages: Neubau, Relaunch) |
| One-line promise | „Eine Website, die aus Besuchern Anfragen macht." |
| Short description | „Ich plane, gestalte und entwickle Ihre Website als Vertriebswerkzeug: klare Seitenstruktur, überzeugende Texte, schnelle Technik ohne Baukasten und technisches SEO von Anfang an. Bei einem Relaunch sichere ich vorher Ihre Rankings." |
| Problems | Sieht ordentlich aus, bringt kaum Anfragen · langsam, Plugin-Flickwerk, niemand traut sich ran · auf dem Handy umständlich · nicht messbar, was sie bringt · Angst vor Rankingverlust beim Relaunch |
| Deliverables | Zielgruppen- und Seitenstrategie · Textkonzept und Textüberarbeitung `[Umfang: schreibt Reza Texte selbst? bestätigen]` · Design & Nutzerführung (UI/UX) · Entwicklung ohne Page-Builder · technisches SEO (Struktur, Metadaten, strukturierte Daten, Ladezeit) · Messung ohne Tracking-Cookies mit Zielen auf jedem Kontaktweg · Relaunch: Weiterleitungsplan für alle alten URLs · Einweisung und Dokumentation · `[Pflege: CMS ja/nein? bestätigen]` |
| Process | Analyse → Konzept → Design & Entwicklung → Launch → Wachstum (durations `[ ]`) |
| Ideal client | Inhabergeführtes Unternehmen, Website 5+ Jahre alt oder Baukasten, Entscheider im Gespräch, Budget ab `[7.500]` € |
| Proof angle | **Foodigastro24** (B2B website with quote request form, service pages per customer group) and **Rundumdienst** (local website, several contact paths). Not Power Bowls (that is a web app). |
| FAQ topics | Kosten · Dauer · CMS/Selbstpflege · Code-Eigentum · Hosting · Texte · Relaunch ohne Rankingverlust · BFSG/Barrierefreiheit · WordPress |
| CTA | Primary „Erstgespräch vereinbaren" · in-page „Website-Projekt anfragen" · tertiary „Website kostenlos prüfen lassen" |

### 5.2 Web-Apps & Portale (Web Applications & Digital Products) · Lead

| Element | Copy / content |
| --- | --- |
| Name | Web-Apps & Portale |
| One-line promise | „Software, die Handarbeit ersetzt." |
| Short description | „Bestellsysteme, Buchungen, Kundenportale und interne Werkzeuge, die genau zu Ihren Abläufen passen. Statt Telefon, Excel und WhatsApp-Verläufen ein System, das Ihr Team entlastet – und dessen Daten Ihnen gehören." |
| Problems | Bestellungen und Anfragen kommen über fünf Kanäle · Abtippen von Hand, Fehler · Provisionen an Plattformen · Excel-Listen, die nur eine Person versteht · Standard-Software passt nicht zum Ablauf |
| Deliverables | Ablaufanalyse („Wer macht heute was, wie oft?") · Klickbarer Prototyp vor der Entwicklung · Oberfläche für Kunden und für das Team · Verwaltungsbereich (Inhalte, Nutzer, Auswertungen) · Benutzerkonten und Rechte · Schnittstellen zu bestehenden Systemen · optional KI-Bausteine (Part 5.6) · Datenschutz von Anfang an (EU-Hosting `[bestätigen]`, selbst gehostete Schriften) · Dokumentation und Übergabe |
| Process | Ablaufanalyse → Prototyp → Entwicklung in Etappen mit Testzugang → Einführung im Team → Betreuung |
| Ideal client | Betrieb mit wiederkehrendem manuellem Ablauf (Bestellungen, Termine, Aufträge), Startups mit MVP-Bedarf; Budget ab `[15.000]` € |
| Proof angle | **Power Bowls**: three order modes, live status, delivery zones, customer accounts, admin back office. Strongest proof on the whole site. |
| FAQ topics | Eigenentwicklung vs. SaaS · Kosten und laufende Kosten · Wem gehört die Software · Wartung · Schnittstellen · Datenschutz · Bedienung durch das Team · MVP-Dauer |
| CTA | „Erstgespräch vereinbaren" · „Ablauf schildern – ich schätze den Aufwand ein" (form prefill `?leistung=web-app`) |

### 5.3 SEO & Sichtbarkeit (SEO & Organic Growth) · Lead

| Element | Copy / content |
| --- | --- |
| Name | SEO & Sichtbarkeit |
| One-line promise | „Gefunden werden, wo Ihre Kunden suchen." |
| Short description | „Ich finde heraus, warum Sie bei Google nicht gefunden werden, und behebe es: Technik, Inhalte, lokale Signale und Ihr Google-Unternehmensprofil. Erst ein Audit mit klarem Maßnahmenplan, dann auf Wunsch laufende Betreuung mit monatlichem Bericht." |
| Problems | In der eigenen Stadt nicht auf Seite 1 · Konkurrenz mit schlechterer Arbeit rankt besser · Google-Unternehmensprofil halb gepflegt · niemand weiß, welche Suchbegriffe Anfragen bringen |
| Deliverables | Technisches SEO-Audit (Indexierung, Ladezeit, Struktur, strukturierte Daten) · Suchbegriff-Analyse für Ihre Leistungen und Region · Local SEO und Google-Unternehmensprofil · Content-Plan · Umsetzung im Code (bei Websites von mir) oder Umsetzungsliste für Ihr Team · Monatlicher Bericht mit Search-Console-Daten |
| Process | Audit (`[x]` Tage) → Maßnahmenplan → Umsetzungssprint → monatliche Betreuung (optional) |
| Ideal client | Lokale Dienstleister, Gastronomie, KMU mit regionalem Markt; Audit ab `[990]` €, Betreuung ab `[1.200]` €/Monat |
| Proof angle | **Rundumdienst**: LocalBusiness markup with services, opening hours, service area, geo coordinates; service-area section with map. Rankings only once measured. **Never Power Bowls** for SEO claims (client-rendered, per SEO §0). |
| FAQ topics | Wie lange bis Ergebnisse · Garantie (nein) · Kosten Audit vs. Betreuung · Local SEO · Google-Bewertungen · KI-Suche (AI Overviews, ChatGPT) · Kündigungsfrist |
| CTA | „SEO-Audit anfragen" · „Erstgespräch vereinbaren" · tertiary „Kostenloser Schnellcheck" |

### 5.4 UX-Design & Nutzerführung (UI/UX Design) · Capability

| Element | Copy / content |
| --- | --- |
| Name | UX-Design & Nutzerführung (on the site as a deliverable group „Design & Nutzerführung") |
| One-line promise | „Besucher finden in Sekunden, was sie suchen – und den Weg zur Anfrage." |
| Short description | „Bevor gestaltet wird, kläre ich, wer Ihre Website besucht, was diese Menschen wissen wollen und welcher Schritt sie zur Anfrage bringt. Daraus entstehen Seitenstruktur, Wireframes und ein Design, das auf dem Handy genauso funktioniert wie am Schreibtisch." |
| Problems | Besucher springen ab · wichtige Infos versteckt · Formular wird abgebrochen · auf dem Handy umständlich · App wirkt kompliziert für Team oder Kunden |
| Deliverables | Nutzerwege und Seitenstruktur · Wireframes · klickbarer Prototyp · Gestaltung (Typografie, Farben, Komponenten) · mobile Optimierung · Barrierefreiheit nach gängigen Standards `[Umfang bestätigen]` · Formular-Optimierung |
| Process | Inside the Konzept and Design steps of the Website/Web-App process |
| Ideal client | Every Website/Web-App client; standalone: startups or product teams with an existing app (phase 2) |
| Proof angle | **Power Bowls** (three order paths in one flow; admin for daily use), **Rundumdienst** (three contact paths: form, WhatsApp, phone). Needs artefacts: wireframes or sketches `[vorhanden? sammeln]`. |
| FAQ topics | Brauche ich UX-Design bei einer kleinen Website · Wie testen Sie · Barrierefreiheit/BFSG |
| CTA | No own CTA in phase 1; links to Website and Web-App pages |

### 5.5 Wachstumsbetreuung (Digital Marketing) · Secondary

| Element | Copy / content |
| --- | --- |
| Name | Wachstumsbetreuung (Online-Marketing nach dem Launch) |
| One-line promise | „Nach dem Launch fängt die Arbeit an: messen, verbessern, sichtbarer werden." |
| Short description | „Jeden Monat schaue ich auf Ihre Zahlen, verbessere Seiten und Formulare, baue Landingpages für Aktionen und plane Inhalte. Sie erhalten einen kurzen Bericht: was passiert ist, was es gebracht hat, was als Nächstes kommt." |
| Problems | Website live, danach Stillstand · Werbebudget ohne erkennbare Wirkung · keine Zeit für Inhalte und Social Media |
| Deliverables | Auswertung mit cookieloser Statistik · Conversion-Optimierung (Formulare, Seiten, Handlungsaufforderungen) · Landingpages · A/B-Tests (bei ausreichend Besuchern) · Content- und Social-Media-Planung `[Umfang bestätigen]` · Monatsbericht · Google/Meta Ads: **Phase 2**, mit Partner |
| Process | Monatlicher Zyklus: messen → priorisieren → umsetzen → berichten |
| Ideal client | Bestehende Kunden nach dem Launch; ab `[1.500]` €/Monat |
| Proof angle | None yet. Reza's six-month Meta digital-marketing training is background, not proof. First retainer client becomes the case. |
| FAQ topics | Mindestlaufzeit · Was ist im Bericht · Schalten Sie Anzeigen |
| CTA | „Wachstumsbetreuung besprechen" (offered at launch handover, not on cold pages) |

### 5.6 KI-Integration & Automatisierung (AI-Powered Workflows & Automation) · Secondary

| Element | Copy / content |
| --- | --- |
| Name | KI-Integration & Automatisierung |
| One-line promise | „KI dort, wo sie Ihrem Team messbar Zeit spart." |
| Short description | „Ich verbinde Ihre Website und Ihre Abläufe mit KI-Bausteinen, die eine klar umrissene Aufgabe übernehmen: Anfragen vorsortieren, Standardfragen beantworten, Texte vorbereiten, Daten zwischen Systemen übertragen. Immer mit Mensch in der Kontrolle und mit Blick auf Datenschutz." |
| Problems | Gleiche Fragen per Mail und Telefon jeden Tag · Anfragen ohne die nötigen Angaben · Daten von Hand von System A nach System B · Unsicherheit, wo KI überhaupt hilft |
| Deliverables | Prozess-Check: wo lohnt sich Automatisierung (Zeitaufwand heute, Fehlerquote) · Anfrage-Vorqualifizierung im Formular · Assistent auf Basis Ihrer eigenen Inhalte, als KI gekennzeichnet · Workflow-Automatisierung zwischen Ihren Werkzeugen · Auswahl von Anbietern mit Blick auf EU-Datenverarbeitung und AV-Vertrag · Messung der eingesparten Zeit |
| Process | Prozess-Check → Pilot an einem Ablauf → Messung → Ausbau oder Abbruch |
| Ideal client | Bestehende Website/Web-App-Kunden mit wiederkehrenden Standardaufgaben; ab `[2.500]` € als Projekt-Baustein |
| Proof angle | **No AI case study exists.** None of the three projects contains AI features; don't attach the AI label to them. Collect the first pilot as a case. Until then: describe concrete use cases, never results. |
| FAQ topics | Datenschutz bei KI · Kennzeichnungspflicht für Chatbots · Was, wenn die KI Fehler macht · laufende Kosten · Brauche ich das überhaupt |
| CTA | „KI-Einsatz prüfen lassen" (inside the Erstgespräch; phase 2: KI-Potenzial-Check) |

---

## Part 6 · Case study framework

### 6.1 Repeatable structure

Aligned with UX §4.2 and SEO §6.1. German section labels in brackets.

1. **Breadcrumb** (Projekte › Kunde)
2. **Eyebrow:** Branche · Stadt · Jahr
3. **H1:** Kunde: Lösung als Ergebnis (SEO §6.2)
4. **Lead (SEO intro, 2–3 sentences):** who the client is, what was built, for whom it suits
5. **Results band** (Ergebnis auf einen Blick): verified metrics or the honest pending state (6.4)
6. **Fact sheet:** Kunde · Branche · Ort · Leistungen · Meine Rolle · Zeitraum · Live seit · Website ↗
7. **Ausgangslage:** situation before, in the client's terms; client quote if available
8. **Ziel:** what success meant, ideally a measurable target
9. **Ansatz:** 2–4 decisions, each with „Entscheidung" + „Warum"; artefacts
10. **Umsetzung:** features grouped „Für Kunden" · „Für das Team" · „Technik & Datenschutz"; „Technik im Detail" collapsed
11. **Ergebnis:** metrics with source and period, qualitative outcomes the client confirmed, quote
12. **Für wen eignet sich diese Lösung?** (SEO §6.3 generalising paragraph)
13. **Was danach kam:** care plan, next phase
14. **Rolle & Credits**
15. **Final CTA:** „Ähnliches Vorhaben? Lassen Sie uns darüber sprechen."

### 6.2 The three case studies (= SEO §6.2 slugs/H1s)

| Slug | H1 | SEO intro (draft, facts only) |
| --- | --- | --- |
| `/projekte/power-bowls-bestellsystem` | Power Bowls: eigenes Bestellsystem für Tisch, Abholung und Lieferung | „Power Bowls ist ein Restaurant für Bowls und Wraps in Duisburg. Für den Betrieb habe ich `[Rolle bestätigen]` ein eigenes Bestellsystem entwickelt: Gäste bestellen am Tisch per QR-Code, zur Abholung oder zur Lieferung und sehen den Status ihrer Bestellung live. Das Team steuert Speisekarte, Tische, Liefergebiete und Bestellungen in einem eigenen Verwaltungsbereich." |
| `/projekte/foodigastro24-b2b-website` | Foodigastro24: B2B-Website, die Angebotsanfragen von Gastronomen sammelt | „Foodigastro24 beliefert Restaurants, Hotels, Kitas, Pflegeeinrichtungen und Unternehmen mit frischem Obst, Gemüse und ausgewählten Lebensmitteln. Die Website stellt Sortiment und Leistungen für jede Kundengruppe vor und führt Besucher zu einer Angebotsanfrage mit Datenschutz-Einwilligung." |
| `/projekte/rundumdienst-website-neuss` | Rundumdienst: Website für Entrümpelung und Hausmeisterservice, gebaut für lokale Anfragen | „Rundumdienst bietet Entrümpelungen, Gebäudereinigung, Hausmeisterservice, Gartenpflege und Reparaturen in Neuss und Umgebung an. Die Website ist darauf ausgelegt, lokal gefunden zu werden und eine Anfrage so einfach zu machen wie einen Anruf: per Formular, WhatsApp oder Telefon." |

**Must clarify before publishing:** Power Bowls and Foodigastro24 share the address Mercatorstr. 66, Duisburg. If they belong to the same owner or group, say so: „Zweites Projekt für denselben Inhaber" is a stronger trust signal (repeat client) than two seemingly unrelated wins, and hiding it costs trust once noticed (SEO §0).

### 6.3 Homepage cards (Aufgabe / Lösung / Ergebnis)

| Card | Outcome line | Aufgabe | Lösung | Ergebnis (until metrics exist) |
| --- | --- | --- | --- | --- |
| Power Bowls · Gastronomie, Duisburg | Ein eigenes Bestellsystem für drei Bestellwege. | `[Ausgangslage vom Kunden: wie kamen Bestellungen vorher an?]` | Web-App mit Tischbestellung per QR-Code, Abholung, Lieferung und Live-Status | „3 Bestellwege in einem System · In Messung seit `[Monat Jahr]`" |
| Foodigastro24 · B2B-Lebensmittel, Duisburg | Eine B2B-Website, die Angebotsanfragen bündelt. | `[Ausgangslage bestätigen]` | Leistungsseiten je Kundengruppe, Anfrageformular mit Einwilligung | „Live seit `[Monat Jahr]` · `[Anfragen/Monat – Kunde bestätigt]`" |
| Rundumdienst · Haus- & Gebäudeservice, Neuss | Lokal gefunden werden, einfach anfragen. | `[Ausgangslage bestätigen]` | Local-SEO-Grundlage, Einsatzgebiet mit Karte, Formular, WhatsApp, Anruf | „8 Orte im Einsatzgebiet ausgewiesen · `[Ranking „Entrümpelung Neuss", gemessen am Datum]`" |

### 6.4 Rules for honest results

1. **A number needs a source, a period and written client approval.** Otherwise it doesn't exist.
2. **Without business metrics, show verifiable facts:** „Live seit …", features shipped (from `projects.ts`), number of order or contact paths, service area named, self-hosted fonts.
3. **Technical metrics Reza can measure himself are allowed** with tool and date: „PageSpeed Insights mobil: `[x]` (gemessen am `[Datum]`)". Re-measure before each update. Never for Power Bowls SEO until rendering is verified.
4. **Qualitative outcomes only in the client's words** and with approval („Bestellungen kommen jetzt direkt über das eigene System" only if the client confirms it).
5. **Pending is a designed state, not an apology:** „In Messung. Ergebnisse folgen im `[Monat Jahr]`."
6. **Never borrow the client's own claims or reviews as Reza's proof.** Rundumdienst's customer reviews praise Rundumdienst, not the website. Foodigastro24's „25 Jahre Erfahrung" is theirs.
7. **Role clarity:** „Konzept, Design, Entwicklung: Reza Alami" only for what he did. `role` is `null` for all three today.

**Evidence to collect per project:** Reza's exact role · launch month · before-state (screenshot via client or Wayback Machine, with permission) · one business number (orders/month via own system, quote requests/month, calls or WhatsApp clicks) with period · one named quote with photo · permission to name the client · PageSpeed values with date.

---

## Part 7 · Trust & credibility content

### 7.1 Experience without exaggeration

Say what is true, in order of buyer relevance, without years until Reza confirms them.

> „Ich habe Softwaretechnik studiert `[Abschluss, Hochschule, Jahr bestätigen]`, mich in Deutschland rund ein Jahr beruflich in Softwareentwicklung weitergebildet und danach als Webentwickler gearbeitet. Über ein Stipendium habe ich eine sechsmonatige Weiterbildung im digitalen Marketing bei Meta absolviert `[exakten Programmnamen bestätigen]`. Heute verbinde ich beides: Websites und Web-Apps, die technisch sauber gebaut und auf Anfragen ausgelegt sind."

**Role titles:** „Software Engineer · AI Specialist · Web & App Developer · Digital Marketer" appear in this order in the hero byline, founder section, `/ueber` header, LinkedIn and `Person.jobTitle`. Each needs one line of evidence on `/ueber`: Software Engineer ← studies and professional training in Germany · AI Specialist ← professional AI work across design, development and marketing · Web & App Developer ← professional web development and three live client projects · Digital Marketer ← six-month Meta digital-marketing training.

Rules: no „über X Jahre Erfahrung" until dates exist; „Meta-Weiterbildung", not „Meta-zertifiziert" unless a certificate exists; no client count, only named projects.

### 7.2 Testimonials

- **Format:** 2–4 sentences, specific (what changed), full name, role, company, photo; video with subtitles if possible. Never anonymous, never edited beyond typos, approved in writing.
- **Where:** case study (from 1 quote), service page near „Investition", contact page beside the form, homepage section only with ≥ 2 (UX §03.09).
- **When to ask:** 30 days after launch (STRATEGY §08), and again after the first measurable result.
- **No Review/AggregateRating markup** for self-collected quotes (SEO).

**Request email (German):**

> **Betreff:** Kurze Bitte: zwei Sätze zu unserem Projekt
>
> Guten Tag Herr/Frau `[Name]`,
>
> Ihre `[Website/Ihr Bestellsystem]` ist jetzt seit `[x]` Wochen live. Ich hoffe, sie bewährt sich im Alltag.
>
> Darf ich Sie um eine kurze Einschätzung bitten? Zwei bis drei Sätze reichen. Diese Fragen helfen vielleicht:
>
> 1. Was war vor dem Projekt das größte Problem?
> 2. Was hat sich seitdem geändert, gern mit einem Beispiel oder einer Zahl?
> 3. Wie war die Zusammenarbeit?
>
> Ich würde Ihre Antwort mit Ihrem Namen, Ihrer Funktion und `[Firmenname]` auf meiner Website zeigen, gern auch mit einem Foto von Ihnen. Vor der Veröffentlichung schicke ich Ihnen den Text zur Freigabe. Wenn Sie lieber nicht namentlich genannt werden möchten, ist das völlig in Ordnung – sagen Sie mir einfach Bescheid.
>
> Und falls es passt: Eine Bewertung auf Google hilft mir ebenfalls sehr: `[Link zum Google-Unternehmensprofil]`
>
> Vielen Dank und viele Grüße
> Reza Alami

Store the approval (date, channel) in content, per UX §4.3.

### 7.3 Tools and technology

Technology is proof, not the pitch. Sales pages say what it does for the client („lädt schnell, gehört Ihnen, läuft ohne Baukasten-Abo"). Case studies list real stacks in „Technik im Detail" (Power Bowls: React, Vite, Tailwind CSS; Foodigastro24 and Rundumdienst: HTML, CSS, JavaScript, PHP). **Don't claim „alle Projekte mit Next.js"**: the three client projects aren't. This site itself is Next.js, which is what `/so-gebaut` shows. `/ueber` lists only tools Reza confirms (`technologies` groups are `pending`).

### 7.4 Process credibility

Show artefacts, not adjectives: a sample timeline, an anonymised proposal excerpt, a launch handover checklist, a redirect-map excerpt (Relaunch page). Copy: „So sieht eine Übergabe bei mir aus:" + list (Zugänge, Dokumentation, Einweisung, Weiterleitungsliste, Messziele).

### 7.5 Proof near CTAs

| CTA location | Proof line next to it |
| --- | --- |
| Hero | „Antwort innerhalb von 24 Stunden" + byline photo |
| After projects | the three live links directly above |
| Service „Investition" | matching project + quote (when available) + „Code und Inhalte gehören Ihnen." |
| Contact form | „Sie sprechen direkt mit mir." + photo + one quote (when available) |
| Schnellcheck | sample video thumbnail `[Beispielvideo aufnehmen]` |
| Footer | „Gehostet in der EU · Ohne Tracking-Cookies" (only if true) |

---

## Part 8 · Lead-generation system

### 8.1 CTAs by intent (= UX §6.2)

| Intent | CTA | Microcopy |
| --- | --- | --- |
| High (ready) | **Erstgespräch vereinbaren** | „30 Minuten · kostenlos · per Video oder Telefon" |
| Medium (has project) | **Projekt anfragen** | „Fünf kurze Fragen, ca. 3 Minuten." |
| Low (researching) | **Schnellcheck anfordern** | „Persönliches Video zu Ihrer Website in 48 Stunden. Kostenlos." |

### 8.2 Inquiry form (= UX §6.3, with refinements)

Fields, labels and hints as UX. Refinements:

- **Q1 „Worum geht es?"** options: Neue Website · Relaunch einer bestehenden Website · Web-App, Bestell- oder Buchungssystem · SEO & Sichtbarkeit · KI oder Automatisierung · Etwas anderes. **≠ UX:** adds the AI option so those inquiries are measurable, and names ordering/booking systems (owners don't think „Web-App").
- **Q4 Budget (conditional):**
  - Website/Relaunch/Web-App: 5.000–10.000 € · 10.000–20.000 € · 20.000–40.000 € · über 40.000 € · Noch unklar (= UX)
  - SEO: SEO-Audit (ab `[990]` €) · Laufende Betreuung (ab `[1.200]` €/Monat) · Noch unklar
  - KI: unter 5.000 € · 5.000–15.000 € · Noch unklar
  - Hint (= UX): „Projekte starten in der Regel ab `[7.500]` €. Das hilft mir, Ihnen einen passenden Vorschlag zu machen."
- **Optional qualification question (internal value, adds ~10 s):** „Wer entscheidet über das Projekt?" · Ich allein · Gemeinsam mit `[Geschäftsführung/Partner]` · Ich bereite die Entscheidung vor. Filters projects without a decision maker (STRATEGY §04). Make it optional.
- **Optional: „Wie sind Sie auf mich aufmerksam geworden?"** Google · Empfehlung · LinkedIn · Andere. Closes the attribution gap of cookieless analytics.

### 8.3 Form microcopy

| State | Copy |
| --- | --- |
| Submit | **Anfrage senden** · „Antwort innerhalb von 24 Stunden (werktags)." |
| Privacy line | „Ihre Angaben verwende ich nur zur Bearbeitung Ihrer Anfrage. Mehr dazu in der Datenschutzerklärung." |
| Field errors | = UX §6.3 |
| Server error | = UX §6.3 |
| Success H1 | „Danke – Ihre Anfrage ist angekommen." (= UX) |
| Next steps | = UX §6.3 („So geht es weiter", 3 steps) |
| Schnellcheck success | „Ihr Schnellcheck ist eingeplant." (= UX §6.4) |

### 8.4 Auto-reply email (inquiry)

> **Betreff:** Ihre Anfrage ist angekommen – so geht es weiter
>
> Guten Tag `[Vorname Nachname]`,
>
> danke für Ihre Anfrage zu `[Projektart]`. Ich habe sie erhalten und lese sie persönlich.
>
> **So geht es weiter:**
> 1. Ich melde mich innerhalb von 24 Stunden (werktags) bei Ihnen, meist mit zwei, drei Rückfragen.
> 2. Wenn es passt, sprechen wir 30 Minuten über Ziele, Umfang und Budget. Einen Termin können Sie auch direkt buchen: `[Buchungslink]`
> 3. Danach erhalten Sie eine Einschätzung mit Zeitplan und Preisrahmen.
>
> Zur Vorbereitung (optional): Notieren Sie sich drei Websites, die Ihnen gefallen, und die Kennzahl, die sich verbessern soll – zum Beispiel Anfragen pro Monat.
>
> Ihre Angaben im Überblick:
> `[Zusammenfassung der Formularfelder]`
>
> Viele Grüße
> Reza Alami
> `dotMind · [Telefon] · [Website]`
>
> `[Impressumsangaben gemäß Pflichtangaben für geschäftliche E-Mails – rechtlich prüfen lassen]`

### 8.5 WhatsApp and direct contact

**DSGVO implications (not legal advice, have it checked):** WhatsApp is operated by Meta; messages and metadata are processed by Meta, partly outside the EU. For business use: use the **WhatsApp Business app or API on a business number**, not a private account; don't sync the whole address book (contacts who never agreed would be shared); mention WhatsApp in the Datenschutzerklärung; use a **plain `wa.me` link, not an embedded widget**, so nothing loads before the click; **never the only channel**; and ask people **not to send sensitive data** (critical for Praxen: no health data via WhatsApp).

**Wording (contact page, under phone and email):**

> **Lieber per WhatsApp?** Schreiben Sie mir unter `[Nummer]`.
> „Für WhatsApp gelten die Datenschutzbestimmungen von Meta. Bitte senden Sie darüber keine sensiblen Daten. Alternativ erreichen Sie mich per E-Mail oder über das Formular."

**Direct contact block:** „Sie erreichen mich direkt: `[E-Mail]` · `[Telefon]` · Mo–Fr `[Uhrzeiten]`. Antwort innerhalb von 24 Stunden (werktags)."

**Client sites (Rundumdienst-style WhatsApp buttons):** the same rules apply to what Reza builds for clients; put them in the launch checklist.

### 8.6 Lead magnets and diagnostic offers

| Offer | Copy hook | Phase |
| --- | --- | --- |
| **Website-Schnellcheck (kostenlos)** | „Schicken Sie mir Ihre Website. Ich sehe sie mir persönlich an und sende Ihnen innerhalb von 48 Stunden ein kurzes Video mit den drei wichtigsten Hebeln." (= UX) | 1 |
| **Website-Check (490 €, wird angerechnet)** | „Zwei Stunden Analyse von Anfragewegen, SEO, Ladezeit und Messung – als Video und schriftliche Maßnahmenliste. Der Betrag wird bei einem Projekt voll angerechnet." | 1 |
| **Website-Relaunch-Checkliste (PDF)** | „30 Punkte, die Sie vor dem Go-live prüfen sollten – inklusive Weiterleitungen und SEO-Migration." (= SEO title) | 1.5 (month 2) |
| **Kostenrechner** | „Was kostet Ihre Website? Seiten, Funktionen, Sprachen auswählen – und eine ehrliche Preisspanne erhalten." | 1.5 (month 3) |
| **KI-Potenzial-Check** | „Zehn Fragen zu Ihren Abläufen. Danach wissen Sie, wo Automatisierung Zeit spart – und wo nicht." | 2 |

### 8.7 Schnellcheck nurture (only with double opt-in)

| Day | Subject | Content |
| --- | --- | --- |
| 0 | „Ihr Schnellcheck-Video ist da" | Video link, three levers, link to Erstgespräch |
| 3 | „Wie ein Restaurant in Duisburg Bestellungen bündelt" | Power Bowls case study (or the one closest to their URL's industry) |
| 7 | „Was kostet eine Website wirklich?" | Price drivers, ab-prices, link to `/website-kosten` when live |
| 14 | „Sollen wir die drei Punkte gemeinsam angehen?" | Personal, short, booking link; last email unless they reply |

---

## Part 9 · Content funnel

Titles for `/wissen` follow SEO §10 and the cannibalization rules (SEO §3.3): articles own informational modifiers (Checkliste, Vergleich, „oder"), service pages own „lassen/Agentur". Every article links to exactly one money page.

| Stage | Format | German titles | Links to |
| --- | --- | --- | --- |
| **Awareness** (problem) | Wissen articles, LinkedIn posts | „Warum Ihre Website keine Anfragen bringt: 12 Ursachen und wie Sie sie prüfen" (= SEO) · „Google-Unternehmensprofil für Dienstleister: Die Einrichtung, die Anfragen bringt" (= SEO) · „Barrierefreiheitsstärkungsgesetz (BFSG): Was gilt für Ihre Unternehmenswebsite?" (= SEO; facts checked, no legal advice) | Website, SEO |
| **Consideration** (options) | Comparison articles, checklist | „Website-Relaunch-Checkliste: 30 Punkte vor dem Go-live (mit PDF)" (= SEO) · „Eigenes Bestellsystem oder Lieferportal? Provision, Kosten und Kontrolle im Vergleich" (= SEO) · „Baukasten, Freelancer oder Agentur? Die ehrliche Entscheidungshilfe für KMU" (= SEO) · „WordPress oder individuelle Entwicklung: Was 2027 für KMU-Websites sinnvoll ist" (= SEO) | Website, Relaunch, Web-App |
| **Decision** (vendor) | Utility pages, process artefacts | `/website-kosten`: „Was kostet eine Website? Kostenrechner & ehrliche Preise für KMU" (= SEO) · `/so-gebaut`: „So ist diese Website gebaut" · on `/ueber` or `/leistungen`: „So läuft ein Projekt mit mir ab – mit Beispiel-Zeitplan" · „10 Fragen, die Sie jedem Webdesigner vor dem Auftrag stellen sollten" | Erstgespräch |
| **Case studies** | `/projekte/*` + LinkedIn breakdowns | Three in Part 6.2. LinkedIn: „Drei Bestellwege, ein System: wie das Bestellsystem für Power Bowls aufgebaut ist" · „Warum eine lokale Website acht Orte nennt – und keine Stadtseiten hat" (Rundumdienst) | Matching service |
| **SEO articles (later)** | Q3+ (= SEO §10.2) | „Website-Relaunch ohne Rankingverlust: Weiterleitungen richtig planen" · „QR-Code-Tischbestellung im Restaurant: Ablauf, Kosten, Fallstricke" | Relaunch, Web-App |
| **AI thought leadership** | **LinkedIn in phase 1** (no `/wissen` AI page until 2 AI case studies, = SEO §10.3) | „Fünf Aufgaben im Betrieb, die sich heute sinnvoll automatisieren lassen – und drei, die nicht" · „Ein Chatbot auf der Website: wann er hilft und wann er Kunden vergrault" · „KI und Datenschutz: sieben Fragen, die KMU vor jedem KI-Werkzeug klären sollten" · „Wie KI-Suchmaschinen Ihre Website lesen – und was Sie dafür tun können" · Phase 2 on-site: „KI im Kundenservice: 5 Automatisierungen, die sich für KMU rechnen" (= SEO) | Erstgespräch; phase 2 KI page |

**Never** (= SEO §10.3): developer tutorials, generic SEO-Tipps listicles, AI-generated bulk articles. Every article opens with a 1–2 sentence direct answer (AEO, SEO §11.3) and shows „Stand: `[Monat Jahr]`".

---

## Part 10 · German-first multilingual strategy

**Phase 1: German only, no switcher** (= UX §8.2). Write once, well, in German. English follows in phase 2, Arabic and Persian in phase 3 (STRATEGY §09).

### 10.1 Translation order

1. **EN, phase 2:** homepage, Web-App and Website service pages, the three case studies, `/ueber`, `/kontakt`. These serve international founders and expat business owners. Skip Wissen articles (SEO §10.3).
2. **AR and FA, phase 3:** homepage, one service page per target need (likely Website and Web-App for diaspora-owned businesses in DACH, e.g. gastronomy), contact. Only with a native copywriter or reviewer per language.
3. Legal pages: Impressum and Datenschutz must be legally valid in German. Translations are courtesy versions; have them reviewed.

### 10.2 Localize, don't translate

| Item | Rule |
| --- | --- |
| Keywords | Research per language and market. Don't translate „Website erstellen lassen". |
| Headlines and taglines | Rewrite for the language's rhythm (examples below). |
| Prices | Same amounts; locale formatting (`7.500 €` / `€7,500`); state „netto/zzgl. USt." consistently `[bestätigen]`. |
| Dates, numbers, phone | `Intl` formatting; Persian/Arabic digits only if native reviewers prefer them in business context (often Latin digits for prices). |
| Examples | Keep real projects; frame them for the audience („a restaurant in Duisburg, Germany"). |
| Legal/trust terms | DSGVO → „GDPR" in EN; explain „Impressum" in EN once. AV-Vertrag → „data processing agreement (DPA)". |
| CTAs | Natural idiom: „Book a free call", not „Arrange first conversation". |
| Testimonials | Never translate silently. Show the original with a marked translation („Übersetzt aus dem Deutschen"). |
| Social proof figures | Identical across languages. |

### 10.3 Tone preservation per language

| Language | Formality | Notes | Example (hero brand line) |
| --- | --- | --- | --- |
| DE | „Sie", calm, concise | Reference voice | „Moderne Websites, Apps und KI-Erlebnisse, die Kunden überzeugen." |
| EN | Professional „you", plain British/International English, no hype | Shorter; avoid American sales cadence („Let's crush it") | „Modern websites, apps and AI experiences that win customers." |
| AR | Modern Standard Arabic, respectful and neutral; avoid dialect and over-ornate phrasing | Address with plural/neutral forms; keep Latin brand and tech names in `<bdi>` | „مواقع إلكترونية تكسب ثقة العملاء، وبرمجيات تخفّف العبء عن فريقك." **[needs native review]** |
| FA | Formal „شما" with plural verb forms, standard written Persian; avoid colloquial | Correct ZWNJ (نیم‌فاصله), Persian ی/ک | „وب‌سایت‌هایی که مشتری را قانع می‌کنند. نرم‌افزاری که بار کار تیم شما را سبک می‌کند." **[needs native review]** |

Rules: one native reviewer signs off every AR/FA page; brand name, client names and „Reza Alami" stay in Latin script; AI translation is a draft, never the published version.

---

## Part 11 · AI & marketing positioning

### 11.1 How to describe AI realistically

AI is a capability inside the services (STRATEGY §02), described by the task it does, the human control around it and the time it saves. Three places it shows up:

| Area | Realistic description (German) |
| --- | --- |
| Web (projects) | „Formulare, die fehlende Angaben nachfragen, bevor die Anfrage bei Ihnen landet." · „Ein Assistent, der Fragen zu Öffnungszeiten, Liefergebieten oder Preisen aus Ihren eigenen Inhalten beantwortet – als KI gekennzeichnet." |
| SEO | „Strukturierte Inhalte und Daten, die Google und KI-Suchmaschinen eindeutig verstehen." |
| Marketing | „Textentwürfe, Auswertungen und Inhaltspläne schneller – geprüft und freigegeben von Menschen." |
| Internal (how Reza works) | „Ich nutze KI-Werkzeuge in Entwurf und Entwicklung. Jede Zeile Code und jeder Text wird von mir geprüft." |

### 11.2 Banned empty claims → concrete replacements

| Banned | Replacement |
| --- | --- |
| „KI-gestützte Websites" | „Websites mit Anfrage-Assistent, der Standardfragen beantwortet" |
| „KI-Erlebnisse" (outside the brand line) | the specific feature and who uses it |
| „Mit KI Ihr Business revolutionieren" | „Wo KI in Ihrem Betrieb Zeit spart – und wo nicht" |
| „Intelligente Automatisierung" | „Anfragen landen sortiert in Ihrem Postfach, mit allen nötigen Angaben" |
| „KI-Agentur" / „KI-Experte" | „KI als Baustein in Websites und Web-Apps" |
| „Spart 80 % Zeit" (without data) | „Gemessen wird die eingesparte Zeit pro Woche – vorher und nachher." |
| „DSGVO-konforme KI" (blanket) | „Anbieter mit EU-Datenverarbeitung und AV-Vertrag, wo verfügbar; Prüfung durch Ihren Datenschutzbeauftragten" |

### 11.3 Outcome framing

Formula: **task → who saves time → how it's measured.** Example: „Der Assistent beantwortet Fragen zu Liefergebieten und Öffnungszeiten. Ihr Team nimmt weniger Routineanrufe an. Gemessen wird die Zahl der beantworteten Fragen und der Anrufe pro Woche."

### 11.4 How AI connects the services

Website (structured content, inquiry pre-qualification) → Web-App (automating manual steps, assistants for team or customers) → SEO (content clean enough for AI search and answer engines) → Wachstumsbetreuung (faster analysis and content production with human review). One sentence for the homepage: „KI setze ich dort ein, wo sie messbar Zeit spart – in Ihren Abläufen, nicht als Etikett."

### 11.5 Trust language for DSGVO and the EU AI Act (not legal advice)

Use these lines; have legal statements checked by counsel or the client's data-protection officer.

- „Ich setze KI nur mit Ihrer Zustimmung ein und kläre vorher, welche Daten verarbeitet werden und wo."
- „Assistenten auf Ihrer Website werden klar als KI gekennzeichnet." (Transparency obligations for AI that interacts with people come from the EU AI Act; check the current scope and dates with counsel.)
- „Wo möglich, nutze ich Anbieter mit Datenverarbeitung in der EU und AV-Vertrag."
- „Keine Gesundheitsdaten, Ausweisdaten oder Zahlungsdaten in KI-Werkzeugen ohne gesonderte Prüfung."
- „Sie behalten die Kontrolle: Jede Automatisierung lässt sich abschalten, und ein Mensch prüft, was nach außen geht."
- Avoid: „AI-Act-konform", „rechtssicher", „100 % DSGVO-konform". Reza can't certify these.

---

## Part 12 · Final deliverables

### 12.1 Homepage copy outline (German, all 12 sections)

Target 900–1,400 visible words (SEO §4.4). `[ ]` = placeholder.

**Meta (= SEO §4.1/4.2):** Title `Webdesign & Web-Apps für KMU | dotMind · Reza Alami` · Description „Websites, die Anfragen bringen, und Web-Apps, die Handarbeit ersetzen – für inhabergeführte Unternehmen. Antwort in 24 Std. Jetzt Erstgespräch vereinbaren."

**01 Hero**
- H1 line 1 (small): Webdesign & Web-Apps für Unternehmen in Ratingen
- H1 line 2: Moderne Websites, Apps und KI-Erlebnisse, die Kunden *überzeugen.*
- Lead: Ich gestalte, entwickle und vermarkte Websites und Web-Apps für inhabergeführte Unternehmen. Für mehr Anfragen aus Ihrer Region, eigene Bestell- und Buchungssysteme und weniger Handarbeit – mit KI dort, wo sie messbar Zeit spart.
- [Erstgespräch vereinbaren] · [Projekte ansehen] · „30 Minuten · kostenlos · Antwort in 24 Std."
- Micro-proof: Antwort innerhalb von 24 Stunden · Projekte für Gastronomie, B2B-Handel und lokale Dienstleister live · Ratingen bei Düsseldorf
- Byline: Reza Alami · Software Engineer · AI Specialist · Web & App Developer · Digital Marketer · second line: Ich betreue jedes Projekt persönlich.
- Visual caption: Power Bowls · Bestellsystem, Duisburg →

**02 Proof strip** (`aria-label="Ausgewählte Kunden"`)
- Power Bowls · Gastronomie, Duisburg · 3 Bestellwege in einem System
- Foodigastro24 · B2B-Lebensmittel, Duisburg · Leistungsseiten je Kundengruppe, Angebotsanfrage online
- Rundumdienst · Haus- & Gebäudeservice, Neuss · Einsatzgebiet mit 8 Orten
- Upgrade each to a measured figure with date when available.

**03 Problem**
- Label: Ausgangslage · H2: Gute Website. Kaum Anfragen?
- „Unsere Website sieht ordentlich aus – aber über sie meldet sich kaum jemand." → Website & Relaunch
- „In unserer eigenen Stadt finden uns Kunden bei Google nicht." → SEO & Sichtbarkeit
- „Bestellungen und Anfragen kommen per Telefon, Mail und WhatsApp – und wir tippen alles von Hand ab." → Web-Apps & Portale
- Bridge: Das sind selten Designprobleme. Meist fehlt die Verbindung zwischen Gestaltung, Technik und Vertrieb. Genau dort setze ich an. *(≠ UX: „Es sind Systemprobleme – und die löse ich." sounds like a boast; this version explains.)*

**04 Leistungen**
- Label: Leistungen · H2: Website, Web-App und SEO aus einer Hand.
- Lead: Drei Leistungen, ein Ziel: mehr qualifizierte Anfragen und weniger Handarbeit.
- Rows as Part 3.5 (headline, description, 4 includes per UX §03.04, price, link).
- Quiet line: Für Kunden nach dem Launch außerdem: Wartung & Hosting · KI-Integration · Wachstumsbetreuung →

**05 Ausgewählte Projekte**
- Label: Projekte · H2: Echte Betriebe, live im Einsatz.
- Intro: Part 3.6.
- H3s: „Power Bowls: eigenes Bestellsystem in Duisburg" · „Foodigastro24: B2B-Website für einen Frischelieferanten" · „Rundumdienst: lokale Website für Neuss und Umgebung"
- Cards: Part 6.3. Links „Case Study lesen →" + live link.
- Closing row: [Erstgespräch vereinbaren] · „Alle Projekte →"

**06 Der Unterschied**
- Label: Der Unterschied · H2: Ein Ansprechpartner statt drei Dienstleister.
- Lead: Agentur, Freelancer, Baukasten – oder ein Partner, der für das Ergebnis geradesteht. Ein fairer Vergleich:
- Table = UX §03.06 (categories only, factual, § 6 UWG).

**07 Ablauf**
- Label: Ablauf · H2: So läuft Ihr Projekt ab.
- Lead: Part 3.6. Steps = UX §03.07 with durations `[ ]`.
- `→ P2:` „Sie erhalten" column unchanged; „Gemeinsam klären wir" stays.

**08 Founder**
- Label: Über Reza Alami · H2: Ich verantworte Ihr Projekt – von der Analyse bis zur Sichtbarkeit bei Google.
- Role line under the H2: Software Engineer · AI Specialist · Web & App Developer · Digital Marketer
- P1: Ich habe Softwaretechnik studiert `[ ]` und als Webentwickler gearbeitet. In einer sechsmonatigen Weiterbildung bei Meta `[Programm bestätigen]` kam das digitale Marketing dazu. Seitdem sehe ich jede Website aus zwei Richtungen: Ist sie sauber gebaut? Und bringt sie Anfragen?
- P2: Bei mir gibt es keine Übergaben zwischen Designer, Entwickler und SEO-Dienstleister. Sie sprechen von der ersten Analyse bis nach dem Launch mit mir. Deshalb übernehme ich maximal `[4]` neue Projekte pro Quartal.
- Signature: Reza Alami, Gründer dotMind · „Mehr über mich →"
- `→ P2:` H2 „Ein Team, ein Ansprechpartner – von der Analyse bis zur Sichtbarkeit bei Google."; section shrinks, network strip added.

**09 Testimonials** (only with ≥ 2 real quotes)
- Label: Stimmen · H2: Was Kunden sagen.

**10 Website-Schnellcheck**
- Label: Kostenloser Website-Schnellcheck · H2: Noch nicht bereit für ein Gespräch?
- Lead + form + microcopy = UX §03.10.

**11 FAQ**
- Label: FAQ · H2: Häufige Fragen zu Kosten, Ablauf und Datenschutz.
- Questions 1–8 from 12.5 · closing link „Ihre Frage ist nicht dabei? Schreiben Sie mir →"

**12 Final CTA + footer**
- H2: Lassen Sie uns über Ihr Projekt sprechen.
- Lead: 30 Minuten, kostenlos, ohne Verkaufsdruck. Wenn es nicht passt, sage ich das ehrlich.
- [Erstgespräch vereinbaren] · „Lieber schriftlich? Projekt anfragen →" · `[E-Mail]` · „Nächster freier Projektstart: `[Monat]`"
- Footer line: dotMind · Webdesign, Web-Apps & SEO für inhabergeführte Unternehmen · Gehostet in der EU · Ohne Tracking-Cookies `[beides bestätigen]`

### 12.2 Service-page copy outlines

Template = UX §2.3 / SEO §5.2 (10 sections, 1,200–2,000 words). Below: the copy that differs per page. Shared sections (Schnellcheck strip, final CTA) use the CTA library.

#### A. `/leistungen/website-erstellen-lassen` (Lead)

- **Title / H1 (= SEO):** `Website erstellen lassen – für mehr Anfragen | dotMind` · „Website erstellen lassen, die aus Besuchern Anfragen macht"
- **Lead (keyword in first 100 words):** Wenn Sie eine Website erstellen lassen, soll sie mehr können als gut aussehen. Ich plane Struktur und Texte, gestalte und entwickle ohne Baukasten und baue technisches SEO und Messung von Anfang an ein. Für inhabergeführte Unternehmen, bei denen ein neuer Kunde die Investition schnell trägt.
- **Price line:** ab `[7.500]` € · Festpreis nach Analyse `[bestätigen]`
- **Passt, wenn …** Ihre Website Anfragen bringen soll · Sie selbst oder Ihre Geschäftsführung entscheiden · Sie bereit sind, Fakten und Freigaben zu liefern
- **Passt nicht, wenn …** Sie einen Onepager unter 3.000 € suchen · ein Baukasten-Template reicht · niemand im Unternehmen Zeit für Abstimmungen hat
- **Problem → Ergebnis:** „Niemand meldet sich über die Website." → klare Wege zur Anfrage auf jeder Seite · „Wir wissen nicht, was die Website bringt." → Messung jedes Kontaktwegs ohne Tracking-Cookies · „Auf dem Handy ist alles umständlich." → mobil zuerst gestaltet
- **Leistungsumfang (H3 groups):** Strategie & Inhalte · Design & Nutzerführung · Entwicklung · Sichtbarkeit & Messung (items from Part 5.1) · „Code und Inhalte gehören Ihnen."
- **Passendes Projekt:** Foodigastro24 (second: Rundumdienst)
- **Ablauf, Investition, FAQ:** process = UX §03.07; price drivers: Anzahl Seitentypen · Funktionen (Formulare, Buchung, Mehrsprachigkeit) · Inhalte (vorhanden oder neu); add-on Wartung ab `[149]` €/Monat; FAQ: Dauer · CMS/Selbstpflege · Texte · Hosting · Wem gehört der Code · BFSG
- **CTA:** Erstgespräch vereinbaren · „Website-Projekt anfragen"

#### B. `/leistungen/website-relaunch` (Lead)

- **Title / H1 (= SEO):** `Website-Relaunch ohne Rankingverlust | dotMind` · „Website-Relaunch: neu aufbauen, Rankings behalten"
- **Lead:** Ein Website-Relaunch ist die Chance, aus einer veralteten Seite ein Vertriebswerkzeug zu machen. Das Risiko: verlorene Rankings und tote Links. Ich plane jeden Relaunch mit Bestandsaufnahme, Weiterleitungsplan und Messung vorher und nachher.
- **Passt, wenn …** Ihre Website 5+ Jahre alt ist oder auf einem Baukasten/Plugin-Flickwerk läuft · Sie bei Google bereits gefunden werden und das behalten wollen · Sie die Seite wieder selbst verstehen möchten
- **Problem → Ergebnis:** „Niemand traut sich, die Seite anzufassen." → sauberer, dokumentierter Neuaufbau · „Wir haben Angst um unsere Rankings." → Weiterleitung für jede alte URL vor dem Go-live · „Die Seite ist langsam." → Ladezeit als Zielwert im Angebot
- **Leistungsumfang extra:** Bestandsaufnahme aller URLs und Rankings · Weiterleitungsplan · Inhaltsmigration · Kontrolle nach dem Launch (`[x]` Wochen)
- **Artefact:** excerpt of a redirect map `[aus echtem Projekt, anonymisiert]`
- **Passendes Projekt:** `[Relaunch-Fall: war eines der drei Projekte ein Relaunch? bestätigen]`; otherwise Foodigastro24 as build example and a clear note that relaunch proof follows
- **FAQ:** Verliere ich Rankings · Wie lange dauert ein Relaunch · Was kostet ein Relaunch · Können Inhalte übernommen werden · WordPress-Relaunch
- **CTA:** Erstgespräch vereinbaren · tertiary „Relaunch-Checkliste herunterladen" (from month 2)

#### C. `/leistungen/web-app-entwicklung` (Lead; includes UX and KI sections)

- **Title / H1 (= SEO):** `Web-App entwickeln lassen: Portale & Tools | dotMind` · „Web-App entwickeln lassen: Software, die Handarbeit ersetzt"
- **Lead:** Bestellungen per Telefon, Termine in Excel, Aufträge in WhatsApp-Verläufen: Viele Betriebe verlieren jeden Tag Stunden mit Abtippen. Wenn Sie eine Web-App entwickeln lassen, bekommen Sie ein System, das genau zu Ihrem Ablauf passt – mit einer Oberfläche für Ihre Kunden und einer für Ihr Team.
- **Price line:** ab `[15.000]` €
- **Passt, wenn …** ein Ablauf sich täglich wiederholt · Standard-Software nicht passt oder Provision kostet · Sie die Daten selbst besitzen wollen
- **Passt nicht, wenn …** eine Standard-Software für 50–100 € im Monat Ihren Ablauf schon abdeckt (dann sage ich Ihnen das)
- **Problem → Ergebnis:** „Bestellungen kommen über fünf Kanäle." → ein System, ein Eingang · „Wir zahlen Provision für jede Bestellung." → eigener Bestellweg `[Provisionsersparnis nur mit Kundenzahlen]` · „Nur eine Person versteht die Excel-Liste." → Verwaltungsbereich mit Rechten für das Team
- **Leistungsumfang:** Part 5.2, H3 „Design & Nutzerführung" (from 5.4), H3 „KI-Integration: Anfragen vorqualifizieren, Assistenten, Automatisierung" (= SEO §5.1; copy from 5.6, 3 use cases, clearly „optional")
- **Passendes Projekt:** Power Bowls (feature groups: Für Gäste · Für das Team · Technik & Datenschutz)
- **FAQ:** Eigenentwicklung oder Standard-Software · Laufende Kosten · Wem gehört die Software · Wie lange bis zum ersten nutzbaren Stand · Schnittstellen · Datenschutz · KI: muss das sein
- **CTA:** Erstgespräch vereinbaren · „Ablauf schildern – ich schätze den Aufwand ein"

#### D. `/leistungen/seo` (Lead)

- **Title / H1 (= SEO):** `SEO & Local SEO für Unternehmen | dotMind` · „SEO & Sichtbarkeit: gefunden werden, wo Ihre Kunden suchen"
- **Lead:** Wer in Ihrer Stadt nach Ihrer Leistung sucht, sollte Sie finden. Ich prüfe Technik, Inhalte, lokale Signale und Ihr Google-Unternehmensprofil, setze die wichtigsten Maßnahmen um und berichte jeden Monat, was sich verändert hat.
- **Price line:** SEO-Audit ab `[990]` € · Betreuung ab `[1.200]` €/Monat
- **Passt nicht, wenn …** Sie eine Platz-1-Garantie erwarten (die seriös niemand geben kann) · Ergebnisse in zwei Wochen nötig sind
- **Problem → Ergebnis:** „Konkurrenz rankt, wir nicht." → Audit zeigt die Gründe, priorisiert · „Google-Profil halb gepflegt." → vollständiges Profil, Bewertungsprozess · „Wir wissen nicht, was SEO bringt." → Bericht mit Suchbegriffen, Klicks und Anfragen
- **Expectations block:** „Erste Veränderungen sehen Sie oft nach einigen Wochen, belastbare Ergebnisse in der Regel nach 3–6 Monaten." (= SEO §1.4 timeline; phrase as typical, not promise)
- **Passendes Projekt:** Rundumdienst (Local-SEO-Grundlage; rankings `[messen]`)
- **FAQ:** Wie lange dauert SEO · Garantie · Audit vs. Betreuung · Local SEO und Google-Bewertungen · KI-Suche · Kündigung
- **CTA:** „SEO-Audit anfragen" · Erstgespräch vereinbaren

#### E. UX-Design & Nutzerführung (capability; no page in phase 1)

- Section on A, B, C: H3 „Design & Nutzerführung" · Copy: Bevor ich gestalte, kläre ich, wer Ihre Seite besucht und welcher Schritt zur Anfrage führt. Sie sehen Struktur und Wireframes, bevor ein Pixel Design entsteht, und testen einen klickbaren Prototyp.
- Phase-2 page (only with startup/product demand): H1 „UX-Design für Web-Apps: Oberflächen, die Ihr Team und Ihre Kunden verstehen" · proof: Power Bowls admin + order flow, with artefacts.

#### F. Wachstumsbetreuung (secondary; block on `/leistungen`)

- H3: Wachstumsbetreuung · ab `[1.500]` €/Monat
- Copy: Nach dem Launch messe ich jeden Monat, was Ihre Website bringt, verbessere Seiten und Formulare, baue Landingpages und plane Inhalte. Sie erhalten einen kurzen Bericht: was passiert ist, was es gebracht hat, was als Nächstes kommt. Anzeigenbetreuung (Google, Meta) folgt ab `[Phase 2]` mit einem festen Partner.
- CTA: „Wachstumsbetreuung besprechen"

#### G. KI-Integration & Automatisierung (secondary; section on C + block on `/leistungen`)

- H3: KI-Integration & Automatisierung · ab `[2.500]` € als Projekt-Baustein
- Copy: Ich setze KI dort ein, wo sie eine klar umrissene Aufgabe übernimmt: Anfragen vorsortieren, Standardfragen beantworten, Daten zwischen Systemen übertragen. Erst ein Pilot an einem Ablauf, dann messen, dann entscheiden. Assistenten sind als KI gekennzeichnet, und Sie behalten die Kontrolle.
- Phase-2 page `/leistungen/ki-automatisierung`: H1 „KI-Automatisierung für KMU: weniger Routine, mehr Zeit für Kunden" (only after 2 AI case studies).

#### H. `/leistungen/wartung-hosting` (secondary; = SEO)

- H1: „Wartung, Hosting & Sicherheit für Ihre Website" · ab `[149]` €/Monat
- Lead: Updates, Überwachung, Backups und kleine Änderungen zum festen Monatspreis. Damit Ihre Website schnell, sicher und aktuell bleibt, ohne dass Sie daran denken müssen.
- Included: Sicherheitsupdates · Verfügbarkeitsüberwachung · tägliche Backups `[bestätigen]` · `[x]` Stunden Änderungen/Monat · EU-Hosting · AV-Vertrag · Reaktionszeit `[x]`
- CTA: „Wartungsplan anfragen"

### 12.3 Case-study template (fill-in)

```markdown
Slug: /projekte/[kunde]-[lösung]            (SEO §6.2)
Title: [Lösung] für [Branche] in [Ort]: [Kunde] | dotMind
Eyebrow: [Branche] · Ratingen · [Jahr]
H1: [Kunde]: [Lösung als Ergebnis]          (only claims backed by facts)
Lead (2–3 Sätze): [Wer ist der Kunde?] [Was wurde gebaut?] [Für wen/welchen Ablauf?]

Ergebnis auf einen Blick (3):
- [Wert] · [Bezeichnung] · [Quelle, Zeitraum, vom Kunden freigegeben am …]
- ODER Fakten: Live seit [Monat Jahr] · [Anzahl] Bestell-/Kontaktwege · [PageSpeed mobil x, gemessen am Datum]
- ODER: „In Messung. Ergebnisse folgen im [Monat Jahr]."

Steckbrief: Kunde [Name, Link] · Branche · Ort · Leistungen [Links] · Meine Rolle [ ] · Zeitraum [ ] · Live seit [ ]

## Ausgangslage
[Wie lief es vorher? Was hat es gekostet – Zeit, Geld, Kunden? 2–3 kurze Absätze, in den Worten des Kunden.]
> „[Zitat]" – [Vorname Nachname], [Funktion], [Firma]   (nur mit Freigabe)

## Ziel
[Was sollte sich ändern? Möglichst messbar: z. B. Bestellungen ohne Abtippen, Anfragen aus der Region.]

## Ansatz
**Entscheidung:** [ ] — **Warum:** [ ]
**Entscheidung:** [ ] — **Warum:** [ ]
[Artefakt: Skizze / Wireframe / Sitemap / Vorher–Nachher, mit Bildunterschrift]

## Umsetzung
**Für Kunden/Gäste:** [Funktionen]
**Für das Team:** [Funktionen]
**Technik & Datenschutz:** [z. B. selbst gehostete Schriften, Einwilligung im Formular]
<details>Technik im Detail: [nur tatsächlich genutzte Technologien]</details>

## Ergebnis
[Kennzahlen mit Kontext · qualitative Ergebnisse in Kundenworten · Zitat]

## Für wen eignet sich diese Lösung?
[1 Absatz: ähnliche Betriebe, ähnliche Abläufe]

## Was danach kam
[Wartung, nächste Ausbaustufe]

Rolle & Credits: [Konzept, Design, Entwicklung: Reza Alami] · [Fotos: ] · [Texte: ]
CTA: Ähnliches Vorhaben? Lassen Sie uns darüber sprechen. [Erstgespräch vereinbaren]
```

### 12.4 CTA library

| Intent | Placement | Button / link | Microcopy |
| --- | --- | --- | --- |
| High | Header (persistent) | Erstgespräch vereinbaren | none |
| High | Hero | Erstgespräch vereinbaren | 30 Minuten · kostenlos · Antwort in 24 Std. |
| High | After projects | Erstgespräch vereinbaren | Ähnliches Vorhaben? |
| High | Service hero | Erstgespräch vereinbaren · „Oder schriftlich anfragen →" | Antwort innerhalb von 24 Stunden |
| High | Final CTA | Erstgespräch vereinbaren | 30 Minuten, kostenlos, ohne Verkaufsdruck. |
| High | Case study end | Erstgespräch vereinbaren | Ähnliches Vorhaben? Lassen Sie uns darüber sprechen. |
| High | Mobile bar | Erstgespräch vereinbaren + Anrufen | none |
| Medium | Service „Investition" | Projekt anfragen / Website-Projekt anfragen / SEO-Audit anfragen / Wartungsplan anfragen | Fünf kurze Fragen, ca. 3 Minuten. |
| Medium | Web-App page | Ablauf schildern – ich schätze den Aufwand ein | Antwort innerhalb von 24 Stunden |
| Medium | Final CTA, FAQ | Lieber schriftlich? Projekt anfragen → | none |
| Medium | Paid check | Website-Check buchen (490 €) | Wird bei einem Projekt voll angerechnet. |
| Low | Homepage §10, service strip, article end | Schnellcheck anfordern | Kostenlos und unverbindlich. Video in 48 Stunden. |
| Low | Relaunch page, articles (month 2+) | Relaunch-Checkliste herunterladen | 30 Punkte als PDF. |
| Low | `/website-kosten` (month 3+) | Kosten berechnen | Ehrliche Preisspanne in 2 Minuten. |
| Navigation | Hero secondary, cards | Projekte ansehen · Case Study lesen → · Alle Projekte → · Mehr über mich → | none |
| Confirmation | `/kontakt/danke` | Termin gleich buchen | none |
| Confirmation | `/website-check/danke` | Nicht warten? Erstgespräch vereinbaren. | none |

Never: „Absenden", „Mehr", „Hier klicken", „Los geht's", „Jetzt starten!".

### 12.5 FAQ library

**Topic list:** Kosten · Dauer · Code-Eigentum · Hosting · DSGVO · nach dem Launch · WordPress/CMS · remote/vor Ort · Texte · Einzelperson/Ausfall · Zahlungsbedingungen · SEO-Garantie · SEO-Dauer · Relaunch-Rankings · Eigenentwicklung vs. SaaS · KI und Datenschutz · Barrierefreiheit/BFSG · Mehrsprachigkeit · Bilder/Fotos · Vertragslaufzeit Wartung.

**Top 10 with draft answers** (answer-first per SEO §11.3; prices = STRATEGY anchors, confirm before launch):

1. **Was kostet eine Website bei Ihnen?**
   Websites beginnen bei `[7.500]` €, Web-Apps bei `[15.000]` €, ein SEO-Audit bei `[990]` €. Der genaue Preis hängt von der Zahl der Seitentypen, den Funktionen und den vorhandenen Inhalten ab. Nach dem Erstgespräch erhalten Sie einen Festpreis für den vereinbarten Umfang `[bestätigen]`. Alle Preise `[netto zzgl. USt. – bestätigen]`.

2. **Wie lange dauert ein Projekt?**
   Eine Website ist in der Regel nach `[6–10]` Wochen live, eine Web-App nach `[x–y]` Wochen für den ersten nutzbaren Stand. Den größten Einfluss hat, wie schnell Inhalte und Freigaben kommen. Den Zeitplan legen wir im Angebot fest.

3. **Gehören mir Code und Inhalte?**
   Ja. Nach vollständiger Bezahlung gehören Ihnen Code, Texte, Gestaltung und alle Zugänge `[Nutzungsrechte vertraglich bestätigen]`. Sie sind nicht an mich gebunden und können mit jedem Entwickler weiterarbeiten.

4. **Wo wird meine Website gehostet?**
   `[Bei einem Anbieter mit Rechenzentrum in der EU – Anbieter nennen]`. Auf Wunsch übernehme ich das Hosting im Rahmen des Wartungsplans, oder die Website läuft auf Ihrem eigenen Konto.

5. **Ist die Website DSGVO-konform?**
   Ich baue Websites datensparsam: Schriften liegen auf dem eigenen Server, die Statistik kommt ohne Tracking-Cookies aus, externe Dienste wie Karten oder Kalender laden erst nach Klick. Die Datenschutzerklärung und die rechtliche Prüfung verantworten Sie bzw. Ihr Datenschutzberater; ich liefere alle technischen Angaben dafür.

6. **Was passiert nach dem Launch?**
   Sie erhalten eine Einweisung und eine Dokumentation. Für Updates, Backups, Überwachung und kleine Änderungen gibt es den Wartungsplan ab `[149]` €/Monat. Wer weiter wachsen will, bucht die Wachstumsbetreuung.

7. **Arbeiten Sie mit WordPress?**
   `[Reza entscheiden: z. B.]` Neue Websites entwickle ich ohne WordPress und Page-Builder, weil sie schneller, sicherer und leichter zu warten sind. Wenn Sie Inhalte selbst pflegen möchten, binde ich `[CMS nennen]` ein. Bestehende WordPress-Seiten übernehme ich bei einem Relaunch inklusive aller Inhalte und Weiterleitungen.

8. **Arbeiten Sie remote oder vor Ort?**
   Überwiegend remote, per Video und Telefon, für Kunden im gesamten DACH-Raum. Im Raum Düsseldorf und Ratingen komme ich für Workshops gern persönlich vorbei.

9. **Sie sind eine Einzelperson. Was, wenn Sie ausfallen?**
   Sie haben einen festen Ansprechpartner, der Ihr Projekt vollständig kennt. Code, Zugänge und Dokumentation liegen bei Ihnen, sodass jederzeit jemand anderes übernehmen kann. Für längere Ausfälle gibt es `[Vertretungsregelung beschreiben]`.

10. **Garantieren Sie Platz 1 bei Google?**
    Nein. Seriös kann das niemand garantieren, weil Google die Rangfolge bestimmt. Ich garantiere eine saubere technische Grundlage, einen klaren Maßnahmenplan und einen monatlichen Bericht, in dem Sie sehen, wie sich Sichtbarkeit und Anfragen entwickeln.

Homepage uses 1–8 (= UX §03.11). 9–10 go on `/ueber` and `/leistungen/seo`.

### 12.6 Content production roadmap (phase 1)

Aligned with STRATEGY §10 (six-week build) and SEO §10.1 (months 2–6). Protect case studies and service pages first.

| When | Reza decides / collects | Write | Owner check |
| --- | --- | --- | --- |
| **Week 1** | Trademark check for dotMind · ab-prices · capacity · role per project · Power Bowls/Foodigastro24 relationship · send testimonial requests (7.2) and metric requests to all three clients · book photo shoot | Hero (12.1 §01), service rows, FAQ 1–3, Power Bowls case study draft | Test the H1 with 3 owners |
| **Week 2** | Keyword validation (SEO §11.2 P0) · tools list for `/ueber` · Wartung scope | Homepage sections 02–12 · `/leistungen/web-app-entwicklung` · `/leistungen/website-erstellen-lassen` | Word count 900–1,400 home, 1,200–2,000 service |
| **Week 3** | Record a Schnellcheck sample video · measure PageSpeed for all three live sites (with date) | `/leistungen/seo` · `/leistungen/website-relaunch` · Foodigastro24 + Rundumdienst case studies | Every number has a source |
| **Week 4** | Booking tool, email provider (EU, AV-Vertrag) · WhatsApp Business decision | `/ueber` · `/kontakt` · form microcopy · auto-reply (8.4) · `/website-check` page · nurture emails (8.7) | Read all forms aloud on mobile |
| **Week 5** | Impressum details, Datenschutz (lawyer or reviewed generator) | `/leistungen` overview with secondary blocks (F, G) · `/leistungen/wartung-hosting` · FAQ 4–10 · Google Business Profile texts | Placeholder check (UX §4.5) |
| **Week 6** | Launch · GBP live · ask the three clients for a credit link (SEO §9.6) | Final proofread · alt texts in German · OG texts | Banned-words search across content files |
| **Month 2** | First testimonials in? Add to case studies | „Website-Relaunch-Checkliste" + PDF · `/so-gebaut` | |
| **Month 3** | | `/website-kosten` copy | |
| **Month 4** | Metric updates from clients | „Eigenes Bestellsystem oder Lieferportal?" | |
| **Month 5** | | „Warum Ihre Website keine Anfragen bringt" · BFSG article | |
| **Month 6** | | „Google-Unternehmensprofil für Dienstleister" · `/branchen/gastronomie` | Review whether phase-2 triggers are met |
| **Ongoing** | 1 LinkedIn post per week (case-study breakdowns, AI use cases from Part 9) | | |

### 12.7 Evidence gaps (launch blockers in bold)

- **Reza's role on each of the three projects** (`role: null`)
- ~~City, contact details, business address~~ done: Ratingen, reza@dotmind.de, +49 176 57799610, Am Kämpchen 8
- **Confirmed ab-prices and payment terms**
- **Permission to name each client; Power Bowls/Foodigastro24 relationship**
- Capacity and next free start date
- Degree details, dates and exact name of the Meta programme
- One business metric and one named quote per client
- Launch month per project; before-state screenshots
- PageSpeed measurements with date
- Tools and tech stack Reza actually uses; whether he writes copy; CMS offer; hosting provider
- Any AI project (none exists, so the AI service stays secondary)
- Founder photos



