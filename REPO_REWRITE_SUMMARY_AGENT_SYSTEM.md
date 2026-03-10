# Repo Summary: Agent-Betriebssystem

Einführung eines dauerhaft nutzbaren Agenten-Betriebssystems für die kontrollierte
Weiterentwicklung von Open State. Ab jetzt genügt der Befehl „Entwickle weiter",
damit ein Agent sinnvoll, strukturiert und committet weiterarbeitet.

---

## Neu erstellte Dateien

| Datei | Zweck |
|-------|-------|
| `AGENTS.md` | Projektprinzipien, Minimalbefehl „Entwickle weiter", Agenten-Rollendefinition |
| `docs/DELIVERY_SYSTEM.md` | Verbindlicher 10-Schritte-Ablauf jeder Iteration |
| `docs/BUILD_STATE.md` | Aktueller Projektzustand: Demo, Routen, Dokumentation, Lücken |
| `docs/NEXT_STEPS_QUEUE.md` | 30+ priorisierte Schritte in 7 Prioritätsstufen |
| `docs/DECISION_LOG.md` | 9 dokumentierte Architekturentscheidungen, offene Entscheidungen |
| `REPO_REWRITE_SUMMARY_AGENT_SYSTEM.md` | Diese Datei |

---

## Agentenlogik: Wie „Entwickle weiter" funktioniert

```
1. git log + git status → Repo-Stand verstehen
2. BUILD_STATE.md lesen → Was existiert tatsächlich?
3. NEXT_STEPS_QUEUE.md lesen → Obersten OFFEN-Eintrag wählen
4. Einen Schritt implementieren (Dateien ändern, Code schreiben)
5. npm run build → Build muss grün sein
6. Betroffene Docs gezielt aktualisieren
7. Queue-Status auf DONE setzen
8. BUILD_STATE.md aktualisieren
9. Summary-Datei anlegen/ergänzen
10. Commit (kein Push)
```

---

## Aktuelle Top-Prioritäten aus der Queue

| ID | Schritt | Aufwand |
|----|---------|---------|
| Q-001 | Story-Datei US-AV-008 anlegen | S |
| Q-002 | storyRegistry.ts um KJ-Stories erweitern | S |
| Q-003 | /stories-Seite mit Domänen-Gruppierung | M |
| Q-004 | Fairness-Fristen mit echtem Datum berechnen | S |
| Q-010 | Stories für Unternehmensgründung anlegen | M |
| Q-013 | Demo-Routen /gruendung anlegen | L |

---

## Was das System nicht ist

- Kein Ersatz für fachliche Domänenprüfung
- Kein Automatismus für rechtliche Entscheidungen
- Kein Garant für vollständige Qualität – es steuert Reihenfolge, nicht Anforderungsniveau
