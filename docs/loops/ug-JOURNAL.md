# UG Domain-Loop Journal

Branch: `loop/ug` · Worktree: `D:\Projects\open-state-loop-ug`

Erlaubte Pfade nur: `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`,
`demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`,
`demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md`.

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
