import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import { KitaMeldeeingangPanel } from '@/components/kita/KitaMeldeeingangPanel';
import { KitaEngpassRangliste } from '@/components/kita/KitaEngpassRangliste';
import { KitaHandlungsfelder } from '@/components/kita/KitaHandlungsfelder';
import { KitaPlanungsraumDetailListe } from '@/components/kita/KitaPlanungsraumDetailListe';

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
      {/* Demo-Zugangs-Banner */}
      <div
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
            Jugendamt-intern
          </span>
        </div>
        <h1 style={{ marginBottom: '0.4rem' }}>Steuerungslagebild Kindertagesbetreuung</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {lb.kommuneBezeichnung} · Datenstand: {lb.stand} · {lb.berichtszeitraum}
        </p>
      </div>

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
        <a href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Transparenzbericht (Methodik-Abschnitt)
        </a>
        . Dieses Lagebild verwendet dieselben Berechnungsgrundlagen — intern mit höherer regionaler
        Granularität. Residuale Planungslücke und Meldebasis sind methodische Hinweise (wie
        Bedarfsplanung und Transparenzbericht), keine automatische Handlungsempfehlung. Schnellfilter
        „Meldelücke“ in Engpass, Handlungsfeldern und Detailkarten ändern nur die Sichtbarkeit.
      </div>
    </div>
  );
}
