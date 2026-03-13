// UX-Grund: Navigation mit Icons + Klarsprache.
// "Rückfragen" → "Fragen", "Bescheide" → "Bescheid", "Hinweise" integriert.
// Aktiver Tab visuell unverkennbar (border + color change).

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DemoStateProvider } from '@/context/DemoStateContext';
import { DomainNav } from '@/components/DomainNav';
import { Icon } from '@/components/Icon';

// UX-Grund: 6 Tabs statt 7 — Hinweise wird kontextuell eingebettet
// damit Nutzer nicht aktiv navigieren müssen, um Warnungen zu sehen.
const nav = [
  { href: '/fall',            label: 'Übersicht',  icon: 'home'     as const },
  { href: '/fall/dokumente',  label: 'Unterlagen', icon: 'file'     as const },
  { href: '/fall/rueckfragen',label: 'Fragen',     icon: 'chat'     as const },
  { href: '/fall/termine',    label: 'Termine',    icon: 'calendar' as const },
  { href: '/fall/bescheide',  label: 'Bescheid',   icon: 'scroll'   as const },
  { href: '/fall/verlauf',    label: 'Verlauf',    icon: 'clock'    as const },
];

export default function FallLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // UX-Grund: Exact match für /fall, prefix match für Unterseiten
  function isActive(href: string) {
    if (href === '/fall') return pathname === '/fall';
    return pathname.startsWith(href);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Kopfzeile: Kontext + Domain-Switcher */}
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none' }}
            aria-label="Zurück zur Startseite"
          >
            ← Startseite
          </Link>
          {/* UX-Grund: Fall-ID klein halten — nicht die primäre Information */}
          <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Mein Antrag</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'monospace' }}>AV-2024-0042</span>
          <DomainNav active="/fall" />
        </div>
      </header>

      {/* Tab-Navigation: Icons + Labels */}
      {/* UX-Grund: Immer sichtbar, nicht im Scroll-Bereich — Nutzer muss nie suchen */}
      <nav
        style={{ background: 'white', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}
        aria-label="Bereichsnavigation"
      >
        <div className="container" style={{ padding: '0' }}>
          <div className="tab-nav" role="tablist">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                role="tab"
                aria-selected={isActive(n.href)}
                className={`tab-nav-item${isActive(n.href) ? ' active' : ''}`}
              >
                <Icon name={n.icon} size={22} />
                <span>{n.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Inhalt */}
      <main style={{ padding: '1.75rem 0 4rem', flex: 1 }}>
        <div className="container">
          <DemoStateProvider>{children}</DemoStateProvider>
        </div>
      </main>
    </div>
  );
}
