'use client';

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

const stelleLabel: Record<string, string> = {
  GRUENDER: 'Sie',
  BEHOERDE: 'Behörde',
  SYSTEM:   'System',
};

const stelleDotStyle: Record<string, React.CSSProperties> = {
  GRUENDER: { background: 'var(--color-primary)' },
  BEHOERDE: { background: 'var(--color-success)' },
  SYSTEM:   { background: 'white', border: '2px solid var(--color-border)' },
};

export default function VerlaufPage() {
  const { akte } = useGruendungState();
  const chronologisch = [...akte.ereignisse].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Verlauf Ihrer Akte</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Jede Handlung ist <strong>unveränderlich dokumentiert</strong> — keine Behörde kann Einträge löschen oder ändern.
        </p>
      </div>

      {/* Legende */}
      <div className="card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          {(['GRUENDER', 'BEHOERDE', 'SYSTEM'] as const).map(stelle => (
            <div key={stelle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, ...stelleDotStyle[stelle] }} />
              <span style={{ color: 'var(--color-text-muted)' }}>{stelleLabel[stelle]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
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

      <div className="notice-box notice-box-neutral" style={{ fontSize: '0.8rem' }}>
        <Icon name="shield" size={15} style={{ flexShrink: 0 }} />
        <span>
          Der Verlauf ist kryptografisch gesichert. Alle Behördenzugriffe auf die Akte werden ebenfalls protokolliert.
        </span>
      </div>
    </div>
  );
}
