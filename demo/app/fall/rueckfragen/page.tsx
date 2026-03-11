'use client';

import { useDemoState } from '@/context/DemoStateContext';
import { berechneFairnessSignale, berechneFristTage, FIKTIVES_HEUTE } from '@/lib/fairness/rules';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';

export default function RueckfragenPage() {
  const { fall, answerRueckfrage } = useDemoState();
  const { rueckfragen } = fall;
  const offen = rueckfragen.filter(r => !r.beantwortet);
  const fristSignale = berechneFairnessSignale(fall).filter(
    s => s.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT'
  );
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

      {fristSignale.length > 0 && (
        <FairnessPanel signale={fristSignale} kompakt={false} />
      )}

      {/* Demo-Hinweis auf Interaktivität */}
      <div style={{
        padding: '0.625rem 0.875rem',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius)',
        borderLeft: '3px solid var(--color-primary)',
        fontSize: '0.8rem',
        color: 'var(--color-primary)',
      }}>
        Demo-Interaktion: Der Button „Rückfrage beantworten" aktualisiert den Fallzustand sichtbar — auf dieser Seite und in der Fallübersicht.
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
            {!rq.beantwortet && (
              <div style={{ background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Was passiert, wenn Sie nicht antworten?</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{rq.konsequenz}</p>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              {!rq.beantwortet ? (
                <>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                    Frist: {rq.frist} (noch {berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE)} Tage)
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => answerRueckfrage(rq.id)}
                  >
                    Rückfrage beantworten
                  </button>
                </>
              ) : (
                <span style={{ fontSize: '0.875rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ Beantwortet — Sachbearbeitung wurde informiert.
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
