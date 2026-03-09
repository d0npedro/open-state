# 07 – Risiken, Grenzen und rechtliche Offenheit: Arbeitsverwaltung

---

## Vorbemerkung

Dieses Dokument benennt explizit, was noch nicht gelöst ist, was Grenzen hat und wo menschliches oder juristisches Urteil unersetzbar ist. Es ist ein Qualitätsmerkmal dieses Projekts, solche Stellen nicht zu verschweigen oder mit Buzzwords zu überdecken.

---

## 1. Rechtliche Offenheit und Abstimmungsbedarf

### 1.1 Zuständigkeitsabgrenzung SGB II / SGB III

Die Domäne beschreibt Prozesse, die je nach Person und Lebenslage entweder in die Zuständigkeit der Agentur für Arbeit (SGB III) oder des Jobcenters / kommunalen Trägers (SGB II) fallen. Die Abgrenzung ist nicht immer trivial und kann auch gemischte Zuständigkeiten erzeugen.

> **Offener Punkt:** Die systemseitige Ersteinschätzung der Zuständigkeit (welche Stelle ist für wen zuständig?) erfordert eine fachlich und rechtlich abgesicherte Entscheidungslogik, die nicht automatisiert und ohne menschliche Prüfung betrieben werden darf.

**Maßnahme:** Systemvorschlag + obligatorische menschliche Bestätigung; klarer Hinweis an Bürger, dass die Zuständigkeit erst nach Prüfung final bestimmt wird.

### 1.2 Digitale Vollmachten (§ 13 SGB X)

Die rechtliche Grundlage für digitale Bevollmächtigungen in sozialrechtlichen Verwaltungsverfahren ist klärungsbedürftig. Analoge Vollmachten nach § 13 SGB X sind heute Standard; die digitale Abbildung erfordert:
- Formklärung (reicht digitale Signatur? eID?)
- Abgrenzung von gesetzlicher Betreuung (BtG-Reform berücksichtigen)
- Widerrufsprozess

> **Offener Punkt:** Vollmachtsmodul benötigt explizite juristische Prüfung und ggf. gesetzliche Klarstellung.

### 1.3 Anhörungspflichten (§ 24 SGB X)

Vor Erlass eines belastenden Verwaltungsakts ist der Betroffene anzuhören. Die digitale Abbildung dieser Pflicht muss sicherstellen:
- Die Anhörung erfolgt tatsächlich (nicht nur formal)
- Die Reaktionsfrist ist dem Bürger klar kommuniziert
- Keine automatisierte Bescheiderstellung ohne dokumentierte Anhörungsmöglichkeit

> **Offener Punkt:** Der genaue Workflow für die digitale Anhörung (§ 24 SGB X) vor belastenden Bescheiden muss rechtlich abgesichert spezifiziert werden.

### 1.4 Akteneinsichtsrecht (§ 25 SGB X)

Das Recht auf Akteneinsicht ist gesetzlich verankert. Die digitale Umsetzung bietet eine Chance, dieses Recht strukturell besser zu erfüllen als heute. Gleichzeitig gibt es geschützte Bereiche:
- Schutz interner Deliberationsdokumente
- Schutz von Daten Dritter
- Schutz von Informationen, deren Offenlegung den Verwaltungsvollzug gefährden würde

> **Offener Punkt:** Die genaue Grenzziehung zwischen automatisch sichtbaren und geschützten Informationen erfordert Abstimmung mit Datenschutzbeauftragten und fachlicher Praxis.

### 1.5 Schriftformerfordernis

Bestimmte Verwaltungsakte erfordern gesetzlich die Schriftform (§ 33 SGB X). Die Definition von „elektronischem Dokument mit qualifizierter elektronischer Signatur" als Schriftformäquivalent (§ 36a SGB I) muss systemseitig korrekt abgebildet werden.

> **Offener Punkt:** Nicht alle Bescheidtypen können ohne gesetzliche Anpassung rein digital ausgestellt werden. Fachliche Mapping-Arbeit mit Juristen erforderlich.

### 1.6 Datenschutz-Folgenabschätzung (DSFA)

Eine digitale Fallakte der hier beschriebenen Art verarbeitet besondere Kategorien personenbezogener Daten (Gesundheitsdaten, Finanzdaten) und erfordert eine vollständige Datenschutz-Folgenabschätzung gemäß Art. 35 DSGVO.

> **Offener Punkt:** DSFA für die gesamte Domäne Arbeitsverwaltung ist vor Pilotierung verpflichtend durchzuführen.

---

## 2. Datenschutzsensibilität

### 2.1 Besondere Kategorien personenbezogener Daten

Die Arbeitsverwaltung verarbeitet im Rahmen von Eingliederungsmaßnahmen, Behindertenrecht und sozialmedizinischer Begutachtung Gesundheitsdaten (Art. 9 DSGVO). Diese erfordern:
- Strengere Zugriffsbeschränkungen (Need-to-know)
- Explizite Einwilligung oder spezifische Rechtsgrundlage (§ 67b SGB X i.V.m. DSGVO)
- Separate Verarbeitungsinfrastruktur

### 2.2 Datenweitergabe an Dritte

Träger, Partner und Arbeitgeber dürfen nur auf ausdrücklich freigegebene Daten zugreifen. Eine automatisierte Datenweitergabe ohne Einzelfallprüfung ist unzulässig.

### 2.3 Profilbildung

Das System darf keine Rückschlüsse auf Persönlichkeitsmerkmale (Zuverlässigkeit, Arbeitsbereitschaft, politische Haltung) ziehen, die nicht Gegenstand des Verwaltungsverfahrens sind. Die Priorisierungslogik muss regelmäßig auf diskriminierende Effekte geprüft werden.

---

## 3. Missbrauchsrisiken

### 3.1 Missbrauch durch Bürger

**Risiko:** Strukturierte Eingabemasken könnten strategisch genutzt werden, um Ansprüche zu optimieren oder Falschangaben zu systematisieren.

**Maßnahme:**
- Plausibilitätsprüfungen mit Hinweis (keine Sanktion durch System)
- Menschliche Prüfung aller Angaben
- Unveränderliches Audit-Log schützt vor späterer Manipulation
- Kein Hinweis auf Prüfalgorithmen (kein Gaming-Effekt)

### 3.2 Missbrauch durch Sachbearbeitung

**Risiko:** Bevorzugte Bearbeitung bestimmter Fälle oder Benachteiligung bestimmter Gruppen.

**Maßnahme:**
- Audit-Log aller Entscheidungen mit Begründungspflicht
- Statistische Auswertung nach Bevölkerungsgruppen (anonymisiert)
- Regelmäßige Qualitätsaudits
- Widerspruchsmöglichkeit schützt vor unbemerkt bleibenden Fehlern

### 3.3 Systemmanipulation

**Risiko:** Dritte versuchen, den Priorisierungsalgorithmus oder die Entscheidungsunterstützung zu manipulieren.

**Maßnahme:**
- BSI-Zertifizierung
- Penetrationstests
- Keine öffentliche Dokumentation der exakten Priorisierungsgewichte
- Menschliche Letztentscheidung macht Manipulation schwerer wirksam

---

## 4. Erklärbarkeitspflichten

Jede KI-gestützte Funktion in der Domäne Arbeitsverwaltung unterliegt folgenden Erklärbarkeitspflichten:

| Funktion | Erklärung gegenüber Bürger | Erklärung gegenüber Sachbearbeitung |
|----------|---------------------------|-------------------------------------|
| Plausibilitätsprüfung | „Ihre Angabe scheint ungewöhnlich. Bitte prüfen Sie: [...]" | Welches Kriterium hat den Hinweis ausgelöst |
| Dokumentenklassifikation | Nicht direkt sichtbar (Hintergrundfunktion) | Klassifikationsergebnis + Konfidenzwert |
| Priorisierungsvorschlag | Nicht numerisch sichtbar | Begründung des Systemvorschlags |
| Vollständigkeitsprüfung | „Folgende Unterlagen fehlen noch: [...]" | Welches Feld/Dokument fehlt und warum |

**Grundsatz:** Der Bürger muss nie mit einer Entscheidung oder einem Hinweis konfrontiert werden, deren Herkunft nicht erklärbar ist.

---

## 5. Menschliche Letztverantwortung

Kein Prozessschritt in der Arbeitsverwaltungs-Domäne endet mit einer automatisierten Entscheidung, die:
- Rechte des Bürgers berührt (Leistungsgewährung, -versagung, -kürzung)
- Sanktionen auslöst
- Die Zuständigkeit final bestimmt
- Fristen rechtswirksam setzt

In allen diesen Fällen ist eine menschliche Entscheidung und Dokumentation zwingend. Das System kann vorbereiten, vorschlagen, prüfen – aber nicht entscheiden.

> Dies ist nicht nur ein ethisches Prinzip. Es ist rechtlich durch § 31 SGB X (Verwaltungsakt durch Menschen) sowie die AI Act-Klassifizierung von Hochrisiko-KI-Systemen im Bereich Sozialleistungen vorgegeben.

---

## 6. Föderale Grenzen

Die Arbeitsverwaltung in Deutschland ist föderalisiert. Jobcenter unterliegen gemeinsamer Trägerschaft (Bund + Kommune) oder alleiniger kommunaler Trägerschaft. Dies bedeutet:

- Keine einheitliche IT-Infrastruktur der Träger
- Unterschiedliche Datenschutzbeauftragte und -richtlinien
- Unterschiedliche Systemlandschaften (Bestandssysteme, Legacy)

> **Offener Punkt:** Ein bundesweiter Rollout der Arbeitsverwaltungs-Domäne erfordert einen Staatsvertrag oder vergleichbare föderale Einigung. Die Datenstandardisierung (XÖV-Erweiterung für Sozialleistungen) muss mit IT-Planungsrat und BMAS abgestimmt werden.

---

## 7. Grenzen des Systemdenkens

Diese Domäne kann folgendes **nicht** ersetzen:

- Menschliche Empathie in Krisengesprächssituationen
- Rechtsberatung im Einzelfall
- Das Ermessen bei Härtefallentscheidungen
- Interkulturelle Kompetenz und Sprachvermittlung in komplexen Beratungsgesprächen
- Umgang mit psychisch belasteten Personen

Das Ziel dieser Domäne ist, den strukturellen Verwaltungsaufwand so zu reduzieren, dass Fachkräfte mehr Zeit für genau diese unersetzlichen menschlichen Aufgaben haben.

---

*Weiter: [08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md](08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md)*
