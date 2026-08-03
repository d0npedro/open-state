import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { BuildInfo } from '@/components/BuildInfo';
import { SkipLink } from '@/components/SkipLink';
import { ThemeProvider } from '@/design-system/provider/ThemeProvider';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Open State – Demo Arbeitsverwaltung',
  description: 'Transparenter Demonstrator für nachvollziehbare Verwaltungsabläufe',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Anti-Flash: Theme aus localStorage vor erstem Render setzen */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('os-theme');var d=localStorage.getItem('os-density');if(t)document.documentElement.setAttribute('data-theme',t);if(d&&d!=='normal')document.documentElement.setAttribute('data-density',d);}catch(e){}})();` }} />
      </head>
      <body>
        <ThemeProvider>
          {/* Q-420: Skip-Link vor Header/Nav (WCAG 2.4.1) */}
          <SkipLink />
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
              <nav aria-label="Fußzeilen-Navigation" data-testid="footer-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
                <Link href="/stories" style={{ color: 'rgba(255,255,255,0.75)' }}>Story Coverage</Link>
                <Link href="/feedback" style={{ color: 'rgba(255,255,255,0.75)' }}>Feedback</Link>
                <a
                  href="https://github.com/d0npedro/open-state"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub-Repository (öffnet in neuem Tab)"
                  data-testid="footer-github-link"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  GitHub
                </a>
                <ThemeSwitcher />
              </nav>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
