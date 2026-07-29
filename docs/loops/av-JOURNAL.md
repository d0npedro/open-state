# AV Domain-Loop Journal

Branch: `loop/av`  
Worktree: `D:\Projects\open-state-loop-av`  
Scope: nur `demo/app/fall/**`, DemoStateContext, fairness/rules, mockFall, e2e us-av-*, dieses Journal.

---

## 2026-07-29 – Iteration 9: Verlauf Upload-Dokumentbezeichnung (Q-105)

### Was
Upload-Ereignisse im Verlauf heben die Dokumentbezeichnung hervor (US-AV-007 / Q-105):

1. **`timeline-upload-block`** für `DOKUMENT_EINGEREICHT` — Label „Eingereichtes Dokument“, Bezeichnung prominent (`timeline-upload-name`).
2. Ableitung aus Beschreibung (`… hochgeladen`); gilt für Mock- und Session-Uploads.
3. Demo-Timeline-Details enthalten Bezeichnung + Dokument-ID.
4. E2E: 2 Mock-Blöcke; Session-Upload per Tab-Nav (kein `page.goto`, DEC-012).

### Dateien
- `demo/app/fall/verlauf/page.tsx`
- `demo/context/DemoStateContext.tsx`
- `demo/e2e/us-av-007-verlauf.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-007 (Historie nachvollziehen)
- US-AV-003 (Unterlagen / Upload)

### Build
`npm run lint` + `npm run build` + `npm run test:e2e:av` (PW_E2E_CI=1) → **128 passed**, Exit 0

### Vorschlag Queue-ID
- Q-105 (AV Verlauf: Upload-Ereignisse mit Dokumentbezeichnung hervorheben)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist (falls noch Lücken)
- Übersicht: Upload-Quittung / nächste offene Unterlage nach Session-Upload

---

## 2026-07-29 – Iteration 8: Übersicht Termin-Kachel Status live (Q-104)

### Was
Schnellzugriff-Kachel „Nächster Termin“ auf `/fall` zeigt Teilnahme-Status live (US-AV-005 / Q-104):

1. **Status-Chip** `Ausstehend` / `Bestätigt` (`data-testid="kachel-termin-status"`).
2. **Wertzeile** `Datum · Status`; unbestätigt = warning (analog Tab-Badge).
3. Nach `confirmTermin` + Tab-Nav zur Übersicht: Kachel zeigt **Bestätigt** ohne `page.goto` (DEC-012).
4. E2E: initial + Live-Wechsel nach Session-Bestätigung.

### Dateien
- `demo/app/fall/page.tsx`
- `demo/e2e/us-av-001-002-fall-uebersicht.spec.ts`
- `demo/e2e/us-av-005-termine.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-005 (Termin / Teilnahme)
- US-AV-002 (Status auf Übersicht)

### Build
`npm run lint` + `npm run build` + `npm run test:e2e:av` → **126 passed**, Exit 0

### Vorschlag Queue-ID
- Q-104 (AV Übersicht: Termin-Kachel Status „Bestätigt“ live)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Q-105: Verlauf Upload-Ereignisse mit Dokumentbezeichnung hervorheben
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist (falls noch Lücken)

---

## 2026-07-29 – Iteration 7: Termin-Bestätigung session-lokal (Q-092)

### Was
Unbestätigter Termin (T-001) lässt sich in der Demo session-lokal bestätigen (US-AV-005 / Q-092):

1. **`confirmTermin(id)`** in `DemoStateContext` — `AUSSTEHEND` → `BESTAETIGT`, nur Browser-Session.
2. **Tab-Badge „Termine“** nutzt weiter `terminHatHandlungsbedarf` und entfällt live nach Bestätigung.
3. **`/fall/termine`:** CTA „Termin bestätigen“, Status-Chip + Bestätigungshinweis; Demo-Hinweis im Kopf.
4. Timeline: Ereignis „Termin bestätigt“ (STATUS_GEAENDERT, handelndeStelle BUERGER).
5. E2E: Badge weg nach Klick; Session bleibt über Tab-Nav (kein `page.goto` nach Interaktion, DEC-012).

### Dateien
- `demo/context/DemoStateContext.tsx`
- `demo/app/fall/termine/page.tsx`
- `demo/data/mockFall.ts` (Kommentar)
- `demo/e2e/us-av-005-termine.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-005 (Termin einsehen / Teilnahme)

### Build
`npm run lint` + `npm run build` + `npm run test:e2e:av` → Exit 0

### Vorschlag Queue-ID
- Q-092 (AV Termin-Bestätigung session-lokal)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist
- Verlauf: Upload-Ereignisse mit Dokumentbezeichnung hervorheben
- Übersicht: Termin-Kachel Status „Bestätigt“ live nach Session-Aktion

---

## 2026-07-29 – Iteration 6: Antworttext im Verlauf lesbar (Quittungsblock)

### Was
Timeline-Detail nach Rückfrage-Antwort zeigt den vollen Wortlaut lesbar (US-AV-007 / US-AV-004):

1. **Kein 80-Zeichen-Kürzel** mehr in `DemoStateContext` — `details` enthält den kompletten Antworttext.
2. **Beschreibung** mit Bezug zur Rückfrage (Frage-Kurzfassung, max. 72 Zeichen).
3. **`/fall/verlauf`:** für `RUECKFRAGE_BEANTWORTET` eigener Quittungsblock (`data-testid="timeline-antwort-block"`) analog `/fall/rueckfragen` — Label „Ihre übermittelte Antwort“, `white-space: pre-wrap`, grüner Rahmen.
4. E2E: langer Freitext erscheint ungekürzt im Verlauf (ohne „…“).

### Dateien
- `demo/context/DemoStateContext.tsx`
- `demo/app/fall/verlauf/page.tsx`
- `demo/e2e/us-av-007-verlauf.spec.ts`
- `docs/loops/av-JOURNAL.md`

### Story-IDs
- US-AV-007 (Historie nachvollziehen)
- US-AV-004 (Antwort-Quittung / Transparenz)

### Build
`npm run lint` + `npm run build` → Exit 0

### Vorschlag Queue-ID
- Q-AV-VERLAUF-ANTWORT (Verlauf Antworttext lesbar)

### Nächster sinnvoller AV-Schritt (Vorschlag)
- Fairness-Signal UNTERLAGE mit berechneter Dokumenten-Frist
- Termin-Bestätigung session-lokal (Badge entfällt live)
- Verlauf: Upload-Ereignisse mit Dokumentbezeichnung hervorheben

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
