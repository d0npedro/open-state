// UX-Grund: "Was muss ich JETZT tun?" ist die erste Frage jedes Besuchers.
// Struktur: 1. Nächste Aktion (immer oberste Box), 2. Fortschritt, 3. Übersicht.
// Hick's Law: Maximal 1 primäre Handlung pro Screen.

'use client';

import Link from 'next/link';
import { useDemoState } from '@/context/DemoStateContext';
import { berechneFairnessSignale, berechneFristTage, FIKTIVES_HEUTE } from '@/lib/fairness/rules';
import { Icon } from '@/components/Icon';

/** Klarsprache für Resttage (analog Rückfrage-Frist). */
function fristRestLabel(tage: number): string {
  if (tage < 0) return `${Math.abs(tage)} Tage überschritten`;
  if (tage === 0) return 'heute fällig';
  return `noch ${tage} Tag${tage === 1 ? '' : 'e'}`;
}

/**
 * Lineare Fortschrittsschritte (US-AV-002).
 * Nebenstatus wie UNTERLAGEN_FEHLEN / PAUSIERT liegen nicht in der Kette —
 * sie werden über resolveProgressIndex auf die passende Phase gemappt,
 * damit die Anzeige nach Demo-Interaktionen nicht auf 0 % springt.
 */
const statusFlow = [
  { key: 'ANGELEGT',                  label: 'Antrag erstellt' },
  { key: 'EINGEGANGEN',               label: 'Antrag eingegangen' },
  { key: 'IN_PRUEFUNG',               label: 'Wird geprüft' },
  { key: 'RUECKFRAGE_OFFEN',          label: 'Handlung von Ihnen erwartet' },
  { key: 'TERMIN_ANGESETZT',          label: 'Termin geplant' },
  { key: 'ENTSCHEIDUNG_VORBEREITET',  label: 'Entscheidung wird vorbereitet' },
  { key: 'BESCHEID_ZUGESTELLT',       label: 'Abgeschlossen' },
];

/** Mappt Fallstatus auf Index in statusFlow (inkl. Nebenstatus aus Demo-Session). */
function resolveProgressIndex(status: string): number {
  // Bürger-Handlungsphase: Rückfrage ODER fehlende Unterlagen (Demo-Status nach RQ)
  if (status === 'UNTERLAGEN_FEHLEN' || status === 'RUECKFRAGE_OFFEN') {
    return statusFlow.findIndex(s => s.key === 'RUECKFRAGE_OFFEN');
  }
  if (status === 'PAUSIERT') {
    return statusFlow.findIndex(s => s.key === 'IN_PRUEFUNG');
  }
  const idx = statusFlow.findIndex(s => s.key === status);
  // Fallback: nicht in der Kette → „Wird geprüft“ (kein 0 %-Sprung)
  return idx >= 0 ? idx : statusFlow.findIndex(s => s.key === 'IN_PRUEFUNG');
}

/** Aktives Schrittlabe l dynamisch (Rückfrage vs. Unterlagen). */
function activeStepLabel(status: string, defaultLabel: string): string {
  if (status === 'UNTERLAGEN_FEHLEN') return 'Unterlagen fehlen noch';
  if (status === 'RUECKFRAGE_OFFEN') return 'Ihre Antwort wird erwartet';
  if (status === 'PAUSIERT') return 'Pausiert';
  return defaultLabel;
}

// UX-Grund: Menschliche Beschreibungen statt Verwaltungsstatus-Codes
const statusToChip: Record<string, { label: string; css: string; icon: string }> = {
  ANGELEGT:                 { label: 'Antrag erstellt',          css: 'status-chip-neutral',  icon: 'info' },
  EINGEGANGEN:              { label: 'Antrag eingegangen',       css: 'status-chip-primary',  icon: 'check-circle' },
  IN_PRUEFUNG:              { label: 'Wird geprüft',             css: 'status-chip-primary',  icon: 'refresh' },
  UNTERLAGEN_FEHLEN:        { label: 'Unterlagen fehlen',        css: 'status-chip-warning',  icon: 'alert' },
  RUECKFRAGE_OFFEN:         { label: 'Ihre Antwort wird erwartet', css: 'status-chip-warning', icon: 'chat' },
  TERMIN_ANGESETZT:         { label: 'Termin bestätigt',         css: 'status-chip-primary',  icon: 'calendar' },
  ENTSCHEIDUNG_VORBEREITET: { label: 'Fast fertig',              css: 'status-chip-primary',  icon: 'refresh' },
  BESCHEID_ZUGESTELLT:      { label: 'Abgeschlossen',            css: 'status-chip-success',  icon: 'check-circle' },
  PAUSIERT:                 { label: 'Pausiert',                 css: 'status-chip-neutral',  icon: 'info' },
};

export default function FallPage() {
  const { fall } = useDemoState();
  const chip = statusToChip[fall.status] ?? { label: fall.status, css: 'status-chip-neutral', icon: 'info' };
  const currentIndex = resolveProgressIndex(fall.status);
  const fortschrittProzent = Math.round(((currentIndex + 1) / statusFlow.length) * 100);
  const fairnessSignale = berechneFairnessSignale(fall);
  const hatOffeneAufgaben = fall.offeneAufgaben.length > 0;
  const offeneRueckfragen = fall.rueckfragen.filter(r => !r.beantwortet).length;
  // ANGEFORDERT + ABGELEHNT blockieren den Fortschritt (parität zu /fall/dokumente)
  const ausstehendeDokumente = fall.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  );
  const ausstehendeUnterlagen = ausstehendeDokumente.length;
  /** Offene Dokumente mit ISO-Frist, sortiert nach Dringlichkeit (nächste Frist zuerst). */
  const dokFristen = ausstehendeDokumente
    .filter(d => d.fristDatum && d.frist)
    .map(d => ({
      id: d.id,
      bezeichnung: d.bezeichnung,
      frist: d.frist as string,
      resttage: berechneFristTage(d.fristDatum as string, FIKTIVES_HEUTE),
    }))
    .sort((a, b) => a.resttage - b.resttage);
  const naechsteDokFrist = dokFristen[0];
  // Nächster Termin: bestätigt oder ausstehend (nicht abgesagt) — Status live auf Kachel (Q-104)
  const naechsterTermin = fall.termine.find(t => t.status !== 'ABGESAGT');
  const terminStatusLabel =
    naechsterTermin?.status === 'BESTAETIGT'
      ? 'Bestätigt'
      : naechsterTermin?.status === 'AUSSTEHEND'
        ? 'Ausstehend'
        : null;
  const wartetAufBehoerde = !hatOffeneAufgaben && fall.status === 'IN_PRUEFUNG';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── 1. NÄCHSTE AKTION: Die wichtigste Box auf der Seite ─────
          UX-Grund: Grandma-Test — "Was tue ich JETZT?" muss in
          unter 3 Sekunden erkennbar sein. Amber-Banner ist nicht
          zu übersehen. Enthält genau EINE primäre Aktion.       */}
      {hatOffeneAufgaben && (
        <div className="action-banner" role="alert" aria-live="polite">
          <div className="action-banner-icon">
            <Icon name="alert" size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-banner-title">Jetzt handeln</div>
            <div className="action-banner-text">{fall.naechsterSchritt}</div>
            {offeneRueckfragen > 0 && (
              <Link href="/fall/rueckfragen" className="btn btn-primary" style={{ background: '#B45309', borderColor: '#B45309', minHeight: 52 }}>
                Frage jetzt beantworten
                <Icon name="arrow-right" size={18} />
              </Link>
            )}
            {offeneRueckfragen === 0 && ausstehendeUnterlagen > 0 && (
              <Link href="/fall/dokumente" className="btn btn-primary" style={{ background: '#B45309', borderColor: '#B45309', minHeight: 52 }}>
                Unterlagen hochladen
                <Icon name="arrow-right" size={18} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ─── 1b. RUHEZUSTAND: Kein Handeln nötig (nach Demo-Abschluss) ─
          UX-Grund: Wenn alle Aufgaben erledigt sind, muss das ebenso
          klar sein wie der Handlungsbedarf — sonst wirkt die Seite „leer“. */}
      {wartetAufBehoerde && (
        <div
          className="notice-box notice-box-success"
          role="status"
          aria-live="polite"
          data-testid="ruhezustand-banner"
        >
          <Icon name="check-circle" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '1rem' }}>
              Kein Handeln von Ihnen erforderlich
            </strong>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{fall.naechsterSchritt}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {fall.statusBeschreibung}
            </p>
          </div>
        </div>
      )}

      {/* ─── 2. FALLKOPF: Status + Typ ─────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Fall-Nr. {fall.id} · Eingereicht am {fall.angelegtAm}
            </p>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              {fall.typ}
            </h1>
          </div>
          {/* UX-Grund: Status-Chip mit Icon — in 500ms erkennbar */}
          <span className={`status-chip ${chip.css}`}>
            <Icon name={chip.icon as Parameters<typeof Icon>[0]['name']} size={16} />
            {chip.label}
          </span>
        </div>
      </div>

      {/* ─── 3. FORTSCHRITT ─────────────────────────────────────────
          UX-Grund: "Bin ich fast fertig?" — eine Zahl und ein Balken
          antworten sofort. Vertikale Liste ist auf Mobile lesbar.   */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1rem' }}>Ihr Fortschritt</h2>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
            {fortschrittProzent}&nbsp;%
          </span>
        </div>

        {/* Fortschrittsbalken */}
        <div className="progress-bar-wrap" aria-label={`Fortschritt: ${fortschrittProzent} Prozent`}>
          <div className="progress-bar-fill" style={{ width: `${fortschrittProzent}%` }} />
        </div>

        {/* Schrittliste — vertikal, mobiltauglich */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {statusFlow.map((step, idx) => {
            const done   = idx < currentIndex;
            const active = idx === currentIndex;
            const dotCss   = done ? 'step-dot-done'   : active ? 'step-dot-active'   : 'step-dot-pending';
            const labelCss = done ? 'step-label-done' : active ? 'step-label-active' : 'step-label-pending';
            const label = active ? activeStepLabel(fall.status, step.label) : step.label;
            return (
              <div key={step.key} className="step-row" style={{ padding: '0.5rem 0' }}>
                <div className={`step-dot ${dotCss}`} aria-hidden="true">
                  {done
                    ? <Icon name="check-circle" size={16} />
                    : <span style={{ fontSize: '0.8rem' }}>{idx + 1}</span>
                  }
                </div>
                <div>
                  <span className={`step-label ${labelCss}`}>{label}</span>
                  {active && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                      ← Sie sind hier
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statusbeschreibung */}
        <div className="notice-box notice-box-neutral" style={{ marginTop: '1rem' }}>
          <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.875rem' }}>{fall.statusBeschreibung}</span>
        </div>
      </div>

      {/* ─── 4. SCHNELLZUGRIFF-KACHELN ──────────────────────────────
          UX-Grund: 4 klare Bereiche mit Zahl + Status.
          Jede Kachel ist vollständig klickbar (große Touch-Fläche). */}
      <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Bereiche Ihres Antrags
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        {([
          {
            label: 'Unterlagen',
            icon: 'file' as const,
            val:
              ausstehendeUnterlagen > 0
                ? naechsteDokFrist
                  ? `${ausstehendeUnterlagen} ausstehend · ${fristRestLabel(naechsteDokFrist.resttage)}`
                  : `${ausstehendeUnterlagen} ausstehend`
                : 'Alles eingereicht',
            urgent: ausstehendeUnterlagen > 0,
            href: '/fall/dokumente',
            testId: undefined as string | undefined,
            statusTestId: undefined as string | undefined,
            statusLabel: null as string | null,
          },
          {
            label: 'Fragen',
            icon: 'chat' as const,
            val: offeneRueckfragen > 0 ? `${offeneRueckfragen} offen` : 'Keine offenen Fragen',
            urgent: offeneRueckfragen > 0,
            href: '/fall/rueckfragen',
            testId: undefined as string | undefined,
            statusTestId: undefined as string | undefined,
            statusLabel: null as string | null,
          },
          {
            label: 'Nächster Termin',
            icon: 'calendar' as const,
            val: naechsterTermin
              ? terminStatusLabel
                ? `${naechsterTermin.datum} · ${terminStatusLabel}`
                : naechsterTermin.datum
              : 'Keiner geplant',
            // Unbestätigt = Handlungsbedarf (analog Tab-Badge Q-089); bestätigt = ruhig
            urgent: naechsterTermin?.status === 'AUSSTEHEND',
            href: '/fall/termine',
            testId: 'kachel-naechster-termin' as string | undefined,
            statusTestId: 'kachel-termin-status' as string | undefined,
            statusLabel: terminStatusLabel,
          },
          {
            label: 'Letzte Aktivität',
            icon: 'clock' as const,
            val: fall.letzteAktivitaet,
            urgent: false,
            href: '/fall/verlauf',
            testId: undefined as string | undefined,
            statusTestId: undefined as string | undefined,
            statusLabel: null as string | null,
          },
        ] as const).map(k => (
          <Link
            key={k.label}
            href={k.href}
            className="card"
            data-testid={k.testId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'inherit',
              borderLeft: k.urgent ? '4px solid var(--color-warning)' : '1px solid var(--color-border)',
              background: k.urgent ? 'var(--color-warning-light)' : 'var(--color-surface)',
              transition: 'box-shadow 0.15s',
              padding: '1.125rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: 600 }}>
                {k.label}
              </span>
              <span style={{ color: k.urgent ? 'var(--color-warning)' : 'var(--color-primary)' }}>
                <Icon name={k.icon} size={18} />
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.975rem', color: k.urgent ? 'var(--color-warning)' : 'var(--color-text)' }}>
              {k.val}
            </div>
            {k.statusLabel && (
              <span
                data-testid={k.statusTestId}
                className={k.urgent ? 'status-chip status-chip-warning' : 'status-chip status-chip-success'}
                style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
              >
                {k.statusLabel}
              </span>
            )}
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Ansehen <Icon name="arrow-right" size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* ─── 4b. FRISTEN OFFENER UNTERLAGEN (Countdown, analog RQ) ─
          UX-Grund: Bürger sollen auf der Übersicht sehen, *wann*
          Unterlagen fällig sind — nicht erst auf der Dokumenteseite. */}
      {dokFristen.length > 0 && (
        <div className="card" data-testid="dok-fristen-uebersicht">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
            Fristen offener Unterlagen
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 1rem' }}>
            Berechnet gegen Demo-Stichtag {FIKTIVES_HEUTE.split('-').reverse().join('.')}. Keine automatische Mahnung.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                    background: kritisch ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
                    borderLeft: `4px solid ${kritisch ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
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
            href="/fall/dokumente"
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

      {/* ─── 5. FAIRNESS-HINWEISE (inline, kein separater Klick nötig) */}
      {fairnessSignale.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            Hinweise zu Ihrem Verfahren
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fairnessSignale.map(sig => (
              <div
                key={sig.id}
                className={`notice-box ${sig.prioritaet === 'RELEVANT' ? 'notice-box-warn' : sig.prioritaet === 'HINWEIS' ? 'notice-box-info' : 'notice-box-neutral'}`}
              >
                <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{sig.titel}</strong>
                  <span style={{ fontSize: '0.875rem' }}>{sig.erklaerung}</span>
                  {sig.naechsterSchritt && (
                    <div style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                      → {sig.naechsterSchritt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link href="/fall/hinweise" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.875rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
            Alle Details ansehen <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
