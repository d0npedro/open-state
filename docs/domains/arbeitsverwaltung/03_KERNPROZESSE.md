# 03 – Kernprozesse: Arbeitsverwaltung

---

## Vorbemerkung

Alle Prozesse in dieser Domäne folgen dem Grundsatz: **Jeder Schritt ist für Bürger und Sachbearbeitung gleichermaßen nachvollziehbar, dokumentiert und begründet.**

KI-gestützte Unterstützungsfunktionen sind explizit als solche gekennzeichnet. Sie unterstützen – sie entscheiden nicht.

---

## Prozess A – Arbeitslosmeldung

### A.1 Ausgangspunkt und Eingang

Der Bürger meldet sich arbeitslos – digital per App, per Kiosk oder (übergangsweise) persönlich. Alle Kanäle münden in dieselbe digitale Fallanlage.

**Schritt 1: Identifikation**
- eID-Authentifizierung (NFC-Scan des Personalausweises)
- Einmaliger Identifikationsvorgang – keine erneute Verifikation bei Folgevorgängen (Same-Session oder gespeichertes Profil)
- Ergebnis: verifizierbarer Identitätsdatensatz, DSGVO-konform

**Schritt 2: Anliegen strukturieren**
- Bürger wählt „Arbeitslosmeldung" aus dem Modulmenü
- System zeigt eine klar formulierte Einstiegsfrage: „Sind Sie derzeit beschäftigt?" / „Wann endet Ihr Beschäftigungsverhältnis?"
- Keine Freitexteingabe für Kerndaten – strukturierte Auswahl, ergänzt durch Freitextfeld für Hinweise

**Schritt 3: Eingangsbestätigung**
- Sofortige Bestätigung: Uhrzeit, Datum, eindeutige Vorgangs-ID
- Fallakte wird angelegt
- Zuständige Stelle wird systemseitig ermittelt (nach Wohnort und Anspruchsart)
- Bürger sieht: „Ihre Meldung ist eingegangen. Zuständig: [Agentur/Jobcenter, Adresse, Telefon, digitale Kontaktstelle]"

### A.2 Fallanlage und Erstprüfung

**Schritt 4: Datenvorbefüllung**
- Wo möglich, werden vorhandene Daten aus dem Bürger-Datentresor vorbefüllt (Adresse, Personaldaten, ggf. vorherige Vorgänge)
- Kein Doppelerfassen von Daten, die der Staat bereits kennt (Once-Only-Prinzip)

**Schritt 5: Unterlagenübersicht**
- System zeigt strukturierte Liste der erforderlichen Unterlagen mit:
  - Bezeichnung (verständlich)
  - Begründung (warum wird dieses Dokument benötigt?)
  - Format (digital, Scan, Foto)
  - Frist (wann muss es spätestens vorliegen?)

**Typische Unterlagen:**
- Arbeitsbescheinigung des Arbeitgebers (§ 312 SGB III) – mit Erklärung, was das ist
- Personalausweisdaten (bereits via eID vorhanden)
- Kündigung oder Aufhebungsvertrag
- Ggf. Nachweise zu sonstigen Einkünften

**Schritt 6: Statusanzeige**
- Nach Anlage: Bürger sieht einen Fortschrittsbalken mit Phasen:
  `[Meldung eingegangen] → [Prüfung läuft] → [Unterlagen vollständig] → [Entscheidung] → [Bescheid]`
- Jede Phase ist erklärbar: Tooltip-Text erklärt, was in dieser Phase geprüft wird

---

## Prozess B – Leistungsantrag

### B.1 Antragsdatenerfassung

**Schritt 1: Antragsart bestimmen**
- System fragt gezielte Qualifikationsfragen (Beschäftigungsdauer, Einkommenssituation, Haushalt)
- Systemseitige Ersteinschätzung: „Für Sie kommt voraussichtlich [ALG I / Bürgergeld] in Frage" – mit Erläuterung und Hinweis, dass dies keine rechtlich verbindliche Feststellung ist

**Schritt 2: Strukturierte Dateneingabe**
- Haushaltsdaten
- Einkommens- und Vermögensverhältnisse
- Miet- und Wohnkosten
- Sonstige Bedarfe und Einschränkungen
- Jedes Feld enthält einen kurzen Erklärungstext: Was soll hier angegeben werden und warum?

**Schritt 3: Plausibilitätsprüfung (KI-gestützt)**
- System prüft Eingaben auf interne Konsistenz und offensichtliche Unstimmigkeiten
- Keine Ablehnung durch das System – nur Hinweise an den Bürger: „Die Angabe zu Ihren Mietkosten scheint ungewöhnlich hoch. Bitte prüfen Sie Ihre Eingabe oder ergänzen Sie einen Hinweis."
- Bürger kann Hinweis bestätigen oder korrigieren
- Systemhinweise sind erklärbar: keine Blackbox-Warnung

**Schritt 4: Dokumente**
- Strukturierte Dokumentenliste mit Priorisierung (was ist sofort benötigt, was kann nachgereicht werden?)
- Upload-Funktion: Drag-and-Drop oder Kamerafoto
- Automatische Dokumentenerkennung (OCR + Klassifikation) als Vorschlag – Sachbearbeitung prüft und bestätigt

**Schritt 5: Absenden und Bestätigung**
- Bürger erhält Eingangsbestätigung mit vollständiger Übersicht der gemachten Angaben (PDF-Download)
- Hinweis: Was passiert als nächstes? Wann ist mit einer ersten Rückmeldung zu rechnen?

---

## Prozess C – Rückfrage und Dokumentennachreichung

> Rückfragen sind der häufigste Kontaktpunkt und gleichzeitig der größte Frustrationsauslöser. Sie müssen konkret, begründet und fristgebunden sein.

**Schritt 1: Rückfrage aus Sachbearbeitung**
- Sachbearbeitung formuliert Rückfrage über ein strukturiertes Rückfrage-Formular:
  - Art der Anforderung (Dokument / Klarstellung / Korrektur)
  - Konkreter Inhalt der Anforderung (kein Standard-Textbaustein ohne Konkretisierung)
  - Begründung (warum wird dies benötigt?)
  - Frist (Datum, nicht „schnellstmöglich")
  - Konsequenz bei Nichterfüllung (klar, sachlich, nicht drohend)

**Schritt 2: Benachrichtigung Bürger**
- Push-Notification + E-Mail (sofern hinterlegt)
- Inhalt: „Sie haben eine neue Rückfrage zu Ihrem Vorgang [ID]. Bitte antworten Sie bis [Datum]."

**Schritt 3: Bürger antwortet**
- Bürger sieht die Rückfrage vollständig und verständlich aufbereitet
- Möglichkeit: Dokument hochladen, Erläuterung hinzufügen, oder: „Ich benötige mehr Zeit" mit Begründung
- Fristverlängerungsantrag ist einfach stellbar (mit kurzer Begründung)

**Schritt 4: Eingang bei Sachbearbeitung**
- Antwort erscheint in der Fallakte mit Zeitstempel
- Sachbearbeitung erhält Benachrichtigung
- Dokumente sind direkt der betreffenden Rückfrage zugeordnet (kein manuelles Zuordnen nötig)

**Schritt 5: Quittung an Bürger**
- Automatische Bestätigung: „Ihre Antwort ist eingegangen. Wir prüfen die eingereichten Unterlagen."
- Statusanzeige aktualisiert sich

---

## Prozess D – Sachbearbeitung: Fallbearbeitung

### D.1 Fallübersicht

Sachbearbeiterinnen und Sachbearbeiter sehen eine vollständige, geordnete Fallansicht:

```
FALLAKTE #AV-2024-XXXXXX
────────────────────────────────────────────────────────
Person:          [Anzeigename – nicht für Bericht relevant]
Vorgangstyp:     Leistungsantrag ALG I
Status:          Prüfung läuft
Priorität:       Mittel [Systemvorschlag – manuell anpassbar]
Zuständig:       Sachbearbeiter/in [Name] seit [Datum Zuweisung]
────────────────────────────────────────────────────────
OFFENE PUNKTE:   2 (Dokument B ausstehend, Rückfrage 1 unbeantwortet)
FRISTEN:         Frist Dokument B: [Datum]
LETZTES EREIGNIS: [Datum/Uhrzeit] – Bürger hat Dokument A hochgeladen
────────────────────────────────────────────────────────
BEARBEITUNGSHISTORIE: [Vollständige, zeitgestempelte Liste aller Ereignisse]
KOMMUNIKATIONSHISTORIE: [Alle Rückfragen, Antworten, Bescheide]
```

### D.2 Entscheidungsvorbereitung

- Sachbearbeitung füllt ein strukturiertes Prüfprotokoll aus:
  - Geprüfte Kriterien (mit Quellenangabe: welches Gesetz, welcher Paragraph)
  - Ergebnis der Prüfung je Kriterium
  - Offene Punkte / Unsicherheiten (explizit markierbar)
  - Empfehlung / Entscheidungsvorschlag
- KI-Assistenz: Systemvorschlag auf Basis vergleichbarer Fälle – als Hinweis, nicht als Entscheidung
- Alle Systemvorschläge werden explizit als solche markiert; menschliche Prüfung und Bestätigung ist Pflicht

### D.3 Priorisierung

- Systemvorschlag für Priorisierung auf Basis objektiver Kriterien:
  - Verbleibende Frist bis Leistungsbeginn
  - Indikation auf besondere Dringlichkeit (z.B. Obdachlosigkeit, gesundheitliche Einschränkung)
  - Vollständigkeit der Akte (vollständige Akte = schneller entscheidbar)
  - Wartezeit des Falls
- Priorisierung ist manuell überschreibbar (dokumentiert)
- Keine automatische Prioritätszuweisung, die zu Diskriminierung führen könnte – regelmäßiges Bias-Audit der Priorisierungslogik

---

## Prozess E – Bescheiderstellung und Zustellung

### E.1 Bescheid erstellen

**Schritt 1: Prüfprotokoll abschließen**
- Sachbearbeitung dokumentiert die Entscheidungsgrundlage im strukturierten Prüfprotokoll
- Für jedes Kriterium: Sachverhalt → angewendete Norm → Ergebnis

**Schritt 2: Bescheid generieren**
- System erzeugt zwei Versionen:
  - **Rechtliche Fassung:** Formal korrekte Verwaltungsentscheidung (Pflichtinhalt nach §§ SGB X)
  - **Erklärungs-Overlay:** Verständliche Zusammenfassung in klarer Sprache, direkt über die rechtliche Fassung gelegt (ausblendbar)
- Erklärung enthält:
  - Was wurde entschieden?
  - Warum? (in maximal 3 Sätzen ohne Juristendeutsch)
  - Was bedeutet das konkret für den Bürger?
  - Was kann der Bürger tun, wenn er anderer Meinung ist?
  - Widerspruchsfrist + Widerspruchsweg

**Schritt 3: Interne Qualitätsprüfung**
- Vier-Augen-Prinzip bei Bescheiden über bestimmten Schwellenwerten (Betrag / Komplexität) – konfigurierbar je nach institutionellen Vorgaben

### E.2 Bescheid zustellen

**Schritt 4: Zustellereignis**
- Digitale Zustellung in die Fallakte (primär)
- Optionale postalische Zustellung (nach Bürger-Präferenz oder gesetzlicher Pflicht)
- Zustellzeitpunkt wird protokolliert und ist im Audit-Log nachvollziehbar
- Bürger erhält Benachrichtigung: „Ihr Bescheid zu Vorgang [ID] liegt vor."

**Schritt 5: Einsicht und Widerspruch**
- Bürger öffnet Bescheid in der App
- Erklärungs-Overlay ist standardmäßig aktiviert
- Button „Widerspruch einlegen" mit Begleithinweis zu Fristen und Wegen
- Widerspruchseingang wird sofort bestätigt und in die Fallakte eingetragen

---

## Prozess F – Vermittlungsprozess

### F.1 Stellenvorschläge und Anforderungsprofil

- Bürger pflegt im Rahmen des Vorgangs ein strukturiertes Anforderungsprofil:
  - Beruf, Qualifikation, Erfahrung
  - Bevorzugter Tätigkeitsbereich
  - Geografische Flexibilität
  - Einschränkungen (z.B. gesundheitlich)
- Anforderungsprofil ist ausschließlich auf Initiative des Bürgers sichtbar für Arbeitsvermittlung

- Vermittlungsvorschläge erscheinen in der Fallakte
- Bürger muss jeden Vorschlag kommentieren (strukturiert: angenommen / abgelehnt mit Begründung)

> **Rechtliche Offenheit:** Die digitale Abbildung von Zumutbarkeitsprüfungen (§ 140 SGB III) erfordert juristisch sorgfältige Gestaltung. Keine automatisierte Zumutbarkeitsprüfung ohne menschliche Letztentscheidung.

### F.2 Mitwirkungspflichten bei der Stellensuche

- Nachweis der Bewerbungsbemühungen: strukturiertes Eingabeformular (Datum, Unternehmen, Ergebnis)
- Keine Kontrolle durch das System – Sachbearbeitung sieht und bewertet
- Fehlende Nachweise lösen eine Erinnerung aus (keine Sanktion – erst nach menschlicher Prüfung)

---

## Prozess G – Änderungsmitteilung

- Bürger kann jederzeit Änderungen melden:
  - Neue Beschäftigung
  - Einkommensänderung
  - Adressänderung
  - Änderung der Haushaltssituation
  - Krankheit / Arbeitsunfähigkeit
- Strukturierte Eingabemaske, kein Freitext
- Änderung erscheint in der Fallakte mit Zeitstempel und Bürger-Eingabe
- Sachbearbeitung wird informiert
- Relevante Fristen und Auswirkungen werden dem Bürger transparent angezeigt: „Eine Einkommensänderung kann Auswirkungen auf Ihren Leistungsanspruch haben. Wir prüfen und informieren Sie."

---

## Prozess H – Eskalation und Härtefälle

**Eskalationsgründe:**
- Akute Existenzbedrohung (Obdachlosigkeit, keine Mittel für Lebensmittel)
- Vulnerable Personengruppen (Schwerbehinderung, chronische Erkrankung, Alleinerziehend)
- Verfahrensdauer überschreitet institutionelle Grenzwerte
- Widerspruch läuft parallel

**Eskalationsweg:**
1. Bürger kann Eskalation beantragen (mit kurzer Begründung)
2. System flaggt Fall für Teamleitung
3. Teamleitung prüft und bestätigt oder gibt Rückmeldung über Grund der Ablehnung
4. Eskalierter Fall wird in der Priorisierungsliste nach oben gerückt
5. Bürger sieht: „Ihr Fall wurde als dringend markiert."

> **Wichtig:** Eskalation ist ein menschlicher Prozess. Kein Algorithmus entscheidet allein über Dringlichkeit.

---

*Weiter: [04_FALLAKTE_UND_STATUSMODELL.md](04_FALLAKTE_UND_STATUSMODELL.md)*
