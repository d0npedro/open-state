# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Commit `50c0f69`

Dieser Zustand beschreibt, was tatsächlich existiert und funktioniert –
nicht was geplant ist. Für geplante Schritte → `NEXT_STEPS_QUEUE.md`.

---

## Laufende Demo

| Eigenschaft | Wert |
|-------------|------|
| Framework | Next.js 14.2.5, React 18, TypeScript 5 |
| Build-Status | ✓ Erfolgreich (13 statische Seiten) |
| Deployment | Vercel, aus `demo/`-Verzeichnis |
| Lokaler Start | `cd demo && npm install && npm run dev` |
| Letzte Build-Prüfung | Commit `9966c5e` |

## Demo-Routen

| Route | Inhalt | Story-IDs | Status |
|-------|--------|-----------|--------|
| `/` | Landing Page | – | ✓ |
| `/fall` | Fallübersicht, Status, Fairness-Summary | US-AV-001, 002 | ✓ |
| `/fall/dokumente` | Dokumentenanforderungen | US-AV-003 | ✓ |
| `/fall/rueckfragen` | Rückfragen mit Fairness-Hinweis | US-AV-004 | ✓ |
| `/fall/termine` | Termine | US-AV-005 | ✓ |
| `/fall/bescheide` | Bescheide mit Fairness-Hinweisen | US-AV-006 | ✓ |
| `/fall/verlauf` | Timeline mit Fairness-Hinweis | US-AV-007 | ✓ |
| `/fall/hinweise` | Vollständige Fairness-Hinweisseite | US-AV-008 | ✓ |
| `/stories` | Story Coverage Dashboard | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |

## Implementierte Logik

| Modul | Pfad | Status |
|-------|------|--------|
| Mock-Falldaten (ALG I) | `demo/data/mockFall.ts` | ✓ Vollständig |
| Story Registry | `demo/data/storyRegistry.ts` | ✓ 8 Stories (US-AV-001–008) |
| Fairness-Typen | `demo/types/fairness.ts` | ✓ |
| Fairness-Regelwerk | `demo/lib/fairness/rules.ts` | ✓ 5 Regeln |
| FairnessPanel-Komponenten | `demo/components/fairness/FairnessPanel.tsx` | ✓ |
| Design System | `demo/app/globals.css` | ✓ CSS-Variablen, Utility-Klassen |
| BuildInfo-Komponente | `demo/components/BuildInfo.tsx` | ✓ |

---

## Dokumentation

### Domänen (vollständig dokumentiert)

| Domäne | Pfad | Umfang |
|--------|------|--------|
| Arbeitsverwaltung | `docs/domains/arbeitsverwaltung/` | 9 Dokumente + Story-System |
| Unternehmensgründung | `docs/domains/unternehmensgruendung/` | 6 Dokumente |
| Kita-Betrieb & JA-Steuerung | `docs/domains/kita_betrieb_und_jugendamt_steuerung/` | 7 Dokumente + 10 Stories |

### Engines

| Engine | Pfad | Umfang |
|--------|------|--------|
| Verfahrensfairness Engine | `docs/engines/verfahrensfairness/` | 6 Dokumente |

### Architektur

| Dok | Pfad | Status |
|-----|------|--------|
| arc42 (12 Kapitel) | `architecture/arc42/` | ✓ vollständig |
| Systemarchitektur | `architecture/05_Systemarchitektur.md` | ✓ |

### Stories

| Domäne | Anzahl Stories | Status |
|--------|---------------|--------|
| Arbeitsverwaltung | 8 (US-AV-001–008) | DEMONSTRIERBAR |
| Kita-Betrieb / JA | 10 (US-KJ-001–010) | ENTWURF |
| Unternehmensgründung | 0 im Story-System | Offen |

---

## Bekannte Lücken / Blockierungen

| Lücke | Bereich | Priorität |
|-------|---------|-----------|
| Keine persistente Datenhaltung (alles Mock) | Demo | Mittel |
| Keine Unternehmensgründungs-Demo-Route | Demo / Domäne | Hoch |
| Story-Datei US-AV-008 fehlt noch in docs/stories/ | Docs | Niedrig |
| Keine Story-Datei für US-KJ in story_registry.ts | Demo Code | Mittel |
| Vercel-Deployment-Branch-Modell ungeprüft (aktiv?) | Deployment | Mittel |
| app-design-Dokumente 07–10 noch nicht mit Demo verknüpft | Docs | Niedrig |
| DSFA für Kita-Domäne noch ausstehend (konzeptionell) | Konzept | Hoch (extern) |

---

## Nicht-existierende Teile (konzeptionell geplant, nicht implementiert)

- Backend / API (keine Serverlogik vorhanden)
- Authentifizierung (kein eID, kein FIDO2)
- Datenbankanbindung
- Echte Behördenschnittstellen (ALLEGRO, XMeld, ELSTER etc.)
- Kita-Betrieb & Jugendamt-Demo (nur Dokumentation, keine UI)
- Öffentlicher Transparenzbericht (nur Konzept)
- Zweite Vercel-Demo für weitere Domäne
