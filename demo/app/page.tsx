// UX-Grund: Landing Page für JEDEN Menschen — keine Developer-Sprache.
// Klare Frage: "Was möchten Sie heute erledigen?"
// Primäre Handlung: Eine Karte anklicken. Keine Ablenkung.

import Link from 'next/link';
import { Icon } from '@/components/Icon';

const domains = [
  {
    id: 'av',
    icon: 'user' as const,
    iconColor: '#003F8C',
    iconBg: '#E8F0FB',
    title: 'Arbeitslosengeld beantragen',
    beschreibung: 'Sie haben Ihren Job verloren und möchten Unterstützung beantragen? Hier sehen Sie Ihren Antragsstatus, offene Aufgaben und alle Bescheide — in verständlicher Sprache.',
    href: '/fall',
    cta: 'Antrag öffnen',
    farbe: '#003F8C',
    randfarbe: '#003F8C',
  },
  {
    id: 'gruendung',
    icon: 'building' as const,
    iconColor: '#1a6335',
    iconBg: '#d8f3dc',
    title: 'Unternehmen anmelden',
    beschreibung: 'Sie möchten ein Unternehmen gründen? Alle notwendigen Behördenschritte — Gewerbeamt, Finanzamt, IHK — an einem Ort, mit Fristen und klaren Erklärungen.',
    href: '/gruendung',
    cta: 'Gründungsakte öffnen',
    farbe: '#1a6335',
    randfarbe: '#1a6335',
  },
  {
    id: 'kita',
    icon: 'baby' as const,
    iconColor: '#6b21a8',
    iconBg: '#f3e8ff',
    title: 'Kita-Plätze in Ihrer Stadt',
    beschreibung: 'Öffentlicher Transparenzbericht zu Kita-Plätzen: Versorgungsquoten, Wartezeiten und Kapazitäten — ohne Anmeldung, offen für alle Bürgerinnen und Bürger.',
    href: '/kita',
    cta: 'Transparenzbericht öffnen',
    farbe: '#6b21a8',
    randfarbe: '#6b21a8',
  },
];

const prinzipien = [
  {
    icon: 'shield' as const,
    title: 'Jede Entscheidung erklärt',
    text: 'Kein Behördendeutsch. Jede Anforderung und jeder Bescheid wird in verständlicher Sprache erklärt.',
    bg: '#EFF6FF',
    tc: '#1D4ED8',
  },
  {
    icon: 'eye' as const,
    title: 'Vollständig transparent',
    text: 'Sie sehen jederzeit, warum Ihr Antrag wo steht — mit vollständiger Verlaufshistorie.',
    bg: '#F0FDF4',
    tc: '#15803D',
  },
  {
    icon: 'star' as const,
    title: 'Keine KI-Entscheidungen',
    text: 'KI ist nur ein Assistent. Alle Entscheidungen trifft ein Mensch — das Gesetz gilt, nicht ein Algorithmus.',
    bg: '#FFF7ED',
    tc: '#C2410C',
  },
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── Kopfzeile ─────────────────────────────────────────────── */}
      <header style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.04em' }}>OPEN STATE</span>
            <span style={{ marginLeft: '0.875rem', opacity: 0.65, fontSize: '0.875rem' }}>Digitale Verwaltungsplattform</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <Link href="/stories" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Für Entwickler</Link>
            <Link href="/feedback" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Feedback</Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: '3.5rem 0 2.5rem' }}>
        <div className="container">
          {/* UX-Grund: Eine Frage, keine Aussage — Nutzer fühlt sich direkt angesprochen */}
          <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Demo · Alle Daten sind fiktiv
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '1rem', lineHeight: 1.15 }}>
            Was möchten Sie heute erledigen?
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-neutral)', lineHeight: 1.7, maxWidth: '600px' }}>
            Open State zeigt, wie Verwaltungsverfahren einfach, transparent und
            verständlich sein können — egal ob Sozialleistung, Firmengründung oder Kita-Suche.
          </p>
        </div>
      </section>

      {/* ─── Domain-Karten ──────────────────────────────────────────── */}
      {/* UX-Grund: Drei Optionen — Hick's Law. Keine 7 Links, keine Menüs.
          Jede Karte hat: Icon + klare Frage + ein einziger CTA */}
      <section style={{ padding: '2.5rem 0', background: 'var(--color-neutral-light)', flex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {domains.map(d => (
              <div
                key={d.id}
                className="domain-card"
                style={{ borderTop: `5px solid ${d.randfarbe}` }}
              >
                {/* Icon-Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: d.iconBg, color: d.iconColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name={d.icon} size={24} />
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{d.title}</h2>
                </div>

                {/* Beschreibung */}
                <p style={{ fontSize: '0.925rem', color: 'var(--color-neutral)', lineHeight: 1.65, margin: 0 }}>
                  {d.beschreibung}
                </p>

                {/* CTA — Großer, klarer Button */}
                <Link
                  href={d.href}
                  className="btn btn-primary btn-full"
                  style={{ background: d.farbe, marginTop: 'auto' }}
                >
                  {d.cta}
                  <Icon name="arrow-right" size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Prinzipien ─────────────────────────────────────────────── */}
      <section style={{ padding: '2.5rem 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Unsere Versprechen an Sie</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {prinzipien.map(p => (
              <div key={p.title} style={{ background: p.bg, borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: p.tc, flexShrink: 0, marginTop: '2px' }}>
                  <Icon name={p.icon} size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: p.tc, marginBottom: '0.375rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral)', lineHeight: 1.55 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo-Hinweis ───────────────────────────────────────────── */}
      <section style={{ padding: '1.5rem 0 2rem' }}>
        <div className="container">
          <div className="notice-box notice-box-neutral" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Icon name="info" size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Hinweis:</strong> Dies ist ein Demonstrator in der Konzeptphase.
              Alle Daten sind fiktiv. Kein echtes Backend, keine Behördenanbindungen.
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}
