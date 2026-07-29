'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGruendungState } from '@/context/GruendungStateContext';
import { Icon } from '@/components/Icon';
import type { GruendungsEreignisTyp } from '@/types/gruendung';

const ereignisLabels: Record<GruendungsEreignisTyp, string> = {
  vorgang_erstellt:             'Vorgang erstellt',
  dokument_hochgeladen:         'Dokument übermittelt',
  vorgang_eingereicht:          'Vorgang eingereicht',
  eingang_bestaetigt:           'Eingang bestätigt',
  rueckfrage_gestellt:          'Rückfrage gestellt',
  rueckfrage_beantwortet:       'Rückfrage beantwortet',
  dokument_akzeptiert:          'Dokument akzeptiert',
  dokument_abgelehnt:           'Dokument abgelehnt',
  bescheid_erteilt:             'Bescheid erteilt',
  ablehnung_erteilt:            'Ablehnung erteilt',
  steuernummer_vergeben:        'Steuernummer vergeben',
  status_aktualisiert:          'Status aktualisiert',
  stillstand_markiert:          'Stillstand markiert',
  zustaendigkeitswechsel:       'Zuständigkeitswechsel',
  gruendungsakte_abgeschlossen: 'Akte abgeschlossen',
};

type StelleFilter = 'ALLE' | 'GRUENDER' | 'BEHOERDE' | 'SYSTEM';

/** Bürgernahe Kategorien über mehrere technische Ereignistypen */
type TypFilter = 'ALLE' | 'VORGANG' | 'DOKUMENTE' | 'RUECKFRAGEN' | 'BESCHEIDE';

const TYP_KATEGORIE: Record<Exclude<TypFilter, 'ALLE'>, readonly GruendungsEreignisTyp[]> = {
  VORGANG: [
    'vorgang_erstellt',
    'vorgang_eingereicht',
    'eingang_bestaetigt',
    'status_aktualisiert',
    'stillstand_markiert',
    'zustaendigkeitswechsel',
    'gruendungsakte_abgeschlossen',
  ],
  DOKUMENTE: [
    'dokument_hochgeladen',
    'dokument_akzeptiert',
    'dokument_abgelehnt',
  ],
  RUECKFRAGEN: [
    'rueckfrage_gestellt',
    'rueckfrage_beantwortet',
  ],
  BESCHEIDE: [
    'bescheid_erteilt',
    'ablehnung_erteilt',
    'steuernummer_vergeben',
  ],
};

const stelleLabel: Record<Exclude<StelleFilter, 'ALLE'>, string> = {
  GRUENDER: 'Sie',
  BEHOERDE: 'Behörde',
  SYSTEM:   'System',
};

const typLabel: Record<Exclude<TypFilter, 'ALLE'>, string> = {
  VORGANG:     'Vorgang',
  DOKUMENTE:   'Dokumente',
  RUECKFRAGEN: 'Rückfragen',
  BESCHEIDE:   'Bescheide',
};

const stelleDotStyle: Record<Exclude<StelleFilter, 'ALLE'>, React.CSSProperties> = {
  GRUENDER: { background: 'var(--color-primary)' },
  BEHOERDE: { background: 'var(--color-success)' },
  SYSTEM:   { background: 'white', border: '2px solid var(--color-border)' },
};

const stelleFilterOptions: { id: StelleFilter; label: string }[] = [
  { id: 'ALLE',     label: 'Alle' },
  { id: 'GRUENDER', label: 'Sie' },
  { id: 'BEHOERDE', label: 'Behörde' },
  { id: 'SYSTEM',   label: 'System' },
];

const typFilterOptions: { id: TypFilter; label: string }[] = [
  { id: 'ALLE',        label: 'Alle' },
  { id: 'VORGANG',     label: 'Vorgang' },
  { id: 'DOKUMENTE',   label: 'Dokumente' },
  { id: 'RUECKFRAGEN', label: 'Rückfragen' },
  { id: 'BESCHEIDE',   label: 'Bescheide' },
];

function matchesTyp(typ: GruendungsEreignisTyp, filter: TypFilter): boolean {
  if (filter === 'ALLE') return true;
  return (TYP_KATEGORIE[filter] as readonly GruendungsEreignisTyp[]).includes(typ);
}

export default function VerlaufPage() {
  const { akte } = useGruendungState();
  const [stelleFilter, setStelleFilter] = useState<StelleFilter>('ALLE');
  const [typFilter, setTypFilter] = useState<TypFilter>('ALLE');
  /** Hash-Tiefenlink aus Fairness-CTA (`#ere-{id}`) – Ziel-Karte hervorheben. */
  const [hashEreignisId, setHashEreignisId] = useState<string | null>(null);

  // Fairness → Verlauf: Filter zurücksetzen und zu #ere-… scrollen (US-UG-005).
  // Auch hashchange: gleiche Route mit neuem Hash remountet die Page nicht immer.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scrollTimer: number | undefined;

    const applyHash = () => {
      const raw = window.location.hash;
      if (!raw.startsWith('#ere-')) {
        setHashEreignisId(null);
        return;
      }
      const id = raw.slice('#ere-'.length);
      if (!id || !akte.ereignisse.some(e => e.id === id)) {
        setHashEreignisId(null);
        return;
      }
      setStelleFilter('ALLE');
      setTypFilter('ALLE');
      setHashEreignisId(id);
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        document.getElementById(`ere-${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 50);
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => {
      window.removeEventListener('hashchange', applyHash);
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
    };
  }, [akte.ereignisse]);

  const stelleCounts = useMemo(() => {
    const base = { ALLE: 0, GRUENDER: 0, BEHOERDE: 0, SYSTEM: 0 };
    for (const e of akte.ereignisse) {
      if (!matchesTyp(e.typ, typFilter)) continue;
      base.ALLE += 1;
      base[e.handelndeStelle] += 1;
    }
    return base;
  }, [akte.ereignisse, typFilter]);

  const typCounts = useMemo(() => {
    const base: Record<TypFilter, number> = {
      ALLE: 0,
      VORGANG: 0,
      DOKUMENTE: 0,
      RUECKFRAGEN: 0,
      BESCHEIDE: 0,
    };
    for (const e of akte.ereignisse) {
      if (stelleFilter !== 'ALLE' && e.handelndeStelle !== stelleFilter) continue;
      base.ALLE += 1;
      for (const key of Object.keys(TYP_KATEGORIE) as Exclude<TypFilter, 'ALLE'>[]) {
        if ((TYP_KATEGORIE[key] as readonly GruendungsEreignisTyp[]).includes(e.typ)) {
          base[key] += 1;
        }
      }
    }
    return base;
  }, [akte.ereignisse, stelleFilter]);

  const chronologisch = useMemo(() => {
    const list = akte.ereignisse.filter(e => {
      if (stelleFilter !== 'ALLE' && e.handelndeStelle !== stelleFilter) return false;
      if (!matchesTyp(e.typ, typFilter)) return false;
      return true;
    });
    return [...list].reverse();
  }, [akte.ereignisse, stelleFilter, typFilter]);

  const totalCount = akte.ereignisse.length;

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (stelleFilter !== 'ALLE') parts.push(stelleLabel[stelleFilter]);
    if (typFilter !== 'ALLE') parts.push(typLabel[typFilter]);
    if (parts.length === 0) return `${totalCount} Einträge insgesamt`;
    return `${chronologisch.length} von ${totalCount} Einträgen · Filter: ${parts.join(' · ')}`;
  }, [stelleFilter, typFilter, chronologisch.length, totalCount]);

  const emptyMessage = useMemo(() => {
    if (stelleFilter === 'SYSTEM' && typFilter === 'ALLE') {
      return 'Noch keine System-Einträge. Automatische Statusmeldungen erscheinen hier nach Demo-Aktionen.';
    }
    const parts: string[] = [];
    if (stelleFilter !== 'ALLE') parts.push(stelleLabel[stelleFilter]);
    if (typFilter !== 'ALLE') parts.push(typLabel[typFilter]);
    if (parts.length === 0) return 'Keine Einträge.';
    return `Keine Einträge für „${parts.join(' · ')}“.`;
  }, [stelleFilter, typFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Verlauf Ihrer Akte</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Jede Handlung ist <strong>unveränderlich dokumentiert</strong> — keine Behörde kann Einträge löschen oder ändern.
        </p>
      </div>

      {/* Filter: handelnde Stelle + Ereignistyp */}
      <div className="card" style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div
          role="group"
          aria-label="Verlauf filtern nach handelnder Stelle"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
            Von:
          </span>
          {stelleFilterOptions.map(opt => {
            const active = stelleFilter === opt.id;
            const count = stelleCounts[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => setStelleFilter(opt.id)}
                className={active ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {opt.id !== 'ALLE' && (
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      flexShrink: 0,
                      ...stelleDotStyle[opt.id],
                    }}
                  />
                )}
                {opt.label}
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.85,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Verlauf filtern nach Ereignistyp"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
            Art:
          </span>
          {typFilterOptions.map(opt => {
            const active = typFilter === opt.id;
            const count = typCounts[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTypFilter(opt.id)}
                className={active ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {opt.label}
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.85,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {filterSummary}
        </p>
      </div>

      {/* Timeline */}
      {chronologisch.length === 0 ? (
        <div className="notice-box notice-box-neutral" role="status">
          <Icon name="clock" size={15} style={{ flexShrink: 0 }} />
          <span>{emptyMessage}</span>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
          <div style={{ position: 'absolute', left: '0.7rem', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />
          {chronologisch.map((e, i) => {
            const behörde = e.behördeId ? akte.beteiligteBehörden.find(b => b.id === e.behördeId) : undefined;
            const isHashTarget = hashEreignisId === e.id;
            /** Session-Demo-Ereignisse (Antwort, Upload, BG) – optisch von Mock-Historie abheben. */
            const isSessionEvent = e.id.startsWith('UG-DEMO-');
            const isSessionAntwort = e.typ === 'rueckfrage_beantwortet' && isSessionEvent;
            return (
              <div key={e.id} style={{ position: 'relative', marginBottom: i < chronologisch.length - 1 ? '1.25rem' : 0 }}>
                <div style={{
                  position: 'absolute', left: '-1.75rem', top: '0.875rem',
                  width: 12, height: 12, borderRadius: '50%',
                  zIndex: 1, flexShrink: 0,
                  ...stelleDotStyle[e.handelndeStelle],
                }} />
                <div
                  id={`ere-${e.id}`}
                  data-testid={`verlauf-ereignis-${e.id}`}
                  className="card"
                  data-session-event={isSessionEvent ? 'true' : undefined}
                  data-session-antwort={isSessionAntwort ? 'true' : undefined}
                  style={{
                    padding: '0.875rem 1rem',
                    scrollMarginTop: '5rem',
                    ...(isHashTarget
                      ? {
                          outline: '2px solid var(--color-primary)',
                          outlineOffset: '2px',
                          boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-primary) 18%, transparent)',
                        }
                      : isSessionAntwort
                        ? {
                            borderLeft: '4px solid var(--color-success)',
                          }
                        : {}),
                  }}
                  aria-current={isHashTarget ? 'location' : undefined}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {ereignisLabels[e.typ]}
                      </span>
                      {isSessionAntwort && (
                        <span
                          className="status-chip status-chip-success"
                          style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}
                          data-testid={`verlauf-session-antwort-badge-${e.id}`}
                        >
                          Ihre Antwort
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {stelleLabel[e.handelndeStelle]}
                        {behörde && ` · ${behörde.bezeichnung}`}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{e.zeitstempel}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.45 }}>{e.beschreibung}</p>
                  {e.details && (
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-neutral)', lineHeight: 1.4 }}>{e.details}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="notice-box notice-box-neutral" style={{ fontSize: '0.8rem' }}>
        <Icon name="shield" size={15} style={{ flexShrink: 0 }} />
        <span>
          Der Verlauf ist kryptografisch gesichert. Alle Behördenzugriffe auf die Akte werden ebenfalls protokolliert.
        </span>
      </div>
    </div>
  );
}
