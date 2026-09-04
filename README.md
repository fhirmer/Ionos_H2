# H2 Insektenschutz – Website (GitHub Pages)

Statische, responsive Website für H2 Insektenschutz. Die Live-Domain
`https://h2insektenschutz.de` wird über GitHub Pages ausgeliefert.

## Veröffentlichung über GitHub Pages

1. Änderungen im Ordner `Push_Page_H2` prüfen.
2. Beabsichtigte Dateien committen.
3. Den Branch `main` in das Repository `fhirmer/Ionos_H2` pushen.
4. GitHub Pages veröffentlicht den neuen Stand.
5. Anschließend die Live-Domain, `robots.txt` und `sitemap.xml` kontrollieren.

Die Datei `CNAME` verbindet die Veröffentlichung mit
`h2insektenschutz.de`. `netlify.toml` ist eine ältere bzw. optionale
Konfiguration und derzeit nicht der aktive Veröffentlichungsweg.

## Datei- und Ordnerstruktur

```
Push_Page_H2/
├── index.html              Startseite
├── leistungen.html         Alle Produkte (Fenster, Türen, Dachfenster, Lichtschacht, Zubehör, Farben)
├── fliegengitter-fenster.html
│                            Fokussierte Landingpage für Fensterlösungen
├── insektenschutztueren.html
│                            Fokussierte Landingpage für Türenlösungen
├── lichtschachtabdeckungen.html
│                            Fokussierte Landingpage für Lichtschächte
├── gewebearten.html         Fokussierte Landingpage für Gewebearten
├── ueber-uns.html          Team (Rudolf Hügel zuerst, dann Florian Hirmer) und Werte
├── kontakt.html            Kontakt + Anfrageformular (Netlify Forms)
├── danke.html              Bestätigungsseite nach Formularabsendung
├── impressum.html          Impressum
├── datenschutz.html        Datenschutzerklärung
├── netlify.toml            Netlify-Konfiguration (Caching, Headers, saubere URLs)
├── robots.txt              Suchmaschinen-Steuerung
├── sitemap.xml             XML-Sitemap
├── css/
│   └── style.css           Vollständiges, responsives Stylesheet
├── js/
│   └── script.js           Mobile-Menü, Smooth Scroll, Fade-In
└── images/
    ├── h2logo.png          Logo
    ├── favicon.png
    ├── stimmung/           Stimmungsbilder (hero.jpg + 7 weitere)
    ├── produkte/           Produktbilder pro Insektenschutz-Variante
    └── ablauf/             Beratung, Aufmaß, Montage
```

## Wichtige Hinweise vor dem Live-Gang

1. **Impressum**: Anschrift und ggf. USt-IdNr. in `impressum.html` ergänzen.
2. **Datenschutz**: Vorlage von einer fachkundigen Person prüfen lassen (`datenschutz.html`).
3. **Telefon / E-Mail**: aktuell hinterlegt sind `0151 24005954` und `kontakt@h2insektenschutz.de` – bei Änderungen seitenweit anpassen.
4. **Netlify Forms**: Nach dem Deploy einmal die "Form notifications" einrichten, damit Anfragen direkt an `kontakt@h2insektenschutz.de` weitergeleitet werden (Netlify-Dashboard → Forms → Settings &amp; usage → Form notifications).
5. **Domain**: eigene Wunschdomain im Netlify-Dashboard verknüpfen.

## Technik

- 100 % statisches HTML/CSS/JS, keine Frameworks, keine Build-Schritte.
- Vollständig responsiv (Mobile-First), Breakpoints bei 600 / 700 / 768 / 900 / 1000 px.
- SEO-Grundausstattung: Title, Description, Open Graph, Sitemap, robots.txt.
- Performance: Lazy-Loading der Bilder, Caching-Header für Assets.
- Barrierearm: semantisches HTML, ARIA-Attribute am Mobile-Menü, alt-Texte.

## Pflege &amp; Erweiterung

- Texte/Inhalte direkt in den HTML-Dateien anpassen.
- **Der Header ist in allen 11 HTML-Dateien einzeln ausgeschrieben.** Es gibt
  kein Template. Jede Navigationsänderung muss in allen elf Dateien identisch
  nachgezogen werden; der Menüpunkt „Produkte" kommt zusätzlich im Footer vor
  und darf dort nicht mitgeändert werden.
- **Produkte-Overlay:** Der Menüpunkt „Produkte" öffnet ein Overlay mit
  „Alle Produkte" und fünf Produktarten. Es steckt an drei Stellen:
  `css/style.css` (Block „Produkte-Overlay"), `js/script.js` (Block
  „Produkte-Overlay") und als Markup in allen 11 HTML-Dateien direkt hinter
  `</nav>`. Der Markup-Block ist überall identisch, bis auf ein einzelnes
  `aria-current="page"` auf den fünf Produktseiten.
  - „Produkte" bleibt im HTML ein echter `<a href="leistungen.html">`. Ohne
    JavaScript führt der Link ganz normal auf die Produktseite; erst das
    Skript fängt den Klick ab und öffnet stattdessen das Overlay.
  - Die sechs Ziele im Overlay müssen die kanonische Schreibweise der
    Zielseite verwenden: `leistungen.html` **mit** Endung, die vier
    Landingpages **ohne**.
  - Neue Produktseite ergänzen: Eintrag im Overlay in allen 11 Dateien,
    passendes `aria-current` auf der neuen Seite, Eintrag in `sitemap.xml`.
- Die vier Landingpages werden intern und in der Sitemap extensionlos verlinkt,
  obwohl ihre statischen Quelldateien auf `.html` enden. Canonical, Open Graph,
  strukturierte Daten und Sitemap müssen dabei dieselbe extensionlose URL
  verwenden.
- Produkttexte der Landingpages stammen aus `leistungen.html`; die
  Gewebetexte stammen aus `index.html`. Bei Inhaltsänderungen immer Quellseite
  und zugehörige Landingpage gemeinsam prüfen.
- Bilder austauschen: gleiche Dateinamen unter `images/...` ablegen.
- Farben &amp; Look: über CSS-Variablen am Anfang von `css/style.css` zentral steuerbar.
