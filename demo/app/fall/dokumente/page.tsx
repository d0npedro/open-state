// UX-Grund: Dokument-Upload muss für jeden Menschen sofort verständlich sein.
'use client';
// Status-Visualisierung: Farbe + Icon + Text (triple redundancy).
// Upload-Zone: groß, fingerfreundlich, mit Kamera-Hinweis für Handy-Nutzer.
// Interaktion (Q-071): Upload ändert Demo-State — Fairness-Signale reagieren live.

import {
  demoDokUploadEreignisId,
  useDemoState,
} from '@/context/DemoStateContext';
import { DokumentStatus } from '@/types';
import { Icon } from '@/components/Icon';
import { berechneFairnessSignale, berechneFristTage, FIKTIVES_HEUTE } from '@/lib/fairness/rules';
import Link from 'next/link';

function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

const statusInfo: Record<DokumentStatus, { label: string; cssClass: string; icon: Parameters<typeof Icon>[0]['name'] }> = {
  ANGEFORDERT: { label: 'Wird noch benötigt',   cssClass: 'status-chip-warning', icon: 'alert' },
  HOCHGELADEN: { label: 'Hochgeladen',           cssClass: 'status-chip-primary', icon: 'upload' },
  IN_PRUEFUNG: { label: 'Wird geprüft',          cssClass: 'status-chip-primary', icon: 'eye' },
  AKZEPTIERT:  { label: 'Akzeptiert',            cssClass: 'status-chip-success', icon: 'check-circle' },
  ABGELEHNT:   { label: 'Abgelehnt — bitte neu', cssClass: 'status-chip-danger',  icon: 'x-circle' },
};

export default function DokumentePage() {
  const { fall, uploadDokument, sessionUploadedIds } = useDemoState();
  const { dokumente } = fall;
  const ausstehend = dokumente.filter(d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT').length;
  const eingereicht = dokumente.filter(d => d.status !== 'ANGEFORDERT' && d.status !== 'ABGELEHNT').length;
  const unterlagenSignal = berechneFairnessSignale(fall).find(s => s.typ === 'UNTERLAGE_FEHLT_BLOCKIERT');
  const sessionUploadCount = sessionUploadedIds.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Ihre Unterlagen</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          {eingereicht} von {dokumente.length} Unterlagen eingereicht
          {ausstehend > 0 && (
            <span style={{ fontWeight: 700, color: 'var(--color-warning)', marginLeft: '0.5rem' }}>
              · {ausstehend} fehlen noch
            </span>
          )}
        </p>
        {/* Fortschrittsbalken */}
        <div className="progress-bar-wrap" style={{ marginTop: '0.875rem' }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.round((eingereicht / dokumente.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Live-Hinweis: Fairness-Signal zu fehlenden Unterlagen (inkl. berechneter Frist) */}
      {unterlagenSignal && (
        <div
          className="notice-box notice-box-warn"
          role="status"
          data-testid="fairness-signal-unterlagen"
        >
          <Icon name="alert" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong
              style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}
              data-testid="fairness-signal-unterlagen-titel"
            >
              {unterlagenSignal.titel}
            </strong>
            <p
              style={{ fontSize: '0.875rem', margin: 0 }}
              data-testid="fairness-signal-unterlagen-erklaerung"
            >
              {unterlagenSignal.erklaerung}
            </p>
            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0', color: 'var(--color-text-muted)' }}>
              Demo: Nach dem Hochladen verschwindet dieses Signal auch unter{' '}
              <Link
                href="/fall/hinweise"
                data-testid="dok-hinweise-link"
                style={{ color: 'var(--color-primary)' }}
              >
                Verfahrenslage
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {ausstehend === 0 && (
        <div
          className="notice-box notice-box-success"
          role="status"
          data-testid="dok-alle-vorliegend"
        >
          <Icon name="check-circle" size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Alle angeforderten Unterlagen liegen vor</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Das Fairness-Signal „Unterlage fehlt“ entfällt. Die Prüfung kann fortgesetzt werden.
              {sessionUploadCount > 0 && (
                <span data-testid="dok-alle-vorliegend-session">
                  {' '}
                  In dieser Demo-Session {sessionUploadCount === 1 ? 'wurde 1 Unterlage' : `wurden ${sessionUploadCount} Unterlagen`} markiert.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ─── Ausstehende Dokumente zuerst ───────────────────────────
          UX-Grund: Progressive Disclosure + Priorität — was noch
          fehlt, steht immer oben. Erledigte kommen danach.          */}
      {[...dokumente].sort((a, b) => {
        const prio: Record<DokumentStatus, number> = {
          ANGEFORDERT: 0, ABGELEHNT: 1, HOCHGELADEN: 2, IN_PRUEFUNG: 3, AKZEPTIERT: 4,
        };
        return prio[a.status] - prio[b.status];
      }).map(dok => {
        const si = statusInfo[dok.status];
        const istAusstehend  = dok.status === 'ANGEFORDERT';
        const istAbgelehnt   = dok.status === 'ABGELEHNT';
        const brauchtUpload  = istAusstehend || istAbgelehnt;
        /** Session-Upload: lokale Quittung auf der Karte (US-AV-003). */
        const istSessionUpload = sessionUploadedIds.includes(dok.id);

        return (
          <div
            key={dok.id}
            id={`dok-${dok.id}`}
            className="card"
            data-testid={`dok-karte-${dok.id}`}
            style={{
              borderLeft: brauchtUpload ? '5px solid var(--color-warning)' : dok.status === 'AKZEPTIERT' ? '5px solid var(--color-success)' : dok.status === 'HOCHGELADEN' ? '5px solid var(--color-primary)' : '1px solid var(--color-border)',
              scrollMarginTop: '5rem',
            }}
          >
            {/* Dokumentenheader: Titel + Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius)',
                  background: brauchtUpload ? 'var(--color-warning-light)' : 'var(--color-neutral-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: brauchtUpload ? 'var(--color-warning)' : dok.status === 'AKZEPTIERT' ? 'var(--color-success)' : 'var(--color-primary)',
                }}>
                  <Icon name="file" size={20} />
                </div>
                <h3 style={{ fontWeight: 700, margin: 0, fontSize: '1rem' }}>{dok.bezeichnung}</h3>
              </div>
              <span className={`status-chip ${si.cssClass}`} style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                <Icon name={si.icon} size={14} />
                {si.label}
              </span>
            </div>

            {/* Warum wird das Dokument benötigt? */}
            <div className="notice-box notice-box-neutral" style={{ marginBottom: '0.875rem' }}>
              <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Warum wird das benötigt?</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>{dok.begründung}</p>
              </div>
            </div>

            {/* Frist + Countdown (analog Rückfrage, Demo-Stichtag FIKTIVES_HEUTE) */}
            {dok.frist && brauchtUpload && (() => {
              const resttage = dok.fristDatum
                ? berechneFristTage(dok.fristDatum, FIKTIVES_HEUTE)
                : null;
              const kritisch = resttage !== null && resttage <= 5;
              const farbe = kritisch ? 'var(--color-danger)' : 'var(--color-warning)';
              return (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.5rem 1rem',
                    marginBottom: '0.875rem',
                    color: farbe,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                  data-testid={`dok-seite-frist-${dok.id}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="calendar" size={15} />
                    Einreichen bis: {dok.frist}
                  </span>
                  {resttage !== null && (
                    <span
                      className={`status-chip ${kritisch ? 'status-chip-danger' : 'status-chip-warning'}`}
                      style={{ fontSize: '0.75rem' }}
                      data-testid={`dok-seite-countdown-${dok.id}`}
                    >
                      <Icon name="clock" size={13} />
                      {fristRestLabel(resttage)}
                    </span>
                  )}
                </div>
              );
            })()}
            {dok.hochgeladenAm && !istSessionUpload && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <Icon name="check-circle" size={15} />
                Eingereicht am {dok.hochgeladenAm}
              </div>
            )}

            {/* Lokale Upload-Quittung + Verlauf-Tiefenlink (US-AV-003/007, Parität UG Q-188) */}
            {istSessionUpload && (
              <div
                className="notice-box notice-box-success"
                role="status"
                aria-live="polite"
                data-testid={`dok-upload-quittung-${dok.id}`}
                style={{ marginBottom: '0.875rem' }}
              >
                <Icon name="check-circle" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <strong
                      style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}
                      data-testid={`dok-upload-quittung-titel-${dok.id}`}
                    >
                      Upload bestätigt
                    </strong>
                    <p style={{ fontSize: '0.875rem', margin: 0 }} data-testid={`dok-upload-quittung-text-${dok.id}`}>
                      {dok.bezeichnung}
                      {dok.hochgeladenAm ? (
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {' '}
                          · eingereicht am {dok.hochgeladenAm}
                        </span>
                      ) : null}
                    </p>
                    <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 0', color: 'var(--color-text-muted)' }}>
                      Demo: Es wurde keine Datei gespeichert — der Status steht auf „Hochgeladen“.
                      Die Quittung gilt für diese Browser-Session.
                    </p>
                  </div>
                  <Link
                    href={`/fall/verlauf#ere-${demoDokUploadEreignisId(dok.id)}`}
                    className="btn btn-secondary btn-inline"
                    style={{
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      minHeight: 44,
                    }}
                    data-testid={`dok-verlauf-link-${dok.id}`}
                    aria-label={`${dok.bezeichnung} im Verlauf ansehen`}
                  >
                    <Icon name="clock" size={16} />
                    Im Verlauf ansehen
                  </Link>
                </div>
              </div>
            )}

            {/* Upload-Bereich — Demo speichert keine Datei, ändert nur den Fallzustand */}
            {brauchtUpload && (
              <div>
                <label
                  className="upload-zone"
                  htmlFor={`upload-${dok.id}`}
                  aria-label={`${dok.bezeichnung} hochladen`}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (document.getElementById(`upload-${dok.id}`) as HTMLInputElement)?.click();
                    }
                  }}
                >
                  <div style={{ color: 'var(--color-primary)' }}>
                    <Icon name="upload" size={40} />
                  </div>
                  <span className="upload-zone-label">Dokument hochladen</span>
                  <span className="upload-zone-hint">
                    Tippen Sie hier · PDF, JPG, PNG · max. 10 MB
                  </span>
                  <span className="upload-zone-hint" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    📷 Auch per Handykamera möglich
                  </span>
                  <span className="upload-zone-hint" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Demo: Es wird keine Datei gespeichert — nur der Antragsstatus ändert sich.
                  </span>
                  <input
                    id={`upload-${dok.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                    onChange={() => uploadDokument(dok.id)}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}
                  onClick={() => uploadDokument(dok.id)}
                >
                  Demo: Als hochgeladen markieren
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
