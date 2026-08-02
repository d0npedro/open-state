# Traceability Matrix – Open State Stories

**Status:** Stub (Q-432) · **kein** paralleler Story-Katalog

Die früher manuell gepflegte Vollmatrix (Status, Routes, API-Hinweise) war gegenüber der Registry veraltet (z. B. `ENTWURF` statt `DEMONSTRIERBAR`, fehlende KJ-Stories).  
Gemäß SSOT und Anti-Growth (DEC-013) gibt es **eine** führende Quelle.

---

## Single Source of Truth

| Schicht | Pfad | Rolle |
|---------|------|--------|
| **Führend (manuell)** | [`demo/data/storyRegistry.ts`](../../demo/data/storyRegistry.ts) | IDs, Status, Route, Screen, AK-Zähler, Transparenzfokus, Story-Datei |
| **Abgeleitet (generiert)** | [`story_registry.json`](story_registry.json) | Maschinenlesbar für Docs/Tools — **nicht** manuell editieren |
| **Live-UI** | Demo-Route [`/stories`](../../demo/app/stories/page.tsx) | Coverage, „Zur Demo“-CTA aus Registry |

```bash
# Registry → JSON neu erzeugen
cd demo && npm run registry:export
```

Story-Dateien und Prinzipien:

- Vorlagen: [STORY_TEMPLATE.md](STORY_TEMPLATE.md) · [README.md](README.md)
- UI-Anbindung: [FRONTEND_TRACEABILITY_PRINCIPLES.md](FRONTEND_TRACEABILITY_PRINCIPLES.md)
- Domain-Ordner: [arbeitsverwaltung/](arbeitsverwaltung/) · [unternehmensgruendung/](unternehmensgruendung/) · [kita_betrieb_und_jugendamt_steuerung/](kita_betrieb_und_jugendamt_steuerung/)

---

## Domänen-Überblick (Stand laut Registry-Konzept)

Zahlen und Status **immer** aus `storyRegistry.ts` / Export lesen — diese Tabelle ist nur Navigation, keine zweite Wahrheit.

| Domäne | ID-Präfix | Story-Docs | Demo-Routen (Einstieg) |
|--------|-----------|------------|-------------------------|
| Arbeitsverwaltung | `US-AV-*` | [arbeitsverwaltung/](arbeitsverwaltung/) | `/fall` |
| Unternehmensgründung | `US-UG-*` | [unternehmensgruendung/](unternehmensgruendung/) | `/gruendung` |
| Kita / JA-Steuerung | `US-KJ-*` | [kita_betrieb_und_jugendamt_steuerung/](kita_betrieb_und_jugendamt_steuerung/) | `/kita` |

Ist-Zähler und Coverage: Demo `/stories` oder `_count` in `story_registry.json` (nach `registry:export`).

---

## Geplante Domänen (ohne Registry-Einträge)

| Domäne | Kürzel | Status |
|--------|--------|--------|
| Sozialleistungen | SL | Ausstehend |
| Wohnsitzmanagement | WM | Ausstehend |
| Rechtsstreit / Bußgeld | RB | Ausstehend |

Jugendhilfe-Fallmodule jenseits Kita-Betrieb/Steuerung: Konzept in `docs/13_Jugendamt_Module.md` — **nicht** als `US-KJ`/`US-JH` in der Demo-Registry, solange keine Stories + Screens existieren.

---

## Pflege-Regeln

1. Neue Story → Datei unter `docs/stories/…` **und** Eintrag in `storyRegistry.ts`.
2. Danach `npm run registry:export` (wenn Docs/JSON-Konsumenten den Export brauchen).
3. **Keine** Story-Zeilen in dieser Datei duplizieren.
4. Traceability in der UI: siehe FRONTEND_TRACEABILITY_PRINCIPLES.

*Zuletzt ausgerichtet: Q-432 · SSOT `demo/data/storyRegistry.ts`*
