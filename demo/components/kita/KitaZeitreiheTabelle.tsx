import type { MonatsKennzahl } from '@/types/kita';

/**
 * Monatsvergleich / Trenddarstellung für den öffentlichen Kita-Transparenzbericht.
 * Keine Chart-Bibliothek — reine HTML-Tabelle mit CSS-Visualisierungen.
 *
 * Zeigt: Auslastung, freie Plätze, Warteliste + Monatsdelta, Personalausfall.
 * Markiert: Peak-Monat (höchste Warteliste), saisonale Muster.
 */

// Minimaler Inline-Balken, CSS-only
function MiniBar({ pct, maxPct = 100, color }: { pct: number; maxPct?: number; color: string }) {
  const width = Math.min((pct / maxPct) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ flex: 1, height: '6px', background: 'var(--color-border)', borderRadius: '3px', minWidth: '48px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: '3px' }} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color, minWidth: '3.5rem', textAlign: 'right' }}>
        {pct.toFixed(1)} %
      </span>
    </div>
  );
}

// Delta-Pfeil für Wartelistenveränderung
function DeltaZelle({ delta }: { delta: number | null }) {
  if (delta === null) return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>–</span>;
  if (delta === 0)    return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>±0</span>;
  const positiv = delta > 0;
  return (
    <span style={{
      fontWeight: 600,
      fontSize: '0.85rem',
      color: positiv ? 'var(--color-danger)' : 'var(--color-success)',
    }}>
      {positiv ? '▲' : '▼'} {positiv ? '+' : ''}{delta}
    </span>
  );
}

interface Props {
  zeitreihe: MonatsKennzahl[];
  /** Label des Monats mit der höchsten Warteliste */
  peakMonatLabel?: string;
}

export function KitaZeitreiheTabelle({ zeitreihe, peakMonatLabel }: Props) {
  const maxAuslastung = Math.max(...zeitreihe.map(m => m.auslastungsgradProzent));
  const maxWarteliste = Math.max(...zeitreihe.map(m => m.wartelisteBestand));
  const peak = zeitreihe.find(m => m.wartelisteBestand === maxWarteliste);

  return (
    <div>
      {/* Trend-Hinweis */}
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius)',
        fontSize: '0.875rem',
        borderLeft: '3px solid var(--color-primary)',
        color: 'var(--color-text)',
        lineHeight: 1.5,
      }}>
        Die Tabelle zeigt die letzten 12 Monate. Wartelistendelta (▲/▼) gibt die Veränderung gegenüber dem Vormonat an.
        {peak && (
          <> Der <strong>höchste Wartelistenbestand</strong> lag im <strong>{peak.monatLabel}</strong> mit {peak.wartelisteBestand} Anfragen — typisch für den Frühjahrs-Anmeldezeitraum.</>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Monat</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>Belegt</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>Frei</th>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, whiteSpace: 'nowrap', minWidth: '140px' }}>Auslastung</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>Warteliste</th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>Δ Vormonat</th>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, whiteSpace: 'nowrap', minWidth: '120px' }}>Personal-Ausfall</th>
            </tr>
          </thead>
          <tbody>
            {zeitreihe.map((m, i) => {
              const isPeak = m.wartelisteBestand === maxWarteliste;
              const isLatest = i === zeitreihe.length - 1;
              const auslastColor =
                m.auslastungsgradProzent >= 98 ? 'var(--color-danger)' :
                m.auslastungsgradProzent >= 95 ? 'var(--color-warning)' :
                'var(--color-success)';
              const ausfallColor =
                m.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' :
                m.personalAusfallquoteProzent > 8  ? 'var(--color-warning)' :
                'var(--color-success)';

              return (
                <tr
                  key={m.monat}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: isLatest
                      ? 'var(--color-primary-light)'
                      : isPeak
                        ? 'var(--color-warning-light)'
                        : i % 2 === 0
                          ? 'transparent'
                          : 'var(--color-neutral-light)',
                  }}
                >
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: isLatest ? 700 : 400, whiteSpace: 'nowrap' }}>
                    {m.monatLabel}
                    {isPeak && !isLatest && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--color-warning)', fontWeight: 700 }}>Peak</span>
                    )}
                    {isLatest && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>Aktuell</span>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{m.belegtePlaetze.toLocaleString('de-DE')}</td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: m.freiePlaetze < 50 ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: m.freiePlaetze < 50 ? 700 : 400 }}>
                    {m.freiePlaetze}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <MiniBar pct={m.auslastungsgradProzent} maxPct={maxAuslastung + 2} color={auslastColor} />
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: isPeak ? 700 : 400, color: isPeak ? 'var(--color-warning)' : 'var(--color-text)' }}>
                    {m.wartelisteBestand}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    <DeltaZelle delta={m.wartelisteDeltaVormonat} />
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <MiniBar pct={m.personalAusfallquoteProzent} maxPct={14} color={ausfallColor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legende */}
      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--color-primary-light)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>Aktuell = letzter Berichtsmonat</span>
        <span style={{ background: 'var(--color-warning-light)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>Peak = höchster Wartelistenbestand</span>
        <span>▲ = Warteliste gestiegen (Druck steigt) · ▼ = Warteliste gesunken</span>
      </div>
    </div>
  );
}
