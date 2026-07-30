# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Q-221 UG Übersicht Fairness UNTERLAGE-Countdown-Chip (US-UG-003)

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
| Letzte Build-Prüfung | lint+build **27 Seiten** + `test:e2e:ci` **270 passed** (Supervisor Merge Q-188–Q-190) |

---

## Demo-Routen

| Route | Inhalt | Story-IDs | Status |
|-------|--------|-----------|--------|
| `/` | Landing Page | – | ✓ |
| `/fall` | Fallübersicht, Status, Fairness-Summary inkl. BESCHEID-CTAs Zum Bescheid/Verlauf + Widerspruch-Countdown-Chip, Fristen-Countdown offener Unterlagen, Widerspruchsfrist-Kurzblock + Bescheid-Kachel Countdown, Upload-/Termin-/RQ-Quittungen mit Verlauf-Tiefenlinks, Termin-Kachel Status live | US-AV-001–007 | ✓ |
| `/fall/dokumente` | Dokumentenanforderungen + Frist-Resttage + lokale Upload-Quittung pro Karte nach Session-Markierung + Verlauf-Tiefenlink `#ere-E-DEMO-DOK-…` | US-AV-003, US-AV-007 | ✓ |
| `/fall/rueckfragen` | Rückfragen mit Fairness-Hinweis; Anker `#rq-…`; Frist-Countdown-Chip pro offener Karte; Antwort-Quittung + Verlauf-Tiefenlink Session-Antwort | US-AV-004 | ✓ |
| `/fall/termine` | Termine; session-lokale Bestätigung mit Quittung + Verlauf-Tiefenlink `#ere-E-DEMO-TERM-…`; Nav-Badge nur unbestätigt/bald fällig | US-AV-005, US-AV-007 | ✓ |
| `/fall/bescheide` | Bescheide mit Fairness-Hinweisen + CTAs „Zum Bescheid“ `#bes-…` + „Im Verlauf ansehen“ `#ere-E-007` + Widerspruch-Countdown-Chip am Fairness-Panel; Widerspruchsfrist-Countdown ggü. FIKTIVES_HEUTE; Karten-Anker + Zustellungs-Tiefenlink | US-AV-006, US-AV-007 | ✓ |
| `/fall/verlauf` | Timeline mit Fairness-Hinweis; Antwort-Quittungsblock; Upload-Blöcke mit Dokumentbezeichnung; Anker `#ere-…` + Hash-Hervorhebung; Session-Antwort/Upload-Badge | US-AV-007 | ✓ |
| `/fall/hinweise` | Vollständige Fairness-Hinweisseite; UNTERLAGE- und RQ-Signal live inkl. Fristhinweis + CTA + RQ/UNTERLAGE-Countdown-Chips + `#rq-…`/`#dok-…`; BESCHEID-CTAs Zum Bescheid + Verlauf `#ere-E-007` + Widerspruchsfrist-Countdown-Chip; Verlauf-Sekundärlink; Session-Antwort entfallen Signale | US-AV-006, US-AV-008 | ✓ |
| `/stories` | Story Coverage Dashboard | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |
| `/gruendung` … | Unternehmensgründung (Übersicht Fairness-Kurzblock+Kurz-CTAs inkl. Steuernummer/Betriebsdatum/BG-Hilfstext session-sensitiv; Upload-Quittung mit Verlauf-Tiefenlink pro Session-Upload + RQ-Antwort-Quittung mit Verlauf-Tiefenlink + nächste offene Unterlage; Primär-/Aufgaben-CTA und Fairness-Ziel-Routing zentral in `gruendung-rules` (`naechsterSchrittZiel`, `aufgabeZiel`, `fairnessSignalZiel`); BG-Demo-Markierung session-lokal + Fallthrough Steuernummer; Fairness-Tiefenlink Verlauf; RQ-Quittung Tiefenlink + Session-Antwort-Badge im Verlauf; Dokumente lokale Upload-Quittung pro Karte + Verlauf-Tiefenlink Session-Upload-Badge; Behörden VS-04→Rückfrage + BG Demo-Aktion; Hinweise UNTERLAGE live + CTAs RQ/BG/Unterlagen/Steuernummer/Betriebsdatum/parallele Behörden + Verlauf-Sekundärlink; Verlauf Stelle+Ereignistyp-Filter + Anker `#ere-…`, …) | US-UG-001–006 | ✓ |
| `/kita` | Öffentlicher Transparenzbericht + Planungsraum-Filter + Residual↔Meldelücke + Engpass/Meldelücke-Schnellfilter + Zeitreihe Meldebasis + Regionenfilter + Regionenvergleich Zwei-Räume inkl. 12-Monats-Verlauf A/B + Explorer print-only Filterstand/Meldebasis + Regionenvergleich print-only A/B/Kennzahl/Meldebasis + CSV Multi-Blatt Status/Meldebasis + Druck-Meta Status/Meldebasis print-only + Open-Data-Lizenz + Hub-Karten JA-Steuerungskette (Lagebild/Bedarfsplanung/Vorlage) | US-KJ-009, US-KJ-010 | ✓ |
| `/kita/lagebild` | Jugendamt-Steuerungsansicht + Meldeeingang Druck-Meta Status/Datenbasis/Session + Meldeeingang CSV Aggregate Status/Lücken/Session + Monatsbericht-Vorschau CSV + Meldebeitrag + Engpass/Handlungsfelder/Planungsraum-Detail Meldelücke-Schnellfilter + print-only Filterstand/Meldebasis-Session + Regionenvergleich Zwei-Räume UI + Druck Meldelücke + CSV Aggregate Status/Meldebasis/Meldelücke + 12-Monats-Zeitreihe UI + Zeitreihe-Blatt freigabeunabhängig + Zeitreihe print-only Filterstand/Meldebasis + CSV Regionenvergleich Stichtag-Paare (Blatt 7) + Verlauf-Paare 12 Monate (Blatt 8) + Monatsbericht-Vorschau print-only Meta + Steuerungskette Hub-Karten | US-KJ-005, US-KJ-006, US-KJ-010 | ✓ |
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
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln, berechnete Fristtagezahl (ISO-Datum + FIKTIVES_HEUTE); UNTERLAGE_FEHLT mit Resttagen / RELEVANT ≤3 Tage (Q-147); `fairnessSignalVerlaufZiel` Tiefenlink Verlauf (Q-191) |
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
| AV Termin-Quittung Verlauf | `/fall/termine` + `demoTerminBestaetigungEreignisId` + Verlauf | ✓ Quittung + „Im Verlauf ansehen“ → `#ere-E-DEMO-TERM-…`; Badge „Ihre Bestätigung“ (Q-196, US-AV-005/007) |
| AV Übersicht Termin-Quittung | `/fall` + `sessionConfirmedTerminIds` | ✓ Session-Bestätigung Quittung + Verlauf-Tiefenlink + CTA Termine (Q-197, US-AV-005/007) |
| AV Übersicht RQ-Quittung | `/fall` + `sessionAnsweredRqIds` | ✓ Session-Antwort Quittung + Verlauf-Tiefenlink + CTA Fragen/Unterlagen (Q-198, US-AV-004/007) |
| UG Übersicht RQ-Quittung | `/gruendung` + `sessionAnsweredRqIds` | ✓ Session-Antwort Quittung + Verlauf-Tiefenlink + CTA Fragen/Unterlagen (Q-199, US-UG-004/005, Parität AV Q-198) |
| UG Verlauf Typ-Filter | `/gruendung/verlauf` | ✓ Stelle + Ereignistyp (Vorgang/Dokumente/Rückfragen/Bescheide), UND-Kombination |
| UG Hinweise Steuernummer-CTA | `/gruendung/hinweise` | ✓ CTA „Zum Finanzamt“ → `#beh-BEH-02` bei VS-05 AUSSTEHEND oder IN_BEARBEITUNG; Signal-Text session-sensitiv (Q-124) |
| UG Hinweise Betriebsdatum-CTA | `/gruendung/hinweise` + Übersicht `#verfahrensstatus` | ✓ CTA „Zum Verfahrensstatus“ aus HINWEIS-Betriebsdatum |
| UG Hinweise parallele-Behörden-CTA | `/gruendung/hinweise` → `/gruendung/behoerden` | ✓ CTA „Zu den Behörden“ aus INFO parallele Behörden (Q-113) |
| Kita Vorlage Engpass Meldelücke-Filter | `/kita/vorlage` Engpass-Liste | ✓ Schnellfilter Top-3 vs. Meldelücke, Session-sensitiv (Q-114) |
| Kita Zeitreihe Meldebasis | `demo/components/kita/KitaZeitreiheTabelle.tsx` | ✓ Berichtsmonat an Meldeeingang-Stichprobe; Spalte Meldebasis, Badge/Rahmen bei Lücke, keine Interpolation (Q-115) |
| Kita Zeitreihe Regionenfilter | `demo/components/kita/KitaZeitreiheTabelle.tsx` | ✓ Chips Gesamtkommune + 5 Planungsräume; raumbezogene Reihen/Meldebasis, Session-sensitiv (Q-117, US-KJ-010 AK2) |
| Kita Regionenvergleich | `demo/components/kita/KitaRegionenVergleich.tsx` | ✓ Zwei Planungsräume A/B, Kernkennzahlen + Δ, Meldebasis-Badge; print-only Filterstand A/B/Kennzahl/Meldebasis, Auswahl/CSV no-print (Q-118/Q-174, US-KJ-010 AK3) |
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
| UG Übersicht Upload-Quittung | `/gruendung` + `sessionUploadedIds` | ✓ Session-Upload-Quittung + nächste offene Unterlage inkl. Frist/CTA oder Vollständigkeit; E2E Tab-Nav (Q-171, US-UG-001/003) |
| UG Übersicht Upload-Quittung Verlauf | `/gruendung` + `demoDokUploadEreignisId` | ✓ Pro Session-Upload „Im Verlauf ansehen“ → `#ere-UG-DEMO-DOK-…` (Q-195, US-UG-001/003/005, Parität AV Q-194) |
| Kita Lagebild Zeitreihe-UI | `KitaZeitreiheTabelle` + `/kita/lagebild` | ✓ 12-Monats-Tabelle im Steuerungslagebild (Filter, Meldebasis, CSV), Anker `#kita-lagebild-zeitreihe` (Q-172, US-KJ-005/010) |
| Kita Zeitreihe print-only Meta | `KitaZeitreiheTabelle` | ✓ Filter/CSV no-print; print-only Region/Peak/Meldebasis-Session (Q-173, US-KJ-005/009/010) |
| Kita Regionenvergleich print-only | `KitaRegionenVergleich` + `/kita` | ✓ print-only Region A/B, Meldebasis je Raum, Verlaufskennzahl, Stichprobenmonat; Auswahl/Chips/CSV no-print (Q-174, US-KJ-010/009) |
| UG Hinweise UNTERLAGE live | `/gruendung/hinweise` + `gruendung-rules` | ✓ Session-Upload spiegelt UNTERLAGE-Signal inkl. Frist + CTA; Dokumente-Live-Signal (Q-175, US-UG-003) |
| Kita Explorer print-only Meta | `KitaPlanungsraumExplorer` + `/kita` | ✓ print-only Filterstand immer + Meldebasis-Session; Filter no-print (Q-176, US-KJ-009) |
| Kita Engpass/Handlungsfelder print-only | `KitaEngpassRangliste` + `KitaHandlungsfelder` | ✓ print-only Filterstand immer + Meldebasis-Session (Q-177, US-KJ-005/006) |
| UG Primär-/Aufgaben-CTA-Routing zentral | `gruendung-rules.naechsterSchrittZiel` / `aufgabeZiel` | ✓ Übersicht importiert Exports; Bürger-Reihenfolge RQ→Unterlagen→BG + Fairness-Fallthrough (Q-178, US-UG-001) |
| Kita Detailkarten print-only | `KitaPlanungsraumDetailListe` + `/kita/lagebild` | ✓ print-only Filterstand immer + Meldebasis-Session (Q-179, US-KJ-005/006) |
| AV Hinweise RQ-Signal live | `/fall/hinweise` + `fairness/rules` + `/fall/rueckfragen` | ✓ RQ-Titel mit Resttagen; Session-Antwort entfernt Signal; E2E (Q-180, US-AV-008/004) |
| UG Fairness Verlauf-Tiefenlink | `gruendung-rules.fairnessSignalVerlaufZiel` + Hinweise/Übersicht/Verlauf | ✓ Sekundär-CTA „Im Verlauf ansehen“ → `#ere-…` (Q-181, US-UG-005) |
| Kita Lagebild Regionenvergleich UI | `KitaRegionenVergleich` + `/kita/lagebild` | ✓ Zwei-Räume A/B, Verlauf, Meldebasis, CSV/print im Steuerungslagebild (Q-182, US-KJ-005/010) |
| UG BG-Demo + Fallthrough | `markBgAnmeldungErledigt` + Behörden BEH-04 + Primär-CTA | ✓ Session-BG erledigt; nach RQ+Upload+BG Fallthrough Steuernummer (Q-183, US-UG-001) |
| Kita Meldeeingang Druck-Meta | `KitaMeldeeingangPanel` + Monatsbericht-Vorschau + LagebildDruck | ✓ print-only Status/Datenbasis/Session; Vorschau-Meta; Aktionslinks no-print (Q-184, US-KJ-004/005) |
| UG Session-Antwort Verlauf | `demoRqAntwortEreignisId` + RQ-Quittung + `/gruendung/verlauf` | ✓ Badge „Ihre Antwort“, Tiefenlink `#ere-UG-DEMO-RQ-…`, Hash-Hervorhebung; E2E Tab-Nav (Q-185, US-UG-005) |
| Kita Meldeeingang CSV Aggregate | `KitaMeldeeingangPanel` downloadCsv | ✓ freigabeunabhängig Status/Lücken/Session-Metakopf, 3 Blätter; DEC-004 (Q-186, US-KJ-004/005) |
| Kita Monatsbericht-Vorschau CSV | `KitaMeldeeingangMonatsberichtVorschau` | ✓ freigabeunabhängig Gruppenkennzahlen + Tagesstand-Quellen; Meldeeingang-Kopplung Meta; DEC-004 (Q-187, US-KJ-003/005) |
| UG Dokumente Upload-Quittung Verlauf-Tiefenlink | `/gruendung/dokumente` + `demoDokUploadEreignisId` + Verlauf | ✓ Sekundär-CTA „Im Verlauf ansehen“ → `#ere-UG-DEMO-DOK-…`; Session-Upload-Badge; E2E Tab-Nav (Q-188, US-UG-003/005) |
| Kita Lagebild-CSV Regionenvergleich Stichtag | `KitaLagebildDruck` Blatt 7 | ✓ Paare i&lt;j, Δ, Rang, Meldebasis-Session; freigabeunabhängig (Q-189, US-KJ-005/010) |
| Kita Lagebild-CSV Regionenvergleich Verlauf | `KitaLagebildDruck` Blatt 8 | ✓ Paare × 12 Monate × 4 Kennzahlen, Δ je Monat; freigabeunabhängig (Q-190, US-KJ-005/010) |
| AV Fairness Verlauf-Tiefenlink | `fairness/rules.fairnessSignalVerlaufZiel` + Hinweise/Übersicht/Verlauf | ✓ Sekundär-CTA „Im Verlauf ansehen“ → `#ere-…` (Q-191, US-AV-007/008) |
| AV Bescheide Fairness Verlauf + Anker | `/fall/bescheide` + `fairnessSignalVerlaufZiel` BESCHEID_* | ✓ CTAs Zum Bescheid `#bes-…` + Verlauf E-007; Karten-Zustellungs-Link (Q-200, US-AV-006/007) |
| AV Hinweise BESCHEID-CTAs | `/fall/hinweise` SignalCta BESCHEID_* | ✓ Zum Bescheid `#bes-…` + Verlauf E-007; Begründung zusätzlich Unterlagen (Q-201, US-AV-006/008) |
| AV Übersicht BESCHEID-CTAs | `/fall` Fairness-Block BESCHEID_* | ✓ Zum Bescheid `#bes-…` + Verlauf E-007; Begründung + Unterlagen (Q-202, US-AV-006/007) |
| AV Widerspruchsfrist-Countdown | `/fall/bescheide` + `widerspruchsfristAblaufDatum` + Fairness-Text | ✓ Resttage ggü. FIKTIVES_HEUTE (22 Tage Mock); ISO-Ablauf in Typen (Q-203, US-AV-006 AC3) |
| AV Übersicht Widerspruchsfrist | `/fall` Kurzblock + Kachel `kachel-bescheid` | ✓ Countdown 22 Tage + CTA `#bes-BSC-001` (Q-204, US-AV-006 AC3, Parität Q-086) |
| AV Hinweise Widerspruchsfrist-Chip | `/fall/hinweise` BESCHEID_VORLAEUFIG-CTA | ✓ Resttage-Chip + Hinweistext mit Ablaufdatum (Q-205, US-AV-006/008, Parität Q-203/Q-204) |
| AV Übersicht Fairness Widerspruch-Chip | `/fall` Fairness BESCHEID_VORLAEUFIG | ✓ Countdown-Chip 22 Tage im Fairness-Block (Q-206, US-AV-006/007, Parität Q-205) |
| AV Bescheide Fairness Widerspruch-Chip | `/fall/bescheide` Fairness BESCHEID_VORLAEUFIG | ✓ Countdown-Chip 22 Tage im Fairness-Panel (Q-207, US-AV-006/007, Parität Q-205/Q-206) |
| UG Übersicht Fristen Unterlagen | `/gruendung` dok-fristen + Kachel | ✓ Countdown DOK-03 (8 Tage) ggü. FIKTIVES_HEUTE_GRUENDUNG + CTA `#dok-…` (Q-208, US-UG-001/003, Parität AV Q-086) |
| UG Dokumente Frist-Countdown | `/gruendung/dokumente` pro offener Karte | ✓ Resttage-Chip ggü. FIKTIVES_HEUTE_GRUENDUNG (Q-209, US-UG-003, Parität AV) |
| UG Übersicht Fristen Rückfragen | `/gruendung` rq-fristen + Kachel Fragen | ✓ Countdown RQ-01 (3 Tage) + CTA `#rq-…` (Q-210, US-UG-004, Parität Q-208) |
| UG Rückfragen Frist-Countdown-Chip | `/gruendung/rueckfragen` pro offener Karte | ✓ status-chip Resttage + testids (Q-211, US-UG-004, Parität Q-209) |
| AV Übersicht Fristen Rückfragen | `/fall` rq-fristen + Kachel Fragen + `#rq-…` | ✓ Countdown RQ-001 (2 Tage) + Anker auf Karten (Q-212, US-AV-004, Parität UG Q-210) |
| AV Rückfragen Frist-Countdown-Chip | `/fall/rueckfragen` pro offener Karte | ✓ status-chip Resttage + testids `rq-seite-countdown` (Q-213, US-AV-004, Parität UG Q-211) |
| AV Hinweise RQ-Countdown-Chip | `/fall/hinweise` RQ-CTA | ✓ Countdown-Chip 2 Tage + CTA `#rq-RQ-001` (Q-214, US-AV-004/008, Parität Widerspruch Q-205) |
| AV Übersicht Fairness RQ-Countdown | `/fall` Fairness RUECKFRAGE | ✓ Countdown-Chip 2 Tage + CTA `#rq-RQ-001` (Q-215, US-AV-004/007/008, Parität Q-214/Q-206) |
| AV Hinweise UNTERLAGE-Countdown-Chip | `/fall/hinweise` UNTERLAGE-CTA | ✓ Countdown-Chip 9 Tage + CTA `#dok-DOK-003` (Q-216, US-AV-003/008, Parität RQ Q-214) |
| AV Übersicht Fairness UNTERLAGE-Countdown | `/fall` Fairness UNTERLAGE | ✓ Countdown-Chip 9 Tage + CTA `#dok-DOK-003` (Q-217, US-AV-003/007/008, Parität Q-216/Q-215) |
| UG Hinweise RQ-Countdown-Chip | `/gruendung/hinweise` RQ-CTA | ✓ Countdown-Chip 3 Tage `hinweise-rq-countdown-RQ-01` (Q-218, US-UG-004, Parität AV Q-214) |
| UG Hinweise UNTERLAGE-Countdown-Chip | `/gruendung/hinweise` UNTERLAGE-CTA | ✓ Countdown-Chip 8 Tage `hinweise-unterlagen-countdown` (Q-219, US-UG-003, Parität AV Q-216) |
| UG Übersicht Fairness RQ-Countdown | `/gruendung` Fairness RQ | ✓ Countdown-Chip 3 Tage + CTA `#rq-RQ-01` (Q-220, US-UG-004, Parität Q-218/AV Q-215) |
| UG Übersicht Fairness UNTERLAGE-Countdown | `/gruendung` Fairness UNTERLAGE | ✓ Countdown-Chip 8 Tage + CTA `#dok-DOK-03` (Q-221, US-UG-003, Parität Q-219/AV Q-217) |
| AV Session-Antwort Verlauf | `/fall/rueckfragen` + `/fall/verlauf` | ✓ RQ-Quittung Tiefenlink `#ere-E-DEMO-RQ-…` + Badge „Ihre Antwort“ / Session-Upload-Badge (Q-192, US-AV-007/004) |
| AV Dokumente Upload-Quittung Verlauf | `/fall/dokumente` + `demoDokUploadEreignisId` + Verlauf | ✓ Sekundär-CTA „Im Verlauf ansehen“ → `#ere-E-DEMO-DOK-…`; Session-Upload-Badge (Q-193, US-AV-003/007) |
| AV Übersicht Upload-Quittung Verlauf | `/fall` Upload-Quittung + `#dok-…` auf Dokumentenkarten | ✓ Pro Session-Upload „Im Verlauf ansehen“; nächste Unterlage → `#dok-…` (Q-194, US-AV-001/003/007) |

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
**Q-171 erledigt:** UG Übersicht Upload-Quittung + nächste offene Unterlage nach Session-Upload (US-UG-001/003).
**Q-172 erledigt:** Kita Lagebild 12-Monats-Zeitreihe im UI (US-KJ-005/010).
**Q-173 erledigt:** Kita Zeitreihe print-only Filterstand und Meldebasis-Meta (US-KJ-005/009/010).
**Q-174 erledigt:** Kita Regionenvergleich print-only Filterstand A/B und Kennzahl/Meldebasis (US-KJ-010/009).
**Q-175 erledigt:** UG Hinweise UNTERLAGE-Signal live nach Session-Upload inkl. Fristhinweis + CTA (US-UG-003).
**Q-176 erledigt:** Kita Explorer print-only Filterstand und Meldebasis-Session (US-KJ-009).
**Q-177 erledigt:** Kita Engpass/Handlungsfelder print-only Filterstand und Meldebasis-Session (US-KJ-005/006).
**Q-178 erledigt:** UG `naechsterSchrittZiel` / `aufgabeZiel` in `gruendung-rules` zentralisiert (US-UG-001).
**Q-179 erledigt:** Kita Lagebild Detailkarten print-only Filterstand und Meldebasis-Session (US-KJ-005/006).
**Q-180 erledigt:** AV Hinweise RQ-Signal live mit Fristhinweis + Session-Antwort E2E (US-AV-008/004).
**Q-181 erledigt:** UG Fairness-Tiefenlink zum auslösenden Verlauf-Ereignis (US-UG-005).
**Q-182 erledigt:** Kita Lagebild Regionenvergleich Zwei-Räume UI (US-KJ-005/010).
**Q-183 erledigt:** UG BG-Demo-Markierung session-lokal + Fairness-Fallthrough Steuernummer (US-UG-001).
**Q-184 erledigt:** Kita Meldeeingang Druck-Meta Status/Datenbasis/Session + Monatsbericht-Vorschau-Meta (US-KJ-004/005).
**Q-185 erledigt:** UG Session-Antwort Verlauf-Tiefenlink + Badge (US-UG-005).
**Q-186 erledigt:** Kita Meldeeingang CSV Aggregate Status/Lücken/Session (US-KJ-004/005).
**Q-187 erledigt:** Kita Monatsbericht-Vorschau CSV am Meldeeingang (US-KJ-003/005).
**Q-188 erledigt:** UG Dokumente Upload-Quittung mit Verlauf-Tiefenlink + Session-Upload-Badge (US-UG-003/005).
**Q-189 erledigt:** Kita Lagebild-CSV Regionenvergleich Stichtag-Paare Blatt 7 (US-KJ-005/010).
**Q-190 erledigt:** Kita Lagebild-CSV Regionenvergleich Verlauf-Paare Blatt 8 (US-KJ-005/010).
**Q-191 erledigt:** AV Fairness-Tiefenlink zum auslösenden Verlauf-Ereignis (US-AV-007/008).
**Q-192 erledigt:** AV Verlauf Session-Antwort hervorheben + RQ-Quittung Tiefenlink (US-AV-007/004, Parität UG Q-185).
**Q-193 erledigt:** AV Dokumente Upload-Quittung mit Verlauf-Tiefenlink + Session-Upload-Badge (US-AV-003/007, Parität UG Q-188).
**Q-194 erledigt:** AV Übersicht Upload-Quittung mit Verlauf-Tiefenlink pro Session-Upload + nächste Unterlage Dokument-Anker (US-AV-001/003/007).
**Q-195 erledigt:** UG Übersicht Upload-Quittung mit Verlauf-Tiefenlink pro Session-Upload (US-UG-001/003/005, Parität AV Q-194).
**Q-196 erledigt:** AV Termin-Bestätigung Quittung + Verlauf-Tiefenlink + Session-Badge „Ihre Bestätigung“ (US-AV-005/007).
**Q-197 erledigt:** AV Übersicht Termin-Bestätigung Quittung + Verlauf-Tiefenlink (US-AV-005/007, Parität Upload Q-194).
**Q-198 erledigt:** AV Übersicht RQ-Antwort-Quittung + Verlauf-Tiefenlink (US-AV-004/007, Parität Termin Q-197).
**Q-199 erledigt:** UG Übersicht RQ-Antwort-Quittung + Verlauf-Tiefenlink (US-UG-004/005, Parität AV Q-198).
**Q-200 erledigt:** AV Bescheide Fairness-CTAs mit Verlauf-Tiefenlink + Bescheid-Anker (US-AV-006/007).
**Q-201 erledigt:** AV Hinweise BESCHEID-Signale mit CTA Zum Bescheid + Verlauf-Tiefenlink (US-AV-006/007/008).
**Q-202 erledigt:** AV Übersicht BESCHEID-Fairness-CTAs Zum Bescheid + Verlauf (US-AV-006/007, Parität Q-201).

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
