# Repo Summary: Agenten-Betriebssystem v3

Vollständige Überarbeitung des repo-internen Delivery- und Agentensystems (v2),
gefolgt von einer hebelorientierten Repriorisierung der Queue (v3).
Alle fünf Steuerdateien spiegeln den tatsächlichen Produktstand wider.
Die Queue ist jetzt nach sichtbarem Demo-Wert sortiert, nicht nach Dokumentationsnähe.

---

## Neu erstellte oder vollständig überarbeitete Dateien

### v2 (vollständige Überarbeitung)

| Datei | Änderung |
|-------|---------|
| `AGENTS.md` | Pflichtlektüre-Tabelle, DECISION_LOG in Minimalbefehl, Entscheidungsverhalten-Tabelle, Steuerdatei-Übersicht |
| `docs/DELIVERY_SYSTEM.md` | DECISION_LOG als Schritt 4, Umgang mit Unsicherheit, „Was Entwickle weiter bedeutet" |
| `docs/DECISION_LOG.md` | DEC-010 (Theme als visuell), DEC-011 (Agentensystem) |
| `README.md` | Abschnitt „Repo-internes Delivery-System" mit Tabelle |

### v3 (hebelorientierte Queue-Repriorisierung)

| Datei | Änderung |
|-------|---------|
| `docs/NEXT_STEPS_QUEUE.md` | Vollständige Neuordnung: 9 Prioritätsstufen nach Demo-Wert, nicht Dokumentationsnähe. Stabile Bausteine-Abschnitt hinzugefügt. Q-001 von Prio 1 auf Prio 5. Q-031 von Prio 4 auf Prio 2. Kita-Berichtsschicht von Prio 3 auf Prio 3 (inhaltlich geschärft). Q-010 Abhängigkeit für UG-Demo entfernt. |
| `docs/BUILD_STATE.md` | Bekannte-Lücken-Tabelle hebelorientiert: Demo-Auswirkung als Spalte statt Prioritätstext |

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

## Aktuelle Top-Prioritäten (hebelorientiert)

| Prio | ID | Schritt | Aufwand | Begründung |
|------|----|---------|---------|-----------|
| 1 | Q-004 | Fairness-Fristen: echte Datumsberechnung | S | Glaubwürdigkeit der Regeln |
| 2 | Q-031 | React State: echte Demo-Interaktion | M | Größter Qualitätssprung |
| 2 | Q-032 | Hinweisseite reagiert auf State-Wechsel | S | Demonstriert Regelwerk live |
| 3 | Q-020 | Kita Mock-Daten | M | Fundament für Berichtsschicht |
| 3 | Q-022 | Öffentliche Kita-Report-Route | L | Einzigartiger Demo-Inhalt |
| 4 | Q-011 | UG Mock-Daten | M | Zweite Domäne sichtbar machen |
| 4 | Q-013 | UG Demo-Routen | L | Plattformgedanke klickbar |

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
