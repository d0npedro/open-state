# Deployment- und Demo-Strategie

**Zweck:** Beschreibt, wie das Open State Repository öffentlich zugänglich gemacht wird – als laufende Demo, nachvollziehbar, kontrolliert und ohne unkontrollierte Produktionsdeployments.

---

## 1. Warum eine laufende Demo wertvoll ist

Open State ist ein Konzept- und Architekturdokument. Ohne eine sichtbare, lauffähige Demonstration bleibt es abstrakt – für politische Entscheidungsträger, Fachleute und die Öffentlichkeit gleichermaßen.

Eine laufende Demo:
- macht den Entwicklungsstand unmittelbar prüfbar
- schafft Vertrauen durch Transparenz: was behauptet wird, ist auch sichtbar
- ermöglicht konkretes Feedback statt abstrakter Kritik
- zeigt, dass offene Entwicklung und Zuverlässigkeit kein Widerspruch sind

---

## 2. Warum nicht jeder Commit direkt auf Produktion geht

Staatliche Infrastruktur – auch im Demo-Stadium – trägt eine Sorgfaltspflicht.

- Ungeplante Regressionsfehler wären öffentlich sichtbar
- Unbewertete Inhaltsänderungen könnten missverständlich oder unvollständig wirken
- Der Grundsatz „Qualität vor Geschwindigkeit" gilt auch für das Repository selbst

Deshalb gilt: **Jede Änderung ist sichtbar und nachvollziehbar – aber nicht jede Änderung ist sofort öffentlich.**

---

## 3. Branch-Modell

```
main ──────────────────────────────── stabiler Referenzstand
  │
  ├── demo ──────────────────────────── öffentliche laufende Demo
  │
  └── feature/* ─────────────────────── Arbeitszweige / Preview
```

### Bedeutung der Branches

| Branch | Zweck | Deployment |
|--------|-------|------------|
| `main` | Stabiler, geprüfter Hauptstand | Kein automatisches Deployment – kontrollierter stabiler Stand |
| `demo` | Öffentliche Demo – aktuellster freigegebener Stand | Automatisches Deployment auf Demo-URL (z. B. Vercel) |
| `feature/*` | Arbeitszweige, experimentelle Ergänzungen | Preview-Deployment pro Branch (temporäre URL) |

---

## 4. Workflow

### Normaler Entwicklungsablauf

```
feature/neue-funktion  →  PR in main  →  Review  →  Merge in main
                                                         │
                                                         ▼
                                              Bewusste Entscheidung:
                                         Ist dieser Stand demofähig?
                                                    │
                                          ┌─────────┴─────────┐
                                          │ Ja                │ Nein
                                          ▼                   ▼
                                  Merge in demo           bleibt in main
                                  → Demo-Deploy           bis nächster
                                                          stabiler Stand
```

### Feature-Preview

Jeder `feature/*`-Branch erhält automatisch eine temporäre Preview-URL. Diese ist:
- nur über direkten Link erreichbar (keine Indexierung)
- nützlich für Review und Feedback vor dem Merge
- nach Merge oder Schließung des Branches deaktiviert

---

## 5. Transparenzvorteil dieses Modells

| Aspekt | Ergebnis |
|--------|----------|
| Entwicklung ist sichtbar | Feature-Branches öffentlich zugänglich per Preview |
| Fortschritt ist prüfbar | main-History im Git-Log vollständig nachvollziehbar |
| Demo ist nutzbar | demo-Branch immer lauffähig und erreichbar |
| Stabilität bleibt erhalten | main nicht durch unkontrollierte Änderungen überschrieben |
| Keine Blackbox | Jeder Commit dokumentiert: Was wurde geändert? Warum? |

---

## 6. Vercel-Konfiguration (Empfehlung)

Für ein statisches Dokumentations-/Demo-Deployment auf Vercel gilt:

```
Branch         → Vercel-Target
──────────────────────────────────────────────────────
demo           → https://open-state-demo.vercel.app  (Production)
feature/*      → https://open-state-[branch].vercel.app  (Preview)
main           → kein automatisches Deployment (oder separates Staging)
```

**Wichtig:** `main` sollte kein automatisches Production-Deployment auslösen. Der `demo`-Branch ist die öffentlich sichtbare Oberfläche.

### Beispiel vercel.json (Grundkonfiguration)

```json
{
  "github": {
    "autoJobCancelation": true
  },
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": true
}
```

---

## 7. Was diese Strategie bewusst nicht tut

- Keine automatischen Produktions-Deployments von `main`
- Kein Deployment ohne vorherige Prüfung
- Kein Einsatz von Preview-URLs als permanente Links in Außenkommunikation
- Keine Zeitangaben für Deployment-Zyklen

---

## 8. Beziehung zur Kernidentität von Open State

Diese Strategie spiegelt die Grundprinzipien des Projekts:

> **Transparenz:** Wer den Stand sehen will, kann ihn sehen – nachvollziehbar, dokumentiert.
>
> **Verlässlichkeit:** Was als stabil gilt, ist stabil. Was in Entwicklung ist, ist als solches erkennbar.
>
> **Kontrolle:** Kein Deploy ohne Entscheidung. Keine Entscheidung ohne Dokumentation.

---

*Kein Terminversprechen. Keine Versionsnummern mit Daten. Jeder Stand spricht für sich.*
