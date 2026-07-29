/**
 * Mock: Tagesstand Kita Sonnenwinkel (US-KJ-001)
 *
 * Fiktive Aggregate. Keine Kind- oder Personennamen.
 * Vorbelegung entspricht Belegung EINR-DEMO-01 am Demo-Stichtag.
 */

import type { KitaTagesstand } from '@/types/kitaTagesstand';

export const demoKitaTagesstand: KitaTagesstand = {
  id: 'TS-EINR-DEMO-01-2024-10-31',
  einrichtungId: 'EINR-DEMO-01',
  einrichtungBezeichnung: 'Kita Sonnenwinkel',
  traeger: 'Freier Träger „Gemeinsam wachsen e. V.“ (fiktiv)',
  planungsraumBezeichnung: 'Südost',
  datumIso: '2024-10-31',
  datumLabel: '31.10.2024',
  fiktivesHeute: '2024-10-31',
  status: 'NICHT_ERFASST',
  gruppen: [
    {
      gruppeId: 'GR-01',
      bezeichnung: 'Nestgruppe A (U3)',
      altersgruppe: 'U3',
      belegtePlaetze: 11,
      geschlossen: false,
      kinder: { anwesend: 9, krank: 1, urlaub: 1, sonstiges: 0 },
      personal: { geplantStunden: 16, istStunden: 14 },
      maxKinderProFachkraftStunde: 0.75,
    },
    {
      gruppeId: 'GR-02',
      bezeichnung: 'Nestgruppe B (U3)',
      altersgruppe: 'U3',
      belegtePlaetze: 10,
      geschlossen: false,
      kinder: { anwesend: 9, krank: 1, urlaub: 0, sonstiges: 0 },
      personal: { geplantStunden: 16, istStunden: 16 },
      maxKinderProFachkraftStunde: 0.75,
    },
    {
      gruppeId: 'GR-03',
      bezeichnung: 'Elementargruppe Sonne',
      altersgruppe: 'UE3',
      belegtePlaetze: 22,
      geschlossen: false,
      kinder: { anwesend: 20, krank: 1, urlaub: 1, sonstiges: 0 },
      personal: { geplantStunden: 18, istStunden: 14 },
      maxKinderProFachkraftStunde: 1.4,
    },
    {
      gruppeId: 'GR-04',
      bezeichnung: 'Elementargruppe Mond',
      altersgruppe: 'UE3',
      belegtePlaetze: 18,
      geschlossen: false,
      kinder: { anwesend: 16, krank: 2, urlaub: 0, sonstiges: 0 },
      personal: { geplantStunden: 16, istStunden: 16 },
      maxKinderProFachkraftStunde: 1.4,
    },
    {
      gruppeId: 'GR-05',
      bezeichnung: 'Elementargruppe Sterne',
      altersgruppe: 'UE3',
      belegtePlaetze: 0,
      geschlossen: true,
      kinder: { anwesend: 0, krank: 0, urlaub: 0, sonstiges: 0 },
      personal: { geplantStunden: 0, istStunden: 0 },
      maxKinderProFachkraftStunde: 1.4,
    },
  ],
  methodikKurz:
    'Tagesstand als Summen je Gruppe: Kinder in Status anwesend / krank / Urlaub / sonstiges. Personal als geplante und Ist-Fachkraft-Stunden ohne Personennamen. Personalschlüssel-Hinweis ist eine vereinfachte Demo-Regel (Kinder je Ist-Stunde) und ersetzt keine landesrechtliche Bewertung.',
  rechtsgrundlageHinweis:
    'Betriebliche Erfassung zur internen Dokumentation und als Basis für Monatsberichte/Meldungen. Keine automatische Meldung an das Jugendamt (US-KJ-004). Landesrechtliche Fördernachweise und Personalratsthemen sind policy-offen (US-KJ-001).',
  datenschutzHinweis:
    'Keine Kindlisten, keine Personalnamen, keine Gesundheitsdiagnosen. Nur Zählwerte und Stundenaggregate. Offline-Fähigkeit ist Produktdesign-Anforderung – diese Demo ist session-lokal im Browser.',
};

/** Summe der Kinder-Status einer Gruppe */
export function kinderSumme(k: {
  anwesend: number;
  krank: number;
  urlaub: number;
  sonstiges: number;
}): number {
  return k.anwesend + k.krank + k.urlaub + k.sonstiges;
}

/**
 * Vereinfachte Demo-Unterschreitung: anwesende Kinder / Ist-Stunden > Schwelle
 * (bei 0 Ist-Stunden und anwesenden Kindern immer Unterschreitung).
 */
export function personalschluesselUnterschritten(g: {
  geschlossen: boolean;
  kinder: { anwesend: number };
  personal: { istStunden: number };
  maxKinderProFachkraftStunde: number;
}): boolean {
  if (g.geschlossen) return false;
  if (g.kinder.anwesend <= 0) return false;
  if (g.personal.istStunden <= 0) return true;
  const ratio = g.kinder.anwesend / g.personal.istStunden;
  return ratio > g.maxKinderProFachkraftStunde + 1e-9;
}
