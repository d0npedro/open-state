/**
 * Mock: Belegung einer fiktiven Einrichtung „Kita Sonnenwinkel"
 * Musterstadt, Planungsraum Südost — keine echten Personen- oder Kinddaten.
 */

import type { KitaEinrichtungBelegung } from '@/types/kitaEinrichtung';

export const demoKitaEinrichtung: KitaEinrichtungBelegung = {
  id: 'EINR-DEMO-01',
  bezeichnung: 'Kita Sonnenwinkel',
  traeger: 'Freier Träger „Gemeinsam wachsen e. V.“ (fiktiv)',
  planungsraumId: 'PR-03',
  planungsraumBezeichnung: 'Südost',
  standLabel: 'aktuell (Demo-Stichtag)',
  letzteErfassung: '2024-10-31',
  fiktivesHeute: '2024-10-31',
  gruppen: [
    {
      id: 'GR-01',
      bezeichnung: 'Nestgruppe A (U3)',
      altersgruppe: 'U3',
      genehmigtePlaetze: 12,
      belegtePlaetze: 11,
      reserviertePlaetze: 1,
      freiePlaetze: 0,
      einschraenkung: 'KEINE',
    },
    {
      id: 'GR-02',
      bezeichnung: 'Nestgruppe B (U3)',
      altersgruppe: 'U3',
      genehmigtePlaetze: 12,
      belegtePlaetze: 10,
      reserviertePlaetze: 0,
      freiePlaetze: 2,
      einschraenkung: 'KEINE',
    },
    {
      id: 'GR-03',
      bezeichnung: 'Elementargruppe Sonne',
      altersgruppe: 'UE3',
      genehmigtePlaetze: 22,
      belegtePlaetze: 22,
      reserviertePlaetze: 0,
      freiePlaetze: 0,
      einschraenkung: 'KEINE',
    },
    {
      id: 'GR-04',
      bezeichnung: 'Elementargruppe Mond',
      altersgruppe: 'UE3',
      genehmigtePlaetze: 22,
      belegtePlaetze: 18,
      reserviertePlaetze: 2,
      freiePlaetze: 2,
      einschraenkung: 'REDUZIERT',
      einschraenkungHinweis:
        'Zwei Plätze wegen Sanierung im Nebenraum vorübergehend nicht nutzbar (genehmigt: 22, real nutzbar: 20).',
      einschraenkungBis: '2024-12-15',
    },
    {
      id: 'GR-05',
      bezeichnung: 'Elementargruppe Sterne',
      altersgruppe: 'UE3',
      genehmigtePlaetze: 20,
      belegtePlaetze: 0,
      reserviertePlaetze: 0,
      freiePlaetze: 0,
      einschraenkung: 'TEMPORAER_GESCHLOSSEN',
      einschraenkungHinweis:
        'Gruppe wegen Wasserrohrbruch geschlossen. Kinder vorübergehend in anderen Gruppen bzw. Notbetreuung.',
      einschraenkungBis: '2024-11-20',
    },
  ],
};
