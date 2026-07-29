# Kita Domain-Loop Journal

Branch: `loop/kita` · Worktree: `D:\Projects\open-state-loop-kita`

## Iteration 2026-07-29 – US-KJ-003 Monatsbericht

### Was
Demo-Route `/kita/monatsbericht`: Monatsbericht der fiktiven Einrichtung „Kita Sonnenwinkel“ mit Kennzahlen je Gruppe (Anwesenheit, Auslastung, Personalausfall, Personalschlüssel-Unterschreitungstage), Vorjahresvergleich, ausgewiesener Datenlücke, Methodik und CSV/Druck-Export. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/types/kitaMonatsbericht.ts` (neu)
- `demo/data/mockKitaMonatsbericht.ts` (neu)
- `demo/app/kita/monatsbericht/page.tsx` (neu)
- `demo/app/kita/layout.tsx` (Nav-Eintrag)
- `demo/app/kita/einrichtung/page.tsx` (Link zum Monatsbericht)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 – Monatsbericht abrufen

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit-Message / Status dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
US-KJ-004 Meldung prüfen/freigeben (Monatsmeldung → Jugendamt, aktiver Bestätigungsschritt) oder US-KJ-001 Tagesstand-Erfassung (aggregiert, session-lokal).
