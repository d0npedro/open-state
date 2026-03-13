'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GruendungStateProvider } from '@/context/GruendungStateContext';
import { DomainNav } from '@/components/DomainNav';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: '/gruendung',             label: 'Übersicht',  icon: 'home'     },
  { href: '/gruendung/behoerden',   label: 'Behörden',   icon: 'building' },
  { href: '/gruendung/dokumente',   label: 'Unterlagen', icon: 'file'     },
  { href: '/gruendung/rueckfragen', label: 'Fragen',     icon: 'chat'     },
  { href: '/gruendung/verlauf',     label: 'Verlauf',    icon: 'clock'    },
];

export default function GruendungLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'none' }}>← Startseite</Link>
          <span style={{ fontWeight: 600 }}>Meine Gewerbeanmeldung</span>
          <DomainNav active="/gruendung" />
        </div>
      </header>

      <nav aria-label="Bereichsnavigation" style={{ background: 'white', borderBottom: '2px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {tabs.map(tab => {
              const isActive = tab.href === '/gruendung'
                ? pathname === '/gruendung'
                : pathname.startsWith(tab.href);
              return (
                <Link key={tab.href} href={tab.href} className={`tab-nav-item${isActive ? ' active' : ''}`}>
                  <Icon name={tab.icon} size={16} />
                  {tab.label}
                </Link>
              );
            })}
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
