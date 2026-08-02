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

/**
 * Same-tab-Event nach Write/Clear von MELDEEINGANG_SESSION_KEY
 * (StorageEvent feuer nur tab-übergreifend).
 */
export const KITA_MELDE_SESSION_EVENT = 'os-kita-meldeeingang-session-change';

/** Benachrichtigt Layout-SessionBar und Meldeeingang-Hooks in derselben Tab-Session. */
export function notifyKitaMeldeSessionChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(KITA_MELDE_SESSION_EVENT));
}

/** Liest Demo-Session-Freigabe aus localStorage (null wenn leer/ungültig). */
export function readKitaMeldeSessionFreigabe(): MeldeeingangSessionFreigabe | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MELDEEINGANG_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MeldeeingangSessionFreigabe;
    if (!parsed?.meldungId || !parsed?.freigabeId || !parsed?.kennzahlen) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Entfernt Session-Freigabe und benachrichtigt Listener (Q-412). */
export function clearKitaMeldeSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(MELDEEINGANG_SESSION_KEY);
  } catch {
    // ignore
  }
  notifyKitaMeldeSessionChange();
}

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
