'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import {
  berechneFairnessSignaleGruendung,
  FIKTIVES_HEUTE_GRUENDUNG,
  fairnessSignalVerlaufZiel,
  fairnessSignalZiel,
  type FairnessSignalZiel,
} from '@/lib/fairness/gruendung-rules';
import { berechneFristTage } from '@/lib/fairness/rules';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';
import type { GruendungsAkte } from '@/types/gruendung';

/** Initiale Signale aus dem unveränderten Mock – Vergleichsbasis für Reaktions-Banner */
const INITIAL_SIGNALE = berechneFairnessSignaleGruendung(demoGruendungsAkte);

/** Countdown-Label analog Dokumente/Übersicht (Demo-Stichtag FIKTIVES_HEUTE_GRUENDUNG). */
function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

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
  const verlaufZiel = fairnessSignalVerlaufZiel(signal, akte);
  if (!ziel && !verlaufZiel) return null;

  const ids = ziel
    ? hinweiseCtaTestIds(ziel)
    : {
        wrap: `hinweise-cta-wrap-${signal.id}`,
        cta: `hinweise-cta-${signal.id}`,
        hint: `hinweise-cta-hint-${signal.id}`,
      };
  const hintText = ziel ? unterlagenHintErweiterung(ziel, akte) : '';

  // Q-218: RQ-Countdown-Chip am CTA (Parität AV Q-214)
  const rqId = ziel?.testKey.startsWith('rq-') ? ziel.testKey.slice(3) : undefined;
  const rq =
    rqId != null
      ? akte.rueckfragen.find(r => r.id === rqId && !r.beantwortet)
      : undefined;
  const rqRest =
    rq != null ? berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE_GRUENDUNG) : null;
  const rqRestLabel = rqRest !== null ? fristRestLabel(rqRest) : null;
  const rqKritisch = rqRest !== null && rqRest <= 3;
  const rqChipClass =
    rqRest !== null && (rqRest < 0 || rqKritisch)
      ? 'status-chip-danger'
      : 'status-chip-warning';

  return (
    <div style={ctaWrapStyle(signal.prioritaet)} data-testid={ids.wrap}>
      {(hintText || rqRestLabel) && (
        <div style={{ flex: 1, minWidth: '12rem' }}>
          {hintText && (
            <p
              style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
              data-testid={ids.hint}
            >
              {hintText}
            </p>
          )}
          {rqRestLabel && rqId && (
            <span
              className={`status-chip ${rqChipClass}`}
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'inline-flex' }}
              data-testid={`hinweise-rq-countdown-${rqId}`}
            >
              <Icon name="clock" size={13} />
              {rqRestLabel}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem 0.75rem',
          flexShrink: 0,
        }}
      >
        {ziel && (
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
        )}
        {verlaufZiel && (
          <Link
            href={verlaufZiel.href}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
            data-testid={`hinweise-verlauf-cta-${verlaufZiel.ereignisId}`}
            aria-label={verlaufZiel.ariaLabel ?? verlaufZiel.cta}
          >
            <Icon name="clock" size={15} />
            {verlaufZiel.cta}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * UNTERLAGE: eigene Karte mit stabilen Frist-/Live-Testids (US-UG-003 / AV Q-167-Parität).
 * FairnessPanel allein liefert keine festen testids für Titel/Erklärung.
 */
function UnterlagenSignalKarte({ signal }: { signal: FairnessSignal }) {
  return (
    <div
      data-testid="hinweise-signal-unterlagen"
      style={{
        borderLeft: '3px solid var(--color-primary)',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-primary)',
            paddingTop: '0.1rem',
            whiteSpace: 'nowrap',
          }}
        >
          Hinweis
        </span>
        <strong
          style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.3 }}
          data-testid="hinweise-signal-unterlagen-titel"
        >
          {signal.titel}
        </strong>
      </div>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
          lineHeight: 1.5,
        }}
        data-testid="hinweise-signal-unterlagen-erklaerung"
      >
        {signal.erklaerung}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            borderRadius: '4px',
            padding: '0.6rem 0.875rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            Auswirkung
          </span>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.45 }}>
            {signal.auswirkung}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            borderRadius: '4px',
            padding: '0.6rem 0.875rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
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
    </div>
  );
}

function SignalBlock({
  signal,
  akte,
}: {
  signal: FairnessSignal;
  akte: GruendungsAkte;
}) {
  const isUnterlagen = signal.typ === 'UG_UNTERLAGE_FEHLT' || signal.id === 'UG-UNTERLAGEN-FEHLEND';
  const sectionPrefix =
    signal.prioritaet === 'RELEVANT'
      ? 'relevant'
      : signal.prioritaet === 'INFO'
        ? 'info'
        : 'hinweis';

  return (
    <div
      key={signal.id}
      data-testid={`hinweise-${sectionPrefix}-${signal.id}`}
      data-signal-typ={signal.typ}
      data-signal-id={signal.id}
    >
      {isUnterlagen ? (
        <UnterlagenSignalKarte signal={signal} />
      ) : (
        <FairnessPanel signale={[signal]} />
      )}
      <FairnessSignalCta signal={signal} akte={akte} />
    </div>
  );
}

export default function GruendungHinweisePage() {
  const { akte, sessionUploadedIds } = useGruendungState();
  const signale = berechneFairnessSignaleGruendung(akte);

  const relevant = signale.filter(s => s.prioritaet === 'RELEVANT');
  const hinweis = signale.filter(s => s.prioritaet === 'HINWEIS');
  const info = signale.filter(s => s.prioritaet === 'INFO');

  const geloestCount = INITIAL_SIGNALE.length - signale.length;
  const hatReaktion = geloestCount > 0;

  const unterlagenSignal = signale.find(
    s => s.typ === 'UG_UNTERLAGE_FEHLT' || s.id === 'UG-UNTERLAGEN-FEHLEND'
  );
  const initialUnterlagen = INITIAL_SIGNALE.find(
    s => s.typ === 'UG_UNTERLAGE_FEHLT' || s.id === 'UG-UNTERLAGEN-FEHLEND'
  );
  const unterlagenEntfallen = Boolean(initialUnterlagen) && !unterlagenSignal;
  const hatUploadInSession = sessionUploadedIds.length > 0;

  // Banner-Text: Rückfrage und/oder Upload (nicht nur RQ)
  let aktionsText = 'Ihre Aktion';
  if (hatUploadInSession && unterlagenEntfallen) {
    aktionsText = 'Ihre Aktion (Unterlagen eingereicht)';
  } else if (hatUploadInSession) {
    aktionsText =
      'Ihre Aktion (Unterlagen teilweise eingereicht oder Rückfrage beantwortet)';
  } else {
    aktionsText = 'Ihre Aktion (Rückfrage beantwortet)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span className="badge badge-neutral">Verfahrensfairness</span>
        <span>Regelbasierte Hinweise aus dem Aktenzustand — keine Entscheidung</span>
      </div>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Hinweise zur Verfahrenslage</h1>
        <p>
          Diese Hinweise beschreiben den aktuellen Zustand Ihrer Gründungsakte sachlich und
          nachvollziehbar. Sie basieren auf den vorliegenden Falldaten und ersetzen keine
          Entscheidung der Behörden.
        </p>
        <p
          style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}
          data-testid="hinweise-signal-count"
        >
          Aktuell {signale.length} {signale.length === 1 ? 'Hinweis' : 'Hinweise'}
          {geloestCount > 0 && (
            <span data-testid="hinweise-signal-geloest">
              {' '}
              · {geloestCount} seit Sitzungsbeginn entfallen
            </span>
          )}
        </p>
      </div>

      {/* Reaktions-Banner (erscheint nach State-Wechsel) */}
      {hatReaktion && (
        <div
          style={{
            background: 'var(--color-success-light)',
            border: '1px solid var(--color-success)',
            borderLeft: '4px solid var(--color-success)',
            borderRadius: 'var(--radius)',
            padding: '1rem 1.25rem',
            fontSize: '0.875rem',
          }}
          data-testid="hinweise-regelwerk-reaktion"
          role="status"
        >
          <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--color-success)' }}>
            Regelwerk hat reagiert
          </strong>
          <p style={{ margin: 0, lineHeight: 1.55 }}>
            Durch {aktionsText}{' '}
            {geloestCount === 1 ? 'ist 1 Hinweis' : `sind ${geloestCount} Hinweise`} entfallen.
            Das Fairness-Regelwerk hat den geänderten Aktenzustand erkannt und die Liste
            aktualisiert.
          </p>
        </div>
      )}

      {/* Erklärungshinweis */}
      <div
        style={{
          background: 'var(--color-primary-light)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem',
          fontSize: '0.875rem',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
          Was zeigt diese Seite?
        </strong>
        <p style={{ margin: 0, lineHeight: 1.55 }}>
          Jeder Hinweis erklärt, was im Gründungsverfahren gerade zutrifft, welche Auswirkung das
          hat und welcher nächste Schritt sinnvoll wäre. Die Hinweise werden aus dem Aktenzustand
          abgeleitet — aus offenen Rückfragen, Behördenstatus, ausstehenden Pflichtanmeldungen und
          Fristlage. Sie bewerten kein Vorhaben und treffen keine Entscheidung.
        </p>
      </div>

      {/* Signale */}
      {signale.length === 0 ? (
        <div
          className="card"
          style={{ borderLeft: '3px solid var(--color-success)' }}
          data-testid="hinweise-keine-signale"
        >
          <strong>Keine Hinweise</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Der Aktenzustand zeigt derzeit keine Auffälligkeiten.
          </p>
        </div>
      ) : (
        <>
          {relevant.length > 0 && (
            <section data-testid="hinweise-section-relevant">
              <h2
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-warning)',
                  marginBottom: '0.75rem',
                }}
              >
                Relevant ({relevant.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relevant.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} akte={akte} />
                ))}
              </div>
            </section>
          )}
          {hinweis.length > 0 && (
            <section data-testid="hinweise-section-hinweis">
              <h2
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                Hinweise ({hinweis.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hinweis.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} akte={akte} />
                ))}
              </div>
            </section>
          )}
          {info.length > 0 && (
            <section data-testid="hinweise-section-info">
              <h2
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-neutral)',
                  marginBottom: '0.75rem',
                }}
              >
                Informationen ({info.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {info.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} akte={akte} />
                ))}
              </div>
            </section>
          )}
          <div
            style={{
              padding: '0.875rem 1rem',
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            Die Hinweise werden automatisch aus den vorliegenden Aktendaten abgeleitet. Sie sind
            Orientierung — keine Rechtsauskunft und keine Entscheidung. Verantwortlich für die
            Verfahrensentscheidungen sind die beteiligten Behörden.
          </div>
        </>
      )}
    </div>
  );
}
