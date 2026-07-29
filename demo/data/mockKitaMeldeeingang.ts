/**
 * Mock: Meldeeingang Oktober 2024 → Steuerungslagebild (US-KJ-004 → US-KJ-005)
 *
 * Fiktive Stichprobe Musterstadt. Kita Sonnenwinkel entspricht US-KJ-004-Demo
 * (zunächst überfällig / ausstehend). Nur Aggregate, keine Kind- oder Personennamen.
 */

import type { KitaMeldeeingang } from '@/types/kitaMeldeeingang';
import { demoKitaMonatsmeldung } from '@/data/mockKitaMeldung';

const sonnenwinkel = demoKitaMonatsmeldung;

export const demoKitaMeldeeingang: KitaMeldeeingang = {
  monatsIso: '2024-10',
  monatsLabel: 'Oktober 2024',
  fiktivesHeute: sonnenwinkel.fiktivesHeute,
  standLabel:
    'Eingang freigegebener Monatsmeldungen (US-KJ-004) als Datenbasis des Steuerungslagebilds',
  methodikKurz:
    'Das Jugendamt sieht nur freigegebene Aggregate. Entwürfe und unfreigegebene Meldungen ' +
    'erscheinen als Datenlücke bzw. ausstehend – nicht mit Schätzwerten gefüllt. ' +
    'Demo-Session: Freigabe in /kita/meldung aktualisiert den Eintrag für Kita Sonnenwinkel lokal.',
  eintraege: [
    {
      meldungId: 'MM-EINR-DEMO-02-2024-10',
      einrichtungId: 'EINR-DEMO-02',
      einrichtungBezeichnung: 'Kita Stadtnest',
      traeger: 'Stadt Musterstadt (fiktiv)',
      planungsraumId: 'PR-01',
      planungsraumBezeichnung: 'Innenstadt',
      monatsIso: '2024-10',
      monatsLabel: 'Oktober 2024',
      meldefrist: '2024-11-15',
      meldefristLabel: '15. November 2024',
      status: 'FREIGEGEBEN',
      freigegebenAm: '2024-11-12',
      freigabeId: 'FG-MM-EINR-DEMO-02-2024-10',
      freigegebenDurchRolle: 'Kita-Leitung (Demo-Rolle)',
      kennzahlen: {
        genehmigtePlaetze: 72,
        belegtePlaetze: 68,
        freiePlaetze: 2,
        wartelisteBestand: 11,
        personalAusfallquoteProzent: 6.4,
        tagePersonalschluesselUnterschritten: 1,
        auslastungsgradProzent: 97.1,
        anwesenheitsquoteProzent: 91.2,
      },
    },
    {
      meldungId: 'MM-EINR-DEMO-03-2024-10',
      einrichtungId: 'EINR-DEMO-03',
      einrichtungBezeichnung: 'Kita Nordlicht',
      traeger: 'Freier Träger „Bildung & Bindung e. V.“ (fiktiv)',
      planungsraumId: 'PR-02',
      planungsraumBezeichnung: 'Nordwest',
      monatsIso: '2024-10',
      monatsLabel: 'Oktober 2024',
      meldefrist: '2024-11-15',
      meldefristLabel: '15. November 2024',
      status: 'FREIGEGEBEN',
      freigegebenAm: '2024-11-10',
      freigabeId: 'FG-MM-EINR-DEMO-03-2024-10',
      freigegebenDurchRolle: 'Kita-Leitung (Demo-Rolle)',
      kennzahlen: {
        genehmigtePlaetze: 96,
        belegtePlaetze: 90,
        freiePlaetze: 5,
        wartelisteBestand: 8,
        personalAusfallquoteProzent: 5.1,
        tagePersonalschluesselUnterschritten: 0,
        auslastungsgradProzent: 94.7,
        anwesenheitsquoteProzent: 89.5,
      },
    },
    {
      /** Entspricht demoKitaMonatsmeldung – initial ohne JA-Eingang */
      meldungId: sonnenwinkel.id,
      einrichtungId: sonnenwinkel.einrichtungId,
      einrichtungBezeichnung: sonnenwinkel.einrichtungBezeichnung,
      traeger: sonnenwinkel.traeger,
      planungsraumId: 'PR-03',
      planungsraumBezeichnung: sonnenwinkel.planungsraumBezeichnung,
      monatsIso: sonnenwinkel.monatsIso,
      monatsLabel: sonnenwinkel.monatsLabel,
      meldefrist: sonnenwinkel.meldefrist,
      meldefristLabel: sonnenwinkel.meldefristLabel,
      status: 'UEBERFAELLIG',
      hinweise: [
        'Meldefrist überschritten – Freigabe ausstehend (Demo US-KJ-004).',
        'Keine unfreigegebenen Aggregate im Lagebild sichtbar.',
      ],
    },
    {
      meldungId: 'MM-EINR-DEMO-04-2024-10',
      einrichtungId: 'EINR-DEMO-04',
      einrichtungBezeichnung: 'Kita Westwiese',
      traeger: 'Kirchlicher Träger (fiktiv)',
      planungsraumId: 'PR-04',
      planungsraumBezeichnung: 'Westpark',
      monatsIso: '2024-10',
      monatsLabel: 'Oktober 2024',
      meldefrist: '2024-11-15',
      meldefristLabel: '15. November 2024',
      status: 'FREIGEGEBEN',
      freigegebenAm: '2024-11-14',
      freigabeId: 'FG-MM-EINR-DEMO-04-2024-10',
      freigegebenDurchRolle: 'Kita-Leitung (Demo-Rolle)',
      kennzahlen: {
        genehmigtePlaetze: 80,
        belegtePlaetze: 74,
        freiePlaetze: 4,
        wartelisteBestand: 6,
        personalAusfallquoteProzent: 4.8,
        tagePersonalschluesselUnterschritten: 0,
        auslastungsgradProzent: 94.9,
        anwesenheitsquoteProzent: 92.0,
      },
    },
    {
      meldungId: 'MM-EINR-DEMO-05-2024-10',
      einrichtungId: 'EINR-DEMO-05',
      einrichtungBezeichnung: 'Kita Hafenkieker',
      traeger: 'Stadt Musterstadt (fiktiv)',
      planungsraumId: 'PR-05',
      planungsraumBezeichnung: 'Hafenviertel',
      monatsIso: '2024-10',
      monatsLabel: 'Oktober 2024',
      meldefrist: '2024-11-15',
      meldefristLabel: '15. November 2024',
      status: 'AUSSTEHEND',
      hinweise: [
        'Frist noch nicht als überfällig markiert in dieser Demo-Stichprobe (Status: ausstehend).',
      ],
    },
  ],
};
