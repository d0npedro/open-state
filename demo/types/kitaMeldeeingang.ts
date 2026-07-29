/**
 * Meldeeingang Jugendamt (US-KJ-004 → US-KJ-005)
 *
 * Nur Einrichtungs-Aggregate: keine Kind- oder Personennamen.
 * Zeigt im Steuerungslagebild, welche Monatsmeldungen eingegangen sind.
 */

import type { MeldungKennzahlen, MeldungStatus } from '@/types/kitaMeldung';

/** JA-Sicht auf den Eingangsstatus einer Monatsmeldung */
export type MeldeeingangStatus =
  | 'FREIGEGEBEN'
  | 'AUSSTEHEND'
  | 'UEBERFAELLIG'
  | 'ENTWURF';

/** Kurz-Snapshot der freigegebenen Aggregate (für Lagebild-Hinweis) */
export interface MeldeeingangKennzahlenKurz {
  genehmigtePlaetze: number;
  belegtePlaetze: number;
  freiePlaetze: number;
  wartelisteBestand: number;
  personalAusfallquoteProzent: number;
  tagePersonalschluesselUnterschritten: number;
  auslastungsgradProzent: number;
  anwesenheitsquoteProzent: number;
}

export interface MeldeeingangEintrag {
  meldungId: string;
  einrichtungId: string;
  einrichtungBezeichnung: string;
  traeger: string;
  planungsraumId: string;
  planungsraumBezeichnung: string;
  monatsIso: string;
  monatsLabel: string;
  meldefrist: string;
  meldefristLabel: string;
  status: MeldeeingangStatus;
  /** ISO-Datum Freigabe, nur bei FREIGEGEBEN */
  freigegebenAm?: string;
  freigabeId?: string;
  freigegebenDurchRolle?: string;
  /** Aggregate nur nach Freigabe sichtbar für JA (Demo-Prinzip DEC-004) */
  kennzahlen?: MeldeeingangKennzahlenKurz;
  hinweise?: string[];
}

export interface KitaMeldeeingang {
  monatsIso: string;
  monatsLabel: string;
  /** Fiktiver Demo-Stichtag für Fristbewertung */
  fiktivesHeute: string;
  standLabel: string;
  /** Erwartete Meldungen im Berichtsmonat (Einrichtungsstichprobe Demo) */
  eintraege: MeldeeingangEintrag[];
  methodikKurz: string;
}

/** Session-Payload nach Freigabe in /kita/meldung (localStorage) */
export interface MeldeeingangSessionFreigabe {
  meldungId: string;
  einrichtungId: string;
  freigabeId: string;
  freigegebenAm: string;
  freigegebenDurchRolle: string;
  kennzahlen: MeldungKennzahlen;
  /** ISO-Zeitpunkt des Session-Writes */
  sessionWrittenAt: string;
}

/** localStorage-Schlüssel für Demo-Kopplung Meldung → Lagebild */
export const MELDEEINGANG_SESSION_KEY = 'os-kita-meldeeingang-session';

export function meldungStatusToEingang(
  status: MeldungStatus,
  meldefrist: string,
  fiktivesHeute: string
): MeldeeingangStatus {
  if (status === 'FREIGEGEBEN') return 'FREIGEGEBEN';
  if (status === 'ENTWURF') return 'ENTWURF';
  if (fiktivesHeute > meldefrist) return 'UEBERFAELLIG';
  return 'AUSSTEHEND';
}

export function kennzahlenToKurz(k: MeldungKennzahlen): MeldeeingangKennzahlenKurz {
  return {
    genehmigtePlaetze: k.genehmigtePlaetze,
    belegtePlaetze: k.belegtePlaetze,
    freiePlaetze: k.freiePlaetze,
    wartelisteBestand: k.wartelisteBestand,
    personalAusfallquoteProzent: k.personalAusfallquoteProzent,
    tagePersonalschluesselUnterschritten: k.tagePersonalschluesselUnterschritten,
    auslastungsgradProzent: k.auslastungsgradProzent,
    anwesenheitsquoteProzent: k.anwesenheitsquoteProzent,
  };
}
