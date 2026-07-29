// UX-Grund: Termine sind zeitkritisch. Datum + Uhrzeit müssen SOFORT lesbar sein —
// groß, hervorgehoben. Vorbereitung als Checkliste (vertrautes Mental-Modell).
// Format-Chip: "Persönlich / Online" mit Icon.
// Q-092: unbestätigte Termine session-lokal bestätigen → Tab-Badge entfällt live.
// Q-196: Session-Bestätigung mit Quittung + Verlauf-Tiefenlink (Parität RQ/Upload).
'use client';

import Link from 'next/link';
import {
  demoTerminBestaetigungEreignisId,
  useDemoState,
} from '@/context/DemoStateContext';
import { Icon } from '@/components/Icon';

export default function TerminePage() {
  const { fall, confirmTermin, sessionConfirmedTerminIds } = useDemoState();
  const { termine } = fall;
  const hatKommende = termine.some(t => t.status !== 'ABGESAGT');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Ihre Termine</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {hatKommende ? 'Bitte erscheinen Sie pünktlich und vorbereitet.' : 'Derzeit sind keine Termine geplant.'}
        </p>
        {termine.some(t => t.status === 'AUSSTEHEND') && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <strong>Demo:</strong> «Termin bestätigen» speichert nur in dieser Browser-Session — der Tab-Zähler verschwindet sofort.
          </p>
        )}
      </div>

      {/* ─── Termine ─────────────────────────────────────────────── */}
      {termine.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ marginBottom: '0.75rem', color: 'var(--color-border)' }}>
            <Icon name="calendar" size={48} />
          </div>
          <p>Derzeit keine Termine geplant.</p>
        </div>
      ) : (
        termine.map(t => {
          const bestaetigt = t.status === 'BESTAETIGT';
          const abgesagt   = t.status === 'ABGESAGT';
          const ausstehend = t.status === 'AUSSTEHEND';
          const istSessionBestaetigung = sessionConfirmedTerminIds.includes(t.id);

          return (
            <div
              key={t.id}
              className="card"
              data-testid={`termin-karte-${t.id}`}
              style={{
                borderLeft: bestaetigt
                  ? '5px solid var(--color-success)'
                  : abgesagt
                    ? '5px solid var(--color-danger)'
                    : '5px solid var(--color-warning)',
                opacity: abgesagt ? 0.6 : 1,
              }}
            >
              {/* Status + Format */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span
                  className={`status-chip ${bestaetigt ? 'status-chip-success' : abgesagt ? 'status-chip-danger' : 'status-chip-warning'}`}
                  data-testid={`termin-status-${t.id}`}
                >
                  <Icon name={bestaetigt ? 'check-circle' : abgesagt ? 'x-circle' : 'info'} size={14} />
                  {bestaetigt ? 'Bestätigt' : abgesagt ? 'Abgesagt' : 'Ausstehend'}
                </span>
                <span className={`status-chip ${t.format === 'PERSOENLICH' ? 'status-chip-primary' : 'status-chip-neutral'}`}
                  style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}
                >
                  <Icon name={t.format === 'PERSOENLICH' ? 'user' : 'send'} size={13} />
                  {t.format === 'PERSOENLICH' ? 'Persönlich' : 'Online / Digital'}
                </span>
              </div>

              {/* Terminzweck — Hauptinfo */}
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.125rem' }}>{t.zweck}</h2>

              {/* Datum + Uhrzeit: groß und klar — UX-Grund: Das ist die kritischste Info */}
              <div style={{
                background: bestaetigt ? 'var(--color-primary-light)' : 'var(--color-neutral-light)',
                borderRadius: 'var(--radius)',
                padding: '1rem 1.25rem',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Icon name="calendar" size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>Datum</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>{t.datum}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Icon name="clock" size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>Uhrzeit</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>{t.uhrzeit} Uhr</div>
                  </div>
                </div>
                {t.ort && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <Icon name="map-pin" size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>Ort</div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>{t.ort}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Vorbereitung als Checkliste */}
              {/* UX-Grund: Checkliste ist ein universell bekanntes Mental-Modell.
                  Jeder Mensch hat schon mal eine Einkaufsliste gesehen.         */}
              {t.vorbereitung.length > 0 && (
                <div style={{ marginBottom: ausstehend || istSessionBestaetigung ? '1rem' : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                    <Icon name="scroll" size={16} />
                    Das bringen Sie bitte mit:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {t.vorbereitung.map((v, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>
                          <Icon name="check-circle" size={16} />
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Q-092: session-lokale Bestätigung — Badge in Navigation aktualisiert live */}
              {ausstehend && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    paddingTop: '0.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', flex: '1 1 12rem' }}>
                    Bitte bestätigen Sie Ihre Teilnahme, damit die Agentur planen kann.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-inline"
                    onClick={() => confirmTermin(t.id)}
                    aria-label={`Termin bestätigen: ${t.zweck}`}
                    data-testid={`termin-bestaetigen-${t.id}`}
                  >
                    <Icon name="check-circle" size={16} />
                    Termin bestätigen
                  </button>
                </div>
              )}

              {/* Session-Bestätigung: Quittung + Verlauf-Tiefenlink (Q-196, US-AV-005/007) */}
              {bestaetigt && istSessionBestaetigung && (
                <div
                  className="notice-box notice-box-success"
                  role="status"
                  aria-live="polite"
                  data-testid={`termin-bestaetigt-quittung-${t.id}`}
                  style={{ marginTop: '0.75rem' }}
                >
                  <Icon name="check-circle" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <strong
                        style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}
                        data-testid={`termin-bestaetigt-hinweis-${t.id}`}
                      >
                        Teilnahme bestätigt
                      </strong>
                      <p style={{ fontSize: '0.875rem', margin: 0 }} data-testid={`termin-bestaetigt-text-${t.id}`}>
                        {t.zweck}
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {' '}
                          · {t.datum}, {t.uhrzeit} Uhr
                        </span>
                      </p>
                      <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>
                        Keine weitere Handlung zu diesem Termin nötig.
                        Demo: Die Bestätigung gilt für diese Browser-Session.
                      </p>
                    </div>
                    <Link
                      href={`/fall/verlauf#ere-${demoTerminBestaetigungEreignisId(t.id)}`}
                      className="btn btn-secondary btn-inline"
                      style={{
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        minHeight: 44,
                      }}
                      data-testid={`termin-verlauf-link-${t.id}`}
                      aria-label={`Terminbestätigung für ${t.zweck} im Verlauf ansehen`}
                    >
                      <Icon name="clock" size={16} />
                      Im Verlauf ansehen
                    </Link>
                  </div>
                </div>
              )}

              {bestaetigt && !istSessionBestaetigung && (
                <p
                  data-testid={`termin-bestaetigt-hinweis-${t.id}`}
                  style={{
                    margin: '0.75rem 0 0',
                    fontSize: '0.875rem',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Icon name="check-circle" size={16} />
                  Teilnahme bestätigt — keine weitere Handlung zu diesem Termin nötig.
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
