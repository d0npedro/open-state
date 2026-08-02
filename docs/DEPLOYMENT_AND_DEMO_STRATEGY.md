# Deployment- und Demo-Strategie (führend)

**Status:** Single Source of Truth für Demo-Setup, Branch-Modell und Vercel (Q-304)  
**Frühere Parallel-Docs** (jetzt Stubs): [`DEMO_APP_SETUP.md`](DEMO_APP_SETUP.md), [`DEMO_DEPLOYMENT_PLAYBOOK.md`](DEMO_DEPLOYMENT_PLAYBOOK.md)

**Zweck:** Open State öffentlich als laufende Demo zugänglich machen – nachvollziehbar, kontrolliert, ohne unkontrollierte Production-Deploys von `main`.

---

## 1. Warum eine laufende Demo

Open State ist Konzept- und Architekturarbeit. Ohne klickbare Demo bleibt der Stand abstrakt.

Eine laufende Demo:
- macht den Entwicklungsstand prüfbar
- schafft Vertrauen durch Transparenz
- ermöglicht konkretes Feedback
- zeigt, dass offene Entwicklung und Sorgfalt vereinbar sind

---

## 2. Warum nicht jeder Commit auf Production

- Öffentlich sichtbare Regressionen vermeiden
- Unvollständige Inhalte nicht unkontrolliert freigeben
- Qualität vor Geschwindigkeit auch im Repository

**Jede Änderung ist sichtbar (Git) – nicht jede ist sofort die öffentliche Demo.**

---

## 3. Branch-Modell

```
main ──────────────────────────────── stabiler Referenzstand
  │
  ├── demo ──────────────────────────── öffentliche laufende Demo
  │
  └── feature/* ─────────────────────── Arbeitszweige / Preview
```

| Branch | Zweck | Deployment |
|--------|-------|------------|
| `main` | Stabiler, geprüfter Hauptstand | Kein automatisches Production-Deploy |
| `demo` | Freigegebener Demo-Stand | Production (z. B. Vercel) |
| `feature/*` | Experiment / Review | Preview-URL (temporär) |

### Entwicklungsablauf

```
feature/*  →  PR → main  →  bewusste Entscheidung: demofähig?
                              Ja → Merge/Sync nach demo → Production
                              Nein → bleibt in main
```

Preview-URLs: nur per Link, nicht als permanente Außenkommunikation.

---

## 4. Lokal starten

Voraussetzungen: Node.js 18+ oder 20+, npm.

```bash
cd demo
npm install
npm run dev
# → http://localhost:3000
```

Production-Build prüfen:

```bash
cd demo
npm run lint
npm run build
```

E2E (CI-äquivalent, vor Push relevant):

```bash
cd demo
npm run test:e2e:ci
```

---

## 5. Demo-App (Ist)

| Eigenschaft | Wert |
|-------------|------|
| Pfad | `demo/` (Next.js 14 App Router) |
| Daten | Mock only; keine echten Personen-/Behördendaten |
| Auth / Backend | keines |
| Root auf Vercel | **`demo`** (nicht Repo-Root) |

### Wichtige Routen (Überblick)

| Route | Inhalt |
|-------|--------|
| `/` | Landing (alle Domänen) |
| `/fall/*` | Arbeitsverwaltung (Vertical Slice + Fairness) |
| `/gruendung/*` | Unternehmensgründung |
| `/kita/*` | Kita Transparenz + JA-Steuerung |
| `/stories` | Story Coverage |
| `/feedback` | Feedback → GitHub Issue |

Aktueller Detailstand: [`BUILD_STATE.md`](BUILD_STATE.md).

### Mock & Stories

- Fall-/Domänendaten: `demo/data/mock*.ts`
- Story-Metadaten (führend): `demo/data/storyRegistry.ts`  
  (`docs/stories/story_registry.json` ist abgeleitet/historisch; Drift-Vermeidung → Queue Q-305)

---

## 6. Vercel

### Projekt einrichten

1. Vercel-Projekt aus dem GitHub-Repo
2. **Root Directory:** `demo`
3. Framework: Next.js (auto)
4. Keine Secrets nötig (Demo ohne Backend)
5. Config im App-Ordner: `demo/vercel.json`

### Environment Variables

| Variable | Beispiel | Beschreibung |
|----------|----------|--------------|
| `NEXT_PUBLIC_APP_ENV` | `demo` / `preview` / `local` | Umgebungskennung im UI |
| `NEXT_PUBLIC_DEMO_VERSION` | `0.1.0` | Angezeigte Version (auch Default in `next.config.mjs`) |
| `VERCEL_GIT_COMMIT_SHA` | (auto) | Vercel setzt; App kürzt auf 7 Zeichen → `NEXT_PUBLIC_COMMIT_SHA` |

Lokal optional in `demo/.env.local`.

### Branch → Target

| Branch | Target |
|--------|--------|
| `demo` | Production (öffentliche Demo-URL) |
| `feature/*` | Preview |
| `main` | **kein** auto Production (optional separates Staging) |

`main` darf Production nicht unkontrolliert überschreiben.

### Build-Transparenz

`demo/components/BuildInfo.tsx` im Footer: Umgebung, Demo-Version, Commit-SHA (7), Demonstrator-Hinweis.  
Env-Mapping: `demo/next.config.mjs`.

---

## 7. Feedback-Kanal

Route `/feedback`: vorausgefüllter GitHub-Issue-Link (Version, SHA, Leitfragen, Screen).  
Label: `demo-feedback`.

---

## 8. Was diese Strategie bewusst nicht tut

- Kein Auto-Production von `main`
- Kein Deploy ohne vorherige Prüfung (lokal lint/build; bei Push-Pflicht auch E2E wo AGENTS/Supervisor greifen)
- Keine Preview-URLs als permanente Außenlinks
- Keine Termin- oder Release-Versprechen

---

## 9. Offene Punkte (spätere Integration, nicht Demo-Blocker)

- eID (BSI TR-03130), BA-/Behörden-Adapter, echter Upload, persistente Fallakte
- DSFA (Art. 35 DSGVO) vor Pilotbetrieb
- Finale Open-Data-Lizenz für Kita-Aggregate (Demo: vorläufiger Hinweis)

---

## 10. Prinzipien

> **Transparenz:** Stand ist sichtbar und dokumentiert.  
> **Verlässlichkeit:** Was als Demo gilt, ist demofähig.  
> **Kontrolle:** Kein Deploy ohne Entscheidung.

*Kein Terminversprechen. Jeder Stand spricht für sich.*
