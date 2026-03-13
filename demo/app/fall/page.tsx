// UX-Grund: "Was muss ich JETZT tun?" ist die erste Frage jedes Besuchers.
// Struktur: 1. Nächste Aktion (immer oberste Box), 2. Fortschritt, 3. Übersicht.
// Hick's Law: Maximal 1 primäre Handlung pro Screen.

'use client';

import Link from 'next/link';
import { useDemoState } from '@/context/DemoStateContext';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { Icon } from '@/components/Icon';

const statusFlow = [
  { key: 'ANGELEGT',                  label: 'Antrag erstellt' },
  { key: 'EINGEGANGEN',               label: 'Antrag eingegangen' },
  { key: 'IN_PRUEFUNG',               label: 'Wird geprüft' },
  { key: 'RUECKFRAGE_OFFEN',          label: 'Ihre Antwort erwartet' },
  { key: 'TERMIN_ANGESETZT',          label: 'Termin geplant' },
  { key: 'ENTSCHEIDUNG_VORBEREITET',  label: 'Entscheidung wird vorbereitet' },
  { key: 'BESCHEID_ZUGESTELLT',       label: 'Abgeschlossen' },
];

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
  const currentIndex = statusFlow.findIndex(s => s.key === fall.status);
  const fortschrittProzent = Math.round(((currentIndex + 1) / statusFlow.length) * 100);
  const fairnessSignale = berechneFairnessSignale(fall);
  const hatOffeneAufgaben = fall.offeneAufgaben.length > 0;
  const offeneRueckfragen = fall.rueckfragen.filter(r => !r.beantwortet).length;
  const ausstehendeUnterlagen = fall.dokumente.filter(d => d.status === 'ANGEFORDERT').length;
  const naechsterTermin = fall.termine.find(t => t.status === 'BESTAETIGT');

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
            return (
              <div key={step.key} className="step-row" style={{ padding: '0.5rem 0' }}>
                <div className={`step-dot ${dotCss}`} aria-hidden="true">
                  {done
                    ? <Icon name="check-circle" size={16} />
                    : <span style={{ fontSize: '0.8rem' }}>{idx + 1}</span>
                  }
                </div>
                <div>
                  <span className={`step-label ${labelCss}`}>{step.label}</span>
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
        {[
          {
            label: 'Unterlagen',
            icon: 'file' as const,
            val: ausstehendeUnterlagen > 0 ? `${ausstehendeUnterlagen} ausstehend` : 'Alles eingereicht',
            urgent: ausstehendeUnterlagen > 0,
            href: '/fall/dokumente',
          },
          {
            label: 'Fragen',
            icon: 'chat' as const,
            val: offeneRueckfragen > 0 ? `${offeneRueckfragen} offen` : 'Keine offenen Fragen',
            urgent: offeneRueckfragen > 0,
            href: '/fall/rueckfragen',
          },
          {
            label: 'Nächster Termin',
            icon: 'calendar' as const,
            val: naechsterTermin?.datum ?? 'Keiner geplant',
            urgent: false,
            href: '/fall/termine',
          },
          {
            label: 'Letzte Aktivität',
            icon: 'clock' as const,
            val: fall.letzteAktivitaet,
            urgent: false,
            href: '/fall/verlauf',
          },
        ].map(k => (
          <Link
            key={k.label}
            href={k.href}
            className="card"
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
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Ansehen <Icon name="arrow-right" size={14} />
            </div>
          </Link>
        ))}
      </div>

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
