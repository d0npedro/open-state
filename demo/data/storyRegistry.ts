/**
 * Story-Registry – Single Source of Truth (Q-305).
 *
 * Manuell pflegen. Für docs/stories/story_registry.json:
 *   cd demo && npm run registry:export
 *
 * Demo-UI (/stories) importiert diese Datei direkt.
 *
 * Status (Q-610 Audit, Phase-0-Demo):
 * - ABGESCHLOSSEN: Route + Screen + alle gezählten AK + E2E (Domain/Story)
 * - DEMONSTRIERBAR: Demo sichtbar, aber nicht alle AK (z. B. eID, Dateiformat-Validierung)
 * - acceptance_criteria_count = demo-relevante AK (Story-MD kann Phase-0-externe AK haben)
 * Kein Fake-Upgrade bei offenen AK.
 *
 * Routes (Q-612): jede Story hat `route` → existierende Demo-Seite; optional Hash
 * für Tiefenlink (z. B. Engpass, Zeitreihe). /stories „Zur Demo“ + e2e/stories-zur-demo.
 */
import { StoryRegistryEntry } from '@/types';

export const storyRegistry: StoryRegistryEntry[] = [
  {
    id: 'US-AV-001',
    domain: 'Arbeitsverwaltung',
    title: 'Fall anlegen',
    role: 'Bürger',
    status: 'DEMONSTRIERBAR',
    problem: 'Bürger wissen nicht wie sie den Prozess nach Jobverlust digital starten',
    screen: 'Fallübersicht',
    transparency_focus: 'Sofortige Fallnummer und Eingangsbestätigung sichtbar',
    acceptance_criteria_count: 6,
    implemented_criteria: 5, // eID-Verifikation (AK6) nicht in Phase-0-Demo
    route: '/fall',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-001_Fall_anlegen.md'
  },
  {
    id: 'US-AV-002',
    domain: 'Arbeitsverwaltung',
    title: 'Status einsehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: '40–60 % aller BA-Kontakte sind Statusanfragen',
    screen: 'Fallübersicht / Status-Timeline',
    transparency_focus: 'Status in Klartext mit Begründung und nächstem Schritt',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/fall',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-002_Status_einsehen.md'
  },
  {
    id: 'US-AV-003',
    domain: 'Arbeitsverwaltung',
    title: 'Unterlagen nachreichen',
    role: 'Bürger',
    status: 'DEMONSTRIERBAR',
    problem: 'Dokumentanforderungen kommen ohne Kontext und Begründung',
    screen: 'Dokumente',
    transparency_focus: 'Jede Anforderung mit Rechtsgrundlage und Begründung',
    acceptance_criteria_count: 5,
    implemented_criteria: 4, // echte Dateiformat-/Größenprüfung nicht in Demo-Upload
    route: '/fall/dokumente',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-003_Unterlagen_nachreichen.md'
  },
  {
    id: 'US-AV-004',
    domain: 'Arbeitsverwaltung',
    title: 'Rückfrage verstehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: 'Rückfragen kommen in unverständlicher Behördensprache ohne Erklärung',
    screen: 'Rückfragen',
    transparency_focus: 'Begründung, Frist und Konsequenz je Rückfrage sichtbar',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/fall/rueckfragen',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-004_Rueckfrage_verstehen.md'
  },
  {
    id: 'US-AV-005',
    domain: 'Arbeitsverwaltung',
    title: 'Termin einsehen und verstehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: 'Termine kommen per Post ohne Zweck und Vorbereitung',
    screen: 'Termine',
    transparency_focus: 'Zweck und Vorbereitung je Termin erläutert',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/fall/termine',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-005_Termin_einsehen_und_verstehen.md'
  },
  {
    id: 'US-AV-006',
    domain: 'Arbeitsverwaltung',
    title: 'Bescheid verstehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: 'Bescheide in Juristensprache, Widerspruchsfristen werden versäumt',
    screen: 'Bescheide',
    transparency_focus: 'Zwei-Schichten-Darstellung: rechtlich + erklärt',
    acceptance_criteria_count: 6,
    implemented_criteria: 6,
    route: '/fall/bescheide',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-006_Bescheid_verstehen.md'
  },
  {
    id: 'US-AV-007',
    domain: 'Arbeitsverwaltung',
    title: 'Historie nachvollziehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: 'Keine Übersicht über Verlauf – wer hat was wann entschieden?',
    screen: 'Verlauf / Audit-Log',
    transparency_focus: 'Lückenlose chronologische Timeline aller Ereignisse',
    acceptance_criteria_count: 6,
    implemented_criteria: 6,
    route: '/fall/verlauf',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-007_Historie_nachvollziehen.md'
  },
  {
    id: 'US-AV-008',
    domain: 'Arbeitsverwaltung',
    title: 'Verfahrenslage verstehen',
    role: 'Bürger',
    status: 'ABGESCHLOSSEN',
    problem: 'Bürger wissen nicht, warum ein Fall stockt oder was als nächstes zu tun ist – ohne direkte Erklärung bleibt der Verfahrensstand unklar',
    screen: 'Hinweise zur Verfahrenslage',
    transparency_focus: 'Regelbasierte Hinweise aus Falldaten: Fristlage, fehlende Unterlagen, Bescheidstatus – erklärt und begründet',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/fall/hinweise',
    source_file: 'docs/stories/arbeitsverwaltung/US-AV-008_Verfahrenslage_verstehen.md'
  },

  // ── Kita-Betrieb & Jugendamt-Steuerung ──────────────────────────────────────
  {
    id: 'US-KJ-001',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Tagesstand erfassen',
    role: 'Fachkraft / Kita-Leitung',
    status: 'ABGESCHLOSSEN',
    problem: 'Anwesenheiten werden auf Papier oder in Excel erfasst – nicht aggregierbar, nicht für Monatsberichte nutzbar',
    screen: 'Tagesstand-Erfassung (aggregiert, session-lokal)',
    transparency_focus: 'Lückenloser Nachweis für Förderabrechnungen und Betriebskontrollen',
    acceptance_criteria_count: 4,
    implemented_criteria: 4, // demo-relevant; Offline/Kind-Einzelmarkierung nicht in Phase 0
    route: '/kita/tagesstand',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-001_Tagesstand_erfassen.md'
  },
  {
    id: 'US-KJ-002',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Belegungsstand einsehen',
    role: 'Kita-Leitung',
    status: 'ABGESCHLOSSEN',
    problem: 'Belegungssituation ist nicht tagesgenau abrufbar – Leitungen müssen manuell zählen',
    screen: 'Belegungsübersicht Einrichtung',
    transparency_focus: 'Tagesgenaue Übersicht belegte / freie / reservierte Plätze je Gruppe',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/kita/einrichtung',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-002_Belegungsstand_einsehen.md'
  },
  {
    id: 'US-KJ-003',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Monatsbericht abrufen',
    role: 'Kita-Leitung',
    status: 'ABGESCHLOSSEN',
    problem: 'Monatliche Auswertungen werden manuell aus heterogenen Quellen zusammengestellt – fehleranfällig und zeitaufwändig',
    screen: 'Monatsbericht Einrichtung',
    transparency_focus: 'Automatisch erzeugter Bericht mit Anwesenheitsquoten, Auslastung, Personalstunden',
    acceptance_criteria_count: 4,
    implemented_criteria: 4,
    route: '/kita/monatsbericht',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-003_Monatsbericht_abrufen.md'
  },
  {
    id: 'US-KJ-004',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Meldung prüfen und freigeben',
    role: 'Kita-Leitung',
    status: 'ABGESCHLOSSEN',
    problem: 'Meldungen an das Jugendamt werden manuell erstellt – vollautomatische Übermittlung ohne Kontrolle ist keine akzeptable Alternative',
    screen: 'Meldefreigabe Monatsmeldung',
    transparency_focus: 'Aktive Freigabe durch Leitung – keine Datenübermittlung ohne Kenntnis und Bestätigung',
    acceptance_criteria_count: 4,
    implemented_criteria: 4,
    route: '/kita/meldung',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-004_Meldung_freigeben.md'
  },
  {
    id: 'US-KJ-005',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Versorgungslagebild abrufen',
    role: 'Jugendamt Planung',
    status: 'DEMONSTRIERBAR',
    problem: 'Lagebilder werden manuell aus heterogenen Meldungen zusammengestellt – veraltet, unvollständig, für politische Prozesse kaum nutzbar',
    screen: 'Steuerungslagebild',
    transparency_focus: 'Alle Kennzahlen mit Definition und Datenstand – keine Einzelabfragen bei Einrichtungen',
    acceptance_criteria_count: 5,
    implemented_criteria: 4,
    route: '/kita/lagebild',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-005_Versorgungslagebild_abrufen.md'
  },
  {
    id: 'US-KJ-006',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Engpass-Regionen identifizieren',
    role: 'Jugendamt Planung',
    status: 'DEMONSTRIERBAR',
    problem: 'Engpässe werden erst sichtbar, wenn Eltern sich beschweren oder Meldungen im Stadtrat landen – keine laufende Engpassanalyse',
    screen: 'Steuerungslagebild · Engpassrangliste',
    transparency_focus: 'Nachvollziehbare Engpasspriorisierung auf Basis messbarer Faktoren – keine Blackbox',
    acceptance_criteria_count: 5,
    implemented_criteria: 3,
    route: '/kita/lagebild#kita-lagebild-engpass',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-006_Engpass_Regionen_identifizieren.md'
  },
  {
    id: 'US-KJ-007',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Bedarfsplanungsentwurf erstellen',
    role: 'Jugendamt Planung',
    status: 'DEMONSTRIERBAR',
    problem: 'Bedarfsplanung (§ 80 SGB VIII) basiert auf Jahresberichten und Schätzungen statt auf aktuellen Betriebsdaten',
    screen: 'Bedarfsplanung · Entwurf',
    transparency_focus: 'Planungsentwurf mit nachvollziehbarer Datengrundlage und ausgewiesener Planungslücke',
    acceptance_criteria_count: 6,
    implemented_criteria: 5,
    route: '/kita/bedarfsplanung',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-007_Bedarfsplanung_erstellen.md'
  },
  {
    id: 'US-KJ-008',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Politische Vorlage freigeben',
    role: 'Jugendamtsleitung',
    status: 'DEMONSTRIERBAR',
    problem: 'Vorlagen für den Jugendhilfeausschuss werden manuell erstellt – Datenbasis nicht transparent dokumentiert',
    screen: 'Politische Vorlage · Freigabe',
    transparency_focus: 'Vorlage mit expliziter Datenquelle, Aktualität und Methodik für politische Gremien',
    acceptance_criteria_count: 6,
    implemented_criteria: 5,
    route: '/kita/vorlage',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-008_Politische_Vorlage_freigeben.md'
  },
  {
    id: 'US-KJ-009',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Öffentlichen Transparenzbericht einsehen',
    role: 'Bürger / Öffentlichkeit',
    status: 'ABGESCHLOSSEN',
    problem: 'Öffentliche Informationen zur Kitaversorgung sind nicht vorhanden oder auf Presseberichte beschränkt – Bürger können die Lage nicht selbst einschätzen',
    screen: 'Transparenzbericht (öffentlich)',
    transparency_focus: 'Auslastung, Warteliste, freie Plätze – ohne Registrierung, inkl. Methodik und Datenlücken',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/kita',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-009_Transparenzbericht_einsehen.md'
  },
  {
    id: 'US-KJ-010',
    domain: 'Kita-Betrieb & Jugendamt-Steuerung',
    title: 'Zeitreihen und Regionenvergleich analysieren',
    role: 'Öffentlichkeit / Presse / Gremien',
    status: 'DEMONSTRIERBAR',
    problem: 'Berichte über Kitaversorgung basieren auf Einzelaussagen und Pressemitteilungen – kein Zugang zu maschinenlesbaren Zeitreihendaten',
    screen: 'Transparenzbericht · Zeitreihe (12 Monate)',
    transparency_focus: '12-Monats-Zeitreihe mit Deltas, CSV-Export, Methodik je Kennzahl direkt eingeblendet',
    acceptance_criteria_count: 5,
    implemented_criteria: 3,
    route: '/kita#kita-transparenz-zeitreihe',
    source_file: 'docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-010_Zeitreihen_Regionenvergleich.md'
  },

  // ── Unternehmensgründung ───────────────────────────────────────────────────
  {
    id: 'US-UG-001',
    domain: 'Unternehmensgründung',
    title: 'Gründungsstatus einsehen',
    role: 'Gründerin / Gründer',
    status: 'ABGESCHLOSSEN',
    problem: 'Gründer wissen nicht, wo ihre Gewerbeanmeldung steht, und müssen bei mehreren Behörden nachfragen',
    screen: 'Gründungsakte / Übersicht',
    transparency_focus: 'Klartext-Status, Fortschritt und nächster Schritt ohne internen Code',
    acceptance_criteria_count: 6,
    implemented_criteria: 6,
    route: '/gruendung',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-001_Gruendungsstatus_einsehen.md'
  },
  {
    id: 'US-UG-002',
    domain: 'Unternehmensgründung',
    title: 'Beteiligte Behörden einsehen',
    role: 'Gründerin / Gründer',
    status: 'ABGESCHLOSSEN',
    problem: 'Mehrere Behörden sind beteiligt, Zuständigkeiten und Bearbeitungsstände sind nicht an einem Ort sichtbar',
    screen: 'Behördenübersicht',
    transparency_focus: 'Rolle, Status und Kontakt je Behörde erklärbar',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/gruendung/behoerden',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-002_Behoerden_einsehen.md'
  },
  {
    id: 'US-UG-003',
    domain: 'Unternehmensgründung',
    title: 'Unterlagen nachreichen',
    role: 'Gründerin / Gründer',
    status: 'DEMONSTRIERBAR',
    problem: 'Dokumentenanforderungen kommen ohne ausreichenden Kontext, Begründung und Formatangabe',
    screen: 'Unterlagen / Dokumente',
    transparency_focus: 'Anforderung mit Begründung, Rechtsgrundlage und Dokumentenstatus',
    acceptance_criteria_count: 6,
    implemented_criteria: 5, // echte Formatvalidierung analog AV nicht in Demo
    route: '/gruendung/dokumente',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-003_Unterlagen_nachreichen.md'
  },
  {
    id: 'US-UG-004',
    domain: 'Unternehmensgründung',
    title: 'Rückfrage verstehen und beantworten',
    role: 'Gründerin / Gründer',
    status: 'ABGESCHLOSSEN',
    problem: 'Rückfragen kommen in Behördensprache ohne Frist und Konsequenz',
    screen: 'Rückfragen',
    transparency_focus: 'Frage, Begründung, Frist und Konsequenz je Rückfrage',
    acceptance_criteria_count: 6,
    implemented_criteria: 6,
    route: '/gruendung/rueckfragen',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-004_Rueckfrage_verstehen.md'
  },
  {
    id: 'US-UG-005',
    domain: 'Unternehmensgründung',
    title: 'Verfahrensverlauf nachvollziehen',
    role: 'Gründerin / Gründer',
    status: 'ABGESCHLOSSEN',
    problem: 'Es fehlt eine chronologische Übersicht, wer wann was in der Gründungsakte entschieden hat',
    screen: 'Verlauf / Timeline',
    transparency_focus: 'Lückenlose Timeline mit Ereignistyp, Datum und Urheber',
    acceptance_criteria_count: 5,
    implemented_criteria: 5,
    route: '/gruendung/verlauf',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-005_Verlauf_nachvollziehen.md'
  },
  {
    id: 'US-UG-006',
    domain: 'Unternehmensgründung',
    title: 'Nächste Schritte und Pflichten verstehen',
    role: 'Gründerin / Gründer',
    status: 'ABGESCHLOSSEN',
    problem: 'Generische Checklisten passen nicht zum konkreten Fall; Handlungsträger und Konsequenzen unklar',
    screen: 'Übersicht / Hinweise',
    transparency_focus: 'Fallbezogene nächste Schritte mit Begründung und Handlungsträger',
    acceptance_criteria_count: 5,
    implemented_criteria: 5, // Q-610: Methodik-Hinweis „keine Rechtsauskunft“ auf /gruendung/hinweise
    route: '/gruendung/hinweise',
    source_file: 'docs/stories/unternehmensgruendung/US-UG-006_Naechste_Schritte_verstehen.md'
  },
];
