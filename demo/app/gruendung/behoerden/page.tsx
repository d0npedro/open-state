'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import type { BehördeStatus, SchrittStatus } from '@/types/gruendung';

const behördeStatusInfo: Record<BehördeStatus, { label: string; badge: string; borderColor: string }> = {
  NICHT_GESTARTET: { label: 'Noch nicht gestartet', badge: 'badge-neutral', borderColor: 'var(--color-border)' },
  IN_BEARBEITUNG:  { label: 'In Bearbeitung',        badge: 'badge-primary', borderColor: 'var(--color-primary)' },
  RUECKFRAGE_OFFEN:{ label: 'Rückfrage offen',       badge: 'badge-warning', borderColor: 'var(--color-warning)' },
  ABGESCHLOSSEN:   { label: 'Abgeschlossen',         badge: 'badge-success', borderColor: 'var(--color-success)' },
  BLOCKIERT:       { label: 'Blockiert',             badge: 'badge-danger',  borderColor: 'var(--color-danger)'  },
};

const schrittStatusInfo: Record<SchrittStatus, { label: string; color: string; icon: string }> = {
  AUSSTEHEND:    { label: 'Ausstehend',    color: 'var(--color-text-muted)', icon: '○' },
  IN_BEARBEITUNG:{ label: 'In Bearbeitung',color: 'var(--color-primary)',    icon: '◑' },
  ABGESCHLOSSEN: { label: 'Abgeschlossen', color: 'var(--color-success)',    icon: '✓' },
  BLOCKIERT:     { label: 'Blockiert',     color: 'var(--color-danger)',     icon: '✕' },
};

export default function BehoerdenPage() {
  const { akte } = useGruendungState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-003</span>
        <span>Beteiligte Behörden · Verfahrensschritte (Story geplant)</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Behörden & Verfahrensschritte</h1>
        <p>Übersicht aller beteiligten Behörden, ihrer Rolle im Gründungsverfahren und des aktuellen Bearbeitungsstands.</p>
      </div>

      {akte.beteiligteBehörden.map(beh => {
        const si = behördeStatusInfo[beh.status];
        const schritte = akte.verfahrensSchritte.filter(s => s.behördeId === beh.id);
        const abgeschlossen = schritte.filter(s => s.status === 'ABGESCHLOSSEN').length;

        return (
          <div key={beh.id} className="card" style={{ borderLeft: `4px solid ${si.borderColor}` }}>
            {/* Behörde-Kopf */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{beh.bezeichnung}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{beh.zustaendigeStelle}</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{beh.rolle}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                <span className={`badge ${si.badge}`}>{si.label}</span>
                {schritte.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {abgeschlossen}/{schritte.length} Schritte abgeschlossen
                  </span>
                )}
              </div>
            </div>

            {/* Kontakt */}
            {(beh.adresse || beh.kontakt) && (
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                {beh.adresse && <span>📍 {beh.adresse}</span>}
                {beh.kontakt && <span>✉ {beh.kontakt}</span>}
              </div>
            )}

            {/* Verfahrensschritte */}
            {schritte.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Verfahrensschritte
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {schritte.map(schritt => {
                    const ss = schrittStatusInfo[schritt.status];
                    return (
                      <div key={schritt.id} style={{
                        display: 'flex', gap: '0.875rem', padding: '0.75rem',
                        background: schritt.status === 'ABGESCHLOSSEN' ? 'var(--color-success-light, #f0fff4)' :
                          schritt.status === 'IN_BEARBEITUNG' ? 'var(--color-primary-light)' :
                          'var(--color-neutral-light)',
                        borderRadius: 'var(--radius)',
                        borderLeft: `3px solid ${ss.color}`,
                      }}>
                        <span style={{ color: ss.color, fontWeight: 700, fontSize: '0.95rem', flexShrink: 0, marginTop: '2px' }}>{ss.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{schritt.bezeichnung}</strong>
                            <span style={{ fontSize: '0.75rem', color: ss.color, fontWeight: 600, flexShrink: 0 }}>{ss.label}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>{schritt.beschreibung}</p>
                          {schritt.rechtsgrundlage && (
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              Rechtsgrundlage: {schritt.rechtsgrundlage}
                            </p>
                          )}
                          {schritt.erledigtAm && (
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-success)' }}>
                              Erledigt am {schritt.erledigtAm}
                              {schritt.ergebnis && ` · ${schritt.ergebnis}`}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {schritte.length === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Diese Behörde wird außerhalb von Open State direkt kontaktiert. Keine systemseitigen Schritte erfasst.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
