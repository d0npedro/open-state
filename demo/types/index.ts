export type FallStatus =
  | 'ANGELEGT'
  | 'EINGEGANGEN'
  | 'IN_PRUEFUNG'
  | 'UNTERLAGEN_FEHLEN'
  | 'RUECKFRAGE_OFFEN'
  | 'TERMIN_ANGESETZT'
  | 'ENTSCHEIDUNG_VORBEREITET'
  | 'BESCHEID_ZUGESTELLT'
  | 'PAUSIERT';

export type DokumentStatus = 'ANGEFORDERT' | 'HOCHGELADEN' | 'IN_PRUEFUNG' | 'AKZEPTIERT' | 'ABGELEHNT';
export type EreignisTyp = 'FALL_ANGELEGT' | 'DOKUMENT_ANGEFORDERT' | 'DOKUMENT_EINGEREICHT' | 'RUECKFRAGE_GESTELLT' | 'RUECKFRAGE_BEANTWORTET' | 'TERMIN_ZUGETEILT' | 'STATUS_GEAENDERT' | 'BESCHEID_ERSTELLT' | 'BESCHEID_ZUGESTELLT' | 'WIDERSPRUCH_EINGEREICHT';
export type StoryStatus = 'ENTWURF' | 'BEREIT' | 'IN_ENTWICKLUNG' | 'DEMONSTRIERBAR' | 'ABGESCHLOSSEN';

export interface Dokument {
  id: string;
  bezeichnung: string;
  status: DokumentStatus;
  begründung: string;
  frist?: string;
  hochgeladenAm?: string;
}

export interface Rueckfrage {
  id: string;
  text: string;
  begründung: string;
  konsequenz: string;
  frist: string;
  fristTage: number;
  beantwortet: boolean;
  gestelltAm: string;
}

export interface Termin {
  id: string;
  zweck: string;
  datum: string;
  uhrzeit: string;
  format: 'PERSOENLICH' | 'DIGITAL';
  ort?: string;
  vorbereitung: string[];
  status: 'BESTAETIGT' | 'AUSSTEHEND' | 'ABGESAGT';
}

export interface Bescheid {
  id: string;
  typ: string;
  datum: string;
  rechtlicheFassung: string;
  erklaerung: string;
  entscheidung: string;
  begruendung: string;
  rechtsgrundlage: string;
  widerspruchsfristTage: number;
  widerspruchsfristAblauf: string;
}

export interface TimelineEreignis {
  id: string;
  typ: EreignisTyp;
  zeitstempel: string;
  handelndeStelle: 'BUERGER' | 'SACHBEARBEITUNG' | 'SYSTEM';
  beschreibung: string;
  details?: string;
}

export interface Fall {
  id: string;
  typ: string;
  status: FallStatus;
  statusBeschreibung: string;
  angelegtAm: string;
  letzteAktivitaet: string;
  naechsterSchritt: string;
  offeneAufgaben: string[];
  dokumente: Dokument[];
  rueckfragen: Rueckfrage[];
  termine: Termin[];
  bescheide: Bescheid[];
  timeline: TimelineEreignis[];
}

export interface StoryRegistryEntry {
  id: string;
  domain: string;
  title: string;
  role: string;
  status: StoryStatus;
  problem: string;
  screen: string;
  transparency_focus: string;
  acceptance_criteria_count: number;
  source_file: string;
  route?: string;
  implemented_criteria?: number;
}
