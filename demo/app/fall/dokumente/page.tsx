import { demoFall } from '@/data/mockFall';
import { DokumentStatus } from '@/types';

const statusInfo: Record<DokumentStatus, { label: string; badge: string }> = {
  ANGEFORDERT: { label: 'Ausstehend', badge: 'badge-warning' },
  HOCHGELADEN: { label: 'Hochgeladen', badge: 'badge-primary' },
  IN_PRUEFUNG: { label: 'In Prüfung', badge: 'badge-primary' },
  AKZEPTIERT: { label: 'Akzeptiert', badge: 'badge-success' },
  ABGELEHNT: { label: 'Abgelehnt', badge: 'badge-danger' },
};

export default function DokumentePage() {
  const { dokumente } = demoFall;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-003</span>
        <span>Unterlagen nachreichen</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Dokumente</h1>
        <p>Für Ihren Antrag sind folgende Unterlagen erforderlich. Jede Anforderung enthält eine Begründung.</p>
      </div>
      {dokumente.map(dok => {
        const si = statusInfo[dok.status];
        const ausstehend = dok.status === 'ANGEFORDERT';
        return (
          <div key={dok.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3>{dok.bezeichnung}</h3>
                  <span className={`badge ${si.badge}`}>{si.label}</span>
                </div>
                <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem', fontSize: '0.875rem' }}>
                  <strong>Warum wird dieses Dokument benötigt?</strong>
                  <p style={{ marginTop: '0.25rem' }}>{dok.begründung}</p>
                </div>
                {dok.frist && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-warning)', fontWeight: 500 }}>
                    Frist: {dok.frist}
                  </div>
                )}
                {dok.hochgeladenAm && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Hochgeladen am: {dok.hochgeladenAm}
                  </div>
                )}
              </div>
              {ausstehend && (
                <div>
                  <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', textAlign: 'center', minWidth: '140px', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.875rem' }}>
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
