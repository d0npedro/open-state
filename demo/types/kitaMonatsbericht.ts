/**
 * Monatsbericht Einrichtung (US-KJ-003)
 *
 * Nur Aggregate: keine Kind- oder Personennamen.
 * Vorjahresvergleich und Datenlücken sind Teil der Methodik-Transparenz.
 * Datenbasis: freigegebene Tagesstände (US-KJ-001) – sichtbar, nicht still angenommen.
 */

export type MonatsberichtStatus = 'VOLLSTAENDIG' | 'LUECKENHAFT' | 'VORSCHAU';

/** Status eines Betriebstags in der Monats-Datenbasis (keine Personenbezüge) */
export type MonatsberichtTagesstandQuellenStatus =
  | 'FREIGEGEBEN'
  | 'FEHLT'
  | 'IN_ERFASSUNG';

/**
 * Ein Betriebstag als Quelle des Monatsberichts.
 * Nur Tages-Aggregate und Freigabe-Metadaten – keine Kind-/Personennamen.
 */
export interface MonatsberichtTagesstandQuelle {
  /** Leer wenn FEHLT */
  tagesstandId: string | null;
  datumIso: string;
  datumLabel: string;
  status: MonatsberichtTagesstandQuellenStatus;
  /** Summe anwesende Kinder (offene Gruppen) – nur bei FREIGEGEBEN */
  anwesendGesamt: number | null;
  /** Summe Ist-Fachkraft-Stunden – nur bei FREIGEGEBEN */
  personalIstStundenGesamt: number | null;
  /** Mindestens eine Gruppe mit Schlüssel-Unterschreitung am Tag */
  personalschluesselUnterschritten: boolean | null;
  freigegebenAm: string | null;
  freigegebenDurchRolle: string | null;
}

export interface GruppeMonatsKennzahlen {
  gruppeId: string;
  bezeichnung: string;
  altersgruppe: 'U3' | 'UE3' | 'MISCH';
  /** Anteil Anwesenheitstage / mögliche Belegungstage (Demo-Definition) */
  anwesenheitsquoteProzent: number;
  anwesenheitsquoteVorjahrProzent: number;
  auslastungsgradProzent: number;
  auslastungsgradVorjahrProzent: number;
  personalAusfallquoteProzent: number;
  personalAusfallquoteVorjahrProzent: number;
  /** Kalendertage mit Unterschreitung des Personalschlüssels (ohne automatische Meldung) */
  tagePersonalschluesselUnterschritten: number;
  tagePersonalschluesselUnterschrittenVorjahr: number;
}

export interface KitaMonatsbericht {
  id: string;
  einrichtungId: string;
  einrichtungBezeichnung: string;
  traeger: string;
  planungsraumBezeichnung: string;
  /** z. B. „Oktober 2024“ */
  monatsLabel: string;
  /** ISO-Monat yyyy-mm */
  monatsIso: string;
  vorjahresLabel: string;
  standLabel: string;
  status: MonatsberichtStatus;
  betriebstageImMonat: number;
  erfassteTagesstaende: number;
  /** ISO-Daten fehlender Tagesstände – nicht still aufgefüllt */
  fehlendeTage: string[];
  /**
   * Explizite Datenbasis: freigegebene Tagesstände (US-KJ-001).
   * Länge = betriebstageImMonat; FEHLT-Einträge = fehlendeTage.
   */
  tagesstandQuellen: MonatsberichtTagesstandQuelle[];
  gruppen: GruppeMonatsKennzahlen[];
  gesamt: {
    anwesenheitsquoteProzent: number;
    anwesenheitsquoteVorjahrProzent: number;
    auslastungsgradProzent: number;
    auslastungsgradVorjahrProzent: number;
    personalAusfallquoteProzent: number;
    personalAusfallquoteVorjahrProzent: number;
    tagePersonalschluesselUnterschritten: number;
    tagePersonalschluesselUnterschrittenVorjahr: number;
  };
  /** Sichtbare Berechnungsgrundlagen (AK 4) */
  methodik: {
    anwesenheitDefinition: string;
    auslastungDefinition: string;
    personalAusfallDefinition: string;
    personalschluesselDefinition: string;
    datenquelle: string;
  };
}
