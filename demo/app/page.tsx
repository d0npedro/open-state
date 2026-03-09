import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>OPEN STATE</span>
            <span style={{ marginLeft: '1rem', opacity: 0.7, fontSize: '0.875rem' }}>Demo – Arbeitsverwaltung</span>
          </div>
          <Link href="/stories" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Story Coverage →</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '620px' }}>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transparenter Demonstrator
            </p>
            <h1 style={{ marginBottom: '1rem' }}>Staatliche Verwaltung.<br />Verständlich. Nachvollziehbar.</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-neutral)' }}>
              Dieser Demonstrator zeigt, wie ein Verwaltungsfall in der Arbeitsverwaltung
              transparent und bürgerverständlich abgebildet werden kann. Jede Funktion
              ist auf eine dokumentierte User Story zurückführbar.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/fall" className="btn btn-primary">Demo starten: Fallansicht →</Link>
              <Link href="/stories" className="btn btn-secondary">Story Coverage ansehen</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info-Kacheln */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { title: '7 User Stories', sub: 'Domäne Arbeitsverwaltung', color: 'var(--color-primary-light)', tc: 'var(--color-primary)' },
              { title: '7 Screens', sub: 'Klickbarer Vertical Slice', color: 'var(--color-success-light)', tc: 'var(--color-success)' },
              { title: '100% Erklärbar', sub: 'Jeder Status mit Begründung', color: 'var(--color-warning-light)', tc: 'var(--color-warning)' },
              { title: 'Keine Entscheidungs-KI', sub: 'Mensch bleibt verantwortlich', color: 'var(--color-border)', tc: 'var(--color-neutral)' },
            ].map((k) => (
              <div key={k.title} style={{ background: k.color, borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: k.tc }}>{k.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral)', marginTop: '0.25rem' }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo-Hinweis */}
      <section style={{ padding: '0 0 2.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-secondary)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem' }}>
            <strong>Hinweis:</strong> Dies ist ein Demonstrator mit fiktiven Musterdaten. Er enthält keine echten personenbezogenen Daten und bildet keine rechtsverbindlichen Verwaltungsakte ab. Ziel ist die Veranschaulichung transparenter Verfahrensführung.
          </div>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', background: 'white', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <span>Open State – Konzept &amp; Architektur</span>
          <Link href="https://github.com/d0npedro/open-state" style={{ color: 'var(--color-text-muted)' }}>GitHub</Link>
        </div>
      </footer>
    </main>
  );
}
