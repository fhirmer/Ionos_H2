// Fragenkatalog des Produktfinders (Phase 2). Beschreibung: Katalog/FRAGENKATALOG.md
//
// Jede Frage beschreibt eine Eigenschaft der Einbausituation. Eine Antwort setzt Labels der
// Wissensbasis auf wahr oder falsch. Daraus folgt nur Sortierung – außer die Antwort trägt eine
// Ausschlussregel (A2–A5) mit Beleg. „Weiß ich nicht“ setzt nichts und schließt nie aus.
//
// modus 'eins': Die Labels einer Variante sind Alternativen („flächenbündig und flächenversetzt“).
// modus 'alle': Die Labels einer Variante gelten zusammen („links und rechts eng“); exakt: diese Labels müssen genau übereinstimmen.
// spezifisch: Eine Ja-Antwort sortiert Varianten nach hinten, die für diese Besonderheit nicht ausgelegt sind.
//
// Sprache und Blickseite (Umbauplan Schritt 1):
// - blick: 'aussen' | 'innen' – von welcher Seite man auf das Element schaut. Die Oberfläche
//   schreibt daraus eine Zeile über die Antwortkarten. Ohne Blickseite ist jede Frage nach
//   Versatz, Abstand oder Auflage zweideutig.
// - frageJe / hilfeJe / hinweisJe: Wortlaut je nach gewähltem Element. `frage` und `hilfe`
//   bleiben element-neutrale Zeichenketten, damit engine.js (Prüfpunkte) und der erzeugte
//   Fragenkatalog unverändert damit arbeiten können.
(function () {
'use strict';

const alsFenster = (a) => a.element === 'fenster' && a.fenstertyp !== 'dach';
const alsTuer = (a) => a.element === 'tuer';
const fensterOderTuer = (a) => a.element === 'fenster' || a.element === 'tuer';
const fassade = (a) => a.element === 'tuer' || alsFenster(a);
const mitRollladen = (a) => fassade(a) && a.rollladen === 'ja';
const system = (a, ...s) => !a.system || a.system === 'egal' || a.system === 'unbekannt' || s.includes(a.system);

// Das gewählte Element in der Form, wie es in einem Satz steht („… auf die geschlossene Tür schauen“)
const elementWort = (a) => (a.element === 'tuer' ? 'die geschlossene Tür'
    : a.element === 'lichtschacht' ? 'den Lichtschacht'
    : a.fenstertyp === 'dach' ? 'das geschlossene Dachfenster'
    : 'das geschlossene Fenster');
// Wortlaut je Element; fehlt ein Eintrag, gilt der Fenstertext
const jeElement = (texte) => (a) => (a.element === 'tuer' ? texte.tuer
    : a.element === 'lichtschacht' ? (texte.lichtschacht ?? texte.fenster)
    : a.fenstertyp === 'dach' ? (texte.dach ?? texte.fenster)
    : texte.fenster);

// Abschnitte des Verlaufs: Der nächste Abschnitt entsteht aus den Antworten des vorherigen.
// `block` bleibt für die Dokumentation erhalten; für die Anzeige zählt `abschnitt`.
const abschnitte = [
    {nr: 1, titel: 'Was soll geschützt werden?', hinweis: 'Element und Bedienung'},
    {nr: 2, titel: 'Wie sieht es vor Ort aus?', hinweis: 'nur Fragen, die die Empfehlung ändern'},
    {nr: 3, titel: 'Wie soll montiert werden?', hinweis: 'Montageort und unterer Abschluss'},
    {nr: 4, titel: 'Feinheiten', hinweis: 'freiwillig – geht auch ohne'},
];

const bloecke = [
    {id: 'A', titel: 'Element'},
    {id: 'G', titel: 'Bedienung'},
    {id: 'B', titel: 'Rahmen'},
    {id: 'C', titel: 'Rollladen und Platz'},
    {id: 'D', titel: 'Unten und Anschluss'},
    {id: 'E', titel: 'Dachfenster'},
    {id: 'F', titel: 'Lichtschacht'},
    {id: 'H', titel: 'Einbauweise'},
    {id: 'J', titel: 'Maße'},
    {id: 'K', titel: 'Wünsche'},
];

const fragen = [
    // A – Element
    {
        id: 'element', abschnitt: 1, block: 'A', pflicht: true, weissNicht: false,
        frage: 'Was bekommt Insektenschutz?',
        antworten: [
            {id: 'fenster', text: 'Fenster', hinweis: 'in der Fassade oder im Dach', skizze: 'fenster'},
            {id: 'tuer', text: 'Tür', hinweis: 'Balkon, Terrasse, Hauseingang', skizze: 'tuer'},
            {id: 'lichtschacht', text: 'Lichtschacht', hinweis: 'Kellerfenster, Gitterrost', skizze: 'lichtschacht'},
        ],
    },
    {
        id: 'fenstertyp', abschnitt: 1, block: 'A', pflicht: true, weissNicht: false,
        zeigen: (a) => a.element === 'fenster',
        frage: 'Welches Fenster?',
        antworten: [
            {id: 'fassade', text: 'Fenster in der Wand', hinweis: 'senkrecht in der Fassade', skizze: 'fenster'},
            {id: 'dach', text: 'Dachfenster', hinweis: 'schräg im Dach', skizze: 'dachfenster'},
        ],
    },
    {
        id: 'tuerart', abschnitt: 1, block: 'A',
        zeigen: alsTuer,
        frage: 'Wie ist die Tür aufgebaut?',
        hilfe: 'Stulptür: zwei Flügel, und beim Öffnen bleibt kein fester Mittelpfosten stehen.',
        labels: ['geometry.stulp_without_fixed_mullion', 'element.sliding_window_or_door'],
        antworten: [
            {id: 'einfluegel', text: 'Ein Flügel', skizze: 'tuer', setzt: {'geometry.stulp_without_fixed_mullion': false, 'element.sliding_window_or_door': false}},
            {id: 'stulp', text: 'Zwei Flügel ohne Mittelpfosten', hinweis: 'Stulptür', skizze: 'stulp', setzt: {'geometry.stulp_without_fixed_mullion': true, 'element.sliding_window_or_door': false}},
            {id: 'schiebe', text: 'Schiebetür', hinweis: 'auch Hebe-Schiebe-Tür', skizze: 'schiebetuer', setzt: {'element.sliding_window_or_door': true}},
        ],
    },

    // B – Rahmen
    {
        id: 'material', abschnitt: 2, block: 'B',
        zeigen: fensterOderTuer,
        frage: 'Aus welchem Material ist der Rahmen?',
        hilfe: 'Das Material sortiert nur. Holz-Alu und Kunststoff-Alu behandelt der Katalog wie Kunststoff.',
        labels: ['material.wood_suitable', 'material.plastic_suitable', 'material.aluminium_suitable'],
        antworten: [
            {id: 'kunststoff', text: 'Kunststoff', setzt: {'material.plastic_suitable': true, 'material.wood_suitable': false}},
            {id: 'holz', text: 'Holz', setzt: {'material.wood_suitable': true, 'material.plastic_suitable': false}},
            {id: 'alu', text: 'Aluminium', setzt: {'material.aluminium_suitable': true, 'material.wood_suitable': false}},
            {id: 'holzalu', text: 'Holz-Alu', hinweis: 'wie Kunststoff', setzt: {'material.plastic_suitable': true, 'material.wood_suitable': false}},
            {id: 'kunststoffalu', text: 'Kunststoff-Alu', hinweis: 'wie Kunststoff', setzt: {'material.plastic_suitable': true, 'material.wood_suitable': false}},
        ],
    },
    {
        id: 'stulpfenster', abschnitt: 2, block: 'B',
        zeigen: alsFenster,
        frage: 'Hat das Fenster zwei Flügel ohne festen Mittelpfosten?',
        hilfe: 'Stulpfenster: Öffnet man beide Flügel, bleibt in der Mitte kein Pfosten stehen.',
        skizze: 'stulp',
        labels: ['geometry.stulp_without_fixed_mullion'],
        antworten: [
            {id: 'ja', text: 'Ja, Stulpfenster', setzt: {'geometry.stulp_without_fixed_mullion': true}},
            {id: 'nein', text: 'Nein', setzt: {'geometry.stulp_without_fixed_mullion': false}},
        ],
    },
    {
        id: 'fluegellage', abschnitt: 2, block: 'B', blick: 'aussen',
        zeigen: (a) => fassade(a) && a.tuerart !== 'schiebe',
        frage: 'Wie liegt der Flügel zum Rahmen?',
        hilfe: 'Von außen seitlich auf das geschlossene Element schauen: Liegt die Außenfläche des Flügels in einer Ebene mit dem festen Rahmen oder dahinter? Der Flügel kann nicht vorstehen – der Blendrahmen überdeckt ihn.',
        hilfeJe: jeElement({
            fenster: 'Von außen seitlich auf das geschlossene Fenster schauen: Liegt die Außenfläche des Flügels in einer Ebene mit dem Blendrahmen oder dahinter? Der Flügel kann nicht vorstehen – der Blendrahmenüberschlag überdeckt ihn.',
            tuer: 'Von außen seitlich auf die geschlossene Tür schauen: Liegt die Außenfläche des Türflügels in einer Ebene mit dem Blendrahmen oder dahinter? Der Flügel kann nicht vorstehen – der Blendrahmenüberschlag überdeckt ihn.',
        }),
        skizze: 'fluegellage',
        labels: ['geometry.sash_flush_with_frame', 'geometry.sash_offset_from_frame', 'geometry.sash_half_offset_from_frame'],
        antworten: [
            {id: 'buendig', text: 'Bündig', hinweis: 'Flügel und Rahmen in einer Ebene', skizze: 'buendig',
                setzt: {'geometry.sash_flush_with_frame': true, 'geometry.sash_offset_from_frame': false, 'geometry.sash_half_offset_from_frame': false},
                schliesstAus: [{art: 'A2', label: 'excluded.when_sash_flush_with_frame', grund: 'nicht für flächenbündige Flügel'}]},
            {id: 'versetzt', text: 'Flügel liegt zurück', hinweis: 'flächenversetzt: der Blendrahmen steht vor', skizze: 'versetzt',
                setzt: {'geometry.sash_offset_from_frame': true, 'geometry.sash_flush_with_frame': false, 'geometry.sash_half_offset_from_frame': false}},
            {id: 'halb', text: 'Flügel liegt halb zurück', hinweis: 'halbflächenversetzt: nur wenig Versatz', skizze: 'halbversetzt',
                setzt: {'geometry.sash_half_offset_from_frame': true, 'geometry.sash_flush_with_frame': false, 'geometry.sash_offset_from_frame': false}},
        ],
    },
    {
        id: 'ueberschlag', abschnitt: 2, block: 'B', blick: 'aussen',
        zeigen: (a) => fassade(a) && a.tuerart !== 'schiebe',
        frage: 'Wie sieht die Außenkante des Blendrahmens aus?',
        hilfe: 'Gemeint ist der Überschlag: die äußere Kante des festen Rahmens, auf der der Insektenschutz aufliegt. Von außen seitlich darauf schauen.',
        skizze: 'ueberschlag',
        labels: ['geometry.frame_overlap_straight', 'geometry.frame_overlap_sloped', 'geometry.frame_overlap_extremely_sloped'],
        antworten: [
            {id: 'gerade', text: 'Gerade', skizze: 'ueberschlag-gerade',
                setzt: {'geometry.frame_overlap_straight': true, 'geometry.frame_overlap_sloped': false, 'geometry.frame_overlap_extremely_sloped': false},
                schliesstAus: [{art: 'A2', label: 'excluded.when_frame_overlap_straight', grund: 'nicht bei geradem Blendrahmenüberschlag'}]},
            {id: 'schraeg', text: 'Schräg', skizze: 'ueberschlag-schraeg',
                setzt: {'geometry.frame_overlap_sloped': true, 'geometry.frame_overlap_straight': false, 'geometry.frame_overlap_extremely_sloped': false}},
            {id: 'sehrschraeg', text: 'Sehr schräg oder stark abgerundet', skizze: 'ueberschlag-sehrschraeg',
                setzt: {'geometry.frame_overlap_extremely_sloped': true, 'geometry.frame_overlap_straight': false},
                schliesstAus: [{art: 'A2', label: 'excluded.when_frame_overlap_extremely_sloped', grund: 'nicht bei extrem schrägem Blendrahmenüberschlag'}]},
        ],
    },
    {
        id: 'sonderform', abschnitt: 2, block: 'B',
        zeigen: alsFenster,
        frage: 'Ist das Fenster rechteckig?',
        labels: ['geometry.special_form_curved_supported', 'geometry.special_form_out_of_square_supported'],
        antworten: [
            {id: 'rechteckig', text: 'Ja, rechteckig'},
            {id: 'sonderform', text: 'Nein: Bogen oder schiefwinklig', setzt: {'geometry.special_form_curved_supported': true, 'geometry.special_form_out_of_square_supported': true}},
        ],
    },

    // C – Rollladen und Platz
    {
        id: 'rollladen', abschnitt: 2, block: 'C',
        zeigen: fassade,
        frage: 'Ist ein Rollladen vorhanden?',
        skizze: 'rollladen',
        labels: ['shutter.present', 'shutter.armour_close_to_sash', 'shutter.guide_close_left', 'shutter.guide_close_right', 'shutter.guide_close_hinge_side', 'shutter.armour_hanging_down'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'shutter.present': true}},
            {id: 'nein', text: 'Nein', setzt: {'shutter.present': false, 'shutter.armour_close_to_sash': false, 'shutter.guide_close_left': false, 'shutter.guide_close_right': false, 'shutter.guide_close_hinge_side': false, 'shutter.armour_hanging_down': false}},
        ],
    },
    {
        id: 'panzer', abschnitt: 2, block: 'C', blick: 'aussen',
        zeigen: mitRollladen,
        frage: 'Liegt der heruntergelassene Rollladen eng am Flügel?',
        hilfe: 'Rollladen ganz herunterlassen und von außen seitlich schauen, wie viel Platz zwischen Panzer und Flügel bleibt.',
        skizze: 'panzer',
        labels: ['shutter.armour_close_to_sash'],
        antworten: [
            {id: 'eng', text: 'Eng, kaum Platz', setzt: {'shutter.armour_close_to_sash': true}},
            {id: 'abstand', text: 'Genug Abstand', setzt: {'shutter.armour_close_to_sash': false}},
        ],
    },
    {
        id: 'fuehrung', abschnitt: 2, block: 'C', blick: 'aussen',
        zeigen: mitRollladen,
        modus: 'alle',
        exakt: ['shutter.guide_close_left', 'shutter.guide_close_right'],
        frage: 'Sitzen die Führungsschienen eng am Blendrahmen?',
        hilfe: 'Von außen seitlich schauen: Bleibt zwischen Führungsschiene und Flügel nur wenig Rahmenfläche frei? Links und rechts gelten von außen gesehen.',
        skizze: 'fuehrung',
        labels: ['shutter.guide_close_left', 'shutter.guide_close_right', 'shutter.guide_close_hinge_side'],
        antworten: [
            {id: 'beide', text: 'Ja, auf beiden Seiten', setzt: {'shutter.guide_close_left': true, 'shutter.guide_close_right': true, 'shutter.guide_close_hinge_side': true}},
            {id: 'links', text: 'Nur links eng', hinweis: 'von außen gesehen', setzt: {'shutter.guide_close_left': true, 'shutter.guide_close_right': false}},
            {id: 'rechts', text: 'Nur rechts eng', hinweis: 'von außen gesehen', setzt: {'shutter.guide_close_right': true, 'shutter.guide_close_left': false}},
            {id: 'nein', text: 'Nein, genug Platz', setzt: {'shutter.guide_close_left': false, 'shutter.guide_close_right': false, 'shutter.guide_close_hinge_side': false}},
        ],
    },
    {
        id: 'haengend', abschnitt: 2, spezifisch: true, block: 'C', blick: 'aussen',
        zeigen: mitRollladen,
        frage: 'Hängt der Rollladen in die Öffnung, auch wenn er ganz hochgezogen ist?',
        hilfe: 'Rollladen ganz hochziehen und von außen schauen, ob die unterste Lamelle noch vor der Öffnung steht.',
        skizze: 'haengend',
        labels: ['shutter.armour_hanging_down'],
        antworten: [
            {id: 'ja', text: 'Ja, er hängt herunter', setzt: {'shutter.armour_hanging_down': true}},
            {id: 'nein', text: 'Nein', setzt: {'shutter.armour_hanging_down': false}},
        ],
    },
    {
        id: 'geteilt', abschnitt: 2, spezifisch: true, block: 'C',
        zeigen: (a) => mitRollladen(a) && a.element === 'tuer',
        frage: 'Ist der Rollladen geteilt (zwei Rollläden nebeneinander)?',
        labels: ['shutter.split_roller_shutter'],
        antworten: [
            {id: 'ja', text: 'Ja, geteilt', setzt: {'shutter.split_roller_shutter': true}},
            {id: 'nein', text: 'Nein', setzt: {'shutter.split_roller_shutter': false}},
        ],
    },

    // D – Unten und Anschluss
    {
        id: 'regenschiene', abschnitt: 2, block: 'D', blick: 'aussen',
        zeigen: alsFenster,
        frage: 'Ist unten am Blendrahmen eine Regenschiene?',
        hilfe: 'Von außen auf die Unterkante schauen. Regenschiene: Alu-Profil unten am festen Rahmen, meist bei Holzfenstern. Die Fensterbank ist keine Regenschiene.',
        skizze: 'regenschiene',
        labels: ['component.rain_rail_present'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'component.rain_rail_present': true}},
            {id: 'nein', text: 'Nein', setzt: {'component.rain_rail_present': false},
                schliesstAus: [{art: 'A4', label: 'component.rain_rail_contact_required', grund: 'dichtet an der Regenschiene ab, es gibt aber keine'}]},
        ],
    },
    {
        id: 'regenschiene_lage', abschnitt: 2, block: 'D', blick: 'aussen',
        zeigen: (a) => alsFenster(a) && a.regenschiene === 'ja',
        frage: 'Liegt die Regenschiene am Blendrahmen an oder steht sie über?',
        hilfe: 'Von außen seitlich schauen: Schließt die Schiene bündig mit der Außenfläche des Blendrahmens ab oder steht sie davor?',
        skizze: 'regenschiene',
        labels: ['component.rain_rail_contact_required', 'component.rain_rail_may_project'],
        antworten: [
            {id: 'anliegend', text: 'Liegt am Blendrahmen an', setzt: {'component.rain_rail_contact_required': true, 'component.rain_rail_may_project': false}},
            {id: 'ueberstehend', text: 'Steht über den Blendrahmen vor', setzt: {'component.rain_rail_may_project': true, 'component.rain_rail_contact_required': false}},
        ],
    },
    {
        id: 'wetterschenkel', abschnitt: 2, block: 'D', blick: 'aussen',
        zeigen: alsFenster,
        frage: 'Ist unten am Flügel ein Wetterschenkel?',
        hilfe: 'Von außen auf die Unterkante des beweglichen Flügels schauen. Wetterschenkel: Leiste unten am Flügel, die Wasser ableitet. Nicht mit der Regenschiene am festen Rahmen verwechseln.',
        skizze: 'wetterschenkel',
        labels: ['component.weather_bar_present', 'component.weather_bar_suitable'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'component.weather_bar_present': true, 'component.weather_bar_suitable': true}},
            {id: 'nein', text: 'Nein', setzt: {'component.weather_bar_present': false}},
        ],
    },
    {
        id: 'schwelle', abschnitt: 2, spezifisch: true, block: 'D',
        zeigen: alsTuer,
        frage: 'Ist die Tür unten schwellenfrei?',
        hilfe: 'Schwellenfrei bzw. barrierefrei: Der Boden geht ohne Stufe oder Kante durch die Tür.',
        skizze: 'schwelle',
        labels: ['geometry.threshold_free_door', 'geometry.barrier_free_door', 'geometry.threshold_present', 'geometry.surrounding_door_frame_present'],
        antworten: [
            {id: 'ja', text: 'Ja, schwellenfrei', setzt: {'geometry.threshold_free_door': true, 'geometry.barrier_free_door': true, 'geometry.threshold_present': false, 'geometry.surrounding_door_frame_present': false}},
            {id: 'nein', text: 'Nein, mit Schwelle', hinweis: 'Blendrahmen läuft auch unten durch', setzt: {'geometry.threshold_present': true, 'geometry.surrounding_door_frame_present': true, 'geometry.threshold_free_door': false, 'geometry.barrier_free_door': false}},
        ],
    },
    {
        id: 'trittschutz', abschnitt: 2, block: 'D',
        zeigen: (a) => alsTuer(a) && a.tuerart !== 'schiebe',
        frage: 'Hat die Tür unten ein Trittschutzprofil?',
        hilfe: 'Trittschutz: Profil unten auf dem Rahmen, typisch bei Kunststofftüren.',
        skizze: 'trittschutz',
        labels: ['geometry.kick_plate_present'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'geometry.kick_plate_present': true}},
            {id: 'nein', text: 'Nein', setzt: {'geometry.kick_plate_present': false}},
        ],
    },
    {
        id: 'boden', abschnitt: 2, block: 'D',
        zeigen: (a) => alsTuer(a) || (alsFenster(a) && ['rollo', 'plissee'].includes(a.system)),
        frage: 'Ist die Fläche unten eben?',
        frageJe: jeElement({
            fenster: 'Ist die Fensterbank unten eben?',
            tuer: 'Ist der Boden im Türdurchgang eben?',
        }),
        hilfe: 'Gemeint ist die Fläche, auf der der Insektenschutz unten aufsitzt.',
        hilfeJe: jeElement({
            fenster: 'Gemeint ist die Fensterbank, auf der das Rollo bzw. Plissee unten aufsitzt.',
            tuer: 'Gemeint ist der Boden im Durchgang, auf dem die Anlage unten aufsitzt: Fliesen, Estrich, Holzdiele, Naturstein.',
        }),
        labels: ['geometry.bottom_surface_level', 'geometry.bottom_surface_uneven'],
        antworten: [
            {id: 'eben', text: 'Eben', setzt: {'geometry.bottom_surface_level': true, 'geometry.bottom_surface_uneven': false}},
            {id: 'uneben', text: 'Uneben oder ansteigend', setzt: {'geometry.bottom_surface_uneven': true, 'geometry.bottom_surface_level': false}},
        ],
    },
    {
        id: 'mauerleibung', abschnitt: 2, block: 'D',
        zeigen: fassade,
        frage: 'Gibt es neben dem Rahmen eine gerade Mauerleibung, an der montiert werden kann?',
        hilfe: 'Mauerleibung: die seitliche Wandfläche neben dem Blendrahmen.',
        skizze: 'mauerleibung',
        labels: ['geometry.wall_reveal_present'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'geometry.wall_reveal_present': true}},
            {id: 'nein', text: 'Nein', setzt: {'geometry.wall_reveal_present': false},
                schliesstAus: [{art: 'A4', label: 'mounting.in_wall_reveal', grund: 'wird in der Mauerleibung montiert, es gibt aber keine'}]},
        ],
    },

    {
        id: 'schiebefluegel', abschnitt: 2, block: 'D',
        zeigen: (a) => alsTuer(a) && (a.tuerart === 'schiebe' || a.system === 'schiebe'),
        frage: 'Wie viele Schiebeflügel soll die Anlage haben?',
        skizze: 'schiebe',
        labels: ['slide.single_leaf', 'geometry.double_leaf', 'geometry.fixed_side_panels_present'],
        antworten: [
            {id: 'einer', text: 'Einen Flügel', setzt: {'slide.single_leaf': true, 'geometry.double_leaf': false}},
            {id: 'zwei_seitenteile', text: 'Zwei gegenläufige Flügel', hinweis: 'links und rechts feste Seitenteile', setzt: {'geometry.double_leaf': true, 'geometry.fixed_side_panels_present': true, 'slide.single_leaf': false}},
            {id: 'zwei', text: 'Zwei Flügel ohne feste Seitenteile', setzt: {'geometry.double_leaf': true, 'geometry.fixed_side_panels_present': false, 'slide.single_leaf': false},
                schliesstAus: [{art: 'A4', label: 'geometry.fixed_side_panels_present', grund: 'braucht links und rechts ein festes Seitenteil'}]},
        ],
    },

    // E – Dachfenster
    {
        id: 'innenfutter_unten', abschnitt: 2, block: 'E',
        zeigen: (a) => a.fenstertyp === 'dach',
        frage: 'Wie verläuft das Innenfutter unten?',
        hilfe: 'Innenfutter: die Verkleidung der Dachfenster-Leibung im Raum.',
        skizze: 'innenfutter',
        labels: ['geometry.inner_lining_bottom_perpendicular_to_frame', 'geometry.inner_lining_bottom_vertical'],
        antworten: [
            {id: 'gerade', text: 'Im rechten Winkel zum Fenster', setzt: {'geometry.inner_lining_bottom_perpendicular_to_frame': true, 'geometry.inner_lining_bottom_vertical': false}},
            {id: 'senkrecht', text: 'Senkrecht nach unten', setzt: {'geometry.inner_lining_bottom_vertical': true, 'geometry.inner_lining_bottom_perpendicular_to_frame': false}},
        ],
    },
    {
        id: 'innenfutter_oben', abschnitt: 2, block: 'E',
        zeigen: (a) => a.fenstertyp === 'dach',
        frage: 'Wie verläuft das Innenfutter oben?',
        skizze: 'innenfutter',
        labels: ['geometry.inner_lining_top_perpendicular_to_frame', 'geometry.inner_lining_top_horizontal'],
        antworten: [
            {id: 'gerade', text: 'Im rechten Winkel zum Fenster', setzt: {'geometry.inner_lining_top_perpendicular_to_frame': true, 'geometry.inner_lining_top_horizontal': false}},
            {id: 'waagerecht', text: 'Waagerecht', setzt: {'geometry.inner_lining_top_horizontal': true, 'geometry.inner_lining_top_perpendicular_to_frame': false}},
        ],
    },
    {
        id: 'innenfutter_montage', abschnitt: 2, block: 'E',
        zeigen: (a) => a.fenstertyp === 'dach',
        frage: 'Kann direkt im Innenfutter montiert werden?',
        labels: ['mounting.in_roof_window_inner_lining', 'mounting.on_inner_lining_cover_strips'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'mounting.in_roof_window_inner_lining': true}},
            {id: 'nein', text: 'Nein, nur auf den Abdeckleisten', setzt: {'mounting.on_inner_lining_cover_strips': true, 'mounting.in_roof_window_inner_lining': false},
                schliesstAus: [{art: 'A4', label: 'mounting.in_roof_window_inner_lining', grund: 'wird im Innenfutter montiert, das geht hier nicht'}]},
        ],
    },

    // F – Lichtschacht
    {
        id: 'auflage', abschnitt: 2, block: 'F', pflicht: true,
        zeigen: (a) => a.element === 'lichtschacht',
        frage: 'Auf wie vielen Seiten liegt die Abdeckung auf?',
        hilfe: 'Bei 3 Seiten schließt die Abdeckung hinten an die Hauswand an.',
        skizze: 'auflage',
        labels: ['light_well.support_4_sided', 'light_well.support_3_sided'],
        antworten: [
            {id: 'vier', text: '4 Seiten', skizze: 'auflage-4', setzt: {'light_well.support_4_sided': true, 'light_well.support_3_sided': false}},
            {id: 'drei', text: '3 Seiten, hinten Hauswand', skizze: 'auflage-3', setzt: {'light_well.support_3_sided': true, 'light_well.support_4_sided': false},
                schliesstAus: [{art: 'A4', label: 'light_well.support_4_sided', ohneLabel: 'light_well.support_3_sided', grund: 'braucht Auflage auf allen 4 Seiten'}]},
        ],
    },
    {
        id: 'kellerfenster', abschnitt: 2, spezifisch: true, block: 'F',
        zeigen: (a) => a.element === 'lichtschacht' && a.auflage !== 'vier',
        frage: 'Steht das Kellerfenster über die Hauswand in den Schacht?',
        skizze: 'kellerfenster',
        labels: ['light_well.basement_window_projecting'],
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'light_well.basement_window_projecting': true}},
            {id: 'nein', text: 'Nein', setzt: {'light_well.basement_window_projecting': false}},
        ],
    },
    {
        id: 'gitterrost', abschnitt: 2, block: 'F',
        zeigen: (a) => a.element === 'lichtschacht',
        frage: 'Ist der Gitterrost tragfähig, formstabil und nicht verrostet?',
        antworten: [
            {id: 'ja', text: 'Ja'},
            {id: 'nein', text: 'Nein',
                schliesstAus: [{art: 'A4', label: 'excluded.when_grating_not_load_bearing', grund: 'braucht einen tragfähigen Gitterrost'}]},
        ],
    },

    // G – Bedienung
    {
        id: 'system', abschnitt: 1, block: 'G',
        zeigen: (a) => a.element === 'fenster' || a.element === 'tuer',
        frage: 'Wie soll der Insektenschutz funktionieren?',
        antworten: [
            {id: 'spannrahmen', text: 'Fest einsetzen', hinweis: 'Spannrahmen', skizze: 'spannrahmen', system: 'spannrahmen', nur: (a) => alsFenster(a)},
            {id: 'rollo', text: 'Aufrollen', hinweis: 'Rollo', skizze: 'rollo', system: 'rollo'},
            {id: 'pendel', text: 'In beide Richtungen pendeln', hinweis: 'Pendelfenster', hinweisJe: jeElement({fenster: 'Pendelfenster', tuer: 'Pendeltür'}), skizze: 'pendel', system: 'pendel', nur: fassade},
            {id: 'dreh', text: 'Aufdrehen', hinweis: 'Drehrahmen', skizze: 'dreh', system: 'dreh', nur: fassade},
            {id: 'plissee', text: 'Seitlich falten', hinweis: 'Plissee', skizze: 'plissee', system: 'plissee', nur: fassade},
            {id: 'schiebe', text: 'Seitlich schieben', hinweis: 'Schiebeanlage', skizze: 'schiebe', system: 'schiebe', nur: alsTuer},
            {id: 'schieberahmen', text: 'Hochschieben', hinweis: 'Schieberahmen', skizze: 'schieberahmen', system: 'schieberahmen', nur: (a) => a.fenstertyp === 'dach'},
            {id: 'egal', text: 'Noch offen', hinweis: 'alle Bedienarten zeigen', system: 'egal'},
        ],
    },
    {
        id: 'richtung', abschnitt: 1, block: 'G',
        zeigen: (a) => fassade(a) && a.system === 'dreh',
        frage: 'Wohin soll sich der Insektenschutz öffnen?',
        hilfe: 'Die Öffnungsrichtung legt zugleich die Montageseite fest: Nach innen öffnend sitzt der Rahmen innen im Raum, nach außen öffnend sitzt er außen.',
        hilfeJe: jeElement({
            fenster: 'Die Öffnungsrichtung legt zugleich die Montageseite fest: Nach innen öffnend sitzt der Rahmen innen im Raum, nach außen öffnend außen vor dem Fenster. Der Hauptkatalog empfiehlt bei Fenstern nach innen, damit man sich zum Bedienen nicht hinauslehnen muss.',
            tuer: 'Die Öffnungsrichtung legt zugleich die Montageseite fest: Nach innen öffnend sitzt der Rahmen innen im Raum, nach außen öffnend außen vor der Tür. Nach außen braucht davor freien Platz; nach innen ist die Lösung, wenn oben der Rollladen hereinhängt.',
        }),
        antworten: [
            {id: 'aussen', text: 'Nach außen', hinweis: 'ins Freie; der Rahmen sitzt dann außen', richtung: 'operation.hinged_outward'},
            {id: 'innen', text: 'Nach innen', hinweis: 'in den Raum; der Rahmen sitzt dann innen', richtung: 'operation.hinged_inward'},
            {id: 'egal', text: 'Egal'},
        ],
    },
    {
        id: 'tuerschliesser', abschnitt: 1, block: 'G',
        zeigen: (a) => alsTuer(a) && system(a, 'dreh'),
        frage: 'Soll die Tür einen Türschließer bekommen?',
        antworten: [
            {id: 'ja', text: 'Ja', setzt: {'operation.door_closer_available': true},
                schliesstAus: [{art: 'A2', label: 'excluded.when_door_closer_required', grund: 'Türschließer nicht möglich'}]},
            {id: 'nein', text: 'Nein'},
        ],
        labels: ['operation.door_closer_available'],
    },

    // H – Einbauweise
    {
        id: 'einbauweise', abschnitt: 3, block: 'H', blick: 'aussen',
        zeigen: fassade,
        frage: 'Wo soll montiert werden?',
        hilfe: 'Von außen betrachtet: außen vor den Blendrahmen gesetzt, in die Öffnung des Blendrahmens gesetzt oder seitlich in die Mauerleibung. Möglichkeiten ohne hinterlegte Lösung bleiben sichtbar und nennen den Grund.',
        skizze: 'einbauweise',
        // Die Lage kommt aus dem Bestellmaß-Bezug des Hauptkatalogs, nicht mehr aus Montagerahmen-Labels.
        // Die Kürzel AMB/LMB/LMM gelten nur für Systeme mit Montagerahmen; im Spannrahmen-Katalog
        // kommen sie kein einziges Mal vor und werden dort deshalb nicht genannt.
        // Die Montagerahmen-Labels sortieren weiter (sie sind je Variante belegt); die pauschal
        // geerbten Labels `mounting.on_frame_front` und `mounting.in_frame_opening` entfallen hier,
        // weil sie bei Spannrahmen für alle Seiten gleich gesetzt sind und nichts unterscheiden.
        labels: ['mounting_frame.position_amb_exterior_on_frame', 'mounting_frame.position_lmb_in_clear_opening', 'mounting_frame.position_lmm_in_clear_wall_reveal'],
        antworten: [
            {id: 'amb', text: 'Außen auf den Blendrahmen', lage: 'auf_blendrahmen', skizze: 'amb',
                hinweis: 'liegt auf dem Blendrahmen auf',
                hinweisJe: (a) => (a.system === 'spannrahmen' ? 'liegt auf dem Blendrahmenüberschlag auf' : 'vorgesetzter Montagerahmen, Katalogkürzel AMB'),
                setzt: {'mounting_frame.position_amb_exterior_on_frame': true, 'mounting_frame.position_lmb_in_clear_opening': false, 'mounting_frame.position_lmm_in_clear_wall_reveal': false}},
            {id: 'lmb', text: 'Im Blendrahmen', lage: 'im_blendrahmen', skizze: 'lmb',
                hinweis: 'sitzt in der Rahmenöffnung',
                hinweisJe: (a) => (a.system === 'spannrahmen' ? 'wird in die Rahmenöffnung eingesetzt' : 'Montagerahmen in der Rahmenöffnung, Katalogkürzel LMB'),
                setzt: {'mounting_frame.position_lmb_in_clear_opening': true, 'mounting_frame.position_amb_exterior_on_frame': false, 'mounting_frame.position_lmm_in_clear_wall_reveal': false}},
            {id: 'lmm', text: 'In der Mauerleibung', lage: 'mauerleibung', skizze: 'lmm',
                hinweis: 'sitzt seitlich in der Wandöffnung',
                hinweisJe: (a) => (a.system === 'spannrahmen' ? 'wird in die Mauerleibung gesetzt' : 'Montagerahmen in der Mauerleibung, Katalogkürzel LMM'),
                setzt: {'mounting_frame.position_lmm_in_clear_wall_reveal': true, 'mounting_frame.position_amb_exterior_on_frame': false, 'mounting_frame.position_lmb_in_clear_opening': false}},
        ],
    },
    {
        id: 'abschluss', abschnitt: 3, block: 'H',
        zeigen: (a) => fassade(a) && system(a, 'pendel', 'dreh', 'plissee', 'rollo'),
        frage: 'Soll der Rahmen unten geschlossen oder offen sein?',
        hilfe: 'Unten offen: keine Kante, die Bürste dichtet nach unten ab. Unten geschlossen: umlaufender Rahmen, gut bei unebenem Untergrund.',
        hilfeJe: jeElement({
            fenster: 'Unten offen: kein Profil, die Bürste dichtet zur Fensterbank ab. Unten geschlossen: umlaufender Rahmen, gut bei unebener Fensterbank.',
            tuer: 'Unten offen: keine Stolperkante, die Bürste dichtet zum Boden ab. Unten geschlossen: umlaufender Rahmen, gut bei unebenem Boden.',
        }),
        labels: ['mounting_frame.closed_bottom', 'mounting_frame.open_bottom', 'roller.bottom_closed', 'roller.bottom_open'],
        antworten: [
            {id: 'geschlossen', text: 'Unten geschlossen', setzt: {'mounting_frame.closed_bottom': true, 'roller.bottom_closed': true, 'mounting_frame.open_bottom': false, 'roller.bottom_open': false}},
            {id: 'offen', text: 'Unten offen', setzt: {'mounting_frame.open_bottom': true, 'roller.bottom_open': true, 'mounting_frame.closed_bottom': false, 'roller.bottom_closed': false}},
            {id: 'egal', text: 'Egal'},
        ],
    },
    {
        id: 'zweifluegelig', abschnitt: 3, block: 'H',
        zeigen: (a) => alsTuer(a) && a.tuerart === 'stulp' && system(a, 'pendel', 'dreh', 'plissee'),
        frage: 'Soll der Insektenschutz selbst zwei Flügel haben?',
        hilfe: 'Zweiflügelig: je Türflügel ein Insektenschutzflügel. Einflügelig: ein Flügel über die ganze Breite oder nur für den Gehflügel.',
        labels: ['geometry.double_leaf', 'operation.opens_double_leaf'],
        antworten: [
            {id: 'einer', text: 'Ein Flügel', setzt: {'geometry.double_leaf': false, 'operation.opens_double_leaf': false}},
            {id: 'zwei', text: 'Zwei Flügel', setzt: {'geometry.double_leaf': true, 'operation.opens_double_leaf': true}},
            {id: 'egal', text: 'Egal'},
        ],
    },
    {
        id: 'sprosse', abschnitt: 3, block: 'H',
        zeigen: (a) => alsFenster(a) && system(a, 'spannrahmen'),
        frage: 'Darf der Spannrahmen eine Quersprosse haben?',
        hilfe: 'Sprossenfreie Varianten sehen ruhiger aus; bei großen Elementen kann eine Sprosse nötig sein (Sprossengrenzen im Katalog).',
        labels: ['geometry.crossbar_present', 'geometry.crossbar_absent'],
        antworten: [
            {id: 'ohne', text: 'Ohne Sprosse', setzt: {'geometry.crossbar_absent': true, 'geometry.crossbar_present': false}},
            {id: 'mit', text: 'Sprosse ist in Ordnung', setzt: {'geometry.crossbar_present': true, 'geometry.crossbar_absent': false}},
            {id: 'egal', text: 'Egal'},
        ],
    },
    {
        id: 'montagerahmen', abschnitt: 3, block: 'H',
        zeigen: (a) => fassade(a) && system(a, 'dreh'),
        frage: 'Mit oder ohne Montagerahmen?',
        hilfe: 'Ohne Rahmen wird der Drehrahmen direkt am Blendrahmen befestigt.',
        labels: ['mounting_frame.present', 'mounting_frame.absent_confirmed'],
        antworten: [
            {id: 'ohne', text: 'Ohne Montagerahmen', setzt: {'mounting_frame.absent_confirmed': true, 'mounting_frame.present': false}},
            {id: 'mit', text: 'Mit Montagerahmen', setzt: {'mounting_frame.present': true, 'mounting_frame.absent_confirmed': false}},
            {id: 'egal', text: 'Egal'},
        ],
    },

    // J – Maße (A3 nur bei gemessenem Wert)
    {
        id: 'mass_seitlich', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'eng', text: 'Sehr wenig', hinweis: 'schmaler als ein Finger, unter ca. 15 mm', bis: 15},
            {id: 'normal', text: 'Fingerbreit', hinweis: 'ungefähr 15 bis 25 mm', ab: 15, bis: 25},
            {id: 'viel', text: 'Viel Platz', hinweis: 'breiter als ein Daumen, über ca. 25 mm', ab: 25},
        ], blick: 'aussen',
        zeigen: fassade,
        frage: 'Wie breit ist die freie Auflagefläche seitlich am Blendrahmen?',
        hilfe: 'Von außen messen: von der Außenkante des Blendrahmens bis zum Flügel bzw. bis zur Rollladenführung. Die schmalere der beiden Seiten zählt.',
        skizze: 'mass-seitlich',
        schluessel: ['side_support_min', 'mounting_frame_side_support_min'],
    },
    {
        id: 'mass_fuehrung', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'eng', text: 'Schiene klebt am Rahmen', hinweis: 'unter ca. 15 mm', bis: 15},
            {id: 'normal', text: 'Etwas Luft', hinweis: 'ungefähr 15 bis 25 mm', ab: 15, bis: 25},
            {id: 'viel', text: 'Deutlich Abstand', hinweis: 'über ca. 25 mm', ab: 25},
        ], blick: 'aussen',
        zeigen: mitRollladen,
        frage: 'Wie weit ist die Führungsschiene vom Blendrahmen entfernt?',
        hilfe: 'Von außen seitlich messen: von der Rollladen-Führungsschiene bis zur Außenkante des Blendrahmens.',
        skizze: 'mass-fuehrung',
        schluessel: ['shutter.guide_to_frame_min'],
    },
    {
        id: 'mass_oben', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'eng', text: 'Fast nichts frei', hinweis: 'unter ca. 18 mm', bis: 18},
            {id: 'normal', text: 'Ein Finger passt', hinweis: 'ungefähr 18 bis 30 mm', ab: 18, bis: 30},
            {id: 'viel', text: 'Reichlich Platz', hinweis: 'über ca. 30 mm', ab: 30},
        ], blick: 'aussen',
        zeigen: alsFenster,
        frage: 'Wie viel Blendrahmenfläche ist oben über dem Flügel frei?',
        hilfe: 'Von außen messen: von der Oberkante des Flügels bis zur Oberkante des Blendrahmens. Der Katalog nennt das die obere Blendrahmenüberstandsfläche.',
        skizze: 'mass-oben',
        schluessel: ['upper_frame_projection_min'],
    },
    {
        id: 'mass_tiefe', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'eng', text: 'Kaum Luft nach außen', hinweis: 'unter ca. 25 mm', bis: 25},
            {id: 'normal', text: 'Eine Handbreit knapp', hinweis: 'ungefähr 25 bis 65 mm', ab: 25, bis: 65},
            {id: 'viel', text: 'Viel Platz nach außen', hinweis: 'über ca. 65 mm', ab: 65},
        ], blick: 'aussen',
        zeigen: fassade,
        frage: 'Wie viel Platz ist vor dem Blendrahmen bis zum Rollladen?',
        hilfe: 'Einbautiefe, von außen gemessen: von der Außenfläche des Blendrahmens nach außen bis zum ersten Hindernis davor, meist Rollladenpanzer oder Führungsschiene.',
        skizze: 'mass-tiefe',
        schluessel: ['installation_depth_min'],
    },
    {
        id: 'mass_versatz', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'kaum', text: 'Kaum zurückversetzt', hinweis: 'unter ca. 8 mm', bis: 8},
            {id: 'deutlich', text: 'Deutlich zurückversetzt', hinweis: 'ungefähr 8 bis 20 mm', ab: 8, bis: 20},
            {id: 'stark', text: 'Weit zurückversetzt', hinweis: 'über ca. 20 mm', ab: 20},
        ], blick: 'aussen',
        zeigen: (a) => fassade(a) && a.fluegellage !== 'buendig',
        frage: 'Wie tief liegt der Flügel hinter dem Blendrahmen?',
        hilfe: 'Von außen seitlich schauen und den Flächenversatz messen: von der Außenfläche des Blendrahmens bis zur zurückliegenden Außenfläche des Flügels.',
        hilfeJe: jeElement({
            fenster: 'Von außen seitlich schauen und den Flächenversatz messen: von der Außenfläche des Blendrahmens bis zur zurückliegenden Außenfläche des Fensterflügels.',
            tuer: 'Von außen seitlich schauen und den Flächenversatz messen: von der Außenfläche des Blendrahmens bis zur zurückliegenden Außenfläche des Türflügels.',
        }),
        skizze: 'versetzt',
        schluessel: ['sash_offset_min'],
    },
    {
        id: 'mass_regenschiene', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'buendig', text: 'Schließt bündig ab', hinweis: 'kein nennenswerter Überstand', bis: 3},
            {id: 'wenig', text: 'Steht wenig vor', hinweis: 'ungefähr 3 bis 12 mm', ab: 3, bis: 12},
            {id: 'viel', text: 'Steht deutlich vor', hinweis: 'über ca. 12 mm', ab: 12},
        ], blick: 'aussen',
        zeigen: (a) => alsFenster(a) && a.regenschiene === 'ja',
        frage: 'Wie weit steht die Regenschiene über den Blendrahmen vor?',
        hilfe: 'Von außen seitlich messen: von der Außenfläche des Blendrahmens bis zur Vorderkante der Regenschiene.',
        skizze: 'regenschiene',
        schluessel: ['rain_rail_projection_max'],
    },
    {
        id: 'mass_wetterschenkel', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'buendig', text: 'Schließt bündig ab', hinweis: 'kein nennenswerter Überstand', bis: 3},
            {id: 'wenig', text: 'Steht wenig vor', hinweis: 'ungefähr 3 bis 12 mm', ab: 3, bis: 12},
            {id: 'viel', text: 'Steht deutlich vor', hinweis: 'über ca. 12 mm', ab: 12},
        ], blick: 'aussen',
        zeigen: (a) => alsFenster(a) && a.wetterschenkel === 'ja',
        frage: 'Wie weit steht der Wetterschenkel vor?',
        hilfe: 'Von außen seitlich messen: von der Außenfläche des Flügels bis zur Vorderkante des Wetterschenkels.',
        skizze: 'wetterschenkel',
        schluessel: ['weather_bar_projection_max'],
    },
    {
        id: 'mass_kellerfenster', abschnitt: 4, block: 'J', typ: 'mass', einheit: 'mm',
        klassen: [
            {id: 'klein', text: 'Wenig', hinweis: 'bis etwa 90 mm, gut eine Handbreit', bis: 90},
            {id: 'mittel', text: 'Mittel', hinweis: 'ungefähr 90 bis 110 mm', ab: 90, bis: 110},
            {id: 'gross', text: 'Weit', hinweis: 'über ca. 110 mm', ab: 110},
        ],
        zeigen: (a) => a.element === 'lichtschacht' && a.kellerfenster === 'ja',
        frage: 'Wie weit steht das Kellerfenster über?',
        hilfe: 'Von oben in den Schacht schauen und waagerecht messen: von der Hauswand bis zur vordersten Kante des Kellerfensters.',
        skizze: 'kellerfenster',
        schluessel: ['light_well_window_overhang_max', 'light_well_window_overhang_min'],
    },

    // K – Wünsche (nur Hinweise zum Gewebe, nie Ausschluss)
    {
        id: 'wunsch', abschnitt: 4, block: 'K', typ: 'mehrfach', immerZeigen: true,
        zeigen: (a) => Boolean(a.element),
        frage: 'Gibt es besondere Wünsche?',
        antworten: [
            {id: 'pollen', text: 'Pollenschutz', notiz: 'Polltec PIA (bis 99 % Pollenschutz) oder TFP (bis 90 %) nur für Rahmensysteme; Gewebebreite und Freigabe der Variante prüfen.'},
            {id: 'tiere', text: 'Haustiere', notiz: 'Stabilotec PAE (kleine Haustiere) oder PA für Rahmensysteme; bei Türen ggf. Tierklappe (Katze 158 × 170 mm, Hund 298 × 350 mm).'},
            {id: 'klein', text: 'Sehr kleine Insekten', notiz: 'Transpatec TFM (65 % offene Fläche) für Rollo- und Rahmensysteme; Freigabe der Variante prüfen.'},
            {id: 'begehbar', text: 'Wird darüber gelaufen', notiz: 'Für häufig begangene Lichtschächte Aluminiumstreckmetall (SMDG, SMMG, SME1) prüfen. Die Abdeckung ersetzt keinen tragfähigen Gitterrost.', nur: (a) => a.element === 'lichtschacht'},
        ],
    },
];

const H2Fragen = {bloecke, abschnitte, fragen, elementWort};
globalThis.H2Fragen = H2Fragen;
})();
