'use client';

/**
 * Regionenvergleich: zwei Planungsräume nebeneinander (US-KJ-010 AK 3).
 * Dieselben Kernkennzahlen, Differenzspalte, Meldebasis-Kurzmarkierung.
 * CSV-Export der aktiven Vergleichsansicht (US-KJ-010 AK 4).
 * Zeitlicher Verlauf A vs. B über Monate + CSV des aktiven Verlaufs (US-KJ-010 AK 4).
 * Open-Data-Lizenzhinweis im CSV-Metakopf (Demo vorläufig, siehe kitaCsvLizenz).
 *
 * Druck (US-KJ-009 / US-KJ-010): Auswahl A/B, Kennzahl-Chips und CSV-Buttons no-print;
 * print-only Filterstand/Meta (Region A/B, Meldebasis-Session, Verlaufskennzahl, Monate).
 * Spiegel Zeitreihe / Planungsraum-Explorer.
 *
 * Keine Chart-Bibliothek — HTML-Tabelle. Keine Bewertung, keine Kind-/Personennamen.
 */

import { useMemo, useState } from 'react';
import type { MonatsKennzahl, PlanungsraumKennzahlen } from '@/types/kita';
import { demoKitaMeldeeingang } from '@/data/mockKitaMeldeeingang';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';
import {
  KITA_CSV_LIZENZ_BUTTON_TITLE,
  KITA_CSV_LIZENZ_META_LINES,
  KITA_CSV_LIZENZ_UI_HINWEIS,
} from '@/components/kita/kitaCsvLizenz';

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

/** Kennzahl für den Monatsverlauf A vs. B */
type VerlaufMetric = 'warteliste' | 'auslastung' | 'freiePlaetze' | 'personal';

const VERLAUF_METRICS: {
  key: VerlaufMetric;
  label: string;
  unit: 'zahl' | 'pct';
  higherIsWorse?: boolean;
  get: (m: MonatsKennzahl) => number;
}[] = [
  {
    key: 'warteliste',
    label: 'Wartelistenbestand',
    unit: 'zahl',
    higherIsWorse: true,
    get: m => m.wartelisteBestand,
  },
  {
    key: 'auslastung',
    label: 'Auslastungsgrad',
    unit: 'pct',
    higherIsWorse: true,
    get: m => m.auslastungsgradProzent,
  },
  {
    key: 'freiePlaetze',
    label: 'Freie Plätze',
    unit: 'zahl',
    higherIsWorse: false,
    get: m => m.freiePlaetze,
  },
  {
    key: 'personal',
    label: 'Personalausfallquote',
    unit: 'pct',
    higherIsWorse: true,
    get: m => m.personalAusfallquoteProzent,
  },
];

interface Props {
  planungsraeume: PlanungsraumKennzahlen[];
  /** Zeitreihe je Planungsraum (US-KJ-010) — Verlauf A vs. B */
  zeitreihePlanungsraeume?: Record<string, MonatsKennzahl[]>;
  /** Default links (z. B. Engpass-Raum) */
  defaultA?: string;
  /** Default rechts (Vergleichsraum) */
  defaultB?: string;
}

export function KitaRegionenVergleich({
  planungsraeume,
  zeitreihePlanungsraeume = {},
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
  const [verlaufMetric, setVerlaufMetric] = useState<VerlaufMetric>('warteliste');

  const { byRaumId, hydrated } = useMeldeeingangFuerBedarfsplanung();
  const meldeMonatsIso = demoKitaMeldeeingang.monatsIso;

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

  function meldebasisCsvLabel(basis: PlanungsraumMeldebasis | undefined): string {
    if (!hydrated) return '…';
    if (!basis) return 'keine_Stichprobe';
    return basis.hatDatenluecke
      ? `Luecke (${basis.freigegeben}/${basis.erwartet})`
      : `vollstaendig (${basis.freigegeben}/${basis.erwartet})`;
  }

  /** CSV-Export der aktiven Vergleichsansicht — US-KJ-010 AK 4 */
  function handleCsvDownload() {
    if (!raumA || !raumB) return;

    const de = (n: number) => n.toFixed(1).replace('.', ',');
    const header = [
      'Kennzahl',
      'Kennzahl_Key',
      'Region_A',
      'Region_A_ID',
      'Wert_A',
      'Region_B',
      'Region_B_ID',
      'Wert_B',
      'Delta_A_minus_B',
      'Einheit',
      'Meldebasis_A',
      'Meldebasis_B',
    ].join(';');

    const rows = METRICS.map(m => {
      const va = m.get(raumA);
      const vb = m.get(raumB);
      let wertA: string;
      let wertB: string;
      let delta: string;
      let einheit: string;

      if (m.key === 'inklusion') {
        wertA = `${raumA.inklusionsplaetzeBelegt}/${raumA.inklusionsplaetzeGenehmigt}`;
        wertB = `${raumB.inklusionsplaetzeBelegt}/${raumB.inklusionsplaetzeGenehmigt}`;
        delta = sameRoom
          ? ''
          : String(raumA.inklusionsplaetzeBelegt - raumB.inklusionsplaetzeBelegt);
        einheit = 'belegt/genehmigt';
      } else if (m.unit === 'pct') {
        wertA = de(va);
        wertB = de(vb);
        delta = sameRoom ? '' : de(va - vb);
        einheit = 'Prozent';
      } else if (m.unit === 'faktor') {
        wertA = de(va);
        wertB = de(vb);
        delta = sameRoom ? '' : de(va - vb);
        einheit = 'Faktor';
      } else {
        wertA = String(va);
        wertB = String(vb);
        delta = sameRoom ? '' : String(Math.round(va - vb));
        einheit = 'Zahl';
      }

      return [
        m.label,
        m.key,
        raumA.bezeichnung,
        raumA.id,
        wertA,
        raumB.bezeichnung,
        raumB.id,
        wertB,
        delta,
        einheit,
        meldebasisCsvLabel(basisA),
        meldebasisCsvLabel(basisB),
      ].join(';');
    });

    const meta = [
      '# Open State – Kita Regionenvergleich (US-KJ-010 AK 3 / AK 4)',
      `# Region_A: ${raumA.bezeichnung} (${raumA.id})`,
      `# Region_B: ${raumB.bezeichnung} (${raumB.id})`,
      sameRoom
        ? '# Hinweis: Region A und B sind identisch — Delta leer'
        : '# Delta = Wert Region A minus Wert Region B (rechnerisch, keine Bewertung)',
      `# Meldebasis_A: ${meldebasisCsvLabel(basisA)}`,
      `# Meldebasis_B: ${meldebasisCsvLabel(basisB)}`,
      '# Keine Kind- oder Personennamen. Keine Einrichtungsindividualdaten. Keine Trendbewertung.',
      ...KITA_CSV_LIZENZ_META_LINES,
      '# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM',
      '',
    ];

    const csv = [...meta, header, ...rows].join('\n');
    const slug = `${raumA.id}-vs-${raumB.id}`.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kita-regionenvergleich-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

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

  const csvButtonLabel = `${raumA.bezeichnung} vs. ${raumB.bezeichnung}`;

  const verlaufMetricDef =
    VERLAUF_METRICS.find(m => m.key === verlaufMetric) ?? VERLAUF_METRICS[0];
  const verlaufMonate =
    (zeitreihePlanungsraeume[raumA.id] ?? []).length ||
    (zeitreihePlanungsraeume[raumB.id] ?? []).length;

  function meldebasisDruckKurz(basis: PlanungsraumMeldebasis | undefined): string {
    if (!hydrated) return 'Session noch nicht geladen';
    if (!basis) return 'keine Stichprobe';
    return basis.hatDatenluecke
      ? `Lücke (${basis.freigegeben}/${basis.erwartet} freigegeben)`
      : `ohne Lücke (${basis.freigegeben}/${basis.erwartet} freigegeben)`;
  }

  const meldebasisDruckA = meldebasisDruckKurz(basisA);
  const meldebasisDruckB = meldebasisDruckKurz(basisB);

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
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
          Zwei Planungsräume mit denselben Kennzahlen nebeneinander (US-KJ-010 AK&nbsp;3).
          Die Spalte <strong>Δ (A − B)</strong> zeigt die rechnerische Differenz — keine automatische
          Bewertung und keine Empfehlung. Darunter: zeitlicher Verlauf derselben Auswahl über 12 Monate
          inkl. eigener CSV-Export der aktiven Kennzahl.
          Meldebasis je Raum aus der Demo-Stichprobe (Session-sensitiv).
          Stichtags-CSV (AK&nbsp;4) lädt die aktive Auswahl A/B inkl. Δ und Meldebasis.
          Lizenzhinweis im CSV-Metakopf (Open-Data vorläufig). Im Ausdruck: Auswahl und CSV no-print;
          print-only Filterstand (A/B, Meldebasis, Verlaufskennzahl).
        </div>
        <div
          className="no-print"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', flex: '0 1 auto' }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCsvDownload}
            style={{ fontSize: '0.8rem', flexShrink: 0, whiteSpace: 'nowrap' }}
            title={`CSV der aktuellen Stichtags-Vergleichsansicht: ${csvButtonLabel}. ${KITA_CSV_LIZENZ_BUTTON_TITLE}`}
            aria-label={`Regionenvergleich Stichtag als CSV herunterladen (${csvButtonLabel}; Lizenzhinweis im Metakopf)`}
          >
            CSV herunterladen (Stichtag)
          </button>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.4, maxWidth: '22rem', textAlign: 'right' }}>
            {KITA_CSV_LIZENZ_UI_HINWEIS}
          </p>
        </div>
      </div>

      {/* Auswahl A/B — interaktiv, no-print */}
      <div
        className="no-print"
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

      {/* print-only: Filterstand A/B + Meldebasis + Verlaufskennzahl */}
      <div
        className="print-only print-block"
        style={{
          marginBottom: '0.75rem',
          padding: '0.65rem 0.9rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          background: 'var(--color-neutral-light)',
          lineHeight: 1.5,
        }}
        role="note"
      >
        <strong>Druckfilter Regionenvergleich: </strong>
        Region A: {raumA.bezeichnung} ({raumA.id}) · Meldebasis: {meldebasisDruckA}
        {' · '}
        Region B: {raumB.bezeichnung} ({raumB.id}) · Meldebasis: {meldebasisDruckB}
        {sameRoom ? ' · Hinweis: Region A und B sind identisch — Δ leer' : ''}
        . Verlaufskennzahl: {verlaufMetricDef.label}
        {verlaufMonate > 0 ? ` (${verlaufMonate} Monate)` : ''}
        . Stichprobenmonat: {demoKitaMeldeeingang.monatsLabel} ({demoKitaMeldeeingang.monatsIso}).
        Δ = Wert A − Wert B (rechnerisch, keine Bewertung); Auswahl ändert nur die sichtbare
        Gegenüberstellung — keine Interpolation, keine Trendbewertung. Session-sensitiv
        (Demo-Stichprobe Meldeeingang).
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

      {/* Zeitlicher Verlauf A vs. B (US-KJ-010) */}
      <VerlaufAvsB
        serieA={zeitreihePlanungsraeume[raumA.id] ?? []}
        serieB={zeitreihePlanungsraeume[raumB.id] ?? []}
        raumA={raumA}
        raumB={raumB}
        sameRoom={sameRoom}
        verlaufMetric={verlaufMetric}
        setVerlaufMetric={setVerlaufMetric}
        meldeMonatsIso={meldeMonatsIso}
        basisA={basisA}
        basisB={basisB}
        hydrated={hydrated}
      />

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Methodik (US-KJ-010 AK&nbsp;3 / AK&nbsp;4 + Verlauf, Druck): Gegenüberstellung aggregierter Planungsraum-Kennzahlen
        am Berichtsstand und im 12-Monats-Verlauf — keine Einrichtungsindividualdaten, keine Personenbezüge.
        Farbliche Differenzmarkierung ist Orientierung, keine automatische Bewertung und keine Trendprognose.
        Raumreihen sind Demo-Verteilungen der kommunalen Monatsreihe nach Strukturanteilen. CSV-Export (AK&nbsp;4):
        (1) Stichtags-Kennzahlen inkl. Δ und Meldebasis; (2) aktiver 12-Monats-Verlauf der gewählten Kennzahl
        (Monate · Wert A/B · Δ · Meldebasis). Lizenzhinweis im CSV-Metakopf (Open-Data vorläufig, finale
        Lizenz je Bundesland zu klären). Im Ausdruck: Auswahl A/B, Kennzahl-Chips und CSV no-print; print-only
        Filterstand (A/B, Meldebasis-Session, Verlaufskennzahl, Stichprobenmonat). Meldemonat Oktober 2024 ist
        methodisch an die Meldebasis-Stichprobe gekoppelt. Freigabe-Demo unter{' '}
        <a href="/kita/meldung" className="no-print" style={{ color: 'var(--color-primary)' }}>
          /kita/meldung
        </a>
        <span className="print-only">/kita/meldung</span>
        .
      </p>
    </div>
  );
}

// ─── Monatsverlauf A vs. B ──────────────────────────────────────────────────

function formatVerlaufValue(v: number, unit: 'zahl' | 'pct'): string {
  if (unit === 'pct') return `${v.toFixed(1)} %`;
  return v.toLocaleString('de-DE');
}

function VerlaufAvsB({
  serieA,
  serieB,
  raumA,
  raumB,
  sameRoom,
  verlaufMetric,
  setVerlaufMetric,
  meldeMonatsIso,
  basisA,
  basisB,
  hydrated,
}: {
  serieA: MonatsKennzahl[];
  serieB: MonatsKennzahl[];
  raumA: PlanungsraumKennzahlen;
  raumB: PlanungsraumKennzahlen;
  sameRoom: boolean;
  verlaufMetric: VerlaufMetric;
  setVerlaufMetric: (k: VerlaufMetric) => void;
  meldeMonatsIso: string;
  basisA: PlanungsraumMeldebasis | undefined;
  basisB: PlanungsraumMeldebasis | undefined;
  hydrated: boolean;
}) {
  const metric = VERLAUF_METRICS.find(m => m.key === verlaufMetric) ?? VERLAUF_METRICS[0];

  const rows = useMemo(() => {
    const mdef = VERLAUF_METRICS.find(m => m.key === verlaufMetric) ?? VERLAUF_METRICS[0];
    const byIsoB = new Map(serieB.map(m => [m.monat, m]));
    return serieA.map(ma => {
      const mb = byIsoB.get(ma.monat);
      const va = mdef.get(ma);
      const vb = mb ? mdef.get(mb) : null;
      return {
        monat: ma.monat,
        monatLabel: ma.monatLabel,
        va,
        vb,
        isMeldeMonat: ma.monat === meldeMonatsIso,
      };
    });
  }, [serieA, serieB, verlaufMetric, meldeMonatsIso]);

  const hatSerie = serieA.length > 0 && serieB.length > 0;

  const lueckeA = hydrated && basisA?.hatDatenluecke;
  const lueckeB = hydrated && basisB?.hatDatenluecke;
  const hatMeldeLuecke = Boolean(lueckeA || lueckeB);

  function meldebasisCsvLabel(basis: PlanungsraumMeldebasis | undefined): string {
    if (!hydrated) return '…';
    if (!basis) return 'keine_Stichprobe';
    return basis.hatDatenluecke
      ? `Luecke (${basis.freigegeben}/${basis.erwartet})`
      : `vollstaendig (${basis.freigegeben}/${basis.erwartet})`;
  }

  function meldebasisMonatCsv(
    isMeldeMonat: boolean,
    basisALocal: PlanungsraumMeldebasis | undefined,
    basisBLocal: PlanungsraumMeldebasis | undefined
  ): string {
    if (!isMeldeMonat) return '–';
    if (!hydrated) return '…';
    const aL = basisALocal?.hatDatenluecke ?? false;
    const bL = basisBLocal?.hatDatenluecke ?? false;
    if (aL || bL) {
      const parts: string[] = [];
      if (aL) parts.push(`A:${meldebasisCsvLabel(basisALocal)}`);
      if (bL) parts.push(`B:${meldebasisCsvLabel(basisBLocal)}`);
      return `Meldeluecke (${parts.join('; ')})`;
    }
    return 'Stichprobe_ok';
  }

  /** CSV-Export des aktiven 12-Monats-Verlaufs A vs. B — US-KJ-010 AK 4 */
  function handleVerlaufCsvDownload() {
    if (!hatSerie) return;

    const de = (n: number) => n.toFixed(1).replace('.', ',');
    const header = [
      'Monat',
      'Monat_ISO',
      'Kennzahl',
      'Kennzahl_Key',
      'Region_A',
      'Region_A_ID',
      'Wert_A',
      'Region_B',
      'Region_B_ID',
      'Wert_B',
      'Delta_A_minus_B',
      'Einheit',
      'Meldebasis',
      'Ist_Berichtsmonat',
    ].join(';');

    const csvRows = rows.map(row => {
      let wertA: string;
      let wertB: string;
      let delta: string;
      let einheit: string;

      if (metric.unit === 'pct') {
        wertA = de(row.va);
        wertB = row.vb === null ? '' : de(row.vb);
        delta = sameRoom || row.vb === null ? '' : de(row.va - row.vb);
        einheit = 'Prozent';
      } else {
        wertA = String(Math.round(row.va));
        wertB = row.vb === null ? '' : String(Math.round(row.vb));
        delta = sameRoom || row.vb === null ? '' : String(Math.round(row.va - row.vb));
        einheit = 'Zahl';
      }

      return [
        row.monatLabel,
        row.monat,
        metric.label,
        metric.key,
        raumA.bezeichnung,
        raumA.id,
        wertA,
        raumB.bezeichnung,
        raumB.id,
        wertB,
        delta,
        einheit,
        meldebasisMonatCsv(row.isMeldeMonat, basisA, basisB),
        row.isMeldeMonat ? 'ja' : 'nein',
      ].join(';');
    });

    const meta = [
      '# Open State – Kita Regionenvergleich Verlauf A vs. B (US-KJ-010 AK 4)',
      `# Region_A: ${raumA.bezeichnung} (${raumA.id})`,
      `# Region_B: ${raumB.bezeichnung} (${raumB.id})`,
      `# Kennzahl: ${metric.label} (${metric.key})`,
      `# Monate: ${rows.length}`,
      sameRoom
        ? '# Hinweis: Region A und B sind identisch — Delta leer'
        : '# Delta = Wert Region A minus Wert Region B je Monat (rechnerisch, keine Bewertung)',
      `# Meldebasis_A (Stichprobe): ${meldebasisCsvLabel(basisA)}`,
      `# Meldebasis_B (Stichprobe): ${meldebasisCsvLabel(basisB)}`,
      `# Berichtsmonat_Meldebasis: ${demoKitaMeldeeingang.monatsLabel} (${meldeMonatsIso})`,
      '# Keine Kind- oder Personennamen. Keine Einrichtungsindividualdaten. Keine Trendbewertung. Keine Interpolation.',
      ...KITA_CSV_LIZENZ_META_LINES,
      '# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM',
      '',
    ];

    const csv = [...meta, header, ...csvRows].join('\n');
    const slug = `${raumA.id}-vs-${raumB.id}-${metric.key}`
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kita-regionenvergleich-verlauf-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!hatSerie) {
    return (
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>
          Verlauf der letzten 12 Monate (A vs. B)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Für die gewählten Räume liegt keine Planungsraum-Zeitreihe vor.
        </p>
      </div>
    );
  }

  const chipBase: React.CSSProperties = {
    fontSize: '0.8rem',
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface, #fff)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontWeight: 500,
  };
  const chipActive: React.CSSProperties = {
    ...chipBase,
    borderColor: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: 600,
  };

  const verlaufCsvLabel = `${raumA.bezeichnung} vs. ${raumB.bezeichnung} · ${metric.label}`;

  return (
    <div style={{ marginTop: '1.75rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'baseline' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>
            Verlauf der letzten 12 Monate (A vs. B)
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {raumA.bezeichnung} · {raumB.bezeichnung}
          </span>
        </div>
        <div
          className="no-print"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', flex: '0 1 auto' }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleVerlaufCsvDownload}
            style={{ fontSize: '0.8rem', flexShrink: 0, whiteSpace: 'nowrap' }}
            title={`CSV des aktiven Monatsverlaufs: ${verlaufCsvLabel}. ${KITA_CSV_LIZENZ_BUTTON_TITLE}`}
            aria-label={`Verlauf A vs. B als CSV herunterladen (${verlaufCsvLabel}; Lizenzhinweis im Metakopf)`}
          >
            CSV herunterladen (Verlauf)
          </button>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.4, maxWidth: '22rem', textAlign: 'right' }}>
            {KITA_CSV_LIZENZ_UI_HINWEIS}
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
        Dieselbe Raumauswahl im Monatsverlauf (US-KJ-010 AK&nbsp;4). Eine Kennzahl wählen — Werte A/B und Δ je Monat.
        CSV-Export lädt genau die aktive Kennzahl und Raumauswahl (12 Monate, Semikolon, UTF-8 BOM)
        inkl. Lizenzhinweis im Metakopf. Im Ausdruck: Kennzahl-Chips und CSV no-print; aktive Kennzahl
        steht im print-only Filterstand oben.
        Keine Interpolation, keine Trendbewertung. Meldemonat ({demoKitaMeldeeingang.monatsLabel}) mit
        Meldebasis-Hinweis, falls Lücke in A oder B.
      </p>

      <div
        className="no-print"
        role="group"
        aria-label="Kennzahl für Monatsverlauf A vs. B"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}
      >
        {VERLAUF_METRICS.map(m => (
          <button
            key={m.key}
            type="button"
            onClick={() => setVerlaufMetric(m.key)}
            style={verlaufMetric === m.key ? chipActive : chipBase}
            aria-pressed={verlaufMetric === m.key}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* print-only: aktive Verlaufskennzahl (ergänzt den Filterstand oben) */}
      <div
        className="print-only print-block"
        style={{
          marginBottom: '0.75rem',
          padding: '0.5rem 0.85rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          background: 'var(--color-neutral-light)',
          lineHeight: 1.45,
        }}
        role="note"
      >
        <strong>Druckfilter Verlauf A vs. B: </strong>
        Kennzahl {metric.label} · {raumA.bezeichnung} ({raumA.id}) vs. {raumB.bezeichnung} ({raumB.id})
        · {rows.length} Monate · keine Interpolation, keine Trendbewertung.
      </div>

      {hatMeldeLuecke && (
        <p
          role="status"
          style={{
            fontSize: '0.8rem',
            margin: '0 0 0.75rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--color-warning-light)',
            borderRadius: 'var(--radius)',
            borderLeft: '3px solid var(--color-warning)',
            color: 'var(--color-text)',
            lineHeight: 1.45,
          }}
        >
          Meldebasis unvollständig im Berichtsmonat {demoKitaMeldeeingang.monatsLabel}
          {lueckeA ? ` · A ${raumA.bezeichnung}` : ''}
          {lueckeB ? ` · B ${raumB.bezeichnung}` : ''}
          {' — '}Kennzahlen unverändert, keine Interpolation.
        </p>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Monat</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                A · {raumA.bezeichnung}
              </th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                B · {raumB.bezeichnung}
              </th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Δ (A − B)
              </th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Meldebasis</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const delta =
                sameRoom || row.vb === null
                  ? { text: '–', color: 'var(--color-text-muted)' }
                  : deltaDisplay(row.va, row.vb, metric.unit, metric.higherIsWorse);

              const showLuecke =
                row.isMeldeMonat &&
                hydrated &&
                ((basisA?.hatDatenluecke ?? false) || (basisB?.hatDatenluecke ?? false));

              return (
                <tr
                  key={row.monat}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: row.isMeldeMonat
                      ? 'var(--color-primary-light)'
                      : i % 2 === 0
                        ? 'transparent'
                        : 'var(--color-neutral-light)',
                    outline: showLuecke
                      ? basisA?.schwere === 'UEBERFAELLIG' || basisB?.schwere === 'UEBERFAELLIG'
                        ? '2px solid var(--color-danger)'
                        : '2px solid var(--color-warning)'
                      : undefined,
                    outlineOffset: showLuecke ? '-2px' : undefined,
                  }}
                >
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {row.monatLabel}
                    {row.isMeldeMonat && (
                      <span
                        className="badge badge-primary"
                        style={{ marginLeft: '0.4rem', fontSize: '0.7rem', verticalAlign: 'middle' }}
                      >
                        Berichtsmonat
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {formatVerlaufValue(row.va, metric.unit)}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {row.vb === null ? '–' : formatVerlaufValue(row.vb, metric.unit)}
                  </td>
                  <td
                    style={{
                      padding: '0.5rem 0.75rem',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: delta.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {delta.text}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                    {row.isMeldeMonat ? (
                      hydrated ? (
                        showLuecke ? (
                          <span
                            className="badge"
                            style={{
                              background: 'var(--color-warning-light)',
                              color: 'var(--color-warning)',
                              border: '1px solid var(--color-warning)',
                            }}
                          >
                            Meldelücke
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>Stichprobe ok</span>
                        )
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>…</span>
                      )
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>–</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ margin: '0.65rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
        Verlauf nutzt die raumbezogenen Demo-Zeitreihen (gleiche Anteile wie im Zeitreihenfilter).
        Δ je Monat = Wert A − Wert B zur gewählten Kennzahl. CSV enthält nur die aktive Kennzahl
        und Auswahl A/B inkl. Meldebasis-Spalte am Berichtsmonat sowie Open-Data-Lizenzhinweis im
        Metakopf (Demo vorläufig). Keine Kind- oder Personennamen.
      </p>
    </div>
  );
}
