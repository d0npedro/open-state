'use client';

/**
 * Meldeeingang im Steuerungslagebild (US-KJ-004 → US-KJ-005)
 *
 * Zeigt freigegebene Monatsmeldungen als Datenbasis und markiert Lücken.
 * Session-Kopplung: Freigabe in /kita/meldung aktualisiert Kita Sonnenwinkel.
 *
 * Druck (US-KJ-004→005): print-only Status/Datenbasis/Session-Freigabe
 * (Vollständigkeit, Lückenliste, Freigabe-ID, Stichprobenmonat) — Spiegel
 * Engpass/Explorer/Zeitreihe. Aktionslinks no-print.
 * CSV: Session-Stand freigabeunabhängig (Statusblatt, freigegebene Aggregate,
 * Lückenliste) — Spiegel Meldung/Monatsbericht. Nur Aggregate – keine
 * Kind- oder Personennamen.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaMeldeeingang } from '@/data/mockKitaMeldeeingang';
import type {
  MeldeeingangEintrag,
  MeldeeingangSessionFreigabe,
  MeldeeingangStatus,
} from '@/types/kitaMeldeeingang';
import {
  KITA_MELDE_SESSION_EVENT,
  MELDEEINGANG_SESSION_KEY,
  kennzahlenToKurz,
} from '@/types/kitaMeldeeingang';
import { KitaMeldeeingangMonatsberichtVorschau } from '@/components/kita/KitaMeldeeingangMonatsberichtVorschau';

function statusMeta(status: MeldeeingangStatus): { label: string; color: string } {
  switch (status) {
    case 'FREIGEGEBEN':
      return { label: 'Eingegangen', color: 'var(--color-success)' };
    case 'UEBERFAELLIG':
      return { label: 'Überfällig – fehlt', color: 'var(--color-danger)' };
    case 'AUSSTEHEND':
      return { label: 'Ausstehend', color: 'var(--color-warning)' };
    case 'ENTWURF':
      return { label: 'Entwurf (nicht sichtbar)', color: 'var(--color-text-muted)' };
    default:
      return { label: status, color: 'var(--color-text-muted)' };
  }
}

function fmtNum(n: number, decimals = 0) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function csvNum(n: number, decimals = 0): string {
  return n.toFixed(decimals).replace('.', ',');
}

function csvSafe(s: string): string {
  return s.replace(/;/g, ',').replace(/\r?\n/g, ' ');
}

/**
 * CSV Aggregate-Export Meldeeingang (US-KJ-004 → US-KJ-005).
 * Metakopf: Berichtsmonat, Datenvollständigkeit, Session-Freigabe, Zähler.
 * Blätter: 1 Eingangsstatus (alle), 2 freigegebene Aggregate, 3 Lückenliste.
 * Unfreigegebene ohne Kennzahlen (DEC-004). Semikolon, UTF-8 BOM, Komma-Dezimal.
 */
function downloadCsv(args: {
  monatsIso: string;
  monatsLabel: string;
  fiktivesHeute: string;
  standLabel: string;
  methodikKurz: string;
  eintraege: MeldeeingangEintrag[];
  freigegeben: MeldeeingangEintrag[];
  luecken: MeldeeingangEintrag[];
  ueberfaellig: number;
  ausstehend: number;
  session: MeldeeingangSessionFreigabe | null;
  sessionNeu: boolean;
  hydrated: boolean;
}) {
  const {
    monatsIso,
    monatsLabel,
    fiktivesHeute,
    standLabel,
    methodikKurz,
    eintraege,
    freigegeben,
    luecken,
    ueberfaellig,
    ausstehend,
    session,
    sessionNeu,
    hydrated,
  } = args;

  const vollstaendig = luecken.length === 0;
  const vollMeta = !hydrated
    ? 'Datenvollständigkeit: Session-Stand noch nicht geladen (clientseitig)'
    : vollstaendig
      ? `Datenvollständigkeit: alle ${eintraege.length} Einrichtungen der Demo-Stichprobe freigegeben`
      : `Datenlücken: ${freigegeben.length} von ${eintraege.length} freigegeben · ${luecken.length} fehlen (keine Interpolation)`;

  const lueckenMeta =
    luecken.length === 0
      ? 'Offene Meldungen: keine'
      : `Offen: ${luecken
          .map(
            e =>
              `${e.einrichtungBezeichnung} (${e.planungsraumBezeichnung}, ${statusMeta(e.status).label})`
          )
          .join('; ')}`;

  const sessionMeta = sessionNeu
    ? `Session-Freigabe: Kita Sonnenwinkel · ID ${session?.freigabeId ?? '–'}${
        session?.freigegebenAm ? ` · ${session.freigegebenAm}` : ''
      }${session?.freigegebenDurchRolle ? ` · ${csvSafe(session.freigegebenDurchRolle)}` : ''}`
    : 'Session-Freigabe: keine (Demo-Ausgangsstand Meldeeingang)';

  const meta = [
    `# Meldeeingang Kindertagesbetreuung (Jugendamt-intern, US-KJ-004 → US-KJ-005)`,
    `# Berichtsmonat: ${csvSafe(monatsLabel)} (${monatsIso}) | Demo-Stichtag: ${fiktivesHeute}`,
    `# Stand: ${csvSafe(standLabel)}`,
    `# ${csvSafe(vollMeta)}`,
    `# ${csvSafe(lueckenMeta)}`,
    `# ${csvSafe(sessionMeta)}`,
    `# Zähler: freigegeben ${freigegeben.length} · überfällig ${ueberfaellig} · ausstehend/Entwurf ${ausstehend} · Stichprobe ${eintraege.length}`,
    `# Methodik: ${csvSafe(methodikKurz)}`,
    `# Unfreigegebene Einrichtungen: keine Aggregate im Export (DEC-004) · keine Interpolation`,
    `# Steuerungskette: Meldeeingang (US-KJ-004) → Lagebild (US-KJ-005) · Monatsmeldung /kita/meldung`,
    `# Session-Stand, kein Backend · keine automatischen Handlungsempfehlungen`,
    `# Keine personenbezogenen Daten · Keine Kind- oder Personennamen (DEC-004)`,
    `# Trennzeichen: Semikolon · Dezimaltrennzeichen: Komma · Encoding: UTF-8 BOM`,
  ];

  const statusHeader = [
    'Meldung_ID',
    'Einrichtung_ID',
    'Einrichtung',
    'Traeger',
    'Planungsraum_ID',
    'Planungsraum',
    'Status',
    'Status_Label',
    'Meldefrist',
    'Meldefrist_Label',
    'Freigegeben_am',
    'Freigabe_ID',
    'Freigegeben_durch_Rolle',
    'Session_Eingang',
    'Hinweise',
  ].join(';');

  const statusRows = eintraege.map(e => {
    const isSession =
      sessionNeu &&
      session &&
      e.status === 'FREIGEGEBEN' &&
      e.freigabeId === session.freigabeId;
    return [
      e.meldungId,
      e.einrichtungId,
      csvSafe(e.einrichtungBezeichnung),
      csvSafe(e.traeger),
      e.planungsraumId,
      csvSafe(e.planungsraumBezeichnung),
      e.status,
      csvSafe(statusMeta(e.status).label),
      e.meldefrist,
      csvSafe(e.meldefristLabel),
      e.freigegebenAm ?? '',
      e.freigabeId ?? '',
      csvSafe(e.freigegebenDurchRolle ?? ''),
      isSession ? 'ja' : 'nein',
      csvSafe((e.hinweise ?? []).join(' | ')),
    ].join(';');
  });

  const kennHeader = [
    'Meldung_ID',
    'Einrichtung_ID',
    'Einrichtung',
    'Planungsraum',
    'Genehmigte_Plaetze',
    'Belegte_Plaetze',
    'Freie_Plaetze',
    'Warteliste',
    'Auslastung_Prozent',
    'Anwesenheitsquote_Prozent',
    'Personalausfall_Prozent',
    'Tage_Personalschluessel_unterschritten',
    'Freigegeben_am',
    'Freigabe_ID',
    'Session_Eingang',
  ].join(';');

  const kennRows = freigegeben
    .filter(e => e.kennzahlen)
    .map(e => {
      const k = e.kennzahlen!;
      const isSession =
        sessionNeu &&
        session &&
        e.freigabeId === session.freigabeId;
      return [
        e.meldungId,
        e.einrichtungId,
        csvSafe(e.einrichtungBezeichnung),
        csvSafe(e.planungsraumBezeichnung),
        k.genehmigtePlaetze,
        k.belegtePlaetze,
        k.freiePlaetze,
        k.wartelisteBestand,
        csvNum(k.auslastungsgradProzent, 1),
        csvNum(k.anwesenheitsquoteProzent, 1),
        csvNum(k.personalAusfallquoteProzent, 1),
        k.tagePersonalschluesselUnterschritten,
        e.freigegebenAm ?? '',
        e.freigabeId ?? '',
        isSession ? 'ja' : 'nein',
      ].join(';');
    });

  const lueckenHeader = [
    'Meldung_ID',
    'Einrichtung_ID',
    'Einrichtung',
    'Planungsraum',
    'Status',
    'Status_Label',
    'Meldefrist',
    'Meldefrist_Label',
  ].join(';');

  const lueckenRows = luecken.map(e =>
    [
      e.meldungId,
      e.einrichtungId,
      csvSafe(e.einrichtungBezeichnung),
      csvSafe(e.planungsraumBezeichnung),
      e.status,
      csvSafe(statusMeta(e.status).label),
      e.meldefrist,
      csvSafe(e.meldefristLabel),
    ].join(';')
  );

  const parts: string[] = [
    ...meta,
    '',
    '# Blatt 1: Meldeeingang-Status je Einrichtung (Demo-Stichprobe, Session-sensitiv)',
    statusHeader,
    ...statusRows,
    '',
    '# Blatt 2: Aggregate freigegebener Meldungen (nur FREIGEGEBEN, DEC-004)',
  ];

  if (kennRows.length > 0) {
    parts.push(kennHeader, ...kennRows);
  } else {
    parts.push('# (keine freigegebenen Aggregate im aktuellen Session-Stand)');
  }

  parts.push(
    '',
    '# Blatt 3: Lückenliste (unfreigegeben – Kennzahlen fließen nicht in Aggregation ein)'
  );
  if (lueckenRows.length > 0) {
    parts.push(lueckenHeader, ...lueckenRows);
  } else {
    parts.push('# (keine offenen Meldungen in der Stichprobe)');
  }

  const csv = parts.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const lueckeSuffix = luecken.length > 0 ? '-mit-luecken' : '-vollstaendig';
  const sessionSuffix = sessionNeu ? '-session' : '';
  a.download = `meldeeingang-${monatsIso}${lueckeSuffix}${sessionSuffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function readSessionFreigabe(): MeldeeingangSessionFreigabe | null {
  try {
    const raw = localStorage.getItem(MELDEEINGANG_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MeldeeingangSessionFreigabe;
    if (!parsed?.meldungId || !parsed?.freigabeId || !parsed?.kennzahlen) return null;
    return parsed;
  } catch {
    return null;
  }
}

function applySession(
  eintraege: MeldeeingangEintrag[],
  session: MeldeeingangSessionFreigabe | null
): MeldeeingangEintrag[] {
  if (!session) return eintraege;
  return eintraege.map(e => {
    if (e.meldungId !== session.meldungId && e.einrichtungId !== session.einrichtungId) {
      return e;
    }
    return {
      ...e,
      status: 'FREIGEGEBEN' as const,
      freigegebenAm: session.freigegebenAm,
      freigabeId: session.freigabeId,
      freigegebenDurchRolle: session.freigegebenDurchRolle,
      kennzahlen: kennzahlenToKurz(session.kennzahlen),
      hinweise: [
        'Neu eingegangen in dieser Demo-Session (Freigabe aus /kita/meldung).',
        ...(e.hinweise?.filter(h => !h.includes('Freigabe ausstehend')) ?? []),
      ],
    };
  });
}

export function KitaMeldeeingangPanel() {
  const base = demoKitaMeldeeingang;
  const [session, setSession] = useState<MeldeeingangSessionFreigabe | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(readSessionFreigabe());
  }, []);

  useEffect(() => {
    refreshSession();
    setHydrated(true);

    function onStorage(ev: StorageEvent) {
      if (ev.key === MELDEEINGANG_SESSION_KEY || ev.key === null) {
        refreshSession();
      }
    }
    function onFocus() {
      refreshSession();
    }
    function onSessionEvent() {
      refreshSession();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener(KITA_MELDE_SESSION_EVENT, onSessionEvent);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(KITA_MELDE_SESSION_EVENT, onSessionEvent);
    };
  }, [refreshSession]);

  const eintraege = useMemo(
    () => applySession(base.eintraege, session),
    [base.eintraege, session]
  );

  const freigegeben = eintraege.filter(e => e.status === 'FREIGEGEBEN');
  const luecken = eintraege.filter(e => e.status !== 'FREIGEGEBEN');
  const vollstaendig = luecken.length === 0;
  const sessionNeu = Boolean(
    session && freigegeben.some(e => e.freigabeId === session.freigabeId)
  );

  const borderColor = vollstaendig
    ? 'var(--color-success)'
    : luecken.some(e => e.status === 'UEBERFAELLIG')
      ? 'var(--color-danger)'
      : 'var(--color-warning)';

  const ueberfaellig = luecken.filter(e => e.status === 'UEBERFAELLIG').length;
  const ausstehend = luecken.filter(e => e.status === 'AUSSTEHEND' || e.status === 'ENTWURF').length;

  /** print-only: Status/Datenbasis/Session (Spiegel Engpass/Explorer Druck-Meta). */
  const druckStatusText = useMemo(() => {
    if (!hydrated) {
      return 'Meldeeingang: Session-Stand noch nicht geladen (clientseitig).';
    }
    const vollText = vollstaendig
      ? `Datenvollständigkeit: alle ${eintraege.length} Einrichtungen der Demo-Stichprobe freigegeben`
      : `Datenlücken: ${freigegeben.length} von ${eintraege.length} freigegeben · ${luecken.length} fehlen (keine Interpolation)`;
    const lueckenText =
      luecken.length === 0
        ? 'Keine offenen Meldungen in der Stichprobe'
        : `Offen: ${luecken
            .map(e => `${e.einrichtungBezeichnung} (${e.planungsraumBezeichnung}, ${statusMeta(e.status).label})`)
            .join('; ')}`;
    const sessionText = sessionNeu
      ? `Session-Freigabe: Kita Sonnenwinkel · ID ${session?.freigabeId ?? '–'}${
          session?.freigegebenAm ? ` · ${session.freigegebenAm}` : ''
        }${session?.freigegebenDurchRolle ? ` · ${session.freigegebenDurchRolle}` : ''}`
      : 'Session-Freigabe: keine (Demo-Ausgangsstand Meldeeingang)';
    return `${vollText}. ${lueckenText}. ${sessionText}.`;
  }, [
    hydrated,
    vollstaendig,
    eintraege.length,
    freigegeben.length,
    luecken,
    sessionNeu,
    session?.freigabeId,
    session?.freigegebenAm,
    session?.freigegebenDurchRolle,
  ]);

  return (
    <section
      id="meldeeingang"
      aria-labelledby="meldeeingang-titel"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', scrollMarginTop: '1.25rem' }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 16rem', maxWidth: '46rem' }}>
          <h2 id="meldeeingang-titel" style={{ marginBottom: '0.35rem' }}>
            Meldeeingang &amp; Datenbasis
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {base.standLabel} · Berichtsmonat {base.monatsLabel} · Demo-Stichtag {base.fiktivesHeute}
          </p>
          <p
            className="no-print"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.35rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Im Ausdruck: print-only Status, Datenbasis und Session-Freigabe (DEC-004). CSV:
            Session-Stand freigabeunabhängig (Status, freigegebene Aggregate, Lückenliste;
            Semikolon, UTF-8 BOM). Unfreigegebene ohne Kennzahlen.
          </p>
        </div>
        <div className="no-print" style={{ flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.875rem' }}
            onClick={() =>
              downloadCsv({
                monatsIso: base.monatsIso,
                monatsLabel: base.monatsLabel,
                fiktivesHeute: base.fiktivesHeute,
                standLabel: base.standLabel,
                methodikKurz: base.methodikKurz,
                eintraege,
                freigegeben,
                luecken,
                ueberfaellig,
                ausstehend,
                session,
                sessionNeu,
                hydrated,
              })
            }
            aria-label="Meldeeingang-Aggregate als CSV herunterladen (keine Kind- oder Personennamen)"
          >
            CSV exportieren
          </button>
        </div>
      </div>

      {/* print-only: Status / Datenbasis / Session-Freigabe (immer) */}
      <div
        className="print-only print-block"
        style={{
          padding: '0.65rem 0.9rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          background: 'var(--color-neutral-light)',
          lineHeight: 1.5,
        }}
        role="note"
      >
        <strong>Druck Meldeeingang (US-KJ-004 → US-KJ-005): </strong>
        Berichtsmonat {base.monatsLabel} ({base.monatsIso}) · Demo-Stichtag {base.fiktivesHeute} ·{' '}
        {base.standLabel}. {druckStatusText} Kennzahlen unfreigegebener Einrichtungen fließen nicht
        in die Aggregation ein. Zähler: freigegeben {freigegeben.length}
        {hydrated ? ` · überfällig ${ueberfaellig} · ausstehend/Entwurf ${ausstehend}` : ''}. Nur
        Aggregate, keine Kind- oder Personennamen (DEC-004).
      </div>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--radius)',
          fontSize: '0.875rem',
          borderLeft: `3px solid ${borderColor}`,
        }}
        role="status"
      >
        {vollstaendig ? (
          <>
            <strong style={{ color: 'var(--color-success)' }}>Datenvollständigkeit:</strong>{' '}
            Alle {eintraege.length} Einrichtungen der Demo-Stichprobe haben freigegebene
            Monatsmeldungen für {base.monatsLabel} geliefert.
            {sessionNeu && (
              <span style={{ marginLeft: '0.35rem', color: 'var(--color-success)', fontWeight: 600 }}>
                (inkl. Session-Eingang Kita Sonnenwinkel)
              </span>
            )}
          </>
        ) : (
          <>
            <strong style={{ color: borderColor }}>Datenlücken ausgewiesen:</strong>{' '}
            {freigegeben.length} von {eintraege.length} Einrichtungen freigegeben.
            {' '}
            {luecken.length} Meldung{luecken.length === 1 ? '' : 'en'} fehlen – Kennzahlen
            dieser Einrichtungen fließen nicht in die Aggregation ein (keine Interpolation).
          </>
        )}
      </div>

      {luecken.length > 0 && (
        <div
          className="notice-box notice-box-warn"
          role="status"
          data-testid="meldeeingang-luecken-liste"
        >
          <div style={{ fontSize: '0.875rem' }}>
            <strong>Fehlende / ausstehende Meldungen</strong>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
              {luecken.map(e => (
                <li key={e.meldungId}>
                  <strong>{e.einrichtungBezeichnung}</strong> ({e.planungsraumBezeichnung}) –{' '}
                  {statusMeta(e.status).label}
                  {e.einrichtungId === 'EINR-DEMO-01' && (
                    <>
                      {' · '}
                      <Link
                        href="/kita/meldung"
                        className="no-print"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Freigabe in US-KJ-004
                      </Link>
                      <span className="print-only">Freigabe über Monatsmeldung (US-KJ-004)</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p
              style={{
                margin: '0.65rem 0 0',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.45,
              }}
              data-testid="meldeeingang-luecken-methodik"
            >
              Methodik: Fehlende Meldungen werden als Lücke ausgewiesen und nicht mit Schätzwerten
              aufgefüllt. Nur freigegebene Aggregate fließen in die Aggregation ein (DEC-004).
            </p>
          </div>
        </div>
      )}

      {/* Q-622: Leerzustand nach Session-Freigabe – Meldelücke dieser Einrichtung geschlossen */}
      {hydrated && luecken.length === 0 && (
        <div
          className="notice-box notice-box-success"
          role="status"
          data-testid="meldeeingang-keine-luecken"
        >
          <div style={{ fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--color-success)' }}>
              Keine offenen Meldelücken in der Demo-Stichprobe
            </strong>
            <p style={{ margin: '0.4rem 0 0', lineHeight: 1.5 }}>
              Alle Einrichtungen haben freigegebene Monatsmeldungen für {base.monatsLabel} geliefert.
              Es bleibt keine Handlungsaufforderung „Meldung freigeben“ in dieser Stichprobe.
            </p>
            <p
              style={{
                margin: '0.5rem 0 0',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.45,
              }}
              data-testid="meldeeingang-keine-luecken-methodik"
            >
              Methodik: Vollständigkeit bezieht sich nur auf freigegebene Aggregate der Demo-Stichprobe.
              Keine Interpolation fehlender Einrichtungen; keine Kind- oder Personennamen (DEC-004).
            </p>
          </div>
        </div>
      )}

      {sessionNeu && (
        <div
          className="card"
          style={{
            padding: '0.875rem 1.1rem',
            borderTop: '4px solid var(--color-success)',
            background: 'var(--color-success-light, #f0faf4)',
          }}
          role="status"
          data-testid="meldeeingang-session-neu"
        >
          <strong style={{ color: 'var(--color-success)' }}>
            Neu im Meldeeingang (Demo-Session)
          </strong>
          <p style={{ fontSize: '0.875rem', margin: '0.4rem 0 0' }}>
            Freigabe von <strong>Kita Sonnenwinkel</strong> ist im Lagebild angekommen.
            Freigabe-ID{' '}
            <span style={{ fontFamily: 'monospace' }}>{session?.freigabeId}</span>
            {session?.freigegebenAm ? ` · ${session.freigegebenAm}` : ''}.
            Nur freigegebene Aggregate – keine Kind- oder Personennamen.
          </p>
          <p
            style={{
              fontSize: '0.8rem',
              margin: '0.5rem 0 0',
              color: 'var(--color-text-muted)',
              lineHeight: 1.45,
            }}
            data-testid="meldeeingang-session-luecke-hinweis"
          >
            {luecken.length === 0
              ? 'Meldelücke Kita Sonnenwinkel geschlossen – in der Demo-Stichprobe sind nun alle Einrichtungen freigegeben.'
              : `Meldelücke Kita Sonnenwinkel geschlossen. Verbleibend: ${luecken.length} offene Meldung${
                  luecken.length === 1 ? '' : 'en'
                } anderer Einrichtungen (weiterhin als Lücke ausgewiesen, ohne Schätzung).`}
          </p>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(8rem, 1.2fr) minmax(5rem, 0.7fr) minmax(6rem, 0.9fr) minmax(7rem, 1fr)',
            gap: '0.5rem 1rem',
            padding: '0.65rem 1rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-text-muted)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-neutral-light)',
          }}
        >
          <span>Einrichtung</span>
          <span>Planungsraum</span>
          <span>Status</span>
          <span>Aggregate (nach Freigabe)</span>
        </div>
        {eintraege.map(e => {
          const st = statusMeta(e.status);
          const isSession =
            session &&
            e.status === 'FREIGEGEBEN' &&
            e.freigabeId === session.freigabeId;
          return (
            <div
              key={e.meldungId}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(8rem, 1.2fr) minmax(5rem, 0.7fr) minmax(6rem, 0.9fr) minmax(7rem, 1fr)',
                gap: '0.5rem 1rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                borderBottom: '1px solid var(--color-border)',
                background: isSession ? 'var(--color-success-light, #f0faf4)' : undefined,
                alignItems: 'start',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{e.einrichtungBezeichnung}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {e.meldungId}
                </div>
              </div>
              <div>{e.planungsraumBezeichnung}</div>
              <div>
                <span style={{ fontWeight: 600, color: st.color }}>{st.label}</span>
                {e.freigegebenAm && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {e.freigegebenAm}
                    {isSession ? ' · Session' : ''}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                {e.status === 'FREIGEGEBEN' && e.kennzahlen ? (
                  <span>
                    WL {e.kennzahlen.wartelisteBestand}
                    {' · '}Frei {e.kennzahlen.freiePlaetze}
                    {' · '}Ausl. {fmtNum(e.kennzahlen.auslastungsgradProzent, 1)} %
                    {' · '}Pers.-Ausf. {fmtNum(e.kennzahlen.personalAusfallquoteProzent, 1)} %
                    {e.kennzahlen.tagePersonalschluesselUnterschritten > 0 && (
                      <span style={{ color: 'var(--color-warning)' }}>
                        {' · '}Schlüssel↓ {e.kennzahlen.tagePersonalschluesselUnterschritten} T.
                      </span>
                    )}
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    Keine Aggregate sichtbar (unfreigegeben)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monatsbericht-Vorschau neben Meldeeingang (US-KJ-003 ↔ US-KJ-005) */}
      <KitaMeldeeingangMonatsberichtVorschau
        meldeeintrag={eintraege.find(e => e.einrichtungId === 'EINR-DEMO-01')}
      />

      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
        {base.methodikKurz}{' '}
        {!hydrated && (
          <span aria-hidden="true"> Session-Stand wird geladen…</span>
        )}{' '}
        <span className="no-print">
          Quelle Freigabe:{' '}
          <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
            Monatsmeldung freigeben (US-KJ-004)
          </Link>
          . Laufende Betriebsdaten:{' '}
          <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)' }}>
            Monatsbericht-Vorschau (US-KJ-003)
          </Link>
          . CSV Meldeeingang: Statusblatt, freigegebene Aggregate und Lückenliste des aktuellen
          Session-Stands. CSV Monatsbericht-Vorschau an der Vorschau-Karte (Gruppen/Quellenblatt,
          DEC-004).
        </span>
        <span className="print-only">
          Quelle Freigabe: Monatsmeldung (US-KJ-004). Laufende Betriebsdaten: Monatsbericht-Vorschau
          (US-KJ-003). Druckdokumentation: Status, Datenbasis und Session-Freigabe oben. CSV
          Meldeeingang exportiert denselben Session-Stand (Status/Aggregate/Lücken); Vorschau-CSV an
          der Vorschau-Karte.
        </span>
      </p>
    </section>
  );
}
