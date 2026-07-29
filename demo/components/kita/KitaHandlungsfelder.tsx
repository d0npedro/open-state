'use client';

/**
 * Handlungsfelder im Steuerungslagebild (US-KJ-005/006) mit Meldebasis-Kurzmarkierung.
 *
 * Abgeleitet aus Wartelistendruck (keine Empfehlungen). Fehlende freigegebene
 * Einrichtungsmeldungen (Demo-Stichprobe, Session-sensitiv) werden je Feld
 * als methodischer Hinweis markiert — Hinweis only, keine Interpolation.
 * Nur Aggregate, keine Kind- oder Personennamen.
 */

import type { PlanungsraumKennzahlen, Kapazitaetsmassnahme } from '@/types/kita';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

function druckColor(faktor: number): string {
  if (faktor > 20) return 'var(--color-danger)';
  if (faktor > 5) return 'var(--color-warning)';
  return 'var(--color-success)';
}

function druckLabel(faktor: number): string {
  if (faktor > 20) return 'Kritisch';
  if (faktor > 5) return 'Erhöht';
  return 'Stabil';
}

function deckungsgrad(warteliste: number, neuePlaetze: number): number {
  if (warteliste === 0) return 100;
  return Math.min(Math.round((neuePlaetze / warteliste) * 100), 100);
}

function meldeKurzlabel(basis: PlanungsraumMeldebasis | undefined): string | null {
  if (!basis?.hatDatenluecke) return null;
  if (basis.schwere === 'UEBERFAELLIG') return 'Meldelücke (überfällig)';
  return 'Meldelücke (ausstehend)';
}

export function KitaHandlungsfelder({
  handlungsfelder,
  massnahmenByPR,
}: {
  handlungsfelder: PlanungsraumKennzahlen[];
  massnahmenByPR: Record<string, Kapazitaetsmassnahme[]>;
}) {
  const { byRaumId } = useMeldeeingangFuerBedarfsplanung();

  const lueckenCount = handlungsfelder.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke).length;

  return (
    <section>
      <h2 style={{ marginBottom: '0.5rem' }}>Handlungsfelder</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Aus den Falldaten abgeleitet — keine automatischen Empfehlungen. Die Entscheidung über
        Maßnahmen liegt bei der Jugendamtsleitung und den politischen Gremien.
        {' '}Meldebasis je Planungsraum aus Demo-Stichprobe Meldeeingang (Hinweis only; nach
        Session-Freigabe in der Monatsmeldung kann die Markierung entfallen).
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {handlungsfelder.map(pr => {
          const m = massnahmenByPR[pr.id] ?? [];
          const neuePlaetze = m.reduce((s, x) => s + x.erwarteteNeuePlaetze, 0);
          const deckung = deckungsgrad(pr.wartelisteBestand, neuePlaetze);
          const basis = byRaumId.get(pr.id);
          const meldeLabel = meldeKurzlabel(basis);
          const hasLuecke = Boolean(basis?.hatDatenluecke);
          const borderColor =
            basis?.schwere === 'UEBERFAELLIG'
              ? 'var(--color-danger)'
              : hasLuecke
                ? 'var(--color-warning)'
                : druckColor(pr.wartelisteDruckFaktor);

          return (
            <div
              key={pr.id}
              style={{
                padding: '0.875rem 1rem',
                border: `1px solid ${borderColor}`,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: 'var(--radius)',
                background: 'white',
                fontSize: '0.875rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.4rem',
                }}
              >
                <div>
                  <strong>{pr.bezeichnung}</strong>
                  {meldeLabel && (
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color:
                          basis?.schwere === 'UEBERFAELLIG'
                            ? 'var(--color-danger)'
                            : 'var(--color-warning)',
                        marginTop: '0.15rem',
                      }}
                    >
                      · {meldeLabel}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      Meldebasis
                    </div>
                    <MeldebasisBadge basis={basis} />
                  </div>
                  <span
                    style={{
                      color: druckColor(pr.wartelisteDruckFaktor),
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    Druck: {pr.wartelisteDruckFaktor.toFixed(1)}x · {druckLabel(pr.wartelisteDruckFaktor)}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.5 }}>
                {pr.wartelisteBestand} Anfragen ohne Platzzusage bei{' '}
                {pr.freiePlaetzeU3 + pr.freiePlaetzeUe3} freien Plätzen.
                {neuePlaetze > 0
                  ? ` Laufende Maßnahmen schaffen +${neuePlaetze} Plätze (Deckungsgrad ${deckung} % der Warteliste).`
                  : ' Keine laufenden Kapazitätserweiterungen für diesen Planungsraum.'}
                {deckung < 100 &&
                  pr.wartelisteDruckFaktor > 5 &&
                  ` Verbleibende Lücke: ${
                    pr.wartelisteBestand - neuePlaetze > 0 ? pr.wartelisteBestand - neuePlaetze : 0
                  } Plätze.`}
              </p>
              {hasLuecke && (
                <p
                  style={{
                    margin: '0.5rem 0 0',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.45,
                  }}
                >
                  Datenlage: unvollständige Meldebasis in der Demo-Stichprobe
                  {basis && basis.luecken.length > 0
                    ? ` (${basis.luecken.map(e => e.einrichtungBezeichnung).join(', ')})`
                    : ''}
                  . Keine automatische Umbewertung des Handlungsfelds; Freigabe in der
                  Monatsmeldung kann die Markierung schließen.
                </p>
              )}
            </div>
          );
        })}
      </div>
      {lueckenCount > 0 && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            margin: '0.75rem 0 0',
            lineHeight: 1.5,
          }}
        >
          {lueckenCount} Handlungsfeld{lueckenCount === 1 ? '' : 'er'} mit unvollständiger
          Meldebasis in der Demo-Stichprobe. Ableitung bleibt nach Wartelistendruck; Meldelücke
          ist methodischer Hinweis, keine automatische Priorisierung.
        </p>
      )}
    </section>
  );
}
