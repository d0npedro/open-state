/**
 * Typen für die Kita-Domäne (Kindertagesbetreuung)
 *
 * Drei Schichten:
 *  1. Transparenzebene – öffentlich sichtbare Kennzahlen
 *  2. Steuerungsebene  – Jugendamt-intern (in Demo als separate Route simuliert)
 *  3. Methodik        – Definitionen und Berechnungsformeln
 *
 * Kein Personenbezug. Kein Einrichtungsbezug in der öffentlichen Schicht.
 */

// ─── Altersgruppen ──────────────────────────────────────────────────────────

export type Altersgruppe = 'U3' | 'UE3' | 'SCHULKIND';

// ─── Planungsraum-Kennzahlen (öffentlich) ───────────────────────────────────

export interface VersorgungsquoteAltersgruppe {
  /** Anteil versorgter Kinder unter 3 Jahren (0–100) */
  u3: number;
  /** Anteil versorgter Kinder von 3–6 Jahren (0–100) */
  ue3: number;
}

export interface PlanungsraumKennzahlen {
  id: string;
  bezeichnung: string;

  /** Bevölkerungsgrundlage (aus amtlicher Statistik) */
  einwohnerKinderU3: number;
  einwohnerKinderUe3: number;

  /** Plätze */
  genehmmigtePlaetzeU3: number;
  genehmmigtePlaetzeUe3: number;
  /** Real nutzbar = genehmigt minus dauerhaft nicht nutzbare (Umbau/Schließung) */
  realNutzbarePlaetzeU3: number;
  realNutzbarePlaetzeUe3: number;
  belegtePlaetzeU3: number;
  belegtePlaetzeUe3: number;
  freiePlaetzeU3: number;
  freiePlaetzeUe3: number;

  versorgungsquote: VersorgungsquoteAltersgruppe;
  auslastungsgradProzent: number;

  /** Wartelistendruck: Anfragen / freie Plätze. > 1 = Engpass */
  wartelisteBestand: number;
  wartelisteDruckFaktor: number;

  /** Personalausfallquote im Planungsraum (Durchschnitt aller Einrichtungen) */
  personalAusfallquoteProzent: number;

  inklusionsplaetzeGenehmigt: number;
  inklusionsplaetzeBelegt: number;
}

// ─── Monatliche Zeitreihe (Gesamtkommune, öffentlich) ───────────────────────

export interface MonatsKennzahl {
  /** YYYY-MM */
  monat: string;
  /** Lesbare Bezeichnung z. B. "Oktober 2024" */
  monatLabel: string;
  genehmmigtePlaetze: number;
  realNutzbarePlaetze: number;
  belegtePlaetze: number;
  freiePlaetze: number;
  auslastungsgradProzent: number;
  wartelisteBestand: number;
  personalAusfallquoteProzent: number;
  /** Veränderung Warteliste gegenüber Vormonat */
  wartelisteDeltaVormonat: number | null;
}

// ─── Kapazitätsmaßnahmen ────────────────────────────────────────────────────

export type MassnahmeTyp = 'NEUBAU' | 'ERWEITERUNG' | 'UMBAU';
export type MassnahmeStatus = 'IN_PLANUNG' | 'GENEHMIGT' | 'IM_BAU' | 'FERTIGGESTELLT';

export interface Kapazitaetsmassnahme {
  id: string;
  planungsraumId: string;
  planungsraumBezeichnung: string;
  bezeichnung: string;
  typ: MassnahmeTyp;
  status: MassnahmeStatus;
  erwarteteNeuePlaetze: number;
  /** YYYY-MM */
  geplanteFertigstellung: string;
  rechtsgrundlage: string;
}

// ─── Methodik ───────────────────────────────────────────────────────────────

export interface MethodikHinweis {
  kennzahl: string;
  definition: string;
  berechnungsformel?: string;
  datenquelle: string;
  einschraenkungen?: string;
}

// ─── Gesamtes Lagebild (öffentliche Transparenzschicht) ─────────────────────

export interface KitaLagebild {
  /** ISO-Datum des Datenstands (YYYY-MM-DD) */
  stand: string;
  berichtszeitraum: string;
  version: string;
  freigegebenAm: string;
  /** Rolle der freigebenden Person – kein Personenname */
  freigegebenVon: string;
  kommuneBezeichnung: string;

  /** Kommunale Gesamtkennzahlen */
  gesamt: {
    genehmmigtePlaetze: number;
    realNutzbarePlaetze: number;
    belegtePlaetze: number;
    freiePlaetze: number;
    auslastungsgradProzent: number;
    wartelisteBestand: number;
    personalAusfallquoteProzent: number;
    versorgungsquote: VersorgungsquoteAltersgruppe;
    inklusionsplaetzeGenehmigt: number;
    inklusionsplaetzeBelegt: number;
  };

  planungsraeume: PlanungsraumKennzahlen[];
  /** Letzte 12 Monate, chronologisch aufsteigend */
  zeitreihe: MonatsKennzahl[];
  massnahmen: Kapazitaetsmassnahme[];
  methodik: MethodikHinweis[];
}
