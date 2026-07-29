# UG Domain-Loop Journal

Branch: `loop/ug` · Worktree: `D:\Projects\open-state-loop-ug`

Erlaubte Pfade nur: `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`,
`demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`,
`demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md`.

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
