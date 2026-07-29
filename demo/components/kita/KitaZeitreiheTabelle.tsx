'use client';

/**
 * Monatsvergleich / Trenddarstellung für den öffentlichen Kita-Transparenzbericht (US-KJ-010).
 * Keine Chart-Bibliothek — reine HTML-Tabelle mit CSS-Visualisierungen.
 *
 * Zeigt: Auslastung, freie Plätze, Warteliste + Monatsdelta, Personalausfall.
 * Markiert: Peak-Monat (höchste Warteliste), saisonale Muster.
 *
 * Regionenfilter (US-KJ-010 AK 2): Gesamtkommune oder einzelner Planungsraum.
 * CSV-Export (US-KJ-010 AK 4): gefilterte Zeitreihe als maschinenlesbarer Download
 * (Semikolon, UTF-8 BOM, Dezimal-Komma) — nur die aktive Filteransicht.
 * Open-Data-Lizenzhinweis im CSV-Metakopf (Demo vorläufig, siehe kitaCsvLizenz).
 *
 * Meldebasis (US-KJ-004 → 010): Der mit dem Meldeeingang übereinstimmende Berichtsmonat
 * (Demo: Oktober 2024) erhält bei unvollständiger Stichprobe eine Datenlücken-Markierung.
 * Session-sensitiv; nach Freigabe in /kita/meldung entfällt die Markierung.
 * Bei Raumfilter: Meldebasis nur für den gewählten Planungsraum.
 * Hinweis only — keine Interpolation, keine Umbewertung der Zeitreihenwerte.
 * Nur Aggregate, keine Kind- oder Personennamen.
 */

import { useMemo, useState } from 'react';
import type { MonatsKennzahl, PlanungsraumKennzahlen } from '@/types/kita';
import { demoKitaMeldeeingang } from '@/data/mockKitaMeldeeingang';
import {
  MeldebasisBadge,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';
import {
  KITA_CSV_LIZENZ_BUTTON_TITLE,
  KITA_CSV_LIZENZ_META_LINES,
  KITA_CSV_LIZENZ_UI_HINWEIS,
} from '@/components/kita/kitaCsvLizenz';

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

const FILTER_ALL = 'ALL';

interface Props {
  zeitreihe: MonatsKennzahl[];
  /** Zeitreihe je Planungsraum (US-KJ-010 AK 2) */
  zeitreihePlanungsraeume?: Record<string, MonatsKennzahl[]>;
  /** Planungsräume für Filter-Chips */
  planungsraeume?: PlanungsraumKennzahlen[];
  /** Label des Monats mit der höchsten Warteliste */
  peakMonatLabel?: string;
}

export function KitaZeitreiheTabelle({
  zeitreihe,
  zeitreihePlanungsraeume = {},
  planungsraeume = [],
  peakMonatLabel,
}: Props) {
  const [filterId, setFilterId] = useState<string>(FILTER_ALL);
  const { basen, byRaumId, eintraege, hydrated } = useMeldeeingangFuerBedarfsplanung();
  const meldeMonatsIso = demoKitaMeldeeingang.monatsIso;
  const meldeMonatsLabel = demoKitaMeldeeingang.monatsLabel;

  const activeSeries = useMemo(() => {
    if (filterId === FILTER_ALL) return zeitreihe;
    return zeitreihePlanungsraeume[filterId] ?? zeitreihe;
  }, [filterId, zeitreihe, zeitreihePlanungsraeume]);

  const selectedRaum = useMemo(
    () => (filterId === FILTER_ALL ? undefined : planungsraeume.find(p => p.id === filterId)),
    [filterId, planungsraeume]
  );

  const maxAuslastung = Math.max(...activeSeries.map(m => m.auslastungsgradProzent), 1);
  const maxWarteliste = Math.max(...activeSeries.map(m => m.wartelisteBestand), 0);
  const peak = activeSeries.find(m => m.wartelisteBestand === maxWarteliste);

  /** Meldebasis-Kontext: Gesamt-Stichprobe oder einzelner Raum */
  const raumBasis: PlanungsraumMeldebasis | undefined =
    filterId === FILTER_ALL ? undefined : byRaumId.get(filterId);

  const lueckenBasen =
    filterId === FILTER_ALL
      ? basen.filter(b => b.hatDatenluecke)
      : raumBasis?.hatDatenluecke
        ? [raumBasis]
        : [];

  const freigegebenCount =
    filterId === FILTER_ALL
      ? eintraege.filter(e => e.status === 'FREIGEGEBEN').length
      : raumBasis
        ? raumBasis.freigegeben
        : 0;
  const erwartetCount =
    filterId === FILTER_ALL
      ? eintraege.length
      : raumBasis
        ? raumBasis.erwartet
        : 0;

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

  const hasRaumFilter = planungsraeume.length > 0;
  const filterLabel =
    filterId === FILTER_ALL
      ? 'Gesamtkommune'
      : selectedRaum
        ? `${selectedRaum.bezeichnung} (${selectedRaum.id})`
        : filterId;

  /** CSV-Export der aktiven (gefilterten) Zeitreihe — US-KJ-010 AK 4 */
  function handleCsvDownload() {
    const de = (n: number) => n.toFixed(1).replace('.', ',');
    const header = [
      'Monat',
      'Monat_ISO',
      'Region',
      'Region_ID',
      'Belegte_Plaetze',
      'Freie_Plaetze',
      'Genehmigte_Plaetze',
      'Real_nutzbare_Plaetze',
      'Auslastung_Prozent',
      'Warteliste_Bestand',
      'Warteliste_Delta_Vormonat',
      'Personal_Ausfallquote_Prozent',
      'Meldebasis',
      'Ist_Peak',
      'Ist_Aktuell',
    ].join(';');

    const regionId = filterId === FILTER_ALL ? 'GESAMT' : filterId;
    const regionName =
      filterId === FILTER_ALL
        ? 'Gesamtkommune'
        : selectedRaum?.bezeichnung ?? filterId;

    const rows = activeSeries.map((m, i) => {
      const isPeak = m.wartelisteBestand === maxWarteliste && maxWarteliste > 0;
      const isLatest = i === activeSeries.length - 1;
      const isMeldeMonat = m.monat === meldeMonatsIso;
      let meldebasis = '–';
      if (isMeldeMonat && hydrated) {
        if (filterId === FILTER_ALL) {
          meldebasis = hatGesamtLuecke
            ? `Luecke (${freigegebenCount}/${erwartetCount})`
            : `vollstaendig (${freigegebenCount}/${erwartetCount})`;
        } else if (raumBasis) {
          meldebasis = raumBasis.hatDatenluecke
            ? `Luecke (${raumBasis.freigegeben}/${raumBasis.erwartet})`
            : `vollstaendig (${raumBasis.freigegeben}/${raumBasis.erwartet})`;
        } else {
          meldebasis = 'keine_Stichprobe';
        }
      } else if (isMeldeMonat && !hydrated) {
        meldebasis = '…';
      }

      return [
        m.monatLabel,
        m.monat,
        regionName,
        regionId,
        m.belegtePlaetze,
        m.freiePlaetze,
        m.genehmmigtePlaetze,
        m.realNutzbarePlaetze,
        de(m.auslastungsgradProzent),
        m.wartelisteBestand,
        m.wartelisteDeltaVormonat === null ? '' : m.wartelisteDeltaVormonat,
        de(m.personalAusfallquoteProzent),
        meldebasis,
        isPeak ? 'ja' : 'nein',
        isLatest ? 'ja' : 'nein',
      ].join(';');
    });

    const meta = [
      '# Open State – Kita Zeitreihe (US-KJ-010 AK 4)',
      `# Filter: ${filterLabel}`,
      `# Region_ID: ${regionId}`,
      `# Monate: ${activeSeries.length}`,
      `# Meldebasis-Stichprobe (Demo): ${meldeMonatsLabel} (${meldeMonatsIso})`,
      hydrated
        ? `# Meldebasis freigegeben: ${freigegebenCount}/${erwartetCount}${hatGesamtLuecke ? ' · Meldeluecke' : ' · ohne Luecke'}`
        : '# Meldebasis: Session noch nicht geladen',
      '# Hinweis: Raumreihen sind Demo-Verteilungen der kommunalen Monatsreihe nach Strukturanteilen.',
      '# Keine Kind- oder Personennamen. Keine Interpolation. Keine Trendbewertung.',
      ...KITA_CSV_LIZENZ_META_LINES,
      '# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM',
      '',
    ];

    const csv = [...meta, header, ...rows].join('\n');
    const slug =
      filterId === FILTER_ALL
        ? 'gesamtkommune'
        : (selectedRaum?.id ?? filterId).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kita-zeitreihe-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const chipBase: React.CSSProperties = {
    fontSize: '0.8rem',
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface, #fff)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontWeight: 500,
  };
  const chipActive: React.CSSProperties = {
    ...chipBase,
    borderColor: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: 700,
  };

  return (
    <div>
      {/* Regionenfilter US-KJ-010 AK 2 */}
      {hasRaumFilter && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Regionenfilter (US-KJ-010 AK&nbsp;2)
          </div>
          <div
            role="group"
            aria-label="Zeitreihe nach Planungsraum filtern"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            <button
              type="button"
              onClick={() => setFilterId(FILTER_ALL)}
              style={filterId === FILTER_ALL ? chipActive : chipBase}
              aria-pressed={filterId === FILTER_ALL}
            >
              Gesamtkommune
            </button>
            {planungsraeume.map(pr => {
              const basis = byRaumId.get(pr.id);
              const showLuecke = hydrated && basis?.hatDatenluecke;
              return (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => setFilterId(pr.id)}
                  style={{
                    ...(filterId === pr.id ? chipActive : chipBase),
                    borderColor:
                      showLuecke && filterId !== pr.id
                        ? basis?.schwere === 'UEBERFAELLIG'
                          ? 'var(--color-danger)'
                          : 'var(--color-warning)'
                        : filterId === pr.id
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                  }}
                  aria-pressed={filterId === pr.id}
                  title={
                    showLuecke
                      ? `Meldelücke in ${pr.bezeichnung}`
                      : `Zeitreihe ${pr.bezeichnung}`
                  }
                >
                  {pr.bezeichnung}
                  {showLuecke && (
                    <span
                      style={{
                        marginLeft: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color:
                          basis?.schwere === 'UEBERFAELLIG'
                            ? 'var(--color-danger)'
                            : 'var(--color-warning)',
                      }}
                    >
                      · Lücke
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {filterId !== FILTER_ALL && (
            <p
              style={{
                margin: '0.6rem 0 0',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.45,
              }}
            >
              Gefilterte Ansicht: <strong>{filterLabel}</strong>. Demo-Näherung: Verteilung der
              kommunalen Monatsreihe nach Strukturanteilen am aktuellen Berichtsstand — keine
              Einrichtungsindividualdaten, keine Trendbewertung.
            </p>
          )}
        </div>
      )}

      {/* Trend-Hinweis + CSV-Export (AK 4) */}
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--color-primary-light)',
        borderRadius: 'var(--radius)',
        fontSize: '0.875rem',
        borderLeft: '3px solid var(--color-primary)',
        color: 'var(--color-text)',
        lineHeight: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
          Die Tabelle zeigt die letzten 12 Monate
          {filterId !== FILTER_ALL ? (
            <> für <strong>{filterLabel}</strong></>
          ) : (
            <> (Gesamtkommune)</>
          )}
          . Wartelistendelta (▲/▼) gibt die Veränderung gegenüber dem Vormonat an.
          {peak && (
            <> Der <strong>höchste Wartelistenbestand</strong> lag im <strong>{peak.monatLabel}</strong>
            {peakMonatLabel && filterId === FILTER_ALL ? ` (${peakMonatLabel})` : ''} mit {peak.wartelisteBestand.toLocaleString('de-DE')} Anfragen
            {filterId === FILTER_ALL ? ' — typisch für den Frühjahrs-Anmeldezeitraum' : ''}.</>
          )}
          {' '}Der Berichtsmonat <strong>{meldeMonatsLabel}</strong> ist methodisch an die Meldebasis
          (Demo-Stichprobe Meldeeingang, US-KJ-004) gekoppelt
          {filterId !== FILTER_ALL ? ' für diesen Planungsraum' : ''}: fehlende freigegebene
          Einrichtungsmeldungen werden am Monatszeile markiert — ohne die Kennzahlen zu verändern
          oder zu interpolieren.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', flex: '0 1 auto' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCsvDownload}
            style={{ fontSize: '0.8rem', flexShrink: 0, whiteSpace: 'nowrap' }}
            title={`CSV der aktuellen Ansicht: ${filterLabel}. ${KITA_CSV_LIZENZ_BUTTON_TITLE}`}
            aria-label={`Zeitreihe als CSV herunterladen (${filterLabel}; Lizenzhinweis im Metakopf)`}
          >
            CSV herunterladen ({filterId === FILTER_ALL ? 'Gesamtkommune' : selectedRaum?.bezeichnung ?? 'Filter'})
          </button>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.4, maxWidth: '22rem', textAlign: 'right' }}>
            {KITA_CSV_LIZENZ_UI_HINWEIS}
          </p>
        </div>
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
            <strong style={{ fontSize: '0.8rem' }}>
              Meldebasis {meldeMonatsLabel}
              {filterId !== FILTER_ALL && selectedRaum
                ? ` · ${selectedRaum.bezeichnung}`
                : ''}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {filterId === FILTER_ALL
                ? `Demo-Stichprobe: ${freigegebenCount}/${erwartetCount} freigegeben`
                : raumBasis
                  ? `Einrichtungen im Raum: ${freigegebenCount}/${erwartetCount} freigegeben`
                  : 'Keine Stichprobe für diesen Raum'}
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
                · {filterId === FILTER_ALL
                  ? 'Stichprobe vollständig (ggf. nach Freigabe in /kita/meldung)'
                  : 'Raum-Stichprobe ohne Lücke (ggf. nach Freigabe)'}
              </span>
            )}
          </div>
          {hatGesamtLuecke && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Unvollständige Meldebasis in: {lueckenKurz}. Die Zeitreihenwerte bleiben unverändert
              (Lagebild-Stand); die Markierung ist ein methodischer Hinweis auf mögliche
              Untererfassung freier Plätze / Warteliste
              {filterId !== FILTER_ALL ? ' in diesem Planungsraum' : ' in betroffenen Planungsräumen'}{' '}
              — keine Umbewertung des Trends.
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
            {activeSeries.map((m, i) => {
              const isPeak = m.wartelisteBestand === maxWarteliste && maxWarteliste > 0;
              const isLatest = i === activeSeries.length - 1;
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
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: m.freiePlaetze < 50 && filterId === FILTER_ALL ? 'var(--color-danger)' : m.freiePlaetze < 5 && filterId !== FILTER_ALL ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: (m.freiePlaetze < 50 && filterId === FILTER_ALL) || (m.freiePlaetze < 5 && filterId !== FILTER_ALL) ? 700 : 400 }}>
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
                        filterId !== FILTER_ALL ? (
                          raumBasis ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <MeldebasisBadge basis={raumBasis} />
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>–</span>
                          )
                        ) : showMeldeLuecke ? (
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
        Methodik (US-KJ-010 AK&nbsp;2 / AK&nbsp;4 / AK&nbsp;6): Regionenfilter grenzt die Zeitreihe auf die
        Gesamtkommune oder einen Planungsraum ein. Der CSV-Export (AK&nbsp;4) enthält genau die
        aktuell gefilterte Zeitreihentabelle inkl. Meldebasis-Hinweis und Regionsspalten — kein
        separater Gesamtexport aller Räume. Raumreihen sind Demo-Verteilungen der kommunalen
        Reihe nach Strukturanteilen — keine unabhängige Einrichtungsaggregation. Datenlücken im
        Zeitverlauf sind am Meldemonat sichtbar markiert
        {filterId !== FILTER_ALL ? ' (raumbezogen)' : ''}. Historische Monate ohne
        Stichproben-Meldeeingang zeigen „–“ in der Spalte Meldebasis. Keine Schätzwerte, keine
        Trendkorrektur. Nur Aggregate; Freigabe-Demo unter{' '}
        <a href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>/kita/meldung</a>.
      </p>
    </div>
  );
}
