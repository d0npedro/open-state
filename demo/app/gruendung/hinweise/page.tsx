'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import { berechneFairnessSignaleGruendung } from '@/lib/fairness/gruendung-rules';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';

/** Initiale Signale aus dem unveränderten Mock – Vergleichsbasis für Reaktions-Banner */
const INITIAL_SIGNALE = berechneFairnessSignaleGruendung(demoGruendungsAkte);

export default function GruendungHinweisePage() {
  const { akte } = useGruendungState();
  const signale = berechneFairnessSignaleGruendung(akte);

  const relevant = signale.filter(s => s.prioritaet === 'RELEVANT');
  const hinweis  = signale.filter(s => s.prioritaet === 'HINWEIS');
  const info     = signale.filter(s => s.prioritaet === 'INFO');

  const geloestCount = INITIAL_SIGNALE.length - signale.length;
  const hatReaktion  = geloestCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Story-Badge */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-007</span>
        <span>Verfahrensfairness · Hinweise zur Gründungslage (Story geplant)</span>
      </div>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Hinweise zur Verfahrenslage</h1>
        <p>
          Diese Hinweise beschreiben den aktuellen Zustand Ihrer Gründungsakte sachlich und nachvollziehbar.
          Sie basieren auf den vorliegenden Falldaten und ersetzen keine Entscheidung der Behörden.
        </p>
      </div>

      {/* Reaktions-Banner (erscheint nach State-Wechsel) */}
      {hatReaktion && (
        <div style={{
          background: 'var(--color-success-light)',
          border: '1px solid var(--color-success)',
          borderLeft: '4px solid var(--color-success)',
          borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem',
          fontSize: '0.875rem',
        }}>
          <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--color-success)' }}>
            Regelwerk hat reagiert
          </strong>
          <p style={{ margin: 0, lineHeight: 1.55 }}>
            Durch Ihre Aktion (Rückfrage beantwortet) {geloestCount === 1 ? 'ist 1 Hinweis' : `sind ${geloestCount} Hinweise`} entfallen.
            Das Fairness-Regelwerk hat den geänderten Aktenzustand erkannt und die Liste aktualisiert.
          </p>
        </div>
      )}

      {/* Erklärungshinweis */}
      <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
          Was zeigt diese Seite?
        </strong>
        <p style={{ margin: 0, lineHeight: 1.55 }}>
          Jeder Hinweis erklärt, was im Gründungsverfahren gerade zutrifft, welche Auswirkung das hat
          und welcher nächste Schritt sinnvoll wäre. Die Hinweise werden aus dem Aktenzustand abgeleitet —
          aus offenen Rückfragen, Behördenstatus, ausstehenden Pflichtanmeldungen und Fristlage.
          Sie bewerten kein Vorhaben und treffen keine Entscheidung.
        </p>
      </div>

      {/* Signale */}
      {signale.length === 0 ? (
        <div className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <strong>Keine Hinweise</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Der Aktenzustand zeigt derzeit keine Auffälligkeiten.
          </p>
        </div>
      ) : (
        <>
          {relevant.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-warning)', marginBottom: '0.75rem' }}>
                Relevant ({relevant.length})
              </h2>
              <FairnessPanel signale={relevant} />
            </section>
          )}
          {hinweis.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Hinweise ({hinweis.length})
              </h2>
              <FairnessPanel signale={hinweis} />
            </section>
          )}
          {info.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral)', marginBottom: '0.75rem' }}>
                Informationen ({info.length})
              </h2>
              <FairnessPanel signale={info} />
            </section>
          )}
          <div style={{ padding: '0.875rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Die Hinweise werden automatisch aus den vorliegenden Aktendaten abgeleitet.
            Sie sind Orientierung — keine Rechtsauskunft und keine Entscheidung.
            Verantwortlich für die Verfahrensentscheidungen sind die beteiligten Behörden.
          </div>
        </>
      )}
    </div>
  );
}
