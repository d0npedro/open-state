# US-UG-006 – Nächste Schritte und Pflichten verstehen

**Story-ID:** US-UG-006
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich die für meinen konkreten Fall relevanten nächsten Schritte und Pflichten verständlich erklärt bekommen
damit ich weiß, was ich tun muss, was die Behörde tut und welche Folgen Untätigkeit hat – ohne Pauschallisten.

---

## Kontext

Gründer erhalten oft generische Checklisten, die nicht zum konkreten Gewerbe, zur Rechtsform oder zum Verfahrensstand passen. Open State leitet fallbezogene nächste Schritte und Pflichtinformationen ab: offene Aufgaben, erklärbare Handlungshinweise und – wo relevant – Hinweise aus dem Fairness-Regelwerk (Fristlage, blockierte Folgeschritte). Die Erklärung ist Informationsleistung, keine Rechtsberatung.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Fallbezogene Handlungsklarheit statt generischer Checkliste |
| **Verwaltungswert** | Weniger verspätete oder unvollständige Mitwirkung |
| **Transparenzwert** | Jeder Hinweis ist begründet und methodisch nachvollziehbar |

---

## Akzeptanzkriterien

1. Offene Aufgaben bzw. nächste Schritte sind fallbezogen und in Alltagssprache formuliert.
2. Für handlungsrelevante Hinweise sind Begründung und – sofern zutreffend – Konsequenz sichtbar.
3. Fristen werden als Datum oder klarer Zeitbezug dargestellt, wenn vorhanden.
4. Hinweise unterscheiden, wer handeln muss (Gründer vs. Behörde).
5. Ein methodischer Hinweis macht kenntlich, dass Erklärungen informativ sind und keine Rechtsberatung ersetzen.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Offene Schritte | Aufgaben und Hinweise vorhanden | Aufgabenliste, Hinweispanel |
| Kritische Frist | Frist nahe oder überschritten | Warnhinweis mit Begründung |
| Keine offenen Pflichten | Aktuell nichts zu tun | Neutraler Status „keine offenen Schritte“ |
| Systemhinweis | Regelbasiertes Fairness-Signal | FairnessPanel / Hinweise-Seite |

---

## Nicht-Ziele

- Keine automatische Rechtsberatung und keine verbindliche Auskunft über steuerliche Wahlrechte.
- Keine autonome Entscheidung durch KI.
- Keine vollständige Abbildung aller branchenspezifischen Erlaubnisverfahren in dieser Story.

---

## Offene fachliche Fragen

- Welche Pflichtentexte müssen rechtlich freigegeben und versioniert werden?
- Wie werden landesspezifische Abweichungen in den Handlungshinweisen abgebildet?

---

## Rechtliche / Policy-Offenheit

- Informationspflichten des Staates vs. Abgrenzung zur Rechtsberatung.
- Haftungshinweise bei unvollständigen oder veralteten Pflichtentexten sind zu klären.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung` (offene Aufgaben, nächster Schritt, Schrittliste)
- Demo-Route `/gruendung/hinweise` (regelbasierte Verfahrenshinweise)
- Fairness-Regelwerk UG

---

## Technische Anschlussstellen

- Aggregierte Felder `offeneAufgaben`, `naechsterSchritt`, `verfahrensSchritte` in der Gründungsakte
- Fairness-Engine: Signale aus Falldaten ableiten
- Mock: `demo/data/mockGruendungsfall.ts`

---

## Verwandte Stories

- [US-UG-001] – Gründungsstatus einsehen
- [US-UG-003] – Unterlagen nachreichen
- [US-UG-004] – Rückfrage verstehen und beantworten
- [US-UG-005] – Verfahrensverlauf nachvollziehen
