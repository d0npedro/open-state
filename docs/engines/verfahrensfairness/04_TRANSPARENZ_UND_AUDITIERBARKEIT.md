# Verfahrensfairness Engine – Transparenz und Auditierbarkeit

---

## 1. Grundsatz

Die Verfahrensfairness Engine ist selbst einem Transparenz- und Auditsystem unterworfen. Eine Komponente, die Verwaltungsvorgänge auf Qualität und Nachvollziehbarkeit prüft, muss denselben Maßstäben genügen, die sie anlegt.

Diese Anforderung ist nicht optional. Eine Engine, die Verfahrensfairness prüft, aber selbst undurchsichtig operiert, würde das Vertrauen in das Gesamtsystem beschädigen.

---

## 2. Öffentliche Prüfkriterien

Alle Prüfmuster, Signaldefinitionen und Schwellenwerte der Engine sind öffentlich zugänglich. Das bedeutet:

- Die vollständige Liste der Signaltypen ist dokumentiert (siehe [03_SIGNALE_RISIKEN_HINWEISE.md](03_SIGNALE_RISIKEN_HINWEISE.md)).
- Die Prüflogik für jedes Signal ist in einer öffentlich lesbaren Spezifikation beschrieben.
- Schwellenwerte (z.B. ab wann eine Liegezeit als "ungewöhnlich" gilt) sind mit ihrer Begründung veröffentlicht.
- Änderungen an Prüfkriterien oder Schwellenwerten werden versioniert und kommentiert dokumentiert.

Öffentlichkeit bedeutet hier: zugänglich für Bürgerinnen und Bürger, Behörden, Forschungseinrichtungen, Zivilgesellschaft und parlamentarische Kontrollorgane – ohne Genehmigungsverfahren, ohne Anfrage, ohne Schutzmechanismus für die Prüflogik selbst.

---

## 3. Audit-Trails

Jede Ausgabe der Engine wird im Audit-Log erfasst. Der Audit-Trail enthält:

- Eindeutige Kennung der Engine-Ausgabe (UUID)
- Zeitstempel
- Vorgangs-ID (pseudonymisiert)
- Signal-Typ und Priorität
- Prüfkriterium, das ausgelöst hat
- Schwellenwert zum Zeitpunkt der Prüfung
- Modellversion / Regelset-Version
- Verarbeitungszeit
- Ausgabe (Markierung + Erklärungstext)
- Ob und wann ein Mensch die Markierung bestätigt, widerlegt oder kommentiert hat

Audit-Logs sind unveränderlich (append-only), kryptografisch signiert und über die gesamte Betriebslaufzeit des Systems aufzubewahren. Löschungen sind nur auf richterliche Anordnung oder bei nachgewiesener Fehldokumentation möglich und werden selbst im Log vermerkt.

---

## 4. Bias-Audits

Die Engine wird regelmäßig auf systematische Verzerrungen geprüft. Dies geschieht auf zwei Ebenen:

### 4.1 Interne Monitoring-Ebene

Kontinuierliche Prüfung, ob die Engine selbst diskriminierungsanfällige Muster in ihren Ausgaben produziert:
- Werden bestimmte Regionen, Behörden oder Vorgangstypen systematisch häufiger oder seltener markiert?
- Gibt es Merkmale, die die Markierungswahrscheinlichkeit beeinflussen, ohne sachliche Grundlage?
- Sind Erklärungstexte für alle Zielgruppen verständlich oder produziert die Engine systematisch unverständliche Ausgaben für bestimmte Konstellationen?

### 4.2 Externe Audit-Ebene

Mindestens jährliches externes Bias-Audit durch eine von der Betreiberin unabhängige Stelle. Das Audit prüft:
- Signalverteilung über Regionen, Domänen und Behörden
- Statistische Auffälligkeiten in der Markierungshäufigkeit
- Qualität und Verständlichkeit der Erklärungstexte
- Übereinstimmung der Ausgaben mit den dokumentierten Prüfkriterien

Auditberichte werden vollständig veröffentlicht. Empfehlungen des Auditors sind umzusetzen oder die Abweichung ist öffentlich zu begründen.

---

## 5. Erklärbarkeit

Jede Engine-Ausgabe enthält eine menschenlesbare Erklärung. Diese Erklärung erfüllt folgende Anforderungen:

**Vollständigkeit:** Die Erklärung benennt, was geprüft wurde, welches Prüfkriterium ausgelöst hat und welche Datenbasis zugrunde liegt.

**Verständlichkeit:** Die Erklärung ist in zwei Sprachebenen verfügbar – Verwaltungssprache für Fachkräfte, Alltagssprache für Bürgerinnen und Bürger.

**Begrenzungshinweis:** Jede Erklärung enthält einen expliziten Hinweis auf die Grenzen der Engine: Was sie nicht prüft, was sie nicht wissen kann, was eine menschliche Prüfung erfordert.

**Widerspruchsmöglichkeit:** Jede Erklärung enthält eine klare Angabe, wie die Markierung angefochten oder kommentiert werden kann.

---

## 6. Dokumentierte Modellgrenzen

Die Engine dokumentiert ihre eigenen Grenzen. Diese Grenzen sind nicht Schwächen, die verborgen werden sollen – sie sind notwendige Information für alle Nutzerinnen und Nutzer der Engine-Ausgaben.

Bekannte Grenzen:
- Die Engine kann nur Muster in vorhandenem Datenmaterial erkennen. Sie erkennt keine Sachverhalte, die nicht dokumentiert sind.
- Neue Vorgangstypen oder neue Verfahrensregeln können zu Fehlmarkierungen führen, bis die Prüfmuster entsprechend aktualisiert sind.
- Statistische Vergleiche werden unzuverlässiger, wenn die Vergleichsdatenbasis für einen spezifischen Vorgangstyp klein ist. Ab unter 30 Vergleichsfällen gibt die Engine einen expliziten Hinweis auf eingeschränkte Datenbasis.
- Die Engine kann keine Motive, Absichten oder subjektiven Qualitätsmerkmale beurteilen.
- Erklärungstexte in Einfacher Sprache sind maschinell generiert und können Nuancen verlieren.

---

## 7. Manuelle Übersteuerbarkeit

Jede Markierung der Engine kann von berechtigten Personen übersteuert werden. Übersteuerung bedeutet:

- Eine Markierung wird als "nicht zutreffend" oder "sachlich begründet" gekennzeichnet
- Die übertsteuernde Person hinterlegt eine Begründung
- Übersteuerung und Begründung werden im Audit-Log erfasst
- Übersteuerungen fließen in die Qualitätssicherung der Engine ein: Häufige Übersteuerungen gleicher Art können auf Kalibrierungsbedarf hinweisen

Übersteuerung ist keine Kritik an der Engine. Sie ist ein normaler Bestandteil des Systems – Menschen haben immer Zugang zu Information, die die Engine nicht hat.

---

## 8. Keine automatisierte Letztentscheidung

Die Engine trifft keine Entscheidungen. Das ist keine technische Einschränkung – es ist ein Designprinzip.

Auch wenn eine Markierung der Engine in einem konkreten Fall sachlich korrekt ist, folgt daraus keine automatische Maßnahme. Kein Bescheid wird automatisch aufgehoben. Kein Verfahren wird automatisch gestoppt. Keine Person wird automatisch benachrichtigt, ohne dass ein Mensch die Benachrichtigung freigegeben hat.

---

## 9. Wie die Engine selbst kontrolliert werden kann

Die Verfahrensfairness Engine unterliegt folgenden Kontrollmechanismen:

| Kontrollmechanismus | Wer | Turnus | Ergebnis öffentlich? |
|--------------------|----|--------|----------------------|
| Internes Monitoring (Bias, Drift) | Open State Betriebsteam | Kontinuierlich | Nein (intern), aggregiert: Ja |
| Externer Bias-Audit | Unabhängige Prüfstelle | Jährlich | Ja |
| Parlamentarische Anfrage | Bundestag / Landtag | Ad-hoc | Ja |
| Bürger-Anfechtung einer Markierung | Bürger/Unternehmen | Ad-hoc | Nein (Einzelfall), aggregiert: Ja |
| Wissenschaftliche Analyse | Forschungseinrichtungen (Open-Source-Code) | Ad-hoc | Ja |
| BSI-Sicherheitsaudit | BSI | Turnusmäßig | Zusammenfassung: Ja |

Keine dieser Kontrollinstanzen ist von der Zustimmung des Betreibers abhängig. Der Zugang zur Prüflogik und zu anonymisierten Ausgabedaten ist gesetzlich zu verankern.

---

*Die in diesem Dokument beschriebenen Transparenz- und Auditmechanismen sind verbindliche Anforderungen, keine Empfehlungen. Sie sind Bestandteil des Betriebskonzepts von Open State.*
