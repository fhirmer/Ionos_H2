// Skizzen für Fragen und Antworten: einfarbige Strichzeichnungen über currentColor (auch im Dunkelmodus).
//
// Bildsprache – überall gleich, damit man sie einmal lernt und dann wiedererkennt:
//   Wand            hell, gestrichelte Kante
//   Blendrahmen     mittel gefüllt, der feste Rahmen
//   Flügel          hell gefüllt, der bewegliche Teil
//   Insektenschutz  gestrichelte Linie
//   Maß             dünne Linie mit Endstrichen und Beschriftung
//
// Schnitte: **oben = außen**, unten = innen. Beide Seiten sind beschriftet.
// Der Flügel liegt bündig mit dem Blendrahmen oder dahinter – er steht nie davor
// (Hauptkatalog, Zeichnung „Flächenversatz am Fensterflügel“).
(function () {
'use strict';

const svg = (inhalt, titel) => `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${titel}">${inhalt}</svg>`;

// ---------- Bausteine ----------
const wand = (x, y, b, h) => `<rect x="${x}" y="${y}" width="${b}" height="${h}" fill="currentColor" fill-opacity=".12" stroke-width="1.2" stroke-dasharray="3 3"/>`;
const rahmen = (x, y, b, h) => `<rect x="${x}" y="${y}" width="${b}" height="${h}" rx="1.5" fill="currentColor" fill-opacity=".38" stroke-width="1.6"/>`;
const fluegel = (x, y, b, h) => `<rect x="${x}" y="${y}" width="${b}" height="${h}" rx="1.5" fill="currentColor" fill-opacity=".10" stroke-width="1.6"/>`;
const netz = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="2.6" stroke-dasharray="5 4"/>`;
const gewebe = (x, y, b, h) => `<rect x="${x}" y="${y}" width="${b}" height="${h}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
const text = (x, y, t, groesse = 9) => `<text x="${x}" y="${y}" font-size="${groesse}" fill="currentColor" stroke="none" font-family="Arial,Helvetica,sans-serif">${t}</text>`;
const pfeil = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="2"/><path d="M${x2} ${y2}l${x1 < x2 ? -5 : x1 > x2 ? 5 : -3.5} ${y1 < y2 ? -5 : y1 > y2 ? 5 : -3.5}" stroke-width="2"/>`;

// Maßlinie mit Endstrichen; „waagerecht“ legt fest, wie die Striche stehen
const mass = (x1, y1, x2, y2, beschriftung = null) => {
    const senkrecht = x1 === x2;
    const enden = senkrecht
        ? `<path d="M${x1 - 3} ${y1}h6M${x2 - 3} ${y2}h6" stroke-width="1.2"/>`
        : `<path d="M${x1} ${y1 - 3}v6M${x2} ${y2 - 3}v6" stroke-width="1.2"/>`;
    let schrift = '';
    if (beschriftung) {
        const breite = beschriftung.length * 4.6;
        // senkrechte Maße: Text daneben, aber immer im Bild; waagerechte: mittig darüber
        let tx = senkrecht ? (x1 > 60 ? x1 - breite - 5 : x1 + 5) : (x1 + x2) / 2 - breite / 2;
        const ty = senkrecht ? (y1 + y2) / 2 + 3 : Math.max(y1 - 5, 9);
        tx = Math.min(Math.max(tx, 3), 117 - breite);
        schrift = text(tx, ty, beschriftung, 8.5);
    }
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="1.2"/>${enden}${schrift}`;
};

// Seitenangabe im Schnitt: außen oben, innen unten
const seiten = (x = 4) => text(x, 10, 'außen', 8.5) + text(x, 87, 'innen', 8.5);
// Bildunterschrift links unten. Länger als 20 Zeichen wird im 120er-Feld abgeschnitten.
const unterschrift = (t) => text(4, 87, t.length > 20 ? `${t.slice(0, 19)}…` : t, 8.5);

const H2Skizzen = {
    // ---------- Elemente ----------
    fenster: svg(`${rahmen(18, 12, 84, 66)}${fluegel(24, 18, 72, 54)}<path d="M60 18v54M24 45h72" stroke-width="1.4"/>`, 'Fenster'),
    tuer: svg(`${rahmen(34, 6, 52, 78)}${fluegel(39, 11, 42, 73)}<path d="M74 48h5" stroke-width="3"/><path d="M18 84h84" stroke-width="2.4"/>`, 'Tür'),
    lichtschacht: svg(`${wand(8, 6, 104, 12)}${rahmen(16, 24, 88, 56)}<path d="M16 38h88M16 52h88M16 66h88M38 24v56M60 24v56M82 24v56" stroke-width="1.3"/>`, 'Lichtschacht mit Gitterrost'),
    dachfenster: svg(`<path d="M6 72L76 12L114 42" stroke-width="2.4"/>${'<path d="M40 44l30-24 15 19-30 24z" fill="currentColor" fill-opacity=".10" stroke-width="1.6"/>'}<path d="M47 50l30-24" stroke-width="1.3"/>`, 'Dachfenster'),
    stulp: svg(`${rahmen(14, 12, 92, 62)}${fluegel(19, 17, 40, 52)}${fluegel(61, 17, 40, 52)}<path d="M60 17v52" stroke-width="3.4"/>` + unterschrift('kein Mittelpfosten'), 'Stulp: zwei Flügel ohne Mittelpfosten'),
    schiebetuer: svg(`${rahmen(10, 10, 100, 66)}${fluegel(15, 15, 46, 56)}${fluegel(57, 19, 48, 48)}${pfeil(44, 44, 22, 44)}`, 'Schiebetür'),

    // ---------- Flügellage (Horizontalschnitt, oben = außen) ----------
    fluegellage: svg(`${rahmen(8, 34, 22, 30)}${fluegel(30, 34, 22, 30)}<path d="M4 34h52" stroke-width="1" stroke-dasharray="3 3"/>`
        + `${rahmen(68, 28, 22, 30)}${fluegel(90, 42, 22, 24)}<path d="M64 28h52" stroke-width="1" stroke-dasharray="3 3"/>`
        + text(12, 80, 'bündig') + text(74, 80, 'zurück') + text(4, 12, 'außen', 8.5), 'Flügellage im Schnitt: bündig und zurückversetzt, von außen gesehen'),
    buendig: svg(`${rahmen(14, 32, 44, 34)}${fluegel(58, 32, 46, 34)}<path d="M8 32h104" stroke-width="1" stroke-dasharray="3 3"/>` + seiten(), 'flächenbündig: Flügel und Blendrahmen in einer Ebene, von außen gesehen'),
    versetzt: svg(`${rahmen(14, 24, 44, 42)}${fluegel(58, 46, 46, 30)}<path d="M8 24h104" stroke-width="1" stroke-dasharray="3 3"/>${mass(110, 24, 110, 46, 'Versatz')}` + seiten(), 'flächenversetzt: der Flügel liegt hinter dem Blendrahmen, von außen gesehen'),
    halbversetzt: svg(`${rahmen(14, 24, 44, 42)}${fluegel(58, 35, 46, 34)}<path d="M8 24h104" stroke-width="1" stroke-dasharray="3 3"/>${mass(110, 24, 110, 35, 'halb')}` + seiten(), 'halbflächenversetzt: der Flügel liegt etwas hinter dem Blendrahmen, von außen gesehen'),

    // ---------- Überschlag (Profilkante des Blendrahmens) ----------
    ueberschlag: svg('<path d="M10 72V28h22v44" fill="currentColor" fill-opacity=".38" stroke-width="1.6"/>'
        + '<path d="M48 72V28h12l12 12v32" fill="currentColor" fill-opacity=".38" stroke-width="1.6"/>'
        + '<path d="M86 72V28h6q18 0 18 20v24" fill="currentColor" fill-opacity=".38" stroke-width="1.6"/>'
        + text(12, 84, 'gerade', 8) + text(48, 84, 'schräg', 8) + text(84, 84, 'sehr schräg', 8), 'Überschlag: gerade, schräg, sehr schräg'),
    'ueberschlag-gerade': svg('<path d="M32 78V22h52v56" fill="currentColor" fill-opacity=".38" stroke-width="2"/>' + text(4, 14, 'außen', 8.5), 'gerader Blendrahmenüberschlag'),
    'ueberschlag-schraeg': svg('<path d="M32 78V22h30l22 22v34" fill="currentColor" fill-opacity=".38" stroke-width="2"/>' + text(4, 14, 'außen', 8.5), 'schräger Blendrahmenüberschlag'),
    'ueberschlag-sehrschraeg': svg('<path d="M32 78V22h8q44 0 44 42v14" fill="currentColor" fill-opacity=".38" stroke-width="2"/>' + text(4, 14, 'außen', 8.5), 'sehr schräger oder abgerundeter Blendrahmenüberschlag'),

    // ---------- Rollladen und Platz ----------
    rollladen: svg(`<rect x="14" y="6" width="92" height="15" rx="2" fill="currentColor" fill-opacity=".22" stroke-width="1.6"/><path d="M20 21v60M100 21v60" stroke-width="3.4"/><path d="M26 30h68M26 39h68M26 48h68M26 57h68M26 66h68" stroke-width="1.3"/>` + unterschrift('Kasten und Schienen'), 'Rollladen mit Kasten und Führungsschienen'),
    platz: svg(`${rahmen(10, 8, 100, 62)}${fluegel(34, 26, 52, 36)}`
        + `${mass(12, 44, 32, 44, null)}${mass(88, 44, 108, 44, null)}${mass(60, 10, 60, 24, null)}`
        + text(16, 41, '?', 10) + text(96, 41, '?', 10) + text(63, 20, '?', 10)
        + unterschrift('ringsum frei?'), 'Freie Fläche ringsum auf dem Blendrahmen'),
    panzer: svg(`${rahmen(16, 40, 34, 38)}${fluegel(50, 50, 54, 28)}<path d="M44 30h64" stroke-width="4.5" stroke-dasharray="7 3"/>${mass(106, 34, 106, 50, null)}` + text(46, 22, 'Panzer', 8.5) + seiten(), 'Rollladenpanzer eng vor dem Flügel, von außen gesehen'),
    fuehrung: svg(`${rahmen(22, 6, 76, 64)}${fluegel(32, 16, 56, 44)}<path d="M14 6v64M106 6v64" stroke-width="5"/>${pfeil(6, 40, 14, 40)}${pfeil(114, 40, 106, 40)}` + unterschrift('von außen gesehen'), 'Führungsschienen eng am Blendrahmen, von außen gesehen'),
    haengend: svg(`<rect x="14" y="6" width="92" height="13" rx="2" fill="currentColor" fill-opacity=".22" stroke-width="1.6"/><path d="M20 19v62M100 19v62" stroke-width="3.4"/><path d="M26 25h68M26 32h68" stroke-width="1.8"/>${gewebe(26, 42, 68, 32)}${pfeil(60, 34, 60, 46)}` + unterschrift('hängt herunter'), 'Rollladen hängt in die Öffnung'),

    // ---------- Unterer Anschluss ----------
    regenschiene: svg(`${fluegel(44, 8, 34, 44)}${rahmen(14, 52, 92, 18)}<path d="M38 54h42v8h10" stroke-width="3.4"/>` + unterschrift('am Blendrahmen'), 'Regenschiene unten am Blendrahmen'),
    wetterschenkel: svg(`${fluegel(44, 8, 34, 48)}${rahmen(14, 58, 92, 16)}<path d="M78 38h16l-5 14H78z" fill="currentColor" fill-opacity=".38" stroke-width="1.6"/>` + unterschrift('am Flügel unten'), 'Wetterschenkel unten am Flügel'),
    schwelle: svg(`<path d="M4 68h42M74 68h42" stroke-width="2.4"/>${rahmen(46, 58, 28, 10)}${fluegel(52, 10, 18, 48)}` + unterschrift('Schwelle'), 'Türschwelle'),
    trittschutz: svg(`<path d="M4 74h112" stroke-width="2.4"/>${rahmen(36, 60, 48, 14)}<path d="M40 60h40v-7H40z" fill="currentColor" fill-opacity=".55" stroke-width="1.6"/>${fluegel(50, 8, 20, 45)}` + unterschrift('Trittschutzprofil'), 'Trittschutzprofil unten an der Tür'),
    mauerleibung: svg(`${wand(4, 16, 30, 54)}${wand(86, 16, 30, 54)}${rahmen(34, 40, 52, 14)}<path d="M34 16v24M86 16v24" stroke-width="3"/>${mass(34, 28, 20, 28, null)}${mass(86, 28, 100, 28, null)}` + unterschrift('Wandfläche daneben') + text(4, 12, 'außen', 8.5), 'Mauerleibung: Wandfläche neben dem Blendrahmen, von außen gesehen'),

    // ---------- Dachfenster ----------
    innenfutter: svg('<path d="M12 18h96" stroke-width="1.3"/><path d="M30 38l42 22" stroke-width="5"/><path d="M30 38v44M72 60h38" stroke-width="2"/><path d="M30 38L14 28" stroke-width="1.3" stroke-dasharray="4 3"/>' + unterschrift('Innenfutter'), 'Innenfutter am Dachfenster'),

    // ---------- Lichtschacht ----------
    auflage: svg(`${wand(8, 6, 104, 13)}${rahmen(14, 24, 92, 56)}${gewebe(26, 36, 68, 32)}`, 'Auflage der Lichtschachtabdeckung'),
    'auflage-4': svg(`${rahmen(12, 12, 96, 68)}${gewebe(26, 26, 68, 40)}` + text(40, 50, '4 Seiten', 10), 'Auflage auf 4 Seiten'),
    'auflage-3': svg(`${wand(8, 4, 104, 14)}<path d="M14 18v62h92V18" stroke-width="4"/>${gewebe(26, 24, 68, 44)}` + text(36, 50, '3 Seiten', 10), 'Auflage auf 3 Seiten, hinten Hauswand'),
    kellerfenster: svg(`${wand(4, 4, 20, 72)}${fluegel(24, 26, 24, 30)}<path d="M24 18h92" stroke-width="3.4"/>${mass(24, 66, 48, 66, null)}` + unterschrift('Überstand'), 'Kellerfenster steht in den Schacht'),

    // ---------- Bedienarten ----------
    spannrahmen: svg(`${rahmen(18, 8, 84, 74)}${gewebe(26, 16, 68, 58)}<path d="M34 16v58M50 16v58M66 16v58M82 16v58" stroke-width=".8"/>`, 'Spannrahmen, fest eingesetzt'),
    rollo: svg(`<rect x="16" y="6" width="88" height="15" rx="3" fill="currentColor" fill-opacity=".22" stroke-width="1.6"/><path d="M22 21v62M98 21v62" stroke-width="3.4"/>${gewebe(26, 21, 68, 42)}<path d="M26 63h68" stroke-width="3.4"/>${pfeil(60, 76, 60, 60)}`, 'Rollo zum Aufrollen'),
    pendel: svg(`<path d="M8 82h104" stroke-width="2.4"/>${rahmen(40, 10, 40, 72)}${pfeil(60, 46, 26, 46)}${pfeil(60, 46, 94, 46)}`, 'Pendelflügel öffnet in beide Richtungen'),
    dreh: svg(`<path d="M8 82h104" stroke-width="2.4"/>${rahmen(28, 10, 40, 72)}<path d="M68 28q30 10 30 44" stroke-width="1.4" stroke-dasharray="4 3"/>${pfeil(94, 58, 98, 74)}`, 'Drehrahmen öffnet in eine Richtung'),
    plissee: svg(`${rahmen(10, 8, 100, 72)}<path d="M16 12l6 66 6-66 6 66 6-66 6 66" stroke-width="1.4"/><path d="M52 12v66" stroke-width="3.4"/>${pfeil(64, 44, 96, 44)}`, 'Plissee zum seitlichen Falten'),
    schiebe: svg(`<path d="M6 80h108M6 10h108" stroke-width="2"/>${fluegel(12, 14, 52, 62)}${gewebe(56, 18, 52, 54)}${pfeil(88, 44, 108, 44)}`, 'Schiebeanlage'),
    schieberahmen: svg(`<path d="M6 76L86 14" stroke-width="2.4"/><path d="M34 70l52-40 8 10-52 40z" stroke-width="1.6" stroke-dasharray="4 3"/>${pfeil(64, 62, 84, 46)}`, 'Schieberahmen am Dachfenster'),

    // ---------- Einbauweisen ----------
    einbauweise: svg(`${wand(2, 28, 16, 44)}${rahmen(18, 48, 18, 12)}${netz(18, 42, 36, 42)}`
        + `${wand(42, 28, 10, 44)}${wand(70, 28, 10, 44)}${rahmen(52, 48, 18, 12)}${netz(54, 50, 68, 50)}`
        + `${wand(86, 28, 6, 44)}${wand(114, 28, 6, 44)}${rahmen(92, 54, 22, 12)}${netz(92, 38, 114, 38)}`
        + text(16, 84, 'auf', 8) + text(50, 84, 'im', 8) + text(88, 84, 'Leibung', 8), 'Einbauweisen: auf dem Blendrahmen, im Blendrahmen, in der Mauerleibung'),
    amb: svg(`${wand(4, 18, 26, 62)}${wand(90, 18, 26, 62)}${rahmen(30, 48, 60, 16)}${netz(24, 38, 96, 38)}` + seiten(), 'auf den Blendrahmen gesetzt, von außen gesehen'),
    lmb: svg(`${wand(4, 18, 26, 62)}${wand(90, 18, 26, 62)}${rahmen(30, 48, 15, 16)}${rahmen(75, 48, 15, 16)}${netz(45, 52, 75, 52)}` + seiten(), 'in den Blendrahmen eingesetzt, von außen gesehen'),
    lmm: svg(`${wand(4, 18, 26, 62)}${wand(90, 18, 26, 62)}${rahmen(30, 56, 60, 16)}${netz(30, 32, 90, 32)}` + seiten(), 'in die Mauerleibung gesetzt, von außen gesehen'),

    // ---------- Maße ----------
    'mass-seitlich': svg(`<path d="M18 20v58" stroke-width="6"/>${rahmen(24, 20, 30, 58)}${fluegel(54, 20, 50, 58)}${mass(26, 52, 52, 52, null)}` + text(8, 14, 'Schiene', 8) + text(62, 14, 'Flügel', 8) + unterschrift('seitliche Auflage'), 'freie Auflagefläche seitlich am Blendrahmen'),
    'mass-fuehrung': svg(`<path d="M20 14v64" stroke-width="6"/>${rahmen(40, 14, 28, 64)}${fluegel(68, 14, 42, 64)}${mass(24, 46, 40, 46, null)}` + text(8, 12, 'Schiene', 8) + unterschrift('Abstand zum Rahmen'), 'Abstand der Führungsschiene zum Blendrahmen'),
    'mass-oben': svg(`<rect x="10" y="4" width="66" height="13" rx="2" fill="currentColor" fill-opacity=".20" stroke-width="1.4" stroke-dasharray="3 3"/>${rahmen(10, 19, 100, 20)}${fluegel(22, 39, 76, 38)}${mass(66, 19, 66, 39, null)}` + text(80, 14, 'Kasten', 8) + unterschrift('freie Fläche oben'), 'freie Blendrahmenfläche oben über dem Flügel'),
    'mass-tiefe': svg(`${rahmen(10, 56, 100, 18)}<path d="M8 22h104" stroke-width="4.5" stroke-dasharray="7 3"/>${mass(60, 26, 60, 54, 'Tiefe')}` + text(8, 14, 'Rollladen', 8) + unterschrift('Platz davor'), 'Platz vor dem Blendrahmen bis zum Rollladen'),
};

globalThis.H2Skizzen = H2Skizzen;
})();
