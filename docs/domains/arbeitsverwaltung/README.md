# Domäne: Arbeitsverwaltung

**Status:** Konzeptphase · Demo demonstrierbar  
**SSOT Stories:** [`demo/data/storyRegistry.ts`](../../../demo/data/storyRegistry.ts) · Dashboard [`/stories`](../../../demo/app/stories/page.tsx)

Einheitliche Andock-Schablone (Q-430): Problem · Demo-Routen · Stories · API · Grenzen.

---

## Problem

Bürgerinnen und Bürger im ALG-I-/Leistungskontext kennen oft weder Status, nächste Handlung noch Begründung von Anforderungen. Medienbrüche und unklare Mitwirkungspflichten erzeugen vermeidbare Kontakte und Fristenrisiken.

**Zielbild (kurz):** Eine Fallakte mit sichtbarem Status, erklärten Anforderungen, Fristen und Bescheiden — KI nur als Assistenz, Entscheidungen beim Menschen.

Detail: [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md)

---

## Demo-Routen

| Route | Inhalt | Stories |
|-------|--------|---------|
| `/fall` | Fallübersicht, Status, Fristen, Session-Quittungen | US-AV-001, 002 |
| `/fall/dokumente` | Unterlagen, Upload-Demo | US-AV-003 |
| `/fall/rueckfragen` | Offene Fragen, Antwort-Demo | US-AV-004 |
| `/fall/termine` | Termine, Bestätigung session-lokal | US-AV-005 |
| `/fall/bescheide` | Bescheid, Widerspruchsfrist | US-AV-006 |
| `/fall/verlauf` | Timeline / Audit | US-AV-007 |
| `/fall/hinweise` | Verfahrensfairness (regelbasiert) | US-AV-008 |

Einstieg Demo: Landing → „Antrag öffnen“. Mock: `demo/data/mockFall.ts`.

---

## Stories

| ID | Titel | Route |
|----|-------|-------|
| US-AV-001 | Fall anlegen | `/fall` |
| US-AV-002 | Status einsehen | `/fall` |
| US-AV-003 | Unterlagen nachreichen | `/fall/dokumente` |
| US-AV-004 | Rückfrage verstehen | `/fall/rueckfragen` |
| US-AV-005 | Termin einsehen und verstehen | `/fall/termine` |
| US-AV-006 | Bescheid verstehen | `/fall/bescheide` |
| US-AV-007 | Historie nachvollziehen | `/fall/verlauf` |
| US-AV-008 | Verfahrenslage verstehen | `/fall/hinweise` |

Story-Dateien: [`docs/stories/arbeitsverwaltung/`](../../stories/arbeitsverwaltung/)

---

## API

| Artefakt | Rolle |
|----------|--------|
| [`docs/api/arbeitsverwaltung-fall-api.yaml`](../../api/arbeitsverwaltung-fall-api.yaml) | OpenAPI-Skizze Fallakte (Konzept, kein laufendes Backend) |
| [06_DATENMODELL_UND_API_SKIZZE.md](06_DATENMODELL_UND_API_SKIZZE.md) | Felder, Entitäten, Schnittstellen-Gedanke |

---

## Grenzen

- Demo-only: Mock-Daten, kein Backend, keine BA-/Jobcenter-Anbindung
- Föderale Zuständigkeit (SGB II/III, Agentur vs. Jobcenter) konzeptionell; rechtliche Feinjustierung offen
- KI entscheidet nicht (Projektprinzip)
- Detail Risiken/Recht: [07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md](07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md)

---

## Dokumentenübersicht (Fachkonzept)

| Datei | Inhalt |
|-------|--------|
| [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md) | Ist und Zielbild |
| [02_BENUTZERROLLEN_UND_AKTEURE.md](02_BENUTZERROLLEN_UND_AKTEURE.md) | Rollen und Rechte |
| [03_KERNPROZESSE.md](03_KERNPROZESSE.md) | Kernprozesse |
| [04_FALLAKTE_UND_STATUSMODELL.md](04_FALLAKTE_UND_STATUSMODELL.md) | Fall- und Statusmodell |
| [05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md](05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md) | Transparenzregeln |
| [06_DATENMODELL_UND_API_SKIZZE.md](06_DATENMODELL_UND_API_SKIZZE.md) | Datenmodell / API |
| [07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md](07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md) | Grenzen und Offenheit |
| [08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md](08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md) | Effizienzlogik |
| [09_UX_PRINZIPIEN.md](09_UX_PRINZIPIEN.md) | UX-Prinzipien |

---

## Weiterführend

- Architektur: [`architecture/05_Systemarchitektur.md`](../../../architecture/05_Systemarchitektur.md)
- Leitbild: [`docs/LEITBILD_STAAT_UND_VERTRAUEN.md`](../../LEITBILD_STAAT_UND_VERTRAUEN.md)
- Fairness-Engine: [`docs/engines/verfahrensfairness/`](../../engines/verfahrensfairness/)
