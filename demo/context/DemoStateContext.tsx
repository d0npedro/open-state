'use client';

/**
 * DemoStateContext – Open State Demo
 *
 * Hält den interaktiven Zustand der Demo-Session.
 * Ermöglicht State-Wechsel (Rückfrage beantworten, Dokument hochladen) ohne Backend.
 *
 * Kein Ersatz für echte Fachlogik. Dient ausschließlich der Demo-Darstellung.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoFall } from '@/data/mockFall';
import type { Fall } from '@/types';

/** Fiktives Upload-Datum (passt zum Demo-Zeitrahmen in mockFall / FIKTIVES_HEUTE). */
const DEMO_UPLOAD_DATUM = '24. November 2024';

interface DemoStateContextValue {
  fall: Fall;
  answerRueckfrage: (id: string) => void;
  /** Demo: markiert ein angefordertes/abgelehntes Dokument als hochgeladen. */
  uploadDokument: (id: string) => void;
}

const DemoStateContext = createContext<DemoStateContextValue>({
  fall: demoFall,
  answerRueckfrage: () => {},
  uploadDokument: () => {},
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
        hochgeladenAm: DEMO_UPLOAD_DATUM,
      };
    });
    const hasFehlendeUnterlagen = updatedDokumente.some(d => d.status === 'ANGEFORDERT');

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
    // Aufgaben zu hochgeladenen Dokumenten entfernen (heuristisch nach Stichworten)
    for (const dok of updatedDokumente) {
      if (dok.status === 'ANGEFORDERT' || dok.status === 'ABGELEHNT') continue;
      const keywords = dok.bezeichnung
        .toLowerCase()
        .split(/[\s()/,.-]+/)
        .filter(w => w.length >= 4);
      offeneAufgaben = offeneAufgaben.filter(aufgabe => {
        const a = aufgabe.toLowerCase();
        // Nur Aufgaben, die klar auf dieses Dokument deuten (z. B. „SG1“, „Formular“)
        if (dok.id === 'DOK-004' && (a.includes('sg1') || a.includes('selbstauskunft'))) {
          return false;
        }
        if (dok.id === 'DOK-003' && (a.includes('einkommensteuer') || a.includes('steuerbescheid'))) {
          return false;
        }
        // Generisch: wenn Aufgabe das Dokument explizit nennt
        return !keywords.some(k => k.length >= 5 && a.includes(k) && a.includes('hochladen'));
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
      letzteAktivitaet:
        uploadedIds.length > 0 || answeredIds.length > 0
          ? DEMO_UPLOAD_DATUM
          : demoFall.letzteAktivitaet,
    };
  }, [answeredIds, uploadedIds]);

  return (
    <DemoStateContext.Provider value={{ fall, answerRueckfrage, uploadDokument }}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateContextValue {
  return useContext(DemoStateContext);
}
