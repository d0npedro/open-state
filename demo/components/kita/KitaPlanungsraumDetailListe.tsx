'use client';

/**
 * Planungsraum-Detailkarten im Steuerungslagebild (US-KJ-005/006) mit
 * Schnellfilter „Meldelücke“ (Session-sensitiv, analog Engpass-Rangliste /
 * Handlungsfelder / Vorlage).
 *
 * Rang nach Wartelistendruck bleibt führend; Filter ändert nur Sichtbarkeit.
 * Residuale Planungslücke und Meldebeitrag bleiben Hinweis-only.
 * Nur Aggregate, keine Kind- oder Personennamen.
 */

import { useMemo, useState } from 'react';
import type { PlanungsraumKennzahlen, Kapazitaetsmassnahme } from '@/types/kita';
import { useMeldeeingangFuerBedarfsplanung } from '@/components/kita/KitaBedarfsplanungDatenbasis';
import {
  KitaLagebildResidualSummenHinweis,
  KitaPlanungsraumMeldebeitrag,
} from '@/components/kita/KitaPlanungsraumMeldebeitrag';

/** Schnellfilter: alle Karten vs. nur Räume mit Meldelücke. */
type DetailSchnellfilter = 'ALL' | 'MELDELUECKE';

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

/**
 * Residuale Planungslücke — gleiche Demo-Näherung wie Bedarfsplanung / Explorer (US-KJ-007).
 * max(0, Warteliste − freie Plätze − geplante Maßnahmenplätze).
 */
function planungslueckeResidual(
  pr: PlanungsraumKennzahlen,
  massnahmen: Kapazitaetsmassnahme[]
): number {
  const geplant = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  const frei = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;
  return Math.max(0, pr.wartelisteBestand - frei - geplant);
}

function MassnahmeTag({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    IN_PLANUNG: { label: 'In Planung', color: 'var(--color-neutral)' },
    GENEHMIGT: { label: 'Genehmigt', color: 'var(--color-primary)' },
    IM_BAU: { label: 'Im Bau', color: 'var(--color-warning)' },
    FERTIGGESTELLT: { label: 'Fertiggestellt', color: 'var(--color-success)' },
  };
  const s = map[status] ?? { label: status, color: 'var(--color-neutral)' };
  return <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>{s.label}</span>;
}

function PlanungsraumKarte({
  pr,
  massnahmen,
  rank,
}: {
  pr: PlanungsraumKennzahlen;
  massnahmen: Kapazitaetsmassnahme[];
  rank: number;
}) {
  const neuePlaetze = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  const residual = planungslueckeResidual(pr, massnahmen);
  const deckung = deckungsgrad(pr.wartelisteBestand, neuePlaetze);
  const color = druckColor(pr.wartelisteDruckFaktor);
  const gesamtRealNutzbar = pr.realNutzbarePlaetzeU3 + pr.realNutzbarePlaetzeUe3;
  const gesamtBelegt = pr.belegtePlaetzeU3 + pr.belegtePlaetzeUe3;
  const gesamtFrei = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.2rem',
            }}
          >
            Rang {rank} nach Wartelistendruck
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{pr.bezeichnung}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>
            {pr.wartelisteDruckFaktor.toFixed(1)}x
          </div>
          <div style={{ fontSize: '0.75rem', color, fontWeight: 600 }}>
            {druckLabel(pr.wartelisteDruckFaktor)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {[
          { label: 'Real nutzbar', val: gesamtRealNutzbar },
          { label: 'Belegt', val: gesamtBelegt },
          {
            label: 'Frei',
            val: gesamtFrei,
            hl: gesamtFrei <= 6 ? 'var(--color-danger)' : undefined,
          },
          {
            label: 'Warteliste',
            val: pr.wartelisteBestand,
            hl: pr.wartelisteBestand > 80 ? 'var(--color-danger)' : 'var(--color-warning)',
          },
          {
            label: 'Auslastung',
            val: `${pr.auslastungsgradProzent.toFixed(1)} %`,
            hl: pr.auslastungsgradProzent >= 98 ? 'var(--color-danger)' : undefined,
          },
          {
            label: 'Personal-Ausfall',
            val: `${pr.personalAusfallquoteProzent.toFixed(1)} %`,
            hl: pr.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' : undefined,
          },
        ].map(k => (
          <div
            key={k.label}
            style={{
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              padding: '0.6rem 0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.2rem',
              }}
            >
              {k.label}
            </div>
            <div style={{ fontWeight: 700, color: k.hl ?? 'var(--color-text)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}
      >
        <span>
          U3-Quote:{' '}
          <strong
            style={{
              color: pr.versorgungsquote.u3 < 35 ? 'var(--color-danger)' : 'var(--color-text)',
            }}
          >
            {pr.versorgungsquote.u3.toFixed(1)} %
          </strong>
        </span>
        <span>
          Ü3-Quote:{' '}
          <strong
            style={{
              color: pr.versorgungsquote.ue3 < 75 ? 'var(--color-warning)' : 'var(--color-text)',
            }}
          >
            {pr.versorgungsquote.ue3.toFixed(1)} %
          </strong>
        </span>
        <span>
          Inklusion:{' '}
          <strong>
            {pr.inklusionsplaetzeBelegt}/{pr.inklusionsplaetzeGenehmigt} Pl.
          </strong>
        </span>
      </div>

      <div
        style={{
          background:
            pr.wartelisteBestand > 80
              ? 'var(--color-danger-light, #fff5f5)'
              : 'var(--color-warning-light)',
          borderRadius: 'var(--radius)',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}
      >
        <strong>Bedarfslücke: {pr.wartelisteBestand} Anfragen ohne Platzzusage</strong>
        {neuePlaetze > 0 ? (
          <p style={{ margin: '0.4rem 0 0', color: 'var(--color-text)' }}>
            Laufende Maßnahmen schaffen <strong>+{neuePlaetze} Plätze</strong> (Deckungsgrad:{' '}
            <strong>{deckung} %</strong> der Warteliste).
            {deckung < 80 &&
              ' Weitere Maßnahmen erforderlich, um die Lücke vollständig zu schließen.'}
          </p>
        ) : (
          <p style={{ margin: '0.4rem 0 0', color: 'var(--color-danger)' }}>
            Keine laufenden Kapazitätserweiterungen für diesen Planungsraum vorgesehen.
          </p>
        )}
      </div>

      {massnahmen.length > 0 ? (
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Kapazitätsmaßnahmen ({massnahmen.length})
          </div>
          {massnahmen.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <span>{m.bezeichnung}</span>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <MassnahmeTag status={m.status} />
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                  +{m.erwarteteNeuePlaetze} Pl.
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  {m.geplanteFertigstellung}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Keine laufenden Maßnahmen für diesen Planungsraum.
        </p>
      )}

      <KitaPlanungsraumMeldebeitrag
        planungsraumId={pr.id}
        planungsraumBezeichnung={pr.bezeichnung}
        residualPlanungsluecke={residual}
      />
    </div>
  );
}

export function KitaPlanungsraumDetailListe({
  sorted,
  massnahmenByPR,
}: {
  /** Nach Wartelistendruck absteigend (Rang = Index + 1). */
  sorted: PlanungsraumKennzahlen[];
  massnahmenByPR: Record<string, Kapazitaetsmassnahme[]>;
}) {
  const { byRaumId } = useMeldeeingangFuerBedarfsplanung();
  const [filter, setFilter] = useState<DetailSchnellfilter>('ALL');

  const residualByRaumId = useMemo(
    () =>
      Object.fromEntries(
        sorted.map(pr => [pr.id, planungslueckeResidual(pr, massnahmenByPR[pr.id] ?? [])])
      ),
    [sorted, massnahmenByPR]
  );

  const lueckenCount = useMemo(
    () => sorted.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke).length,
    [sorted, byRaumId]
  );

  /** Anzeigezeilen mit originalem Druck-Rang; Filter ändert nur Sichtbarkeit. */
  const rows = useMemo(() => {
    const withRank = sorted.map((pr, i) => ({
      pr,
      rank: i + 1,
      hatLuecke: Boolean(byRaumId.get(pr.id)?.hatDatenluecke),
    }));
    if (filter === 'MELDELUECKE') {
      return withRank.filter(r => r.hatLuecke);
    }
    return withRank;
  }, [sorted, byRaumId, filter]);

  return (
    <section>
      <h2 style={{ marginBottom: '0.5rem' }}>Planungsraum-Detailansicht</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
        Je Karte: Bedarfslücke, Maßnahmen, Meldebeitrag freigegebener Einrichtungen sowie residuale
        Planungslücke (Demo-Näherung) methodisch an Meldelücken — Hinweis only, keine Interpolation.
        Optional Schnellfilter „Meldelücke“ (wie Engpass-Rangliste / Handlungsfelder). Rangfolge
        bleibt nach Wartelistendruck.
      </p>

      {/* Schnellfilter: interaktiv / nicht drucken */}
      <div
        className="no-print"
        role="group"
        aria-label="Schnellfilter Planungsraum-Detail Meldelücke"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}
      >
        <button
          type="button"
          className={filter === 'ALL' ? 'btn btn-primary' : 'btn btn-secondary'}
          aria-pressed={filter === 'ALL'}
          onClick={() => setFilter('ALL')}
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
        >
          Alle Räume
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

      {filter === 'MELDELUECKE' && (
        <p
          className="print-only"
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            margin: '0 0 0.65rem',
            lineHeight: 1.5,
          }}
        >
          Gefiltert: nur Planungsräume mit Meldelücke in der Detailansicht (Stand Ausdruck ·
          Session-sensitiv). Original-Rang nach Wartelistendruck unverändert. Residual-Summenhinweis
          bezieht sich weiterhin auf alle Räume.
        </p>
      )}

      {/* Summenhinweis: immer über alle Räume (Methodik), unabhängig vom Sichtfilter */}
      <KitaLagebildResidualSummenHinweis residualByRaumId={residualByRaumId} />

      {rows.length === 0 ? (
        <p
          role="status"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            margin: '0.75rem 0 0',
            padding: '0.75rem 1rem',
            background: 'var(--color-neutral-light)',
            borderRadius: 'var(--radius)',
            borderLeft: '3px solid var(--color-border)',
            lineHeight: 1.5,
          }}
        >
          {filter === 'MELDELUECKE'
            ? 'Keine Planungsräume mit Meldelücke in der aktuellen Demo-Stichprobe (ggf. nach Freigabe in /kita/meldung geschlossen).'
            : 'Keine Planungsräume in der Detailansicht.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.75rem' }}>
          {rows.map(({ pr, rank }) => (
            <PlanungsraumKarte
              key={pr.id}
              pr={pr}
              massnahmen={massnahmenByPR[pr.id] ?? []}
              rank={rank}
            />
          ))}
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
          in der Demo-Stichprobe. Detailkarten zeigen Meldebeitrag und Residual↔Meldelücke je Raum;
          Filter „Meldelücke“ listet nur betroffene Räume. Keine automatische Priorisierung.
        </p>
      )}
    </section>
  );
}
