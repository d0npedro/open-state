# AGENTS.md – Open State Agenten-Betriebssystem

Dieses Dokument definiert die Arbeitsweise für jeden Agenten (Claude Code oder vergleichbar),
der in diesem Repository weiterentwickelt. Es ist verbindlich für jede Iteration.

---

## Minimalbefehl: „Entwickle weiter"

Wenn dieser Befehl kommt, führt der Agent folgendes aus:

1. `docs/BUILD_STATE.md` lesen – aktuellen Projektstand verstehen
2. `docs/NEXT_STEPS_QUEUE.md` lesen – den obersten nicht abgeschlossenen Schritt identifizieren
3. Schritt als sinnvoll und umsetzbar prüfen (passt er zum Build-State? Gibt es Blockerkennung?)
4. Genau diesen einen Schritt implementieren
5. Build prüfen (wenn Codepfad betroffen: `npm run build` im `demo/`-Verzeichnis)
6. Betroffene Dokumentation gezielt aktualisieren (kein Masserewrite)
7. `docs/NEXT_STEPS_QUEUE.md` aktualisieren (Schritt auf DONE setzen)
8. `docs/BUILD_STATE.md` aktualisieren
9. `REPO_REWRITE_SUMMARY_<THEMA>.md` anlegen oder aktualisieren
10. Commit erstellen

Kein Push ohne ausdrückliche Anweisung.
Keine Schritt-Überspringung ohne dokumentierten Grund.

---

## Projektprinzipien

### Direkte Repo-Arbeit

Kein Agent liefert nur Analyse oder Ideenlisten.
Jede Iteration endet mit tatsächlichen Dateiänderungen und einem Commit.

### Ein Schritt pro Iteration

Jede Iteration bearbeitet genau einen gut abgegrenzten Arbeitspaket.
Kein Erzwingen mehrerer Schritte in einem Durchlauf, außer der Scope ist explizit im Befehl.

### Story-Driven Development

Jede sichtbare Funktion in der Demo ist auf eine User Story zurückführbar.
Neue Screens brauchen eine Story-ID. Stories ohne Screen-Implementierung sind Konzept, nicht Demo.

### Transparenz als Pflicht

- Jedes Signal, jede Kennzahl, jede Entscheidung im System muss erklärbar sein.
- Begründungen sind Teil des Systems – nicht nachträgliches Kommentar.
- Methodik ist immer sichtbar, nie versteckt.

### KI nur als Assistenz

Kein Modul trifft Entscheidungen autonom.
KI-Unterstützung ist erlaubt. Entscheidungsverantwortung bleibt beim Menschen.

### Keine Werbung, keine Startup-Sprache

Kein „disruptiv", kein „revolutionär", kein „game-changer".
Sachliche, ruhige Beschreibung staatlicher Infrastruktur.

### Keine Zeitplan-Rhetorik

Keine Commitments auf Liefertermine. Keine Roadmap-Sprache wie „in Q2 fertig".
Was fertig ist, ist fertig. Was offen ist, ist offen.

### Datenschutz als Designprinzip

Kindeswohl und personenbezogene Daten haben höchste Schutzstufe.
Datenverarbeitung folgt dem Zweckbindungsprinzip.

### Commit-Pflicht

Jede Iteration endet mit einem Commit. Kein Floating-State.
Commit-Messages folgen dem Conventional Commits Format.

### Kein Push ohne ausdrückliche Anweisung

`git push` wird nie automatisch ausgeführt.

---

## Agenten-Rollendefinition

Ein Agent in diesem Repo ist eine Claude Code Instanz oder ein vergleichbares LLM-Tool,
das direkt im Repository arbeitet und Dateien erstellt, ändert und committet.

Der Agent arbeitet nicht als Berater. Er arbeitet als Entwickler.

---

## Verhältnis zu CLAUDE.md

`CLAUDE.md` enthält technische Projektführung (Build-Befehle, Architektur, Pfade).
`AGENTS.md` enthält die operative Arbeitslogik für jede Iteration.

Beide Dateien ergänzen sich. Bei Widerspruch gilt: `CLAUDE.md` für technische Fragen, `AGENTS.md` für Prozessfragen.
