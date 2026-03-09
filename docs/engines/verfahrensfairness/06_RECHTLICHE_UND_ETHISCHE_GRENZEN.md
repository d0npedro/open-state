# Verfahrensfairness Engine – Rechtliche und ethische Grenzen

---

## 1. Rechtsgrenzen

### 1.1 Verwaltungsverfahrensgesetz (VwVfG)

Das VwVfG regelt das Verwaltungsverfahren in Deutschland. Es räumt Behörden in vielen Bereichen Ermessensspielräume ein. Die Verfahrensfairness Engine muss sich dieser Grenze bewusst sein.

Ermessensentscheidungen sind dort legitim, wo das Gesetz sie vorsieht. Zwei Entscheidungen können in strukturell ähnlichen Fällen unterschiedlich ausfallen, ohne dass dies einen Qualitätsmangel darstellt – wenn das Ermessen ordnungsgemäß ausgeübt und begründet wurde.

**Konsequenz für die Engine:** Die Engine kann markieren, ob eine Ermessensentscheidung begründet ist. Sie kann nicht beurteilen, ob das Ermessen richtig ausgeübt wurde. Divergenz allein ist kein Fehler. Unbegründete Divergenz ist ein Qualitätsmerkmal.

### 1.2 Gebundene Entscheidungen vs. Ermessensentscheidungen

Bei gebundenen Entscheidungen (kein Ermessensspielraum) kann die Engine Konsistenz direkter prüfen. Bei Ermessensentscheidungen kann sie nur prüfen, ob das Ermessen überhaupt und nachvollziehbar dokumentiert wurde.

Die Engine muss für jeden Prüffall zwischen diesen beiden Kategorien unterscheiden. Prüfmuster für gebundene Entscheidungen dürfen nicht auf Ermessensentscheidungen angewendet werden, ohne diesen Unterschied auszuweisen.

### 1.3 Rechtssicherheit

Ausgaben der Engine sind keine Rechtsbescheide, keine Rechtsgutachten und keine rechtsverbindlichen Feststellungen. Eine Markierung durch die Engine erzeugt keine Rechtsansprüche und begründet keine Pflichten über die ohnehin geltenden Verwaltungsvorschriften hinaus.

Bürgerinnen und Bürgern gegenüber muss dieser Punkt in allen Erklärungen klar kommuniziert werden.

---

## 2. Antidiskriminierungsrelevanz (AGG)

Das Allgemeine Gleichbehandlungsgesetz schützt vor Benachteiligung aufgrund von Rasse, ethnischer Herkunft, Geschlecht, Religion, Weltanschauung, Behinderung, Alter und sexueller Identität.

### 2.1 Schutzpflicht der Engine

Die Engine soll diskriminierungsanfällige Muster sichtbar machen (vgl. Signal 8 in [03_SIGNALE_RISIKEN_HINWEISE.md](03_SIGNALE_RISIKEN_HINWEISE.md)). Das ist eine legitime und wichtige Funktion.

Gleichzeitig trägt die Engine eine Eigenverantwortung: Sie darf durch ihre eigene Prüflogik keine Diskriminierungsmuster erzeugen oder verstärken. Eine Engine, die bestimmte Bevölkerungsgruppen häufiger mit Markierungen belegt, ohne sachliche Grundlage in der Verfahrensqualität, würde selbst diskriminierend wirken.

### 2.2 Umgang mit geschützten Merkmalen

Die Engine verarbeitet keine geschützten Merkmale als aktive Prüfvariablen. Sie kann statistische Korrelationen erkennen, aber diese Korrelationen führen nicht zur Anwendung unterschiedlicher Prüfmuster auf unterschiedliche Gruppen.

Korrelationshinweise (Signal 8) werden ausschließlich für menschliche Analyse bereitgestellt, nicht für automatisierte Prüfanpassungen.

### 2.3 AGG-Konformitätsprüfung

Die Engine ist einer regelmäßigen Prüfung auf AGG-Konformität zu unterziehen. Diese Prüfung umfasst:
- Analyse der Signalverteilung über Bevölkerungsgruppen (anonymisiert)
- Prüfung der Prüflogik auf versteckte Benachteiligungsmuster
- Dokumentation und Veröffentlichung der Ergebnisse

---

## 3. Datenschutzsensibilität (DSGVO)

### 3.1 Personenbezogene Daten in Verwaltungsvorgängen

Die Verfahrensfairness Engine arbeitet mit Daten aus Verwaltungsvorgängen. Diese Daten sind in der Regel personenbezogen. Für die Verarbeitung dieser Daten durch die Engine gelten die Anforderungen der DSGVO – insbesondere:

- **Zweckbindung:** Die Engine darf Vorgangsdaten ausschließlich zur Qualitätsprüfung von Verfahren verarbeiten, nicht für andere Zwecke.
- **Datenminimierung:** Die Engine verarbeitet nur die Verfahrensstrukturmerkmale, die für die Prüfung erforderlich sind, nicht den vollständigen Inhalt des Vorgangs.
- **Speicherbegrenzung:** Daten, die für die Prüfung verarbeitet wurden, werden nach dem definierten Aufbewahrungszeitraum gelöscht oder anonymisiert.

### 3.2 Vergleichsdaten und Anonymisierung

Für Fallvergleiche nutzt die Engine anonymisierte Aggregatdaten. Kein Einzelfall darf in der Vergleichsbasis rekonstruierbar sein. Die Anonymisierung unterliegt denselben Standards wie die CaseMatch Engine (k-Anonymisierung, Differential Privacy).

### 3.3 Audit-Logs und DSGVO

Audit-Logs enthalten Vorgangskennungen, die pseudonymisiert sind. Die Zuordnung zu natürlichen Personen ist nur mit Schlüssel möglich, der separat gespeichert wird und einem strengen Zugriffsregime unterliegt.

---

## 4. Risiko der Scheinkonsistenz

Dies ist ein spezifisches und unterschätztes Risiko der Engine.

**Definition:** Scheinkonsistenz entsteht, wenn die Engine Konsistenz in Verfahren attestiert, die faktisch inkonsistent sind – weil die Inkonsistenz sich in Merkmalen zeigt, die die Engine nicht prüft, oder weil die zugrundeliegenden Daten selbst fehlerhaft oder unvollständig sind.

**Beispiel:** Zwei Fälle werden von der Engine als "verfahrenskonsistent" eingestuft, weil beide Bescheide vorhanden und begründet sind. Beide Bescheide enthalten jedoch inhaltlich identische, aber faktisch falsche Begründungen – ein Muster, das die Engine nicht erkennen kann.

**Konsequenz:** Engine-Ausgaben dürfen nicht als Bestätigung von Verfahrensrichtigkeit interpretiert werden. Die Engine prüft strukturelle Merkmale, nicht inhaltliche Korrektheit. Dieser Unterschied muss in allen Erklärungen für Sachbearbeitende und Bürgerinnen und Bürger klar kommuniziert werden.

---

## 5. Risiko historischer Alt-Biases in Daten

Die Vergleichsdatenbasis der Engine enthält historische Vorgänge. Diese historischen Vorgänge können systematische Ungleichbehandlungen aus vergangenen Verfahrenspraktiken widerspiegeln.

**Konsequenz:** Eine Engine, die "Konsistenz mit historischer Praxis" als Qualitätsmerkmal behandelt, würde historische Diskriminierungsmuster als Normal setzen. Das ist nicht akzeptabel.

Die Engine behandelt deshalb historische Muster nicht als Norm, sondern als Information. Abweichungen von historischen Mustern sind keine Qualitätsmängel an sich – sie können im Gegenteil Verbesserungen gegenüber einer schlechten historischen Praxis sein.

Die Prüfmuster der Engine beziehen sich auf definierte Qualitätskriterien (Begründung vorhanden, Frist konsistent, Dokumentation vollständig), nicht auf Ähnlichkeit mit historischen Fällen als solcher.

---

## 6. Erfordernis menschlicher Entscheidung

Keine Ausgabe der Engine hat automatische Wirkung. Dieses Prinzip hat rechtliche und ethische Grundlagen:

**Rechtlich:** Verwaltungsentscheidungen, die Rechte oder Pflichten von Personen begründen, müssen von Menschen getroffen werden. Eine vollautomatisierte Verwaltungsentscheidung ist nach deutschem Recht nur in engen Grenzen zulässig (§ 35a VwVfG) und setzt gesetzliche Grundlage, Transparenz und Anfechtbarkeit voraus. Die Verfahrensfairness Engine trifft keine Verwaltungsentscheidungen.

**Ethisch:** Entscheidungen, die Menschen betreffen, müssen von Menschen verantwortet werden. Automatisierung darf diese Verantwortung nicht auflösen.

---

## 7. Keine Rechtssicherheit durch Engine-Ausgaben

Eine Markierung der Engine begründet keinen Rechtsanspruch. Wenn die Engine einen Verfahrensstillstand markiert, hat die betroffene Person keinen Anspruch auf sofortige Bearbeitung allein aufgrund dieser Markierung. Wenn die Engine eine Divergenz in der Bescheidpraxis markiert, hat die betroffene Person keinen Anspruch auf ein bestimmtes Bescheidergebnis.

Die Engine ist ein Qualitätsinstrument des Staates, kein Rechtsbehelf. Rechtsbehelf bleibt der Widerspruch nach VwVfG, die Untätigkeitsklage und die verwaltungsgerichtliche Kontrolle.

Bürgerinnen und Bürgern muss dieser Punkt in allen Erklärungen der Engine klar kommuniziert werden. Engine-Ausgaben sind keine Garantien und keine Rechtsmittel.

---

## 8. Offene Prüfpunkte

Folgende Fragen bedürfen weiterer rechtlicher Klärung vor einer produktiven Inbetriebnahme:

- Unter welchen genauen Bedingungen ist eine automatisierte Vorprüfung durch die Engine als "vollautomatisierte Entscheidung" im Sinne von Art. 22 DSGVO einzuordnen?
- Welche Transparenzpflichten bestehen gegenüber Bürgerinnen und Bürgern, die Gegenstand einer Engine-Prüfung sind?
- Welche Qualifikationsanforderungen gelten für externe Bias-Auditoren?
- Wie ist die Engine-Prüflogik im Verhältnis zum Steuergeheimnis (AO) zu qualifizieren, wenn sie in der Domäne Unternehmensgründung auch steuerliche Verfahren berührt?
- Wie verhält sich die Engine zur Anforderung der Betroffenenrechte nach DSGVO – insbesondere dem Auskunftsrecht?

Diese Prüfpunkte sind keine Hindernisse für die Konzeptentwicklung, aber sie sind vor Produktiveinsatz zu klären und zu dokumentieren.

---

*Dieses Dokument beschreibt bekannte und antizipierte rechtliche und ethische Grenzen der Engine. Es erhebt keinen Anspruch auf Vollständigkeit und ersetzt keine rechtliche Prüfung durch zugelassene Fachkräfte.*
