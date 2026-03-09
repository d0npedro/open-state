# Open State – Domäne: Arbeitsverwaltung

**Bereich:** Arbeitsverwaltung · Leistungsgewährung · Vermittlung · Fallbegleitung
**Status:** Konzeptioneller Ausgangszustand

---

## Zielbild

Die Arbeitsverwaltung in Deutschland ist für Millionen Menschen ein entscheidender staatlicher Kontaktpunkt – oft in schwierigen Lebenslagen. Dieser Kontakt soll verlässlich, klar, würdevoll und nachvollziehbar sein.

Open State überträgt die Kernprinzipien des Gesamtprojekts auf die Arbeitsverwaltung:

> Kein Bürger soll im Dunkeln tappenüber den Stand seines Falls, den Grund einer Verzögerung, die nächste erforderliche Handlung oder die Grundlage einer Entscheidung.

Die Domäne Arbeitsverwaltung ist kein Ersatz für menschliches Ermessen. Sie ist ein **strukturgebendes Rückgrat** für transparente, gut dokumentierte, bürgernahe Verwaltungsprozesse.

---

## Kernprobleme, die diese Domäne löst

| Problem | Folge heute | Ziel mit Open State |
|---------|------------|---------------------|
| Unklare Zuständigkeit | Bürger telefoniert mehrfach, erhält widersprüchliche Auskünfte | Eindeutige, sichtbare Zuständigkeit in der Fallakte |
| Opaker Bearbeitungsstatus | Bürger weiß nicht, ob Antrag angekommen ist | Statusanzeige in Echtzeit mit Erklärung |
| Undokumentierte Mitwirkungspflichten | Fristen werden verpasst, Ansprüche verwirkt | Vollständige, verständliche To-do-Liste für Bürger |
| Medienbrüche (Brief/Portal/Telefon) | Informationen gehen verloren, doppelte Bearbeitung | Alle Kommunikationskanäle in einer Fallakte |
| Unverständliche Bescheide | Widerspruchsquote hoch, Bürger resigniert | Bescheid in klarer Sprache + Erklärungsschicht |
| Manuelle Rückfragen | Sachbearbeitung bindet Zeit für Standardfälle | Plausibilitätsprüfung + strukturierte Nachreichung |
| Hohe Falllast | Komplexe Fälle werden nicht priorisiert | Priorisierungslogik für Sachbearbeitung |
| Vertrauensverlust | Bürger glaubt, im Stich gelassen zu werden | Nachvollziehbarkeit als Systemversprechen |

---

## Prinzipien dieser Domäne

1. **Transparenz vor Verwaltungskomfort** – Bürger sehen mehr, nicht weniger
2. **Begründungspflicht** – jede Anforderung, jede Frist, jede Entscheidung hat eine erklärte Grundlage
3. **Keine Schein-Automatisierung** – KI unterstützt, entscheidet nicht; Menschen tragen Verantwortung
4. **Würde als Designprinzip** – keine Sanktionssprache ohne Kontext, keine Sackgassen
5. **Fiskalische Disziplin** – Effizienz entsteht durch Prozessklarheit, nicht durch Datenverwertung
6. **Datensparsamkeit** – nur was für den Vorgang notwendig ist, wird erhoben und gespeichert

---

## Beteiligte Behörden / Institutionen

> **Hinweis:** Die genaue behördliche Zuständigkeitsabgrenzung (Agentur für Arbeit vs. Jobcenter vs. kommunaler Träger) ist föderalpolitisch und rechtsabhängig. Die vorliegenden Dokumente beschreiben das konzeptionelle Modell. Die rechtliche und institutionelle Feinjustierung erfordert Abstimmung mit zuständigen Bundesministerien, der Bundesagentur für Arbeit und kommunalen Trägern.

Typische Akteure:
- Agentur für Arbeit (SGB III: Arbeitslosengeld I, Vermittlung)
- Jobcenter / kommunale Träger (SGB II: Bürgergeld, Eingliederungsleistungen)
- Ergänzende Beratungsstellen (Schuldnerberatung, psychosoziale Beratung)
- Arbeitgeber (bei Kurzarbeit, Ausbildungsförderung)

---

## Dokumentenübersicht

| Datei | Inhalt |
|-------|--------|
| [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md) | Ist-Zustand und angestrebter Zielzustand im Detail |
| [02_BENUTZERROLLEN_UND_AKTEURE.md](02_BENUTZERROLLEN_UND_AKTEURE.md) | Alle Rollen, Rechte, Verantwortlichkeiten |
| [03_KERNPROZESSE.md](03_KERNPROZESSE.md) | Digitale Prozessbeschreibungen aller Kernvorgänge |
| [04_FALLAKTE_UND_STATUSMODELL.md](04_FALLAKTE_UND_STATUSMODELL.md) | Fallmodell, Statuszustände, Ereignistypen |
| [05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md](05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md) | Was Bürger wann sehen – und warum |
| [06_DATENMODELL_UND_API_SKIZZE.md](06_DATENMODELL_UND_API_SKIZZE.md) | Felder, Entitäten, Schnittstellen |
| [07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md](07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md) | Offene Rechtsfragen, Grenzen, Risiken |
| [08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md](08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md) | Fiskalischer Nutzen durch Prozessklarheit |
| [09_UX_PRINZIPIEN.md](09_UX_PRINZIPIEN.md) | Bürgergerechte Gestaltungsprinzipien |

---

---

## User Stories dieser Domäne

Die konkreten Anforderungen dieser Domäne sind als User Stories dokumentiert. Jede Story beschreibt ein spezifisches Bürgerproblem, die zugehörige Funktion, definierte Akzeptanzkriterien und UI-Zustände.

→ [Story-Übersicht Arbeitsverwaltung](../../../docs/stories/arbeitsverwaltung/README.md)

**Die 7 dokumentierten Stories:**

| Story-ID | Titel | Problem |
|----------|-------|---------|
| US-AV-001 | Fall anlegen | Bürger wissen nicht, wie sie den Prozess nach Jobverlust digital starten |
| US-AV-002 | Status einsehen | 40–60 % aller BA-Kontakte sind vermeidbare Statusanfragen |
| US-AV-003 | Unterlagen nachreichen | Dokumentenanforderungen kommen ohne Kontext, Format und Fristangabe |
| US-AV-004 | Rückfrage verstehen | Rückfragen in Behördensprache ohne Begründung oder Konsequenzbeschreibung |
| US-AV-005 | Termin einsehen und verstehen | Termine per Post ohne Zweck, Vorbereitungshinweise oder Format |
| US-AV-006 | Bescheid verstehen | Juristische Bescheide führen zu versäumten Widerspruchsfristen |
| US-AV-007 | Historie nachvollziehen | Kein Überblick über Fallverlauf, Entscheidungen und Kommunikation |

---

*Diese Domäne ist Teil von Open State – dem transparenten Betriebs- und Vertrauensmodell für staatliches Handeln.*
*Verweis auf Gesamtarchitektur: [architecture/05_Systemarchitektur.md](../../../architecture/05_Systemarchitektur.md)*
*Verweis auf Leitbild: [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](../../LEITBILD_STAAT_UND_VERTRAUEN.md)*
