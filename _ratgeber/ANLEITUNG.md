# Ratgeber: Anleitung für neue Artikel

Diese Datei ist die Arbeitsanweisung für den monatlichen Artikel, egal ob ihn
ein Mensch schreibt oder der geplante Claude-Auftrag. Der Ordner `_ratgeber/`
wird von GitHub Pages nicht veröffentlicht.

## Ablauf (ein Artikel pro Monat)

1. Das oberste offene Thema aus der Themenliste unten nehmen (`[ ]`).
2. Zum Thema recherchieren. Vorrang haben Herstellerangaben (Neher), Behörden
   und Fachstellen vor Ratgeberseiten. Fremde Texte nie übernehmen, nur Fakten.
3. Den Artikel als neue Datei anlegen:
   `_ratgeber/artikel/JJJJ-MM-TT-<slug>.html` (Datum = Tag der Veröffentlichung).
4. `python3 _ratgeber/bauen.py` im Ordner `Push_Page_H2` ausführen.
5. Das Thema in der Liste unten auf `[x]` setzen, mit Datum.
6. Auf einem neuen Branch `ratgeber/<slug>` committen und einen Pull Request
   gegen `main` öffnen. **Nicht direkt auf `main` pushen.** H2 liest den
   Artikel und gibt ihn mit „Merge“ frei.

## Aufbau einer Artikeldatei

```html
<!--
titel: Überschrift des Artikels (wird auch der Seitentitel)
slug: kurzer-name-in-kleinbuchstaben
datum: 2026-12-01
beschreibung: 140–160 Zeichen für Google, mit dem wichtigsten Suchbegriff.
teaser: Ein bis zwei Sätze für die Karte in der Übersicht.
bild: images/produkte/....jpg
bild_alt: Was auf dem Bild zu sehen ist
-->
      <div class="ratgeber-kurz">
        <strong>Das Wichtigste in Kürze</strong>
        <ul><li>...</li><li>...</li><li>...</li></ul>
      </div>
      <p>Einleitung ...</p>
      <h2>Zwischenüberschrift</h2>
      <p>...</p>
      <h2>Unser Fazit</h2>
      <p>...</p>
```

Erlaubt im Text: `p`, `h2`, `h3`, `ul`, `ol`, `li`, `strong`, `a`, sowie
`<div class="ratgeber-hinweis"><p>...</p></div>` für einen gelben Hinweiskasten.
Optional im Kopf: `geaendert: JJJJ-MM-TT` bei späterer Überarbeitung.

## Schreibregeln

- Anrede „Sie“. Kurze Sätze, einfache Wörter, Fachbegriffe kurz erklären.
- Länge: etwa 600 bis 900 Wörter.
- Oben immer „Das Wichtigste in Kürze“ mit 3 Punkten.
- Regionaler Bezug, wo er passt: Weiden, Neustadt an der Waldnaab, Amberg,
  nördliche Oberpfalz.
- 2 bis 3 interne Links, zum Beispiel auf `/fliegengitter-fenster`,
  `/insektenschutztueren`, `/lichtschachtabdeckungen`, `/gewebearten`,
  `kontakt.html#anfrage` oder andere Ratgeber-Artikel (`/ratgeber-<slug>`).
- Keine Links auf fremde Seiten.
- Herstellerangaben als solche kennzeichnen („laut Neher“).
- Am Ende ein kurzes Fazit. Den Kasten zur Anfrage setzt `bauen.py` automatisch.

## Feste Fakten über H2 (nur diese verwenden)

- Montagebetrieb für Insektenschutz von Neher; Inhaber Rudolf Hügel und
  Florian Hirmer (GbR).
- Gebiet: Weiden i.d.OPf., Neustadt an der Waldnaab, Amberg, nördliche Oberpfalz.
- Aufmaß vor Ort ist kostenlos und unverbindlich, danach kommt ein
  kostenloses Angebot. Im Angebot ist alles transparent aufgelistet.
- Von der Bestellung bis zum Einbau meist 3 bis 6 Wochen, im Schnitt etwa 4.
- Fiberglasgewebe ohne Aufpreis; Spezialgewebe kosten je nach Größe mehr.
- Kontakt: 0151 15508412, kontakt@h2insektenschutz.de, WhatsApp.

## Verboten

- **Keine Preise oder Preisspannen** (die Preisseite ist noch nicht öffentlich).
- Keine erfundenen Fakten, Zahlen, Kundenzitate, Studien oder Versprechen.
  Was nicht belegt ist, weglassen.
- Keine Rückdatierung: `datum` ist immer der echte Tag der Veröffentlichung.
- Keine Bildbearbeitung. Nur vorhandene Bilder aus `images/` verwenden,
  unverändert. Ein Bild möglichst nicht zweimal hintereinander verwenden.

## Bilder zur Auswahl

`images/produkte/`: dachfenster, drehfenster, drehtuer, elektrorollo, fenster,
katzenklappe, lichtschacht, pendelfenster, pendeltuer, plissee, rollo,
schiebeanlage, spannrahmen, trittplatte (jeweils `_v20260516.jpg`)
`images/ablauf/`: aufmass-v3.webp, beratung-v2.webp, montage-v2.webp
`images/stimmung/`: hero_v20260516.jpg, stimmung_2.jpg bis stimmung_8.jpg

Eigene Fotos von H2 haben Vorrang, sobald welche in `images/ratgeber/` liegen.

## Themenliste

- [x] 2026-11-05 Fliegengitter im Winter: abnehmen oder dranlassen?
- [x] 2026-11-05 Wann sollte man Fliegengitter bestellen?
- [x] 2026-11-05 Spannrahmen, Drehrahmen, Rollo oder Plissee: Welches Fliegengitter passt?
- [x] 2026-11-05 Fliegengitter richtig reinigen: die Tipps des Herstellers
- [ ] Lichtschachtabdeckung: Was sie bringt (Laub, Schmutz, Kleintiere im Keller)
- [ ] Pollenschutz am Fenster: besser schlafen mit Heuschnupfen
- [ ] Fliegengitter für Dachfenster: Mücken in der Schräge
- [ ] Fliegengitter und Katze: Katzengewebe und Katzenklappe
- [ ] Fliegengitter ohne Bohren: Was geht, was nicht
- [ ] Tigermücke in Bayern: Was Hausbesitzer wissen sollten
- [ ] Insektenschutz für die Terrassentür: Drehtür, Pendeltür, Schiebeanlage oder Plissee
- [ ] Lüften bei Hitze: nachts frische Luft ohne Mücken
- [ ] Wespen am Haus: Wie ein Fliegengitter hilft
- [ ] Fliegengitter und Rollladen: Worauf es bei der Montage ankommt
- [ ] Marienkäfer und Stinkwanzen im Herbst: Warum sie ins Haus wollen
- [ ] Die passende Farbe: Fliegengitter, die zum Fenster passen
