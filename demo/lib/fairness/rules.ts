/**
 * Verfahrensfairness-Regelwerk (Demo)
 *
 * Leitet Hinweissignale direkt aus dem Fallzustand ab.
 * Jede Regel ist einzeln lesbar und nachvollziehbar.
 * Keine KI, keine Blackbox, keine Bewertung von Personen.
 *
 * Alle Signale sind Hinweise – keine Entscheidungen.
 */

import { Fall } from '@/types';
import { FairnessSignal } from '@/types/fairness';

// Schwellenwert: Rückfragefrist gilt als "relevant" ab <= dieser Anzahl Tage
const FRIST_RELEVANT_AB_TAGEN = 10;

export function berechneFairnessSignale(fall: Fall): FairnessSignal[] {
  const signale: FairnessSignal[] = [];

  // ─── Signal 1: Offene Rückfrage mit nahender Frist ───────────────────────
  // Regel: Wenn eine Rückfrage unbeantwortet ist und die Frist <= 10 Tage beträgt,
  //        ist dies für Bürger und Sachbearbeitung relevant zu wissen.
  for (const rq of fall.rueckfragen) {
    if (!rq.beantwortet && rq.fristTage <= FRIST_RELEVANT_AB_TAGEN) {
      signale.push({
        id: `FH-${rq.id}-FRIST`,
        typ: 'RUECKFRAGE_OFFEN_FRIST_RELEVANT',
        titel: 'Rückfrage offen – Frist nähert sich',
        erklaerung:
          `Eine Rückfrage vom ${rq.gestelltAm} wartet noch auf Ihre Antwort. ` +
          `Die Antwortfrist endet am ${rq.frist} (noch ${rq.fristTage} Tage).`,
        auswirkung: rq.konsequenz,
        naechsterSchritt:
          'Bitte beantworten Sie die Rückfrage im Bereich „Rückfragen". ' +
          'Dort finden Sie die vollständige Frage, die Begründung und die Frist.',
        bezug: `Rückfrage ${rq.id}, gestellt am ${rq.gestelltAm}`,
        prioritaet: rq.fristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 2: Fehlende Unterlagen blockieren Fallfortschritt ─────────────
  // Regel: Dokumente mit Status ANGEFORDERT, für die noch kein Eingang verzeichnet ist,
  //        halten den nächsten Bearbeitungsschritt an.
  const fehlendeDokumente = fall.dokumente.filter(d => d.status === 'ANGEFORDERT');
  if (fehlendeDokumente.length > 0) {
    const names = fehlendeDokumente.map(d => d.bezeichnung).join(', ');
    signale.push({
      id: 'FH-UNTERLAGEN-FEHLEND',
      typ: 'UNTERLAGE_FEHLT_BLOCKIERT',
      titel: `${fehlendeDokumente.length} Unterlage(n) noch nicht eingereicht`,
      erklaerung:
        `Folgende angeforderten Unterlagen liegen noch nicht vor: ${names}. ` +
        `Ohne diese Unterlagen kann die Fallbearbeitung nicht vollständig abgeschlossen werden.`,
      auswirkung:
        'Die Sachbearbeitung kann erst mit der Entscheidungsvorbereitung fortfahren, ' +
        'wenn alle angeforderten Unterlagen vollständig und fristgerecht eingereicht wurden.',
      naechsterSchritt:
        'Unterlagen im Bereich „Dokumente" hochladen. ' +
        'Dort ist für jede Anforderung erläutert, warum das Dokument benötigt wird.',
      bezug: `Dokumente: ${fehlendeDokumente.map(d => d.id).join(', ')}`,
      prioritaet: 'HINWEIS',
    });
  }

  // ─── Signal 3: Fallbearbeitung derzeit pausiert ──────────────────────────
  // Regel: Wenn der Fallstatus auf eine aktive Pause hinweist, ist das für alle
  //        Beteiligten wichtig — der Grund der Pause sollte sichtbar sein.
  const pausierteStatus = ['RUECKFRAGE_OFFEN', 'UNTERLAGEN_FEHLEN', 'PAUSIERT'];
  if (pausierteStatus.includes(fall.status)) {
    signale.push({
      id: 'FH-FALL-PAUSIERT',
      typ: 'FALL_PAUSIERT',
      titel: 'Fallbearbeitung derzeit pausiert',
      erklaerung:
        `Der Fall befindet sich im Status „${fall.statusBeschreibung}" ` +
        `Solange offene Punkte bestehen, kann die Sachbearbeitung nicht fortfahren.`,
      auswirkung:
        'Kein Fortschritt in der Bearbeitung, bis alle ausstehenden Rückfragen und ' +
        'Unterlagen vollständig vorliegen.',
      naechsterSchritt: fall.naechsterSchritt,
      bezug: `Fallstatus: ${fall.status} seit ${fall.letzteAktivitaet}`,
      prioritaet: 'INFO',
    });
  }

  // ─── Signal 4: Vorläufiger Bescheid – endgültige Entscheidung steht noch aus ──
  // Regel: Wenn ein Bescheid das Wort „vorläufig" im Typ trägt (§ 164 SGB III),
  //        ist der Leistungsbetrag noch nicht endgültig festgestellt.
  const vorlaeufigeBesch = fall.bescheide.filter(b =>
    b.typ.toLowerCase().includes('vorläufig')
  );
  if (vorlaeufigeBesch.length > 0) {
    const b = vorlaeufigeBesch[0];
    signale.push({
      id: 'FH-BESCHEID-VORLAEUFIG',
      typ: 'BESCHEID_VORLAEUFIG',
      titel: 'Vorläufiger Bescheid – Leistungshöhe noch nicht endgültig',
      erklaerung:
        `Es liegt ein vorläufiger Bescheid vor (${b.typ}, zugestellt am ${b.datum}). ` +
        `Die endgültige Leistungshöhe wird erst nach vollständiger Prüfung aller Unterlagen festgesetzt.`,
      auswirkung:
        'Der vorläufige Bescheid kann nachträglich durch einen endgültigen Bescheid ersetzt werden. ' +
        'Die Widerspruchsfrist läuft bereits ab Zustellung des vorläufigen Bescheids.',
      naechsterSchritt:
        `Widerspruchsfrist im Blick behalten (Ablauf: ${b.widerspruchsfristAblauf}). ` +
        'Alle angeforderten Unterlagen einreichen, damit die Bemessungsgrundlage abgeschlossen werden kann.',
      bezug: `Bescheid ${b.id}, Rechtsgrundlage: ${b.rechtsgrundlage}`,
      prioritaet: 'HINWEIS',
    });
  }

  // ─── Signal 5: Begründung im Bescheid könnte vollständiger sein ──────────
  // Regel: Wenn die Begründung eines Bescheids auf ausstehende Informationen
  //        verweist, ist das für die Nachvollziehbarkeit relevant.
  for (const b of fall.bescheide) {
    const hatOffeneBegr =
      b.begruendung.toLowerCase().includes('offen') ||
      b.begruendung.toLowerCase().includes('fehlende');
    if (hatOffeneBegr) {
      signale.push({
        id: `FH-${b.id}-BEGRUENDUNG`,
        typ: 'BESCHEID_BEGRUENDUNG_ERWEITERBAR',
        titel: 'Bescheidbegründung verweist auf ausstehende Informationen',
        erklaerung:
          `Die Begründung des Bescheids (${b.typ}) verweist auf noch ausstehende Angaben: ` +
          `„${b.begruendung}" – die vollständige Begründung folgt mit dem endgültigen Bescheid.`,
        auswirkung:
          'Die Entscheidungsgrundlage ist noch nicht vollständig dokumentiert. ' +
          'Mit Eingang aller Unterlagen wird die Begründung vervollständigt.',
        naechsterSchritt:
          'Fehlende Unterlagen einreichen (Bereich „Dokumente"), ' +
          'damit die Bemessungsgrundlage und Begründung abgeschlossen werden können.',
        bezug: `Bescheid ${b.id}, Begründung: „${b.begruendung}"`,
        prioritaet: 'INFO',
      });
    }
  }

  return signale;
}

/**
 * Gibt nur Signale einer bestimmten Priorität zurück – nützlich für kompakte Übersichten.
 */
export function filterSignaleNachPrioritaet(
  signale: FairnessSignal[],
  prioritaeten: Array<FairnessSignal['prioritaet']>
): FairnessSignal[] {
  return signale.filter(s => prioritaeten.includes(s.prioritaet));
}
