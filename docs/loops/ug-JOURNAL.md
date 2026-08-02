# UG Domain-Loop Journal

Branch: `loop/ug` · Worktree: `D:\Projects\open-state-loop-ug`

Erlaubte Pfade nur: `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`,
`demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`,
`demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md`.

**Rotation (Q-303):** Aktives Journal max. 15 Iterationen (neueste zuerst).  
Ältere Einträge: [`archive/journals/ug-2026-07-older.md`](../../archive/journals/ug-2026-07-older.md) (27 Iterationen).  
Index: [`archive/journals/README.md`](../../archive/journals/README.md).

---

## 2026-07-29 – Iteration 42: Upload-Quittung → Verlauf-Tiefenlink (US-UG-003/005)

### Was
Nach Demo-Upload einer Unterlage ist das Session-Ereignis im Verlauf
auffindbar und per Tiefenlink hervorgehoben (Parität zu RQ-Antwort It. 41):

1. **`demoDokUploadEreignisId`** in `GruendungStateContext` – stabile ID
   `UG-DEMO-DOK-{dokId}` für Ereignis und Verlauf-Anker.
2. **Upload-Quittung** (Dokumente): Sekundär-CTA „Im Verlauf ansehen“ →
   `/gruendung/verlauf#ere-UG-DEMO-DOK-DOK-03` (testid `dok-verlauf-link-*`).
3. **Verlauf**: Session-Upload-Badge „Ihr Upload“, grüner Rand,
   `data-session-upload`; Hash-Hervorhebung (`aria-current`) wie Antwort.
4. E2E: Tiefenlink + Badge; Tab-Nav behält Session (DEC-012); Filter „Dokumente“.

### Dateien
- `demo/context/GruendungStateContext.tsx` – Export `demoDokUploadEreignisId`
- `demo/app/gruendung/dokumente/page.tsx` – Quittung + Verlauf-Link
- `demo/app/gruendung/verlauf/page.tsx` – Session-Upload-Markierung
- `demo/e2e/us-ug-gruendung.spec.ts` – 2 neue Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (132 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Primär-CTA-Labels optional an Fairness-Kurz-CTAs angleichen (optional)
- Fairness-Verlauf-Tiefenlink für BG/Steuernummer-Session-Events (optional)
- Übersicht Upload-Quittung: optionaler Verlauf-Link pro Session-Upload

---

## 2026-07-29 – Iteration 41: Session-Antwort im Verlauf hervorheben (US-UG-005)

### Was
Nach Demo-Antwort auf eine Rückfrage ist das Session-Ereignis im Verlauf
auffindbar und per Tiefenlink hervorgehoben (Transparenz US-UG-004/005):

1. **`demoRqAntwortEreignisId`** in `GruendungStateContext` – stabile ID
   `UG-DEMO-RQ-{rqId}` für Ereignis und Verlauf-Anker.
2. **Rückfragen-Quittung**: Sekundär-CTA „Im Verlauf ansehen“ →
   `/gruendung/verlauf#ere-UG-DEMO-RQ-RQ-01` (testid `rq-verlauf-link-*`).
3. **Verlauf**: Session-Antwort-Badge „Ihre Antwort“, grüner Rand,
   `data-session-antwort`; Hash-Hervorhebung (`aria-current`) wie Fairness-Tiefenlink.
4. E2E: Tiefenlink + Badge; Tab-Nav behält Session (DEC-012); Filter „Rückfragen“.

### Dateien
- `demo/context/GruendungStateContext.tsx` – Export `demoRqAntwortEreignisId`
- `demo/app/gruendung/rueckfragen/page.tsx` – Quittung + Verlauf-Link
- `demo/app/gruendung/verlauf/page.tsx` – Session-Antwort-Markierung
- `demo/e2e/us-ug-gruendung.spec.ts` – 2 neue Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (130 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Primär-CTA-Labels optional an Fairness-Kurz-CTAs angleichen (optional)
- Fairness-Verlauf-Tiefenlink für BG/Steuernummer-Session-Events (optional)
- Upload-Quittung: analoger Verlauf-Tiefenlink zu `UG-DEMO-DOK-*` (optional)

---

## 2026-07-29 – Iteration 40: BG-Demo-Markierung + Fairness-Fallthrough Steuernummer

### Was
Bürger-Handlungsreihe RQ → Unterlagen → BG ist in der Session vollständig
schließbar; danach greift `naechsterSchrittZiel`-Fallthrough auf Fairness
(Steuernummer/Betriebsdatum):

1. **`markBgAnmeldungErledigt`** in `GruendungStateContext`: BEH-04
   ABGESCHLOSSEN, VS-07 erledigt, Aufgabe entfernt, Verlaufs-Events.
2. **Behörden-Karte BG**: Demo-Button „Anmeldung als erledigt markieren“ +
   Quittung (außerhalb Open State, keine echte Meldung).
3. **Primär-CTA** nach RQ + Upload + BG → „Steuernummer-Stand ansehen“
   (fairnessSignalZiel, VS-05 IN_BEARBEITUNG).
4. E2E: Behörden-Demo-Aktion, Übersicht-Fallthrough, Hinweise ohne BG-Signal
   (DEC-012, `goUgTab` nach State).

### Dateien
- `demo/context/GruendungStateContext.tsx` – BG-Session-Flag, Ableitung, Events
- `demo/app/gruendung/behoerden/page.tsx` – Demo-Aktion + Quittung BEH-04
- `demo/e2e/us-ug-gruendung.spec.ts` – 3 neue Tests (Fallthrough + Hinweise + BG)
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (128 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Primär-CTA-Labels optional an Fairness-Kurz-CTAs angleichen (optional)
- Verlauf: Session-Antwort-Ereignis nach RQ-Antwort hervorheben (optional)
- Fairness-Verlauf-Tiefenlink für BG/Steuernummer-Session-Events (optional)

---

## 2026-07-29 – Iteration 39: Fairness → Verlauf-Tiefenlink (US-UG-005)

### Was
Fairness-Signale verlinken sekundär auf das auslösende Audit-Ereignis
(Transparenz US-UG-005; Primär-CTA bleibt handlungsbezogen):

1. **`fairnessSignalVerlaufZiel`** in `gruendung-rules`: RQ → letztes
   `rueckfrage_gestellt` (Mock ERE-06); UNTERLAGE nur bei `dokument_abgelehnt`.
2. **Verlauf**: Anker `#ere-{id}`, `data-testid`, Hash-Scroll/Filter-Reset,
   `aria-current` + optische Hervorhebung (inkl. `hashchange`).
3. **Hinweise + Übersicht**: Sekundär-CTA „Im Verlauf ansehen“.
4. E2E: Übersicht/Hinweise → ERE-06; Anker-Test auf Verlauf (DEC-012).

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – `FairnessVerlaufZiel`, Export
- `demo/app/gruendung/verlauf/page.tsx` – Anker, Hash-Handling
- `demo/app/gruendung/hinweise/page.tsx` – Sekundär-CTA
- `demo/app/gruendung/page.tsx` – Fairness-Kurzblock-Verlaufslink
- `demo/e2e/us-ug-gruendung.spec.ts` – 3 neue Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (125 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-Fallthrough nach BG (Steuernummer/Betriebsdatum) E2E absichern
- Primär-CTA-Labels optional an Fairness-Kurz-CTAs angleichen (optional)
- Verlauf: Session-Antwort-Ereignis nach RQ-Antwort hervorheben (optional)

---

## 2026-07-29 – Iteration 38: naechsterSchrittZiel / aufgabeZiel in gruendung-rules

### Was
Primär- und Aufgaben-CTA-Routing der Übersicht leben in `gruendung-rules.ts`
(US-UG-001, Parität zu `fairnessSignalZiel` Iteration 34):

1. **`aufgabeZiel`**: Textheuristik + Aktenzustand → href/cta/icon/testKey.
2. **`naechsterSchrittZiel`**: Bürger-Reihenfolge RQ → Unterlagen → BG mit
   session-sensitiven Hilfstexten; danach Fairness-Kopplung
   (RELEVANT vor HINWEIS über `fairnessSignalZiel`).
3. **Übersicht** importiert die Exports – keine lokalen Duplikate mehr.
4. E2E: nach RQ + Session-Upload wechselt Primär-CTA zu BG-Hinweis (DEC-012).

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – `AufgabeZiel`, `NaechsterSchrittZiel`, Exports
- `demo/app/gruendung/page.tsx` – Import statt lokaler Routing-Funktionen
- `demo/e2e/us-ug-gruendung.spec.ts` – 1 neuer Test (RQ+Upload → BG)
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (122 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)
- Fairness-Fallthrough nach BG (Steuernummer/Betriebsdatum) E2E absichern
- Primär-CTA-Labels optional an Fairness-Kurz-CTAs angleichen (optional)

---

## 2026-07-29 – Iteration 37: Hinweise UNTERLAGE live + Dokumenten-Frist (AV Q-167)

### Was
UNTERLAGE-Signal live nach Session-Upload inkl. berechneter Frist und CTA
(US-UG-003, Parität zu AV Q-167):

1. **`gruendung-rules`**: Titel/Erklärung mit nächster Einreichungsfrist
   (DOK-03: 15.12.2024 → noch 8 Tage); Priorität RELEVANT bei ≤3 Tagen/Ablehnung.
2. **Hinweise**: eigene UNTERLAGE-Karte (`hinweise-signal-unterlagen*`),
   Signal-Zähler, Reaktions-Banner session-sensitiv (Upload vs. RQ).
3. **Dokumente**: Live-Signal mit `fairness-signal-unterlagen*` + `dok-hinweise-link`.
4. E2E: Frist-Assertionen; nach Upload Signal/CTA entfallen + Banner „Unterlagen“
   (DEC-012, kein `page.goto` nach State).

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – Frist im UNTERLAGE-Signal
- `demo/app/gruendung/hinweise/page.tsx` – Live-Karte, Banner, Zähler
- `demo/app/gruendung/dokumente/page.tsx` – Testids + Hinweise-Link
- `demo/e2e/us-ug-gruendung.spec.ts` – 3 neue Tests (Frist + live)
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (121 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- `naechsterSchrittZiel` / `aufgabeZiel` ggf. in gruendung-rules (optional)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)
- Primär-CTA „Nächster Schritt“ weiter an Fairness-Priorität koppeln (optional)

---

## 2026-07-29 – Iteration 36: Übersicht Upload-Quittung nach Session-Upload

### Was
Nach Session-Upload zeigt die Gründungs-Übersicht eine Upload-Quittung
(US-UG-001/003, Parität zu AV Q-161):

1. **`sessionUploadedIds`** steuert Quittung (`data-testid="upload-quittung"`).
2. Liste der eingegangenen Unterlagen inkl. Einreichungsdatum.
3. **Nächste offene Unterlage** (ANGEFORDERT/ABGELEHNT) mit Frist-Countdown
   und CTA `#dok-…`, oder **Vollständigkeitshinweis** wenn nichts mehr offen.
4. E2E: Initial ohne Quittung; nach Markierung Quittung + Vollständigkeit
   (Mock: nur DOK-03 offen); Session bleibt nach Tab-Nav (DEC-012).

### Dateien
- `demo/app/gruendung/page.tsx` – Upload-Quittung auf Übersicht
- `demo/e2e/us-ug-gruendung.spec.ts` – 3 Übersicht-Quittungs-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (118 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Hinweise: UNTERLAGE-Signal live nach Session-Upload inkl. Frist + CTA (AV Q-167-Parität)
- `naechsterSchrittZiel` / `aufgabeZiel` ggf. in gruendung-rules (optional)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)

---

## 2026-07-29 – Iteration 35: Dokumente lokale Upload-Quittung pro Karte

### Was
Nach Session-Markierung zeigt jede Dokumentenkarte eine lokale Upload-Quittung
(US-UG-003, Parität zu AV):

1. **`sessionUploadedIds`** im GruendungStateContext steuert Quittung pro Karte
   (`data-testid="dok-upload-quittung-{id}"`).
2. **Quittung**: Titel „Upload bestätigt“, Bezeichnung + Einreichungsdatum,
   Demo-Hinweis (keine Datei).
3. Mock-Einreichungszeile nur ohne Session-Upload; bei Vollständigkeit
   `dok-alle-vorliegend` + Session-Zähler.
4. E2E: Initial ohne Quittung; nach Markierung Quittung + Vollständigkeit;
   Session bleibt nach Tab-Nav (kein `page.goto`, DEC-012).

### Dateien
- `demo/context/GruendungStateContext.tsx` – export `sessionUploadedIds`
- `demo/app/gruendung/dokumente/page.tsx` – lokale Quittung + Vollständigkeitsbanner
- `demo/e2e/us-ug-gruendung.spec.ts` – 3 neue Unterlagen-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (115 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht: Upload-Quittung + nächste offene Unterlage nach Session-Upload
- `naechsterSchrittZiel` / `aufgabeZiel` ggf. in gruendung-rules (optional)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)

---

## 2026-07-29 – Iteration 34: Fairness-CTA-Ziel-Routing in gruendung-rules

### Was
`fairnessSignalZiel` lebt in `gruendung-rules.ts` als gemeinsame Quelle für
href, CTA-Label, Hilfstext, testKey und ariaLabel (RQ, Unterlagen, BG,
Steuernummer, Betriebsdatum, parallele Behörden). Übersicht nutzt den Export
statt lokaler Duplikate; Hinweise rendert CTAs über denselben Helper
(E2E-testids unverändert gemappt). UI-only: Prioritäts-Rahmen und
Unterlagen-Mehrfach-Hinweis.

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – `FairnessSignalZiel`, `fairnessSignalZiel`
- `demo/app/gruendung/page.tsx` – Import statt lokaler Routing-Funktion
- `demo/app/gruendung/hinweise/page.tsx` – gemeinsames CTA-Rendering
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (112 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Primär-CTA „Nächster Schritt“ weiter an Fairness-Priorität koppeln (optional)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)
- `naechsterSchrittZiel` / `aufgabeZiel` ggf. ebenfalls in gruendung-rules (optional)

---

## 2026-07-29 – Iteration 33: Fairness-CTA-Hilfstexte in gruendung-rules

### Was
Session-sensitive CTA-Hilfstexte (RQ, Unterlagen, BG, Steuernummer,
Betriebsdatum, parallele Behörden) und `hatOffeneRueckfrage` leben in
`gruendung-rules.ts` als gemeinsame Quelle. Übersicht und Hinweise nutzen
dieselben Helper – identischer Wortlaut, kein UI-Duplikat mehr.
E2E unverändert (String-Assertions bleiben grün).

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – exportierte CTA-Hilfstext-Helper
- `demo/app/gruendung/page.tsx` – Import statt lokaler Duplikate
- `demo/app/gruendung/hinweise/page.tsx` – Import statt lokaler Duplikate
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (112 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Übersicht/Hinweise: Fairness-CTA-Ziel-Routing ggf. ebenfalls zentralisieren
- Primär-CTA „Nächster Schritt“ weiter an Fairness-Priorität koppeln (optional)
- Verlauf: Tiefenlink von Fairness-CTA zu passendem Ereignis (optional)

---

## 2026-07-29 – Iteration 32: Primär-CTA Nächster Schritt mit RQ-Frist-Hilfstext

### Was
Primär-CTA „Nächster Schritt“ auf der Übersicht erhält denselben
RQ-Frist/Konsequenz-Hilfstext wie die Fairness-CTAs (`rqCtaHilfstext`).
Nach Beantwortung der Rückfrage wechselt der Hilfstext session-sensitiv
auf den Unterlagen-Hinweis („Keine offene Rückfrage mehr …“). Fairness-
RQ-CTA nutzt denselben Helper. testid: `uebersicht-naechster-schritt-cta-hint`.

### Dateien
- `demo/app/gruendung/page.tsx` – `rqCtaHilfstext`, `naechsterSchrittZiel.hint`, UI
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Assertion Primär-CTA
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (112 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-CTA-Hilfstexte ggf. in gemeinsame Helper (gruendung-rules) extrahieren
- Hinweise-Seite: `rqCtaHilfstext` teilen statt lokalen Duplikats
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen

---

## 2026-07-29 – Iteration 31: RQ-CTA-Hilfstext mit Frist und Konsequenz

### Was
Fairness-CTA zur offenen Rückfrage erhält einen kurzen Hilfstext mit
Antwortfrist (Datum + Resttage) und Konsequenz (keine steuerliche Erfassung /
keine Steuernummer ohne Antwort). Übersicht (`uebersicht-fairness-cta-hint-rq-*`)
und Hinweise (`hinweise-rq-cta-hint-*`) nutzen denselben Wortlaut. CTA-Label und
Anker unverändert. E2E: Frist- und Konsequenz-Assertionen.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` RQ `hint`
- `demo/app/gruendung/hinweise/page.tsx` – RQ-CTA-Hint + testid
- `demo/e2e/us-ug-gruendung.spec.ts` – RQ-Hilfstext Übersicht + Hinweise
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (112 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-CTA-Hilfstexte ggf. in gemeinsame Helper extrahieren (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen
- Primär-CTA „Nächster Schritt“ optional denselben RQ-Frist-Hilfstext

---

## 2026-07-29 – Iteration 30: Unterlagen-CTA-Hilfstext session-sensitiv (Übersicht + Hinweise)

### Was
CTA-Hilfstext für `UG-UNTERLAGEN-FEHLEND` wird session-sensitiv angeglichen
(wie BG/Steuernummer/Betriebsdatum/parallele Behörden): bei offener RQ
„Zuerst die offene Rückfrage des Finanzamts klären … Bereich Unterlagen“;
nach Antwort „Keine offene Rückfrage mehr – ausstehende Unterlage
nachreichen …“. CTA-Label und Anker unverändert. Übersicht und Hinweise
nutzen denselben Text; Hinweise mit `data-testid`
`hinweise-unterlagen-cta-hint`. E2E: Initial- + Session-Assertion.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` Unterlagen `hint`
- `demo/app/gruendung/hinweise/page.tsx` – Unterlagen-CTA-Hint + testid
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Hilfstext Unterlagen
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (112 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-CTA-Hilfstexte ggf. in gemeinsame Helper extrahieren (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen
- RQ-CTA optional kurzen Hilfstext (Frist/Konsequenz) auf Übersicht ergänzen

---

## 2026-07-29 – Iteration 29: BG-CTA-Hilfstext session-sensitiv (Übersicht + Hinweise)

### Was
CTA-Hilfstext für `UG-BG-ANMELDUNG` wird session-sensitiv angeglichen
(wie Steuernummer/Betriebsdatum/parallele Behörden): bei offener RQ
„Zuerst die offene Rückfrage des Finanzamts klären … Behördenkarte“;
nach Antwort „Keine offene Rückfrage mehr – BG-Anmeldung außerhalb von
Open State vornehmen …“. CTA-Label und Anker unverändert. Übersicht und
Hinweise nutzen denselben Text; Hinweise mit `data-testid`
`hinweise-bg-cta-hint-BEH-04`. E2E: Initial- + Session-Assertion.

### Dateien
- `demo/app/gruendung/page.tsx` – `fairnessSignalZiel` BG `hint`
- `demo/app/gruendung/hinweise/page.tsx` – BG-CTA-Hint + testid
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Hilfstext BG
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (111 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-CTA-Hilfstexte ggf. in gemeinsame Helper extrahieren (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen
- Unterlagen-CTA optional session-sensitiven Hilfstext (bei offener RQ zuerst klären)

---

## 2026-07-29 – Iteration 28: Parallele Behörden session-sensitiv (Signal + CTA)

### Was
INFO-Signal `UG-PARALLELE-BEHOERDEN` und Hinweise-CTA-Hilfstext werden
session-sensitiv: bei offener RQ „Offene Rückfragen zuerst …“; nach Antwort
„Keine offene Rückfrage mehr / parallele Verfahren“ (kein RQ-Vorrang). CTA
„Zu den Behörden“ bleibt solange ≥2 Behörden aktiv (FA + IHK nach Antwort).
E2E: Initial-Hilfstext/Signal + Session-Assertion.

### Dateien
- `demo/lib/fairness/gruendung-rules.ts` – `naechsterSchritt` session-sensitiv
- `demo/app/gruendung/hinweise/page.tsx` – CTA-Hint + `data-testid`
- `demo/e2e/us-ug-gruendung.spec.ts` – Initial- + Session-Tests
- `docs/loops/ug-JOURNAL.md` – dieses Journal

### Build
`npm run lint` + `npm run build` im Ordner `demo/` grün.
`npm run test:e2e:ug` Exit 0 (110 passed).

### Nächster sinnvoller UG-Schritt (Vorschlag)
- Fairness-CTA-Hilfstexte ggf. in gemeinsame Helper extrahieren (optional)
- BG-CTA-Hilfstext session-sensitiv angleichen (optional)
- Übersicht/Hinweise: Hilfstext-Konsistenz Steuernummer vs. Betriebsdatum prüfen

---

