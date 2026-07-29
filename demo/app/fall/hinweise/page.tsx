'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useDemoState } from '@/context/DemoStateContext';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { demoFall } from '@/data/mockFall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';
import { Icon } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';

/** Initiale Signale aus dem unveränderten Mock – dienen als Vergleichsbasis */
const INITIAL_SIGNALE = berechneFairnessSignale(demoFall);

const prioritaetSection: Record<
  FairnessSignal['prioritaet'],
  { label: string; color: string; testPrefix: string }
> = {
  RELEVANT: { label: 'Relevant', color: 'var(--color-warning)', testPrefix: 'relevant' },
  HINWEIS: { label: 'Hinweise', color: 'var(--color-primary)', testPrefix: 'hinweis' },
  INFO: { label: 'Informationen', color: 'var(--color-neutral)', testPrefix: 'info' },
};

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
 * Handlungs-CTA je Signaltyp (AV).
 * Routing bleibt seitenlokal – keine zentrale Ziel-Map nötig (nur 2 Ziele).
 */
function SignalCta({ signal }: { signal: FairnessSignal }) {
  if (signal.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT') {
    return (
      <div style={ctaWrapStyle(signal.prioritaet)} data-testid="hinweise-rq-cta-wrap">
        <p
          style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
          data-testid="hinweise-rq-cta-hint"
        >
          {signal.titel.includes('Frist')
            ? `${signal.titel}. Antwort im Bereich „Fragen“ einreichen.`
            : 'Offene Rückfrage mit nahender Antwortfrist. Antwort im Bereich „Fragen“ einreichen.'}
        </p>
        <Link
          href="/fall/rueckfragen"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
          data-testid="hinweise-rq-cta"
          aria-label="Zur offenen Rückfrage"
        >
          <Icon name="chat" size={15} />
          Frage beantworten
        </Link>
      </div>
    );
  }

  if (signal.typ === 'UNTERLAGE_FEHLT_BLOCKIERT') {
    return (
      <div style={ctaWrapStyle(signal.prioritaet)} data-testid="hinweise-unterlagen-cta-wrap">
        <p
          style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
          data-testid="hinweise-unterlagen-cta-hint"
        >
          {signal.titel.includes('Frist')
            ? `${signal.titel}. Unterlagen im Bereich „Unterlagen“ hochladen.`
            : 'Ausstehende Unterlagen im Bereich „Unterlagen“ hochladen.'}
        </p>
        <Link
          href="/fall/dokumente"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
          data-testid="hinweise-unterlagen-cta"
          aria-label="Zu den ausstehenden Unterlagen"
        >
          <Icon name="upload" size={15} />
          Unterlagen hochladen
        </Link>
      </div>
    );
  }

  return null;
}

/** Gemeinsame Signal-Karte mit stabilen Frist-/Live-Testids (US-AV-008). */
function LiveSignalCard({
  signal,
  testIdBase,
  badgeLabel,
  badgeColor,
}: {
  signal: FairnessSignal;
  testIdBase: string;
  badgeLabel: string;
  badgeColor: string;
}) {
  return (
    <div
      data-testid={testIdBase}
      style={{
        borderLeft: `3px solid ${badgeColor}`,
        background:
          signal.prioritaet === 'RELEVANT'
            ? 'var(--color-warning-light)'
            : 'var(--color-primary-light)',
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
            color: badgeColor,
            paddingTop: '0.1rem',
            whiteSpace: 'nowrap',
          }}
        >
          {badgeLabel}
        </span>
        <strong
          style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.3 }}
          data-testid={`${testIdBase}-titel`}
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
        data-testid={`${testIdBase}-erklaerung`}
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

function SignalBlock({ signal }: { signal: FairnessSignal }) {
  const isUnterlagen = signal.typ === 'UNTERLAGE_FEHLT_BLOCKIERT';
  const isRueckfrage = signal.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT';
  const section = prioritaetSection[signal.prioritaet];

  return (
    <div
      data-testid={`hinweise-${section.testPrefix}-${signal.id}`}
      data-signal-typ={signal.typ}
      data-signal-id={signal.id}
    >
      {/* RQ / UNTERLAGE: eigene Karten mit stabilen Frist-/Live-Testids (US-AV-008) */}
      {isRueckfrage ? (
        <LiveSignalCard
          signal={signal}
          testIdBase="hinweise-signal-rueckfrage"
          badgeLabel="Relevant"
          badgeColor="var(--color-warning)"
        />
      ) : isUnterlagen ? (
        <LiveSignalCard
          signal={signal}
          testIdBase="hinweise-signal-unterlagen"
          badgeLabel="Hinweis"
          badgeColor="var(--color-primary)"
        />
      ) : (
        <FairnessPanel signale={[signal]} />
      )}
      <SignalCta signal={signal} />
    </div>
  );
}

export default function HinweisePage() {
  const { fall, sessionUploadedIds } = useDemoState();
  const signale = berechneFairnessSignale(fall);

  const relevant = signale.filter(s => s.prioritaet === 'RELEVANT');
  const hinweis = signale.filter(s => s.prioritaet === 'HINWEIS');
  const info = signale.filter(s => s.prioritaet === 'INFO');

  const geloestCount = INITIAL_SIGNALE.length - signale.length;
  const hatReaktion = geloestCount > 0;

  const unterlagenSignal = signale.find(s => s.typ === 'UNTERLAGE_FEHLT_BLOCKIERT');
  const initialUnterlagen = INITIAL_SIGNALE.find(s => s.typ === 'UNTERLAGE_FEHLT_BLOCKIERT');
  const unterlagenEntfallen =
    Boolean(initialUnterlagen) && !unterlagenSignal;
  const rqSignal = signale.find(s => s.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT');
  const initialRq = INITIAL_SIGNALE.find(s => s.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT');
  const rqEntfallen = Boolean(initialRq) && !rqSignal;
  const hatUploadInSession = sessionUploadedIds.length > 0;

  // Banner-Text: Rückfrage und/oder Upload (nicht nur RQ)
  let aktionsText = 'Ihre Aktion';
  if (hatUploadInSession && unterlagenEntfallen && rqEntfallen) {
    aktionsText = 'Ihre Aktion (Rückfrage beantwortet und Unterlagen eingereicht)';
  } else if (hatUploadInSession && unterlagenEntfallen) {
    aktionsText = 'Ihre Aktion (Unterlagen eingereicht)';
  } else if (hatUploadInSession && rqEntfallen) {
    aktionsText = 'Ihre Aktion (Rückfrage beantwortet und Unterlagen teilweise eingereicht)';
  } else if (hatUploadInSession) {
    aktionsText = 'Ihre Aktion (Unterlagen teilweise eingereicht)';
  } else if (rqEntfallen) {
    aktionsText = 'Ihre Aktion (Rückfrage beantwortet)';
  }

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

      {/* Regelwerk-Reaktions-Banner (erscheint nur nach State-Wechsel) */}
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
          <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.55 }}>
            Durch {aktionsText}{' '}
            {geloestCount === 1 ? 'ist 1 Hinweis' : `sind ${geloestCount} Hinweise`} entfallen.
            Das Verfahrensfairness-Regelwerk hat den geänderten Fallzustand erkannt und die Hinweisliste aktualisiert.
            Das ist kein KI-Urteil — nur eine transparente Ableitung aus dem neuen Fallstatus.
          </p>
        </div>
      )}

      {/* Erklärungshinweis */}
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
        <div
          className="card"
          style={{ borderLeft: '3px solid var(--color-success)' }}
          data-testid="hinweise-keine-signale"
        >
          <strong>Keine Hinweise</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Der Fallzustand zeigt derzeit keine Auffälligkeiten.
          </p>
        </div>
      ) : (
        <>
          {relevant.length > 0 && (
            <section data-testid="hinweise-section-relevant">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-warning)', marginBottom: '0.75rem' }}>
                Relevant ({relevant.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relevant.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} />
                ))}
              </div>
            </section>
          )}

          {hinweis.length > 0 && (
            <section data-testid="hinweise-section-hinweis">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Hinweise ({hinweis.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hinweis.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} />
                ))}
              </div>
            </section>
          )}

          {info.length > 0 && (
            <section data-testid="hinweise-section-info">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral)', marginBottom: '0.75rem' }}>
                Informationen ({info.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {info.map(sig => (
                  <SignalBlock key={sig.id} signal={sig} />
                ))}
              </div>
            </section>
          )}

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
