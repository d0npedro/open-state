import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import { KitaCsvDownload } from '@/components/kita/KitaCsvDownload';
import { KitaPlanungsraumExplorer } from '@/components/kita/KitaPlanungsraumExplorer';
import { KitaRegionenVergleich } from '@/components/kita/KitaRegionenVergleich';
import { KitaZeitreiheTabelle } from '@/components/kita/KitaZeitreiheTabelle';

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

function versorgungsquoteBadge(pct: number, altersgruppe: 'U3' | 'Ü3'): { color: string } {
  if (altersgruppe === 'U3') {
    if (pct < 35) return { color: 'var(--color-danger)' };
    if (pct < 45) return { color: 'var(--color-warning)' };
    return               { color: 'var(--color-success)' };
  }
  if (pct < 75) return   { color: 'var(--color-danger)' };
  if (pct < 85) return   { color: 'var(--color-warning)' };
  return                 { color: 'var(--color-success)' };
}

function fmt(n: number) {
  return n.toLocaleString('de-DE');
}

// ─── Komponente ──────────────────────────────────────────────────────────────

export default function KitaTransparenzberichtPage() {
  const lb = demoKitaLagebild;
  const g = lb.gesamt;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Story-Badge + Titel */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-009</span>
          <span>Transparenzbericht · Öffentlich zugänglich</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Transparenzbericht Kindertagesbetreuung</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {lb.kommuneBezeichnung} · Berichtszeitraum: {lb.berichtszeitraum}
        </p>
      </div>

      {/* Datenstand und Freigabe (AK 3) */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'var(--color-neutral-light)',
        borderRadius: 'var(--radius)',
        borderLeft: '4px solid var(--color-primary)',
        fontSize: '0.875rem',
      }}>
        <div><span style={{ color: 'var(--color-text-muted)' }}>Datenstand:</span> <strong>{lb.stand}</strong></div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div><span style={{ color: 'var(--color-text-muted)' }}>Freigegeben am:</span> <strong>{lb.freigegebenAm}</strong></div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div><span style={{ color: 'var(--color-text-muted)' }}>Freigabe durch:</span> <strong>{lb.freigegebenVon}</strong></div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div><span style={{ color: 'var(--color-text-muted)' }}>Version:</span> {lb.version}</div>
      </div>

      {/* Druck + CSV: Status/Meldebasis print-only + Multi-Blatt Aggregate (US-KJ-009 AK 6) */}
      <KitaCsvDownload lagebild={lb} />

      {/* Gesamtkennzahlen (AK 1: gesamt) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Gesamtübersicht {lb.kommuneBezeichnung}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Genehmigte Plätze',   value: fmt(g.genehmmigtePlaetze),           note: 'Behördlich genehmigt' },
            { label: 'Real nutzbare Plätze', value: fmt(g.realNutzbarePlaetze),           note: 'Exkl. Umbau/Schließung' },
            { label: 'Belegte Plätze',       value: fmt(g.belegtePlaetze),                note: 'Aktive Betreuungsverträge' },
            { label: 'Freie Plätze',         value: fmt(g.freiePlaetze),                  note: 'Zum Stichtag verfügbar', highlight: g.freiePlaetze < 50 ? 'var(--color-danger)' : undefined },
            { label: 'Auslastungsgrad',      value: `${g.auslastungsgradProzent.toFixed(1)} %`, note: 'Belegt / real nutzbar', highlight: g.auslastungsgradProzent >= 98 ? 'var(--color-danger)' : undefined },
            { label: 'Wartelistenbestand',   value: fmt(g.wartelisteBestand),              note: 'Anfragen ohne Platzzusage', highlight: 'var(--color-warning)' },
            { label: 'Personalausfallquote', value: `${g.personalAusfallquoteProzent.toFixed(1)} %`, note: 'Kommunaler Durchschnitt' },
          ].map(k => (
            <div key={k.label} className="card" style={{ borderTop: `3px solid ${k.highlight ?? 'var(--color-primary)'}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{k.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: k.highlight ?? 'var(--color-text)', lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>{k.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Versorgungsquote gesamt (U3 vs Ü3) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Versorgungsquote nach Altersgruppe</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {([
            { label: 'Unter 3 Jahre (U3)', pct: g.versorgungsquote.u3, altersgruppe: 'U3' as const,
              hinweis: 'Bundesweit wird eine Quote von 35–45 % angestrebt (KiQuTG). Musterstadt liegt darunter.' },
            { label: '3 bis 6 Jahre (Ü3)', pct: g.versorgungsquote.ue3, altersgruppe: 'Ü3' as const,
              hinweis: 'Rechtsanspruch ab 3 Jahren (§ 24 Abs. 3 SGB VIII). Ziel: >90 %. Musterstadt nähert sich dem Ziel.' },
          ]).map(item => {
            const { color } = versorgungsquoteBadge(item.pct, item.altersgruppe);
            return (
              <div key={item.label} className="card">
                <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color }}>{item.pct.toFixed(1)} %</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>der Kinder versorgt</span>
                </div>
                {/* Visual bar */}
                <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', marginBottom: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(item.pct, 100)}%`, background: color, borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>{item.hinweis}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Planungsraum-Filter + Maßnahmen (Q-074, US-KJ-009); CSV/Druck oben */}
      <KitaPlanungsraumExplorer
        planungsraeume={lb.planungsraeume}
        massnahmen={lb.massnahmen}
      />

      {/* Monatsvergleich / Trenddarstellung (Q-024, US-KJ-010) */}
      <section>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">US-KJ-010</span>
            <span>Zeitreihen · Regionenfilter · CSV-Export · Open-Data-Lizenzhinweis · Saisonale Muster</span>
          </div>
          <h2>Entwicklung der letzten 12 Monate</h2>
        </div>
        <KitaZeitreiheTabelle
          zeitreihe={lb.zeitreihe}
          zeitreihePlanungsraeume={lb.zeitreihePlanungsraeume}
          planungsraeume={lb.planungsraeume}
        />
      </section>

      {/* Regionenvergleich Zwei-Räume (US-KJ-010 AK 3) */}
      <section>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">US-KJ-010</span>
            <span>Regionenvergleich · Zwei Planungsräume · 12-Monats-Verlauf · CSV Stichtag/Verlauf · Druck-Filterstand A/B · Lizenzhinweis</span>
          </div>
          <h2>Regionenvergleich</h2>
        </div>
        <KitaRegionenVergleich
          planungsraeume={lb.planungsraeume}
          zeitreihePlanungsraeume={lb.zeitreihePlanungsraeume}
        />
      </section>

      {/* Einschränkungshinweise (AK 5) */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'var(--color-warning-light)',
        border: '1px solid var(--color-warning)',
        borderRadius: 'var(--radius)',
        fontSize: '0.875rem',
      }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-warning)' }}>Hinweise zur Datenlage</strong>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
          <li>Einwohnerdaten (Grundlage Versorgungsquote) stammen aus der amtlichen Statistik mit Stichtag 31.12.2023 — unterjährige Bevölkerungsveränderungen sind nicht abgebildet.</li>
          <li>Wartelistenzahlen können Mehrfachanmeldungen enthalten. Der tatsächliche Platzbedarf kann geringer sein.</li>
          <li>Alle Angaben zu freien Plätzen beziehen sich auf den Meldestichtag (31.10.2024), nicht auf den aktuellen Tag.</li>
          <li>Einrichtungen mit fehlender freigegebener Monatsmeldung mindern die Aussagekraft residualer Planungslücken (Hinweis only, keine Interpolation). Demo: Planungsraum Südost kann initial eine Meldelücke zeigen – nach Freigabe in der Monatsmeldung geschlossen.</li>
          <li>Planungsraum-Explorer (US-KJ-009, Druck): Filter-Chips (Engpass/Meldelücke, Raumauswahl) no-print. Im Ausdruck immer print-only Filterstand: Raumauswahl oder Schnellfilter, Anzahl sichtbarer Räume, Maßnahmenbezug, residuale Planungslücke bei Einzelraum, Meldebasis-Session (Stichprobenmonat, Lückenliste raumaggregiert). Kennzahlen unverändert; Filter ändert nur Sichtbarkeit — keine Interpolation.</li>
          <li>Zeitreihe (US-KJ-010 AK&nbsp;2 / AK&nbsp;4, Druck): Regionenfilter auf Gesamtkommune oder einzelnen Planungsraum. CSV-Export lädt die aktuell gefilterte Zeitreihentabelle (Semikolon, UTF-8 BOM) inkl. Region und Meldebasis-Hinweis — keine Kind- oder Personennamen. Im Ausdruck: Filter-Chips und CSV no-print; print-only Filterstand (Region, Meldebasis-Session, Peak, Monate). Raumreihen sind Demo-Verteilungen der kommunalen Monatsreihe nach Strukturanteilen. Der Berichtsmonat Oktober 2024 ist methodisch an die Meldebasis-Stichprobe gekoppelt (raumbezogen im Filter). Meldelücken werden markiert, ohne Kennzahlen zu verändern oder zu interpolieren.</li>
          <li>Regionenvergleich (US-KJ-010 AK&nbsp;3 / AK&nbsp;4 + Verlauf, Druck): Zwei Planungsräume mit denselben Stichtags-Kennzahlen; Δ (A − B) ist rechnerisch und keine automatische Bewertung. Zusätzlich 12-Monats-Verlauf derselben Auswahl A/B (Kennzahl wählbar: Warteliste, Auslastung, freie Plätze, Personalausfall) mit monatsweiser Δ und Meldebasis-Hinweis am Berichtsmonat. CSV-Export (AK&nbsp;4): (1) Stichtags-Auswahl A/B inkl. Δ und Meldebasis; (2) aktiver Verlauf der gewählten Kennzahl (12 Monate · Wert A/B · Δ · Meldebasis). Im Ausdruck: Auswahl A/B, Kennzahl-Chips und CSV no-print; print-only Filterstand (Region A/B, Meldebasis-Session, Verlaufskennzahl, Stichprobenmonat). Semikolon, UTF-8 BOM — keine Kind- oder Personennamen. Raumreihen wie Zeitreihenfilter (Demo-Verteilung). Meldebasis je Raum session-sensitiv.</li>
          <li>Druck und CSV Transparenzbericht (US-KJ-009 AK&nbsp;6): Druck dokumentiert Status (freigegeben, Version, Freigabe Rolle+Datum) und Meldebasis-Session print-only — Spiegel Bedarfsplanung/Vorlage. CSV: Multi-Blatt freigegebene Aggregate mit Status/Freigabe im Metakopf, Meldebasis-Session (raumaggregiert) und optionalem Export-Filter „Meldelücke“. Blätter: Versorgung Gesamt, Planungsräume (Meldebasis-Spalten), Kapazitätsmaßnahmen, Meldebasis-Stichprobe. Keine Einrichtungs-PII (DEC-004). Semikolon, UTF-8 BOM.</li>
          <li>CSV-Datenlizenz (US-KJ-010, offene fachliche Frage): Alle öffentlichen Kita-CSV-Exporte (Planungsraumdaten/Transparenzbericht, Zeitreihe, Regionenvergleich Stichtag/Verlauf) tragen im Metakommentarkopf einen Demo-Lizenzhinweis. Open-Data-Status ist vorläufig — finale Lizenz je Bundesland zu klären. Vorschlag Demo-Nachnutzung: CC-BY 4.0-ähnlich mit Quellenangabe „Open State Demo – Kita Transparenzbericht“. Keine amtliche Statistik, nur Aggregate.</li>
        </ul>
      </div>

      {/* Methodik (AK 2: direkt auf der Seite) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Methodik und Definitionen</h2>
        <p style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Dieser Abschnitt beschreibt, wie jede Kennzahl berechnet wird, woher die Daten stammen und welche Einschränkungen gelten.
          Ziel ist vollständige Nachvollziehbarkeit — keine Zahl ohne Erklärung.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {lb.methodik.map(m => (
            <div key={m.kennzahl} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.35rem' }}>{m.kennzahl}</strong>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.875rem' }}>{m.definition}</p>
              {m.berechnungsformel && (
                <code style={{
                  display: 'block', fontSize: '0.8rem', padding: '0.4rem 0.75rem',
                  background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)',
                  marginBottom: '0.4rem', whiteSpace: 'pre-wrap',
                }}>{m.berechnungsformel}</code>
              )}
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span style={{ fontWeight: 600 }}>Quelle:</span> {m.datenquelle}
                {m.einschraenkungen && <><br /><span style={{ fontWeight: 600 }}>Einschränkung:</span> {m.einschraenkungen}</>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Abschluss-Hinweis */}
      <div style={{ padding: '0.875rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Dieser Bericht ist ein sachlicher Lagebericht der Verwaltung — kein Kommunikationsinstrument und keine politische Bewertung.
        Er enthält keine Empfehlungen und keine Werbung für Verwaltungsleistungen.
        Die Entscheidung über Maßnahmen liegt bei den zuständigen politischen Gremien.
        Freigabe: {lb.freigegebenVon}, {lb.freigegebenAm}. Druck und CSV (US-KJ-009 AK&nbsp;6): Status und
        Meldebasis im Ausdruck (print-only) bzw. CSV-Metakopf; optionales Meldelücke-Filter nur im CSV;
        keine Kind- oder Personennamen (DEC-004).
      </div>

      {/* Steuerungskette JA (Demo): öffentlicher Bericht speist sich aus freigegebenen Aggregaten */}
      <section aria-labelledby="steuerungskette-heading" className="no-print">
        <h2 id="steuerungskette-heading" style={{ marginBottom: '0.5rem' }}>
          Steuerungskette Jugendamt (Demo)
        </h2>
        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            maxWidth: '44rem',
          }}
        >
          Kommune <strong>{lb.kommuneBezeichnung}</strong>, freigegebene Version{' '}
          <span style={{ fontFamily: 'monospace' }}>{lb.version}</span> ({lb.stand}
          ). Dieser öffentliche Bericht enthält nur aggregierte Planungsraum- und
          Kommunalkennzahlen — keine Einrichtungsdetails und keine Kind- oder Personennamen
          (DEC-004). In der Demo sind die internen Steuerungsstufen verlinkt, aus denen die
          freigegebene öffentliche Aggregation hervorgeht.
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
                href: '/kita/lagebild',
                story: 'US-KJ-005',
                title: 'Steuerungslagebild',
                text: 'Interne JA-Ansicht mit Engpass, Handlungsfeldern und Meldeeingang (höhere Granularität als der öffentliche Bericht).',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/bedarfsplanung',
                story: 'US-KJ-007',
                title: 'Bedarfsplanungsentwurf',
                text: 'Planungslücken und Meldebasis aus dem Lagebild; Entwurf ohne automatische Entscheidung (§ 80 SGB VIII).',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/vorlage',
                story: 'US-KJ-008',
                title: 'Politische Vorlage',
                text: 'Gremienvorlage aus Lagebild und Planungslücken; Freigabe nur aktiv durch JA-Leitung.',
                border: 'var(--color-primary)',
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
        (interne Demo-Routen). Öffentliche Aggregation hier ohne Einrichtungsdetail (DEC-004,
        US-KJ-009). Betriebliche Meldebasis über freigegebene Monatsmeldungen (US-KJ-004).
        Druck: Status und Meldebasis-Session print-only; Planungsraum-Explorer print-only
        Filterstand (Raum/Schnellfilter/Meldebasis/Maßnahmen); Zeitreihe print-only Filterstand
        (Region/Meldebasis); Regionenvergleich print-only Filterstand (A/B, Kennzahl, Meldebasis);
        CSV Multi-Blatt Aggregate.
      </div>

      <div
        className="print-only print-block"
        style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}
      >
        Druckansicht US-KJ-009 · Status freigegeben · Version {lb.version} · Datenstand {lb.stand} ·
        Meldebasis raumaggregiert (Session, Demo-Stichprobe Meldeeingang) · Planungsraum-Explorer mit
        dokumentiertem Filterstand (Raum/Schnellfilter/Meldebasis/Maßnahmen, print-only) · Zeitreihe
        mit dokumentiertem Regionenfilter/Meldebasis (print-only) · Regionenvergleich mit dokumentiertem
        Filterstand A/B und Verlaufskennzahl (print-only) · keine Kind- oder Personennamen (DEC-004).
      </div>

    </div>
  );
}
