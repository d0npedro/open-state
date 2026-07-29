# Kita Domain-Loop Journal

Branch: `loop/kita` · Worktree: `D:\Projects\open-state-loop-kita`

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
