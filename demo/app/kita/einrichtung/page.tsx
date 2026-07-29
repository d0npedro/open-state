'use client';

/**
 * US-KJ-002 – Belegungsstand einsehen (Einrichtungsebene, Demo)
 *
 * Aggregierte Platzzahlen je Gruppe. Keine Kind- oder Vertragsdaten.
 */

import { demoKitaEinrichtung } from '@/data/mockKitaEinrichtung';
import type { GruppeEinschraenkung, KitaGruppeBelegung } from '@/types/kitaEinrichtung';
import Link from 'next/link';

function tageSeit(isoErfassung: string, isoHeute: string): number {
  const a = new Date(isoErfassung);
  const b = new Date(isoHeute);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function summe(gruppen: KitaGruppeBelegung[], key: keyof Pick<
  KitaGruppeBelegung,
  'genehmigtePlaetze' | 'belegtePlaetze' | 'reserviertePlaetze' | 'freiePlaetze'
>) {
  return gruppen.reduce((s, g) => s + g[key], 0);
}

function einschraenkungLabel(e: GruppeEinschraenkung): string {
  switch (e) {
    case 'TEMPORAER_GESCHLOSSEN':
      return 'Temporär geschlossen';
    case 'REDUZIERT':
      return 'Reduziert nutzbar';
    case 'PERSONALMANGEL':
      return 'Personalbedingt eingeschränkt';
    default:
      return 'Ohne Einschränkung';
  }
}

function downloadCsv() {
  const e = demoKitaEinrichtung;
  const header = [
    'Gruppe',
    'Altersgruppe',
    'Genehmigt',
    'Belegt',
    'Reserviert',
    'Frei',
    'Einschraenkung',
    'Hinweis',
  ].join(';');
  const rows = e.gruppen.map(g =>
    [
      g.bezeichnung,
      g.altersgruppe,
      g.genehmigtePlaetze,
      g.belegtePlaetze,
      g.reserviertePlaetze,
      g.freiePlaetze,
      einschraenkungLabel(g.einschraenkung),
      (g.einschraenkungHinweis ?? '').replace(/;/g, ','),
    ].join(';')
  );
  const csv = [
    `# Belegungsstand ${e.bezeichnung}`,
    `# Stand: ${e.standLabel} | Letzte Erfassung: ${e.letzteErfassung}`,
    `# Planungsraum: ${e.planungsraumBezeichnung} | Keine personenbezogenen Daten`,
    '',
    header,
    ...rows,
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `belegung-${e.id}-${e.letzteErfassung}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function KitaEinrichtungBelegungPage() {
  const e = demoKitaEinrichtung;
  const alter = tageSeit(e.letzteErfassung, e.fiktivesHeute);
  const datenVeraltet = alter > 3;

  const genehmigt = summe(e.gruppen, 'genehmigtePlaetze');
  const belegt = summe(e.gruppen, 'belegtePlaetze');
  const reserviert = summe(e.gruppen, 'reserviertePlaetze');
  const frei = summe(e.gruppen, 'freiePlaetze');
  const vollBelegt = frei === 0 && e.gruppen.every(g => g.einschraenkung !== 'TEMPORAER_GESCHLOSSEN' || g.belegtePlaetze === 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-002</span>
          <span>Belegungsstand · Demo: Einrichtung / Kita-Leitung</span>
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>{e.bezeichnung}</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          {e.traeger} · Planungsraum {e.planungsraumBezeichnung}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          borderLeft: `4px solid ${datenVeraltet ? 'var(--color-warning)' : 'var(--color-primary)'}`,
          fontSize: '0.875rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Zeitlicher Stand:</span>{' '}
          <strong>{e.standLabel}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Letzte Erfassung:</span>{' '}
          <strong>{e.letzteErfassung}</strong>
          {alter === 0 ? ' (heute im Demo-Zeitrahmen)' : ` (vor ${alter} Tag${alter === 1 ? '' : 'en'})`}
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>ID:</span>{' '}
          <span style={{ fontFamily: 'monospace' }}>{e.id}</span>
        </div>
      </div>

      {datenVeraltet && (
        <div className="notice-box notice-box-warn" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Daten veraltet</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Die letzte Erfassung liegt mehr als 3 Tage zurück. Bitte{' '}
              <Link href="/kita/tagesstand" style={{ color: 'var(--color-primary)' }}>
                Tagesstand aktualisieren (US-KJ-001)
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {!datenVeraltet && (
        <div className="notice-box notice-box-neutral" role="note">
          <div style={{ fontSize: '0.875rem' }}>
            <strong>Datenschutz:</strong> Nur aggregierte Platzzahlen. Keine Namen von Kindern, keine Vertrags- oder
            Adressdaten. Einrichtung und Träger sind fiktiv.
          </div>
        </div>
      )}

      {/* Gesamtübersicht (AK 4) */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Gesamtübersicht Einrichtung</h2>
          <button type="button" className="btn btn-secondary" onClick={downloadCsv} style={{ fontSize: '0.875rem' }}>
            CSV exportieren
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { l: 'Genehmigte Plätze', v: genehmigt },
            { l: 'Belegt', v: belegt },
            { l: 'Reserviert', v: reserviert },
            {
              l: 'Frei',
              v: frei,
              hl: frei === 0 ? 'var(--color-danger)' : 'var(--color-success)',
            },
          ].map(k => (
            <div key={k.l} className="card" style={{ borderTop: `3px solid ${k.hl ?? 'var(--color-primary)'}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: k.hl ?? 'var(--color-text)' }}>{k.v}</div>
            </div>
          ))}
        </div>
        {frei === 0 && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-danger)', fontWeight: 600 }}>
            {vollBelegt
              ? 'Derzeit keine freien Plätze in nutzbaren Gruppen. Aufnahmen nur über Nachrücker/Reservierungen abgestimmt möglich.'
              : 'Keine freien Plätze in den geöffneten Gruppen.'}
          </p>
        )}
      </section>

      {/* Gruppen (AK 1, 3) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Belegung je Gruppe</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {e.gruppen.map(g => {
            const geschlossen = g.einschraenkung === 'TEMPORAER_GESCHLOSSEN';
            const eng = g.freiePlaetze === 0 && !geschlossen;
            return (
              <div
                key={g.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${
                    geschlossen
                      ? 'var(--color-neutral)'
                      : eng
                        ? 'var(--color-danger)'
                        : g.einschraenkung === 'REDUZIERT'
                          ? 'var(--color-warning)'
                          : 'var(--color-success)'
                  }`,
                  opacity: geschlossen ? 0.92 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>{g.bezeichnung}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Altersgruppe {g.altersgruppe === 'U3' ? 'unter 3 Jahre' : g.altersgruppe === 'UE3' ? '3–6 Jahre' : 'gemischt'}
                    </span>
                  </div>
                  <span
                    className={`status-chip ${
                      geschlossen
                        ? 'status-chip-neutral'
                        : eng
                          ? 'status-chip-danger'
                          : g.einschraenkung === 'REDUZIERT'
                            ? 'status-chip-warning'
                            : 'status-chip-success'
                    }`}
                  >
                    {geschlossen
                      ? 'Geschlossen'
                      : eng
                        ? 'Voll belegt'
                        : `${g.freiePlaetze} frei`}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: g.einschraenkung !== 'KEINE' ? '0.75rem' : 0,
                  }}
                >
                  {[
                    { l: 'Genehmigt', v: g.genehmigtePlaetze },
                    { l: 'Belegt', v: g.belegtePlaetze },
                    { l: 'Reserviert', v: g.reserviertePlaetze },
                    { l: 'Frei', v: g.freiePlaetze },
                  ].map(k => (
                    <div key={k.l} style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.5rem 0.65rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
                      <strong>{k.v}</strong>
                    </div>
                  ))}
                </div>

                {g.einschraenkung !== 'KEINE' && (
                  <div className="notice-box notice-box-warn" style={{ margin: 0 }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>{einschraenkungLabel(g.einschraenkung)}</strong>
                      {g.einschraenkungHinweis && (
                        <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>{g.einschraenkungHinweis}</p>
                      )}
                      {g.einschraenkungBis && (
                        <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>
                          Voraussichtlich bis: {g.einschraenkungBis}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Aggregierte Daten fließen in das{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>Steuerungslagebild</Link>
        {' '}und den{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>öffentlichen Bericht</Link>
        {' '}ein — ohne Einrichtungsdetail in der Öffentlichkeit (DEC-004).{' '}
        Tagesstand:{' '}
        <Link href="/kita/tagesstand" style={{ color: 'var(--color-primary)' }}>Erfassen (US-KJ-001)</Link>
        {' · '}
        Monatsauswertung:{' '}
        <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)' }}>Monatsbericht (US-KJ-003)</Link>
        {' · '}
        <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>Meldung freigeben (US-KJ-004)</Link>.
      </div>
    </div>
  );
}
