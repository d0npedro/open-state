'use client';

/**
 * Druckleiste und Print-CSS für das Steuerungslagebild (US-KJ-005/006).
 *
 * Schnellfilter „Meldelücke“ in Engpass / Handlungsfeldern / Detail sind interaktiv
 * (no-print); bei aktivem Filter erscheint im Ausdruck ein print-only-Hinweis
 * (Spiegel zu politischer Vorlage US-KJ-008). Keine Kind- oder Personennamen.
 */

export function KitaLagebildDruck() {
  return (
    <>
      <div
        className="no-print card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ maxWidth: '36rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Export</div>
          <strong style={{ fontSize: '0.95rem' }}>Druckansicht Lagebild</strong>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.25rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Filter-Chips werden nicht gedruckt. Ist „Meldelücke“ in Engpass-Rangliste,
            Handlungsfeldern oder Planungsraum-Detail aktiv, erscheint im Ausdruck ein
            entsprechender Filter-Hinweis (Session-Stand). Rangfolge bleibt nach
            Wartelistendruck.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.print()}
          style={{ fontSize: '0.875rem', flexShrink: 0 }}
        >
          Drucken / als PDF speichern
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-only { display: none; }
            @media print {
              .no-print { display: none !important; }
              .print-only { display: block !important; }
              body > div > header,
              body nav { display: none !important; }
              main { padding: 0 !important; }
            }
          `,
        }}
      />
    </>
  );
}
