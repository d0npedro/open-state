import Link from 'next/link';

const domains = [
  { href: '/fall',      short: 'Arbeitsverwaltung' },
  { href: '/gruendung', short: 'Gründung' },
  { href: '/kita',      short: 'Kita' },
];

/** Cross-domain quick-switcher shown in every domain header. */
export function DomainNav({ active }: { active: '/fall' | '/gruendung' | '/kita' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
      {domains.map(d =>
        d.href === active ? (
          <span
            key={d.href}
            style={{
              fontSize: '0.75rem', fontWeight: 600,
              padding: '0.2rem 0.65rem', borderRadius: '3px',
              background: 'rgba(255,255,255,0.22)', color: 'white',
              whiteSpace: 'nowrap',
            }}
          >{d.short}</span>
        ) : (
          <Link
            key={d.href}
            href={d.href}
            style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)',
              padding: '0.2rem 0.65rem', borderRadius: '3px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >{d.short}</Link>
        )
      )}
    </div>
  );
}
