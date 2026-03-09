import Link from 'next/link';
import { storyRegistry } from '@/data/storyRegistry';

const statusConfig = {
  ENTWURF: { label: 'Entwurf', badge: 'badge-neutral', pct: 0 },
  BEREIT: { label: 'Bereit', badge: 'badge-primary', pct: 25 },
  IN_ENTWICKLUNG: { label: 'In Entwicklung', badge: 'badge-warning', pct: 60 },
  DEMONSTRIERBAR: { label: 'Demonstrierbar', badge: 'badge-success', pct: 100 },
  ABGESCHLOSSEN: { label: 'Abgeschlossen', badge: 'badge-success', pct: 100 },
};

export default function StoriesPage() {
  const demonstrierbar = storyRegistry.filter(s => s.status === 'DEMONSTRIERBAR').length;
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>← Zurück</Link>
          <span style={{ fontWeight: 600 }}>Story Coverage</span>
        </div>
      </header>
      <main style={{ padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Story Coverage</h1>
            <p>{demonstrierbar} von {storyRegistry.length} Stories sind in dieser Demo demonstrierbar.</p>
          </div>
          <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
            Diese Ansicht zeigt, welche User Stories im Demonstrator abgedeckt sind. Sie dient der Transparenz über den Entwicklungsstand, nicht als Marketinginstrument.
          </div>
          {storyRegistry.map(story => {
            const sc = statusConfig[story.status];
            const pct = story.implemented_criteria && story.acceptance_criteria_count ? Math.round((story.implemented_criteria / story.acceptance_criteria_count) * 100) : sc.pct;
            return (
              <div key={story.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <code style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{story.id}</code>
                      <h3>{story.title}</h3>
                    </div>
                    <p style={{ fontSize: '0.875rem' }}>{story.problem}</p>
                  </div>
                  <span className={`badge ${sc.badge}`}>{sc.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.6rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Screen</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '0.15rem' }}>{story.screen}</div>
                  </div>
                  <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.6rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Transparenzfokus</div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.15rem' }}>{story.transparency_focus}</div>
                  </div>
                  <div style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.6rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Akzeptanzkriterien</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '0.15rem' }}>
                      {story.implemented_criteria ?? 0} / {story.acceptance_criteria_count} erfüllt
                    </div>
                  </div>
                </div>
                {/* Coverage-Bar */}
                <div>
                  <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--color-success)' : pct > 50 ? 'var(--color-primary)' : 'var(--color-warning)', borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{pct}% abgedeckt</span>
                    {story.route && (
                      <Link href={story.route} style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Demo ansehen →</Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
