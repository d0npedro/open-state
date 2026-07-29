/**
 * Verfahrensfairness-Regelwerk – Unternehmensgründung (Demo)
 *
 * Leitet Hinweissignale direkt aus dem Gründungsaktenzustand ab.
 * Jede Regel ist einzeln lesbar und nachvollziehbar.
 *
 * Keine KI, keine Blackbox, keine Bewertung von Personen oder Vorhaben.
 * Alle Signale sind Hinweise – keine Entscheidungen.
 */

import type { GruendungsAkte, GruendungsRueckfrage } from '@/types/gruendung';
import type { FairnessSignal } from '@/types/fairness';
import { berechneFristTage } from './rules';

/**
 * Fiktives Demo-Datum für die Gründungsdomäne (ISO).
 *
 * Der Gründungsfall spielt im Dezember 2024.
 * Wert 07.12.2024 → 3 Tage bis Rückfragenfrist (10.12.) → Signal RELEVANT.
 * Geplantes Betriebsdatum 01.12.2024 liegt 6 Tage zurück → BG-Frist läuft ab.
 */
export const FIKTIVES_HEUTE_GRUENDUNG = '2024-12-07';

/** Tage bis zur Rückfragen-Frist ab denen das Signal erscheint */
const FRIST_RELEVANT_AB_TAGEN = 10;

/** Gesetzliche Frist für BG-Anmeldung nach § 192 SGB VII (in Tagen) */
const BG_ANMELDEFRIST_TAGE = 7;

// ─── CTA-Hilfstexte (Übersicht + Hinweise, identischer Wortlaut) ─────────────
// Session-sensitive Kurztexte für Fairness-/Primär-CTAs. Reine Ableitung aus
// Aktendaten – keine Entscheidung. Eine Quelle für beide Screens (US-UG fairness).

/** Ob mindestens eine Rückfrage noch unbeantwortet ist. */
export function hatOffeneRueckfrage(akte: GruendungsAkte): boolean {
  return akte.rueckfragen.some(r => !r.beantwortet);
}

/**
 * Hilfstext für Primär- und Fairness-CTA bei offener Rückfrage:
 * Antwortfrist (Datum + Resttage) und Konsequenz (Erfassung/Steuernummer).
 */
export function rqCtaHilfstext(
  rq: GruendungsRueckfrage,
  heute: string = FIKTIVES_HEUTE_GRUENDUNG
): string {
  const fristTage = berechneFristTage(rq.fristDatum, heute);
  const fristLabel =
    fristTage < 0
      ? `${Math.abs(fristTage)} Tage überschritten`
      : fristTage === 0
        ? 'heute fällig'
        : `noch ${fristTage} Tag${fristTage === 1 ? '' : 'e'}`;
  return (
    `Antwortfrist ${rq.frist} (${fristLabel}). ` +
    'Ohne Antwort kann das Finanzamt die steuerliche Erfassung und die Steuernummer-Vergabe nicht abschließen. ' +
    'Frage, Begründung und Formular finden Sie unter Rückfragen.'
  );
}

/** Hilfstext Unterlagen-CTA: offene RQ → zuerst klären; danach Nachreichung. */
export function unterlagenCtaHilfstext(hatOffeneRq: boolean): string {
  return hatOffeneRq
    ? 'Zuerst die offene Rückfrage des Finanzamts klären. Begründung und Upload-Möglichkeit finden Sie im Bereich Unterlagen.'
    : 'Keine offene Rückfrage mehr – ausstehende Unterlage nachreichen. Begründung und Upload-Möglichkeit finden Sie im Bereich Unterlagen.';
}

/** Hilfstext BG-CTA: offene RQ → zuerst klären; danach BG-Fokus. */
export function bgCtaHilfstext(hatOffeneRq: boolean): string {
  return hatOffeneRq
    ? 'Zuerst die offene Rückfrage des Finanzamts klären. Die BG-Anmeldung erfolgt außerhalb von Open State — Kontakt und Rolle auf der Behördenkarte.'
    : 'Keine offene Rückfrage mehr – BG-Anmeldung außerhalb von Open State vornehmen. Kontakt und Rolle finden Sie auf der Behördenkarte.';
}

/**
 * Hilfstext Steuernummer-CTA:
 * IN_BEARBEITUNG → Vergabe läuft; sonst offene RQ → klären; sonst Erfassung.
 */
export function steuernummerCtaHilfstext(opts: {
  inBearbeitung: boolean;
  hatOffeneRq: boolean;
}): string {
  if (opts.inBearbeitung) {
    return 'Die Vergabe der Steuernummer ist beim Finanzamt in Bearbeitung. Status und Kontakt finden Sie auf der Behördenkarte.';
  }
  return opts.hatOffeneRq
    ? 'Zuerst die offene Rückfrage des Finanzamts klären. Rolle, Kontakt und offene Schritte finden Sie auf der Behördenkarte.'
    : 'Die Steuernummer vergibt das Finanzamt nach Abschluss der steuerlichen Erfassung. Rolle, Kontakt und offene Schritte finden Sie auf der Behördenkarte.';
}

/**
 * Hilfstext Betriebsdatum-CTA:
 * offene RQ → klären; nach Antwort optional Steuernummer-Vergabe-Hinweis.
 */
export function betriebsdatumCtaHilfstext(opts: {
  hatOffeneRq: boolean;
  steuernummerInBearbeitung: boolean;
}): string {
  if (opts.hatOffeneRq) {
    return 'Zuerst die offene Rückfrage des Finanzamts klären; Fortschritt und nächste Schritte im Statusblock.';
  }
  if (opts.steuernummerInBearbeitung) {
    return 'Rückfrage beantwortet – Steuernummer-Vergabe und weitere offene Punkte im Statusblock prüfen.';
  }
  return 'Offene Punkte und aktuellen Fortschritt im Statusblock prüfen.';
}

/**
 * Hilfstext parallele Behörden (INFO, primär Hinweise-Seite):
 * offene RQ → zuerst klären; danach Überblick paralleler Stände.
 */
export function paralleleBehoerdenCtaHilfstext(hatOffeneRq: boolean): string {
  return hatOffeneRq
    ? 'Offene Rückfragen zuerst klären; Status und offene Schritte aller Stellen finden Sie unter Behörden & Verfahrensschritte.'
    : 'Keine offene Rückfrage – Überblick über parallele Verfahren und Kontakte unter Behörden & Verfahrensschritte.';
}

// ─── Fairness-CTA-Ziel-Routing (Übersicht + Hinweise) ────────────────────────
// Eine Quelle für href, Label, Hilfstext und testKey. UI mappt nur noch Icons
// und testid-Präfixe. Keine Entscheidung – reine Ableitung aus Signal + Akte.

/** Icon-Schlüssel für Fairness-CTAs (UI mappt auf IconName). */
export type GruendungCtaIconKind = 'chat' | 'file' | 'building' | 'refresh';

/** Ziel eines Fairness-Signal-CTAs – identisch auf Übersicht und Hinweise. */
export interface FairnessSignalZiel {
  href: string;
  cta: string;
  icon: GruendungCtaIconKind;
  /** Stabiler Schlüssel für data-testid (ohne Seiten-Präfix). */
  testKey: string;
  hint?: string;
  /** Optionales accessible name für den Link. */
  ariaLabel?: string;
}

/**
 * Kurz-CTA für ein Fairness-Signal aus dem aktuellen Aktenzustand.
 * Rückgabe null, solange der auslösende Zustand nicht mehr greift
 * (z. B. Rückfrage beantwortet, VS-05 erledigt, Verfahren genehmigt).
 */
export function fairnessSignalZiel(
  signal: FairnessSignal,
  akte: GruendungsAkte
): FairnessSignalZiel | null {
  // Offene Rückfrage mit Frist
  if (
    signal.typ === 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT' ||
    signal.id.startsWith('UG-RQ-')
  ) {
    const match = signal.id.match(/^UG-RQ-(.+)-FRIST$/);
    const rqId = match?.[1];
    if (!rqId) return null;
    const rq = akte.rueckfragen.find(r => r.id === rqId && !r.beantwortet);
    if (!rq) return null;
    return {
      href: `/gruendung/rueckfragen#rq-${rqId}`,
      cta: 'Frage beantworten',
      icon: 'chat',
      testKey: `rq-${rqId}`,
      hint: rqCtaHilfstext(rq),
      ariaLabel: `Rückfrage ${rqId} beantworten`,
    };
  }

  // Fehlende Unterlagen
  if (signal.typ === 'UG_UNTERLAGE_FEHLT' || signal.id === 'UG-UNTERLAGEN-FEHLEND') {
    const dok = akte.dokumente.find(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );
    if (!dok) return null;
    return {
      href: `/gruendung/dokumente#dok-${dok.id}`,
      cta: 'Zu den Unterlagen',
      icon: 'file',
      testKey: `dok-${dok.id}`,
      hint: unterlagenCtaHilfstext(hatOffeneRueckfrage(akte)),
      ariaLabel: 'Zu den ausstehenden Unterlagen',
    };
  }

  // BG-Anmeldung ausstehend
  if (signal.typ === 'UG_BG_ANMELDUNG_AUSSTEHEND' || signal.id === 'UG-BG-ANMELDUNG') {
    const bg = akte.beteiligteBehörden.find(
      b => b.typ === 'BERUFSGENOSSENSCHAFT' && b.status === 'NICHT_GESTARTET'
    );
    if (!bg) return null;
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'Zur Behördenkarte',
      icon: 'building',
      testKey: `beh-${bg.id}`,
      hint: bgCtaHilfstext(hatOffeneRueckfrage(akte)),
      ariaLabel: `Zur Behördenkarte ${bg.bezeichnung}`,
    };
  }

  // Steuernummer fehlt (VS-05 AUSSTEHEND oder IN_BEARBEITUNG)
  if (signal.typ === 'UG_STEUERNUMMER_FEHLT' || signal.id === 'UG-STEUERNUMMER-FEHLT') {
    const vs05 = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
    const offen =
      !!vs05 &&
      (vs05.status === 'AUSSTEHEND' || vs05.status === 'IN_BEARBEITUNG');
    if (!offen) return null;
    const finanzamt = akte.beteiligteBehörden.find(b => b.typ === 'FINANZAMT');
    if (!finanzamt) return null;
    const inBearbeitung = vs05.status === 'IN_BEARBEITUNG';
    return {
      href: `/gruendung/behoerden#beh-${finanzamt.id}`,
      cta: inBearbeitung ? 'Steuernummer-Stand ansehen' : 'Zum Finanzamt',
      icon: 'building',
      testKey: `steuernummer-${finanzamt.id}`,
      hint: steuernummerCtaHilfstext({
        inBearbeitung,
        hatOffeneRq: hatOffeneRueckfrage(akte),
      }),
      ariaLabel: inBearbeitung
        ? `Steuernummer-Stand beim ${finanzamt.bezeichnung} ansehen`
        : `Zur Behördenkarte ${finanzamt.bezeichnung}`,
    };
  }

  // Geplantes Betriebsdatum überschritten – Verfahren noch offen
  if (
    signal.typ === 'UG_BETRIEBSDATUM_UEBERSCHRITTEN' ||
    signal.id === 'UG-BETRIEBSDATUM'
  ) {
    const abgeschlossen = ['GENEHMIGT', 'AKTIVER_BETRIEB', 'BETRIEB_EINGESTELLT'].includes(
      akte.status
    );
    if (abgeschlossen) return null;
    const vs05 = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
    return {
      href: '/gruendung#verfahrensstatus',
      cta: 'Zum Verfahrensstatus',
      icon: 'refresh',
      testKey: 'betriebsdatum',
      hint: betriebsdatumCtaHilfstext({
        hatOffeneRq: hatOffeneRueckfrage(akte),
        steuernummerInBearbeitung: vs05?.status === 'IN_BEARBEITUNG',
      }),
      ariaLabel: 'Zum Verfahrensstatus auf der Übersicht',
    };
  }

  // Parallele Behörden (INFO, primär Hinweise-Seite)
  if (
    signal.typ === 'UG_PARALLELE_BEHOERDEN_AKTIV' ||
    signal.id === 'UG-PARALLELE-BEHOERDEN'
  ) {
    const aktive = akte.beteiligteBehörden.filter(
      b => b.status === 'IN_BEARBEITUNG' || b.status === 'RUECKFRAGE_OFFEN'
    );
    if (aktive.length <= 1) return null;
    return {
      href: '/gruendung/behoerden',
      cta: 'Zu den Behörden',
      icon: 'building',
      testKey: 'parallele-behoerden',
      hint: paralleleBehoerdenCtaHilfstext(hatOffeneRueckfrage(akte)),
      ariaLabel: 'Zu Behörden und Verfahrensschritten',
    };
  }

  return null;
}

// ─── Fairness → Verlauf (Audit-Tiefenlink, US-UG-005 Transparenz) ─────────────
// Sekundärer Link zum auslösenden Timeline-Ereignis, wo der Mock/Session eines hat.
// Primär-CTA bleibt handlungsbezogen (Rückfrage/Unterlagen/Behörde).

/** Ziel „Im Verlauf ansehen“ für ein Fairness-Signal. */
export interface FairnessVerlaufZiel {
  href: string;
  cta: string;
  /** Stabiler Schlüssel für data-testid (ohne Seiten-Präfix). */
  testKey: string;
  ereignisId: string;
  ariaLabel?: string;
}

/**
 * Letztes Ereignis eines Typs (optional Behörde), chronologisch am Ende der Liste.
 * Mock speichert ereignisse älter→neuer; Session hängt neuere an.
 */
function letztesEreignis(
  akte: GruendungsAkte,
  typ: GruendungsAkte['ereignisse'][number]['typ'],
  behördeId?: string
): GruendungsAkte['ereignisse'][number] | undefined {
  const matches = akte.ereignisse.filter(
    e => e.typ === typ && (behördeId == null || e.behördeId === behördeId)
  );
  return matches[matches.length - 1];
}

/**
 * Tiefenlink vom Fairness-Signal zum passenden Audit-Ereignis (Verlauf).
 * null, wenn kein belastbares Ereignis im Aktenzustand existiert.
 */
export function fairnessSignalVerlaufZiel(
  signal: FairnessSignal,
  akte: GruendungsAkte
): FairnessVerlaufZiel | null {
  // Offene Rückfrage → Ereignis „Rückfrage gestellt“ der anfordernden Behörde
  if (
    signal.typ === 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT' ||
    signal.id.startsWith('UG-RQ-')
  ) {
    const match = signal.id.match(/^UG-RQ-(.+)-FRIST$/);
    const rqId = match?.[1];
    if (!rqId) return null;
    const rq = akte.rueckfragen.find(r => r.id === rqId && !r.beantwortet);
    if (!rq) return null;
    const e =
      letztesEreignis(akte, 'rueckfrage_gestellt', rq.anforderndeBehördeId) ??
      letztesEreignis(akte, 'rueckfrage_gestellt');
    if (!e) return null;
    return {
      href: `/gruendung/verlauf#ere-${e.id}`,
      cta: 'Im Verlauf ansehen',
      testKey: `verlauf-${e.id}`,
      ereignisId: e.id,
      ariaLabel: `Rückfrage ${rqId} im Verlauf ansehen`,
    };
  }

  // Fehlende Unterlage → Ablehnung im Verlauf, falls vorhanden (kein generisches Upload-Event)
  if (signal.typ === 'UG_UNTERLAGE_FEHLT' || signal.id === 'UG-UNTERLAGEN-FEHLEND') {
    const abgelehnt = akte.dokumente.find(d => d.status === 'ABGELEHNT');
    if (!abgelehnt) return null;
    const e =
      letztesEreignis(akte, 'dokument_abgelehnt', abgelehnt.anforderndeBehördeId) ??
      letztesEreignis(akte, 'dokument_abgelehnt');
    if (!e) return null;
    return {
      href: `/gruendung/verlauf#ere-${e.id}`,
      cta: 'Im Verlauf ansehen',
      testKey: `verlauf-${e.id}`,
      ereignisId: e.id,
      ariaLabel: 'Dokumentablehnung im Verlauf ansehen',
    };
  }

  // Nach Session-Antwort: Signal entfällt – beantwortetes Ereignis nicht hier gemappt
  // (kein RELEVANT-RQ mehr). BG/Steuernummer/Betriebsdatum: kein spezifisches Mock-Ereignis.

  return null;
}

// ─── Übersicht: Aufgaben- und Primär-Schritt-Ziele ───────────────────────────
// Gleiche Quelle wie Fairness-CTAs; UI mappt nur Icons/testids.
// Primär-CTA: Bürger-Handlungsreihenfolge RQ → Unterlagen → BG, danach
// Fairness-Signale (RELEVANT vor HINWEIS) über fairnessSignalZiel.

/** Ziel-Link für eine offene Aufgabe aus Klartext + aktuellem Aktenzustand. */
export interface AufgabeZiel {
  href: string;
  cta: string;
  icon: GruendungCtaIconKind;
  testKey: string;
}

/**
 * Leitet aus Aufgabentext und Aktenzustand den Ziel-Link ab.
 * Heuristik bewusst textbasiert (Mock-Aufgaben sind Klartext) – keine Entscheidung.
 */
export function aufgabeZiel(text: string, akte: GruendungsAkte): AufgabeZiel | null {
  const t = text.toLowerCase();

  if (t.includes('rückfrage')) {
    const rq = akte.rueckfragen.find(r => !r.beantwortet);
    if (!rq) return null;
    return {
      href: `/gruendung/rueckfragen#rq-${rq.id}`,
      cta: 'Zur Rückfrage',
      icon: 'chat',
      testKey: `rq-${rq.id}`,
    };
  }

  if (
    t.includes('hochladen') ||
    t.includes('unterlage') ||
    t.includes('qualifikation') ||
    t.includes('nachweis')
  ) {
    const dok = akte.dokumente.find(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );
    if (!dok) return null;
    return {
      href: `/gruendung/dokumente#dok-${dok.id}`,
      cta: 'Zu den Unterlagen',
      icon: 'file',
      testKey: `dok-${dok.id}`,
    };
  }

  if (
    t.includes('berufsgenossenschaft') ||
    t.includes('bg etem') ||
    (t.includes('bg ') && t.includes('anmeldung'))
  ) {
    const bg = akte.beteiligteBehörden.find(b => b.typ === 'BERUFSGENOSSENSCHAFT');
    if (!bg) return null;
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'Zur Behördenkarte',
      icon: 'building',
      testKey: `beh-${bg.id}`,
    };
  }

  return {
    href: '/gruendung/behoerden',
    cta: 'Zu den Behörden',
    icon: 'building',
    testKey: 'behoerden',
  };
}

/** Primärer CTA zum „Nächster Schritt“-Block auf der Übersicht. */
export interface NaechsterSchrittZiel {
  href: string;
  cta: string;
  icon: GruendungCtaIconKind;
  hint?: string;
}

/**
 * Primär-CTA „Nächster Schritt“ (Übersicht).
 *
 * 1–3: Feste Bürger-Handlungsreihenfolge (RQ → Unterlagen → BG),
 *      mit session-sensitiven Hilfstexten (identisch zu Fairness-CTAs).
 * 4:   Fairness-Kopplung – höchstpriorisiertes verbleibendes Signal
 *      (RELEVANT vor HINWEIS) über fairnessSignalZiel.
 *
 * Keine Entscheidung – reine Ableitung aus Aktenzustand + Regelwerk.
 */
export function naechsterSchrittZiel(akte: GruendungsAkte): NaechsterSchrittZiel | null {
  const offeneRq = akte.rueckfragen.find(r => !r.beantwortet);
  if (offeneRq) {
    return {
      href: `/gruendung/rueckfragen#rq-${offeneRq.id}`,
      cta: 'Rückfrage beantworten',
      icon: 'chat',
      hint: rqCtaHilfstext(offeneRq),
    };
  }

  const fehlendesDok = akte.dokumente.find(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlendesDok) {
    return {
      href: `/gruendung/dokumente#dok-${fehlendesDok.id}`,
      cta: 'Unterlage hochladen',
      icon: 'file',
      // Keine offene RQ mehr (sonst RQ-Zweig oben)
      hint: unterlagenCtaHilfstext(false),
    };
  }

  const bg = akte.beteiligteBehörden.find(
    b => b.typ === 'BERUFSGENOSSENSCHAFT' && b.status === 'NICHT_GESTARTET'
  );
  if (bg) {
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'BG-Hinweis ansehen',
      icon: 'building',
      hint: bgCtaHilfstext(false),
    };
  }

  // Fairness-Kopplung: weitere handlungsrelevante Signale (RELEVANT vor HINWEIS)
  const signale = berechneFairnessSignaleGruendung(akte)
    .filter(s => s.prioritaet === 'RELEVANT' || s.prioritaet === 'HINWEIS')
    .sort((a, b) => {
      const rank = (p: string) => (p === 'RELEVANT' ? 0 : 1);
      return rank(a.prioritaet) - rank(b.prioritaet);
    });
  for (const sig of signale) {
    const z = fairnessSignalZiel(sig, akte);
    if (z) {
      return {
        href: z.href,
        cta: z.cta,
        icon: z.icon,
        hint: z.hint,
      };
    }
  }

  return null;
}

export function berechneFairnessSignaleGruendung(akte: GruendungsAkte): FairnessSignal[] {
  const signale: FairnessSignal[] = [];
  const heute = FIKTIVES_HEUTE_GRUENDUNG;

  // ─── Signal 1: Offene Rückfrage mit nahender Frist ─────────────────────────
  // Regel: Wenn eine Rückfrage unbeantwortet ist und die berechnete Frist
  //        <= FRIST_RELEVANT_AB_TAGEN beträgt, ist dies relevant zu wissen.
  for (const rq of akte.rueckfragen) {
    const fristTage = berechneFristTage(rq.fristDatum, heute);
    if (!rq.beantwortet && fristTage <= FRIST_RELEVANT_AB_TAGEN) {
      const behörde = akte.beteiligteBehörden.find(b => b.id === rq.anforderndeBehördeId);
      const fristLabel =
        fristTage < 0  ? `${Math.abs(fristTage)} Tage überschritten` :
        fristTage === 0 ? 'heute fällig' :
        `noch ${fristTage} Tag${fristTage === 1 ? '' : 'e'}`;

      signale.push({
        id: `UG-RQ-${rq.id}-FRIST`,
        typ: 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT',
        titel: `Rückfrage offen – Antwortfrist ${fristLabel}`,
        erklaerung:
          `Eine Rückfrage vom ${rq.gestelltAm} des ${behörde?.bezeichnung ?? 'Behörde'} ` +
          `wartet noch auf Ihre Antwort (Frist: ${rq.frist}, ${fristLabel}). ` +
          `Ohne Antwort kann die steuerliche Erfassung nicht abgeschlossen werden.`,
        auswirkung: rq.konsequenz,
        naechsterSchritt:
          'Bitte beantworten Sie die Rückfrage im Bereich „Rückfragen". ' +
          'Die Frage, Begründung und Frist sind dort vollständig einsehbar.',
        bezug: `Rückfrage ${rq.id}, ${behörde?.bezeichnung ?? ''}, gestellt ${rq.gestelltAm}`,
        prioritaet: fristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 1b: Angeforderte Unterlagen noch nicht eingereicht ────────────
  // Regel: Dokumente mit Status ANGEFORDERT (oder ABGELEHNT) blockieren bzw.
  //        verzögern die vollständige Aktenführung, auch wenn optional empfohlen.
  // Frist: analog AV – berechnete Resttage gegen FIKTIVES_HEUTE_GRUENDUNG,
  //        nächste Einreichungsfrist im Titel/Erklärung, Priorität bei ≤3 Tagen.
  const fehlendeDokumente = akte.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlendeDokumente.length > 0) {
    const abgelehnt = fehlendeDokumente.filter(d => d.status === 'ABGELEHNT');
    const names = fehlendeDokumente.map(d => d.bezeichnung).join('; ');
    const abgelehntHinweis =
      abgelehnt.length > 0
        ? ` Davon abgelehnt und erneut einzureichen: ${abgelehnt.map(d => d.bezeichnung).join('; ')}.`
        : '';

    const dokMitFrist = fehlendeDokumente
      .filter(d => d.fristDatum && d.frist)
      .map(d => ({
        bezeichnung: d.bezeichnung,
        frist: d.frist as string,
        resttage: berechneFristTage(d.fristDatum as string, heute),
      }))
      .sort((a, b) => a.resttage - b.resttage);
    const naechsteFrist = dokMitFrist[0];
    let fristLabel = '';
    let fristHinweis = '';
    if (naechsteFrist) {
      const t = naechsteFrist.resttage;
      fristLabel =
        t < 0
          ? `${Math.abs(t)} Tage überschritten`
          : t === 0
            ? 'heute'
            : `noch ${t} Tag${t === 1 ? '' : 'e'}`;
      const gleicheFrist =
        dokMitFrist.length > 1 && dokMitFrist.every(d => d.frist === naechsteFrist.frist);
      fristHinweis =
        ` Nächste Einreichungsfrist: ${naechsteFrist.frist} (${fristLabel}` +
        (gleicheFrist
          ? ' für die ausstehenden Unterlagen'
          : ` für „${naechsteFrist.bezeichnung}"`) +
        ').';
    }
    const fristDringend = naechsteFrist != null && naechsteFrist.resttage <= 3;

    signale.push({
      id: 'UG-UNTERLAGEN-FEHLEND',
      typ: 'UG_UNTERLAGE_FEHLT',
      titel: naechsteFrist
        ? `${fehlendeDokumente.length} Unterlage(n) offen – Frist ${fristLabel}`
        : `${fehlendeDokumente.length} Unterlage(n) noch nicht eingereicht`,
      erklaerung:
        `Folgende Unterlagen sind noch ausstehend: ${names}.` +
        abgelehntHinweis +
        fristHinweis +
        ` Details und Begründungen stehen im Bereich „Unterlagen“.`,
      auswirkung: fehlendeDokumente.map(d => d.konsequenz).join(' '),
      naechsterSchritt: naechsteFrist
        ? `Unterlagen im Bereich „Unterlagen“ bis ${naechsteFrist.frist} (${fristLabel}) hochladen. ` +
          'Demo: Der Upload speichert keine Datei, ändert aber den Aktenstatus und dieses Signal.'
        : 'Unterlagen im Bereich „Unterlagen“ hochladen. ' +
          'Demo: Der Upload speichert keine Datei, ändert aber den Aktenstatus und dieses Signal.',
      bezug: `Dokumente: ${fehlendeDokumente.map(d => d.id).join(', ')}`,
      // Abgelehnte Unterlagen oder knappe Frist (≤3 Tage) sind dringlicher
      prioritaet: abgelehnt.length > 0 || fristDringend ? 'RELEVANT' : 'HINWEIS',
    });
  }

  // ─── Signal 2: BG-Anmeldung steht aus – gesetzliche Frist läuft ───────────
  // Regel: Berufsgenossenschaft muss binnen 7 Tagen nach Betriebsaufnahme
  //        angemeldet werden (§ 192 SGB VII). Wenn Betriebsdatum + 7 Tage
  //        nahe oder überschritten ist und BG noch NICHT_GESTARTET, ist das relevant.
  const bgBehörde = akte.beteiligteBehörden.find(b => b.typ === 'BERUFSGENOSSENSCHAFT');
  if (bgBehörde && bgBehörde.status === 'NICHT_GESTARTET' && akte.geplantesBetriebsdatum) {
    // BG-Frist = geplantes Betriebsdatum + 7 Tage
    const betriebDatum = new Date(akte.geplantesBetriebsdatum.split('.').reverse().join('-'));
    betriebDatum.setDate(betriebDatum.getDate() + BG_ANMELDEFRIST_TAGE);
    const bgFristISO = betriebDatum.toISOString().split('T')[0];
    const bgFristTage = berechneFristTage(bgFristISO, heute);
    const bgFristLabel = bgFristTage < 0
      ? `${Math.abs(bgFristTage)} Tage überschritten`
      : bgFristTage === 0
        ? 'heute fällig'
        : `noch ${bgFristTage} Tag${bgFristTage === 1 ? '' : 'e'}`;

    if (bgFristTage <= FRIST_RELEVANT_AB_TAGEN) {
      signale.push({
        id: 'UG-BG-ANMELDUNG',
        typ: 'UG_BG_ANMELDUNG_AUSSTEHEND',
        titel: `Anmeldung Berufsgenossenschaft – gesetzliche Frist ${bgFristLabel}`,
        erklaerung:
          `Nach § 192 SGB VII muss die Anmeldung bei der zuständigen Berufsgenossenschaft ` +
          `binnen einer Woche nach Betriebsaufnahme erfolgen. ` +
          `Geplanter Betriebsbeginn: ${akte.geplantesBetriebsdatum}. ` +
          `Die Anmeldefrist endet am ${bgFristISO.split('-').reverse().join('.')} (${bgFristLabel}).`,
        auswirkung:
          'Verspätete Anmeldung kann zu Bußgeldern führen und den Versicherungsschutz ' +
          'für Betriebsunfälle gefährden. Die Berufsgenossenschaft erhebt rückwirkend Beiträge.',
        naechsterSchritt:
          `Bitte melden Sie sich direkt bei der ${bgBehörde.bezeichnung} an. ` +
          `Die Anmeldung erfolgt außerhalb von Open State. ` +
          `Kontakt: ${bgBehörde.kontakt ?? 'siehe Behördenübersicht'}.`,
        bezug: `${bgBehörde.bezeichnung} · § 192 SGB VII · Betriebsdatum ${akte.geplantesBetriebsdatum}`,
        prioritaet: bgFristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 3: Steuernummer fehlt – Rechnungsstellung eingeschränkt ────────
  // Regel: Wenn VS-05 (Steuernummer erhalten) noch nicht ABGESCHLOSSEN ist
  //        (AUSSTEHEND oder IN_BEARBEITUNG) und das geplante Betriebsdatum
  //        bereits erreicht oder überschritten ist, ist Rechnungsstellung
  //        ohne Steuernummer rechtlich unvollständig. Text je nach Status.
  const steuernummerSchritt = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
  const betriebsDatumErreicht = akte.geplantesBetriebsdatum
    ? berechneFristTage(
        akte.geplantesBetriebsdatum.split('.').reverse().join('-'),
        heute
      ) <= 0
    : false;

  const steuernummerOffen =
    steuernummerSchritt &&
    (steuernummerSchritt.status === 'AUSSTEHEND' ||
      steuernummerSchritt.status === 'IN_BEARBEITUNG');

  if (steuernummerOffen && betriebsDatumErreicht) {
    const inBearbeitung = steuernummerSchritt.status === 'IN_BEARBEITUNG';
    signale.push({
      id: 'UG-STEUERNUMMER-FEHLT',
      typ: 'UG_STEUERNUMMER_FEHLT',
      titel: inBearbeitung
        ? 'Steuernummer in Bearbeitung – noch nicht erteilt'
        : 'Steuernummer noch nicht erteilt – Rechnungsstellung eingeschränkt',
      erklaerung: inBearbeitung
        ? 'Das Finanzamt bearbeitet die Vergabe der Steuernummer. ' +
          'Die offene Rückfrage zur Kleinunternehmerregelung ist beantwortet; ' +
          'die Steuernummer liegt noch nicht vor. ' +
          'Ohne Steuernummer müssen Ausgangsrechnungen einen Hinweis auf das schwebende Verfahren enthalten.'
        : 'Das Finanzamt hat die Steuernummer noch nicht vergeben. ' +
          'Ohne Steuernummer müssen Ausgangsrechnungen einen Hinweis auf das schwebende Verfahren enthalten. ' +
          'Die Steuernummer-Vergabe ist blockiert durch die offene Rückfrage zur Kleinunternehmerregelung.',
      auswirkung:
        'Rechnungen ohne Steuernummer können bei Auftraggebern zu Rückfragen führen. ' +
        'Die Vorsteuerabzugsberechtigung beim Empfänger hängt von einer gültigen Steuernummer ab.',
      naechsterSchritt: inBearbeitung
        ? 'Keine Handlung von Ihnen erforderlich für die Steuernummer. ' +
          'Prüfen Sie den Bearbeitungsstand unter „Behörden & Schritte“. ' +
          'Parallel können Sie die BG-Anmeldung vornehmen (außerhalb von Open State).'
        : 'Beantworten Sie zuerst die Rückfrage des Finanzamts (Bereich „Rückfragen"). ' +
          'Nach Eingang der Antwort vergibt das Finanzamt die Steuernummer in der Regel binnen weniger Wochen.',
      bezug: `Verfahrensschritt VS-05 (${steuernummerSchritt.bezeichnung}) · Status: ${steuernummerSchritt.status}`,
      prioritaet: 'HINWEIS',
    });
  }

  // ─── Signal 4: Geplantes Betriebsdatum überschritten – Verfahren offen ─────
  // Regel: Wenn das geplante Betriebsdatum in der Vergangenheit liegt und
  //        der Status noch nicht GENEHMIGT oder AKTIVER_BETRIEB ist,
  //        weist das auf einen Planungsverzug hin.
  // Text: Solange eine Finanzamt-Rückfrage offen ist → zuerst beantworten.
  //        Nach Antwort: Steuernummer/BG/Unterlagen priorisieren (keine RQ-Anweisung).
  const abgeschlosseneStatus = ['GENEHMIGT', 'AKTIVER_BETRIEB', 'BETRIEB_EINGESTELLT'];
  if (akte.geplantesBetriebsdatum && !abgeschlosseneStatus.includes(akte.status)) {
    const betriebISO = akte.geplantesBetriebsdatum.split('.').reverse().join('-');
    const verzugTage = Math.abs(berechneFristTage(betriebISO, heute));
    const verzug = berechneFristTage(betriebISO, heute);
    if (verzug < 0) {
      const hatOffeneRueckfrage = akte.rueckfragen.some(r => !r.beantwortet);
      const steuernummerInBearbeitung =
        steuernummerSchritt?.status === 'IN_BEARBEITUNG';

      const erklaerung = hatOffeneRueckfrage
        ? `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
          `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
          `Hauptursache: Die steuerliche Erfassung durch das Finanzamt steht noch aus.`
        : steuernummerInBearbeitung
          ? `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
            `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
            `Die Rückfrage des Finanzamts ist beantwortet; die Steuernummer-Vergabe läuft. ` +
            `Parallel kann die BG-Anmeldung oder weitere Unterlagen ausstehen.`
          : `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
            `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
            `Offene Punkte (Steuernummer, BG-Anmeldung, Unterlagen) verzögern den vollständigen Abschluss.`;

      const naechsterSchritt = hatOffeneRueckfrage
        ? 'Offene Punkte priorisieren: zuerst Rückfrage Finanzamt beantworten, dann BG-Anmeldung vornehmen. ' +
          'Das geplante Betriebsdatum kann in der Akte angepasst werden.'
        : steuernummerInBearbeitung
          ? 'Die Steuernummer wird vom Finanzamt bearbeitet — keine Antwort-Rückfrage mehr nötig. ' +
            'Prüfen Sie parallel die BG-Anmeldung und ausstehende Unterlagen. ' +
            'Das geplante Betriebsdatum kann in der Akte angepasst werden.'
          : 'Offene Punkte priorisieren: Steuernummer und BG-Anmeldung prüfen. ' +
            'Das geplante Betriebsdatum kann in der Akte angepasst werden.';

      signale.push({
        id: 'UG-BETRIEBSDATUM',
        typ: 'UG_BETRIEBSDATUM_UEBERSCHRITTEN',
        titel: `Geplanter Betriebsstart liegt ${verzugTage} ${verzugTage === 1 ? 'Tag' : 'Tage'} zurück`,
        erklaerung,
        auswirkung:
          'Ohne abgeschlossene Steuernummer und BG-Anmeldung ist der Betrieb rechtlich nicht vollständig abgesichert. ' +
          'Das geplante Datum war eine Schätzung ohne verbindliche Wirkung.',
        naechsterSchritt,
        bezug: `geplantesBetriebsdatum: ${akte.geplantesBetriebsdatum} · Aktueller Status: ${akte.status}`,
        prioritaet: 'HINWEIS',
      });
    }
  }

  // ─── Signal 5: Mehrere Behörden parallel aktiv – Koordinationsüberblick ────
  // Regel: Wenn mehr als eine Behörde gleichzeitig aktiv ist (IN_BEARBEITUNG
  //        oder RUECKFRAGE_OFFEN), ist ein koordinierter Gesamtüberblick hilfreich.
  // naechsterSchritt: session-sensitiv – bei offener RQ zuerst klären;
  // nach Antwort Fokus auf parallele Stände (FA/IHK), keine RQ-Priorität.
  const aktiveBehörden = akte.beteiligteBehörden.filter(
    b => b.status === 'IN_BEARBEITUNG' || b.status === 'RUECKFRAGE_OFFEN'
  );
  if (aktiveBehörden.length > 1) {
    const hatOffeneRueckfrageParallel = akte.rueckfragen.some(r => !r.beantwortet);
    const naechsterSchrittParallel = hatOffeneRueckfrageParallel
      ? 'Prüfen Sie alle aktiven Behördenverfahren unter „Behörden & Schritte". ' +
        'Offene Rückfragen zuerst beantworten, da diese die meisten Folgeschritte blockieren.'
      : 'Keine offene Rückfrage mehr – prüfen Sie den parallelen Stand der aktiven Behörden ' +
        '(z. B. Steuernummer-Vergabe und IHK) unter „Behörden & Schritte". ' +
        'Optional: ausstehende Unterlagen und BG-Anmeldung im Blick behalten.';

    signale.push({
      id: 'UG-PARALLELE-BEHOERDEN',
      typ: 'UG_PARALLELE_BEHOERDEN_AKTIV',
      titel: `${aktiveBehörden.length} Behördenverfahren laufen parallel`,
      erklaerung:
        `Derzeit sind ${aktiveBehörden.length} Behörden gleichzeitig aktiv: ` +
        aktiveBehörden.map(b => b.bezeichnung).join(', ') + '. ' +
        'Parallele Verfahren sind normal im Gründungsprozess, erfordern aber Überblick über alle offenen Punkte.',
      auswirkung:
        'Versäumnisse in einem Verfahren können andere blockieren. ' +
        'Zum Beispiel: ohne Steuernummer (Finanzamt) ist die IHK-Mitgliedschaft zwar aktiv, aber Rechnungsstellung bleibt eingeschränkt.',
      naechsterSchritt: naechsterSchrittParallel,
      bezug: `Aktive Behörden: ${aktiveBehörden.map(b => b.id).join(', ')}`,
      prioritaet: 'INFO',
    });
  }

  return signale;
}
