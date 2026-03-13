import Link from 'next/link';

const domains = [
  {
    id: 'av',
    label: 'Arbeitsverwaltung',
    badge: '8 Stories · 7 Screens',
    title: 'Arbeitslosengeld I beantragen',
    beschreibung:
      'Vollständiger Verfahrens-Slice: Antrag, Dokumente, Rückfragen, Bescheid, Verlauf. Fairness-Signale zeigen in Echtzeit, wenn das Regelwerk auf Zustandsänderungen reagiert.',
    merkmale: ['Verfahrensfairness-Regelwerk', 'Interaktive State-Demo', 'Bescheid mit Erklärschicht'],
    href: '/fall',
    cta: 'Fallakte öffnen →',
    farbe: 'var(--color-primary)',
    hintergrund: 'var(--color-primary-light)',
  },
  {
    id: 'gruendung',
    label: 'Unternehmensgründung',
    badge: '4 Behörden · 5 Screens',
    title: 'Gewerbeanmeldung Einzelunternehmen',
    beschreibung:
      'Multi-Behörden-Gründungsakte: Gewerbeamt, Finanzamt, IHK, Berufsgenossenschaft. Jeder Schritt erklärt — mit Rechtsgrundlage, Frist und Konsequenz.',
    merkmale: ['Behördenübergreifende Akte', '§ 19 UStG Rückfrage interaktiv', 'Audit-Log unveränderlich'],
    href: '/gruendung',
    cta: 'Gründungsakte öffnen →',
    farbe: '#2d6a4f',
    hintergrund: '#d8f3dc',
  },
  {
    id: 'kita',
    label: 'Kindertagesbetreuung',
    badge: '5 Planungsräume · 12 Monate',
    title: 'Öffentlicher Transparenzbericht',
    beschreibung:
      'Das konzeptionell stärkste Alleinstellungsmerkmal: öffentlich zugängliche, methodisch transparente Berichtsschicht. Versorgungsquoten, Wartelistentrends, Kapazitätsmaßnahmen — mit vollständiger Methodik.',
    merkmale: ['Öffentlich, keine Registrierung', 'Jugendamt-Steuerungslagebild (Demo)', 'CSV-Export'],
    href: '/kita',
    cta: 'Transparenzbericht öffnen →',
    farbe: '#7b2d8b',
    hintergrund: '#f3d8f5',
  },
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>OPEN STATE</span>
            <span style={{ marginLeft: '1rem', opacity: 0.7, fontSize: '0.875rem' }}>Blueprint · Digitale Verwaltungsplattform</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem' }}>
            <Link href="/stories" style={{ color: 'rgba(255,255,255,0.8)' }}>Story Coverage</Link>
            <Link href="/feedback" style={{ color: 'rgba(255,255,255,0.8)' }}>Feedback</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Konzeptphase · 3 Demo-Domänen · Alle Daten fiktiv
            </p>
            <h1 style={{ marginBottom: '1rem' }}>
              Staatliche Verwaltung.<br />Verständlich. Nachvollziehbar.
            </h1>
            <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', color: 'var(--color-neutral)', lineHeight: 1.65 }}>
              Open State demonstriert, wie alle Verwaltungsverfahren über eine einzige,
              bürgerrespektierende Plattform abgewickelt werden könnten.
              Drei klickbare Bereiche zeigen, dass die Idee domänenübergreifend trägt —
              von der Sozialleistung bis zur Kita-Versorgungsplanung.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/fall"      className="btn btn-primary">Arbeitsverwaltung →</Link>
              <Link href="/gruendung" className="btn btn-secondary">Unternehmensgründung →</Link>
              <Link href="/kita"      className="btn btn-secondary">Kita-Transparenz →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Domain-Karten */}
      <section style={{ padding: '2.5rem 0', background: 'var(--color-neutral-light)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '0.5rem' }}>Klickbare Demo-Bereiche</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Jeder Bereich ist ein eigenständiger Vertical Slice — vollständig klickbar, Story-dokumentiert, mit fiktiven Realdaten.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {domains.map(d => (
              <div key={d.id} className="card" style={{ borderTop: `4px solid ${d.farbe}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: d.farbe }}>
                    {d.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: d.hintergrund, color: d.farbe, padding: '0.15rem 0.5rem', borderRadius: '3px', fontWeight: 600 }}>
                    {d.badge}
                  </span>
                </div>

                <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>{d.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral)', lineHeight: 1.55, marginBottom: '1rem', flex: 1 }}>
                  {d.beschreibung}
                </p>

                <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {d.merkmale.map(m => <li key={m}>{m}</li>)}
                </ul>

                <Link href={d.href} className="btn btn-primary" style={{ textAlign: 'center', background: d.farbe, borderColor: d.farbe }}>
                  {d.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prinzipien-Kacheln */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { title: '3 Demo-Domänen',       sub: 'AV · Gründung · Kita',              color: 'var(--color-primary-light)',  tc: 'var(--color-primary)' },
              { title: '20+ User Stories',      sub: 'Alle dokumentiert',                 color: 'var(--color-success-light)',  tc: 'var(--color-success)' },
              { title: 'Jeder Status erklärt',  sub: 'Begründung · Frist · Konsequenz',   color: 'var(--color-warning-light)',  tc: 'var(--color-warning)' },
              { title: 'Keine Entscheidungs-KI',sub: 'Mensch bleibt verantwortlich',      color: 'var(--color-border)',         tc: 'var(--color-neutral)' },
            ].map(k => (
              <div key={k.title} style={{ background: k.color, borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: k.tc }}>{k.title}</div>
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
            <strong>Hinweis:</strong> Dies ist ein Demonstrator in der Konzeptphase. Alle Daten sind fiktiv.
            Kein echtes Backend, keine echten Behördenanbindungen, keine rechtsverbindlichen Akte.
            Ziel ist die Veranschaulichung transparenter, domänenübergreifender Verfahrensführung.
          </div>
        </div>
      </section>

    </main>
  );
}
