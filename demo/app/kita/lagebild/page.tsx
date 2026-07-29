import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import { KitaMeldeeingangPanel } from '@/components/kita/KitaMeldeeingangPanel';
import { KitaEngpassRangliste } from '@/components/kita/KitaEngpassRangliste';
import { KitaHandlungsfelder } from '@/components/kita/KitaHandlungsfelder';
import { KitaPlanungsraumDetailListe } from '@/components/kita/KitaPlanungsraumDetailListe';
import { KitaLagebildDruck } from '@/components/kita/KitaLagebildDruck';
import { KitaZeitreiheTabelle } from '@/components/kita/KitaZeitreiheTabelle';

// ─── Hauptseite ──────────────────────────────────────────────────────────────

export default function KitaLagebildPage() {
  const lb = demoKitaLagebild;
  const g = lb.gesamt;

  // Planungsräume nach Wartelistendruck absteigend sortiert (AK 1 US-KJ-006)
  const sorted = [...lb.planungsraeume].sort(
    (a, b) => b.wartelisteDruckFaktor - a.wartelisteDruckFaktor
  );
  const maxDruck = sorted[0].wartelisteDruckFaktor;

  // Maßnahmen je Planungsraum zuordnen
  const massnahmenByPR = Object.fromEntries(
    lb.planungsraeume.map(pr => [
      pr.id,
      lb.massnahmen.filter(m => m.planungsraumId === pr.id),
    ])
  );

  // Handlungsfelder: Planungsräume mit kritischem oder erhöhtem Druck
  const handlungsfelder = sorted.filter(pr => pr.wartelisteDruckFaktor > 5);

  // Letzten 3 Monate der Zeitreihe für Kurztrend
  const letzterMonat = lb.zeitreihe[lb.zeitreihe.length - 1];
  const drittLetzterMonat = lb.zeitreihe[lb.zeitreihe.length - 3];
  const wartelisteDelta3M = letzterMonat.wartelisteBestand - drittLetzterMonat.wartelisteBestand;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Demo-Zugangs-Banner – nicht drucken */}
      <div
        className="no-print"
        style={{
          padding: '0.875rem 1.25rem',
          background: '#1a1a2e',
          borderRadius: 'var(--radius)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '1rem' }}>🔒</span>
        <div>
          <strong>Demo: Interne Jugendamt-Ansicht</strong>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '0.75rem' }}>
            In der Produktion wäre diese Ansicht nur für berechtigte Mitarbeitende des Jugendamts
            zugänglich. Sie enthält detailliertere Steuerungskennzahlen als der öffentliche
            Transparenzbericht.
          </span>
        </div>
      </div>

      {/* Story-Badges + Titel */}
      <div>
        <div
          className="no-print"
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '0.75rem',
          }}
        >
          <span className="badge badge-primary">US-KJ-005</span>
          <span className="badge badge-primary">US-KJ-006</span>
          <span>
            Versorgungslagebild · Engpass · Handlungsfelder · Detail Meldelücke-Filter ·
            Zeitreihe 12 Monate (UI + CSV) · Druck und CSV (Status/Meldebasis) · Jugendamt-intern
          </span>
        </div>
        <h1 style={{ marginBottom: '0.4rem' }}>Steuerungslagebild Kindertagesbetreuung</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {lb.kommuneBezeichnung} · Datenstand: {lb.stand} · {lb.berichtszeitraum}
        </p>
      </div>

      {/* Druckleiste + Print-CSS (Filter-Hinweise in Engpass/Handlungsfelder/Detail) */}
      <KitaLagebildDruck />

      {/* Gesamtkennzahlen (intern, mehr Detail als öffentlich) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Gesamtlage</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            {
              label: 'Genehmigte Plätze',
              val: g.genehmmigtePlaetze.toLocaleString('de-DE'),
              hl: undefined,
            },
            {
              label: 'Real nutzbar',
              val: g.realNutzbarePlaetze.toLocaleString('de-DE'),
              hl: undefined,
            },
            {
              label: 'Belegt',
              val: g.belegtePlaetze.toLocaleString('de-DE'),
              hl: undefined,
            },
            { label: 'Frei', val: g.freiePlaetze, hl: 'var(--color-danger)' },
            {
              label: 'Auslastungsgrad',
              val: `${g.auslastungsgradProzent.toFixed(1)} %`,
              hl: 'var(--color-danger)',
            },
            {
              label: 'Warteliste gesamt',
              val: g.wartelisteBestand,
              hl: 'var(--color-warning)',
            },
            {
              label: 'Δ Warteliste (3 Monate)',
              val: `${wartelisteDelta3M > 0 ? '+' : ''}${wartelisteDelta3M}`,
              hl: wartelisteDelta3M > 0 ? 'var(--color-danger)' : 'var(--color-success)',
            },
            {
              label: 'Personal-Ausfall Ø',
              val: `${g.personalAusfallquoteProzent.toFixed(1)} %`,
              hl: g.personalAusfallquoteProzent > 8 ? 'var(--color-warning)' : undefined,
            },
            {
              label: 'Inklusionsplätze',
              val: `${g.inklusionsplaetzeBelegt}/${g.inklusionsplaetzeGenehmigt}`,
              hl: undefined,
            },
          ].map(k => (
            <div
              key={k.label}
              className="card"
              style={{ borderTop: `3px solid ${k.hl ?? 'var(--color-primary)'}` }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.3rem',
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: k.hl ?? 'var(--color-text)',
                  lineHeight: 1.1,
                }}
              >
                {k.val}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meldeeingang / Datenbasis freigegebene Meldungen (US-KJ-004 → US-KJ-005, AK 4) */}
      <KitaMeldeeingangPanel />

      {/* Engpass-Rangliste (AK 1+2 US-KJ-006) + Meldebasis + Meldelücke-Filter */}
      <KitaEngpassRangliste sorted={sorted} maxDruck={maxDruck} />

      {/* Handlungsfelder + Meldebasis + Meldelücke-Filter */}
      <KitaHandlungsfelder handlungsfelder={handlungsfelder} massnahmenByPR={massnahmenByPR} />

      {/* Planungsraum-Detailkarten + Meldelücke-Filter (AK 4 US-KJ-006) */}
      <KitaPlanungsraumDetailListe sorted={sorted} massnahmenByPR={massnahmenByPR} />

      {/* 12-Monats-Zeitreihe im Lagebild-UI (US-KJ-005 / US-KJ-010) — Spiegel öffentlicher Bericht;
          CSV-Gesamtexport bleibt in KitaLagebildDruck Blatt 6 */}
      <section id="kita-lagebild-zeitreihe" aria-labelledby="kita-lagebild-zeitreihe-heading">
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="no-print"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '0.5rem',
            }}
          >
            <span className="badge badge-primary">US-KJ-005</span>
            <span className="badge badge-primary">US-KJ-010</span>
            <span>
              Zeitreihe · Regionenfilter · Meldebasis · CSV aktiver Filter · Druck Filterstand · Open-Data-Lizenz
            </span>
          </div>
          <h2 id="kita-lagebild-zeitreihe-heading" style={{ marginBottom: '0.35rem' }}>
            Entwicklung der letzten 12 Monate
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '48rem' }}>
            Interne Steuerungsansicht derselben 12-Monats-Aggregate wie im öffentlichen
            Transparenzbericht (Gesamtkommune und Planungsräume). Ergänzt die Kennzahl „Δ Warteliste
            (3 Monate)“ in der Gesamtlage. Keine Interpolation, keine Trendbewertung. Meldebasis am
            Berichtsmonat session-sensitiv. CSV der aktiven Filteransicht hier; vollständiger
            Steuerungs-CSV inkl. Zeitreihen-Blatt über die Export-Karte oben.
          </p>
        </div>
        <KitaZeitreiheTabelle
          zeitreihe={lb.zeitreihe}
          zeitreihePlanungsraeume={lb.zeitreihePlanungsraeume}
          planungsraeume={lb.planungsraeume}
        />
      </section>

      {/* Methodik-Verweis */}
      <div
        style={{
          padding: '0.875rem 1rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        Definitionen aller Kennzahlen und Berechnungsformeln finden Sie im{' '}
        <a href="/kita" className="no-print" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Transparenzbericht (Methodik-Abschnitt)
        </a>
        <span className="print-only">öffentlichen Transparenzbericht (Methodik-Abschnitt)</span>
        . Dieses Lagebild verwendet dieselben Berechnungsgrundlagen — intern mit höherer regionaler
        Granularität. Residuale Planungslücke und Meldebasis sind methodische Hinweise (wie
        Bedarfsplanung und Transparenzbericht), keine automatische Handlungsempfehlung. Schnellfilter
        „Meldelücke“ in Engpass, Handlungsfeldern und Detailkarten ändern nur die Sichtbarkeit; bei
        aktivem Filter dokumentiert der Ausdruck den Filterstand (print-only-Hinweis je Abschnitt).
        Zeitreihe (US-KJ-005 / US-KJ-010): 12-Monats-Tabelle mit Regionenfilter und Meldebasis-Hinweis
        im UI; CSV der aktiven Filteransicht an der Tabelle; im Ausdruck print-only Filterstand
        (Region, Meldebasis-Session, Peak, Monate — Filter-Chips/CSV no-print). Steuerungs-CSV
        Blatt 6 enthält Gesamtkommune und alle Planungsräume. CSV-Export (US-KJ-005):
        freigabeunabhängig mit Lagebild-Status, Meldebasis-Session und optionalem Export-Filter
        „Meldelücke“ (Blätter Versorgung, Engpass-Rangliste, Handlungsfelder, Maßnahmen,
        Meldebasis-Stichprobe, Zeitreihe; Semikolon, UTF-8 BOM). Keine Interpolation, keine
        Trendbewertung. Keine Kind- oder Personennamen (DEC-004).
      </div>

      {/* Steuerungskette JA: Lagebild → Bedarfsplanung → Vorlage (+ Meldebasis) */}
      <section aria-labelledby="prozesskette-heading" className="no-print">
        <h2 id="prozesskette-heading" style={{ marginBottom: '0.5rem' }}>
          Steuerungskette Jugendamt
        </h2>
        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            maxWidth: '44rem',
          }}
        >
          Kommune <strong>{lb.kommuneBezeichnung}</strong>, Lagebild{' '}
          <span style={{ fontFamily: 'monospace' }}>{lb.version}</span> ({lb.stand}
          ). Dieses Lagebild speist den Bedarfsplanungsentwurf und die politische Gremienvorlage.
          Meldebasis aus freigegebenen Einrichtungsmeldungen (Session-Demo). Keine Kind- oder
          Personennamen; keine automatische Beschlussempfehlung.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {(
            [
              {
                href: '/kita/bedarfsplanung',
                story: 'US-KJ-007',
                title: 'Bedarfsplanungsentwurf',
                text: 'Planungslücken und Meldebasis aus diesem Lagebild; Entwurf ohne automatische Entscheidung.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/vorlage',
                story: 'US-KJ-008',
                title: 'Politische Vorlage',
                text: 'Gremienvorlage aus Lagebild und Planungslücken; Freigabe nur aktiv durch JA-Leitung.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/meldung',
                story: 'US-KJ-004',
                title: 'Monatsmeldung freigeben',
                text: 'Einrichtungs-Aggregate freigeben; schließt Demo-Meldelücken (z. B. Südost / Sonnenwinkel).',
                border: 'var(--color-warning)',
              },
            ] as const
          ).map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                borderTop: `3px solid ${card.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <span
                className="badge badge-primary"
                style={{ alignSelf: 'flex-start', fontSize: '0.68rem' }}
              >
                {card.story}
              </span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                {card.title}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {card.text}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="no-print" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Steuerungskette Kommune {lb.kommuneBezeichnung}: Lagebild → Bedarfsplanung → Vorlage
        (Planungslücken und Meldebasis). Zeitreihe 12 Monate im UI (Filter + CSV aktiver Ansicht;
        Druck: print-only Filterstand Region/Meldebasis) und im Steuerungs-CSV (Blatt 6). Druck und
        CSV: Status/Meldebasis und optionaler Meldelücke-Filter im Export. Öffentliche Aggregation
        ohne Einrichtungsdetail im{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Bericht
        </Link>{' '}
        (DEC-004).
      </div>
    </div>
  );
}
