import Link from 'next/link';

const nav = [
  { href: '/fall', label: 'Übersicht' },
  { href: '/fall/dokumente', label: 'Dokumente' },
  { href: '/fall/rueckfragen', label: 'Rückfragen' },
  { href: '/fall/termine', label: 'Termine' },
  { href: '/fall/bescheide', label: 'Bescheide' },
  { href: '/fall/verlauf', label: 'Verlauf' },
  { href: '/fall/hinweise', label: 'Hinweise' },
];

export default function FallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>← Zurück</Link>
          <span style={{ fontWeight: 600 }}>Fallakte AV-2024-0042</span>
        </div>
      </header>
      <nav style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {nav.map(n => (
              <Link key={n.href} href={n.href} style={{
                display: 'block', padding: '0.875rem 1rem', fontSize: '0.9rem', color: 'var(--color-neutral)',
                borderBottom: '2px solid transparent', whiteSpace: 'nowrap'
              }}>{n.label}</Link>
            ))}
          </div>
        </div>
      </nav>
      <main style={{ padding: '2rem 0' }}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
