# Vercel Failed Builds

Lebende Liste. **Jede** Production-Deploy mit Status `ERROR` oder `CANCELED` bekommt eine neue Zeile oben. Alte Zeilen nicht umschreiben.

Quelle der Fehlermeldung: Vercel Build-Logs (`errorsOnly`), nicht Erinnerung.

| Feld | Pflicht |
|------|---------|
| Date | UTC-Kalendertag des Deploys (`YYYY-MM-DD`) |
| Deployment | `dpl_…` |
| Error | wörtliche Zeile aus den Build-Logs |
| Solution | bewiesene Abhilfe **oder** ehrlich `kein Compile-Fehler / skip` |

Neueste zuerst.

| Date | Deployment | Error | Solution |
|------|------------|-------|----------|
| 2026-08-03 | `dpl_6hh8jVoMMthC5yrGDacN2RDfGh7R` | The Deployment has been canceled as a result of running the command defined in the "Ignored Build Step" setting. | kein Compile-Fehler / skip. `demo/vercel.json` `ignoreCommand` ist `git diff --quiet HEAD^ HEAD -- .` (cwd = Vercel-Root `demo/`). Docs-/Loop-Commits ohne Diff unter `demo/` werden übersprungen. Nächster echter Build: Dateien unter `demo/` ändern. Gegenprobe: `dpl_4QUNzt9V3vy6rQxQ21EFLC13vPg1` (`368fed9`, `/graph`) ist READY. |

## Wie eintragen

1. `get_deployment_build_logs` mit `errorsOnly: true` für das rote/abgebrochene Deploy.
2. Zeile oben in die Tabelle, vier Felder vollständig.
3. Keine zweite Liste, kein Root-`16_*.md`.
