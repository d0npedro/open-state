import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import type { PlanungsraumKennzahlen, Kapazitaetsmassnahme } from '@/types/kita';

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

function druckColor(faktor: number): string {
  if (faktor > 20) return 'var(--color-danger)';
  if (faktor > 5)  return 'var(--color-warning)';
  return                  'var(--color-success)';
}

function druckLabel(faktor: number): string {
  if (faktor > 20) return 'Kritisch';
  if (faktor > 5)  return 'Erhöht';
  return                  'Stabil';
}

/** Anteil der durch laufende Maßnahmen schließbaren Lücke */
function deckungsgrad(warteliste: number, neuePlaetze: number): number {
  if (warteliste === 0) return 100;
  return Math.min(Math.round((neuePlaetze / warteliste) * 100), 100);
}

function MiniDruckBar({ faktor, maxFaktor }: { faktor: number; maxFaktor: number }) {
  const width = Math.min((faktor / maxFaktor) * 100, 100);
  const color = druckColor(faktor);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden', minWidth: '60px' }}>
        <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: '4px' }} />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color, minWidth: '2.5rem' }}>{faktor.toFixed(1)}x</span>
    </div>
  );
}

function MassnahmeTag({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    IN_PLANUNG:     { label: 'In Planung',     color: 'var(--color-neutral)' },
    GENEHMIGT:      { label: 'Genehmigt',      color: 'var(--color-primary)' },
    IM_BAU:         { label: 'Im Bau',          color: 'var(--color-warning)' },
    FERTIGGESTELLT: { label: 'Fertiggestellt',  color: 'var(--color-success)' },
  };
  const s = map[status] ?? { label: status, color: 'var(--color-neutral)' };
  return <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>{s.label}</span>;
}

// ─── Planungsraum-Detailkarte ────────────────────────────────────────────────

function PlanungsraumKarte({
  pr,
  massnahmen,
  rank,
  maxDruck,
}: {
  pr: PlanungsraumKennzahlen;
  massnahmen: Kapazitaetsmassnahme[];
  rank: number;
  maxDruck: number;
}) {
  const neuePlaetze = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  const deckung = deckungsgrad(pr.wartelisteBestand, neuePlaetze);
  const color = druckColor(pr.wartelisteDruckFaktor);
  const gesamtRealNutzbar = pr.realNutzbarePlaetzeU3 + pr.realNutzbarePlaetzeUe3;
  const gesamtBelegt      = pr.belegtePlaetzeU3      + pr.belegtePlaetzeUe3;
  const gesamtFrei        = pr.freiePlaetzeU3        + pr.freiePlaetzeUe3;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      {/* Kopfzeile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Rang {rank} nach Wartelistendruck</div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{pr.bezeichnung}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>{pr.wartelisteDruckFaktor.toFixed(1)}x</div>
          <div style={{ fontSize: '0.75rem', color, fontWeight: 600 }}>{druckLabel(pr.wartelisteDruckFaktor)}</div>
        </div>
      </div>

      {/* Kernkennzahlen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Real nutzbar',     val: gesamtRealNutzbar },
          { label: 'Belegt',           val: gesamtBelegt },
          { label: 'Frei',             val: gesamtFrei,             hl: gesamtFrei <= 6 ? 'var(--color-danger)' : undefined },
          { label: 'Warteliste',        val: pr.wartelisteBestand,   hl: pr.wartelisteBestand > 80 ? 'var(--color-danger)' : 'var(--color-warning)' },
          { label: 'Auslastung',        val: `${pr.auslastungsgradProzent.toFixed(1)} %`, hl: pr.auslastungsgradProzent >= 98 ? 'var(--color-danger)' : undefined },
          { label: 'Personal-Ausfall', val: `${pr.personalAusfallquoteProzent.toFixed(1)} %`, hl: pr.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' : undefined },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{k.label}</div>
            <div style={{ fontWeight: 700, color: k.hl ?? 'var(--color-text)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Versorgungsquoten */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
        <span>U3-Quote: <strong style={{ color: pr.versorgungsquote.u3 < 35 ? 'var(--color-danger)' : 'var(--color-text)' }}>{pr.versorgungsquote.u3.toFixed(1)} %</strong></span>
        <span>Ü3-Quote: <strong style={{ color: pr.versorgungsquote.ue3 < 75 ? 'var(--color-warning)' : 'var(--color-text)' }}>{pr.versorgungsquote.ue3.toFixed(1)} %</strong></span>
        <span>Inklusion: <strong>{pr.inklusionsplaetzeBelegt}/{pr.inklusionsplaetzeGenehmigt} Pl.</strong></span>
      </div>

      {/* Bedarfslücke + Deckung */}
      <div style={{ background: pr.wartelisteBestand > 80 ? 'var(--color-danger-light, #fff5f5)' : 'var(--color-warning-light)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
        <strong>Bedarfslücke: {pr.wartelisteBestand} Anfragen ohne Platzzusage</strong>
        {neuePlaetze > 0 ? (
          <p style={{ margin: '0.4rem 0 0', color: 'var(--color-text)' }}>
            Laufende Maßnahmen schaffen <strong>+{neuePlaetze} Plätze</strong> (Deckungsgrad: <strong>{deckung} %</strong> der Warteliste).
            {deckung < 80 && ' Weitere Maßnahmen erforderlich, um die Lücke vollständig zu schließen.'}
          </p>
        ) : (
          <p style={{ margin: '0.4rem 0 0', color: 'var(--color-danger)' }}>
            Keine laufenden Kapazitätserweiterungen für diesen Planungsraum vorgesehen.
          </p>
        )}
      </div>

      {/* Maßnahmen */}
      {massnahmen.length > 0 ? (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            Kapazitätsmaßnahmen ({massnahmen.length})
          </div>
          {massnahmen.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span>{m.bezeichnung}</span>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0 }}>
                <MassnahmeTag status={m.status} />
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>+{m.erwarteteNeuePlaetze} Pl.</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{m.geplanteFertigstellung}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Keine laufenden Maßnahmen für diesen Planungsraum.</p>
      )}
    </div>
  );
}

// ─── Hauptseite ──────────────────────────────────────────────────────────────

export default function KitaLagebildPage() {
  const lb = demoKitaLagebild;
  const g  = lb.gesamt;

  // Planungsräume nach Wartelistendruck absteigend sortiert (AK 1 US-KJ-006)
  const sorted = [...lb.planungsraeume].sort((a, b) => b.wartelisteDruckFaktor - a.wartelisteDruckFaktor);
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
  const letzterMonat     = lb.zeitreihe[lb.zeitreihe.length - 1];
  const drittLetzterMonat = lb.zeitreihe[lb.zeitreihe.length - 3];
  const wartelisteDelta3M = letzterMonat.wartelisteBestand - drittLetzterMonat.wartelisteBestand;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Demo-Zugangs-Banner */}
      <div style={{
        padding: '0.875rem 1.25rem',
        background: '#1a1a2e',
        borderRadius: 'var(--radius)',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '0.875rem',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1rem' }}>🔒</span>
        <div>
          <strong>Demo: Interne Jugendamt-Ansicht</strong>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '0.75rem' }}>
            In der Produktion wäre diese Ansicht nur für berechtigte Mitarbeitende des Jugendamts zugänglich.
            Sie enthält detailliertere Steuerungskennzahlen als der öffentliche Transparenzbericht.
          </span>
        </div>
      </div>

      {/* Story-Badges + Titel */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-005</span>
          <span className="badge badge-primary">US-KJ-006</span>
          <span>Versorgungslagebild · Engpass-Analyse · Jugendamt-intern</span>
        </div>
        <h1 style={{ marginBottom: '0.4rem' }}>Steuerungslagebild Kindertagesbetreuung</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {lb.kommuneBezeichnung} · Datenstand: {lb.stand} · {lb.berichtszeitraum}
        </p>
      </div>

      {/* Gesamtkennzahlen (intern, mehr Detail als öffentlich) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Gesamtlage</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Genehmigte Plätze',      val: g.genehmmigtePlaetze.toLocaleString('de-DE'),  hl: undefined },
            { label: 'Real nutzbar',            val: g.realNutzbarePlaetze.toLocaleString('de-DE'), hl: undefined },
            { label: 'Belegt',                  val: g.belegtePlaetze.toLocaleString('de-DE'),      hl: undefined },
            { label: 'Frei',                    val: g.freiePlaetze,         hl: 'var(--color-danger)' },
            { label: 'Auslastungsgrad',          val: `${g.auslastungsgradProzent.toFixed(1)} %`,   hl: 'var(--color-danger)' },
            { label: 'Warteliste gesamt',        val: g.wartelisteBestand,    hl: 'var(--color-warning)' },
            { label: 'Δ Warteliste (3 Monate)', val: `${wartelisteDelta3M > 0 ? '+' : ''}${wartelisteDelta3M}`, hl: wartelisteDelta3M > 0 ? 'var(--color-danger)' : 'var(--color-success)' },
            { label: 'Personal-Ausfall Ø',      val: `${g.personalAusfallquoteProzent.toFixed(1)} %`, hl: g.personalAusfallquoteProzent > 8 ? 'var(--color-warning)' : undefined },
            { label: 'Inklusionsplätze',        val: `${g.inklusionsplaetzeBelegt}/${g.inklusionsplaetzeGenehmigt}`, hl: undefined },
          ].map(k => (
            <div key={k.label} className="card" style={{ borderTop: `3px solid ${k.hl ?? 'var(--color-primary)'}` }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>{k.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: k.hl ?? 'var(--color-text)', lineHeight: 1.1 }}>{k.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Datenlücken-Status (AK 4 US-KJ-005) */}
      <div style={{ padding: '0.75rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.875rem', borderLeft: '3px solid var(--color-success)' }}>
        <strong style={{ color: 'var(--color-success)' }}>Datenvollständigkeit:</strong>{' '}
        Alle 5 Planungsräume haben vollständige Meldedaten für {lb.berichtszeitraum} geliefert. Keine Datenlücken im aktuellen Bericht.
        Letzter Meldestichtag: {lb.stand}.
      </div>

      {/* Engpass-Rangliste (AK 1+2 US-KJ-006) */}
      <section>
        <h2 style={{ marginBottom: '0.5rem' }}>Engpass-Rangliste nach Wartelistendruck</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Wartelistendruck = offene Anfragen / real freie Plätze. Wert &gt; 1 bedeutet mehr Anfragen als freie Plätze.
          Kontinuierliche Skala — kein Ampelsystem.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sorted.map((pr, i) => (
            <div key={pr.id} style={{
              display: 'grid',
              gridTemplateColumns: '1.5rem 10rem 1fr 5rem',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.625rem 0.875rem',
              background: i === 0 ? 'var(--color-danger-light, #fff5f5)' : 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              borderLeft: `3px solid ${druckColor(pr.wartelisteDruckFaktor)}`,
            }}>
              <span style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>#{i + 1}</span>
              <span style={{ fontWeight: 600 }}>{pr.bezeichnung}</span>
              <MiniDruckBar faktor={pr.wartelisteDruckFaktor} maxFaktor={maxDruck} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                {pr.wartelisteBestand} Anfragen
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Handlungsfelder (aus Daten abgeleitet — keine Empfehlungen) */}
      <section>
        <h2 style={{ marginBottom: '0.5rem' }}>Handlungsfelder</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Aus den Falldaten abgeleitet — keine automatischen Empfehlungen. Die Entscheidung über Maßnahmen liegt bei der Jugendamtsleitung und den politischen Gremien.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {handlungsfelder.map(pr => {
            const m = massnahmenByPR[pr.id] ?? [];
            const neuePlaetze = m.reduce((s, x) => s + x.erwarteteNeuePlaetze, 0);
            const deckung = deckungsgrad(pr.wartelisteBestand, neuePlaetze);
            return (
              <div key={pr.id} style={{
                padding: '0.875rem 1rem',
                border: `1px solid ${druckColor(pr.wartelisteDruckFaktor)}`,
                borderRadius: 'var(--radius)',
                background: 'white',
                fontSize: '0.875rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <strong>{pr.bezeichnung}</strong>
                  <span style={{ color: druckColor(pr.wartelisteDruckFaktor), fontWeight: 600, fontSize: '0.8rem' }}>
                    Druck: {pr.wartelisteDruckFaktor.toFixed(1)}x · {druckLabel(pr.wartelisteDruckFaktor)}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {pr.wartelisteBestand} Anfragen ohne Platzzusage bei {pr.freiePlaetzeU3 + pr.freiePlaetzeUe3} freien Plätzen.
                  {neuePlaetze > 0
                    ? ` Laufende Maßnahmen schaffen +${neuePlaetze} Plätze (Deckungsgrad ${deckung} % der Warteliste).`
                    : ' Keine laufenden Kapazitätserweiterungen für diesen Planungsraum.'}
                  {deckung < 100 && pr.wartelisteDruckFaktor > 5 && ` Verbleibende Lücke: ${pr.wartelisteBestand - neuePlaetze > 0 ? pr.wartelisteBestand - neuePlaetze : 0} Plätze.`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Planungsraum-Detailkarten (AK 4 US-KJ-006: Detailsicht) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Planungsraum-Detailansicht</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sorted.map((pr, i) => (
            <PlanungsraumKarte
              key={pr.id}
              pr={pr}
              massnahmen={massnahmenByPR[pr.id] ?? []}
              rank={i + 1}
              maxDruck={maxDruck}
            />
          ))}
        </div>
      </section>

      {/* Methodik-Verweis */}
      <div style={{ padding: '0.875rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Definitionen aller Kennzahlen und Berechnungsformeln finden Sie im{' '}
        <a href="/kita" style={{ color: 'var(--color-primary)' }}>öffentlichen Transparenzbericht (Methodik-Abschnitt)</a>.
        Dieses Lagebild verwendet dieselben Berechnungsgrundlagen — intern mit höherer regionaler Granularität.
      </div>

    </div>
  );
}
