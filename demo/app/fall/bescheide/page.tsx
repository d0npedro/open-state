// UX-Grund: Ein Bescheid ist eine der wichtigsten Dokumente im Leben eines Menschen.
'use client';
// Dual-Layer Prinzip: Erst die menschliche Erklärung (groß, klar),
// dann die rechtliche Fassung (optional, für wer sie braucht).
// Widerspruchsfrist: klar hervorgehoben, mit Countdown-Hinweis.

import { demoFall } from '@/data/mockFall';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { Icon } from '@/components/Icon';

export default function BescheidePage() {
  const { bescheide } = demoFall;
  const bescheidSignale = berechneFairnessSignale(demoFall).filter(
    s => s.typ === 'BESCHEID_VORLAEUFIG' || s.typ === 'BESCHEID_BEGRUENDUNG_ERWEITERBAR'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Ihr Bescheid</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Hier finden Sie alle Entscheidungen der Behörde — in verständlicher und in rechtlicher Fassung.
        </p>
      </div>

      {/* Fairness-Hinweise für Bescheide (z.B. vorläufig) */}
      {bescheidSignale.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bescheidSignale.map(sig => (
            <div key={sig.id} className="notice-box notice-box-warn">
              <Icon name="alert" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{sig.titel}</strong>
                <span style={{ fontSize: '0.875rem' }}>{sig.erklaerung}</span>
                {sig.naechsterSchritt && (
                  <div style={{ marginTop: '0.375rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    → {sig.naechsterSchritt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Bescheide ───────────────────────────────────────────── */}
      {bescheide.map(b => (
        <div key={b.id} className="card">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{b.typ}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              Zugestellt am {b.datum}
            </span>
          </div>

          {/* ─── EBENE 1: Menschliche Erklärung (immer aufgeklappt) ──
              UX-Grund: Grandma-Test — die Entscheidung muss in unter
              10 Sekunden verstanden sein. Grüne Box = gutes Ergebnis. */}
          <div style={{
            background: 'var(--color-success-light)',
            border: '2px solid #86efac',
            borderRadius: 'var(--radius-lg)',
            padding: '1.375rem',
            marginBottom: '1.125rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ color: 'var(--color-success)' }}>
                <Icon name="check-circle" size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Was wurde entschieden?
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              {b.entscheidung}
            </h3>

            <p style={{ color: 'var(--color-text)', lineHeight: 1.65, marginBottom: '1rem', fontSize: '0.95rem' }}>
              {b.erklaerung}
            </p>

            {/* Begründung */}
            <div style={{ background: 'rgba(255,255,255,0.65)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.375rem' }}>
                Begründung:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', margin: 0 }}>{b.begruendung}</p>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Icon name="shield" size={13} />
              Rechtsgrundlage: {b.rechtsgrundlage}
            </div>
          </div>

          {/* ─── EBENE 2: Rechtliche Fassung (aufklappbar) ────────────
              UX-Grund: Wichtig für Widerspruch oder Rechtsberatung,
              aber nicht für die meisten Nutzer beim ersten Lesen.
              <details> mit klarem Label und Chevron-Icon.            */}
          <details style={{ marginBottom: '1.125rem' }}>
            <summary style={{
              cursor: 'pointer',
              padding: '0.875rem 1rem',
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              listStyle: 'none',
              userSelect: 'none',
            }}>
              <Icon name="file" size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ flex: 1 }}>Vollständige rechtliche Fassung lesen</span>
              <Icon name="chevron-down" size={16} style={{ color: 'var(--color-text-muted)' }} />
            </summary>
            <div style={{
              marginTop: '0.5rem',
              padding: '1.125rem',
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: 'var(--color-text)',
            }}>
              {b.rechtlicheFassung}
            </div>
          </details>

          {/* ─── Widerspruchsfrist ────────────────────────────────────
              UX-Grund: Fristversäumnis ist irreversibel → muss sehr
              prominent sein. Orange-Box mit Countdown-Hinweis.        */}
          <div style={{
            background: 'var(--color-warning-light)',
            border: '2px solid #fcd34d',
            borderRadius: 'var(--radius-lg)',
            padding: '1.125rem 1.375rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Icon name="alert" size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
              <strong style={{ color: 'var(--color-warning)' }}>Widerspruchsfrist beachten</strong>
            </div>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text)', marginBottom: '1rem', lineHeight: 1.55 }}>
              Sie haben das Recht, Widerspruch einzulegen — bis zum{' '}
              <strong>{b.widerspruchsfristAblauf}</strong>{' '}
              ({b.widerspruchsfristTage} Monat nach Zustellung).
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Wenn Sie mit der Entscheidung nicht einverstanden sind, können Sie schriftlich Widerspruch einlegen.
              Wir empfehlen, sich dafür beraten zu lassen.
            </p>
            <button
              className="btn btn-secondary btn-inline"
              style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
              onClick={() => alert('Demo: In der echten Anwendung würde hier das Widerspruchs-Formular geöffnet.')}
            >
              <Icon name="send" size={16} />
              Widerspruch einlegen
            </button>
          </div>
        </div>
      ))}

      {bescheide.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ marginBottom: '0.75rem', color: 'var(--color-border)' }}>
            <Icon name="scroll" size={48} />
          </div>
          <p>Noch kein Bescheid vorhanden. Sie werden benachrichtigt, sobald eine Entscheidung vorliegt.</p>
        </div>
      )}
    </div>
  );
}
