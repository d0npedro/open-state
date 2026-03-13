'use client';

import { useGruendungState } from '@/context/GruendungStateContext';
import type { GruendungsEreignisTyp } from '@/types/gruendung';

const ereignisLabels: Record<GruendungsEreignisTyp, string> = {
  vorgang_erstellt:           'Vorgang erstellt',
  dokument_hochgeladen:       'Dokument übermittelt',
  vorgang_eingereicht:        'Vorgang eingereicht',
  eingang_bestaetigt:         'Eingang bestätigt',
  rueckfrage_gestellt:        'Rückfrage gestellt',
  rueckfrage_beantwortet:     'Rückfrage beantwortet',
  dokument_akzeptiert:        'Dokument akzeptiert',
  dokument_abgelehnt:         'Dokument abgelehnt',
  bescheid_erteilt:           'Bescheid / Genehmigung erteilt',
  ablehnung_erteilt:          'Ablehnungsbescheid erteilt',
  steuernummer_vergeben:      'Steuernummer vergeben',
  status_aktualisiert:        'Status aktualisiert',
  stillstand_markiert:        'Stillstand markiert',
  zustaendigkeitswechsel:     'Zuständigkeitswechsel',
  gruendungsakte_abgeschlossen: 'Gründungsakte abgeschlossen',
};

const stelleLabel: Record<string, string> = {
  GRUENDER:  'Sie (Gründer)',
  BEHOERDE:  'Behörde',
  SYSTEM:    'System',
};

const stelleColor: Record<string, string> = {
  GRUENDER:  'var(--color-primary)',
  BEHOERDE:  'var(--color-success)',
  SYSTEM:    'var(--color-border)',
};

export default function VerlaufPage() {
  const { akte } = useGruendungState();
  const chronologisch = [...akte.ereignisse].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-neutral">US-UG-006</span>
        <span>Verfahrensverlauf nachvollziehen (Story geplant)</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Verlauf</h1>
        <p>Chronologische Übersicht aller Ereignisse in Ihrer Gründungsakte. Jede Handlung ist unveränderlich dokumentiert.</p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: '0.65rem', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />
        {chronologisch.map((e, i) => {
          const behörde = e.behördeId ? akte.beteiligteBehörden.find(b => b.id === e.behördeId) : undefined;
          return (
            <div key={e.id} style={{ position: 'relative', marginBottom: i < chronologisch.length - 1 ? '1.25rem' : 0 }}>
              <div style={{
                position: 'absolute', left: '-1.5rem', top: '0.4rem',
                width: '12px', height: '12px', borderRadius: '50%',
                background: stelleColor[e.handelndeStelle],
                border: '2px solid white', zIndex: 1,
              }} />
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{ereignisLabels[e.typ]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{stelleLabel[e.handelndeStelle]}</span>
                    {behörde && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{behörde.bezeichnung}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{e.zeitstempel}</span>
                </div>
                <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-text)' }}>{e.beschreibung}</p>
                {e.details && <p style={{ marginTop: '0.25rem', marginBottom: 0, fontSize: '0.875rem', color: 'var(--color-neutral)' }}>{e.details}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0.875rem 1rem', background: 'var(--color-neutral-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        Der Verlauf ist unveränderlich und kryptografisch gesichert. Kein Eintrag kann nachträglich gelöscht oder geändert werden.
        Alle Behördenzugriffe auf die Akte werden ebenfalls protokolliert (hier nicht dargestellt).
      </div>
    </div>
  );
}
