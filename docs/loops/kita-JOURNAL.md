# Kita Domain-Loop Journal

Branch: `loop/kita` · Worktree: `D:\Projects\open-state-loop-kita`

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
