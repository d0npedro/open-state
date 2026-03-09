# Verfahrensfairness Engine – Funktionsweise

---

## 1. Überblick

Die Verfahrensfairness Engine ist ein Analyse- und Informationsdienst. Sie verarbeitet strukturierte Ereignisse aus laufenden Verwaltungsvorgängen, wendet definierte Prüfmuster an und gibt Markierungen, Erklärungen und Vergleichsinformationen zurück.

Sie greift nicht in Verfahren ein. Sie beobachtet, bewertet und erklärt.

---

## 2. Kernfunktionen

### 2.1 Vergleich ähnlicher Fälle

Die Engine vergleicht den aktuellen Vorgang mit strukturell ähnlichen Vorgängen aus der anonymisierten Fallbasis. Ähnlichkeit wird anhand typisierter Merkmale bestimmt: Vorgangstyp, Domäne, beteiligte Behörden, Sachverhaltsmuster, Zeitraum.

Das Ergebnis ist keine Empfehlung und kein Urteil. Es ist eine Information: "In strukturell ähnlichen Vorgängen wurde wie folgt entschieden / wurde dieser Schritt durchgeführt / war die Bearbeitungszeit X."

Diese Information richtet sich primär an Sachbearbeitende, die eine Einschätzung des Normalbereichs erhalten, sowie an Bürgerinnen und Bürger, die verstehen möchten, ob ihr Verfahren im üblichen Rahmen liegt.

### 2.2 Erkennen widersprüchlicher Behandlung

Die Engine prüft, ob strukturell ähnliche Vorgänge innerhalb einer Behörde, einer Region oder eines Zeitraums wesentlich unterschiedlich behandelt wurden – ohne erkennbare sachliche Begründung für die Abweichung.

Ein "widersprüchliches Behandlungsmuster" ist definiert als: Gleicher Vorgangstyp, vergleichbarer Sachverhalt, gleiche zuständige Behörde – aber stark abweichendes Verfahrensergebnis oder stark abweichende Verfahrensdauer, ohne dokumentierte Begründung für die Abweichung.

Solche Muster werden für menschliche Prüfung markiert. Die Engine interpretiert sie nicht. Sie macht sie sichtbar.

### 2.3 Sichtbarmachen fehlender Begründungen

Jede Entscheidung in einem Verwaltungsvorgang soll begründet sein. Die Engine prüft, ob für definierte Verfahrensschritte Begründungen hinterlegt wurden. Fehlt eine Begründung, wird dies als Qualitätsmerkmal markiert.

Das bedeutet nicht, dass die Entscheidung falsch ist. Es bedeutet, dass die Dokumentation unvollständig ist – was ein eigenständiges Qualitätsproblem darstellt, unabhängig von der inhaltlichen Richtigkeit der Entscheidung.

### 2.4 Markieren unklarer Zuständigkeiten

Verwaltungsvorgänge scheitern häufig nicht an der inhaltlichen Bearbeitung, sondern daran, dass unklar ist, wer zuständig ist. Die Engine erkennt Vorgänge ohne eindeutig zugewiesene Zuständigkeit, Vorgänge mit mehrfach wechselnder Zuständigkeit ohne Dokumentation und Vorgänge, die zwischen Behörden hin- und hergewiesen werden, ohne Fortschritt zu erzielen.

### 2.5 Aufzeigen von Verfahrensstillstand

Die Engine erkennt Vorgänge, die über einen definierten Zeitraum keine Fortschrittsereignisse aufweisen. "Stillstand" ist domänenspezifisch kalibriert – was in der Arbeitsverwaltung als lange Liegezeit gilt, kann in einem komplexen Rechtsstreitverfahren normal sein.

Stillstandsmarkierungen sind keine Schuldzuweisungen. Sie sind Hinweise, die eine Überprüfung auslösen sollen: Liegt ein technisches Problem vor? Fehlen Unterlagen des Bürgers? Ist die Zuständigkeit ungeklärt? Ist die Kapazität der Behörde ausgelastet?

### 2.6 Prüfen auf unvollständige Dokumentationsketten

Ein Verwaltungsvorgang soll eine lückenlose Kette von Ereignissen, Entscheidungen und Begründungen aufweisen. Die Engine prüft, ob die Dokumentationskette vollständig ist: Gibt es Schritte ohne Dokumentation? Fehlen Eingangsnachweise? Sind Zeitstempel inkonsistent?

Unvollständige Dokumentationsketten sind ein Risiko für die Rechtssicherheit des Vorgangs und für die Nachvollziehbarkeit bei Widersprüchen.

### 2.7 Hinweise auf ungleiche Fristbehandlung

Fristen in Verwaltungsverfahren müssen für alle Beteiligten gleich gelten. Die Engine prüft, ob Fristen für vergleichbare Vorgänge konsistent gesetzt und angewendet werden. Auffälligkeiten wie deutlich kürzere oder längere Fristen gegenüber dem Vergleichsbereich werden markiert.

### 2.8 Erklärschicht für Bürger und Sachbearbeitung

Alle Ausgaben der Engine werden in zwei Sprachebenen aufbereitet:

- **Verwaltungssprache** für Sachbearbeitende: präzise, strukturiert, mit Verweis auf Prüfkriterien
- **Alltagssprache** für Bürgerinnen und Bürger: verständlich, ohne Fachbegriffe, mit erklärendem Kontext

Die Erklärschicht ist keine Zusammenfassung. Sie ist ein eigener Qualitätsstandard: Bürgerinnen und Bürger haben ein Recht darauf zu verstehen, was mit ihrem Vorgang geschieht.

---

## 3. Technische Verarbeitungslogik

```
Ereignis aus Domäne (strukturiert)
  → Normalisierung (Vorgangstyp, Merkmale, Zeitstempel)
  → Prüfmuster-Matching (regelbasiert + statistisch)
  → Vergleichsfall-Retrieval (anonymisierte Fallbasis)
  → Signalbewertung (Schwellenwerte, Domänenparameter)
  → Erklärungsgenerierung (Verwaltungs- und Alltagssprache)
  → Ausgabe: Markierungen + Erklärungen (keine Entscheidungen)
  → Audit-Log-Eintrag (unveränderlich)
```

Alle Prüfmuster sind öffentlich dokumentiert. Die Schwellenwerte sind konfigurierbar und unterliegen einer Versionierung. Änderungen an Prüfmustern oder Schwellenwerten werden im Audit-Log erfasst.

---

## 4. Einsatzdomänen

### 4.1 Arbeitsverwaltung

Prüfgebiete: Bearbeitungszeiten bei Leistungsanträgen, Konsistenz von Bescheiden, Begründungsqualität bei Ablehnungen, Vollständigkeit der Fallakte, Fristwahrung bei Widersprüchen.

### 4.2 Sozialleistungen

Prüfgebiete: Vergleichbarkeit von Bewilligungsentscheidungen, Vollständigkeit der Bedarfsprüfung, Dokumentation von Ermessensentscheidungen, Konsistenz regionaler Verfahrenspraxis.

### 4.3 Rechtsstreit und Bußgeld (mit CaseMatch-Integration)

Prüfgebiete: Konsistenz von Bußgeldbescheiden bei vergleichbaren Sachverhalten, Vollständigkeit von Bescheiddokumentationen, Fristberechnung, Bearbeitungszeiten im Widerspruchsverfahren. Die CaseMatch Engine liefert in dieser Domäne vertiefte Fallvergleichsanalysen.

### 4.4 Jugendhilfe

Prüfgebiete: Vollständigkeit von Hilfeplanverfahren, Dokumentation von Fachgesprächen, Konsistenz von Leistungsentscheidungen, Wahrung von Meldefristen, Zuständigkeitsdokumentation bei Fallübergaben.

### 4.5 Unternehmensgründung

Prüfgebiete: Bearbeitungszeiten bei Gewerbeanmeldungen, Konsistenz von Anforderungslisten, Vollständigkeit der Gründungsakte, Fristwahrung bei Rückfragen, Zuständigkeitsklarheit zwischen beteiligten Behörden.

---

## 5. Nicht-Funktionen

Die Engine:
- gibt keine Prognosen über Verfahrensergebnisse ab
- beeinflusst keine Verfahrensentscheidungen direkt
- lernt nicht aus Einzelfällen ohne expliziten Auditprozess
- kennt keine persönlichen Daten der Bürgerinnen und Bürger jenseits der für den Verfahrensvergleich notwendigen anonymisierten Strukturmerkmale
- hat keine Schreibrechte in Verfahrensakten

---

*Technische Detailspezifikationen zur Implementierung der Prüfmuster und Schwellenwerte sind in der internen Systemdokumentation hinterlegt und unterliegen dem regulären Versionierungsprozess.*
