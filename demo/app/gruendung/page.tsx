'use client';

import Link from 'next/link';
import { useGruendungState } from '@/context/GruendungStateContext';
import type { BehördeStatus } from '@/types/gruendung';

const statusFlow = [
  { key: 'EINGEREICHT',           label: 'Eingereicht' },
  { key: 'ANGENOMMEN',            label: 'Angenommen' },
  { key: 'IN_BEARBEITUNG',        label: 'In Bearbeitung' },
  { key: 'ENTSCHEIDUNG_AUSSTEHEND', label: 'Entscheidung' },
  { key: 'GENEHMIGT',             label: 'Abgeschlossen' },
];

const behördeStatusInfo: Record<BehördeStatus, { label: string; badge: string; borderColor: string }> = {
  NICHT_GESTARTET: { label: 'Noch nicht gestartet', badge: 'badge-neutral', borderColor: 'var(--color-border)' },
  IN_BEARBEITUNG:  { label: 'In Bearbeitung',        badge: 'badge-primary', borderColor: 'var(--color-primary)' },
  RUECKFRAGE_OFFEN:{ label: 'Rückfrage offen',       badge: 'badge-warning', borderColor: 'var(--color-warning)' },
  ABGESCHLOSSEN:   { label: 'Abgeschlossen',         badge: 'badge-success', borderColor: 'var(--color-success)' },
  BLOCKIERT:       { label: 'Blockiert',             badge: 'badge-danger',  borderColor: 'var(--color-danger)'  },
};

const behördeTypLabel: Record<string, string> = {
  GEWERBEAMT: 'Gewerbeamt', FINANZAMT: 'Finanzamt',
  IHK: 'IHK', HWK: 'HWK', BERUFSGENOSSENSCHAFT: 'Berufsgenossenschaft', SONSTIGE: 'Sonstige',
};

export default function GruendungPage() {
  const { akte } = useGruendungState();
  const isRueckfrage = akte.status === 'RUECKFRAGE_AUSSTEHEND' || akte.status === 'RUECKFRAGE_BEANTWORTET';
  const currentFlowKey = isRueckfrage ? 'IN_BEARBEITUNG' : akte.status;
  const currentIndex = statusFlow.findIndex(s => s.key === currentFlowKey);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Story-Badge */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-001</span>
        <span className="badge badge-neutral">US-UG-002</span>
        <span>Gründungsakte · Status einsehen (Stories geplant)</span>
      </div>

      {/* Fall-Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{akte.gewerbebezeichnung}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Fall-ID: {akte.id} · {akte.vorgangstyp} · {akte.rechtsform.replace('_', ' ')} · WZ-Code {akte.wzCode}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Eingereicht: {akte.ersteinreichung} · Letzte Aktualisierung: {akte.letzteAktualisierung}
              {akte.geplantesBetriebsdatum && ` · Geplanter Betriebsstart: ${akte.geplantesBetriebsdatum}`}
            </p>
          </div>
          <span className={`badge ${isRueckfrage ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.9rem' }}>
            {isRueckfrage ? 'Rückfrage ausstehend' : akte.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', background: isRueckfrage ? 'var(--color-warning-light)' : 'var(--color-neutral-light)', borderRadius: 'var(--radius)', borderLeft: `3px solid ${isRueckfrage ? 'var(--color-warning)' : 'var(--color-primary)'}` }}>
          <strong>Was jetzt passiert:</strong>
          <p style={{ marginTop: '0.25rem' }}>{akte.naechsterSchritt}</p>
        </div>
      </div>

      {/* Verfahrensstand */}
      <div className="card">
        <h2 style={{ marginBottom: '1.25rem' }}>Verfahrensstand</h2>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {statusFlow.map((step, idx) => {
            const done   = idx < currentIndex;
            const active = idx === currentIndex;
            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 0.4rem',
                    background: done ? 'var(--color-success)' : active ? 'var(--color-primary)' : 'var(--color-border)',
                    color: (done || active) ? 'white' : 'var(--color-neutral)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: active ? '0 0 0 3px var(--color-primary-light)' : 'none',
                  }}>{done ? '✓' : idx + 1}</div>
                  <div style={{ fontSize: '0.72rem', color: active ? 'var(--color-primary)' : done ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: active ? 600 : 400, lineHeight: 1.2 }}>{step.label}</div>
                </div>
                {idx < statusFlow.length - 1 && (
                  <div style={{ height: '2px', width: '32px', background: done ? 'var(--color-success)' : 'var(--color-border)', margin: '0 2px', marginBottom: '18px', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
        {isRueckfrage && (
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-warning)', background: 'var(--color-warning-light)', padding: '0.75rem', borderRadius: 'var(--radius)', fontWeight: 500 }}>
            Rückfrage ausstehend: Das Finanzamt wartet auf Ihre Antwort. Die weitere Bearbeitung ist bis zur Antwort pausiert.
          </p>
        )}
      </div>

      {/* Offene Aufgaben */}
      {akte.offeneAufgaben.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Ihre offenen Aufgaben</h2>
          {akte.offeneAufgaben.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-warning)', fontWeight: 700, marginTop: '1px' }}>!</span>
              <span style={{ fontSize: '0.9rem' }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Behörden-Übersicht */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Beteiligte Behörden</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {akte.beteiligteBehörden.map(beh => {
            const si = behördeStatusInfo[beh.status];
            return (
              <div key={beh.id} style={{ padding: '1rem', border: `1px solid var(--color-border)`, borderLeft: `4px solid ${si.borderColor}`, borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{behördeTypLabel[beh.typ]}</span>
                  <span className={`badge ${si.badge}`} style={{ fontSize: '0.7rem' }}>{si.label}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{beh.bezeichnung}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{beh.zustaendigeStelle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigations-Kacheln */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Behörden & Schritte', val: `${akte.beteiligteBehörden.filter(b => b.status !== 'ABGESCHLOSSEN' && b.status !== 'NICHT_GESTARTET').length} aktiv`, href: '/gruendung/behoerden' },
          { label: 'Dokumente', val: `${akte.dokumente.filter(d => d.status === 'ANGEFORDERT').length} ausstehend`, href: '/gruendung/dokumente' },
          { label: 'Rückfragen', val: `${akte.rueckfragen.filter(r => !r.beantwortet).length} offen`, href: '/gruendung/rueckfragen' },
          { label: 'Verlauf', val: `${akte.ereignisse.length} Einträge`, href: '/gruendung/verlauf' },
        ].map(k => (
          <Link key={k.label} href={k.href} className="card" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{k.label}</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{k.val}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Ansehen →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
