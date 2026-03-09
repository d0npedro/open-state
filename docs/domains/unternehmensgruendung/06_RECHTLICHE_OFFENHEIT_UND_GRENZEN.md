# Unternehmensgründung – Rechtliche Offenheit und Grenzen

---

## 1. Vorbemerkung

Die Domäne Unternehmensgründung berührt mehrere Ebenen des deutschen Föderalismus und eine Vielzahl rechtlicher Regelwerke. Dieses Dokument beschreibt die relevanten rechtlichen Rahmenbedingungen, benennt bekannte Grenzen und markiert offen, wo weitere rechtliche Klärung erforderlich ist.

Offenheit gegenüber diesen Grenzen ist kein Qualitätsmangel. Sie ist Ausdruck eines realistischen, ehrlichen Konzeptansatzes.

---

## 2. Föderale Abstimmung: Gewerbeämter sind kommunal

Die Gewerbeanmeldung nach der Gewerbeordnung (GewO) ist eine kommunale Aufgabe. Zuständig ist die jeweilige Gemeinde, der Stadtbezirk oder das zuständige Amt am Ort der Betriebsstätte.

Das bedeutet für Open State:

- Eine bundesweit einheitliche Schnittstelle zur Gewerbeanmeldung erfordert die Anbindung tausender kommunaler Stellen
- Der XGewerbeanmeldung-Standard (XÖV) ist ein Ansatz zur technischen Vereinheitlichung, aber seine Implementierung durch Kommunen ist nicht flächendeckend
- Landesrechtliche Unterschiede können zusätzliche Anforderungen begründen

**Konsequenz:** Die Domäne kann technische Infrastruktur und Schnittstellen bereitstellen. Sie kann keine föderale Harmonisierung erzwingen. Die Einführung erfordert Vereinbarungen mit Ländern und kommunalen Spitzenverbänden.

---

## 3. Steuerliche Anforderungen: Länderfinanzhoheit

Die Finanzverwaltung ist in Deutschland Ländersache. Jedes Bundesland hat eigene Finanzämter mit eigenen Systemen und Verfahren. Der steuerliche Fragebogen zur Betriebseröffnung wird vom Bundeszentralamt für Steuern (BZSt) standardisiert, aber von den Landesfinanzverwaltungen umgesetzt.

**Konsequenz:** Eine bundesweit einheitliche digitale Einreichung des Fragebogens zur steuerlichen Erfassung erfordert die Zustimmung und Anbindung jeder Landesfinanzverwaltung. ELSTER ist ein existierendes Protokoll, das für diese Zwecke genutzt werden kann, aber nicht alle Verfahrensschritte abdeckt.

---

## 4. Unterschiede nach Rechtsformen

Die Anforderungen an eine Gründung variieren erheblich nach Rechtsform:

| Rechtsform | Besonderheiten |
|-----------|----------------|
| Einzelunternehmen | Gewerbeanmeldung (wenn Gewerbetreibender), steuerliche Erfassung. Keine Mindeststammkapitalanforderung. |
| GbR | Gesellschaftsvertrag empfohlen, aber nicht rechtlich verpflichtend. Keine Registerpflicht (außer Grundbuch- oder spezielle Tätigkeiten). |
| UG (haftungsbeschränkt) | Eintragung ins Handelsregister pflicht. Notarielle Beurkundung des Gesellschaftsvertrags. Stammkapital mindestens 1 €. Besondere Rücklagenpflicht. |
| GmbH | Notarielle Beurkundung. Eintragung ins Handelsregister. Stammkapital mindestens 25.000 €, davon mindestens 12.500 € bei Gründung. |
| Freie Berufe | Keine Gewerbeanmeldung, aber Zulassung bei Kammer (z.B. Ärztekammer, Rechtsanwaltskammer). Steuerliche Erfassung als Freiberufler. |
| Handwerk | Eintragung in Handwerksrolle der zuständigen HWK bei zulassungspflichtigem Handwerk. Meisterbrief oder gleichwertige Qualifikation erforderlich. |

**Konsequenz:** Das System muss rechtsformspezifische Prozesse abbilden. Ein universeller Gründungsflow ist nicht ausreichend.

---

## 5. Kammerpflicht-Regelungen (IHK / HWK)

Gewerbetreibende, die weder dem Handwerk noch freien Berufen zuzurechnen sind, werden Pflichtmitglieder der zuständigen IHK (§ 2 IHKG). Handwerksbetriebe werden Pflichtmitglieder der HWK. Freie Berufe haben eigene Kammern (nicht IHK/HWK).

Die Meldung an IHK und HWK erfolgt in der Regel automatisch durch das Gewerbeamt, wenn eine Gewerbeanmeldung eingeht. Open State kann diesen Meldeweg nutzen, aber er ist nicht in allen Kommunen digital implementiert.

---

## 6. Handwerksrecht

Das Gesetz zur Ordnung des Handwerks (HwO) unterscheidet zwischen:

- **Zulassungspflichtigem Handwerk (Anlage A HwO):** Betrieb nur mit Eintragung in die Handwerksrolle. Eintragungsvoraussetzung: Meisterbrief oder gleichwertige Qualifikation, EU-Ausnahmen.
- **Zulassungsfreiem Handwerk (Anlage B1 HwO):** Betrieb ohne Meisterbrief, aber mit Eintragung in das Verzeichnis handwerksähnlicher Gewerbe.
- **Handwerksähnliche Gewerbe (Anlage B2 HwO):** Eintragung in das Verzeichnis.

Open State muss für handwerkliche Gründungen eine korrekte Klassifizierung vornehmen und auf die jeweils zutreffenden Anforderungen hinweisen. Falsche Klassifizierungen können zu rechtswidrigem Betrieb führen.

---

## 7. Berufsrechtliche Zulassungen

Für eine Reihe von Berufen bestehen neben dem Gewerberecht gesonderte berufsrechtliche Zulassungsanforderungen:

- Ärzte, Zahnärzte, Apotheker: Approbation, Kammermitgliedschaft
- Rechtsanwälte, Notare: Zulassung durch Rechtsanwaltskammer
- Architekten, Ingenieure: Eintragung in Architektenkammer / Ingenieurkammer
- Steuerberater: Bestellung durch Steuerberaterkammer
- Makler, Versicherungsvermittler: Erlaubnis nach § 34c / § 34d GewO
- Gaststätten, Spielhallen, Taxigewerbe: Besondere Erlaubnisse nach GewO oder spezialgesetzlichen Grundlagen

**Konsequenz:** Das System muss erkennen, wenn eine geplante Tätigkeit unter ein besonderes Berufsrecht fällt, und den Gründer auf die zutreffenden Anforderungen hinweisen. Es kann diese Anforderungen nicht selbst abwickeln – aber es kann den Weg zu den zuständigen Stellen erleichtern.

---

## 8. Offen markierte Prüfpunkte

Die folgenden Punkte bedürfen rechtlicher Klärung, bevor Open State in der Domäne Unternehmensgründung in Betrieb geht:

| Prüfpunkt | Beschreibung | Klärungsinstanz |
|-----------|-------------|----------------|
| Datenweitergabe zwischen Behörden | Welche Daten dürfen von Gewerbeamt an Finanzamt/IHK weitergegeben werden? Welche rechtliche Grundlage? | Datenschutzbeauftragte, BMI |
| Einwilligungsmodell | Reicht eine pauschale Einwilligung für die Datenweitergabe, oder muss jede Übermittlung einzeln autorisiert werden? | DSGVO-Analyse |
| Handelsregisterpflicht | Wann und wie kann die Eintragung ins Handelsregister in den digitalen Prozess eingebunden werden (Notarpflicht bleibt unberührt)? | Bundesnotarkammer, BMJ |
| Landesspezifische Abweichungen | Welche landesspezifischen Anforderungen existieren, die über den Bundesstandard hinausgehen? | Länder-Abfrage |
| Freiberufliche Abgrenzung | Wer entscheidet, ob eine Tätigkeit als Gewerbetrieb oder als freier Beruf einzustufen ist? Das Finanzamt – nicht das System. | Finanzamt |
| Pflichtversicherung Selbstständige | Für welche Selbstständigen gilt Rentenversicherungspflicht (§ 2 SGB VI)? Automatische Hinweispflicht? | DRV |
| Haftungsfreistellung | Kann Open State Haftung ausschließen, wenn Gründer auf Basis unvollständiger oder fehlerhafter System-Hinweise handeln? | Rechtsberatung BMI |
| Ausländische Gründer | Welche besonderen Anforderungen gelten für Nicht-EU-Bürger? | Ausländerbehörde, BAMF |

---

*Dieses Dokument ist als lebendiges Dokument zu verstehen. Offene Prüfpunkte werden geschlossen, sobald Klärungen vorliegen, und neue Prüfpunkte werden ergänzt, wenn sie identifiziert werden.*
