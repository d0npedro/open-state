'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';
import type { DokumentStatusUG } from '@/types/gruendung';

const statusChip: Record<DokumentStatusUG, { label: string; css: string; icon: 'alert' | 'refresh' | 'check-circle' | 'x-circle' }> = {
  ANGEFORDERT: { label: 'Wird noch benötigt', css: 'status-chip-warning', icon: 'alert'        },
  HOCHGELADEN: { label: 'Hochgeladen',         css: 'status-chip-primary', icon: 'refresh'      },
  IN_PRUEFUNG: { label: 'Wird geprüft',        css: 'status-chip-primary', icon: 'refresh'      },
  AKZEPTIERT:  { label: 'Akzeptiert',          css: 'status-chip-success', icon: 'check-circle' },
  ABGELEHNT:   { label: 'Abgelehnt',           css: 'status-chip-danger',  icon: 'x-circle'     },
};

const sortOrder: Record<DokumentStatusUG, number> = {
  ANGEFORDERT: 0, ABGELEHNT: 1, HOCHGELADEN: 2, IN_PRUEFUNG: 3, AKZEPTIERT: 4,
};

export default function DokumentePage() {
  const { akte } = useGruendungState();
  const sorted = [...akte.dokumente].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
  const ausstehend = sorted.filter(d => d.status === 'ANGEFORDERT').length;
  const eingereicht = sorted.filter(d => d.status !== 'ANGEFORDERT').length;

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

      {sorted.map(dok => {
        const chip = statusChip[dok.status];
        const isAusstehend = dok.status === 'ANGEFORDERT';
        const behörde = akte.beteiligteBehörden.find(b => b.id === dok.anforderndeBehördeId);

        return (
          <div key={dok.id} className="card" style={{
            borderLeft: `4px solid ${isAusstehend ? 'var(--color-warning)' : dok.status === 'AKZEPTIERT' ? 'var(--color-success)' : 'var(--color-primary)'}`,
          }}>
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

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', marginBottom: isAusstehend ? '1rem' : 0 }}>
              {dok.frist && (
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                  <Icon name="calendar" size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  Frist: {dok.frist}
                </span>
              )}
              {dok.hochgeladenAm && (
                <span style={{ color: 'var(--color-text-muted)' }}>Hochgeladen: {dok.hochgeladenAm}</span>
              )}
              {dok.ablehnungsgrund && (
                <span style={{ color: 'var(--color-danger)' }}>Abgelehnt: {dok.ablehnungsgrund}</span>
              )}
            </div>

            {isAusstehend && (
              <label className="upload-zone" aria-label={`${dok.bezeichnung} hochladen`}>
                <div className="upload-zone-icon">
                  <Icon name="upload" size={28} />
                </div>
                <div className="upload-zone-label">Dokument hochladen</div>
                <div className="upload-zone-hint">PDF, JPG oder PNG · 📷 Auch per Handykamera möglich</div>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}
