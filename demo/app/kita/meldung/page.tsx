'use client';

/**
 * US-KJ-004 – Meldung prüfen und freigeben (Einrichtungsebene, Demo)
 *
 * Systemvorschlag aus Monatsbericht prüfen, optional korrigieren (mit Begründung),
 * aktiv freigeben. Danach Freigabe-ID, Zeitstempel, Rolle und JA-Eingang sichtbar.
 * Prozesskette: Tagesstand (US-KJ-001) → Belegung (US-KJ-002) → Monatsbericht (US-KJ-003).
 * Druck freigabeunabhängig: Status, Korrekturen und Freigabenachweis im Ausdruck
 * (Spiegel Monatsbericht/Bedarfsplanung/Vorlage). Interaktive Phasen no-print.
 * Nur Aggregate – keine Kind- oder Personennamen. Session-lokal, kein Backend.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoKitaMonatsmeldung } from '@/data/mockKitaMeldung';
import type {
  MeldungFreigabe,
  MeldungKennzahlen,
  MeldungKorrektur,
  MeldungStatus,
} from '@/types/kitaMeldung';
import type { MeldeeingangSessionFreigabe } from '@/types/kitaMeldeeingang';
import { MELDEEINGANG_SESSION_KEY } from '@/types/kitaMeldeeingang';

type UiPhase = 'PRUEFUNG' | 'KORREKTUR' | 'BESTAETIGUNG' | 'FREIGEGEBEN';

const FELD_LABELS: Record<keyof MeldungKennzahlen, string> = {
  genehmigtePlaetze: 'Genehmigte Plätze',
  belegtePlaetze: 'Belegte Plätze',
  freiePlaetze: 'Freie Plätze (real nutzbar)',
  wartelisteBestand: 'Warteliste (Bestand)',
  personalAusfallquoteProzent: 'Personalausfallquote (%)',
  tagePersonalschluesselUnterschritten: 'Tage Personalschlüssel unterschritten',
  auslastungsgradProzent: 'Auslastungsgrad (%)',
  anwesenheitsquoteProzent: 'Anwesenheitsquote (%)',
};

const EDITABLE_FIELDS: (keyof MeldungKennzahlen)[] = [
  'genehmigtePlaetze',
  'belegtePlaetze',
  'freiePlaetze',
  'wartelisteBestand',
  'personalAusfallquoteProzent',
  'tagePersonalschluesselUnterschritten',
  'auslastungsgradProzent',
  'anwesenheitsquoteProzent',
];

function fmtNum(n: number, decimals = 0) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function isPercentField(f: keyof MeldungKennzahlen) {
  return (
    f === 'personalAusfallquoteProzent' ||
    f === 'auslastungsgradProzent' ||
    f === 'anwesenheitsquoteProzent'
  );
}

function statusMeta(
  status: MeldungStatus,
  ueberfaellig: boolean
): { label: string; color: string } {
  if (status === 'FREIGEGEBEN') {
    return { label: 'Freigegeben & übermittelt', color: 'var(--color-success)' };
  }
  if (ueberfaellig) {
    return { label: 'Überfällig – Freigabe ausstehend', color: 'var(--color-danger)' };
  }
  if (status === 'ZUR_PRUEFUNG') {
    return { label: 'Meldung bereit – Prüfung', color: 'var(--color-primary)' };
  }
  if (status === 'ENTWURF') {
    return { label: 'Entwurf', color: 'var(--color-warning)' };
  }
  return { label: 'Zurückgewiesen', color: 'var(--color-danger)' };
}

function parseDeNumber(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (t === '' || t === '-' || t === '.') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export default function KitaMeldungPage() {
  const base = demoKitaMonatsmeldung;

  const [phase, setPhase] = useState<UiPhase>('PRUEFUNG');
  const [status, setStatus] = useState<MeldungStatus>(base.status);
  const [kennzahlen, setKennzahlen] = useState<MeldungKennzahlen>({ ...base.kennzahlen });
  const [korrekturen, setKorrekturen] = useState<MeldungKorrektur[]>([]);
  const [korrekturFeld, setKorrekturFeld] = useState<keyof MeldungKennzahlen>('wartelisteBestand');
  const [korrekturWert, setKorrekturWert] = useState(String(base.kennzahlen.wartelisteBestand));
  const [korrekturBegruendung, setKorrekturBegruendung] = useState('');
  const [korrekturFehler, setKorrekturFehler] = useState<string | null>(null);
  const [bestaetigt, setBestaetigt] = useState(false);
  const [freigabe, setFreigabe] = useState<MeldungFreigabe | null>(null);
  const [freigabeFehler, setFreigabeFehler] = useState<string | null>(null);

  const freigegeben = status === 'FREIGEGEBEN';
  const ueberfaellig = !freigegeben && base.fiktivesHeute > base.meldefrist;

  const st = statusMeta(status, ueberfaellig);

  const fristHinweis = useMemo(() => {
    if (freigegeben) return null;
    if (ueberfaellig) {
      return `Meldefrist ${base.meldefristLabel} überschritten (Demo-Stichtag ${base.fiktivesHeute}). Kein automatisches Senden – Freigabe bleibt manuell.`;
    }
    return `Meldefrist: ${base.meldefristLabel} (Demo-Stichtag ${base.fiktivesHeute}).`;
  }, [freigegeben, ueberfaellig, base]);

  function startKorrektur() {
    setKorrekturFehler(null);
    setKorrekturFeld('wartelisteBestand');
    setKorrekturWert(String(kennzahlen.wartelisteBestand));
    setKorrekturBegruendung('');
    setPhase('KORREKTUR');
  }

  function applyKorrektur() {
    const parsed = parseDeNumber(korrekturWert);
    if (parsed === null) {
      setKorrekturFehler('Bitte einen gültigen Zahlenwert eingeben.');
      return;
    }
    if (korrekturBegruendung.trim().length < 8) {
      setKorrekturFehler('Begründung der Korrektur ist erforderlich (mind. 8 Zeichen).');
      return;
    }
    const vorher = kennzahlen[korrekturFeld];
    if (vorher === parsed) {
      setKorrekturFehler('Wert ist unverändert – keine Korrektur nötig.');
      return;
    }

    const am = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setKennzahlen(prev => ({ ...prev, [korrekturFeld]: parsed }));
    setKorrekturen(prev => [
      ...prev,
      {
        feld: korrekturFeld,
        wertVorher: vorher,
        wertNachher: parsed,
        begruendung: korrekturBegruendung.trim(),
        dokumentiertAm: am,
        rolle: 'Kita-Leitung (Demo-Rolle)',
      },
    ]);
    setKorrekturFehler(null);
    setKorrekturBegruendung('');
    setPhase('PRUEFUNG');
  }

  function openBestaetigung() {
    setBestaetigt(false);
    setFreigabeFehler(null);
    setPhase('BESTAETIGUNG');
  }

  function freigeben() {
    if (!bestaetigt) {
      setFreigabeFehler(
        'Aktive Bestätigung erforderlich: Bitte bestätigen Sie, dass der Meldeinhalt geprüft wurde.'
      );
      return;
    }
    const am = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    // Simulierter JA-Eingang wenige Minuten später (Demo)
    const freigabeId = `FG-${base.id}-${Date.now().toString(36).toUpperCase()}`;
    const freigabePayload: MeldungFreigabe = {
      freigabeId,
      freigegebenAm: am,
      freigegebenDurchRolle: 'Kita-Leitung (Demo-Rolle)',
      eingegangenBeimJugendamtAm: am,
      bestaetigt: true,
    };
    setFreigabe(freigabePayload);
    setStatus('FREIGEGEBEN');
    setFreigabeFehler(null);
    setPhase('FREIGEGEBEN');

    // Session-Kopplung → Steuerungslagebild Meldeeingang (US-KJ-005)
    try {
      const session: MeldeeingangSessionFreigabe = {
        meldungId: base.id,
        einrichtungId: base.einrichtungId,
        freigabeId,
        freigegebenAm: am,
        freigegebenDurchRolle: freigabePayload.freigegebenDurchRolle,
        kennzahlen: { ...kennzahlen },
        sessionWrittenAt: new Date().toISOString(),
      };
      localStorage.setItem(MELDEEINGANG_SESSION_KEY, JSON.stringify(session));
    } catch {
      // localStorage nicht verfügbar – Lagebild bleibt beim Mock-Ausgangszustand
    }
  }

  function resetDemo() {
    setPhase('PRUEFUNG');
    setStatus(base.status);
    setKennzahlen({ ...base.kennzahlen });
    setKorrekturen([]);
    setBestaetigt(false);
    setFreigabe(null);
    setFreigabeFehler(null);
    setKorrekturFehler(null);
    try {
      localStorage.removeItem(MELDEEINGANG_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  const readOnly = freigegeben || phase === 'FREIGEGEBEN';

  const phaseLabel =
    phase === 'FREIGEGEBEN'
      ? 'Freigegeben & übermittelt'
      : phase === 'BESTAETIGUNG'
        ? 'Aktive Freigabe (Bestätigung ausstehend)'
        : phase === 'KORREKTUR'
          ? 'Korrekturmodus (vor Freigabe)'
          : freigegeben
            ? 'Freigegeben & übermittelt'
            : 'Prüfung (vor Freigabe)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="no-print">
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '0.75rem',
          }}
        >
          <span className="badge badge-primary">US-KJ-004</span>
          <span>Monatsmeldung freigeben · Demo: Kita-Leitung</span>
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>Monatsmeldung prüfen und freigeben</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '44rem' }}>
          Systemvorschlag für {base.monatsLabel} an das Jugendamt. Volle Einsicht vor Übermittlung,
          optionale Korrektur mit Begründung, aktive Bestätigung – keine stillen Übertragungen.
        </p>
      </div>

      {/* Druck freigabeunabhängig – Spiegel Monatsbericht/Bedarfsplanung/Vorlage */}
      <div
        className="no-print card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ maxWidth: '40rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Export</div>
          <strong style={{ fontSize: '0.95rem' }}>Druckansicht Monatsmeldung</strong>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.25rem 0 0',
              lineHeight: 1.5,
            }}
          >
            Druck ist freigabeunabhängig (Prüfung, Korrektur, Bestätigung und freigegebene Fassung).
            Status, dokumentierte Korrekturen und Freigabenachweis erscheinen im Ausdruck.
            Aktionsbuttons, Korrekturmaske, Bestätigungsdialog und Prozess-Hub sind no-print. Keine
            Kind- oder Personennamen.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.print()}
          style={{ fontSize: '0.875rem', flexShrink: 0 }}
        >
          Drucken / als PDF speichern
        </button>
      </div>

      {/* print-only Kopf + Status + Korrekturen + Freigabe */}
      <div className="print-only print-block" style={{ margin: 0 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 0.35rem' }}>
          US-KJ-004 · Monatsmeldung freigeben · Demo Kita-Leitung · DEC-004
        </p>
        <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem' }}>
          Monatsmeldung {base.monatsLabel}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
          {base.einrichtungBezeichnung} · {base.traeger} · Planungsraum {base.planungsraumBezeichnung}
        </p>
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            background: 'var(--color-neutral-light)',
            borderLeft: `4px solid ${st.color}`,
          }}
          role="status"
        >
          <strong style={{ color: st.color }}>Status im Ausdruck: {st.label}</strong>
          <div style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            UI-Phase: {phaseLabel} · Meldung-ID{' '}
            <span style={{ fontFamily: 'monospace' }}>{base.id}</span> · Monat {base.monatsIso} ·
            Meldefrist {base.meldefristLabel}
            {ueberfaellig ? ' (überfällig)' : ''}
          </div>
          {fristHinweis && (
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', lineHeight: 1.45 }}>{fristHinweis}</p>
          )}
        </div>
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
          }}
          role="note"
        >
          <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
            Korrekturen im Ausdruck
          </strong>
          {korrekturen.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              Keine dokumentierten Korrekturen. Meldeinhalt entspricht dem Systemvorschlag aus dem
              Monatsbericht ({base.monatsberichtId}), ggf. unverändert freigegeben bzw. in Prüfung.
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              {korrekturen.length} dokumentierte Korrektur
              {korrekturen.length === 1 ? '' : 'en'} mit Begründung und Zeitstempel
              {korrekturen.length > 0
                ? `: ${korrekturen
                    .map(k => {
                      const dec = isPercentField(k.feld) ? 1 : 0;
                      return `${FELD_LABELS[k.feld]} ${fmtNum(k.wertVorher, dec)} → ${fmtNum(
                        k.wertNachher,
                        dec
                      )}${isPercentField(k.feld) ? ' %' : ''}`;
                    })
                    .join('; ')}`
                : ''}
              . Details im Korrekturprotokoll unten.
            </p>
          )}
        </div>
        <div
          style={{
            marginBottom: '0.5rem',
            padding: '0.75rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            borderLeft: freigabe
              ? '4px solid var(--color-success)'
              : '4px solid var(--color-border)',
          }}
          role="note"
        >
          <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
            Freigabe im Ausdruck
          </strong>
          {freigabe ? (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              Freigabe-ID <span style={{ fontFamily: 'monospace' }}>{freigabe.freigabeId}</span> ·
              freigegeben am {freigabe.freigegebenAm} · Rolle {freigabe.freigegebenDurchRolle} ·
              Eingang Jugendamt (Demo) {freigabe.eingegangenBeimJugendamtAm}. Aktive Bestätigung:
              ja. Aggregate session-lokal im Steuerungslagebild (Meldeeingang) sichtbar.
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
              Noch nicht freigegeben. Keine Übermittlung an das Jugendamt – Entwürfe bleiben für das
              JA unsichtbar (DEC-004). Druck dokumentiert den Prüfungs- bzw. Korrekturstand ohne
              stillen Versand.
            </p>
          )}
        </div>
      </div>

      {/* Statusleiste + Aktionen */}
      <div
        className="card no-print"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: `4px solid ${st.color}`,
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status</div>
          <strong style={{ color: st.color }}>{st.label}</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Meldung-ID <span style={{ fontFamily: 'monospace' }}>{base.id}</span>
            {' · '}
            Monat {base.monatsIso}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {!readOnly && phase === 'PRUEFUNG' && (
            <>
              <button type="button" className="btn btn-secondary" onClick={startKorrektur}>
                Wert korrigieren
              </button>
              <button type="button" className="btn btn-primary" onClick={openBestaetigung}>
                Zur Freigabe
              </button>
            </>
          )}
          {phase === 'KORREKTUR' && (
            <button type="button" className="btn btn-secondary" onClick={() => setPhase('PRUEFUNG')}>
              Abbrechen
            </button>
          )}
          {phase === 'BESTAETIGUNG' && (
            <button type="button" className="btn btn-secondary" onClick={() => setPhase('PRUEFUNG')}>
              Zurück zur Prüfung
            </button>
          )}
          {readOnly && (
            <button type="button" className="btn btn-secondary" onClick={resetDemo}>
              Demo zurücksetzen
            </button>
          )}
        </div>
      </div>

      {ueberfaellig && (
        <div className="notice-box notice-box-warn no-print" role="status">
          <div>
            <strong style={{ fontSize: '0.875rem' }}>Meldeverzug</strong>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{fristHinweis}</p>
          </div>
        </div>
      )}

      {!ueberfaellig && !freigegeben && fristHinweis && (
        <p className="no-print" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {fristHinweis}
        </p>
      )}

      <div className="notice-box notice-box-neutral no-print" role="note">
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Datenschutz:</strong> Nur Aggregate der Einrichtung. Keine Kindnamen, keine
          Personalnamen. Jugendamt sieht unfreigegebene Entwürfe nicht (Demo-Prinzip DEC-004 /
          US-KJ-004).
        </div>
      </div>

      {/* Freigabe-Nachweis (Screen; Ausdruck: print-only Freigabe-Block oben) */}
      {freigabe && (
        <div
          className="card no-print"
          style={{
            padding: '1rem 1.25rem',
            borderTop: '4px solid var(--color-success)',
            background: 'var(--color-success-light, #f0faf4)',
          }}
          role="status"
        >
          <strong style={{ color: 'var(--color-success)' }}>Freigabe protokolliert</strong>
          <dl
            style={{
              margin: '0.75rem 0 0',
              display: 'grid',
              gridTemplateColumns: 'minmax(10rem, 14rem) 1fr',
              gap: '0.35rem 1rem',
              fontSize: '0.875rem',
            }}
          >
            <dt style={{ color: 'var(--color-text-muted)' }}>Freigabe-ID</dt>
            <dd style={{ margin: 0, fontFamily: 'monospace' }}>{freigabe.freigabeId}</dd>
            <dt style={{ color: 'var(--color-text-muted)' }}>Freigegeben am</dt>
            <dd style={{ margin: 0 }}>{freigabe.freigegebenAm}</dd>
            <dt style={{ color: 'var(--color-text-muted)' }}>Rolle</dt>
            <dd style={{ margin: 0 }}>{freigabe.freigegebenDurchRolle}</dd>
            <dt style={{ color: 'var(--color-text-muted)' }}>Eingang Jugendamt</dt>
            <dd style={{ margin: 0 }}>
              {freigabe.eingegangenBeimJugendamtAm}{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>
                (simulierter Eingangsstempel, Demo-Session)
              </span>
            </dd>
          </dl>
          <p style={{ fontSize: '0.85rem', margin: '0.75rem 0 0', color: 'var(--color-text-muted)' }}>
            Freigegebene Aggregate sind im{' '}
            <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>
              Steuerungslagebild (US-KJ-005)
            </Link>{' '}
            unter Meldeeingang &amp; Datenbasis sichtbar (Demo-Session, localStorage). Entwürfe
            bleiben für das Jugendamt unsichtbar.
          </p>
        </div>
      )}

      {/* Korrekturmaske (no-print – dokumentierte Korrekturen im Ausdruck) */}
      {phase === 'KORREKTUR' && (
        <section className="card no-print" style={{ padding: '1.25rem' }} aria-labelledby="korrektur-titel">
          <h2 id="korrektur-titel" style={{ fontSize: '1.05rem', marginTop: 0 }}>
            Korrektur vor Freigabe
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 0 }}>
            Jede Änderung wird mit Begründung und Zeitstempel dokumentiert (Akzeptanzkriterium 3).
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Feld</span>
              <select
                value={korrekturFeld}
                onChange={e => {
                  const f = e.target.value as keyof MeldungKennzahlen;
                  setKorrekturFeld(f);
                  setKorrekturWert(
                    isPercentField(f)
                      ? String(kennzahlen[f]).replace('.', ',')
                      : String(kennzahlen[f])
                  );
                }}
                style={{
                  padding: '0.5rem 0.65rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'inherit',
                }}
              >
                {EDITABLE_FIELDS.map(f => (
                  <option key={f} value={f}>
                    {FELD_LABELS[f]}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                Neuer Wert
                {isPercentField(korrekturFeld) ? ' (Dezimal mit Komma möglich)' : ''}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={korrekturWert}
                onChange={e => setKorrekturWert(e.target.value)}
                style={{
                  padding: '0.5rem 0.65rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'inherit',
                }}
              />
            </label>
          </div>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>Begründung der Korrektur</span>
            <textarea
              value={korrekturBegruendung}
              onChange={e => setKorrekturBegruendung(e.target.value)}
              rows={3}
              placeholder="z. B. Nachzählung Warteliste: Doppelte Vormerkung bereinigt."
              style={{
                padding: '0.5rem 0.65rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </label>
          {korrekturFehler && (
            <p role="alert" style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: 0 }}>
              {korrekturFehler}
            </p>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={applyKorrektur}>
              Korrektur dokumentieren
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setPhase('PRUEFUNG')}>
              Abbrechen
            </button>
          </div>
        </section>
      )}

      {/* Aktive Bestätigung (no-print – Freigabestatus im Ausdruck) */}
      {phase === 'BESTAETIGUNG' && (
        <section className="card no-print" style={{ padding: '1.25rem' }} aria-labelledby="freigabe-titel">
          <h2 id="freigabe-titel" style={{ fontSize: '1.05rem', marginTop: 0 }}>
            Aktive Freigabe
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Mit der Freigabe bestätigen Sie als Kita-Leitung den vollständigen Meldeinhalt. Ohne
            diese Bestätigung erfolgt keine Übermittlung an das Jugendamt.
          </p>
          <ul style={{ fontSize: '0.875rem', margin: '0 0 1rem', paddingLeft: '1.25rem' }}>
            <li>
              Einrichtung: <strong>{base.einrichtungBezeichnung}</strong>
            </li>
            <li>
              Monat: <strong>{base.monatsLabel}</strong>
            </li>
            <li>
              Belegte / genehmigte Plätze:{' '}
              <strong>
                {fmtNum(kennzahlen.belegtePlaetze)} / {fmtNum(kennzahlen.genehmigtePlaetze)}
              </strong>
            </li>
            <li>
              Warteliste: <strong>{fmtNum(kennzahlen.wartelisteBestand)}</strong>
            </li>
            <li>
              Dokumentierte Korrekturen: <strong>{korrekturen.length}</strong>
            </li>
          </ul>
          <label
            style={{
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={bestaetigt}
              onChange={e => {
                setBestaetigt(e.target.checked);
                setFreigabeFehler(null);
              }}
              style={{ marginTop: '0.2rem' }}
            />
            <span>
              Ich habe den Meldeinhalt geprüft und gebe die Monatsmeldung an das Jugendamt frei
              (Demo-Rolle: Kita-Leitung).
            </span>
          </label>
          {freigabeFehler && (
            <p role="alert" style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>
              {freigabeFehler}
            </p>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={freigeben}>
              Jetzt freigeben und übermitteln (Demo)
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setPhase('PRUEFUNG')}>
              Abbrechen
            </button>
          </div>
        </section>
      )}

      {/* Meldeinhalt (im Ausdruck sichtbar) */}
      <section className="card" style={{ padding: '1.25rem' }} aria-labelledby="inhalt-titel">
        <h2 id="inhalt-titel" style={{ fontSize: '1.05rem', marginTop: 0, marginBottom: '0.25rem' }}>
          Meldeinhalt (vollständig sichtbar vor Freigabe)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 0 }}>
          {base.einrichtungBezeichnung} · {base.traeger} · Planungsraum {base.planungsraumBezeichnung}
          <br />
          Quelle Monatsbericht:{' '}
          <Link href="/kita/monatsbericht" className="no-print" style={{ color: 'var(--color-primary)' }}>
            {base.monatsberichtId}
          </Link>
          <span className="print-only">{base.monatsberichtId}</span>
          {' '}
          · {base.standLabel}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginTop: '1rem',
          }}
        >
          {(
            [
              ['genehmigtePlaetze', 0],
              ['belegtePlaetze', 0],
              ['freiePlaetze', 0],
              ['wartelisteBestand', 0],
              ['auslastungsgradProzent', 1],
              ['anwesenheitsquoteProzent', 1],
              ['personalAusfallquoteProzent', 1],
              ['tagePersonalschluesselUnterschritten', 0],
            ] as [keyof MeldungKennzahlen, number][]
          ).map(([feld, dec]) => {
            const korrigiert = korrekturen.some(k => k.feld === feld);
            return (
              <div
                key={feld}
                style={{
                  padding: '0.75rem',
                  background: 'var(--color-neutral-light)',
                  borderRadius: 'var(--radius)',
                  border: korrigiert ? '1px solid var(--color-warning)' : '1px solid transparent',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {FELD_LABELS[feld]}
                  {korrigiert && (
                    <span style={{ color: 'var(--color-warning)', marginLeft: '0.35rem' }}>
                      korrigiert
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  {fmtNum(kennzahlen[feld], dec)}
                  {isPercentField(feld) ? ' %' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {base.hinweise.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mitgemeldete Hinweise</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
              {base.hinweise.map((h, i) => (
                <li key={i} style={{ marginBottom: '0.35rem' }}>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Korrekturprotokoll */}
      {korrekturen.length > 0 && (
        <section className="card" style={{ padding: '1.25rem' }} aria-labelledby="protokoll-titel">
          <h2 id="protokoll-titel" style={{ fontSize: '1.05rem', marginTop: 0 }}>
            Korrekturprotokoll
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Feld</th>
                  <th style={{ padding: '0.5rem' }}>Vorher</th>
                  <th style={{ padding: '0.5rem' }}>Nachher</th>
                  <th style={{ padding: '0.5rem' }}>Begründung</th>
                  <th style={{ padding: '0.5rem' }}>Dokumentiert</th>
                </tr>
              </thead>
              <tbody>
                {korrekturen.map((k, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.5rem' }}>{FELD_LABELS[k.feld]}</td>
                    <td style={{ padding: '0.5rem' }}>
                      {fmtNum(k.wertVorher, isPercentField(k.feld) ? 1 : 0)}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {fmtNum(k.wertNachher, isPercentField(k.feld) ? 1 : 0)}
                    </td>
                    <td style={{ padding: '0.5rem' }}>{k.begruendung}</td>
                    <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>
                      {k.rolle}
                      <br />
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {k.dokumentiertAm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Methodik */}
      <section className="card" style={{ padding: '1.25rem' }} aria-labelledby="methodik-titel">
        <h2 id="methodik-titel" style={{ fontSize: '1.05rem', marginTop: 0 }}>
          Methodik &amp; Grenzen
        </h2>
        <p style={{ fontSize: '0.875rem', marginTop: 0 }}>{base.methodikKurz}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
          {base.rechtsgrundlageHinweis}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
          <strong>Druckansicht:</strong> freigabeunabhängig (Prüfung, Korrektur, Bestätigung,
          freigegebene Fassung). Status, dokumentierte Korrekturen und Freigabenachweis erscheinen
          im Ausdruck; Korrekturmaske, Bestätigungsdialog und Aktionsbuttons sind no-print (Spiegel
          Monatsbericht/Bedarfsplanung/Vorlage).
        </p>
      </section>

      {/* Betriebliche Prozesskette: Meldung ← Tagesstand · Belegung · Monatsbericht */}
      <section aria-labelledby="prozesskette-heading" className="no-print">
        <h2 id="prozesskette-heading" style={{ marginBottom: '0.5rem' }}>
          Betriebliche Vorprozesse
        </h2>
        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            maxWidth: '44rem',
          }}
        >
          Derselbe Demo-Standort <strong>{base.einrichtungBezeichnung}</strong> (
          <span style={{ fontFamily: 'monospace' }}>{base.einrichtungId}</span>
          ). Freigegebene Tagesstände speisen den Monatsbericht; der Belegungsstand zeigt
          stichtagsbezogene Plätze; diese Monatsmeldung basiert auf dem Systemvorschlag aus dem
          Monatsbericht und geht erst nach aktiver Freigabe an das Jugendamt. Keine Kind- oder
          Personennamen.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {(
            [
              {
                href: '/kita/tagesstand',
                story: 'US-KJ-001',
                title: 'Tagesstand erfassen',
                text: 'Tägliche Aggregate je Gruppe (Anwesenheit, Personalstunden). Quelle für den Monatsbericht.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/einrichtung',
                story: 'US-KJ-002',
                title: 'Belegungsstand einsehen',
                text: 'Stichtagsbezogene Platzzahlen je Gruppe derselben Einrichtung (genehmigt, belegt, frei).',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/monatsbericht',
                story: 'US-KJ-003',
                title: 'Monatsbericht abrufen',
                text: 'Monatsauswertung und Systemvorschlag für diese Meldung inkl. Vorjahresvergleich und Datenlücken.',
                border: 'var(--color-primary)',
              },
            ] as const
          ).map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                borderTop: `3px solid ${card.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <span
                className="badge badge-primary"
                style={{ alignSelf: 'flex-start', fontSize: '0.68rem' }}
              >
                {card.story}
              </span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                {card.title}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {card.text}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="no-print" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Prozesskette Einrichtung {base.einrichtungBezeichnung}: Belegung → Tagesstand → Monatsbericht
        → Meldung (gleiche Demo-Einrichtung). Nach Freigabe sichtbar im{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>
          Steuerungslagebild
        </Link>{' '}
        (Meldeeingang); öffentliche Aggregation ohne Einrichtungsdetail im{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Bericht
        </Link>{' '}
        (DEC-004). Druck: freigabeunabhängig mit dokumentiertem Status, Korrekturen und
        Freigabenachweis.
      </div>

      <div
        className="print-only print-block"
        style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}
      >
        Druckansicht US-KJ-004 freigabeunabhängig · Status {st.label} · Korrekturen{' '}
        {korrekturen.length} · {freigabe ? `Freigabe ${freigabe.freigabeId}` : 'nicht freigegeben'} ·
        nur Aggregate, keine Kind- oder Personennamen (DEC-004).
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-only { display: none; }
            @media print {
              .no-print { display: none !important; }
              .print-only { display: inline !important; }
              .print-only.print-block { display: block !important; }
              body > div > header,
              body nav { display: none !important; }
              main { padding: 0 !important; }
            }
          `,
        }}
      />
    </div>
  );
}
