# UG Domain-Loop Journal

Branch: `loop/ug` · Worktree: `D:\Projects\open-state-loop-ug`

Erlaubte Pfade nur: `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`,
`demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`,
`demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md`.

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
