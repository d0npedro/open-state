'use client';

/**
 * US-KJ-003 – Monatsbericht abrufen (Einrichtungsebene, Demo)
 *
 * Aggregierte Monatsauswertung je Gruppe + Vorjahresvergleich.
 * Datenlücken sichtbar. CSV-Export und druckoptimierte Ansicht (PDF via Browser).
 * Keine Kind- oder Personennamen.
 */

import Link from 'next/link';
import { demoKitaMonatsbericht } from '@/data/mockKitaMonatsbericht';
import type { KitaMonatsbericht, MonatsberichtStatus } from '@/types/kitaMonatsbericht';

function fmtPct(n: number) {
  return `${n.toFixed(1).replace('.', ',')} %`;
}

function deltaPct(aktuell: number, vorjahr: number): { text: string; color: string } {
  const d = aktuell - vorjahr;
  if (Math.abs(d) < 0.05) return { text: '±0,0 PP', color: 'var(--color-text-muted)' };
  const sign = d > 0 ? '+' : '';
  // Höhere Anwesenheit/Auslastung oft positiv; Personalausfall umgekehrt – hier neutral farbig
  return {
    text: `${sign}${d.toFixed(1).replace('.', ',')} PP ggü. VJ`,
    color: 'var(--color-text-muted)',
  };
}

function statusMeta(s: MonatsberichtStatus): { label: string; color: string; hint: string } {
  switch (s) {
    case 'VOLLSTAENDIG':
      return {
        label: 'Vollständig',
        color: 'var(--color-success)',
        hint: 'Alle Betriebstage mit Tagesstand erfasst.',
      };
    case 'LUECKENHAFT':
      return {
        label: 'Lückenhaft',
        color: 'var(--color-warning)',
        hint: 'Mindestens ein Tagesstand fehlt – Werte basieren nur auf erfassten Tagen.',
      };
    case 'VORSCHAU':
      return {
        label: 'Vorschau',
        color: 'var(--color-primary)',
        hint: 'Monat noch nicht abgeschlossen.',
      };
  }
}

function downloadCsv(b: KitaMonatsbericht) {
  const header = [
    'Gruppe',
    'Altersgruppe',
    'Anwesenheitsquote_%',
    'Anwesenheitsquote_VJ_%',
    'Auslastung_%',
    'Auslastung_VJ_%',
    'Personalausfall_%',
    'Personalausfall_VJ_%',
    'Tage_Personalschluessel_unterschritten',
    'Tage_Personalschluessel_unterschritten_VJ',
  ].join(';');

  const rows = b.gruppen.map(g =>
    [
      g.bezeichnung,
      g.altersgruppe,
      g.anwesenheitsquoteProzent.toFixed(1).replace('.', ','),
      g.anwesenheitsquoteVorjahrProzent.toFixed(1).replace('.', ','),
      g.auslastungsgradProzent.toFixed(1).replace('.', ','),
      g.auslastungsgradVorjahrProzent.toFixed(1).replace('.', ','),
      g.personalAusfallquoteProzent.toFixed(1).replace('.', ','),
      g.personalAusfallquoteVorjahrProzent.toFixed(1).replace('.', ','),
      g.tagePersonalschluesselUnterschritten,
      g.tagePersonalschluesselUnterschrittenVorjahr,
    ].join(';')
  );

  const ges = b.gesamt;
  const summe = [
    'GESAMT',
    '',
    ges.anwesenheitsquoteProzent.toFixed(1).replace('.', ','),
    ges.anwesenheitsquoteVorjahrProzent.toFixed(1).replace('.', ','),
    ges.auslastungsgradProzent.toFixed(1).replace('.', ','),
    ges.auslastungsgradVorjahrProzent.toFixed(1).replace('.', ','),
    ges.personalAusfallquoteProzent.toFixed(1).replace('.', ','),
    ges.personalAusfallquoteVorjahrProzent.toFixed(1).replace('.', ','),
    ges.tagePersonalschluesselUnterschritten,
    ges.tagePersonalschluesselUnterschrittenVorjahr,
  ].join(';');

  const csv = [
    `# Monatsbericht ${b.einrichtungBezeichnung}`,
    `# Monat: ${b.monatsLabel} | Status: ${b.status}`,
    `# Erfasste Tagesstände: ${b.erfassteTagesstaende}/${b.betriebstageImMonat}`,
    `# Fehlende Tage: ${b.fehlendeTage.length ? b.fehlendeTage.join(', ') : 'keine'}`,
    `# Keine personenbezogenen Daten`,
    '',
    header,
    ...rows,
    summe,
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `monatsbericht-${b.einrichtungId}-${b.monatsIso}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function KitaMonatsberichtPage() {
  const b = demoKitaMonatsbericht;
  const st = statusMeta(b.status);
  const luecke = b.fehlendeTage.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '0.75rem',
          }}
        >
          <span className="badge badge-primary">US-KJ-003</span>
          <span>Monatsbericht · Demo: Einrichtung / Kita-Leitung</span>
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>Monatsbericht {b.monatsLabel}</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          {b.einrichtungBezeichnung} · {b.traeger} · Planungsraum {b.planungsraumBezeichnung}
        </p>
      </div>

      {/* Metadaten */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          borderLeft: `4px solid ${st.color}`,
          fontSize: '0.875rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>{' '}
          <strong style={{ color: st.color }}>{st.label}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Tagesstände:</span>{' '}
          <strong>
            {b.erfassteTagesstaende}/{b.betriebstageImMonat}
          </strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Vergleich:</span>{' '}
          <strong>{b.vorjahresLabel}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>ID:</span>{' '}
          <span style={{ fontFamily: 'monospace' }}>{b.id}</span>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{st.hint}</p>

      {luecke && (
        <div className="notice-box notice-box-warn" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Datenlücke ausgewiesen</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Fehlende Tagesstände (nicht interpoliert):{' '}
              <strong>{b.fehlendeTage.join(', ')}</strong>. Kennzahlen beziehen sich nur auf erfasste
              Betriebstage ({b.erfassteTagesstaende} von {b.betriebstageImMonat}).
            </p>
          </div>
        </div>
      )}

      <div className="notice-box notice-box-neutral" role="note">
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Datenschutz:</strong> Nur Aggregatwerte je Gruppe. Keine Kindnamen, keine
          Personalnamen. Keine automatische Übermittlung an Träger oder Jugendamt (US-KJ-004).
        </div>
      </div>

      {/* Aktionen */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => downloadCsv(b)}
          style={{ fontSize: '0.875rem' }}
        >
          CSV exportieren
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.print()}
          style={{ fontSize: '0.875rem' }}
        >
          Drucken / PDF
        </button>
        <Link href="/kita/einrichtung" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
          Zum Belegungsstand
        </Link>
      </div>

      {/* Gesamt */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Gesamtübersicht Einrichtung</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {(
            [
              {
                l: 'Anwesenheitsquote',
                v: fmtPct(b.gesamt.anwesenheitsquoteProzent),
                d: deltaPct(
                  b.gesamt.anwesenheitsquoteProzent,
                  b.gesamt.anwesenheitsquoteVorjahrProzent
                ),
              },
              {
                l: 'Auslastungsgrad',
                v: fmtPct(b.gesamt.auslastungsgradProzent),
                d: deltaPct(
                  b.gesamt.auslastungsgradProzent,
                  b.gesamt.auslastungsgradVorjahrProzent
                ),
                hl:
                  b.gesamt.auslastungsgradProzent >= 98
                    ? 'var(--color-danger)'
                    : undefined,
              },
              {
                l: 'Personalausfall',
                v: fmtPct(b.gesamt.personalAusfallquoteProzent),
                d: deltaPct(
                  b.gesamt.personalAusfallquoteProzent,
                  b.gesamt.personalAusfallquoteVorjahrProzent
                ),
                hl:
                  b.gesamt.personalAusfallquoteProzent > 10
                    ? 'var(--color-danger)'
                    : b.gesamt.personalAusfallquoteProzent > 7
                      ? 'var(--color-warning)'
                      : undefined,
              },
              {
                l: 'Tage Schlüssel unterschritten',
                v: String(b.gesamt.tagePersonalschluesselUnterschritten),
                d: {
                  text: `VJ: ${b.gesamt.tagePersonalschluesselUnterschrittenVorjahr}`,
                  color: 'var(--color-text-muted)',
                },
                hl:
                  b.gesamt.tagePersonalschluesselUnterschritten > 0
                    ? 'var(--color-warning)'
                    : 'var(--color-success)',
              },
            ] as const
          ).map(k => (
            <div
              key={k.l}
              className="card"
              style={{ borderTop: `3px solid ${'hl' in k && k.hl ? k.hl : 'var(--color-primary)'}` }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: ('hl' in k && k.hl) || 'var(--color-text)',
                }}
              >
                {k.v}
              </div>
              <div style={{ fontSize: '0.75rem', color: k.d.color, marginTop: '0.35rem' }}>
                {k.d.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Je Gruppe */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Kennzahlen je Gruppe</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              minWidth: '640px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Gruppe</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Anwesenheit</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Auslastung</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Personalausfall</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Schlüssel-Tage ↓</th>
              </tr>
            </thead>
            <tbody>
              {b.gruppen.map(g => {
                const geschlossen =
                  g.auslastungsgradProzent === 0 && g.anwesenheitsquoteProzent === 0;
                return (
                  <tr
                    key={g.gruppeId}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      opacity: geschlossen ? 0.85 : 1,
                    }}
                  >
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <strong>{g.bezeichnung}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {g.altersgruppe === 'U3'
                          ? 'unter 3 Jahre'
                          : g.altersgruppe === 'UE3'
                            ? '3–6 Jahre'
                            : 'gemischt'}
                        {geschlossen ? ' · im Monat geschlossen / ohne Belegung' : ''}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div>{fmtPct(g.anwesenheitsquoteProzent)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        VJ {fmtPct(g.anwesenheitsquoteVorjahrProzent)}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color:
                            g.auslastungsgradProzent >= 98
                              ? 'var(--color-danger)'
                              : 'var(--color-text)',
                        }}
                      >
                        {fmtPct(g.auslastungsgradProzent)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        VJ {fmtPct(g.auslastungsgradVorjahrProzent)}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div
                        style={{
                          color:
                            g.personalAusfallquoteProzent > 10
                              ? 'var(--color-danger)'
                              : 'var(--color-text)',
                        }}
                      >
                        {fmtPct(g.personalAusfallquoteProzent)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        VJ {fmtPct(g.personalAusfallquoteVorjahrProzent)}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <strong
                        style={{
                          color:
                            g.tagePersonalschluesselUnterschritten > 0
                              ? 'var(--color-warning)'
                              : 'var(--color-success)',
                        }}
                      >
                        {g.tagePersonalschluesselUnterschritten}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        VJ {g.tagePersonalschluesselUnterschrittenVorjahr}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodik (AK 4) */}
      <section>
        <h2 style={{ marginBottom: '0.75rem' }}>Berechnungsgrundlagen</h2>
        <div className="card" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
          <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <dt style={{ fontWeight: 600 }}>Anwesenheitsquote</dt>
              <dd style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)' }}>
                {b.methodik.anwesenheitDefinition}
              </dd>
            </div>
            <div>
              <dt style={{ fontWeight: 600 }}>Auslastungsgrad</dt>
              <dd style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)' }}>
                {b.methodik.auslastungDefinition}
              </dd>
            </div>
            <div>
              <dt style={{ fontWeight: 600 }}>Personalausfallquote</dt>
              <dd style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)' }}>
                {b.methodik.personalAusfallDefinition}
              </dd>
            </div>
            <div>
              <dt style={{ fontWeight: 600 }}>Personalschlüssel-Unterschreitung</dt>
              <dd style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)' }}>
                {b.methodik.personalschluesselDefinition}
              </dd>
            </div>
            <div>
              <dt style={{ fontWeight: 600 }}>Datenquelle</dt>
              <dd style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)' }}>
                {b.methodik.datenquelle}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Belegungsstand live:{' '}
        <Link href="/kita/einrichtung" style={{ color: 'var(--color-primary)' }}>
          /kita/einrichtung
        </Link>
        {' · '}
        Übermittlung an das Jugendamt erfordert aktive Freigabe:{' '}
        <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
          Meldung freigeben (US-KJ-004)
        </Link>
        .
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print { display: none !important; }
              body > div > header,
              body nav { display: none !important; }
              main { padding: 0 !important; }
            }
          `,
        }}
      />
    </div>
  );
}
