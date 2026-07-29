// UX-Grund: Rückfragen sind der emotionale Tiefpunkt für Antragsteller.
// "Warum fragt die Behörde das?" und "Was passiert wenn ich nicht antworte?"
// müssen SOFORT sichtbar sein — nicht hinter einem Klick.
// Konsequenz-Box: rot/orange damit Schwere klar ist.
// Bestätigungsschritt: Bürger sieht explizit, was übermittelt wird (keine 1-Klick-Absendung).

'use client';

import { useState } from 'react';
import { useDemoState } from '@/context/DemoStateContext';
import { berechneFristTage, FIKTIVES_HEUTE } from '@/lib/fairness/rules';
import { Icon } from '@/components/Icon';
import type { Rueckfrage } from '@/types';

/** Session-Erweiterung der Rückfrage (Demo) — Typ bleibt in types/index.ts unverändert. */
type RueckfrageMitAntwort = Rueckfrage & {
  antwortText?: string;
  beantwortetAm?: string;
};

const DEMO_BEISPIELANTWORT =
  'Das Datum der Beschäftigungsaufnahme war der 1. März 2022 (Beispielantwort in der Demo).';

export default function RueckfragenPage() {
  const { fall, answerRueckfrage } = useDemoState();
  const { rueckfragen } = fall;
  const offeneAnzahl = rueckfragen.filter(r => !r.beantwortet).length;

  /** Welche offene Rückfrage zeigt den Bestätigungsdialog? */
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Rückfragen der Behörde</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {offeneAnzahl > 0
            ? `${offeneAnzahl} Frage${offeneAnzahl > 1 ? 'n brauchen' : ' braucht'} Ihre Antwort.`
            : 'Alle Fragen sind beantwortet.'}
        </p>
      </div>

      {/* ─── Demo-Hinweis ─────────────────────────────────────────── */}
      <div className="notice-box notice-box-info">
        <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          <strong>Demo:</strong> «Jetzt beantworten» öffnet eine kurze Bestätigung.
          Nach dem Absenden ändert sich der Fallstatus sichtbar in der gesamten App.
        </span>
      </div>

      {/* ─── Rückfragen ───────────────────────────────────────────── */}
      {rueckfragen.map(raw => {
        const rq = raw as RueckfrageMitAntwort;
        const resttage = berechneFristTage(rq.fristDatum, FIKTIVES_HEUTE);
        const fristKritisch = !rq.beantwortet && resttage <= 5;
        const isConfirming = confirmingId === rq.id;
        const draft = drafts[rq.id] ?? '';
        const formId = `av-rq-antwort-${rq.id}`;

        return (
          <div
            key={rq.id}
            className="card"
            style={{
              borderLeft: rq.beantwortet
                ? '5px solid var(--color-success)'
                : '5px solid var(--color-warning)',
            }}
          >
            {/* Status-Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.125rem' }}>
              <span className={`status-chip ${rq.beantwortet ? 'status-chip-success' : fristKritisch ? 'status-chip-danger' : 'status-chip-warning'}`}>
                <Icon name={rq.beantwortet ? 'check-circle' : 'alert'} size={15} />
                {rq.beantwortet ? 'Beantwortet' : fristKritisch ? `Dringend — nur noch ${resttage} Tage!` : 'Ihre Antwort erwartet'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Gefragt am {rq.gestelltAm}
              </span>
            </div>

            {/* Die Frage — groß und klar */}
            <div style={{ marginBottom: '1.125rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Was wird gefragt?
              </div>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
                {rq.text}
              </p>
            </div>

            {/* Warum + Was passiert — immer sichtbar, nicht hinter Klick */}
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

            {/* Frist + Button / Bestätigung / Quittung */}
            {rq.beantwortet ? (
              <div
                role="status"
                aria-live="polite"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.95rem', flexWrap: 'wrap' }}>
                  <Icon name="check-circle" size={20} />
                  Beantwortet — die Sachbearbeitung wurde informiert.
                  {rq.beantwortetAm && (
                    <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      am {rq.beantwortetAm}
                    </span>
                  )}
                </div>
                {rq.antwortText && (
                  <div
                    data-testid="rq-antwort-quittung"
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
              </div>
            ) : (
              <div style={{
                background: fristKritisch ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: fristKritisch ? 'var(--color-danger)' : 'var(--color-warning)', fontSize: '0.95rem' }}>
                      <Icon name="calendar" size={16} />
                      Frist: {rq.frist}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: fristKritisch ? 'var(--color-danger)' : 'var(--color-warning)', marginTop: '0.25rem' }}>
                      Noch {resttage} Tag{resttage !== 1 ? 'e' : ''} verbleibend
                    </div>
                  </div>
                  {!isConfirming && (
                    <button
                      type="button"
                      className="btn btn-primary btn-inline"
                      style={{ background: fristKritisch ? 'var(--color-danger)' : 'var(--color-primary)' }}
                      onClick={() => setConfirmingId(rq.id)}
                      aria-label={`Rückfrage beantworten: ${rq.text}`}
                      data-testid="rq-beantworten-oeffnen"
                    >
                      Jetzt beantworten
                      <Icon name="send" size={16} />
                    </button>
                  )}
                </div>

                {isConfirming && (
                  <div
                    role="region"
                    aria-labelledby={`rq-confirm-title-${rq.id}`}
                    data-testid="rq-bestaetigung"
                    style={{
                      background: 'var(--color-surface, #fff)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.875rem',
                    }}
                  >
                    <div>
                      <h2
                        id={`rq-confirm-title-${rq.id}`}
                        style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700 }}
                      >
                        Antwort bestätigen
                      </h2>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                        Sie senden eine Antwort an die Sachbearbeitung. Geprüft wird die Frage:
                      </p>
                      <blockquote
                        data-testid="rq-bestaetigung-frage"
                        style={{
                          margin: '0.6rem 0 0',
                          padding: '0.65rem 0.85rem',
                          borderLeft: '3px solid var(--color-primary)',
                          background: 'var(--color-primary-light, #f0f4f8)',
                          fontSize: '0.875rem',
                          lineHeight: 1.45,
                          color: 'var(--color-text)',
                        }}
                      >
                        {rq.text.length > 180 ? `${rq.text.slice(0, 180)}…` : rq.text}
                      </blockquote>
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
                        Ihre Antwort (optional in der Demo)
                      </label>
                      <textarea
                        id={formId}
                        name={formId}
                        rows={3}
                        value={draft}
                        onChange={e => setDrafts(prev => ({ ...prev, [rq.id]: e.target.value }))}
                        placeholder="z. B. Beschäftigungsaufnahme am …"
                        aria-describedby={`${formId}-hint`}
                        data-testid="rq-antwort-textarea"
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
                        Leer lassen → es wird eine Beispielantwort übermittelt.
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-inline"
                        onClick={() => setConfirmingId(null)}
                        data-testid="rq-bestaetigung-abbrechen"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-inline"
                        style={{ background: fristKritisch ? 'var(--color-danger)' : 'var(--color-primary)' }}
                        onClick={() => {
                          const text = draft.trim() || DEMO_BEISPIELANTWORT;
                          answerRueckfrage(rq.id, text);
                          setConfirmingId(null);
                        }}
                        aria-label={`Antwort absenden zu: ${rq.text}`}
                        data-testid="rq-antwort-absenden"
                      >
                        Antwort absenden
                        <Icon name="send" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Keine Rückfragen */}
      {rueckfragen.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ marginBottom: '0.75rem', color: 'var(--color-success)' }}>
            <Icon name="check-circle" size={48} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--color-success)' }}>Keine offenen Fragen</h2>
          <p>Die Behörde hat zurzeit keine Rückfragen an Sie.</p>
        </div>
      )}
    </div>
  );
}
