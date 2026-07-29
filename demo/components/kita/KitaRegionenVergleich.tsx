'use client';

/**
 * Regionenvergleich: zwei Planungsräume nebeneinander (US-KJ-010 AK 3).
 * Dieselben Kernkennzahlen, Differenzspalte, Meldebasis-Kurzmarkierung.
 * Keine Chart-Bibliothek — HTML-Tabelle. Keine Bewertung, keine Kind-/Personennamen.
 */

import { useMemo, useState } from 'react';
import type { PlanungsraumKennzahlen } from '@/types/kita';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

function fmt(n: number) {
  return n.toLocaleString('de-DE');
}

function fmtPct(n: number) {
  return `${n.toFixed(1)} %`;
}

type MetricKey =
  | 'versorgungsquoteU3'
  | 'versorgungsquoteUe3'
  | 'auslastung'
  | 'freiePlaetze'
  | 'warteliste'
  | 'wartelisteDruck'
  | 'personal'
  | 'plaetzeReal'
  | 'inklusion';

interface MetricRow {
  key: MetricKey;
  label: string;
  unit: 'zahl' | 'pct' | 'faktor';
  /** Höher = engpass-relevant (Differenz rot wenn A > B und metric „schlechter bei höher“) */
  higherIsWorse?: boolean;
  get: (pr: PlanungsraumKennzahlen) => number;
}

const METRICS: MetricRow[] = [
  {
    key: 'versorgungsquoteU3',
    label: 'Versorgungsquote U3',
    unit: 'pct',
    higherIsWorse: false,
    get: pr => pr.versorgungsquote.u3,
  },
  {
    key: 'versorgungsquoteUe3',
    label: 'Versorgungsquote Ü3',
    unit: 'pct',
    higherIsWorse: false,
    get: pr => pr.versorgungsquote.ue3,
  },
  {
    key: 'auslastung',
    label: 'Auslastungsgrad',
    unit: 'pct',
    higherIsWorse: true,
    get: pr => pr.auslastungsgradProzent,
  },
  {
    key: 'freiePlaetze',
    label: 'Freie Plätze (U3+Ü3)',
    unit: 'zahl',
    higherIsWorse: false,
    get: pr => pr.freiePlaetzeU3 + pr.freiePlaetzeUe3,
  },
  {
    key: 'warteliste',
    label: 'Wartelistenbestand',
    unit: 'zahl',
    higherIsWorse: true,
    get: pr => pr.wartelisteBestand,
  },
  {
    key: 'wartelisteDruck',
    label: 'Wartelistendruck-Faktor',
    unit: 'faktor',
    higherIsWorse: true,
    get: pr => pr.wartelisteDruckFaktor,
  },
  {
    key: 'personal',
    label: 'Personalausfallquote',
    unit: 'pct',
    higherIsWorse: true,
    get: pr => pr.personalAusfallquoteProzent,
  },
  {
    key: 'plaetzeReal',
    label: 'Real nutzbare Plätze',
    unit: 'zahl',
    higherIsWorse: false,
    get: pr => pr.realNutzbarePlaetzeU3 + pr.realNutzbarePlaetzeUe3,
  },
  {
    key: 'inklusion',
    label: 'Inklusionsplätze belegt/genehmigt',
    unit: 'zahl',
    higherIsWorse: false,
    get: pr => pr.inklusionsplaetzeBelegt,
  },
];

function formatValue(pr: PlanungsraumKennzahlen, m: MetricRow): string {
  const v = m.get(pr);
  if (m.key === 'inklusion') {
    return `${pr.inklusionsplaetzeBelegt}/${pr.inklusionsplaetzeGenehmigt}`;
  }
  if (m.unit === 'pct') return fmtPct(v);
  if (m.unit === 'faktor') return v.toFixed(1);
  return fmt(v);
}

function deltaDisplay(
  a: number,
  b: number,
  unit: MetricRow['unit'],
  higherIsWorse?: boolean
): { text: string; color: string } {
  const d = a - b;
  if (Math.abs(d) < 0.05 && unit !== 'zahl') {
    return { text: '±0', color: 'var(--color-text-muted)' };
  }
  if (d === 0) {
    return { text: '±0', color: 'var(--color-text-muted)' };
  }
  const sign = d > 0 ? '+' : '';
  let text: string;
  if (unit === 'pct') text = `${sign}${d.toFixed(1)} Pp.`;
  else if (unit === 'faktor') text = `${sign}${d.toFixed(1)}`;
  else text = `${sign}${fmt(Math.round(d))}`;

  // Farblich: Differenz nur als Orientierung (A minus B), nicht als Bewertung
  const worse = higherIsWorse ? d > 0 : d < 0;
  const better = higherIsWorse ? d < 0 : d > 0;
  const color = worse
    ? 'var(--color-danger)'
    : better
      ? 'var(--color-success)'
      : 'var(--color-text-muted)';
  return { text, color };
}

interface Props {
  planungsraeume: PlanungsraumKennzahlen[];
  /** Default links (z. B. Engpass-Raum) */
  defaultA?: string;
  /** Default rechts (Vergleichsraum) */
  defaultB?: string;
}

export function KitaRegionenVergleich({
  planungsraeume,
  defaultA = 'PR-03',
  defaultB = 'PR-02',
}: Props) {
  const ids = planungsraeume.map(p => p.id);
  const initialA = ids.includes(defaultA) ? defaultA : ids[0] ?? '';
  const initialB = ids.includes(defaultB)
    ? defaultB
    : ids.find(id => id !== initialA) ?? ids[0] ?? '';

  const [idA, setIdA] = useState(initialA);
  const [idB, setIdB] = useState(initialB);

  const { byRaumId, hydrated } = useMeldeeingangFuerBedarfsplanung();

  const raumA = useMemo(
    () => planungsraeume.find(p => p.id === idA) ?? planungsraeume[0],
    [planungsraeume, idA]
  );
  const raumB = useMemo(
    () => planungsraeume.find(p => p.id === idB) ?? planungsraeume[1] ?? planungsraeume[0],
    [planungsraeume, idB]
  );

  const sameRoom = raumA?.id === raumB?.id;
  const basisA = raumA ? byRaumId.get(raumA.id) : undefined;
  const basisB = raumB ? byRaumId.get(raumB.id) : undefined;

  if (!raumA || !raumB) {
    return (
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Keine Planungsräume für den Vergleich verfügbar.
      </p>
    );
  }

  const selectStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    padding: '0.4rem 0.6rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface, #fff)',
    color: 'var(--color-text)',
    minWidth: '10rem',
  };

  return (
    <div>
      <div
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius)',
          fontSize: '0.875rem',
          borderLeft: '3px solid var(--color-primary)',
          color: 'var(--color-text)',
          lineHeight: 1.5,
        }}
      >
        Zwei Planungsräume mit denselben Kennzahlen nebeneinander (US-KJ-010 AK&nbsp;3).
        Die Spalte <strong>Δ (A − B)</strong> zeigt die rechnerische Differenz — keine automatische
        Bewertung und keine Empfehlung. Meldebasis je Raum aus der Demo-Stichprobe (Session-sensitiv).
      </div>

      {/* Auswahl */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Region A</span>
          <select
            value={idA}
            onChange={e => setIdA(e.target.value)}
            style={selectStyle}
            aria-label="Planungsraum A für Regionenvergleich"
          >
            {planungsraeume.map(pr => (
              <option key={pr.id} value={pr.id}>
                {pr.bezeichnung} ({pr.id})
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Region B</span>
          <select
            value={idB}
            onChange={e => setIdB(e.target.value)}
            style={selectStyle}
            aria-label="Planungsraum B für Regionenvergleich"
          >
            {planungsraeume.map(pr => (
              <option key={pr.id} value={pr.id}>
                {pr.bezeichnung} ({pr.id})
              </option>
            ))}
          </select>
        </label>
        {sameRoom && (
          <span
            role="status"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-warning)',
              fontWeight: 600,
              paddingBottom: '0.35rem',
            }}
          >
            Bitte zwei unterschiedliche Räume wählen.
          </span>
        )}
      </div>

      {/* Kopfkarten */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {[
          { label: 'A', pr: raumA, basis: basisA },
          { label: 'B', pr: raumB, basis: basisB },
        ].map(({ label, pr, basis }) => (
          <div
            key={label}
            className="card"
            style={{
              borderTop: `3px solid ${
                label === 'A' ? 'var(--color-primary)' : 'var(--color-neutral, var(--color-border))'
              }`,
              borderLeft:
                hydrated && basis?.hatDatenluecke
                  ? basis.schwere === 'UEBERFAELLIG'
                    ? '3px solid var(--color-danger)'
                    : '3px solid var(--color-warning)'
                  : undefined,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Region {label}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              {pr.bezeichnung}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              {pr.id} · {fmt(pr.einwohnerKinderU3 + pr.einwohnerKinderUe3)} Kinder U3+Ü3 (Statistik)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Meldebasis:</span>
              {hydrated ? (
                <MeldebasisBadge basis={basis} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>…</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vergleichstabelle */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Kennzahl</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                A · {raumA.bezeichnung}
              </th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                B · {raumB.bezeichnung}
              </th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Δ (A − B)
              </th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m, i) => {
              const va = m.get(raumA);
              const vb = m.get(raumB);
              const delta =
                m.key === 'inklusion'
                  ? {
                      text: `${raumA.inklusionsplaetzeBelegt - raumB.inklusionsplaetzeBelegt >= 0 ? '+' : ''}${
                        raumA.inklusionsplaetzeBelegt - raumB.inklusionsplaetzeBelegt
                      } belegt`,
                      color: 'var(--color-text-muted)',
                    }
                  : sameRoom
                    ? { text: '–', color: 'var(--color-text-muted)' }
                    : deltaDisplay(va, vb, m.unit, m.higherIsWorse);

              return (
                <tr
                  key={m.key}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--color-neutral-light)',
                  }}
                >
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 500 }}>{m.label}</td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {formatValue(raumA, m)}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {formatValue(raumB, m)}
                  </td>
                  <td
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: delta.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {delta.text}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <span>Δ = Wert Region A minus Wert Region B (Pp. = Prozentpunkte)</span>
        <span style={{ color: 'var(--color-danger)' }}>Rot</span>
        <span>= Richtung Engpass/Druck bei A höher bzw. Versorgung niedriger</span>
        <span style={{ color: 'var(--color-success)' }}>Grün</span>
        <span>= Richtung Entlastung bei A</span>
      </div>

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Methodik (US-KJ-010 AK&nbsp;3): Gegenüberstellung aggregierter Planungsraum-Kennzahlen am
        Berichtsstand — keine Einrichtungsindividualdaten, keine Personenbezüge. Farbliche
        Differenzmarkierung ist Orientierung, keine automatische Bewertung. Meldebasis-Stichprobe
        wie im Meldeeingang; Freigabe-Demo unter{' '}
        <a href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
          /kita/meldung
        </a>
        .
      </p>
    </div>
  );
}
