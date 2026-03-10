/**
 * Verfahrensfairness-Hinweismodell
 *
 * Signale markieren nachvollziehbare Merkmale des Fallzustands.
 * Sie treffen keine Entscheidungen und ersetzen keine Sachbearbeitung.
 * Jedes Signal wird aus konkreten Falldaten abgeleitet und ist vollständig erklärbar.
 */

export type FairnessSignalTyp =
  | 'RUECKFRAGE_OFFEN_FRIST_RELEVANT'
  | 'UNTERLAGE_FEHLT_BLOCKIERT'
  | 'FALL_PAUSIERT'
  | 'BESCHEID_VORLAEUFIG'
  | 'BESCHEID_BEGRUENDUNG_ERWEITERBAR';

/**
 * Priorität eines Hinweises – beeinflusst nur die visuelle Darstellung,
 * nicht die inhaltliche Wertung.
 */
export type FairnessSignalPrioritaet = 'RELEVANT' | 'HINWEIS' | 'INFO';

export interface FairnessSignal {
  /** Eindeutige ID des Signals im aktuellen Fallkontext */
  id: string;
  typ: FairnessSignalTyp;
  /** Kurzer, sachlicher Titel */
  titel: string;
  /** Erklärung: Was wird hier angezeigt und warum? */
  erklaerung: string;
  /** Auswirkung auf den Fall, wenn nichts passiert */
  auswirkung: string;
  /** Empfohlener nächster Schritt – keine Vorschrift, sondern Orientierung */
  naechsterSchritt: string;
  /** Welcher konkrete Falldatenpunkt hat dieses Signal ausgelöst? */
  bezug: string;
  prioritaet: FairnessSignalPrioritaet;
}
