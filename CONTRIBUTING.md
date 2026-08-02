# Beitragen zu Open State

Danke für dein Interesse. Open State ist ein Konzept- und Architekturprojekt mit klickbarer Next.js-Demo. Beiträge sollen nachvollziehbar, story-basiert und sachlich bleiben.

---

## Grundsätze

1. **Story-driven** – Sichtbare UI braucht eine Story-ID (`US-[DOMAIN]-[NNN]`).
2. **Ein Schritt pro PR** – klar abgegrenzt, Queue-bezogen wenn möglich.
3. **Transparenz** – Begründung, Frist, Konsequenz, Rechtsgrundlage wo fachlich nötig.
4. **KI nur Assistenz** – keine autonome Verwaltungsentscheidung.
5. **Sachton** – keine Startup- oder Marketing-Rhetorik; staatliche Infrastruktur.
6. **Datenschutz** – Kindeswohl und Personenbezug haben Vorrang (besonders Kita-Domäne).

---

## Voraussetzungen

- Node.js 20+
- Git
- Optional: Playwright für E2E

```bash
git clone https://github.com/d0npedro/open-state.git
cd open-state/demo
npm install
npm run dev
```

Build-Prüfung:

```bash
cd demo
npm run build
```

E2E (aus `demo/`):

```bash
npm run test:e2e
```

---

## Arbeitsablauf

1. Issue anlegen oder bestehendes Issue referenzieren (Templates unter `.github/ISSUE_TEMPLATE/`).
2. Branch von `main`: `feature/<kurzbeschreibung>` oder `docs/<kurzbeschreibung>`.
3. Änderungen implementieren.
4. `cd demo && npm run build` (bei Codeänderungen).
5. PR mit Conventional-Commit-Titel und Bezug zu Story-ID / Queue-ID.

Agenten und automatisierte Iterationen folgen zusätzlich `AGENTS.md` und `docs/DELIVERY_SYSTEM.md`.

---

## Story beantragen

1. Issue-Typ **Story-Antrag** nutzen.
2. Problem, Rolle, Nutzen und grobe Akzeptanzkriterien skizzieren.
3. Domänenkürzel: `AV` (Arbeitsverwaltung), `UG` (Unternehmensgründung), `KJ` (Kita/Jugendamt).
4. Nach fachlicher Klärung: Story-Datei unter `docs/stories/<domäne>/` nach `STORY_TEMPLATE.md`.
5. Eintrag in **`demo/data/storyRegistry.ts`** (führende Registry). Danach optional `cd demo && npm run registry:export` für `docs/stories/story_registry.json` (generiert, nicht manuell pflegen).

Lebenszyklus: `ENTWURF → BEREIT → IN_ENTWICKLUNG → DEMONSTRIERBAR → ABGESCHLOSSEN`

---

## Code- und Docs-Standards

| Bereich | Vorgabe |
|---------|---------|
| Commits | Conventional Commits: `feat`, `fix`, `docs`, `chore`, `refactor`, `ci` |
| Demo-Code | TypeScript strict, App Router, Pfadalias `@/*` |
| UI | Design-Tokens / Themes nur visuell (DEC-010); Fachlogik unberührt |
| Mock-Daten | Keine echten Personen; realistische Rechtsbezüge wo sinnvoll |
| Sprache | Deutsch in Fach- und Story-Dokumenten; Code-Kommentare DE oder EN konsistent pro Datei |

---

## Review-Prozess

1. Build (und bei UI E2E) grün.
2. Story-Bezug und Akzeptanzkriterien prüfbar.
3. Keine Secrets, keine echten personenbezogenen Daten.
4. PR-Beschreibung: Was / Warum / Wie testen.
5. Merge in `main` nach Review (CI: Build-Check und E2E).

---

## Was wir nicht annehmen

- Features ohne nachvollziehbares Problem / ohne Story-Bezug (sichtbare UI)
- Werbe-, Tracking- oder kommerzielle Einbindung
- KI-Autonomie über Verwaltungsentscheidungen
- Rhetorik mit Liefertermin-Versprechen ohne Substanz

---

## Lizenz und Verhalten

Siehe Repository-Root für Lizenzangaben. Beiträge sollen respektvoll, inklusiv und an der öffentlichen Aufgabe orientiert sein.

Fragen und Hinweise: GitHub Issues oder `/feedback` in der Demo.
