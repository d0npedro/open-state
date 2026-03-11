# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Q-031 (React Demo-State, interaktive Rückfragen-Beantwortung)

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

Weitere Domänen (Kita, Unternehmensgründung): nur Dokumentation, keine UI-Routen.

---

## Implementierte Logik

| Modul | Pfad | Status |
|-------|------|--------|
| Mock-Falldaten (ALG I) | `demo/data/mockFall.ts` | ✓ Vollständig |
| Story Registry | `demo/data/storyRegistry.ts` | ✓ 8 Stories (US-AV-001–008) |
| Fairness-Typen | `demo/types/fairness.ts` | ✓ |
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln, berechnete Fristtagezahl (ISO-Datum + FIKTIVES_HEUTE) |
| FairnessPanel-Komponente | `demo/components/fairness/FairnessPanel.tsx` | ✓ |
| BuildInfo-Komponente | `demo/components/BuildInfo.tsx` | ✓ |
| Demo-State-Kontext | `demo/context/DemoStateContext.tsx` | ✓ React Context, Rückfrage-Antwort-State |

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
| Arbeitsverwaltung (AV) | US-AV-001 – 008 | ✓ 8 registriert | DEMONSTRIERBAR |
| Kita / Jugendamt (KJ) | US-KJ-001 – 010 | ✗ nicht registriert | ENTWURF (Docs only) |
| Unternehmensgründung (UG) | 0 | ✗ | Nicht gestartet |

**Bekannte Inkonsistenz:** US-AV-008 existiert im Code (Route `/fall/hinweise`, storyRegistry.ts),
aber die Story-Datei `docs/stories/arbeitsverwaltung/US-AV-008_*.md` fehlt noch.

---

## Dokumentation

### Domänen

| Domäne | Pfad | Umfang | Status |
|--------|------|--------|--------|
| Arbeitsverwaltung | `docs/domains/arbeitsverwaltung/` | 9 Dok + Story-System | ✓ Vollständig |
| Unternehmensgründung | `docs/domains/unternehmensgruendung/` | 6 Dok | Nur Docs, keine Demo |
| Kita-Betrieb & JA-Steuerung | `docs/domains/kita_betrieb_und_jugendamt_steuerung/` | 7 Dok + 10 Stories | Nur Docs, keine Demo |

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
| `/fall/hinweise` reagiert noch nicht auf State-Wechsel | Signale bleiben auch nach Antwort sichtbar | Q-032 |
| Keine Kita-/JA-Demo-Route | Einzigartigster Inhalt fehlt komplett | Q-020–Q-024 |
| Keine Unternehmensgründungs-Demo-Route | Plattformgedanke nicht sichtbar | Q-011–Q-015 |
| US-KJ-001–010 nicht in storyRegistry.ts | /stories zeigt Kita-Domäne nicht | Q-002 |
| Story-Datei `US-AV-008` in docs/stories/ fehlt | Docs-Inkonsistenz, kein Demo-Effekt | Q-001 |
| DSFA für Kita-Domäne noch ausstehend | Konzeptlücke — extern abhängig | — |
| Keine automatisierten Tests | Bewusste Schuld | — |

---

## Nicht implementiert (nur konzeptionell)

- Backend / API (kein Server, kein API-Endpunkt)
- Authentifizierung (kein eID, kein FIDO2)
- Datenbankanbindung
- Echte Behördenschnittstellen (ALLEGRO, XMeld, ELSTER etc.)
- Kita-Betrieb & Jugendamt-Demo (nur Dokumentation)
- Öffentlicher Transparenzbericht (nur Konzept)
- Unternehmensgründungs-Demo (nur Dokumentation)
- Chart-/Visualisierungsbibliothek
