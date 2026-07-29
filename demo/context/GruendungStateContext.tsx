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

    // Verfahrensschritte: „Rückfrage …“-Schritte abschließen, sobald die
    // zugehörige Behörde keine offenen Rückfragen mehr hat (z. B. VS-04).
    // Anschließend den nächsten AUSSTEHEND-Schritt derselben Behörde auf
    // IN_BEARBEITUNG heben (z. B. VS-05 Steuernummer).
    const closedRueckfrageBehoerdeIds = new Set<string>();
    let updatedSchritte = demoGruendungsAkte.verfahrensSchritte.map(vs => {
      if (vs.status === 'ABGESCHLOSSEN') return vs;
      const name = vs.bezeichnung.toLowerCase();
      if (!name.includes('rückfrage') && !name.includes('rueckfrage')) return vs;
      const nochOffen = updatedRueckfragen.some(
        r => r.anforderndeBehördeId === vs.behördeId && !r.beantwortet
      );
      if (nochOffen) return vs;
      closedRueckfrageBehoerdeIds.add(vs.behördeId);
      return {
        ...vs,
        status: 'ABGESCHLOSSEN' as const,
        erledigtAm: DEMO_AKTION_DATUM,
        ergebnis:
          'Rückfrage beantwortet. Die Behörde setzt die Bearbeitung fort.',
      };
    });

    // Nächster ausstehender Schritt der betroffenen Behörde startet
    // (Listenreihenfolge; nur wenn kein Geschwisterschritt schon IN_BEARBEITUNG).
    updatedSchritte = updatedSchritte.map(vs => {
      if (vs.status !== 'AUSSTEHEND') return vs;
      if (!closedRueckfrageBehoerdeIds.has(vs.behördeId)) return vs;
      const sameBehoerde = updatedSchritte.filter(s => s.behördeId === vs.behördeId);
      if (sameBehoerde.some(s => s.status === 'IN_BEARBEITUNG')) return vs;
      const firstAusstehend = sameBehoerde.find(s => s.status === 'AUSSTEHEND');
      if (firstAusstehend?.id !== vs.id) return vs;
      return { ...vs, status: 'IN_BEARBEITUNG' as const };
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
      const geschlosseneSchritte = updatedSchritte.filter(
        vs =>
          vs.status === 'ABGESCHLOSSEN' &&
          vs.behördeId === rq?.anforderndeBehördeId &&
          (vs.bezeichnung.toLowerCase().includes('rückfrage') ||
            vs.bezeichnung.toLowerCase().includes('rueckfrage')) &&
          demoGruendungsAkte.verfahrensSchritte.find(s => s.id === vs.id)?.status !==
            'ABGESCHLOSSEN'
      );
      for (const vs of geschlosseneSchritte) {
        extraEvents.push({
          id: `UG-DEMO-VS-${vs.id}-${id}`,
          typ: 'status_aktualisiert',
          zeitstempel: DEMO_AKTION_ZEIT,
          handelndeStelle: 'SYSTEM',
          behördeId: vs.behördeId,
          beschreibung: `Verfahrensschritt erledigt: ${vs.bezeichnung}`,
          details:
            vs.ergebnis ??
            'Rückfrage-Schritt nach Antwort des Gründers als erledigt markiert.',
        });
      }
      // Nächster Schritt derselben Behörde, der durch die Antwort gestartet wurde
      const gestarteteSchritte = updatedSchritte.filter(
        vs =>
          vs.status === 'IN_BEARBEITUNG' &&
          vs.behördeId === rq?.anforderndeBehördeId &&
          demoGruendungsAkte.verfahrensSchritte.find(s => s.id === vs.id)?.status ===
            'AUSSTEHEND'
      );
      for (const vs of gestarteteSchritte) {
        extraEvents.push({
          id: `UG-DEMO-VS-START-${vs.id}-${id}`,
          typ: 'status_aktualisiert',
          zeitstempel: DEMO_AKTION_ZEIT,
          handelndeStelle: 'SYSTEM',
          behördeId: vs.behördeId,
          beschreibung: `Verfahrensschritt gestartet: ${vs.bezeichnung}`,
          details:
            'Nächster Schritt der Behörde nach Beantwortung der Rückfrage.',
        });
      }
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
      verfahrensSchritte: updatedSchritte,
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
