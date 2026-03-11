'use client';

/**
 * DemoStateContext – Open State Demo
 *
 * Hält den interaktiven Zustand der Demo-Session.
 * Ermöglicht State-Wechsel (z. B. Rückfrage beantworten) ohne Backend.
 *
 * Kein Ersatz für echte Fachlogik. Dient ausschließlich der Demo-Darstellung.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoFall } from '@/data/mockFall';
import type { Fall } from '@/types';

interface DemoStateContextValue {
  fall: Fall;
  answerRueckfrage: (id: string) => void;
}

const DemoStateContext = createContext<DemoStateContextValue>({
  fall: demoFall,
  answerRueckfrage: () => {},
});

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);

  const answerRueckfrage = useCallback((id: string) => {
    setAnsweredIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const fall = useMemo((): Fall => {
    const updatedRueckfragen = demoFall.rueckfragen.map(rq =>
      answeredIds.includes(rq.id) ? { ...rq, beantwortet: true } : rq
    );
    const hasOffeneRueckfragen = updatedRueckfragen.some(rq => !rq.beantwortet);

    return {
      ...demoFall,
      rueckfragen: updatedRueckfragen,
      status: hasOffeneRueckfragen ? 'RUECKFRAGE_OFFEN' : 'IN_PRUEFUNG',
      statusBeschreibung: hasOffeneRueckfragen
        ? demoFall.statusBeschreibung
        : 'Alle Rückfragen beantwortet. Ihr Antrag wird nun weiter geprüft.',
      offeneAufgaben: hasOffeneRueckfragen
        ? demoFall.offeneAufgaben
        : demoFall.offeneAufgaben.filter(a => !a.toLowerCase().includes('rückfrage')),
    };
  }, [answeredIds]);

  return (
    <DemoStateContext.Provider value={{ fall, answerRueckfrage }}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateContextValue {
  return useContext(DemoStateContext);
}
