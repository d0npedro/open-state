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

/**
 * Fiktives Demo-Datum (ISO).
 *
 * Der Demo-Fall spielt im November 2024. Damit die Fairness-Regeln realistische
 * Fristdrucksituationen zeigen, wird ein festes fiktives Heute verwendet.
 * Wert 24.11.2024 → 2 Tage bis zur Rückfragen-Frist (26.11.) → Signal RELEVANT.
 *
 * In einem produktiven System würde hier new Date() stehen.
 */
export const FIKTIVES_HEUTE = '2024-11-24';

/**
 * Berechnet die verbleibenden Kalendertage zwischen heute und einem Fristdatum.
 * Negatives Ergebnis bedeutet: Frist bereits abgelaufen.
 */
export function berechneFristTage(fristDatum: string, heute: string): number {
  const frist = new Date(fristDatum);
  const jetzt = new Date(heute);
  const diffMs = frist.getTime() - jetzt.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Deutsche Monatsnamen → 1–12 (Demo-Daten in mockFall, Anzeigeform). */
const DE_MONAT: Record<string, number> = {
  januar: 1,
  februar: 2,
  märz: 3,
  maerz: 3,
  april: 4,
  mai: 5,
  juni: 6,
  juli: 7,
  august: 8,
  september: 9,
  oktober: 10,
  november: 11,
  dezember: 12,
};

/**
 * Parst Anzeige-Datum aus dem Demo-Mock (z. B. „3. Dezember 2024“) nach ISO yyyy-mm-dd.
 * Rückgabe null bei unbekanntem Format — dann greift nur der Status-Fallback.
 */
export function parseDeutschesDatumZuIso(datum: string): string | null {
  const m = datum.trim().match(/^(\d{1,2})\.\s*(\S+)\s+(\d{4})$/);
  if (!m) return null;
  const tag = parseInt(m[1], 10);
  const monat = DE_MONAT[m[2].toLowerCase()];
  if (!monat || tag < 1 || tag > 31) return null;
  return `${m[3]}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
}

/**
 * Termin mit Handlungsbedarf für Tab-Badge (Q-089 / US-AV-005):
 * - unbestätigt (AUSSTEHEND), oder
 * - nicht abgesagt und heute/morgen fällig (Resttage 0 oder 1 ggü. FIKTIVES_HEUTE)
 */
export function terminHatHandlungsbedarf(
  termin: { status: string; datum: string },
  heute: string = FIKTIVES_HEUTE
): boolean {
  if (termin.status === 'ABGESAGT') return false;
  if (termin.status === 'AUSSTEHEND') return true;
  const iso = parseDeutschesDatumZuIso(termin.datum);
  if (!iso) return false;
  const rest = berechneFristTage(iso, heute);
  return rest >= 0 && rest <= 1;
}

export function berechneFairnessSignale(fall: Fall): FairnessSignal[] {
  const signale: FairnessSignal[] = [];

  // ─── Signal 1: Offene Rückfrage mit nahender Frist ───────────────────────
  // Regel: Wenn eine Rückfrage unbeantwortet ist und die berechnete Frist
  //        <= FRIST_RELEVANT_AB_TAGEN beträgt, ist dies relevant zu wissen.
  for (const rq of fall.rueckfragen) {
    const fristTage = berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE);
    if (!rq.beantwortet && fristTage <= FRIST_RELEVANT_AB_TAGEN) {
      const fristLabel =
        fristTage < 0
          ? `${Math.abs(fristTage)} Tage überschritten`
          : fristTage === 0
            ? 'heute'
            : `noch ${fristTage} Tag${fristTage === 1 ? '' : 'e'}`;
      signale.push({
        id: `FH-${rq.id}-FRIST`,
        typ: 'RUECKFRAGE_OFFEN_FRIST_RELEVANT',
        // Titel mit Resttagen – Parität zu UNTERLAGE_FEHLT_BLOCKIERT (US-AV-008)
        titel: `Rückfrage offen – Frist ${fristLabel}`,
        erklaerung:
          `Eine Rückfrage vom ${rq.gestelltAm} wartet noch auf Ihre Antwort. ` +
          `Die Antwortfrist endet am ${rq.frist} (${fristLabel}).`,
        auswirkung: rq.konsequenz,
        naechsterSchritt:
          'Bitte beantworten Sie die Rückfrage im Bereich „Rückfragen". ' +
          'Dort finden Sie die vollständige Frage, die Begründung und die Frist.',
        bezug: `Rückfrage ${rq.id}, gestellt am ${rq.gestelltAm}`,
        prioritaet: fristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 2: Fehlende Unterlagen blockieren Fallfortschritt ─────────────
  // Regel: Dokumente mit Status ANGEFORDERT oder ABGELEHNT (erneute Einreichung nötig)
  //        halten den nächsten Bearbeitungsschritt an.
  // Frist: analog Signal 1 (Rückfrage) – berechnete Resttage gegen FIKTIVES_HEUTE,
  //        nächste Einreichungsfrist im Titel/Erklärung, Priorität bei ≤3 Tagen.
  const fehlendeDokumente = fall.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlendeDokumente.length > 0) {
    const abgelehnt = fehlendeDokumente.filter(d => d.status === 'ABGELEHNT');
    const names = fehlendeDokumente.map(d => d.bezeichnung).join(', ');
    const abgelehntHinweis =
      abgelehnt.length > 0
        ? ` Davon abgelehnt und erneut einzureichen: ${abgelehnt.map(d => d.bezeichnung).join(', ')}.`
        : '';

    const dokMitFrist = fehlendeDokumente
      .filter(d => d.fristDatum && d.frist)
      .map(d => ({
        bezeichnung: d.bezeichnung,
        frist: d.frist as string,
        resttage: berechneFristTage(d.fristDatum as string, FIKTIVES_HEUTE),
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
      id: 'FH-UNTERLAGEN-FEHLEND',
      typ: 'UNTERLAGE_FEHLT_BLOCKIERT',
      titel: naechsteFrist
        ? `${fehlendeDokumente.length} Unterlage(n) offen – Frist ${fristLabel}`
        : `${fehlendeDokumente.length} Unterlage(n) noch nicht vollständig`,
      erklaerung:
        `Folgende Unterlagen fehlen oder müssen erneut eingereicht werden: ${names}.` +
        abgelehntHinweis +
        fristHinweis +
        ` Ohne diese Unterlagen kann die Fallbearbeitung nicht vollständig abgeschlossen werden.`,
      auswirkung:
        'Die Sachbearbeitung kann erst mit der Entscheidungsvorbereitung fortfahren, ' +
        'wenn alle angeforderten Unterlagen vollständig und fristgerecht eingereicht wurden.',
      naechsterSchritt: naechsteFrist
        ? `Unterlagen im Bereich „Dokumente" bis ${naechsteFrist.frist} (${fristLabel}) hochladen. ` +
          'Dort ist für jede Anforderung erläutert, warum das Dokument benötigt wird.'
        : 'Unterlagen im Bereich „Dokumente" hochladen. ' +
          'Dort ist für jede Anforderung erläutert, warum das Dokument benötigt wird.',
      bezug: `Dokumente: ${fehlendeDokumente.map(d => d.id).join(', ')}`,
      // Abgelehnte Unterlagen oder knappe Frist (≤3 Tage) sind dringlicher
      prioritaet: abgelehnt.length > 0 || fristDringend ? 'RELEVANT' : 'HINWEIS',
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
