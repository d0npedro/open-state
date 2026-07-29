'use client';

/**
 * US-KJ-008 – Politische Vorlage vorbereiten und freigeben (Demo)
 *
 * Entwurf aus Steuerungslagebild + Bedarfsplanung-Kennzahlen.
 * Freigabe nur aktiv durch JA-Leitung (simuliert). Keine automatischen Beschlüsse.
 * Export: druckoptimierte Ansicht (Browser-Druck → PDF).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';

type VorlageStatus = 'ENTWURF' | 'ZUR_FREIGABE' | 'FREIGEGEBEN' | 'ZURUECKGEGEBEN';

const VORLAGE_ID = 'JHA-2025-KITA-01';
const GREMIUM = 'Jugendhilfeausschuss Musterstadt';
const SITZUNG = 'Geplante Sitzung: 18. März 2025 (Demo)';

function planungslueckeResidual(
  warteliste: number,
  freie: number,
  geplant: number
): number {
  return Math.max(0, warteliste - freie - geplant);
}

export default function PolitischeVorlagePage() {
  const lb = demoKitaLagebild;
  const g = lb.gesamt;

  const [status, setStatus] = useState<VorlageStatus>('ENTWURF');
  const [titel, setTitel] = useState(
    'Lagebericht Kindertagesbetreuung und Kapazitätsentwicklung 2025'
  );
  const [sachtext, setSachtext] = useState(
    'Das Jugendamt legt dem Ausschuss die aktuelle Versorgungslage und die aus dem Bedarfsplanungsentwurf abgeleiteten Planungslücken vor. ' +
      'Die Zahlen stammen aus dem freigegebenen Steuerungslagebild. ' +
      'Es werden keine Beschlussvorschläge automatisiert erzeugt; die politische Abwägung bleibt dem Gremium vorbehalten.'
  );
  const [freigabeHinweis, setFreigabeHinweis] = useState('');
  const [freigabeStamp, setFreigabeStamp] = useState<{ am: string; rolle: string } | null>(null);

  const raumZeilen = useMemo(() => {
    return lb.planungsraeume.map(pr => {
      const massnahmen = lb.massnahmen.filter(m => m.planungsraumId === pr.id);
      const geplant = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
      const frei = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;
      const residual = planungslueckeResidual(pr.wartelisteBestand, frei, geplant);
      return {
        id: pr.id,
        name: pr.bezeichnung,
        vqU3: pr.versorgungsquote.u3,
        vqUe3: pr.versorgungsquote.ue3,
        warteliste: pr.wartelisteBestand,
        druck: pr.wartelisteDruckFaktor,
        geplant,
        residual,
      };
    });
  }, [lb]);

  const summeGeplant = raumZeilen.reduce((s, r) => s + r.geplant, 0);
  const summeResidual = raumZeilen.reduce((s, r) => s + r.residual, 0);
  const engpass = [...raumZeilen].sort((a, b) => b.druck - a.druck).slice(0, 3);

  const statusLabel: Record<VorlageStatus, string> = {
    ENTWURF: 'Entwurf in Bearbeitung',
    ZUR_FREIGABE: 'Wartet auf Freigabe (JA-Leitung)',
    FREIGEGEBEN: 'Freigegeben',
    ZURUECKGEGEBEN: 'Zurückgegeben zur Überarbeitung',
  };

  const statusColor: Record<VorlageStatus, string> = {
    ENTWURF: 'var(--color-warning)',
    ZUR_FREIGABE: 'var(--color-primary)',
    FREIGEGEBEN: 'var(--color-success)',
    ZURUECKGEGEBEN: 'var(--color-danger)',
  };

  const editierbar = status === 'ENTWURF' || status === 'ZURUECKGEGEBEN';
  const freigegeben = status === 'FREIGEGEBEN';

  function freigeben() {
    const am = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFreigabeStamp({ am, rolle: 'Jugendamtsleitung (Demo-Rolle)' });
    setStatus('FREIGEGEBEN');
  }

  function zurueckgeben() {
    setFreigabeStamp(null);
    setFreigabeHinweis(
      freigabeHinweis ||
        'Bitte Methodik-Abschnitt und Engpass-Formulierungen für die öffentliche Sitzung prüfen.'
    );
    setStatus('ZURUECKGEGEBEN');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Kopf – nicht drucken: Steuerleiste */}
      <div className="no-print">
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-008</span>
          <span>Politische Vorlage · Demo: JA-intern · Gremienvorlage</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Politische Vorlage</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '44rem' }}>
          Entwurf aus dem aktuellen Steuerungslagebild. Freigabe nur durch aktive Bestätigung der Jugendamtsleitung.
          Keine automatischen Beschlussvorschläge.
        </p>
      </div>

      {/* Status + Aktionen */}
      <div className="no-print card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status</div>
          <strong style={{ color: statusColor[status] }}>{statusLabel[status]}</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Vorlage-ID <span style={{ fontFamily: 'monospace' }}>{VORLAGE_ID}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {editierbar && (
            <button type="button" className="btn btn-primary" onClick={() => setStatus('ZUR_FREIGABE')}>
              Zur Freigabe vorlegen
            </button>
          )}
          {status === 'ZUR_FREIGABE' && (
            <>
              <button type="button" className="btn btn-primary" onClick={freigeben}>
                Als JA-Leitung freigeben (Demo)
              </button>
              <button type="button" className="btn btn-secondary" onClick={zurueckgeben}>
                Zurückgeben
              </button>
            </>
          )}
          {freigegeben && (
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
              Drucken / als PDF speichern
            </button>
          )}
          {status === 'FREIGEGEBEN' && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStatus('ENTWURF');
                setFreigabeStamp(null);
              }}
            >
              Neuen Entwurf öffnen
            </button>
          )}
        </div>
      </div>

      {status === 'ZURUECKGEGEBEN' && freigabeHinweis && (
        <div className="no-print notice-box notice-box-warn" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Korrektur angefordert</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{freigabeHinweis}</p>
          </div>
        </div>
      )}

      {/* Druckbarer Vorlagenkörper */}
      <article
        className="card vorlage-print"
        style={{
          padding: '1.5rem',
          borderTop: freigegeben ? '4px solid var(--color-success)' : '4px solid var(--color-primary)',
        }}
      >
        {freigegeben && freigabeStamp && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.875rem 1rem',
              background: 'var(--color-success-light)',
              border: '1px solid var(--color-success)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
            }}
          >
            <strong style={{ color: 'var(--color-success)' }}>Freigegeben</strong>
            <div style={{ marginTop: '0.35rem' }}>
              {freigabeStamp.rolle} · {freigabeStamp.am}
            </div>
            <div style={{ marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              Nachweis: {VORLAGE_ID} · unveränderlicher Freigabe-Zeitstempel (Demo-Session)
            </div>
          </div>
        )}

        <header style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            {GREMIUM} · {SITZUNG}
          </p>
          {editierbar ? (
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Titel</span>
              <input
                type="text"
                value={titel}
                onChange={e => setTitel(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '0.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'inherit',
                }}
              />
            </label>
          ) : (
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{titel}</h2>
          )}
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            Vorlage {VORLAGE_ID} · Datenstand Lagebild: <strong>{lb.stand}</strong> · Version {lb.version} ·
            Freigabe Lagebild: {lb.freigegebenVon}, {lb.freigegebenAm}
          </p>
        </header>

        {/* Kernzahlen aus Lagebild */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>1. Versorgungslage (Gesamtkommune)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { l: 'Real nutzbare Plätze', v: g.realNutzbarePlaetze.toLocaleString('de-DE') },
              { l: 'Belegt', v: g.belegtePlaetze.toLocaleString('de-DE') },
              { l: 'Frei', v: String(g.freiePlaetze) },
              { l: 'Auslastung', v: `${g.auslastungsgradProzent.toFixed(1)} %` },
              { l: 'Warteliste', v: String(g.wartelisteBestand) },
              { l: 'Versorgung U3', v: `${g.versorgungsquote.u3.toFixed(1)} %` },
              { l: 'Versorgung Ü3', v: `${g.versorgungsquote.ue3.toFixed(1)} %` },
            ].map(k => (
              <div key={k.l} style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.65rem 0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
                <div style={{ fontWeight: 700 }}>{k.v}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>2. Engpass-Räume (nach Wartelistendruck)</h3>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
            {engpass.map(r => (
              <li key={r.id}>
                <strong>{r.name}</strong> — Druck {r.druck.toFixed(1)}×, Warteliste {r.warteliste},
                residuale Planungslücke {r.residual}
              </li>
            ))}
          </ol>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>3. Planungslücken und geplante Kapazität</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Summe geplanter neuer Plätze (Maßnahmen): <strong>+{summeGeplant}</strong> ·
            Summe residuale Planungslücken: <strong>{summeResidual}</strong>
            {' '}(Näherung: Warteliste − freie Plätze − geplante Plätze; siehe Bedarfsplanung).
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                  {['Planungsraum', 'VQ U3', 'VQ Ü3', 'Warteliste', 'Geplant +', 'Lücke'].map(h => (
                    <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raumZeilen.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'var(--color-neutral-light)' : 'transparent' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: '0.6rem' }}>{r.vqU3.toFixed(1)} %</td>
                    <td style={{ padding: '0.6rem' }}>{r.vqUe3.toFixed(1)} %</td>
                    <td style={{ padding: '0.6rem' }}>{r.warteliste}</td>
                    <td style={{ padding: '0.6rem' }}>+{r.geplant}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{r.residual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>4. Sachdarstellung</h3>
          {editierbar ? (
            <textarea
              value={sachtext}
              onChange={e => setSachtext(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                lineHeight: 1.55,
                resize: 'vertical',
              }}
            />
          ) : (
            <p style={{ fontSize: '0.95rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{sachtext}</p>
          )}
        </section>

        {/* Methodik (AK 5) */}
        <section style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>5. Methodik und Einschränkungen</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
            <li>
              Datenbasis: Steuerungslagebild {lb.version}, Stand {lb.stand}, freigegeben {lb.freigegebenAm} durch {lb.freigegebenVon}.
            </li>
            <li>
              Zeitraum: {lb.berichtszeitraum}. Planungsbezug: Entwurf Bedarfsplanung (siehe{' '}
              <Link href="/kita/bedarfsplanung" className="no-print" style={{ color: 'var(--color-primary)' }}>/kita/bedarfsplanung</Link>
              <span className="print-only"> Binnenroute Bedarfsplanung</span>).
            </li>
            <li>
              Planungslücke ist eine Demo-Näherung (Warteliste kann Mehrfachanmeldungen enthalten). Keine demografische Prognose.
            </li>
            <li>Keine personen- oder einrichtungsbezogenen Einzeldaten in dieser Vorlage.</li>
            {lb.methodik.slice(0, 3).map(m => (
              <li key={m.kennzahl}>
                <strong>{m.kennzahl}:</strong> {m.definition}
                {m.einschraenkungen ? ` Einschränkung: ${m.einschraenkungen}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Diese Vorlage ist ein Sachbericht der Verwaltung für politische Beratung. Sie enthält keine automatischen
          Handlungsempfehlungen und ersetzt keine Beschlussfassung des Gremiums.
        </p>
      </article>

      <div className="no-print" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Verwandt:{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>Steuerungslagebild</Link>
        {' · '}
        <Link href="/kita/bedarfsplanung" style={{ color: 'var(--color-primary)' }}>Bedarfsplanung</Link>
        {' · '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>Öffentlicher Bericht</Link>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-only { display: none; }
            @media print {
              .no-print { display: none !important; }
              .print-only { display: inline !important; }
              body > div > header,
              body nav { display: none !important; }
              main { padding: 0 !important; }
              .vorlage-print {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
