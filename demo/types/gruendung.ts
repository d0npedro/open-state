/**
 * Typen für die Domäne Unternehmensgründung
 *
 * Modelliert eine digitale Gründungsakte mit:
 *  - Mehreren beteiligten Behörden (Gewerbeamt, Finanzamt, IHK/HWK)
 *  - Behördenspezifischen Verfahrensschritten
 *  - Transparenz-Feldern (Begründung, Konsequenz, Rechtsgrundlage)
 *  - Audit-Log aller Ereignisse
 */

// ─── Enumerationen ──────────────────────────────────────────────────────────

export type GruendungsStatus =
  | 'ENTWURF'
  | 'EINGEREICHT'
  | 'ANGENOMMEN'
  | 'RUECKFRAGE_AUSSTEHEND'
  | 'RUECKFRAGE_BEANTWORTET'
  | 'IN_BEARBEITUNG'
  | 'ENTSCHEIDUNG_AUSSTEHEND'
  | 'GENEHMIGT'
  | 'ABGELEHNT'
  | 'WIDERSPRUCH_EINGELEITET'
  | 'WIDERSPRUCH_IN_BEARBEITUNG'
  | 'AKTIVER_BETRIEB'
  | 'BETRIEB_EINGESTELLT'
  | 'STILLSTAND_MARKIERT';

export type Rechtsform =
  | 'EINZELUNTERNEHMEN'
  | 'GBR'
  | 'UG'
  | 'GMBH'
  | 'FREIBERUFLICH'
  | 'VEREIN'
  | 'SONSTIGE';

export type BehördeTyp =
  | 'GEWERBEAMT'
  | 'FINANZAMT'
  | 'IHK'
  | 'HWK'
  | 'BERUFSGENOSSENSCHAFT'
  | 'SONSTIGE';

export type BehördeStatus =
  | 'NICHT_GESTARTET'
  | 'IN_BEARBEITUNG'
  | 'RUECKFRAGE_OFFEN'
  | 'ABGESCHLOSSEN'
  | 'BLOCKIERT';

export type DokumentStatusUG =
  | 'ANGEFORDERT'
  | 'HOCHGELADEN'
  | 'IN_PRUEFUNG'
  | 'AKZEPTIERT'
  | 'ABGELEHNT';

export type SchrittStatus =
  | 'AUSSTEHEND'
  | 'IN_BEARBEITUNG'
  | 'ABGESCHLOSSEN'
  | 'BLOCKIERT';

export type GruendungsEreignisTyp =
  | 'vorgang_erstellt'
  | 'dokument_hochgeladen'
  | 'vorgang_eingereicht'
  | 'eingang_bestaetigt'
  | 'rueckfrage_gestellt'
  | 'rueckfrage_beantwortet'
  | 'dokument_akzeptiert'
  | 'dokument_abgelehnt'
  | 'bescheid_erteilt'
  | 'ablehnung_erteilt'
  | 'steuernummer_vergeben'
  | 'status_aktualisiert'
  | 'stillstand_markiert'
  | 'zustaendigkeitswechsel'
  | 'gruendungsakte_abgeschlossen';

// ─── Entitäten ───────────────────────────────────────────────────────────────

export interface BeteiligteBehörde {
  id: string;
  bezeichnung: string;
  typ: BehördeTyp;
  status: BehördeStatus;
  zustaendigeStelle: string;
  adresse?: string;
  kontakt?: string;
  /** Freier Hinweis, z. B. was diese Behörde im Verfahren prüft */
  rolle: string;
}

export interface VerfahrensSchritt {
  id: string;
  bezeichnung: string;
  beschreibung: string;
  behördeId: string;
  status: SchrittStatus;
  rechtsgrundlage?: string;
  erledigtAm?: string;
  ergebnis?: string;
}

export interface GruendungsDokument {
  id: string;
  bezeichnung: string;
  /** Warum wird dieses Dokument benötigt? */
  begründung: string;
  /** Was passiert, wenn es nicht eingereicht wird? */
  konsequenz: string;
  status: DokumentStatusUG;
  anforderndeBehördeId: string;
  frist?: string;
  fristDatum?: string;
  hochgeladenAm?: string;
  ablehnungsgrund?: string;
}

export interface GruendungsRueckfrage {
  id: string;
  text: string;
  begründung: string;
  konsequenz: string;
  anforderndeBehördeId: string;
  frist: string;
  fristDatum: string;
  beantwortet: boolean;
  gestelltAm: string;
}

export interface GruendungsEreignis {
  id: string;
  typ: GruendungsEreignisTyp;
  zeitstempel: string;
  handelndeStelle: 'GRUENDER' | 'BEHOERDE' | 'SYSTEM';
  behördeId?: string;
  beschreibung: string;
  details?: string;
}

// ─── Hauptentität ───────────────────────────────────────────────────────────

export interface GruendungsAkte {
  id: string;
  vorgangstyp: string;
  rechtsform: Rechtsform;
  gewerbebezeichnung: string;
  wzCode: string;
  wzBezeichnung: string;

  status: GruendungsStatus;
  statusBeschreibung: string;
  naechsterSchritt: string;
  offeneAufgaben: string[];

  ersteinreichung: string;
  letzteAktualisierung: string;
  /** Geplantes Gründungsdatum (optional, ohne verbindliche Wirkung) */
  geplantesBetriebsdatum?: string;

  beteiligteBehörden: BeteiligteBehörde[];
  verfahrensSchritte: VerfahrensSchritt[];
  dokumente: GruendungsDokument[];
  rueckfragen: GruendungsRueckfrage[];
  ereignisse: GruendungsEreignis[];
}
