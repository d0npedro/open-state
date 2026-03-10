# Repo Summary: Verfahrensfairness-Hinweisschicht (Demo)

Erweiterung der Arbeitsverwaltungs-Demo um eine sachliche, transparente
Verfahrensfairness-Schicht. Keine KI-Entscheidungen, keine Scores, keine Werbung.
Nur erklärbare Hinweise, abgeleitet aus konkreten Falldaten.

---

## Neu erstellte Dateien

| Datei | Zweck |
|---|---|
| `demo/types/fairness.ts` | Typdefinitionen: `FairnessSignal`, `FairnessSignalTyp`, `FairnessSignalPrioritaet` |
| `demo/lib/fairness/rules.ts` | Regelwerk: leitet Signale aus `Fall`-Daten ab (5 transparente Regeln) |
| `demo/components/fairness/FairnessPanel.tsx` | Komponenten: `FairnessPanel` (Vollansicht + Kompaktmodus) und `FairnessSummaryCard` |
| `demo/app/fall/hinweise/page.tsx` | Neue Seite `/fall/hinweise`: vollständige Übersicht aller Signale |
| `docs/VERFAHRENSFAIRNESS_IN_DER_DEMO.md` | Fachlich-technische Dokumentation der Hinweislogik |
| `REPO_REWRITE_SUMMARY_FAIRNESS_UI.md` | Diese Datei |

---

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `demo/app/fall/layout.tsx` | Nav-Eintrag „Hinweise" → `/fall/hinweise` ergänzt |
| `demo/app/fall/page.tsx` | `FairnessSummaryCard` mit Gesamtübersicht aller Signale eingefügt |
| `demo/app/fall/rueckfragen/page.tsx` | `FairnessPanel` für Frist-Signale offener Rückfragen |
| `demo/app/fall/bescheide/page.tsx` | `FairnessPanel` für vorläufigen Bescheid und Begründungshinweise |
| `demo/app/fall/verlauf/page.tsx` | `FairnessPanel` (kompakt) für Pausierungshinweis |
| `demo/data/storyRegistry.ts` | `US-AV-008` (Verfahrenslage verstehen) ergänzt, Status `DEMONSTRIERBAR` |

---

## Eingeführte Hinweislogik

5 regelbasierte Signale, alle in `demo/lib/fairness/rules.ts` einzeln lesbar:

| Signal | Auslöser | Priorität |
|---|---|---|
| `RUECKFRAGE_OFFEN_FRIST_RELEVANT` | Unbeantwortet + Frist ≤ 10 Tage | RELEVANT (≤3 Tage) / HINWEIS |
| `UNTERLAGE_FEHLT_BLOCKIERT` | Mindestens 1 Dokument mit Status `ANGEFORDERT` | HINWEIS |
| `FALL_PAUSIERT` | Status `RUECKFRAGE_OFFEN` / `UNTERLAGEN_FEHLEN` / `PAUSIERT` | INFO |
| `BESCHEID_VORLAEUFIG` | Bescheid-Typ enthält „vorläufig" | HINWEIS |
| `BESCHEID_BEGRUENDUNG_ERWEITERBAR` | Bescheid-Begründung enthält „offen" oder „fehlende" | INFO |

Für den Demo-Fall `AV-2024-0042` werden alle 5 Signale aktiv.

---

## Wo Fairness-Hinweise im UI sichtbar sind

- **`/fall`** (Fallübersicht): Kompakte Zusammenfassungskarte mit Signalanzahl + Link zu `/fall/hinweise`
- **`/fall/rueckfragen`** (Rückfragen): Vollständiger Frist-Hinweis oberhalb der Rückfragekarten
- **`/fall/bescheide`** (Bescheide): Vollständige Hinweise zu vorläufigem Bescheid und Begründung
- **`/fall/verlauf`** (Verlauf): Kompakter Pausierungshinweis oben im Verlauf
- **`/fall/hinweise`** (neu): Vollständige Übersicht aller Signale, gruppiert nach Priorität

---

## Technische Ableitungslogik

```
berechneFairnessSignale(fall: Fall): FairnessSignal[]

Eingabe:  vollständiges Fall-Objekt (Dokumente, Rückfragen, Bescheide, Status)
Ausgabe:  Liste aller zutreffenden FairnessSignal-Objekte

Kein ML, kein Scoring, keine externe API.
Jede Regel ist ein if-Block mit Kommentar.
```

---

## Grenzen und offene Punkte

- Fristberechnung basiert auf Mock-Feld `fristTage`, nicht auf echtem Datumsdelta
- Keine „gelesen"-Markierung für Hinweise (kein Persistenzlayer)
- Kein Vergleich mit anderen Fällen (bewusst: nur eigener Fallzustand)
- Für Produktion: Regelwerk serverseitig ausführen, Regeln versionieren
- Sachbearbeitungs-Sicht (welche Hinweise sieht die Behörde?) noch nicht implementiert
