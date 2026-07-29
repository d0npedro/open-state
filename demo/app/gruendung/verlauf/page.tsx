'use client';

import { useMemo, useState } from 'react';
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

const stelleLabel: Record<Exclude<StelleFilter, 'ALLE'>, string> = {
  GRUENDER: 'Sie',
  BEHOERDE: 'Behörde',
  SYSTEM:   'System',
};

const stelleDotStyle: Record<Exclude<StelleFilter, 'ALLE'>, React.CSSProperties> = {
  GRUENDER: { background: 'var(--color-primary)' },
  BEHOERDE: { background: 'var(--color-success)' },
  SYSTEM:   { background: 'white', border: '2px solid var(--color-border)' },
};

const filterOptions: { id: StelleFilter; label: string }[] = [
  { id: 'ALLE',     label: 'Alle' },
  { id: 'GRUENDER', label: 'Sie' },
  { id: 'BEHOERDE', label: 'Behörde' },
  { id: 'SYSTEM',   label: 'System' },
];

export default function VerlaufPage() {
  const { akte } = useGruendungState();
  const [filter, setFilter] = useState<StelleFilter>('ALLE');

  const counts = useMemo(() => {
    const base = { ALLE: 0, GRUENDER: 0, BEHOERDE: 0, SYSTEM: 0 };
    for (const e of akte.ereignisse) {
      base.ALLE += 1;
      base[e.handelndeStelle] += 1;
    }
    return base;
  }, [akte.ereignisse]);

  const chronologisch = useMemo(() => {
    const list = filter === 'ALLE'
      ? akte.ereignisse
      : akte.ereignisse.filter(e => e.handelndeStelle === filter);
    return [...list].reverse();
  }, [akte.ereignisse, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Verlauf Ihrer Akte</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Jede Handlung ist <strong>unveränderlich dokumentiert</strong> — keine Behörde kann Einträge löschen oder ändern.
        </p>
      </div>

      {/* Filter nach handelnder Stelle */}
      <div className="card" style={{ padding: '0.875rem 1rem' }}>
        <div
          role="group"
          aria-label="Verlauf filtern nach handelnder Stelle"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
            Zeigen:
          </span>
          {filterOptions.map(opt => {
            const active = filter === opt.id;
            const count = counts[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(opt.id)}
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
        <p style={{ margin: '0.65rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {filter === 'ALLE'
            ? `${counts.ALLE} Einträge insgesamt`
            : `${chronologisch.length} von ${counts.ALLE} Einträgen · Filter: ${stelleLabel[filter]}`}
        </p>
      </div>

      {/* Timeline */}
      {chronologisch.length === 0 ? (
        <div className="notice-box notice-box-neutral" role="status">
          <Icon name="clock" size={15} style={{ flexShrink: 0 }} />
          <span>
            {filter === 'SYSTEM'
              ? 'Noch keine System-Einträge. Automatische Statusmeldungen erscheinen hier nach Demo-Aktionen.'
              : `Keine Einträge für „${filter === 'ALLE' ? 'Alle' : stelleLabel[filter as Exclude<StelleFilter, 'ALLE'>]}“.`}
          </span>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
          <div style={{ position: 'absolute', left: '0.7rem', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />
          {chronologisch.map((e, i) => {
            const behörde = e.behördeId ? akte.beteiligteBehörden.find(b => b.id === e.behördeId) : undefined;
            return (
              <div key={e.id} style={{ position: 'relative', marginBottom: i < chronologisch.length - 1 ? '1.25rem' : 0 }}>
                <div style={{
                  position: 'absolute', left: '-1.75rem', top: '0.875rem',
                  width: 12, height: 12, borderRadius: '50%',
                  zIndex: 1, flexShrink: 0,
                  ...stelleDotStyle[e.handelndeStelle],
                }} />
                <div className="card" style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {ereignisLabels[e.typ]}
                      </span>
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
