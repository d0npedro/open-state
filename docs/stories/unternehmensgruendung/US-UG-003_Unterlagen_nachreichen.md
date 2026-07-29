# US-UG-003 – Unterlagen nachreichen

**Story-ID:** US-UG-003
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich fehlende oder ergänzende Unterlagen gezielt nachreichen können
damit jede Anforderung mit Begründung, Frist und Rechtsgrundlage nachvollziehbar ist und ich nicht raten muss, was genau fehlt.

---

## Kontext

Dokumentenanforderungen sind in Gründungsverfahren häufig und oft unklar formuliert: Welches Dokument? In welchem Format? Warum? Bis wann? Was passiert, wenn es fehlt? Ohne erklärten Kontext entstehen Mehrfachuploads, unvollständige Einreichungen und Verzögerungen. Open State macht jede Anforderung transparent und den Status je Dokument sichtbar.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Konkrete, begründete Anforderungen statt Pauschallisten |
| **Verwaltungswert** | Vollständigere Einreichungen, weniger Nachforderungen |
| **Transparenzwert** | Dokumentenstatus und Bearbeitungsstand sind nachvollziehbar |

---

## Akzeptanzkriterien

1. Jede Dokumentenanforderung zeigt Bezeichnung, anfordernde Behörde und Status.
2. Begründung und/oder Rechtsgrundlage sind je Anforderung sichtbar (sofern im Datenmodell vorhanden).
3. Fristen sind als Datum dargestellt, wenn behördlich gesetzt.
4. Der Status je Dokument ist in Klartext erkennbar (z. B. angefordert, eingereicht, geprüft, akzeptiert, abgelehnt).
5. Bei Ablehnung ist ein Grund bzw. Hinweis zur erneuten Einreichung sichtbar (sofern vorhanden).
6. Bereits akzeptierte Dokumente bleiben in der Liste nachvollziehbar (keine „Verschwinden“-Logik).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Angefordert | Behörde wartet auf Upload | Status „angefordert“, ggf. Frist |
| Eingereicht | Dokument übermittelt, Prüfung offen | Status „eingereicht“ / „in Prüfung“ |
| Akzeptiert | Prüfung erfolgreich | Erfolgsstatus |
| Abgelehnt | Dokument ungeeignet | Ablehnungsgrund + Hinweis zur Nachreichung |
| Leerzustand | Keine Dokumente im Vorgang | Erklärender Leerzustand |

---

## Nicht-Ziele

- Keine vollautomatische inhaltliche Rechtsprüfung von Dokumenten durch KI.
- Keine dauerhafte Speicherung echter personenbezogener Dokumente in der Demo (Mock-Daten).
- Kein Ersatz für notarielle oder beglaubigte Originale, wo das Gesetz sie verlangt.

---

## Offene fachliche Fragen

- Welche Dokumenttypen sind für Standard-Gewerbeanmeldungen bundesweit einheitlich?
- Welche technischen Vorprüfungen (Dateityp, Lesbarkeit) sind fachlich und rechtlich zulässig?

---

## Rechtliche / Policy-Offenheit

- Zweckbindung: Dokumente nur für den angegebenen Verwaltungszweck.
- Aufbewahrungsfristen und Löschkonzept je Behörde / Vorgangstyp sind noch zu spezifizieren.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung/dokumente`
- Dokumentenkarten mit Status und Begründung
- Verknüpfung von Dokumentanforderungen mit Behörden-IDs

---

## Technische Anschlussstellen

- `GET /api/v1/gruendung/{id}/dokumente`
- `POST /api/v1/gruendung/{id}/dokumente` – Upload / Nachreichung (Konzept)
- Mock-Feld `dokumente` in `demo/data/mockGruendungsfall.ts`

---

## Verwandte Stories

- [US-UG-001] – Gründungsstatus einsehen
- [US-UG-002] – Beteiligte Behörden einsehen
- [US-UG-004] – Rückfrage verstehen und beantworten
