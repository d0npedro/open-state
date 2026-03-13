import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import { KitaCsvDownload } from '@/components/kita/KitaCsvDownload';
import { KitaZeitreiheTabelle } from '@/components/kita/KitaZeitreiheTabelle';

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

function auslastungBadge(pct: number): { color: string; label: string } {
  if (pct >= 98) return { color: 'var(--color-danger)',   label: 'Kritisch' };
  if (pct >= 95) return { color: 'var(--color-warning)',  label: 'Hoch' };
  return               { color: 'var(--color-success)',   label: 'Normal' };
}

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

      {/* Planungsraum-Übersicht (AK 1: je Region) */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <h2>Versorgung nach Planungsraum</h2>
          <KitaCsvDownload lagebild={lb} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                {['Planungsraum', 'Frei U3', 'Frei Ü3', 'Auslastung', 'Versorgung U3', 'Versorgung Ü3', 'Warteliste', 'Personal-Ausfall'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lb.planungsraeume.map((pr, i) => {
                const ausLast = auslastungBadge(pr.auslastungsgradProzent);
                const vqU3 = versorgungsquoteBadge(pr.versorgungsquote.u3, 'U3');
                const vqUe3 = versorgungsquoteBadge(pr.versorgungsquote.ue3, 'Ü3');
                return (
                  <tr key={pr.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-neutral-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{pr.bezeichnung}</td>
                    <td style={{ padding: '0.75rem', color: pr.freiePlaetzeU3 <= 2 ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: pr.freiePlaetzeU3 <= 2 ? 700 : 400 }}>
                      {pr.freiePlaetzeU3}
                    </td>
                    <td style={{ padding: '0.75rem', color: pr.freiePlaetzeUe3 <= 5 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                      {pr.freiePlaetzeUe3}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: ausLast.color, fontWeight: 600 }}>{pr.auslastungsgradProzent.toFixed(1)} %</span>
                      <span style={{ fontSize: '0.75rem', color: ausLast.color, marginLeft: '0.4rem' }}>({ausLast.label})</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: vqU3.color, fontWeight: 600 }}>{pr.versorgungsquote.u3.toFixed(1)} %</td>
                    <td style={{ padding: '0.75rem', color: vqUe3.color, fontWeight: 600 }}>{pr.versorgungsquote.ue3.toFixed(1)} %</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: pr.wartelisteDruckFaktor > 10 ? 'var(--color-danger)' : pr.wartelisteDruckFaktor > 4 ? 'var(--color-warning)' : 'var(--color-text)', fontWeight: 600 }}>
                        {pr.wartelisteBestand}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>
                        (Druck: {pr.wartelisteDruckFaktor.toFixed(1)}x)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: pr.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' : pr.personalAusfallquoteProzent > 8 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                      {pr.personalAusfallquoteProzent.toFixed(1)} %
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legende */}
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>■</span> Kritisch</span>
          <span><span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>■</span> Erhöht</span>
          <span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>■</span> Normal</span>
          <span>Druck-Faktor: Wartelistenanfragen / freie Plätze. Wert &gt; 1 = Engpass</span>
        </div>
      </section>

      {/* Monatsvergleich / Trenddarstellung (Q-024, US-KJ-010) */}
      <section>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">US-KJ-010</span>
            <span>Zeitreihen · Saisonale Muster · Trenddarstellung</span>
          </div>
          <h2>Entwicklung der letzten 12 Monate</h2>
        </div>
        <KitaZeitreiheTabelle zeitreihe={lb.zeitreihe} />
      </section>

      {/* Kapazitätsmaßnahmen */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Laufende Kapazitätserweiterungen</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                {['Maßnahme', 'Planungsraum', 'Typ', 'Status', 'Neue Plätze', 'Fertigstellung', 'Rechtsgrundlage'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lb.massnahmen.map((m, i) => {
                const statusColor: Record<string, string> = {
                  IN_PLANUNG:     'var(--color-neutral)',
                  GENEHMIGT:      'var(--color-primary)',
                  IM_BAU:         'var(--color-warning)',
                  FERTIGGESTELLT: 'var(--color-success)',
                };
                const statusLabel: Record<string, string> = {
                  IN_PLANUNG: 'In Planung', GENEHMIGT: 'Genehmigt',
                  IM_BAU: 'Im Bau', FERTIGGESTELLT: 'Fertiggestellt',
                };
                const typLabel: Record<string, string> = {
                  NEUBAU: 'Neubau', ERWEITERUNG: 'Erweiterung', UMBAU: 'Umbau',
                };
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-neutral-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.bezeichnung}</td>
                    <td style={{ padding: '0.75rem' }}>{m.planungsraumBezeichnung}</td>
                    <td style={{ padding: '0.75rem' }}>{typLabel[m.typ]}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: statusColor[m.status], fontWeight: 600 }}>{statusLabel[m.status]}</span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>+{m.erwarteteNeuePlaetze}</td>
                    <td style={{ padding: '0.75rem' }}>{m.geplanteFertigstellung}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{m.rechtsgrundlage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Geplante Gesamtkapazität aus laufenden Maßnahmen: <strong>+{lb.massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0)} Plätze</strong>.
          Davon bereits im Bau: <strong>+{lb.massnahmen.filter(m => m.status === 'IM_BAU').reduce((s, m) => s + m.erwarteteNeuePlaetze, 0)} Plätze</strong>.
          Fertigstellung zu unterschiedlichen Zeitpunkten, früheste: <strong>{lb.massnahmen.filter(m => m.status !== 'IN_PLANUNG').sort((a,b) => a.geplanteFertigstellung.localeCompare(b.geplanteFertigstellung))[0]?.geplanteFertigstellung}</strong>.
        </p>
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
          <li>Einrichtungen mit fehlendem Meldedatum sind im Planungsraum als „Datenlücke" vermerkt. Im vorliegenden Bericht sind alle 5 Planungsräume vollständig gemeldet.</li>
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
        Freigabe: {lb.freigegebenVon}, {lb.freigegebenAm}.
      </div>

    </div>
  );
}
