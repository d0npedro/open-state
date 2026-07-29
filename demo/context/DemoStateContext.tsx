'use client';

/**
 * DemoStateContext – Open State Demo
 *
 * Hält den interaktiven Zustand der Demo-Session.
 * Ermöglicht State-Wechsel (Rückfrage beantworten, Dokument hochladen) ohne Backend.
 * Interaktionen erzeugen Timeline-Ereignisse (sichtbar unter /fall/verlauf).
 *
 * Kein Ersatz für echte Fachlogik. Dient ausschließlich der Demo-Darstellung.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoFall } from '@/data/mockFall';
import type { Fall, TimelineEreignis } from '@/types';

/** Fiktives Aktions-Datum (passt zum Demo-Zeitrahmen in mockFall / FIKTIVES_HEUTE). */
const DEMO_AKTION_DATUM = '24. November 2024';
const DEMO_AKTION_ZEIT = '24.11.2024, 10:30';

/**
 * Verlauf-Anker-ID für den Demo-Upload einer Unterlage.
 * Beispiel: DOK-003 → `E-DEMO-DOK-DOK-003` (Hash `#ere-E-DEMO-DOK-DOK-003`).
 * Parität UG `demoDokUploadEreignisId` (Q-188 / Q-193).
 */
export function demoDokUploadEreignisId(dokId: string): string {
  return `E-DEMO-DOK-${dokId}`;
}

/**
 * Verlauf-Anker-ID für die Demo-Antwort auf eine Rückfrage.
 * Beispiel: RQ-001 → `E-DEMO-RQ-RQ-001` (Hash `#ere-E-DEMO-RQ-RQ-001`).
 */
export function demoRqAntwortEreignisId(rqId: string): string {
  return `E-DEMO-RQ-${rqId}`;
}

/**
 * Verlauf-Anker-ID für die Demo-Bestätigung eines Termins.
 * Beispiel: T-001 → `E-DEMO-TERM-T-001` (Hash `#ere-E-DEMO-TERM-T-001`).
 */
export function demoTerminBestaetigungEreignisId(terminId: string): string {
  return `E-DEMO-TERM-${terminId}`;
}

interface DemoStateContextValue {
  fall: Fall;
  /** Demo: markiert Rückfrage als beantwortet; optionaler Antworttext für Quittung/Verlauf. */
  answerRueckfrage: (id: string, antwortText?: string) => void;
  /** Demo: markiert ein angefordertes/abgelehntes Dokument als hochgeladen. */
  uploadDokument: (id: string) => void;
  /** Demo: bestätigt Termin session-lokal (AUSSTEHEND → BESTAETIGT; Tab-Badge entfällt). */
  confirmTermin: (id: string) => void;
  /** Demo: setzt Session auf den Ausgangs-Mock zurück. */
  resetSession: () => void;
  /** True, sobald in dieser Session gehandelt wurde. */
  hasSessionChanges: boolean;
  /** Dokument-IDs, die in dieser Session hochgeladen wurden (Upload-Quittung Übersicht). */
  sessionUploadedIds: string[];
  /** Termin-IDs, die in dieser Session bestätigt wurden (Quittung + Verlauf-Tiefenlink). */
  sessionConfirmedTerminIds: string[];
}

const DemoStateContext = createContext<DemoStateContextValue>({
  fall: demoFall,
  answerRueckfrage: () => {},
  uploadDokument: () => {},
  confirmTermin: () => {},
  resetSession: () => {},
  hasSessionChanges: false,
  sessionUploadedIds: [],
  sessionConfirmedTerminIds: [],
});

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  /** Antworttexte je Rückfrage-ID (Session, ohne Backend). */
  const [antwortTexte, setAntwortTexte] = useState<Record<string, string>>({});
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);
  /** Session-bestätigte Termine (Q-092 / US-AV-005). */
  const [confirmedTerminIds, setConfirmedTerminIds] = useState<string[]>([]);

  const answerRueckfrage = useCallback((id: string, antwortText?: string) => {
    setAnsweredIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    if (antwortText && antwortText.trim()) {
      setAntwortTexte(prev => (prev[id] ? prev : { ...prev, [id]: antwortText.trim() }));
    }
  }, []);

  const uploadDokument = useCallback((id: string) => {
    setUploadedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const confirmTermin = useCallback((id: string) => {
    setConfirmedTerminIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const resetSession = useCallback(() => {
    setAnsweredIds([]);
    setAntwortTexte({});
    setUploadedIds([]);
    setConfirmedTerminIds([]);
  }, []);

  const hasSessionChanges =
    answeredIds.length > 0 || uploadedIds.length > 0 || confirmedTerminIds.length > 0;

  const fall = useMemo((): Fall => {
    const updatedRueckfragen = demoFall.rueckfragen.map(rq => {
      if (!answeredIds.includes(rq.id)) return rq;
      const antwortText = antwortTexte[rq.id];
      return {
        ...rq,
        beantwortet: true,
        ...(antwortText
          ? { antwortText, beantwortetAm: DEMO_AKTION_DATUM }
          : { beantwortetAm: DEMO_AKTION_DATUM }),
      };
    });
    const hasOffeneRueckfragen = updatedRueckfragen.some(rq => !rq.beantwortet);

    const updatedDokumente = demoFall.dokumente.map(dok => {
      if (!uploadedIds.includes(dok.id)) return dok;
      if (dok.status !== 'ANGEFORDERT' && dok.status !== 'ABGELEHNT') return dok;
      return {
        ...dok,
        status: 'HOCHGELADEN' as const,
        hochgeladenAm: DEMO_AKTION_DATUM,
      };
    });
    const hasFehlendeUnterlagen = updatedDokumente.some(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );

    // Q-092: session-lokale Terminbestätigung (Badge-Zähler reagiert live)
    const updatedTermine = demoFall.termine.map(t => {
      if (!confirmedTerminIds.includes(t.id)) return t;
      if (t.status === 'ABGESAGT') return t;
      return { ...t, status: 'BESTAETIGT' as const };
    });

    let status = demoFall.status;
    let statusBeschreibung = demoFall.statusBeschreibung;
    let naechsterSchritt = demoFall.naechsterSchritt;

    if (hasOffeneRueckfragen) {
      status = 'RUECKFRAGE_OFFEN';
      statusBeschreibung = demoFall.statusBeschreibung;
      naechsterSchritt = demoFall.naechsterSchritt;
    } else if (hasFehlendeUnterlagen) {
      status = 'UNTERLAGEN_FEHLEN';
      statusBeschreibung =
        'Alle Rückfragen sind beantwortet. Es fehlen noch Unterlagen, bevor die Prüfung abgeschlossen werden kann.';
      naechsterSchritt =
        'Bitte laden Sie die ausstehenden Unterlagen im Bereich „Unterlagen“ hoch.';
    } else {
      status = 'IN_PRUEFUNG';
      statusBeschreibung =
        'Alle Rückfragen sind beantwortet und die angeforderten Unterlagen liegen vor. Ihr Antrag wird nun weiter geprüft.';
      naechsterSchritt =
        'Keine Handlung von Ihnen erforderlich. Die Sachbearbeitung prüft die Unterlagen.';
    }

    let offeneAufgaben = [...demoFall.offeneAufgaben];
    if (!hasOffeneRueckfragen) {
      offeneAufgaben = offeneAufgaben.filter(a => !a.toLowerCase().includes('rückfrage'));
    }
    for (const dok of updatedDokumente) {
      if (dok.status === 'ANGEFORDERT' || dok.status === 'ABGELEHNT') continue;
      const keywords = dok.bezeichnung
        .toLowerCase()
        .split(/[\s()/,.-]+/)
        .filter(w => w.length >= 4);
      offeneAufgaben = offeneAufgaben.filter(aufgabe => {
        const a = aufgabe.toLowerCase();
        if (dok.id === 'DOK-004' && (a.includes('sg1') || a.includes('selbstauskunft'))) {
          return false;
        }
        if (dok.id === 'DOK-003' && (a.includes('einkommensteuer') || a.includes('steuerbescheid'))) {
          return false;
        }
        return !keywords.some(k => k.length >= 5 && a.includes(k) && a.includes('hochladen'));
      });
    }

    // Timeline-Ereignisse aus Demo-Interaktionen anhängen (chronologisch ans Ende)
    const extraEvents: TimelineEreignis[] = [];
    let seq = 100;

    for (const id of answeredIds) {
      const rq = demoFall.rueckfragen.find(r => r.id === id);
      const antwort = antwortTexte[id];
      // Voller Antworttext in details (kein 80-Zeichen-Kürzel) —
      // /fall/verlauf rendert RUECKFRAGE_BEANTWORTET als lesbaren Quittungsblock.
      const frageKurz = rq?.text
        ? rq.text.length > 72
          ? `${rq.text.slice(0, 72).trim()}…`
          : rq.text
        : null;
      extraEvents.push({
        id: demoRqAntwortEreignisId(id),
        typ: 'RUECKFRAGE_BEANTWORTET',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'BUERGER',
        beschreibung: frageKurz
          ? `Antwort zur Rückfrage: ${frageKurz}`
          : 'Rückfrage beantwortet',
        details: antwort
          ? antwort
          : rq
            ? 'Antwort ohne Freitext übermittelt (Demo-Interaktion).'
            : `Rückfrage ${id} beantwortet (Demo-Interaktion).`,
      });
      seq += 1;
      extraEvents.push({
        id: `E-DEMO-ST-${seq}`,
        typ: 'STATUS_GEAENDERT',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'SYSTEM',
        beschreibung: hasFehlendeUnterlagen
          ? 'Status geändert: RUECKFRAGE_OFFEN → UNTERLAGEN_FEHLEN'
          : 'Status geändert: RUECKFRAGE_OFFEN → IN_PRUEFUNG',
        details: hasFehlendeUnterlagen
          ? 'Rückfragen erledigt. Fall wartet auf ausstehende Unterlagen.'
          : 'Rückfragen erledigt. Fallprüfung fortgesetzt.',
      });
    }

    for (const id of uploadedIds) {
      const dok = demoFall.dokumente.find(d => d.id === id);
      // beschreibung endet auf „ hochgeladen“ → Verlauf hebt Bezeichnung hervor (Q-105)
      extraEvents.push({
        id: demoDokUploadEreignisId(id),
        typ: 'DOKUMENT_EINGEREICHT',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'BUERGER',
        beschreibung: dok
          ? `${dok.bezeichnung} hochgeladen`
          : `Dokument ${id} hochgeladen`,
        details: dok
          ? `${dok.bezeichnung} · ${dok.id} eingereicht (Demo-Interaktion, keine echte Datei).`
          : `Dokument ${id} eingereicht (Demo-Interaktion).`,
      });
    }

    if (uploadedIds.length > 0 && !hasOffeneRueckfragen) {
      seq += 1;
      extraEvents.push({
        id: `E-DEMO-ST-UP-${seq}`,
        typ: 'STATUS_GEAENDERT',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'SYSTEM',
        beschreibung: hasFehlendeUnterlagen
          ? 'Status: UNTERLAGEN_FEHLEN (noch ausstehende Unterlagen)'
          : 'Status geändert: UNTERLAGEN_FEHLEN → IN_PRUEFUNG',
        details: hasFehlendeUnterlagen
          ? 'Teil der Unterlagen eingegangen. Weitere Dokumente ausstehend.'
          : 'Alle angeforderten Unterlagen eingegangen. Prüfung fortgesetzt.',
      });
    }

    for (const id of confirmedTerminIds) {
      const termin = demoFall.termine.find(t => t.id === id);
      extraEvents.push({
        id: demoTerminBestaetigungEreignisId(id),
        typ: 'STATUS_GEAENDERT',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'BUERGER',
        beschreibung: termin
          ? `Termin bestätigt: ${termin.zweck}`
          : `Termin ${id} bestätigt`,
        details: termin
          ? `Teilnahme am ${termin.datum}, ${termin.uhrzeit} bestätigt (Demo-Session, keine echte Terminbuchung).`
          : `Termin ${id} session-lokal bestätigt (Demo).`,
      });
    }

    return {
      ...demoFall,
      rueckfragen: updatedRueckfragen,
      dokumente: updatedDokumente,
      termine: updatedTermine,
      status,
      statusBeschreibung,
      naechsterSchritt,
      offeneAufgaben,
      timeline: [...demoFall.timeline, ...extraEvents],
      letzteAktivitaet:
        uploadedIds.length > 0 || answeredIds.length > 0 || confirmedTerminIds.length > 0
          ? DEMO_AKTION_DATUM
          : demoFall.letzteAktivitaet,
    };
  }, [answeredIds, antwortTexte, uploadedIds, confirmedTerminIds]);

  return (
    <DemoStateContext.Provider
      value={{
        fall,
        answerRueckfrage,
        uploadDokument,
        confirmTermin,
        resetSession,
        hasSessionChanges,
        sessionUploadedIds: uploadedIds,
        sessionConfirmedTerminIds: confirmedTerminIds,
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateContextValue {
  return useContext(DemoStateContext);
}
