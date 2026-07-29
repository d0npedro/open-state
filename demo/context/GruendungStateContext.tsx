'use client';

/**
 * GruendungStateContext – Demo-Session für Unternehmensgründung
 *
 * Interaktionen: Rückfrage beantworten, Dokument hochladen,
 * BG-Anmeldung als erledigt markieren (ohne Backend).
 * Erzeugt Ereignis-Einträge für den Verlauf.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import type { GruendungsAkte, GruendungsEreignis } from '@/types/gruendung';

const DEMO_AKTION_DATUM = '07.12.2024';
const DEMO_AKTION_ZEIT = '07.12.2024, 11:15';

/** Behörde, deren Anmeldung in der Demo als erledigt markiert werden kann (BG). */
const BG_BEHOERDE_ID = 'BEH-04';
const BG_SCHRITT_ID = 'VS-07';

/**
 * Verlauf-Anker-ID für die Demo-Antwort auf eine Rückfrage.
 * Beispiel: RQ-01 → `UG-DEMO-RQ-RQ-01` (Hash `#ere-UG-DEMO-RQ-RQ-01`).
 */
export function demoRqAntwortEreignisId(rqId: string): string {
  return `UG-DEMO-RQ-${rqId}`;
}

/**
 * Verlauf-Anker-ID für den Demo-Upload einer Unterlage.
 * Beispiel: DOK-03 → `UG-DEMO-DOK-DOK-03` (Hash `#ere-UG-DEMO-DOK-DOK-03`).
 */
export function demoDokUploadEreignisId(dokId: string): string {
  return `UG-DEMO-DOK-${dokId}`;
}

interface GruendungStateContextValue {
  akte: GruendungsAkte;
  /** Demo: beantwortet Rückfrage, optional mit Freitext. */
  answerRueckfrage: (id: string, antwortText?: string) => void;
  /** Demo: markiert angefordertes/abgelehntes Dokument als hochgeladen. */
  uploadDokument: (id: string) => void;
  /**
   * Demo: markiert die BG-Anmeldung (außerhalb Open State) als erledigt.
   * Ermöglicht Fairness-Fallthrough auf Steuernummer/Betriebsdatum.
   */
  markBgAnmeldungErledigt: () => void;
  /** Demo: setzt Session auf den Ausgangs-Mock zurück. */
  resetSession: () => void;
  /** True, sobald in dieser Session gehandelt wurde. */
  hasSessionChanges: boolean;
  /** Dokument-IDs, die in dieser Demo-Session als hochgeladen markiert wurden. */
  sessionUploadedIds: string[];
  /** True, wenn die BG-Anmeldung in dieser Session als erledigt markiert wurde. */
  sessionBgErledigt: boolean;
}

const DEMO_ANTWORT_FALLBACK =
  'Ja, ich nehme die Kleinunternehmerregelung nach § 19 UStG in Anspruch. Voraussichtlicher Jahresumsatz laufendes Jahr unter 22.000 €, kommendes Jahr unter 50.000 €. (Demo-Antwort)';

const GruendungStateContext = createContext<GruendungStateContextValue>({
  akte: demoGruendungsAkte,
  answerRueckfrage: () => {},
  uploadDokument: () => {},
  markBgAnmeldungErledigt: () => {},
  resetSession: () => {},
  hasSessionChanges: false,
  sessionUploadedIds: [],
  sessionBgErledigt: false,
});

export function GruendungStateProvider({ children }: { children: React.ReactNode }) {
  const [answeredById, setAnsweredById] = useState<Record<string, string>>({});
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);
  const [bgAnmeldungErledigt, setBgAnmeldungErledigt] = useState(false);

  const answerRueckfrage = useCallback((id: string, antwortText?: string) => {
    const text = (antwortText ?? '').trim() || DEMO_ANTWORT_FALLBACK;
    setAnsweredById(prev => (prev[id] !== undefined ? prev : { ...prev, [id]: text }));
  }, []);

  const uploadDokument = useCallback((id: string) => {
    setUploadedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markBgAnmeldungErledigt = useCallback(() => {
    setBgAnmeldungErledigt(true);
  }, []);

  const resetSession = useCallback(() => {
    setAnsweredById({});
    setUploadedIds([]);
    setBgAnmeldungErledigt(false);
  }, []);

  const hasSessionChanges =
    Object.keys(answeredById).length > 0 || uploadedIds.length > 0 || bgAnmeldungErledigt;

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

    // Behörden: Finanzamt-Rückfrage schließen, wenn beantwortet;
    // BG-Anmeldung: Demo-Markierung NICHT_GESTARTET → ABGESCHLOSSEN
    let updatedBehörden = demoGruendungsAkte.beteiligteBehörden.map(b => {
      if (b.typ === 'FINANZAMT' && !hatOffeneRueckfragen && b.status === 'RUECKFRAGE_OFFEN') {
        return { ...b, status: 'IN_BEARBEITUNG' as const };
      }
      return b;
    });
    if (bgAnmeldungErledigt) {
      updatedBehörden = updatedBehörden.map(b => {
        if (b.id !== BG_BEHOERDE_ID || b.status !== 'NICHT_GESTARTET') return b;
        return { ...b, status: 'ABGESCHLOSSEN' as const };
      });
    }

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

    // BG VS-07: Demo-Anmeldung als erledigt (außerhalb Open State)
    if (bgAnmeldungErledigt) {
      updatedSchritte = updatedSchritte.map(vs => {
        if (vs.id !== BG_SCHRITT_ID) return vs;
        if (vs.status === 'ABGESCHLOSSEN') return vs;
        return {
          ...vs,
          status: 'ABGESCHLOSSEN' as const,
          erledigtAm: DEMO_AKTION_DATUM,
          ergebnis:
            'Anmeldung bei der Berufsgenossenschaft als erledigt markiert (Demo, außerhalb Open State).',
        };
      });
    }

    const hatOffeneBg =
      !bgAnmeldungErledigt &&
      demoGruendungsAkte.beteiligteBehörden.some(
        b => b.typ === 'BERUFSGENOSSENSCHAFT' && b.status === 'NICHT_GESTARTET'
      );

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
    } else if (hatOffeneBg) {
      status = 'IN_BEARBEITUNG';
      statusBeschreibung =
        'Alle Rückfragen sind beantwortet und die angeforderten Unterlagen liegen vor. Die Behörden setzen die Bearbeitung fort.';
      naechsterSchritt =
        'Keine Handlung von Ihnen erforderlich. Prüfen Sie parallel die BG-Anmeldung (außerhalb von Open State).';
    } else {
      status = 'IN_BEARBEITUNG';
      statusBeschreibung =
        'Rückfragen, Unterlagen und BG-Anmeldung sind erledigt. Das Finanzamt bearbeitet die Steuernummer-Vergabe; die IHK läuft parallel.';
      naechsterSchritt =
        'Keine eigene Handlung mehr nötig für die BG. Prüfen Sie den Stand der Steuernummer-Vergabe beim Finanzamt und den Verfahrensstatus.';
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
    if (bgAnmeldungErledigt) {
      offeneAufgaben = offeneAufgaben.filter(a => {
        const t = a.toLowerCase();
        return (
          !t.includes('berufsgenossenschaft') &&
          !t.includes('bg etem') &&
          !(t.includes('bg ') && t.includes('anmeldung'))
        );
      });
    }

    const extraEvents: GruendungsEreignis[] = [];

    for (const id of answeredIds) {
      const rq = demoGruendungsAkte.rueckfragen.find(r => r.id === id);
      const antwort = answeredById[id];
      const antwortKurz =
        antwort.length > 120 ? `${antwort.slice(0, 117)}…` : antwort;
      extraEvents.push({
        id: demoRqAntwortEreignisId(id),
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
        id: demoDokUploadEreignisId(id),
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

    if (bgAnmeldungErledigt) {
      const bg = demoGruendungsAkte.beteiligteBehörden.find(b => b.id === BG_BEHOERDE_ID);
      extraEvents.push({
        id: 'UG-DEMO-BG-ANMELDUNG',
        typ: 'status_aktualisiert',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'GRUENDER',
        behördeId: BG_BEHOERDE_ID,
        beschreibung: 'BG-Anmeldung als erledigt markiert (Demo)',
        details: bg
          ? `Anmeldung bei ${bg.bezeichnung} als erledigt markiert. Erfolgt außerhalb von Open State; Demo speichert keine echte Meldung.`
          : 'BG-Anmeldung als erledigt markiert (Demo-Interaktion).',
      });
      extraEvents.push({
        id: `UG-DEMO-VS-${BG_SCHRITT_ID}`,
        typ: 'status_aktualisiert',
        zeitstempel: DEMO_AKTION_ZEIT,
        handelndeStelle: 'SYSTEM',
        behördeId: BG_BEHOERDE_ID,
        beschreibung: 'Verfahrensschritt erledigt: Anmeldung Berufsgenossenschaft',
        details:
          'VS-07 nach Demo-Markierung der BG-Anmeldung als erledigt gesetzt.',
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
        uploadedIds.length > 0 || answeredIds.length > 0 || bgAnmeldungErledigt
          ? DEMO_AKTION_DATUM
          : demoGruendungsAkte.letzteAktualisierung,
    };
  }, [answeredById, uploadedIds, bgAnmeldungErledigt]);

  return (
    <GruendungStateContext.Provider
      value={{
        akte,
        answerRueckfrage,
        uploadDokument,
        markBgAnmeldungErledigt,
        resetSession,
        hasSessionChanges,
        sessionUploadedIds: uploadedIds,
        sessionBgErledigt: bgAnmeldungErledigt,
      }}
    >
      {children}
    </GruendungStateContext.Provider>
  );
}

export function useGruendungState(): GruendungStateContextValue {
  return useContext(GruendungStateContext);
}
