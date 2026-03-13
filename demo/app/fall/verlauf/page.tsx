// UX-Grund: Der Verlauf ist die "Quittung" — Nutzer vertrauen dem System mehr,
// wenn sie sehen, dass ALLES dokumentiert ist.
// Farbcodierung: Bürger = blau, Behörde = grün, System = grau.
// Zeitstempel: menschlich lesbar, nicht maschinenformat.

import { demoFall } from '@/data/mockFall';
import { EreignisTyp } from '@/types';
import { berechneFairnessSignale } from '@/lib/fairness/rules';
import { Icon, IconName } from '@/components/Icon';

const ereignisLabels: Record<EreignisTyp, string> = {
  FALL_ANGELEGT:           'Antrag erstellt',
  DOKUMENT_ANGEFORDERT:    'Dokument angefordert',
  DOKUMENT_EINGEREICHT:    'Dokument eingereicht',
  RUECKFRAGE_GESTELLT:     'Rückfrage gestellt',
  RUECKFRAGE_BEANTWORTET:  'Rückfrage beantwortet',
  TERMIN_ZUGETEILT:        'Termin zugeteilt',
  STATUS_GEAENDERT:        'Status geändert',
  BESCHEID_ERSTELLT:       'Bescheid erstellt',
  BESCHEID_ZUGESTELLT:     'Bescheid zugestellt',
  WIDERSPRUCH_EINGEREICHT: 'Widerspruch eingereicht',
};

// UX-Grund: "Sie (Bürger)" statt technisches "BUERGER"
const stelleLabel: Record<string, string> = {
  BUERGER:        'Sie',
  SACHBEARBEITUNG:'Sachbearbeitung',
  SYSTEM:         'System',
};

const stelleColor: Record<string, string> = {
  BUERGER:        'var(--color-primary)',
  SACHBEARBEITUNG:'var(--color-success)',
  SYSTEM:         'var(--color-border)',
};

const ereignisIcon: Partial<Record<EreignisTyp, IconName>> = {
  FALL_ANGELEGT:          'file',
  DOKUMENT_ANGEFORDERT:   'paperclip',
  DOKUMENT_EINGEREICHT:   'upload',
  RUECKFRAGE_GESTELLT:    'chat',
  RUECKFRAGE_BEANTWORTET: 'check-circle',
  TERMIN_ZUGETEILT:       'calendar',
  STATUS_GEAENDERT:       'refresh',
  BESCHEID_ERSTELLT:      'scroll',
  BESCHEID_ZUGESTELLT:    'scroll',
  WIDERSPRUCH_EINGEREICHT:'send',
};

export default function VerlaufPage() {
  const { timeline } = demoFall;
  const pauseSignale = berechneFairnessSignale(demoFall).filter(
    s => s.typ === 'FALL_PAUSIERT'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Kopf ─────────────────────────────────────────────────── */}
      <div>
        <h1 style={{ marginBottom: '0.375rem' }}>Verlauf Ihres Antrags</h1>
        <p style={{ color: 'var(--color-neutral)' }}>
          Alle Ereignisse sind unveränderlich dokumentiert — Sie können jederzeit nachvollziehen, was passiert ist.
        </p>
      </div>

      {/* Fairness-Hinweis bei pausierten Fällen */}
      {pauseSignale.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pauseSignale.map(sig => (
            <div key={sig.id} className="notice-box notice-box-warn">
              <Icon name="alert" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{sig.titel}</strong>
                <span style={{ fontSize: '0.875rem' }}>{sig.erklaerung}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legende */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        {[
          { color: 'var(--color-primary)', label: 'Sie' },
          { color: 'var(--color-success)', label: 'Sachbearbeitung' },
          { color: 'var(--color-border)',  label: 'System' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* ─── Timeline ─────────────────────────────────────────────── */}
      {/* UX-Grund: Vertikale Timeline mit breiter Verbindungslinie ist
          auf jedem Bildschirm lesbar — kein horizontales Scrollen.    */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertikale Linie */}
        <div style={{
          position: 'absolute', left: '0.875rem', top: '1rem', bottom: '1rem',
          width: '2px', background: 'var(--color-border)',
        }} />

        {[...timeline].reverse().map((e, i) => {
          const dotColor = stelleColor[e.handelndeStelle] ?? 'var(--color-border)';
          const iconName = ereignisIcon[e.typ] ?? 'info';

          return (
            <div
              key={e.id}
              style={{ position: 'relative', marginBottom: i < timeline.length - 1 ? '1.25rem' : 0 }}
            >
              {/* Punkt auf der Linie */}
              <div style={{
                position: 'absolute',
                left: '-2rem',
                top: '1rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: dotColor,
                border: '3px solid white',
                boxShadow: '0 0 0 2px ' + dotColor,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} />

              {/* Karte */}
              <div className="card" style={{ padding: '1rem 1.125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Event-Typ */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      background: 'var(--color-neutral-light)', borderRadius: '99px',
                      padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--color-neutral)',
                    }}>
                      <Icon name={iconName as IconName} size={12} />
                      {ereignisLabels[e.typ]}
                    </span>
                    {/* Wer hat gehandelt */}
                    <span style={{ fontSize: '0.8rem', color: dotColor, fontWeight: 600 }}>
                      {stelleLabel[e.handelndeStelle]}
                    </span>
                  </div>
                  {/* Zeitstempel */}
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {e.zeitstempel}
                  </span>
                </div>

                <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.25rem', fontSize: '0.925rem' }}>
                  {e.beschreibung}
                </p>
                {e.details && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral)', margin: 0, lineHeight: 1.5 }}>
                    {e.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
