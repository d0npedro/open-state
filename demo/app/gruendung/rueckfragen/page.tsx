'use client';

import { useGruendungState } from '@/context/GruendungStateContext';

export default function RueckfragenPage() {
  const { akte, answerRueckfrage } = useGruendungState();
  const offen = akte.rueckfragen.filter(r => !r.beantwortet).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-005</span>
        <span>Rückfrage beantworten (Story geplant)</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Rückfragen</h1>
        <p>{offen > 0 ? `${offen} offene Rückfrage${offen > 1 ? 'n' : ''} erfordern Ihre Antwort.` : 'Keine offenen Rückfragen.'}</p>
      </div>

      {/* Demo-Hinweis */}
      <div style={{
        padding: '0.625rem 0.875rem',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius)',
        borderLeft: '3px solid var(--color-primary)',
        fontSize: '0.8rem',
        color: 'var(--color-primary)',
      }}>
        Demo-Interaktion: Der Button „Rückfrage beantworten" aktualisiert den Fallzustand — auf dieser Seite und in der Fallübersicht.
      </div>

      {akte.rueckfragen.map(rq => {
        const behörde = akte.beteiligteBehörden.find(b => b.id === rq.anforderndeBehördeId);
        return (
          <div key={rq.id} className="card" style={{ borderLeft: rq.beantwortet ? '3px solid var(--color-success)' : '3px solid var(--color-warning)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`badge ${rq.beantwortet ? 'badge-success' : 'badge-warning'}`}>
                  {rq.beantwortet ? 'Beantwortet' : 'Offen – Antwort erforderlich'}
                </span>
                {behörde && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{behörde.bezeichnung}</span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Gestellt am {rq.gestelltAm}</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Was wird gefragt?</h3>
              <p style={{ color: 'var(--color-text)' }}>{rq.text}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Warum wird das gefragt?</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{rq.begründung}</p>
              </div>

              {!rq.beantwortet && (
                <div style={{ background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Was passiert, wenn Sie nicht antworten?</strong>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{rq.konsequenz}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                {!rq.beantwortet ? (
                  <>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                      Frist: {rq.frist}
                    </span>
                    <button className="btn btn-primary" onClick={() => answerRueckfrage(rq.id)}>
                      Rückfrage beantworten
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-success)', fontWeight: 600 }}>
                    ✓ Beantwortet — Finanzamt wurde informiert.
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
