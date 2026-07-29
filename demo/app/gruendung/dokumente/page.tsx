'use client';

import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import { berechneFairnessSignaleGruendung } from '@/lib/fairness/gruendung-rules';
import { Icon } from '@/components/Icon';
import type { DokumentStatusUG } from '@/types/gruendung';

const statusChip: Record<DokumentStatusUG, { label: string; css: string; icon: 'alert' | 'refresh' | 'check-circle' | 'x-circle' | 'upload' }> = {
  ANGEFORDERT: { label: 'Wird noch benötigt', css: 'status-chip-warning', icon: 'alert'        },
  HOCHGELADEN: { label: 'Hochgeladen',         css: 'status-chip-primary', icon: 'upload'       },
  IN_PRUEFUNG: { label: 'Wird geprüft',        css: 'status-chip-primary', icon: 'refresh'      },
  AKZEPTIERT:  { label: 'Akzeptiert',          css: 'status-chip-success', icon: 'check-circle' },
  ABGELEHNT:   { label: 'Abgelehnt',           css: 'status-chip-danger',  icon: 'x-circle'     },
};

const sortOrder: Record<DokumentStatusUG, number> = {
  ANGEFORDERT: 0, ABGELEHNT: 1, HOCHGELADEN: 2, IN_PRUEFUNG: 3, AKZEPTIERT: 4,
};

export default function DokumentePage() {
  const { akte, uploadDokument, sessionUploadedIds } = useGruendungState();
  const sorted = [...akte.dokumente].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
  const ausstehend = sorted.filter(d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT').length;
  const eingereicht = sorted.filter(d => d.status !== 'ANGEFORDERT' && d.status !== 'ABGELEHNT').length;
  const sessionUploadCount = sessionUploadedIds.length;
  const unterlagenSignal = berechneFairnessSignaleGruendung(akte).find(
    s => s.typ === 'UG_UNTERLAGE_FEHLT'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Ihre Unterlagen</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {ausstehend > 0
            ? `${ausstehend} Dokument${ausstehend > 1 ? 'e fehlen' : ' fehlt'} noch. Jede Anforderung enthält eine Begründung.`
            : 'Alle angeforderten Dokumente sind eingereicht.'}
        </p>
      </div>

      {/* Fortschrittsanzeige */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Eingereicht</span>
          <strong>{eingereicht} / {sorted.length}</strong>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${Math.round((eingereicht / sorted.length) * 100)}%` }} />
        </div>
      </div>

      {unterlagenSignal && (
        <div className="notice-box notice-box-warn" role="status">
          <Icon name="alert" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
              {unterlagenSignal.titel}
            </strong>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>{unterlagenSignal.erklaerung}</p>
            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0', color: 'var(--color-text-muted)' }}>
              Nach dem Hochladen entfällt dieses Signal auch unter{' '}
              <Link href="/gruendung/hinweise" style={{ color: 'var(--color-primary)' }}>Hinweise</Link>
              {' '}und im Verlauf erscheint ein Ereignis.
            </p>
          </div>
        </div>
      )}

      {ausstehend === 0 && (
        <div
          className="notice-box notice-box-success"
          role="status"
          data-testid="dok-alle-vorliegend"
        >
          <Icon name="check-circle" size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Alle angeforderten Unterlagen liegen vor</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Das Fairness-Signal zu fehlenden Unterlagen entfällt. Die Behördenbearbeitung kann fortgesetzt werden.
              {sessionUploadCount > 0 && (
                <span data-testid="dok-alle-vorliegend-session">
                  {' '}
                  In dieser Demo-Session {sessionUploadCount === 1 ? 'wurde 1 Unterlage' : `wurden ${sessionUploadCount} Unterlagen`} markiert.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {sorted.map(dok => {
        const chip = statusChip[dok.status];
        const isAusstehend = dok.status === 'ANGEFORDERT' || dok.status === 'ABGELEHNT';
        const istSessionUpload = sessionUploadedIds.includes(dok.id);
        const behörde = akte.beteiligteBehörden.find(b => b.id === dok.anforderndeBehördeId);

        return (
          <div
            key={dok.id}
            id={`dok-${dok.id}`}
            className="card"
            data-testid={`dokument-karte-${dok.id}`}
            style={{
              borderLeft: `4px solid ${isAusstehend ? 'var(--color-warning)' : dok.status === 'AKZEPTIERT' ? 'var(--color-success)' : 'var(--color-primary)'}`,
              scrollMarginTop: '5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem' }}>{dok.bezeichnung}</h3>
                {behörde && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Angefordert von: {behörde.bezeichnung}</span>
                )}
              </div>
              <span className={`status-chip ${chip.css}`}>
                <Icon name={chip.icon} size={14} />
                {chip.label}
              </span>
            </div>

            <div className="notice-box notice-box-neutral" style={{ marginBottom: '0.75rem' }}>
              <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.2rem' }}>Warum wird dieses Dokument benötigt?</strong>
                <span style={{ fontSize: '0.875rem' }}>{dok.begründung}</span>
              </div>
            </div>

            {isAusstehend && (
              <div className="notice-box notice-box-warn" style={{ marginBottom: '0.875rem' }}>
                <Icon name="alert" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.2rem' }}>Was passiert, wenn Sie es nicht einreichen?</strong>
                  <span style={{ fontSize: '0.875rem' }}>{dok.konsequenz}</span>
                </div>
              </div>
            )}

            {/* Mock-Einreichungszeile nur ohne Session-Upload (Quittung ersetzt sie). */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', marginBottom: isAusstehend || istSessionUpload ? '1rem' : 0 }}>
              {dok.frist && isAusstehend && (
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                  <Icon name="calendar" size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  Frist: {dok.frist}
                </span>
              )}
              {dok.hochgeladenAm && !istSessionUpload && (
                <span style={{ color: 'var(--color-text-muted)' }}>Hochgeladen: {dok.hochgeladenAm}</span>
              )}
              {dok.ablehnungsgrund && (
                <span style={{ color: 'var(--color-danger)' }}>Abgelehnt: {dok.ablehnungsgrund}</span>
              )}
            </div>

            {/* Lokale Upload-Quittung: sofort nach Session-Markierung auf der Karte (US-UG-003) */}
            {istSessionUpload && (
              <div
                className="notice-box notice-box-success"
                role="status"
                aria-live="polite"
                data-testid={`dok-upload-quittung-${dok.id}`}
                style={{ marginBottom: '0.875rem' }}
              >
                <Icon name="check-circle" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong
                    style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}
                    data-testid={`dok-upload-quittung-titel-${dok.id}`}
                  >
                    Upload bestätigt
                  </strong>
                  <p style={{ fontSize: '0.875rem', margin: 0 }} data-testid={`dok-upload-quittung-text-${dok.id}`}>
                    {dok.bezeichnung}
                    {dok.hochgeladenAm ? (
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {' '}
                        · eingereicht am {dok.hochgeladenAm}
                      </span>
                    ) : null}
                  </p>
                  <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>
                    Demo: Es wurde keine Datei gespeichert — der Status steht auf „Hochgeladen“.
                    Die Quittung gilt für diese Browser-Session.
                  </p>
                </div>
              </div>
            )}

            {isAusstehend && (
              <div>
                <label
                  className="upload-zone"
                  htmlFor={`ug-upload-${dok.id}`}
                  aria-label={`${dok.bezeichnung} hochladen`}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (document.getElementById(`ug-upload-${dok.id}`) as HTMLInputElement)?.click();
                    }
                  }}
                >
                  <div className="upload-zone-icon">
                    <Icon name="upload" size={28} />
                  </div>
                  <div className="upload-zone-label">Dokument hochladen</div>
                  <div className="upload-zone-hint">PDF, JPG oder PNG · 📷 Auch per Handykamera möglich</div>
                  <div className="upload-zone-hint" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Demo: Es wird keine Datei gespeichert — nur der Aktenstatus ändert sich.
                  </div>
                  <input
                    id={`ug-upload-${dok.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                    onChange={() => uploadDokument(dok.id)}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}
                  onClick={() => uploadDokument(dok.id)}
                >
                  Demo: Als hochgeladen markieren
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
