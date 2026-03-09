import { demoFall } from '@/data/mockFall';

export default function BescheidePage() {
  const { bescheide } = demoFall;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-006</span>
        <span>Bescheid verstehen</span>
      </div>
      <div><h1 style={{ marginBottom: '0.5rem' }}>Bescheide</h1><p>Ihre Bescheide in verständlicher und rechtlicher Fassung.</p></div>
      {bescheide.map(b => (
        <div key={b.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2>{b.typ}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Zugestellt am {b.datum}</span>
          </div>

          {/* Verständliche Erklärung - Standard */}
          <div style={{ marginBottom: '1.25rem', background: 'var(--color-success-light)', border: '1px solid #a3d9b8', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Verständliche Erklärung
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{b.entscheidung}</h3>
            <p style={{ color: 'var(--color-text)' }}>{b.erklaerung}</p>
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius)' }}>
              <strong style={{ fontSize: '0.875rem' }}>Begründung:</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{b.begruendung}</p>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-success)' }}>
              Rechtsgrundlage: {b.rechtsgrundlage}
            </div>
          </div>

          {/* Rechtliche Fassung - Aufklappbar */}
          <details style={{ marginBottom: '1.25rem' }}>
            <summary style={{ cursor: 'pointer', padding: '0.75rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 500 }}>
              Rechtliche Fassung (vollständiger Bescheidtext)
            </summary>
            <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'Georgia, serif' }}>
              {b.rechtlicheFassung}
            </div>
          </details>

          {/* Widerspruchsfrist */}
          <div style={{ background: 'var(--color-warning-light)', border: '1px solid #f0c060', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong>Widerspruchsfrist</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Sie können bis zum <strong>{b.widerspruchsfristAblauf}</strong> Widerspruch einlegen ({b.widerspruchsfristTage} Monat ab Zustellung).
              </p>
            </div>
            <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Widerspruch einlegen</button>
          </div>
        </div>
      ))}
    </div>
  );
}
