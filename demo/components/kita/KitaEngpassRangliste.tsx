'use client';

/**
 * Engpass-Rangliste im Steuerungslagebild (US-KJ-006) mit Meldebasis-Kurzmarkierung
 * und Schnellfilter „Meldelücke“ (Session-sensitiv, analog Vorlage / Planungsraum-Explorer).
 *
 * Wartelistendruck-Rang bleibt führend; fehlende freigegebene Einrichtungsmeldungen
 * (Demo-Stichprobe, Session-sensitiv) werden je Zeile als Hinweis markiert — Hinweis only,
 * keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen.
 */

import { useMemo, useState } from 'react';
import type { PlanungsraumKennzahlen } from '@/types/kita';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

/** Schnellfilter: alle Ränge vs. nur Räume mit Meldelücke (Spiegel zu Vorlage US-KJ-008). */
type EngpassSchnellfilter = 'ALL' | 'MELDELUECKE';

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
  /** Nach Wartelistendruck absteigend sortierte Planungsräume (Rang = Index + 1). */
  sorted: PlanungsraumKennzahlen[];
  maxDruck: number;
}) {
  const { byRaumId } = useMeldeeingangFuerBedarfsplanung();
  const [filter, setFilter] = useState<EngpassSchnellfilter>('ALL');

  const lueckenCount = useMemo(
    () => sorted.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke).length,
    [sorted, byRaumId]
  );

  /** Anzeigezeilen mit originalem Druck-Rang; Filter ändert nur Sichtbarkeit. */
  const rows = useMemo(() => {
    const withRank = sorted.map((pr, i) => ({
      pr,
      rank: i + 1,
      basis: byRaumId.get(pr.id),
    }));
    if (filter === 'MELDELUECKE') {
      return withRank.filter(r => r.basis?.hatDatenluecke);
    }
    return withRank;
  }, [sorted, byRaumId, filter]);

  return (
    <section>
      <h2 style={{ marginBottom: '0.5rem' }}>Engpass-Rangliste nach Wartelistendruck</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
        Wartelistendruck = offene Anfragen / real freie Plätze. Wert &gt; 1 bedeutet mehr Anfragen als
        freie Plätze. Kontinuierliche Skala — kein Ampelsystem.
        {' '}Meldebasis je Planungsraum aus Demo-Stichprobe Meldeeingang (Hinweis only;
        nach Session-Freigabe in der Monatsmeldung kann die Markierung entfallen).
        Optional Schnellfilter „Meldelücke“ (wie politische Vorlage / Planungsraum-Explorer).
      </p>

      <div
        role="group"
        aria-label="Schnellfilter Engpass-Rangliste Meldelücke"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}
      >
        <button
          type="button"
          className={filter === 'ALL' ? 'btn btn-primary' : 'btn btn-secondary'}
          aria-pressed={filter === 'ALL'}
          onClick={() => setFilter('ALL')}
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
        >
          Alle Ränge
        </button>
        <button
          type="button"
          className={filter === 'MELDELUECKE' ? 'btn btn-primary' : 'btn btn-secondary'}
          aria-pressed={filter === 'MELDELUECKE'}
          onClick={() => setFilter(prev => (prev === 'MELDELUECKE' ? 'ALL' : 'MELDELUECKE'))}
          style={{
            fontSize: '0.8rem',
            padding: '0.35rem 0.75rem',
            borderColor: filter === 'MELDELUECKE' ? undefined : 'var(--color-danger)',
          }}
          title="Planungsräume mit fehlender freigegebener Monatsmeldung (Demo-Stichprobe, Session-sensitiv)"
        >
          Meldelücke
          <span style={{ marginLeft: '0.35rem', fontSize: '0.72rem', opacity: 0.9 }}>
            ({lueckenCount})
          </span>
        </button>
      </div>

      {rows.length === 0 ? (
        <p
          role="status"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            padding: '0.75rem 1rem',
            background: 'var(--color-neutral-light)',
            borderRadius: 'var(--radius)',
            borderLeft: '3px solid var(--color-border)',
            lineHeight: 1.5,
          }}
        >
          {filter === 'MELDELUECKE'
            ? 'Keine Planungsräume mit Meldelücke in der aktuellen Demo-Stichprobe (ggf. nach Freigabe in /kita/meldung geschlossen).'
            : 'Keine Planungsräume in der Engpass-Rangliste.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rows.map(({ pr, rank, basis }) => {
            const meldeLabel = meldeKurzlabel(basis);
            const hasLuecke = Boolean(basis?.hatDatenluecke);
            const meldeBorder =
              basis?.schwere === 'UEBERFAELLIG'
                ? 'var(--color-danger)'
                : hasLuecke
                  ? 'var(--color-warning)'
                  : druckColor(pr.wartelisteDruckFaktor);
            /** Bei Filter: keine „#1 = kritisch“-Hervorhebung nur wegen Filterposition. */
            const isTopDruck = rank === 1;

            return (
              <div
                key={pr.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1.5rem minmax(8rem, 11rem) 1fr minmax(6rem, 7.5rem) minmax(5rem, 6rem)',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  background: isTopDruck
                    ? 'var(--color-danger-light, #fff5f5)'
                    : 'var(--color-neutral-light)',
                  borderRadius: 'var(--radius)',
                  borderLeft: `3px solid ${meldeBorder}`,
                }}
              >
                <span
                  style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}
                  title="Rang nach Wartelistendruck (unverändert bei Filter)"
                >
                  #{rank}
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
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Meldebasis
                  </div>
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
      )}

      {filter === 'MELDELUECKE' && rows.length > 0 && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            margin: '0.75rem 0 0',
            lineHeight: 1.5,
          }}
        >
          {rows.length} Planungsraum{rows.length === 1 ? '' : 'e'} mit Meldelücke, sortiert nach
          Wartelistendruck (Original-Rang #{rows.map(r => r.rank).join(', #')}). Keine Umbewertung
          nach Meldeschwere.
        </p>
      )}
      {filter === 'ALL' && lueckenCount > 0 && (
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
          Hinweis, keine automatische Umbewertung des Engpasses. Filter „Meldelücke“ listet nur
          betroffene Räume.
        </p>
      )}
    </section>
  );
}
