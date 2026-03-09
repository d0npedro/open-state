# 08 – Steuerentlastung und Effizienzlogik: Arbeitsverwaltung

---

## Vorbemerkung

Effizienzgewinne in der Arbeitsverwaltung entstehen nicht durch Stellenabbau oder beschleunigte Entscheidungen zu Lasten von Qualität. Sie entstehen durch **Reduktion strukturell vermeidbarer Aufwände** – auf Seiten der Verwaltung und auf Seiten der Bürger.

Dieses Dokument benennt konkret, welche Reibungspunkte im heutigen System welche Kosten erzeugen und wie die Open-State-Domäne Arbeitsverwaltung diese Kosten strukturell reduziert.

---

## 1. Kostentreiber im Status quo

### 1.1 Informationsdefizit-induzierte Kontakte

**Problem:** Bürger wissen nicht, ob ihr Antrag angekommen ist, was fehlt, und wann sie eine Entscheidung erhalten. Sie rufen an oder erscheinen persönlich, um Statusinformationen zu erhalten.

**Kostenstruktur:** Jedes Inbound-Telefonat in einem größeren Leistungszentrum kostet schätzungsweise 8–15 Minuten Sachbearbeitungszeit. Bei Millionen von Anträgen jährlich ergibt sich ein signifikantes Volumen an Statusanfragen, die keinen inhaltlichen Mehrwert erzeugen.

**Open-State-Lösung:** Echtzeit-Statusanzeige in der App. Bürger, die jederzeit den Status sehen, rufen nicht an, um nachzufragen.

**Geschätzte Entlastung:** Reduktion statusbezogener Inbound-Kontakte um 60–75 % (Schätzung auf Basis vergleichbarer Modernisierungen in Österreich/Dänemark).

### 1.2 Unvollständige Erstanträge

**Problem:** Anträge werden ohne alle erforderlichen Unterlagen eingereicht, weil Bürger nicht wissen, was genau benötigt wird. Sachbearbeitung muss Rückfragen stellen, warten, erinnern, nacharbeiten.

**Kostenstruktur:** Ein vollständiger Erstantrag erfordert in einem effizienten System 1–2 Bearbeitungszyklen. Unvollständige Anträge erzeugen typischerweise 2–5 zusätzliche Zyklen mit je 15–30 Minuten Aufwand.

**Open-State-Lösung:** Strukturierte Antragsstrecke mit Vollständigkeitsprüfung, erklärender Dokumentenliste und sofortigem Feedback bei fehlenden Angaben. Bürger wissen vor dem Absenden, was noch fehlt.

**Geschätzte Entlastung:** Anteil vollständiger Erstanträge steigt von geschätzt 30–40 % auf > 75 %.

### 1.3 Unnötige Rückfragen durch Standardformulierungen

**Problem:** Rückfragen werden mit generischen Textbausteinen formuliert, die Bürger nicht verstehen. Bürger fragen nach, reichen Falsches ein, oder ignorieren die Anforderung. Mehrfachzyklen entstehen.

**Kostenstruktur:** Jede vermeidbare Rückfrage erzeugt mindestens 3–4 Kontaktpunkte (Rückfrage versenden, Antwort abwarten, Antwort prüfen, Nachfassen bei Nichtantwort).

**Open-State-Lösung:** Rückfragen können nur strukturiert, begründet und fristgebunden gestellt werden. Standard-Textbausteine ohne Konkretisierung sind technisch ausgeschlossen.

**Geschätzte Entlastung:** Rückfrage-Wiederholungsrate sinkt um ~50 %.

### 1.4 Fehlbescheide durch unvollständige Akten

**Problem:** Entscheidungen werden auf Basis unvollständiger Informationen getroffen, weil Sachbearbeitung nicht alle relevanten Dokumente vorliegen hat oder diese nicht korrekt zugeordnet sind.

**Kostenstruktur:** Fehlbescheide erzeugen Widersprüche, Klageverfahren, Neuberechnung, Nachzahlung oder Rückforderung. Ein Widerspruchsverfahren kostet die Verwaltung im Schnitt 200–400 € zusätzlich (Schätzung aus Verwaltungspraxis). Ein Klageverfahren deutlich mehr.

**Open-State-Lösung:** Vollständige, strukturierte Fallakte mit klarer Dokumentenzuordnung. Sachbearbeitung sieht immer die vollständige, aktuelle Aktenlage. Prüfprotokoll erzwingt explizite Auseinandersetzung mit jedem Kriterium.

**Geschätzte Entlastung:** Widerspruchsquote (informationsbedingt) sinkt um 30–50 %.

### 1.5 Terminchaos und Mehrfachbesuche

**Problem:** Bürger erscheinen persönlich, ohne dass alle Unterlagen vorliegen, weil die Anforderungen nicht klar kommuniziert wurden. Termin ist ineffektiv, neuer Termin nötig.

**Kostenstruktur:** Jeder ineffektive Termin bindet ca. 30–45 Minuten Sachbearbeitungszeit und Bürgerzeitaufwand (Anfahrt, Wartezeit, Gespräch).

**Open-State-Lösung:** Terminsystem zeigt Checkliste für den Termin. Bürger kommt vorbereitet oder Termin wird verschoben, wenn Checkliste nicht erfüllt ist.

**Geschätzte Entlastung:** Ineffektive Terminquote sinkt um 40–60 %.

### 1.6 Medienbrüche und Doppelerfassung

**Problem:** Informationen aus unterschiedlichen Kanälen (Brief, Fax, Portal, persönlicher Besuch) werden manuell in Systeme eingetragen. Fehlerquote ist hoch, Aufwand erheblich.

**Kostenstruktur:** Manuelle Erfassung eines Dokuments kostet 5–10 Minuten. Bei einem hohen Antragsvolumen mit durchschnittlich 5–8 Dokumenten pro Fall ergibt sich ein erheblicher Gesamtaufwand.

**Open-State-Lösung:** Alle Kanäle münden digital in die Fallakte. Dokumente werden per OCR vorklassifiziert. Manuelle Nacherfassung entfällt in der überwiegenden Mehrheit der Fälle.

**Geschätzte Entlastung:** Erfassungsaufwand sinkt um 70–85 %.

---

## 2. Effizienzformel (qualitativ)

```
VERMIEDENE KOSTEN (VK) pro Vorgang =

VK =   (Reduktion Statusanfragen × Ø Kosten/Anfrage)
     + (Anteil vollständiger Erstanträge × vermiedene Rückfragezyklen × Ø Kosten/Zyklus)
     + (Reduktion Fehlbescheide × Ø Kosten/Widerspruchsverfahren)
     + (Reduktion ineffektiver Termine × Ø Kosten/Termin)
     + (Reduktion Doppelerfassungen × Ø Kosten/Erfassung)
```

> **Hinweis:** Exakte Werte hängen von Volumen und institutionellen Rahmenbedingungen ab. Valide Zahlen können erst aus einem Pilotbetrieb gewonnen werden. Die Kostenstruktur ist auf Basis verfügbarer Verwaltungsstatistiken und Benchmarks aus vergleichbaren Digitalisierungsprojekten plausibel.

---

## 3. Qualitative Effizienzgewinne

Nicht alle Effizienzgewinne sind direkt monetarisierbar. Die folgenden Effekte sind qualitativ bedeutsam:

### 3.1 Bessere Ressourcennutzung in der Fachkraft-Arbeit

Wenn Sachbearbeitung weniger Zeit für Routineaufgaben (Status mitteilen, Dokumente erfassen, Rückfragen formulieren, Nachfassen bei Nichtantwort) aufwendet, steht mehr Zeit zur Verfügung für:
- Komplexe Einzelfallentscheidungen
- Beratung in Härtefällen
- Eingliederungsplanung
- Qualitätssicherung

Dies ist ein Zugewinn für die Qualität staatlichen Handelns, nicht nur für die Effizienz.

### 3.2 Geringere Fehler- und Eskalationskosten

Weniger Fehlbescheide bedeuten weniger Widersprüche, weniger Klageverfahren, weniger Nachberechnungen. Jedes verhinderte Eskalationsverfahren spart Ressourcen bei mehreren Stellen gleichzeitig (Verwaltung, Sozialgericht, Beratungsstellen).

### 3.3 Bessere Selbstklärung für Bürger

Bürger, die durch verständliche Erklärungen und klare To-do-Listen in die Lage versetzt werden, ihren Fall selbst zu verfolgen und ihre Mitwirkung eigenständig zu erfüllen, entlasten die Verwaltung systematisch. Dies ist keine Verlagerung von Aufwand auf den Bürger – es ist die Beseitigung von Hindernissen, die Bürger heute daran hindern, eigenverantwortlich zu handeln.

### 3.4 Höhere Verfahrensqualität als Vertrauenskapital

Ein System, das nachvollziehbar, fehlertolerant und transparent ist, wird von Bürgern vertraut. Vertrauen reduziert Compliance-Kosten (weniger Betrug, weniger Widerspruch aus Misstrauen) und erhöht die Mitwirkungsbereitschaft.

---

## 4. Einordnung in das Gesamtfinanzmodell

Die Arbeitsverwaltungs-Domäne ist ein Teil der fiskalischen Effizienzrendite-Kalkulation des Gesamtprojekts Open State (vgl. [roadmap/09_Monetarisierung_Finanzmodell.md](../../../roadmap/09_Monetarisierung_Finanzmodell.md)).

Die Bundesagentur für Arbeit und die Jobcenter verwalten jährlich Ausgaben von deutlich über 40 Mrd. € (ALG I, Bürgergeld, Eingliederungsleistungen, Verwaltungsaufwand). Selbst eine Effizienzsteigerung im Verwaltungsaufwand von 10–15 % bedeutet fiskalisch eine erhebliche Entlastung.

**Kein Versprechen – sondern eine Messaufgabe:** Die tatsächlich erzielbaren Einsparungen können erst nach validierten Pilotdaten seriös beziffert werden. Dieses Dokument zeigt die Logik der Einsparung, nicht ihre finale Quantifizierung.

---

## 5. Was dieser Ansatz nicht tut

Zur Klarheit: Diese Domäne zielt nicht auf:
- Stellen-Abbau in der Verwaltung
- Verdrängung menschlicher Beratung
- Beschleunigung auf Kosten von Rechtssicherheit
- Kostensenkung durch Leistungsreduzierung

Sie zielt auf die **Qualitätsverbesserung staatlichen Handelns** durch strukturell bessere Prozesse, die gleichzeitig effizienter und bürgergerechter sind.

---

*Weiter: [09_UX_PRINZIPIEN.md](09_UX_PRINZIPIEN.md)*
