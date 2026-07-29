'use client';

/**
 * Export-Karte Druck + CSV für das Steuerungslagebild (US-KJ-005/006).
 *
 * Druck: Filter-Chips no-print; aktiver Meldelücke-Filter → print-only-Hinweis
 * (Spiegel Vorlage US-KJ-008).
 * CSV: freigabeunabhängig Aggregate mit Status (Lagebild-Freigabe), Meldebasis-Session
 * und optionalem Export-Filter „Meldelücke“ (Spiegel Engpass/Vorlage). DEC-004.
 * Keine Kind- oder Personennamen.
 */

import { useMemo, useState } from 'react';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import {
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

/** Export-Filter: alle Planungsräume vs. nur Räume mit Meldelücke. */
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
 * CSV Aggregate-Export Steuerungslagebild (US-KJ-005).
 * Metakopf: Status (Lagebild freigegeben), Meldebasis-Session, optional Meldelücke-Filter.
 * Blätter: Versorgung, Engpass-Rangliste, Handlungsfelder, Maßnahmen, Meldebasis-Stichprobe.
 * Nur Aggregate, keine Kind- oder Personennamen (DEC-004).
 */
function downloadCsv(args: {
  exportFilter: MeldeExportFilter;
  byRaumId: Map<string, PlanungsraumMeldebasis>;
  basen: PlanungsraumMeldebasis[];
  meldeMonatsLabel: string;
  sessionFreigabeId: string | null;
  hydrated: boolean;
}) {
  const {
    exportFilter,
    byRaumId,
    basen,
    meldeMonatsLabel,
    sessionFreigabeId,
    hydrated,
  } = args;

  const lb = demoKitaLagebild;
  const g = lb.gesamt;

  const sorted = [...lb.planungsraeume].sort(
    (a, b) => b.wartelisteDruckFaktor - a.wartelisteDruckFaktor
  );
  const handlungsfelder = sorted.filter(pr => pr.wartelisteDruckFaktor > 5);

  const meldeLuecken = basen.filter(b => b.hatDatenluecke);
  const meldeVoll = basen.filter(b => !b.hatDatenluecke).length;
  const meldeStichprobe = basen.length;
  const meldelueckeCount = meldeLuecken.length;

  const raumExport =
    exportFilter === 'MELDELUECKE'
      ? sorted.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke)
      : sorted;
  const handlungsExport =
    exportFilter === 'MELDELUECKE'
      ? handlungsfelder.filter(pr => byRaumId.get(pr.id)?.hatDatenluecke)
      : handlungsfelder;

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

  const statusMeta = `Lagebild-Status: freigegeben · Version ${lb.version} · freigegeben am ${lb.freigegebenAm} durch ${csvSafe(lb.freigegebenVon)} (Rolle, kein Personenname)`;

  const meta = [
    `# Steuerungslagebild Kindertagesbetreuung ${csvSafe(lb.kommuneBezeichnung)}`,
    `# Datenstand: ${lb.stand} | Berichtszeitraum: ${csvSafe(lb.berichtszeitraum)} | Version: ${lb.version}`,
    `# ${statusMeta}`,
    `# ${csvSafe(meldebasisMeta)}`,
    `# ${csvSafe(sessionMeta)}`,
    `# ${csvSafe(filterMeta)}`,
    `# Versorgung Gesamt: genehmigt ${g.genehmmigtePlaetze} · real nutzbar ${g.realNutzbarePlaetze} · belegt ${g.belegtePlaetze} · frei ${g.freiePlaetze} · Auslastung ${csvNum(g.auslastungsgradProzent, 1)} % · Warteliste ${g.wartelisteBestand} · Personalausfall ${csvNum(g.personalAusfallquoteProzent, 1)} %`,
    `# Inklusion: belegt ${g.inklusionsplaetzeBelegt}/${g.inklusionsplaetzeGenehmigt} · Versorgung U3 ${csvNum(g.versorgungsquote.u3, 1)} % · Ue3 ${csvNum(g.versorgungsquote.ue3, 1)} %`,
    `# Methodik: Wartelistendruck = Anfragen / freie Plätze · Handlungsfelder: Druckfaktor > 5 · keine Interpolation fehlender Meldungen`,
    `# Steuerungskette: Lagebild (US-KJ-005/006) → Bedarfsplanung (US-KJ-007) → Vorlage (US-KJ-008) · Meldebasis US-KJ-004`,
    `# Jugendamt-intern · Session-Stand, kein Backend · keine automatischen Handlungsempfehlungen`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen · Keine Einrichtungs-PII (DEC-004)`,
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

  const engpassHeader = [
    'Rang',
    'Planungsraum',
    'Planungsraum-ID',
    'Meldebasis',
    'Meldebasis_Schluessel',
    'Freigegeben',
    'Erwartet',
    'Druckfaktor',
    'Warteliste',
    'Freie_Plaetze_U3',
    'Freie_Plaetze_Ue3',
    'Auslastung_Prozent',
    'Versorgung_U3_Prozent',
    'Versorgung_Ue3_Prozent',
    'Personalausfall_Prozent',
    'Handlungsfeld',
    'Filter',
  ].join(';');

  const engpassRows = raumExport.map(pr => {
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
      csvNum(pr.wartelisteDruckFaktor, 1),
      pr.wartelisteBestand,
      pr.freiePlaetzeU3,
      pr.freiePlaetzeUe3,
      csvNum(pr.auslastungsgradProzent, 1),
      csvNum(pr.versorgungsquote.u3, 1),
      csvNum(pr.versorgungsquote.ue3, 1),
      csvNum(pr.personalAusfallquoteProzent, 1),
      pr.wartelisteDruckFaktor > 5 ? 'ja' : 'nein',
      exportFilter === 'MELDELUECKE' ? 'MELDELUECKE' : 'ALLE',
    ].join(';');
  });

  const handlungsHeader = [
    'Planungsraum',
    'Planungsraum-ID',
    'Meldebasis',
    'Meldebasis_Schluessel',
    'Druckfaktor',
    'Warteliste',
    'Massnahmen_Anzahl',
    'Massnahmen_Geplante_Plaetze',
    'Massnahmen_Kurz',
    'Filter',
  ].join(';');

  const handlungsRows = handlungsExport.map(pr => {
    const basis = byRaumId.get(pr.id);
    const massn = lb.massnahmen.filter(m => m.planungsraumId === pr.id);
    const plaetze = massn.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
    const kurz = massn
      .map(m => `${m.bezeichnung} (${m.status}, +${m.erwarteteNeuePlaetze})`)
      .join(' | ');
    return [
      csvSafe(pr.bezeichnung),
      pr.id,
      csvSafe(meldebasisLabel(basis)),
      meldeSchluessel(basis),
      csvNum(pr.wartelisteDruckFaktor, 1),
      pr.wartelisteBestand,
      massn.length,
      plaetze,
      csvSafe(kurz || '(keine Maßnahme)'),
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
  ].join(';');

  const massnRows = lb.massnahmen.map(m =>
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
    ].join(';')
  );

  const parts: string[] = [
    ...meta,
    '',
    '# Blatt 1: Versorgungslage Gesamtkommune (Aggregate, intern)',
    versorgungHeader,
    ...versorgungRows,
    '',
    `# Blatt 2: Engpass-Rangliste nach Wartelistendruck (${
      exportFilter === 'MELDELUECKE' ? 'Filter Meldelücke' : 'alle Planungsräume'
    })`,
    engpassHeader,
    ...(engpassRows.length > 0
      ? engpassRows
      : ['# (keine Planungsräume im aktuellen Export-Filter)']),
    '',
    `# Blatt 3: Handlungsfelder (Druckfaktor > 5${
      exportFilter === 'MELDELUECKE' ? ', Filter Meldelücke' : ''
    })`,
    handlungsHeader,
    ...(handlungsRows.length > 0
      ? handlungsRows
      : ['# (keine Handlungsfelder im aktuellen Export-Filter)']),
    '',
    '# Blatt 4: Kapazitätsmaßnahmen (Aggregate, Kommune)',
    massnHeader,
    ...massnRows,
  ];

  if (basen.length > 0) {
    const meldeHeader = [
      'Planungsraum',
      'Planungsraum-ID',
      'Freigegeben',
      'Erwartet',
      'Hat_Datenluecke',
      'Schwere',
      'Luecken_Einrichtungen',
    ].join(';');
    const meldeRows = basen.map(b => {
      const lueckenNamen = b.luecken
        .map(e => `${e.einrichtungBezeichnung} (${e.status})`)
        .join(' | ');
      return [
        csvSafe(b.planungsraumBezeichnung),
        b.planungsraumId,
        b.freigegeben,
        b.erwartet,
        b.hatDatenluecke ? 'ja' : 'nein',
        b.schwere,
        csvSafe(lueckenNamen),
      ].join(';');
    });
    parts.push(
      '',
      '# Blatt 5: Meldebasis je Planungsraum (Demo-Stichprobe Meldeeingang, Session-sensitiv)',
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
  a.download = `steuerungslagebild-${kommuneSlug || 'kommune'}-${lb.version}-${lb.stand}${filterSuffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function KitaLagebildDruck() {
  const { base, session, hydrated, basen, byRaumId } = useMeldeeingangFuerBedarfsplanung();
  const [exportFilter, setExportFilter] = useState<MeldeExportFilter>('ALL');

  const meldelueckeCount = useMemo(
    () => basen.filter(b => b.hatDatenluecke).length,
    [basen]
  );

  const meldeMonatsLabel = base.monatsLabel || 'Demo-Stichprobe';

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
        <div style={{ maxWidth: '40rem', flex: '1 1 16rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Export</div>
          <strong style={{ fontSize: '0.95rem' }}>Druck und CSV Steuerungslagebild</strong>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.25rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Druck: Filter-Chips werden nicht gedruckt; aktiver Meldelücke-Filter in Engpass,
            Handlungsfeldern oder Detail erscheint als print-only-Hinweis. CSV: Aggregate mit
            Lagebild-Status, Meldebasis-Session und optionalem Export-Filter „Meldelücke“
            (Semikolon, UTF-8 BOM). Nur Aggregate, keine Kind- oder Personennamen (DEC-004).
          </p>
          <div
            style={{
              marginTop: '0.65rem',
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
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
            style={{ fontSize: '0.875rem' }}
          >
            Drucken / als PDF speichern
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.875rem' }}
            onClick={() =>
              downloadCsv({
                exportFilter,
                byRaumId,
                basen,
                meldeMonatsLabel,
                sessionFreigabeId: session?.freigabeId ?? null,
                hydrated,
              })
            }
            aria-label="Steuerungslagebild-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
          >
            CSV exportieren
          </button>
        </div>
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
