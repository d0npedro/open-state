# 05 – Transparenz und Nachvollziehbarkeit: Arbeitsverwaltung

---

## Leitprinzip

> Bürger dürfen nicht nur Anträge absenden. Sie müssen den Verwaltungszustand nachvollziehen können.

Transparenz in der Arbeitsverwaltung ist keine optionale Komfortfunktion. Sie ist eine **rechtliche und demokratische Anforderung** und gleichzeitig der wirksamste Mechanismus zur Reduktion unnötiger Kommunikation, Rückfragen und Eskalationen.

---

## 1. Was Bürger standardmäßig sehen

Ohne gesonderten Antrag, ohne Nachfrage, sofort nach Eingang des Vorgangs:

### 1.1 Status-Dashboard (Bürger-Hauptansicht)

```
IHRE OFFENEN VORGÄNGE
────────────────────────────────────────────────────────────────────
Vorgang: Leistungsantrag ALG I
Status:  🟡 Prüfung läuft
Seit:    [Datum der Statusänderung]
────────────────────────────────────────────────────────────────────
📋 OFFENE AUFGABEN FÜR SIE (2)
  ⚠ Arbeitsbescheinigung einreichen      Frist: [Datum]
  ⚠ Kontoauszug letzter 3 Monate        Frist: [Datum]

✅ ERLEDIGTE AUFGABEN
  ✓ Antrag eingereicht                   Eingegangen: [Datum]
  ✓ Personalausweis geprüft             [Datum]

🔜 NÄCHSTE ERWARTETE SCHRITTE
  Nach Eingang Ihrer Unterlagen beginnt die inhaltliche Prüfung.
  Typische Dauer: 5–10 Werktage nach vollständigem Eingang.

📌 ZUSTÄNDIGE STELLE
  Agentur für Arbeit [Standort]
  Sachbearbeitung: Herr/Frau [anonymisierter Bezeichner]
  Erreichbar: [Kontaktweg / Terminbuchung]
────────────────────────────────────────────────────────────────────
```

### 1.2 Vollständiger Ereignisverlauf

Bürger können jederzeit eine chronologische Liste aller Ereignisse ihres Falls einsehen:

```
VERLAUF IHRES VORGANGS
────────────────────────────────────────────────────────────────────
[Datum, Uhrzeit] – Vorgang angelegt
[Datum, Uhrzeit] – Identität bestätigt
[Datum, Uhrzeit] – Unterlagen angefordert (Liste: A, B, C)
[Datum, Uhrzeit] – Arbeitsbescheinigung eingegangen
[Datum, Uhrzeit] – Sachbearbeitung hat begonnen
[Datum, Uhrzeit] – Rückfrage gestellt (zur Arbeitsbescheinigung)
[Datum, Uhrzeit] – Sie haben die Rückfrage beantwortet
...
────────────────────────────────────────────────────────────────────
```

Jeder Eintrag ist anklickbar und liefert den zugehörigen Kontext.

### 1.3 Dokumentenstatus

Für jedes angefordertes oder eingereichte Dokument:

```
IHRE UNTERLAGEN
────────────────────────────────────────────────────────────────────
✅ Antrag auf ALG I             Eingegangen [Datum] – Anerkannt
✅ Personalausweis (eID)        Verifiziert [Datum]
⏳ Arbeitsbescheinigung         Eingegangen [Datum] – Wird geprüft
⚠ Kontoauszug (3 Monate)      Noch nicht eingereicht – Frist: [Datum]
────────────────────────────────────────────────────────────────────
```

---

## 2. Was sichtbar ist bei spezifischen Ereignissen

### 2.1 Bei Rückfrage (was fehlt und warum)

```
🔔 NEUE RÜCKFRAGE
────────────────────────────────────────────────────────────────────
Was wird benötigt:
  Vollständige Arbeitsbescheinigung inkl. Angaben zu
  Beschäftigungsdauer und Grund der Beendigung

Warum wird das benötigt:
  Für die Berechnung des Anspruchs auf Arbeitslosengeld I muss
  die Beschäftigungsdauer der letzten 30 Monate nachgewiesen werden
  (§ 142 SGB III).

Was fehlt in Ihrer eingereichten Version:
  Die Angabe zum Beendigungsgrund fehlt. Ohne diese kann der
  Anspruch nicht geprüft werden.

Frist für Ihre Antwort:  [Datum]

Was passiert, wenn Sie nicht antworten:
  Wir werden Sie einmal erinnern. Falls nach Fristablauf keine
  vollständige Unterlage vorliegt, informieren wir Sie über
  die weiteren Schritte.

[Dokument einreichen] [Ich benötige mehr Zeit] [Frage stellen]
────────────────────────────────────────────────────────────────────
```

### 2.2 Bei Bearbeitungsstillstand

Wenn ein Fall sich über einen definierten Zeitraum nicht bewegt und dies intern nicht begründet ist, wird dies für Sachbearbeitung sichtbar (Eskalationsmarker) und für Bürger transparent gemacht:

```
ℹ️ HINWEIS ZU IHREM VORGANG
Ihr Vorgang befindet sich seit [X Tagen] in der Prüfungsphase.
Dies kann Folgendes bedeuten:
  • Die Prüfung dauert aufgrund von Komplexität länger
  • Es wird intern abgestimmt
  • Ein weiterer Schritt steht unmittelbar bevor

Falls Sie Fragen haben oder eine dringende Situation vorliegt:
[Termin anfragen] [Dringende Situation melden]
```

Intern: System generiert automatisch eine Wiedervorlage-Aufgabe für die Sachbearbeitung.

### 2.3 Bei Zuständigkeitswechsel

```
📋 ÄNDERUNG IN IHREM VORGANG
Ihr Fall wurde an eine andere Bearbeitungsperson übergeben.

Übergebende Stelle:   Sachbearbeitung [Stelle A]
Übernehmende Stelle:  Sachbearbeitung [Stelle B]
Datum der Übergabe:   [Datum]
Grund der Übergabe:   [z.B. „Zuständigkeitswechsel aufgrund Wohnortwechsel"]

Alle Ihre bisher eingereichten Unterlagen und Informationen
bleiben vollständig erhalten. Sie müssen nichts erneut einreichen.
```

---

## 3. Was aus Datenschutzgründen nicht offen angezeigt wird

### 3.1 Interne Bewertungen und Arbeitsdokumente

- Interne Notizen der Sachbearbeitung
- Systemseitige Priorisierungspunkte (numerisch)
- Interne Qualitätsbewertungen
- Kommunikation zwischen Behörden (soweit nicht Bestandteil der offiziellen Fallkommunikation)

**Begründung:** Schutz der Funktionsfähigkeit des Verwaltungshandelns (§ 25 Abs. 3 SGB X), Schutz von Persönlichkeitsrechten Dritter.

### 3.2 Daten anderer Personen

Auch in Haushalts-/Bedarfsgemeinschaften sieht jede Person nur ihre eigenen Daten sowie die für den gemeinsamen Vorgang relevanten aggregierten Angaben – nicht die Einzeldaten der anderen Haushaltsmitglieder, sofern diese keine gesonderte Freigabe erteilt haben.

### 3.3 Laufende Ermittlungssachverhalte

Falls ein Fall parallel einem Ermittlungsverfahren (z.B. Leistungsmissbrauch) zugeordnet ist, werden die Ermittlungsinformationen nicht in der Bürger-Sicht angezeigt. Der Fall bleibt sichtbar, der Ermittlungszusatz wird ausgeblendet.

> **Rechtliche Offenheit:** Die genaue Grenzziehung zwischen Akteneinsichtsrecht (§ 25 SGB X) und Schutz des Verwaltungshandelns erfordert juristische Prüfung je Einzelfall-Kategorie.

---

## 4. Wie Entscheidungen erklärt werden

Jeder Bescheid wird mit einer Erklärungsschicht versehen:

```
IHR BESCHEID ZUM VORGANG [ID]
════════════════════════════════════════════════════════════════════

WAS WURDE ENTSCHIEDEN:
  Ihnen wird Arbeitslosengeld I in Höhe von [Betrag] täglich
  für voraussichtlich [X] Monate gewährt.

WARUM DIESE ENTSCHEIDUNG:
  Auf Basis der eingereichten Unterlagen wurden folgende
  Kriterien erfüllt:
  ✓ Beschäftigungsdauer in den letzten 30 Monaten: [X Monate]
  ✓ Beitragszahlung zur Arbeitslosenversicherung: [X Monate]
  ✓ Persönliche Arbeitslosmeldung: erfolgt
  ✓ Verfügbarkeit für den Arbeitsmarkt: bestätigt

  Der Bemessungszeitraum ist [Zeitraum], das Bemessungsentgelt
  beträgt [Betrag] (§ 151 SGB III).

WAS DAS KONKRET BEDEUTET:
  Ab [Startdatum] erhalten Sie Leistungen. Die Auszahlung
  erfolgt monatlich nachträglich auf Ihr angegebenes Konto.

IHRE NÄCHSTEN SCHRITTE:
  • Stellensuche dokumentieren (Mitwirkungspflicht)
  • Änderungen melden (Einkommen, Beschäftigung, Adresse)
  • Vermittlungsvorschläge prüfen

WIE SIE WIDERSPRUCH EINLEGEN KÖNNEN:
  Sie haben das Recht, innerhalb eines Monats nach Erhalt
  dieses Bescheids Widerspruch einzulegen.
  [Widerspruch einlegen] – kostenlos, direkt in der App

VOLLSTÄNDIGER RECHTLICHER BESCHEID:
  [Rechtliche Fassung öffnen] (formal-rechtliche Version)
════════════════════════════════════════════════════════════════════
```

---

## 5. Wie Bürger Rückfragen effizient beantworten können

Rückfragen sind strukturiert gestellt und verlangen strukturierte Antworten:

- Kein Freitext-E-Mail
- Klare Antwortoptionen: [Dokument einreichen] / [Erläuterung hinzufügen] / [Fristverlängerung beantragen] / [Ich habe dieses Dokument nicht]
- Bei „Ich habe dieses Dokument nicht": Alternativwege werden angeboten (z.B. Selbstauskunft, eidesstattliche Erklärung – je nach rechtlicher Grundlage)
- Jede Antwort wird sofort bestätigt: Zeitstempel + „Ihre Antwort wurde zugeordnet zu: Rückfrage vom [Datum]"

---

## 6. Technische Transparenzschicht

### 6.1 Audit-Log (Bürger-Sicht)

Bürger können jederzeit den vollständigen Datenzugriffs-Log einsehen:

```
DATENZUGRIFFS-PROTOKOLL (eigene Daten)
────────────────────────────────────────────────────────────────────
[Datum, Uhrzeit] – Zugriff: Sachbearbeitung Agentur für Arbeit [Standort]
  Zugegriffene Daten: Antragsdaten, Dokument A
  Rechtsgrundlage: § 67a SGB X (Verarbeitung für Aufgaben nach SGB III)

[Datum, Uhrzeit] – Zugriff: Träger [Name]
  Zugegriffene Daten: Maßnahmenteilnahme-Daten
  Rechtsgrundlage: Einwilligung vom [Datum] (widerrufbar)
────────────────────────────────────────────────────────────────────
```

### 6.2 Datentresor-Export

Bürger können jederzeit alle ihre Daten vollständig exportieren:
- Format: strukturiertes JSON + menschenlesbares PDF
- Enthält: alle Antragsdaten, alle eingereichten Dokumente, vollständige Kommunikationshistorie, Datenzugriffs-Log
- Lieferung: innerhalb 24 Stunden (technisch, < 72 Stunden gesetzlich)

---

*Weiter: [06_DATENMODELL_UND_API_SKIZZE.md](06_DATENMODELL_UND_API_SKIZZE.md)*
