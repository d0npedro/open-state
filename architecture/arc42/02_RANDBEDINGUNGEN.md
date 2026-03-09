# arc42 – Kapitel 2: Randbedingungen

---

Randbedingungen sind Vorgaben, die die Architektur einengen und nicht verhandelbar sind. Sie kommen aus Recht, Organisation, Technik und Methodik. Wer Open State verstehen will, muss diese Bedingungen kennen – sie erklären viele Architekturentscheidungen, die sonst willkürlich erscheinen könnten.

---

## 2.1 Rechtliche Randbedingungen

### DSGVO by Design und by Default (Art. 25 DSGVO)

Die Datenschutz-Grundverordnung fordert, dass Datenschutz von Anfang an in die Systemgestaltung eingebaut wird (Privacy by Design) und dass in den Standardeinstellungen so wenig personenbezogene Daten wie möglich verarbeitet werden (Privacy by Default). Das ist keine optionale Ergänzung nach der Entwicklung – es ist eine Pflicht, die Architekturentscheidungen von Grund auf prägt. Die Zero-Knowledge-Architektur des Datentresors und die rollenbasierte Ansicht in der Fallakte sind direkte Konsequenzen dieser Anforderung.

### Onlinezugangsgesetz (OZG)

Das OZG verpflichtet Bund und Länder, Verwaltungsleistungen digital anzubieten. Open State ist als Plattform konzipiert, die diese Anforderung strukturell erfüllt – nicht durch punktuelle Digitalisierung einzelner Formulare, sondern durch ein systematisches Fallakte- und Statusmodell, das für alle Domänen gilt.

### SGB III und SGB II für die Arbeitsverwaltung

Alle Prozesse der Arbeitsverwaltungs-Domäne müssen den Anforderungen des Sozialgesetzbuchs III (Arbeitsförderung) und SGB II (Bürgergeld) entsprechen. Dazu gehört insbesondere die Meldefrist des § 141 SGB III (drei Tage nach Kenntnisnahme des Beschäftigungsendes), die korrekte Zuständigkeitsermittlung zwischen Bundesagentur für Arbeit und Jobcenter, und die gesetzeskonforme Bescheidung mit Rechtsbehelfsbelehrung.

### SGB VIII für die Jugendhilfe

Die Jugendhilfe-Domäne unterliegt dem SGB VIII. Besonderer Schutzbedarf von Minderjährigen und Familien prägt die Datenschutzanforderungen dieser Domäne. Einwilligungserfordernisse, Datenweitergabe und Fallaktenzugang sind strenger reguliert als in anderen Domänen.

### Schriftformäquivalenz (§ 36a SGB I)

Digitale Eingaben und Erklärungen müssen rechtlich der schriftlichen Form gleichgestellt sein. § 36a SGB I schafft dafür die sozialrechtliche Grundlage. Die Implementierung erfordert eID-Integration und rechtssichere elektronische Zustellung – beides ist in den technischen Randbedingungen abgebildet.

### Verbot automatisierter Verwaltungsakte (§ 35a VwVfG analog)

§ 35a VwVfG erlaubt vollautomatisierte Verwaltungsakte nur unter engen Voraussetzungen. Für Open State gilt als Architekturprinzip: Keine KI-Ausgabe hat automatische Wirkung auf Verwaltungsentscheidungen. Jede Entscheidung erfordert menschliche Letztverantwortung. Diese Anforderung schlägt sich in der Ausgestaltung der Verfahrensfairness Engine nieder.

---

## 2.2 Organisatorische Randbedingungen

### Keine Werbefinanzierung

Open State ist staatliche Infrastruktur. Werbepartner, kommerzielle Datennutzung oder plattformökonomische Logik sind ausgeschlossen. Das Finanzierungsmodell basiert auf staatlichen Mitteln und fiskalischen Einsparungen durch Effizienzgewinne.

### Open Source für Kernkomponenten

Alle Kernkomponenten von Open State sind Open Source. Das ist keine kosmetische Entscheidung, sondern eine Transparenz- und Vertrauensanforderung: Bürger, Prüfinstanzen und Fachöffentlichkeit sollen nachvollziehen können, wie das System funktioniert.

### Föderale Realität: Drei Zuständigkeitsstufen

Open State muss mit der deutschen Föderalstruktur umgehen: Gewerbeämter sind kommunal zuständig, die Bundesagentur für Arbeit ist bundesweit zuständig, Jobcenter sind in gemeinsamer Trägerschaft von BA und Kommunen. Diese organisatorische Struktur schlägt sich in der Behörden-Adapter-Architektur nieder: Jede Behördenebene benötigt einen eigenen, angepassten Adapter.

### Menschliche Letztverantwortung bei allen Entscheidungen

Keine Verwaltungsentscheidung in Open State ist vollautomatisch. Assistenzsysteme und die Verfahrensfairness Engine liefern Informationen und Hinweise – die Entscheidung trifft immer ein Mensch. Diese Bedingung ist nicht verhandelbar und hat direkte Konsequenzen für die Systemarchitektur.

### KI nur als Assistenz

Künstliche Intelligenz wird in Open State eingesetzt – für Fallvergleiche, Erklärschicht-Unterstützung, Dokumentenanalyse und Konsistenzprüfung. In allen Einsatzfeldern gilt: KI-Ausgaben sind Informationen, keine Entscheidungen. Alle KI-Ausgaben sind erklärbar, anfechtbar und von Menschen überprüfbar.

---

## 2.3 Technische Randbedingungen

### WCAG 2.1 AA – Barrierefreiheit als Mindeststandard

Alle Frontends von Open State müssen den Web Content Accessibility Guidelines 2.1 auf Konformitätsstufe AA genügen. Darüber hinaus werden Einfache Sprache und zwölf Sprachversionen angeboten. Barrierefreiheit ist kein Add-on – es ist eine Anforderung, die Frontend-Architektur und Design-System von Beginn an prägt.

### eID und NFC-Integration

Die Identifikation für sicherheitsrelevante Vorgänge (insbesondere Fallanlage, Leistungsanträge) erfolgt über den deutschen Personalausweis mit Online-Ausweis-Funktion (eID) via NFC-Schnittstelle. Das erfordert die Integration der AusweisApp2-SDK und eines eID-Servers nach BSI TR-03130. Die eID-Integration ist eine Pflichtkomponente, keine Option.

### Zero-Knowledge-Architektur für den Datentresor

Der Bürger-Datentresor ist nach dem Zero-Knowledge-Prinzip aufgebaut: Die Plattform selbst hat keinen Klartext-Zugang zu den dort gespeicherten Daten. Der Bürger hält den Schlüssel. Das stellt technische Anforderungen an die Kryptographie und an die Interoperabilität mit Behördensystemen, die aus dem Datentresor Daten empfangen müssen.

### XÖV-Standards für Behördenanbindung

Die Anbindung externer Behördensysteme erfolgt über XÖV-Standards (XMeld, XSozial, XGewerbeanmeldung, XKfz, EGVP). Diese Standards sind für die Behörden verbindlich und definieren die Schnittstellen des Behörden-Adapter-Layers.

### OAuth2 und FIDO2 für Authentifizierung und Autorisierung

Das API-Gateway setzt OAuth2 für Autorisierung und FIDO2/WebAuthn für passwortlose Authentifizierung ein. Diese Standards sind etabliert und ermöglichen sichere, interoperable Zugangsverwaltung.

---

## 2.4 Entwicklungsmethodische Randbedingungen

### Story-driven Development: Jede Funktion ist auf eine Story-ID zurückführbar

Kein Feature wird ohne dokumentierte User Story umgesetzt. Jede Story hat eine eindeutige ID (`US-[DOMÄNE]-[NNN]`), definierte Akzeptanzkriterien und einen expliziten Nutzennachweis. Diese Anforderung schlägt sich in der gesamten Traceability-Architektur nieder: Story-IDs erscheinen in Code-Kommentaren, Commit-Messages, API-Beschreibungen und in der TRACEABILITY_MATRIX.

### Keine kalendarischen Versprechen – nur Zustandsversprechen

Open State macht keine Aussagen wie „Feature X ist in Quartal Y verfügbar". Stattdessen gilt zustandsbasierte Kommunikation: Was ist im Zustand ENTWURF, BEREIT, IN_ENTWICKLUNG, DEMONSTRIERBAR, ABGESCHLOSSEN? Das gleiche Prinzip, das für Bürger-Verfahren gilt (Zustand statt Termin), gilt auch für die Projektsteuerung.

### Offene Punkte werden ehrlich markiert

Ungeklärte Rechtsfragen, fehlende Schnittstellenspezifikationen, offene technische Entscheidungen – all das wird als solches markiert, nicht verschwiegen. Kapitel 11 dieser Dokumentation enthält eine ehrliche Bestandsaufnahme.

---

*Verweis: [architecture/05_Systemarchitektur.md](../05_Systemarchitektur.md) – Technischer Stack und Implementierungsdetails*
*Verweis: [legal/03_Rechtliche_Machbarkeitsstudie.md](../../legal/03_Rechtliche_Machbarkeitsstudie.md)*
