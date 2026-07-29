/**
 * Mock: Monatsbericht Kita Sonnenwinkel (US-KJ-003)
 *
 * Fiktive Aggregate für Musterstadt. Keine Kind- oder Personennamen.
 * Eine bewusst ausgewiesene Datenlücke demonstriert AK 5.
 */

import type { KitaMonatsbericht } from '@/types/kitaMonatsbericht';

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
  fehlendeTage: ['2024-10-14'],
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
      'Freigegebene Tagesstände der Einrichtung (US-KJ-001). Fehlende Tage werden als Lücke ausgewiesen und nicht interpoliert.',
  },
};
