'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  demoRqAntwortEreignisId,
  useGruendungState,
} from '@/context/GruendungStateContext';
import { berechneFristTage } from '@/lib/fairness/rules';
import { FIKTIVES_HEUTE_GRUENDUNG } from '@/lib/fairness/gruendung-rules';
import { Icon } from '@/components/Icon';

/** Countdown-Label analog Dokumente/Übersicht (Demo-Stichtag FIKTIVES_HEUTE_GRUENDUNG). */
function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

export default function RueckfragenPage() {
  const { akte, answerRueckfrage } = useGruendungState();
  const offeneAnzahl = akte.rueckfragen.filter(r => !r.beantwortet).length;
  /** Draft-Antworten pro Rückfrage-ID (lokaler Formularzustand) */
  const [drafts, setDrafts] = useState<Record<string, string>>({});

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
          <strong>Demo:</strong> Formulieren Sie optional eine Antwort und senden Sie sie ab —
          der Status ändert sich in der gesamten App. Ohne Text wird eine Beispielantwort verwendet.
        </span>
      </div>

      {akte.rueckfragen.map(rq => {
        const behörde = akte.beteiligteBehörden.find(b => b.id === rq.anforderndeBehördeId);
        const resttage = berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE_GRUENDUNG);
        const fristKritisch = !rq.beantwortet && resttage <= 3;
        const draft = drafts[rq.id] ?? '';
        const formId = `ug-rq-antwort-${rq.id}`;
        const verlaufEreignisId = demoRqAntwortEreignisId(rq.id);
        const verlaufHref = `/gruendung/verlauf#ere-${verlaufEreignisId}`;

        return (
          <div
            key={rq.id}
            id={`rq-${rq.id}`}
            className="card"
            style={{
              borderLeft: rq.beantwortet
                ? '5px solid var(--color-success)'
                : fristKritisch
                  ? '5px solid var(--color-danger)'
                  : '5px solid var(--color-warning)',
              scrollMarginTop: '5rem',
            }}
          >
            {/* Status-Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.125rem' }}>
              <span className={`status-chip ${rq.beantwortet ? 'status-chip-success' : fristKritisch ? 'status-chip-danger' : 'status-chip-warning'}`}>
                <Icon name={rq.beantwortet ? 'check-circle' : 'alert'} size={15} />
                {rq.beantwortet
                  ? 'Beantwortet'
                  : fristKritisch
                    ? `Dringend — nur noch ${resttage} Tag${resttage === 1 ? '' : 'e'}!`
                    : 'Ihre Antwort erwartet'}
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

            {/* Beantwortet: Quittung + Antworttext + Verlauf-Tiefenlink (US-UG-005) */}
            {rq.beantwortet ? (
              <div
                role="status"
                aria-live="polite"
                data-testid={`rq-antwort-quittung-${rq.id}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.95rem', flexWrap: 'wrap' }}>
                  <Icon name="check-circle" size={20} />
                  Beantwortet — die Behörde wurde informiert.
                  {rq.beantwortetAm && (
                    <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      am {rq.beantwortetAm}
                    </span>
                  )}
                </div>
                {rq.antwortText && (
                  <div
                    data-testid={`rq-antwort-text-${rq.id}`}
                    style={{
                      background: 'var(--color-success-light, #f0fff4)',
                      border: '1px solid var(--color-success)',
                      borderRadius: 'var(--radius)',
                      padding: '0.875rem 1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                      Ihre übermittelte Antwort
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {rq.antwortText}
                    </p>
                  </div>
                )}
                {/* Session-Antwort im Verlauf nachvollziehbar (Hash-Hervorhebung) */}
                <Link
                  href={verlaufHref}
                  className="btn btn-secondary btn-inline"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    minHeight: 44,
                  }}
                  data-testid={`rq-verlauf-link-${rq.id}`}
                  aria-label={`Ihre Antwort auf die Rückfrage im Verlauf ansehen`}
                >
                  <Icon name="clock" size={16} />
                  Im Verlauf ansehen
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: fristKritisch ? 'var(--color-danger-light, #fff5f5)' : 'var(--color-warning-light)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
              >
                {/* Frist + Countdown-Chip (Q-211, Parität Dokumente Q-209 / Übersicht Q-210) */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.5rem 1rem',
                    color: fristKritisch ? 'var(--color-danger)' : 'var(--color-warning)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                  data-testid={`rq-seite-frist-${rq.id}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="calendar" size={15} />
                    Antworten bis: {rq.frist}
                  </span>
                  <span
                    className={`status-chip ${fristKritisch ? 'status-chip-danger' : 'status-chip-warning'}`}
                    style={{ fontSize: '0.75rem' }}
                    data-testid={`rq-seite-countdown-${rq.id}`}
                  >
                    <Icon name="clock" size={13} />
                    {fristRestLabel(resttage)}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor={formId}
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--color-text)',
                    }}
                  >
                    Ihre Antwort an {behörde?.bezeichnung ?? 'die Behörde'}
                  </label>
                  <textarea
                    id={formId}
                    name={formId}
                    rows={4}
                    value={draft}
                    onChange={e => setDrafts(prev => ({ ...prev, [rq.id]: e.target.value }))}
                    placeholder="z. B. Ja, Kleinunternehmerregelung; voraussichtlicher Umsatz …"
                    aria-describedby={`${formId}-hint`}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      resize: 'vertical',
                      background: 'white',
                      color: 'var(--color-text)',
                    }}
                  />
                  <p
                    id={`${formId}-hint`}
                    style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                  >
                    Optional in der Demo. Leer lassen → es wird eine Beispielantwort übermittelt.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-inline"
                    style={{ background: fristKritisch ? 'var(--color-danger)' : 'var(--color-primary)' }}
                    onClick={() => answerRueckfrage(rq.id, draft)}
                    aria-label={`Rückfrage beantworten: ${rq.text}`}
                  >
                    Rückfrage beantworten
                    <Icon name="send" size={16} />
                  </button>
                </div>
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
