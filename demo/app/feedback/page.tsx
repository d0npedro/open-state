import Link from 'next/link';

const screens = [
  { id: 'US-AV-001/002', label: 'Fallübersicht & Status', route: '/fall' },
  { id: 'US-AV-003', label: 'Dokumentennachreichung', route: '/fall/dokumente' },
  { id: 'US-AV-004', label: 'Rückfragen', route: '/fall/rueckfragen' },
  { id: 'US-AV-005', label: 'Termine', route: '/fall/termine' },
  { id: 'US-AV-006', label: 'Bescheide', route: '/fall/bescheide' },
  { id: 'US-AV-007', label: 'Verlauf / Audit-Log', route: '/fall/verlauf' },
  { id: '–', label: 'Story Coverage', route: '/stories' },
  { id: '–', label: 'Allgemein / Sonstiges', route: '/' },
];

const questions = [
  'Was funktioniert in dieser Demo gut?',
  'Was ist unklar oder verwirrend?',
  'Welche Information fehlt Ihnen?',
  'Welcher Schritt war am schwierigsten zu verstehen?',
  'Was sollte dringend verbessert werden?',
];

export default function FeedbackPage() {
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev';
  const version = process.env.NEXT_PUBLIC_DEMO_VERSION ?? '0.1.0';

  const issueTitle = encodeURIComponent(`[Demo-Feedback] v${version} (${sha})`);
  const issueBody = encodeURIComponent(
    `**Demo-Version:** v${version} (${sha})\n\n` +
    `**Betroffener Screen:** \n\n` +
    questions.map(q => `**${q}**\n\n`).join('')
  );
  const githubIssueUrl = `https://github.com/d0npedro/open-state/issues/new?title=${issueTitle}&body=${issueBody}&labels=demo-feedback`;

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>← Zurück</Link>
          <span style={{ fontWeight: 600 }}>Feedback zur Demo</span>
        </div>
      </header>
      <main style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Feedback zur Demo</h1>
            <p>
              Diese Demo ist ein transparenter Entwicklungsstand, kein fertiges Produkt.
              Rückmeldungen helfen dabei, Unklarheiten zu erkennen und fachliche Lücken zu schließen.
            </p>
          </div>

          <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '0' }}>
              <strong>Demo-Stand:</strong> v{version} · Commit {sha}
            </p>
          </div>

          {/* Fragen */}
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Leitfragen für Ihr Feedback</h2>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{q}</li>
              ))}
            </ol>
          </div>

          {/* Screens */}
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Zu welchem Screen bezieht sich Ihr Feedback?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {screens.map(s => (
                <div key={s.id + s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {s.id !== '–' && <code style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>{s.id}</code>}
                    <span style={{ fontSize: '0.875rem' }}>{s.label}</span>
                  </div>
                  <Link href={s.route} style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Ansehen →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Issue Link */}
          <div className="card">
            <h2 style={{ marginBottom: '0.75rem' }}>Feedback einreichen</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Feedback wird als GitHub Issue erfasst. Das Formular ist mit den Leitfragen und dem aktuellen Demo-Stand vorausgefüllt.
            </p>
            <a
              href={githubIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Feedback als GitHub Issue einreichen
            </a>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
              Kein GitHub-Konto? Senden Sie eine E-Mail mit Ihren Anmerkungen direkt über das{' '}
              <a href="https://github.com/d0npedro/open-state" target="_blank" rel="noopener noreferrer">GitHub-Repository</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
