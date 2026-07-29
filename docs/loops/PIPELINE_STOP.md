# PIPELINE STOP – 2026-07-29

## Status: GESTOPPT

Alle Multi-Loop-Scheduler (Domain AV/UG/Kita, Supervisor, CI-Watcher) sind **abgebrochen**.
Kein automatischer Push, kein Merge-Dauerbetrieb, bis Deployment wieder grün ist.

## Was wirklich rot war

| System | Status | Bedeutung |
|--------|--------|-----------|
| GitHub Actions Build Check | meist **success** | Code baut |
| GitHub Actions E2E | meist **success** | Playwright grün |
| **Vercel Production Deploy** | **ERROR / failure** | Deployment-Pipeline rot |

### Fehler 1 – falsche Vercel-Projekt-Einstellungen (primär)

Deploy-Log (Beispiel `dpl_5ownsWoo…`):

```
Error: No Next.js version detected.
Make sure your package.json has "next" …
Also check your Root Directory setting
```

Projekt stand auf:

| Setting | Vorher (kaputt) | Nach Fix (API) |
|---------|-----------------|----------------|
| `rootDirectory` | *(leer = Repo-Root)* | **`demo`** |
| `installCommand` | `cd demo && npm install` | **leer** (Default + `vercel.json`) |
| `buildCommand` | `cd demo && npm install && npm run build` | **leer** |
| `outputDirectory` | `demo/.next` | **leer** / `.next` via vercel.json |
| `commandForIgnoringBuildStep` | leer | `git diff --quiet HEAD^ HEAD -- .` |

Vercel suchte `next` im Repo-Root (kein package.json) → Deploy ERROR, obwohl `npm install` in `demo/` lief.

### Fehler 2 – Free-Plan Rate-Limit (sekundär, durch Push-Spam)

GitHub Commit-Status / CLI:

```
Deployment rate limited — retry in 24 hours.
Too many requests … code: "api-upload-free"
```

Der Dauerbetrieb hat **alle paar Minuten Docs-Commits** auf `main` gepusht. Jeder Push triggerte Production-Deploy (`productionBranch=main`). Quote verbrannt.

**Letztes READY Production-Deploy:** ca. **2026-03-13** (nicht „seit gestern“ – die Live-URL hing an altem Stand / Error-Deploys).

## Maßnahmen (sofort)

1. **Scheduler gestoppt** (IDs `019fac1504a4`, `019fac2e1968` und Nachfolger)
2. **Vercel Project Setting** live gesetzt (API, ohne neuen Deploy):
   - `commandForIgnoringBuildStep` = `git diff --quiet HEAD^ HEAD -- .`
   - Docs-only-Änderungen unter Root/Demo sollen Builds überspringen (wenn Root Directory = `demo`)
3. **Kein Push auf main**, solange Rate-Limit aktiv (weitere Pushes erzeugen nur weitere Vercel-Errors)

## Was du manuell im Vercel-Dashboard setzen musst

Laut `Claude.md` gilt: `demo` → production, `main` → kein Auto-Deploy.

Aktuell: **Production Branch = `main`** (falsch für dieses Modell).

In Vercel → Project **open-state** → Settings → Git:

1. **Production Branch** auf `demo` stellen (oder Auto-Deploy für `main` abschalten)
2. Optional: Preview nur für `feature/*`
3. Rate-Limit: warten bis Reset (~24h ab letztem Limit) **oder** Plan upgraden:  
   https://vercel.com/peters-projects-1631d4ab?upgradeToPro=build-rate-limit

## Regeln ab jetzt (harte Stop-Regeln)

| Regel | Inhalt |
|-------|--------|
| R1 | Kein Docs-only-Commit auf `main` mit Push |
| R2 | CI-Watcher **nie** `docs: ci-watcher status success…` pushen |
| R3 | Supervisor pusht nur bei **Code-Änderung** in `demo/` (nach lint+build+e2e:ci) |
| R4 | Vercel-Status ist Teil von „Pipeline grün“ – GHA grün reicht nicht |
| R5 | Dauerbetrieb erst wieder, wenn Vercel Production **READY** und Rate-Limit weg |

## Wiederaufnahme

1. Vercel Production Branch korrigieren (`demo`)
2. Einen **einzigen** manuellen Deploy testen (wenn Quota frei): Code-Change in `demo/` oder Redeploy letztes READY
3. Scheduler nur mit R1–R4 neu anlegen
4. Kein 5-Minuten-Docs-Spam

## Letzter bekannter guter App-Stand

GitHub Actions Build/E2E waren auf Feature-Merges grün.  
Vercel Production-Deploys der letzten Stunden: durchweg **ERROR** (Rate-Limit), nicht Compiler-Fehler.
