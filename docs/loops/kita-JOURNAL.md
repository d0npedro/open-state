# Kita Domain-Loop Journal

Branch: `loop/kita` · Worktree: `D:\Projects\open-state-loop-kita`

**Rotation (Q-303):** Aktives Journal max. 15 Iterationen (neueste zuerst).  
Ältere Einträge: [`archive/journals/kita-2026-07-older.md`](../../archive/journals/kita-2026-07-older.md) (49 Iterationen).  
Index: [`archive/journals/README.md`](../../archive/journals/README.md).

---

## Iteration 2026-07-29 – US-KJ-005/010 Lagebild-CSV Regionenvergleich Verlauf-Paare

### Was
Steuerungslagebild-CSV (`KitaLagebildDruck`, US-KJ-005 / US-KJ-010): Blatt 8 „Regionenvergleich Verlauf 12 Monate“. Alle Paare i < j der exportierten Planungsräume (sortiert nach Wartelistendruck; optional Filter Meldelücke) × 4 Kennzahlen (Warteliste, Auslastung, freie Plätze, Personalausfall) × Monate der Planungsraum-Zeitreihe. Δ (A − B) rein rechnerisch je Monat; fehlende Monatswerte leer (keine Interpolation); Meldebasis nur im Stichprobenmonat Session-sensitiv. Metakopf, Export-Karte, Methodik und Footer auf `/kita/lagebild` ergänzt (Komponenten-CSV Verlauf bleibt; Gesamt-CSV ergänzt Paar-Verläufe). Keine Trendbewertung. Nur Aggregate, keine Kind- oder Personennamen. Branch bereits auf main-Stand (kein Merge nötig).

### Dateien
- `demo/components/kita/KitaLagebildDruck.tsx` (Blatt 8, Meta, Export-Text)
- `demo/app/kita/lagebild/page.tsx` (Sektions-Hinweis, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-010 – Steuerungslagebild CSV Regionenvergleich Verlauf-Paare

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Feinschliff falls Lücken, oder Explorer/Bedarfsplanung CSV um Verlaufshinweise spiegeln, oder Druck-Meta Restlücken prüfen.

---

## Iteration 2026-07-29 – US-KJ-005/010 Lagebild-CSV Regionenvergleich Stichtag-Paare

### Was
Steuerungslagebild-CSV (`KitaLagebildDruck`, US-KJ-005 / US-KJ-010): Blatt 7 „Regionenvergleich Stichtag“. Alle Paare i < j der exportierten Planungsräume (sortiert nach Wartelistendruck; optional Filter Meldelücke). Kennzahlen wie Komponenten-Stichtags-CSV (Versorgung U3/Ü3, Auslastung, freie Plätze, Warteliste, Druckfaktor, Personal, real nutzbar, Inklusion) inkl. Rang A/B, Δ (A − B) rein rechnerisch, Meldebasis-Session je Raum. Metakopf-Hinweis; Export-Karte, Methodik und Footer auf `/kita/lagebild` geschärft (Komponenten-CSV Stichtag/Verlauf bleibt; Gesamt-CSV ergänzt Paare). Keine Interpolation, keine Bewertung. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` vor dem Feature.

### Dateien
- `demo/components/kita/KitaLagebildDruck.tsx` (Blatt 7, Meta, Export-Text)
- `demo/app/kita/lagebild/page.tsx` (Sektions-Hinweis, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-010 – Steuerungslagebild CSV Regionenvergleich Stichtag-Paare

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Feinschliff falls Lücken, oder Explorer Meldebasis-Druck weiter spiegeln, oder optional Verlaufs-Paare im Steuerungs-CSV falls fachlich gewünscht.

---

## Iteration 2026-07-29 – US-KJ-003/005 Monatsbericht-Vorschau CSV am Meldeeingang

### Was
Monatsbericht-Vorschau im Steuerungslagebild (`KitaMeldeeingangMonatsberichtVorschau`, US-KJ-003 ↔ US-KJ-005 auf `/kita/lagebild`): CSV-Export freigabeunabhängig analog Monatsbericht-Seite. Button „CSV exportieren“ (no-print) neben Status VORSCHAU. Metakopf: Demo-Modus Vorschau, Status, Tagesstand-Quellen (freigegeben/fehlt/in Erfassung), Meldeeingang-Kopplung (Abschlussmonat Status/Periode/Freigabe-ID, Lücke vs. parallel), Methodik-Trennung, DEC-004. Blätter: 1 Gruppenkennzahlen + Summe, 2 Tagesstand-Quellen je Betriebstag bis Stichtag. Dateiname `…-vorschau-meldeeingang.csv`. Methodik/Badge/Footer und Export-Hinweis in `KitaLagebildDruck`, Meldeeingang-Panel und `/kita/lagebild`. Keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits im Branch (kein Merge nötig).

### Dateien
- `demo/components/kita/KitaMeldeeingangMonatsberichtVorschau.tsx` (downloadVorschauCsv, Export-Button, Methodik)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Vorschau-CSV)
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (Methodik Vorschau-CSV)
- `demo/app/kita/lagebild/page.tsx` (Badge, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-003 / US-KJ-005 – Monatsbericht-Vorschau CSV Aggregate am Meldeeingang (Kopplung, freigabeunabhängig)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Feinschliff falls Lücken, oder Lagebild-CSV um optionalen Regionenvergleich-Hinweis schärfen, oder Explorer Meldebasis-Druck weiter spiegeln falls nötig.

---

## Iteration 2026-07-29 – US-KJ-004/005 Meldeeingang CSV Aggregate Status/Lücken/Session

### Was
Meldeeingang im Steuerungslagebild (`KitaMeldeeingangPanel`, US-KJ-004→005 auf `/kita/lagebild`): CSV-Export freigabeunabhängig analog Meldung/Monatsbericht/Lagebild. Button „CSV exportieren“ (no-print) neben der Sektionsüberschrift. Metakopf: Berichtsmonat, Datenvollständigkeit bzw. Lückenliste, Session-Freigabe, Zähler freigegeben/überfällig/ausstehend, Methodik, DEC-004. Blätter: 1 Eingangsstatus je Einrichtung (Session-sensitiv), 2 Aggregate nur freigegebener Meldungen (unfreigegebene ohne Kennzahlen), 3 Lückenliste. Dateiname mit `-mit-luecken`/`-vollstaendig` und optional `-session`. Methodik/Badge/Footer und Export-Hinweis in `KitaLagebildDruck` sowie auf `/kita/lagebild`. Keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits auf Branch (kein Merge nötig).

### Dateien
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (downloadCsv, Export-Button, Methodik)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Meldeeingang-CSV)
- `demo/app/kita/lagebild/page.tsx` (Badge, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 / US-KJ-005 – Meldeeingang CSV Aggregate Status/Lücken/Session

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Feinschliff falls Lücken, oder Lagebild-CSV um optionalen Regionenvergleich-Hinweis schärfen, oder Monatsbericht-Vorschau-CSV am Meldeeingang falls fachlich gewünscht.

---

## Iteration 2026-07-29 – US-KJ-004/005 Meldeeingang Druck-Meta Status/Datenbasis/Session

### Was
Steuerungslagebild Meldeeingang (`KitaMeldeeingangPanel`, US-KJ-004→005 auf `/kita/lagebild`): Druck-Meta an Engpass/Explorer/Zeitreihe angeglichen. print-only immer: Berichtsmonat, Datenvollständigkeit bzw. Lückenliste (Einrichtung + Planungsraum + Status), Session-Freigabe (ID/Rolle/Zeitstempel oder Ausgangsstand), Zähler freigegeben/überfällig/ausstehend. Aktionslinks no-print; Methodik mit print-only Hinweis. Monatsbericht-Vorschau (`KitaMeldeeingangMonatsberichtVorschau`): print-only Status VORSCHAU, Tagesstand-Quellen (freigegeben/fehlt/in Erfassung), Meldeeingang-Abschlussstatus; Links no-print. Export-Hinweis in `KitaLagebildDruck`, Badge/Methodik/Footer auf `/kita/lagebild`. Keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaMeldeeingangPanel.tsx` (print-only Status/Datenbasis/Session)
- `demo/components/kita/KitaMeldeeingangMonatsberichtVorschau.tsx` (print-only Vorschau-Meta)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Meldeeingang Druck-Meta)
- `demo/app/kita/lagebild/page.tsx` (Badge, Methodik, Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-004 / US-KJ-005 – Meldeeingang Druck-Meta Status, Datenbasis und Session-Freigabe

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Bedarfsplanung Feinschliff falls Lücken, oder Lagebild-CSV um optionalen Regionenvergleich-Hinweis schärfen, oder Meldeeingang-CSV Aggregate falls fachlich gewünscht.

---

## Iteration 2026-07-29 – US-KJ-005/010 Lagebild Regionenvergleich (Spiegel öffentlicher Bericht)

### Was
Steuerungslagebild (`/kita/lagebild`, US-KJ-005 / US-KJ-010): Regionenvergleich Zwei-Räume nicht nur im öffentlichen Transparenzbericht, sondern im JA-Lagebild-UI. Einbindung `KitaRegionenVergleich` (Stichtag A/B, Δ rein rechnerisch, 12-Monats-Verlauf, Meldebasis-Session je Raum, CSV Stichtag/Verlauf, print-only Filterstand A/B). Anker `#kita-lagebild-regionenvergleich`. Methodik/Badge/Footer und Export-Hinweis in `KitaLagebildDruck`. Keine Interpolation, keine automatische Bewertung. Nur Aggregate, keine Kind- oder Personennamen. `origin/main` bereits auf Branch (kein Merge nötig).

### Dateien
- `demo/app/kita/lagebild/page.tsx` (Regionenvergleich-Sektion, Import, Methodik/Footer/Badge)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Zeitreihe/Regionenvergleich UI)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-010 – Steuerungslagebild Regionenvergleich im UI (Spiegel öffentlicher Bericht)

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Meldeeingang Druck-Meta falls offen, oder Bedarfsplanung Feinschliff falls Lücken, oder Lagebild-CSV um optionalen Regionenvergleich-Hinweis schärfen.

---

## Iteration 2026-07-29 – US-KJ-005/006 Detailkarten Druck Filterstand + Meldebasis-Session

### Was
Steuerungslagebild Planungsraum-Detail (`KitaPlanungsraumDetailListe`, US-KJ-005/006 auf `/kita/lagebild`): Druck-Meta an Engpass/Handlungsfelder/Explorer angeglichen. Filter-Chips bleiben `no-print`; print-only Filterstand **immer** (nicht nur bei aktivem Meldelücke-Filter): Schnellfilter-Stand, Anzahl sichtbarer Karten, Meldebasis-Session (Lückenliste raumaggregiert, Session-sensitiv, Stichprobenmonat ISO+Label). Residual-Summenhinweis weiter über alle Räume. Methodik/Footer/Export-Hinweis auf `/kita/lagebild` und in `KitaLagebildDruck`. Keine Interpolation, keine Umbewertung nach Meldeschwere. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaPlanungsraumDetailListe.tsx` (print-only Filterstand immer + Meldebasis-Session)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Druck-Meta Detail)
- `demo/app/kita/lagebild/page.tsx` (Methodik/Footer/Badge)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Detailkarten Druck-Meta Filterstand und Meldebasis

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild-Regionenvergleich (US-KJ-010 Spiegel öffentlicher Bericht), oder Bedarfsplanung Feinschliff falls Lücken, oder Meldeeingang Druck-Meta falls offen.

---

## Iteration 2026-07-29 – US-KJ-005/006 Engpass/Handlungsfelder Druck Filterstand + Meldebasis-Session

### Was
Steuerungslagebild Engpass-Rangliste und Handlungsfelder (`KitaEngpassRangliste`, `KitaHandlungsfelder`, US-KJ-005/006 auf `/kita/lagebild`): Druck-Meta an Explorer/Zeitreihe/Regionenvergleich angeglichen. Filter-Chips bleiben `no-print`; print-only Filterstand **immer** (nicht nur bei aktivem Meldelücke-Filter): Schnellfilter-Stand, Anzahl sichtbarer Ränge/Felder, Meldebasis-Session (Lückenliste raumaggregiert, Session-sensitiv, Stichprobenmonat ISO+Label). Methodik/Footer/Export-Hinweis auf `/kita/lagebild` und in `KitaLagebildDruck`. Keine Interpolation, keine Umbewertung nach Meldeschwere. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaEngpassRangliste.tsx` (print-only Filterstand immer + Meldebasis-Session)
- `demo/components/kita/KitaHandlungsfelder.tsx` (print-only Filterstand immer + Meldebasis-Session)
- `demo/components/kita/KitaLagebildDruck.tsx` (Export-Hinweis Druck-Meta)
- `demo/app/kita/lagebild/page.tsx` (Methodik/Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-005 / US-KJ-006 – Engpass/Handlungsfelder Druck-Meta Filterstand und Meldebasis

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Detailkarten print-only Meldebasis-Session schärfen (KitaPlanungsraumDetailListe), oder Lagebild-Regionenvergleich (US-KJ-010 Spiegel öffentlicher Bericht), oder Bedarfsplanung Feinschliff falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-009 Explorer Druck Filterstand + Meldebasis-Session

### Was
Planungsraum-Explorer (`KitaPlanungsraumExplorer`, US-KJ-009 auf `/kita`): Druck-Meta an Zeitreihe/Regionenvergleich angeglichen. Filter-Chips bleiben `no-print`; print-only Filterstand **immer** (nicht nur bei aktivem Filter): Raumauswahl oder Schnellfilter Engpass/Meldelücke, Anzahl sichtbarer Räume, Maßnahmenbezug (+ geplante Plätze), residuale Planungslücke bei Einzelraum, Meldebasis-Session (raumbezogen oder Lückenliste, Session-sensitiv, Stichprobenmonat ISO+Label). Methodik/Footer/Datenlage auf `/kita`. Keine Interpolation. Nur Aggregate, keine Kind- oder Personennamen. Fast-forward `origin/main` vor dem Feature.

### Dateien
- `demo/components/kita/KitaPlanungsraumExplorer.tsx` (print-only Filterstand immer + Meldebasis-Session)
- `demo/app/kita/page.tsx` (Datenlage, Footer/print-Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-009 – Planungsraum-Explorer Druck-Meta Filterstand und Meldebasis

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Lagebild-Regionenvergleich (US-KJ-010 Spiegel öffentlicher Bericht), oder Engpass/Handlungsfelder print-only Meldebasis-Session schärfen, oder Bedarfsplanung Feinschliff falls Lücken.

---

## Iteration 2026-07-29 – US-KJ-010 Regionenvergleich Druck Filterstand A/B + Kennzahl

### Was
Regionenvergleich (`KitaRegionenVergleich`, US-KJ-010 AK 3/4 auf `/kita`): Druckansicht an Zeitreihe/Explorer-Muster. Auswahl A/B, Kennzahl-Chips und CSV-Buttons (Stichtag/Verlauf) `no-print`; print-only Filterstand mit Region A/B, Meldebasis-Session je Raum (Stichprobe/Lücken), Verlaufskennzahl + Monatsanzahl, Stichprobenmonat; ergänzender print-only Block am Verlauf. Methodik/Badge/Footer auf `/kita`. Keine Interpolation, keine Trendbewertung. Nur Aggregate, keine Kind- oder Personennamen. Merge `origin/main` (ci-watcher) vor dem Feature.

### Dateien
- `demo/components/kita/KitaRegionenVergleich.tsx` (print-only Filterstand A/B/Kennzahl/Meldebasis, no-print Auswahl/CSV/Chips)
- `demo/app/kita/page.tsx` (Badge, Datenlage, Footer/print-Footer)
- `docs/loops/kita-JOURNAL.md` (dieses Journal)

### Story
US-KJ-010 / US-KJ-009 – Regionenvergleich Druck-Meta Filterstand A/B und Verlaufskennzahl

### Build
`npm run lint` + `npm run build` im `demo/`-Verzeichnis (siehe Commit dieses Laufs)

### Nicht angefasst (Supervisor / verboten)
Queue, BUILD_STATE, storyRegistry, DECISION_LOG, andere Domänen, package.json, CI, push

### Nächster sinnvoller Schritt (Hinweis Supervisor)
Explorer/Meldebasis-Druckhinweis weiter schärfen, oder Bedarfsplanung/Vorlage Feinschliff falls Lücken, oder Lagebild-Regionenvergleich falls fachlich gewünscht.

---

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

