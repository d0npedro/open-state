# UG Domain-Loop Journal

Branch: `loop/ug` · Worktree: `D:\Projects\open-state-loop-ug`

Erlaubte Pfade nur: `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`,
`demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`,
`demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md`.

---

## 2026-07-29 – Iteration 26: Übersicht Steuernummer-CTA-Hilfstext nach RQ

### Was
Übersicht-Fairness-CTA für `UG-STEUERNUMMER-FEHLT` erhält session-sensitiven
Hilfstext (wie Betriebsdatum / Hinweise-Wrap): bei offener RQ und VS-05
`AUSSTEHEND` „Zuerst die offene Rückfrage des Finanzamts klären … Behördenkarte“;
nach Antwort und VS-05 `IN_BEARBEITUNG` „Vergabe … in Bearbeitung … Behördenkarte“.
CTA-Label und Anker unverändert. E2E: Initial- und Session-Assertion Hilfstext.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` Steuernummer `hint`
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Hilfstext Steuernummer
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: Steuernummer-Hilfstext bei offener RQ um „zuerst klären“ (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen

---

## 2026-07-29 – Iteration 25: Hinweise Betriebsdatum-CTA-Hilfstext nach RQ

### Was
Hinweise-CTA für `UG-BETRIEBSDATUM` erhält session-sensitiven Hilfstext
(spiegel Übersicht): bei offener RQ „Zuerst die offene Rückfrage des
Finanzamts klären …“; nach Antwort und VS-05 `IN_BEARBEITUNG` „Rückfrage
beantwortet – Steuernummer-Vergabe und weitere offene Punkte …“. CTA-Label
und Anker unverändert. E2E: Initial- und Session-Assertion Hilfstext.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – `betriebsdatumCtaHint` + testid
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Hilfstext
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-CTA-Hilfstext auch für Steuernummer (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen

---

## 2026-07-29 – Iteration 24: Übersicht Betriebsdatum-CTA-Hilfstext nach RQ

### Was
Übersicht-Fairness-CTA für `UG-BETRIEBSDATUM` erhält session-sensitiven
Hilfstext unter dem Link „Zum Verfahrensstatus“: bei offener RQ
„Zuerst die offene Rückfrage des Finanzamts klären …“; nach Antwort und
VS-05 `IN_BEARBEITUNG` „Rückfrage beantwortet – Steuernummer-Vergabe und
weitere offene Punkte …“. CTA-Label und Anker unverändert. E2E: Initial-
und Session-Assertion Hilfstext.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` hint + UI
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Hilfstext
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: Betriebsdatum-Hilfstext nach RQ-Antwort session-sensitiv (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA-Hilfstext auch für Steuernummer (optional)

---

## 2026-07-29 – Iteration 23: Hinweise Steuernummer-CTA-Label bei IN_BEARBEITUNG

### Was
Hinweise-CTA für `UG-STEUERNUMMER-FEHLT` spiegelt die Übersicht: bei
VS-05 `AUSSTEHEND` weiterhin „Zum Finanzamt“; nach Session-Antwort und
VS-05 `IN_BEARBEITUNG` „Steuernummer-Stand ansehen“ (gleicher Anker
Finanzamt-Karte, Hilfstext war bereits status-abhängig). E2E: Session-
Assertion CTA-Label.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – CTA-Text + aria-label VS-05
- `demo/e2e/us-ug-gruendung.spec.ts` – Session-Assertion CTA-Label
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-CTA-Hilfstext bei Betriebsdatum nach RQ-Antwort (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Hinweise: Betriebsdatum-Hilfstext nach RQ-Antwort session-sensitiv (optional)

---

## 2026-07-29 – Iteration 22: Übersicht Steuernummer-CTA bei IN_BEARBEITUNG

### Was
Übersicht-Fairness-CTA für `UG-STEUERNUMMER-FEHLT` differenziert nach
VS-05-Status: bei `AUSSTEHEND` weiterhin „Zum Finanzamt“; nach Session-
Antwort und VS-05 `IN_BEARBEITUNG` „Steuernummer-Stand ansehen“ (gleicher
Anker Finanzamt-Karte). E2E: Initialtext + Session-Erwartung.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` CTA-Text VS-05
- `demo/e2e/us-ug-gruendung.spec.ts` – Session-Assertion CTA-Text
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-CTA-Hilfstext bei Betriebsdatum nach RQ-Antwort (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Hinweise: Steuernummer-CTA-Label bei IN_BEARBEITUNG spiegeln (optional)

---

## 2026-07-29 – Iteration 21: Betriebsdatum-Signal-Text nach RQ-Antwort

### Was
Fairness-Signal `UG-BETRIEBSDATUM`: Text und nächster Schritt hängen
session-sensitiv vom Aktenzustand ab. Bei offener Rückfrage: „zuerst
Rückfrage Finanzamt beantworten“. Nach Antwort: „Rückfrage beantwortet /
Steuernummer-Vergabe läuft“, keine RQ-Anweisung mehr; Fokus auf
BG-Anmeldung und Unterlagen. CTA „Zum Verfahrensstatus“ unverändert.
E2E: Initialtext, Session-Hinweise, Session-Übersicht.

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – Signal 4 status-abhängiger Text
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Tests + Übersicht-Assertion
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (109 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-CTA-Text bei Steuernummer IN_BEARBEITUNG differenzieren (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA-Hilfstext bei Betriebsdatum nach RQ-Antwort (optional)

---

## 2026-07-29 – Iteration 20: Übersicht Fairness-CTA Steuernummer/Betriebsdatum

### Was
Übersicht-Fairness-Kurzblock: Kurz-CTAs für Steuernummer
(`Zum Finanzamt` → `#beh-BEH-02`) und Betriebsdatum
(`Zum Verfahrensstatus` → `#verfahrensstatus`). CTA nur solange
VS-05 offen bzw. Verfahren nicht genehmigt. Nach Beantworten der
Rückfrage bleibt Steuernummer-CTA (VS-05 IN_BEARBEITUNG). E2E: Initial,
Navigation, Session.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` um Steuernummer/Betriebsdatum
- `demo/e2e/us-ug-gruendung.spec.ts` – erweiterte CTA-Tests + Session
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (107 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Betriebsdatum-Signal-Text nach beantworteter Rückfrage anpassen (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA-Text bei Steuernummer IN_BEARBEITUNG differenzieren (optional)

---

## 2026-07-29 – Iteration 19: Steuernummer-Signal bei VS-05 IN_BEARBEITUNG

### Was
Fairness-Signal `UG-STEUERNUMMER-FEHLT` gilt auch, wenn VS-05
`IN_BEARBEITUNG` ist (nicht nur `AUSSTEHEND`). Text und nächster Schritt
passen sich an: bei offener Rückfrage blockiert; nach Antwort „in
Bearbeitung – noch nicht erteilt“. Hinweise-CTA „Zum Finanzamt“ bleibt
bei beiden Status; CTA-Hilfstext wechselt. E2E: Initialtext + Session
nach Antwort.

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – Regel + Status-abhängiger Text
- `demo/app/gruendung/hinweise/page.tsx` – CTA bei AUSSTEHEND/IN_BEARBEITUNG
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Tests (Initial + Session)
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (105 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-CTA für Steuernummer/Betriebsdatum (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Betriebsdatum-Signal-Text nach beantworteter Rückfrage anpassen (optional)

---

## 2026-07-29 – Iteration 18: VS-05 nach Antwort auf IN_BEARBEITUNG

### Was
Session: Nach Beantworten der Finanzamt-Rückfrage (VS-04 → ABGESCHLOSSEN)
startet der nächste AUSSTEHEND-Schritt derselben Behörde (VS-05 Steuernummer)
als `IN_BEARBEITUNG`. Generisch: Listenreihenfolge, nur wenn kein Geschwister-
schritt schon in Bearbeitung. Verlauf erhält System-Ereignis
„Verfahrensschritt gestartet …“. E2E: Status VS-05, Session-Test, Verlauf.

### Dateien
- `demo/context/GruendungStateContext.tsx` – Promote nächster Schritt + Event
- `demo/e2e/us-ug-gruendung.spec.ts` – Erwartung VS-05 + zwei Tests angepasst/neu
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (103 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: Steuernummer-Signal auch bei VS-05 IN_BEARBEITUNG (Text anpassen)
- Übersicht: Fairness-CTA für Steuernummer/Betriebsdatum (optional)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)

---

## 2026-07-29 – Iteration 17: VS-04 nach Antwort auf ABGESCHLOSSEN

### Was
Session: Beantworten der Finanzamt-Rückfrage schließt den zugehörigen
Verfahrensschritt VS-04 (`IN_BEARBEITUNG` → `ABGESCHLOSSEN` mit Datum und
Ergebnis). VS-05 bleibt ausstehend; Finanzamt-Zähler wird 2/3. Verlauf
erhält ein System-Ereignis „Verfahrensschritt erledigt …“. Generische
Regel für alle Schritte mit „Rückfrage“ im Namen und erledigter Behörden-RQ.
E2E: Erledigt-Status, Zähler, Verlaufseintrag.

### Dateien
- `demo/context/GruendungStateContext.tsx` – `updatedSchritte` + VS-Event
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Session-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (102 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA für Steuernummer/Betriebsdatum (optional)
- Behörden: nach Antwort VS-05 ggf. in IN_BEARBEITUNG heben (optional)

---

## 2026-07-29 – Iteration 16: Behörden VS-04 → Link zur Rückfrage

### Was
Behörden-Seite: Verfahrensschritte, die eine offene Rückfrage betreffen
(z. B. VS-04 „Rückfrage Finanzamt: Kleinunternehmerregelung“), erhalten
einen CTA „Zur Rückfrage“ mit Ziel `/gruendung/rueckfragen#rq-…`.
CTA nur solange die Rückfrage unbeantwortet und der Schritt nicht erledigt
ist. Nach Beantworten entfallen Schritt-Link und Behörden-CTA.
E2E: Linkziel, Navigation, Abwesenheit bei anderen Schritten, Session-Reaktion.

### Dateien
- `demo/app/gruendung/behoerden/page.tsx` – `rueckfrageFuerSchritt`, Schritt-CTA
- `demo/e2e/us-ug-gruendung.spec.ts` – vier VS-04-/Session-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (100 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA für Steuernummer/Betriebsdatum (optional)
- Behörden: VS-04 Status nach Beantwortung auf ABGESCHLOSSEN setzen (optional)

---

## 2026-07-29 – Iteration 15: Übersicht Fairness-Einträge mit Kurz-CTA

### Was
Übersicht-Fairness-Kurzblock: handlungsrelevante Signale erhalten Kurz-CTAs
je nach Typ — Rückfrage → `#rq-…`, Unterlagen → `#dok-…`, BG → `#beh-…`.
CTA nur solange der auslösende Aktenzustand greift; nach Beantworten der
Rückfrage entfällt der RQ-CTA (Unterlagen/BG bleiben). E2E: Linkziele,
Navigation, Session-Reaktion.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel`, CTAs im Fairness-Block
- `demo/e2e/us-ug-gruendung.spec.ts` – vier CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (96 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Behörden: Link von offenem Schritt VS-04 zur Rückfrage
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)
- Übersicht: Fairness-CTA für Steuernummer/Betriebsdatum (optional)

---

## 2026-07-29 – Iteration 14: Hinweise-CTA parallele Behörden → Behörden

### Was
Hinweise-Seite: INFO-Signale zu parallel aktiven Behörden
(`UG-PARALLELE-BEHOERDEN` / `UG_PARALLELE_BEHOERDEN_AKTIV`) erhalten einen CTA
„Zu den Behörden“ mit Ziel `/gruendung/behoerden`. INFO-Signale werden
einzeln gerendert (wie RELEVANT/HINWEIS). CTA nur solange mehr als eine
Behörde `IN_BEARBEITUNG` oder `RUECKFRAGE_OFFEN` ist. E2E: Linkziel und Navigation.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – INFO-Map, parallele-Behörden-CTA
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (92 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-Einträge mit Kurz-CTA (Rückfrage / Unterlagen / BG)
- Behörden: Link von offenem Schritt VS-04 zur Rückfrage
- Hinweise: nach Session-Wechsel CTA-Verschwinden für parallele Behörden (optional)

---

## 2026-07-29 – Iteration 13: Übersicht nächster Schritt + Aufgaben-Links

### Was
Übersicht erhält den Block „Was als Nächstes?“ mit `naechsterSchritt`
(inkl. CTA aus Aktenzustand) und Liste `offeneAufgaben` mit Deep-Links:
Rückfrage → `#rq-…`, Unterlagen → `#dok-…`, BG → `#beh-…`.
Nach Beantworten der Rückfrage entfällt die RQ-Aufgabe; CTA wechselt zu
Unterlagen. E2E: Sichtbarkeit, Linkziele, Navigation, Session-Reaktion.

### Dateien
- `demo/app/gruendung/page.tsx` – Block, Ziel-Heuristik, data-testid
- `demo/e2e/us-ug-gruendung.spec.ts` – vier Tests (Block, CTA, Dok-Link, Session)
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (90 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: CTA für parallele-Behörden-INFO zu `/gruendung/behoerden`
- Übersicht: Fairness-Einträge mit Kurz-CTA (Rückfrage / Unterlagen / BG)
- Behörden: Link von offenem Schritt VS-04 zur Rückfrage

---

## 2026-07-29 – Iteration 12: Übersicht Fairness nur RELEVANT+HINWEIS

### Was
Übersicht-Fairness-Kurzblock filtert Signale auf Priorität RELEVANT und
HINWEIS. INFO (z. B. parallele Behörden) erscheint nur noch auf
`/gruendung/hinweise`. Linktext nennt die Anzahl weiterer Hinweise.
E2E: Prioritäts-Filter, INFO-Abwesenheit auf Übersicht, INFO-Präsenz auf Hinweise.

### Dateien
- `demo/app/gruendung/page.tsx` – Filter, data-prioritaet, Linktext
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Filter-/INFO-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: `naechsterSchritt` / offene Aufgaben mit Link zur betroffenen Stelle
- Hinweise: CTA für parallele-Behörden-INFO zu `/gruendung/behoerden`
- Übersicht: Fairness-Einträge mit Kurz-CTA (Rückfrage / Unterlagen / BG)

---

## 2026-07-29 – Iteration 11: Hinweise-CTA für Betriebsdatum → Verfahrensstatus

### Was
Hinweise-Seite: HINWEIS-Signale zum überschrittenen Betriebsdatum
(`UG-BETRIEBSDATUM` / `UG_BETRIEBSDATUM_UEBERSCHRITTEN`) erhalten einen CTA
„Zum Verfahrensstatus“ mit Anker `/gruendung#verfahrensstatus`.
Übersicht: Status-/Fortschrittskarte trägt `id="verfahrensstatus"` und
`scroll-margin`. CTA nur solange der Verfahrensstatus nicht abgeschlossen ist.
E2E: Linkziel und Navigation zum Statusblock.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – CTA für UG-BETRIEBSDATUM
- `demo/app/gruendung/page.tsx` – Anker-ID auf Verfahrensstatus-Karte
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Betriebsdatum-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen (INFO ausblenden)
- Übersicht: `naechsterSchritt` / offene Aufgaben mit Link zur betroffenen Stelle
- Hinweise: CTA für parallele-Behörden-INFO zu `/gruendung/behoerden`

---

## 2026-07-29 – Iteration 10: Verlauf-Filter nach Ereignistyp

### Was
Verlauf erhält eine zweite Filterzeile nach Ereignistyp (Alle / Vorgang /
Dokumente / Rückfragen / Bescheide) mit Anzahlen und `aria-pressed`.
Stelle- und Typ-Filter wirken kombiniert (UND). Zähler der jeweils anderen
Zeile passen sich an. Leerzustand erklärt die aktive Filterkombination.
E2E: Chip-Sichtbarkeit, Einzelkategorien, Kombination Stelle+Typ.

### Dateien
- `demo/app/gruendung/verlauf/page.tsx` – Typ-Filter, kombinierte Filterlogik
- `demo/e2e/us-ug-gruendung.spec.ts` – fünf Typ-Filter-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst
- Hinweise: CTA für Betriebsdatum-HINWEIS zur Übersicht/Schritte
- Übersicht: nächster Schritt mit direktem Link zur betroffenen Stelle

---

## 2026-07-29 – Iteration 9: Hinweise-CTA für Steuernummer → Finanzamt

### Was
Hinweise-Seite: HINWEIS-Signale zur fehlenden Steuernummer (`UG-STEUERNUMMER-FEHLT`)
erhalten einen CTA „Zum Finanzamt“ mit Anker `/gruendung/behoerden#beh-{id}`
(Finanzamt-Behördenkarte). CTA nur solange Verfahrensschritt VS-05
`AUSSTEHEND` ist. E2E: Linkziel und Navigation zur Finanzamt-Karte.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – CTA für UG-STEUERNUMMER-FEHLT
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei Steuernummer-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Filter nach Ereignistyp (optional)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst
- Hinweise: CTA für Betriebsdatum-HINWEIS zur Übersicht/Schritte

---

## 2026-07-29 – Iteration 8: Hinweise-CTA für fehlende Unterlagen → Dokumente

### Was
Hinweise-Seite: HINWEIS-Signale zu fehlenden Unterlagen (`UG-UNTERLAGEN-FEHLEND`)
erhalten einen CTA „Zu den Unterlagen“ mit Anker
`/gruendung/dokumente#dok-{id}` (erstes ausstehendes Dokument).
Dokumentenkarten tragen `id` + `scroll-margin`. CTA nur solange
`ANGEFORDERT`/`ABGELEHNT`-Dokumente existieren. E2E: Linkziel, Navigation,
Verschwinden nach Upload.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – CTA für UG-UNTERLAGEN-FEHLEND
- `demo/app/gruendung/dokumente/page.tsx` – Anker-IDs auf Dokumentenkarten
- `demo/e2e/us-ug-gruendung.spec.ts` – drei Unterlagen-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Filter nach Ereignistyp (optional)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst
- Hinweise: CTA für Steuernummer-HINWEIS zur Finanzamt-Behördenkarte

---

## 2026-07-29 – Iteration 7: Hinweise-CTA für BG-Anmeldung → Behördenkarte

### Was
Hinweise-Seite: RELEVANT-Signale zur ausstehenden BG-Anmeldung erhalten einen
direkten CTA „Zur Behördenkarte“ mit Anker `/gruendung/behoerden#beh-{id}`.
Behörden-Karten tragen `id` + `scroll-margin`. CTA nur solange BG-Status
`NICHT_GESTARTET` ist. E2E: Linkziel und Navigation zur BG-Karte.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – CTA für UG-BG-ANMELDUNG-Signal
- `demo/app/gruendung/behoerden/page.tsx` – Anker-IDs auf Behörden-Karten
- `demo/e2e/us-ug-gruendung.spec.ts` – zwei BG-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Filter nach Ereignistyp (optional)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst
- Hinweise: CTA für fehlende Unterlagen (HINWEIS) zu `/gruendung/unterlagen`

---

## 2026-07-29 – Iteration 6: Hinweise-CTA aus RELEVANT-Rückfrage-Signal

### Was
Hinweise-Seite: RELEVANT-Signale vom Typ offene Rückfrage-Frist erhalten einen
direkten CTA „Frage beantworten“ mit Anker `/gruendung/rueckfragen#rq-{id}`.
CTA nur solange die Rückfrage offen ist; nach Beantworten entfällt er.
E2E: Linkziel, Navigation zur Karte, Verschwinden nach Antwort.

### Dateien
- `demo/app/gruendung/hinweise/page.tsx` – pro RELEVANT-RQ-Signal CTA + Anker
- `demo/e2e/us-ug-gruendung.spec.ts` – drei Hinweise-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Filter nach Ereignistyp (optional)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst
- Hinweise: CTA für BG-Anmeldung (RELEVANT) zu Behörden-Karte

---

## 2026-07-29 – Iteration 5: Fairness-Kurzblock auf der Übersicht

### Was
Übersicht zeigt regelbasierte Fairness-Signale inline (wie AV) mit Titel,
Erklärung und nächstem Schritt. Link „Alle Details ansehen“ führt zu
`/gruendung/hinweise`. E2E deckt Kurzblock, Signaltext und Navigation ab.

### Dateien
- `demo/app/gruendung/page.tsx` – Fairness-Kurzblock + `berechneFairnessSignaleGruendung`
- `demo/e2e/us-ug-gruendung.spec.ts` – Übersicht-Fairness-Test
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: direkter CTA „Frage beantworten“ aus RELEVANT-Signal (Anker `#rq-…`)
- Verlauf: Filter nach Ereignistyp (optional)
- Übersicht: Fairness-Signale auf RELEVANT+HINWEIS begrenzen, wenn Liste wächst

---

## 2026-07-29 – Iteration 4: Hinweise-Tab + Übersicht-Link zur offenen Frage

### Was
UG-Navigation erhält den Tab „Hinweise“ (bestehende Fairness-Seite).
Übersicht: Behörden-Zeilen mit offener Rückfrage verlinken zur Anker-Zielkarte
`/gruendung/rueckfragen#rq-{id}`; Behörden ohne offene Frage bleiben ohne Link.
Hinweise-Seite ohne Story-Badge/Developer-Jargon. E2E: 6 Tabs, Nav, Übersicht-Link, Hinweise-Inhalt.

### Dateien
- `demo/app/gruendung/layout.tsx` – Tab „Hinweise“
- `demo/app/gruendung/page.tsx` – Behörden-Zeile mit RQ-Link + Link zu Behörden
- `demo/app/gruendung/hinweise/page.tsx` – bürgernahe Kopfzeile
- `demo/e2e/us-ug-gruendung.spec.ts` – Tab-, Übersichts- und Hinweise-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Fairness-Kurzblock mit Link zu /gruendung/hinweise (wie AV)
- Verlauf: Filter nach Ereignistyp (optional)
- Hinweise: direkter CTA „Frage beantworten“ aus RELEVANT-Signal

---

## 2026-07-29 – Iteration 3: Behörden-CTA zu offener Rückfrage

### Was
Behörden-Karte zeigt bei offener Rückfrage der jeweiligen Stelle einen
Warn-Hinweis mit Fragetext, Frist und CTA „Frage beantworten“ (Anker
`#rq-{id}`). Rückfragen-Karten tragen `id` + `scroll-margin`. E2E deckt
CTA, Navigation und Abwesenheit bei anderen Behörden ab.

### Dateien
- `demo/app/gruendung/behoerden/page.tsx` – CTA pro Behörde mit offenen Fragen
- `demo/app/gruendung/rueckfragen/page.tsx` – Anker-IDs auf Karten
- `demo/e2e/us-ug-gruendung.spec.ts` – Behörden-CTA-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Tab „Hinweise“ in der UG-Navigation (Seite existiert bereits)
- Übersicht: Behörden-Zeile mit Link zur offenen Rückfrage
- Verlauf: zusätzlicher Filter nach Ereignistyp (optional)

---

## 2026-07-29 – Iteration 2: Verlauf-Filter nach handelnder Stelle

### Was
Verlauf zeigt Filterchips (Alle / Sie / Behörde / System) mit Anzahlen und
`aria-pressed`. Timeline filtert clientseitig; leerer System-Filter erklärt den
Leerzustand. E2E deckt Filter und Leerzustand ab.

### Dateien
- `demo/app/gruendung/verlauf/page.tsx` – Stelle-Filter, Zähler, Leerzustand
- `demo/e2e/us-ug-gruendung.spec.ts` – Filter- und Leerzustand-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Behörden-Karte: CTA zu offener Rückfrage der jeweiligen Behörde
- Tab „Hinweise“ in der UG-Navigation (oder Kontext-Banner von Übersicht)
- Verlauf: zusätzlicher Filter nach Ereignistyp (optional)

---

## 2026-07-29 – Iteration 1: Strukturierte Rückfrage-Antwort + Fristcountdown

### Was
Rückfragen-Seite erhält ein echtes Antwortformular (Textarea + Label + a11y) und
einen Fristcountdown mit Dringlichkeitsstufe (≤ 3 Tage). Session speichert
`antwortText` / `beantwortetAm`; Verlauf zeigt Antwortkürzel. Ohne Text greift
eine Demo-Beispielantwort (E2E-Kompatibilität).

### Dateien
- `demo/types/gruendung.ts` – `antwortText?`, `beantwortetAm?` an `GruendungsRueckfrage`
- `demo/context/GruendungStateContext.tsx` – `answerRueckfrage(id, text?)`, Antwort-Map
- `demo/app/gruendung/rueckfragen/page.tsx` – Formular, Countdown, Quittungsanzeige
- `demo/e2e/us-ug-gruendung.spec.ts` – Formular- und Freitext-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` (siehe Commit-Nachricht / Agent-Report).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Filter nach Handelnder Stelle (Gründer / Behörde / System)
- Behörden-Karte: CTA zu offener Rückfrage der jeweiligen Behörde
- Tab „Hinweise“ in der UG-Navigation (oder Kontext-Banner von Übersicht)
)
