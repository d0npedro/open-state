'use client';

/**
 * Datenbasis Bedarfsplanung aus Meldeeingang (US-KJ-004 → US-KJ-007)
 *
 * Leitet je Planungsraum ab, ob freigegebene Monatsmeldungen fehlen.
 * Südost: Kita Sonnenwinkel initial überfällig → Datenlücke in der Planung;
 * nach Session-Freigabe in /kita/meldung geschlossen (Aggregate sichtbar).
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

export interface PlanungsraumMeldebasis {
  planungsraumId: string;
  planungsraumBezeichnung: string;
  eintraege: MeldeeingangEintrag[];
  freigegeben: number;
  erwartet: number;
  luecken: MeldeeingangEintrag[];
  /** true wenn mindestens eine Meldung nicht freigegeben ist */
  hatDatenluecke: boolean;
  /** strengste Lücke: UEBERFAELLIG > AUSSTEHEND > ENTWURF */
  schwere: 'OK' | 'AUSSTEHEND' | 'UEBERFAELLIG';
}

export function derivePlanungsraumMeldebasis(
  eintraege: MeldeeingangEintrag[]
): PlanungsraumMeldebasis[] {
  const byRaum = new Map<string, MeldeeingangEintrag[]>();
  for (const e of eintraege) {
    const list = byRaum.get(e.planungsraumId) ?? [];
    list.push(e);
    byRaum.set(e.planungsraumId, list);
  }

  return Array.from(byRaum.entries()).map(([planungsraumId, raumEintraege]) => {
    const freigegeben = raumEintraege.filter(e => e.status === 'FREIGEGEBEN');
    const luecken = raumEintraege.filter(e => e.status !== 'FREIGEGEBEN');
    let schwere: PlanungsraumMeldebasis['schwere'] = 'OK';
    if (luecken.some(e => e.status === 'UEBERFAELLIG')) schwere = 'UEBERFAELLIG';
    else if (luecken.length > 0) schwere = 'AUSSTEHEND';

    return {
      planungsraumId,
      planungsraumBezeichnung: raumEintraege[0]?.planungsraumBezeichnung ?? planungsraumId,
      eintraege: raumEintraege,
      freigegeben: freigegeben.length,
      erwartet: raumEintraege.length,
      luecken,
      hatDatenluecke: luecken.length > 0,
      schwere,
    };
  });
}

export function useMeldeeingangFuerBedarfsplanung() {
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
      if (ev.key === MELDEEINGANG_SESSION_KEY || ev.key === null) refreshSession();
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

  const basen = useMemo(() => derivePlanungsraumMeldebasis(eintraege), [eintraege]);

  const byRaumId = useMemo(() => {
    const m = new Map<string, PlanungsraumMeldebasis>();
    for (const b of basen) m.set(b.planungsraumId, b);
    return m;
  }, [basen]);

  return { base, session, hydrated, eintraege, basen, byRaumId };
}

/** Badge für Planungsraum-Zeile in der Bedarfsplanungstabelle (reine Darstellung) */
export function MeldebasisBadge({ basis }: { basis: PlanungsraumMeldebasis | undefined }) {
  if (!basis) {
    return (
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} title="Keine Stichprobe">
        k. A.
      </span>
    );
  }
  if (!basis.hatDatenluecke) {
    return (
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
        vollständig
      </span>
    );
  }
  const color =
    basis.schwere === 'UEBERFAELLIG' ? 'var(--color-danger)' : 'var(--color-warning)';
  return (
    <span
      style={{ fontSize: '0.75rem', fontWeight: 600, color }}
      title={basis.luecken.map(e => `${e.einrichtungBezeichnung}: ${e.status}`).join('; ')}
    >
      Lücke ({basis.freigegeben}/{basis.erwartet})
    </span>
  );
}

/**
 * Hinweis-only: residuale Planungslücke methodisch an fehlende Meldung knüpfen.
 * Keine Änderung der Residualzahl, keine Interpolation – nur methodische Einschränkung.
 */
export function ResidualMeldeHinweis({
  basis,
  residual,
  compact = false,
}: {
  basis: PlanungsraumMeldebasis | undefined;
  residual: number;
  compact?: boolean;
}) {
  if (!basis?.hatDatenluecke || residual <= 0) return null;

  const einrKurz = basis.luecken.map(e => e.einrichtungBezeichnung).join(', ');
  const statusLabel =
    basis.schwere === 'UEBERFAELLIG' ? 'überfällige Freigabe' : 'ausstehende Freigabe';

  if (compact) {
    return (
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          lineHeight: 1.35,
          marginTop: '0.25rem',
          maxWidth: '11rem',
        }}
        title={
          `Residuale Lücke ${residual} basiert auf dem Lagebild-Stand. ` +
          `Fehlende freigegebene Meldung (${einrKurz}, ${statusLabel}) mindert die Aussagekraft – ` +
          `keine Schätzung der fehlenden Aggregate.`
        }
      >
        Aussagekraft gemindert · {statusLabel}
      </div>
    );
  }

  return (
    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
      Residuale Planungslücke <strong>{residual}</strong> für{' '}
      <strong>{basis.planungsraumBezeichnung}</strong> stützt sich auf den freigegebenen
      Lagebild-Stand. Fehlende freigegebene Einrichtungsmeldung ({einrKurz}, {statusLabel})
      fließt nicht ein und wird nicht interpoliert – die Lückenzahl bleibt eine Planungshilfe mit
      eingeschränkter Datenbasis.
    </p>
  );
}

/** Kurzbox unter Kennzahlensumme: residuale Lücken mit Meldebasis-Lücken verknüpfen */
export function ResidualMeldeSummenHinweis({
  basen,
  residualByRaumId,
  highlightRaumId = 'PR-03',
}: {
  basen: PlanungsraumMeldebasis[];
  residualByRaumId: Map<string, number>;
  highlightRaumId?: string;
}) {
  const betroffen = basen.filter(
    b => b.hatDatenluecke && (residualByRaumId.get(b.planungsraumId) ?? 0) > 0
  );
  if (betroffen.length === 0) return null;

  const highlight = betroffen.find(b => b.planungsraumId === highlightRaumId) ?? betroffen[0];
  const residual = residualByRaumId.get(highlight.planungsraumId) ?? 0;

  return (
    <div className="notice-box notice-box-warn" role="note" style={{ margin: 0 }}>
      <div style={{ fontSize: '0.875rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
          Residuale Planungslücke und Meldelücke (methodisch)
        </strong>
        <ResidualMeldeHinweis basis={highlight} residual={residual} />
        {betroffen.length > 1 && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Weitere Räume mit unvollständiger Meldebasis und residualer Lücke:{' '}
            {betroffen
              .filter(b => b.planungsraumId !== highlight.planungsraumId)
              .map(b => {
                const r = residualByRaumId.get(b.planungsraumId) ?? 0;
                return `${b.planungsraumBezeichnung} (Residual ${r}, Meldungen ${b.freigegeben}/${b.erwartet})`;
              })
              .join('; ')}
            .
          </p>
        )}
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Hinweis only – Zahlen unverändert. Verwandt:{' '}
          <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
            Monatsmeldung freigeben
          </Link>
          {' · '}
          <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>
            Meldeeingang im Lagebild
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

interface PanelProps {
  basen: PlanungsraumMeldebasis[];
  session: MeldeeingangSessionFreigabe | null;
  hydrated: boolean;
  monatsLabel: string;
  fiktivesHeute: string;
  methodikKurz: string;
  highlightRaumId?: string;
}

/** Präsentationspanel – Session-Daten kommen vom Parent-Hook */
export function KitaBedarfsplanungDatenbasisPanel({
  basen,
  session,
  hydrated,
  monatsLabel,
  fiktivesHeute,
  methodikKurz,
  highlightRaumId = 'PR-03',
}: PanelProps) {
  const highlight = basen.find(b => b.planungsraumId === highlightRaumId);
  const lueckenGesamt = basen.filter(b => b.hatDatenluecke);
  const sessionSchliesstSuedost =
    Boolean(session) &&
    highlight &&
    !highlight.hatDatenluecke &&
    highlight.eintraege.some(e => e.freigabeId === session?.freigabeId);

  return (
    <section
      aria-labelledby="bp-meldebasis-titel"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div>
        <h2 id="bp-meldebasis-titel" style={{ marginBottom: '0.35rem' }}>
          Datenbasis aus Meldeeingang
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, maxWidth: '46rem' }}>
          Planungslücken und Kennzahlen je Planungsraum stützen sich auf freigegebene
          Einrichtungsmeldungen ({monatsLabel}). Fehlende Meldungen werden als
          Datenlücke ausgewiesen – nicht interpoliert. Demo-Stichtag {fiktivesHeute}.
        </p>
      </div>

      {highlight && highlight.hatDatenluecke && (
        <div className="notice-box notice-box-warn" role="status">
          <div style={{ fontSize: '0.875rem' }}>
            <strong>
              Datenlücke Planungsraum {highlight.planungsraumBezeichnung}
            </strong>
            <p style={{ margin: '0.4rem 0 0', lineHeight: 1.55 }}>
              {highlight.luecken.map(e => (
                <span key={e.meldungId}>
                  <strong>{e.einrichtungBezeichnung}</strong>
                  {' – '}
                  <span style={{ color: statusMeta(e.status).color, fontWeight: 600 }}>
                    {statusMeta(e.status).label}
                  </span>
                  {e.einrichtungId === 'EINR-DEMO-01' && (
                    <>
                      {' · '}
                      <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
                        Freigabe in US-KJ-004
                      </Link>
                    </>
                  )}
                  . Aggregate dieser Einrichtung fließen nicht in den Bedarfsplanungsentwurf ein.
                </span>
              ))}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Quelle: Meldeeingang Jugendamt (Demo-Stichprobe) · Methode wie im Steuerungslagebild.
            </p>
          </div>
        </div>
      )}

      {sessionSchliesstSuedost && (
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
            Datenlücke {highlight?.planungsraumBezeichnung} geschlossen (Demo-Session)
          </strong>
          <p style={{ fontSize: '0.875rem', margin: '0.4rem 0 0' }}>
            Freigabe Kita Sonnenwinkel ist im Meldeeingang angekommen und kann für die
            Bedarfsplanung berücksichtigt werden. Freigabe-ID{' '}
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
            gridTemplateColumns:
              'minmax(7rem, 1fr) minmax(5rem, 0.6fr) minmax(8rem, 1.2fr) minmax(7rem, 1fr)',
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
          <span>Planungsraum</span>
          <span>Meldungen</span>
          <span>Datenbasis</span>
          <span>Fehlende Einrichtungen</span>
        </div>
        {basen.map(b => {
          const isHighlight = b.planungsraumId === highlightRaumId;
          const borderColor =
            b.schwere === 'UEBERFAELLIG'
              ? 'var(--color-danger)'
              : b.schwere === 'AUSSTEHEND'
                ? 'var(--color-warning)'
                : 'var(--color-success)';
          return (
            <div
              key={b.planungsraumId}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(7rem, 1fr) minmax(5rem, 0.6fr) minmax(8rem, 1.2fr) minmax(7rem, 1fr)',
                gap: '0.5rem 1rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                borderBottom: '1px solid var(--color-border)',
                borderLeft: isHighlight ? `4px solid ${borderColor}` : '4px solid transparent',
                background: isHighlight ? 'var(--color-neutral-light)' : undefined,
                alignItems: 'start',
              }}
            >
              <div style={{ fontWeight: isHighlight ? 700 : 600 }}>
                {b.planungsraumBezeichnung}
                {isHighlight && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    Fokus US-KJ-007
                  </div>
                )}
              </div>
              <div>
                {b.freigegeben}/{b.erwartet}
              </div>
              <div style={{ fontWeight: 600, color: borderColor }}>
                {b.hatDatenluecke
                  ? b.schwere === 'UEBERFAELLIG'
                    ? 'Datenlücke (überfällig)'
                    : 'Datenlücke (ausstehend)'
                  : 'Vollständig'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {b.luecken.length === 0
                  ? '—'
                  : b.luecken.map(e => e.einrichtungBezeichnung).join(', ')}
              </div>
            </div>
          );
        })}
      </div>

      {lueckenGesamt.length > 0 && (
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
          {lueckenGesamt.length} Planungsraum{lueckenGesamt.length === 1 ? '' : 'e'} mit
          unvollständiger Meldebasis. Die Planungslücke in der Tabelle basiert weiterhin auf
          dem freigegebenen Lagebild-Stand – fehlende Einrichtungsmeldungen mindern die
          Aussagekraft, werden aber nicht geschätzt.
        </p>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
        {methodikKurz}{' '}
        {!hydrated && <span aria-hidden="true"> Session-Stand wird geladen…</span>}
        {' '}Verwandt:{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>
          Steuerungslagebild / Meldeeingang
        </Link>
        {' · '}
        <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
          Monatsmeldung freigeben
        </Link>
        .
      </p>
    </section>
  );
}

interface Props {
  /** Hervorhebung eines Planungsraums (z. B. PR-03 Südost) */
  highlightRaumId?: string;
}

/** Komfort-Wrapper mit eigenem Session-Hook (standalone) */
export function KitaBedarfsplanungDatenbasis({ highlightRaumId = 'PR-03' }: Props) {
  const { base, session, hydrated, basen } = useMeldeeingangFuerBedarfsplanung();
  return (
    <KitaBedarfsplanungDatenbasisPanel
      basen={basen}
      session={session}
      hydrated={hydrated}
      monatsLabel={base.monatsLabel}
      fiktivesHeute={base.fiktivesHeute}
      methodikKurz={base.methodikKurz}
      highlightRaumId={highlightRaumId}
    />
  );
}
