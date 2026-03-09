import { demoFall } from '@/data/mockFall';

const statusLabels: Record<string, { label: string; badge: string }> = {
  ANGELEGT: { label: 'Angelegt', badge: 'badge-neutral' },
  EINGEGANGEN: { label: 'Eingegangen', badge: 'badge-primary' },
  IN_PRUEFUNG: { label: 'In Prüfung', badge: 'badge-primary' },
  UNTERLAGEN_FEHLEN: { label: 'Unterlagen fehlen', badge: 'badge-warning' },
  RUECKFRAGE_OFFEN: { label: 'Rückfrage offen', badge: 'badge-warning' },
  TERMIN_ANGESETZT: { label: 'Termin angesetzt', badge: 'badge-primary' },
  ENTSCHEIDUNG_VORBEREITET: { label: 'Entscheidung wird vorbereitet', badge: 'badge-primary' },
  BESCHEID_ZUGESTELLT: { label: 'Bescheid zugestellt', badge: 'badge-success' },
  PAUSIERT: { label: 'Pausiert', badge: 'badge-neutral' },
};

const statusFlow = ['ANGELEGT','EINGEGANGEN','IN_PRUEFUNG','RUECKFRAGE_OFFEN','TERMIN_ANGESETZT','ENTSCHEIDUNG_VORBEREITET','BESCHEID_ZUGESTELLT'];

export default function FallPage() {
  const fall = demoFall;
  const s = statusLabels[fall.status];
  const currentIndex = statusFlow.indexOf(fall.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Story-Badge */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-001</span>
        <span className="badge badge-primary">US-AV-002</span>
        <span>Fall anlegen · Status einsehen</span>
      </div>

      {/* Fall-Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{fall.typ}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Fall-ID: {fall.id} · Angelegt am {fall.angelegtAm}</p>
          </div>
          <span className={`badge ${s.badge}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.9rem' }}>{s.label}</span>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-warning)' }}>
          <strong>Was jetzt passiert:</strong>
          <p style={{ marginTop: '0.25rem', color: 'var(--color-text)' }}>{fall.naechsterSchritt}</p>
        </div>
      </div>

      {/* Status-Schritte */}
      <div className="card">
        <h2 style={{ marginBottom: '1.25rem' }}>Verfahrensstand</h2>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {statusFlow.map((step, idx) => {
            const sl = statusLabels[step];
            const done = idx < currentIndex;
            const active = idx === currentIndex;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 0.4rem',
                    background: done ? 'var(--color-success)' : active ? 'var(--color-primary)' : 'var(--color-border)',
                    color: (done || active) ? 'white' : 'var(--color-neutral)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: active ? '0 0 0 3px var(--color-primary-light)' : 'none'
                  }}>{done ? '✓' : idx + 1}</div>
                  <div style={{ fontSize: '0.72rem', color: active ? 'var(--color-primary)' : done ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: active ? 600 : 400, lineHeight: 1.2 }}>{sl.label}</div>
                </div>
                {idx < statusFlow.length - 1 && (
                  <div style={{ height: '2px', width: '32px', background: done ? 'var(--color-success)' : 'var(--color-border)', margin: '0 2px', marginBottom: '18px', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-neutral)', background: 'var(--color-neutral-light)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
          {fall.statusBeschreibung}
        </p>
      </div>

      {/* Offene Aufgaben */}
      {fall.offeneAufgaben.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Ihre offenen Aufgaben</h2>
          {fall.offeneAufgaben.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-warning-light)', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-warning)', fontWeight: 700, marginTop: '1px' }}>!</span>
              <span style={{ fontSize: '0.9rem' }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Info-Kacheln */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Dokumente', val: `${fall.dokumente.filter(d=>d.status==='ANGEFORDERT').length} ausstehend`, href: '/fall/dokumente' },
          { label: 'Rückfragen', val: `${fall.rueckfragen.filter(r=>!r.beantwortet).length} offen`, href: '/fall/rueckfragen' },
          { label: 'Nächster Termin', val: fall.termine.find(t=>t.status==='BESTAETIGT')?.datum ?? '–', href: '/fall/termine' },
          { label: 'Letzte Aktivität', val: fall.letzteAktivitaet, href: '/fall/verlauf' },
        ].map(k => (
          <a key={k.label} href={k.href} className="card" style={{ display: 'block', textDecoration: 'none', transition: 'box-shadow 0.15s' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{k.label}</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{k.val}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Ansehen →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
