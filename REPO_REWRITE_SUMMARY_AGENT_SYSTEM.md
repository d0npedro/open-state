# Repo Summary: Agenten-Betriebssystem v2

Vollständige Überarbeitung des repo-internen Delivery- und Agentensystems.
Alle fünf Steuerdateien wurden auf den aktuellen Projektstand gebracht
und inhaltlich geschärft. Die Theme-Architektur ist vollständig erfasst.

---

## Neu erstellte oder vollständig überarbeitete Dateien

| Datei | Änderung |
|-------|---------|
| `AGENTS.md` | Pflichtlektüre-Tabelle ergänzt, DECISION_LOG in Minimalbefehl aufgenommen, Prinzip Fachlogik/Darstellung-Trennung ergänzt, Entscheidungsverhalten-Tabelle, Steuerdatei-Übersicht |
| `docs/DELIVERY_SYSTEM.md` | DECISION_LOG als Schritt 4 integriert, Schritt 10 (Summary) als optional markiert, Umgang mit Unsicherheit präzisiert, „Was Entwickle weiter bedeutet"-Abschnitt |
| `docs/NEXT_STEPS_QUEUE.md` | Vollständige Neustrukturierung: Theme-Arbeit als DONE markiert, Q-051/Q-052/Q-053 ergänzt (arc42 Theme, CLAUDE.md Update), Priorisierungslogik-Abschnitt hinzugefügt |
| `docs/BUILD_STATE.md` | Design System vollständig erfasst (4 Themes, Density Modes, ThemeSwitcher, Anti-Flash), Story-System-Tabelle mit Inkonsistenz-Hinweis, Deployment-Routen vollständig |
| `docs/DECISION_LOG.md` | DEC-010 (Theme-Architektur als visuelle Querschnittskomponente), DEC-011 (Agenten-Betriebssystem), offene Entscheidungen aktualisiert |
| `README.md` | Abschnitt „Repo-internes Delivery-System" mit Tabelle der 5 Steuerdateien und Hinweis auf Minimalbefehl |

---

## Agentenlogik: Wie „Entwickle weiter" funktioniert

```
1. git log --oneline -5 && git status --short
2. docs/BUILD_STATE.md lesen
3. docs/NEXT_STEPS_QUEUE.md lesen → obersten OFFEN-Eintrag wählen
4. docs/DECISION_LOG.md prüfen
5. AGENTS.md lesen (falls noch nicht gelesen)
6. Schritt direkt im Repo implementieren
7. cd demo && npm run build (wenn Codepfad betroffen)
8. Betroffene Dokumentation gezielt aktualisieren
9. Queue aktualisieren: Schritt auf DONE
10. BUILD_STATE.md aktualisieren
11. Commit erstellen (kein Push)
12. Ergebnis strukturiert ausgeben
```

---

## Aktuelle Top-Prioritäten aus der Queue

| ID | Schritt | Aufwand |
|----|---------|---------|
| Q-001 | Story-Datei `US-AV-008` in docs/stories/ anlegen | S |
| Q-002 | storyRegistry.ts um US-KJ-001–010 erweitern | S |
| Q-003 | `/stories`-Seite mit Domänen-Gruppierung | M |
| Q-004 | Fairness-Regeln: echte Datumsberechnung | S |
| Q-010 | Stories für Unternehmensgründung anlegen | M |
| Q-013 | Demo-Routen `/gruendung` anlegen | L |

---

## Getroffene Entscheidungen (neu in diesem Durchlauf)

| DEC | Entscheidung |
|-----|-------------|
| DEC-010 | Theme-Architektur ist rein visuell — kein Einfluss auf Fachlogik |
| DEC-011 | Agenten-Betriebssystem als verbindliche Steuerungsebene |

---

## Was das System nicht ist

- Kein Ersatz für fachliche Domänenprüfung durch Experten
- Kein Automatismus für rechtliche Entscheidungen
- Kein Garant für Vollständigkeit — es steuert Reihenfolge, nicht Anforderungsniveau
- Kein Freischein für unkontrollierte Erweiterungen ohne Queue-Eintrag
