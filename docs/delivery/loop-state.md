# loop-state – Autonomer Multi-Domain-Loop

Maschinen- und agentenlesbarer Kurzstand. **Pro Fire aktualisieren.**  
Regeln: `docs/delivery/AUTONOMOUS_LOOP.md`.

| Feld | Wert |
|------|------|
| `next_domain` | `cross` |
| `last_domain` | `kita` |
| `last_queue_id` | `Q-412` |
| `last_commit` | 29dae8c |
| `fires_total` | 8 |
| `consecutive_idle` | 0 |
| `updated` | 2026-08-02 (Q-412 Kita DemoSessionBar) |

## Domänen-Reihenfolge

`av` → `ug` → `kita` → `cross` → (wiederholt)

Nach erfolgreichem DONE: `next_domain` = nächstes in der Reihenfolge nach `last_domain`.

## consecutive_idle

- +1 bei `idle-no-work` oder `blocked` ohne Commit  
- Reset auf 0 bei erfolgreichem Commit  
- Bei ≥ 3: Scheduler stoppen (siehe AUTONOMOUS_LOOP §4)
