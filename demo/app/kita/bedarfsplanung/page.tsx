'use client';

/**
 * US-KJ-007 – Bedarfsplanungsentwurf (Demo)
 *
 * Leitet einen strukturierten Planungsentwurf aus dem bestehenden Kita-Lagebild ab.
 * Datenlücken je Planungsraum werden aus dem Meldeeingang abgeleitet (US-KJ-004→007):
 * z. B. Südost / Kita Sonnenwinkel überfällig, bis Session-Freigabe in /kita/meldung.
 * Steuerungskette: Lagebild (US-KJ-005) → Bedarfsplanung → politische Vorlage (US-KJ-008).
 * Druck und CSV freigabeunabhängig mit dokumentiertem Status/Meldebasis-Stand
 * (Spiegel Lagebild/Vorlage; CSV-Metakopf analog Einrichtung/Monatsbericht).
 * Keine automatischen Handlungsempfehlungen (Story-Nicht-Ziel).
 * Kommentar und „Zur Freigabe“ sind session-lokal, ohne Backend.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaLagebild } from '@/data/mockKitaLagebild';
import type { Kapazitaetsmassnahme, PlanungsraumKennzahlen } from '@/types/kita';
import {
  KitaBedarfsplanungDatenbasisPanel,
  MeldebasisBadge,
  ResidualMeldeHinweis,
  ResidualMeldeSummenHinweis,
  useMeldeeingangFuerBedarfsplanung,
  type PlanungsraumMeldebasis,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

const ENTWURF_VERSION = 'BP-2025-01-ENTWURF';
const PLANUNGSZEITRAUM = 'Kalenderjahr 2025 / 2026 (Entwurf)';
const DATENSTAND_QUELLE = 'Lagebild + Meldeeingang (freigegebene Aggregate)';

type EntwurfStatus = 'ENTWURF' | 'ZUR_FREIGABE';

type Planungsluecke = {
  bedarf: number;
  angebotHeute: number;
  geplant: number;
  residual: number;
};

type BedarfsZeile = {
  pr: PlanungsraumKennzahlen;
  massnahmen: Kapazitaetsmassnahme[];
  luecke: Planungsluecke;
};

function massnahmenFuerRaum(massnahmen: Kapazitaetsmassnahme[], raumId: string) {
  return massnahmen.filter(m => m.planungsraumId === raumId);
}

function planungsluecke(pr: PlanungsraumKennzahlen, massnahmen: Kapazitaetsmassnahme[]) {
  const geplant = massnahmen.reduce((s, m) => s + m.erwarteteNeuePlaetze, 0);
  // Bedarf annähernd: Warteliste (sichtbarer ungedeckter Bedarf) — Demo-Näherung
  const bedarf = pr.wartelisteBestand;
  const angebotHeute = pr.freiePlaetzeU3 + pr.freiePlaetzeUe3;
  const residual = Math.max(0, bedarf - angebotHeute - geplant);
  return { bedarf, angebotHeute, geplant, residual };
}

/** Dezimal für CSV: Komma als Trennzeichen (de-DE, Spiegel Monatsbericht/Einrichtung). */
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

/**
 * CSV Aggregate-Export freigabeunabhängig (US-KJ-007).
 * Metakopf: Status (Entwurf / Zur Freigabe), Datenstand, Meldebasis-Session,
 * Summen Residual/geplant – Spiegel Druckansicht und Einrichtung/Monatsbericht.
 * Nur Aggregate, keine Kind- oder Personennamen (DEC-004).
 */
function downloadCsv(args: {
  zeilen: BedarfsZeile[];
  byRaumId: Map<string, PlanungsraumMeldebasis>;
  basen: PlanungsraumMeldebasis[];
  status: EntwurfStatus;
  statusLabel: string;
  kommentar: string;
  summeResidual: number;
  summeGeplant: number;
  meldeMonatsLabel: string;
  sessionFreigabeId: string | null;
  hydrated: boolean;
}) {
  const {
    zeilen,
    byRaumId,
    basen,
    status,
    statusLabel,
    kommentar,
    summeResidual,
    summeGeplant,
    meldeMonatsLabel,
    sessionFreigabeId,
    hydrated,
  } = args;

  const lb = demoKitaLagebild;
  const meldeLuecken = basen.filter(b => b.hatDatenluecke);
  const meldeVoll = basen.filter(b => !b.hatDatenluecke).length;
  const meldeStichprobe = basen.length;

  const meldebasisMeta = !hydrated
    ? 'Meldebasis: Session noch nicht geladen (clientseitig)'
    : meldeLuecken.length === 0
      ? `Meldebasis Stichprobe ${meldeMonatsLabel}: vollständig freigegeben (${meldeVoll}/${meldeStichprobe} Planungsräume mit Einträgen)`
      : `Meldebasis Stichprobe ${meldeMonatsLabel}: Lücken in ${meldeLuecken
          .map(b => {
            const residual = zeilen.find(z => z.pr.id === b.planungsraumId)?.luecke.residual ?? 0;
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

  const kommentarMeta = kommentar.trim()
    ? csvSafe(kommentar.trim())
    : '(kein Kommentar)';

  const header = [
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
    'Frei_heute',
    'Geplant_plus',
    'Planungsluecke_Residual',
    'Massnahmen_Anzahl',
    'Massnahmen',
  ].join(';');

  const rows = zeilen.map(({ pr, massnahmen, luecke }) => {
    const basis = byRaumId.get(pr.id);
    const meldeSchluessel = !basis
      ? 'KEINE_STICHPROBE'
      : basis.hatDatenluecke
        ? basis.schwere
        : 'OK';
    const massnahmenText =
      massnahmen.length === 0
        ? ''
        : massnahmen
            .map(m => `${m.bezeichnung} (+${m.erwarteteNeuePlaetze}, ${m.status})`)
            .join(' | ');
    return [
      csvSafe(pr.bezeichnung),
      pr.id,
      csvSafe(meldebasisLabel(basis)),
      meldeSchluessel,
      basis?.freigegeben ?? '',
      basis?.erwartet ?? '',
      csvNum(pr.versorgungsquote.u3, 1),
      csvNum(pr.versorgungsquote.ue3, 1),
      pr.wartelisteBestand,
      csvNum(pr.wartelisteDruckFaktor, 1),
      luecke.angebotHeute,
      luecke.geplant,
      luecke.residual,
      massnahmen.length,
      csvSafe(massnahmenText),
    ].join(';');
  });

  const summeRow = [
    'SUMME (Kommune)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    zeilen.reduce((s, z) => s + z.pr.wartelisteBestand, 0),
    '',
    zeilen.reduce((s, z) => s + z.luecke.angebotHeute, 0),
    summeGeplant,
    summeResidual,
    zeilen.reduce((s, z) => s + z.massnahmen.length, 0),
    '',
  ].join(';');

  const meta = [
    `# Bedarfsplanungsentwurf ${csvSafe(lb.kommuneBezeichnung)}`,
    `# Version: ${ENTWURF_VERSION} | Planungszeitraum: ${csvSafe(PLANUNGSZEITRAUM)}`,
    `# Status: ${statusLabel} (${status}) | freigabeunabhängig exportierbar`,
    `# Datenstand Lagebild: ${lb.stand} | Lagebild-Version: ${lb.version}`,
    `# Quelle: ${csvSafe(DATENSTAND_QUELLE)}`,
    `# ${csvSafe(meldebasisMeta)}`,
    `# ${csvSafe(sessionMeta)}`,
    `# Summen: geplante neue Plätze ${summeGeplant} · residuale Planungslücken ${summeResidual} · Planungsräume ${zeilen.length}`,
    `# Methodik Planungslücke: max(0, Warteliste − freie Plätze − geplante neue Plätze) · keine Interpolation fehlender Meldungen`,
    `# Planungskommentar: ${kommentarMeta}`,
    `# Steuerungskette: Lagebild (US-KJ-005) → Bedarfsplanung (US-KJ-007) → Vorlage (US-KJ-008) · Meldebasis US-KJ-004`,
    `# Session-Stand, kein Backend · kein politischer Beschluss · keine automatischen Handlungsempfehlungen`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen · Keine Einrichtungs-PII (DEC-004)`,
    `# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM`,
  ];

  const parts: string[] = [
    ...meta,
    '',
    '# Blatt 1: Planungsräume und Planungslücke (Aggregate)',
    header,
    ...rows,
    summeRow,
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
      '# Blatt 2: Meldebasis je Planungsraum (Demo-Stichprobe Meldeeingang, Session-sensitiv)',
      meldeHeader,
      ...meldeRows
    );
  }

  const csv = parts.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const statusSuffix = status === 'ZUR_FREIGABE' ? '-zur-freigabe' : '-entwurf';
  const kommuneSlug = lb.kommuneBezeichnung
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, '-')
    .replace(/^-|-$/g, '');
  a.download = `bedarfsplanung-${kommuneSlug || 'kommune'}-${lb.stand}${statusSuffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BedarfsplanungPage() {
  const lb = demoKitaLagebild;
  const { base: meldeBase, session, hydrated, basen, byRaumId } =
    useMeldeeingangFuerBedarfsplanung();
  const [status, setStatus] = useState<EntwurfStatus>('ENTWURF');
  const [kommentar, setKommentar] = useState(
    'Entwurf basiert auf dem freigegebenen Lagebild. Demografie-Prognose noch nicht eingepflegt (offene Fachfrage US-KJ-007).'
  );

  const zeilen = useMemo(() => {
    return lb.planungsraeume.map(pr => {
      const massnahmen = massnahmenFuerRaum(lb.massnahmen, pr.id);
      const luecke = planungsluecke(pr, massnahmen);
      return { pr, massnahmen, luecke };
    });
  }, [lb]);

  const summeResidual = zeilen.reduce((s, z) => s + z.luecke.residual, 0);
  const summeGeplant = zeilen.reduce((s, z) => s + z.luecke.geplant, 0);
  const suedostLuecke = byRaumId.get('PR-03')?.hatDatenluecke ?? false;
  const residualByRaumId = useMemo(() => {
    const m = new Map<string, number>();
    for (const z of zeilen) m.set(z.pr.id, z.luecke.residual);
    return m;
  }, [zeilen]);
  const meldeLueckenRaeume = useMemo(
    () => basen.filter(b => b.hatDatenluecke),
    [basen]
  );
  const statusLabel =
    status === 'ENTWURF' ? 'In Bearbeitung' : 'Zur Freigabe an JA-Leitung';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="no-print">
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">US-KJ-007</span>
          <span>Bedarfsplanung · Demo: Jugendamt intern · § 80 SGB VIII</span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Bedarfsplanungsentwurf</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '42rem' }}>
          Strukturierte Übersicht je Planungsraum auf Basis aktueller Versorgungsdaten.
          Dieser Entwurf ersetzt keinen politischen Beschluss und enthält keine automatischen Handlungsempfehlungen.
        </p>
      </div>

      {/* Druck + CSV freigabeunabhängig – Spiegel Lagebild/Vorlage/Einrichtung (Status/Meldebasis) */}
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
          <strong style={{ fontSize: '0.95rem' }}>Druck und CSV Bedarfsplanung</strong>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.25rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Druck und CSV sind freigabeunabhängig (Entwurf und „Zur Freigabe“). Status,
            Meldebasis-Stand (Session-sensitiv aus Meldeeingang) und Planungskommentar erscheinen
            im Ausdruck bzw. im CSV-Metakopf. CSV lädt Planungsraum-Aggregate inkl. Residual und
            Meldebasis-Blatt (Semikolon, UTF-8 BOM). Steuerungskette-Hub und Aktionsbuttons sind
            no-print. Keine Kind- oder Personennamen (DEC-004).
          </p>
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
            className="btn btn-secondary"
            onClick={() =>
              downloadCsv({
                zeilen,
                byRaumId,
                basen,
                status,
                statusLabel,
                kommentar,
                summeResidual,
                summeGeplant,
                meldeMonatsLabel: meldeBase.monatsLabel,
                sessionFreigabeId: session?.freigabeId ?? null,
                hydrated,
              })
            }
            style={{ fontSize: '0.875rem' }}
            aria-label="Bedarfsplanungs-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
          >
            CSV exportieren
          </button>
        </div>
      </div>

      {/* print-only Kopf + Status + Meldebasis-Dokumentation */}
      <div className="print-only print-block" style={{ margin: 0 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 0.35rem' }}>
          US-KJ-007 · Bedarfsplanung · Demo Jugendamt intern · § 80 SGB VIII
        </p>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem' }}>Bedarfsplanungsentwurf</h1>
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            background: 'var(--color-neutral-light)',
          }}
          role="status"
        >
          <strong>Status im Ausdruck: {statusLabel}</strong>
          <div style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            Version {ENTWURF_VERSION} · {PLANUNGSZEITRAUM} · Datenstand {lb.stand} · Demo-Session ·
            kein politischer Beschluss
          </div>
        </div>
        <div
          style={{
            marginBottom: '0.5rem',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
          }}
          role="note"
        >
          <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
            Meldebasis im Ausdruck (Session-Stand)
          </strong>
          {!hydrated ? (
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Meldebasis wird clientseitig aus dem Meldeeingang geladen.
            </p>
          ) : meldeLueckenRaeume.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              Stichprobe Meldeeingang ({meldeBase.monatsLabel}): in den erfassten Planungsräumen
              vollständig freigegeben. Residuale Planungslücken basieren auf freigegebenen
              Aggregaten; keine Interpolation.
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              Unvollständige Meldebasis in{' '}
              {meldeLueckenRaeume
                .map(b => {
                  const residual = residualByRaumId.get(b.planungsraumId) ?? 0;
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
                .join('; ')}
              . Planungslücken unverändert ausgewiesen, fehlende Aggregate nicht geschätzt
              (Hinweis-only, Fokus Demo: Südost / PR-03).
            </p>
          )}
        </div>
      </div>

      {/* Metadaten / Versionierung (AK 3, 4) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          borderLeft: '4px solid var(--color-primary)',
          fontSize: '0.875rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Version</div>
          <strong style={{ fontFamily: 'monospace' }}>{ENTWURF_VERSION}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Planungszeitraum</div>
          <strong>{PLANUNGSZEITRAUM}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Datenstand</div>
          <strong>{lb.stand}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Quelle</div>
          <strong>{DATENSTAND_QUELLE}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Lagebild-Version</div>
          <strong>{lb.version}</strong>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Status</div>
          <strong style={{ color: status === 'ENTWURF' ? 'var(--color-warning)' : 'var(--color-primary)' }}>
            {status === 'ENTWURF' ? 'In Bearbeitung' : 'Zur Freigabe an JA-Leitung'}
          </strong>
        </div>
      </div>

      <div className="notice-box notice-box-neutral" role="note">
        <div>
          <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
            Methodik der Planungslücke (Demo)
          </strong>
          <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.55 }}>
            Planungslücke ≈ max(0, Wartelistenbestand − freie Plätze − geplante neue Plätze aus Kapazitätsmaßnahmen).
            Die Warteliste kann Mehrfachanmeldungen enthalten; die Lücke ist eine Planungshilfe, keine Prognose.
            Fehlende freigegebene Einrichtungsmeldungen (Meldeeingang) werden je Planungsraum als Datenlücke
            ausgewiesen und nicht interpoliert. Keine automatische Empfehlung für Neubau oder Standortwahl.
            Druck und CSV freigabeunabhängig: Status und Meldebasis-Stand (Session) werden im Ausdruck
            und im CSV-Metakopf dokumentiert (Spiegel Lagebild/Vorlage/Einrichtung).
          </p>
        </div>
      </div>

      {/* Meldeeingang → Datenlücken je Planungsraum (US-KJ-004 → US-KJ-007, Fokus Südost) */}
      <KitaBedarfsplanungDatenbasisPanel
        basen={basen}
        session={session}
        hydrated={hydrated}
        monatsLabel={meldeBase.monatsLabel}
        fiktivesHeute={meldeBase.fiktivesHeute}
        methodikKurz={meldeBase.methodikKurz}
        highlightRaumId="PR-03"
      />

      {/* Kennzahlen-Summe */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderTop: '3px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Geplante neue Plätze (Maßnahmen)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>+{summeGeplant}</div>
        </div>
        <div className="card" style={{ borderTop: `3px solid ${summeResidual > 50 ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Summe residuale Planungslücken</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: summeResidual > 50 ? 'var(--color-danger)' : 'var(--color-text)' }}>
            {summeResidual}
          </div>
          {suedostLuecke && (
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', lineHeight: 1.35 }}>
              Südost: Residual methodisch an Meldelücke gekoppelt (Hinweis)
            </div>
          )}
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--color-neutral)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Planungsräume</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lb.planungsraeume.length}</div>
        </div>
      </div>

      {/* Residuale Lücke ↔ fehlende Meldung (Hinweis-only, Fokus Südost) */}
      <ResidualMeldeSummenHinweis
        basen={basen}
        residualByRaumId={residualByRaumId}
        highlightRaumId="PR-03"
      />

      {/* Tabelle je Planungsraum (AK 1, 2) */}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Planungsräume und Planungslücke</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-light)', borderBottom: '2px solid var(--color-border)' }}>
                {[
                  'Planungsraum',
                  'Meldebasis',
                  'Versorgung U3',
                  'Versorgung Ü3',
                  'Warteliste',
                  'Druck',
                  'Frei heute',
                  'Geplant +',
                  'Planungslücke',
                  'Maßnahmen',
                ].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zeilen.map(({ pr, massnahmen, luecke }, i) => (
                <tr
                  key={pr.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background:
                      pr.id === 'PR-03' && suedostLuecke
                        ? 'var(--color-warning-light, #fff8e8)'
                        : i % 2 === 0
                          ? 'transparent'
                          : 'var(--color-neutral-light)',
                  }}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                    {pr.bezeichnung}
                    {pr.id === 'PR-03' && suedostLuecke && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        Meldeeingang kritisch
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <MeldebasisBadge basis={byRaumId.get(pr.id)} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>{pr.versorgungsquote.u3.toFixed(1)} %</td>
                  <td style={{ padding: '0.75rem' }}>{pr.versorgungsquote.ue3.toFixed(1)} %</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{pr.wartelisteBestand}</td>
                  <td style={{ padding: '0.75rem' }}>{pr.wartelisteDruckFaktor.toFixed(1)}×</td>
                  <td style={{ padding: '0.75rem' }}>{luecke.angebotHeute}</td>
                  <td style={{ padding: '0.75rem' }}>+{luecke.geplant}</td>
                  <td
                    style={{
                      padding: '0.75rem',
                      fontWeight: 700,
                      color:
                        luecke.residual > 40
                          ? 'var(--color-danger)'
                          : luecke.residual > 0
                            ? 'var(--color-warning)'
                            : 'var(--color-success)',
                    }}
                  >
                    {luecke.residual}
                    <ResidualMeldeHinweis
                      basis={byRaumId.get(pr.id)}
                      residual={luecke.residual}
                      compact
                    />
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {massnahmen.length === 0
                      ? '—'
                      : massnahmen.map(m => `${m.bezeichnung} (+${m.erwarteteNeuePlaetze})`).join('; ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Quelle je Zeile: freigegebenes Lagebild {lb.version} ({lb.stand}), Kommune {lb.kommuneBezeichnung};
          Meldebasis aus Demo-Stichprobe Meldeeingang (US-KJ-004). Keine Kind- oder Personennamen.
        </p>
      </section>

      {/* Kommentar + Freigabe-Workflow (AK 6) */}
      <section className="card">
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>Planungskommentar</h2>
        <p className="no-print" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Fachliche Einschätzung der Planung — keine System-Empfehlung. Demo speichert den Text nur in der Browser-Session.
        </p>
        <label htmlFor="bp-kommentar" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Planungskommentar
        </label>
        <textarea
          id="bp-kommentar"
          className="no-print"
          value={kommentar}
          onChange={e => setKommentar(e.target.value)}
          disabled={status === 'ZUR_FREIGABE'}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            resize: 'vertical',
            background: status === 'ZUR_FREIGABE' ? 'var(--color-neutral-light)' : 'white',
          }}
        />
        <p
          className="print-only print-block"
          style={{
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
          }}
        >
          {kommentar.trim() || '— (kein Kommentar)'}
        </p>

        <div
          className="no-print"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}
        >
          {status === 'ENTWURF' ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStatus('ZUR_FREIGABE')}
            >
              An JA-Leitung zur Freigabe senden (Demo)
            </button>
          ) : (
            <>
              <div className="notice-box notice-box-success" style={{ flex: 1, margin: 0 }}>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Zur Freigabe vorgemerkt</strong>
                  <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Demo: Keine echte Weiterleitung. In Produktion würde die JA-Leitung den Entwurf bestätigen (US-KJ-008).
                    Nächster Demo-Schritt: politische Vorlage vorbereiten.
                  </p>
                </div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => setStatus('ENTWURF')}>
                Entwurf wieder öffnen
              </button>
              <Link href="/kita/vorlage" className="btn btn-primary">
                Zur politischen Vorlage
              </Link>
            </>
          )}
        </div>
      </section>

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
          ). Der Planungsentwurf basiert auf freigegebenen Aggregaten des Steuerungslagebilds und der
          Meldebasis (Einrichtungsmeldungen). Nach fachlicher Freigabe fließen Kennzahlen in die
          politische Gremienvorlage — ohne automatische Beschlussempfehlung. Keine Kind- oder
          Personennamen.
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
                text: 'Versorgungslage, Engpässe und Meldeeingang — Datenbasis dieses Planungsentwurfs.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/meldung',
                story: 'US-KJ-004',
                title: 'Monatsmeldung freigeben',
                text: 'Einrichtungs-Aggregate freigeben; schließt Demo-Meldelücken (z. B. Südost / Sonnenwinkel).',
                border: 'var(--color-warning)',
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
        (Planungslücken und Meldebasis). Öffentliche Aggregation ohne Einrichtungsdetail im{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Bericht
        </Link>{' '}
        (DEC-004). Druck und CSV: freigabeunabhängig mit dokumentiertem Status und Meldebasis-Stand;
        CSV-Metakopf analog Einrichtung/Monatsbericht.
      </div>

      <p
        className="print-only print-block"
        style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}
      >
        Steuerungskette Kommune {lb.kommuneBezeichnung}: Lagebild → Bedarfsplanung → Vorlage.
        Druckansicht freigabeunabhängig; Meldebasis aus Demo-Stichprobe Meldeeingang (Session).
        Keine Kind- oder Personennamen. Keine automatischen Handlungsempfehlungen.
      </p>

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
            }
          `,
        }}
      />
    </div>
  );
}
