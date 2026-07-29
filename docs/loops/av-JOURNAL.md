# AV Domain-Loop Journal

Branch: `loop/av`  
Worktree: `D:\Projects\open-state-loop-av`  
Scope: nur `demo/app/fall/**`, DemoStateContext, fairness/rules, mockFall, e2e us-av-*, dieses Journal.

---

## 2026-07-29 – Iteration 5: Tab-Badge Termine (unbestätigt / bald fällig)

### Was
Tab „Termine“ zeigt Zähler-Badge nur bei Handlungsbedarf (Q-089 / US-AV-005):

1. `terminHatHandlungsbedarf`: Status `AUSSTEHEND` **oder** nicht abgesagt und Resttage 0–1 (`FIKTIVES_HEUTE`).
2. Hilfen in `rules.ts`: `parseDeutschesDatumZuIso`, `terminHatHandlungsbedarf`.
3. Mock-Termin T-001 → `AUSSTEHEND` (Badge in der Demo sichtbar).
4. Übersicht „Nächster Termin“: erster nicht abgesagter Termin (nicht nur BESTAETIGT).
5. E2E: Badge auf Übersicht + Termine-Seite; Status „Ausstehend“.

### Dateien
- `demo/lib/fairness/rules.ts`
- `demo/data/mockFall.ts`
- `demo/app/fall/layout.tsx`
- `demo/app/fall/page.tsx`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `demo/e2e/us-av-005-termine.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-005 (Termin einsehen)
- US-AV-001 (Handlungsorientierung Navigation)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-089 (AV Tab-Badge Termine)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Verlauf: Antworttext in Timeline-Detail lesbarer formatieren
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist
- Termin-Bestätigung session-lokal (Badge entfällt live)

---

## 2026-07-29 – Iteration 4: Fristen-Countdown offener Unterlagen (Übersicht)

### Was
Offene Dokumente zeigen berechnete Resttage analog zur Rückfrage-Frist (US-AV-002/003):

1. `Dokument.fristDatum` (ISO) in Mock + Typ; Anzeige-Frist bleibt deutsch.
2. **Übersicht `/fall`:** Abschnitt „Fristen offener Unterlagen“ mit Countdown-Chip je Dokument; Dringlichkeit ≤ 5 Tage.
3. Schnellzugriff-Kachel „Unterlagen“ zeigt nächste Frist (`noch X Tage`).
4. **`/fall/dokumente`:** Countdown neben „Einreichen bis“.
5. Berechnung über `berechneFristTage` + `FIKTIVES_HEUTE` (2024-11-24 → 9 Tage bis 03.12.).
6. E2E: Übersicht + Dokumente.

### Dateien
- `demo/types/index.ts`
- `demo/data/mockFall.ts`
- `demo/app/fall/page.tsx`
- `demo/app/fall/dokumente/page.tsx`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `demo/e2e/us-av-003-dokumente.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-002 (Status / Orientierung)
- US-AV-003 (Unterlagen nachreichen – Frist)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-086 (AV Fristen-Countdown offene Dokumente)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Tab-Badge „Termine“ nur wenn unbestätigt / morgen fällig
- Verlauf: Antworttext in Timeline-Detail lesbarer formatieren
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist

---

## 2026-07-29 – Iteration 3: Rückfrage-Bestätigungsdialog + Antwortquittung

### Was
Kein 1-Klick-Absenden mehr (US-AV-004): Bürger sieht explizit, *was* übermittelt wird.

1. **«Jetzt beantworten»** öffnet Inline-Bestätigung (`role="region"`) mit Fragekurzfassung.
2. Optionales Freitextfeld; leer → Demo-Beispielantwort.
3. **«Antwort absenden»** / **«Abbrechen»**; Absenden speichert `antwortText` + `beantwortetAm` in der Session.
4. Quittung nach Absenden zeigt den übermittelten Text.
5. Timeline-Detail enthält Antwortkürzel.
6. E2E: Dialog, Abbrechen, Freitext, Zwei-Schritt in Übersicht-Tests.

### Dateien
- `demo/app/fall/rueckfragen/page.tsx`
- `demo/context/DemoStateContext.tsx`
- `demo/e2e/us-av-004-rueckfragen.spec.ts`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-004 (Rückfrage verstehen / beantworten)
- US-AV-001 (Handlungsorientierung nach Antwort)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-085 (AV Rückfrage-Bestätigungsdialog)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Fristen-Countdown auf Übersicht für offene Dokumente (analog RQ-Frist)
- Tab-Badge „Termine“ nur wenn unbestätigt / morgen fällig (optional)
- Verlauf: Antworttext in Timeline-Detail lesbarer formatieren

---

## 2026-07-29 – Iteration 2: Tab-Badges für offene Fragen/Unterlagen

### Was
Handlungsbedarf in der Bereichsnavigation ohne Extra-Klick sichtbar (US-AV-001/003/004):

1. **`FallTabNav`** liest DemoState und zeigt Zähler-Badges auf den Tabs „Unterlagen“ und „Fragen“.
2. Badge-Logik: offene Rückfragen (`!beantwortet`); Unterlagen `ANGEFORDERT` | `ABGELEHNT` (parität zu Übersicht/Dokumente).
3. Accessible Name: `aria-label` z. B. „Fragen, 1 offen“; `data-testid` für E2E.
4. Badges reagieren live auf Demo-Interaktionen (Antwort/Upload) und verschwinden bei Count 0.
5. E2E: initiale Zähler (1 / 2) + Verschwinden des Fragen-Badges nach Beantworten.

### Dateien
- `demo/app/fall/layout.tsx`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `demo/e2e/us-av-004-rueckfragen.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-001 (nächste Schritte / Orientierung)
- US-AV-003 (Unterlagen – Anzahl ausstehend)
- US-AV-004 (Fragen – Anzahl offen)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-AV-TAB-BADGES (Navigation Handlungszähler AV)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Rückfrage-Antwort mit kurzem Bestätigungsdialog (was wurde „beantwortet“?) oder
- Fristen-Countdown auf Übersicht für offene Dokumente (analog RQ-Frist)
- Tab-Badge „Termine“ nur wenn unbestätigt / morgen fällig (optional)

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
