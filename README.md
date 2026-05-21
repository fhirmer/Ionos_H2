# H2 Insektenschutz – Website (Netlify)

Statische, responsive Website für H2 Insektenschutz – fertig zum Upload bei Netlify.

## Upload bei Netlify (drag &amp; drop)

1. Auf [https://app.netlify.com/drop](https://app.netlify.com/drop) gehen.
2. Den **entpackten Ordner `Uploaddatei`** in das Drop-Feld ziehen, nicht eine ZIP-Datei.
3. Bei einer bestehenden Netlify-Seite den Ordner unten auf der Seite **Deploys** in die Deploy-Dropzone ziehen, damit der neue Stand veröffentlicht wird.
4. Netlify erstellt automatisch eine Live-URL bzw. einen neuen Deploy.
5. Optional: eigene Domain (z. B. `h2-insektenschutz.de`) im Netlify-Dashboard verknüpfen.

## Datei- und Ordnerstruktur

```
Uploaddatei/
├── index.html              Startseite
├── leistungen.html         Alle Produkte (Fenster, Türen, Dachfenster, Lichtschacht, Gewebe, Zubehör)
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
- Bilder austauschen: gleiche Dateinamen unter `images/...` ablegen.
- Farben &amp; Look: über CSS-Variablen am Anfang von `css/style.css` zentral steuerbar.
