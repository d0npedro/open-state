'use client';

/**
 * GruendungStateContext – Demo-Session für Unternehmensgründung
 *
 * Interaktionen: Rückfrage beantworten, Dokument hochladen (ohne Backend).
 * Erzeugt Ereignis-Einträge für den Verlauf.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import type { GruendungsAkte, GruendungsEreignis } from '@/types/gruendung';

const DEMO_AKTION_DATUM = '07.12.2024';
const DEMO_AKTION_ZEIT = '07.12.2024, 11:15';

interface GruendungStateContextValue {
  akte: GruendungsAkte;
  /** Demo: beantwortet Rückfrage, optional mit Freitext. */
  answerRueckfrage: (id: string, antwortText?: string) => void;
  /** Demo: markiert angefordertes/abgelehntes Dokument als hochgeladen. */
  uploadDokument: (id: string) => void;
  /** Demo: setzt Session auf den Ausgangs-Mock zurück. */
  resetSession: () => void;
  /** True, sobald in dieser Session gehandelt wurde. */
  hasSessionChanges: boolean;
}

const DEMO_ANTWORT_FALLBACK =
  'Ja, ich nehme die Kleinunternehmerregelung nach § 19 UStG in Anspruch. Voraussichtlicher Jahresumsatz laufendes Jahr unter 22.000 €, kommendes Jahr unter 50.000 €. (Demo-Antwort)';

const GruendungStateContext = createContext<GruendungStateContextValue>({
  akte: demoGruendungsAkte,
  answerRueckfrage: () => {},
  uploadDokument: () => {},
  resetSession: () => {},
  hasSessionChanges: false,
});

export function GruendungStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredById, setAnsweredById] = useState<Record<string, string>>({});
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);

  const answerRueckfrage = useCallback((id: string, antwortText?: string) => {
    const text = (antwortText ?? '').trim() || DEMO_ANTWORT_FALLBACK;
    setAnsweredById(prev => (prev[id] !== undefined ? prev : { ...prev, [id]: text }));
  }, []);

  const uploadDokument = useCallback((id: string) => {
    setUploadedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const resetSession = useCallback(() => {
    setAnsweredById({});
    setUploadedIds([]);
  }, []);

  const hasSessionChanges = Object.keys(answeredById).length > 0 || uploadedIds.length > 0;

  const akte = useMemo((): GruendungsAkte => {
    const answeredIds = Object.keys(answeredById);
    const updatedRueckfragen = demoGruendungsAkte.rueckfragen.map(rq => {
      if (answeredById[rq.id] === undefined) return rq;
      return {
        ...rq,
        beantwortet: true,
        antwortText: answeredById[rq.id],
        beantwortetAm: DEMO_AKTION_DATUM,
      };
    });
    const hatOffeneRueckfragen = updatedRueckfragen.some(rq => !rq.beantwortet);

    const updatedDokumente = demoGruendungsAkte.dokumente.map(dok => {
      if (!uploadedIds.includes(dok.id)) return dok;
      if (dok.status !== 'ANGEFORDERT' && dok.status !== 'ABGELEHNT') return dok;
      return {
        ...dok,
        status: 'HOCHGELADEN' as const,
        hochgeladenAm: DEMO_AKTION_DATUM,
      };
    });
    const hatFehlendeUnterlagen = updatedDokumente.some(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );

    // Behörden: Finanzamt-Rückfrage schließen, wenn beantwortet
    const updatedBehörden = demoGruendungsAkte.beteiligteBehörden.map(b => {
      if (b.typ === 'FINANZAMT' && !hatOffeneRueckfragen && b.status === 'RUECKFRAGE_OFFEN') {
        return { ...b, status: 'IN_BEARBEITUNG' as const };
      }
      return b;
    });

    let status = demoGruendungsAkte.status;
    let statusBeschreibung = demoGruendungsAkte.statusBeschreibung;
    let naechsterSchritt = demoGruendungsAkte.naechsterSchritt;

    if (hatOffeneRueckfragen) {
      status = 'RUECKFRAGE_AUSSTEHEND';
      statusBeschreibung = demoGruendungsAkte.statusBeschreibung;
      naechsterSchritt = demoGruendungsAkte.naechsterSchritt;
    } else if (hatFehlendeUnterlagen) {
      status = 'IN_BEARBEITUNG';
      statusBeschreibung =
        'Alle Rückfragen sind beantwortet. Es liegen noch empfohlene oder angefordete Unterlagen aus.';
      naechsterSchritt =
        'Optional: fehlende Unterlagen im Bereich „Unterlagen“ hochladen. Das Finanzamt bearbeitet die steuerliche Erfassung.';
    } else {
      status = 'IN_BEARBEITUNG';
      statusBeschreibung =
        'Alle Rückfragen sind beantwortet und die angeforderten Unterlagen liegen vor. Die Behörden setzen die Bearbeitung fort.';
      naechsterSchritt =
        'Keine Handlung von Ihnen erforderlich. Prüfen Sie parallel die BG-Anmeldung (außerhalb von Open State).';
    }

    let offeneAufgaben = [...demoGruendungsAkte.offeneAufgaben];
    if (!hatOffeneRueckfragen) {
      offeneAufgaben = offeneAufgaben.filter(a => !a.toLowerCase().includes('rückfrage'));
    }
    for (const dok of updatedDokumente) {
      if (dok.status === 'ANGEFORDERT' || dok.status === 'ABGELEHNT') continue;
      const aLower = (aufgabe: string) => aufgabe.toLowerCase();
      if (dok.id === 'DOK-03') {
        offeneAufgaben = offeneAufgaben.filter(
          a => !aLower(a).includes('qualifikation') && !aLower(a).includes('nachweis beruflicher')
        );
      }
    }

    const extraEvents: GruendungsEreignis[] = [];

    for (const id of answeredIds) {
      const rq = demoGruendungsAkte.rueckfragen.find(r => r.id === id);
      const antwort = answeredById[id];
      const antwortKurz =
        antwort.length > 120 ? `${antwort.slice(0, 117)}…` : antwort;
      extraEvents.push({
        id: `UG-DEMO-RQ-${id}`,
        typ: 'rueckfrage_beantwortet',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'GRUENDER',
        behördeId: rq?.anforderndeBehördeId,
        beschreibung: 'Rückfrage beantwortet',
        details: antwort
          ? `Antwort eingereicht (Demo): „${antwortKurz}"`
          : `Rückfrage ${id} beantwortet (Demo-Interaktion).`,
      });
      extraEvents.push({
        id: `UG-DEMO-ST-RQ-${id}`,
        typ: 'status_aktualisiert',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'SYSTEM',
        beschreibung: 'Status: Rückfrage erledigt – Bearbeitung fortgesetzt',
        details: 'Finanzamt nimmt die Bearbeitung der steuerlichen Erfassung wieder auf.',
      });
    }

    for (const id of uploadedIds) {
      const dok = demoGruendungsAkte.dokumente.find(d => d.id === id);
      extraEvents.push({
        id: `UG-DEMO-DOK-${id}`,
        typ: 'dokument_hochgeladen',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'GRUENDER',
        behördeId: dok?.anforderndeBehördeId,
        beschreibung: dok
          ? `${dok.bezeichnung} hochgeladen`
          : `Dokument ${id} hochgeladen`,
        details: dok
          ? `Dokument ${dok.id} eingereicht (Demo-Interaktion, keine echte Datei).`
          : `Dokument ${id} eingereicht (Demo-Interaktion).`,
      });
    }

    return {
      ...demoGruendungsAkte,
      rueckfragen: updatedRueckfragen,
      dokumente: updatedDokumente,
      beteiligteBehörden: updatedBehörden,
      status,
      statusBeschreibung,
      naechsterSchritt,
      offeneAufgaben,
      ereignisse: [...demoGruendungsAkte.ereignisse, ...extraEvents],
      letzteAktualisierung:
        uploadedIds.length > 0 || answeredIds.length > 0
          ? DEMO_AKTION_DATUM
          : demoGruendungsAkte.letzteAktualisierung,
    };
  }, [answeredById, uploadedIds]);

  return (
    <GruendungStateContext.Provider
      value={{ akte, answerRueckfrage, uploadDokument, resetSession, hasSessionChanges }}
    >
      {children}
    </GruendungStateContext.Provider>
  );
}

export function useGruendungState(): GruendungStateContextValue {
  return useContext(GruendungStateContext);
}
