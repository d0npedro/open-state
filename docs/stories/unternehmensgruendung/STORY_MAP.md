# Story Map – Unternehmensgründung

Diese Story Map strukturiert die User Activities nach dem Backbone der digitalen Gründungsakte. Sie zeigt, welche Stories welchen Aktivitäten zugeordnet sind und welche Priorisierung für eine MVP-Demo gilt.

---

## BACKBONE (Aktivitäten)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                     BACKBONE – Unternehmensgründung                                  │
│                                                                                      │
│  Orientierung /   Behörden-        Unterlagen /    Rückfragen /    Verlauf /         │
│  Status           Koordination     Nachreichung    Interaktion     Handlungsklarheit │
└──────┬────────────────┬────────────────┬────────────────┬────────────────┬──────────┘
       │                │                │                │                │
```

---

## USER ACTIVITIES (je Backbone-Punkt)

### 1. Orientierung / Status

Ziel: Die Gründerin oder der Gründer weiß jederzeit, wo die Gründungsakte steht – ohne anzurufen.

```
Gründer fragt: "Wo steht meine Gewerbeanmeldung?"
    └── Gründungsstatus einsehen
            └── US-UG-001  Gründungsstatus einsehen
                           Klartext-Status + Fortschritt + offene Aufgaben + nächster Schritt
```

### 2. Behörden-Koordination

Ziel: Mehrere beteiligte Stellen sind sichtbar; der Gründer muss nicht selbst zwischen Behörden vermitteln.

```
Gründer fragt: "Wer bearbeitet was – und was ist noch offen?"
    └── Beteiligte Behörden und deren Status einsehen
            └── US-UG-002  Beteiligte Behörden einsehen
                           Behörde + Rolle + Bearbeitungsstatus + Kontakt
```

### 3. Unterlagen / Nachreichung

Ziel: Dokumentenanforderungen sind begründet, fristgebunden und nachvollziehbar.

```
Behörde fordert Unterlage an
    └── Gründer reicht Dokument nach
            └── US-UG-003  Unterlagen nachreichen
                           Anforderung + Begründung + Rechtsgrundlage + Status je Dokument
```

### 4. Rückfragen / Interaktion

Ziel: Inhaltliche Rückfragen sind verständlich und beantwortbar – mit Frist und Konsequenz.

```
Finanzamt stellt Rückfrage (z. B. Kleinunternehmerregelung)
    └── Gründer versteht und beantwortet
            └── US-UG-004  Rückfrage verstehen und beantworten
                           Frage + Begründung + Frist + Konsequenz + Antwortweg
```

### 5. Verlauf / Handlungsklarheit

Ziel: Jeder Schritt ist nachvollziehbar; offene Pflichten und nächste Handlungen sind klar.

```
Gründer fragt: "Was ist bisher passiert – und was muss ich jetzt tun?"
    └── Verlauf und Handlungshinweise einsehen
            ├── US-UG-005  Verfahrensverlauf nachvollziehen
            │              Chronologische Timeline + Ereignistypen + Urheber
            └── US-UG-006  Nächste Schritte und Pflichten verstehen
                           Offene Aufgaben + Fristen + erklärbare Handlungshinweise
```

---

## PRIORISIERUNG

### MVP Demo (Minimal demonstrierbare Basis)

| Priorität | Story-ID | Begründung |
|-----------|----------|-----------|
| 1 | US-UG-001 | Kernversprechen: Status der Gründungsakte ohne Behördenanruf |
| 2 | US-UG-004 | Höchster Handlungsdruck: offene Rückfrage blockiert Bearbeitung |
| 3 | US-UG-002 | Plattformgedanke: Mehrbehördenprozess sichtbar, nicht nur eine Stelle |

### Vollständige Demo (Alle 6 Stories)

| Story-ID | Titel |
|----------|-------|
| US-UG-001 | Gründungsstatus einsehen |
| US-UG-002 | Beteiligte Behörden einsehen |
| US-UG-003 | Unterlagen nachreichen |
| US-UG-004 | Rückfrage verstehen und beantworten |
| US-UG-005 | Verfahrensverlauf nachvollziehen |
| US-UG-006 | Nächste Schritte und Pflichten verstehen |

### Vollausbau (noch nicht als Stories dokumentiert)

- Interaktiver Antragsflow zur initialen Gewerbeanmeldung (Prozess A)
- Steuerliche Erstregistrierung als Fragebogen (Prozess E)
- Pflichtenerklärung mit Kenntnisnahme-Bestätigung (Prozess F, erweitert)
- Betriebsaufnahme-Bestätigung (Prozess G)
- Änderungsmitteilungen (Prozess H)
- Sachbearbeitungs-Perspektive je Behörde
- Freiberufliche Anmeldung als eigener Vorgangstyp

---

*Verweis auf Domänendokumentation Prozesse: [docs/domains/unternehmensgruendung/03_KERNPROZESSE.md](../../domains/unternehmensgruendung/03_KERNPROZESSE.md)*
