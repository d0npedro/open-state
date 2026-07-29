'use client';

/**
 * Monatsvergleich / Trenddarstellung für den öffentlichen Kita-Transparenzbericht (US-KJ-010).
 * Keine Chart-Bibliothek — reine HTML-Tabelle mit CSS-Visualisierungen.
 *
 * Zeigt: Auslastung, freie Plätze, Warteliste + Monatsdelta, Personalausfall.
 * Markiert: Peak-Monat (höchste Warteliste), saisonale Muster.
 *
 * Meldebasis (US-KJ-004 → 010): Der mit dem Meldeeingang übereinstimmende Berichtsmonat
 * (Demo: Oktober 2024) erhält bei unvollständiger Stichprobe eine Datenlücken-Markierung.
 * Session-sensitiv; nach Freigabe in /kita/meldung entfällt die Markierung.
 * Hinweis only — keine Interpolation, keine Umbewertung der Zeitreihenwerte.
 * Nur Aggregate, keine Kind- oder Personennamen.
 */

import type { MonatsKennzahl } from '@/types/kita';
import { demoKitaMeldeeingang } from '@/data/mockKitaMeldeeingang';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

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
  const { basen, eintraege, hydrated } = useMeldeeingangFuerBedarfsplanung();
  const meldeMonatsIso = demoKitaMeldeeingang.monatsIso;
  const meldeMonatsLabel = demoKitaMeldeeingang.monatsLabel;

  const maxAuslastung = Math.max(...zeitreihe.map(m => m.auslastungsgradProzent));
  const maxWarteliste = Math.max(...zeitreihe.map(m => m.wartelisteBestand));
  const peak = zeitreihe.find(m => m.wartelisteBestand === maxWarteliste);

  /** Stichproben-Lücken (Planungsräume) – nur wenn hydratisiert, um SSR-Mismatch zu vermeiden */
  const lueckenBasen = basen.filter(b => b.hatDatenluecke);
  const freigegebenCount = eintraege.filter(e => e.status === 'FREIGEGEBEN').length;
  const erwartetCount = eintraege.length;
  const hatGesamtLuecke = hydrated && lueckenBasen.length > 0;
  const schwereGesamt = lueckenBasen.some(b => b.schwere === 'UEBERFAELLIG')
    ? 'UEBERFAELLIG'
    : lueckenBasen.length > 0
      ? 'AUSSTEHEND'
      : 'OK';

  const lueckenKurz = lueckenBasen
    .map(b => {
      const namen = b.luecken.map(e => e.einrichtungBezeichnung).join(', ');
      return `${b.planungsraumBezeichnung} (${namen})`;
    })
    .join('; ');

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
          <> Der <strong>höchste Wartelistenbestand</strong> lag im <strong>{peak.monatLabel}</strong>
          {peakMonatLabel ? ` (${peakMonatLabel})` : ''} mit {peak.wartelisteBestand} Anfragen — typisch für den Frühjahrs-Anmeldezeitraum.</>
        )}
        {' '}Der Berichtsmonat <strong>{meldeMonatsLabel}</strong> ist methodisch an die Meldebasis
        (Demo-Stichprobe Meldeeingang, US-KJ-004) gekoppelt: fehlende freigegebene Einrichtungsmeldungen
        werden am Monatszeile markiert — ohne die Kennzahlen zu verändern oder zu interpolieren.
      </div>

      {/* Meldebasis-Summenhinweis (Session-sensitiv) */}
      {hydrated && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.7rem 1rem',
            background: hatGesamtLuecke ? 'var(--color-warning-light)' : 'var(--color-neutral-light)',
            border: hatGesamtLuecke
              ? '1px solid var(--color-warning)'
              : '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--color-text)',
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'baseline', marginBottom: hatGesamtLuecke ? '0.35rem' : 0 }}>
            <strong style={{ fontSize: '0.8rem' }}>Meldebasis {meldeMonatsLabel}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Demo-Stichprobe: {freigegebenCount}/{erwartetCount} freigegeben
            </span>
            {hatGesamtLuecke ? (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: schwereGesamt === 'UEBERFAELLIG' ? 'var(--color-danger)' : 'var(--color-warning)',
                }}
              >
                · Meldelücke im Zeitreihen-Berichtsmonat
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
                · Stichprobe vollständig (ggf. nach Freigabe in /kita/meldung)
              </span>
            )}
          </div>
          {hatGesamtLuecke && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Unvollständige Meldebasis in: {lueckenKurz}. Die Zeitreihenwerte bleiben unverändert
              (Lagebild-Stand); die Markierung ist ein methodischer Hinweis auf mögliche
              Untererfassung freier Plätze / Warteliste in betroffenen Planungsräumen — keine
              Umbewertung des Trends.
            </p>
          )}
        </div>
      )}

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
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Meldebasis</th>
            </tr>
          </thead>
          <tbody>
            {zeitreihe.map((m, i) => {
              const isPeak = m.wartelisteBestand === maxWarteliste;
              const isLatest = i === zeitreihe.length - 1;
              const isMeldeMonat = m.monat === meldeMonatsIso;
              const showMeldeLuecke = isMeldeMonat && hatGesamtLuecke;
              const auslastColor =
                m.auslastungsgradProzent >= 98 ? 'var(--color-danger)' :
                m.auslastungsgradProzent >= 95 ? 'var(--color-warning)' :
                'var(--color-success)';
              const ausfallColor =
                m.personalAusfallquoteProzent > 10 ? 'var(--color-danger)' :
                m.personalAusfallquoteProzent > 8  ? 'var(--color-warning)' :
                'var(--color-success)';

              const rowBorderLeft = showMeldeLuecke
                ? schwereGesamt === 'UEBERFAELLIG'
                  ? '3px solid var(--color-danger)'
                  : '3px solid var(--color-warning)'
                : undefined;

              return (
                <tr
                  key={m.monat}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    borderLeft: rowBorderLeft,
                    background: showMeldeLuecke
                      ? 'var(--color-warning-light)'
                      : isLatest
                        ? 'var(--color-primary-light)'
                        : isPeak
                          ? 'var(--color-warning-light)'
                          : i % 2 === 0
                            ? 'transparent'
                            : 'var(--color-neutral-light)',
                  }}
                >
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: isLatest || showMeldeLuecke ? 700 : 400, whiteSpace: 'nowrap' }}>
                    {m.monatLabel}
                    {isPeak && !isLatest && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--color-warning)', fontWeight: 700 }}>Peak</span>
                    )}
                    {isLatest && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>Aktuell</span>
                    )}
                    {showMeldeLuecke && (
                      <span
                        style={{
                          marginLeft: '0.4rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: schwereGesamt === 'UEBERFAELLIG' ? 'var(--color-danger)' : 'var(--color-warning)',
                        }}
                      >
                        Meldelücke
                      </span>
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
                  <td style={{ padding: '0.6rem 0.75rem', verticalAlign: 'middle' }}>
                    {isMeldeMonat ? (
                      hydrated ? (
                        showMeldeLuecke ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: schwereGesamt === 'UEBERFAELLIG' ? 'var(--color-danger)' : 'var(--color-warning)',
                              }}
                              title={lueckenKurz}
                            >
                              Lücke ({freigegebenCount}/{erwartetCount})
                            </span>
                            {lueckenBasen.slice(0, 2).map(b => (
                              <span key={b.planungsraumId} style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                {b.planungsraumBezeichnung}: <MeldebasisBadge basis={b} />
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
                            vollständig
                          </span>
                        )
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>…</span>
                      )
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} title="Meldebasis-Stichprobe gilt nur für den aktuellen Berichtsmonat">
                        –
                      </span>
                    )}
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
        <span style={{ background: 'var(--color-warning-light)', padding: '0.1rem 0.4rem', borderRadius: '2px', border: '1px solid var(--color-warning)' }}>
          Meldelücke = unvollständige Meldebasis (Demo-Stichprobe, Session)
        </span>
        <span>▲ = Warteliste gestiegen (Druck steigt) · ▼ = Warteliste gesunken</span>
      </div>

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Methodik (US-KJ-010 AK&nbsp;6): Datenlücken im Zeitverlauf sind am Meldemonat sichtbar markiert.
        Historische Monate ohne Stichproben-Meldeeingang zeigen „–“ in der Spalte Meldebasis.
        Keine Schätzwerte, keine Trendkorrektur. Nur Aggregate; Freigabe-Demo unter{' '}
        <a href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>/kita/meldung</a>.
      </p>
    </div>
  );
}
