import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transparenzbericht Kindertagesbetreuung – Open State',
  description: 'Öffentlicher Bericht zur Versorgungslage der Kindertagesbetreuung in Musterstadt',
};

export default function KitaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>← Zurück</Link>
          <span style={{ fontWeight: 600 }}>Kindertagesbetreuung · Musterstadt</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '3px',
            padding: '0.2rem 0.6rem',
            color: 'rgba(255,255,255,0.9)',
          }}>Öffentlich zugänglich · Keine Registrierung erforderlich</span>
        </div>
      </header>
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
