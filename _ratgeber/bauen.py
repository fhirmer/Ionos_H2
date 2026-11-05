#!/usr/bin/env python3
"""Baut den Ratgeber (Blog) von h2insektenschutz.de.

Aufruf im Ordner Push_Page_H2:   python3 _ratgeber/bauen.py

Quelle:  _ratgeber/artikel/*.html  (ein Artikel pro Datei, Kopf mit Metadaten)
Ergebnis:
  - ratgeber-<slug>.html   eine Seite pro Artikel
  - ratgeber.html          Übersicht aller Artikel
  - index.html             Block "Aus dem Ratgeber" (die 3 neuesten), zwischen
                           <!-- ratgeber:start --> und <!-- ratgeber:end -->
  - sitemap.xml            Einträge zwischen denselben Markern

Kopf (Header, Navigation, Produkte-Overlay) und Fuß (Footer, WhatsApp, Script)
werden bei jedem Lauf aus gewebearten.html übernommen. Menüänderungen also
dort (und in allen anderen Seiten) machen und danach dieses Skript laufen lassen.

Ordner mit Unterstrich veröffentlicht GitHub Pages (Jekyll) nicht. Dieser
Ordner ist deshalb auf der Website nicht sichtbar.
"""
import html
import json
import math
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUELLE = ROOT / "_ratgeber" / "artikel"
VORLAGE = ROOT / "gewebearten.html"
DOMAIN = "https://h2insektenschutz.de"
CSS_VERSION = "20261105-ratgeber"
PFLICHT = ["titel", "slug", "datum", "beschreibung", "teaser", "bild", "bild_alt"]
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
          "August", "September", "Oktober", "November", "Dezember"]
START, ENDE = "<!-- ratgeber:start -->", "<!-- ratgeber:end -->"


def fehler(text):
    sys.exit("FEHLER: " + text)


def datum_de(d):
    return f"{d.day}. {MONATE[d.month - 1]} {d.year}"


def esc(text):
    return html.escape(text, quote=True)


def lies_artikel(pfad):
    roh = pfad.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->(.*)", roh, re.S)
    if not m:
        fehler(f"{pfad.name}: Metadaten-Kommentar am Anfang fehlt")
    meta = {}
    for zeile in m.group(1).strip().splitlines():
        if ":" in zeile:
            k, v = zeile.split(":", 1)
            meta[k.strip()] = v.strip()
    for k in PFLICHT:
        if not meta.get(k):
            fehler(f"{pfad.name}: Feld '{k}' fehlt")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", meta["slug"]):
        fehler(f"{pfad.name}: slug nur aus a-z, 0-9 und Bindestrich")
    meta["datum"] = date.fromisoformat(meta["datum"])
    meta["geaendert"] = date.fromisoformat(meta.get("geaendert") or meta["datum"].isoformat())
    if not (ROOT / meta["bild"]).is_file():
        fehler(f"{pfad.name}: Bild {meta['bild']} gibt es nicht")
    meta["inhalt"] = m.group(2).strip()
    woerter = len(re.sub(r"<[^>]+>", " ", meta["inhalt"]).split())
    meta["minuten"] = max(1, math.ceil(woerter / 200))
    meta["url"] = f"{DOMAIN}/ratgeber-{meta['slug']}"
    meta["pfad"] = f"/ratgeber-{meta['slug']}"
    return meta


def vorlage_teile():
    s = VORLAGE.read_text(encoding="utf-8")
    a, b = s.index('<header class="site-header">'), s.index("</header>") + len("</header>")
    header = s[a:b].replace(' aria-current="page"', "")
    footer = s[s.index('<footer class="site-footer">'):s.index("</body>")].rstrip()
    if 'href="/ratgeber"' not in header:
        fehler("Menüpunkt Ratgeber fehlt im Header von gewebearten.html")
    return header, footer


def header_aktiv(header):
    return header.replace('<a href="/ratgeber">', '<a href="/ratgeber" aria-current="page">', 1)


def kopf(titel, beschreibung, canonical, bild, og_typ, ld):
    return f"""<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(titel)}</title>
  <meta name="description" content="{esc(beschreibung)}" />
  <link rel="canonical" href="{canonical}" />
  <meta name="theme-color" content="#008080" />
  <link rel="icon" type="image/png" href="images/favicon-h2.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" />
  <link rel="stylesheet" href="css/style.css?v={CSS_VERSION}" />
  <meta property="og:title" content="{esc(titel)}" />
  <meta property="og:description" content="{esc(beschreibung)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:type" content="{og_typ}" />
  <meta property="og:image" content="{DOMAIN}/{bild}" />
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>
<body>
  <!-- Automatisch erzeugt von _ratgeber/bauen.py. Nicht hier ändern, sondern in _ratgeber/artikel/. -->
"""


def karte(a, ebene="h3"):
    return f"""        <a class="ratgeber-karte" href="{a['pfad']}">
          <img src="{a['bild']}" alt="{esc(a['bild_alt'])}" loading="lazy" />
          <span class="ratgeber-karte-text">
            <time datetime="{a['datum'].isoformat()}">{datum_de(a['datum'])}</time>
            <{ebene}>{esc(a['titel'])}</{ebene}>
            <p>{esc(a['teaser'])}</p>
            <span class="ratgeber-weiter">Weiterlesen →</span>
          </span>
        </a>"""


CTA = """  <section><div class="container"><div class="cta-banner fade-in"><h2>Fragen zu Ihrem Insektenschutz?</h2><p>Wir kommen kostenlos zum Aufmaß, beraten Sie persönlich und schicken Ihnen ein transparentes Angebot – in Weiden, Neustadt an der Waldnaab, Amberg und der nördlichen Oberpfalz.</p><div class="hero-actions"><a href="kontakt.html#anfrage" class="btn btn-light btn-large">Kostenloses Aufmaß anfragen</a><a href="tel:+4915115508412" class="btn btn-secondary btn-large" style="background:transparent;color:#ffffff;border-color:#ffffff;">0151 15508412</a></div></div></div></section>
"""


def artikel_seite(a, alle, header, footer):
    org = {"@id": f"{DOMAIN}/#business"}
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BlogPosting", "@id": a["url"] + "#artikel", "headline": a["titel"],
         "description": a["beschreibung"], "image": f"{DOMAIN}/{a['bild']}",
         "datePublished": a["datum"].isoformat(), "dateModified": a["geaendert"].isoformat(),
         "inLanguage": "de-DE", "author": org, "publisher": org,
         "mainEntityOfPage": a["url"], "isPartOf": {"@id": f"{DOMAIN}/ratgeber#blog"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "H2 Insektenschutz", "item": DOMAIN + "/"},
            {"@type": "ListItem", "position": 2, "name": "Ratgeber", "item": DOMAIN + "/ratgeber"},
            {"@type": "ListItem", "position": 3, "name": a["titel"]}]}]}
    andere = [x for x in alle if x["slug"] != a["slug"]][:3]
    mehr = ""
    if andere:
        mehr = ('      <div class="ratgeber-mehr">\n        <h2>Weitere Artikel</h2>\n'
                '        <div class="ratgeber-grid">\n'
                + "\n".join(karte(x) for x in andere)
                + "\n        </div>\n      </div>\n")
    return (kopf(f"{a['titel']} | H2 Insektenschutz", a["beschreibung"], a["url"], a["bild"], "article", ld)
            + "  " + header_aktiv(header) + f"""

  <section class="page-hero"><div class="container">
    <span class="ratgeber-kicker">Ratgeber</span>
    <h1>{esc(a['titel'])}</h1>
    <p class="ratgeber-meta"><time datetime="{a['datum'].isoformat()}">{datum_de(a['datum'])}</time> · H2 Insektenschutz · {a['minuten']} Min. Lesezeit</p>
  </div></section>

  <section><div class="container">
    <article class="ratgeber-artikel">
      <figure class="ratgeber-bild"><img src="{a['bild']}" alt="{esc(a['bild_alt'])}" /></figure>
{a['inhalt']}
    </article>
    <div class="ratgeber-artikel">
{mehr}      <a href="/ratgeber" class="btn-back">← Alle Ratgeber-Artikel</a>
    </div>
  </div></section>

""" + CTA + "  " + footer + "\n</body>\n</html>\n")


def uebersicht(alle, header, footer):
    url = DOMAIN + "/ratgeber"
    beschreibung = ("Tipps rund um Fliegengitter und Insektenschutz: Pflege, Planung und die passende "
                    "Lösung für Fenster und Türen – vom Fachbetrieb aus der Oberpfalz.")
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Blog", "@id": url + "#blog", "url": url, "name": "Ratgeber von H2 Insektenschutz",
         "description": beschreibung, "inLanguage": "de-DE",
         "publisher": {"@id": f"{DOMAIN}/#business"},
         "blogPost": [{"@id": a["url"] + "#artikel"} for a in alle]},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "H2 Insektenschutz", "item": DOMAIN + "/"},
            {"@type": "ListItem", "position": 2, "name": "Ratgeber"}]}]}
    bild = alle[0]["bild"] if alle else "images/stimmung/hero_v20260516.jpg"
    return (kopf("Ratgeber rund um Fliegengitter | H2 Insektenschutz", beschreibung, url, bild, "website", ld)
            + "  " + header_aktiv(header) + """

  <section class="page-hero"><div class="container">
    <h1>Ratgeber</h1>
    <p>Tipps rund um Fliegengitter und Insektenschutz – aus der Praxis unseres Montagebetriebs in der Oberpfalz.</p>
  </div></section>

  <section><div class="container">
    <div class="ratgeber-grid">
""" + "\n".join(karte(a, "h2") for a in alle) + """
    </div>
  </div></section>

""" + CTA + "  " + footer + "\n</body>\n</html>\n")


def ersetze_block(text, neu, datei):
    if text.count(START) != 1 or text.count(ENDE) != 1:
        fehler(f"Marker {START} / {ENDE} in {datei} fehlen oder sind doppelt")
    a, b = text.index(START) + len(START), text.index(ENDE)
    return text[:a] + "\n" + neu + text[b:]


def main():
    alle = [lies_artikel(p) for p in sorted(QUELLE.glob("*.html"))]
    if not alle:
        fehler("keine Artikel in _ratgeber/artikel/")
    slugs = [a["slug"] for a in alle]
    if len(set(slugs)) != len(slugs):
        fehler("ein slug kommt doppelt vor")
    # Neueste zuerst; bei gleichem Datum entscheidet das optionale Feld "reihenfolge" (größer = weiter vorn)
    alle.sort(key=lambda a: (a["datum"], int(a.get("reihenfolge") or 0)), reverse=True)
    header, footer = vorlage_teile()

    for alt in ROOT.glob("ratgeber-*.html"):
        if alt.stem.removeprefix("ratgeber-") not in slugs:
            alt.unlink()
            print("gelöscht:", alt.name)
    for a in alle:
        (ROOT / f"ratgeber-{a['slug']}.html").write_text(artikel_seite(a, alle, header, footer), encoding="utf-8")
    (ROOT / "ratgeber.html").write_text(uebersicht(alle, header, footer), encoding="utf-8")

    idx = ROOT / "index.html"
    teaser = ("  <section aria-labelledby=\"ratgeber-heading\">\n    <div class=\"container\">\n"
              "      <div class=\"section-heading fade-in\">\n        <span class=\"eyebrow\">Ratgeber</span>\n"
              "        <h2 id=\"ratgeber-heading\">Wissen rund um Ihren Insektenschutz.</h2>\n      </div>\n"
              "      <div class=\"ratgeber-grid fade-in\">\n"
              + "\n".join(karte(a) for a in alle[:3])
              + "\n      </div>\n      <div class=\"text-center mt-2\"><a href=\"/ratgeber\" class=\"btn btn-primary\">Alle Artikel ansehen</a></div>\n"
              "    </div>\n  </section>\n  ")
    idx.write_text(ersetze_block(idx.read_text(encoding="utf-8"), teaser, "index.html"), encoding="utf-8")

    sm = ROOT / "sitemap.xml"
    eintrag = lambda loc, d, p: (f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{d}</lastmod>\n"
                                 f"    <changefreq>monthly</changefreq>\n    <priority>{p}</priority>\n  </url>\n")
    neu = eintrag(DOMAIN + "/ratgeber", max(a["geaendert"] for a in alle), "0.7")
    neu += "".join(eintrag(a["url"], a["geaendert"], "0.6") for a in alle)
    sm.write_text(ersetze_block(sm.read_text(encoding="utf-8"), neu + "  ", "sitemap.xml"), encoding="utf-8")

    print(f"{len(alle)} Artikel gebaut:")
    for a in alle:
        print(f"  {a['datum']}  /ratgeber-{a['slug']}  ({a['minuten']} Min.)")


if __name__ == "__main__":
    main()
