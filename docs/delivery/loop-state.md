# loop-state – Autonomer Multi-Domain-Loop

Maschinen- und agentenlesbarer Kurzstand. **Pro Fire aktualisieren.**  
Regeln: `docs/delivery/AUTONOMOUS_LOOP.md`.

| Feld | Wert |
|------|------|
| `next_domain` | `kita` |
| `last_domain` | `ug` |
| `last_queue_id` | `Q-452` |
| `last_commit` | fd81efc |
| `fires_total` | 18 |
| `consecutive_idle` | 0 |
| `updated` | 2026-08-03 (Q-452 UG Behörden a11y Labels) |

## Domänen-Reihenfolge

`av` → `ug` → `kita` → `cross` → (wiederholt)

Nach erfolgreichem DONE: `next_domain` = nächstes in der Reihenfolge nach `last_domain`.

## consecutive_idle

- +1 bei `idle-no-work` oder `blocked` ohne Commit  
- Reset auf 0 bei erfolgreichem Commit  
- Bei ≥ 3: Scheduler stoppen (siehe AUTONOMOUS_LOOP §4)
