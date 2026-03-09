# Open State – UI/UX & User Flows

*Basis: docs/01–06*

---

## 1. Design-Philosophie

**Leitprinzip: „Staatlich, aber menschlich"**

Open State bricht mit der Ästhetik traditioneller Behörden-Software. Das Design ist:
- **Klar & vertrauenswürdig** – Blau/Weiß als Staatsfarben, aber modern und warm
- **Radikal einfach** – Jeder Screen hat genau eine primäre Aktion
- **Angstfrei** – Keine Behördensprache, kein Formularchaosdruck
- **Inklusiv** – Funktioniert für 16-Jährige und 85-Jährige gleichermaßen

**Design Tokens:**
```
Primärfarbe:    #003F8C  (Staatsblau, vertrauenswürdig)
Akzentfarbe:    #00A550  (Grün = Abgeschlossen/Positiv)
Warnfarbe:      #E8A000  (Amber = Achtung/Ausstehend)
Fehlerfarbe:    #C0392B  (Rot = Fehler/Dringend)
Hintergrund:    #F5F7FA  (Helles Grau, kein hartes Weiß)
Schrift:        BundesSans (freie Bundesschrift) + System-Fallback
Radius:         12px (Cards), 8px (Buttons) – freundlich, nicht steif
Spacing:        8px Grid
```

---

## 2. Screen 1 – Onboarding & eID-Verifikation

### Zweck
Neuen Nutzer in < 3 Minuten vollständig verifizieren und vertrauen aufbauen.

### Flow-Beschreibung

**Schritt 1 – Willkommensscreen:**
- Großes, ruhiges Illustration (kein Stock-Foto): Abstrakte Darstellung von Verbindungen (Mensch ↔ Staat)
- Headline: „Ihr Staat. Für Sie. In 3 Minuten."
- Subline: „Einmal einrichten. Nie wieder Warteschlangen."
- CTA: „Jetzt starten" (groß, Primärfarbe)
- Kleintext: „Kostenlos · Datenschutz nach DSGVO · Staatlich betrieben"

**Schritt 2 – Erklärungsscreen (3 Slides, swipeable):**
- Slide 1: „Einmal verifizieren – wir kennen Sie danach" (Illustration: Personalausweis + Häkchen)
- Slide 2: „Ihre Daten gehören Ihnen – immer" (Illustration: Schloss, Bürger hält Schlüssel)
- Slide 3: „95 % aller Behördengänge: unter 3 Minuten" (Illustration: Stoppuhr)

**Schritt 3 – eID-Scan:**
```
┌─────────────────────────────────┐
│  📱 Personalausweis scannen     │
│                                  │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   [NFC-Rahmen animiert] │    │
│  │   Ausweis hier anlegen  │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                  │
│  🔒 Verbindung verschlüsselt    │
│  Ihre PIN wird nicht gespeichert │
│                                  │
│  [PIN eingeben]                  │
│                                  │
│  Kein NFC-Handy?                 │
│  → Web-Ident per Videoident      │
└─────────────────────────────────┘
```

**Schritt 4 – Erfolgsscreen:**
- Große grüne Checkmark-Animation
- „Willkommen, [Vorname]! Ihr Konto ist bereit."
- Direkt: 3 empfohlene erste Schritte (personalisiert nach Profil)

**UX-Details:**
- PIN-Eingabe lokal auf Gerät, niemals an Server übertragen
- NFC-Animation: Pulsierender Ring, zeigt Annäherungsfortschritt
- Fehlerfall: Klare Anweisung, keine technischen Fehlermeldungen
- Barrierefreiheit: VoiceOver/TalkBack vollständig unterstützt, Schriftgröße dynamisch

---

## 3. Screen 2 – Home Dashboard

### Zweck
Zentrale Übersicht: Laufende Vorgänge, proaktive Hinweise, schnelle Aktionen.

### Layout-Beschreibung

```
┌─────────────────────────────────┐
│  Guten Morgen, Anna 👋           │
│  Montag, 9. März 2026            │
│                                  │
│  ┌─────────────────────────┐    │
│  │ ⚠️  HINWEIS              │    │
│  │ Ihre Steuererklärung     │    │
│  │ 2025 ist bereit.        │    │
│  │ Vorausgefüllt · 4 Min   │    │
│  │ [Jetzt erledigen →]     │    │
│  └─────────────────────────┘    │
│                                  │
│  MEINE VORGÄNGE                  │
│  ┌──────────┐ ┌──────────┐      │
│  │Ummeldung │ │Bußgeld   │      │
│  │✅ Fertig │ │⏳ 3 Wo.  │      │
│  └──────────┘ └──────────┘      │
│                                  │
│  SCHNELLAKTIONEN                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │
│  │🏠 │ │💼 │ │⚖️ │ │💰 │       │
│  │Um-│ │Ge-│ │Bu-│ │Steu│      │
│  │mel│ │wer│ │ßg.│ │er  │      │
│  └───┘ └───┘ └───┘ └───┘       │
│  [Alle Dienste anzeigen]         │
│                                  │
│  DATENTRESOR                     │
│  Letzte Aktivität: Heute 08:14   │
│  Finanzamt hat Adresse abgerufen │
│  [Details ansehen]               │
└─────────────────────────────────┘
```

**UX-Details:**
- Proaktive Hinweiskarte: KI erkennt Fristen und Ansprüche → schlägt Aktionen vor
- Vorgangs-Karten: Farbcodiert (Grün = fertig, Amber = wartend, Blau = in Bearbeitung)
- Datentresor-Widget: Transparenz-Reminder direkt auf Home
- Bottom Navigation: Home | Vorgänge | Datentresor | Profil
- Dark Mode: Vollständig unterstützt

---

## 4. Screen 3 – Wohnsitzummeldung (Haupt-Journey)

### Zweck
Vollständige Ummeldung in < 3 Minuten, ohne Fehler, mit maximaler Klarheit.

### Flow-Beschreibung

**Schritt 1 – Startscreen:**
- Headline: „Ummeldung – in 3 Schritten"
- Fortschrittsbalken oben: [●○○]
- Aktuelle Adresse (aus Profil, verifiziert): vorausgefüllt und hervorgehoben
- „Wohin ziehen Sie?" – Adresseingabe mit PLZ-Autocomplete

**Schritt 2 – Übersicht der Benachrichtigungen:**
```
┌─────────────────────────────────┐
│  Diese Stellen werden           │
│  automatisch informiert:        │
│                                  │
│  ✓ Einwohnermeldeamt Berlin     │
│    Abmeldung Ihrer alten Adresse │
│  ✓ Einwohnermeldeamt München    │
│    Anmeldung neuer Adresse       │
│  ✓ Finanzamt                    │
│    Adressänderung                │
│  ✓ KFZ-Zulassungsstelle         │
│    Adressänderung                │
│                                  │
│  Optional (tippen zum Aktivieren)│
│  ○ Krankenversicherung [Name]   │
│  ○ Deutsche Rentenversicherung  │
│  ○ Arbeitgeber benachrichtigen  │
│                                  │
│  [Fortfahren →]                  │
└─────────────────────────────────┘
```

**Schritt 3 – Bestätigung:**
- Zusammenfassung (Alte Adresse → Neue Adresse)
- Großer „Jetzt bestätigen"-Button
- Biometrie-Prompt (Fingerabdruck / Face ID)
- Rechtlicher Hinweis: „Mit Ihrer Bestätigung ermächtigen Sie Open State zur Datenweitergabe gemäß Ihrer Einwilligung."

**Schritt 4 – Erfolgsscreen:**
- Animation: Häkchen erscheinen nacheinander für jede benachrichtigte Behörde
- Meldebestätigung: Sofort als PDF abrufbar
- „Erledigt in 2 Min 14 Sek" – Zeitanzeige (Gamification)
- Nächste Empfehlung: „Möchten Sie auch Ihren Führerschein aktualisieren?"

---

## 5. Screen 4 – CaseMatch AI: Bußgeld-Widerspruch

### Zweck
Komplexen Rechtsvorgang angstfrei und verständlich in < 3 Minuten abwickeln.

### Flow-Beschreibung

**Schritt 1 – Bescheid scannen:**
```
┌─────────────────────────────────┐
│  Bußgeldbescheid scannen        │
│                                  │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   [Kamerarahmen]        │    │
│  │   Bescheid ins Bild     │    │
│  │   halten                │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                  │
│  Oder: Aktenzeichen eingeben     │
│  [_________________________]     │
│                                  │
│  Oder: PDF hochladen             │
└─────────────────────────────────┘
```

**Schritt 2 – Erkannte Daten bestätigen:**
- OCR-Ergebnisse in editierbaren Feldern vorausgefüllt
- Falsch erkannte Felder rot markiert
- „Stimmt das so?" – Einfache Bestätigungslogik

**Schritt 3 – Situation beschreiben (strukturiert):**
```
┌─────────────────────────────────┐
│  Was ist passiert?              │
│                                  │
│  ○ Ich hatte Berechtigung       │
│    (Parkschein, Sondererlaubnis) │
│  ○ Das Zeichen war nicht        │
│    erkennbar                     │
│  ○ Ich war nicht der Fahrer     │
│  ○ Technischer Fehler möglich   │
│  ○ Anderer Grund...             │
│                                  │
│  Beweise hochladen (optional):  │
│  [📷 Foto] [📄 Dokument]        │
│  [📍 GPS-Daten verwenden]       │
└─────────────────────────────────┘
```

**Schritt 4 – CaseMatch AI Analyse (Loading-Screen):**
- Animierter Analyse-Screen: „Wir vergleichen Ihren Fall mit 847 ähnlichen Fällen..."
- Keine Spinner – stattdessen informative Animation mit Fortschrittsschritten
- Dauer: 2–4 Sekunden

**Schritt 5 – Ergebnis-Screen:**
```
┌─────────────────────────────────┐
│  Ihre Analyse                   │
│                                  │
│     78%                         │
│  ████████░░  Erfolgsquote       │
│  Widerspruch empfohlen          │
│                                  │
│  Basierend auf 847 ähnlichen    │
│  Fällen (2015–2025)             │
│                                  │
│  Wichtigste Faktoren:           │
│  ✓ Gültiger Parkschein (+++)    │
│  ✗ Halteverbot-Zone (--)        │
│                                  │
│  ⓘ Konfidenz: 74%              │
│  [Was bedeutet das?]            │
│                                  │
│  ┌──────────────────────┐       │
│  │ EMPFEHLUNG           │       │
│  │ Widerspruch einlegen │       │
│  │ Kostenlos · 2 Min    │       │
│  └──────────────────────┘       │
│                                  │
│  Alternativ: Vergleich für 62€  │
│  oder 3 × 21€ Ratenzahlung      │
│                                  │
│  ⚠️ Dies ist keine Rechtsberatung│
│  [Anwalt finden]                │
└─────────────────────────────────┘
```

**Schritt 6 – Widerspruch-Schriftsatz:**
- Vorschau des automatisch generierten Schreibens
- „Alles korrekt?" – Bürger kann Text nicht verändern (verhindert unbeabsichtigte Fehler), aber Ergänzungen hinzufügen
- Echtzeit-Validierung: „Alle Pflichtangaben vorhanden ✓"

**Schritt 7 – Einreichen:**
- eID-Signatur-Prompt
- Bestätigung: Widerspruch elektronisch zugestellt
- Statusverfolgung direkt in App

---

## 6. Screen 5 – Steuererklärung AutoFill

### Zweck
Steuererklärung von „gefürchtet" zu „erledigt in 4 Minuten" transformieren.

### Flow-Beschreibung

**Startscreen:**
- „Ihre Steuererklärung 2025 ist fast fertig"
- Fortschrittsbalken: „87 % vorausgefüllt – nur 3 Felder offen"
- Keine Formulare, keine Paragraphen – nur ein Überblick

**Überblick-Screen:**
```
┌─────────────────────────────────┐
│  Steuererklärung 2025           │
│  Vorausgefüllt aus:             │
│                                  │
│  ✓ Lohnsteuerbescheinigung      │
│    Arbeitgeber GmbH: 52.400€    │
│  ✓ Rentenbescheid               │
│    Deutsche Rentenvers.: 8.200€ │
│  ✓ Kirchensteuer                │
│    Automatisch übernommen       │
│  ✓ Krankenkassenbeiträge        │
│    AOK Bayern: 4.320€           │
│                                  │
│  ✎ Noch offen (3):             │
│  → Werbungskosten eingeben      │
│  → Spendennachweis hochladen    │
│  → Homeoffice-Tage angeben      │
│                                  │
│  Geschätzte Erstattung: ~1.240€ │
│                                  │
│  [Weiter → Fehlende ergänzen]   │
└─────────────────────────────────┘
```

**Fehlende Felder – geführte Eingabe:**
- Jeweils ein Feld pro Screen, mit Erklärung in Alltagssprache
- „Was sind Werbungskosten?" – aufklappbares Info-Panel
- Autosave nach jedem Feld

**Prüfungs-Screen:**
- Plausibilitätsprüfung: „Ihre Werbungskosten (8.400€) sind überdurchschnittlich. Haben Sie alle Belege?"
- KI-Hinweis: „Tipp: Ihr Homeoffice-Pauschbetrag könnte höher sein – 12 Monate × 6€ = 72€ mehr."

**Einreichungs-Screen:**
- Übersicht aller Werte, scrollbar
- Geschätzte Erstattung: **1.312 €** (aktualisiert)
- „Abschicken" per Fingerabdruck
- Bestätigung: ELSTER-Eingangsbestätigung in App

---

## 7. Screen 6 – Datentresor & Privatsphäre-Center

### Zweck
Vollständige Kontrolle über die eigenen Daten – transparent und verständlich.

### Layout-Beschreibung

**Hauptscreen:**
```
┌─────────────────────────────────┐
│  🔒 Ihr Datentresor             │
│  Letzter Zugriff: Heute 08:14  │
│                                  │
│  MEINE DATEN                    │
│  ┌─────────────────────────┐   │
│  │ Stammdaten              │   │
│  │ Name, Adresse, Ausweis  │   │
│  │ 4 Felder · [Ansehen]    │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Finanzdaten             │   │
│  │ Steuern, IBAN           │   │
│  │ Gesperrt · [Entsperren] │   │
│  └─────────────────────────┘   │
│                                  │
│  ZUGRIFFS-PROTOKOLL             │
│  Heute:                         │
│  08:14 Finanzamt → Adresse      │
│  07:52 KFZ-Stelle → Adresse     │
│  Gestern:                       │
│  14:31 EWO München → Stammdaten │
│  [Alle 23 Einträge ansehen]     │
│                                  │
│  EINWILLIGUNGEN                 │
│  5 aktiv · [Verwalten]          │
│                                  │
│  [📤 Alle Daten exportieren]    │
│  [🗑️ Konto löschen]             │
└─────────────────────────────────┘
```

**Zugriffs-Detail-Screen:**
- Für jeden Datenzugriff: Wer, wann, welche Daten, welcher Vorgang
- „War das ich?" – Meldebutton für unbekannte Zugriffe
- Kryptografischer Nachweis: Jeder Eintrag mit Signatur-Hash

---

## 8. Screen 7 – Gewerbeanmeldung (Unternehmensstart)

### Zweck
Firmengründung von wochenlangem Behördenmarathon auf 5 Minuten reduzieren.

### Flow-Beschreibung

**Auswahl Unternehmensform:**
```
┌─────────────────────────────────┐
│  Welche Rechtsform?             │
│                                  │
│  ┌─────────────────────────┐   │
│  │ 👤 Einzelunternehmen    │   │
│  │ Einfachste Form         │   │
│  │ Kein Mindestkapital     │   │
│  │ [Empfohlen für Start]   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🏢 UG (haftungsbeschr.) │   │
│  │ Ab 1 € Stammkapital     │   │
│  │ Haftungsbeschränkung    │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🏛️ GmbH                 │   │
│  │ 25.000€ Stammkapital    │   │
│  │ Volle Haftungsbeschr.   │   │
│  │ Notartermin erforderl.  │   │
│  └─────────────────────────┘   │
│                                  │
│  [Ich bin unsicher – Beratung]  │
└─────────────────────────────────┘
```

**Schritt-für-Schritt-Eingabe:**
- Unternehmensname (mit Verfügbarkeitsprüfung in Echtzeit)
- Geschäftsadresse (aus Profil vorausgefüllt)
- Haupttätigkeit (Freitext + Branchencode-Vorschläge)
- Steuernummer (existierende aus ELSTER, oder Neuantrag)

**Behörden-Übersicht:**
- Gewerbeamt: Anmeldung
- Finanzamt: Steuerliche Erfassung
- IHK: Mitgliedschaftsmeldung (automatisch)
- Krankenversicherung: Hinweis auf Pflichtversicherung Selbstständige

**Abschluss:**
- Gewerbeschein als PDF sofort in App
- IHK-Begrüßungspaket-Link
- Checkliste nächste Schritte (Geschäftskonto, Buchhaltung, Versicherungen)

---

## 8. Screen 8 – Barrierefreiheits- & Inklusionsmodus

### Zweck
Sicherstellen, dass Open State für alle 84 Millionen Bürger zugänglich ist.

### Funktionen

**Einfache Sprache (A2-Niveau):**
- Aktivierbar per Schalter in Einstellungen oder direkt auf jedem Screen
- Alle Texte werden vereinfacht: Keine Fachbegriffe, kurze Sätze
- Beispiel: „Widerspruch" → „Ich bin nicht einverstanden – das sage ich der Behörde"

**Vorlesefunktion:**
- Alle Texte vorlesen (über TTS, nicht nur Screen Reader)
- Eigenes, langsames Vorlesetempo einstellbar
- Wichtige Passagen werden beim Vorlesen hervorgehoben

**12 Sprachen:**
- Deutsch, Englisch, Türkisch, Arabisch, Russisch, Polnisch,
  Rumänisch, Kroatisch, Vietnamesisch, Dari/Farsi, Ukrainisch, Griechisch
- Vollständige Übersetzung aller Inhalte, keine automatische Maschinenübersetzung
- Einfache Sprache auch in allen Sprachen verfügbar

**Kontrastmodus / Große Schrift:**
- Hoher Kontrast (WCAG AAA)
- Schriftgröße: 100 % – 200 % stufenlos
- Einfacher Modus: Reduzierte Informationsdichte, nur das Nötigste

**Kiosk-Modus (Bürgeramt):**
- Vereinfachtes Layout für Touchscreen-Kioske im Bürgeramt
- Mitarbeiter kann assistieren: „Gemeinsam ausfüllen"-Modus
- Keine biometrische Authentifizierung nötig (PIN genügt)

---

## 9. Animationen & Micro-Interactions

**Guiding Principles:**
- Jede Animation hat eine Funktion – kein Selbstzweck
- Dauer: 150–300 ms für UI-Übergänge, 600–1200 ms für Erfolgs-Animationen
- Reduce Motion: Alle Animationen deaktivierbar (Barrierefreiheit)

**Wichtigste Animationen:**
| Animation | Trigger | Funktion |
|-----------|---------|----------|
| Checkmark-Sequenz | Vorgang abgeschlossen | Bestätigung + Belohnung |
| NFC-Puls-Ring | eID-Scan | Fortschritt + Führung |
| Analyse-Welle | CaseMatch lädt | Warten wird sichtbar + informativ |
| Datentresor-Schloss | Datenzugriff | Sicherheit visuell kommunizieren |
| Fortschrittsbalken | Mehrstufige Flows | Orientierung + Motivation |
| Haptic Feedback | Bestätigung / Fehler | Natürliche Interaktion (iOS/Android) |

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis ai-models/06_CaseMatch_Engine.md*
