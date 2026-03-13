'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import type { DokumentStatusUG } from '@/types/gruendung';

const statusInfo: Record<DokumentStatusUG, { label: string; badge: string; borderColor: string }> = {
  ANGEFORDERT: { label: 'Ausstehend – Hochladen erforderlich', badge: 'badge-warning', borderColor: 'var(--color-warning)' },
  HOCHGELADEN: { label: 'Hochgeladen – Eingang bestätigt',      badge: 'badge-primary', borderColor: 'var(--color-primary)' },
  IN_PRUEFUNG: { label: 'In Prüfung',                           badge: 'badge-primary', borderColor: 'var(--color-primary)' },
  AKZEPTIERT:  { label: 'Akzeptiert',                           badge: 'badge-success', borderColor: 'var(--color-success)' },
  ABGELEHNT:   { label: 'Abgelehnt',                            badge: 'badge-danger',  borderColor: 'var(--color-danger)'  },
};

export default function DokumentePage() {
  const { akte } = useGruendungState();
  const ausstehend = akte.dokumente.filter(d => d.status === 'ANGEFORDERT').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-004</span>
        <span>Unterlagen einreichen (Story geplant)</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Dokumente</h1>
        <p>
          {ausstehend > 0
            ? `${ausstehend} Dokument${ausstehend > 1 ? 'e' : ''} stehen noch aus. Jede Anforderung enthält eine Begründung, warum das Dokument benötigt wird.`
            : 'Alle angeforderten Dokumente sind eingereicht oder in Bearbeitung.'}
        </p>
      </div>

      {akte.dokumente.map(dok => {
        const si = statusInfo[dok.status];
        const isAusstehend = dok.status === 'ANGEFORDERT';
        const behörde = akte.beteiligteBehörden.find(b => b.id === dok.anforderndeBehördeId);

        return (
          <div key={dok.id} className="card" style={{ borderLeft: `4px solid ${si.borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0 }}>{dok.bezeichnung}</h3>
                  <span className={`badge ${si.badge}`}>{si.label}</span>
                </div>

                {behörde && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Angefordert von: <strong>{behörde.bezeichnung}</strong>
                  </div>
                )}

                <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  <strong>Warum wird dieses Dokument benötigt?</strong>
                  <p style={{ marginTop: '0.25rem', marginBottom: 0 }}>{dok.begründung}</p>
                </div>

                {isAusstehend && (
                  <div style={{ background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', padding: '0.75rem', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <strong>Was passiert, wenn Sie es nicht einreichen?</strong>
                    <p style={{ marginTop: '0.25rem', marginBottom: 0 }}>{dok.konsequenz}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  {dok.frist && (
                    <span style={{ color: 'var(--color-warning)', fontWeight: 500 }}>Frist: {dok.frist}</span>
                  )}
                  {dok.hochgeladenAm && (
                    <span style={{ color: 'var(--color-text-muted)' }}>Hochgeladen: {dok.hochgeladenAm}</span>
                  )}
                  {dok.ablehnungsgrund && (
                    <span style={{ color: 'var(--color-danger)' }}>Ablehnungsgrund: {dok.ablehnungsgrund}</span>
                  )}
                </div>
              </div>

              {isAusstehend && (
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    border: '2px dashed var(--color-border)', borderRadius: 'var(--radius)',
                    padding: '1rem 1.5rem', textAlign: 'center', minWidth: '140px',
                    cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.875rem',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>↑</div>
                    <div>Dokument hochladen</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>PDF, JPG, PNG</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
