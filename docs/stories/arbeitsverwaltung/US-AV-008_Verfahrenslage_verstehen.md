# US-AV-008 – Verfahrenslage verstehen

**Story-ID:** US-AV-008
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich verständliche Hinweise zur aktuellen Verfahrenslage meines Falls sehen
damit ich weiß, warum der Fall stockt oder was als Nächstes zu tun ist – ohne die Sachbearbeitung anrufen zu müssen.

---

## Kontext

Viele Bürger verstehen den Status ihres Falls nicht: Eine offene Rückfrage, fehlende Unterlagen oder ein fristkritischer Bescheid bleiben unsichtbar, solange sie nicht aktiv gesucht werden. Statuscodes allein erklären nicht, was das für den Bürger bedeutet. Open State leitet aus dem Fallzustand regelbasierte Hinweise ab – mit Erklärung, Auswirkung und nächstem Schritt. Die Hinweise bewerten keine Person und treffen keine Entscheidung; sie machen die Verfahrenslage erklärbar.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Sofortige Orientierung: Was trifft zu? Was muss ich tun? Was passiert, wenn ich nichts tue? |
| **Verwaltungswert** | Weniger Status- und Verständnistelefonate; klarere Mitwirkung der Bürger |
| **Transparenzwert** | Jeder Hinweis ist aus Falldaten ableitbar und methodisch nachvollziehbar – kein Blackbox-Urteil |

---

## Akzeptanzkriterien

1. Die Seite zeigt aus dem Fallzustand abgeleitete Hinweise (z. B. offene Rückfrage mit Fristlage, fehlende Unterlagen, bescheidbezogene Hinweise).
2. Jeder Hinweis enthält mindestens: Titel, Erklärung, Auswirkung und nächsten sinnvollen Schritt.
3. Hinweise sind nach Priorität unterscheidbar (z. B. relevant / Hinweis / Info).
4. Die Seite macht kenntlich, dass Hinweise keine Entscheidung der Sachbearbeitung ersetzen.
5. Nach einer Bürgeraktion, die den Fallzustand ändert (z. B. Rückfrage beantwortet), aktualisiert sich die Hinweisliste entsprechend (Demo: interaktiver State).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Hinweise vorhanden | Regelwerk liefert Signale | FairnessPanel / Hinweislisten nach Priorität |
| Keine Hinweise | Fallzustand ohne Auffälligkeit | Erfolgs-/Neutralmeldung „Keine Hinweise“ |
| Regelwerk reagiert | Signal entfällt nach Aktion | Banner „Regelwerk hat reagiert“ mit Erklärung |
| Methodik | Nutzer will Herkunft verstehen | Erklärblock: Ableitung aus Falldaten, keine KI-Entscheidung |

---

## Nicht-Ziele

- Keine automatische Leistungsentscheidung und keine Priorisierung von Fällen für die Verwaltung.
- Keine personenbezogene Bewertung (kein Scoring, kein Profiling).
- Keine Rechtsberatung; Hinweise sind Informationsleistung.

---

## Offene fachliche Fragen

- Welche Signaltypen sind bundesweit einheitlich sinnvoll, welche domänenspezifisch?
- Ab welchen Fristen-Schwellen gilt ein Hinweis als „relevant“ vs. „Hinweis“?

---

## Rechtliche / Policy-Offenheit

- Regelbasierte Hinweise müssen datenschutzkonform und diskriminierungsfrei bleiben.
- Abgrenzung zu behördlichen Verwaltungsakten und formellen Mitteilungen ist zu wahren.

---

## Relevante Screens / Komponenten

- Demo-Route `/fall/hinweise`
- `demo/components/fairness/FairnessPanel.tsx`
- `demo/lib/fairness/rules.ts`
- Story-Badge US-AV-008

---

## Technische Anschlussstellen

- `berechneFairnessSignale(fall)` – regelbasierte Ableitung
- `DemoStateContext` – interaktiver Fallzustand
- Typen: `FairnessSignal` in `demo/types/fairness.ts`
- Mock: `demo/data/mockFall.ts`

---

## Verwandte Stories

- [US-AV-002] – Status einsehen
- [US-AV-003] – Unterlagen nachreichen
- [US-AV-004] – Rückfrage verstehen
- [US-AV-006] – Bescheid verstehen
