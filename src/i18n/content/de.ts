import type { LocaleContent } from "../content-types";

export const de: LocaleContent = {
  profile: {
    expertise: [
      {
        title: "Software Engineering",
        statement: "Das Fundament. Strukturiertes Problemlösen, saubere Architektur und Code, der auch nach dem Launch wartbar bleibt.",
        capabilities: [
          "Softwareentwicklung",
          "Entwicklung von Webanwendungen",
          "Frontend-Entwicklung",
          "Backend & APIs, wo das Projekt es braucht",
          "Moderne Entwicklungs-Workflows",
          "KI-gestützte Entwicklung",
        ],
      },
      {
        title: "Künstliche Intelligenz",
        statement: "Der Multiplikator. KI im gesamten Produktzyklus — von Design und Entwicklung bis zu Marketing und Smart-Home-Technologie.",
        capabilities: [
          "KI-gestützte Websites & Apps",
          "KI im UI/UX-Design",
          "KI-gestützte Entwicklung",
          "KI für Marketing & Content",
          "Smart-Home-Technologie",
          "Intelligente Automatisierung",
        ],
      },
      {
        title: "Web- & App-Entwicklung",
        statement: "Die tägliche Praxis. Schnelle, responsive Websites und Apps, gebaut mit Sorgfalt im Detail und bei der Performance.",
        capabilities: [
          "Moderne responsive Websites",
          "Webanwendungen",
          "Web- & App-Design",
          "UI-Umsetzung",
          "Performance",
          "SEO-bewusste Entwicklung",
          "Interaktive Erlebnisse",
        ],
      },
      {
        title: "Digitales Marketing",
        statement: "Der strategische Blick. Zielgruppe, Botschaft und Weg zur Conversion sind vom ersten Tag an mitgedacht.",
        capabilities: ["Digitale Strategie", "Social Media", "Content", "SEO", "Conversion-Denken", "Online-Präsenz"],
      },
    ],
    aiDomains: [
      {
        title: "Design",
        kicker: "KI × UI/UX",
        description: "KI für schnellere Recherche, Exploration und Prototypen — und Websites und Apps, in denen KI Teil des Erlebnisses ist.",
        points: ["KI-gestütztes UI/UX-Design", "Rapid Prototyping", "KI-gestützte Produkterlebnisse"],
      },
      {
        title: "Entwicklung",
        kicker: "KI × Engineering",
        description: "KI-Funktionen in Websites und Apps, mit KI-gestützten Workflows, die immer von Menschen geprüft werden.",
        points: ["KI-Funktionen in Websites & Apps", "KI-gestützte Entwicklung", "Automatisierung & Integrationen"],
      },
      {
        title: "Marketing",
        kicker: "KI × Wachstum",
        description: "KI für Content, Zielgruppen-Insights und Kampagnen — damit das Gebaute die richtigen Menschen erreicht.",
        points: ["KI-gestützter Content", "Zielgruppen-Insights", "Kampagnenoptimierung"],
      },
      {
        title: "Smart Home",
        kicker: "KI × Wohnraum",
        description: "Geräte, Daten und Oberflächen zu Smart-Home-Erlebnissen verbinden, die sich im Alltag einfach anfühlen.",
        points: ["Smart-Home-Technologie", "Vernetzte Geräte", "Intelligente Automatisierung"],
      },
    ],
    process: [
      { title: "Verstehen", description: "Ziele, Zielgruppe, Rahmenbedingungen — und woran Erfolg gemessen wird." },
      { title: "Planen", description: "Umfang, Struktur, Inhalte und technischer Ansatz — abgestimmt, bevor gebaut wird." },
      { title: "Gestalten", description: "Oberfläche, Hierarchie und Interaktion — schneller erkundet mit KI-gestützten Prototypen." },
      { title: "Bauen", description: "Saubere, barrierearme Umsetzung — KI-gestützt, von Menschen geprüft, in kleinen Schritten geliefert." },
      { title: "Verfeinern", description: "Tests auf allen Geräten, Performance-Optimierung und Feinschliff im Detail." },
      { title: "Launchen", description: "Veröffentlichung, SEO-Grundlagen und eine Übergabe, mit der Sie wirklich arbeiten können." },
    ],
    journey: [
      { title: "Software Engineering", context: "Universität", description: "Studium der Softwaretechnik — das Fundament für alles, was folgt." },
      { title: "Berufliche Weiterbildung", context: "Deutschland", description: "Rund ein Jahr zusätzliche berufliche Weiterbildung in Softwaretechnik und Entwicklung." },
      { title: "Webentwicklung", context: "Berufspraxis", description: "Berufliche Tätigkeit als Webentwickler — Aufbau und Pflege von Websites und Webanwendungen." },
      { title: "Digitales Marketing", context: "Meta · Stipendium", description: "Sechs Monate professionelle Weiterbildung im digitalen Marketing bei Meta im Rahmen eines Bildungsstipendiums." },
      {
        title: "Künstliche Intelligenz",
        context: "Design → Marketing",
        description: "Professionelle Arbeit mit KI in Design, Entwicklung und Marketing — inklusive KI-gestütztem Web- & App-Design und Smart-Home-Technologie.",
      },
      { title: "Selbstständige Praxis", context: "Freiberuflich", description: "Selbstständige Arbeit an KI-, Software-, Web- und Digitalprojekten — von der Idee zum fertigen Produkt." },
    ],
    techGroups: { Frontend: "Frontend", Backend: "Backend", Database: "Datenbanken", AI: "KI", Tools: "Werkzeuge", Design: "Design", Marketing: "Marketing" },
    techItems: {
      "Authentication & form handling": "Authentifizierung & Formularverarbeitung",
      "AI-assisted design & development": "KI-gestütztes Design & Entwicklung",
      "AI for marketing & content": "KI für Marketing & Content",
      "SEO & Local SEO": "SEO & Local SEO",
      "Content & social media": "Content & Social Media",
      "Conversion optimisation": "Conversion-Optimierung",
    },
  },
  projects: {
    powerbowls: {
      category: "Web-App · Online-Bestellung",
      summary:
        "Bestellplattform für ein Bowl- & Wrap-Restaurant in Duisburg — am Tisch per QR-Code, zur Abholung oder Lieferung bestellen und den Status live verfolgen.",
      overview:
        "Power Bowls ist ein Restaurant für frische Bowls & Wraps auf der Mercatorstraße 66 in Duisburg. Die Web-App verbindet die öffentliche Speisekarte mit einem kompletten Bestellablauf — am Tisch, zur Abholung oder geliefert — und einem Admin-Backoffice für den täglichen Betrieb.",
      features: [
        "Drei Bestellarten: am Tisch per QR-Code, Abholung und Lieferung",
        "Live-Bestellstatus mit voraussichtlicher Fertigstellungs- bzw. Lieferzeit",
        "Liefergebiete pro Zone verwaltbar",
        "Kundenkonten: Registrierung, E-Mail-Bestätigung, Einmal-Login-Codes, Passwort-Reset",
        "Favoriten, Bestellhistorie und Stornierung",
        "Admin-Dashboard: Bestellungen, Speisekarte & Kategorien, Foto-Uploads, Tische, Team, Kunden, Nachrichten, Analysen und Einstellungen",
        "Selbst gehostete Schriften — keine Anfragen an Drittanbieter (DSGVO-freundlich)",
        "Installierbare Web-App (Manifest)",
      ],
      role: ["Projektleitung", "UX- & UI-Design", "Frontend- & Backend-Entwicklung", "Admin-Backoffice"],
      challenge:
        "Ein Restaurant mit Vor-Ort-Verzehr, Abholung und Lieferung braucht einen Bestellablauf, den Gäste auf dem Handy in Sekunden verstehen — und ein Backoffice, das das Team auch im Mittagsansturm bedienen kann, ohne von Bestellplattformen abhängig zu sein.",
      solution:
        "Ich habe das Projekt in Etappen geplant und einen Ablauf für alle drei Bestellarten gestaltet: Tisch-QR-Code, Abholung und Lieferung, mit Live-Status, damit Gäste immer wissen, wann ihr Essen fertig ist. Dahinter steht ein Backoffice für Speisekarte, Fotos, Tische, Liefergebiete, Team und Analysen. Kundenkonten mit Einmal-Codes machen Nachbestellungen schnell, und selbst gehostete Schriften halten die App DSGVO-freundlich.",
    },
    foodigastro24: {
      category: "B2B-Website · Lebensmittelversorgung",
      summary:
        "Website für einen B2B-Frischelieferanten, der Restaurants, Hotels, Pflegeheime und Unternehmen mit Obst, Gemüse und ausgewählten Lebensmitteln beliefert.",
      overview:
        "Foodigastro24 beliefert Restaurants, Imbisse, Hotels, Kitas, Pflegeheime, Büros und Unternehmen mit frischem Obst, Gemüse und ausgewählten Lebensmitteln. Die Website präsentiert Sortiment und Leistungen und macht aus Besuchern Angebotsanfragen.",
      features: [
        "Angebotsformular mit DSGVO-Einwilligung, verarbeitet über einen PHP-Handler",
        "Leistungsseiten für Frischware, Catering & Gerichte und Geschäftskunden",
        "Bildergalerie mit Lightbox",
        "Scroll-Animationen beim Einblenden (IntersectionObserver)",
        "Cookie-Banner",
        "Vollständig responsives Layout mit mobiler Navigation",
        "SEO-Metadaten und Open-Graph-Tags",
      ],
      role: ["Projektleitung", "Webdesign", "Frontend-Entwicklung", "Formulare & SEO-Setup", "Logo & Visitenkarte"],
      challenge:
        "Ein B2B-Lieferant bedient sehr unterschiedliche Kunden — Restaurants, Hotels, Kitas, Pflegeheime und Büros. Die Website musste jede Gruppe ansprechen, ein breites Sortiment klar präsentieren und Besuche in konkrete Angebotsanfragen statt Telefonate verwandeln.",
      solution:
        "Ich habe die Seite nach Kundengruppen und Leistungsseiten strukturiert und ein DSGVO-konformes Angebotsformular gebaut, das serverseitig verarbeitet wird. Galerie, Scroll-Animationen und Open-Graph-Tags lassen das Sortiment auf dem Bildschirm und beim Teilen gut aussehen, und ein passendes Logo mit Visitenkarte gibt der Marke einen einheitlichen Auftritt.",
    },
    rundumdienst: {
      category: "Website für lokalen Betrieb · Hausdienste",
      summary:
        "Website zur Kundengewinnung für einen Haus- und Gebäudedienst in Neuss — Entrümpelung, Reinigung, Hausmeisterservice, Gartenpflege und Reparaturen.",
      overview:
        "Rundumdienst bietet Entrümpelungen, Gebäudereinigung, Hausmeisterdienste, Gartenpflege und Reparaturen in Neuss und Umgebung. Die Website ist darauf ausgelegt, lokal gefunden zu werden und ein kostenloses Angebot so einfach wie möglich zu machen — per Formular, WhatsApp oder Telefon.",
      features: [
        "Local SEO: Schema.org-LocalBusiness-Markup mit Leistungskatalog, Öffnungszeiten, Einsatzgebiet und Geokoordinaten",
        "Kontaktformular mit serverseitiger PHP-Verarbeitung",
        "Kontakt per WhatsApp und Click-to-Call",
        "Einsatzgebiet mit eingebetteter Google-Karte",
        "Bereiche für Leistungen, Projekte und Kundenstimmen",
        "Vollständig responsives Layout mit mobiler Navigation",
      ],
      role: ["Projektleitung", "Webdesign", "Frontend-Entwicklung", "Local SEO", "Logo"],
      challenge:
        "Haus- und Gebäudedienste werden lokal gesucht und kurzfristig gebucht. Das Unternehmen musste in Neuss und den umliegenden Orten gefunden werden, und die Kontaktaufnahme sollte so einfach sein wie ein Anruf.",
      solution:
        "Ich habe die Seite für die lokale Suche gebaut: strukturierte LocalBusiness-Daten mit Leistungen, Öffnungszeiten, Einsatzgebiet und Koordinaten, dazu ein Einsatzgebiet mit Karte. Jede Seite bietet drei Kontaktwege — Formular, WhatsApp und Click-to-Call — und das Formular wird serverseitig verarbeitet.",
    },
    "lavin-couture": {
      category: "Onlineshop · Abend- & Brautmode",
      summary:
        "Onlineshop für Abend-, Braut- und Verlobungskleider — Kollektionen, Online-Zahlung, Terminbuchung und ein komplettes Admin-Panel, auf Deutsch, Englisch und Türkisch.",
      overview:
        "Lavin Couture verkauft Abend-, Braut- und Verlobungskleider. Der Shop verbindet einen stimmungsvollen Auftritt mit allem, was die Boutique online braucht: Produktverwaltung, Bestellungen, Zahlung, Rechnungen und Terminbuchung für Anproben.",
      features: [
        "Shop mit Kollektionen für Abend-, Braut- und Verlobungsmode",
        "Produktseiten, Warenkorb und Checkout",
        "Online-Zahlung mit Stripe — oder Bestellung per WhatsApp, wenn die Zahlung deaktiviert ist",
        "Terminbuchung für persönliche Anproben und Kundenbereich",
        "Admin-Panel: Dashboard, Produkte und Bestellungen, geschützter Login",
        "Automatischer Rechnungsdruck für Bestellungen",
        "Drei Sprachen: Deutsch (Standard), Englisch und Türkisch",
        "Dunkles Luxus-Design in Schwarz und Gold mit Seiten- und Scroll-Animationen",
      ],
      role: ["Projektleitung", "Konzept & UX", "UI-Design", "Frontend- & Backend-Entwicklung", "Zahlung & Admin-Panel"],
      challenge:
        "Abend- und Brautmode ist ein emotionaler, hochwertiger Kauf, den Kundinnen meist persönlich tätigen. Der Shop musste sich so exklusiv anfühlen wie eine Boutique, in drei Sprachen funktionieren und der Inhaberin trotzdem einfache Werkzeuge für Produkte, Bestellungen und Anproben geben.",
      solution:
        "Ich habe den Shop in fünf Phasen umgesetzt: Shop-Oberfläche, Datenbank und Admin-Panel, Stripe-Zahlung, automatischer Rechnungsdruck und schließlich Sprachen, Kundenkonten und Terminbuchung. Ein dunkles Design in Schwarz und Gold mit ruhigen Animationen trägt das Luxusgefühl, und ein WhatsApp-Bestellmodus hält den Shop auch ohne Online-Zahlung nutzbar.",
    },
    "garten-glanz": {
      category: "Website · Gartenpflege & Reinigung",
      summary:
        "Markenwebsite mit zwei Portalen — Gartenpflege und Gebäudereinigung — für einen Dienstleister in Köln, mit Live-Preisrechner und Projektgalerien.",
      overview:
        "Garten Glanz bietet Gartenpflege und Gebäudereinigung aus einer Hand. Die Website gibt jeder Leistung ein eigenes Portal mit passenden Inhalten und Werkzeugen, während eine Marke beide verbindet.",
      features: [
        "Geteilte Startseite, die in zwei vollständige Portale führt: Garten und Glanz",
        "Interaktiver Saisonkalender für die Gartenpflege",
        "Vorher-Nachher-Slider",
        "Live-Preisrechner für Reinigungsleistungen",
        "Selbstaktualisierende Projektgalerien — neue Fotos erscheinen ohne Codeänderung",
        "Anfrageformulare, WhatsApp und Click-to-Call",
        "Sitemap, robots.txt, Open Graph und strukturierte Daten",
        "Logo und Markenidentität",
      ],
      role: ["Projektleitung", "Marke & Logo", "UX- & UI-Design", "Frontend-Entwicklung", "SEO"],
      challenge:
        "Ein Unternehmen, zwei sehr unterschiedliche Leistungen: Gartenpflege und Gebäudereinigung. Beides auf einer Seite zu mischen, würde Besucher verwirren; zwei getrennte Websites würden die Marke schwächen.",
      solution:
        "Ich habe eine geteilte Startseite gestaltet, auf der Besucher auf den ersten Blick ihre Leistung wählen und in zwei vollständige Portale unter einer Marke gelangen. Jedes Portal hat eigene Werkzeuge — einen Saisonkalender für den Garten, einen Live-Preisrechner für die Reinigung — und Galerien, die sich bei neuen Fotos selbst aktualisieren, sodass neue Referenzen nie einen Entwickler brauchen.",
    },
    martins: {
      category: "Branding & Webdesign · Hausdienste",
      summary: "Kompletter Markenauftritt für einen Hausmeister- und Gartenservice in Neuss — Logo, Visitenkarte, Flyer und Website-Design.",
      overview:
        "Martin's Hausmeister & Garten Service brauchte einen wiedererkennbaren Auftritt in Print und Web. Die Identität trägt dasselbe Grün, dasselbe Zeichen und denselben Bildstil von der Visitenkarte bis zur Website.",
      features: ["Logo aus Haus, Baum und Herz", "Visitenkarte im Hochformat", "DIN-lang-Flyer, Vorder- und Rückseite", "Website-Design für Desktop und Mobil"],
      role: ["Projektleitung", "Markenidentität & Logo", "Printdesign", "Webdesign"],
      challenge:
        "Ein neuer Hausmeister- und Gartenservice sollte vom ersten Tag an etabliert wirken — auf Visitenkarten, Flyern und online — ohne bestehende Marke, auf der man aufbauen konnte.",
      solution:
        "Ich habe ein Logo entwickelt, das Haus, Baum und Herz verbindet, und jeden Kontaktpunkt auf demselben Grün, demselben Zeichen und demselben Bildstil aufgebaut. Visitenkarte, DIN-lang-Flyer und Website-Design wurden gemeinsam geliefert, sodass die Marke überall gleich aussieht, wo Kunden ihr begegnen.",
    },
    pantochi: {
      category: "Mobile App · Partyspiel",
      summary: "Pantomime-Partyspiel für Gruppen — Teams, Kategorien, Schwierigkeitsstufen, Timer und Punktewertung, als plattformübergreifende App.",
      overview:
        "PantoChi macht aus dem klassischen Pantomime-Spiel eine geführte App: Sie bildet die Teams, wählt die Begriffe, führt den Timer und zählt die Punkte, damit sich die Gruppe aufs Darstellen und Raten konzentrieren kann.",
      features: [
        "2 bis 6 Teams, einstellbare Rundenzahl",
        "Automatischer 90-Sekunden-Timer oder manuelle Zeit von 30 bis 300 Sekunden",
        "15 Kategorien mit 1.445 Begriffen auf drei Schwierigkeitsstufen",
        "Punktewertung mit Zeitbonus für schnelles Erraten",
        "Ein Begriffstausch pro Team und Spiel",
        "Persische Oberfläche von rechts nach links mit eigener Typografie-Skala",
        "Eigenes Logo, Icons und Konfetti-Animationen",
      ],
      role: ["Produktkonzept", "Projektleitung", "UX- & UI-Design", "App-Entwicklung"],
      challenge:
        "Pantomime wird meist mit Zetteln, Stoppuhr und jemandem gespielt, der die Punkte zählt — und irgendwer verliert immer den Überblick. Die App musste all das übernehmen, ohne ein lautes Gruppenspiel zu stören, und sich in einer Sprache von rechts nach links natürlich lesen.",
      solution:
        "Ich habe einen geführten Spielablauf gestaltet: Teams und Runden, Kategorie und Schwierigkeit, Timer und automatische Wertung mit Zeitbonus. 1.445 Begriffe in 15 Kategorien auf drei Stufen halten jedes Spiel frisch, große Buttons und klare Farben funktionieren in einem vollen Raum, und eine eigene persische Schriftskala macht die Oberfläche gut lesbar.",
    },
    fixio: {
      category: "Mobile App · KI für Autoreparatur",
      summary:
        "App für Autofahrer und Werkstätten, die Autoteile per Foto mit KI erkennt, das passende Ersatzteil findet und durch den Einbau führt.",
      overview:
        "FixIO entstand aus einer einfachen Frage: Was, wenn man ein Autoteil fotografiert und sofort weiß, was es ist, welches Ersatzteil passt und wie man es einbaut? Das Projekt verbindet eine mobile App, eine API und ein Computer-Vision-Modell, das auf Autoteile trainiert wurde.",
      features: [
        "Erkennung von Autoteilen per Foto mit einem eigens trainierten YOLOv8-Modell",
        "Suche per Kennzeichen, QR-Code oder Foto-Upload",
        "Fahrzeugprofile nach Marke und Modell",
        "Ersatzteilseiten mit Schritt-für-Schritt-Einbauanleitungen",
        "KI-Assistent, der Fragen zum erkannten Teil beantwortet",
        "Backend mit Authentifizierung, Bild-Upload und PostgreSQL-Datenbank",
        "Komplettes UI-Design in Figma",
      ],
      role: ["Produktkonzept", "Projektleitung", "UX- & UI-Design (Figma)", "App- & API-Entwicklung", "KI-Modelltraining"],
      challenge:
        "Autofahrer und kleine Werkstätten wissen oft nicht genau, welches Teil sie vor sich haben, welches Ersatzteil passt oder wie man es einbaut. Die Antwort darauf braucht Bilderkennung, eine Teiledatenbank und klare Anleitungen — in einer mobilen App.",
      solution:
        "Ich habe ein YOLOv8-Modell auf einem eigenen Autoteile-Datensatz trainiert, das Teile per Foto erkennt, und es mit der Suche per Kennzeichen oder QR-Code kombiniert. Eine Fastify-API mit PostgreSQL speichert Fahrzeuge, Scans und Teile, Schritt-für-Schritt-Anleitungen führen durch den Einbau, und ein KI-Assistent beantwortet Rückfragen. Die gesamte Oberfläche wurde vor der Entwicklung in Figma gestaltet.",
    },
  },
};
