# DELIVERY_SYSTEM.md – Verbindlicher Iterationsablauf

Jede Iteration – ob durch expliziten Befehl oder durch „Entwickle weiter" ausgelöst –
folgt exakt diesem Ablauf. Abweichungen müssen begründet und dokumentiert werden.

---

## Schritt-für-Schritt-Ablauf

### 1. Repo-Stand prüfen

```bash
git log --oneline -5
git status --short
```

Verstehen: Was ist zuletzt passiert? Gibt es uncommittete Änderungen?
Wenn uncommittete Änderungen vorhanden sind: klären, ob sie zum nächsten Schritt gehören oder ein früherer unfertige Zustand sind.

### 2. BUILD_STATE.md lesen

→ `docs/BUILD_STATE.md`

Verstehen:
- Welche Domänen sind dokumentiert / implementiert?
- Welche Demo-Routen existieren?
- Was ist der letzte abgeschlossene Stand?
- Welche bekannten Blockierungen existieren?

### 3. NEXT_STEPS_QUEUE.md lesen

→ `docs/NEXT_STEPS_QUEUE.md`

Den obersten Eintrag mit Status `OFFEN` identifizieren.
Prüfen: Ist dieser Schritt jetzt implementierbar? Gibt es Abhängigkeiten, die noch fehlen?

Wenn nicht implementierbar: nächsten offenen Schritt wählen und den Grund für Überspringen dokumentieren.

### 4. Einen Schritt wählen und umsetzen

Maximal einen Schritt pro Iteration.
Implementierung direkt im Repository:
- Dateien erstellen oder anpassen
- Typen, Logik, UI, Docs – je nach Schritt

Nicht: Analysieren und eine Vorschlagsliste liefern.
Nicht: Mehrere Schritte parallel abarbeiten (außer explizit beauftragt).

### 5. Build prüfen (wenn Codepfad betroffen)

```bash
cd demo && npm run build
```

Build muss erfolgreich sein, bevor committet wird.
Kein Commit mit fehlschlagendem Build.

### 6. Dokumentation gezielt aktualisieren

Nur die Dokumentation, die sich durch den Schritt verändert hat:
- Betroffene Story-Datei (Status, implementierte Kriterien)
- Betroffene Domänen-README (wenn neue Komponenten hinzugekommen)
- `CLAUDE.md`, wenn sich Architekturwissen ändert

Kein Masserewrite von nicht betroffener Dokumentation.

### 7. NEXT_STEPS_QUEUE.md aktualisieren

Den abgeschlossenen Schritt auf `DONE` setzen.
Gegebenenfalls Folgeschritte ergänzen, die sich aus der Umsetzung ergeben haben.

### 8. BUILD_STATE.md aktualisieren

Neue Zeilen oder Änderungen dort, wo sich der Zustand verändert hat.
Kein vollständiges Neuschreiben – nur Delta.

### 9. REPO_REWRITE_SUMMARY_<THEMA>.md

Neue Datei anlegen oder bestehende ergänzen.
Inhalt: was wurde gemacht, welche Dateien, welche Logik, offene Punkte.

### 10. Commit erstellen

```bash
git add <betroffene Dateien>
git commit -m "typ: kurze beschreibung

Details falls nötig.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Commit-Typen: `feat` / `fix` / `docs` / `chore` / `refactor`

Kein Push.

---

## Entscheidungsregeln

| Situation | Verhalten |
|-----------|----------|
| Schritt in Queue ist unklar | Klärung einholen, nicht raten |
| Schritt in Queue ist zu groß | In Teilschritte aufteilen, Queue aktualisieren |
| Build schlägt fehl | Fehler beheben, kein Commit bis grün |
| Schritt wurde teils gemacht | Fortführen bis vollständig, dann committen |
| Nächster Schritt ist blockiert | Übernächsten wählen, Blockierung dokumentieren |

---

## Erlaubte Abweichungen

Ein Agent darf von der Queue abweichen, wenn:
1. Der Nutzer explizit einen anderen Schritt benennt
2. Ein kritischer Fehler im bestehenden Code gefunden wird, der zuerst behoben werden muss
3. Ein Schritt eine unentdeckte Voraussetzung hat, die zuerst erfüllt sein muss

Jede Abweichung muss in `docs/DECISION_LOG.md` dokumentiert werden.

---

## Was dieser Ablauf nicht ist

- Kein Ersatz für fachliche Prüfung durch Domänenexperten
- Kein Automatismus für rechtliche oder datenschutzrechtliche Entscheidungen
- Kein Garant für Vollständigkeit – der Ablauf steuert Umsetzungsreihenfolge, nicht Qualitätsanforderungen
