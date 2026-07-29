'use client';

/**
 * US-KJ-003 – Monatsbericht abrufen (Einrichtungsebene, Demo)
 *
 * Aggregierte Monatsauswertung je Gruppe + Vorjahresvergleich.
 * Datenlücken sichtbar. CSV-Export und druckoptimierte Ansicht (PDF via Browser).
 * Demo-Umschalter: Monatsabschluss (lückenhaft) vs. laufender Monat (VORSCHAU)
 * mit gemischten Tagesstand-Quellen (FREIGEGEBEN / FEHLT / IN_ERFASSUNG).
 * Keine Kind- oder Personennamen.
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  demoKitaMonatsbericht,
  demoKitaMonatsberichtVorschau,
} from '@/data/mockKitaMonatsbericht';
import type {
  KitaMonatsbericht,
  MonatsberichtStatus,
  MonatsberichtTagesstandQuelle,
  MonatsberichtTagesstandQuellenStatus,
} from '@/types/kitaMonatsbericht';

type BerichtsModus = 'ABSCHLUSS' | 'VORSCHAU';

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
        hint: 'Alle Betriebstage mit freigegebenem Tagesstand (US-KJ-001).',
      };
    case 'LUECKENHAFT':
      return {
        label: 'Lückenhaft',
        color: 'var(--color-warning)',
        hint: 'Mindestens ein freigegebener Tagesstand fehlt – Werte basieren nur auf freigegebenen Tagen.',
      };
    case 'VORSCHAU':
      return {
        label: 'Vorschau',
        color: 'var(--color-primary)',
        hint: 'Monat noch nicht abgeschlossen. Kennzahlen nur aus freigegebenen Tagesständen bis Stichtag; Entwürfe und Lücken sind ausgewiesen.',
      };
  }
}

function quellenStatusMeta(
  s: MonatsberichtTagesstandQuellenStatus
): { label: string; color: string } {
  switch (s) {
    case 'FREIGEGEBEN':
      return { label: 'Freigegeben', color: 'var(--color-success)' };
    case 'FEHLT':
      return { label: 'Fehlt', color: 'var(--color-danger)' };
    case 'IN_ERFASSUNG':
      return { label: 'In Erfassung (nicht einbezogen)', color: 'var(--color-warning)' };
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

  const quellenHeader = [
    'Datum',
    'Status',
    'Tagesstand_ID',
    'Anwesend_Gesamt',
    'Personal_Ist_Stunden',
    'Schluessel_unterschritten',
    'Freigegeben_am',
    'Freigegeben_durch_Rolle',
  ].join(';');

  const quellenRows = b.tagesstandQuellen.map((q: MonatsberichtTagesstandQuelle) =>
    [
      q.datumIso,
      q.status,
      q.tagesstandId ?? '',
      q.anwesendGesamt ?? '',
      q.personalIstStundenGesamt ?? '',
      q.personalschluesselUnterschritten === null
        ? ''
        : q.personalschluesselUnterschritten
          ? 'ja'
          : 'nein',
      q.freigegebenAm ?? '',
      q.freigegebenDurchRolle ?? '',
    ].join(';')
  );

  const csv = [
    `# Monatsbericht ${b.einrichtungBezeichnung}`,
    `# Monat: ${b.monatsLabel} | Status: ${b.status}`,
    `# Freigegebene Tagesstände (US-KJ-001): ${b.erfassteTagesstaende}/${b.betriebstageImMonat}`,
    `# Fehlende Tage: ${b.fehlendeTage.length ? b.fehlendeTage.join(', ') : 'keine'}`,
    `# Keine personenbezogenen Daten`,
    '',
    header,
    ...rows,
    summe,
    '',
    '# Datenbasis: freigegebene Tagesstände je Betriebstag',
    quellenHeader,
    ...quellenRows,
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
  const [modus, setModus] = useState<BerichtsModus>('ABSCHLUSS');
  const b: KitaMonatsbericht =
    modus === 'VORSCHAU' ? demoKitaMonatsberichtVorschau : demoKitaMonatsbericht;
  const st = statusMeta(b.status);
  const luecke = b.fehlendeTage.length > 0;
  const freigegebenCount = b.tagesstandQuellen.filter(q => q.status === 'FREIGEGEBEN').length;
  const fehltCount = b.tagesstandQuellen.filter(q => q.status === 'FEHLT').length;
  const inErfassungCount = b.tagesstandQuellen.filter(q => q.status === 'IN_ERFASSUNG').length;
  const schluesselTage = b.tagesstandQuellen.filter(
    q => q.status === 'FREIGEGEBEN' && q.personalschluesselUnterschritten
  ).length;
  const istVorschau = b.status === 'VORSCHAU';

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

      {/* Demo: Abschluss vs. laufender Monat (VORSCHAU) */}
      <div
        className="no-print"
        role="group"
        aria-label="Berichtsmodus wählen"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
          Demo-Ansicht:
        </span>
        <button
          type="button"
          className={modus === 'ABSCHLUSS' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '0.85rem' }}
          onClick={() => setModus('ABSCHLUSS')}
          aria-pressed={modus === 'ABSCHLUSS'}
        >
          Abschluss Okt 2024 (lückenhaft)
        </button>
        <button
          type="button"
          className={modus === 'VORSCHAU' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '0.85rem' }}
          onClick={() => setModus('VORSCHAU')}
          aria-pressed={modus === 'VORSCHAU'}
        >
          Laufender Monat Nov 2024 (Vorschau)
        </button>
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
          <span style={{ color: 'var(--color-text-muted)' }}>Stand:</span>{' '}
          <strong>{b.standLabel}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Freigegebene Tagesstände:</span>{' '}
          <strong>
            {freigegebenCount}/{b.betriebstageImMonat}
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

      {istVorschau && (
        <div className="notice-box notice-box-neutral" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Vorschau – Monat noch nicht abgeschlossen</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Kennzahlen basieren nur auf freigegebenen Tagesständen bis zum Demo-Stichtag (
              {b.standLabel}). Entwürfe ({inErfassungCount}× „In Erfassung“) und fehlende Tage (
              {fehltCount}×) fließen nicht ein und werden nicht interpoliert. Noch ausstehende
              Betriebstage des Monats erscheinen erst nach dem jeweiligen Tag.
            </p>
          </div>
        </div>
      )}

      {luecke && (
        <div className="notice-box notice-box-warn" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Datenlücke ausgewiesen</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Fehlende Tagesstände (nicht interpoliert):{' '}
              <strong>{b.fehlendeTage.join(', ')}</strong>. Kennzahlen beziehen sich nur auf
              freigegebene Betriebstage ({freigegebenCount} von {b.betriebstageImMonat}
              {istVorschau ? ' bis Stichtag' : ''}).
            </p>
          </div>
        </div>
      )}

      <div className="notice-box notice-box-neutral" role="note">
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Datenschutz:</strong> Nur Aggregatwerte je Gruppe und Tag. Keine Kindnamen, keine
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
        <Link href="/kita/tagesstand" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
          Tagesstand erfassen (US-KJ-001)
        </Link>
        <Link href="/kita/einrichtung" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
          Zum Belegungsstand
        </Link>
      </div>

      {/* Datenbasis: freigegebene Tagesstände (US-KJ-001 → US-KJ-003) */}
      <section aria-labelledby="datenbasis-heading">
        <h2 id="datenbasis-heading" style={{ marginBottom: '0.5rem' }}>
          Datenbasis: freigegebene Tagesstände
        </h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Kennzahlen dieses Monatsberichts basieren ausschließlich auf freigegebenen Tagesständen
          (US-KJ-001). Entwürfe (Status „In Erfassung“) fließen nicht ein. Fehlende Tage werden als
          Lücke ausgewiesen und nicht interpoliert
          {istVorschau
            ? '. In der Vorschau sind gemischte Quellen bis zum Stichtag sichtbar; der Monat ist noch nicht abgeschlossen.'
            : '.'}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div className="card" style={{ borderTop: '3px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Freigegeben
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{freigegebenCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              fließen in Kennzahlen ein
            </div>
          </div>
          <div
            className="card"
            style={{
              borderTop: `3px solid ${fehltCount > 0 ? 'var(--color-danger)' : 'var(--color-success)'}`,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Fehlt</div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: fehltCount > 0 ? 'var(--color-danger)' : 'var(--color-text)',
              }}
            >
              {fehltCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Lücke, nicht interpoliert
            </div>
          </div>
          <div
            className="card"
            style={{
              borderTop: `3px solid ${
                inErfassungCount > 0 ? 'var(--color-warning)' : 'var(--color-border)'
              }`,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              In Erfassung
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: inErfassungCount > 0 ? 'var(--color-warning)' : 'var(--color-text)',
              }}
            >
              {inErfassungCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Entwurf – nicht einbezogen
            </div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Tage Schlüssel ↓
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{schluesselTage}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              aus freigegebenen Ständen (keine Auto-Meldung)
            </div>
          </div>
          <div className="card" style={{ borderTop: '3px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {istVorschau ? 'Betriebstage bis Stichtag' : 'Betriebstage'}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{b.betriebstageImMonat}</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              minWidth: '620px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.55rem 0.45rem' }}>Datum</th>
                <th style={{ padding: '0.55rem 0.45rem' }}>Status</th>
                <th style={{ padding: '0.55rem 0.45rem' }}>Anwesend (Σ)</th>
                <th style={{ padding: '0.55rem 0.45rem' }}>Personal Ist-h (Σ)</th>
                <th style={{ padding: '0.55rem 0.45rem' }}>Schlüssel</th>
                <th style={{ padding: '0.55rem 0.45rem' }}>Freigabe</th>
              </tr>
            </thead>
            <tbody>
              {b.tagesstandQuellen.map(q => {
                const qs = quellenStatusMeta(q.status);
                const fehlt = q.status === 'FEHLT';
                const inErfassung = q.status === 'IN_ERFASSUNG';
                const rowBg = fehlt
                  ? 'rgba(185, 28, 28, 0.04)'
                  : inErfassung
                    ? 'rgba(180, 120, 20, 0.06)'
                    : undefined;
                return (
                  <tr
                    key={q.datumIso}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: rowBg,
                    }}
                  >
                    <td style={{ padding: '0.55rem 0.45rem' }}>
                      <strong>{q.datumLabel}</strong>
                      {q.tagesstandId && (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontFamily: 'monospace',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {q.tagesstandId}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.55rem 0.45rem' }}>
                      <strong style={{ color: qs.color }}>{qs.label}</strong>
                    </td>
                    <td style={{ padding: '0.55rem 0.45rem' }}>
                      {q.anwesendGesamt === null ? '—' : q.anwesendGesamt}
                    </td>
                    <td style={{ padding: '0.55rem 0.45rem' }}>
                      {q.personalIstStundenGesamt === null
                        ? '—'
                        : q.personalIstStundenGesamt.toLocaleString('de-DE')}
                    </td>
                    <td style={{ padding: '0.55rem 0.45rem' }}>
                      {q.personalschluesselUnterschritten === null ? (
                        '—'
                      ) : q.personalschluesselUnterschritten ? (
                        <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                          unterschritten
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-success)' }}>ok</span>
                      )}
                    </td>
                    <td style={{ padding: '0.55rem 0.45rem', fontSize: '0.8rem' }}>
                      {fehlt ? (
                        <span style={{ color: 'var(--color-danger)' }}>
                          Kein freigegebener Stand – fließt nicht ein
                        </span>
                      ) : inErfassung ? (
                        <span style={{ color: 'var(--color-warning)' }}>
                          Entwurf / nicht freigegeben – fließt nicht in Kennzahlen ein
                        </span>
                      ) : (
                        <>
                          <div>{q.freigegebenAm}</div>
                          <div style={{ color: 'var(--color-text-muted)' }}>
                            {q.freigegebenDurchRolle}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Erfassung und Freigabe je Tag:{' '}
          <Link href="/kita/tagesstand" style={{ color: 'var(--color-primary)' }}>
            /kita/tagesstand
          </Link>{' '}
          (Demo-Stichtag; Monatsreihen fiktiv für {b.monatsLabel}
          {istVorschau ? ', gemischte Quellen bis Stichtag' : ''}).
        </p>
      </section>

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
        Tagesstand-Erfassung (Quelle):{' '}
        <Link href="/kita/tagesstand" style={{ color: 'var(--color-primary)' }}>
          /kita/tagesstand
        </Link>
        {' · '}
        Belegungsstand:{' '}
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
