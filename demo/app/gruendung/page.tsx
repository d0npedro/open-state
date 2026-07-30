'use client';

import Link from 'next/link';
import {
  demoDokUploadEreignisId,
  demoRqAntwortEreignisId,
  useGruendungState,
} from '@/context/GruendungStateContext';
import {
  aufgabeZiel,
  berechneFairnessSignaleGruendung,
  fairnessSignalVerlaufZiel,
  fairnessSignalZiel,
  FIKTIVES_HEUTE_GRUENDUNG,
  naechsterSchrittZiel,
} from '@/lib/fairness/gruendung-rules';
import { berechneFristTage } from '@/lib/fairness/rules';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';

/** Klarsprache für Resttage (analog AV / Rückfrage-Frist). */
function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

const statusFlow = [
  { key: 'EINGEREICHT',             label: 'Eingereicht'     },
  { key: 'ANGENOMMEN',              label: 'Angenommen'      },
  { key: 'IN_BEARBEITUNG',          label: 'In Bearbeitung'  },
  { key: 'ENTSCHEIDUNG_AUSSTEHEND', label: 'Entscheidung'    },
  { key: 'GENEHMIGT',               label: 'Genehmigt'       },
];

const statusToChip: Record<string, { label: string; css: string; icon: IconName }> = {
  EINGEREICHT:             { label: 'Eingereicht',               css: 'status-chip-primary', icon: 'check-circle' },
  ANGENOMMEN:              { label: 'Angenommen',                css: 'status-chip-primary', icon: 'check-circle' },
  IN_BEARBEITUNG:          { label: 'Wird bearbeitet',           css: 'status-chip-primary', icon: 'refresh'      },
  RUECKFRAGE_AUSSTEHEND:   { label: 'Ihre Antwort wird erwartet', css: 'status-chip-warning', icon: 'alert'       },
  RUECKFRAGE_BEANTWORTET:  { label: 'Antwort übermittelt',       css: 'status-chip-primary', icon: 'check-circle' },
  ENTSCHEIDUNG_AUSSTEHEND: { label: 'Entscheidung steht aus',    css: 'status-chip-neutral', icon: 'clock'        },
  GENEHMIGT:               { label: 'Genehmigt',                css: 'status-chip-success', icon: 'check-circle'  },
};

export default function GruendungPage() {
  const { akte, sessionUploadedIds, sessionAnsweredRqIds } = useGruendungState();
  const chip = statusToChip[akte.status] ?? { label: akte.status, css: 'status-chip-neutral', icon: 'info' as IconName };
  const isRueckfrage = akte.status === 'RUECKFRAGE_AUSSTEHEND';
  const offeneRueckfragen = akte.rueckfragen.filter(r => !r.beantwortet).length;
  // ANGEFORDERT + ABGELEHNT blockieren den Fortschritt (Parität zu /gruendung/dokumente)
  const ausstehendeDokumente = akte.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  const ausstehendeDoks = ausstehendeDokumente.length;
  /** Offene Dokumente mit ISO-Frist, sortiert nach Dringlichkeit (Q-208, Parität AV Q-086). */
  const dokFristen = ausstehendeDokumente
    .filter(d => d.fristDatum && d.frist)
    .map(d => ({
      id: d.id,
      bezeichnung: d.bezeichnung,
      frist: d.frist as string,
      resttage: berechneFristTage(d.fristDatum as string, FIKTIVES_HEUTE_GRUENDUNG),
    }))
    .sort((a, b) => a.resttage - b.resttage);
  const naechsteDokFrist = dokFristen[0];
  /** Session-Uploads für Quittung auf der Übersicht (US-UG-001/003, Parität AV Q-161). */
  const sessionUploads = sessionUploadedIds
    .map(id => akte.dokumente.find(d => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
  const naechsteOffeneUnterlage = ausstehendeDokumente[0] ?? null;
  /** Session-Antworten auf Rückfragen für Quittung auf der Übersicht (Q-199, US-UG-004/005). */
  const sessionAntworten = sessionAnsweredRqIds
    .map(id => akte.rueckfragen.find(r => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const alleFairnessSignale = berechneFairnessSignaleGruendung(akte);
  // Übersicht: nur handlungsrelevante Stufen — INFO bleibt auf /gruendung/hinweise
  const fairnessSignale = alleFairnessSignale.filter(
    s => s.prioritaet === 'RELEVANT' || s.prioritaet === 'HINWEIS'
  );
  const weitereInfoCount = alleFairnessSignale.filter(s => s.prioritaet === 'INFO').length;
  const schrittZiel = naechsterSchrittZiel(akte);
  const aufgabenMitZiel = akte.offeneAufgaben.map((text, idx) => ({
    text,
    idx,
    ziel: aufgabeZiel(text, akte),
  }));

  const flowKey = isRueckfrage ? 'IN_BEARBEITUNG' : akte.status;
  const currentIndex = statusFlow.findIndex(s => s.key === flowKey);
  const fortschritt = Math.round(((currentIndex + 1) / statusFlow.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Action-Banner ──────────────────────────────────────── */}
      {isRueckfrage && (
        <div className="action-banner" role="alert" aria-live="polite">
          <div className="action-banner-icon">
            <Icon name="alert" size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-banner-title">Jetzt handeln — Rückfrage offen</div>
            <p className="action-banner-text">
              Das Finanzamt wartet auf Ihre Antwort. Bis zur Antwort ruht die Bearbeitung Ihrer Akte.
            </p>
            <Link href="/gruendung/rueckfragen" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              Frage jetzt beantworten
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ─── RQ-Quittung: Session-Antwort auf der Übersicht ─────
          UX: Nach dem Beantworten muss klar sein, *welche* Frage erledigt ist
          und wo die Antwort im Verlauf nachvollziehbar ist (US-UG-004/005, Parität AV Q-198). */}
      {sessionAntworten.length > 0 && (
        <div
          className="notice-box notice-box-success"
          role="status"
          aria-live="polite"
          data-testid="rq-quittung"
        >
          <Icon name="check-circle" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <strong
              style={{ display: 'block', marginBottom: '0.35rem', fontSize: '1rem' }}
              data-testid="rq-quittung-titel"
            >
              {sessionAntworten.length === 1
                ? 'Antwort übermittelt'
                : `${sessionAntworten.length} Antworten übermittelt`}
            </strong>
            <ul
              style={{ margin: '0 0 0.5rem', paddingLeft: '1.15rem', fontSize: '0.9rem' }}
              data-testid="rq-quittung-liste"
            >
              {sessionAntworten.map(rq => {
                const kurz =
                  rq.text.length > 90 ? `${rq.text.slice(0, 87).trim()}…` : rq.text;
                return (
                  <li
                    key={rq.id}
                    data-testid={`rq-quittung-item-${rq.id}`}
                    style={{ marginBottom: '0.35rem' }}
                  >
                    {kurz}
                    {rq.beantwortetAm ? (
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {' '}
                        · beantwortet am {rq.beantwortetAm}
                      </span>
                    ) : null}
                    {' '}
                    <Link
                      href={`/gruendung/verlauf#ere-${demoRqAntwortEreignisId(rq.id)}`}
                      className="btn btn-secondary btn-inline"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        minHeight: 36,
                        fontSize: '0.8rem',
                        marginLeft: '0.25rem',
                        verticalAlign: 'middle',
                      }}
                      data-testid={`rq-quittung-verlauf-${rq.id}`}
                      aria-label="Ihre Antwort auf die Rückfrage im Verlauf ansehen"
                    >
                      <Icon name="clock" size={14} />
                      Im Verlauf ansehen
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Die Behörde wurde informiert.
              {ausstehendeDoks > 0
                ? ' Als Nächstes fehlen noch Unterlagen.'
                : ' Keine offene Rückfrage mehr.'}
              {' '}
              Demo: Die Antwort gilt für diese Browser-Session.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link
                href="/gruendung/rueckfragen"
                className="btn btn-secondary btn-inline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minHeight: 44,
                }}
                data-testid="rq-quittung-fragen-cta"
              >
                Zu den Fragen
                <Icon name="arrow-right" size={16} />
              </Link>
              {ausstehendeDoks > 0 && (
                <Link
                  href={
                    naechsteOffeneUnterlage
                      ? `/gruendung/dokumente#dok-${naechsteOffeneUnterlage.id}`
                      : '/gruendung/dokumente'
                  }
                  className="btn btn-primary btn-inline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    minHeight: 44,
                    background: '#B45309',
                    borderColor: '#B45309',
                  }}
                  data-testid="rq-quittung-unterlagen-cta"
                >
                  Unterlagen hochladen
                  <Icon name="arrow-right" size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Upload-Quittung: Session-Uploads auf der Übersicht ─────
          UX: Nach Upload muss klar sein, *was* eingegangen ist und
          *welche* Unterlage als Nächstes noch fehlt (US-UG-001/003). */}
      {sessionUploads.length > 0 && (
        <div
          className="notice-box notice-box-success"
          role="status"
          aria-live="polite"
          data-testid="upload-quittung"
        >
          <Icon name="check-circle" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <strong
              style={{ display: 'block', marginBottom: '0.35rem', fontSize: '1rem' }}
              data-testid="upload-quittung-titel"
            >
              {sessionUploads.length === 1
                ? 'Unterlage eingegangen'
                : `${sessionUploads.length} Unterlagen eingegangen`}
            </strong>
            <ul
              style={{ margin: '0 0 0.5rem', paddingLeft: '1.15rem', fontSize: '0.9rem' }}
              data-testid="upload-quittung-liste"
            >
              {sessionUploads.map(dok => (
                <li
                  key={dok.id}
                  data-testid={`upload-quittung-item-${dok.id}`}
                  style={{ marginBottom: '0.35rem' }}
                >
                  {dok.bezeichnung}
                  {dok.hochgeladenAm ? (
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {' '}
                      · eingereicht am {dok.hochgeladenAm}
                    </span>
                  ) : null}
                  {' '}
                  <Link
                    href={`/gruendung/verlauf#ere-${demoDokUploadEreignisId(dok.id)}`}
                    className="btn btn-secondary btn-inline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      minHeight: 36,
                      fontSize: '0.8rem',
                      marginLeft: '0.25rem',
                      verticalAlign: 'middle',
                    }}
                    data-testid={`upload-quittung-verlauf-${dok.id}`}
                    aria-label={`${dok.bezeichnung} im Verlauf ansehen`}
                  >
                    <Icon name="clock" size={14} />
                    Im Verlauf ansehen
                  </Link>
                </li>
              ))}
            </ul>
            {naechsteOffeneUnterlage ? (
              <div
                data-testid="upload-quittung-naechste"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 0.875rem',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-warning-light)',
                  borderLeft: '4px solid var(--color-warning)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-warning)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Nächste offene Unterlage
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                  {naechsteOffeneUnterlage.bezeichnung}
                </div>
                {naechsteOffeneUnterlage.frist && (
                  <div
                    style={{
                      marginTop: '0.35rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Icon name="calendar" size={14} />
                    Einreichen bis {naechsteOffeneUnterlage.frist}
                    {naechsteOffeneUnterlage.fristDatum && (
                      <span data-testid="upload-quittung-naechste-countdown">
                        ·{' '}
                        {fristRestLabel(
                          berechneFristTage(
                            naechsteOffeneUnterlage.fristDatum,
                            FIKTIVES_HEUTE_GRUENDUNG
                          )
                        )}
                      </span>
                    )}
                  </div>
                )}
                <Link
                  href={`/gruendung/dokumente#dok-${naechsteOffeneUnterlage.id}`}
                  className="btn btn-primary"
                  style={{
                    marginTop: '0.75rem',
                    background: '#B45309',
                    borderColor: '#B45309',
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                  data-testid="upload-quittung-naechste-cta"
                >
                  Nächste Unterlage hochladen
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            ) : (
              <p
                style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}
                data-testid="upload-quittung-vollstaendig"
              >
                Alle angeforderten Unterlagen liegen vor. Die Behördenbearbeitung kann fortgesetzt werden.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── Fall-Kopf ──────────────────────────────────────────── */}
      <div
        className="card"
        id="verfahrensstatus"
        data-testid="uebersicht-verfahrensstatus"
        style={{ scrollMarginTop: '5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{akte.gewerbebezeichnung}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {akte.vorgangstyp} · {akte.rechtsform.replace('_', ' ')} · WZ {akte.wzCode}
            </p>
          </div>
          <span className={`status-chip ${chip.css}`}>
            <Icon name={chip.icon} size={15} />
            {chip.label}
          </span>
        </div>

        {/* Fortschrittsbalken */}
        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <span>Verfahrensfortschritt</span>
          <strong style={{ color: 'var(--color-primary)' }}>{fortschritt} %</strong>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${fortschritt}%` }} />
        </div>

        {/* Vertikale Schrittliste */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {statusFlow.map((step, idx) => {
            const done   = idx < currentIndex;
            const active = idx === currentIndex;
            const dotClass = done ? 'step-dot step-dot-done' : active ? 'step-dot step-dot-active' : 'step-dot step-dot-pending';
            return (
              <div key={step.key} className="step-row">
                <div className={dotClass} />
                <span className={`step-label ${done ? 'step-label-done' : active ? 'step-label-active' : 'step-label-pending'}`}>
                  {step.label}
                  {active && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 400 }}>← Sie sind hier</span>}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem', marginBottom: 0 }}>
          Eingereicht: {akte.ersteinreichung} · Letzte Aktivität: {akte.letzteAktualisierung}
        </p>
      </div>

      {/* ─── Nächster Schritt & offene Aufgaben ─────────────────── */}
      {(akte.naechsterSchritt || aufgabenMitZiel.length > 0) && (
        <div className="card" data-testid="uebersicht-naechste-schritte">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
            Was als Nächstes?
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 1rem' }}>
            Empfohlener nächster Schritt und offene Aufgaben mit direktem Link zur betroffenen Stelle.
          </p>

          {akte.naechsterSchritt && (
            <div
              data-testid="uebersicht-naechster-schritt"
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius)',
                background: isRueckfrage ? 'var(--color-warning-light)' : 'var(--color-primary-light)',
                border: `1px solid ${isRueckfrage ? 'var(--color-warning)' : 'var(--color-border)'}`,
                marginBottom: aufgabenMitZiel.length > 0 ? '1rem' : 0,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                Nächster Schritt
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{akte.naechsterSchritt}</p>
              {schrittZiel && (
                <div style={{ marginTop: '0.75rem' }}>
                  {schrittZiel.hint && (
                    <p
                      style={{
                        margin: '0 0 0.65rem',
                        fontSize: '0.8rem',
                        lineHeight: 1.45,
                        color: 'var(--color-text-muted)',
                      }}
                      data-testid="uebersicht-naechster-schritt-cta-hint"
                    >
                      {schrittZiel.hint}
                    </p>
                  )}
                  <Link
                    href={schrittZiel.href}
                    className="btn btn-primary"
                    data-testid="uebersicht-naechster-schritt-cta"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    aria-label={schrittZiel.cta}
                  >
                    <Icon name={schrittZiel.icon} size={15} />
                    {schrittZiel.cta}
                  </Link>
                </div>
              )}
            </div>
          )}

          {aufgabenMitZiel.length > 0 && (
            <div data-testid="uebersicht-offene-aufgaben">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Offene Aufgaben ({aufgabenMitZiel.length})
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aufgabenMitZiel.map(({ text, idx, ziel }) => (
                  <li
                    key={`${idx}-${text.slice(0, 24)}`}
                    data-testid={`uebersicht-aufgabe-${idx}`}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem 0.75rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-neutral-light)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', lineHeight: 1.45, flex: '1 1 12rem' }}>{text}</span>
                    {ziel && (
                      <Link
                        href={ziel.href}
                        data-testid={`uebersicht-aufgabe-link-${ziel.testKey}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          flexShrink: 0,
                        }}
                        aria-label={`${ziel.cta}: ${text}`}
                      >
                        <Icon name={ziel.icon} size={13} />
                        {ziel.cta} →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ─── Schnellzugriff ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          {
            label: 'Behörden',
            val: `${akte.beteiligteBehörden.filter(b => b.status === 'IN_BEARBEITUNG' || b.status === 'RUECKFRAGE_OFFEN').length} aktiv`,
            href: '/gruendung/behoerden',
            urgent: false,
            icon: 'building' as IconName,
            testId: undefined as string | undefined,
          },
          {
            label: 'Unterlagen',
            val:
              ausstehendeDoks > 0
                ? naechsteDokFrist
                  ? `${ausstehendeDoks} ausstehend · ${fristRestLabel(naechsteDokFrist.resttage)}`
                  : `${ausstehendeDoks} ausstehend`
                : 'Alles eingereicht',
            href: '/gruendung/dokumente',
            urgent: ausstehendeDoks > 0,
            icon: 'file' as IconName,
            testId: 'kachel-unterlagen' as string | undefined,
          },
          {
            label: 'Offene Fragen',
            val: `${offeneRueckfragen} offen`,
            href: '/gruendung/rueckfragen',
            urgent: offeneRueckfragen > 0,
            icon: 'chat' as IconName,
            testId: undefined as string | undefined,
          },
          {
            label: 'Verlauf',
            val: `${akte.ereignisse.length} Einträge`,
            href: '/gruendung/verlauf',
            urgent: false,
            icon: 'clock' as IconName,
            testId: undefined as string | undefined,
          },
        ].map(k => (
          <Link
            key={k.label}
            href={k.href}
            className="card"
            data-testid={k.testId}
            style={{
              display: 'flex', flexDirection: 'column', gap: '0.375rem', textDecoration: 'none',
              borderLeft: k.urgent ? '4px solid var(--color-warning)' : undefined,
              background: k.urgent ? 'var(--color-warning-light)' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Icon name={k.icon} size={14} />
              {k.label}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text)' }}>{k.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Ansehen →</div>
          </Link>
        ))}
      </div>

      {/* ─── Fristen offener Unterlagen (Q-208, Parität AV Q-086) ─
          UX: Countdown auf der Übersicht, nicht erst unter Dokumente. */}
      {dokFristen.length > 0 && (
        <div className="card" data-testid="dok-fristen-uebersicht">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
            Fristen offener Unterlagen
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 1rem' }}>
            Berechnet gegen Demo-Stichtag{' '}
            {FIKTIVES_HEUTE_GRUENDUNG.split('-').reverse().join('.')}. Keine automatische Mahnung.
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {dokFristen.map(dok => {
              const kritisch = dok.resttage <= 5;
              return (
                <li
                  key={dok.id}
                  data-testid={`dok-frist-${dok.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: kritisch
                      ? 'var(--color-danger-light)'
                      : 'var(--color-warning-light)',
                    borderLeft: `4px solid ${kritisch ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--color-text)',
                      }}
                    >
                      {dok.bezeichnung}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        marginTop: '0.35rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: kritisch ? 'var(--color-danger)' : 'var(--color-warning)',
                      }}
                    >
                      <Icon name="calendar" size={15} />
                      Einreichen bis {dok.frist}
                    </div>
                  </div>
                  <span
                    className={`status-chip ${kritisch ? 'status-chip-danger' : 'status-chip-warning'}`}
                    data-testid={`dok-frist-countdown-${dok.id}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  >
                    <Icon name="clock" size={14} />
                    {fristRestLabel(dok.resttage)}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link
            href={
              naechsteDokFrist
                ? `/gruendung/dokumente#dok-${naechsteDokFrist.id}`
                : '/gruendung/dokumente'
            }
            data-testid="dok-fristen-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--color-primary)',
              fontWeight: 600,
            }}
          >
            Unterlagen hochladen <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      )}

      {/* ─── Beteiligte Behörden ─────────────────────────────────── */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Beteiligte Behörden</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {akte.beteiligteBehörden.map(beh => {
            const isOpen = beh.status === 'RUECKFRAGE_OFFEN';
            const isDone = beh.status === 'ABGESCHLOSSEN';
            const offeneRq = akte.rueckfragen.find(
              r => r.anforderndeBehördeId === beh.id && !r.beantwortet
            );
            return (
              <div
                key={beh.id}
                data-testid={`uebersicht-behoerde-${beh.id}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem', borderRadius: 'var(--radius)',
                  background: isOpen ? 'var(--color-warning-light)' : isDone ? 'var(--color-success-light, #f0fff4)' : 'var(--color-neutral-light)',
                  gap: '0.75rem', flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{beh.bezeichnung}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{beh.zustaendigeStelle}</div>
                  {offeneRq && (
                    <Link
                      href={`/gruendung/rueckfragen#rq-${offeneRq.id}`}
                      data-testid={`uebersicht-rq-link-${beh.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        marginTop: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
                        color: 'var(--color-warning)', textDecoration: 'none',
                      }}
                      aria-label={`Offene Rückfrage von ${beh.bezeichnung} beantworten`}
                    >
                      <Icon name="chat" size={13} />
                      Offene Frage beantworten →
                    </Link>
                  )}
                </div>
                <span className={`status-chip ${isOpen ? 'status-chip-warning' : isDone ? 'status-chip-success' : beh.status === 'IN_BEARBEITUNG' ? 'status-chip-primary' : 'status-chip-neutral'}`}>
                  <Icon name={isDone ? 'check-circle' : isOpen ? 'alert' : beh.status === 'IN_BEARBEITUNG' ? 'refresh' : 'clock'} size={14} />
                  {isOpen ? 'Rückfrage offen' : isDone ? 'Abgeschlossen' : beh.status === 'IN_BEARBEITUNG' ? 'In Bearbeitung' : 'Noch nicht gestartet'}
                </span>
              </div>
            );
          })}
        </div>
        <Link
          href="/gruendung/behoerden"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.875rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}
        >
          Alle Behörden und Schritte <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      {/* ─── Fairness-Kurzblock (nur RELEVANT + HINWEIS; INFO → Hinweise) ─ */}
      {fairnessSignale.length > 0 && (
        <div className="card" data-testid="uebersicht-fairness-kurzblock">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
            Hinweise zu Ihrem Verfahren
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 1rem' }}>
            Handlungsrelevante Hinweise aus dem Aktenzustand — keine Entscheidung der Behörden.
            {weitereInfoCount > 0 && (
              <> Zusätzliche Hintergrund-Hinweise finden Sie unter „Alle Details“.</>
            )}
          </p>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            data-testid="uebersicht-fairness-liste"
          >
            {fairnessSignale.map(sig => {
              const ziel = fairnessSignalZiel(sig, akte);
              const verlaufZiel = fairnessSignalVerlaufZiel(sig, akte);
              return (
                <div
                  key={sig.id}
                  data-testid={`uebersicht-fairness-${sig.id}`}
                  data-prioritaet={sig.prioritaet}
                  className={`notice-box ${sig.prioritaet === 'RELEVANT' ? 'notice-box-warn' : 'notice-box-info'}`}
                >
                  <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{sig.titel}</strong>
                    <span style={{ fontSize: '0.875rem' }}>{sig.erklaerung}</span>
                    {sig.naechsterSchritt && (
                      <div style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                        → {sig.naechsterSchritt}
                      </div>
                    )}
                    {(ziel || verlaufZiel) && (
                      <div style={{ marginTop: '0.65rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '0.35rem 0.85rem',
                          }}
                        >
                          {ziel && (
                            <Link
                              href={ziel.href}
                              data-testid={`uebersicht-fairness-cta-${ziel.testKey}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                                textDecoration: 'none',
                              }}
                              aria-label={`${ziel.cta}: ${sig.titel}`}
                            >
                              <Icon name={ziel.icon} size={13} />
                              {ziel.cta} →
                            </Link>
                          )}
                          {verlaufZiel && (
                            <Link
                              href={verlaufZiel.href}
                              data-testid={`uebersicht-fairness-verlauf-${verlaufZiel.ereignisId}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                              }}
                              aria-label={verlaufZiel.ariaLabel ?? verlaufZiel.cta}
                            >
                              <Icon name="clock" size={13} />
                              {verlaufZiel.cta} →
                            </Link>
                          )}
                        </div>
                        {ziel?.hint && (
                          <p
                            data-testid={`uebersicht-fairness-cta-hint-${ziel.testKey}`}
                            style={{
                              margin: '0.35rem 0 0',
                              fontSize: '0.75rem',
                              lineHeight: 1.45,
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {ziel.hint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/gruendung/hinweise"
            data-testid="uebersicht-fairness-hinweise-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.875rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}
          >
            {weitereInfoCount > 0
              ? `Alle Details ansehen (${weitereInfoCount} weitere Hinweis${weitereInfoCount === 1 ? '' : 'e'})`
              : 'Alle Details ansehen'}{' '}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      )}

      {/* ─── Demo-Hinweis ────────────────────────────────────────── */}
      <div className="notice-box notice-box-info" style={{ fontSize: '0.8rem' }}>
        <Icon name="info" size={15} style={{ flexShrink: 0 }} />
        <span><strong>Demo:</strong> Alle Daten sind fiktiv. Beantworten Sie die offene Rückfrage — der Status ändert sich in der gesamten App.</span>
      </div>
    </div>
  );
}
