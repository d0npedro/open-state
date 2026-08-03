'use client';

/**
 * US-KJ-008 – Politische Vorlage vorbereiten und freigeben (Demo)
 *
 * Entwurf aus Steuerungslagebild + Bedarfsplanung-Kennzahlen.
 * Residuale Planungslücke methodisch an Meldelücken aus dem Meldeeingang gekoppelt
 * (Hinweis only, wie Bedarfsplanung / Transparenzbericht).
 * Engpass-Liste: Schnellfilter „Meldelücke“ (Session-sensitiv, wie Planungsraum-Explorer).
 * Freigabe nur aktiv durch JA-Leitung (simuliert). Keine automatischen Beschlüsse.
 * Export: Druck und CSV freigabeunabhängig (Browser-Druck → PDF; CSV Aggregate mit
 * Status/Meldebasis-Metakopf, Spiegel Bedarfsplanung US-KJ-007). Bei aktivem Meldelücke-Filter
 * print-only-Hinweis und CSV-Metakopf (Spiegel Lagebild US-KJ-005/006). Status im Export.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import {
  MeldebasisBadge,
  ResidualMeldeHinweis,
  ResidualMeldeSummenHinweis,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

type VorlageStatus = 'ENTWURF' | 'ZUR_FREIGABE' | 'FREIGEGEBEN' | 'ZURUECKGEGEBEN';

/** Schnellfilter für Engpass-Liste (Spiegel zu Planungsraum-Explorer US-KJ-009). */
type EngpassSchnellfilter = 'ALL' | 'MELDELUECKE';

type VorlageRaumZeile = {
  id: string;
  name: string;
  vqU3: number;
  vqUe3: number;
  warteliste: number;
  druck: number;
  geplant: number;
  residual: number;
};

const VORLAGE_ID = 'JHA-2025-KITA-01';
const GREMIUM = 'Jugendhilfeausschuss Musterstadt';
const SITZUNG = 'Geplante Sitzung: 18. März 2025 (Demo)';
/** Standard: Top-N nach Wartelistendruck (unverändert). */
const ENGPASS_TOP_N = 3;

function planungslueckeResidual(
  warteliste: number,
  freie: number,
  geplant: number
): number {
  return Math.max(0, warteliste - freie - geplant);
}

/** Dezimal für CSV: Komma als Trennzeichen (de-DE, Spiegel Bedarfsplanung/Monatsbericht). */
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

function statusFilenameSuffix(status: VorlageStatus): string {
  switch (status) {
    case 'ZUR_FREIGABE':
      return '-zur-freigabe';
    case 'FREIGEGEBEN':
      return '-freigegeben';
    case 'ZURUECKGEGEBEN':
      return '-zurueckgegeben';
    default:
      return '-entwurf';
  }
}

/**
 * CSV Aggregate-Export freigabeunabhängig (US-KJ-008).
 * Metakopf: Status (Entwurf / Zur Freigabe / Freigegeben / Zurückgegeben),
 * Meldebasis-Session, Engpass-Filter, Summen Residual/geplant – Spiegel Druckansicht
 * und Bedarfsplanung. Nur Aggregate, keine Kind- oder Personennamen (DEC-004).
 */
function downloadCsv(args: {
  raumZeilen: VorlageRaumZeile[];
  engpass: VorlageRaumZeile[];
  engpassFilter: EngpassSchnellfilter;
  byRaumId: Map<string, PlanungsraumMeldebasis>;
  basen: PlanungsraumMeldebasis[];
  status: VorlageStatus;
  statusLabel: string;
  titel: string;
  sachtext: string;
  summeResidual: number;
  summeGeplant: number;
  meldeMonatsLabel: string;
  sessionFreigabeId: string | null;
  hydrated: boolean;
  freigabeStamp: { am: string; rolle: string } | null;
  freigabeHinweis: string;
  meldelueckeCount: number;
}) {
  const {
    raumZeilen,
    engpass,
    engpassFilter,
    byRaumId,
    basen,
    status,
    statusLabel,
    titel,
    sachtext,
    summeResidual,
    summeGeplant,
    meldeMonatsLabel,
    sessionFreigabeId,
    hydrated,
    freigabeStamp,
    freigabeHinweis,
    meldelueckeCount,
  } = args;

  const lb = demoKitaLagebild;
  const g = lb.gesamt;
  const meldeLuecken = basen.filter(b => b.hatDatenluecke);
  const meldeVoll = basen.filter(b => !b.hatDatenluecke).length;
  const meldeStichprobe = basen.length;

  const meldebasisMeta = !hydrated
    ? 'Meldebasis: Session noch nicht geladen (clientseitig)'
    : meldeLuecken.length === 0
      ? `Meldebasis Stichprobe ${meldeMonatsLabel}: vollständig freigegeben (${meldeVoll}/${meldeStichprobe} Planungsräume mit Einträgen)`
      : `Meldebasis Stichprobe ${meldeMonatsLabel}: Lücken in ${meldeLuecken
          .map(b => {
            const residual = raumZeilen.find(z => z.id === b.planungsraumId)?.residual ?? 0;
            const schwere =
              b.schwere === 'UEBERFAELLIG'
                ? 'überfällig'
                : b.schwere === 'AUSSTEHEND'
                  ? 'ausstehend'
                  : b.schwere;
            return `${b.planungsraumBezeichnung} (${b.freigegeben}/${b.erwartet}, ${schwere}${
              residual > 0 ? `, Residual ${residual}` : ''
            })`;
          })
          .join('; ')}`;

  const sessionMeta = sessionFreigabeId
    ? `Session-Meldefreigabe: ${sessionFreigabeId} (aus /kita/meldung, Demo)`
    : 'Session-Meldefreigabe: keine (Demo-Ausgangsstand Meldeeingang)';

  const freigabeMeta =
    status === 'FREIGEGEBEN' && freigabeStamp
      ? `JA-Freigabe: ${freigabeStamp.rolle} · ${freigabeStamp.am} · Nachweis ${VORLAGE_ID}`
      : status === 'ZURUECKGEGEBEN' && freigabeHinweis.trim()
        ? `Zurückgabe-Hinweis: ${csvSafe(freigabeHinweis.trim())}`
        : 'JA-Freigabe: nicht freigegeben (Export freigabeunabhängig)';

  const engpassFilterMeta =
    engpassFilter === 'MELDELUECKE'
      ? `Engpass-Filter: Meldelücke aktiv (${engpass.length} von ${meldelueckeCount} Räumen mit Lücke, sortiert nach Wartelistendruck)`
      : `Engpass-Filter: Standard Top ${ENGPASS_TOP_N} nach Wartelistendruck (Meldelücken in Stichprobe: ${meldelueckeCount})`;

  const sachtextMeta = sachtext.trim()
    ? csvSafe(sachtext.trim().slice(0, 400)) + (sachtext.trim().length > 400 ? '…' : '')
    : '(keine Sachdarstellung)';

  const meta = [
    `# Politische Vorlage ${csvSafe(lb.kommuneBezeichnung)} · ${VORLAGE_ID}`,
    `# Titel: ${csvSafe(titel)}`,
    `# Gremium: ${csvSafe(GREMIUM)} | ${csvSafe(SITZUNG)}`,
    `# Status: ${statusLabel} (${status}) | freigabeunabhängig exportierbar`,
    `# ${csvSafe(freigabeMeta)}`,
    `# Datenstand Lagebild: ${lb.stand} | Lagebild-Version: ${lb.version} | Freigabe Lagebild: ${csvSafe(lb.freigegebenVon)}, ${lb.freigegebenAm}`,
    `# ${csvSafe(meldebasisMeta)}`,
    `# ${csvSafe(sessionMeta)}`,
    `# ${csvSafe(engpassFilterMeta)}`,
    `# Summen: geplante neue Plätze ${summeGeplant} · residuale Planungslücken ${summeResidual} · Planungsräume ${raumZeilen.length}`,
    `# Versorgung Gesamt: real nutzbar ${g.realNutzbarePlaetze} · belegt ${g.belegtePlaetze} · frei ${g.freiePlaetze} · Auslastung ${csvNum(g.auslastungsgradProzent, 1)} % · Warteliste ${g.wartelisteBestand}`,
    `# Methodik Planungslücke: max(0, Warteliste − freie Plätze − geplante neue Plätze) · keine Interpolation fehlender Meldungen`,
    `# Sachdarstellung (Auszug): ${sachtextMeta}`,
    `# Steuerungskette: Lagebild (US-KJ-005) → Bedarfsplanung (US-KJ-007) → Vorlage (US-KJ-008) · Meldebasis US-KJ-004`,
    `# Session-Stand, kein Backend · kein Gremienbeschluss · keine automatischen Handlungsempfehlungen`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen · Keine Einrichtungs-PII (DEC-004)`,
    `# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM`,
  ];

  const versorgungHeader = ['Kennzahl', 'Wert', 'Einheit'].join(';');
  const versorgungRows = [
    ['Real nutzbare Plätze', g.realNutzbarePlaetze, 'Plätze'],
    ['Belegt', g.belegtePlaetze, 'Plätze'],
    ['Frei', g.freiePlaetze, 'Plätze'],
    ['Auslastung', csvNum(g.auslastungsgradProzent, 1), 'Prozent'],
    ['Warteliste', g.wartelisteBestand, 'Plätze'],
    ['Versorgung U3', csvNum(g.versorgungsquote.u3, 1), 'Prozent'],
    ['Versorgung Ue3', csvNum(g.versorgungsquote.ue3, 1), 'Prozent'],
  ].map(r => r.join(';'));

  const raumHeader = [
    'Planungsraum',
    'Planungsraum-ID',
    'Meldebasis',
    'Meldebasis_Schluessel',
    'Freigegeben',
    'Erwartet',
    'Versorgung_U3_Prozent',
    'Versorgung_Ue3_Prozent',
    'Warteliste',
    'Druckfaktor',
    'Geplant_plus',
    'Planungsluecke_Residual',
  ].join(';');

  const raumRows = raumZeilen.map(r => {
    const basis = byRaumId.get(r.id);
    const meldeSchluessel = !basis
      ? 'KEINE_STICHPROBE'
      : basis.hatDatenluecke
        ? basis.schwere
        : 'OK';
    return [
      csvSafe(r.name),
      r.id,
      csvSafe(meldebasisLabel(basis)),
      meldeSchluessel,
      basis?.freigegeben ?? '',
      basis?.erwartet ?? '',
      csvNum(r.vqU3, 1),
      csvNum(r.vqUe3, 1),
      r.warteliste,
      csvNum(r.druck, 1),
      r.geplant,
      r.residual,
    ].join(';');
  });

  const raumSumme = [
    'SUMME (Kommune)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    raumZeilen.reduce((s, r) => s + r.warteliste, 0),
    '',
    summeGeplant,
    summeResidual,
  ].join(';');

  const engpassHeader = [
    'Rang',
    'Planungsraum',
    'Planungsraum-ID',
    'Meldebasis',
    'Meldebasis_Schluessel',
    'Druckfaktor',
    'Warteliste',
    'Geplant_plus',
    'Planungsluecke_Residual',
    'Filter',
  ].join(';');

  const engpassRows = engpass.map((r, i) => {
    const basis = byRaumId.get(r.id);
    const meldeSchluessel = !basis
      ? 'KEINE_STICHPROBE'
      : basis.hatDatenluecke
        ? basis.schwere
        : 'OK';
    return [
      i + 1,
      csvSafe(r.name),
      r.id,
      csvSafe(meldebasisLabel(basis)),
      meldeSchluessel,
      csvNum(r.druck, 1),
      r.warteliste,
      r.geplant,
      r.residual,
      engpassFilter === 'MELDELUECKE' ? 'MELDELUECKE' : `TOP_${ENGPASS_TOP_N}`,
    ].join(';');
  });

  const parts: string[] = [
    ...meta,
    '',
    '# Blatt 1: Versorgungslage Gesamtkommune (Aggregate)',
    versorgungHeader,
    ...versorgungRows,
    '',
    '# Blatt 2: Planungsräume und Planungslücke (Aggregate)',
    raumHeader,
    ...raumRows,
    raumSumme,
    '',
    `# Blatt 3: Engpass-Liste (${
      engpassFilter === 'MELDELUECKE'
        ? 'Filter Meldelücke'
        : `Top ${ENGPASS_TOP_N} Wartelistendruck`
    })`,
    engpassHeader,
    ...(engpassRows.length > 0
      ? engpassRows
      : ['# (keine Engpass-Räume im aktuellen Filter)']),
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
      '# Blatt 4: Meldebasis je Planungsraum (Demo-Stichprobe Meldeeingang, Session-sensitiv)',
      meldeHeader,
      ...meldeRows
    );
  }

  const csv = parts.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filterSuffix = engpassFilter === 'MELDELUECKE' ? '-meldeluecke' : '';
  const kommuneSlug = lb.kommuneBezeichnung
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, '-')
    .replace(/^-|-$/g, '');
  a.download = `vorlage-${VORLAGE_ID.toLowerCase()}-${kommuneSlug || 'kommune'}-${lb.stand}${statusFilenameSuffix(status)}${filterSuffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PolitischeVorlagePage() {
  const lb = demoKitaLagebild;
  const g = lb.gesamt;
  const { base: meldeBase, session, hydrated, basen, byRaumId } =
    useMeldeeingangFuerBedarfsplanung();

  const [status, setStatus] = useState<VorlageStatus>('ENTWURF');
  const [titel, setTitel] = useState(
    'Lagebericht Kindertagesbetreuung und Kapazitätsentwicklung 2025'
  );
  const [sachtext, setSachtext] = useState(
    'Das Jugendamt legt dem Ausschuss die aktuelle Versorgungslage und die aus dem Bedarfsplanungsentwurf abgeleiteten Planungslücken vor. ' +
      'Die Zahlen stammen aus dem freigegebenen Steuerungslagebild. ' +
      'Fehlende freigegebene Einrichtungsmeldungen mindern die Aussagekraft residualer Planungslücken und werden nicht interpoliert. ' +
      'Es werden keine Beschlussvorschläge automatisiert erzeugt; die politische Abwägung bleibt dem Gremium vorbehalten.'
  );
  const [freigabeHinweis, setFreigabeHinweis] = useState('');
  const [freigabeStamp, setFreigabeStamp] = useState<{ am: string; rolle: string } | null>(null);
  const [engpassFilter, setEngpassFilter] = useState<EngpassSchnellfilter>('ALL');

  const raumZeilen = useMemo(() => {
    return lb.planungsraeume.map(pr => {
      const massnahmen = lb.massnahmen.filter(m => m.planungsraumId === pr.id);
      const geplant = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
      const frei = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;
      const residual = planungslueckeResidual(pr.wartelisteBestand, frei, geplant);
      return {
        id: pr.id,
        name: pr.bezeichnung,
        vqU3: pr.versorgungsquote.u3,
        vqUe3: pr.versorgungsquote.ue3,
        warteliste: pr.wartelisteBestand,
        druck: pr.wartelisteDruckFaktor,
        geplant,
        residual,
      };
    });
  }, [lb]);

  const summeGeplant = raumZeilen.reduce((s, r) => s + r.geplant, 0);
  const summeResidual = raumZeilen.reduce((s, r) => s + r.residual, 0);

  /** Alle Räume nach Wartelistendruck (Rangfolge unverändert bei Meldelücke). */
  const engpassRanked = useMemo(
    () => [...raumZeilen].sort((a, b) => b.druck - a.druck),
    [raumZeilen]
  );

  const meldelueckeCount = useMemo(
    () => engpassRanked.filter(r => byRaumId.get(r.id)?.hatDatenluecke).length,
    [engpassRanked, byRaumId]
  );

  /** Top-N Engpass, optional nur Räume mit Meldelücke (Session-sensitiv). */
  const engpass = useMemo(() => {
    if (engpassFilter === 'MELDELUECKE') {
      return engpassRanked.filter(r => byRaumId.get(r.id)?.hatDatenluecke);
    }
    return engpassRanked.slice(0, ENGPASS_TOP_N);
  }, [engpassRanked, engpassFilter, byRaumId]);

  const suedostLuecke = byRaumId.get('PR-03')?.hatDatenluecke ?? false;
  const residualByRaumId = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of raumZeilen) m.set(r.id, r.residual);
    return m;
  }, [raumZeilen]);

  const statusLabel: Record<VorlageStatus, string> = {
    ENTWURF: 'Entwurf in Bearbeitung',
    ZUR_FREIGABE: 'Wartet auf Freigabe (JA-Leitung)',
    FREIGEGEBEN: 'Freigegeben',
    ZURUECKGEGEBEN: 'Zurückgegeben zur Überarbeitung',
  };

  const statusColor: Record<VorlageStatus, string> = {
    ENTWURF: 'var(--color-warning)',
    ZUR_FREIGABE: 'var(--color-primary)',
    FREIGEGEBEN: 'var(--color-success)',
    ZURUECKGEGEBEN: 'var(--color-danger)',
  };

  const editierbar = status === 'ENTWURF' || status === 'ZURUECKGEGEBEN';
  const freigegeben = status === 'FREIGEGEBEN';

  function freigeben() {
    const am = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFreigabeStamp({ am, rolle: 'Jugendamtsleitung (Demo-Rolle)' });
    setStatus('FREIGEGEBEN');
  }

  function zurueckgeben() {
    setFreigabeStamp(null);
    setFreigabeHinweis(
      freigabeHinweis ||
        'Bitte Methodik-Abschnitt und Engpass-Formulierungen für die öffentliche Sitzung prüfen.'
    );
    setStatus('ZURUECKGEGEBEN');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Kopf – nicht drucken: Steuerleiste */}
      <div className="no-print">
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-008</span>
          <span>Politische Vorlage · Demo: JA-intern · Gremienvorlage</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Politische Vorlage</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '44rem' }}>
          Entwurf aus dem aktuellen Steuerungslagebild. Freigabe nur durch aktive Bestätigung der Jugendamtsleitung.
          Keine automatischen Beschlussvorschläge.
        </p>
      </div>

      {/* Status + Aktionen */}
      <div className="no-print card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status</div>
          <strong style={{ color: statusColor[status] }}>{statusLabel[status]}</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Vorlage-ID <span style={{ fontFamily: 'monospace' }}>{VORLAGE_ID}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {editierbar && (
            <button type="button" className="btn btn-primary" onClick={() => setStatus('ZUR_FREIGABE')}>
              Zur Freigabe vorlegen
            </button>
          )}
          {status === 'ZUR_FREIGABE' && (
            <>
              <button type="button" className="btn btn-primary" onClick={freigeben}>
                Als JA-Leitung freigeben (Demo)
              </button>
              <button type="button" className="btn btn-secondary" onClick={zurueckgeben}>
                Zurückgeben
              </button>
            </>
          )}
          {status === 'FREIGEGEBEN' && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStatus('ENTWURF');
                setFreigabeStamp(null);
              }}
            >
              Neuen Entwurf öffnen
            </button>
          )}
        </div>
      </div>

      {/* Druck + CSV freigabeunabhängig – Spiegel Lagebild/Bedarfsplanung (Status/Meldebasis) */}
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
        <div style={{ maxWidth: '40rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Export</div>
          <strong style={{ fontSize: '0.95rem' }}>Druck und CSV Vorlage</strong>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.25rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Druck und CSV sind freigabeunabhängig (Entwurf, Freigabe-Warteschlange, freigegeben,
            zurückgegeben). Status, Meldebasis-Stand (Session-sensitiv aus Meldeeingang) und
            Engpass-Filter „Meldelücke“ erscheinen im Ausdruck bzw. im CSV-Metakopf. CSV lädt
            Versorgung, Planungsraum-Aggregate, Engpass-Liste und Meldebasis-Blatt (Semikolon,
            UTF-8 BOM). Filter-Chips und Steuerleiste sind no-print. Keine Kind- oder Personennamen
            (DEC-004).
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
            style={{ fontSize: '0.875rem' }}
            aria-label="Politische Vorlage drucken oder als PDF speichern (keine Kind- oder Personennamen)"
            data-testid="kita-vorlage-druck"
          >
            Drucken / als PDF speichern
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              downloadCsv({
                raumZeilen,
                engpass,
                engpassFilter,
                byRaumId,
                basen,
                status,
                statusLabel: statusLabel[status],
                titel,
                sachtext,
                summeResidual,
                summeGeplant,
                meldeMonatsLabel: meldeBase.monatsLabel,
                sessionFreigabeId: session?.freigabeId ?? null,
                hydrated,
                freigabeStamp,
                freigabeHinweis,
                meldelueckeCount,
              })
            }
            style={{ fontSize: '0.875rem' }}
            aria-label="Vorlage-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
            data-testid="kita-vorlage-csv-download"
          >
            CSV exportieren
          </button>
        </div>
      </div>

      {status === 'ZURUECKGEGEBEN' && freigabeHinweis && (
        <div className="no-print notice-box notice-box-warn" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Korrektur angefordert</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{freigabeHinweis}</p>
          </div>
        </div>
      )}

      {/* Druckbarer Vorlagenkörper */}
      <article
        className="card vorlage-print"
        style={{
          padding: '1.5rem',
          borderTop: freigegeben ? '4px solid var(--color-success)' : '4px solid var(--color-primary)',
        }}
      >
        {freigegeben && freigabeStamp && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.875rem 1rem',
              background: 'var(--color-success-light)',
              border: '1px solid var(--color-success)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
            }}
          >
            <strong style={{ color: 'var(--color-success)' }}>Freigegeben</strong>
            <div style={{ marginTop: '0.35rem' }}>
              {freigabeStamp.rolle} · {freigabeStamp.am}
            </div>
            <div style={{ marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              Nachweis: {VORLAGE_ID} · unveränderlicher Freigabe-Zeitstempel (Demo-Session)
            </div>
          </div>
        )}

        {/* Druck: Status immer sichtbar (auch ohne Freigabe) */}
        {!freigegeben && (
          <div
            className="print-only print-block"
            style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              background: 'var(--color-neutral-light)',
            }}
            role="status"
          >
            <strong>Status im Ausdruck: {statusLabel[status]}</strong>
            <div style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              Noch nicht freigegeben · Vorlage-ID {VORLAGE_ID} · Demo-Session · kein Gremienbeschluss
            </div>
          </div>
        )}

        <header style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            {GREMIUM} · {SITZUNG}
          </p>
          {editierbar ? (
            <>
              <label className="no-print" style={{ display: 'block' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Titel</span>
                <input
                  type="text"
                  value={titel}
                  onChange={e => setTitel(e.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '0.25rem',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                  }}
                />
              </label>
              <h2 className="print-only print-block" style={{ margin: 0, fontSize: '1.35rem' }}>
                {titel}
              </h2>
            </>
          ) : (
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{titel}</h2>
          )}
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            Vorlage {VORLAGE_ID} · Datenstand Lagebild: <strong>{lb.stand}</strong> · Version {lb.version} ·
            Freigabe Lagebild: {lb.freigegebenVon}, {lb.freigegebenAm}
          </p>
        </header>

        {/* Kernzahlen aus Lagebild */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>1. Versorgungslage (Gesamtkommune)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { l: 'Real nutzbare Plätze', v: g.realNutzbarePlaetze.toLocaleString('de-DE') },
              { l: 'Belegt', v: g.belegtePlaetze.toLocaleString('de-DE') },
              { l: 'Frei', v: String(g.freiePlaetze) },
              { l: 'Auslastung', v: `${g.auslastungsgradProzent.toFixed(1)} %` },
              { l: 'Warteliste', v: String(g.wartelisteBestand) },
              { l: 'Versorgung U3', v: `${g.versorgungsquote.u3.toFixed(1)} %` },
              { l: 'Versorgung Ü3', v: `${g.versorgungsquote.ue3.toFixed(1)} %` },
            ].map(k => (
              <div key={k.l} style={{ background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', padding: '0.65rem 0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
                <div style={{ fontWeight: 700 }}>{k.v}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>2. Engpass-Räume (nach Wartelistendruck)</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 0.65rem', lineHeight: 1.5 }}>
            Standard: Top {ENGPASS_TOP_N} nach Wartelistendruck. Optional Schnellfilter „Meldelücke“
            (Demo-Stichprobe Meldeeingang, Session-sensitiv — wie öffentlicher Planungsraum-Explorer).
            Rangfolge bleibt nach Druck; keine Umbewertung.
          </p>

          {/* Schnellfilter: nur interaktiv / nicht drucken */}
          <div
            className="no-print"
            role="group"
            aria-label="Schnellfilter Engpass-Liste Meldelücke"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}
          >
            <button
              type="button"
              className={engpassFilter === 'ALL' ? 'btn btn-primary' : 'btn btn-secondary'}
              aria-pressed={engpassFilter === 'ALL'}
              onClick={() => setEngpassFilter('ALL')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Top {ENGPASS_TOP_N} Engpass
            </button>
            <button
              type="button"
              className={engpassFilter === 'MELDELUECKE' ? 'btn btn-primary' : 'btn btn-secondary'}
              aria-pressed={engpassFilter === 'MELDELUECKE'}
              onClick={() =>
                setEngpassFilter(prev => (prev === 'MELDELUECKE' ? 'ALL' : 'MELDELUECKE'))
              }
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderColor: engpassFilter === 'MELDELUECKE' ? undefined : 'var(--color-danger)',
              }}
              title="Planungsräume mit fehlender freigegebener Monatsmeldung (Demo-Stichprobe)"
            >
              Meldelücke
              <span style={{ marginLeft: '0.35rem', fontSize: '0.72rem', opacity: 0.9 }}>
                ({meldelueckeCount})
              </span>
            </button>
          </div>

          {engpassFilter === 'MELDELUECKE' ? (
            <p
              className="print-only print-block"
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                margin: '0 0 0.65rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--color-neutral-light)',
                borderLeft: '3px solid var(--color-warning)',
                borderRadius: 'var(--radius)',
                lineHeight: 1.5,
              }}
            >
              <strong>Druckfilter aktiv: Meldelücke.</strong> Nur Planungsräume mit fehlender freigegebener
              Monatsmeldung (Demo-Stichprobe Meldeeingang, Session-Stand). Original-Rang nach Wartelistendruck
              unverändert; keine Umbewertung nach Meldeschwere. Anzahl in Stichprobe: {meldelueckeCount}.
            </p>
          ) : (
            <p
              className="print-only print-block"
              style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem', lineHeight: 1.5 }}
            >
              Druckfilter: Standard Top {ENGPASS_TOP_N} nach Wartelistendruck (kein Meldelücke-Filter aktiv).
              Meldelücken in der Stichprobe: {meldelueckeCount}.
            </p>
          )}

          {engpass.length === 0 ? (
            <p
              role="status"
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                margin: 0,
                padding: '0.75rem 1rem',
                background: 'var(--color-neutral-light)',
                borderRadius: 'var(--radius)',
                borderLeft: '3px solid var(--color-border)',
                lineHeight: 1.5,
              }}
            >
              {engpassFilter === 'MELDELUECKE'
                ? 'Keine Planungsräume mit Meldelücke in der aktuellen Demo-Stichprobe (ggf. nach Freigabe in /kita/meldung geschlossen).'
                : 'Keine Engpass-Räume nach Wartelistendruck.'}
            </p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
              {engpass.map(r => {
                const meldebasis = byRaumId.get(r.id);
                const hatLuecke = Boolean(meldebasis?.hatDatenluecke);
                const meldeHinweis =
                  hatLuecke && r.residual > 0
                    ? meldebasis?.schwere === 'UEBERFAELLIG'
                      ? ' · Meldebasis unvollständig (überfällig)'
                      : ' · Meldebasis unvollständig (ausstehend)'
                    : hatLuecke
                      ? meldebasis?.schwere === 'UEBERFAELLIG'
                        ? ' · Meldelücke (überfällig)'
                        : ' · Meldelücke (ausstehend)'
                      : '';
                return (
                  <li
                    key={r.id}
                    style={
                      hatLuecke
                        ? {
                            borderLeft: '3px solid var(--color-warning)',
                            paddingLeft: '0.5rem',
                            marginBottom: '0.25rem',
                          }
                        : undefined
                    }
                  >
                    <strong>{r.name}</strong>
                    {hatLuecke && (
                      <span
                        className="badge"
                        style={{
                          marginLeft: '0.4rem',
                          fontSize: '0.68rem',
                          verticalAlign: 'middle',
                          background: 'var(--color-warning-light, #fff8e8)',
                          color: 'var(--color-warning)',
                          border: '1px solid var(--color-warning)',
                        }}
                      >
                        Meldelücke
                      </span>
                    )}
                    {' '}— Druck {r.druck.toFixed(1)}×, Warteliste {r.warteliste},
                    residuale Planungslücke {r.residual}
                    {meldeHinweis}
                  </li>
                );
              })}
            </ol>
          )}

          {engpassFilter === 'MELDELUECKE' && engpass.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.65rem 0 0', lineHeight: 1.5 }}>
              {engpass.length} Planungsraum{engpass.length === 1 ? '' : 'e'} mit Meldelücke,
              sortiert nach Wartelistendruck (nicht nach Meldeschwere).
            </p>
          )}
          {suedostLuecke && engpassFilter === 'ALL' && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.65rem 0 0', lineHeight: 1.5 }}>
              Fokus Südost: residuale Planungslücke methodisch an fehlende freigegebene Einrichtungsmeldung
              gekoppelt (Hinweis only, keine Interpolation). Nach Session-Freigabe in der Monatsmeldung entfällt der Hinweis.
              Filter „Meldelücke“ listet alle betroffenen Räume der Stichprobe.
            </p>
          )}
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>3. Planungslücken und geplante Kapazität</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Summe geplanter neuer Plätze (Maßnahmen): <strong>+{summeGeplant}</strong> ·
            Summe residuale Planungslücken: <strong>{summeResidual}</strong>
            {' '}(Näherung: Warteliste − freie Plätze − geplante Plätze; siehe Bedarfsplanung).
            {suedostLuecke && (
              <>
                {' '}Südost: Residual methodisch an Meldelücke gekoppelt (Hinweis).
              </>
            )}
          </p>
          <div style={{ marginBottom: '0.75rem' }}>
            <ResidualMeldeSummenHinweis
              basen={basen}
              residualByRaumId={residualByRaumId}
              highlightRaumId="PR-03"
            />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                  {['Planungsraum', 'Meldebasis', 'VQ U3', 'VQ Ü3', 'Warteliste', 'Geplant +', 'Lücke'].map(h => (
                    <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raumZeilen.map((r, i) => {
                  const meldebasis = byRaumId.get(r.id);
                  const highlightSuedost = r.id === 'PR-03' && suedostLuecke;
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        background: highlightSuedost
                          ? 'var(--color-warning-light, #fff8e8)'
                          : i % 2
                            ? 'var(--color-neutral-light)'
                            : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>
                        {r.name}
                        {highlightSuedost && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            Meldeeingang kritisch
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem' }}>
                        <MeldebasisBadge basis={meldebasis} />
                      </td>
                      <td style={{ padding: '0.6rem' }}>{r.vqU3.toFixed(1)} %</td>
                      <td style={{ padding: '0.6rem' }}>{r.vqUe3.toFixed(1)} %</td>
                      <td style={{ padding: '0.6rem' }}>{r.warteliste}</td>
                      <td style={{ padding: '0.6rem' }}>+{r.geplant}</td>
                      <td
                        style={{
                          padding: '0.6rem',
                          fontWeight: 700,
                          color:
                            r.residual > 40
                              ? 'var(--color-danger)'
                              : r.residual > 0
                                ? 'var(--color-warning)'
                                : 'var(--color-success)',
                        }}
                      >
                        {r.residual}
                        <ResidualMeldeHinweis
                          basis={meldebasis}
                          residual={r.residual}
                          compact
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Meldebasis aus Demo-Stichprobe Meldeeingang (US-KJ-004). Residualzahl unverändert bei Meldelücke —
            keine Schätzung fehlender Aggregate. Keine Kind- oder Personennamen.
          </p>
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>4. Sachdarstellung</h3>
          {editierbar ? (
            <>
              <textarea
                className="no-print"
                value={sachtext}
                onChange={e => setSachtext(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  resize: 'vertical',
                }}
              />
              <p
                className="print-only print-block"
                style={{ fontSize: '0.95rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}
              >
                {sachtext}
              </p>
            </>
          ) : (
            <p style={{ fontSize: '0.95rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{sachtext}</p>
          )}
        </section>

        {/* Methodik (AK 5) */}
        <section style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>5. Methodik und Einschränkungen</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
            <li>
              Datenbasis: Steuerungslagebild {lb.version}, Stand {lb.stand}, freigegeben {lb.freigegebenAm} durch {lb.freigegebenVon}.
            </li>
            <li>
              Zeitraum: {lb.berichtszeitraum}. Planungsbezug: Entwurf Bedarfsplanung (siehe{' '}
              <Link href="/kita/bedarfsplanung" className="no-print" style={{ color: 'var(--color-primary)' }}>/kita/bedarfsplanung</Link>
              <span className="print-only"> Binnenroute Bedarfsplanung</span>).
            </li>
            <li>
              Planungslücke ist eine Demo-Näherung (Warteliste kann Mehrfachanmeldungen enthalten). Keine demografische Prognose.
            </li>
            <li>
              Residuale Planungslücken mit Meldelücke (fehlende freigegebene Einrichtungsmeldungen) werden methodisch
              ausgewiesen und nicht interpoliert — gleiche Methodik wie Bedarfsplanung und öffentlicher Transparenzbericht.
            </li>
            <li>
              Engpass-Liste: Top {ENGPASS_TOP_N} nach Wartelistendruck; optionaler Schnellfilter „Meldelücke“
              (Session-sensitiv aus Meldeeingang-Stichprobe, analog Planungsraum-Explorer). Keine Umbewertung der Rangfolge.
            </li>
            <li>
              Druck und CSV sind freigabeunabhängig: Entwurf, Freigabe-Warteschlange, freigegebene und
              zurückgegebene Fassung sind exportierbar. Status, Meldebasis und Engpass-Filter stehen im
              Ausdruck (print-only) bzw. im CSV-Metakopf (Blätter: Versorgung, Planungsräume, Engpass,
              Meldebasis-Stichprobe). Steuerleiste und Filter-Chips sind no-print.
            </li>
            <li>Keine personen- oder kindbezogenen Einzeldaten in dieser Vorlage; Einrichtungsaggregate nur als Meldebasis-Hinweis (DEC-004).</li>
            {lb.methodik.slice(0, 3).map(m => (
              <li key={m.kennzahl}>
                <strong>{m.kennzahl}:</strong> {m.definition}
                {m.einschraenkungen ? ` Einschränkung: ${m.einschraenkungen}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Diese Vorlage ist ein Sachbericht der Verwaltung für politische Beratung. Sie enthält keine automatischen
          Handlungsempfehlungen und ersetzt keine Beschlussfassung des Gremiums.
        </p>
      </article>

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
          ). Diese Gremienvorlage stützt sich auf freigegebene Aggregate des Steuerungslagebilds und
          den Bedarfsplanungsentwurf (Planungslücken, Meldebasis). Freigabe nur aktiv durch
          JA-Leitung — keine automatische Beschlussempfehlung. Keine Kind- oder Personennamen.
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
                text: 'Versorgungslage, Engpässe und Meldeeingang — Datenbasis dieser Vorlage.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/bedarfsplanung',
                story: 'US-KJ-007',
                title: 'Bedarfsplanungsentwurf',
                text: 'Planungslücken und Meldebasis je Planungsraum; Entwurf ohne automatische Entscheidung.',
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
        (Planungslücken und Meldebasis). Öffentliche Aggregation ohne Einrichtungsdetail im{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Bericht
        </Link>{' '}
        (DEC-004). Druck und CSV: freigabeunabhängig mit Status/Meldebasis und dokumentiertem
        Meldelücke-Filter.
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-only { display: none; }
            @media print {
              .no-print { display: none !important; }
              .print-only { display: inline !important; }
              .print-only.print-block { display: block !important; }
              body > div > header,
              body nav { display: none !important; }
              main { padding: 0 !important; }
              .vorlage-print {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
