/**
 * Monatsmeldung Kita → Jugendamt (US-KJ-004)
 *
 * Nur Aggregate: keine Kind- oder Personennamen.
 * Freigabe nur aktiv durch Kita-Leitung (kein stilles Senden).
 */

export type MeldungStatus =
  | 'ENTWURF'
  | 'ZUR_PRUEFUNG'
  | 'FREIGEGEBEN'
  | 'ZURUECKGEWIESEN';

/** Meldeinhalt (editierbar vor Freigabe; Korrekturen werden protokolliert) */
export interface MeldungKennzahlen {
  genehmigtePlaetze: number;
  belegtePlaetze: number;
  /** Real nutzbare freie Plätze (Monatsmittel / Stichtag laut Methodik) */
  freiePlaetze: number;
  wartelisteBestand: number;
  personalAusfallquoteProzent: number;
  /** Summe Betriebstage mit Personalschlüssel-Unterschreitung (Einrichtung) */
  tagePersonalschluesselUnterschritten: number;
  auslastungsgradProzent: number;
  anwesenheitsquoteProzent: number;
}

export interface MeldungKorrektur {
  feld: keyof MeldungKennzahlen;
  wertVorher: number;
  wertNachher: number;
  begruendung: string;
  dokumentiertAm: string;
  rolle: string;
}

export interface MeldungFreigabe {
  freigabeId: string;
  freigegebenAm: string;
  freigegebenDurchRolle: string;
  /** Session-Demo: simulierter JA-Eingang */
  eingegangenBeimJugendamtAm: string;
  bestaetigt: true;
}

export interface KitaMonatsmeldung {
  id: string;
  einrichtungId: string;
  einrichtungBezeichnung: string;
  traeger: string;
  planungsraumBezeichnung: string;
  monatsLabel: string;
  monatsIso: string;
  /** Quelle: Monatsbericht-ID (US-KJ-003) */
  monatsberichtId: string;
  status: MeldungStatus;
  /** ISO-Datum Meldefrist */
  meldefrist: string;
  meldefristLabel: string;
  /** Fiktiver Demo-Stichtag für Fristbewertung */
  fiktivesHeute: string;
  standLabel: string;
  kennzahlen: MeldungKennzahlen;
  /** Methodische Hinweise, die mitgemeldet werden */
  hinweise: string[];
  methodikKurz: string;
  rechtsgrundlageHinweis: string;
}
