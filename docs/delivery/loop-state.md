# loop-state – Autonomer Multi-Domain-Loop

Maschinen- und agentenlesbarer Kurzstand. **Pro Fire aktualisieren.**  
Regeln: `docs/delivery/AUTONOMOUS_LOOP.md`.  
Session-Einstieg: `docs/delivery/SESSION_HANDOFF.md`.

| Feld | Wert |
|------|------|
| `next_domain` | `ug` |
| `last_domain` | `av` |
| `last_queue_id` | `Q-620` |
| `last_commit` | (pending) |
| `fires_total` | 50 |
| `consecutive_idle` | 0 |
| `updated` | 2026-08-03 (Q-620 AV Widerspruch Session; nächster OFFEN Q-621) |

## Domänen-Reihenfolge

`av` → `ug` → `kita` → `cross` → (wiederholt)

Nach erfolgreichem DONE: `next_domain` = nächstes in der Reihenfolge nach `last_domain`.

## consecutive_idle

- +1 bei `idle-no-work` oder `blocked` ohne Commit  
- Reset auf 0 bei erfolgreichem Commit  
- Bei ≥ 3: Scheduler stoppen (siehe AUTONOMOUS_LOOP §4)
