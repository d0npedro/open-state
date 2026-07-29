/**
 * Monatsbericht Einrichtung (US-KJ-003)
 *
 * Nur Aggregate: keine Kind- oder Personennamen.
 * Vorjahresvergleich und Datenlücken sind Teil der Methodik-Transparenz.
 */

export type MonatsberichtStatus = 'VOLLSTAENDIG' | 'LUECKENHAFT' | 'VORSCHAU';

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
