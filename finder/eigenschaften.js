// Eigenschaften einer Lösung in Monteur-Sprache (Umbauplan Schritt 2).
//
// Grundsatz: Es wird nur gesagt, was in den Daten belegt ist. Ein fehlendes Label heißt
// „darüber sagt der Katalog nichts“ – nicht „gibt es nicht“ (Auswahlplan §3.2 N1).
// Jede Zeile nennt in der Quelle das Label, aus dem sie stammt, damit sie prüfbar bleibt.
(function () {
'use strict';

// Ein Eintrag je Label. Reihenfolge innerhalb einer Gruppe = Reihenfolge in der Anzeige.
const GRUPPEN = [
    {
        titel: 'Bedienart',
        labels: [
            ['operation.fixed_screen', 'fest eingesetzter Rahmen'],
            ['operation.rolls_up', 'wird aufgerollt'],
            ['operation.swing_both_directions', 'pendelt in beide Richtungen'],
            ['operation.hinged_outward', 'dreht nach außen auf'],
            ['operation.hinged_inward', 'dreht nach innen auf'],
            ['operation.pleats_left', 'faltet seitlich (Plissee)'],
            ['element.sliding_frame_screen', 'wird hochgeschoben'],
            ['operation.slides_left', 'wird seitlich geschoben'],
            ['operation.opens_double_leaf', 'zweiflügelig'],
            ['operation.opens_single_leaf', 'einflügelig'],
            ['slide.two_leaf_counter_running', 'zwei gegenläufige Flügel'],
            ['slide.single_leaf', 'ein Schiebeflügel'],
            ['operation.primary_leaf_defined', 'mit festgelegtem Gehflügel'],
        ],
    },
    {
        titel: 'Montageart',
        labels: [
            ['mounting_frame.position_amb_exterior_on_frame', 'Montagerahmen außen auf dem Blendrahmen (AMB)'],
            ['mounting_frame.position_lmb_in_clear_opening', 'Montagerahmen im Blendrahmen (LMB)'],
            ['mounting_frame.position_lmm_in_clear_wall_reveal', 'Montagerahmen in der Mauerleibung (LMM)'],
            ['mounting.on_house_wall', 'wird an der Hauswand befestigt'],
            ['mounting.on_grating', 'liegt auf dem Gitterrost'],
            ['mounting.in_light_well_rebate', 'sitzt im Falz des Lichtschachts'],
            ['mounting.in_roof_window_inner_lining', 'sitzt im Innenfutter des Dachfensters'],
            ['mounting.on_inner_lining_cover_strips', 'sitzt auf den Abdeckleisten'],
            ['mounting.substrate_masonry', 'Untergrund Mauerwerk'],
        ],
    },
    {
        titel: 'Rahmen',
        labels: [
            ['mounting_frame.required', 'braucht einen Montagerahmen'],
            ['mounting_frame.absent_confirmed', 'ohne Montagerahmen'],
            ['mounting_frame.closed_bottom', 'Rahmen unten geschlossen'],
            ['mounting_frame.open_bottom', 'Rahmen unten offen'],
            ['roller.bottom_closed', 'unten geschlossen'],
            ['roller.bottom_open', 'unten offen'],
            ['mounting_frame.partial_profile_only', 'nur teilweise umlaufendes Profil'],
            ['mounting_frame.profile_on_hinge_side', 'Profil auf der Bandseite'],
            ['mounting_frame.profile_on_lock_side', 'Profil auf der Schlossseite'],
            ['additional_profile.bottom_angle_profile_present', 'mit unterem Winkelprofil'],
            ['additional_profile.bottom_threshold_profile_present', 'mit unterem Schwellenprofil'],
            ['geometry.crossbar_present', 'mit Quersprosse'],
            ['geometry.crossbar_absent', 'ohne Quersprosse'],
            ['light_well.static_profile_present', 'mit Statikprofil'],
            ['light_well.polycarbonate_panel_present', 'mit Polycarbonatplatte'],
        ],
    },
    {
        titel: 'Befestigung',
        labels: [
            ['fastening.spring_bracket_present', 'gefederte Winkellaschen'],
            ['fastening.rigid_bracket_present', 'starre Winkellaschen'],
            ['fastening.rotatable_bracket_present', 'drehbare Laschen'],
            ['fastening.spring_pin_present', 'Federstifte'],
            ['fastening.hinge_present', 'Scharniere'],
            ['fastening.grating_clamp_present', 'Klemmen am Gitterrost'],
            ['fastening.clamp_present', 'Klemmbefestigung'],
            ['fastening.screw_present', 'geschraubt'],
            ['fastening.screw_into_reveal', 'in die Mauerleibung geschraubt'],
            ['fastening.screw_into_door_frame', 'in den Türrahmen geschraubt'],
            ['fastening.screw_into_window_frame', 'in den Fensterrahmen geschraubt'],
            ['fastening.screw_from_exterior', 'von außen geschraubt'],
            ['fastening.screw_from_interior', 'von innen geschraubt'],
            ['fastening.mounting_adhesive_tape_available', 'Klebeband als Montagehilfe möglich'],
            ['fastening.drilling_required', 'Bohren nötig'],
            ['fastening.upper_side_lock_present', 'obere Seitenverriegelung'],
            ['fastening.stainless_steel_rod_present', 'Edelstahlstab'],
        ],
    },
    {
        titel: 'Dichtung unten und seitlich',
        labels: [
            ['brush_seal.present_bottom', 'Bürste unten'],
            ['brush_seal.present_left', 'Bürste links'],
            ['brush_seal.present_right', 'Bürste rechts'],
            ['brush_seal.present_top', 'Bürste oben'],
            ['component.rain_rail_contact_required', 'dichtet an der Regenschiene ab'],
            ['component.rain_rail_may_project', 'Regenschiene darf überstehen'],
            ['component.weather_bar_suitable', 'für Flügel mit Wetterschenkel'],
            ['component.threshold_profile_8mm_available', 'Schwellenprofil 8 mm möglich'],
            ['component.angle_profile_20x15_available', 'Winkelprofil 20 × 15 mm möglich'],
        ],
    },
    {
        titel: 'Bedienung und Zubehör',
        labels: [
            ['operation.door_closer_available', 'Türschließer möglich'],
            ['operation.door_closer_not_possible', 'Türschließer nicht möglich'],
            ['operation.brush_damping_available', 'gedämpftes Schließen möglich'],
            ['operation.increased_closing_force_available', 'erhöhte Schließkraft möglich'],
            ['operation.handle_bar_available', 'mit Griffleiste'],
            ['operation.handle_gi25_available', 'Griff GI25 möglich'],
            ['operation.exterior_handle_ga20_available', 'Außengriff GA20 möglich'],
            ['pleat.handle_bar_operation_from_interior', 'Griffleiste von innen bedienbar'],
            ['roller.exterior_operation_available', 'von außen bedienbar'],
            ['roller.one_hand_operation_available', 'Einhandbedienung möglich'],
            ['roller.additional_detent_point_available', 'zusätzlicher Rastpunkt möglich'],
            ['slide.foot_operated_recess_available', 'Fußmulde möglich'],
            ['light_well.quick_release_lock_available', 'Schnellverschluss möglich'],
            ['light_well.expanded_metal_available', 'Streckmetall möglich (begehbar)'],
            ['use.pollen_mesh_available', 'Pollenschutzgewebe möglich'],
            ['use.sun_protection_available', 'zusätzlicher Sonnenschutz möglich'],
            ['roller.sun_and_insect_mesh_combination', 'Sonnen- und Insektenschutz kombiniert'],
        ],
    },
    {
        titel: 'Passt zu',
        labels: [
            ['geometry.sash_flush_with_frame', 'flächenbündigen Flügeln'],
            ['geometry.sash_offset_from_frame', 'flächenversetzten Flügeln'],
            ['geometry.sash_half_offset_from_frame', 'halbflächenversetzten Flügeln'],
            ['geometry.stulp_without_fixed_mullion', 'Stulp ohne Mittelpfosten'],
            ['geometry.double_leaf', 'zweiflügeligen Elementen'],
            ['geometry.kick_plate_present', 'Türen mit Trittschutzprofil'],
            ['geometry.threshold_free_door', 'schwellenfreien Türen'],
            ['geometry.barrier_free_door', 'barrierefreien Türen'],
            ['geometry.wall_reveal_present', 'vorhandener Mauerleibung'],
            ['geometry.bottom_surface_level', 'ebener Auflage unten'],
            ['geometry.bottom_surface_uneven', 'unebener Auflage unten'],
            ['geometry.special_form_curved_supported', 'Bogenformen'],
            ['geometry.special_form_out_of_square_supported', 'schiefwinkligen Öffnungen'],
            ['shutter.armour_close_to_sash', 'eng anliegendem Rollladenpanzer'],
            ['shutter.guide_close_left', 'links eng anliegender Führungsschiene'],
            ['shutter.guide_close_right', 'rechts eng anliegender Führungsschiene'],
            ['shutter.armour_hanging_down', 'herunterhängendem Rollladen'],
            ['shutter.split_roller_shutter', 'geteiltem Rollladen'],
            ['material.wood_suitable', 'Holzrahmen'],
            ['material.plastic_suitable', 'Kunststoffrahmen'],
            ['material.aluminium_suitable', 'Aluminiumrahmen'],
            ['light_well.support_4_sided', 'vierseitiger Auflage'],
            ['light_well.support_3_sided', 'dreiseitiger Auflage'],
            ['light_well.basement_window_projecting', 'überstehendem Kellerfenster'],
            ['geometry.inner_lining_bottom_perpendicular_to_frame', 'Innenfutter unten im rechten Winkel'],
            ['geometry.inner_lining_bottom_vertical', 'senkrechtem Innenfutter unten'],
            ['geometry.inner_lining_top_perpendicular_to_frame', 'Innenfutter oben im rechten Winkel'],
            ['geometry.inner_lining_top_horizontal', 'waagerechtem Innenfutter oben'],
        ],
    },
    {
        titel: 'Achtung',
        labels: [
            ['operation.pendulum_path_clearance_required', 'Pendelweg muss frei bleiben'],
            ['operation.secondary_leaf_rattle_risk', 'Standflügel kann klappern'],
            ['operation.leaf_floor_scrape_risk_at_zero_dimension_z', 'Flügel kann am Boden schleifen'],
            ['operation.increased_closing_force_required_for_wind_load', 'bei Windlast erhöhte Schließkraft nötig'],
            ['use.heating_room_restriction_present', 'Einschränkung bei Heizräumen beachten'],
            ['light_well.condensation_risk_in_damp_shaft', 'Schwitzwasser in feuchten Schächten möglich'],
            ['light_well.no_insect_and_leaf_protection', 'kein Insekten- und Laubschutz'],
            ['component.additional_drainage_on_site_required', 'zusätzliche Entwässerung bauseits nötig'],
            ['component.water_drain_slot_must_remain_free', 'Wasserschlitz muss frei bleiben'],
            ['fastening.screw_projects_into_clear_opening', 'Schraube ragt in die lichte Öffnung'],
            ['component.h_profile_projects_into_clear_opening', 'H-Profil ragt in die lichte Öffnung'],
            ['visible.mounting_screw_between_frames_possible', 'Montageschraube kann sichtbar sein'],
        ],
    },
];

// Montageseite getrennt: Die 226 Spannrahmen-Seiten der Wissensbasis erben `mounting.on_exterior_side`
// pauschal (Übergabe §5.3). Für diese Serie ist das Label deshalb kein Beleg; dort zählt Rudis Gruppe
// („Spannrahmen innen“ / „Spannrahmen von außen“). Ohne Beleg wird nichts behauptet.
function montageseite(v) {
    const rudi = (v.rudi || []).map((r) => `${r.gruppe || ''} ${r.untergruppe || ''}`).join(' ').toLowerCase();
    if (v.wahr.has('mounting.on_interior_side')) return {text: 'von innen', quelle: 'Katalog'};
    if (/innen/.test(rudi)) return {text: 'von innen', quelle: 'Rudi'};
    if (/außen|aussen/.test(rudi)) return {text: 'von außen', quelle: 'Rudi'};
    if (v.system === 'spannrahmen') return {text: 'beim Aufmaß festlegen', quelle: null};
    if (v.wahr.has('mounting.on_exterior_side')) return {text: 'von außen', quelle: 'Katalog'};
    return {text: 'beim Aufmaß festlegen', quelle: null};
}

// Einbaulage aus dem Bezugsmaß des Bestellmaßes (erzeugt, Beleg steht in `lageBeleg`)
const LAGE_TEXT = {
    auf_blendrahmen: 'liegt außen auf dem Blendrahmen auf',
    im_blendrahmen: 'wird in den Blendrahmen eingesetzt (Rahmenöffnung)',
    mauerleibung: 'sitzt in der Mauerleibung',
    fuehrungsschienen: 'sitzt zwischen den Rollladenführungsschienen',
    innenfutter: 'sitzt im Innenfutter des Dachfensters',
    aussenkante: 'sitzt auf der Außenkante des Blendrahmens',
    lichtschacht: 'liegt auf dem Lichtschacht',
};

const ZEICHEN = {gte: '≥', gt: '>', lte: '≤', lt: '<'};
const zahl = (wert) => String(wert).replace('.', ',');
// Manche Grenzwerttexte enthalten „mindestens“ oder „höchstens“ schon selbst
const grenzText = (g) => (/mindestens|höchstens|maximal|mind\.|max\./i.test(g.text)
    ? `${g.text} ${zahl(g.wert)} mm`
    : `${g.text} ${ZEICHEN[g.op] || g.op} ${zahl(g.wert)} mm`);

// Liefert die Stichpunkte einer Variante: [{titel, text, labels}]
function eigenschaften(v) {
    const zeilen = [];
    const seite = montageseite(v);
    for (const gruppe of GRUPPEN) {
        const treffer = gruppe.labels.filter(([label]) => v.wahr.has(label));
        const istMontage = gruppe.titel === 'Montageart';
        if (!treffer.length && !(istMontage && v.lage)) continue;
        const texte = treffer.map(([, text]) => text);
        // Die Einbaulage steht zuerst: Sie ist über das Bestellmaß des Hauptkatalogs belegt.
        if (istMontage && v.lage && LAGE_TEXT[v.lage]) texte.unshift(LAGE_TEXT[v.lage]);
        zeilen.push({titel: gruppe.titel, text: texte.join(', '), labels: treffer.map(([label]) => label)});
        // Die Montageseite steht direkt hinter der Bedienart
        if (gruppe.titel === 'Bedienart') zeilen.push({titel: 'Montageseite', text: seite.text, quelle: seite.quelle, labels: []});
    }
    if (!zeilen.some((z) => z.titel === 'Montageseite')) {
        zeilen.unshift({titel: 'Montageseite', text: seite.text, quelle: seite.quelle, labels: []});
    }
    // Nur nachmessbare Grenzwerte; die übrigen stehen in der Prüfliste beim Aufmaß
    const masse = v.grenzen.filter((g) => g.messbar).map(grenzText);
    if (masse.length) zeilen.push({titel: 'Grenzmaße', text: masse.join(' · '), labels: []});
    return zeilen;
}

globalThis.H2Eigenschaften = {eigenschaften, montageseite, GRUPPEN};
})();
