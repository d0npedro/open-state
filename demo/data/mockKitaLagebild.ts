/**
 * Mock-Daten: Kita-Lagebild Musterstadt (öffentliche Transparenzschicht)
 *
 * Fiktive Gemeinde „Musterstadt" — realistische Struktur, keine echten Daten.
 * Datenstand: Oktober 2024 (konsistent mit dem Demo-Fall aus mockFall.ts)
 *
 * Zeigt bewusst:
 *  - einen Planungsraum mit kritischer Versorgungslücke (Südost)
 *  - saisonalen Anstieg der Warteliste im Frühjahr
 *  - laufende Kapazitätserweiterungen
 *  - vollständige Methodik-Dokumentation
 */

import type {
  KitaLagebild,
  PlanungsraumKennzahlen,
  MonatsKennzahl,
  Kapazitaetsmassnahme,
  MethodikHinweis,
} from '@/types/kita';

// ─── Planungsräume ───────────────────────────────────────────────────────────

const planungsraeume: PlanungsraumKennzahlen[] = [
  {
    id: 'PR-01',
    bezeichnung: 'Innenstadt',
    einwohnerKinderU3: 450,
    einwohnerKinderUe3: 820,
    genehmmigtePlaetzeU3: 195,
    genehmmigtePlaetzeUe3: 700,
    realNutzbarePlaetzeU3: 180,
    realNutzbarePlaetzeUe3: 690,
    belegtePlaetzeU3: 176,
    belegtePlaetzeUe3: 672,
    freiePlaetzeU3: 4,
    freiePlaetzeUe3: 18,
    versorgungsquote: { u3: 39.1, ue3: 82.0 },
    auslastungsgradProzent: 96.7,
    wartelisteBestand: 84,
    wartelisteDruckFaktor: 21.0,
    personalAusfallquoteProzent: 8.4,
    inklusionsplaetzeGenehmigt: 18,
    inklusionsplaetzeBelegt: 16,
  },
  {
    id: 'PR-02',
    bezeichnung: 'Nordwest',
    einwohnerKinderU3: 380,
    einwohnerKinderUe3: 720,
    genehmmigtePlaetzeU3: 185,
    genehmmigtePlaetzeUe3: 645,
    realNutzbarePlaetzeU3: 185,
    realNutzbarePlaetzeUe3: 645,
    belegtePlaetzeU3: 174,
    belegtePlaetzeUe3: 618,
    freiePlaetzeU3: 11,
    freiePlaetzeUe3: 27,
    versorgungsquote: { u3: 45.8, ue3: 85.8 },
    auslastungsgradProzent: 94.1,
    wartelisteBestand: 47,
    wartelisteDruckFaktor: 4.3,
    personalAusfallquoteProzent: 6.1,
    inklusionsplaetzeGenehmigt: 22,
    inklusionsplaetzeBelegt: 19,
  },
  {
    id: 'PR-03',
    bezeichnung: 'Südost',
    einwohnerKinderU3: 520,
    einwohnerKinderUe3: 940,
    genehmmigtePlaetzeU3: 190,
    genehmmigtePlaetzeUe3: 740,
    realNutzbarePlaetzeU3: 175,
    realNutzbarePlaetzeUe3: 720,
    belegtePlaetzeU3: 173,
    belegtePlaetzeUe3: 715,
    freiePlaetzeU3: 2,
    freiePlaetzeUe3: 5,
    versorgungsquote: { u3: 33.3, ue3: 76.1 },
    auslastungsgradProzent: 98.7,
    wartelisteBestand: 138,
    wartelisteDruckFaktor: 27.6,
    personalAusfallquoteProzent: 11.2,
    inklusionsplaetzeGenehmigt: 14,
    inklusionsplaetzeBelegt: 14,
  },
  {
    id: 'PR-04',
    bezeichnung: 'Westpark',
    einwohnerKinderU3: 290,
    einwohnerKinderUe3: 560,
    genehmmigtePlaetzeU3: 160,
    genehmmigtePlaetzeUe3: 510,
    realNutzbarePlaetzeU3: 160,
    realNutzbarePlaetzeUe3: 510,
    belegtePlaetzeU3: 152,
    belegtePlaetzeUe3: 490,
    freiePlaetzeU3: 8,
    freiePlaetzeUe3: 20,
    versorgungsquote: { u3: 52.4, ue3: 87.5 },
    auslastungsgradProzent: 95.5,
    wartelisteBestand: 29,
    wartelisteDruckFaktor: 3.6,
    personalAusfallquoteProzent: 5.8,
    inklusionsplaetzeGenehmigt: 20,
    inklusionsplaetzeBelegt: 17,
  },
  {
    id: 'PR-05',
    bezeichnung: 'Hafenviertel',
    einwohnerKinderU3: 310,
    einwohnerKinderUe3: 560,
    genehmmigtePlaetzeU3: 115,
    genehmmigtePlaetzeUe3: 445,
    realNutzbarePlaetzeU3: 105,
    realNutzbarePlaetzeUe3: 435,
    belegtePlaetzeU3: 104,
    belegtePlaetzeUe3: 430,
    freiePlaetzeU3: 1,
    freiePlaetzeUe3: 5,
    versorgungsquote: { u3: 33.5, ue3: 76.8 },
    auslastungsgradProzent: 99.1,
    wartelisteBestand: 96,
    wartelisteDruckFaktor: 96.0,
    personalAusfallquoteProzent: 9.7,
    inklusionsplaetzeGenehmigt: 10,
    inklusionsplaetzeBelegt: 10,
  },
];

// ─── Zeitreihe (Nov 2023 – Okt 2024) ────────────────────────────────────────

/**
 * Demo-Näherung: verteilt die kommunale Monatsreihe auf Planungsräume
 * nach Strukturanteilen am aktuellen Berichtsstand (US-KJ-010 AK 2).
 * Absolute Platzzahlen skalieren mit der Kommunalreihe; Auslastung/Personal
 * folgen parallel zur kommunalen Monatsbewegung mit Raum-Niveau am Endmonat.
 * Keine Einrichtungsindividualdaten, keine Kind-/Personennamen.
 */
function buildZeitreihePlanungsraeume(
  raeume: PlanungsraumKennzahlen[],
  kommunal: MonatsKennzahl[]
): Record<string, MonatsKennzahl[]> {
  const sumBelegt = raeume.reduce(
    (s, p) => s + p.belegtePlaetzeU3 + p.belegtePlaetzeUe3,
    0
  );
  const sumFrei = raeume.reduce(
    (s, p) => s + p.freiePlaetzeU3 + p.freiePlaetzeUe3,
    0
  );
  const sumWarte = raeume.reduce((s, p) => s + p.wartelisteBestand, 0);
  const sumGenehmigt = raeume.reduce(
    (s, p) => s + p.genehmmigtePlaetzeU3 + p.genehmmigtePlaetzeUe3,
    0
  );
  const sumReal = raeume.reduce(
    (s, p) => s + p.realNutzbarePlaetzeU3 + p.realNutzbarePlaetzeUe3,
    0
  );

  const last = kommunal[kommunal.length - 1];
  const result: Record<string, MonatsKennzahl[]> = {};

  for (const pr of raeume) {
    const belegtShare =
      sumBelegt > 0
        ? (pr.belegtePlaetzeU3 + pr.belegtePlaetzeUe3) / sumBelegt
        : 0;
    const freiShare =
      sumFrei > 0
        ? (pr.freiePlaetzeU3 + pr.freiePlaetzeUe3) / sumFrei
        : 0;
    const warteShare =
      sumWarte > 0 ? pr.wartelisteBestand / sumWarte : 0;
    const genehmigtShare =
      sumGenehmigt > 0
        ? (pr.genehmmigtePlaetzeU3 + pr.genehmmigtePlaetzeUe3) / sumGenehmigt
        : 0;
    const realShare =
      sumReal > 0
        ? (pr.realNutzbarePlaetzeU3 + pr.realNutzbarePlaetzeUe3) / sumReal
        : 0;

    const series: MonatsKennzahl[] = kommunal.map(m => {
      const auslastDelta = last
        ? m.auslastungsgradProzent - last.auslastungsgradProzent
        : 0;
      const personalDelta = last
        ? m.personalAusfallquoteProzent - last.personalAusfallquoteProzent
        : 0;
      const auslast = Math.min(
        100,
        Math.max(
          0,
          Math.round((pr.auslastungsgradProzent + auslastDelta) * 10) / 10
        )
      );
      const personal = Math.min(
        100,
        Math.max(
          0,
          Math.round((pr.personalAusfallquoteProzent + personalDelta) * 10) / 10
        )
      );

      return {
        monat: m.monat,
        monatLabel: m.monatLabel,
        genehmmigtePlaetze: Math.round(m.genehmmigtePlaetze * genehmigtShare),
        realNutzbarePlaetze: Math.round(m.realNutzbarePlaetze * realShare),
        belegtePlaetze: Math.round(m.belegtePlaetze * belegtShare),
        freiePlaetze: Math.max(0, Math.round(m.freiePlaetze * freiShare)),
        auslastungsgradProzent: auslast,
        wartelisteBestand: Math.round(m.wartelisteBestand * warteShare),
        personalAusfallquoteProzent: personal,
        wartelisteDeltaVormonat: null,
      };
    });

    // Endmonat: Warteliste/Auslastung/Personal exakt am Raum-Snapshot;
    // Platzzahlen bleiben anteilig an der Kommunalreihe (Trendkohärenz).
    const end = series.length - 1;
    if (end >= 0) {
      series[end] = {
        ...series[end],
        auslastungsgradProzent: pr.auslastungsgradProzent,
        wartelisteBestand: pr.wartelisteBestand,
        personalAusfallquoteProzent: pr.personalAusfallquoteProzent,
        freiePlaetze: pr.freiePlaetzeU3 + pr.freiePlaetzeUe3,
      };
    }

    for (let i = 0; i < series.length; i++) {
      series[i].wartelisteDeltaVormonat =
        i === 0
          ? null
          : series[i].wartelisteBestand - series[i - 1].wartelisteBestand;
    }

    result[pr.id] = series;
  }

  return result;
}

const zeitreihe: MonatsKennzahl[] = [
  {
    monat: '2023-11', monatLabel: 'November 2023',
    genehmmigtePlaetze: 1820, realNutzbarePlaetze: 1780, belegtePlaetze: 1680,
    freiePlaetze: 100, auslastungsgradProzent: 94.4, wartelisteBestand: 302,
    personalAusfallquoteProzent: 7.1, wartelisteDeltaVormonat: null,
  },
  {
    monat: '2023-12', monatLabel: 'Dezember 2023',
    genehmmigtePlaetze: 1820, realNutzbarePlaetze: 1780, belegtePlaetze: 1650,
    freiePlaetze: 130, auslastungsgradProzent: 92.7, wartelisteBestand: 287,
    personalAusfallquoteProzent: 9.8, wartelisteDeltaVormonat: -15,
  },
  {
    monat: '2024-01', monatLabel: 'Januar 2024',
    genehmmigtePlaetze: 1820, realNutzbarePlaetze: 1775, belegtePlaetze: 1660,
    freiePlaetze: 115, auslastungsgradProzent: 93.5, wartelisteBestand: 298,
    personalAusfallquoteProzent: 10.2, wartelisteDeltaVormonat: +11,
  },
  {
    monat: '2024-02', monatLabel: 'Februar 2024',
    genehmmigtePlaetze: 1820, realNutzbarePlaetze: 1775, belegtePlaetze: 1665,
    freiePlaetze: 110, auslastungsgradProzent: 93.8, wartelisteBestand: 334,
    personalAusfallquoteProzent: 9.5, wartelisteDeltaVormonat: +36,
  },
  {
    monat: '2024-03', monatLabel: 'März 2024',
    genehmmigtePlaetze: 1820, realNutzbarePlaetze: 1775, belegtePlaetze: 1672,
    freiePlaetze: 103, auslastungsgradProzent: 94.2, wartelisteBestand: 391,
    personalAusfallquoteProzent: 8.7, wartelisteDeltaVormonat: +57,
  },
  {
    monat: '2024-04', monatLabel: 'April 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1800, belegtePlaetze: 1690,
    freiePlaetze: 110, auslastungsgradProzent: 93.9, wartelisteBestand: 418,
    personalAusfallquoteProzent: 7.9, wartelisteDeltaVormonat: +27,
  },
  {
    monat: '2024-05', monatLabel: 'Mai 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1800, belegtePlaetze: 1695,
    freiePlaetze: 105, auslastungsgradProzent: 94.2, wartelisteBestand: 441,
    personalAusfallquoteProzent: 7.2, wartelisteDeltaVormonat: +23,
  },
  {
    monat: '2024-06', monatLabel: 'Juni 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1800, belegtePlaetze: 1700,
    freiePlaetze: 100, auslastungsgradProzent: 94.4, wartelisteBestand: 453,
    personalAusfallquoteProzent: 7.8, wartelisteDeltaVormonat: +12,
  },
  {
    monat: '2024-07', monatLabel: 'Juli 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1790, belegtePlaetze: 1650,
    freiePlaetze: 140, auslastungsgradProzent: 92.2, wartelisteBestand: 408,
    personalAusfallquoteProzent: 8.9, wartelisteDeltaVormonat: -45,
  },
  {
    monat: '2024-08', monatLabel: 'August 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1790, belegtePlaetze: 1655,
    freiePlaetze: 135, auslastungsgradProzent: 92.5, wartelisteBestand: 374,
    personalAusfallquoteProzent: 8.3, wartelisteDeltaVormonat: -34,
  },
  {
    monat: '2024-09', monatLabel: 'September 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1800, belegtePlaetze: 1710,
    freiePlaetze: 90, auslastungsgradProzent: 95.0, wartelisteBestand: 362,
    personalAusfallquoteProzent: 7.5, wartelisteDeltaVormonat: -12,
  },
  {
    monat: '2024-10', monatLabel: 'Oktober 2024',
    genehmmigtePlaetze: 1845, realNutzbarePlaetze: 1805, belegtePlaetze: 1779,
    freiePlaetze: 26, auslastungsgradProzent: 98.6, wartelisteBestand: 394,
    personalAusfallquoteProzent: 8.2, wartelisteDeltaVormonat: +32,
  },
];

// ─── Kapazitätsmaßnahmen ─────────────────────────────────────────────────────

const massnahmen: Kapazitaetsmassnahme[] = [
  {
    id: 'MA-001',
    planungsraumId: 'PR-03',
    planungsraumBezeichnung: 'Südost',
    bezeichnung: 'Neubau Kita „Am Stadtpark"',
    typ: 'NEUBAU',
    status: 'IM_BAU',
    erwarteteNeuePlaetze: 75,
    geplanteFertigstellung: '2025-08',
    rechtsgrundlage: '§ 79 SGB VIII – Gesamtverantwortung des Trägers der öffentlichen Jugendhilfe',
  },
  {
    id: 'MA-002',
    planungsraumId: 'PR-05',
    planungsraumBezeichnung: 'Hafenviertel',
    bezeichnung: 'Erweiterung Kita „Hafenkinder"',
    typ: 'ERWEITERUNG',
    status: 'GENEHMIGT',
    erwarteteNeuePlaetze: 40,
    geplanteFertigstellung: '2025-04',
    rechtsgrundlage: '§ 45 SGB VIII – Erlaubnis für den Betrieb einer Einrichtung',
  },
  {
    id: 'MA-003',
    planungsraumId: 'PR-01',
    planungsraumBezeichnung: 'Innenstadt',
    bezeichnung: 'Umbau und Sanierung Kita „Stadtmitte"',
    typ: 'UMBAU',
    status: 'IM_BAU',
    erwarteteNeuePlaetze: 15,
    geplanteFertigstellung: '2025-02',
    rechtsgrundlage: '§ 45 SGB VIII – Erlaubnis für den Betrieb einer Einrichtung',
  },
  {
    id: 'MA-004',
    planungsraumId: 'PR-03',
    planungsraumBezeichnung: 'Südost',
    bezeichnung: 'Neubau Kita „Südring"',
    typ: 'NEUBAU',
    status: 'IN_PLANUNG',
    erwarteteNeuePlaetze: 90,
    geplanteFertigstellung: '2026-09',
    rechtsgrundlage: '§ 79 SGB VIII – Gesamtverantwortung des Trägers der öffentlichen Jugendhilfe',
  },
  {
    id: 'MA-005',
    planungsraumId: 'PR-05',
    planungsraumBezeichnung: 'Hafenviertel',
    bezeichnung: 'Neubau Kita „Hafenblick"',
    typ: 'NEUBAU',
    status: 'IN_PLANUNG',
    erwarteteNeuePlaetze: 60,
    geplanteFertigstellung: '2026-03',
    rechtsgrundlage: '§ 79 SGB VIII – Gesamtverantwortung des Trägers der öffentlichen Jugendhilfe',
  },
];

// ─── Methodik ────────────────────────────────────────────────────────────────

const methodik: MethodikHinweis[] = [
  {
    kennzahl: 'Versorgungsquote',
    definition: 'Anteil der Kinder einer Altersgruppe in einer Region, für die ein Betreuungsplatz belegt ist.',
    berechnungsformel: 'Belegte Plätze (Altersgruppe, Region) / Kinder der Altersgruppe (Region) × 100',
    datenquelle: 'Einrichtungsmeldungen (monatlich) + Einwohnermeldestatistik (jährlich, amtlich)',
    einschraenkungen: 'Einwohnerdaten haben Stichtagbezug (31.12. Vorjahr). Unterjährige Veränderungen werden nicht abgebildet.',
  },
  {
    kennzahl: 'Auslastungsgrad',
    definition: 'Anteil der tatsächlich belegten Plätze an den real nutzbaren Plätzen.',
    berechnungsformel: 'Belegte Plätze / Real nutzbare Plätze × 100',
    datenquelle: 'Einrichtungsmeldungen (monatlich)',
    einschraenkungen: '„Real nutzbar" < „genehmigt", wenn Gruppen temporär geschlossen oder im Umbau.',
  },
  {
    kennzahl: 'Wartelistendruck',
    definition: 'Verhältnis offener Wartelistenanfragen zu real freien Plätzen. Wert > 1 bedeutet mehr Anfragen als freie Plätze (Engpass).',
    berechnungsformel: 'Offene Wartelistenanfragen (Region) / Real freie Plätze (Region)',
    datenquelle: 'Wartelistenmeldungen der Einrichtungen (monatlich)',
    einschraenkungen: 'Mehrfachanmeldungen werden nicht dedupliziert. Tatsächlicher Bedarf kann geringer sein.',
  },
  {
    kennzahl: 'Personalausfallquote',
    definition: 'Anteil ausgefallener Personalstunden an geplanten Stunden im Berichtszeitraum.',
    berechnungsformel: 'Ausgefallene Personalstunden / Geplante Personalstunden × 100',
    datenquelle: 'Tageserfassungen der Einrichtungen (freigegeben)',
    einschraenkungen: 'Nur kommunaler Durchschnitt. Keine einrichtungsbezogene Darstellung aus Datenschutzgründen.',
  },
  {
    kennzahl: 'Freie Plätze',
    definition: 'Real nutzbare Plätze minus belegte Plätze zum Stichtag des Berichts.',
    berechnungsformel: 'Real nutzbare Plätze − Belegte Plätze',
    datenquelle: 'Einrichtungsmeldungen (monatlich)',
    einschraenkungen: 'Bezieht sich auf den letzten Meldestichtag, nicht auf den heutigen Tag.',
  },
];

// ─── Gesamtes Lagebild ────────────────────────────────────────────────────────

export const demoKitaLagebild: KitaLagebild = {
  stand: '2024-10-31',
  berichtszeitraum: 'Oktober 2024',
  version: '2024-10-v1',
  freigegebenAm: '2024-11-08',
  freigegebenVon: 'Sachgebietsleitung Planung und Berichtswesen',
  kommuneBezeichnung: 'Musterstadt',

  gesamt: {
    genehmmigtePlaetze: 1845,
    realNutzbarePlaetze: 1805,
    belegtePlaetze: 1779,
    freiePlaetze: 26,
    auslastungsgradProzent: 98.6,
    wartelisteBestand: 394,
    personalAusfallquoteProzent: 8.2,
    versorgungsquote: { u3: 40.6, ue3: 81.5 },
    inklusionsplaetzeGenehmigt: 84,
    inklusionsplaetzeBelegt: 76,
  },

  planungsraeume,
  zeitreihe,
  zeitreihePlanungsraeume: buildZeitreihePlanungsraeume(planungsraeume, zeitreihe),
  massnahmen,
  methodik,
};
