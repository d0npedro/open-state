'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';

export default function RueckfragenPage() {
  const { akte, answerRueckfrage } = useGruendungState();
  const offeneAnzahl = akte.rueckfragen.filter(r => !r.beantwortet).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Rückfragen der Behörden</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {offeneAnzahl > 0
            ? `${offeneAnzahl} Frage${offeneAnzahl > 1 ? 'n brauchen' : ' braucht'} Ihre Antwort.`
            : 'Alle Fragen sind beantwortet.'}
        </p>
      </div>

      <div className="notice-box notice-box-info">
        <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          <strong>Demo:</strong> Klicken Sie auf „Rückfrage beantworten" — der Status ändert sich in der gesamten App.
        </span>
      </div>

      {akte.rueckfragen.map(rq => {
        const behörde = akte.beteiligteBehörden.find(b => b.id === rq.anforderndeBehördeId);

        return (
          <div key={rq.id} className="card" style={{
            borderLeft: rq.beantwortet ? '5px solid var(--color-success)' : '5px solid var(--color-warning)',
          }}>
            {/* Status-Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.125rem' }}>
              <span className={`status-chip ${rq.beantwortet ? 'status-chip-success' : 'status-chip-warning'}`}>
                <Icon name={rq.beantwortet ? 'check-circle' : 'alert'} size={15} />
                {rq.beantwortet ? 'Beantwortet' : 'Ihre Antwort erwartet'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Gefragt am {rq.gestelltAm}
                {behörde && ` · ${behörde.bezeichnung}`}
              </span>
            </div>

            {/* Die Frage */}
            <div style={{ marginBottom: '1.125rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Was wird gefragt?
              </div>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
                {rq.text}
              </p>
            </div>

            {/* Warum + Was passiert */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.125rem' }}>
              <div className="notice-box notice-box-neutral">
                <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Warum fragt die Behörde das?</strong>
                  <span style={{ fontSize: '0.875rem' }}>{rq.begründung}</span>
                </div>
              </div>

              <div className="notice-box notice-box-warn">
                <Icon name="alert" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                    Was passiert, wenn Sie nicht antworten?
                  </strong>
                  <span style={{ fontSize: '0.875rem' }}>{rq.konsequenz}</span>
                </div>
              </div>
            </div>

            {/* Frist + Button oder Bestätigung */}
            {rq.beantwortet ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.95rem' }}>
                <Icon name="check-circle" size={20} />
                Beantwortet — die Behörde wurde informiert.
              </div>
            ) : (
              <div style={{
                background: 'var(--color-warning-light)', borderRadius: 'var(--radius)',
                padding: '1rem', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-warning)', fontSize: '0.95rem' }}>
                  <Icon name="calendar" size={16} />
                  Frist: {rq.frist}
                </div>
                <button
                  className="btn btn-primary btn-inline"
                  onClick={() => answerRueckfrage(rq.id)}
                  aria-label={`Rückfrage beantworten: ${rq.text}`}
                >
                  Rückfrage beantworten
                  <Icon name="send" size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {akte.rueckfragen.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>
            <Icon name="check-circle" size={48} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--color-success)' }}>Keine offenen Fragen</h2>
          <p>Die Behörden haben zurzeit keine Rückfragen an Sie.</p>
        </div>
      )}
    </div>
  );
}
