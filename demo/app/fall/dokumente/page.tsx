// UX-Grund: Dokument-Upload muss für jeden Menschen sofort verständlich sein.
'use client';
// Status-Visualisierung: Farbe + Icon + Text (triple redundancy).
// Upload-Zone: groß, fingerfreundlich, mit Kamera-Hinweis für Handy-Nutzer.

import { demoFall } from '@/data/mockFall';
import { DokumentStatus } from '@/types';
import { Icon } from '@/components/Icon';

const statusInfo: Record<DokumentStatus, { label: string; cssClass: string; icon: Parameters<typeof Icon>[0]['name'] }> = {
  ANGEFORDERT: { label: 'Wird noch benötigt',   cssClass: 'status-chip-warning', icon: 'alert' },
  HOCHGELADEN: { label: 'Hochgeladen',           cssClass: 'status-chip-primary', icon: 'upload' },
  IN_PRUEFUNG: { label: 'Wird geprüft',          cssClass: 'status-chip-primary', icon: 'eye' },
  AKZEPTIERT:  { label: 'Akzeptiert',            cssClass: 'status-chip-success', icon: 'check-circle' },
  ABGELEHNT:   { label: 'Abgelehnt — bitte neu', cssClass: 'status-chip-danger',  icon: 'x-circle' },
};

export default function DokumentePage() {
  const { dokumente } = demoFall;
  const ausstehend = dokumente.filter(d => d.status === 'ANGEFORDERT').length;
  const erledigt   = dokumente.filter(d => d.status === 'AKZEPTIERT').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Ihre Unterlagen</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {erledigt} von {dokumente.length} Unterlagen eingereicht
          {ausstehend > 0 && (
            <span style={{ fontWeight: 700, color: 'var(--color-warning)', marginLeft: '0.5rem' }}>
              · {ausstehend} fehlen noch
            </span>
          )}
        </p>
        {/* Fortschrittsbalken */}
        <div className="progress-bar-wrap" style={{ marginTop: '0.875rem' }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.round((erledigt / dokumente.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* ─── Ausstehende Dokumente zuerst ───────────────────────────
          UX-Grund: Progressive Disclosure + Priorität — was noch
          fehlt, steht immer oben. Erledigte kommen danach.          */}
      {[...dokumente].sort((a, b) => {
        const prio: Record<DokumentStatus, number> = {
          ANGEFORDERT: 0, ABGELEHNT: 1, HOCHGELADEN: 2, IN_PRUEFUNG: 3, AKZEPTIERT: 4,
        };
        return prio[a.status] - prio[b.status];
      }).map(dok => {
        const si = statusInfo[dok.status];
        const istAusstehend  = dok.status === 'ANGEFORDERT';
        const istAbgelehnt   = dok.status === 'ABGELEHNT';
        const brauchtUpload  = istAusstehend || istAbgelehnt;

        return (
          <div
            key={dok.id}
            className="card"
            style={{
              borderLeft: brauchtUpload ? '5px solid var(--color-warning)' : dok.status === 'AKZEPTIERT' ? '5px solid var(--color-success)' : '1px solid var(--color-border)',
            }}
          >
            {/* Dokumentenheader: Titel + Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius)',
                  background: brauchtUpload ? 'var(--color-warning-light)' : 'var(--color-neutral-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: brauchtUpload ? 'var(--color-warning)' : dok.status === 'AKZEPTIERT' ? 'var(--color-success)' : 'var(--color-primary)',
                }}>
                  <Icon name="file" size={20} />
                </div>
                <h3 style={{ fontWeight: 700, margin: 0, fontSize: '1rem' }}>{dok.bezeichnung}</h3>
              </div>
              <span className={`status-chip ${si.cssClass}`} style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                <Icon name={si.icon} size={14} />
                {si.label}
              </span>
            </div>

            {/* Warum wird das Dokument benötigt? */}
            <div className="notice-box notice-box-neutral" style={{ marginBottom: '0.875rem' }}>
              <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Warum wird das benötigt?</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>{dok.begründung}</p>
              </div>
            </div>

            {/* Frist und Upload-Datum */}
            {dok.frist && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.875rem' }}>
                <Icon name="calendar" size={15} />
                Einreichen bis: {dok.frist}
              </div>
            )}
            {dok.hochgeladenAm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <Icon name="check-circle" size={15} />
                Eingereicht am {dok.hochgeladenAm}
              </div>
            )}

            {/* Upload-Bereich */}
            {/* UX-Grund: Vollbreite Zone, min 140px Höhe, Kamera-Hinweis.
                Auch auf kleinstem Smartphone mit Daumen erreichbar.  */}
            {brauchtUpload && (
              <div>
                <label
                  className="upload-zone"
                  htmlFor={`upload-${dok.id}`}
                  aria-label={`${dok.bezeichnung} hochladen`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') (document.getElementById(`upload-${dok.id}`) as HTMLInputElement)?.click(); }}
                >
                  <div style={{ color: 'var(--color-primary)' }}>
                    <Icon name="upload" size={40} />
                  </div>
                  <span className="upload-zone-label">Dokument hochladen</span>
                  <span className="upload-zone-hint">
                    Tippen Sie hier · PDF, JPG, PNG · max. 10 MB
                  </span>
                  <span className="upload-zone-hint" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    📷 Auch per Handykamera möglich
                  </span>
                  <input
                    id={`upload-${dok.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                    onChange={() => alert('Demo: In der echten Anwendung würde die Datei hier hochgeladen.')}
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
