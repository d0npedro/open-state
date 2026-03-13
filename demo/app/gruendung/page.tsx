'use client';

import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';

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
  const { akte } = useGruendungState();
  const chip = statusToChip[akte.status] ?? { label: akte.status, css: 'status-chip-neutral', icon: 'info' as IconName };
  const isRueckfrage = akte.status === 'RUECKFRAGE_AUSSTEHEND';
  const offeneRueckfragen = akte.rueckfragen.filter(r => !r.beantwortet).length;
  const ausstehendeDoks = akte.dokumente.filter(d => d.status === 'ANGEFORDERT').length;

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
      <div className="card">
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
            return (
              <div key={beh.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', borderRadius: 'var(--radius)',
                background: isOpen ? 'var(--color-warning-light)' : isDone ? 'var(--color-success-light, #f0fff4)' : 'var(--color-neutral-light)',
                gap: '0.75rem', flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{beh.bezeichnung}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{beh.zustaendigeStelle}</div>
                </div>
                <span className={`status-chip ${isOpen ? 'status-chip-warning' : isDone ? 'status-chip-success' : beh.status === 'IN_BEARBEITUNG' ? 'status-chip-primary' : 'status-chip-neutral'}`}>
                  <Icon name={isDone ? 'check-circle' : isOpen ? 'alert' : beh.status === 'IN_BEARBEITUNG' ? 'refresh' : 'clock'} size={14} />
                  {isOpen ? 'Rückfrage offen' : isDone ? 'Abgeschlossen' : beh.status === 'IN_BEARBEITUNG' ? 'In Bearbeitung' : 'Noch nicht gestartet'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Demo-Hinweis ────────────────────────────────────────── */}
      <div className="notice-box notice-box-info" style={{ fontSize: '0.8rem' }}>
        <Icon name="info" size={15} style={{ flexShrink: 0 }} />
        <span><strong>Demo:</strong> Alle Daten sind fiktiv. Beantworten Sie die offene Rückfrage — der Status ändert sich in der gesamten App.</span>
      </div>
    </div>
  );
}
