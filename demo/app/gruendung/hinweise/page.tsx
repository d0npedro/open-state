'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import {
  berechneFairnessSignaleGruendung,
  fairnessSignalZiel,
  type FairnessSignalZiel,
} from '@/lib/fairness/gruendung-rules';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';
import type { GruendungsAkte } from '@/types/gruendung';

/** Initiale Signale aus dem unveränderten Mock – Vergleichsbasis für Reaktions-Banner */
const INITIAL_SIGNALE = berechneFairnessSignaleGruendung(demoGruendungsAkte);

/**
 * Stabile data-testid-Namen der Hinweise-CTAs (E2E-Kompatibilität).
 * Leitet aus dem gemeinsamen testKey ab; Routing selbst kommt aus gruendung-rules.
 */
function hinweiseCtaTestIds(ziel: FairnessSignalZiel): {
  wrap: string;
  cta: string;
  hint: string;
} {
  if (ziel.testKey.startsWith('rq-')) {
    const id = ziel.testKey.slice(3);
    return {
      wrap: `hinweise-rq-cta-wrap-${id}`,
      cta: `hinweise-rq-cta-${id}`,
      hint: `hinweise-rq-cta-hint-${id}`,
    };
  }
  if (ziel.testKey.startsWith('beh-')) {
    const id = ziel.testKey.slice(4);
    return {
      wrap: `hinweise-bg-cta-wrap-${id}`,
      cta: `hinweise-bg-cta-${id}`,
      hint: `hinweise-bg-cta-hint-${id}`,
    };
  }
  if (ziel.testKey.startsWith('dok-')) {
    return {
      wrap: 'hinweise-unterlagen-cta-wrap',
      cta: 'hinweise-unterlagen-cta',
      hint: 'hinweise-unterlagen-cta-hint',
    };
  }
  if (ziel.testKey.startsWith('steuernummer-')) {
    const id = ziel.testKey.slice('steuernummer-'.length);
    return {
      wrap: `hinweise-steuernummer-cta-wrap-${id}`,
      cta: `hinweise-steuernummer-cta-${id}`,
      hint: `hinweise-steuernummer-cta-hint-${id}`,
    };
  }
  if (ziel.testKey === 'betriebsdatum') {
    return {
      wrap: 'hinweise-betriebsdatum-cta-wrap',
      cta: 'hinweise-betriebsdatum-cta',
      hint: 'hinweise-betriebsdatum-cta-hint',
    };
  }
  if (ziel.testKey === 'parallele-behoerden') {
    return {
      wrap: 'hinweise-parallele-behoerden-cta-wrap',
      cta: 'hinweise-parallele-behoerden-cta',
      hint: 'hinweise-parallele-behoerden-cta-hint',
    };
  }
  return {
    wrap: `hinweise-cta-wrap-${ziel.testKey}`,
    cta: `hinweise-cta-${ziel.testKey}`,
    hint: `hinweise-cta-hint-${ziel.testKey}`,
  };
}

/** Visueller Rahmen des CTA-Blocks nach Priorität (kein Einfluss auf Logik). */
function ctaWrapStyle(prioritaet: FairnessSignal['prioritaet']): CSSProperties {
  if (prioritaet === 'RELEVANT') {
    return {
      marginTop: '0.5rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: 'var(--color-warning-light)',
      border: '1px solid var(--color-warning)',
      borderRadius: 'var(--radius)',
    };
  }
  if (prioritaet === 'INFO') {
    return {
      marginTop: '0.5rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: 'var(--color-neutral-light)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
    };
  }
  return {
    marginTop: '0.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    background: 'var(--color-primary-light)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
  };
}

/**
 * Optionaler Zusatz für Unterlagen-Hilfstext bei mehreren offenen Dokumenten
 * (nur Darstellung – Routing und Basistext aus gruendung-rules).
 */
function unterlagenHintErweiterung(ziel: FairnessSignalZiel, akte: GruendungsAkte): string {
  if (!ziel.testKey.startsWith('dok-') || !ziel.hint) return ziel.hint ?? '';
  const fehlende = akte.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlende.length > 1) {
    return `${ziel.hint} ${fehlende.length} Dokumente stehen aus.`;
  }
  return ziel.hint;
}

function FairnessSignalCta({
  signal,
  akte,
}: {
  signal: FairnessSignal;
  akte: GruendungsAkte;
}) {
  const ziel = fairnessSignalZiel(signal, akte);
  if (!ziel) return null;

  const ids = hinweiseCtaTestIds(ziel);
  const hintText = unterlagenHintErweiterung(ziel, akte);

  return (
    <div style={ctaWrapStyle(signal.prioritaet)} data-testid={ids.wrap}>
      {hintText && (
        <p
          style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
          data-testid={ids.hint}
        >
          {hintText}
        </p>
      )}
      <Link
        href={ziel.href}
        className="btn btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
        data-testid={ids.cta}
        aria-label={ziel.ariaLabel ?? ziel.cta}
      >
        <Icon name={ziel.icon as IconName} size={15} />
        {ziel.cta}
      </Link>
    </div>
  );
}

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
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">Verfahrensfairness</span>
        <span>Regelbasierte Hinweise aus dem Aktenzustand — keine Entscheidung</span>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relevant.map(sig => (
                  <div key={sig.id} data-testid={`hinweise-relevant-${sig.id}`}>
                    <FairnessPanel signale={[sig]} />
                    <FairnessSignalCta signal={sig} akte={akte} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {hinweis.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Hinweise ({hinweis.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hinweis.map(sig => (
                  <div key={sig.id} data-testid={`hinweise-hinweis-${sig.id}`}>
                    <FairnessPanel signale={[sig]} />
                    <FairnessSignalCta signal={sig} akte={akte} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {info.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral)', marginBottom: '0.75rem' }}>
                Informationen ({info.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {info.map(sig => (
                  <div key={sig.id} data-testid={`hinweise-info-${sig.id}`}>
                    <FairnessPanel signale={[sig]} />
                    <FairnessSignalCta signal={sig} akte={akte} />
                  </div>
                ))}
              </div>
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
