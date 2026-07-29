# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Supervisor-Pflicht-Push 2026-07-29 (Merge AV Q-167 + UG Q-168 + Kita Q-169/170; lint+build 27 Seiten grün; E2E 250; origin/main sync 0)

Dieser Stand beschreibt, was tatsächlich existiert und funktioniert.
Nicht was geplant ist. Für geplante Schritte → `NEXT_STEPS_QUEUE.md`.

---

## Laufende Demo

| Eigenschaft | Wert |
|-------------|------|
| Framework | Next.js 14.2.5, React 18, TypeScript 5 strict |
| Build-Status | ✓ Erfolgreich (27 statische Seiten) |
| Deployment | Vercel, aus `demo/`-Verzeichnis |
| Lokaler Start | `cd demo && npm install && npm run dev` |
| Letzte Build-Prüfung | lint+build **27 Seiten** + `test:e2e:ci` **250 passed** (Supervisor Merge Q-167–Q-170) |

---

## Demo-Routen

| Route | Inhalt | Story-IDs | Status |
|-------|--------|-----------|--------|
| `/` | Landing Page | – | ✓ |
| `/fall` | Fallübersicht, Status, Fairness-Summary, Fristen-Countdown offener Unterlagen, Upload-Quittung + nächste offene Unterlage nach Session-Upload, Termin-Kachel Status live | US-AV-001, US-AV-002, US-AV-003, US-AV-005 | ✓ |
| `/fall/dokumente` | Dokumentenanforderungen + Frist-Resttage + lokale Upload-Quittung pro Karte nach Session-Markierung | US-AV-003 | ✓ |
| `/fall/rueckfragen` | Rückfragen mit Fairness-Hinweis | US-AV-004 | ✓ |
| `/fall/termine` | Termine; session-lokale Bestätigung; Nav-Badge nur unbestätigt/bald fällig | US-AV-005 | ✓ |
| `/fall/bescheide` | Bescheide mit Fairness-Hinweisen | US-AV-006 | ✓ |
| `/fall/verlauf` | Timeline mit Fairness-Hinweis; Antwort-Quittungsblock; Upload-Blöcke mit Dokumentbezeichnung | US-AV-007 | ✓ |
| `/fall/hinweise` | Vollständige Fairness-Hinweisseite; UNTERLAGE-Signal live nach Session-Upload inkl. Frist + CTA Unterlagen | US-AV-008 | ✓ |
| `/stories` | Story Coverage Dashboard | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |
| `/gruendung` … | Unternehmensgründung (Übersicht Fairness-Kurzblock+Kurz-CTAs inkl. Steuernummer/Betriebsdatum/BG-Hilfstext session-sensitiv; CTA-Hilfstexte und Ziel-Routing zentral in `gruendung-rules` (`fairnessSignalZiel`), Dokumente lokale Upload-Quittung pro Karte, Behörden VS-04→Rückfrage, Hinweise-CTAs RQ/BG/Unterlagen/Steuernummer/Betriebsdatum/parallele Behörden, Verlauf Stelle+Ereignistyp-Filter, …) | US-UG-001–006 | ✓ |
| `/kita` | Öffentlicher Transparenzbericht + Planungsraum-Filter + Residual↔Meldelücke + Engpass/Meldelücke-Schnellfilter + Zeitreihe Meldebasis + Regionenfilter + Regionenvergleich Zwei-Räume inkl. 12-Monats-Verlauf A/B + CSV Multi-Blatt Status/Meldebasis + Druck-Meta Status/Meldebasis print-only + Open-Data-Lizenz + Hub-Karten JA-Steuerungskette (Lagebild/Bedarfsplanung/Vorlage) | US-KJ-009, US-KJ-010 | ✓ |
| `/kita/lagebild` | Jugendamt-Steuerungsansicht + Meldeeingang + Meldebeitrag + Engpass/Handlungsfelder/Planungsraum-Detail Meldelücke-Schnellfilter + Druck Meldelücke + CSV Aggregate Status/Meldebasis/Meldelücke + Zeitreihe-Blatt freigabeunabhängig + Monatsbericht-Vorschau + Steuerungskette Hub-Karten | US-KJ-005, US-KJ-006 | ✓ |
| `/kita/bedarfsplanung` | Bedarfsplanungsentwurf (§ 80 SGB VIII) + Meldebasis + Residual↔Meldelücke (Hinweis-only) + Steuerungskette Hub-Karten + Druck freigabeunabhängig mit Meldebasis-Session-Hinweis + CSV Aggregate freigabeunabhängig | US-KJ-007 | ✓ |
| `/kita/vorlage` | Politische Gremienvorlage + Freigabe + Meldebasis/Residual↔Meldelücke + Engpass Meldelücke-Filter + Druck freigabeunabhängig + CSV Aggregate Status/Meldebasis freigabeunabhängig + Steuerungskette Hub-Karten | US-KJ-008 | ✓ |
| `/kita/einrichtung` | Belegungsstand Einrichtung (aggregiert) + Prozesskette Tagesstand→Monatsbericht→Meldung + Druck Status/Datenbasis + CSV Status/Datenbasis-Metakopf | US-KJ-002 | ✓ |
| `/kita/tagesstand` | Tagesstand erfassen (Aggregate, Freigabe) + Prozesskette Hub-Karten Belegung/Monatsbericht/Meldung + Druck freigabeunabhängig + CSV Aggregate-Export | US-KJ-001 | ✓ |
| `/kita/monatsbericht` | Monatsbericht + Vorschau + Rücklink Lagebild + Einrichtungs-Kontext + Prozesskette + Druck Status/Tagesstand-Datenbasis + CSV Vorschau-Modus-Metadaten | US-KJ-003 | ✓ |
| `/kita/meldung` | Monatsmeldung prüfen, korrigieren, freigeben + Prozesskette Hub-Karten + Druck freigabeunabhängig + CSV Aggregate/Korrekturprotokoll freigabeunabhängig | US-KJ-004 | ✓ |

---

## Implementierte Logik

| Modul | Pfad | Status |
|-------|------|--------|
| Mock-Falldaten (ALG I) | `demo/data/mockFall.ts` | ✓ Vollständig |
| Story Registry | `demo/data/storyRegistry.ts` | ✓ AV + KJ + UG registriert |
| Fairness-Typen | `demo/types/fairness.ts` | ✓ |
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln, berechnete Fristtagezahl (ISO-Datum + FIKTIVES_HEUTE); UNTERLAGE_FEHLT mit Resttagen / RELEVANT ≤3 Tage (Q-147) |
| FairnessPanel-Komponente | `demo/components/fairness/FairnessPanel.tsx` | ✓ |
| BuildInfo-Komponente | `demo/components/BuildInfo.tsx` | ✓ |
| Demo-State-Kontext | `demo/context/DemoStateContext.tsx` | ✓ Rückfrage/Upload/Reset + Timeline; alle AV-Routen angebunden |
| Gründung-State-Kontext | `demo/context/GruendungStateContext.tsx` | ✓ Rückfrage/Upload/Reset + Verlauf; Fairness live |
| DemoSessionBar | `demo/components/DemoSessionBar.tsx` | ✓ Leiste „Demo zurücksetzen“ nach Interaktion |
| Kita Meldeeingang | `demo/components/kita/KitaMeldeeingangPanel.tsx` + `mockKitaMeldeeingang.ts` | ✓ freigegebene Monatsmeldungen im Lagebild, Session von `/kita/meldung` |
| Kita Meldeeingang ↔ Monatsbericht-Vorschau | `demo/components/kita/KitaMeldeeingangMonatsberichtVorschau.tsx` | ✓ Kopplung Abschluss-Meldeeingang und laufende Monatsvorschau (Sonnenwinkel) |
| Kita Meldebeitrag Planungsraum | `demo/components/kita/KitaPlanungsraumMeldebeitrag.tsx` | ✓ Beitrag freigegebener Meldungen auf Planungsraum-Karten; Südost/Sonnenwinkel nach Session-Freigabe hervorgehoben |
| Kita Bedarfsplanung Meldebasis | `demo/components/kita/KitaBedarfsplanungDatenbasis.tsx` | ✓ Datenlücke je Planungsraum aus Meldeeingang; Residual↔Meldelücke Hinweis-only; schließt sich nach Session-Freigabe |
| AV Termin-Bestätigung | `DemoStateContext.confirmTermin` + `/fall/termine` | ✓ session-lokal AUSSTEHEND→BESTAETIGT; Tab-Badge live |
| UG Verlauf Typ-Filter | `/gruendung/verlauf` | ✓ Stelle + Ereignistyp (Vorgang/Dokumente/Rückfragen/Bescheide), UND-Kombination |
| UG Hinweise Steuernummer-CTA | `/gruendung/hinweise` | ✓ CTA „Zum Finanzamt“ → `#beh-BEH-02` bei VS-05 AUSSTEHEND oder IN_BEARBEITUNG; Signal-Text session-sensitiv (Q-124) |
| UG Hinweise Betriebsdatum-CTA | `/gruendung/hinweise` + Übersicht `#verfahrensstatus` | ✓ CTA „Zum Verfahrensstatus“ aus HINWEIS-Betriebsdatum |
| UG Hinweise parallele-Behörden-CTA | `/gruendung/hinweise` → `/gruendung/behoerden` | ✓ CTA „Zu den Behörden“ aus INFO parallele Behörden (Q-113) |
| Kita Vorlage Engpass Meldelücke-Filter | `/kita/vorlage` Engpass-Liste | ✓ Schnellfilter Top-3 vs. Meldelücke, Session-sensitiv (Q-114) |
| Kita Zeitreihe Meldebasis | `demo/components/kita/KitaZeitreiheTabelle.tsx` | ✓ Berichtsmonat an Meldeeingang-Stichprobe; Spalte Meldebasis, Badge/Rahmen bei Lücke, keine Interpolation (Q-115) |
| Kita Zeitreihe Regionenfilter | `demo/components/kita/KitaZeitreiheTabelle.tsx` | ✓ Chips Gesamtkommune + 5 Planungsräume; raumbezogene Reihen/Meldebasis, Session-sensitiv (Q-117, US-KJ-010 AK2) |
| Kita Regionenvergleich | `demo/components/kita/KitaRegionenVergleich.tsx` | ✓ Zwei Planungsräume A/B, Kernkennzahlen + Δ, Meldebasis-Badge (Q-118, US-KJ-010 AK3) |
| UG Übersicht Fairness-Kurz-CTAs | `/gruendung` Fairness-Block | ✓ RELEVANT/HINWEIS → RQ/Unterlagen/BG/Steuernummer/Betriebsdatum-Anker; CTA entfällt nach State-Wechsel (Q-116, Q-127) |
| AV Termin-Kachel live | `/fall` Schnellzugriff | ✓ Chip Ausstehend/Bestätigt nach session-lokaler Bestätigung (Q-104, US-AV-005) |
| UG Behörden VS-04 → Rückfrage | `/gruendung/behoerden` | ✓ Verfahrensschritt mit offener RQ: CTA „Zur Rückfrage“ `#rq-…`; entfällt nach Beantworten (Q-120) |
| UG VS-04 Abschluss nach RQ | `GruendungStateContext` + Behörden/Verlauf | ✓ Nach Beantworten: VS-04 → ABGESCHLOSSEN, System-Verlaufsereignis (Q-121) |
| UG VS-05 Start nach RQ | `GruendungStateContext` + Behörden/Verlauf | ✓ Nach Beantworten: nächster AUSSTEHEND-Schritt derselben Behörde → IN_BEARBEITUNG (VS-05 Steuernummer) + Verlauf (Q-122) |
| Kita Zeitreihe/Vergleich CSV | `KitaZeitreiheTabelle` + `KitaRegionenVergleich` | ✓ CSV-Export gefilterter Ansicht inkl. Meldebasis/Δ und Verlauf A vs. B; Semikolon, UTF-8 BOM (Q-119, US-KJ-010 AK4) |
| Kita Regionenvergleich Verlauf | `KitaRegionenVergleich` | ✓ 12-Monats-Verlauf A vs. B neben Kernkennzahlen (US-KJ-010, Q-118-Erweiterung) |
| Kita CSV Open-Data-Lizenz | `kitaCsvLizenz.ts` + CSV-Komponenten | ✓ Demo-Lizenzhinweis Meta-Kopf + UI (vorläufig CC-BY-ähnlich; finale Lizenz BL-offen) (Q-123, US-KJ-010) |
| UG Steuernummer-Signal VS-05 | `gruendung-rules.ts` + Hinweise | ✓ Signal auch bei IN_BEARBEITUNG; Text blockiert/in Bearbeitung je Session (Q-124) |
| Kita Lagebild Engpass Meldelücke-Filter | `KitaEngpassRangliste.tsx` | ✓ Schnellfilter Alle/Meldelücke, Rang-Erhalt, Session-sensitiv (Q-125, US-KJ-006) |
| Kita Lagebild Handlungsfelder Meldelücke-Filter | `KitaHandlungsfelder.tsx` | ✓ Schnellfilter Alle/Meldelücke, Leerzustand nach Freigabe (Q-126, US-KJ-005/006) |
| Kita Lagebild Planungsraum-Detail Meldelücke-Filter | `KitaPlanungsraumDetailListe.tsx` | ✓ Schnellfilter Alle/Meldelücke, Rang-Erhalt, Session-sensitiv (Q-128, US-KJ-005/006) |
| AV Verlauf Upload-Bezeichnung | `/fall/verlauf` | ✓ `timeline-upload-block` mit Dokumentname (Q-105, US-AV-007) |
| UG Betriebsdatum-Signal Text | `gruendung-rules.ts` | ✓ Text session-sensitiv nach RQ-Antwort (Q-129) |
| Kita Lagebild Druck | `KitaLagebildDruck.tsx` | ✓ Druckleiste + print-only Meldelücke-Filterhinweise (Q-130) |
| Kita Prozesskette Betrieb | `/kita/einrichtung` + `/kita/monatsbericht` | ✓ Hub-Karten, Datenlücke-Links, Story-Labels (Q-131) |
| UG Übersicht Steuernummer-CTA Label | `/gruendung` Fairness-Kurzblock | ✓ CTA-Text „Zum Finanzamt“ vs. „Steuernummer-Stand ansehen“ je VS-05 (Q-132) |
| Kita Tagesstand Prozesskette | `/kita/tagesstand` | ✓ Hub-Karten Belegung/Monatsbericht/Meldung + DEC-004-Footer (Q-133, US-KJ-001) |
| UG Hinweise Steuernummer-CTA Label | `/gruendung/hinweise` | ✓ CTA-Label gespiegelt wie Übersicht bei VS-05 IN_BEARBEITUNG (Q-134) |
| Kita Meldung Prozesskette | `/kita/meldung` | ✓ Hub-Karten Tagesstand/Belegung/Monatsbericht (Q-135, US-KJ-004) |
| Kita Vorlage Druck freigabeunabhängig | `/kita/vorlage` | ✓ Druckleiste immer; print-only Status + Meldelücke-Filter (Q-136, US-KJ-008) |
| Kita Bedarfsplanung Steuerungskette | `/kita/bedarfsplanung` | ✓ Hub-Karten Lagebild/Meldung/Vorlage + Freigabe-CTA (Q-137, US-KJ-007) |
| UG Übersicht Betriebsdatum-CTA-Hilfstext | `/gruendung` Fairness-Kurzblock | ✓ Hilfstext unter „Zum Verfahrensstatus“ session-sensitiv nach RQ (Q-138) |
| UG Hinweise Betriebsdatum-CTA-Hilfstext | `/gruendung/hinweise` | ✓ Hilfstext unter Betriebsdatum-CTA session-sensitiv nach RQ (Q-139, Spiegel Übersicht) |
| Kita Bedarfsplanung Druck Meldebasis | `/kita/bedarfsplanung` | ✓ Druck freigabeunabhängig; print-only Status + Meldebasis-Session (Q-140, US-KJ-007) |
| UG Übersicht Steuernummer-CTA-Hilfstext | `/gruendung` Fairness-Kurzblock | ✓ Hilfstext unter Steuernummer-CTA session-sensitiv nach RQ (Q-141) |
| Kita Lagebild/Vorlage Steuerungskette-Hub | `/kita/lagebild` + `/kita/vorlage` | ✓ Rücklink-Karten Bedarfsplanung ↔ Lagebild ↔ Vorlage + Meldung (Q-142) |
| UG Hinweise Steuernummer-CTA-Hilfstext | `/gruendung/hinweise` | ✓ Offene RQ priorisiert; Spiegel Übersicht (Q-143) |
| Kita Monatsbericht Druck Status/Datenbasis | `/kita/monatsbericht` | ✓ Print-only Status + Tagesstand-Quellen (Q-144, US-KJ-003) |
| Kita öffentlicher Bericht Steuerungskette-Hub | `/kita` | ✓ Hub-Karten JA-Steuerungskette, DEC-004 Aggregate only (Q-145, US-KJ-009) |
| UG parallele Behörden session-sensitiv | `gruendung-rules` + Hinweise | ✓ Signal/CTA-Hint nach RQ-Antwort (Q-146) |
| AV UNTERLAGE berechnete Dokumenten-Frist | `fairness/rules` + `/fall/dokumente` | ✓ Resttage ggü. FIKTIVES_HEUTE; RELEVANT ≤3 / abgelehnt (Q-147) |
| UG BG-CTA-Hilfstext session-sensitiv | `/gruendung` + `/gruendung/hinweise` | ✓ Offene RQ priorisiert; nach Antwort Fokus BG-Anmeldung außerhalb (Q-148) |
| Kita Meldung Druck freigabeunabhängig | `/kita/meldung` | ✓ Print Status/Korrekturen/Freigabenachweis; interaktive Phasen no-print (Q-149, US-KJ-004) |
| Kita Tagesstand Druck freigabeunabhängig | `/kita/tagesstand` | ✓ Print Status/Datenbasis/Freigabenachweis; interaktive Phasen no-print (Q-150, US-KJ-001) |
| UG Unterlagen-CTA-Hilfstext session-sensitiv | `/gruendung` + `/gruendung/hinweise` | ✓ Offene RQ priorisiert; nach Antwort Nachreichung (Q-151) |
| Kita Einrichtung Belegungsstand-Druck | `/kita/einrichtung` | ✓ Print Status/Datenbasis; CSV/Prozess-Hub no-print (Q-152, US-KJ-002) |
| Kita Tagesstand CSV Aggregate-Export | `/kita/tagesstand` | ✓ freigabeunabhängig Gruppenaggregate + Summenzeile, DEC-004 (Q-153, US-KJ-001) |
| UG RQ-CTA-Hilfstext Frist/Konsequenz | `/gruendung` + `/gruendung/hinweise` | ✓ Fairness-CTA zur offenen RQ mit Antwortfrist und Konsequenz (Q-154) |
| Kita Monatsbericht CSV Vorschau-Metadaten | `/kita/monatsbericht` | ✓ CSV-Metakopf Demo-Modus/Status/Tagesstand-Quellen; Vorschau-Suffix (Q-155, US-KJ-003) |
| Kita Meldung CSV Aggregate freigabeunabhängig | `/kita/meldung` | ✓ Session-Kennzahlen + Korrekturprotokoll, Metakopf Status/Frist/Freigabe, DEC-004 (Q-156, US-KJ-004) |
| Kita Einrichtung CSV Status/Datenbasis-Metakopf | `/kita/einrichtung` | ✓ Metakopf aktuell/veraltet (3-Tage), Summen, Prozessbezug; Export-Karte Druck+CSV; DEC-004 (Q-157, US-KJ-002) |
| UG Primär-CTA Nächster Schritt RQ-Frist-Hilfstext | `/gruendung` | ✓ Primär-CTA mit Antwortfrist/Konsequenz; nach Antwort Unterlagen-Hinweis (Q-158) |
| Kita Bedarfsplanung CSV Aggregate freigabeunabhängig | `/kita/bedarfsplanung` | ✓ Status/Meldebasis-Metakopf, Planungsraum-/Meldebasis-Blatt; Export-Karte Druck+CSV; DEC-004 (Q-159, US-KJ-007) |
| Kita Vorlage CSV Aggregate freigabeunabhängig | `/kita/vorlage` | ✓ Status/Meldebasis/Engpass-Filter-Metakopf, Blätter Versorgung/Räume/Engpass/Meldebasis; Export-Karte Druck+CSV; DEC-004 (Q-160, US-KJ-008) |
| AV Übersicht Upload-Quittung | `/fall` + `DemoStateContext.sessionUploadedIds` | ✓ Session-Upload-Quittung + nächste offene Unterlage inkl. Frist-Countdown (Q-161, US-AV-002/003) |
| UG Fairness CTA-Hilfstexte zentral | `demo/lib/fairness/gruendung-rules.ts` | ✓ Gemeinsame session-sensitive Helper für Übersicht + Hinweise (Q-162) |
| Kita Lagebild CSV Aggregate freigabeunabhängig | `KitaLagebildDruck` + `/kita/lagebild` | ✓ Status/Meldebasis/Meldelücke-Filter-Metakopf, Blätter Versorgung/Engpass/Handlungsfelder/Maßnahmen/Meldebasis; DEC-004 (Q-163, US-KJ-005) |
| AV Dokumente lokale Upload-Quittung | `/fall/dokumente` + `sessionUploadedIds` | ✓ Quittung pro Dokumentenkarte nach Session-Markierung; E2E Teil-/Voll-Upload (Q-164, US-AV-003) |
| UG Fairness CTA-Ziel-Routing zentral | `gruendung-rules.fairnessSignalZiel` | ✓ href/Label/Hilfstext/testKey/ariaLabel für Übersicht + Hinweise (Q-165) |
| Kita Transparenzbericht CSV Multi-Blatt | `KitaCsvDownload` + `/kita` | ✓ Status/Meldebasis-Metakopf, Blätter Versorgung/Räume/Maßnahmen/Meldebasis; DEC-004 (Q-166, US-KJ-009) |
| AV Hinweise UNTERLAGE live | `/fall/hinweise` | ✓ Session-Upload spiegelt UNTERLAGE-Signal, Fristhinweis + CTA Unterlagen; E2E Teil-/Voll-Upload (Q-167, US-AV-008/003) |
| UG Dokumente lokale Upload-Quittung | `/gruendung/dokumente` + `sessionUploadedIds` | ✓ Quittung pro Dokumentenkarte nach Session-Markierung; E2E Tab-Nav (Q-168, US-UG-003) |
| Kita Lagebild CSV Zeitreihe-Blatt | `KitaLagebildDruck` + `/kita/lagebild` | ✓ Blatt 6 Zeitreihe Gesamt+Planungsräume, Meldebasis Session-sensitiv (Q-169, US-KJ-005) |
| Kita Transparenzbericht Druck-Meta | `KitaCsvDownload` + `/kita` | ✓ print-only Status/Meldebasis; Export-Karte Druck+CSV; Filterstand print-only (Q-170, US-KJ-009) |

---

## Design System

| Komponente | Pfad | Status |
|------------|------|--------|
| CSS-Tokens (4 Themes, 2 Density Modes) | `demo/app/globals.css` | ✓ Vollständig |
| Theme-Registry (Typen, Konstanten) | `demo/design-system/themes/themes.ts` | ✓ |
| ThemeProvider (React Context, localStorage) | `demo/design-system/provider/ThemeProvider.tsx` | ✓ |
| ThemeSwitcher (Footer-UI) | `demo/components/ThemeSwitcher.tsx` | ✓ |
| Anti-Flash-Script | `demo/app/layout.tsx` | ✓ |
| Design System Dokumentation | `demo/design-system/README.md` u. a. | ✓ |

### Verfügbare Themes

| ID | Label | Basis-Schriftgröße | Empfohlene Density |
|----|-------|-------------------|-------------------|
| `civic-neutral` | Civic Neutral (Standard) | 16px | normal |
| `citizen-warm` | Citizen Warm | 16px | normal |
| `office-dense` | Office Dense | 14px | compact |
| `accessible-contrast` | Barrierearm | 17px | accessible |

---

## Story-System

| Domäne | Stories in docs/ | Stories in storyRegistry.ts | Status |
|--------|-----------------|----------------------------|--------|
| Arbeitsverwaltung (AV) | US-AV-001 – 008 | ✓ 8 registriert | DEMONSTRIERBAR (Demo) |
| Kita / Jugendamt (KJ) | US-KJ-001 – 010 | ✓ registriert | gemischt (teilweise Demo) |
| Unternehmensgründung (UG) | US-UG-001 – 006 + STORY_MAP + README | ✓ 6 registriert | DEMONSTRIERBAR (Demo) |

**Q-001 erledigt:** Story-Datei `US-AV-008_Verfahrenslage_verstehen.md` angelegt.

**Q-010 erledigt:** `docs/stories/unternehmensgruendung/` mit 6 Stories, Story-Map, README.
**Q-070 erledigt:** UG-Stories in `demo/data/storyRegistry.ts`.
**Q-071 erledigt:** Interaktiver Dokument-Upload im AV-Demo (`uploadDokument`); Fairness-Signal entfällt live.
**Q-072 erledigt:** `/fall/bescheide`, `/termine`, `/verlauf` nutzen DemoState; Interaktionen erzeugen Timeline-Ereignisse.
**Q-073 erledigt:** UG `uploadDokument`, Signal `UG_UNTERLAGE_FEHLT`, Verlauf bei Upload/Rückfrage.
**Q-074 erledigt:** `KitaPlanungsraumExplorer` — Filter-Chips, Detailkarte, gefilterte Maßnahmen auf `/kita`.
**Q-075 erledigt:** `resetSession` + Session-Leiste in AV- und UG-Layout nach Demo-Interaktionen.
**Q-076 erledigt:** `/kita/bedarfsplanung` — Planungslücke je Raum, Versionierung, Kommentar/Freigabe-Demo (US-KJ-007).
**Q-077 erledigt:** `/kita/vorlage` — Gremienvorlage aus Lagebild, JA-Freigabe-Stempel, Druck/PDF (US-KJ-008).
**Q-078 erledigt:** `/kita/einrichtung` — Belegung je Gruppe, Einschränkungen, CSV, keine Kinddaten (US-KJ-002).
**Q-079 erledigt:** `/kita/monatsbericht` — Monatsbericht Aggregate + Export (US-KJ-003).
**Q-080 erledigt:** `/kita/meldung` — Monatsmeldung freigeben mit Korrekturprotokoll (US-KJ-004).
**Q-081 erledigt:** AV Tab-Badges für offene Fragen/Unterlagen in Fall-Navigation (US-AV-001/003/004).
**Q-082 erledigt:** UG Verlauf-Filter nach handelnder Stelle (US-UG-006).
**Q-083 erledigt:** `/kita/tagesstand` — aggregierte Tagesstand-Erfassung + Leitungsfreigabe (US-KJ-001); Monatsbericht zeigt freigegebene Tagesstände als Datenbasis.
**Q-084 erledigt:** UG Behörden-Karte CTA zur offenen Rückfrage (Anker auf `/gruendung/rueckfragen`).
**Q-085 erledigt:** AV Rückfrage-Antwort mit Bestätigungsdialog und Antwortquittung (US-AV-004).
**Q-086 erledigt:** AV Fristen-Countdown offener Unterlagen auf Übersicht und Dokumente (`fristDatum` + `berechneFristTage`).
**Q-087 erledigt:** UG Tab „Hinweise“ in Navigation; Übersicht-Behördenzeile mit Link zur offenen Rückfrage.
**Q-088 erledigt:** Kita Lagebild Meldeeingang freigegebener Monatsmeldungen inkl. Session-Link von Meldungsfreigabe.
**Q-089 erledigt:** AV Tab-Badge „Termine“ nur bei unbestätigt / bald fällig (`terminHatHandlungsbedarf`).
**Q-090 erledigt:** UG Übersicht Fairness-Kurzblock mit Link zu `/gruendung/hinweise`.
**Q-091 erledigt:** Kita Planungsraum-Karten Meldebeitrag; Südost/Sonnenwinkel nach Freigabe hervorgehoben.
**Q-093 erledigt:** UG Hinweise CTA „Frage beantworten“ aus RELEVANT-Rückfrage-Signal (`#rq-…`).
**Q-095 erledigt:** AV Verlauf Antworttext ungekürzt als Quittungsblock (`timeline-antwort-block`).
**Q-096 erledigt:** UG Hinweise CTA „Zur Behördenkarte“ für BG-Anmeldung (`#beh-…`).
**Q-097 erledigt:** Kita Monatsbericht Vorschau Nov 2024 mit gemischten Tagesstand-Quellen.
**Q-094 erledigt:** Kita Bedarfsplanung Meldebasis/Datenlücke Südost aus Meldeeingang (Session-Freigabe schließt Lücke).
**Q-098 erledigt:** UG Hinweise CTA „Zu den Unterlagen“ aus HINWEIS-Unterlagen-Signal (`#dok-…`).
**Q-099 erledigt:** Kita Lagebild Meldeeingang mit Monatsbericht-Vorschau gekoppelt (methodische Trennung).
**Q-092 erledigt:** AV Termin-Bestätigung session-lokal (`confirmTermin`); Tab-Badge entfällt live.
**Q-100 erledigt:** UG Hinweise CTA Steuernummer → Finanzamt-Behördenkarte.
**Q-101 erledigt:** UG Verlauf-Filter nach Ereignistyp (Vorgang/Dokumente/Rückfragen/Bescheide), kombiniert mit Stellen-Filter.
**Q-102 erledigt:** Kita Monatsbericht-Vorschau Rücklink zum Lagebild (`#kita-monatsbericht-vorschau`).
**Q-103 erledigt:** Kita Bedarfsplanung Residual ↔ Meldelücke Hinweis-only (Südost).
**Q-108 erledigt:** Kita Lagebild/Planungsraum Residual↔Meldelücke-Hinweis spiegeln.
**Q-109 erledigt:** Kita Vorlage Meldebasis-Kurzhinweis + Residual↔Meldelücke (Hinweis-only, Fokus Südost; Session-Freigabe).
**Q-110 erledigt:** Kita Planungsraum-Explorer Schnellfilter Engpass und Meldelücke (Zähler, Raum-Chips, Tabelle/Maßnahmen, Leerzustand).
**Q-111 erledigt:** UG Hinweise CTA Betriebsdatum → Verfahrensstatus (`#verfahrensstatus` auf Übersicht).
**Q-112 erledigt:** Kita Lagebild Engpass-Rangliste Meldebasis-Kurzmarkierung (`KitaEngpassRangliste`, Session-sensitiv, Hinweis-only).
**Q-113 erledigt:** UG Hinweise CTA parallele Behörden → Behörden-Übersicht (`/gruendung/behoerden`).
**Q-114 erledigt:** Kita Vorlage Engpass-Liste Schnellfilter Meldelücke (Session-sensitiv, analog Explorer).
**Q-115 erledigt:** Kita Zeitreihe Meldebasis-Datenlücken (`KitaZeitreiheTabelle`, Session-sensitiv, Hinweis-only, keine Interpolation).
**Q-116 erledigt:** UG Übersicht Fairness-Signale RELEVANT/HINWEIS mit Kurz-CTAs zu RQ/Unterlagen/BG (Session-sensitiv).
**Q-117 erledigt:** Kita Zeitreihe Regionenfilter Planungsraum (`KitaZeitreiheTabelle`, US-KJ-010 AK2, Session-sensitiv).
**Q-118 erledigt:** Kita Regionenvergleich zwei Planungsräume (`KitaRegionenVergleich`, US-KJ-010 AK3, Session-sensitiv).
**Q-120 erledigt:** UG Behörden-Verfahrensschritt VS-04 mit Link zur offenen Rückfrage (`#rq-…`, Session-sensitiv).
**Q-119 erledigt:** Kita Zeitreihe + Regionenvergleich CSV-Export der gefilterten Ansicht (US-KJ-010 AK4).
**Q-121 erledigt:** UG VS-04 nach Rückfrage-Antwort session-lokal ABGESCHLOSSEN inkl. Verlaufsereignis.
**Q-122 erledigt:** UG nach RQ-Antwort nächster AUSSTEHEND-Schritt derselben Behörde → IN_BEARBEITUNG (VS-05) + Verlauf.
**Q-123 erledigt:** Kita Open-Data-Lizenzhinweis in öffentlichen CSV-Exporten (Meta + UI, `kitaCsvLizenz`, US-KJ-010).
**Q-124 erledigt:** UG Steuernummer-Signal auch bei VS-05 IN_BEARBEITUNG (Text/CTA session-sensitiv).
**Q-125 erledigt:** Kita Lagebild Engpass-Rangliste Meldelücke-Schnellfilter.
**Q-126 erledigt:** Kita Lagebild Handlungsfelder Meldelücke-Schnellfilter.
**Q-104 erledigt:** AV Übersicht Termin-Kachel Status „Bestätigt“ live nach Session-Aktion.
**Q-127 erledigt:** UG Übersicht Fairness-Kurz-CTAs Steuernummer (Finanzamt) und Betriebsdatum (Verfahrensstatus).
**Q-128 erledigt:** Kita Lagebild Planungsraum-Detail Meldelücke-Schnellfilter (`KitaPlanungsraumDetailListe`).
**Q-105 erledigt:** AV Verlauf Upload-Ereignisse mit Dokumentbezeichnung (`timeline-upload-block`).
**Q-129 erledigt:** UG Betriebsdatum-Signal-Text session-sensitiv nach RQ-Antwort.
**Q-130 erledigt:** Kita Lagebild Druckansicht mit Meldelücke-Filter-Hinweisen.
**Q-131 erledigt:** Kita Monatsbericht ↔ Einrichtung Prozesskette.
**Q-132 erledigt:** UG Übersicht Steuernummer-CTA-Text bei VS-05 IN_BEARBEITUNG.
**Q-133 erledigt:** Kita Tagesstand Prozesskette Hub-Karten (US-KJ-001).
**Q-134 erledigt:** UG Hinweise Steuernummer-CTA-Label bei VS-05 IN_BEARBEITUNG.
**Q-135 erledigt:** Kita Meldung Prozesskette Hub-Karten (US-KJ-004).
**Q-136 erledigt:** Kita Vorlage Druck freigabeunabhängig + Meldelücke-Filter im Ausdruck (US-KJ-008).
**Q-137 erledigt:** Kita Bedarfsplanung Steuerungskette Hub-Karten (US-KJ-007).
**Q-138 erledigt:** UG Übersicht Betriebsdatum-Fairness-CTA Hilfstext nach RQ-Antwort.
**Q-139 erledigt:** UG Hinweise Betriebsdatum-CTA Hilfstext session-sensitiv nach RQ (Spiegel Übersicht).
**Q-140 erledigt:** Kita Bedarfsplanung Druck freigabeunabhängig + Meldebasis-Session-Hinweis (US-KJ-007).
**Q-141 erledigt:** UG Übersicht Steuernummer-Fairness-CTA Hilfstext session-sensitiv nach RQ.
**Q-142 erledigt:** Kita Lagebild/Vorlage Steuerungskette-Hub (Bedarfsplanung↔Lagebild↔Vorlage/Meldung).
**Q-143 erledigt:** UG Hinweise Steuernummer-CTA Hilfstext priorisiert offene RQ (Spiegel Übersicht).
**Q-144 erledigt:** Kita Monatsbericht Druck Status + Tagesstand-Datenbasis (US-KJ-003).
**Q-145 erledigt:** Kita öffentlicher Bericht Hub-Karten JA-Steuerungskette (US-KJ-009).
**Q-146 erledigt:** UG parallele Behörden Signal + Hinweise-CTA session-sensitiv nach RQ.
**Q-147 erledigt:** AV UNTERLAGE_FEHLT mit berechneter Dokumenten-Frist (Resttage, RELEVANT ≤3).
**Q-148 erledigt:** UG BG-CTA-Hilfstext session-sensitiv (Übersicht + Hinweise, offene RQ priorisiert).
**Q-149 erledigt:** Kita Meldung Druck freigabeunabhängig Status/Korrekturen/Freigabenachweis (US-KJ-004).
**Q-150 erledigt:** Kita Tagesstand Druck freigabeunabhängig Status/Datenbasis/Freigabenachweis (US-KJ-001).
**Q-151 erledigt:** UG Unterlagen-CTA-Hilfstext session-sensitiv (Übersicht + Hinweise, offene RQ priorisiert).
**Q-152 erledigt:** Kita Einrichtung Belegungsstand-Druck Status und Datenbasis (US-KJ-002).
**Q-153 erledigt:** Kita Tagesstand CSV Aggregate-Export freigabeunabhängig (US-KJ-001, DEC-004).
**Q-154 erledigt:** UG RQ-CTA-Hilfstext mit Frist und Konsequenz (Übersicht + Hinweise).
**Q-155 erledigt:** Kita Monatsbericht CSV Vorschau-Modus-Metadaten (US-KJ-003).
**Q-156 erledigt:** Kita Meldung CSV Aggregate freigabeunabhängig (US-KJ-004, DEC-004).
**Q-157 erledigt:** Kita Einrichtung CSV Status/Datenbasis-Metakopf (US-KJ-002, DEC-004).
**Q-158 erledigt:** UG Primär-CTA Nächster Schritt mit RQ-Frist-/Konsequenz-Hilfstext (Übersicht).
**Q-159 erledigt:** Kita Bedarfsplanung CSV Aggregate freigabeunabhängig (US-KJ-007, DEC-004).
**Q-160 erledigt:** Kita Vorlage CSV Aggregate Status/Meldebasis freigabeunabhängig (US-KJ-008, DEC-004).
**Q-161 erledigt:** AV Übersicht Upload-Quittung + nächste offene Unterlage nach Session-Upload (US-AV-002/003).
**Q-162 erledigt:** UG Fairness-CTA-Hilfstexte in `gruendung-rules` zentralisiert (Übersicht + Hinweise).
**Q-163 erledigt:** Kita Lagebild CSV Aggregate Status/Meldebasis/Meldelücke freigabeunabhängig (US-KJ-005, DEC-004).
**Q-164 erledigt:** AV Dokumente lokale Upload-Quittung pro Dokumentenkarte nach Session-Markierung (US-AV-003).
**Q-165 erledigt:** UG Fairness CTA-Ziel-Routing (`fairnessSignalZiel`) in `gruendung-rules` zentralisiert.
**Q-166 erledigt:** Kita Transparenzbericht CSV Multi-Blatt Status/Meldebasis freigabeunabhängig (US-KJ-009, DEC-004).
**Q-167 erledigt:** AV Hinweise UNTERLAGE-Signal live nach Session-Upload inkl. Fristhinweis + CTA (US-AV-008/003).
**Q-168 erledigt:** UG Dokumente lokale Upload-Quittung pro Dokumentenkarte nach Session-Markierung (US-UG-003).
**Q-169 erledigt:** Kita Lagebild CSV Steuerungs-Export Blatt Zeitreihe Gesamt+Planungsräume (US-KJ-005).
**Q-170 erledigt:** Kita Transparenzbericht Druck-Meta Status/Meldebasis print-only + Export-Karte Druck+CSV (US-KJ-009).

---

## Dokumentation

### Domänen

| Domäne | Pfad | Umfang | Status |
|--------|------|--------|--------|
| Arbeitsverwaltung | `docs/domains/arbeitsverwaltung/` | 9 Dok + Story-System | ✓ Vollständig |
| Unternehmensgründung | `docs/domains/unternehmensgruendung/` | 6 Dok + 6 Stories (US-UG-001–006) | Demo-Routen unter `/gruendung` vorhanden |
| Kita-Betrieb & JA-Steuerung | `docs/domains/kita_betrieb_und_jugendamt_steuerung/` | 7 Dok + 10 Stories | Demo-Routen `/kita`, `/kita/lagebild` vorhanden |

### Querschnittsdokumentation

| Dok | Pfad | Status |
|-----|------|--------|
| Verfahrensfairness Engine | `docs/engines/verfahrensfairness/` | ✓ 6 Dokumente |
| arc42 (12 Kapitel) | `architecture/arc42/` | ✓ vollständig |
| Systemarchitektur | `architecture/05_Systemarchitektur.md` | ✓ |
| Master-Blueprint | `docs/01_Master_Blueprint.md` | ✓ |

### Agenten-Betriebssystem

| Datei | Status |
|-------|--------|
| `AGENTS.md` | ✓ |
| `docs/DELIVERY_SYSTEM.md` | ✓ |
| `docs/NEXT_STEPS_QUEUE.md` | ✓ |
| `docs/BUILD_STATE.md` | ✓ (diese Datei) |
| `docs/DECISION_LOG.md` | ✓ |

---

## Bekannte Lücken (hebelorientiert)

| Lücke | Demo-Auswirkung | Queue-ID |
|-------|----------------|----------|
| ~~Fairness-Fristen sind statische Zahlen~~ | ~~Glaubwürdigkeitsproblem~~ | Q-004 ✓ |
| ~~Demo vollständig statisch~~ | ~~Demo wirkt wie Slideshow~~ | Q-031 ✓ |
| ~~Dokument-Upload ohne State~~ | ~~Upload-Alert nur, kein Fairness-Effekt~~ | Q-071 ✓ |
| ~~AV-Unterseiten mit statischem mockFall~~ | ~~Fairness/Verlauf nicht session-konsistent~~ | Q-072 ✓ |
| ~~UG-Upload ohne State~~ | ~~Kein Fairness-/Verlaufseffekt bei UG-Unterlagen~~ | Q-073 ✓ |
| ~~Kita-Bericht ohne interaktiven Raumfilter~~ | ~~Gesamttabelle nur, keine Raum-Fokussierung~~ | Q-074 ✓ |
| ~~Kein Session-Reset nach Demo-Aktionen~~ | ~~Ausgangsfall nur per Reload wiederherstellbar~~ | Q-075 ✓ |
| ~~US-KJ-007 ohne Demo-Screen~~ | ~~Bedarfsplanung nur als Story dokumentiert~~ | Q-076 ✓ |
| ~~US-KJ-008 ohne Demo-Screen~~ | ~~Gremienvorlage nur als Story dokumentiert~~ | Q-077 ✓ |
| ~~US-KJ-002 ohne Demo-Screen~~ | ~~Belegung nur als Story dokumentiert~~ | Q-078 ✓ |
| ~~US-KJ-003 ohne Demo-Screen~~ | ~~Monatsbericht nur als Story dokumentiert~~ | Q-079 ✓ |
| ~~US-KJ-004 ohne Demo-Screen~~ | ~~Meldefreigabe nur als Story dokumentiert~~ | Q-080 ✓ |
| ~~US-KJ-001 Tagesstand-Erfassung fehlt~~ | ~~Betriebsdateneingabe nur konzeptionell~~ | Q-083 ✓ |
| ~~AV Dokument-Fristen ohne Countdown~~ | ~~Frist nur als Datumstext~~ | Q-086 ✓ |
| ~~UG Hinweise nicht in Navigation~~ | ~~Fairness-Seite schwer erreichbar~~ | Q-087 ✓ |
| ~~Lagebild ohne Meldeeingang~~ | ~~Datenlücken der Monatsmeldung unsichtbar~~ | Q-088 ✓ |
| ~~Termine-Badge immer sichtbar~~ | ~~Kein Handlungsfokus in Navigation~~ | Q-089 ✓ |
| ~~UG-Übersicht ohne Fairness-Kurzblock~~ | ~~Verfahrenslage nur über Hinweise-Tab~~ | Q-090 ✓ |
| ~~Planungsraum ohne Meldebeitrag-Hervorhebung~~ | ~~Freigabe-Effekt im Lagebild unsichtbar~~ | Q-091 ✓ |
| ~~Bedarfsplanung ohne Meldebasis-Lücke~~ | ~~Südost-Datenlücke nicht aus Meldeeingang abgeleitet~~ | Q-094 ✓ |
| ~~UG Hinweise ohne Unterlagen-CTA~~ | ~~Fehlende Unterlagen nur Text, kein Sprung zu Dokumenten~~ | Q-098 ✓ |
| ~~Meldeeingang ohne Vorschau-Kopplung~~ | ~~Laufender Monat und Abschlussmeldung getrennt unklar~~ | Q-099 ✓ |
| ~~Termin-Bestätigung nur statisch~~ | ~~Badge entfällt nicht nach Demo-Aktion~~ | Q-092 ✓ |
| ~~UG Verlauf ohne Ereignistyp-Filter~~ | ~~Nur Stelle filterbar~~ | Q-101 ✓ |
| ~~Monatsbericht-Vorschau ohne Rücklink~~ | ~~Lagebild-Kontext einseitig~~ | Q-102 ✓ |
| DSFA für Kita-Domäne noch ausstehend | Konzeptlücke — extern abhängig | — |

---

## Nicht implementiert (nur konzeptionell)

- Backend / API (kein Server, kein API-Endpunkt)
- Authentifizierung (kein eID, kein FIDO2)
- Datenbankanbindung
- Echte Behördenschnittstellen (ALLEGRO, XMeld, ELSTER etc.)
- Chart-/Visualisierungsbibliothek (Zeitreihe aktuell als HTML-Tabelle)
- Persistenter Backend-State / echte Uploads
