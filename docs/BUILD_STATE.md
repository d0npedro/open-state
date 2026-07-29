# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Supervisor-Pflicht-Push 2026-07-29 (E2E-Isolation `.next-e2e` via NEXT_DIST_DIR; lint+build+E2E 216 chromium)

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
| Letzte Build-Prüfung | lint+build grün; `test:e2e:ci` 216 passed (chromium, workers=1, distDir `.next-e2e`) |

---

## Demo-Routen

| Route | Inhalt | Story-IDs | Status |
|-------|--------|-----------|--------|
| `/` | Landing Page | – | ✓ |
| `/fall` | Fallübersicht, Status, Fairness-Summary, Fristen-Countdown offener Unterlagen | US-AV-001, US-AV-002 | ✓ |
| `/fall/dokumente` | Dokumentenanforderungen + Frist-Resttage | US-AV-003 | ✓ |
| `/fall/rueckfragen` | Rückfragen mit Fairness-Hinweis | US-AV-004 | ✓ |
| `/fall/termine` | Termine; session-lokale Bestätigung; Nav-Badge nur unbestätigt/bald fällig | US-AV-005 | ✓ |
| `/fall/bescheide` | Bescheide mit Fairness-Hinweisen | US-AV-006 | ✓ |
| `/fall/verlauf` | Timeline mit Fairness-Hinweis; Antwort-Quittungsblock mit vollem Text | US-AV-007 | ✓ |
| `/fall/hinweise` | Vollständige Fairness-Hinweisseite | US-AV-008 | ✓ |
| `/stories` | Story Coverage Dashboard | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |
| `/gruendung` … | Unternehmensgründung (Übersicht Fairness-Kurzblock, Hinweise-CTAs RQ/BG/Unterlagen/Steuernummer/Betriebsdatum/parallele Behörden, Verlauf Stelle+Ereignistyp-Filter, …) | US-UG-001–006 | ✓ |
| `/kita` | Öffentlicher Transparenzbericht + Planungsraum-Filter + Residual↔Meldelücke + Engpass/Meldelücke-Schnellfilter + Zeitreihe Meldebasis-Markierung | US-KJ-009, US-KJ-010 | ✓ |
| `/kita/lagebild` | Jugendamt-Steuerungsansicht + Meldeeingang + Meldebeitrag + Engpass-Rangliste Meldebasis + Monatsbericht-Vorschau-Kopplung | US-KJ-005, US-KJ-006 | ✓ |
| `/kita/bedarfsplanung` | Bedarfsplanungsentwurf (§ 80 SGB VIII) + Meldebasis + Residual↔Meldelücke (Hinweis-only) | US-KJ-007 | ✓ |
| `/kita/vorlage` | Politische Gremienvorlage + Freigabe + Meldebasis/Residual↔Meldelücke + Engpass-Liste Meldelücke-Filter | US-KJ-008 | ✓ |
| `/kita/einrichtung` | Belegungsstand Einrichtung (aggregiert) | US-KJ-002 | ✓ |
| `/kita/tagesstand` | Tagesstand erfassen (Aggregate, Freigabe) | US-KJ-001 | ✓ |
| `/kita/monatsbericht` | Monatsbericht + Vorschau laufender Monat + Rücklink Lagebild-Anker | US-KJ-003 | ✓ |
| `/kita/meldung` | Monatsmeldung prüfen, korrigieren, freigeben | US-KJ-004 | ✓ |

---

## Implementierte Logik

| Modul | Pfad | Status |
|-------|------|--------|
| Mock-Falldaten (ALG I) | `demo/data/mockFall.ts` | ✓ Vollständig |
| Story Registry | `demo/data/storyRegistry.ts` | ✓ AV + KJ + UG registriert |
| Fairness-Typen | `demo/types/fairness.ts` | ✓ |
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln, berechnete Fristtagezahl (ISO-Datum + FIKTIVES_HEUTE); Dokument-Fristen via `fristDatum` |
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
| UG Hinweise Steuernummer-CTA | `/gruendung/hinweise` | ✓ CTA „Zum Finanzamt“ → `#beh-BEH-02` solange VS-05 ausstehend |
| UG Hinweise Betriebsdatum-CTA | `/gruendung/hinweise` + Übersicht `#verfahrensstatus` | ✓ CTA „Zum Verfahrensstatus“ aus HINWEIS-Betriebsdatum |
| UG Hinweise parallele-Behörden-CTA | `/gruendung/hinweise` → `/gruendung/behoerden` | ✓ CTA „Zu den Behörden“ aus INFO parallele Behörden (Q-113) |
| Kita Vorlage Engpass Meldelücke-Filter | `/kita/vorlage` Engpass-Liste | ✓ Schnellfilter Top-3 vs. Meldelücke, Session-sensitiv (Q-114) |
| Kita Zeitreihe Meldebasis | `demo/components/kita/KitaZeitreiheTabelle.tsx` | ✓ Berichtsmonat an Meldeeingang-Stichprobe; Spalte Meldebasis, Badge/Rahmen bei Lücke, keine Interpolation (Q-115) |

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
