/**
 * Verfahrensfairness-Regelwerk – Unternehmensgründung (Demo)
 *
 * Leitet Hinweissignale direkt aus dem Gründungsaktenzustand ab.
 * Jede Regel ist einzeln lesbar und nachvollziehbar.
 *
 * Keine KI, keine Blackbox, keine Bewertung von Personen oder Vorhaben.
 * Alle Signale sind Hinweise – keine Entscheidungen.
 */

import type { GruendungsAkte } from '@/types/gruendung';
import type { FairnessSignal } from '@/types/fairness';
import { berechneFristTage } from './rules';

/**
 * Fiktives Demo-Datum für die Gründungsdomäne (ISO).
 *
 * Der Gründungsfall spielt im Dezember 2024.
 * Wert 07.12.2024 → 3 Tage bis Rückfragenfrist (10.12.) → Signal RELEVANT.
 * Geplantes Betriebsdatum 01.12.2024 liegt 6 Tage zurück → BG-Frist läuft ab.
 */
export const FIKTIVES_HEUTE_GRUENDUNG = '2024-12-07';

/** Tage bis zur Rückfragen-Frist ab denen das Signal erscheint */
const FRIST_RELEVANT_AB_TAGEN = 10;

/** Gesetzliche Frist für BG-Anmeldung nach § 192 SGB VII (in Tagen) */
const BG_ANMELDEFRIST_TAGE = 7;

export function berechneFairnessSignaleGruendung(akte: GruendungsAkte): FairnessSignal[] {
  const signale: FairnessSignal[] = [];
  const heute = FIKTIVES_HEUTE_GRUENDUNG;

  // ─── Signal 1: Offene Rückfrage mit nahender Frist ─────────────────────────
  // Regel: Wenn eine Rückfrage unbeantwortet ist und die berechnete Frist
  //        <= FRIST_RELEVANT_AB_TAGEN beträgt, ist dies relevant zu wissen.
  for (const rq of akte.rueckfragen) {
    const fristTage = berechneFristTage(rq.fristDatum, heute);
    if (!rq.beantwortet && fristTage <= FRIST_RELEVANT_AB_TAGEN) {
      const behörde = akte.beteiligteBehörden.find(b => b.id === rq.anforderndeBehördeId);
      const fristLabel =
        fristTage < 0  ? `${Math.abs(fristTage)} Tage überschritten` :
        fristTage === 0 ? 'heute fällig' :
        `noch ${fristTage} Tag${fristTage === 1 ? '' : 'e'}`;

      signale.push({
        id: `UG-RQ-${rq.id}-FRIST`,
        typ: 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT',
        titel: `Rückfrage offen – Antwortfrist ${fristLabel}`,
        erklaerung:
          `Eine Rückfrage vom ${rq.gestelltAm} des ${behörde?.bezeichnung ?? 'Behörde'} ` +
          `wartet noch auf Ihre Antwort (Frist: ${rq.frist}, ${fristLabel}). ` +
          `Ohne Antwort kann die steuerliche Erfassung nicht abgeschlossen werden.`,
        auswirkung: rq.konsequenz,
        naechsterSchritt:
          'Bitte beantworten Sie die Rückfrage im Bereich „Rückfragen". ' +
          'Die Frage, Begründung und Frist sind dort vollständig einsehbar.',
        bezug: `Rückfrage ${rq.id}, ${behörde?.bezeichnung ?? ''}, gestellt ${rq.gestelltAm}`,
        prioritaet: fristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 1b: Angeforderte Unterlagen noch nicht eingereicht ────────────
  // Regel: Dokumente mit Status ANGEFORDERT (oder ABGELEHNT) blockieren bzw.
  //        verzögern die vollständige Aktenführung, auch wenn optional empfohlen.
  const fehlendeDokumente = akte.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlendeDokumente.length > 0) {
    const names = fehlendeDokumente.map(d => d.bezeichnung).join('; ');
    signale.push({
      id: 'UG-UNTERLAGEN-FEHLEND',
      typ: 'UG_UNTERLAGE_FEHLT',
      titel: `${fehlendeDokumente.length} Unterlage(n) noch nicht eingereicht`,
      erklaerung:
        `Folgende Unterlagen sind noch ausstehend: ${names}. ` +
        `Details und Begründungen stehen im Bereich „Unterlagen“.`,
      auswirkung: fehlendeDokumente.map(d => d.konsequenz).join(' '),
      naechsterSchritt:
        'Unterlagen im Bereich „Unterlagen“ hochladen. ' +
        'Demo: Der Upload speichert keine Datei, ändert aber den Aktenstatus und dieses Signal.',
      bezug: `Dokumente: ${fehlendeDokumente.map(d => d.id).join(', ')}`,
      prioritaet: 'HINWEIS',
    });
  }

  // ─── Signal 2: BG-Anmeldung steht aus – gesetzliche Frist läuft ───────────
  // Regel: Berufsgenossenschaft muss binnen 7 Tagen nach Betriebsaufnahme
  //        angemeldet werden (§ 192 SGB VII). Wenn Betriebsdatum + 7 Tage
  //        nahe oder überschritten ist und BG noch NICHT_GESTARTET, ist das relevant.
  const bgBehörde = akte.beteiligteBehörden.find(b => b.typ === 'BERUFSGENOSSENSCHAFT');
  if (bgBehörde && bgBehörde.status === 'NICHT_GESTARTET' && akte.geplantesBetriebsdatum) {
    // BG-Frist = geplantes Betriebsdatum + 7 Tage
    const betriebDatum = new Date(akte.geplantesBetriebsdatum.split('.').reverse().join('-'));
    betriebDatum.setDate(betriebDatum.getDate() + BG_ANMELDEFRIST_TAGE);
    const bgFristISO = betriebDatum.toISOString().split('T')[0];
    const bgFristTage = berechneFristTage(bgFristISO, heute);
    const bgFristLabel = bgFristTage < 0
      ? `${Math.abs(bgFristTage)} Tage überschritten`
      : bgFristTage === 0
        ? 'heute fällig'
        : `noch ${bgFristTage} Tag${bgFristTage === 1 ? '' : 'e'}`;

    if (bgFristTage <= FRIST_RELEVANT_AB_TAGEN) {
      signale.push({
        id: 'UG-BG-ANMELDUNG',
        typ: 'UG_BG_ANMELDUNG_AUSSTEHEND',
        titel: `Anmeldung Berufsgenossenschaft – gesetzliche Frist ${bgFristLabel}`,
        erklaerung:
          `Nach § 192 SGB VII muss die Anmeldung bei der zuständigen Berufsgenossenschaft ` +
          `binnen einer Woche nach Betriebsaufnahme erfolgen. ` +
          `Geplanter Betriebsbeginn: ${akte.geplantesBetriebsdatum}. ` +
          `Die Anmeldefrist endet am ${bgFristISO.split('-').reverse().join('.')} (${bgFristLabel}).`,
        auswirkung:
          'Verspätete Anmeldung kann zu Bußgeldern führen und den Versicherungsschutz ' +
          'für Betriebsunfälle gefährden. Die Berufsgenossenschaft erhebt rückwirkend Beiträge.',
        naechsterSchritt:
          `Bitte melden Sie sich direkt bei der ${bgBehörde.bezeichnung} an. ` +
          `Die Anmeldung erfolgt außerhalb von Open State. ` +
          `Kontakt: ${bgBehörde.kontakt ?? 'siehe Behördenübersicht'}.`,
        bezug: `${bgBehörde.bezeichnung} · § 192 SGB VII · Betriebsdatum ${akte.geplantesBetriebsdatum}`,
        prioritaet: bgFristTage <= 3 ? 'RELEVANT' : 'HINWEIS',
      });
    }
  }

  // ─── Signal 3: Steuernummer fehlt – Rechnungsstellung eingeschränkt ────────
  // Regel: Wenn VS-05 (Steuernummer erhalten) noch nicht ABGESCHLOSSEN ist
  //        (AUSSTEHEND oder IN_BEARBEITUNG) und das geplante Betriebsdatum
  //        bereits erreicht oder überschritten ist, ist Rechnungsstellung
  //        ohne Steuernummer rechtlich unvollständig. Text je nach Status.
  const steuernummerSchritt = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
  const betriebsDatumErreicht = akte.geplantesBetriebsdatum
    ? berechneFristTage(
        akte.geplantesBetriebsdatum.split('.').reverse().join('-'),
        heute
      ) <= 0
    : false;

  const steuernummerOffen =
    steuernummerSchritt &&
    (steuernummerSchritt.status === 'AUSSTEHEND' ||
      steuernummerSchritt.status === 'IN_BEARBEITUNG');

  if (steuernummerOffen && betriebsDatumErreicht) {
    const inBearbeitung = steuernummerSchritt.status === 'IN_BEARBEITUNG';
    signale.push({
      id: 'UG-STEUERNUMMER-FEHLT',
      typ: 'UG_STEUERNUMMER_FEHLT',
      titel: inBearbeitung
        ? 'Steuernummer in Bearbeitung – noch nicht erteilt'
        : 'Steuernummer noch nicht erteilt – Rechnungsstellung eingeschränkt',
      erklaerung: inBearbeitung
        ? 'Das Finanzamt bearbeitet die Vergabe der Steuernummer. ' +
          'Die offene Rückfrage zur Kleinunternehmerregelung ist beantwortet; ' +
          'die Steuernummer liegt noch nicht vor. ' +
          'Ohne Steuernummer müssen Ausgangsrechnungen einen Hinweis auf das schwebende Verfahren enthalten.'
        : 'Das Finanzamt hat die Steuernummer noch nicht vergeben. ' +
          'Ohne Steuernummer müssen Ausgangsrechnungen einen Hinweis auf das schwebende Verfahren enthalten. ' +
          'Die Steuernummer-Vergabe ist blockiert durch die offene Rückfrage zur Kleinunternehmerregelung.',
      auswirkung:
        'Rechnungen ohne Steuernummer können bei Auftraggebern zu Rückfragen führen. ' +
        'Die Vorsteuerabzugsberechtigung beim Empfänger hängt von einer gültigen Steuernummer ab.',
      naechsterSchritt: inBearbeitung
        ? 'Keine Handlung von Ihnen erforderlich für die Steuernummer. ' +
          'Prüfen Sie den Bearbeitungsstand unter „Behörden & Schritte“. ' +
          'Parallel können Sie die BG-Anmeldung vornehmen (außerhalb von Open State).'
        : 'Beantworten Sie zuerst die Rückfrage des Finanzamts (Bereich „Rückfragen"). ' +
          'Nach Eingang der Antwort vergibt das Finanzamt die Steuernummer in der Regel binnen weniger Wochen.',
      bezug: `Verfahrensschritt VS-05 (${steuernummerSchritt.bezeichnung}) · Status: ${steuernummerSchritt.status}`,
      prioritaet: 'HINWEIS',
    });
  }

  // ─── Signal 4: Geplantes Betriebsdatum überschritten – Verfahren offen ─────
  // Regel: Wenn das geplante Betriebsdatum in der Vergangenheit liegt und
  //        der Status noch nicht GENEHMIGT oder AKTIVER_BETRIEB ist,
  //        weist das auf einen Planungsverzug hin.
  // Text: Solange eine Finanzamt-Rückfrage offen ist → zuerst beantworten.
  //        Nach Antwort: Steuernummer/BG/Unterlagen priorisieren (keine RQ-Anweisung).
  const abgeschlosseneStatus = ['GENEHMIGT', 'AKTIVER_BETRIEB', 'BETRIEB_EINGESTELLT'];
  if (akte.geplantesBetriebsdatum && !abgeschlosseneStatus.includes(akte.status)) {
    const betriebISO = akte.geplantesBetriebsdatum.split('.').reverse().join('-');
    const verzugTage = Math.abs(berechneFristTage(betriebISO, heute));
    const verzug = berechneFristTage(betriebISO, heute);
    if (verzug < 0) {
      const hatOffeneRueckfrage = akte.rueckfragen.some(r => !r.beantwortet);
      const steuernummerInBearbeitung =
        steuernummerSchritt?.status === 'IN_BEARBEITUNG';

      const erklaerung = hatOffeneRueckfrage
        ? `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
          `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
          `Hauptursache: Die steuerliche Erfassung durch das Finanzamt steht noch aus.`
        : steuernummerInBearbeitung
          ? `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
            `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
            `Die Rückfrage des Finanzamts ist beantwortet; die Steuernummer-Vergabe läuft. ` +
            `Parallel kann die BG-Anmeldung oder weitere Unterlagen ausstehen.`
          : `Das geplante Betriebsdatum (${akte.geplantesBetriebsdatum}) wurde bereits erreicht, ` +
            `das Gründungsverfahren ist jedoch noch nicht vollständig abgeschlossen. ` +
            `Offene Punkte (Steuernummer, BG-Anmeldung, Unterlagen) verzögern den vollständigen Abschluss.`;

      const naechsterSchritt = hatOffeneRueckfrage
        ? 'Offene Punkte priorisieren: zuerst Rückfrage Finanzamt beantworten, dann BG-Anmeldung vornehmen. ' +
          'Das geplante Betriebsdatum kann in der Akte angepasst werden.'
        : steuernummerInBearbeitung
          ? 'Die Steuernummer wird vom Finanzamt bearbeitet — keine Antwort-Rückfrage mehr nötig. ' +
            'Prüfen Sie parallel die BG-Anmeldung und ausstehende Unterlagen. ' +
            'Das geplante Betriebsdatum kann in der Akte angepasst werden.'
          : 'Offene Punkte priorisieren: Steuernummer und BG-Anmeldung prüfen. ' +
            'Das geplante Betriebsdatum kann in der Akte angepasst werden.';

      signale.push({
        id: 'UG-BETRIEBSDATUM',
        typ: 'UG_BETRIEBSDATUM_UEBERSCHRITTEN',
        titel: `Geplanter Betriebsstart liegt ${verzugTage} ${verzugTage === 1 ? 'Tag' : 'Tage'} zurück`,
        erklaerung,
        auswirkung:
          'Ohne abgeschlossene Steuernummer und BG-Anmeldung ist der Betrieb rechtlich nicht vollständig abgesichert. ' +
          'Das geplante Datum war eine Schätzung ohne verbindliche Wirkung.',
        naechsterSchritt,
        bezug: `geplantesBetriebsdatum: ${akte.geplantesBetriebsdatum} · Aktueller Status: ${akte.status}`,
        prioritaet: 'HINWEIS',
      });
    }
  }

  // ─── Signal 5: Mehrere Behörden parallel aktiv – Koordinationsüberblick ────
  // Regel: Wenn mehr als eine Behörde gleichzeitig aktiv ist (IN_BEARBEITUNG
  //        oder RUECKFRAGE_OFFEN), ist ein koordinierter Gesamtüberblick hilfreich.
  const aktiveBehörden = akte.beteiligteBehörden.filter(
    b => b.status === 'IN_BEARBEITUNG' || b.status === 'RUECKFRAGE_OFFEN'
  );
  if (aktiveBehörden.length > 1) {
    signale.push({
      id: 'UG-PARALLELE-BEHOERDEN',
      typ: 'UG_PARALLELE_BEHOERDEN_AKTIV',
      titel: `${aktiveBehörden.length} Behördenverfahren laufen parallel`,
      erklaerung:
        `Derzeit sind ${aktiveBehörden.length} Behörden gleichzeitig aktiv: ` +
        aktiveBehörden.map(b => b.bezeichnung).join(', ') + '. ' +
        'Parallele Verfahren sind normal im Gründungsprozess, erfordern aber Überblick über alle offenen Punkte.',
      auswirkung:
        'Versäumnisse in einem Verfahren können andere blockieren. ' +
        'Zum Beispiel: ohne Steuernummer (Finanzamt) ist die IHK-Mitgliedschaft zwar aktiv, aber Rechnungsstellung bleibt eingeschränkt.',
      naechsterSchritt:
        'Prüfen Sie alle aktiven Behördenverfahren unter „Behörden & Schritte". ' +
        'Offene Rückfragen zuerst beantworten, da diese die meisten Folgeschritte blockieren.',
      bezug: `Aktive Behörden: ${aktiveBehörden.map(b => b.id).join(', ')}`,
      prioritaet: 'INFO',
    });
  }

  return signale;
}
