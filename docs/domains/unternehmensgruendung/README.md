# Domäne: Unternehmensgründung

**Status:** Konzeptphase · Demo demonstrierbar  
**SSOT Stories:** [`demo/data/storyRegistry.ts`](../../../demo/data/storyRegistry.ts) · Dashboard [`/stories`](../../../demo/app/stories/page.tsx)

Einheitliche Andock-Schablone (Q-430): Problem · Demo-Routen · Stories · API · Grenzen.

---

## Problem

Gründerinnen und Gründer koordinieren heute oft selbst Gewerbeamt, Finanzamt, IHK und weitere Stellen. Anforderungen sind pauschal, Status unklar, Dokumente werden mehrfach angefordert — Friktion entsteht aus Organisationsmängeln, nicht aus legitimer Regulierung.

**Zielbild (kurz):** Eine digitale Gründungsakte mit klaren Anforderungen, Behördensicht, Fristen und erklärbaren Schritten — ohne die föderale Rechtslage zu ersetzen.

Detail: [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md)

---

## Demo-Routen

| Route | Inhalt | Stories |
|-------|--------|---------|
| `/gruendung` | Übersicht, nächster Schritt, Session-Quittungen | US-UG-001 |
| `/gruendung/behoerden` | Behördenkarten, VS-Status, BG-Demo | US-UG-002 |
| `/gruendung/dokumente` | Unterlagen, Upload session-lokal | US-UG-003 |
| `/gruendung/rueckfragen` | Rückfragen, Antwort-Demo | US-UG-004 |
| `/gruendung/verlauf` | Verlauf mit Filtern | US-UG-005 |
| `/gruendung/hinweise` | Fairness UG, CTAs | US-UG-006 |

Einstieg Demo: Landing → „Gründungsakte öffnen“. Mock: `demo/data/mockGruendungsfall.ts`.

---

## Stories

| ID | Titel | Route |
|----|-------|-------|
| US-UG-001 | Gründungsstatus einsehen | `/gruendung` |
| US-UG-002 | Beteiligte Behörden einsehen | `/gruendung/behoerden` |
| US-UG-003 | Unterlagen nachreichen | `/gruendung/dokumente` |
| US-UG-004 | Rückfrage verstehen und beantworten | `/gruendung/rueckfragen` |
| US-UG-005 | Verfahrensverlauf nachvollziehen | `/gruendung/verlauf` |
| US-UG-006 | Nächste Schritte und Pflichten verstehen | `/gruendung/hinweise` |

Story-Dateien: [`docs/stories/`](../../stories/) (Registry-Einträge `US-UG-*`)

---

## API

| Artefakt | Rolle |
|----------|--------|
| — | Noch keine dedizierte OpenAPI-Datei unter `docs/api/` (bewusst Konzeptphase) |
| [04_FALLAKTE_UND_STATUSMODELL.md](04_FALLAKTE_UND_STATUSMODELL.md) | Fallakte, Status, Ereignisse |
| Datenmodell-Gedanke | analog AV; Demo-Typen: `demo/types/gruendung.ts` |

---

## Grenzen

- Demo-only: Mock, kein Backend, keine echten Behördenadapter
- Föderale Zuständigkeiten und Rechtsformen bleiben Realität; System koordiniert, ersetzt Recht nicht
- BG-Anmeldung u. a. außerhalb Open State (Demo-Markierung)
- Detail: [06_RECHTLICHE_OFFENHEIT_UND_GRENZEN.md](06_RECHTLICHE_OFFENHEIT_UND_GRENZEN.md)

---

## Dokumentenübersicht (Fachkonzept)

| Dokument | Inhalt |
|----------|--------|
| [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md) | Problem und Zielbild |
| [02_BENUTZERROLLEN_UND_AKTEURE.md](02_BENUTZERROLLEN_UND_AKTEURE.md) | Rollen |
| [03_KERNPROZESSE.md](03_KERNPROZESSE.md) | Prozesse |
| [04_FALLAKTE_UND_STATUSMODELL.md](04_FALLAKTE_UND_STATUSMODELL.md) | Akte und Status |
| [05_WIRTSCHAFTLICHER_NUTZEN_UND_STAATLICHER_MEHRWERT.md](05_WIRTSCHAFTLICHER_NUTZEN_UND_STAATLICHER_MEHRWERT.md) | Nutzenargumentation |
| [06_RECHTLICHE_OFFENHEIT_UND_GRENZEN.md](06_RECHTLICHE_OFFENHEIT_UND_GRENZEN.md) | Rechtliche Grenzen |

---

## Weiterführend

- Architektur: [`architecture/05_Systemarchitektur.md`](../../../architecture/05_Systemarchitektur.md)
- Leitbild: [`docs/LEITBILD_STAAT_UND_VERTRAUEN.md`](../../LEITBILD_STAAT_UND_VERTRAUEN.md)
- Fairness UG: `demo/lib/fairness/gruendung-rules.ts`
