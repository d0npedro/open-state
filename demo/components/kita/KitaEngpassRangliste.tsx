'use client';

/**
 * Engpass-Rangliste im Steuerungslagebild (US-KJ-006) mit Meldebasis-Kurzmarkierung.
 *
 * Wartelistendruck-Rang bleibt führend; fehlende freigegebene Einrichtungsmeldungen
 * (Demo-Stichprobe, Session-sensitiv) werden je Zeile als Hinweis markiert — Hinweis only,
 * keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen.
 */

import type { PlanungsraumKennzahlen } from '@/types/kita';
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

function MiniDruckBar({ faktor, maxFaktor }: { faktor: number; maxFaktor: number }) {
  const width = Math.min((faktor / maxFaktor) * 100, 100);
  const color = druckColor(faktor);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          flex: 1,
          height: '8px',
          background: 'var(--color-border)',
          borderRadius: '4px',
          overflow: 'hidden',
          minWidth: '60px',
        }}
      >
        <div
          style={{ height: '100%', width: `${width}%`, background: color, borderRadius: '4px' }}
        />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color, minWidth: '2.5rem' }}>
        {faktor.toFixed(1)}x
      </span>
    </div>
  );
}

function meldeKurzlabel(basis: PlanungsraumMeldebasis | undefined): string | null {
  if (!basis?.hatDatenluecke) return null;
  if (basis.schwere === 'UEBERFAELLIG') return 'Meldelücke (überfällig)';
  return 'Meldelücke (ausstehend)';
}

export function KitaEngpassRangliste({
  sorted,
  maxDruck,
}: {
  sorted: PlanungsraumKennzahlen[];
  maxDruck: number;
}) {
  const { byRaumId } = useMeldeeingangFuerBedarfsplanung();

  const lueckenCount = sorted.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke).length;

  return (
    <section>
      <h2 style={{ marginBottom: '0.5rem' }}>Engpass-Rangliste nach Wartelistendruck</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Wartelistendruck = offene Anfragen / real freie Plätze. Wert &gt; 1 bedeutet mehr Anfragen als
        freie Plätze. Kontinuierliche Skala — kein Ampelsystem.
        {' '}Meldebasis je Planungsraum aus Demo-Stichprobe Meldeeingang (Hinweis only;
        nach Session-Freigabe in der Monatsmeldung kann die Markierung entfallen).
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {sorted.map((pr, i) => {
          const basis = byRaumId.get(pr.id);
          const meldeLabel = meldeKurzlabel(basis);
          const hasLuecke = Boolean(basis?.hatDatenluecke);
          const meldeBorder =
            basis?.schwere === 'UEBERFAELLIG'
              ? 'var(--color-danger)'
              : hasLuecke
                ? 'var(--color-warning)'
                : druckColor(pr.wartelisteDruckFaktor);

          return (
            <div
              key={pr.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5rem minmax(8rem, 11rem) 1fr minmax(6rem, 7.5rem) minmax(5rem, 6rem)',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                background: i === 0 ? 'var(--color-danger-light, #fff5f5)' : 'var(--color-neutral-light)',
                borderRadius: 'var(--radius)',
                borderLeft: `3px solid ${meldeBorder}`,
              }}
            >
              <span
                style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}
              >
                #{i + 1}
              </span>
              <div>
                <span style={{ fontWeight: 600 }}>{pr.bezeichnung}</span>
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
              <MiniDruckBar faktor={pr.wartelisteDruckFaktor} maxFaktor={maxDruck} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Meldebasis</div>
                <MeldebasisBadge basis={basis} />
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  textAlign: 'right',
                }}
              >
                {pr.wartelisteBestand} Anfragen
              </span>
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
          {lueckenCount} Planungsraum{lueckenCount === 1 ? '' : 'e'} mit unvollständiger Meldebasis
          in der Demo-Stichprobe. Rangfolge bleibt nach Wartelistendruck; Meldelücke ist methodischer
          Hinweis, keine automatische Umbewertung des Engpasses.
        </p>
      )}
    </section>
  );
}
