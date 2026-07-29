/**
 * Tagesstand Einrichtung (US-KJ-001)
 *
 * Nur Aggregate: keine Kind- oder Personennamen.
 * Personalschlüssel-Unterschreitung wird angezeigt, nicht automatisch gemeldet.
 */

export type TagesstandStatus =
  | 'NICHT_ERFASST'
  | 'IN_ERFASSUNG'
  | 'ZUR_FREIGABE'
  | 'FREIGEGEBEN';

/** Aggregierte Kinderzahlen je Gruppe (keine Namen) */
export interface TagesstandKinderAggregate {
  anwesend: number;
  krank: number;
  urlaub: number;
  sonstiges: number;
}

/** Personalstunden je Gruppe – keine Personennamen */
export interface TagesstandPersonalAggregate {
  /** Geplante Fachkraft-Stunden am Stichtag */
  geplantStunden: number;
  /** Tatsächliche Fachkraft-Stunden am Stichtag */
  istStunden: number;
}

export interface TagesstandGruppe {
  gruppeId: string;
  bezeichnung: string;
  altersgruppe: 'U3' | 'UE3' | 'MISCH';
  /** Belegte Plätze (Soll-Basis aus Belegung, Demo) */
  belegtePlaetze: number;
  /** Geschlossen / nicht betreut an diesem Tag */
  geschlossen: boolean;
  kinder: TagesstandKinderAggregate;
  personal: TagesstandPersonalAggregate;
  /**
   * Mindest-Verhältnis: anwesende Kinder pro Ist-Fachkraft-Stunde (vereinfachte Demo-Regel).
   * U3 strenger als Ü3. Kein Ersatz für landesrechtlichen Schlüssel.
   */
  maxKinderProFachkraftStunde: number;
}

export interface TagesstandFreigabe {
  freigegebenAm: string;
  freigegebenDurchRolle: string;
  bestaetigt: true;
}

export interface KitaTagesstand {
  id: string;
  einrichtungId: string;
  einrichtungBezeichnung: string;
  traeger: string;
  planungsraumBezeichnung: string;
  /** ISO-Datum des Tagesstands */
  datumIso: string;
  datumLabel: string;
  /** Fiktiver Demo-„heute“-Bezug */
  fiktivesHeute: string;
  status: TagesstandStatus;
  gruppen: TagesstandGruppe[];
  methodikKurz: string;
  rechtsgrundlageHinweis: string;
  datenschutzHinweis: string;
}
