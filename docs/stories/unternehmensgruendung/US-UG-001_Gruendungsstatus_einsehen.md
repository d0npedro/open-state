# US-UG-001 – Gründungsstatus einsehen

**Story-ID:** US-UG-001
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich den aktuellen Status meiner digitalen Gründungsakte jederzeit einsehen können
damit ich ohne Anruf bei Gewerbeamt oder Finanzamt weiß, wo der Vorgang steht und was als Nächstes passiert.

---

## Kontext

Statusanfragen sind in Gründungsprozessen alltäglich: „Ist meine Anmeldung angekommen?“, „Wer bearbeitet gerade was?“, „Was fehlt noch?“ Heute müssen Gründerinnen und Gründer bei mehreren Behörden nachfragen, weil es keine gemeinsame, verständliche Statussicht gibt. Open State fasst den Verfahrensstand in einer digitalen Gründungsakte zusammen – mit Klartext-Status, Fortschritt und offenen Aufgaben.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Planbarkeit ohne Telefonkette; sofortige Orientierung im Mehrbehördenprozess |
| **Verwaltungswert** | Weniger Statusanrufe und E-Mails an Gewerbeamt, Finanzamt und IHK |
| **Transparenzwert** | Gesamtstatus und nächster Schritt sind nachvollziehbar und begründet |

---

## Akzeptanzkriterien

1. Die Übersicht zeigt einen Klartext-Status (kein interner Code wie `RUECKFRAGE_AUSSTEHEND`).
2. Vorgangstyp, Rechtsform und Gewerbebezeichnung sind sichtbar.
3. Offene Aufgaben bzw. der nächste erwartete Schritt sind in Alltagssprache dargestellt.
4. Ein Fortschritts- oder Schritthinweis zeigt, wo der Vorgang im Gesamtablauf steht.
5. Bei handlungsrelevantem Status (z. B. offene Rückfrage) ist ein direkter Handlungshinweis mit Link zur betroffenen Funktion sichtbar.
6. Datum der letzten Aktualisierung und Aktenkennung sind einsehbar.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Normalzustand | Akte in Bearbeitung, keine kritische Aktion | Status-Chip, Fortschritt, Behördenkurzüberblick |
| Handlungsbedarf | Offene Rückfrage oder Frist | Action-Banner mit Handlungsaufforderung und Direktlink |
| Leerzustand | Noch keine Akte vorhanden | Hinweis zum Start der Gewerbeanmeldung (außerhalb dieser Story) |
| Abgeschlossen | Alle Pflichtschritte erledigt | Erfolgsstatus, Hinweis auf Folgepflichten |

---

## Nicht-Ziele

- Diese Story umfasst nicht die initiale Fallanlage / interaktive Gewerbeanmeldung.
- Sie ersetzt keine behördliche Einzelfallberatung.
- Sie steuert keine automatische Entscheidung über Genehmigungen.

---

## Offene fachliche Fragen

- Welche Statusbezeichnungen sind bundesweit einheitlich darstellbar, obwohl Gewerbeämter kommunal organisiert sind?
- Welche Mindestaktualität gilt für den Status, wenn Behörden-Systeme asynchron melden?

---

## Rechtliche / Policy-Offenheit

- Statustransparenz setzt rechtlich zulässige Datenübermittlung zwischen beteiligten Stellen voraus (föderal unterschiedlich).
- Darstellung von Finanzamtsstatus unterliegt besonderen datenschutzrechtlichen Anforderungen.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung`
- Status-Chip / Action-Banner
- Verfahrensfortschritt und Schrittliste
- Schnellzugriff-Kacheln zu Behörden, Unterlagen, Rückfragen, Verlauf

---

## Technische Anschlussstellen

- `GET /api/v1/gruendung/{id}` – Gründungsakte inkl. Status
- `GET /api/v1/gruendung/{id}/status` – aggregierter Status je Behörde
- Mock: `demo/data/mockGruendungsfall.ts`
- Domain-Typen: `demo/types/gruendung.ts`

---

## Verwandte Stories

- [US-UG-002] – Beteiligte Behörden einsehen
- [US-UG-004] – Rückfrage verstehen und beantworten
- [US-UG-006] – Nächste Schritte und Pflichten verstehen
