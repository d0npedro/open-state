# US-UG-002 – Beteiligte Behörden einsehen

**Story-ID:** US-UG-002
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich alle am Vorgang beteiligten Behörden mit Rolle, Status und Kontakt auf einen Blick sehen
damit ich verstehe, wer wofür zuständig ist und nicht selbst zwischen Stellen koordinieren muss.

---

## Kontext

Eine typische Gewerbeanmeldung berührt mehrere Stellen: Gewerbeamt (Anmeldung), Finanzamt (steuerliche Erfassung), IHK oder HWK (Pflichtmitgliedschaft), oft Berufsgenossenschaft (Unfallversicherung). Heute fehlt eine gemeinsame Sicht. Gründer werden zum inoffiziellen Projektmanager zwischen Behörden – mit Doppelarbeit, widersprüchlichen Auskünften und verlorener Zeit.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Klare Zuständigkeiten statt Telefonkette und Rätselraten |
| **Verwaltungswert** | Weniger Fehlanrufe bei unzuständigen Stellen |
| **Transparenzwert** | Bearbeitungsstatus je Behörde ist sichtbar und erklärbar |

---

## Akzeptanzkriterien

1. Alle am Fall beteiligten Behörden sind mit Bezeichnung und Typ gelistet (z. B. Gewerbeamt, Finanzamt, IHK).
2. Je Behörde ist der Bearbeitungsstatus in Klartext sichtbar (z. B. abgeschlossen, in Bearbeitung, Rückfrage offen, nicht gestartet).
3. Die Rolle der Behörde im konkreten Vorgang ist in verständlicher Sprache erklärt.
4. Kontakt- oder Zuständigkeitsangaben sind vorhanden, soweit im Demo- bzw. Datenmodell vorgesehen.
5. Behörden, die außerhalb des Systems bearbeitet werden (z. B. Berufsgenossenschaft), sind als solche gekennzeichnet.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Mehrere Behörden aktiv | Parallel laufende Schritte | Liste mit gemischten Status-Chips |
| Eine Behörde blockiert | z. B. Rückfrage beim Finanzamt | Hervorgehobener Status „Rückfrage offen“ |
| Alle abgeschlossen | Pflichtbehörden fertig | Erfolgsstatus je Eintrag |
| Noch nicht gestartet | Behörde noch nicht involviert | Neutraler Status „nicht gestartet“ mit Erklärung |

---

## Nicht-Ziele

- Keine Live-Chat-Funktion mit Behörden in dieser Story.
- Keine automatische Umverteilung von Zuständigkeiten zwischen Kommunen.
- Keine vollständige Abbildung aller möglichen Sonderbehörden für erlaubnispflichtige Gewerbe.

---

## Offene fachliche Fragen

- Wie wird die zuständige IHK/HWK systemseitig zuverlässig ermittelt?
- Welche Behörden müssen zwingend in der Akte erscheinen, welche nur optional?

---

## Rechtliche / Policy-Offenheit

- Föderale Zuständigkeitsregeln (Gewerbeamt kommunal, Finanzamt landesbezogen) bleiben bestehen.
- Anzeige von Bearbeitungsstatus setzt datenschutzkonforme Schnittstellen voraus.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung/behoerden`
- Behördenkarten mit Status und Rolle
- Übersichtseinbindung auf `/gruendung`

---

## Technische Anschlussstellen

- `GET /api/v1/gruendung/{id}/behoerden`
- Datenfeld `beteiligteBehörden` in der Gründungsakte
- Mock: `demo/data/mockGruendungsfall.ts`

---

## Verwandte Stories

- [US-UG-001] – Gründungsstatus einsehen
- [US-UG-003] – Unterlagen nachreichen
- [US-UG-004] – Rückfrage verstehen und beantworten
