'use client';

/**
 * Interaktive Planungsraum-Ansicht für den öffentlichen Transparenzbericht.
 * Filter zeigt einen Raum oder alle; Maßnahmen folgen dem Filter.
 * Keine Fachlogik-Änderung — reine Darstellung (Q-074).
 */

import { useMemo, useState } from 'react';
import type { Kapazitaetsmassnahme, PlanungsraumKennzahlen } from '@/types/kita';

function auslastungBadge(pct: number): { color: string; label: string } {
  if (pct >= 98) return { color: 'var(--color-danger)', label: 'Kritisch' };
  if (pct >= 95) return { color: 'var(--color-warning)', label: 'Hoch' };
  return { color: 'var(--color-success)', label: 'Normal' };
}

function versorgungsquoteBadge(pct: number, altersgruppe: 'U3' | 'Ü3'): { color: string } {
  if (altersgruppe === 'U3') {
    if (pct < 35) return { color: 'var(--color-danger)' };
    if (pct < 45) return { color: 'var(--color-warning)' };
    return { color: 'var(--color-success)' };
  }
  if (pct < 75) return { color: 'var(--color-danger)' };
  if (pct < 85) return { color: 'var(--color-warning)' };
  return { color: 'var(--color-success)' };
}

const statusColor: Record<string, string> = {
  IN_PLANUNG: 'var(--color-neutral)',
  GENEHMIGT: 'var(--color-primary)',
  IM_BAU: 'var(--color-warning)',
  FERTIGGESTELLT: 'var(--color-success)',
};

const statusLabel: Record<string, string> = {
  IN_PLANUNG: 'In Planung',
  GENEHMIGT: 'Genehmigt',
  IM_BAU: 'Im Bau',
  FERTIGGESTELLT: 'Fertiggestellt',
};

const typLabel: Record<string, string> = {
  NEUBAU: 'Neubau',
  ERWEITERUNG: 'Erweiterung',
  UMBAU: 'Umbau',
};

interface Props {
  planungsraeume: PlanungsraumKennzahlen[];
  massnahmen: Kapazitaetsmassnahme[];
  csvSlot?: React.ReactNode;
}

export function KitaPlanungsraumExplorer({ planungsraeume, massnahmen, csvSlot }: Props) {
  const [selectedId, setSelectedId] = useState<string | 'ALL'>('ALL');

  const filteredRaeume = useMemo(
    () =>
      selectedId === 'ALL'
        ? planungsraeume
        : planungsraeume.filter(pr => pr.id === selectedId),
    [planungsraeume, selectedId]
  );

  const filteredMassnahmen = useMemo(
    () =>
      selectedId === 'ALL'
        ? massnahmen
        : massnahmen.filter(m => m.planungsraumId === selectedId),
    [massnahmen, selectedId]
  );

  const selectedRaum =
    selectedId === 'ALL' ? null : planungsraeume.find(pr => pr.id === selectedId) ?? null;

  const neuePlaetze = filteredMassnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  const imBau = filteredMassnahmen
    .filter(m => m.status === 'IM_BAU')
    .reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Planungsraum-Übersicht */}
      <section aria-labelledby="pr-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <h2 id="pr-heading">Versorgung nach Planungsraum</h2>
          {csvSlot}
        </div>

        {/* Filter-Chips */}
        <div
          role="group"
          aria-label="Planungsraum filtern"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}
        >
          <button
            type="button"
            className={selectedId === 'ALL' ? 'btn btn-primary' : 'btn btn-secondary'}
            aria-pressed={selectedId === 'ALL'}
            onClick={() => setSelectedId('ALL')}
            style={{ fontSize: '0.875rem', padding: '0.4rem 0.85rem' }}
          >
            Alle Räume
          </button>
          {planungsraeume.map(pr => {
            const active = selectedId === pr.id;
            const engpass = pr.wartelisteDruckFaktor > 10 || pr.auslastungsgradProzent >= 98;
            return (
              <button
                key={pr.id}
                type="button"
                className={active ? 'btn btn-primary' : 'btn btn-secondary'}
                aria-pressed={active}
                onClick={() => setSelectedId(pr.id)}
                style={{
                  fontSize: '0.875rem',
                  padding: '0.4rem 0.85rem',
                  borderColor: engpass && !active ? 'var(--color-warning)' : undefined,
                }}
              >
                {pr.bezeichnung}
                {engpass && (
                  <span style={{ marginLeft: '0.35rem', fontSize: '0.75rem', opacity: 0.9 }}>
                    · Engpass
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p
          role="status"
          aria-live="polite"
          style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}
        >
          {selectedId === 'ALL'
            ? `${planungsraeume.length} Planungsräume angezeigt`
            : `Gefiltert: ${selectedRaum?.bezeichnung ?? selectedId}`}
        </p>

        {/* Detailkarte bei Einzelauswahl */}
        {selectedRaum && (
          <div
            className="card"
            style={{
              marginBottom: '1rem',
              borderLeft: `4px solid ${
                selectedRaum.auslastungsgradProzent >= 98
                  ? 'var(--color-danger)'
                  : selectedRaum.wartelisteDruckFaktor > 10
                    ? 'var(--color-warning)'
                    : 'var(--color-primary)'
              }`,
            }}
          >
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>
              {selectedRaum.bezeichnung} — Detail
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Kinder U3 / Ü3</div>
                <strong>
                  {selectedRaum.einwohnerKinderU3.toLocaleString('de-DE')} /{' '}
                  {selectedRaum.einwohnerKinderUe3.toLocaleString('de-DE')}
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Freie Plätze U3 / Ü3</div>
                <strong style={{ color: selectedRaum.freiePlaetzeU3 <= 2 ? 'var(--color-danger)' : undefined }}>
                  {selectedRaum.freiePlaetzeU3} / {selectedRaum.freiePlaetzeUe3}
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Auslastung</div>
                <strong style={{ color: auslastungBadge(selectedRaum.auslastungsgradProzent).color }}>
                  {selectedRaum.auslastungsgradProzent.toFixed(1)} %
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Versorgung U3 / Ü3</div>
                <strong>
                  <span style={{ color: versorgungsquoteBadge(selectedRaum.versorgungsquote.u3, 'U3').color }}>
                    {selectedRaum.versorgungsquote.u3.toFixed(1)} %
                  </span>
                  {' / '}
                  <span style={{ color: versorgungsquoteBadge(selectedRaum.versorgungsquote.ue3, 'Ü3').color }}>
                    {selectedRaum.versorgungsquote.ue3.toFixed(1)} %
                  </span>
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Warteliste (Druck)</div>
                <strong>
                  {selectedRaum.wartelisteBestand}{' '}
                  <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>
                    ({selectedRaum.wartelisteDruckFaktor.toFixed(1)}×)
                  </span>
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Inklusion belegt/genehmigt</div>
                <strong>
                  {selectedRaum.inklusionsplaetzeBelegt} / {selectedRaum.inklusionsplaetzeGenehmigt}
                </strong>
              </div>
            </div>
            <p style={{ margin: '0.875rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Keine personen- oder einrichtungsbezogenen Daten. Aggregation auf Planungsraumebene (DEC-004).
            </p>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                {['Planungsraum', 'Frei U3', 'Frei Ü3', 'Auslastung', 'Versorgung U3', 'Versorgung Ü3', 'Warteliste', 'Personal-Ausfall'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRaeume.map((pr, i) => {
                const ausLast = auslastungBadge(pr.auslastungsgradProzent);
                const vqU3 = versorgungsquoteBadge(pr.versorgungsquote.u3, 'U3');
                const vqUe3 = versorgungsquoteBadge(pr.versorgungsquote.ue3, 'Ü3');
                const rowActive = selectedId === pr.id;
                return (
                  <tr
                    key={pr.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: rowActive
                        ? 'var(--color-primary-light, #e8f0fb)'
                        : i % 2 === 0
                          ? 'transparent'
                          : 'var(--color-neutral-light)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedId(prev => (prev === pr.id ? 'ALL' : pr.id))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(prev => (prev === pr.id ? 'ALL' : pr.id));
                      }
                    }}
                    tabIndex={0}
                    aria-selected={rowActive}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{pr.bezeichnung}</td>
                    <td style={{ padding: '0.75rem', color: pr.freiePlaetzeU3 <= 2 ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: pr.freiePlaetzeU3 <= 2 ? 700 : 400 }}>
                      {pr.freiePlaetzeU3}
                    </td>
                    <td style={{ padding: '0.75rem', color: pr.freiePlaetzeUe3 <= 5 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                      {pr.freiePlaetzeUe3}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: ausLast.color, fontWeight: 600 }}>{pr.auslastungsgradProzent.toFixed(1)} %</span>
                      <span style={{ fontSize: '0.75rem', color: ausLast.color, marginLeft: '0.4rem' }}>({ausLast.label})</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: vqU3.color, fontWeight: 600 }}>{pr.versorgungsquote.u3.toFixed(1)} %</td>
                    <td style={{ padding: '0.75rem', color: vqUe3.color, fontWeight: 600 }}>{pr.versorgungsquote.ue3.toFixed(1)} %</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: pr.wartelisteDruckFaktor > 10 ? 'var(--color-danger)' : pr.wartelisteDruckFaktor > 4 ? 'var(--color-warning)' : 'var(--color-text)', fontWeight: 600 }}>
                        {pr.wartelisteBestand}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>
                        (Druck: {pr.wartelisteDruckFaktor.toFixed(1)}x)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: pr.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' : pr.personalAusfallquoteProzent > 8 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                      {pr.personalAusfallquoteProzent.toFixed(1)} %
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>■</span> Kritisch</span>
          <span><span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>■</span> Erhöht</span>
          <span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>■</span> Normal</span>
          <span>Druck-Faktor: Wartelistenanfragen / freie Plätze. Wert &gt; 1 = Engpass</span>
          <span>Zeile anklicken filtert auf den Planungsraum</span>
        </div>
      </section>

      {/* Kapazitätsmaßnahmen (gefiltert) */}
      <section aria-labelledby="massnahmen-heading">
        <h2 id="massnahmen-heading" style={{ marginBottom: '1rem' }}>
          Laufende Kapazitätserweiterungen
          {selectedRaum && (
            <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
              · {selectedRaum.bezeichnung}
            </span>
          )}
        </h2>

        {filteredMassnahmen.length === 0 ? (
          <div className="card" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Für diesen Planungsraum sind derzeit keine Kapazitätsmaßnahmen im Bericht hinterlegt.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                  {['Maßnahme', 'Planungsraum', 'Typ', 'Status', 'Neue Plätze', 'Fertigstellung', 'Rechtsgrundlage'].map(h => (
                    <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMassnahmen.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-neutral-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.bezeichnung}</td>
                    <td style={{ padding: '0.75rem' }}>{m.planungsraumBezeichnung}</td>
                    <td style={{ padding: '0.75rem' }}>{typLabel[m.typ] ?? m.typ}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: statusColor[m.status], fontWeight: 600 }}>{statusLabel[m.status] ?? m.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>+{m.erwarteteNeuePlaetze}</td>
                    <td style={{ padding: '0.75rem' }}>{m.geplanteFertigstellung}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{m.rechtsgrundlage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Geplante Gesamtkapazität{selectedRaum ? ` (${selectedRaum.bezeichnung})` : ''}:{' '}
          <strong>+{neuePlaetze} Plätze</strong>.
          Davon bereits im Bau: <strong>+{imBau} Plätze</strong>.
        </p>
      </section>
    </div>
  );
}
