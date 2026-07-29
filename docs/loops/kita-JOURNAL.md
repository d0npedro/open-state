# Kita Domain-Loop Journal

Branch: `loop/kita` · Worktree: `D:\Projects\open-state-loop-kita`

## Iteration 2026-07-29 – US-KJ-005/009/010 Zeitreihe Druck Filterstand/Meta

### Was
Zeitreihe (`KitaZeitreiheTabelle`, US-KJ-005 Lagebild + US-KJ-009/010 öffentlicher Bericht): Druckansicht an Explorer/Engpass-Muster. Filter-Chips und CSV-Button `no-print`; print-only Block mit aktivem Regionenfilter (Gesamtkommune oder Planungsraum), Monatsanzahl, Peak-Warteliste, Meldebasis-Session (Stichprobe/Lücken, Session-sensitiv) und Stichprobenmonat. Methodik- und Footer-Hinweise auf `/kita/lagebild` und `/kita`. Keine Interpolation, keine Trendbewertung. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaZeitreiheTabelle.tsx` (print-only Filterstand/Meta, no-print Filter/CSV)
- `demo/app/kita/lagebild/page.tsx` (Methodik/Footer/Badge)
- `demo/app/kita/page.tsx` (Datenlage/Footer/print-Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-009 / US-KJ-010 – Zeitreihe Druck-Meta Filterstand und Meldebasis

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Regionenvergleich print-only Filterstand (A/B + Kennzahl), oder Explorer/Meldebasis-Druckhinweis weiter schärfen, oder Bedarfsplanung/Vorlage Feinschliff falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-005 Lagebild Zeitreihe-UI (12 Monate)

### Was
Steuerungslagebild (`/kita/lagebild`, US-KJ-005 / US-KJ-010): 12-Monats-Zeitreihe nicht nur im CSV-Blatt 6, sondern im UI. Einbindung `KitaZeitreiheTabelle` (Regionenfilter Gesamt/Planungsraum, Meldebasis-Stichprobe Session-sensitiv, CSV der aktiven Filteransicht, Open-Data-Lizenz). Anker `#kita-lagebild-zeitreihe`. Ergänzt Gesamtlage-Kennzahl „Δ Warteliste (3 Monate)“. Methodik/Badge/Footer. Keine Interpolation, keine Trendbewertung. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` vor dem Feature.

### Dateien
- `demo/app/kita/lagebild/page.tsx` (Zeitreihe-Sektion, Import, Methodik/Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-010 – Steuerungslagebild Zeitreihe im UI (Spiegel öffentlicher Bericht + CSV-Blatt)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Zeitreihe print-only Filterstand/Meta im Lagebild, oder Explorer/Meldebasis-Druckhinweis weiter schärfen, oder öffentliche Zeitreihe print-only Meta.

---

## Iteration 2026-07-29 – US-KJ-009 Transparenzbericht Druck-Meta Status/Meldebasis

### Was
Öffentlicher Transparenzbericht (`/kita`, US-KJ-009): Druckansicht an Steuerungs-/Vorlage-Muster angeglichen. Export-Karte Druck+CSV in `KitaCsvDownload` (vorher nur CSV im Explorer-Slot). print-only: Status freigegeben (Version, Rolle+Datum, Datenstand) und Meldebasis-Session (raumaggregiert, Lückenliste, Session-Meldefreigabe). Print-CSS; Steuerungskette no-print. Explorer: Filter-Chips no-print, aktiver Filterstand print-only. Methodik/Footer. Nur freigegebene Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaCsvDownload.tsx` (Druck+CSV-Karte, print-only Status/Meldebasis, Print-CSS)
- `demo/components/kita/KitaPlanungsraumExplorer.tsx` (Filter no-print, print-only Filterstand)
- `demo/app/kita/page.tsx` (Export oben, Methodik/Footer, Steuerungskette no-print)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 – Öffentlichen Transparenzbericht einsehen (Druck-Meta Status/Meldebasis)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Zeitreihe optional im Lagebild-UI (nicht nur CSV) falls fachlich gewünscht, oder Explorer/Meldebasis-Druckhinweis weiter schärfen, oder öffentliche Zeitreihe print-only Meta.

---

## Iteration 2026-07-29 – US-KJ-005 Lagebild Steuerungs-CSV Zeitreihen-Blatt

### Was
Steuerungslagebild (`/kita/lagebild`, US-KJ-005): CSV-Export um Blatt 6 „Zeitreihe“ erweitert. 12-Monats-Aggregate Gesamtkommune plus Planungsräume (bei Export-Filter „Meldelücke“ nur Räume mit Lücke). Spalten wie öffentlicher Zeitreihen-Export (Region, Kennzahlen, Peak/Aktuell, Meldebasis nur im Stichprobenmonat Session-sensitiv). Metakopf-Hinweis Zeitreihe/US-KJ-010-kompatibel; Methodik/Badge/Footer auf der Seite. Keine Interpolation, keine Trendbewertung. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits auf Branch (kein Merge nötig).

### Dateien
- `demo/components/kita/KitaLagebildDruck.tsx` (Blatt 6 Zeitreihe, Meta, Export-Text)
- `demo/app/kita/lagebild/page.tsx` (Badge, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 – Steuerungslagebild (CSV Zeitreihen-Blatt Gesamt + Planungsräume)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Druck-Meta Status/Meldebasis print-only auf `/kita` schärfen, oder Zeitreihe optional im Lagebild-UI (nicht nur CSV) falls fachlich gewünscht.

---

## Iteration 2026-07-29 – US-KJ-009 Transparenzbericht CSV Multi-Blatt Status/Meldebasis

### Was
Öffentlicher Transparenzbericht (`/kita`, US-KJ-009 AK 6): CSV-Export an Steuerungs-/Vorlage-Muster angeglichen. Metakopf: Bericht-Status (freigegeben, Version, Rolle+Datum), Datenstand, Meldebasis-Session (Lücken je Planungsraum, raumaggregiert), Session-Meldefreigabe, optionaler Export-Filter „Meldelücke“, Versorgung Gesamt, Open-Data-Lizenz, DEC-004. Blätter: 1 Versorgung, 2 Planungsräume (Meldebasis-Spalten, Rang nach Wartelistendruck), 3 Kapazitätsmaßnahmen, 4 Meldebasis-Stichprobe ohne Einrichtungsnamen. Dateiname mit Versions-/Datenstand und optional `-meldeluecke`. Methodik/Footer auf der Seite. Nur freigegebene Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaCsvDownload.tsx` (Multi-Blatt downloadCsv, Meldebasis, Export-Filter)
- `demo/app/kita/page.tsx` (Methodik/Footer CSV-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 – Öffentlichen Transparenzbericht einsehen (CSV Multi-Blatt Aggregate, Status/Meldebasis)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild Zeitreihen-Blatt im Steuerungs-CSV (US-KJ-005), oder Druck-Meta Status/Meldebasis print-only auf `/kita` schärfen.

---

## Iteration 2026-07-29 – US-KJ-005 Lagebild Steuerungs-CSV Status/Meldelücke-Spiegel

### Was
Steuerungslagebild (`/kita/lagebild`, US-KJ-005/006): CSV-Export freigabeunabhängig analog Vorlage/Bedarfsplanung. Export-Karte Druck+CSV in `KitaLagebildDruck`. Metakopf: Lagebild-Status (Version/Freigabe Rolle+Datum), Datenstand, Meldebasis-Session (Lücken je Planungsraum), Session-Meldefreigabe, optionaler Export-Filter „Meldelücke“, Versorgung Gesamt, DEC-004. Blätter: 1 Versorgung, 2 Engpass-Rangliste (Meldebasis, Filterstand), 3 Handlungsfelder inkl. Maßnahmen-Kurz, 4 Kapazitätsmaßnahmen, 5 Meldebasis-Stichprobe Session-sensitiv. Dateiname mit Versions-/Datenstand und optional `-meldeluecke`. Methodik/Footer auf der Seite. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaLagebildDruck.tsx` (downloadCsv, Export-Filter, Druck+CSV-Karte)
- `demo/app/kita/lagebild/page.tsx` (Badge, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 – Steuerungslagebild (CSV Aggregate-Export Status/Meldebasis/Meldelücke-Spiegel)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Öffentliche Kita-Hub CSV-Lücken schließen falls nötig, oder Lagebild Zeitreihen-Blatt im Steuerungs-CSV, oder Druck-Meta Status/Meldebasis print-only schärfen.

---

## Iteration 2026-07-29 – US-KJ-008 Vorlage CSV Aggregate Status/Meldebasis freigabeunabhängig

### Was
Politische Vorlage (`/kita/vorlage`, US-KJ-008): CSV-Export freigabeunabhängig analog Bedarfsplanung/Tagesstand. Metakopf: Status (Entwurf / Zur Freigabe / Freigegeben / Zurückgegeben), Freigabe-Nachweis bzw. Zurückgabe-Hinweis, Datenstand Lagebild, Meldebasis-Session (Lücken je Planungsraum), Engpass-Filter (Top-N / Meldelücke), Summen Residual/geplant, Versorgung Gesamt, Sachdarstellung-Auszug, DEC-004. Blätter: 1 Versorgung, 2 Planungsräume, 3 Engpass-Liste (Filterstand), 4 Meldebasis-Stichprobe Session-sensitiv. Dateiname mit Status-Suffix und optional `-meldeluecke`. Export-Karte Druck+CSV; Methodik/Footer. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` vor dem Feature.

### Dateien
- `demo/app/kita/vorlage/page.tsx` (downloadCsv, Export-Karte, Methodik/Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-008 – Politische Vorlage vorbereiten und freigeben (CSV Aggregate-Export, freigabeunabhängig, Status/Meldebasis)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild Steuerungs-CSV Status/Meldelücke-Spiegel (US-KJ-005), oder öffentliche Kita-Hub CSV falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-007 Bedarfsplanung CSV Aggregate freigabeunabhängig

### Was
Bedarfsplanungsentwurf (`/kita/bedarfsplanung`, US-KJ-007): CSV-Export freigabeunabhängig analog Einrichtung/Monatsbericht/Meldung. Metakopf: Status (Entwurf / Zur Freigabe), Version, Datenstand Lagebild, Meldebasis-Session (Lücken je Planungsraum, Freigabe-ID), Summen Residual/geplant, Methodik, Planungskommentar, DEC-004. Blatt 1 Planungsräume (Meldebasis, Versorgung, Warteliste, Druck, Frei, Geplant, Residual, Maßnahmen); Blatt 2 Meldebasis-Stichprobe Session-sensitiv. Dateiname mit `-entwurf` / `-zur-freigabe`. Export-Karte Druck+CSV; Methodik/Footer. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` vor dem Feature.

### Dateien
- `demo/app/kita/bedarfsplanung/page.tsx` (downloadCsv, Export-Karte, Methodik/Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-007 – Bedarfsplanung erstellen (CSV Aggregate-Export, freigabeunabhängig, Status/Meldebasis)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage CSV Aggregate Status/Meldebasis freigabeunabhängig (US-KJ-008), oder Lagebild Steuerungs-CSV Status/Meldelücke-Spiegel.

---

## Iteration 2026-07-29 – US-KJ-002 Einrichtung CSV Status/Datenbasis-Metakopf

### Was
Belegungsstand (`/kita/einrichtung`, US-KJ-002): CSV-Metakopf an Tagesstand/Monatsbericht/Meldung gespiegelt. Status (aktuell / veraltet, 3-Tage-Schwelle, Status-Hinweis), Datenbasis (Gruppenzähler, Einschränkungen, Summen genehmigt/belegt/reserviert/frei), Prozessbezug US-KJ-001/003/004, DEC-004. Gruppenblatt mit Gruppe-ID, Einschränkungs-Schlüssel und -bis; Summenzeile. Dateiname mit `-veraltet` bei überschrittener Schwelle. Export-Karte Druck+CSV; Footer/Druck-Hinweis. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/einrichtung/page.tsx` (downloadCsv Meta/Summen, Export-Karte, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-002 – Belegungsstand einsehen (CSV Status/Datenbasis-Metakopf, Aggregate)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung CSV Aggregate-Metakopf schärfen falls Lücken, oder Vorlage/Lagebild CSV Spiegel Status/Datenbasis.

---

## Iteration 2026-07-29 – US-KJ-004 Meldung CSV Aggregate freigabeunabhängig

### Was
Monatsmeldung (`/kita/meldung`, US-KJ-004): CSV-Export freigabeunabhängig analog Tagesstand/Monatsbericht. Session-Kennzahlen (Feld/Schlüssel/Wert/Einheit/Korrigiert) inkl. optionalem Korrekturprotokoll-Blatt. Metakopf: Status, UI-Phase, Meldefrist (überfällig), Freigabe-ID/Rolle/JA-Eingang bzw. „nicht freigegeben“, Hinweise, DEC-004. Semikolon, UTF-8 BOM, Dezimaltrennzeichen Komma. Button im Export-Block neben Druck; Methodik- und Footer-Hinweis. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/meldung/page.tsx` (downloadCsv, Export-Button, Methodik/Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 – Meldung prüfen und freigeben (CSV Aggregate-Export, freigabeunabhängig)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Einrichtungs-CSV Metakopf an Tagesstand/Monatsbericht/Meldung spiegeln (Status/Datenbasis), oder Bedarfsplanung CSV Aggregate falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-003 Monatsbericht CSV Vorschau-Modus-Metadaten

### Was
Monatsbericht (`/kita/monatsbericht`, US-KJ-003): CSV-Metakopf an Druckansicht und Tagesstand-CSV geschärft. Demo-Modus (Abschluss / Vorschau), Status-Label + Hinweis, Stand/Vergleich/ID, Datenbasis-Zähler (freigegeben/fehlt/in Erfassung), fehlende Tage, Schlüssel-Tage. Im Vorschau-Modus: methodische Trennung zu Monatsmeldung (US-KJ-004) und Lagebild-Vorschau (US-KJ-005); Dateiname mit `-vorschau`. Quellenblatt mit Datum-Label und Status-Label; Personal-Ist-Stunden mit Komma-Dezimal. Export-Karte Druck+CSV, Methodik-Punkt CSV. Nur Aggregate, keine Kind- oder Personennamen (DEC-004). Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/monatsbericht/page.tsx` (downloadCsv Meta/Quellen, Export-Karte, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 – Monatsbericht abrufen (CSV Vorschau-/Abschluss-Metadaten, Quellenblatt)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Meldung-CSV Aggregate freigabeunabhängig (DEC-004), oder Einrichtungs-CSV Metakopf an Tagesstand/Monatsbericht spiegeln falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-001 Tagesstand CSV Aggregate-Export

### Was
Tagesstand (`/kita/tagesstand`, US-KJ-001): CSV-Export freigabeunabhängig analog Belegung/Monatsbericht. Aktueller Session-Stand je Gruppe (Anwesend/Krank/Urlaub/Sonstiges, Personal geplant/Ist, Personalschlüssel-Hinweis, Vorbelegung belegt) inkl. Summenzeile geöffneter Gruppen. Metakopf: Stichtag, Status, UI-Phase, Freigabe, DEC-004-Hinweis. Semikolon, UTF-8 BOM, Dezimaltrennzeichen Komma. Button im Export-Block neben Druck; Methodik-Hinweis. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits im Branch (kein Merge nötig).

### Dateien
- `demo/app/kita/tagesstand/page.tsx` (downloadCsv, Export-Button, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-001 – Tagesstand erfassen (CSV Aggregate-Export, freigabeunabhängig)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Monatsbericht CSV um Vorschau-Modus-Metadaten schärfen, oder Meldung-CSV Aggregate nach Freigabe (DEC-004).

---

## Iteration 2026-07-29 – US-KJ-002 Einrichtung Belegungsstand-Druck Status/Datenbasis

### Was
Belegungsstand (`/kita/einrichtung`, US-KJ-002): Druckansicht mit Druckleiste analog Tagesstand/Monatsbericht/Meldung. Print-only: Status (aktuell / veraltet inkl. 3-Tage-Schwelle), Datenbasis (Stichtag, Gruppenaggregate, Einschränkungszähler, Summen genehmigt/belegt/reserviert/frei, Prozessbezug). Gesamtübersicht und Gruppenkarten im Ausdruck; CSV-Export, Metadatenleiste, Hinweise und Prozess-Hub no-print. Methodik- und Footer-Hinweis. Nur Aggregate, keine Kind- oder Personennamen (DEC-004). `origin/main` bereits auf Branch (kein Merge nötig).

### Dateien
- `demo/app/kita/einrichtung/page.tsx` (Druckleiste, print-only Status/Datenbasis, Print-CSS, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-002 – Belegungsstand einsehen (Druck Status + Datenbasis dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Tagesstand-CSV Aggregate-Export (DEC-004), oder Einrichtungs-Hub-Rücklink von Monatsbericht/Tagesstand spiegeln falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-001 Tagesstand-Druck freigabeunabhängig Status/Datenbasis/Freigabe

### Was
Tagesstand (`/kita/tagesstand`, US-KJ-001): Druckansicht freigabeunabhängig (Aufforderung / Erfassung / Zusammenfassung / freigegeben) mit Druckleiste analog Monatsbericht/Meldung/Bedarfsplanung. Print-only: Status inkl. UI-Phase und Tagesstand-ID, Datenbasis (Vorbelegung aus Belegung US-KJ-002, Gruppen offen/geschlossen, Aggregate, Schlüssel-Hinweis, Summenprüfung) und Freigabenachweis bzw. „nicht freigegeben“ (DEC-004). In Phase Aufforderung: Vorbelegungs-Aggregate und Gruppenwerte im Ausdruck. Eingabefelder, Bestätigungsdialog, Aktionsbuttons und Prozess-Hub no-print; Gruppenwerte als statischer Text im Ausdruck. Methodik- und Footer-Hinweis. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/tagesstand/page.tsx` (Druckleiste, print-only Status/Datenbasis/Freigabe, Print-CSS, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-001 – Tagesstand erfassen (Druck freigabeunabhängig, Status/Datenbasis/Freigabe dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Einrichtung Belegungsstand-Druckansicht spiegeln, oder Tagesstand-CSV Aggregate-Export (DEC-004).

---

## Iteration 2026-07-29 – US-KJ-004 Meldung-Druck freigabeunabhängig Status/Korrekturen/Freigabe

### Was
Monatsmeldung (`/kita/meldung`, US-KJ-004): Druckansicht freigabeunabhängig (Prüfung / Korrektur / Bestätigung / freigegeben) mit Druckleiste analog Monatsbericht/Bedarfsplanung/Vorlage. Print-only: Status inkl. UI-Phase und Meldefrist, dokumentierte Korrekturen (Feld vorher→nachher) bzw. „keine Korrekturen“, Freigabenachweis (ID/Rolle/Zeitstempel) bzw. „nicht freigegeben“ (DEC-004). Korrekturmaske, Bestätigungsdialog, Statusaktionen und Prozess-Hub no-print; Meldeinhalt und Korrekturprotokoll im Ausdruck. Methodik- und Footer-Hinweis. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/meldung/page.tsx` (Druckleiste, print-only Status/Korrekturen/Freigabe, Print-CSS, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 – Meldung prüfen und freigeben (Druck freigabeunabhängig, Status/Korrekturen/Freigabe dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Tagesstand-Druckansicht Datenbasis, oder Einrichtung Belegungsstand-Druckansicht spiegeln.

---

## Iteration 2026-07-29 – US-KJ-009 Öffentlicher Bericht Hub Steuerungskette

### Was
Öffentlicher Transparenzbericht (`/kita`, US-KJ-009): Hub-Karten zur JA-Steuerungskette gespiegelt (analog Lagebild/Bedarfsplanung/Vorlage). Karten Steuerungslagebild (US-KJ-005), Bedarfsplanungsentwurf (US-KJ-007), politische Vorlage (US-KJ-008); Text zu DEC-004 (keine Einrichtungsdetails, keine Kind-/Personennamen) und Footer mit Kette Lagebild → Bedarfsplanung → Vorlage. Nur Aggregate. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/page.tsx` (Steuerungskette Hub-Karten + Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 – Transparenzbericht (Hub zur Steuerungskette, DEC-004)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Meldung-Druckansicht freigabeunabhängig spiegeln (Status/Korrekturen/Freigabe), oder Tagesstand-Druckansicht Datenbasis.

---

## Iteration 2026-07-29 – US-KJ-003 Monatsbericht-Druck Status/Datenbasis

### Was
Monatsbericht (`/kita/monatsbericht`, US-KJ-003): Druckansicht mit Druckleiste analog Lagebild/Bedarfsplanung/Vorlage. Print-only: Demo-Modus (Abschluss / Vorschau), Berichtsstatus (vollständig / lückenhaft / Vorschau), Datenbasis-Stand der Tagesstand-Quellen (freigegeben / fehlt / in Erfassung, fehlende Tage, Schlüssel-Tage). Methodik-Punkt und Footer-Hinweis zur Druckdokumentation; Print-CSS mit print-only. Demo-Umschalter, Prozess-Hub und Aktionen no-print. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/monatsbericht/page.tsx` (Druckleiste, print-only Status/Datenbasis, Print-CSS, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 – Monatsbericht abrufen (Druck Status + Datenbasis dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Öffentlicher Bericht Hub zur Steuerungskette, oder Meldung-Druckansicht freigabeunabhängig spiegeln.

---

## Iteration 2026-07-29 – US-KJ-005/007/008 Steuerungskette Rücklink-Hub Bedarfsplanung

### Was
Steuerungslagebild (`/kita/lagebild`, US-KJ-005/006) und politische Vorlage (`/kita/vorlage`, US-KJ-008): Steuerungskette Jugendamt als Hub-Karten gespiegelt (analog Bedarfsplanung). Beide Seiten mit Karten Bedarfsplanung (US-KJ-007), jeweils Lagebild↔Vorlage und Monatsmeldung/Meldebasis (US-KJ-004); Footer mit DEC-004-Hinweis zum öffentlichen Bericht. Schließt die Rückverlinkung zur Bedarfsplanung in der JA-Steuerungskette. Nur Aggregate, keine Kind- oder Personennamen. Branch bereits auf `main` (kein Merge nötig).

### Dateien
- `demo/app/kita/lagebild/page.tsx` (Steuerungskette Hub-Karten + Footer)
- `demo/app/kita/vorlage/page.tsx` (Steuerungskette Hub-Karten + Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-007 / US-KJ-008 – Steuerungskette Lagebild ↔ Bedarfsplanung ↔ Vorlage

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Monatsbericht-Druckansicht Meldebasis/Vorschau-Status spiegeln, oder öffentlicher Bericht Hub zur Steuerungskette.

---

## Iteration 2026-07-29 – US-KJ-007 Bedarfsplanung-Druckansicht Meldebasis

### Was
Bedarfsplanung (`/kita/bedarfsplanung`, US-KJ-007): Druckansicht freigabeunabhängig (Entwurf / Zur Freigabe) mit Druckleiste analog Lagebild/Vorlage. Print-only: Status, Meldebasis-Stand (Session-sensitiv aus Meldeeingang, Räume mit Lücke inkl. Residual-Fokus Südost/PR-03), Planungskommentar als statischer Text (Textarea/Aktionen no-print). Methodik- und Footer-Hinweis zur Druckdokumentation. Steuerungskette-Hub no-print. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/bedarfsplanung/page.tsx` (Druckleiste, print-only Status/Meldebasis/Kommentar, Print-CSS)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-007 – Bedarfsplanungsentwurf (Druck freigabeunabhängig, Meldebasis dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage/Lagebild Rücklink-Hub zur Bedarfsplanung, oder Monatsbericht-Druckansicht Meldebasis/Vorschau-Status spiegeln.

---

## Iteration 2026-07-29 – US-KJ-007 Bedarfsplanung Steuerungskette Hub-Karten

### Was
Bedarfsplanung (US-KJ-007): JA-Steuerungskette als Hub-Karten gespiegelt (analog betriebliche Prozesskette). Karten Steuerungslagebild (US-KJ-005), Monatsmeldung/Meldebasis (US-KJ-004), politische Vorlage (US-KJ-008); nach „Zur Freigabe“ CTA zur Vorlage; Footer mit DEC-004-Hinweis zum öffentlichen Bericht. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits im Branch (kein Merge nötig).

### Dateien
- `demo/app/kita/bedarfsplanung/page.tsx` (Steuerungskette Hub-Karten + Footer + Freigabe-CTA Vorlage)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-007 – Bedarfsplanungsentwurf (Steuerungskette Lagebild → Planung → Vorlage)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung-Druckansicht mit Meldebasis-Hinweis spiegeln, oder Vorlage/Lagebild Rücklink-Hub zur Bedarfsplanung.

---

## Iteration 2026-07-29 – US-KJ-008 Vorlage-Druck freigabeunabhängig + Meldelücke-Filter

### Was
Politische Vorlage (`/kita/vorlage`, US-KJ-008): Druckansicht freigabeunabhängig (Entwurf / Warteschlange / freigegeben) mit eigener Druckleiste analog Lagebild. Status-Hinweis im Ausdruck wenn nicht freigegeben; Titel/Sachtext im Druck als statischer Text (Inputs no-print). Engpass-Abschnitt: print-only-Dokumentation des aktiven Meldelücke-Filters bzw. Standard Top-N; Methodik-Punkt zur freigabeunabhängigen Druckansicht. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/vorlage/page.tsx` (Druckleiste freigabeunabhängig, print-only Status/Filter, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-008 – Politische Vorlage (Druck freigabeunabhängig, Engpass-Meldelücke-Filter dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Prozesskette/Hub zu Lagebild und Vorlage, oder Bedarfsplanung-Druckansicht mit Meldebasis-Hinweis spiegeln.

---

## Iteration 2026-07-29 – US-KJ-004 Meldung Prozesskette Hub-Karten

### Was
Meldung-Seite (US-KJ-004): betriebliche Vorprozesse als Hub-Karten gespiegelt (analog Tagesstand/Einrichtung). Karten Tagesstand (US-KJ-001), Belegungsstand (US-KJ-002), Monatsbericht (US-KJ-003) für denselben Demo-Standort Kita Sonnenwinkel; Footer mit Prozesskette und DEC-004-Hinweis zu Steuerungslagebild (Meldeeingang) und öffentlichem Bericht. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits auf dem Branch (Merge-Commit vorhanden).

### Dateien
- `demo/app/kita/meldung/page.tsx` (Prozesskette Hub-Karten + Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 – Meldung prüfen und freigeben (Prozesskette zur Einrichtungs-Hub-Kette)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage-Druck freigabeunabhängig mit dokumentiertem Engpass-Meldelücke-Filter spiegeln, oder Bedarfsplanung Prozesskette/Hub zu Lagebild und Vorlage.

---

## Iteration 2026-07-29 – US-KJ-001 Tagesstand Prozesskette Hub-Karten

### Was
Tagesstand-Seite (US-KJ-001): betriebliche Prozesskette als Hub-Karten gespiegelt (analog Einrichtung). Karten Belegungsstand (US-KJ-002), Monatsbericht (US-KJ-003), Meldung freigeben (US-KJ-004) für denselben Demo-Standort Kita Sonnenwinkel; Footer mit DEC-004-Hinweis zu öffentlichem Bericht und Steuerungslagebild. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits auf dem Branch (kein Merge nötig).

### Dateien
- `demo/app/kita/tagesstand/page.tsx` (Prozesskette Hub-Karten + Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-001 – Tagesstand erfassen (Prozesskette zur Einrichtungs-Hub-Kette)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Meldung-Seite Prozesskette spiegeln (Tagesstand/Belegung/Monatsbericht als Hub-Karten), oder Vorlage-Druck freigabeunabhängig mit dokumentiertem Engpass-Meldelücke-Filter.

---

## Iteration 2026-07-29 – US-KJ-002/003 Monatsbericht↔Einrichtung Verlinkung

### Was
Betriebliche Verlinkung zwischen Belegungsstand und Monatsbericht geschärft (gleiche Demo-Einrichtung Kita Sonnenwinkel). Einrichtung: Prozessketten-Karten Tagesstand → Monatsbericht → Meldung. Monatsbericht: Einrichtungs-Kontext-Karte (Stichtag-Belegung vs. Monatsauswertung), Datenlücke mit Aktionslinks zu Tagesstand/Belegung, Aktionsleiste inkl. Meldung freigeben, Footer-Prozesskette mit Story-Labels. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/app/kita/einrichtung/page.tsx` (Prozesskette US-KJ-001/003/004)
- `demo/app/kita/monatsbericht/page.tsx` (Einrichtungs-Kontext, Datenlücke-Links, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-002 / US-KJ-003 – Belegungsstand und Monatsbericht (Prozesskette Einrichtung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Tagesstand-Seite Prozesskette spiegeln (Einrichtung/Monatsbericht/Meldung als Hub-Karten), oder Vorlage-Druck freigabeunabhängig mit dokumentiertem Engpass-Meldelücke-Filter.

---

## Iteration 2026-07-29 – US-KJ-005/006 Lagebild Druckansicht Meldelücke-Filter

### Was
Steuerungslagebild: Druckansicht mit dokumentiertem Meldelücke-Filter (Spiegel zu Vorlage US-KJ-008). Neue Druckleiste `KitaLagebildDruck` (Button „Drucken / als PDF speichern“, Print-CSS `no-print`/`print-only`). Filter-Chips in Engpass-Rangliste, Handlungsfeldern und Planungsraum-Detail sind `no-print`; bei aktivem Filter „Meldelücke“ erscheint je Abschnitt ein print-only-Hinweis (Session-Stand, Rang nach Wartelistendruck unverändert). Demo-Banner und Story-Badges nicht im Ausdruck. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/components/kita/KitaLagebildDruck.tsx` (neu: Druckleiste + Print-CSS)
- `demo/components/kita/KitaEngpassRangliste.tsx` (no-print Chips, print-only Filterhinweis)
- `demo/components/kita/KitaHandlungsfelder.tsx` (no-print Chips, print-only Filterhinweis)
- `demo/components/kita/KitaPlanungsraumDetailListe.tsx` (no-print Chips, print-only Filterhinweis)
- `demo/app/kita/lagebild/page.tsx` (Druckleiste, no-print Banner/Badges, Methodik-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Versorgungslagebild Druckansicht (Meldelücke-Filter dokumentiert)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Monatsbericht/Einrichtung-Verlinkung schärfen, oder Druckansicht politische Vorlage um Handlungsfeld-/Detail-Meldelücke spiegeln falls künftig dort Filter hinzukommen.

---

## Iteration 2026-07-29 – US-KJ-005/006 Planungsraum-Detail Meldelücke-Filter

### Was
Steuerungslagebild Planungsraum-Detailkarten: Schnellfilter „Meldelücke“ gespiegelt (wie Engpass-Rangliste / Handlungsfelder / Vorlage). Client-Komponente `KitaPlanungsraumDetailListe` mit Chips „Alle Räume“ und „Meldelücke (n)“; Original-Rang nach Wartelistendruck bleibt; Leerzustand nach Session-Freigabe; Summenhinweis Residual über alle Räume (unabhängig vom Sichtfilter). Keine Umbewertung nach Meldeschwere. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/components/kita/KitaPlanungsraumDetailListe.tsx` (neu: Detailkarten + Meldelücke-Schnellfilter)
- `demo/app/kita/lagebild/page.tsx` (Einbindung statt Inline-Karten)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Versorgungslagebild Planungsraum-Detail (Meldelücke-Schnellfilter, Session-sensitiv)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Druckansicht Lagebild/Vorlage mit Engpass-/Handlungsfeld-/Detail-Meldelücke-Filter dokumentieren (print-only Hinweis bei aktivem Filter), oder Monatsbericht/Einrichtung-Verlinkung schärfen.

---

## Iteration 2026-07-29 – US-KJ-005/006 Lagebild Handlungsfelder Meldelücke-Filter

### Was
Steuerungslagebild-Handlungsfelder: Schnellfilter „Meldelücke“ gespiegelt (wie Engpass-Rangliste US-KJ-006 / Vorlage US-KJ-008). Chips „Alle Felder“ und „Meldelücke (n)“; Reihenfolge nach Wartelistendruck bleibt; Leerzustand nach Session-Freigabe; Summenhinweis. Keine Umbewertung nach Meldeschwere. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher docs) vor dem Feature.

### Dateien
- `demo/components/kita/KitaHandlungsfelder.tsx` (Schnellfilter Meldelücke, Leerzustand, Filter-Hinweise)
- `demo/app/kita/lagebild/page.tsx` (Badge-Hinweis Handlungsfelder + Meldelücke-Filter)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Versorgungslagebild Handlungsfelder (Meldelücke-Schnellfilter, Session-sensitiv)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Druckansicht Lagebild/Vorlage mit Engpass- und Handlungsfeld-Meldelücke-Filter dokumentieren, oder Planungsraum-Detailkarten optional mit Meldelücke-Fokus.

---

## Iteration 2026-07-29 – US-KJ-006 Lagebild Engpass Meldelücke-Filter

### Was
Steuerungslagebild-Engpass-Rangliste: Schnellfilter „Meldelücke“ gespiegelt (wie Vorlage US-KJ-008 / Planungsraum-Explorer). Chips „Alle Ränge“ und „Meldelücke (n)“; Original-Rang nach Wartelistendruck bleibt; Leerzustand nach Session-Freigabe; Summenhinweis. Keine Umbewertung nach Meldeschwere. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaEngpassRangliste.tsx` (Schnellfilter Meldelücke, Leerzustand, Rang-Erhalt)
- `demo/app/kita/lagebild/page.tsx` (Badge-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-006 / US-KJ-005 – Versorgungslagebild Engpass-Rangliste (Meldelücke-Schnellfilter, Session-sensitiv)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Handlungsfelder im Lagebild optional mit Meldelücke-Schnellfilter spiegeln, oder Druckansicht Lagebild/Vorlage Engpass-Filter dokumentieren.

---

## Iteration 2026-07-29 – US-KJ-010 Open-Data-Lizenzhinweis CSV-Export

### Was
Öffentliche Kita-CSV-Exporte tragen einen transparenten Demo-Lizenzhinweis im Metakommentarkopf und in der UI (US-KJ-010 offene fachliche Frage). Gemeinsames Modul `kitaCsvLizenz`: Open-Data-Status vorläufig, finale Lizenz je Bundesland zu klären; Vorschlag Demo-Nachnutzung CC-BY 4.0-ähnlich mit Quellenangabe. Eingebunden in Planungsraumdaten-, Zeitreihen- und Regionenvergleich-CSV (Stichtag + Verlauf). Datenlage-Hinweis auf `/kita`. Keine Kind- oder Personennamen, keine endgültige Rechtsentscheidung.

### Dateien
- `demo/components/kita/kitaCsvLizenz.ts` (neu: Meta-Zeilen, UI- und Button-Hinweis)
- `demo/components/kita/KitaCsvDownload.tsx` (Meta + UI)
- `demo/components/kita/KitaZeitreiheTabelle.tsx` (Meta + UI)
- `demo/components/kita/KitaRegionenVergleich.tsx` (Meta Stichtag/Verlauf + UI)
- `demo/app/kita/page.tsx` (Badge + Datenlage-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (offene Frage Datenlizenz / Open Data)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Druckansicht Lagebild mit Engpass/Meldebasis dokumentieren, oder Meldelücke-Schnellfilter in Lagebild-Engpass-Rangliste spiegeln (analog Vorlage).

---

## Iteration 2026-07-29 – US-KJ-010 Regionenvergleich Verlauf CSV-Export (AK 4)

### Was
Regionenvergleich: CSV-Export des aktiven 12-Monats-Verlaufs A vs. B (`KitaRegionenVergleich` / `VerlaufAvsB`, US-KJ-010 AK 4). Button „CSV herunterladen (Verlauf)“ lädt genau die aktive Kennzahl und Raumauswahl (Monate · Wert A/B · Δ · Meldebasis · Berichtsmonat-Flag). Stichtags-CSV umbenannt zu „CSV herunterladen (Stichtag)“ zur Unterscheidung. Semikolon, UTF-8 BOM, Dezimal-Komma; Meta-Kommentarkopf. Keine Kind- oder Personennamen, keine Trendbewertung, keine Interpolation.

### Dateien
- `demo/components/kita/KitaRegionenVergleich.tsx` (Verlauf-CSV, Methodik, Button-Labels)
- `demo/app/kita/page.tsx` (Badge + Datenlage-Hinweis Verlauf-CSV)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (AK 4: Export aktiver Verlaufsdaten)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Druckansicht Lagebild/Vorlage Engpass-Filter dokumentieren, oder optional Open-Data-Lizenzhinweis am CSV-Export (US-KJ-010 offene Frage).

---

## Iteration 2026-07-29 – US-KJ-010 Regionenvergleich Zeitverlauf A vs. B

### Was
Regionenvergleich um 12-Monats-Verlauf der aktiven Auswahl A/B erweitert (`KitaRegionenVergleich`, US-KJ-010). Kennzahl-Chips (Warteliste, Auslastung, freie Plätze, Personalausfall); Tabelle Monat · Wert A · Wert B · Δ (A − B) · Meldebasis. Berichtsmonat Oktober 2024 mit Meldelücke-Hinweis (Session-sensitiv). Raumreihen aus `zeitreihePlanungsraeume`. Keine Interpolation, keine Trendbewertung, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaRegionenVergleich.tsx` (Verlauf A vs. B, Kennzahl-Chips, Meldebasis-Monat)
- `demo/app/kita/page.tsx` (Props zeitreihePlanungsraeume, Badge + Datenlage-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (Verlauf zweier Räume über Monate)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Optional CSV-Export des aktiven Verlaufs A/B, oder Druckansicht Lagebild/Vorlage Engpass-Filter dokumentieren.

---

## Iteration 2026-07-29 – US-KJ-010 Regionenvergleich CSV-Export (AK 4)

### Was
Öffentlicher Transparenzbericht: CSV-Export der aktiven Regionenvergleichs-Ansicht (`KitaRegionenVergleich`, US-KJ-010 AK 4). Button lädt genau die Auswahl A/B inkl. Kennzahlen, Werte A/B, Δ (A − B), Einheit und Meldebasis je Raum (Session-sensitiv). Semikolon, UTF-8 BOM, Dezimal-Komma; Meta-Kommentarkopf. Keine Kind- oder Personennamen, keine Trendbewertung.

### Dateien
- `demo/components/kita/KitaRegionenVergleich.tsx` (CSV-Download aktive Vergleichsansicht, Methodik AK4)
- `demo/app/kita/page.tsx` (Badge-Text + Datenlage-Hinweis AK4)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (AK 4: Export gefilterter Vergleichsdaten)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Optional: Zeitreihe in den Regionenvergleich einbinden (zwei Räume über Monate), oder Druckansicht Lagebild/Vorlage Engpass-Filter dokumentieren. Q-119 (CSV Zeitreihe + Vergleich) ist fachlich abgedeckt.

---

## Iteration 2026-07-29 – US-KJ-010 Zeitreihe CSV-Export (AK 4)

### Was
Öffentlicher Transparenzbericht: CSV-Export der gefilterten Zeitreihe (`KitaZeitreiheTabelle`, US-KJ-010 AK 4). Button lädt genau die aktive Filteransicht (Gesamtkommune oder Planungsraum) inkl. Regionsspalten, Kennzahlen, Peak/Aktuell-Flags und Meldebasis-Hinweis (Session-sensitiv). Semikolon, UTF-8 BOM, Dezimal-Komma; Meta-Kommentarkopf. Keine Kind- oder Personennamen, keine Trendbewertung.

### Dateien
- `demo/components/kita/KitaZeitreiheTabelle.tsx` (CSV-Download der aktiven Serie, Methodik AK4)
- `demo/app/kita/page.tsx` (Badge-Text + Datenlage-Hinweis AK4)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (AK 4: Export gefilterter Zeitreihe)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
CSV-Export der Regionenvergleichs-Ansicht (AK 3 + AK 4), oder optional Zeitreihe in den Regionenvergleich einbinden.

---

## Iteration 2026-07-29 – US-KJ-010 Zeitreihe Regionenfilter (AK 2)

### Was
Öffentlicher Transparenzbericht: Zeitreihe nach Planungsraum filterbar (`KitaZeitreiheTabelle`, US-KJ-010 AK 2). Chips Gesamtkommune + fünf Planungsräume; Raumreihen als Demo-Verteilung der kommunalen Monatsreihe nach Strukturanteilen. Peak/Delta und Meldebasis raumbezogen (Session-sensitiv). Keine Interpolation, keine Trendbewertung, keine Kind- oder Personennamen.

### Dateien
- `demo/types/kita.ts` (`zeitreihePlanungsraeume` am Lagebild)
- `demo/data/mockKitaLagebild.ts` (`buildZeitreihePlanungsraeume`)
- `demo/components/kita/KitaZeitreiheTabelle.tsx` (Filter-UI, raumbezogene Meldebasis)
- `demo/app/kita/page.tsx` (Props + Datenlage-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (AK 2: Regionenfilter)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
CSV-Export der gefilterten Zeitreihe (US-KJ-010 AK 4), oder Zeitreihe optional in den Regionenvergleich einbinden.

---

## Iteration 2026-07-29 – US-KJ-010 Regionenvergleich Zwei-Räume (AK 3)

### Was
Öffentlicher Transparenzbericht: Regionenvergleich zweier Planungsräume nebeneinander (`KitaRegionenVergleich`, US-KJ-010 AK 3). Auswahl A/B (Default Südost vs. Nordwest), gemeinsame Kernkennzahlen, Differenzspalte Δ (A − B), Kopfkarten mit Meldebasis-Badge (Session-sensitiv). Keine automatische Bewertung, keine Chart-Bibliothek. Datenlage-Hinweis auf `/kita` ergänzt. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaRegionenVergleich.tsx` (neu: Client, Zwei-Räume-Vergleich, Meldebasis)
- `demo/app/kita/page.tsx` (Sektion Regionenvergleich, Datenlage-Hinweis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 – Zeitreihen und Regionenvergleich (AK 3: Zwei Regionen nebeneinander)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Zeitreihe je Planungsraum filtern (AK 2) und optional in den Regionenvergleich einbinden, oder CSV-Export gefilterter Vergleichsdaten (AK 4).

---

## Iteration 2026-07-29 – US-KJ-010 Zeitreihe Meldebasis (Datenlücken)

### Was
Öffentlicher Transparenzbericht Zeitreihe (`KitaZeitreiheTabelle`, US-KJ-010): Berichtsmonat Oktober 2024 methodisch an Meldebasis-Stichprobe (Meldeeingang) gekoppelt. Spalte „Meldebasis“, Summenhinweis, Badge „Meldelücke“ und Rahmen am Meldemonat bei unvollständiger Stichprobe (Session-sensitiv). Historische Monate ohne Stichprobe: „–“. Kennzahlen unverändert, keine Interpolation/Trendkorrektur. Datenlage-Hinweis auf `/kita` ergänzt. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaZeitreiheTabelle.tsx` (Client, Meldebasis-Spalte, Lückenmarkierung, Methodik AK6)
- `demo/app/kita/page.tsx` (Datenlage-Hinweis Zeitreihe ↔ Meldebasis)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 / US-KJ-004 – Zeitreihen Regionenvergleich (Datenlücken im Zeitverlauf sichtbar)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Regionenvergleich Zwei-Räume nebeneinander (US-KJ-010 AK3), oder Druckansicht Lagebild/Vorlage Engpass-Filter dokumentieren.

---

## Iteration 2026-07-29 – US-KJ-008 Vorlage Engpass Meldelücke-Filter

### Was
Politische Vorlage (`/kita/vorlage`): Engpass-Liste (Top 3 nach Wartelistendruck) mit Schnellfilter „Meldelücke“ gespiegelt (wie Planungsraum-Explorer). Chips mit Zähler, Badge/Rahmen bei Lücke, Leerzustand nach Session-Freigabe, Summenhinweis und Methodik-Punkt. Rangfolge bleibt nach Druck; keine Umbewertung. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/app/kita/vorlage/page.tsx` (Engpass-Schnellfilter Meldelücke, UI, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-008 / US-KJ-009 – Politische Vorlage Engpass-Liste (Meldelücke-Filter, Session-sensitiv)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Zeitreihen-Regionenvergleich (US-KJ-010) methodisch an Meldebasis knüpfen, oder Lagebild/Vorlage Druckansicht Engpass-Filter dokumentieren.

---

## Iteration 2026-07-29 – US-KJ-005/006 Handlungsfelder Meldebasis

### Was
Steuerungslagebild-Handlungsfelder zeigen je Planungsraum Meldebasis-Kurzmarkierung aus dem Meldeeingang (Session-sensitiv): Badge „vollständig“ / „Lücke (n/m)“, Kurzlabel „· Meldelücke (überfällig|ausstehend)“, Rahmenfarbe bei Lücke, Kurzhinweis mit Einrichtungsnamen (Aggregate), Summenhinweis unter der Liste. Ableitung bleibt nach Wartelistendruck; keine Empfehlung, keine Umbewertung. Nach Session-Freigabe in `/kita/meldung` entfällt die Markierung. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaHandlungsfelder.tsx` (neu: Client-Komponente Handlungsfelder + Meldebasis)
- `demo/app/kita/lagebild/page.tsx` (Einbindung statt Inline-Handlungsfelder)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Versorgungslagebild Handlungsfelder (Meldebasis-Kurzmarkierung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage-Engpass-Liste mit Meldelücke-Filter spiegeln, oder Zeitreihen-Regionenvergleich (US-KJ-010) methodisch an Meldebasis knüpfen.

---

## Iteration 2026-07-29 – US-KJ-006 Engpass-Rangliste Meldebasis

### Was
Steuerungslagebild-Engpass-Rangliste zeigt je Planungsraum Meldebasis-Kurzmarkierung aus dem Meldeeingang (Session-sensitiv): Badge „vollständig“ / „Lücke (n/m)“, Kurzlabel „· Meldelücke (überfällig|ausstehend)“, Rahmenfarbe bei Lücke, Summenhinweis unter der Liste. Rangfolge bleibt nach Wartelistendruck; keine Umbewertung, keine Interpolation. Nach Session-Freigabe in `/kita/meldung` entfällt die Markierung. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaEngpassRangliste.tsx` (neu: Client-Komponente Rangliste + Meldebasis)
- `demo/app/kita/lagebild/page.tsx` (Einbindung statt Inline-Rangliste)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-006 / US-KJ-005 – Versorgungslagebild Engpass-Rangliste (Meldebasis-Kurzmarkierung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Handlungsfelder im Lagebild um Meldebasis-Kurzmarkierung ergänzen, oder Vorlage-Engpass-Liste mit Meldelücke-Filter spiegeln.

---

## Iteration 2026-07-29 – US-KJ-005/006 Lagebild Residual ↔ Meldelücke

### Was
Steuerungslagebild-Planungsraum-Karten zeigen residuale Planungslücke (Demo-Näherung wie Bedarfsplanung) und koppeln sie methodisch an Meldelücken aus dem Meldebeitrag: Residualzahl + Meldebasis-Badge + ResidualMeldeHinweis je Karte; Summenhinweis über der Detailansicht (Fokus Südost / PR-03). Hinweis-only, keine Interpolation; nach Session-Freigabe entfällt der Melde-Hinweis. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaPlanungsraumMeldebeitrag.tsx` (Residual-Block, Meldebasis, Summenhinweis-Export)
- `demo/app/kita/lagebild/page.tsx` (Residual-Berechnung, Prop, Summenhinweis, Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 ↔ US-KJ-007 – Versorgungslagebild (Residual methodisch an Meldelücke)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage-Engpass-Liste mit Meldelücke-Filter spiegeln, oder Engpass-Rangliste im Lagebild um Meldebasis-Kurzmarkierung ergänzen.

---

## Iteration 2026-07-29 – US-KJ-009 Filter Engpass + Meldelücke

### Was
Planungsraum-Explorer: Schnellfilter-Chips „Engpass“ und „Meldelücke“ (mit Zählern) ergänzen die Raum-Auswahl. Raum-Chips zeigen „· Meldelücke“ zusätzlich zu „· Engpass“; Rahmenfarbe bei Meldelücke. Tabelle und Maßnahmen folgen dem Schnellfilter in der Mehrfachansicht. Leerer Filterzustand mit Hinweis (z. B. nach Session-Freigabe keine Meldelücke mehr). Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaPlanungsraumExplorer.tsx` (Schnellfilter, Chip-Labels Meldelücke, Leerzustand)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 / US-KJ-007 – Transparenzbericht Planungsraum-Explorer (Filter Engpass ↔ Meldelücke)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild-Planungsraum-Karten Residual↔Melde-Kurzhinweis, oder Vorlage-Engpass-Liste mit Meldelücke-Filter spiegeln.

---

## Iteration 2026-07-29 – US-KJ-008 Vorlage Residual ↔ Meldelücke

### Was
Politische Vorlage (`/kita/vorlage`) spiegelt residuale Planungslücke methodisch an Meldelücken aus dem Meldeeingang: Spalte „Meldebasis“, kompakte Residual-Hinweise je Zeile, Summenhinweis (Fokus Südost / PR-03), Engpass-Liste mit Meldebasis-Zusatz, Methodik-Punkt. Hinweis-only, keine Interpolation; nach Session-Freigabe entfällt der Melde-Hinweis. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/app/kita/vorlage/page.tsx` (Meldebasis, ResidualMeldeHinweis/-Summen, Engpass/Methodik)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-008 / US-KJ-007 – Politische Vorlage (Residual methodisch an Meldelücke, wie Bedarfsplanung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Filter-Chip „Engpass“ im Planungsraum-Explorer um Meldelücke ergänzen, oder Lagebild-Planungsraum-Karten Residual↔Melde-Kurzhinweis.

---

## Iteration 2026-07-29 – US-KJ-009/007 Planungsraum-Explorer Residual ↔ Meldelücke

### Was
Planungsraum-Explorer im öffentlichen Transparenzbericht spiegelt die residuale Planungslücke (Demo-Näherung wie Bedarfsplanung) und koppelt sie methodisch an Meldelücken aus dem Meldeeingang: Spalten „Planungslücke“ und „Meldebasis“, Detailkarte mit Residual + Meldebasis + Hinweisbox, Summenhinweis (Fokus Südost / PR-03). Hinweis-only, keine Interpolation; nach Session-Freigabe entfällt der Melde-Hinweis. Datenlage-Text auf `/kita` angepasst. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaPlanungsraumExplorer.tsx` (Residual, Meldebasis, ResidualMeldeHinweis/-Summen)
- `demo/app/kita/page.tsx` (Hinweis Datenlage Meldelücke/Residual)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 / US-KJ-007 – Transparenzbericht Planungsraum-Explorer (Residual methodisch an Meldelücke)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Vorlage-Seite (`/kita/vorlage`) Residual↔Melde-Hinweis spiegeln, oder Filter-Chip „Engpass“ um Meldelücke ergänzen.

---

## Iteration 2026-07-29 – US-KJ-003 Monatsbericht ↔ Lagebild-Vorschau (Rücklink)

### Was
Monatsbericht-Seite (Modus VORSCHAU / laufender Monat) verlinkt zurück zum Steuerungslagebild: Hinweis „Im Lagebild als Vorschau sichtbar“, Aktionsbutton und Footer-Link auf `/kita/lagebild#kita-monatsbericht-vorschau`. Anker-IDs am Meldeeingang und an der Monatsbericht-Vorschau-Karte. Methodische Trennung Meldeeingang vs. Vorschau bleibt. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/app/kita/monatsbericht/page.tsx` (Vorschau-Hinweis, Button, Footer-Rücklink)
- `demo/components/kita/KitaMeldeeingangMonatsberichtVorschau.tsx` (`id="kita-monatsbericht-vorschau"`)
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (`id="meldeeingang"`)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 / US-KJ-005 – Monatsbericht-Vorschau im Lagebild-Kontext (Rückrichtung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Planungsraum-Explorer Residual-Hinweis spiegeln (Bedarfsplanung ↔ Meldelücke), oder Vorlage/Transparenzbericht: Meldebasis-Kurzhinweis.

---

## Iteration 2026-07-29 – US-KJ-007 Residual ↔ Meldelücke (Hinweis-only)

### Was
Bedarfsplanungsentwurf knüpft residuale Planungslücken methodisch an fehlende freigegebene Einrichtungsmeldungen (Fokus Südost / Kita Sonnenwinkel). Hinweis-only: Residualzahl unverändert, keine Interpolation. Tabellenzelle „Planungslücke“ mit Kompakt-Hinweis bei Meldelücke; Summenhinweis-Box unter Kennzahlen; Kurztext an Residual-Summe. Nach Session-Freigabe in `/kita/meldung` entfallen die Hinweise. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaBedarfsplanungDatenbasis.tsx` (`ResidualMeldeHinweis`, `ResidualMeldeSummenHinweis`)
- `demo/app/kita/bedarfsplanung/page.tsx` (Einbindung Residual↔Melde-Hinweise)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-007 – Bedarfsplanungsentwurf (Residual methodisch an Meldelücke)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Monatsbericht-Seite Rücklink „im Lagebild als Vorschau sichtbar“, oder Planungsraum-Explorer Residual-Hinweis spiegeln.

---

## Iteration 2026-07-29 – US-KJ-003/005 Meldeeingang ↔ Monatsbericht-Vorschau

### Was
Steuerungslagebild-Meldeeingang koppelt den Status freigegebener Monatsmeldungen (Abschlussmonat) mit der Monatsbericht-Vorschau des laufenden Monats für Kita Sonnenwinkel: gemischte Tagesstand-Quellen (freigegeben / fehlt / in Erfassung), methodische Trennung von Meldeeingang und Vorschau, Links zu Monatsbericht und Freigabe. Vorschau ersetzt fehlende Monatsmeldung nicht. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaMeldeeingangMonatsberichtVorschau.tsx` (neu)
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (Einbindung + Methodik-Link)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 / US-KJ-005 – Monatsbericht-Vorschau im Meldeeingang-Kontext des Lagebilds

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung: residuale Lücke Südost methodisch an fehlende Meldung knüpfen (Hinweis-only), oder Monatsbericht-Seite Rücklink „im Lagebild als Vorschau sichtbar“.

---

## Iteration 2026-07-29 – US-KJ-007 Bedarfsplanung Datenlücke aus Meldeeingang

### Was
Bedarfsplanungsentwurf leitet je Planungsraum die Meldebasis aus dem Meldeeingang ab (US-KJ-004→007). Fokus Südost (PR-03): Kita Sonnenwinkel initial überfällig → Warnhinweis und Spalte „Meldebasis“ (Lücke 0/1). Nach Session-Freigabe in `/kita/meldung` schließt sich die Datenlücke (Freigabe-ID, Aggregate nutzbar). Hafenviertel ausstehend ebenfalls ausgewiesen. Keine Interpolation; nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaBedarfsplanungDatenbasis.tsx` (neu: Hook, Panel, Badge, Ableitung)
- `demo/app/kita/bedarfsplanung/page.tsx` (Einbindung Meldebasis + Spalte)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-007 – Bedarfsplanungsentwurf (Datenbasis / Meldeeingang-Kopplung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild-Meldeeingang mit Monatsbericht-Vorschau-Status koppeln, oder Bedarfsplanung: residuale Lücke Südost methodisch an fehlende Meldung knüpfen (Hinweis-only).

---

## Iteration 2026-07-29 – US-KJ-003 Monatsbericht-Vorschau gemischte Quellen

### Was
Monatsbericht zeigt Demo-Ansicht „Laufender Monat“ (Status VORSCHAU, Nov 2024 bis Stichtag 12.11.): gemischte Tagesstand-Quellen FREIGEGEBEN (6), FEHLT (1, nicht interpoliert), IN_ERFASSUNG (1 Entwurf, nicht in Kennzahlen). Umschalter Abschluss Okt 2024 vs. Vorschau Nov 2024. Zählerkarte „In Erfassung“, Vorschau-Hinweis, Tabellenzeilen für Entwürfe. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/data/mockKitaMonatsbericht.ts` (`demoKitaMonatsberichtVorschau`)
- `demo/app/kita/monatsbericht/page.tsx` (Umschalter, Vorschau-UI, IN_ERFASSUNG)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 – Monatsbericht (Vorschau-Status / gemischte Datenbasis)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung: Datenlücke Südost aus Meldeeingang ableiten, oder Lagebild-Meldeeingang mit Vorschau-Monatsstatus koppeln.

---

## Iteration 2026-07-29 – US-KJ-005/006 Meldebeitrag Planungsraum-Karte

### Was
Planungsraum-Detailkarten im Steuerungslagebild zeigen den Beitrag freigegebener Einrichtungsmeldungen (Demo-Stichprobe). Planungsraum Südost: Kita Sonnenwinkel erscheint initial als Datenlücke; nach Session-Freigabe in `/kita/meldung` wird der Eingang auf der Karte hervorgehoben (Freigabe-ID, Kurz-Aggregate: Warteliste, Frei, Auslastung, Personalausfall). Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/components/kita/KitaPlanungsraumMeldebeitrag.tsx` (neu)
- `demo/app/kita/lagebild/page.tsx` (Einbindung in PlanungsraumKarte)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Versorgungslagebild (Meldebeitrag je Planungsraum, Kopplung US-KJ-004)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Monatsbericht-Vorschau-Status bei laufendem Monat mit gemischten Tagesstand-Quellen, oder Bedarfsplanung: Datenlücke Südost aus Meldeeingang ableiten.

---

## Iteration 2026-07-29 – US-KJ-004→005 Meldeeingang im Lagebild

### Was
Steuerungslagebild zeigt Meldeeingang freigegebener Monatsmeldungen (US-KJ-004→005, AK 4 Datenlücken): Demo-Stichprobe 5 Einrichtungen, Kita Sonnenwinkel initial überfällig/ohne Aggregate, andere freigegeben mit Kurz-Kennzahlen. Freigabe in `/kita/meldung` schreibt Session (localStorage) und aktualisiert den Lagebild-Eintrag inkl. „Neu im Meldeeingang“. Entwürfe bleiben unsichtbar. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/types/kitaMeldeeingang.ts` (neu)
- `demo/data/mockKitaMeldeeingang.ts` (neu)
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (neu)
- `demo/app/kita/lagebild/page.tsx` (Panel statt pauschaler „vollständig“-Hinweis)
- `demo/app/kita/meldung/page.tsx` (Session-Write + Linktext)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 – Versorgungslagebild (Datenbasis / Meldeeingang aus US-KJ-004)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Planungsraum-Karte Südost: Beitrag freigegebener Einrichtungsmeldung (Sonnenwinkel) nach Session-Eingang hervorheben, oder Monatsbericht-Vorschau-Status bei laufendem Monat mit gemischten Tagesstand-Quellen.

---

## Iteration 2026-07-29 – US-KJ-003 Datenbasis freigegebene Tagesstände

### Was
Monatsbericht zeigt explizit die Datenbasis aus freigegebenen Tagesständen (US-KJ-001→003): je Betriebstag Status (freigegeben/fehlt), Aggregat-Summen Anwesend/Personal-Ist, Schlüssel-Hinweis, Freigabe-Rolle/Zeit. Fehlender Tag 2024-10-14 bleibt Lücke (nicht interpoliert). CSV-Export enthält Quellenblatt. Tagesstand-Freigabe verweist auf Monatsbericht als Verbraucher. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/types/kitaMonatsbericht.ts` (`MonatsberichtTagesstandQuelle`, Feld `tagesstandQuellen`)
- `demo/data/mockKitaMonatsbericht.ts` (23 Betriebstage Okt 2024, 22 freigegeben)
- `demo/app/kita/monatsbericht/page.tsx` (Abschnitt Datenbasis + CSV)
- `demo/app/kita/tagesstand/page.tsx` (Hinweis Freigabe → Monatsbericht)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 – Monatsbericht (Transparenz Datenquelle / US-KJ-001-Kopplung)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild-Hinweis nach Meldungsfreigabe (US-KJ-004→005) oder Monatsbericht-Vorschau-Status bei laufendem Monat mit gemischten Quellen-Status.

---

## Iteration 2026-07-29 – US-KJ-001 Tagesstand erfassen

### Was
Demo-Route `/kita/tagesstand`: Tagesstand der fiktiven Einrichtung „Kita Sonnenwinkel“ je Gruppe als Aggregate (Kinder: anwesend/krank/Urlaub/sonstiges; Personal: geplant/Ist-Stunden). Personalschlüssel-Unterschreitung sichtbar markiert, nicht auto-gemeldet. Aktive Leitungs-Freigabe sperrt den Stand (Revisionssicherheit). Session-lokal. Keine Kind- oder Personennamen.

### Dateien
- `demo/types/kitaTagesstand.ts` (neu)
- `demo/data/mockKitaTagesstand.ts` (neu)
- `demo/app/kita/tagesstand/page.tsx` (neu)
- `demo/app/kita/layout.tsx` (Nav-Eintrag)
- `demo/app/kita/einrichtung/page.tsx` (Link + Hinweis US-KJ-001)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-001 – Tagesstand erfassen

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Freigegebene Tagesstände als Quelle im Monatsbericht sichtbar machen (Hinweis/Stand, ohne storyRegistry) oder Lagebild-Hinweis nach Meldungsfreigabe (US-KJ-004→005).

---

## Iteration 2026-07-29 – US-KJ-004 Meldung freigeben

### Was
Demo-Route `/kita/meldung`: Systemvorbereitete Monatsmeldung der fiktiven Einrichtung „Kita Sonnenwinkel“ prüfen, einzelne Aggregate mit Begründung korrigieren, aktiv freigeben (Checkbox + Bestätigung). Freigabe-ID, Rollenstempel, Zeitstempel und simulierter JA-Eingang. Session-lokal. Nur Aggregate, keine Kind- oder Personennamen.

### Dateien
- `demo/types/kitaMeldung.ts` (neu)
- `demo/data/mockKitaMeldung.ts` (neu)
- `demo/app/kita/meldung/page.tsx` (neu)
- `demo/app/kita/layout.tsx` (Nav-Eintrag)
- `demo/app/kita/monatsbericht/page.tsx` (Link statt „Demo folgt“)
- `demo/app/kita/einrichtung/page.tsx` (Link)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 – Meldung prüfen und freigeben

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
US-KJ-001 Tagesstand-Erfassung (aggregiert, session-lokal) oder Verknüpfung freigegebener Meldung → Lagebild-Hinweis (ohne storyRegistry).

---

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
