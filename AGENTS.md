# AGENTS.md – Open State Agenten-Betriebssystem

Dieses Dokument ist verbindliche Arbeitsanweisung für jeden Agenten (Claude Code oder vergleichbar),
der in diesem Repository weiterentwickelt. Es gilt für jede Iteration ohne Ausnahme.

Kein Agent liefert Analysen oder Vorschlagslisten.
Jede Iteration endet mit tatsächlichen Dateiänderungen und einem Commit.

---

## Minimalbefehl: „Entwickle weiter"

Dieser Befehl löst exakt die folgende Sequenz aus:

```
1. git log --oneline -5 && git status --short
2. docs/BUILD_STATE.md lesen
3. docs/NEXT_STEPS_QUEUE.md lesen → obersten OFFEN-Eintrag wählen
4. docs/DECISION_LOG.md lesen → getroffene Entscheidungen berücksichtigen
5. AGENTS.md lesen (falls noch nicht gelesen)
6. Schritt implementieren (Dateien ändern, Code schreiben)
7. cd demo && npm run build (wenn Codepfad betroffen)
8. Betroffene Dokumentation gezielt aktualisieren
9. Queue aktualisieren: Schritt auf DONE
10. BUILD_STATE.md aktualisieren
11. Commit erstellen (kein Push)
12. Ergebnis strukturiert ausgeben
```

Kein Push ohne ausdrückliche Anweisung.
Kein Schritt überspringen ohne dokumentierten Grund.

---

## Pflichtlektüre vor jeder Iteration

| Datei | Zweck |
|-------|-------|
| `docs/BUILD_STATE.md` | Was existiert tatsächlich? Was fehlt? |
| `docs/NEXT_STEPS_QUEUE.md` | Was ist als Nächstes sinnvoll? |
| `docs/DECISION_LOG.md` | Welche Entscheidungen sind bereits getroffen? |
| `CLAUDE.md` | Technische Projektführung, Build-Befehle, Dateistruktur |

---

## Projektprinzipien

### Direkte Repo-Arbeit
Agenten analysieren und handeln. Jede Iteration endet mit konkreten Dateiänderungen und einem Commit.
Kein Durchlauf, der nur Ideen oder Beobachtungen liefert.

### Ein Schritt pro Iteration
Maximal ein gut abgegrenztes Arbeitspaket pro Durchlauf.
Ausnahme nur, wenn der Befehl explizit mehrere Schritte benennt.

### Story-Driven Development
Jede sichtbare Funktion in der Demo führt auf eine User Story zurück.
Neue Screens benötigen eine Story-ID.
Stories ohne Screen-Implementierung sind Konzept, keine Demo.
Story-Lebenszyklus: ENTWURF → BEREIT → IN_ENTWICKLUNG → DEMONSTRIERBAR → ABGESCHLOSSEN

### Transparenz als Pflicht
Jedes Signal, jede Kennzahl, jede Entscheidung muss erklärbar sein.
Begründungen sind Teil des Systems — kein nachträgliches Kommentar.
Methodik ist immer sichtbar.

### KI nur als Assistenz
Kein Modul trifft Entscheidungen autonom.
KI-Unterstützung ist erlaubt. Entscheidungsverantwortung bleibt beim Menschen.

### Fachlogik und Darstellung trennen
Theme- und Designsystem-Entscheidungen haben keinen Einfluss auf Geschäftslogik.
Fachwerte, Statusberechnungen und Regelwerke sind unabhängig von visuellen Einstellungen.

### Keine Werbung, keine Startup-Sprache
Kein „disruptiv", kein „revolutionär", kein „skalieren".
Sachliche Beschreibung staatlicher Infrastruktur.

### Keine Zeitplan-Rhetorik
Keine Liefertermin-Commitments. Keine Q2-Fertigstellungen.
Was fertig ist, ist fertig. Was offen ist, ist offen.

### Datenschutz als Designprinzip
Kindeswohl und personenbezogene Daten haben höchste Schutzstufe.
Datenverarbeitung folgt dem Zweckbindungsprinzip.

### Commit-Pflicht
Jede Iteration endet mit einem Commit. Kein Floating State.
Commit-Messages: Conventional Commits Format (feat / fix / docs / chore / refactor).

### Kein Push ohne ausdrückliche Anweisung
`git push` wird nie automatisch ausgeführt.

---

## Entscheidungsverhalten

| Situation | Verhalten |
|-----------|----------|
| Schritt ist unklar | Klärung einholen – nicht raten |
| Schritt ist zu groß | In Teilschritte aufteilen, Queue aktualisieren |
| Build schlägt fehl | Fehler beheben, kein Commit bis grün |
| Nächster Schritt ist blockiert | Übernächsten wählen, Blockierung in DECISION_LOG dokumentieren |
| Schritt wurde teils gemacht | Fortführen bis vollständig, dann committen |
| Unerwarteter Zustand im Repo | Untersuchen statt überschreiben |

---

## Ergebnisformat

Nach jeder Iteration:

```
1. Was wurde gemacht (1–3 Sätze)
2. Geänderte / neu erstellte Dateien
3. Build-Status
4. Queue-Update (welcher Schritt auf DONE)
5. Commit-Message
6. Commit-Hash
7. Offener nächster Schritt
```

---

## Verhältnis zu anderen Steuerdateien

| Datei | Zuständigkeit |
|-------|--------------|
| `CLAUDE.md` | Technische Projektführung: Build-Befehle, Pfade, Architektur |
| `AGENTS.md` | Operative Arbeitslogik: Wie jede Iteration abläuft |
| `docs/DELIVERY_SYSTEM.md` | Detaillierter 12-Schritte-Ablauf mit Entscheidungsregeln |
| `docs/NEXT_STEPS_QUEUE.md` | Priorisierte Aufgabenliste |
| `docs/BUILD_STATE.md` | Aktueller tatsächlicher Projektstand |
| `docs/DECISION_LOG.md` | Begründete Architektur- und Strategieentscheidungen |

Bei technischen Fragen gilt `CLAUDE.md`. Bei Prozessfragen gilt `AGENTS.md`.
