'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useDemoState } from '@/context/DemoStateContext';
import {
  berechneFairnessSignale,
  berechneFristTage,
  FIKTIVES_HEUTE,
  fairnessSignalVerlaufZiel,
} from '@/lib/fairness/rules';
import { demoFall } from '@/data/mockFall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';
import { Icon } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';
import type { Fall } from '@/types';

/** Countdown-Label analog Bescheid/Übersicht (Demo-Stichtag FIKTIVES_HEUTE). */
function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

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
 * Primär: handlungsbezogen (Rückfrage/Unterlagen/Bescheid).
 * Sekundär: Fairness → Verlauf-Tiefenlink (Q-191/Q-201, Parität UG Q-181).
 */
function SignalCta({ signal, fall }: { signal: FairnessSignal; fall: Fall }) {
  const verlaufZiel = fairnessSignalVerlaufZiel(signal, fall);

  // Offene Rückfrage mit Frist (Q-214: Countdown-Chip Parität Widerspruch Q-205)
  if (signal.typ === 'RUECKFRAGE_OFFEN_FRIST_RELEVANT') {
    const rq =
      fall.rueckfragen.find(r => !r.beantwortet && signal.id.includes(r.id)) ??
      fall.rueckfragen.find(r => !r.beantwortet);
    const resttage =
      rq?.fristDatum != null
        ? berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE)
        : null;
    const restLabel = resttage !== null ? fristRestLabel(resttage) : null;
    const kritisch = resttage !== null && resttage <= 5;
    const chipClass =
      resttage !== null && (resttage < 0 || kritisch)
        ? 'status-chip-danger'
        : 'status-chip-warning';
    const rqHref = rq ? `/fall/rueckfragen#rq-${rq.id}` : '/fall/rueckfragen';

    return (
      <div style={ctaWrapStyle(signal.prioritaet)} data-testid="hinweise-rq-cta-wrap">
        <div style={{ flex: 1, minWidth: '12rem' }}>
          <p
            style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
            data-testid="hinweise-rq-cta-hint"
          >
            {restLabel && rq
              ? `Offene Rückfrage — antworten bis ${rq.frist} (${restLabel}). Antwort im Bereich „Fragen“ einreichen.`
              : signal.titel.includes('Frist')
                ? `${signal.titel}. Antwort im Bereich „Fragen“ einreichen.`
                : 'Offene Rückfrage mit nahender Antwortfrist. Antwort im Bereich „Fragen“ einreichen.'}
          </p>
          {restLabel && resttage !== null && (
            <span
              className={`status-chip ${chipClass}`}
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'inline-flex' }}
              data-testid={`hinweise-rq-countdown-${signal.id}`}
            >
              <Icon name="clock" size={13} />
              {restLabel}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem 0.75rem',
            flexShrink: 0,
          }}
        >
          <Link
            href={rqHref}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
            data-testid="hinweise-rq-cta"
            aria-label="Zur offenen Rückfrage"
          >
            <Icon name="chat" size={15} />
            Frage beantworten
          </Link>
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

  // Fehlende Unterlagen mit Frist (Q-216: Countdown-Chip Parität RQ Q-214)
  if (signal.typ === 'UNTERLAGE_FEHLT_BLOCKIERT') {
    const offeneDok = fall.dokumente.filter(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );
    const dokMitFrist = offeneDok
      .filter(d => d.fristDatum && d.frist)
      .map(d => ({
        dok: d,
        resttage: berechneFristTage(d.fristDatum as string, FIKTIVES_HEUTE),
      }))
      .sort((a, b) => a.resttage - b.resttage);
    const naechste = dokMitFrist[0];
    const resttage = naechste?.resttage ?? null;
    const restLabel = resttage !== null ? fristRestLabel(resttage) : null;
    const kritisch = resttage !== null && resttage <= 5;
    const chipClass =
      resttage !== null && (resttage < 0 || kritisch)
        ? 'status-chip-danger'
        : 'status-chip-warning';
    const dokHref = naechste
      ? `/fall/dokumente#dok-${naechste.dok.id}`
      : '/fall/dokumente';

    return (
      <div style={ctaWrapStyle(signal.prioritaet)} data-testid="hinweise-unterlagen-cta-wrap">
        <div style={{ flex: 1, minWidth: '12rem' }}>
          <p
            style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
            data-testid="hinweise-unterlagen-cta-hint"
          >
            {restLabel && naechste
              ? `Offene Unterlagen — einreichen bis ${naechste.dok.frist} (${restLabel}). Unterlagen im Bereich „Unterlagen“ hochladen.`
              : signal.titel.includes('Frist')
                ? `${signal.titel}. Unterlagen im Bereich „Unterlagen“ hochladen.`
                : 'Ausstehende Unterlagen im Bereich „Unterlagen“ hochladen.'}
          </p>
          {restLabel && resttage !== null && (
            <span
              className={`status-chip ${chipClass}`}
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'inline-flex' }}
              data-testid={`hinweise-unterlagen-countdown-${signal.id}`}
            >
              <Icon name="clock" size={13} />
              {restLabel}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem 0.75rem',
            flexShrink: 0,
          }}
        >
          <Link
            href={dokHref}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
            data-testid="hinweise-unterlagen-cta"
            aria-label="Zu den ausstehenden Unterlagen"
          >
            <Icon name="upload" size={15} />
            Unterlagen hochladen
          </Link>
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

  // Vorläufiger Bescheid / erweiterbare Begründung (Q-201, Parität Bescheide Q-200)
  // Q-205: Widerspruchsfrist-Countdown-Chip (Parität Q-203/Q-204, US-AV-006 AC3)
  if (
    signal.typ === 'BESCHEID_VORLAEUFIG' ||
    signal.typ === 'BESCHEID_BEGRUENDUNG_ERWEITERBAR'
  ) {
    const bescheid =
      fall.bescheide.find(b => signal.bezug.includes(b.id)) ?? fall.bescheide[0];
    const besId = bescheid?.id;
    const isBegruendung = signal.typ === 'BESCHEID_BEGRUENDUNG_ERWEITERBAR';
    const resttage =
      !isBegruendung && bescheid?.widerspruchsfristAblaufDatum
        ? berechneFristTage(bescheid.widerspruchsfristAblaufDatum, FIKTIVES_HEUTE)
        : null;
    const restLabel = resttage !== null ? fristRestLabel(resttage) : null;
    const kritisch = resttage !== null && resttage <= 5;
    const bald = resttage !== null && resttage <= 14;
    const chipClass =
      resttage !== null && (resttage < 0 || kritisch)
        ? 'status-chip-danger'
        : bald
          ? 'status-chip-warning'
          : 'status-chip-primary';
    return (
      <div
        style={ctaWrapStyle(signal.prioritaet)}
        data-testid={`hinweise-bescheid-cta-wrap-${signal.id}`}
      >
        <div style={{ flex: 1, minWidth: '12rem' }}>
          <p
            style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}
            data-testid={`hinweise-bescheid-cta-hint-${signal.id}`}
          >
            {isBegruendung
              ? 'Die Bescheidbegründung verweist auf ausstehende Angaben. Bescheid lesen und fehlende Unterlagen einreichen.'
              : restLabel && bescheid
                ? `Vorläufiger Bescheid — Widerspruch bis ${bescheid.widerspruchsfristAblauf} (${restLabel}). Details im Bereich „Bescheid“.`
                : 'Vorläufiger Bescheid mit laufender Widerspruchsfrist. Details und Widerspruch im Bereich „Bescheid“.'}
          </p>
          {restLabel && resttage !== null && (
            <span
              className={`status-chip ${chipClass}`}
              style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'inline-flex' }}
              data-testid={`hinweise-widerspruch-countdown-${signal.id}`}
            >
              <Icon name="clock" size={13} />
              {restLabel}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem 0.75rem',
            flexShrink: 0,
          }}
        >
          {besId && (
            <Link
              href={`/fall/bescheide#bes-${besId}`}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
              data-testid={`hinweise-bescheid-cta-${signal.id}`}
              aria-label="Zum Bescheid"
            >
              <Icon name="scroll" size={15} />
              Zum Bescheid
            </Link>
          )}
          {isBegruendung && (
            <Link
              href="/fall/dokumente"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
              data-testid={`hinweise-bescheid-unterlagen-cta-${signal.id}`}
              aria-label="Zu den ausstehenden Unterlagen"
            >
              <Icon name="upload" size={15} />
              Unterlagen
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

function SignalBlock({ signal, fall }: { signal: FairnessSignal; fall: Fall }) {
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
      <SignalCta signal={signal} fall={fall} />
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
                  <SignalBlock key={sig.id} signal={sig} fall={fall} />
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
                  <SignalBlock key={sig.id} signal={sig} fall={fall} />
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
                  <SignalBlock key={sig.id} signal={sig} fall={fall} />
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
