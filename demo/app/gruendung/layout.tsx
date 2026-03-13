import Link from 'next/link';
import { GruendungStateProvider } from '@/context/GruendungStateContext';

const nav = [
  { href: '/gruendung',              label: 'Übersicht' },
  { href: '/gruendung/behoerden',    label: 'Behörden & Schritte' },
  { href: '/gruendung/dokumente',    label: 'Dokumente' },
  { href: '/gruendung/rueckfragen',  label: 'Rückfragen' },
  { href: '/gruendung/verlauf',      label: 'Verlauf' },
];

export default function GruendungLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>← Zurück</Link>
          <span style={{ fontWeight: 600 }}>Gründungsakte UG-2024-0117</span>
        </div>
      </header>
      <nav style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {nav.map(n => (
              <Link key={n.href} href={n.href} style={{
                display: 'block', padding: '0.875rem 1rem', fontSize: '0.9rem',
                color: 'var(--color-neutral)', borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', textDecoration: 'none',
              }}>{n.label}</Link>
            ))}
          </div>
        </div>
      </nav>
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <GruendungStateProvider>{children}</GruendungStateProvider>
        </div>
      </main>
    </div>
  );
}
