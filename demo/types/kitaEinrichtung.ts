/**
 * Einrichtungsebene Kita (Betriebs-/Leitungsansicht, Demo)
 *
 * Strikt aggregiert: keine Kind- oder Vertragsnamen.
 * Dient US-KJ-002 (Belegungsstand).
 */

export type GruppeEinschraenkung =
  | 'KEINE'
  | 'TEMPORAER_GESCHLOSSEN'
  | 'REDUZIERT'
  | 'PERSONALMANGEL';

export interface KitaGruppeBelegung {
  id: string;
  bezeichnung: string;
  altersgruppe: 'U3' | 'UE3' | 'MISCH';
  genehmigtePlaetze: number;
  belegtePlaetze: number;
  reserviertePlaetze: number;
  /** Freie = genehmigt − belegt − reserviert (kann 0 sein) */
  freiePlaetze: number;
  einschraenkung: GruppeEinschraenkung;
  /** Erklärtext bei Einschränkung */
  einschraenkungHinweis?: string;
  /** ISO-Datum der geplanten Normalisierung, falls eingeschränkt */
  einschraenkungBis?: string;
}

export interface KitaEinrichtungBelegung {
  id: string;
  bezeichnung: string;
  traeger: string;
  planungsraumId: string;
  planungsraumBezeichnung: string;
  /** Anzeige-Datum des Stands (fiktiv, Demo) */
  standLabel: string;
  /** ISO-Datum der letzten Erfassung */
  letzteErfassung: string;
  /** Fiktives „heute“ der Demo-Session */
  fiktivesHeute: string;
  gruppen: KitaGruppeBelegung[];
}
