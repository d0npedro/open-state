'use client';

/**
 * Beitrag freigegebener Einrichtungsmeldungen je Planungsraum-Karte (US-KJ-004 → US-KJ-005/006).
 *
 * Für Südost: Kita Sonnenwinkel nach Session-Freigabe in /kita/meldung hervorgehoben.
 * Residuale Planungslücke (Demo-Näherung wie US-KJ-007) wird methodisch an Meldelücken
 * gekoppelt — Hinweis only, keine Interpolation (Lagebild-Karten, US-KJ-005/006 ↔ 007).
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
import {
  MeldebasisBadge,
  ResidualMeldeHinweis,
  ResidualMeldeSummenHinweis,
  derivePlanungsraumMeldebasis,
  useMeldeeingangFuerBedarfsplanung,
} from '@/components/kita/KitaBedarfsplanungDatenbasis';

function statusMeta(status: MeldeeingangStatus): { label: string; color: string } {
  switch (status) {
    case 'FREIGEGEBEN':
      return { label: 'Eingegangen', color: 'var(--color-success)' };
    case 'UEBERFAELLIG':
      return { label: 'Überfällig – fehlt', color: 'var(--color-danger)' };
    case 'AUSSTEHEND':
      return { label: 'Ausstehend', color: 'var(--color-warning)' };
    case 'ENTWURF':
      return { label: 'Entwurf', color: 'var(--color-text-muted)' };
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

interface Props {
  planungsraumId: string;
  planungsraumBezeichnung: string;
  /**
   * Residuale Planungslücke (Demo-Näherung wie Bedarfsplanung US-KJ-007):
   * max(0, Warteliste − freie Plätze − geplante Maßnahmenplätze).
   */
  residualPlanungsluecke?: number;
}

export function KitaPlanungsraumMeldebeitrag({
  planungsraumId,
  planungsraumBezeichnung,
  residualPlanungsluecke,
}: Props) {
  const base = demoKitaMeldeeingang;
  const [session, setSession] = useState<MeldeeingangSessionFreigabe | null>(null);

  const refreshSession = useCallback(() => {
    setSession(readSessionFreigabe());
  }, []);

  useEffect(() => {
    refreshSession();
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

  const eintraege = useMemo(() => {
    const all = applySession(base.eintraege, session);
    return all.filter(e => e.planungsraumId === planungsraumId);
  }, [base.eintraege, session, planungsraumId]);

  const meldebasis = useMemo(() => {
    if (eintraege.length === 0) return undefined;
    return derivePlanungsraumMeldebasis(eintraege)[0];
  }, [eintraege]);

  const residual =
    typeof residualPlanungsluecke === 'number' && residualPlanungsluecke > 0
      ? residualPlanungsluecke
      : 0;

  if (eintraege.length === 0) {
    return (
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
        }}
      >
        Keine Demo-Stichprobe für Einrichtungsmeldungen in diesem Planungsraum.
        {residual > 0 && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
            Residuale Planungslücke (Demo-Näherung): <strong>{residual}</strong> – ohne
            Meldebasis-Stichprobe kein methodischer Meldelücken-Hinweis.
          </p>
        )}
      </div>
    );
  }

  const freigegeben = eintraege.filter(e => e.status === 'FREIGEGEBEN');
  const luecken = eintraege.filter(e => e.status !== 'FREIGEGEBEN');
  const sessionEintrag =
    session &&
    freigegeben.find(
      e => e.freigabeId === session.freigabeId && e.planungsraumId === planungsraumId
    );
  const hasSessionHighlight = Boolean(sessionEintrag);

  const borderColor = hasSessionHighlight
    ? 'var(--color-success)'
    : luecken.some(e => e.status === 'UEBERFAELLIG')
      ? 'var(--color-danger)'
      : luecken.length > 0
        ? 'var(--color-warning)'
        : 'var(--color-border)';

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.75rem 0.85rem',
        borderRadius: 'var(--radius)',
        border: `1px solid ${borderColor}`,
        background: hasSessionHighlight
          ? 'var(--color-success-light, #f0faf4)'
          : 'var(--color-neutral-light)',
        fontSize: '0.875rem',
      }}
      role="region"
      aria-label={`Meldebeitrag Planungsraum ${planungsraumBezeichnung}`}
    >
      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-text-muted)',
          marginBottom: '0.45rem',
        }}
      >
        Beitrag freigegebener Meldungen · {planungsraumBezeichnung}
      </div>

      <p style={{ margin: '0 0 0.65rem', fontSize: '0.8rem', color: 'var(--color-text)' }}>
        {freigegeben.length} von {eintraege.length} Einrichtung
        {eintraege.length === 1 ? '' : 'en'} der Demo-Stichprobe für {base.monatsLabel}{' '}
        freigegeben
        {luecken.length > 0
          ? ' – fehlende Meldungen fließen nicht in die Aggregation ein (keine Interpolation).'
          : '.'}
      </p>

      {/* Residual ↔ Meldelücke (Hinweis-only, wie Bedarfsplanung / Explorer) */}
      {residual > 0 && (
        <div
          style={{
            marginBottom: '0.65rem',
            padding: '0.55rem 0.7rem',
            borderRadius: 'var(--radius)',
            background: 'rgba(255,255,255,0.7)',
            border:
              meldebasis?.hatDatenluecke
                ? '1px solid var(--color-warning)'
                : '1px solid var(--color-border)',
          }}
          role="note"
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem 1.25rem',
              alignItems: 'baseline',
              marginBottom: meldebasis?.hatDatenluecke ? '0.4rem' : 0,
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Residuale Planungslücke
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{residual}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Meldebasis
              </div>
              <MeldebasisBadge basis={meldebasis} />
            </div>
          </div>
          <ResidualMeldeHinweis basis={meldebasis} residual={residual} />
          {!meldebasis?.hatDatenluecke && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Demo-Näherung: Warteliste − frei − geplante Maßnahmen. Keine Interpolation
              fehlender Meldungen.
            </p>
          )}
        </div>
      )}

      {hasSessionHighlight && sessionEintrag && (
        <div
          style={{
            marginBottom: '0.65rem',
            padding: '0.55rem 0.7rem',
            borderLeft: '3px solid var(--color-success)',
            background: 'rgba(255,255,255,0.65)',
            borderRadius: '0 var(--radius) var(--radius) 0',
          }}
          role="status"
        >
          <strong style={{ color: 'var(--color-success)' }}>
            Neu im Meldeeingang (Demo-Session)
          </strong>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem' }}>
            <strong>{sessionEintrag.einrichtungBezeichnung}</strong> liefert nach Freigabe
            Aggregate für Planungsraum {planungsraumBezeichnung}. Freigabe-ID{' '}
            <span style={{ fontFamily: 'monospace' }}>{sessionEintrag.freigabeId}</span>
            {sessionEintrag.freigegebenAm ? ` · ${sessionEintrag.freigegebenAm}` : ''}.
            Nur freigegebene Kennzahlen – keine Kind- oder Personennamen.
          </p>
        </div>
      )}

      <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {eintraege.map(e => {
          const st = statusMeta(e.status);
          const isSessionNeu =
            session &&
            e.status === 'FREIGEGEBEN' &&
            e.freigabeId === session.freigabeId;
          return (
            <li
              key={e.meldungId}
              style={{
                listStyle: 'disc',
                fontWeight: isSessionNeu ? 600 : 400,
              }}
            >
              <span>{e.einrichtungBezeichnung}</span>
              {' · '}
              <span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span>
              {isSessionNeu && (
                <span
                  className="badge badge-primary"
                  style={{
                    marginLeft: '0.4rem',
                    fontSize: '0.7rem',
                    verticalAlign: 'middle',
                  }}
                >
                  Session
                </span>
              )}
              {e.status === 'FREIGEGEBEN' && e.kennzahlen ? (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-text)',
                    marginTop: '0.2rem',
                    fontWeight: 400,
                  }}
                >
                  WL {e.kennzahlen.wartelisteBestand}
                  {' · '}Frei {e.kennzahlen.freiePlaetze}
                  {' · '}Ausl. {fmtNum(e.kennzahlen.auslastungsgradProzent, 1)} %
                  {' · '}Pers.-Ausf. {fmtNum(e.kennzahlen.personalAusfallquoteProzent, 1)} %
                  {e.kennzahlen.tagePersonalschluesselUnterschritten > 0 && (
                    <span style={{ color: 'var(--color-warning)' }}>
                      {' · '}Schlüssel↓ {e.kennzahlen.tagePersonalschluesselUnterschritten} T.
                    </span>
                  )}
                </div>
              ) : e.einrichtungId === 'EINR-DEMO-01' ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Keine Aggregate sichtbar ·{' '}
                  <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
                    Freigabe US-KJ-004
                  </Link>
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Keine Aggregate sichtbar (unfreigegeben)
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Abschnittshinweis im Lagebild: residuale Lücken mit Meldebasis-Lücken verknüpfen
 * (client-seitig wegen Session-Meldeeingang).
 */
export function KitaLagebildResidualSummenHinweis({
  residualByRaumId,
}: {
  residualByRaumId: Record<string, number>;
}) {
  const { basen } = useMeldeeingangFuerBedarfsplanung();
  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const [id, residual] of Object.entries(residualByRaumId)) {
      m.set(id, residual);
    }
    return m;
  }, [residualByRaumId]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <ResidualMeldeSummenHinweis basen={basen} residualByRaumId={map} />
    </div>
  );
}
