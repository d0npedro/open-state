'use client';

/**
 * Meldeeingang im Steuerungslagebild (US-KJ-004 → US-KJ-005)
 *
 * Zeigt freigegebene Monatsmeldungen als Datenbasis und markiert Lücken.
 * Session-Kopplung: Freigabe in /kita/meldung aktualisiert Kita Sonnenwinkel.
 * Nur Aggregate – keine Kind- oder Personennamen.
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
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
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

  return (
    <section
      id="meldeeingang"
      aria-labelledby="meldeeingang-titel"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', scrollMarginTop: '1.25rem' }}
    >
      <div>
        <h2 id="meldeeingang-titel" style={{ marginBottom: '0.35rem' }}>
          Meldeeingang &amp; Datenbasis
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, maxWidth: '46rem' }}>
          {base.standLabel} · Berichtsmonat {base.monatsLabel} · Demo-Stichtag {base.fiktivesHeute}
        </p>
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
        <div className="notice-box notice-box-warn" role="status">
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
                      <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
                        Freigabe in US-KJ-004
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
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
        Quelle Freigabe:{' '}
        <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
          Monatsmeldung freigeben (US-KJ-004)
        </Link>
        . Laufende Betriebsdaten:{' '}
        <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)' }}>
          Monatsbericht-Vorschau (US-KJ-003)
        </Link>
        .
      </p>
    </section>
  );
}
