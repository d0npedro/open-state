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

→ `docs/NEXT_STEPS_QUEUE.md` (aktive Arbeitsliste: `OFFEN` / `IN_ARBEIT` / `BLOCKIERT` + kurzer DONE-Tail)

Den obersten Eintrag mit Status `OFFEN` identifizieren.
Prüfen: Ist dieser Schritt jetzt implementierbar? Gibt es fehlende Abhängigkeiten?

Wenn nicht implementierbar → nächsten offenen Schritt wählen, Grund für Überspringen notieren.

**DONE-Historie:** nicht in der aktiven Queue nachschlagen — → `docs/delivery/queue-archive/`
(Index: `docs/delivery/queue-archive/README.md`). Agenten lesen das Archiv nur bei Bedarf
(Commit-Hash, Abhängigkeitskette), nicht in jedem Lauf.

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
cd demo && npm run lint && npm run build
```

Lint und Build müssen erfolgreich sein, bevor committet wird.
Kein Commit mit fehlschlagendem Lint/Build.
Bei reinen Docs ohne Demo-Änderung: vor **Push** trotzdem lint+build ausführen (Push-Pflicht, siehe Schritt 12).

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
Commit-Hash eintragen (im DONE-Tail oder in der Status-Zelle).
Falls sich neue Folgeschritte ergeben haben → ergänzen.
DONE-Tail auf ca. die letzten ~10 Einträge begrenzen; ältere DONE → bei Meilenstein nach
`docs/delivery/queue-archive/` auslagern (nicht löschen).

---

### Schritt 9 – BUILD_STATE.md aktualisieren

**Nur Delta (DEC-013 / Anti-Growth):**
1. Kopfzeile „Zuletzt aktualisiert“
2. Betroffene Route- oder Logik-Zeile **kurz** anpassen (kein Feature-Roman)
3. Echte neue Lücke ergänzen bzw. erledigte Lücke **entfernen** (nicht durchstreichen)

Kein „Q-xxx erledigt“-Anhang. Kein vollständiges Neuschreiben. Detailhistorie = `git log`.

---

### Schritt 10 – Summary-Datei (optional, bei größeren Änderungen)

Bei größeren Themenblöcken: kurzen Eintrag im `DECISION_LOG.md` **oder**
eine Datei unter `archive/rewrites/` (nicht im Repo-Root).
Inhalt: was wurde gemacht, welche Dateien, welche Logik, offene Punkte.
Nicht bei jedem kleinen Schritt nötig. Keine neuen `REPO_REWRITE_SUMMARY_*.md` im Root
(Historie: `archive/rewrites/`, siehe Q-300 / Anti-Growth-Policy).

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

# Pflicht: CI-äquivalent (Build Check auf GitHub)
cd demo && npm run lint && npm run build

# Nur bei Exit-Code 0 pushen
git push
```

Ein Push erfolgt ausschließlich nach erfolgreichem Commit **und** grünem `lint` + `build`.
Kein Push bei fehlgeschlagenem Lint/Build, uncommitteten push-relevanten Änderungen oder ohne Nutzeranweisung.

**Dauerbetrieb:** Nach `git push origin main` überwacht der **CI-Watcher** (alle 5 min) GitHub Actions Build Check.
Bei Failure: Logs, lokal reproduzieren, fixen, committen, erneut pushen (kein force). Siehe `docs/loops/MULTI_LOOP_BETRIEB.md`.

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

## Anti-Growth-Regeln (DEC-013)

Verbindlich für jeden Iterationslauf. Kurz in `AGENTS.md`, Begründung in `DECISION_LOG.md` (DEC-013), ausformulierte Policy in `docs/REPO_REFACTORING_PLAN.md` §4.

| # | Regel |
|---|--------|
| A1 | Keine neuen Root-`REPO_REWRITE_SUMMARY_*.md` → `archive/rewrites/` oder DEC |
| A2 | Domain-Journals: max. 15 aktive Iterationen; Rest → `archive/journals/` |
| A3 | Aktive Queue: DONE-Tail ≤ ~10; ältere DONE → `docs/delivery/queue-archive/` |
| B4 | BUILD_STATE = Ist, nicht Verlauf; Richtgröße kompakt (~15–20 KB) |
| B5 | Queue = Arbeitsliste, kein Changelog |
| B6 | DECISION_LOG nur echte Entscheidungen (Trade-offs), keine Feature-Notizen |
| C7 | Neues Top-Level-Doc/Ordner nur mit DEC + `docs/README.md`-Eintrag |
| C8 | Eine führende Quelle pro Thema; zweite Datei Stub oder generiert |
| C9 | Keine neuen nummerierten Module `16_…` unter `docs/` |
| D10 | Neue Domäne = `docs/domains/` + `docs/stories/` + optional Demo-Slice |
| D11 | Story-Registry: nur `storyRegistry.ts` manuell; `npm run registry:export` |
| D12 | Nach DEMO-stabil (Kriterien DEC-013): kein Micro-Feinschliff ohne Produktlücke/Bug |
| E13 | Pro Iteration minimale Steuerdatei-Edits (Queue + knappes BUILD_STATE) |
| E14 | Kein Rewrite-Summary als Iterations-Abschlussritual |
| E15 | Analyse-only → ein Doc unter `docs/`, nicht Root-Summary-Sammlung |

**Queue-Gestaltung:** Micro-Paritäten (z. B. Countdown-Chips AV↔UG) bündeln oder als benannte Serie mit klarem Stopp — nicht 20 Einzel-Q à 15 Min ohne Nutzengrenze.

**Pflichtlektüre pro Lauf:** aktive Queue + kurzes BUILD_STATE + relevante DEC — nicht Archiv, nicht Journals (außer Multi-Loop).

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
