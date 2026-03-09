import { demoFall } from '@/data/mockFall';

export default function TerminePage() {
  const { termine } = demoFall;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-005</span>
        <span>Termin einsehen und verstehen</span>
      </div>
      <div><h1 style={{ marginBottom: '0.5rem' }}>Termine</h1><p>Ihre anstehenden Termine im Verfahren.</p></div>
      {termine.length === 0 ? (
        <div className="card" style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2.5rem' }}>Derzeit keine Termine geplant.</div>
      ) : termine.map(t => (
        <div key={t.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className={`badge ${t.status === 'BESTAETIGT' ? 'badge-success' : t.status === 'ABGESAGT' ? 'badge-danger' : 'badge-neutral'}`}>
              {t.status === 'BESTAETIGT' ? 'Bestätigt' : t.status === 'ABGESAGT' ? 'Abgesagt' : 'Ausstehend'}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.datum}, {t.uhrzeit}</span>
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>{t.zweck}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Format</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.format === 'PERSOENLICH' ? 'Persönlich' : 'Digital'}</div>
            </div>
            {t.ort && (
              <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Ort</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.ort}</div>
              </div>
            )}
          </div>
          <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <strong style={{ fontSize: '0.875rem' }}>Vorbereitung:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              {t.vorbereitung.map((v, i) => <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{v}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
