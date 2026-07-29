'use client';

import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import { berechneFairnessSignaleGruendung } from '@/lib/fairness/gruendung-rules';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import type { FairnessSignal } from '@/types/fairness';
import type { GruendungsAkte } from '@/types/gruendung';

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

/** Ziel-Link für eine offene Aufgabe aus Klartext + aktuellem Aktenzustand. */
function aufgabeZiel(
  text: string,
  akte: GruendungsAkte
): { href: string; cta: string; icon: IconName; testKey: string } | null {
  const t = text.toLowerCase();

  if (t.includes('rückfrage')) {
    const rq = akte.rueckfragen.find(r => !r.beantwortet);
    if (!rq) return null;
    return {
      href: `/gruendung/rueckfragen#rq-${rq.id}`,
      cta: 'Zur Rückfrage',
      icon: 'chat',
      testKey: `rq-${rq.id}`,
    };
  }

  if (
    t.includes('hochladen') ||
    t.includes('unterlage') ||
    t.includes('qualifikation') ||
    t.includes('nachweis')
  ) {
    const dok = akte.dokumente.find(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );
    if (!dok) return null;
    return {
      href: `/gruendung/dokumente#dok-${dok.id}`,
      cta: 'Zu den Unterlagen',
      icon: 'file',
      testKey: `dok-${dok.id}`,
    };
  }

  if (
    t.includes('berufsgenossenschaft') ||
    t.includes('bg etem') ||
    (t.includes('bg ') && t.includes('anmeldung'))
  ) {
    const bg = akte.beteiligteBehörden.find(b => b.typ === 'BERUFSGENOSSENSCHAFT');
    if (!bg) return null;
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'Zur Behördenkarte',
      icon: 'building',
      testKey: `beh-${bg.id}`,
    };
  }

  return {
    href: '/gruendung/behoerden',
    cta: 'Zu den Behörden',
    icon: 'building',
    testKey: 'behoerden',
  };
}

/** Primärer CTA zum naechsterSchritt-Text (gleiche Heuristik wie Aufgaben). */
function naechsterSchrittZiel(
  akte: GruendungsAkte
): { href: string; cta: string; icon: IconName } | null {
  const offeneRq = akte.rueckfragen.find(r => !r.beantwortet);
  if (offeneRq) {
    return {
      href: `/gruendung/rueckfragen#rq-${offeneRq.id}`,
      cta: 'Rückfrage beantworten',
      icon: 'chat',
    };
  }
  const fehlendesDok = akte.dokumente.find(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  if (fehlendesDok) {
    return {
      href: `/gruendung/dokumente#dok-${fehlendesDok.id}`,
      cta: 'Unterlage hochladen',
      icon: 'file',
    };
  }
  const bg = akte.beteiligteBehörden.find(
    b => b.typ === 'BERUFSGENOSSENSCHAFT' && b.status === 'NICHT_GESTARTET'
  );
  if (bg) {
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'BG-Hinweis ansehen',
      icon: 'building',
    };
  }
  return null;
}

/**
 * Kurz-CTA für Fairness-Signale auf der Übersicht
 * (Rückfrage / Unterlagen / BG / Steuernummer / Betriebsdatum).
 * Nur solange der auslösende Aktenzustand noch greift.
 * Optionaler Hilfstext (`hint`) erklärt den CTA-Kontext session-sensitiv.
 */
function fairnessSignalZiel(
  signal: FairnessSignal,
  akte: GruendungsAkte
): { href: string; cta: string; icon: IconName; testKey: string; hint?: string } | null {
  // Offene Rückfrage mit Frist
  if (
    signal.typ === 'UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT' ||
    signal.id.startsWith('UG-RQ-')
  ) {
    const match = signal.id.match(/^UG-RQ-(.+)-FRIST$/);
    const rqId = match?.[1];
    if (!rqId) return null;
    const offen = akte.rueckfragen.some(r => r.id === rqId && !r.beantwortet);
    if (!offen) return null;
    return {
      href: `/gruendung/rueckfragen#rq-${rqId}`,
      cta: 'Frage beantworten',
      icon: 'chat',
      testKey: `rq-${rqId}`,
    };
  }

  // Fehlende Unterlagen
  if (signal.typ === 'UG_UNTERLAGE_FEHLT' || signal.id === 'UG-UNTERLAGEN-FEHLEND') {
    const dok = akte.dokumente.find(
      d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
    );
    if (!dok) return null;
    return {
      href: `/gruendung/dokumente#dok-${dok.id}`,
      cta: 'Zu den Unterlagen',
      icon: 'file',
      testKey: `dok-${dok.id}`,
    };
  }

  // BG-Anmeldung ausstehend
  if (signal.typ === 'UG_BG_ANMELDUNG_AUSSTEHEND' || signal.id === 'UG-BG-ANMELDUNG') {
    const bg = akte.beteiligteBehörden.find(
      b => b.typ === 'BERUFSGENOSSENSCHAFT' && b.status === 'NICHT_GESTARTET'
    );
    if (!bg) return null;
    return {
      href: `/gruendung/behoerden#beh-${bg.id}`,
      cta: 'Zur Behördenkarte',
      icon: 'building',
      testKey: `beh-${bg.id}`,
    };
  }

  // Steuernummer fehlt (VS-05 AUSSTEHEND oder IN_BEARBEITUNG)
  // CTA-Text: bei offener Rückfrage/Ausstehend „Zum Finanzamt“;
  // nach Start der Vergabe (IN_BEARBEITUNG) „Steuernummer-Stand ansehen“.
  if (signal.typ === 'UG_STEUERNUMMER_FEHLT' || signal.id === 'UG-STEUERNUMMER-FEHLT') {
    const vs05 = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
    const offen =
      !!vs05 &&
      (vs05.status === 'AUSSTEHEND' || vs05.status === 'IN_BEARBEITUNG');
    if (!offen) return null;
    const finanzamt = akte.beteiligteBehörden.find(b => b.typ === 'FINANZAMT');
    if (!finanzamt) return null;
    const inBearbeitung = vs05.status === 'IN_BEARBEITUNG';
    return {
      href: `/gruendung/behoerden#beh-${finanzamt.id}`,
      cta: inBearbeitung ? 'Steuernummer-Stand ansehen' : 'Zum Finanzamt',
      icon: 'building',
      testKey: `steuernummer-${finanzamt.id}`,
    };
  }

  // Geplantes Betriebsdatum überschritten – Verfahren noch offen
  // Hilfstext: bei offener RQ zuerst klären; nach Antwort Fokus offene Punkte/Steuernummer
  if (
    signal.typ === 'UG_BETRIEBSDATUM_UEBERSCHRITTEN' ||
    signal.id === 'UG-BETRIEBSDATUM'
  ) {
    const abgeschlossen = ['GENEHMIGT', 'AKTIVER_BETRIEB', 'BETRIEB_EINGESTELLT'].includes(
      akte.status
    );
    if (abgeschlossen) return null;
    const hatOffeneRueckfrage = akte.rueckfragen.some(r => !r.beantwortet);
    const vs05 = akte.verfahrensSchritte.find(vs => vs.id === 'VS-05');
    const steuernummerInBearbeitung = vs05?.status === 'IN_BEARBEITUNG';
    const hint = hatOffeneRueckfrage
      ? 'Zuerst die offene Rückfrage des Finanzamts klären; Fortschritt und nächste Schritte im Statusblock.'
      : steuernummerInBearbeitung
        ? 'Rückfrage beantwortet – Steuernummer-Vergabe und weitere offene Punkte im Statusblock prüfen.'
        : 'Offene Punkte und aktuellen Fortschritt im Statusblock prüfen.';
    return {
      href: '/gruendung#verfahrensstatus',
      cta: 'Zum Verfahrensstatus',
      icon: 'refresh',
      testKey: 'betriebsdatum',
      hint,
    };
  }

  return null;
}

export default function GruendungPage() {
  const { akte } = useGruendungState();
  const chip = statusToChip[akte.status] ?? { label: akte.status, css: 'status-chip-neutral', icon: 'info' as IconName };
  const isRueckfrage = akte.status === 'RUECKFRAGE_AUSSTEHEND';
  const offeneRueckfragen = akte.rueckfragen.filter(r => !r.beantwortet).length;
  const ausstehendeDoks = akte.dokumente.filter(d => d.status === 'ANGEFORDERT').length;
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
                <Link
                  href={schrittZiel.href}
                  className="btn btn-primary"
                  data-testid="uebersicht-naechster-schritt-cta"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}
                  aria-label={schrittZiel.cta}
                >
                  <Icon name={schrittZiel.icon} size={15} />
                  {schrittZiel.cta}
                </Link>
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
          },
          {
            label: 'Unterlagen',
            val: `${ausstehendeDoks} ausstehend`,
            href: '/gruendung/dokumente',
            urgent: ausstehendeDoks > 0,
            icon: 'file' as IconName,
          },
          {
            label: 'Offene Fragen',
            val: `${offeneRueckfragen} offen`,
            href: '/gruendung/rueckfragen',
            urgent: offeneRueckfragen > 0,
            icon: 'chat' as IconName,
          },
          {
            label: 'Verlauf',
            val: `${akte.ereignisse.length} Einträge`,
            href: '/gruendung/verlauf',
            urgent: false,
            icon: 'clock' as IconName,
          },
        ].map(k => (
          <Link key={k.label} href={k.href} className="card" style={{
            display: 'flex', flexDirection: 'column', gap: '0.375rem', textDecoration: 'none',
            borderLeft: k.urgent ? '4px solid var(--color-warning)' : undefined,
            background: k.urgent ? 'var(--color-warning-light)' : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Icon name={k.icon} size={14} />
              {k.label}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text)' }}>{k.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Ansehen →</div>
          </Link>
        ))}
      </div>

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
                    {ziel && (
                      <div style={{ marginTop: '0.65rem' }}>
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
                        {ziel.hint && (
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
