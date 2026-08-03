# loop-state – Autonomer Multi-Domain-Loop

Maschinen- und agentenlesbarer Kurzstand. **Pro Fire aktualisieren.**  
Regeln: `docs/delivery/AUTONOMOUS_LOOP.md`.  
Session-Einstieg: `docs/delivery/SESSION_HANDOFF.md`.

| Feld | Wert |
|------|------|
| `next_domain` | `av` |
| `last_domain` | `cross` |
| `last_queue_id` | `Q-611` |
| `last_commit` | (pending) |
| `fires_total` | 48 |
| `consecutive_idle` | 0 |
| `updated` | 2026-08-03 (Q-611 Fairness-Demo-Doku; nächster OFFEN Q-612) |

## Domänen-Reihenfolge

`av` → `ug` → `kita` → `cross` → (wiederholt)

Nach erfolgreichem DONE: `next_domain` = nächstes in der Reihenfolge nach `last_domain`.

## consecutive_idle

- +1 bei `idle-no-work` oder `blocked` ohne Commit  
- Reset auf 0 bei erfolgreichem Commit  
- Bei ≥ 3: Scheduler stoppen (siehe AUTONOMOUS_LOOP §4)
