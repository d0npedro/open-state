'use client';

/**
 * US-KJ-001 – Tagesstand erfassen (Einrichtungsebene, Demo)
 *
 * Gruppenweise Aggregate: Kinderstatus + Personalstunden.
 * Personalschlüssel-Unterschreitung sichtbar, nicht auto-gemeldet.
 * Freigabe durch Leitung sperrt den Stand. Session-lokal, kein Backend.
 * Prozesskette: Belegung (US-KJ-002) → Monatsbericht (US-KJ-003) → Meldung (US-KJ-004).
 * Keine Kind- oder Personennamen.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  demoKitaTagesstand,
  kinderSumme,
  personalschluesselUnterschritten,
} from '@/data/mockKitaTagesstand';
import type {
  TagesstandFreigabe,
  TagesstandGruppe,
  TagesstandStatus,
} from '@/types/kitaTagesstand';

type UiPhase = 'AUFFORDERUNG' | 'ERFASSUNG' | 'ZUSAMMENFASSUNG' | 'FREIGEGEBEN';

function statusMeta(status: TagesstandStatus): { label: string; color: string } {
  switch (status) {
    case 'FREIGEGEBEN':
      return { label: 'Freigegeben (schreibgeschützt)', color: 'var(--color-success)' };
    case 'ZUR_FREIGABE':
      return { label: 'Zur Freigabe bereit', color: 'var(--color-primary)' };
    case 'IN_ERFASSUNG':
      return { label: 'In Erfassung', color: 'var(--color-warning)' };
    default:
      return { label: 'Noch nicht erfasst', color: 'var(--color-danger)' };
  }
}

function cloneGruppen(gruppen: TagesstandGruppe[]): TagesstandGruppe[] {
  return gruppen.map(g => ({
    ...g,
    kinder: { ...g.kinder },
    personal: { ...g.personal },
  }));
}

function fmtStunden(n: number) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

export default function KitaTagesstandPage() {
  const base = demoKitaTagesstand;

  const [phase, setPhase] = useState<UiPhase>(
    base.status === 'FREIGEGEBEN' ? 'FREIGEGEBEN' : 'AUFFORDERUNG'
  );
  const [status, setStatus] = useState<TagesstandStatus>(base.status);
  const [gruppen, setGruppen] = useState<TagesstandGruppe[]>(() => cloneGruppen(base.gruppen));
  const [fehler, setFehler] = useState<string | null>(null);
  const [bestaetigt, setBestaetigt] = useState(false);
  const [freigabe, setFreigabe] = useState<TagesstandFreigabe | null>(null);

  const readOnly = status === 'FREIGEGEBEN' || phase === 'FREIGEGEBEN';
  const st = statusMeta(status);

  const summen = useMemo(() => {
    const offen = gruppen.filter(g => !g.geschlossen);
    let anwesend = 0;
    let krank = 0;
    let urlaub = 0;
    let sonstiges = 0;
    let geplant = 0;
    let ist = 0;
    let unterschritten = 0;
    for (const g of offen) {
      anwesend += g.kinder.anwesend;
      krank += g.kinder.krank;
      urlaub += g.kinder.urlaub;
      sonstiges += g.kinder.sonstiges;
      geplant += g.personal.geplantStunden;
      ist += g.personal.istStunden;
      if (personalschluesselUnterschritten(g)) unterschritten += 1;
    }
    return {
      anwesend,
      krank,
      urlaub,
      sonstiges,
      geplant,
      ist,
      unterschritten,
      offeneGruppen: offen.length,
    };
  }, [gruppen]);

  function updateKinder(
    gruppeId: string,
    field: keyof TagesstandGruppe['kinder'],
    raw: string
  ) {
    const n = Math.max(0, Math.floor(Number(raw.replace(',', '.')) || 0));
    setGruppen(prev =>
      prev.map(g =>
        g.gruppeId === gruppeId
          ? { ...g, kinder: { ...g.kinder, [field]: n } }
          : g
      )
    );
    setFehler(null);
  }

  function updatePersonal(
    gruppeId: string,
    field: keyof TagesstandGruppe['personal'],
    raw: string
  ) {
    const parsed = Number(String(raw).replace(',', '.'));
    const n = Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 10) / 10) : 0;
    setGruppen(prev =>
      prev.map(g =>
        g.gruppeId === gruppeId
          ? { ...g, personal: { ...g.personal, [field]: n } }
          : g
      )
    );
    setFehler(null);
  }

  function validateGruppen(gs: TagesstandGruppe[]): string | null {
    for (const g of gs) {
      if (g.geschlossen) continue;
      const sum = kinderSumme(g.kinder);
      if (sum !== g.belegtePlaetze) {
        return `${g.bezeichnung}: Summe der Status (${sum}) muss den belegten Plätzen (${g.belegtePlaetze}) entsprechen.`;
      }
      if (g.kinder.anwesend < 0 || g.personal.istStunden < 0) {
        return `${g.bezeichnung}: Negative Werte sind nicht zulässig.`;
      }
    }
    return null;
  }

  function startErfassung() {
    setFehler(null);
    setStatus('IN_ERFASSUNG');
    setPhase('ERFASSUNG');
  }

  function zurZusammenfassung() {
    const v = validateGruppen(gruppen);
    if (v) {
      setFehler(v);
      return;
    }
    setFehler(null);
    setStatus('ZUR_FREIGABE');
    setBestaetigt(false);
    setPhase('ZUSAMMENFASSUNG');
  }

  function freigeben() {
    if (!bestaetigt) {
      setFehler(
        'Aktive Bestätigung erforderlich: Bitte bestätigen Sie, dass der Tagesstand geprüft wurde.'
      );
      return;
    }
    const v = validateGruppen(gruppen);
    if (v) {
      setFehler(v);
      return;
    }
    const am = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFreigabe({
      freigegebenAm: am,
      freigegebenDurchRolle: 'Kita-Leitung (Demo-Rolle)',
      bestaetigt: true,
    });
    setStatus('FREIGEGEBEN');
    setFehler(null);
    setPhase('FREIGEGEBEN');
  }

  function resetDemo() {
    setGruppen(cloneGruppen(base.gruppen));
    setStatus(base.status);
    setPhase('AUFFORDERUNG');
    setFehler(null);
    setBestaetigt(false);
    setFreigabe(null);
  }

  function zurueckZurErfassung() {
    if (readOnly) return;
    setFehler(null);
    setStatus('IN_ERFASSUNG');
    setPhase('ERFASSUNG');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
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
          <span className="badge badge-primary">US-KJ-001</span>
          <span>Tagesstand erfassen · Demo: Fachkraft / Kita-Leitung</span>
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>Tagesstand erfassen</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '44rem' }}>
          Aggregierte Anwesenheiten und Personalstunden je Gruppe für{' '}
          <strong>{base.einrichtungBezeichnung}</strong> am {base.datumLabel}. Keine
          Kindlisten, keine Personennamen. Unterschreitung des Personalschlüssels wird
          markiert, aber nicht automatisch gemeldet.
        </p>
      </div>

      {/* Statusleiste */}
      <div
        className="card"
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
            Tagesstand-ID <span style={{ fontFamily: 'monospace' }}>{base.id}</span>
            {' · '}
            Demo-Stichtag {base.fiktivesHeute}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {phase === 'AUFFORDERUNG' && (
            <button type="button" className="btn btn-primary" onClick={startErfassung}>
              Erfassung starten
            </button>
          )}
          {phase === 'ERFASSUNG' && (
            <button type="button" className="btn btn-primary" onClick={zurZusammenfassung}>
              Zur Freigabe-Zusammenfassung
            </button>
          )}
          {phase === 'ZUSAMMENFASSUNG' && (
            <>
              <button type="button" className="btn btn-secondary" onClick={zurueckZurErfassung}>
                Zurück zur Erfassung
              </button>
              <button type="button" className="btn btn-primary" onClick={freigeben}>
                Tagesstand freigeben
              </button>
            </>
          )}
          {(phase === 'FREIGEGEBEN' || status === 'FREIGEGEBEN') && (
            <button type="button" className="btn btn-secondary" onClick={resetDemo}>
              Demo zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="notice-box notice-box-neutral" role="note">
        <div style={{ fontSize: '0.875rem' }}>
          <strong>Datenschutz:</strong> {base.datenschutzHinweis}
        </div>
      </div>

      {fehler && (
        <div className="notice-box notice-box-warn" role="alert">
          <div style={{ fontSize: '0.875rem' }}>
            <strong>Prüfung:</strong> {fehler}
          </div>
        </div>
      )}

      {freigabe && (
        <div
          className="card"
          style={{ borderLeft: '4px solid var(--color-success)', background: 'var(--color-neutral-light)' }}
        >
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>Freigabe dokumentiert</h2>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>
              Freigegeben am: <strong>{freigabe.freigegebenAm}</strong>
            </li>
            <li>
              Rolle: <strong>{freigabe.freigegebenDurchRolle}</strong>
            </li>
            <li>Nachträgliche Änderung in dieser Demo gesperrt (Revisionssicherheit, AK 5).</li>
            <li>
              Freigegebene Aggregate fließen als Datenbasis in den{' '}
              <Link href="/kita/monatsbericht" style={{ color: 'var(--color-primary)' }}>
                Monatsbericht (US-KJ-003)
              </Link>{' '}
              ein – nicht freigegebene Stände und Lücken werden dort sichtbar ausgewiesen.
            </li>
            <li>
              Keine automatische Meldung an das Jugendamt – Monatsmeldung bleibt eigener Schritt (
              <Link href="/kita/meldung" style={{ color: 'var(--color-primary)' }}>
                US-KJ-004
              </Link>
              ).
            </li>
          </ul>
        </div>
      )}

      {/* Gesamtübersicht */}
      {(phase === 'ERFASSUNG' || phase === 'ZUSAMMENFASSUNG' || phase === 'FREIGEGEBEN') && (
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Tagesübersicht (Aggregate)</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {[
              { l: 'Anwesend', v: summen.anwesend },
              { l: 'Krank', v: summen.krank },
              { l: 'Urlaub', v: summen.urlaub },
              { l: 'Sonstiges', v: summen.sonstiges },
              { l: 'Personal geplant (h)', v: fmtStunden(summen.geplant) },
              { l: 'Personal Ist (h)', v: fmtStunden(summen.ist) },
              {
                l: 'Gruppen mit Schlüssel-Hinweis',
                v: summen.unterschritten,
                hl:
                  summen.unterschritten > 0
                    ? 'var(--color-warning)'
                    : 'var(--color-success)',
              },
            ].map(k => (
              <div
                key={k.l}
                className="card"
                style={{ borderTop: `3px solid ${k.hl ?? 'var(--color-primary)'}` }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{k.l}</div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: k.hl ?? 'var(--color-text)',
                  }}
                >
                  {k.v}
                </div>
              </div>
            ))}
          </div>
          {summen.unterschritten > 0 && (
            <div className="notice-box notice-box-warn" role="status" style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem' }}>
                <strong>Personalschlüssel-Hinweis:</strong> In {summen.unterschritten} Gruppe
                {summen.unterschritten === 1 ? '' : 'n'} liegt die vereinfachte Demo-Relation
                (anwesende Kinder je Ist-Fachkraft-Stunde) über dem Schwellenwert. Sichtbar für
                die Leitung – <em>keine</em> automatische Meldung an das Jugendamt (AK 4).
              </div>
            </div>
          )}
        </section>
      )}

      {phase === 'AUFFORDERUNG' && (
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Tagesstand für {base.datumLabel} fehlt</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '40rem' }}>
            Erfassen Sie je geöffneter Gruppe die Anzahl der Kinder in den Status anwesend,
            krank, Urlaub und sonstiges sowie geplante und Ist-Fachkraft-Stunden. Ziel: Abschluss
            in wenigen Minuten (AK 1). Vorbelegung aus der Belegung (US-KJ-002) ist editierbar.
          </p>
          <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>
            Einrichtung: {base.einrichtungBezeichnung} · Träger: {base.traeger} · Planungsraum{' '}
            {base.planungsraumBezeichnung}
          </p>
        </section>
      )}

      {/* Gruppenerfassung */}
      {(phase === 'ERFASSUNG' || phase === 'ZUSAMMENFASSUNG' || phase === 'FREIGEGEBEN') && (
        <section>
          <h2 style={{ marginBottom: '1rem' }}>
            {phase === 'ERFASSUNG' ? 'Erfassung je Gruppe' : 'Gruppenwerte'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {gruppen.map(g => {
              const unter = personalschluesselUnterschritten(g);
              const sum = kinderSumme(g.kinder);
              const sumOk = g.geschlossen || sum === g.belegtePlaetze;
              const ratio =
                !g.geschlossen && g.personal.istStunden > 0
                  ? g.kinder.anwesend / g.personal.istStunden
                  : null;

              return (
                <div
                  key={g.gruppeId}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${
                      g.geschlossen
                        ? 'var(--color-border)'
                        : unter
                          ? 'var(--color-warning)'
                          : sumOk
                            ? 'var(--color-success)'
                            : 'var(--color-danger)'
                    }`,
                    opacity: g.geschlossen ? 0.85 : 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div>
                      <strong>{g.bezeichnung}</strong>
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.8rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {g.altersgruppe}
                        {g.geschlossen ? ' · temporär geschlossen' : ` · belegt ${g.belegtePlaetze}`}
                      </span>
                    </div>
                    {unter && (
                      <span className="badge" style={{ background: 'var(--color-warning)', color: '#fff' }}>
                        Schlüssel-Hinweis
                      </span>
                    )}
                  </div>

                  {g.geschlossen ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Keine Betreuung an diesem Tag. Keine Erfassung erforderlich.
                    </p>
                  ) : (
                    <>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                          gap: '0.65rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {(
                          [
                            ['anwesend', 'Anwesend'],
                            ['krank', 'Krank'],
                            ['urlaub', 'Urlaub'],
                            ['sonstiges', 'Sonstiges'],
                          ] as const
                        ).map(([key, label]) => (
                          <label key={key} style={{ fontSize: '0.8rem', display: 'block' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              disabled={readOnly || phase !== 'ERFASSUNG'}
                              value={g.kinder[key]}
                              onChange={e => updateKinder(g.gruppeId, key, e.target.value)}
                              style={{
                                display: 'block',
                                width: '100%',
                                marginTop: '0.2rem',
                                padding: '0.4rem 0.5rem',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius)',
                                fontSize: '0.95rem',
                              }}
                              aria-label={`${g.bezeichnung}: ${label}`}
                            />
                          </label>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '0.65rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <label style={{ fontSize: '0.8rem', display: 'block' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>
                            Personal geplant (h)
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            disabled={readOnly || phase !== 'ERFASSUNG'}
                            value={g.personal.geplantStunden}
                            onChange={e =>
                              updatePersonal(g.gruppeId, 'geplantStunden', e.target.value)
                            }
                            style={{
                              display: 'block',
                              width: '100%',
                              marginTop: '0.2rem',
                              padding: '0.4rem 0.5rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.95rem',
                            }}
                            aria-label={`${g.bezeichnung}: Personal geplant`}
                          />
                        </label>
                        <label style={{ fontSize: '0.8rem', display: 'block' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>Personal Ist (h)</span>
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            disabled={readOnly || phase !== 'ERFASSUNG'}
                            value={g.personal.istStunden}
                            onChange={e =>
                              updatePersonal(g.gruppeId, 'istStunden', e.target.value)
                            }
                            style={{
                              display: 'block',
                              width: '100%',
                              marginTop: '0.2rem',
                              padding: '0.4rem 0.5rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.95rem',
                            }}
                            aria-label={`${g.bezeichnung}: Personal Ist`}
                          />
                        </label>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Summe Status: <strong style={{ color: sumOk ? undefined : 'var(--color-danger)' }}>{sum}</strong>
                        {' / '}
                        belegt {g.belegtePlaetze}
                        {ratio !== null && (
                          <>
                            {' · '}
                            Relation anwesend/Ist-h:{' '}
                            <strong style={{ color: unter ? 'var(--color-warning)' : undefined }}>
                              {ratio.toLocaleString('de-DE', { maximumFractionDigits: 2 })}
                            </strong>
                            {' '}(Schwelle {g.maxKinderProFachkraftStunde.toLocaleString('de-DE')})
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {phase === 'ZUSAMMENFASSUNG' && (
        <section className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <h2 style={{ marginTop: 0 }}>Freigabe durch Leitung</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Nach Freigabe ist der Tagesstand gegen nachträgliche Änderung gesperrt
            (Revisionssicherheit). Offline-Modus ist als Produktdesign-Anforderung
            dokumentiert; diese Demo speichert nur session-lokal im Browser.
          </p>
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
                setFehler(null);
              }}
              style={{ marginTop: '0.2rem' }}
            />
            <span>
              Ich bestätige als Kita-Leitung (Demo-Rolle), dass die Aggregate für{' '}
              {base.datumLabel} geprüft sind und freigegeben werden dürfen.
            </span>
          </label>
        </section>
      )}

      <section className="card" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--color-text)' }}>Methodik</h2>
        <p style={{ marginTop: 0 }}>{base.methodikKurz}</p>
        <p style={{ marginBottom: 0 }}>{base.rechtsgrundlageHinweis}</p>
      </section>

      {/* Betriebliche Prozesskette: Tagesstand → Belegung · Monatsbericht · Meldung */}
      <section aria-labelledby="prozesskette-heading" className="no-print">
        <h2 id="prozesskette-heading" style={{ marginBottom: '0.5rem' }}>
          Betriebliche Folgeprozesse
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
          stichtagsbezogene Plätze derselben Einrichtung; die Monatsmeldung geht erst nach
          aktiver Freigabe an das Jugendamt. Keine Kind- oder Personennamen.
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
                text: 'Monatsauswertung aus freigegebenen Tagesständen inkl. Vorjahresvergleich und Datenlücken.',
                border: 'var(--color-primary)',
              },
              {
                href: '/kita/meldung',
                story: 'US-KJ-004',
                title: 'Meldung freigeben',
                text: 'Systemvorschlag prüfen, ggf. korrigieren und aktiv an das Jugendamt freigeben.',
                border: 'var(--color-warning)',
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

      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Prozesskette Einrichtung {base.einrichtungBezeichnung}: Belegung → Tagesstand → Monatsbericht
        → Meldung (gleiche Demo-Einrichtung). Öffentliche Aggregation ohne Einrichtungsdetail im{' '}
        <Link href="/kita" style={{ color: 'var(--color-primary)' }}>
          öffentlichen Bericht
        </Link>{' '}
        und im{' '}
        <Link href="/kita/lagebild" style={{ color: 'var(--color-primary)' }}>
          Steuerungslagebild
        </Link>{' '}
        (DEC-004).
      </div>
    </div>
  );
}
