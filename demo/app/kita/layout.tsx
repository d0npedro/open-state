import Link from 'next/link';
import type { Metadata } from 'next';
import { DomainNav } from '@/components/DomainNav';

export const metadata: Metadata = {
  title: 'Kindertagesbetreuung – Open State',
  description: 'Öffentlicher Transparenzbericht und Steuerungslagebild Kindertagesbetreuung Musterstadt',
};

const nav = [
  { href: '/kita',          label: 'Transparenzbericht', hint: 'Öffentlich' },
  { href: '/kita/lagebild', label: 'Steuerungslagebild', hint: 'Demo: JA-intern' },
];

export default function KitaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>← Open State</Link>
          <span style={{ fontWeight: 600 }}>Kindertagesbetreuung · Musterstadt</span>
          <DomainNav active="/kita" />
        </div>
      </header>
      <nav style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {nav.map(n => (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0.75rem 1.1rem', fontSize: '0.9rem',
                color: 'var(--color-neutral)', borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap', textDecoration: 'none',
              }}>
                {n.label}
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>{n.hint}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
