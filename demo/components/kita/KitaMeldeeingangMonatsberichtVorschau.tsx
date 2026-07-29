'use client';

/**
 * Kopplung Meldeeingang (US-KJ-004→005) ↔ Monatsbericht-Vorschau (US-KJ-003)
 *
 * Im Steuerungslagebild: neben dem Eingang freigegebener Monatsmeldungen
 * den laufenden Monatsbericht (Status VORSCHAU) mit gemischten Tagesstand-Quellen
 * der Demo-Einrichtung Kita Sonnenwinkel ausweisen.
 *
 * Druck: print-only Status/Datenbasis (VORSCHAU, Tagesstand-Quellen, Meldeeingang-
 * Abschlussstatus); Aktionslinks no-print.
 * CSV: freigabeunabhängige Aggregate (Gruppen + Quellenblatt) inkl. Metakopf
 * Demo-Modus Vorschau, Datenbasis und Meldeeingang-Kopplung (DEC-004).
 * Nur Aggregate – keine Kind- oder Personennamen.
 */

import Link from 'next/link';
import { demoKitaMonatsberichtVorschau } from '@/data/mockKitaMonatsbericht';
import type {
  KitaMonatsbericht,
  MonatsberichtTagesstandQuelle,
  MonatsberichtTagesstandQuellenStatus,
} from '@/types/kitaMonatsbericht';
import type { MeldeeingangEintrag, MeldeeingangStatus } from '@/types/kitaMeldeeingang';

function meldeStatusLabel(status: MeldeeingangStatus): { label: string; color: string } {
  switch (status) {
    case 'FREIGEGEBEN':
      return { label: 'Monatsmeldung eingegangen', color: 'var(--color-success)' };
    case 'UEBERFAELLIG':
      return { label: 'Monatsmeldung überfällig', color: 'var(--color-danger)' };
    case 'AUSSTEHEND':
      return { label: 'Monatsmeldung ausstehend', color: 'var(--color-warning)' };
    case 'ENTWURF':
      return { label: 'Monatsmeldung Entwurf', color: 'var(--color-text-muted)' };
    default:
      return { label: status, color: 'var(--color-text-muted)' };
  }
}

function quellenStatusLabel(s: MonatsberichtTagesstandQuellenStatus): string {
  switch (s) {
    case 'FREIGEGEBEN':
      return 'Freigegeben';
    case 'FEHLT':
      return 'Fehlt';
    case 'IN_ERFASSUNG':
      return 'In Erfassung (nicht einbezogen)';
  }
}

function csvSafe(s: string): string {
  return s.replace(/;/g, ',').replace(/\r?\n/g, ' ');
}

/**
 * CSV Aggregate-Export Monatsbericht-Vorschau am Meldeeingang (US-KJ-003 ↔ US-KJ-005).
 * Metakopf: Demo-Modus Vorschau, Status, Tagesstand-Quellen, Meldeeingang-Abschlussstatus.
 * Blätter: 1 Gruppenkennzahlen, 2 Tagesstand-Quellen. Semikolon, UTF-8 BOM, Komma-Dezimal.
 * Keine Kind- oder Personennamen (DEC-004).
 */
function downloadVorschauCsv(args: {
  b: KitaMonatsbericht;
  meldeeintrag: MeldeeingangEintrag | undefined;
  meldeLabel: string | null;
  meldeLuecke: boolean;
}) {
  const { b, meldeeintrag, meldeLabel, meldeLuecke } = args;
  const freigegebenCount = b.tagesstandQuellen.filter(q => q.status === 'FREIGEGEBEN').length;
  const fehltCount = b.tagesstandQuellen.filter(q => q.status === 'FEHLT').length;
  const inErfassungCount = b.tagesstandQuellen.filter(q => q.status === 'IN_ERFASSUNG').length;
  const schluesselTage = b.tagesstandQuellen.filter(
    q => q.status === 'FREIGEGEBEN' && q.personalschluesselUnterschritten
  ).length;

  const meldeMeta = meldeeintrag
    ? `Meldeeingang Abschlussmonat: ${csvSafe(meldeLabel ?? meldeeintrag.status)} · ${csvSafe(
        meldeeintrag.monatsLabel
      )} (${meldeeintrag.monatsIso}) · Einrichtung ${csvSafe(meldeeintrag.einrichtungBezeichnung)}${
        meldeeintrag.freigabeId ? ` · Freigabe-ID ${meldeeintrag.freigabeId}` : ''
      }${
        meldeLuecke
          ? ' · Vorschau ersetzt fehlende Monatsmeldung nicht'
          : ' · parallel zur Abschlussmeldung, unterschiedliche Perioden'
      }`
    : 'Meldeeingang Abschlussmonat: kein Eintrag für diese Einrichtung in der Demo-Stichprobe';

  const header = [
    'Gruppe',
    'Altersgruppe',
    'Anwesenheitsquote_%',
    'Anwesenheitsquote_VJ_%',
    'Auslastung_%',
    'Auslastung_VJ_%',
    'Personalausfall_%',
    'Personalausfall_VJ_%',
    'Tage_Personalschluessel_unterschritten',
    'Tage_Personalschluessel_unterschritten_VJ',
  ].join(';');

  const rows = b.gruppen.map(g =>
    [
      csvSafe(g.bezeichnung),
      g.altersgruppe,
      g.anwesenheitsquoteProzent.toFixed(1).replace('.', ','),
      g.anwesenheitsquoteVorjahrProzent.toFixed(1).replace('.', ','),
      g.auslastungsgradProzent.toFixed(1).replace('.', ','),
      g.auslastungsgradVorjahrProzent.toFixed(1).replace('.', ','),
      g.personalAusfallquoteProzent.toFixed(1).replace('.', ','),
      g.personalAusfallquoteVorjahrProzent.toFixed(1).replace('.', ','),
      g.tagePersonalschluesselUnterschritten,
      g.tagePersonalschluesselUnterschrittenVorjahr,
    ].join(';')
  );

  const ges = b.gesamt;
  const summe = [
    'GESAMT',
    '',
    ges.anwesenheitsquoteProzent.toFixed(1).replace('.', ','),
    ges.anwesenheitsquoteVorjahrProzent.toFixed(1).replace('.', ','),
    ges.auslastungsgradProzent.toFixed(1).replace('.', ','),
    ges.auslastungsgradVorjahrProzent.toFixed(1).replace('.', ','),
    ges.personalAusfallquoteProzent.toFixed(1).replace('.', ','),
    ges.personalAusfallquoteVorjahrProzent.toFixed(1).replace('.', ','),
    ges.tagePersonalschluesselUnterschritten,
    ges.tagePersonalschluesselUnterschrittenVorjahr,
  ].join(';');

  const quellenHeader = [
    'Datum',
    'Datum_Label',
    'Status',
    'Status_Label',
    'Tagesstand_ID',
    'Anwesend_Gesamt',
    'Personal_Ist_Stunden',
    'Schluessel_unterschritten',
    'Freigegeben_am',
    'Freigegeben_durch_Rolle',
  ].join(';');

  const quellenRows = b.tagesstandQuellen.map((q: MonatsberichtTagesstandQuelle) =>
    [
      q.datumIso,
      csvSafe(q.datumLabel),
      q.status,
      csvSafe(quellenStatusLabel(q.status)),
      q.tagesstandId ?? '',
      q.anwesendGesamt ?? '',
      q.personalIstStundenGesamt != null
        ? String(q.personalIstStundenGesamt).replace('.', ',')
        : '',
      q.personalschluesselUnterschritten === null
        ? ''
        : q.personalschluesselUnterschritten
          ? 'ja'
          : 'nein',
      q.freigegebenAm ?? '',
      csvSafe(q.freigegebenDurchRolle ?? ''),
    ].join(';')
  );

  const meta = [
    `# Monatsbericht-Vorschau am Meldeeingang (US-KJ-003 ↔ US-KJ-005, Steuerungslagebild)`,
    `# ID: ${b.id} | Einrichtung: ${b.einrichtungId} | ${csvSafe(b.einrichtungBezeichnung)} | Planungsraum: ${csvSafe(b.planungsraumBezeichnung)}`,
    `# Monat: ${csvSafe(b.monatsLabel)} (${b.monatsIso}) | Stand: ${csvSafe(b.standLabel)}`,
    `# Vergleich: ${csvSafe(b.vorjahresLabel)}`,
    `# Demo-Modus: Laufender Monat (Vorschau) · Status: Vorschau (VORSCHAU) · Monat nicht abgeschlossen`,
    `# Status-Hinweis: Kennzahlen nur aus freigegebenen Tagesständen bis Stichtag; Entwürfe und Lücken ausgewiesen`,
    `# Datenbasis Tagesstand-Quellen (US-KJ-001): freigegeben ${freigegebenCount}/${b.betriebstageImMonat} bis Stichtag · fehlt ${fehltCount} · in Erfassung ${inErfassungCount} (Entwürfe nicht in Kennzahlen)`,
    `# Erfasste freigegebene Tagesstände: ${b.erfassteTagesstaende}/${b.betriebstageImMonat}`,
    `# Fehlende Tage: ${b.fehlendeTage.length ? b.fehlendeTage.join(', ') : 'keine'}`,
    `# Tage Personalschlüssel unterschritten (aus freigegebenen Ständen): ${schluesselTage}`,
    `# ${meldeMeta}`,
    `# Vorschau-Zwischenstand methodisch getrennt von freigegebener Monatsmeldung (US-KJ-004) und vom Monatsabschluss`,
    `# Kennzahlen nur aus freigegebenen Tagesständen; Lücken nicht interpoliert`,
    `# Steuerungskette: Tagesstand (US-KJ-001) → Monatsbericht-Vorschau (US-KJ-003) · Meldeeingang (US-KJ-004) → Lagebild (US-KJ-005)`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen (DEC-004)`,
    `# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM`,
  ];

  const csv = [
    ...meta,
    '',
    '# Blatt 1: Gruppenkennzahlen (Aggregate + Vorjahresvergleich, Vorschau)',
    header,
    ...rows,
    summe,
    '',
    '# Blatt 2: Datenbasis – Tagesstand-Quellen je Betriebstag bis Stichtag (FREIGEGEBEN / FEHLT / IN_ERFASSUNG)',
    quellenHeader,
    ...quellenRows,
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `monatsbericht-${b.einrichtungId}-${b.monatsIso}-vorschau-meldeeingang.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function KitaMeldeeingangMonatsberichtVorschau({
  meldeeintrag,
}: {
  /** Meldeeingang-Zeile derselben Einrichtung (nach Session-Anwendung) */
  meldeeintrag: MeldeeingangEintrag | undefined;
}) {
  const v = demoKitaMonatsberichtVorschau;
  const freigegeben = v.tagesstandQuellen.filter(q => q.status === 'FREIGEGEBEN').length;
  const fehlt = v.tagesstandQuellen.filter(q => q.status === 'FEHLT').length;
  const inErfassung = v.tagesstandQuellen.filter(q => q.status === 'IN_ERFASSUNG').length;
  const melde = meldeeintrag ? meldeStatusLabel(meldeeintrag.status) : null;
  const meldeLuecke =
    meldeeintrag != null && meldeeintrag.status !== 'FREIGEGEBEN';

  return (
    <div
      id="kita-monatsbericht-vorschau"
      className="card"
      style={{
        padding: '1rem 1.15rem',
        borderTop: '4px solid var(--color-primary)',
        scrollMarginTop: '1.25rem',
      }}
      aria-labelledby="meldeeingang-vorschau-titel"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ flex: '1 1 14rem', minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-text-muted)',
              marginBottom: '0.25rem',
            }}
          >
            Kopplung · US-KJ-003 ↔ US-KJ-005
          </div>
          <h3 id="meldeeingang-vorschau-titel" style={{ margin: 0, fontSize: '1rem' }}>
            Monatsbericht-Vorschau (laufender Monat)
          </h3>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {v.einrichtungBezeichnung} · Planungsraum {v.planungsraumBezeichnung} ·{' '}
            {v.monatsLabel}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              background: 'var(--color-neutral-light)',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius)',
            }}
          >
            Status: VORSCHAU
          </span>
          <button
            type="button"
            className="btn btn-secondary no-print"
            style={{ fontSize: '0.8rem' }}
            onClick={() =>
              downloadVorschauCsv({
                b: v,
                meldeeintrag,
                meldeLabel: melde?.label ?? null,
                meldeLuecke,
              })
            }
            aria-label="Monatsbericht-Vorschau-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
          >
            CSV exportieren
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
        {v.standLabel}. Tagesstände als Betriebsdatenbasis – getrennt vom Meldeeingang der
        abgeschlossenen Monatsmeldung ({meldeeintrag?.monatsLabel ?? 'Oktober 2024'}).
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
          gap: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        {[
          {
            label: 'Freigegeben',
            val: freigegeben,
            color: 'var(--color-success)',
            hint: 'in Kennzahlen',
          },
          {
            label: 'Fehlt',
            val: fehlt,
            color: 'var(--color-danger)',
            hint: 'nicht interpoliert',
          },
          {
            label: 'In Erfassung',
            val: inErfassung,
            color: 'var(--color-warning)',
            hint: 'Entwurf, nicht gezählt',
          },
          {
            label: 'Betriebstage',
            val: v.betriebstageImMonat,
            color: 'var(--color-text)',
            hint: 'bis Stichtag',
          },
        ].map(k => (
          <div
            key={k.label}
            style={{
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              padding: '0.55rem 0.7rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.label}</div>
            <div style={{ fontWeight: 700, color: k.color, fontSize: '1.1rem' }}>{k.val}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.hint}</div>
          </div>
        ))}
      </div>

      {melde && (
        <div
          style={{
            fontSize: '0.875rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius)',
            background: meldeLuecke
              ? 'var(--color-warning-light, #fff8e6)'
              : 'var(--color-success-light, #f0faf4)',
            borderLeft: `3px solid ${melde.color}`,
            marginBottom: '0.85rem',
          }}
          role="status"
        >
          <strong style={{ color: melde.color }}>Meldeeingang (Abschlussmonat):</strong>{' '}
          {melde.label}
          {meldeLuecke ? (
            <>
              {' '}
              – Vorschau des laufenden Monats ersetzt die fehlende Monatsmeldung nicht. Sie zeigt
              nur freigegebene Tagesstände (US-KJ-001), ohne Lücken zu füllen.
            </>
          ) : (
            <>
              {' '}
              – Abschlussmeldung und laufende Vorschau sind parallel sichtbar; unterschiedliche
              Perioden und Quellen.
            </>
          )}
        </div>
      )}

      {/* print-only: Vorschau-Status und Datenbasis (Spiegel Monatsbericht-Druck) */}
      <div
        className="print-only print-block"
        style={{
          marginBottom: '0.75rem',
          padding: '0.65rem 0.9rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          background: 'var(--color-neutral-light)',
          lineHeight: 1.5,
        }}
        role="note"
      >
        <strong>Druck Monatsbericht-Vorschau (US-KJ-003 ↔ US-KJ-005): </strong>
        Status VORSCHAU · {v.einrichtungBezeichnung} · Planungsraum {v.planungsraumBezeichnung} ·{' '}
        {v.monatsLabel} · ID <span style={{ fontFamily: 'monospace' }}>{v.id}</span>. Datenbasis
        Tagesstände: freigegeben {freigegeben}, fehlt {fehlt}, in Erfassung {inErfassung} ·
        Betriebstage {v.betriebstageImMonat}. Meldeeingang Abschlussmonat:{' '}
        {melde ? melde.label : 'kein Eintrag'}
        {meldeLuecke
          ? ' – Vorschau ersetzt fehlende Monatsmeldung nicht'
          : ' – parallel zur Abschlussmeldung, unterschiedliche Perioden'}
        . CSV an der Sektion: Gruppenaggregate und Tagesstand-Quellen (DEC-004). Keine
        Interpolation. Nur Aggregate, keine Kind- oder Personennamen.
      </div>

      <div
        className="no-print"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.25rem',
          fontSize: '0.875rem',
          alignItems: 'center',
        }}
      >
        <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Monatsbericht öffnen (Demo: Vorschau Nov 2024)
        </Link>
        {meldeLuecke && (
          <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
            Monatsmeldung freigeben (US-KJ-004)
          </Link>
        )}
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          {v.id}
        </span>
      </div>

      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
          margin: '0.75rem 0 0',
          lineHeight: 1.45,
        }}
      >
        Methodik: Meldeeingang = freigegebene Monatsmeldungen an das Jugendamt. Monatsbericht-Vorschau
        = Zwischenstand aus freigegebenen Tagesständen der Einrichtung. FEHLT und IN_ERFASSUNG
        bleiben Lücken bzw. Entwürfe – keine Schätzwerte. CSV: Gruppenaggregate und
        Quellenblatt mit Metakopf Demo-Modus Vorschau, Datenbasis und Meldeeingang-Kopplung
        (Semikolon, UTF-8 BOM). Nur Aggregate, keine Kind- oder Personennamen.
        <span className="print-only">
          {' '}
          Druckdokumentation: Status VORSCHAU und Tagesstand-Quellen oben. CSV exportiert denselben
          Vorschau-Stand.
        </span>
      </p>
    </div>
  );
}
