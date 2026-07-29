'use client';

/**
 * Öffentlicher CSV-Export für den Transparenzbericht (US-KJ-009 AK 6).
 *
 * Multi-Blatt Aggregate: Versorgung Gesamt, Planungsräume (Meldebasis session-sensitiv),
 * Kapazitätsmaßnahmen. Status/Freigabe im Metakopf, Open-Data-Lizenzhinweis, DEC-004.
 * Keine Kind- oder Personennamen, keine Einrichtungs-PII in der öffentlichen Schicht.
 */

import { useMemo, useState } from 'react';
import type { KitaLagebild } from '@/types/kita';
import {
  KITA_CSV_LIZENZ_BUTTON_TITLE,
  KITA_CSV_LIZENZ_META_LINES,
  KITA_CSV_LIZENZ_UI_HINWEIS,
} from '@/components/kita/kitaCsvLizenz';
import {
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

/** Export-Filter: alle Planungsräume vs. nur Räume mit Meldelücke (Spiegel Explorer). */
type MeldeExportFilter = 'ALL' | 'MELDELUECKE';

function csvNum(n: number, decimals = 0): string {
  return n.toFixed(decimals).replace('.', ',');
}

function csvSafe(s: string): string {
  return s.replace(/;/g, ',').replace(/\r?\n/g, ' ');
}

function meldebasisLabel(basis: PlanungsraumMeldebasis | undefined): string {
  if (!basis) return 'k. A. (keine Stichprobe)';
  if (!basis.hatDatenluecke) return 'vollständig';
  const schwere =
    basis.schwere === 'UEBERFAELLIG'
      ? 'überfällig'
      : basis.schwere === 'AUSSTEHEND'
        ? 'ausstehend'
        : basis.schwere;
  return `Lücke ${basis.freigegeben}/${basis.erwartet} (${schwere})`;
}

function meldeSchluessel(basis: PlanungsraumMeldebasis | undefined): string {
  if (!basis) return 'KEINE_STICHPROBE';
  if (!basis.hatDatenluecke) return 'OK';
  return basis.schwere;
}

/**
 * CSV Aggregate-Export öffentlicher Transparenzbericht (US-KJ-009 AK 6).
 * Metakopf: Freigabe-Status, Meldebasis-Session, optional Meldelücke-Filter, Open-Data-Lizenz.
 * Blätter: Versorgung, Planungsräume, Maßnahmen. Nur Aggregate (DEC-004).
 */
function downloadCsv(args: {
  lagebild: KitaLagebild;
  exportFilter: MeldeExportFilter;
  byRaumId: Map<string, PlanungsraumMeldebasis>;
  basen: PlanungsraumMeldebasis[];
  meldeMonatsLabel: string;
  sessionFreigabeId: string | null;
  hydrated: boolean;
}) {
  const {
    lagebild: lb,
    exportFilter,
    byRaumId,
    basen,
    meldeMonatsLabel,
    sessionFreigabeId,
    hydrated,
  } = args;

  const g = lb.gesamt;

  const sorted = [...lb.planungsraeume].sort(
    (a, b) => b.wartelisteDruckFaktor - a.wartelisteDruckFaktor
  );

  const meldeLuecken = basen.filter(b => b.hatDatenluecke);
  const meldeVoll = basen.filter(b => !b.hatDatenluecke).length;
  const meldeStichprobe = basen.length;
  const meldelueckeCount = meldeLuecken.length;

  const raumExport =
    exportFilter === 'MELDELUECKE'
      ? sorted.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke)
      : sorted;

  const massnExport =
    exportFilter === 'MELDELUECKE'
      ? lb.massnahmen.filter(m => byRaumId.get(m.planungsraumId)?.hatDatenluecke)
      : lb.massnahmen;

  const meldebasisMeta = !hydrated
    ? 'Meldebasis: Session noch nicht geladen (clientseitig)'
    : meldeLuecken.length === 0
      ? `Meldebasis Stichprobe ${meldeMonatsLabel}: vollständig freigegeben (${meldeVoll}/${meldeStichprobe} Planungsräume mit Einträgen)`
      : `Meldebasis Stichprobe ${meldeMonatsLabel}: Lücken in ${meldeLuecken
          .map(b => {
            const schwere =
              b.schwere === 'UEBERFAELLIG'
                ? 'überfällig'
                : b.schwere === 'AUSSTEHEND'
                  ? 'ausstehend'
                  : b.schwere;
            return `${b.planungsraumBezeichnung} (${b.freigegeben}/${b.erwartet}, ${schwere})`;
          })
          .join('; ')}`;

  const sessionMeta = sessionFreigabeId
    ? `Session-Meldefreigabe: ${sessionFreigabeId} (aus /kita/meldung, Demo)`
    : 'Session-Meldefreigabe: keine (Demo-Ausgangsstand Meldeeingang)';

  const filterMeta =
    exportFilter === 'MELDELUECKE'
      ? `Export-Filter: Meldelücke aktiv (${raumExport.length} von ${meldelueckeCount} Räumen mit Lücke, sortiert nach Wartelistendruck)`
      : `Export-Filter: alle Planungsräume nach Wartelistendruck (Meldelücken in Stichprobe: ${meldelueckeCount})`;

  const statusMeta = `Bericht-Status: freigegeben · Version ${lb.version} · freigegeben am ${lb.freigegebenAm} durch ${csvSafe(lb.freigegebenVon)} (Rolle, kein Personenname)`;

  const meta = [
    `# Open State – Transparenzbericht Kindertagesbetreuung ${csvSafe(lb.kommuneBezeichnung)}`,
    `# Datenstand: ${lb.stand} | Berichtszeitraum: ${csvSafe(lb.berichtszeitraum)} | Version: ${lb.version}`,
    `# ${statusMeta}`,
    `# ${csvSafe(meldebasisMeta)}`,
    `# ${csvSafe(sessionMeta)}`,
    `# ${csvSafe(filterMeta)}`,
    `# Versorgung Gesamt: genehmigt ${g.genehmmigtePlaetze} · real nutzbar ${g.realNutzbarePlaetze} · belegt ${g.belegtePlaetze} · frei ${g.freiePlaetze} · Auslastung ${csvNum(g.auslastungsgradProzent, 1)} % · Warteliste ${g.wartelisteBestand} · Personalausfall ${csvNum(g.personalAusfallquoteProzent, 1)} %`,
    `# Inklusion: belegt ${g.inklusionsplaetzeBelegt}/${g.inklusionsplaetzeGenehmigt} · Versorgung U3 ${csvNum(g.versorgungsquote.u3, 1)} % · Ue3 ${csvNum(g.versorgungsquote.ue3, 1)} %`,
    `# Methodik: Wartelistendruck = Anfragen / freie Plätze · Meldelücken Hinweis only, keine Interpolation · öffentliche Schicht freigegebene Aggregate`,
    `# Story: US-KJ-009 AK 6 (CSV-Rohdaten) · Meldebasis-Hinweis analog Explorer/Zeitreihe (US-KJ-010)`,
    `# Öffentlich · freigegebene Aggregation · keine automatischen Handlungsempfehlungen`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen · Keine Einrichtungs-PII (DEC-004)`,
    ...KITA_CSV_LIZENZ_META_LINES,
    `# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM`,
  ];

  const versorgungHeader = ['Kennzahl', 'Wert', 'Einheit'].join(';');
  const versorgungRows = [
    ['Genehmigte Plätze', g.genehmmigtePlaetze, 'Plätze'],
    ['Real nutzbare Plätze', g.realNutzbarePlaetze, 'Plätze'],
    ['Belegt', g.belegtePlaetze, 'Plätze'],
    ['Frei', g.freiePlaetze, 'Plätze'],
    ['Auslastung', csvNum(g.auslastungsgradProzent, 1), 'Prozent'],
    ['Warteliste', g.wartelisteBestand, 'Plätze'],
    ['Personalausfall', csvNum(g.personalAusfallquoteProzent, 1), 'Prozent'],
    ['Versorgung U3', csvNum(g.versorgungsquote.u3, 1), 'Prozent'],
    ['Versorgung Ue3', csvNum(g.versorgungsquote.ue3, 1), 'Prozent'],
    ['Inklusion belegt', g.inklusionsplaetzeBelegt, 'Plätze'],
    ['Inklusion genehmigt', g.inklusionsplaetzeGenehmigt, 'Plätze'],
  ].map(r => r.join(';'));

  const raumHeader = [
    'Rang',
    'Planungsraum',
    'Planungsraum-ID',
    'Meldebasis',
    'Meldebasis_Schluessel',
    'Freigegeben',
    'Erwartet',
    'Genehmigte_Plaetze_U3',
    'Genehmigte_Plaetze_Ue3',
    'Belegte_Plaetze_U3',
    'Belegte_Plaetze_Ue3',
    'Freie_Plaetze_U3',
    'Freie_Plaetze_Ue3',
    'Auslastung_Prozent',
    'Versorgung_U3_Prozent',
    'Versorgung_Ue3_Prozent',
    'Warteliste',
    'Druckfaktor',
    'Personalausfall_Prozent',
    'Filter',
  ].join(';');

  const raumRows = raumExport.map(pr => {
    const basis = byRaumId.get(pr.id);
    const rank = sorted.findIndex(s => s.id === pr.id) + 1;
    return [
      rank,
      csvSafe(pr.bezeichnung),
      pr.id,
      csvSafe(meldebasisLabel(basis)),
      meldeSchluessel(basis),
      basis?.freigegeben ?? '',
      basis?.erwartet ?? '',
      pr.genehmmigtePlaetzeU3,
      pr.genehmmigtePlaetzeUe3,
      pr.belegtePlaetzeU3,
      pr.belegtePlaetzeUe3,
      pr.freiePlaetzeU3,
      pr.freiePlaetzeUe3,
      csvNum(pr.auslastungsgradProzent, 1),
      csvNum(pr.versorgungsquote.u3, 1),
      csvNum(pr.versorgungsquote.ue3, 1),
      pr.wartelisteBestand,
      csvNum(pr.wartelisteDruckFaktor, 1),
      csvNum(pr.personalAusfallquoteProzent, 1),
      exportFilter === 'MELDELUECKE' ? 'MELDELUECKE' : 'ALLE',
    ].join(';');
  });

  const massnHeader = [
    'Massnahme-ID',
    'Bezeichnung',
    'Planungsraum',
    'Planungsraum-ID',
    'Typ',
    'Status',
    'Erwartete_neue_Plaetze',
    'Geplante_Fertigstellung',
    'Rechtsgrundlage',
    'Filter',
  ].join(';');

  const massnRows = massnExport.map(m =>
    [
      m.id,
      csvSafe(m.bezeichnung),
      csvSafe(m.planungsraumBezeichnung),
      m.planungsraumId,
      m.typ,
      m.status,
      m.erwarteteNeuePlaetze,
      m.geplanteFertigstellung,
      csvSafe(m.rechtsgrundlage),
      exportFilter === 'MELDELUECKE' ? 'MELDELUECKE' : 'ALLE',
    ].join(';')
  );

  const parts: string[] = [
    ...meta,
    '',
    '# Blatt 1: Versorgungslage Gesamtkommune (öffentliche freigegebene Aggregate)',
    versorgungHeader,
    ...versorgungRows,
    '',
    `# Blatt 2: Planungsräume nach Wartelistendruck (${
      exportFilter === 'MELDELUECKE' ? 'Filter Meldelücke' : 'alle Planungsräume'
    })`,
    raumHeader,
    ...(raumRows.length > 0
      ? raumRows
      : ['# (keine Planungsräume im aktuellen Export-Filter)']),
    '',
    `# Blatt 3: Kapazitätsmaßnahmen (Aggregate, Kommune${
      exportFilter === 'MELDELUECKE' ? ', Filter Meldelücke' : ''
    })`,
    massnHeader,
    ...(massnRows.length > 0
      ? massnRows
      : ['# (keine Maßnahmen im aktuellen Export-Filter)']),
  ];

  // Öffentliche Schicht: Meldebasis nur raumaggregiert (freigegeben/erwartet/schwere),
  // keine Einrichtungsnamen (DEC-004).
  if (basen.length > 0) {
    const meldeHeader = [
      'Planungsraum',
      'Planungsraum-ID',
      'Freigegeben',
      'Erwartet',
      'Hat_Datenluecke',
      'Schwere',
    ].join(';');
    const meldeRows = basen.map(b =>
      [
        csvSafe(b.planungsraumBezeichnung),
        b.planungsraumId,
        b.freigegeben,
        b.erwartet,
        b.hatDatenluecke ? 'ja' : 'nein',
        b.schwere,
      ].join(';')
    );
    parts.push(
      '',
      '# Blatt 4: Meldebasis je Planungsraum (Demo-Stichprobe, Session-sensitiv, raumaggregiert)',
      meldeHeader,
      ...meldeRows
    );
  }

  const csv = parts.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filterSuffix = exportFilter === 'MELDELUECKE' ? '-meldeluecke' : '';
  const kommuneSlug = lb.kommuneBezeichnung
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, '-')
    .replace(/^-|-$/g, '');
  a.download = `kita-transparenzbericht-${kommuneSlug || 'kommune'}-${lb.version}-${lb.stand}${filterSuffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function KitaCsvDownload({ lagebild }: { lagebild: KitaLagebild }) {
  const { base, session, hydrated, basen, byRaumId } = useMeldeeingangFuerBedarfsplanung();
  const [exportFilter, setExportFilter] = useState<MeldeExportFilter>('ALL');

  const meldelueckeCount = useMemo(
    () => basen.filter(b => b.hatDatenluecke).length,
    [basen]
  );

  const meldeMonatsLabel = base.monatsLabel || 'Demo-Stichprobe';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
        }}
        role="group"
        aria-label="CSV-Export-Filter Meldelücke"
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          CSV-Filter:
        </span>
        <button
          type="button"
          className={exportFilter === 'ALL' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          onClick={() => setExportFilter('ALL')}
          aria-pressed={exportFilter === 'ALL'}
        >
          Alle Räume
        </button>
        <button
          type="button"
          className={exportFilter === 'MELDELUECKE' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          onClick={() => setExportFilter('MELDELUECKE')}
          aria-pressed={exportFilter === 'MELDELUECKE'}
          disabled={hydrated && meldelueckeCount === 0}
          title={
            hydrated && meldelueckeCount === 0
              ? 'Keine Meldelücken in der aktuellen Demo-Stichprobe'
              : `${meldelueckeCount} Planungsräume mit Meldelücke`
          }
        >
          Meldelücke
          {hydrated ? ` (${meldelueckeCount})` : ''}
        </button>
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() =>
          downloadCsv({
            lagebild,
            exportFilter,
            byRaumId,
            basen,
            meldeMonatsLabel,
            sessionFreigabeId: session?.freigabeId ?? null,
            hydrated,
          })
        }
        style={{ fontSize: '0.875rem' }}
        title={`${KITA_CSV_LIZENZ_BUTTON_TITLE}. Multi-Blatt: Versorgung, Planungsräume, Maßnahmen, Meldebasis.`}
        aria-label="Transparenzbericht-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
      >
        CSV herunterladen (Planungsraumdaten)
      </button>
      <p
        style={{
          margin: 0,
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.4,
          maxWidth: '28rem',
        }}
      >
        CSV (US-KJ-009 AK&nbsp;6): freigegebene Aggregate mit Status, Meldebasis-Session und
        optionalem Filter „Meldelücke“. Blätter Versorgung, Planungsräume, Maßnahmen, Meldebasis
        (raumaggregiert). {KITA_CSV_LIZENZ_UI_HINWEIS}
      </p>
    </div>
  );
}
