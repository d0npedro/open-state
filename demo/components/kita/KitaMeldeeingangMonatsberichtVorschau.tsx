'use client';

/**
 * Kopplung Meldeeingang (US-KJ-004→005) ↔ Monatsbericht-Vorschau (US-KJ-003)
 *
 * Im Steuerungslagebild: neben dem Eingang freigegebener Monatsmeldungen
 * den laufenden Monatsbericht (Status VORSCHAU) mit gemischten Tagesstand-Quellen
 * der Demo-Einrichtung Kita Sonnenwinkel ausweisen.
 * Nur Aggregate – keine Kind- oder Personennamen.
 */

import Link from 'next/link';
import { demoKitaMonatsberichtVorschau } from '@/data/mockKitaMonatsbericht';
import type { MeldeeingangEintrag, MeldeeingangStatus } from '@/types/kitaMeldeeingang';

function meldeStatusLabel(status: MeldeeingangStatus): { label: string; color: string } {
  switch (status) {
    case 'FREIGEGEBEN':
      return { label: 'Monatsmeldung eingegangen', color: 'var(--color-success)' };
    case 'UEBERFAELLIG':
      return { label: 'Monatsmeldung überfällig', color: 'var(--color-danger)' };
    case 'AUSSTEHEND':
      return { label: 'Monatsmeldung ausstehend', color: 'var(--color-warning)' };
    case 'ENTWURF':
      return { label: 'Monatsmeldung Entwurf', color: 'var(--color-text-muted)' };
    default:
      return { label: status, color: 'var(--color-text-muted)' };
  }
}

export function KitaMeldeeingangMonatsberichtVorschau({
  meldeeintrag,
}: {
  /** Meldeeingang-Zeile derselben Einrichtung (nach Session-Anwendung) */
  meldeeintrag: MeldeeingangEintrag | undefined;
}) {
  const v = demoKitaMonatsberichtVorschau;
  const freigegeben = v.tagesstandQuellen.filter(q => q.status === 'FREIGEGEBEN').length;
  const fehlt = v.tagesstandQuellen.filter(q => q.status === 'FEHLT').length;
  const inErfassung = v.tagesstandQuellen.filter(q => q.status === 'IN_ERFASSUNG').length;
  const melde = meldeeintrag ? meldeStatusLabel(meldeeintrag.status) : null;
  const meldeLuecke =
    meldeeintrag != null && meldeeintrag.status !== 'FREIGEGEBEN';

  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.15rem',
        borderTop: '4px solid var(--color-primary)',
      }}
      aria-labelledby="meldeeingang-vorschau-titel"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-text-muted)',
              marginBottom: '0.25rem',
            }}
          >
            Kopplung · US-KJ-003 ↔ US-KJ-005
          </div>
          <h3 id="meldeeingang-vorschau-titel" style={{ margin: 0, fontSize: '1rem' }}>
            Monatsbericht-Vorschau (laufender Monat)
          </h3>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {v.einrichtungBezeichnung} · Planungsraum {v.planungsraumBezeichnung} ·{' '}
            {v.monatsLabel}
          </p>
        </div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            background: 'var(--color-neutral-light)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius)',
          }}
        >
          Status: VORSCHAU
        </span>
      </div>

      <p style={{ fontSize: '0.875rem', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
        {v.standLabel}. Tagesstände als Betriebsdatenbasis – getrennt vom Meldeeingang der
        abgeschlossenen Monatsmeldung ({meldeeintrag?.monatsLabel ?? 'Oktober 2024'}).
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
          gap: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        {[
          {
            label: 'Freigegeben',
            val: freigegeben,
            color: 'var(--color-success)',
            hint: 'in Kennzahlen',
          },
          {
            label: 'Fehlt',
            val: fehlt,
            color: 'var(--color-danger)',
            hint: 'nicht interpoliert',
          },
          {
            label: 'In Erfassung',
            val: inErfassung,
            color: 'var(--color-warning)',
            hint: 'Entwurf, nicht gezählt',
          },
          {
            label: 'Betriebstage',
            val: v.betriebstageImMonat,
            color: 'var(--color-text)',
            hint: 'bis Stichtag',
          },
        ].map(k => (
          <div
            key={k.label}
            style={{
              background: 'var(--color-neutral-light)',
              borderRadius: 'var(--radius)',
              padding: '0.55rem 0.7rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.label}</div>
            <div style={{ fontWeight: 700, color: k.color, fontSize: '1.1rem' }}>{k.val}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.hint}</div>
          </div>
        ))}
      </div>

      {melde && (
        <div
          style={{
            fontSize: '0.875rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius)',
            background: meldeLuecke
              ? 'var(--color-warning-light, #fff8e6)'
              : 'var(--color-success-light, #f0faf4)',
            borderLeft: `3px solid ${melde.color}`,
            marginBottom: '0.85rem',
          }}
          role="status"
        >
          <strong style={{ color: melde.color }}>Meldeeingang (Abschlussmonat):</strong>{' '}
          {melde.label}
          {meldeLuecke ? (
            <>
              {' '}
              – Vorschau des laufenden Monats ersetzt die fehlende Monatsmeldung nicht. Sie zeigt
              nur freigegebene Tagesstände (US-KJ-001), ohne Lücken zu füllen.
            </>
          ) : (
            <>
              {' '}
              – Abschlussmeldung und laufende Vorschau sind parallel sichtbar; unterschiedliche
              Perioden und Quellen.
            </>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.25rem',
          fontSize: '0.875rem',
          alignItems: 'center',
        }}
      >
        <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Monatsbericht öffnen (Demo: Vorschau Nov 2024)
        </Link>
        {meldeLuecke && (
          <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
            Monatsmeldung freigeben (US-KJ-004)
          </Link>
        )}
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          {v.id}
        </span>
      </div>

      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
          margin: '0.75rem 0 0',
          lineHeight: 1.45,
        }}
      >
        Methodik: Meldeeingang = freigegebene Monatsmeldungen an das Jugendamt. Monatsbericht-Vorschau
        = Zwischenstand aus freigegebenen Tagesständen der Einrichtung. FEHLT und IN_ERFASSUNG
        bleiben Lücken bzw. Entwürfe – keine Schätzwerte. Nur Aggregate, keine Kind- oder
        Personennamen.
      </p>
    </div>
  );
}
