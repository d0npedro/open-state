# Story Map – Arbeitsverwaltung

Diese Story Map strukturiert die User Activities nach dem Backbone der Fallbearbeitung. Sie zeigt, welche Stories welchen Aktivitäten zugeordnet sind und welche Priorisierung für eine MVP-Demo gilt.

---

## BACKBONE (Aktivitäten)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        BACKBONE – Arbeitsverwaltung                                  │
│                                                                                      │
│  Einstieg /      Orientierung /   Interaktion /    Termine /     Entscheidung /  Verlauf /
│  Fallbeginn      Status           Nachreichung /   Komm.         Bescheid         Nachvollzieh-
│                                   Rückfragen                                      barkeit
└──────┬───────────────┬──────────────────┬──────────────┬──────────────┬───────────┬──┘
       │               │                  │              │              │           │
```

---

## USER ACTIVITIES (je Backbone-Punkt)

### 1. Einstieg / Fallbeginn

Ziel: Der Bürger meldet sich arbeitslos und erhält sofortige Orientierung.

```
Bürger meldet sich arbeitslos
    └── Fall digital anlegen
            └── US-AV-001  Fall anlegen
                           Sofortige Fallnummer + Eingangsbestätigung + nächste Schritte
```

### 2. Orientierung / Status

Ziel: Der Bürger weiß jederzeit, wo sein Fall steht – ohne anzurufen.

```
Bürger fragt: "Was passiert gerade mit meinem Antrag?"
    └── Fallstatus einsehen
            └── US-AV-002  Status einsehen
                           Klartext-Status + Zeitstempel + nächster Schritt + offene To-dos
```

### 3. Interaktion / Nachreichung / Rückfragen

Ziel: Kommunikation zwischen Bürger und Sachbearbeitung ist strukturiert, begründet und nachvollziehbar.

```
Sachbearbeitung fordert Dokument an
    └── Bürger reicht Dokument nach
            └── US-AV-003  Unterlagen nachreichen
                           Anforderung mit Begründung + Frist + Upload + Bestätigung

Sachbearbeitung stellt Rückfrage
    └── Bürger versteht die Anforderung
            └── US-AV-004  Rückfrage verstehen
                           Rückfrage + Begründung + Frist + Konsequenz + Handlungsmöglichkeit
```

### 4. Termine / Kommunikation

Ziel: Bürger erscheinen vorbereitet zu Terminen.

```
Sachbearbeitung setzt Termin an
    └── Bürger sieht Termin und bereitet sich vor
            └── US-AV-005  Termin einsehen und verstehen
                           Terminzweck + Ort/Format + Vorbereitung + Unterlagen
```

### 5. Entscheidung / Bescheid

Ziel: Bürger verstehen den Bescheid und wissen, was sie tun können.

```
Sachbearbeitung erlässt Bescheid
    └── Bürger liest und versteht Bescheid
            └── US-AV-006  Bescheid verstehen
                           Juristische Fassung + Erklärungsschicht + Widerspruchsfrist + Handlungsoptionen
```

### 6. Verlauf / Nachvollziehbarkeit

Ziel: Bürger können jeden Schritt ihres Falls nachvollziehen.

```
Bürger fragt: "Wer hat wann was entschieden?"
    └── Vollständige Fallhistorie einsehen
            └── US-AV-007  Historie nachvollziehen
                           Chronologische Timeline + Ereignistypen + Zeitstempel + Urheber + Export
```

---

## PRIORISIERUNG

### MVP Demo (Minimal demonstrierbare Basis)

Für eine erste Demo müssen mindestens diese Stories implementiert sein, um den Kernpfad zeigen zu können:

| Priorität | Story-ID | Begründung |
|-----------|----------|-----------|
| 1 | US-AV-001 | Einstiegspunkt – ohne Fall kein weiterer Prozess |
| 2 | US-AV-002 | Kernversprechen von Open State: Bürger weiß, was passiert |
| 3 | US-AV-006 | Höchster Nutzwert: Bescheidtransparenz differenziert Open State von Status quo |

Diese drei Stories bilden den minimal demonstrierbaren Kern des Wertsversprechens.

### Vollständige Demo (Alle Stories demonstrierbar)

Alle 7 Stories der Arbeitsverwaltung sind demonstrierbar. Damit ist der vollständige Lebenszyklus eines Falls von der Meldung bis zur Nachvollziehbarkeit abgedeckt.

| Story-ID | Titel |
|----------|-------|
| US-AV-001 | Fall anlegen |
| US-AV-002 | Status einsehen |
| US-AV-003 | Unterlagen nachreichen |
| US-AV-004 | Rückfrage verstehen |
| US-AV-005 | Termin einsehen und verstehen |
| US-AV-006 | Bescheid verstehen |
| US-AV-007 | Historie nachvollziehen |

### Vollausbau (noch nicht als Stories dokumentiert)

Die folgenden Funktionsbereiche aus der Domänendokumentation sind noch nicht in Stories überführt:

- Sachbearbeitungs-Perspektive (Fallübersicht, Prüfprotokoll, Priorisierung)
- Vermittlungsprozess (Stellenvorschläge, Bewerbungsnachweis)
- Änderungsmitteilungen
- Eskalation / Härtefallprozess
- Leistungsantragstellung mit vollständiger Finanzdatenerfassung
- Widerspruchseinreichung (eigenständige Story, über US-AV-006 hinaus)

---

*Verweis auf Domänendokumentation Prozesse: [docs/domains/arbeitsverwaltung/03_KERNPROZESSE.md](../../domains/arbeitsverwaltung/03_KERNPROZESSE.md)*
