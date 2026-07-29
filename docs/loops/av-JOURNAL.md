# AV Domain-Loop Journal

Branch: `loop/av`  
Worktree: `D:\Projects\open-state-loop-av`  
Scope: nur `demo/app/fall/**`, DemoStateContext, fairness/rules, mockFall, e2e us-av-*, dieses Journal.

---

## 2026-07-29 – Iteration 1: Fortschritt nach Demo-Statuswechsel + Ruhezustand

### Was
Bugfix/UX-Klarheit auf der Fall-Übersicht (US-AV-002):

1. **Fortschrittsbalken kollabierte auf 0 %**, sobald der Demo-Status nach beantworteter Rückfrage auf `UNTERLAGEN_FEHLEN` wechselte (Status fehlte in der linearen `statusFlow`-Kette → `findIndex === -1`).
2. Mapping über `resolveProgressIndex`: `UNTERLAGEN_FEHLEN` / `RUECKFRAGE_OFFEN` → Handlungsphase; `PAUSIERT` → Prüfung; Fallback nie 0 %.
3. Dynamisches Schrittlabe l: „Unterlagen fehlen noch“ vs. „Ihre Antwort wird erwartet“.
4. **Ruhezustand-Banner**, wenn keine offenen Aufgaben und Status `IN_PRUEFUNG` (nach vollständiger Demo-Session).
5. Ausstehende Unterlagen zählen jetzt auch `ABGELEHNT` (parität zu `/fall/dokumente`).
6. Fairness-Regel Signal 2: `ABGELEHNT` wie fehlend behandeln; Priorität `RELEVANT` bei Ablehnung.
7. E2E: Fortschritt nach RQ-Antwort + Ruhezustand nach Uploads.

### Dateien
- `demo/app/fall/page.tsx`
- `demo/lib/fairness/rules.ts`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `docs/loops/av-JOURNAL.md` (neu)

### Story-IDs
- US-AV-002 (Status einsehen / Fortschritt)
- US-AV-001 (nächste Schritte / Ruhezustand)
- US-AV-008 (Fairness-Signale, Unterlagen-Regel)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-AV-PROGRESS-UNTERLAGEN (oder analog Q-07x Fortschritt/Demo-Session-Klarheit AV)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Rückfrage-Antwort mit kurzem Bestätigungsdialog (was wurde „beantwortet“?) oder
- Fristen-Countdown auf Übersicht für offene Dokumente (analog RQ-Frist)
- Tab-Badges für offene Fragen/Unterlagen in `fall/layout.tsx`
