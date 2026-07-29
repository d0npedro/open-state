// UX-Grund: Navigation mit Icons + Klarsprache.
// "Rückfragen" → "Fragen", "Bescheide" → "Bescheid", "Hinweise" integriert.
// Aktiver Tab visuell unverkennbar (border + color change).
// Tab-Badges: offene Handlungsmengen ohne Extra-Klick sichtbar (US-AV-001/003/004).

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DemoStateProvider, useDemoState } from '@/context/DemoStateContext';
import { DomainNav } from '@/components/DomainNav';
import { AvDemoSessionBar } from '@/components/DemoSessionBar';
import { Icon } from '@/components/Icon';

// UX-Grund: 6 Tabs statt 7 — Hinweise wird kontextuell eingebettet
// damit Nutzer nicht aktiv navigieren müssen, um Warnungen zu sehen.
const nav = [
  { href: '/fall',            label: 'Übersicht',  icon: 'home'     as const, badgeKey: null },
  { href: '/fall/dokumente',  label: 'Unterlagen', icon: 'file'     as const, badgeKey: 'unterlagen' as const },
  { href: '/fall/rueckfragen',label: 'Fragen',     icon: 'chat'     as const, badgeKey: 'fragen' as const },
  { href: '/fall/termine',    label: 'Termine',    icon: 'calendar' as const, badgeKey: null },
  { href: '/fall/bescheide',  label: 'Bescheid',   icon: 'scroll'   as const, badgeKey: null },
  { href: '/fall/verlauf',    label: 'Verlauf',    icon: 'clock'    as const, badgeKey: null },
];

/** Kleines Zähler-Badge auf Tabs mit Handlungsbedarf (inline, kein Design-Token-Eingriff). */
function TabCountBadge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span
      data-testid={`tab-badge-${label}`}
      aria-label={`${count} offen`}
      style={{
        position: 'absolute',
        top: '0.35rem',
        right: '0.35rem',
        minWidth: '1.25rem',
        height: '1.25rem',
        padding: '0 0.3rem',
        borderRadius: '999px',
        background: 'var(--color-danger)',
        color: '#fff',
        fontSize: '0.7rem',
        fontWeight: 700,
        lineHeight: '1.25rem',
        textAlign: 'center',
        boxShadow: '0 0 0 2px #fff',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

/** Tab-Nav mit Live-Zählern aus DemoState (muss innerhalb Provider liegen). */
function FallTabNav() {
  const pathname = usePathname();
  const { fall } = useDemoState();

  const offeneFragen = fall.rueckfragen.filter(r => !r.beantwortet).length;
  const offeneUnterlagen = fall.dokumente.filter(
    d => d.status === 'ANGEFORDERT' || d.status === 'ABGELEHNT'
  ).length;

  const counts: Record<'fragen' | 'unterlagen', number> = {
    fragen: offeneFragen,
    unterlagen: offeneUnterlagen,
  };

  function isActive(href: string) {
    if (href === '/fall') return pathname === '/fall';
    return pathname.startsWith(href);
  }

  return (
    <nav
      style={{ background: 'white', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}
      aria-label="Bereichsnavigation"
    >
      <div className="container" style={{ padding: '0' }}>
        <div className="tab-nav" role="tablist">
          {nav.map(n => {
            const count = n.badgeKey ? counts[n.badgeKey] : 0;
            const active = isActive(n.href);
            const ariaLabel =
              count > 0
                ? `${n.label}, ${count} offen`
                : n.label;
            return (
              <Link
                key={n.href}
                href={n.href}
                role="tab"
                aria-selected={active}
                aria-label={ariaLabel}
                className={`tab-nav-item${active ? ' active' : ''}`}
                style={{ position: 'relative' }}
              >
                <Icon name={n.icon} size={22} />
                <span>{n.label}</span>
                {n.badgeKey && <TabCountBadge count={count} label={n.badgeKey} />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default function FallLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoStateProvider>
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

        {/* Tab-Navigation: Icons + Labels + Badges bei Handlungsbedarf */}
        <FallTabNav />

        {/* Q-075: Session-Leiste nach Demo-Interaktionen */}
        <AvDemoSessionBar />

        {/* Inhalt */}
        <main style={{ padding: '1.75rem 0 4rem', flex: 1 }}>
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </DemoStateProvider>
  );
}
