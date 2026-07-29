# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Q-073 (UG Dokument-Upload + Fairness UG_UNTERLAGE_FEHLT)

Dieser Stand beschreibt, was tatsächlich existiert und funktioniert.
Nicht was geplant ist. Für geplante Schritte → `NEXT_STEPS_QUEUE.md`.

---

## Laufende Demo

| Eigenschaft | Wert |
|-------------|------|
| Framework | Next.js 14.2.5, React 18, TypeScript 5 strict |
| Build-Status | ✓ Erfolgreich (13 statische Seiten) |
| Deployment | Vercel, aus `demo/`-Verzeichnis |
| Lokaler Start | `cd demo && npm install && npm run dev` |
| Letzte Build-Prüfung | Commit `d6fc0c7` — grün, 13/13 Seiten |

---

## Demo-Routen

| Route | Inhalt | Story-IDs | Status |
|-------|--------|-----------|--------|
| `/` | Landing Page | – | ✓ |
| `/fall` | Fallübersicht, Status, Fairness-Summary | US-AV-001, US-AV-002 | ✓ |
| `/fall/dokumente` | Dokumentenanforderungen | US-AV-003 | ✓ |
| `/fall/rueckfragen` | Rückfragen mit Fairness-Hinweis | US-AV-004 | ✓ |
| `/fall/termine` | Termine | US-AV-005 | ✓ |
| `/fall/bescheide` | Bescheide mit Fairness-Hinweisen | US-AV-006 | ✓ |
| `/fall/verlauf` | Timeline mit Fairness-Hinweis | US-AV-007 | ✓ |
| `/fall/hinweise` | Vollständige Fairness-Hinweisseite | US-AV-008 | ✓ |
| `/stories` | Story Coverage Dashboard | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |
| `/gruendung` … | Unternehmensgründung (Übersicht, Dokumente, Behörden, …) | US-UG-001–006 | ✓ |
| `/kita` | Öffentlicher Transparenzbericht | US-KJ-009, US-KJ-010 | ✓ |
| `/kita/lagebild` | Jugendamt-Steuerungsansicht | US-KJ-005, US-KJ-006 | ✓ |

---

## Implementierte Logik

| Modul | Pfad | Status |
|-------|------|--------|
| Mock-Falldaten (ALG I) | `demo/data/mockFall.ts` | ✓ Vollständig |
| Story Registry | `demo/data/storyRegistry.ts` | ✓ AV + KJ + UG registriert |
| Fairness-Typen | `demo/types/fairness.ts` | ✓ |
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln, berechnete Fristtagezahl (ISO-Datum + FIKTIVES_HEUTE) |
| FairnessPanel-Komponente | `demo/components/fairness/FairnessPanel.tsx` | ✓ |
| BuildInfo-Komponente | `demo/components/BuildInfo.tsx` | ✓ |
| Demo-State-Kontext | `demo/context/DemoStateContext.tsx` | ✓ Rückfrage/Upload + Timeline-Events; alle AV-Routen angebunden |
| Gründung-State-Kontext | `demo/context/GruendungStateContext.tsx` | ✓ Rückfrage/Upload + Verlaufsereignisse; Fairness live |

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
| DSFA für Kita-Domäne noch ausstehend | Konzeptlücke — extern abhängig | — |
| Queue ohne weitere OFFEN-Einträge | Nächste Iteration braucht Queue-Nachfüllung | — |

---

## Nicht implementiert (nur konzeptionell)

- Backend / API (kein Server, kein API-Endpunkt)
- Authentifizierung (kein eID, kein FIDO2)
- Datenbankanbindung
- Echte Behördenschnittstellen (ALLEGRO, XMeld, ELSTER etc.)
- Chart-/Visualisierungsbibliothek (Zeitreihe aktuell als HTML-Tabelle)
- Persistenter Backend-State / echte Uploads
