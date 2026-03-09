import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { BuildInfo } from '@/components/BuildInfo';

export const metadata: Metadata = {
  title: 'Open State – Demo Arbeitsverwaltung',
  description: 'Transparenter Demonstrator für nachvollziehbare Verwaltungsabläufe',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <footer style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-primary)',
          padding: '0.875rem 0',
          marginTop: 'auto'
        }}>
          <div className="container" style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
          }}>
            <BuildInfo />
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
              <Link href="/stories" style={{ color: 'rgba(255,255,255,0.75)' }}>Story Coverage</Link>
              <Link href="/feedback" style={{ color: 'rgba(255,255,255,0.75)' }}>Feedback</Link>
              <a href="https://github.com/d0npedro/open-state" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.75)' }}>GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
