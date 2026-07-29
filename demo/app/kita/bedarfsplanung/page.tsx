'use client';

/**
 * US-KJ-007 – Bedarfsplanungsentwurf (Demo)
 *
 * Leitet einen strukturierten Planungsentwurf aus dem bestehenden Kita-Lagebild ab.
 * Datenlücken je Planungsraum werden aus dem Meldeeingang abgeleitet (US-KJ-004→007):
 * z. B. Südost / Kita Sonnenwinkel überfällig, bis Session-Freigabe in /kita/meldung.
 * Keine automatischen Handlungsempfehlungen (Story-Nicht-Ziel).
 * Kommentar und „Zur Freigabe“ sind session-lokal, ohne Backend.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import type { Kapazitaetsmassnahme, PlanungsraumKennzahlen } from '@/types/kita';
import {
  KitaBedarfsplanungDatenbasisPanel,
  MeldebasisBadge,
  ResidualMeldeHinweis,
  ResidualMeldeSummenHinweis,
  useMeldeeingangFuerBedarfsplanung,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

const ENTWURF_VERSION = 'BP-2025-01-ENTWURF';
const PLANUNGSZEITRAUM = 'Kalenderjahr 2025 / 2026 (Entwurf)';
const DATENSTAND_QUELLE = 'Lagebild + Meldeeingang (freigegebene Aggregate)';

type EntwurfStatus = 'ENTWURF' | 'ZUR_FREIGABE';

function massnahmenFuerRaum(massnahmen: Kapazitaetsmassnahme[], raumId: string) {
  return massnahmen.filter(m => m.planungsraumId === raumId);
}

function planungsluecke(pr: PlanungsraumKennzahlen, massnahmen: Kapazitaetsmassnahme[]) {
  const geplant = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  // Bedarf annähernd: Warteliste (sichtbarer ungedeckter Bedarf) — Demo-Näherung
  const bedarf = pr.wartelisteBestand;
  const angebotHeute = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;
  const residual = Math.max(0, bedarf - angebotHeute - geplant);
  return { bedarf, angebotHeute, geplant, residual };
}

export default function BedarfsplanungPage() {
  const lb = demoKitaLagebild;
  const { base: meldeBase, session, hydrated, basen, byRaumId } =
    useMeldeeingangFuerBedarfsplanung();
  const [status, setStatus] = useState<EntwurfStatus>('ENTWURF');
  const [kommentar, setKommentar] = useState(
    'Entwurf basiert auf dem freigegebenen Lagebild. Demografie-Prognose noch nicht eingepflegt (offene Fachfrage US-KJ-007).'
  );

  const zeilen = useMemo(() => {
    return lb.planungsraeume.map(pr => {
      const massnahmen = massnahmenFuerRaum(lb.massnahmen, pr.id);
      const luecke = planungsluecke(pr, massnahmen);
      return { pr, massnahmen, luecke };
    });
  }, [lb]);

  const summeResidual = zeilen.reduce((s, z) => s + z.luecke.residual, 0);
  const summeGeplant = zeilen.reduce((s, z) => s + z.luecke.geplant, 0);
  const suedostLuecke = byRaumId.get('PR-03')?.hatDatenluecke ?? false;
  const residualByRaumId = useMemo(() => {
    const m = new Map<string, number>();
    for (const z of zeilen) m.set(z.pr.id, z.luecke.residual);
    return m;
  }, [zeilen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-007</span>
          <span>Bedarfsplanung · Demo: Jugendamt intern · § 80 SGB VIII</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Bedarfsplanungsentwurf</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '42rem' }}>
          Strukturierte Übersicht je Planungsraum auf Basis aktueller Versorgungsdaten.
          Dieser Entwurf ersetzt keinen politischen Beschluss und enthält keine automatischen Handlungsempfehlungen.
        </p>
      </div>

      {/* Metadaten / Versionierung (AK 3, 4) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          borderLeft: '4px solid var(--color-primary)',
          fontSize: '0.875rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Version</div>
          <strong style={{ fontFamily: 'monospace' }}>{ENTWURF_VERSION}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Planungszeitraum</div>
          <strong>{PLANUNGSZEITRAUM}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Datenstand</div>
          <strong>{lb.stand}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Quelle</div>
          <strong>{DATENSTAND_QUELLE}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Lagebild-Version</div>
          <strong>{lb.version}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Status</div>
          <strong style={{ color: status === 'ENTWURF' ? 'var(--color-warning)' : 'var(--color-primary)' }}>
            {status === 'ENTWURF' ? 'In Bearbeitung' : 'Zur Freigabe an JA-Leitung'}
          </strong>
        </div>
      </div>

      <div className="notice-box notice-box-neutral" role="note">
        <div>
          <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
            Methodik der Planungslücke (Demo)
          </strong>
          <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.55 }}>
            Planungslücke ≈ max(0, Wartelistenbestand − freie Plätze − geplante neue Plätze aus Kapazitätsmaßnahmen).
            Die Warteliste kann Mehrfachanmeldungen enthalten; die Lücke ist eine Planungshilfe, keine Prognose.
            Fehlende freigegebene Einrichtungsmeldungen (Meldeeingang) werden je Planungsraum als Datenlücke
            ausgewiesen und nicht interpoliert. Keine automatische Empfehlung für Neubau oder Standortwahl.
          </p>
        </div>
      </div>

      {/* Meldeeingang → Datenlücken je Planungsraum (US-KJ-004 → US-KJ-007, Fokus Südost) */}
      <KitaBedarfsplanungDatenbasisPanel
        basen={basen}
        session={session}
        hydrated={hydrated}
        monatsLabel={meldeBase.monatsLabel}
        fiktivesHeute={meldeBase.fiktivesHeute}
        methodikKurz={meldeBase.methodikKurz}
        highlightRaumId="PR-03"
      />

      {/* Kennzahlen-Summe */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderTop: '3px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Geplante neue Plätze (Maßnahmen)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>+{summeGeplant}</div>
        </div>
        <div className="card" style={{ borderTop: `3px solid ${summeResidual > 50 ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Summe residuale Planungslücken</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: summeResidual > 50 ? 'var(--color-danger)' : 'var(--color-text)' }}>
            {summeResidual}
          </div>
          {suedostLuecke && (
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', lineHeight: 1.35 }}>
              Südost: Residual methodisch an Meldelücke gekoppelt (Hinweis)
            </div>
          )}
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--color-neutral)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Planungsräume</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lb.planungsraeume.length}</div>
        </div>
      </div>

      {/* Residuale Lücke ↔ fehlende Meldung (Hinweis-only, Fokus Südost) */}
      <ResidualMeldeSummenHinweis
        basen={basen}
        residualByRaumId={residualByRaumId}
        highlightRaumId="PR-03"
      />

      {/* Tabelle je Planungsraum (AK 1, 2) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Planungsräume und Planungslücke</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                {[
                  'Planungsraum',
                  'Meldebasis',
                  'Versorgung U3',
                  'Versorgung Ü3',
                  'Warteliste',
                  'Druck',
                  'Frei heute',
                  'Geplant +',
                  'Planungslücke',
                  'Maßnahmen',
                ].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zeilen.map(({ pr, massnahmen, luecke }, i) => (
                <tr
                  key={pr.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background:
                      pr.id === 'PR-03' && suedostLuecke
                        ? 'var(--color-warning-light, #fff8e8)'
                        : i % 2 === 0
                          ? 'transparent'
                          : 'var(--color-neutral-light)',
                  }}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                    {pr.bezeichnung}
                    {pr.id === 'PR-03' && suedostLuecke && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        Meldeeingang kritisch
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <MeldebasisBadge basis={byRaumId.get(pr.id)} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>{pr.versorgungsquote.u3.toFixed(1)} %</td>
                  <td style={{ padding: '0.75rem' }}>{pr.versorgungsquote.ue3.toFixed(1)} %</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{pr.wartelisteBestand}</td>
                  <td style={{ padding: '0.75rem' }}>{pr.wartelisteDruckFaktor.toFixed(1)}×</td>
                  <td style={{ padding: '0.75rem' }}>{luecke.angebotHeute}</td>
                  <td style={{ padding: '0.75rem' }}>+{luecke.geplant}</td>
                  <td
                    style={{
                      padding: '0.75rem',
                      fontWeight: 700,
                      color:
                        luecke.residual > 40
                          ? 'var(--color-danger)'
                          : luecke.residual > 0
                            ? 'var(--color-warning)'
                            : 'var(--color-success)',
                    }}
                  >
                    {luecke.residual}
                    <ResidualMeldeHinweis
                      basis={byRaumId.get(pr.id)}
                      residual={luecke.residual}
                      compact
                    />
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {massnahmen.length === 0
                      ? '—'
                      : massnahmen.map(m => `${m.bezeichnung} (+${m.erwarteteNeuePlaetze})`).join('; ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Quelle je Zeile: freigegebenes Lagebild {lb.version} ({lb.stand}), Kommune {lb.kommuneBezeichnung};
          Meldebasis aus Demo-Stichprobe Meldeeingang (US-KJ-004). Keine Kind- oder Personennamen.
        </p>
      </section>

      {/* Kommentar + Freigabe-Workflow (AK 6) */}
      <section className="card">
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>Planungskommentar</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Fachliche Einschätzung der Planung — keine System-Empfehlung. Demo speichert den Text nur in der Browser-Session.
        </p>
        <label htmlFor="bp-kommentar" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Planungskommentar
        </label>
        <textarea
          id="bp-kommentar"
          value={kommentar}
          onChange={e => setKommentar(e.target.value)}
          disabled={status === 'ZUR_FREIGABE'}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            resize: 'vertical',
            background: status === 'ZUR_FREIGABE' ? 'var(--color-neutral-light)' : 'white',
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
          {status === 'ENTWURF' ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStatus('ZUR_FREIGABE')}
            >
              An JA-Leitung zur Freigabe senden (Demo)
            </button>
          ) : (
            <>
              <div className="notice-box notice-box-success" style={{ flex: 1, margin: 0 }}>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Zur Freigabe vorgemerkt</strong>
                  <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Demo: Keine echte Weiterleitung. In Produktion würde die JA-Leitung den Entwurf bestätigen (US-KJ-008).
                  </p>
                </div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => setStatus('ENTWURF')}>
                Entwurf wieder öffnen
              </button>
            </>
          )}
        </div>
      </section>

      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Verwandt:{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>Steuerungslagebild</Link>
        {' · '}
        <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>Monatsmeldung freigeben</Link>
        {' · '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>Öffentlicher Transparenzbericht</Link>
      </div>
    </div>
  );
}
