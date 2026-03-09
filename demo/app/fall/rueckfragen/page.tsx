import { demoFall } from '@/data/mockFall';

export default function RueckfragenPage() {
  const { rueckfragen } = demoFall;
  const offen = rueckfragen.filter(r => !r.beantwortet);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-004</span>
        <span>Rückfrage verstehen</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Rückfragen</h1>
        <p>{offen.length > 0 ? `${offen.length} offene Rückfrage(n) erfordern Ihre Antwort.` : 'Keine offenen Rückfragen.'}</p>
      </div>
      {rueckfragen.map(rq => (
        <div key={rq.id} className="card" style={{ borderLeft: rq.beantwortet ? '3px solid var(--color-success)' : '3px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className={`badge ${rq.beantwortet ? 'badge-success' : 'badge-warning'}`}>{rq.beantwortet ? 'Beantwortet' : 'Offen – Antwort erforderlich'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Gestellt am {rq.gestelltAm}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Was wird gefragt?</h3>
            <p style={{ color: 'var(--color-text)' }}>{rq.text}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem' }}>Warum wird das gefragt?</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{rq.begründung}</p>
            </div>
            <div style={{ background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem' }}>Was passiert, wenn Sie nicht antworten?</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{rq.konsequenz}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-warning)', fontWeight: 600 }}>Frist: {rq.frist} (noch {rq.fristTage} Tage)</span>
              {!rq.beantwortet && <button className="btn btn-primary">Rückfrage beantworten</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
