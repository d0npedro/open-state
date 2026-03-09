# Verfahrensfairness Engine – Einsatzfelder

**Konkrete Beispiele je Domäne**

---

## Vorbemerkung

Die folgenden Beispiele beschreiben, wie die Verfahrensfairness Engine in den einzelnen Domänen eingesetzt wird. Sie sind nicht als Vollständigkeitsinventur zu verstehen, sondern als Veranschaulichung der Prüfperspektiven je Domäne.

In allen Domänen gilt: Die Engine informiert. Menschen entscheiden.

---

## 1. Arbeitsverwaltung

**Kontext:** Die Arbeitsverwaltung umfasst Arbeitslosmeldung, Leistungsantrag (ALG I, Bürgergeld), Vermittlung und Bescheidprozesse. Verfahren sind regelintensiv, fristen- und dokumentationsabhängig.

**Typische Einsatzszenarien:**

*Bescheidkonsistenz:* Zwei Personen mit vergleichbarem Versicherungsverlauf und identischer Wohnsitzkonstellation erhalten bei Antrag auf ALG I unterschiedliche Bewilligungsbescheide. Die Engine markiert die Divergenz und bereitet die Vergleichsinformation für die Revision auf.

*Fristenwahrung bei Widersprüchen:* Ein Widerspruch wurde fristgerecht eingelegt. Die Engine prüft, ob die gesetzlich vorgeschriebene Bearbeitungsfrist für Widersprüche eingehalten wird, und markiert Vorgänge, die diese Frist überschreiten.

*Begründungsqualität bei Ablehnungen:* Ein Antrag auf Bürgergeld wird abgelehnt. Die Engine prüft, ob der Bescheid eine konkrete inhaltliche Begründung enthält, die die betroffene Person verstehen kann, oder ob nur Standardformulierungen verwendet wurden.

*Stillstandserkennung:* Ein Fallvorgang weist seit 45 Tagen kein Fortschrittsereignis auf. Die Engine markiert den Vorgang und gibt der Sachbearbeitung einen Hinweis.

*Erklärschicht für Bürger:* Eine Person fragt, warum ihr Antrag noch nicht bearbeitet wurde. Die Engine stellt eine strukturierte Statuserklärung bereit: welcher Schritt offen ist, welche Dokumente noch fehlen, wie der normale Bearbeitungsrahmen für diesen Vorgangstyp aussieht.

---

## 2. Sozialleistungen

**Kontext:** Sozialleistungen (Wohngeld, Elterngeld, BAföG, Unterhaltsvorschuss) sind geprägt durch komplexe Bedarfsprüfungen, Einkommensberechnungen und Ermessensspielräume. Fehler oder Inkonsistenzen können erhebliche Auswirkungen auf Lebensgrundlagen haben.

**Typische Einsatzszenarien:**

*Bedarfsprüfung Vollständigkeit:* Ein Wohngeldantrag enthält alle Pflichtangaben. Die Engine prüft, ob die Bedarfsprüfung alle erforderlichen Einkommensquellen und Haushaltskonstellationen berücksichtigt hat, oder ob Prüfschritte fehlen.

*Einkommensbewertung Konsistenz:* Zwei Haushalte mit nahezu identischer Einkommenssituation erhalten unterschiedliche Wohngeldbeträge. Die Engine markiert die Abweichung und stellt die Vergleichsinformation für die Sachbearbeitung bereit.

*Ermessensdokumentation:* Ein Sozialleistungsbescheid enthält eine Ermessensentscheidung. Die Engine prüft, ob das Ermessen nachvollziehbar dokumentiert ist – nicht ob es richtig ausgeübt wurde, sondern ob die Ausübung begründet ist.

*Regionale Divergenz:* Bei der Bewilligung von BAföG-Leistungen zeigen sich zwischen zwei Bewilligungsbehörden im gleichen Land systematische Abweichungen in der Anrechnung von Einkommen. Die Engine markiert das Muster für eine Prüfung durch die Fachaufsicht.

*Verständlichkeit von Anforderungsschreiben:* Ein Elterngeldantrag erfordert die Einreichung eines Einkommensnachweises für den Zeitraum X. Das Anforderungsschreiben beschreibt, welcher Nachweis benötigt wird, in Fachsprache, die für viele Antragsteller nicht verständlich ist. Die Engine markiert die Verständlichkeit als unzureichend und schlägt eine verständlichere Formulierung vor.

---

## 3. Rechtsstreit und Bußgeld (mit CaseMatch-Integration)

**Kontext:** In dieser Domäne operiert die Verfahrensfairness Engine in enger Abstimmung mit der CaseMatch Engine. Die Verfahrensfairness Engine prüft strukturelle Verfahrensmerkmale; die CaseMatch Engine liefert vertiefte Fallvergleichsanalysen für Bußgeld- und Widerspruchsvorgänge.

**Typische Einsatzszenarien:**

*Bescheidkonsistenz bei Bußgeldern:* Die Verfahrensfairness Engine erkennt, dass vergleichbare Ordnungswidrigkeiten (gleicher Tatbestand, gleiche Schwere) in einer Behörde unterschiedlich mit Bußgeldhöhen belegt wurden. Die CaseMatch Engine liefert die Fallvergleiche. Die Verfahrensfairness Engine bewertet die strukturellen Verfahrensmerkmale.

*Widerspruchsfristen:* Ein Bürger hat einen Widerspruch eingereicht. Die Engine überwacht die gesetzliche Bearbeitungsfrist und informiert den Bürger, wenn sich der Vorgang dem Fristende nähert.

*Vollständigkeit der Bescheiddokumentation:* Ein Bußgeldbescheid soll bestimmte Pflichtangaben enthalten (Tatbestandsnummer, Messmethode, Bußgeldgrundlage). Die Engine prüft, ob alle Pflichtangaben vorhanden sind, und markiert fehlende Elemente.

*Mehrstufige Zuständigkeit:* In einem Widerspruchsverfahren liegt der Fall zunächst bei der erlassenden Behörde, dann bei der Widerspruchsbehörde. Die Engine prüft, ob jeder Zuständigkeitswechsel dokumentiert und die betroffene Person informiert wurde.

*Erklärung für Bürger:* Ein Bürger versteht den Inhalt seines Bußgeldbescheids nicht. Die Engine stellt eine strukturierte Erklärung in Alltagssprache bereit: Was wird ihm vorgeworfen? Welche Frist gilt? Was kann er tun?

---

## 4. Jugendhilfe

**Kontext:** Die Jugendhilfe ist sensibel, weil Entscheidungen unmittelbare Auswirkungen auf Kinder und Familien haben. Verfahren sind komplex, multi-akteurisch und erfordern besondere Dokumentationsstandards. Die Verfahrensfairness Engine prüft hier mit erhöhter Sorgfalt – und mit dem Bewusstsein, dass Fehlmarkierungen in dieser Domäne besonderes Schadenspotenzial haben.

**Typische Einsatzszenarien:**

*Hilfeplanvollständigkeit:* Hilfeplanverfahren erfordern dokumentierte Fachgespräche, Beteiligung der Betroffenen und zeitliche Planungsschritte. Die Engine prüft, ob alle Pflichtbestandteile eines Hilfeplans vorhanden sind.

*Meldepflichten:* Bei bestimmten Ereignissen in Jugendhilfeverfahren gelten gesetzliche Meldepflichten. Die Engine überwacht, ob diese Pflichten fristgerecht dokumentiert wurden.

*Fallübergaben:* Wenn ein Fall von einer Fachkraft auf eine andere übergeht, muss dieser Übergang dokumentiert sein. Die Engine prüft, ob Fallübergaben vollständig dokumentiert sind und ob die betroffene Familie informiert wurde.

*Konsistenz von Leistungsentscheidungen:* Die Engine kann aggregierte Muster analysieren – z.B. ob bestimmte Leistungsarten in einer Region systematisch häufiger oder seltener bewilligt werden als in vergleichbaren Regionen. Solche Muster werden für eine fachliche Überprüfung markiert, nicht interpretiert.

*Erklärung für Betroffene:* Familien, die Hilfen zur Erziehung beantragen, stehen oft komplexen Verfahren gegenüber. Die Engine kann Verfahrensschritte und offene Anforderungen in verständlicher Sprache erklären.

---

## 5. Unternehmensgründung

**Kontext:** Die Unternehmensgründung ist ein Querschnittsbereich mit vielen beteiligten Behörden (Gewerbeamt, Finanzamt, IHK/HWK, Sozialversicherung). Reibungsverluste entstehen vor allem durch Medienbrüche, unklare Anforderungen und fehlende Statustransparenz.

**Typische Einsatzszenarien:**

*Anforderungskonsistenz:* Ein Gewerbetyp erfordert bestimmte Nachweise. Die Engine prüft, ob vergleichbare Gründungen desselben Gewerbetyps in derselben Region dieselben Anforderungen erhalten – oder ob Abweichungen auftreten, die nicht sachlich begründet sind.

*Behördenübergreifende Koordination:* Eine Gründerin hat bei der Gewerbeanmeldung bereits einen Personalausweis und eine Betriebsstättenbeschreibung eingereicht. Das Finanzamt fordert dieselben Dokumente erneut an. Die Engine erkennt die Redundanz und markiert sie als Optimierungshinweis.

*Bearbeitungszeiten:* Die Engine überwacht, ob die Bearbeitungszeiten für Gründungsvorgänge im definierten Normalbereich liegen, und informiert die Gründerin, wenn ihr Vorgang ins Stocken geraten ist.

*Statuserklärung:* Eine Gründerin weiß nicht, ob ihre Anmeldung vollständig ist oder welche Schritte noch ausstehen. Die Engine gibt eine strukturierte Statusübersicht: Was ist abgeschlossen? Was ist offen? Welche Behörde hat den Ball?

*Verständlichkeit von Anforderungsschreiben:* Gründungsanforderungen sind oft in bürokratischer Fachsprache formuliert. Die Engine prüft die Verständlichkeit und markiert Schreiben, die überarbeitet werden sollten.

*Regionale Standortunterschiede:* Systematische Unterschiede in Bearbeitungszeiten oder Anforderungsumfang zwischen verschiedenen Kommunen können auf strukturelle Qualitätsunterschiede hinweisen. Die Engine macht diese Muster sichtbar – ohne Schuldzuweisungen an einzelne Behörden.

---

## Domänenübergreifende Nutzung

Einige Einsatzszenarien betreffen mehrere Domänen gleichzeitig. Beispiel: Eine Person ist gleichzeitig in einem Sozialleistungsverfahren und einem Gründungsvorgang engagiert. Die Engine kann domänenübergreifende Abhängigkeiten erkennen und darauf hinweisen, wenn ein Verfahren in einer Domäne Auswirkungen auf eine andere haben kann.

Diese domänenübergreifende Perspektive ist ein Vorteil gegenüber isolierten Behördensystemen – und gleichzeitig eine erhöhte Datensensibilitätspflicht, die in der DSGVO-Konformitätsprüfung gesondert behandelt wird.

---

*Für die Implementierungsdetails je Domäne wird auf die jeweilige Domänendokumentation verwiesen.*
