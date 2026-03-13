'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import type { GruendungsAkte } from '@/types/gruendung';

interface GruendungStateContextValue {
  akte: GruendungsAkte;
  answerRueckfrage: (id: string) => void;
}

const GruendungStateContext = createContext<GruendungStateContextValue>({
  akte: demoGruendungsAkte,
  answerRueckfrage: () => {},
});

export function GruendungStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);

  const answerRueckfrage = useCallback((id: string) => {
    setAnsweredIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const akte = useMemo((): GruendungsAkte => {
    const updatedRueckfragen = demoGruendungsAkte.rueckfragen.map(rq =>
      answeredIds.includes(rq.id) ? { ...rq, beantwortet: true } : rq
    );
    const hatOffene = updatedRueckfragen.some(rq => !rq.beantwortet);

    return {
      ...demoGruendungsAkte,
      rueckfragen: updatedRueckfragen,
      status: hatOffene ? 'RUECKFRAGE_AUSSTEHEND' : 'IN_BEARBEITUNG',
      statusBeschreibung: hatOffene
        ? demoGruendungsAkte.statusBeschreibung
        : 'Alle Rückfragen beantwortet. Das Finanzamt nimmt die Bearbeitung wieder auf.',
      offeneAufgaben: hatOffene
        ? demoGruendungsAkte.offeneAufgaben
        : demoGruendungsAkte.offeneAufgaben.filter(a => !a.toLowerCase().includes('rückfrage')),
    };
  }, [answeredIds]);

  return (
    <GruendungStateContext.Provider value={{ akte, answerRueckfrage }}>
      {children}
    </GruendungStateContext.Provider>
  );
}

export function useGruendungState(): GruendungStateContextValue {
  return useContext(GruendungStateContext);
}
