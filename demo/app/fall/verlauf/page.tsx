import { demoFall } from '@/data/mockFall';
import { EreignisTyp } from '@/types';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { FairnessPanel } from '@/components/fairness/FairnessPanel';

const ereignisLabels: Record<EreignisTyp, string> = {
  FALL_ANGELEGT: 'Fall angelegt',
  DOKUMENT_ANGEFORDERT: 'Dokument angefordert',
  DOKUMENT_EINGEREICHT: 'Dokument eingereicht',
  RUECKFRAGE_GESTELLT: 'Rückfrage gestellt',
  RUECKFRAGE_BEANTWORTET: 'Rückfrage beantwortet',
  TERMIN_ZUGETEILT: 'Termin zugeteilt',
  STATUS_GEAENDERT: 'Status geändert',
  BESCHEID_ERSTELLT: 'Bescheid erstellt',
  BESCHEID_ZUGESTELLT: 'Bescheid zugestellt',
  WIDERSPRUCH_EINGEREICHT: 'Widerspruch eingereicht',
};

const stelleLabel: Record<string, string> = {
  BUERGER: 'Sie (Bürger)',
  SACHBEARBEITUNG: 'Sachbearbeitung',
  SYSTEM: 'System',
};

export default function VerlaufPage() {
  const { timeline } = demoFall;
  const pauseSignale = berechneFairnessSignale(demoFall).filter(
    s => s.typ === 'FALL_PAUSIERT'
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
        <span className="badge badge-primary">US-AV-007</span>
        <span>Historie nachvollziehen</span>
      </div>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Verlauf</h1>
        <p>Chronologische Übersicht aller Ereignisse in Ihrem Fall. Jede Handlung ist dokumentiert und nachvollziehbar.</p>
      </div>

      {pauseSignale.length > 0 && (
        <FairnessPanel signale={pauseSignale} kompakt={true} />
      )}
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: '0.65rem', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />
        {[...timeline].reverse().map((e, i) => (
          <div key={e.id} style={{ position: 'relative', marginBottom: i < timeline.length - 1 ? '1.5rem' : 0 }}>
            <div style={{ position: 'absolute', left: '-1.5rem', top: '0.4rem', width: '12px', height: '12px', borderRadius: '50%', background: e.handelndeStelle === 'BUERGER' ? 'var(--color-primary)' : e.handelndeStelle === 'SACHBEARBEITUNG' ? 'var(--color-success)' : 'var(--color-border)', border: '2px solid white', zIndex: 1 }} />
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{ereignisLabels[e.typ]}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{stelleLabel[e.handelndeStelle]}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{e.zeitstempel}</span>
              </div>
              <p style={{ marginTop: '0.5rem', fontWeight: 500, color: 'var(--color-text)' }}>{e.beschreibung}</p>
              {e.details && <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-neutral)' }}>{e.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
