/**
 * Mock: Monatsbericht Kita Sonnenwinkel (US-KJ-003)
 *
 * Fiktive Aggregate für Musterstadt. Keine Kind- oder Personennamen.
 * Eine bewusst ausgewiesene Datenlücke demonstriert AK 5.
 * Datenbasis: freigegebene Tagesstände (US-KJ-001) – explizit gelistet.
 */

import type {
  KitaMonatsbericht,
  MonatsberichtTagesstandQuelle,
} from '@/types/kitaMonatsbericht';

const FEHLENDER_TAG = '2024-10-14';

/**
 * Betriebstage Okt 2024 (Mo–Fr) mit fiktiven Aggregaten.
 * 2024-10-14 fehlt bewusst (Lücke). Schlüssel-Unterschreitung an 4 freigegebenen Tagen
 * (passt zu gesamt.tagePersonalschluesselUnterschritten = 4).
 */
function buildOktober2024Quellen(): MonatsberichtTagesstandQuelle[] {
  const unterschrittenTage = new Set([
    '2024-10-07', // Nestgruppe A
    '2024-10-16', // Elementar Sonne
    '2024-10-22', // Elementar Sonne
    '2024-10-29', // Elementar Sonne
  ]);

  const quellen: MonatsberichtTagesstandQuelle[] = [];
  // Deterministische Pseudo-Variation ohne Zufall
  const anwesendBasis = [
    52, 54, 51, 55, 53, 50, 56, 54, 52, 55, 53, 51, 54, 52, 50, 55, 53, 56, 54, 52, 51, 53,
  ];
  const personalBasis = [
    58, 60, 57, 61, 59, 56, 62, 60, 58, 61, 59, 57, 60, 58, 56, 61, 59, 62, 60, 58, 57, 59,
  ];

  let freigegebenIdx = 0;
  for (let day = 1; day <= 31; day++) {
    const iso = `2024-10-${String(day).padStart(2, '0')}`;
    const d = new Date(`${iso}T12:00:00`);
    const weekday = d.getDay(); // 0 So … 6 Sa
    if (weekday === 0 || weekday === 6) continue;

    const label = d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (iso === FEHLENDER_TAG) {
      quellen.push({
        tagesstandId: null,
        datumIso: iso,
        datumLabel: label,
        status: 'FEHLT',
        anwesendGesamt: null,
        personalIstStundenGesamt: null,
        personalschluesselUnterschritten: null,
        freigegebenAm: null,
        freigegebenDurchRolle: null,
      });
      continue;
    }

    const anwesend = anwesendBasis[freigegebenIdx] ?? 52;
    const personal = personalBasis[freigegebenIdx] ?? 58;
    freigegebenIdx += 1;

    quellen.push({
      tagesstandId: `TS-EINR-DEMO-01-${iso}`,
      datumIso: iso,
      datumLabel: label,
      status: 'FREIGEGEBEN',
      anwesendGesamt: anwesend,
      personalIstStundenGesamt: personal,
      personalschluesselUnterschritten: unterschrittenTage.has(iso),
      freigegebenAm: `${label}, 16:15`,
      freigegebenDurchRolle: 'Kita-Leitung (Demo)',
    });
  }

  return quellen;
}

const tagesstandQuellen = buildOktober2024Quellen();

export const demoKitaMonatsbericht: KitaMonatsbericht = {
  id: 'MB-EINR-DEMO-01-2024-10',
  einrichtungId: 'EINR-DEMO-01',
  einrichtungBezeichnung: 'Kita Sonnenwinkel',
  traeger: 'Freier Träger „Gemeinsam wachsen e. V.“ (fiktiv)',
  planungsraumBezeichnung: 'Südost',
  monatsLabel: 'Oktober 2024',
  monatsIso: '2024-10',
  vorjahresLabel: 'Oktober 2023',
  standLabel: 'Monatsabschluss (Demo)',
  status: 'LUECKENHAFT',
  betriebstageImMonat: 23,
  erfassteTagesstaende: 22,
  fehlendeTage: [FEHLENDER_TAG],
  tagesstandQuellen,
  gruppen: [
    {
      gruppeId: 'GR-01',
      bezeichnung: 'Nestgruppe A (U3)',
      altersgruppe: 'U3',
      anwesenheitsquoteProzent: 88.4,
      anwesenheitsquoteVorjahrProzent: 86.1,
      auslastungsgradProzent: 97.2,
      auslastungsgradVorjahrProzent: 94.5,
      personalAusfallquoteProzent: 6.2,
      personalAusfallquoteVorjahrProzent: 5.8,
      tagePersonalschluesselUnterschritten: 1,
      tagePersonalschluesselUnterschrittenVorjahr: 2,
    },
    {
      gruppeId: 'GR-02',
      bezeichnung: 'Nestgruppe B (U3)',
      altersgruppe: 'U3',
      anwesenheitsquoteProzent: 91.0,
      anwesenheitsquoteVorjahrProzent: 89.3,
      auslastungsgradProzent: 85.0,
      auslastungsgradVorjahrProzent: 88.2,
      personalAusfallquoteProzent: 4.1,
      personalAusfallquoteVorjahrProzent: 7.0,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 1,
    },
    {
      gruppeId: 'GR-03',
      bezeichnung: 'Elementargruppe Sonne',
      altersgruppe: 'UE3',
      anwesenheitsquoteProzent: 93.5,
      anwesenheitsquoteVorjahrProzent: 92.0,
      auslastungsgradProzent: 100.0,
      auslastungsgradVorjahrProzent: 98.1,
      personalAusfallquoteProzent: 8.5,
      personalAusfallquoteVorjahrProzent: 6.4,
      tagePersonalschluesselUnterschritten: 3,
      tagePersonalschluesselUnterschrittenVorjahr: 1,
    },
    {
      gruppeId: 'GR-04',
      bezeichnung: 'Elementargruppe Mond',
      altersgruppe: 'UE3',
      anwesenheitsquoteProzent: 90.2,
      anwesenheitsquoteVorjahrProzent: 91.5,
      auslastungsgradProzent: 90.0,
      auslastungsgradVorjahrProzent: 95.0,
      personalAusfallquoteProzent: 5.0,
      personalAusfallquoteVorjahrProzent: 4.2,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 0,
    },
    {
      gruppeId: 'GR-05',
      bezeichnung: 'Elementargruppe Sterne',
      altersgruppe: 'UE3',
      // Gruppe zeitweise geschlossen – Anwesenheit/Auslastung 0, Ausfall hoch ausgewiesen
      anwesenheitsquoteProzent: 0,
      anwesenheitsquoteVorjahrProzent: 89.0,
      auslastungsgradProzent: 0,
      auslastungsgradVorjahrProzent: 96.5,
      personalAusfallquoteProzent: 12.0,
      personalAusfallquoteVorjahrProzent: 5.5,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 2,
    },
  ],
  gesamt: {
    anwesenheitsquoteProzent: 86.6,
    anwesenheitsquoteVorjahrProzent: 89.6,
    auslastungsgradProzent: 86.4,
    auslastungsgradVorjahrProzent: 94.5,
    personalAusfallquoteProzent: 7.2,
    personalAusfallquoteVorjahrProzent: 5.8,
    tagePersonalschluesselUnterschritten: 4,
    tagePersonalschluesselUnterschrittenVorjahr: 6,
  },
  methodik: {
    anwesenheitDefinition:
      'Anwesenheitsquote = Summe Anwesenheitstage (aggregiert) ÷ (Belegungstage × Betriebstage mit erfasstem Tagesstand). Krank / Urlaub / sonstiges fließen als Nicht-Anwesenheit ein – ohne Kindnamen.',
    auslastungDefinition:
      'Auslastungsgrad = belegte Plätze (Monatsmittel) ÷ real nutzbare Plätze der Gruppe. Temporär geschlossene Gruppen: 0 %.',
    personalAusfallDefinition:
      'Personalausfallquote = Ausfallstunden ÷ geplante Stunden je Gruppe (Rollen/Stunden, keine Personennamen im Hauptsystem).',
    personalschluesselDefinition:
      'Tag zählt als Unterschreitung, wenn das Verhältnis anwesende Fachkraft-Stunden zu anwesenden Kindern den landesrechtlichen Mindestschlüssel unterschreitet. Keine automatische Meldung an das Jugendamt (US-KJ-004).',
    datenquelle:
      'Nur freigegebene Tagesstände der Einrichtung (US-KJ-001). Jeder Betriebstag der Datenbasis ist unten ausgewiesen. Fehlende Tage werden als Lücke markiert und nicht interpoliert. Nicht freigegebene Entwürfe fließen nicht ein.',
  },
};

/**
 * Laufender Monat (Demo-Stichtag 12.11.2024): Status VORSCHAU.
 * Gemischte Quellen: FREIGEGEBEN, FEHLT (vergangener Tag ohne Freigabe),
 * IN_ERFASSUNG (Entwurf – fließt nicht in Kennzahlen ein).
 * Nur Aggregate, keine Kind- oder Personennamen.
 */
function buildNovember2024VorschauQuellen(): MonatsberichtTagesstandQuelle[] {
  /** Betriebstage bis Demo-Stichtag inkl. (Mo–Fr) */
  const tage: Array<{
    iso: string;
    status: MonatsberichtTagesstandQuelle['status'];
    anwesend?: number;
    personal?: number;
    schluessel?: boolean;
  }> = [
    { iso: '2024-11-01', status: 'FREIGEGEBEN', anwesend: 53, personal: 59, schluessel: false },
    { iso: '2024-11-04', status: 'FREIGEGEBEN', anwesend: 55, personal: 61, schluessel: false },
    { iso: '2024-11-05', status: 'FREIGEGEBEN', anwesend: 52, personal: 57, schluessel: true },
    { iso: '2024-11-06', status: 'FREIGEGEBEN', anwesend: 54, personal: 60, schluessel: false },
    { iso: '2024-11-07', status: 'FEHLT' },
    { iso: '2024-11-08', status: 'FREIGEGEBEN', anwesend: 51, personal: 56, schluessel: false },
    { iso: '2024-11-11', status: 'FREIGEGEBEN', anwesend: 56, personal: 62, schluessel: false },
    { iso: '2024-11-12', status: 'IN_ERFASSUNG' },
  ];

  return tage.map(t => {
    const d = new Date(`${t.iso}T12:00:00`);
    const label = d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (t.status === 'FREIGEGEBEN') {
      return {
        tagesstandId: `TS-EINR-DEMO-01-${t.iso}`,
        datumIso: t.iso,
        datumLabel: label,
        status: 'FREIGEGEBEN' as const,
        anwesendGesamt: t.anwesend ?? null,
        personalIstStundenGesamt: t.personal ?? null,
        personalschluesselUnterschritten: t.schluessel ?? false,
        freigegebenAm: `${label}, 16:15`,
        freigegebenDurchRolle: 'Kita-Leitung (Demo)',
      };
    }

    if (t.status === 'IN_ERFASSUNG') {
      return {
        tagesstandId: `TS-EINR-DEMO-01-${t.iso}-ENTWURF`,
        datumIso: t.iso,
        datumLabel: label,
        status: 'IN_ERFASSUNG' as const,
        anwesendGesamt: null,
        personalIstStundenGesamt: null,
        personalschluesselUnterschritten: null,
        freigegebenAm: null,
        freigegebenDurchRolle: null,
      };
    }

    return {
      tagesstandId: null,
      datumIso: t.iso,
      datumLabel: label,
      status: 'FEHLT' as const,
      anwesendGesamt: null,
      personalIstStundenGesamt: null,
      personalschluesselUnterschritten: null,
      freigegebenAm: null,
      freigegebenDurchRolle: null,
    };
  });
}

const vorschauQuellen = buildNovember2024VorschauQuellen();

/** Monatsbericht-Vorschau laufender Monat mit gemischten Tagesstand-Quellen (US-KJ-003) */
export const demoKitaMonatsberichtVorschau: KitaMonatsbericht = {
  id: 'MB-EINR-DEMO-01-2024-11-VORSCHAU',
  einrichtungId: 'EINR-DEMO-01',
  einrichtungBezeichnung: 'Kita Sonnenwinkel',
  traeger: 'Freier Träger „Gemeinsam wachsen e. V.“ (fiktiv)',
  planungsraumBezeichnung: 'Südost',
  monatsLabel: 'November 2024',
  monatsIso: '2024-11',
  vorjahresLabel: 'November 2023',
  standLabel: 'Vorschau bis 12.11.2024 (Demo-Stichtag)',
  status: 'VORSCHAU',
  /** Bis Stichtag: 8 Betriebstage (noch kein Monatsabschluss) */
  betriebstageImMonat: 8,
  erfassteTagesstaende: 6,
  fehlendeTage: ['2024-11-07'],
  tagesstandQuellen: vorschauQuellen,
  gruppen: [
    {
      gruppeId: 'GR-01',
      bezeichnung: 'Nestgruppe A (U3)',
      altersgruppe: 'U3',
      anwesenheitsquoteProzent: 89.1,
      anwesenheitsquoteVorjahrProzent: 87.0,
      auslastungsgradProzent: 96.5,
      auslastungsgradVorjahrProzent: 95.0,
      personalAusfallquoteProzent: 5.8,
      personalAusfallquoteVorjahrProzent: 6.1,
      tagePersonalschluesselUnterschritten: 1,
      tagePersonalschluesselUnterschrittenVorjahr: 1,
    },
    {
      gruppeId: 'GR-02',
      bezeichnung: 'Nestgruppe B (U3)',
      altersgruppe: 'U3',
      anwesenheitsquoteProzent: 90.4,
      anwesenheitsquoteVorjahrProzent: 88.5,
      auslastungsgradProzent: 84.0,
      auslastungsgradVorjahrProzent: 86.0,
      personalAusfallquoteProzent: 3.9,
      personalAusfallquoteVorjahrProzent: 5.2,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 0,
    },
    {
      gruppeId: 'GR-03',
      bezeichnung: 'Elementargruppe Sonne',
      altersgruppe: 'UE3',
      anwesenheitsquoteProzent: 92.8,
      anwesenheitsquoteVorjahrProzent: 91.2,
      auslastungsgradProzent: 99.0,
      auslastungsgradVorjahrProzent: 97.5,
      personalAusfallquoteProzent: 7.1,
      personalAusfallquoteVorjahrProzent: 6.8,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 2,
    },
    {
      gruppeId: 'GR-04',
      bezeichnung: 'Elementargruppe Mond',
      altersgruppe: 'UE3',
      anwesenheitsquoteProzent: 91.0,
      anwesenheitsquoteVorjahrProzent: 90.0,
      auslastungsgradProzent: 91.5,
      auslastungsgradVorjahrProzent: 93.0,
      personalAusfallquoteProzent: 4.5,
      personalAusfallquoteVorjahrProzent: 4.0,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 0,
    },
    {
      gruppeId: 'GR-05',
      bezeichnung: 'Elementargruppe Sterne',
      altersgruppe: 'UE3',
      anwesenheitsquoteProzent: 0,
      anwesenheitsquoteVorjahrProzent: 88.0,
      auslastungsgradProzent: 0,
      auslastungsgradVorjahrProzent: 94.0,
      personalAusfallquoteProzent: 11.0,
      personalAusfallquoteVorjahrProzent: 5.0,
      tagePersonalschluesselUnterschritten: 0,
      tagePersonalschluesselUnterschrittenVorjahr: 1,
    },
  ],
  gesamt: {
    anwesenheitsquoteProzent: 87.2,
    anwesenheitsquoteVorjahrProzent: 88.1,
    auslastungsgradProzent: 85.8,
    auslastungsgradVorjahrProzent: 91.0,
    personalAusfallquoteProzent: 6.5,
    personalAusfallquoteVorjahrProzent: 5.9,
    tagePersonalschluesselUnterschritten: 1,
    tagePersonalschluesselUnterschrittenVorjahr: 4,
  },
  methodik: {
    anwesenheitDefinition:
      'Anwesenheitsquote = Summe Anwesenheitstage (aggregiert) ÷ (Belegungstage × Betriebstage mit freigegebenem Tagesstand). Nur freigegebene Tage; Entwürfe (IN_ERFASSUNG) zählen nicht.',
    auslastungDefinition:
      'Auslastungsgrad = belegte Plätze (Mittel über freigegebene Tage) ÷ real nutzbare Plätze. Vorschau: Teilmonat bis Stichtag.',
    personalAusfallDefinition:
      'Personalausfallquote = Ausfallstunden ÷ geplante Stunden je Gruppe – nur freigegebene Tagesstände.',
    personalschluesselDefinition:
      'Tag zählt als Unterschreitung nur bei freigegebenem Stand. Keine automatische Meldung an das Jugendamt (US-KJ-004).',
    datenquelle:
      'Vorschau laufender Monat: Kennzahlen nur aus freigegebenen Tagesständen bis Stichtag. Status je Betriebstag: FREIGEGEBEN (einbezogen), FEHLT (Lücke, nicht interpoliert), IN_ERFASSUNG (Entwurf, nicht einbezogen). Noch ausstehende Betriebstage des Monats erscheinen erst nach dem jeweiligen Tag.',
  },
};
