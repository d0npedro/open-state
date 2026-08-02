# Queue-Archiv

Historische DONE-Einträge der Delivery-Queue. **Kein Pflichtlesen** im Agenten-Loop.

| Datei | Inhalt |
|-------|--------|
| [`DONE_Q001-Q300.md`](DONE_Q001-Q300.md) | Snapshot vor Split (Q-301): alle Prioritätsblöcke, DONE-Zeilen, Abgeschlossene Iterationen bis Q-300 |

## Regel

- Aktive Arbeit: nur [`docs/NEXT_STEPS_QUEUE.md`](../../NEXT_STEPS_QUEUE.md)
- In der aktiven Queue höchstens die letzten ~10 DONE-Einträge (Tail)
- Nach Meilensteinen (Domäne stabil, Phase-Abschluss): weitere DONE-Blöcke hier ablegen
- Inhalt archivieren, nicht löschen (Commit-Hashes bleiben nachschlagbar)

Siehe Anti-Growth-Policy in [`docs/REPO_REFACTORING_PLAN.md`](../../REPO_REFACTORING_PLAN.md) §4.
