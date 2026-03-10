/**
 * FairnessPanel
 *
 * Zeigt Verfahrensfairness-Hinweise auf sachliche, ruhige Weise an.
 * Keine Warnfarben als Hauptmuster. Keine KI-Sprache. Keine Scores.
 * Jeder Hinweis erklärt sich selbst: Was, warum, welche Auswirkung, was als nächstes.
 */

import { FairnessSignal, FairnessSignalPrioritaet } from '@/types/fairness';

const prioritaetConfig: Record<
  FairnessSignalPrioritaet,
  { label: string; borderColor: string; background: string; labelColor: string }
> = {
  RELEVANT: {
    label: 'Relevant',
    borderColor: 'var(--color-warning)',
    background: 'var(--color-warning-light)',
    labelColor: 'var(--color-warning)',
  },
  HINWEIS: {
    label: 'Hinweis',
    borderColor: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
    labelColor: 'var(--color-primary)',
  },
  INFO: {
    label: 'Info',
    borderColor: 'var(--color-border)',
    background: 'var(--color-neutral-light)',
    labelColor: 'var(--color-neutral)',
  },
};

interface FairnessPanelProps {
  signale: FairnessSignal[];
  /** Kompaktmodus: Nur Titel + Erklärung, keine Auswirkung/Schritt/Bezug */
  kompakt?: boolean;
  /** Optionale Überschrift über dem Panel */
  titel?: string;
}

export function FairnessPanel({ signale, kompakt = false, titel }: FairnessPanelProps) {
  if (signale.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {titel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{titel}</h2>
          <span
            className="badge badge-neutral"
            style={{ fontSize: '0.7rem' }}
          >
            {signale.length} {signale.length === 1 ? 'Hinweis' : 'Hinweise'}
          </span>
        </div>
      )}
      {signale.map(signal => {
        const cfg = prioritaetConfig[signal.prioritaet];
        return (
          <div
            key={signal.id}
            style={{
              borderLeft: `3px solid ${cfg.borderColor}`,
              background: cfg.background,
              borderRadius: 'var(--radius)',
              padding: kompakt ? '0.875rem 1rem' : '1rem 1.25rem',
            }}
          >
            {/* Kopfzeile: Priorität-Label + Titel */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: cfg.labelColor,
                  paddingTop: '0.1rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {cfg.label}
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.3 }}>
                {signal.titel}
              </strong>
            </div>

            {/* Erklärung */}
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: kompakt ? 0 : '0.75rem', lineHeight: 1.5 }}>
              {signal.erklaerung}
            </p>

            {/* Vollmodus: Auswirkung + Nächster Schritt + Bezug */}
            {!kompakt && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.55)', borderRadius: '4px', padding: '0.6rem 0.875rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Auswirkung
                  </span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.45 }}>
                    {signal.auswirkung}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.55)', borderRadius: '4px', padding: '0.6rem 0.875rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Möglicher nächster Schritt
                  </span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.45 }}>
                    {signal.naechsterSchritt}
                  </p>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Bezug: {signal.bezug}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Kleine Zusammenfassungskarte – zeigt nur Anzahl und Typ der Signale.
 * Für Einstiegspunkte in der Fallübersicht.
 */
export function FairnessSummaryCard({ signale, href }: { signale: FairnessSignal[]; href: string }) {
  if (signale.length === 0) return null;

  const relevant = signale.filter(s => s.prioritaet === 'RELEVANT').length;
  const hinweis = signale.filter(s => s.prioritaet === 'HINWEIS').length;
  const info = signale.filter(s => s.prioritaet === 'INFO').length;

  return (
    <a
      href={href}
      className="card"
      style={{ display: 'block', textDecoration: 'none', borderLeft: '3px solid var(--color-primary)', transition: 'box-shadow 0.15s' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            Hinweise zur Verfahrenslage
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {relevant > 0 && (
              <span className="badge badge-warning">{relevant} Relevant</span>
            )}
            {hinweis > 0 && (
              <span className="badge badge-primary">{hinweis} {hinweis === 1 ? 'Hinweis' : 'Hinweise'}</span>
            )}
            {info > 0 && (
              <span className="badge badge-neutral">{info} Info</span>
            )}
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Alle ansehen →</span>
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Diese Hinweise beschreiben den aktuellen Verfahrensstand. Sie sind Orientierung, keine Entscheidung.
      </p>
    </a>
  );
}
