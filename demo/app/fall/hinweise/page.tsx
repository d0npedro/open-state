import { demoFall } from '@/data/mockFall';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';

export default function HinweisePage() {
  const signale = berechneFairnessSignale(demoFall);
  const relevant = signale.filter(s => s.prioritaet === 'RELEVANT');
  const hinweis = signale.filter(s => s.prioritaet === 'HINWEIS');
  const info = signale.filter(s => s.prioritaet === 'INFO');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Story-Badge */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-primary">US-AV-008</span>
        <span>Verfahrensfairness-Hinweise · Nachvollziehbarkeit</span>
      </div>

      {/* Seiten-Header */}
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Hinweise zur Verfahrenslage</h1>
        <p>
          Diese Hinweise beschreiben den aktuellen Zustand Ihres Falls sachlich und nachvollziehbar.
          Sie basieren auf den vorliegenden Falldaten und ersetzen keine Entscheidung der Sachbearbeitung.
        </p>
      </div>

      {/* Erklärungshinweis zur Funktion dieser Seite */}
      <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
          Was zeigt diese Seite?
        </strong>
        <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.55 }}>
          Jeder Hinweis erklärt, was im Verfahren gerade zutrifft, welche Auswirkung das hat
          und welcher nächste Schritt sinnvoll wäre. Die Hinweise werden aus dem Fallzustand
          abgeleitet – aus Dokumentstatus, offenen Rückfragen, Bescheidinhalt und Fristlage.
          Sie bewerten keine Person und treffen keine Entscheidung.
        </p>
      </div>

      {/* Übersicht */}
      {signale.length === 0 ? (
        <div className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <strong>Keine Hinweise</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Der Fallzustand zeigt derzeit keine Auffälligkeiten.
          </p>
        </div>
      ) : (
        <>
          {/* Relevant */}
          {relevant.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-warning)', marginBottom: '0.75rem' }}>
                Relevant ({relevant.length})
              </h2>
              <FairnessPanel signale={relevant} />
            </section>
          )}

          {/* Hinweise */}
          {hinweis.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Hinweise ({hinweis.length})
              </h2>
              <FairnessPanel signale={hinweis} />
            </section>
          )}

          {/* Info */}
          {info.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral)', marginBottom: '0.75rem' }}>
                Informationen ({info.length})
              </h2>
              <FairnessPanel signale={info} />
            </section>
          )}

          {/* Methodischer Hinweis am Ende */}
          <div style={{ padding: '0.875rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Die Hinweise auf dieser Seite werden automatisch aus den vorliegenden Falldaten abgeleitet.
            Sie sind Orientierung für Bürgerinnen und Bürger sowie für die Sachbearbeitung.
            Die Verantwortung für die Entscheidung liegt bei der zuständigen Person in der Behörde.
          </div>
        </>
      )}
    </div>
  );
}
