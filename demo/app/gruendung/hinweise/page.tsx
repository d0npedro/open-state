'use client';

import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import { berechneFairnessSignaleGruendung } from '@/lib/fairness/gruendung-rules';
import { demoGruendungsAkte } from '@/data/mockGruendungsfall';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';
import { Icon } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';

/** Initiale Signale aus dem unveränderten Mock – Vergleichsbasis für Reaktions-Banner */
const INITIAL_SIGNALE = berechneFairnessSignaleGruendung(demoGruendungsAkte);

/**
 * Extrahiert die Rückfrage-ID aus einem UG-Frist-Signal
 * (Signal-ID: `UG-RQ-{rqId}-FRIST`).
 */
function rueckfrageIdAusSignal(signal: FairnessSignal): string | null {
  if (signal.typ !== 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT') return null;
  const match = signal.id.match(/^UG-RQ-(.+)-FRIST$/);
  return match?.[1] ?? null;
}

/** Erkennung des RELEVANT/HINWEIS-Signals zur ausstehenden BG-Anmeldung. */
function isBgAnmeldungSignal(signal: FairnessSignal): boolean {
  return signal.typ === 'UG_BG_ANMELDUNG_AUSSTEHEND' || signal.id === 'UG-BG-ANMELDUNG';}

/** Erkennung des HINWEIS-Signals zu fehlenden Unterlagen. */
function isUnterlagenFehlendSignal(signal: FairnessSignal): boolean {
  return signal.typ === 'UG_UNTERLAGE_FEHLT' || signal.id === 'UG-UNTERLAGEN-FEHLEND';}

/** Erkennung des HINWEIS-Signals zur noch fehlenden Steuernummer. */
function isSteuernummerSignal(signal: FairnessSignal): boolean {
  return signal.typ === 'UG_STEUERNUMMER_FEHLT' || signal.id === 'UG-STEUERNUMMER-FEHLT';}

/** Erkennung des HINWEIS-Signals zum überschrittenen Betriebsdatum. */
function isBetriebsdatumSignal(signal: FairnessSignal): boolean {
  return signal.typ === 'UG_BETRIEBSDATUM_UEBERSCHRITTEN' || signal.id === 'UG-BETRIEBSDATUM';}

/** Erkennung des INFO-Signals zu parallel aktiven Behörden. */
function isParalleleBehoerdenSignal(signal: FairnessSignal): boolean {
  return signal.typ === 'UG_PARALLELE_BEHOERDEN_AKTIV' || signal.id === 'UG-PARALLELE-BEHOERDEN';}

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
                {relevant.map(sig => {
                  const rqId = rueckfrageIdAusSignal(sig);
                  const rqNochOffen = rqId
                    ? akte.rueckfragen.some(r => r.id === rqId && !r.beantwortet)
                    : false;
                  const bgBehörde = isBgAnmeldungSignal(sig)
                    ? akte.beteiligteBehörden.find(b => b.typ === 'BERUFSGENOSSENSCHAFT')
                    : undefined;
                  const bgNochOffen = bgBehörde?.status === 'NICHT_GESTARTET';
                  return (
                    <div key={sig.id} data-testid={`hinweise-relevant-${sig.id}`}>
                      <FairnessPanel signale={[sig]} />
                      {rqId && rqNochOffen && (
                        <div
                          style={{
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
                          }}
                          data-testid={`hinweise-rq-cta-wrap-${rqId}`}
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Diese Rückfrage wartet auf Ihre Antwort. Frist und Begründung sind unter Rückfragen einsehbar.
                          </p>
                          <Link
                            href={`/gruendung/rueckfragen#rq-${rqId}`}
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid={`hinweise-rq-cta-${rqId}`}
                            aria-label={`Rückfrage ${rqId} beantworten`}
                          >
                            <Icon name="chat" size={15} />
                            Frage beantworten
                          </Link>
                        </div>
                      )}
                      {bgBehörde && bgNochOffen && (
                        <div
                          style={{
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
                          }}
                          data-testid={`hinweise-bg-cta-wrap-${bgBehörde.id}`}
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Die BG-Anmeldung erfolgt außerhalb von Open State. Kontakt und Rolle der Stelle
                            finden Sie auf der Behördenkarte.
                          </p>
                          <Link
                            href={`/gruendung/behoerden#beh-${bgBehörde.id}`}
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid={`hinweise-bg-cta-${bgBehörde.id}`}
                            aria-label={`Zur Behördenkarte ${bgBehörde.bezeichnung}`}
                          >
                            <Icon name="building" size={15} />
                            Zur Behördenkarte
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {hinweis.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Hinweise ({hinweis.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hinweis.map(sig => {
                  const fehlendeDocs = isUnterlagenFehlendSignal(sig)
                    ? akte.dokumente.filter(d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT')
                    : [];
                  const erstesFehlend = fehlendeDocs[0];
                  const finanzamt = isSteuernummerSignal(sig)
                    ? akte.beteiligteBehörden.find(b => b.typ === 'FINANZAMT')
                    : undefined;
                  const steuernummerNochOffen = isSteuernummerSignal(sig)
                    ? akte.verfahrensSchritte.some(vs => vs.id === 'VS-05' && vs.status === 'AUSSTEHEND')
                    : false;
                  const betriebsdatumNochOffen = isBetriebsdatumSignal(sig)
                    ? !['GENEHMIGT', 'AKTIVER_BETRIEB', 'BETRIEB_EINGESTELLT'].includes(akte.status)
                    : false;
                  return (
                    <div key={sig.id} data-testid={`hinweise-hinweis-${sig.id}`}>
                      <FairnessPanel signale={[sig]} />
                      {erstesFehlend && (
                        <div
                          style={{
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
                          }}
                          data-testid="hinweise-unterlagen-cta-wrap"
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Begründung und Upload-Möglichkeit finden Sie im Bereich Unterlagen.
                            {fehlendeDocs.length > 1
                              ? ` ${fehlendeDocs.length} Dokumente stehen aus.`
                              : ''}
                          </p>
                          <Link
                            href={`/gruendung/dokumente#dok-${erstesFehlend.id}`}
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid="hinweise-unterlagen-cta"
                            aria-label="Zu den ausstehenden Unterlagen"
                          >
                            <Icon name="file" size={15} />
                            Zu den Unterlagen
                          </Link>
                        </div>
                      )}
                      {finanzamt && steuernummerNochOffen && (
                        <div
                          style={{
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
                          }}
                          data-testid={`hinweise-steuernummer-cta-wrap-${finanzamt.id}`}
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Die Steuernummer vergibt das Finanzamt nach Abschluss der steuerlichen Erfassung.
                            Rolle, Kontakt und offene Schritte finden Sie auf der Behördenkarte.
                          </p>
                          <Link
                            href={`/gruendung/behoerden#beh-${finanzamt.id}`}
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid={`hinweise-steuernummer-cta-${finanzamt.id}`}
                            aria-label={`Zur Behördenkarte ${finanzamt.bezeichnung}`}
                          >
                            <Icon name="building" size={15} />
                            Zum Finanzamt
                          </Link>
                        </div>
                      )}
                      {betriebsdatumNochOffen && (
                        <div
                          style={{
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
                          }}
                          data-testid="hinweise-betriebsdatum-cta-wrap"
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Status, Fortschritt und nächste Handlungsschritte finden Sie auf der
                            Übersichtsseite Ihres Verfahrens.
                          </p>
                          <Link
                            href="/gruendung#verfahrensstatus"
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid="hinweise-betriebsdatum-cta"
                            aria-label="Zum Verfahrensstatus auf der Übersicht"
                          >
                            <Icon name="refresh" size={15} />
                            Zum Verfahrensstatus
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {info.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral)', marginBottom: '0.75rem' }}>
                Informationen ({info.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {info.map(sig => {
                  const paralleleNochAktiv = isParalleleBehoerdenSignal(sig)
                    ? akte.beteiligteBehörden.filter(
                        b => b.status === 'IN_BEARBEITUNG' || b.status === 'RUECKFRAGE_OFFEN'
                      ).length > 1
                    : false;
                  return (
                    <div key={sig.id} data-testid={`hinweise-info-${sig.id}`}>
                      <FairnessPanel signale={[sig]} />
                      {paralleleNochAktiv && (
                        <div
                          style={{
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
                          }}
                          data-testid="hinweise-parallele-behoerden-cta-wrap"
                        >
                          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45 }}>
                            Status, Rolle und offene Schritte aller beteiligten Stellen finden Sie unter
                            Behörden & Verfahrensschritte.
                          </p>
                          <Link
                            href="/gruendung/behoerden"
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                            data-testid="hinweise-parallele-behoerden-cta"
                            aria-label="Zu Behörden und Verfahrensschritten"
                          >
                            <Icon name="building" size={15} />
                            Zu den Behörden
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
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
