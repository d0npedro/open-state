# DELIVERY_SYSTEM.md – Verbindlicher Iterationsablauf

Jede Iteration — ob durch expliziten Befehl oder durch „Entwickle weiter" ausgelöst —
folgt exakt diesem Ablauf. Abweichungen müssen begründet und in `docs/DECISION_LOG.md` dokumentiert werden.

---

## Der 12-Schritte-Ablauf

### Schritt 1 – Repo-Stand prüfen

```bash
git log --oneline -5
git status --short
```

Was ist zuletzt passiert? Gibt es uncommittete Änderungen?
Uncommittete Änderungen → klären, ob sie zu diesem Schritt gehören oder ein unfertige vorheriger Zustand sind.

---

### Schritt 2 – BUILD_STATE.md lesen

→ `docs/BUILD_STATE.md`

Verstehen:
- Welche Domänen sind dokumentiert / implementiert?
- Welche Demo-Routen existieren?
- Was ist der tatsächliche letzte abgeschlossene Stand?
- Welche Blockierungen sind bekannt?

---

### Schritt 3 – NEXT_STEPS_QUEUE.md lesen

→ `docs/NEXT_STEPS_QUEUE.md`

Den obersten Eintrag mit Status `OFFEN` identifizieren.
Prüfen: Ist dieser Schritt jetzt implementierbar? Gibt es fehlende Abhängigkeiten?

Wenn nicht implementierbar → nächsten offenen Schritt wählen, Grund für Überspringen notieren.

---

### Schritt 4 – DECISION_LOG.md berücksichtigen

→ `docs/DECISION_LOG.md`

Prüfen, ob der gewählte Schritt getroffene Entscheidungen berührt oder widerspricht.
Wenn eine neue Entscheidung nötig ist → nach der Implementierung dokumentieren.

---

### Schritt 5 – Genau einen Schritt implementieren

Maximal ein gut abgegrenztes Arbeitspaket pro Iteration.
Implementierung direkt im Repository:
- Dateien erstellen oder anpassen
- Typen, Logik, UI, Docs — je nach Aufgabe

Nicht: Eine Analyse liefern und auf Freigabe warten.
Nicht: Mehrere unabhängige Schritte parallel abarbeiten.

---

### Schritt 6 – Build prüfen (wenn Codepfad betroffen)

```bash
cd demo && npm run build
```

Build muss erfolgreich sein, bevor committet wird.
Kein Commit mit fehlschlagendem Build.

---

### Schritt 7 – Dokumentation gezielt aktualisieren

Nur die Dokumentation, die sich durch den Schritt tatsächlich verändert hat:
- Betroffene Story-Datei (Status, implementierte Akzeptanzkriterien)
- Betroffene Domänen-README (wenn neue Komponenten hinzugekommen sind)
- `CLAUDE.md` (wenn sich Architekturwissen ändert)
- `docs/DECISION_LOG.md` (wenn neue Entscheidung getroffen wurde)

Kein Massen-Rewrite nicht betroffener Dokumentation.

---

### Schritt 8 – NEXT_STEPS_QUEUE.md aktualisieren

Abgeschlossenen Schritt auf `DONE` setzen.
Commit-Hash eintragen.
Falls sich neue Folgeschritte ergeben haben → ergänzen.

---

### Schritt 9 – BUILD_STATE.md aktualisieren

Neue Zeilen oder Änderungen dort, wo sich der Zustand verändert hat.
Kein vollständiges Neuschreiben — nur das Delta.
Datum / letzten Commit-Bezug aktualisieren.

---

### Schritt 10 – Summary-Datei (optional, bei größeren Änderungen)

Bei größeren Themenblöcken: `REPO_REWRITE_SUMMARY_<THEMA>.md` anlegen oder ergänzen.
Inhalt: was wurde gemacht, welche Dateien, welche Logik, offene Punkte.
Nicht bei jedem kleinen Schritt nötig.

---

### Schritt 11 – Commit erstellen

```bash
git add <exakt die betroffenen Dateien>
git commit -m "$(cat <<'EOF'
typ: kurze beschreibung was sich geändert hat

Details falls nötig. Warum, nicht nur Was.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Commit-Typen: `feat` / `fix` / `docs` / `chore` / `refactor`

---

### Schritt 12 – Push (nur bei ausdrücklicher Nutzeranweisung)

**Standard:** kein Push. Commit bleibt lokal.

**Mit ausdrücklicher Push-Anweisung:**

```bash
# Vor dem Push: Branch und letzten Commit prüfen
git status --short
git log --oneline -1

# Pushen
git push
```

Ein Push erfolgt ausschließlich nach erfolgreichem Commit.
Kein Push bei fehlgeschlagenem Build, uncommitteten Änderungen oder ohne Nutzeranweisung.

Erkannte Push-Trigger: „pushe", „push", „committe und pushe", „auf GitHub hochladen",
„online bringen", „Entwickle weiter und pushe", „Committe und pushe am Ende."

---

### Schritt 13 – Ergebnis strukturiert ausgeben

**Standardlauf (kein Push):**
```
1. Was wurde gemacht (1–3 Sätze)
2. Geänderte / neu erstellte Dateien
3. Build-Status
4. Queue-Update
5. Commit-Message
6. Commit-Hash
7. Offener nächster Schritt
```

**Lauf mit Push:**
```
1. Was wurde gemacht (1–3 Sätze)
2. Geänderte / neu erstellte Dateien
3. Build-Status
4. Queue-Update
5. Commit-Message
6. Commit-Hash
7. Branch
8. Push-Ergebnis
9. Offener nächster Schritt
```

---

## Entscheidungsregeln für Sondersituationen

| Situation | Verhalten |
|-----------|----------|
| Schritt in Queue ist unklar | Klärung einholen — nicht raten |
| Schritt in Queue ist zu groß | In Teilschritte aufteilen, Queue aktualisieren |
| Build schlägt fehl | Fehler beheben, kein Commit bis grün |
| Schritt wurde teils gemacht | Fortführen bis vollständig, dann committen |
| Nächster Schritt ist blockiert | Übernächsten wählen, Blockierung dokumentieren |
| Unerwartete Datei oder Branch gefunden | Untersuchen statt löschen oder überschreiben |
| Neue Entscheidung nötig | Implementieren, dann DECISION_LOG ergänzen |

---

## Umgang mit Unsicherheit

Wenn ein Schritt unklar ist:
- Nicht raten
- Nicht einen anderen Schritt beginnen, um Aktivität zu simulieren
- Frage stellen oder nächst-klaren Schritt aus Queue nehmen

Wenn ein Schritt zu groß wirkt:
- Aufteilen
- Ersten Teilschritt ausführen
- Queue mit den neuen Teilschritten aktualisieren

---

## Wie Steuerbefehle interpretiert werden

| Befehl | Commit | Push |
|--------|--------|------|
| „Entwickle weiter" | ✓ | ✗ |
| „Entwickle weiter und pushe" | ✓ | ✓ |
| „Entwickle weiter. Committe und pushe am Ende." | ✓ | ✓ |
| „pushe" / „push" (nach vorherigem Commit) | — | ✓ |
| „committe und pushe" | ✓ | ✓ |
| „auf GitHub hochladen" | ✓ | ✓ |
| „online bringen" | ✓ | ✓ |

### „Entwickle weiter" (Standardlauf)

1. Repo-Stand lesen
2. BUILD_STATE.md lesen
3. NEXT_STEPS_QUEUE.md → obersten OFFEN-Eintrag nehmen
4. DECISION_LOG.md prüfen
5. Schritt direkt im Repo umsetzen
6. Build prüfen
7. Queue und BUILD_STATE aktualisieren
8. Committen — **kein Push**

Bedeutet ausdrücklich nicht:
- Einen neuen Themenblock beginnen, der nicht in der Queue steht
- Mehrere Schritte gleichzeitig abarbeiten
- Push ausführen
- Bloße Analyse liefern

### „Entwickle weiter und pushe" (Lauf mit Push)

Identisch wie Standardlauf, zusätzlich nach Commit:

9. Branch und Commit-Status prüfen (`git status`, `git log --oneline -1`)
10. `git push` ausführen
11. Push-Ergebnis im Ausgabeformat melden

---

## Was dieser Ablauf nicht ist

- Kein Ersatz für fachliche Prüfung durch Domänenexperten
- Kein Automatismus für rechtliche oder datenschutzrechtliche Entscheidungen
- Kein Garant für Vollständigkeit — der Ablauf steuert Reihenfolge, nicht Qualitätsanforderungen
- Kein Freischein für eigenmächtiges Scope-Creep
