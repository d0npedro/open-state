'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';
import type { BehördeStatus, SchrittStatus } from '@/types/gruendung';
import type { IconName } from '@/components/Icon';

const behördeChip: Record<BehördeStatus, { label: string; css: string; icon: IconName }> = {
  NICHT_GESTARTET: { label: 'Noch nicht gestartet', css: 'status-chip-neutral', icon: 'clock'        },
  IN_BEARBEITUNG:  { label: 'In Bearbeitung',        css: 'status-chip-primary', icon: 'refresh'      },
  RUECKFRAGE_OFFEN:{ label: 'Rückfrage offen',       css: 'status-chip-warning', icon: 'alert'        },
  ABGESCHLOSSEN:   { label: 'Abgeschlossen',         css: 'status-chip-success', icon: 'check-circle' },
  BLOCKIERT:       { label: 'Blockiert',             css: 'status-chip-danger',  icon: 'x-circle'     },
};

const schrittIcon: Record<SchrittStatus, IconName> = {
  AUSSTEHEND:     'clock',
  IN_BEARBEITUNG: 'refresh',
  ABGESCHLOSSEN:  'check-circle',
  BLOCKIERT:      'x-circle',
};

const schrittColor: Record<SchrittStatus, string> = {
  AUSSTEHEND:     'var(--color-text-muted)',
  IN_BEARBEITUNG: 'var(--color-primary)',
  ABGESCHLOSSEN:  'var(--color-success)',
  BLOCKIERT:      'var(--color-danger)',
};

export default function BehoerdenPage() {
  const { akte } = useGruendungState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Behörden & Verfahrensschritte</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Alle beteiligten Stellen, ihre Rolle und der aktuelle Bearbeitungsstand — vollständig transparent.
        </p>
      </div>

      {akte.beteiligteBehörden.map(beh => {
        const chip = behördeChip[beh.status];
        const schritte = akte.verfahrensSchritte.filter(s => s.behördeId === beh.id);
        const abgeschlossen = schritte.filter(s => s.status === 'ABGESCHLOSSEN').length;

        return (
          <div key={beh.id} className="card" style={{
            borderLeft: `4px solid ${beh.status === 'ABGESCHLOSSEN' ? 'var(--color-success)' : beh.status === 'RUECKFRAGE_OFFEN' ? 'var(--color-warning)' : beh.status === 'IN_BEARBEITUNG' ? 'var(--color-primary)' : 'var(--color-border)'}`,
          }}>
            {/* Behörde-Kopf */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.2rem', fontSize: '1.1rem' }}>{beh.bezeichnung}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.4rem' }}>{beh.zustaendigeStelle}</p>
                <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{beh.rolle}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                <span className={`status-chip ${chip.css}`}>
                  <Icon name={chip.icon} size={14} />
                  {chip.label}
                </span>
                {schritte.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {abgeschlossen}/{schritte.length} Schritte erledigt
                  </span>
                )}
              </div>
            </div>

            {/* Kontakt */}
            {(beh.adresse || beh.kontakt) && (
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                {beh.adresse && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Icon name="map-pin" size={13} />
                    {beh.adresse}
                  </span>
                )}
                {beh.kontakt && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Icon name="paperclip" size={13} />
                    {beh.kontakt}
                  </span>
                )}
              </div>
            )}

            {/* Verfahrensschritte */}
            {schritte.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Verfahrensschritte
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {schritte.map(schritt => (
                    <div key={schritt.id} style={{
                      display: 'flex', gap: '0.875rem', padding: '0.75rem',
                      background: schritt.status === 'ABGESCHLOSSEN' ? 'var(--color-success-light, #f0fff4)'
                        : schritt.status === 'IN_BEARBEITUNG' ? 'var(--color-primary-light)'
                        : 'var(--color-neutral-light)',
                      borderRadius: 'var(--radius)',
                      borderLeft: `3px solid ${schrittColor[schritt.status]}`,
                    }}>
                      <div style={{ color: schrittColor[schritt.status], flexShrink: 0, marginTop: '2px' }}>
                        <Icon name={schrittIcon[schritt.status]} size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                          <strong style={{ fontSize: '0.9rem' }}>{schritt.bezeichnung}</strong>
                          <span style={{ fontSize: '0.75rem', color: schrittColor[schritt.status], fontWeight: 600, flexShrink: 0 }}>
                            {schritt.status === 'ABGESCHLOSSEN' ? 'Erledigt' : schritt.status === 'IN_BEARBEITUNG' ? 'In Bearbeitung' : schritt.status === 'BLOCKIERT' ? 'Blockiert' : 'Ausstehend'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>{schritt.beschreibung}</p>
                        {schritt.rechtsgrundlage && (
                          <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Rechtsgrundlage: {schritt.rechtsgrundlage}
                          </p>
                        )}
                        {schritt.erledigtAm && (
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-success)' }}>
                            Erledigt am {schritt.erledigtAm}{schritt.ergebnis && ` · ${schritt.ergebnis}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schritte.length === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Diese Behörde wird außerhalb von Open State direkt kontaktiert.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
