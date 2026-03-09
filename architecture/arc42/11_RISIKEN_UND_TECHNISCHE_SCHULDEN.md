# arc42 – Kapitel 11: Risiken und technische Schulden

---

Dieses Kapitel enthält eine ehrliche Bestandsaufnahme. Offene Punkte werden als solche markiert – nicht verschwiegen. Die Auflistung hier ist der aktuelle Stand; nicht alle Punkte sind blockierend.

---

## 11.1 Rechtliche Risiken

### DSFA noch nicht durchgeführt (blockierend für Pilotierung)

Art. 35 DSGVO verpflichtet zu einer Datenschutz-Folgenabschätzung (DSFA) vor der Verarbeitung personenbezogener Daten, wenn diese voraussichtlich ein hohes Risiko für Rechte und Freiheiten von Personen birgt. Open State verarbeitet Sozialdaten, Gesundheitsdaten (im Jugendhilfe-Kontext) und Identitätsdaten – eine DSFA ist damit nicht nur empfehlenswert, sondern rechtlich verpflichtend. Die DSFA ist noch nicht durchgeführt. Ohne sie ist kein Pilotbetrieb möglich.

### Schriftformäquivalenz nicht für alle Bescheidtypen geklärt

§ 36a SGB I schafft die sozialrechtliche Grundlage für die Gleichwertigkeit digitaler Eingaben. Unklar ist jedoch, ob alle Bescheidtypen in allen Domänen diese Schriftformäquivalenz erfüllen können. Einzelne Bescheidtypen könnten weiterhin postalische Zustellung erfordern. Diese Frage muss domänenspezifisch geklärt werden, bevor die Volldigitalisierung der jeweiligen Prozesse implementiert wird.

### Digitale Vollmachten (§ 13 SGB X) rechtlich noch offen

Open State sieht die Möglichkeit vor, dass Bevollmächtigte (z.B. Angehörige, Beratungsstellen) im Namen von Bürgern handeln. Die rechtlichen Anforderungen an digitale Vollmachten nach § 13 SGB X sind noch nicht vollständig mit bestehenden Digitalinfrastrukturen (Vollmachtenregister) abgestimmt. Offener Punkt.

### Föderale Abstimmung für Datenstandardisierung noch nicht erfolgt

Die Anbindung von BA-ALLEGRO und kommunalen Jobcenter-Systemen erfordert eine Standardisierung der Datenformate. Diese Standardisierung ist politisch und technisch noch nicht abgeschlossen. Einzelne Kommunen verwenden proprietäre Systeme, die keinen standardisierten API-Zugang anbieten. Das betrifft insbesondere die SGB-II-Domäne.

---

## 11.2 Technische Risiken

### Legacy-Systeme bei Behörden können API-Standards nicht garantieren

ALLEGRO (BA), XMeld-Implementierungen der Einwohnermeldeämter und kommunale Jobcenter-Systeme sind historisch gewachsene Systeme mit inkonsistenter API-Qualität. Ausfälle, Versionskonflikte und fehlende Dokumentation sind reale Risiken. Der Behörden-Adapter-Layer muss robust gegenüber Behörden-seitigen Ausfällen sein – inklusive Fallback-Verhalten und klarer Fehlerkommunikation an den Bürger.

### Keine klickbare Demo vorhanden – Risiko: Konzept ohne Validierung

Die gesamte arc42-Dokumentation, das Story-System und die Architektur sind konzeptionell ausgearbeitet. Es gibt noch keine klickbare Demo oder Pilotimplementierung. Das ist das größte operative Risiko: Konzepte, die nicht mit echten Nutzern und echten Behördensystemen getestet wurden, können strukturelle Annahmen enthalten, die sich in der Praxis als falsch erweisen. Ein Demo-Branch ist geplant, aber noch nicht vorhanden.

### story_registry.json muss manuell gepflegt werden – Risiko: Drift

Die maschinenlesbare Story-Registry und die TRACEABILITY_MATRIX werden manuell gepflegt. Wenn Implementierungen von Stories abweichen und die Dokumentation nicht aktualisiert wird, entsteht ein Drift zwischen dokumentiertem und tatsächlichem Stand. Mitigation: CI/CD-Prüfung der Story-Referenzen in Code und Commits. Noch nicht implementiert.

### Audit-Log Immutabilität muss technisch gesichert werden

Das Audit-Log ist als unveränderlich und kryptografisch gesichert spezifiziert. Diese Eigenschaft muss technisch durchgesetzt werden – nicht nur dokumentiert. Die konkrete Implementierung (Append-Only-Datenbank, kryptografische Signaturkette, Zugriffskontrolle) ist noch nicht spezifiziert. Ohne technische Durchsetzung ist die Immutabilität eine Absichtserklärung, keine Garantie.

### Zero-Knowledge-Datentresor: Recovery-Szenarien unvollständig spezifiziert

Der Zero-Knowledge-Datentresor übergibt den kryptografischen Schlüssel an den Bürger. Was passiert, wenn der Schlüssel verloren geht? Recovery-Szenarien erfordern einerseits ausreichende Sicherheit (kein unbefugter Zugang), andererseits müssen sie für Bürger handhabbar sein. Die konkrete Implementierung ist noch offen.

---

## 11.3 Konzeptuelle Schulden

### arc42-Dokumentation und 05_Systemarchitektur.md: Konsolidierung ausstehend

`architecture/05_Systemarchitektur.md` und die arc42-Dokumentation haben teilweise überlappende Inhalte. Die arc42-Dokumentation übernimmt die Architekturlogik; `05_Systemarchitektur.md` liefert technische Details und Diagramme. Diese Trennung ist sinnvoll, aber nicht vollständig konsistent umgesetzt. Konsolidierung und Klärung der Zuständigkeiten der beiden Dokumentationsstränge ist ausstehend.

### Verfahrensfairness Engine: Technische Spezifikation noch unvollständig

Die Verfahrensfairness Engine ist konzeptionell vollständig beschrieben (Grundsätze, Abgrenzung, Signale, Transparenz, Einsatzfelder, Rechtsgrenzen). Die technische Spezifikation – Datenschema für Ereignisse, Schnittstellendefinition zwischen Engine und Domänenmodulen, Prüfmuster als formale Regeln – ist noch nicht ausgearbeitet.

### Erklärschicht-Mechanismus noch nicht implementiert

Der Mechanismus, durch den Verwaltungssprache auf Alltagssprache gemappt wird (redaktionell, KI-assistiert, hybrid), ist konzeptionell beschrieben, aber nicht implementiert. Offene Fragen: Wer erstellt Erklärungsschichten? Wie wird die rechtliche Korrektheit sichergestellt? Wie werden Erklärungsschichten versioniert? Wie wird Qualitätssicherung organisiert?

### Stories für fünf Domänen noch nicht geschrieben

Vollständig ausgearbeitete Stories existieren nur für die Arbeitsverwaltungs-Domäne. Für Unternehmensgründung, Sozialleistungen, Jugendhilfe, Wohnsitzmanagement und Rechtsstreit/Bußgeld fehlen die Story-Sammlungen. Ohne Stories können diese Domänen nicht story-driven entwickelt werden.

---

## 11.4 Operative Risiken

### Pilotbetrieb ohne föderale Abstimmung nicht möglich

Ein Pilotbetrieb von Open State – selbst in einer einzigen Domäne – erfordert die Abstimmung mit mindestens einer Behörde auf der entsprechenden Zuständigkeitsebene. Diese Abstimmung ist noch nicht erfolgt. Ohne sie können weder Behörden-Adapter getestet noch reale Datenflüsse validiert werden.

### Demo-Branch fehlt noch

Ein stabiler Demo-Branch mit einer demonstrierbaren Mindestimplementierung existiert noch nicht. Das ist kein reines Entwicklungsdefizit – es ist ein Kommunikationsrisiko: Ohne Demo ist die gesamte Konzeptarbeit nicht für externe Stakeholder (Behörden, Prüfinstanzen, Fachöffentlichkeit) nachvollziehbar.

---

*Alle hier genannten offenen Punkte sind Bestandteil des transparenten Projektstands. Open State macht keine Versprechen über Zeitpunkte der Lösung – nur über den Zustand, in dem sich die Punkte befinden.*
