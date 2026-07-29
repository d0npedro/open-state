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

interface DemoStateContextValue {
  fall: Fall;
  answerRueckfrage: (id: string) => void;
  /** Demo: markiert ein angefordertes/abgelehntes Dokument als hochgeladen. */
  uploadDokument: (id: string) => void;
  /** Demo: setzt Session auf den Ausgangs-Mock zurück. */
  resetSession: () => void;
  /** True, sobald in dieser Session gehandelt wurde. */
  hasSessionChanges: boolean;
}

const DemoStateContext = createContext<DemoStateContextValue>({
  fall: demoFall,
  answerRueckfrage: () => {},
  uploadDokument: () => {},
  resetSession: () => {},
  hasSessionChanges: false,
});

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);

  const answerRueckfrage = useCallback((id: string) => {
    setAnsweredIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const uploadDokument = useCallback((id: string) => {
    setUploadedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const resetSession = useCallback(() => {
    setAnsweredIds([]);
    setUploadedIds([]);
  }, []);

  const hasSessionChanges = answeredIds.length > 0 || uploadedIds.length > 0;

  const fall = useMemo((): Fall => {
    const updatedRueckfragen = demoFall.rueckfragen.map(rq =>
      answeredIds.includes(rq.id) ? { ...rq, beantwortet: true } : rq
    );
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
      extraEvents.push({
        id: `E-DEMO-RQ-${id}`,
        typ: 'RUECKFRAGE_BEANTWORTET',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'BUERGER',
        beschreibung: 'Rückfrage beantwortet',
        details: rq
          ? `Antwort zu ${rq.id} eingereicht (Demo-Interaktion).`
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
      extraEvents.push({
        id: `E-DEMO-DOK-${id}`,
        typ: 'DOKUMENT_EINGEREICHT',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'BUERGER',
        beschreibung: dok
          ? `${dok.bezeichnung} hochgeladen`
          : `Dokument ${id} hochgeladen`,
        details: dok
          ? `Dokument ${dok.id} eingereicht (Demo-Interaktion, keine echte Datei).`
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

    return {
      ...demoFall,
      rueckfragen: updatedRueckfragen,
      dokumente: updatedDokumente,
      status,
      statusBeschreibung,
      naechsterSchritt,
      offeneAufgaben,
      timeline: [...demoFall.timeline, ...extraEvents],
      letzteAktivitaet:
        uploadedIds.length > 0 || answeredIds.length > 0
          ? DEMO_AKTION_DATUM
          : demoFall.letzteAktivitaet,
    };
  }, [answeredIds, uploadedIds]);

  return (
    <DemoStateContext.Provider
      value={{ fall, answerRueckfrage, uploadDokument, resetSession, hasSessionChanges }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateContextValue {
  return useContext(DemoStateContext);
}
