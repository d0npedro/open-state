/**
 * Mock: Monatsmeldung Kita Sonnenwinkel → Jugendamt (US-KJ-004)
 *
 * Abgeleitet aus Monatsbericht / Belegung (fiktive Aggregate Musterstadt).
 * Keine Kind- oder Personennamen. Keine automatische Übermittlung.
 */

import type { KitaMonatsmeldung } from '@/types/kitaMeldung';

export const demoKitaMonatsmeldung: KitaMonatsmeldung = {
  id: 'MM-EINR-DEMO-01-2024-10',
  einrichtungId: 'EINR-DEMO-01',
  einrichtungBezeichnung: 'Kita Sonnenwinkel',
  traeger: 'Freier Träger „Gemeinsam wachsen e. V.“ (fiktiv)',
  planungsraumBezeichnung: 'Südost',
  monatsLabel: 'Oktober 2024',
  monatsIso: '2024-10',
  monatsberichtId: 'MB-EINR-DEMO-01-2024-10',
  status: 'ZUR_PRUEFUNG',
  meldefrist: '2024-11-15',
  meldefristLabel: '15. November 2024',
  /** Nach Frist → UI-Zustand „Überfällig“ (kein Auto-Senden) */
  fiktivesHeute: '2024-11-18',
  standLabel: 'Systemvorschlag aus freigegebenen Tagesständen / Monatsbericht (Demo)',
  kennzahlen: {
    genehmigtePlaetze: 88,
    belegtePlaetze: 61,
    freiePlaetze: 4,
    wartelisteBestand: 14,
    personalAusfallquoteProzent: 7.2,
    tagePersonalschluesselUnterschritten: 4,
    auslastungsgradProzent: 86.4,
    anwesenheitsquoteProzent: 86.6,
  },
  hinweise: [
    'Datenlücke: Tagesstand 2024-10-14 fehlt – Kennzahlen basieren auf 22 von 23 Betriebstagen (nicht interpoliert).',
    'Elementargruppe Sterne temporär geschlossen (Sanierung/Havarie) – belegte und freie Plätze dieser Gruppe: 0.',
    'Zwei Plätze Elementargruppe Mond wegen Sanierung vorübergehend nicht nutzbar (genehmigt ≠ real nutzbar).',
  ],
  methodikKurz:
    'Monatsmeldung = Aggregate der Einrichtung (Plätze, Auslastung, Warteliste, Personalausfall, Schlüssel-Unterschreitungstage). ' +
    'Keine Kindlisten, keine Personalnamen. Quelle: Monatsbericht US-KJ-003 / Tagesstände US-KJ-001.',
  rechtsgrundlageHinweis:
    'Konzept-Demo: digitale Monatsmeldung an die Jugendamt-Steuerung. Konkrete landesrechtliche Form- und Fristrechte sind je Bundesland zu klären (Policy-Offenheit US-KJ-004).',
};
