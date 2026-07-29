/**
 * Gemeinsamer Lizenz- und Nutzungs-Hinweis für öffentliche Kita-CSV-Exporte (US-KJ-010).
 *
 * Keine endgültige Rechtsentscheidung: Open-Data-Lizenzierung ist je Bundesland zu klären.
 * Demo macht den Status transparent und schlägt eine vorläufige Nachnutzung mit Quellenangabe vor.
 * Nur Aggregate — keine Kind- oder Personennamen.
 */

/** Zeilen für den CSV-Metakommentarkopf (mit führendem `#`). */
export const KITA_CSV_LIZENZ_META_LINES: readonly string[] = [
  '# Datenlizenz (Demo-Hinweis, keine endgültige Rechtsentscheidung):',
  '# Öffentliche Aggregate zur Nachnutzung vorgesehen; finale Open-Data-Lizenz je Bundesland zu klären (US-KJ-010).',
  '# Vorschlag Demo-Nachnutzung: CC-BY 4.0-ähnlich mit Quellenangabe „Open State Demo – Kita Transparenzbericht“.',
  '# Keine amtliche Statistik. Keine personen- oder kindbezogenen Einzeldaten. Keine automatische Trendbewertung.',
];

/** Kurzer UI-Hinweis neben Download-Buttons. */
export const KITA_CSV_LIZENZ_UI_HINWEIS =
  'Lizenzhinweis (Demo): Open-Data-Status vorläufig — finale Lizenz je Bundesland zu klären. CSV-Metakopf enthält Quellen- und Nachnutzungshinweis (CC-BY-ähnlich). Nur Aggregate, keine Kind- oder Personennamen.';

/** Kurzer title/aria-Zusatz für Buttons. */
export const KITA_CSV_LIZENZ_BUTTON_TITLE =
  'Lizenzhinweis im CSV-Metakopf (Demo: Open-Data vorläufig, CC-BY-ähnlich mit Quellenangabe)';
