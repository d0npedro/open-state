# arc42 – Kapitel 8: Querschnittskonzepte

---

Querschnittskonzepte sind Prinzipien und Lösungsansätze, die nicht einer einzelnen Komponente zugeordnet sind, sondern das gesamte System durchziehen. Sie prägen Architekturentscheidungen in jedem Baustein.

---

## 8.1 Transparenz als Architekturpflicht

Transparenz ist in Open State kein Kommunikationsversprechen – sie ist eine technische Pflicht, die in der Architektur verankert ist.

**Audit-Log für jede Zustandsänderung**

Jede Zustandsänderung in einem Verfahren – ob durch Bürger, Sachbearbeitung oder System – erzeugt einen Audit-Event. Dieser Event enthält: Ereignistyp (typisiert, aus einem definierten Enum), Zeitstempel (ISO 8601, UTC), Akteur (Rolle und anonymisierter Bezeichner für die Bürgeransicht), Zustand vor dem Ereignis, Zustand nach dem Ereignis, Referenz auf die Fallakte.

Das Audit-Log ist kryptografisch signiert und append-only. Kein Benutzer, kein Administrator, kein Prozess darf Einträge ändern oder löschen. Diese technische Eigenschaft ist nicht optional – sie ist die Grundlage für die Beweiskraft des Logs.

**Bürger-seitige Einsicht**

Bürgerinnen und Bürger haben das Recht, alle sie betreffenden Ereignisse einzusehen. Das Audit-Log ist für sie als Timeline-Ansicht aufbereitet: chronologisch, mit verständlichen Ereignisbeschreibungen (Erklärschicht), mit Zeitstempeln. Der Export in PDF und JSON ist möglich – das ermöglicht die Nutzung als Nachweis in anderen Verfahren.

**Story-Bezug:** US-AV-007 (Historie nachvollziehen) ist die direkte Story-Legitimation dieses Konzepts. Alle anderen AV-Stories produzieren Audit-Events.

---

## 8.2 Story-Traceability

Das Traceability-Konzept stellt sicher, dass jede implementierte Funktion auf eine dokumentierte User Story zurückgeführt werden kann. Das ist kein bürokratischer Aufwand, sondern ein Qualitätsmechanismus: Er verhindert, dass Funktionen ohne fachliche Legitimation gebaut werden, und er ermöglicht es Prüfinstanzen, den Bedarf hinter jeder Funktion nachzuvollziehen.

**Story-IDs als universeller Anker**

Jede Story hat eine eindeutige ID im Format `US-[DOMÄNE]-[NNN]`. Diese ID erscheint in:
- Der Story-Datei unter `docs/stories/[domäne]/`
- Der `TRACEABILITY_MATRIX.md` als menschenlesbare Übersicht
- Der `story_registry.json` als maschinenlesbare Grundlage
- Code-Kommentaren und Commit-Messages
- API-Endpunkt-Beschreibungen
- UI-Komponenten (Story-Badge in Entwicklungs- und Demo-Umgebungen)

**story_registry.json**

Die maschinenlesbare Story-Registry enthält für jede Story: ID, Domäne, Kurztitel, Status, Primäre Rolle, UI-Screen, Anzahl der Akzeptanzkriterien, technische Referenzen. Sie kann von CI/CD-Pipelines gelesen werden, um Traceability-Pflichten automatisch zu prüfen.

**TRACEABILITY_MATRIX**

Die menschenlesbare Matrix verbindet Story-IDs mit fachlichem Nutzen, UI-Screens, Transparenzbezug und technischen Referenzen. Sie ist das primäre Instrument für fachliche und technische Reviews.

---

## 8.3 Erklärbarkeit von Assistenzsystemen

KI und algorithmische Systeme werden in Open State eingesetzt. Der Einsatz folgt einem nicht verhandelbaren Grundsatz: Jede KI-Ausgabe ist erklärbar, anfechtbar und ohne automatische Wirkung auf Verwaltungsentscheidungen.

**Keine KI-Ausgabe ohne Erklärung in Alltagssprache**

Wenn die Verfahrensfairness Engine ein Inkonsistenz-Signal ausgibt, wenn CaseMatch einen Fallvergleich liefert, wenn die Erklärschicht einen Bescheidtext aufbereitet – in allen Fällen wird erläutert, auf welcher Grundlage die Ausgabe entstanden ist, welche Daten verwendet wurden, und was die Ausgabe bedeutet. Diese Erklärung ist in Alltagssprache formuliert.

**Konfidenzwerte und Datenbasis sichtbar**

KI-Ausgaben in Open State zeigen, auf welcher Datenbasis sie beruhen und welchen Konfidenzgrad sie haben. Eine Empfehlung mit niedriger Konfidenz sieht anders aus als eine mit hoher Konfidenz. Das verhindert, dass Bürger oder Sachbearbeitende KI-Ausgaben übergewichten.

**Anfechtbarkeit jeder Empfehlung**

Jede Ausgabe der Verfahrensfairness Engine und des CaseMatch-Moduls kann von Sachbearbeitenden kommentiert, übersteuert oder angefochten werden. Diese Aktion wird im Audit-Log protokolliert. Es gibt keine KI-Ausgabe, die nicht unter menschliche Prüfung gestellt werden könnte.

**Story-Bezug:** US-AV-006 (Bescheid verstehen) ist die direkte Story-Legitimation für die Erklärschicht. US-AV-004 (Rückfrage verstehen) ergänzt das Bild.

---

## 8.4 Auditierbarkeit

Auditierbarkeit geht über das Audit-Log hinaus – sie betrifft das gesamte System.

**Granularität: Jedes Ereignis typisiert und mit Zeitstempel**

Das Audit-Log unterscheidet typisierte Ereignisse: `FALL_ANGELEGT`, `STATUS_GEÄNDERT`, `DOKUMENT_EINGEREICHT`, `BESCHEID_ERSTELLT`, `BESCHEID_ZUGESTELLT`, `BESCHEID_GEÖFFNET`, `WIDERSPRUCH_INITIIERT`, `DATENZUGRIFF`, `VFE_SIGNAL_AUSGEGEBEN`, und weitere. Jeder Typ ist dokumentiert – es gibt keine undokumentierten Ereignistypen.

**Exportierbarkeit**

Das Audit-Log ist für Bürger als PDF (menschenlesbar, verständlich aufbereitet) und als JSON (maschinenlesbar, für technische Prüfung) exportierbar. Das ermöglicht den Einsatz als Nachweis in Widerspruchsverfahren, Klagen oder Datenschutzanfragen.

**Aufsichts-Zugang**

Aufsichtsstellen erhalten unter definierten rechtlichen Voraussetzungen Zugang zum vollständigen Audit-Log. Dieser Zugang selbst wird ebenfalls protokolliert.

---

## 8.5 Datensouveränität

**Zero-Knowledge-Datentresor**

Der Bürger-Datentresor ist technisch so ausgelegt, dass die Plattform selbst keinen Klartext-Zugang zu den gespeicherten Daten hat. Der Bürger hält den kryptografischen Schlüssel. Ohne Mitwirkung des Bürgers kann niemand – auch kein Open-State-Administrator – die im Datentresor gespeicherten Daten lesen.

**Schlüsselverwaltung durch den Bürger**

Die Schlüsselverwaltung folgt dem Prinzip des bürgergesteuerten Zugangs. Recovery-Szenarien (verlorener Schlüssel) sind mit rechtssicheren Identifikationsverfahren möglich, erfordern aber menschliche Prüfung und werden vollständig protokolliert.

**Jede Datenweitergabe protokolliert und einsehbar**

Wenn Daten aus dem Datentresor an eine Behörde weitergegeben werden – z.B. im Rahmen des Once-Only-Prinzips – wird diese Weitergabe protokolliert: Welche Daten, an wen, wann, auf wessen Veranlassung. Der Bürger kann diese Protokollierung jederzeit einsehen.

---

## 8.6 Zustandsmodell als Querschnittsprinzip

Das Statusmodell ist nicht domänenspezifisch – es ist ein architektonisches Querschnittsprinzip, das für alle Domänen gleich gilt.

**Alle Domänen nutzen dasselbe Statusmodell-Muster**

Jede Domäne definiert ihre eigenen Zustände und Übergangsbedingungen. Aber alle Domänen nutzen dieselbe Zustandsmaschinen-Infrastruktur. Das bedeutet: Wer das Statusmodell der Arbeitsverwaltungs-Domäne versteht, versteht das Grundmuster aller Domänen.

**Kein Verfahren ohne definierten Zustand**

Ein Verwaltungsvorgang in Open State befindet sich immer in einem explizit definierten Zustand. Es gibt keinen „undefinierten" Zwischenzustand. Wenn ein Vorgang aus einem externen System empfangen wird, das keinen klar definierten Zustand liefert, wird der Zustand explizit als `PRÜFUNG_AUSSTEHEND` gesetzt und protokolliert.

**Übergangsbedingungen explizit dokumentiert**

Jeder Zustandsübergang ist mit seinen Vorbedingungen dokumentiert: Wer darf diesen Übergang auslösen? Welche Daten müssen vorliegen? Was passiert im Fehlerfall? Diese Dokumentation liegt in der Domänendokumentation und wird in der Zustandsmaschinen-Implementierung technisch durchgesetzt.

---

## 8.7 Barrierefreiheit

**WCAG 2.1 AA als technischer Mindeststandard**

Alle Frontends von Open State müssen den Web Content Accessibility Guidelines 2.1 auf Konformitätsstufe AA genügen. Das ist kein nachgelagertes Audit-Thema, sondern eine Anforderung, die die Frontend-Architektur, das Design-System und jeden UI-Entwicklungsprozess von Beginn an prägt.

**Einfache Sprache**

Die Erklärschicht nutzt Einfache Sprache (max. B1-Niveau) für alle Texte, die für den Bürger bestimmt sind. Das gilt insbesondere für Fehlermeldungen, Bescheid-Erklärungen, Status-Beschreibungen und Rückfragen.

**12 Sprachversionen**

Open State bietet alle Bürger-seitigen Inhalte in zwölf Sprachen an. Die Sprachauswahl wird gespeichert und ist jederzeit änderbar. Amtliche Dokumente und juristische Fassungen bleiben in der Amtssprache – die Erklärungsschicht wird in die gewählte Sprache übersetzt.

---

## 8.8 Fehlerkommunikation

**Kein technischer Fehlertext nach außen**

Fehlermeldungen, die der Bürger sieht, enthalten niemals technische Informationen (Stack-Traces, Datenbankfehler, interne Fehlercodes). Das gilt ohne Ausnahme. Technische Fehlerinformationen werden intern protokolliert und sind für Support-Zwecke zugänglich.

**Fehlermeldungen immer mit Handlungsoption**

Jede Fehlermeldung im Bürger-Frontend enthält eine Handlungsoption: Was kann der Bürger als nächstes tun? Das kann ein Button „Erneut versuchen", ein Link zu einem alternativen Kanal, eine Erklärung des Problems in Klarsprache oder ein Kontakthinweis sein.

**Fehlerzustände in allen Stories explizit definiert**

Jede User Story in Open State enthält einen oder mehrere explizit definierte Fehlerzustände in der UI-Zustände-Tabelle. Eine Story, die nur den Erfolgspfad beschreibt, ist keine vollständige Story.

---

*Verweis: [docs/stories/TRACEABILITY_MATRIX.md](../../docs/stories/TRACEABILITY_MATRIX.md)*
*Verweis: [docs/engines/verfahrensfairness/04_TRANSPARENZ_UND_AUDITIERBARKEIT.md](../../docs/engines/verfahrensfairness/04_TRANSPARENZ_UND_AUDITIERBARKEIT.md)*
*Verweis: [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](../../docs/LEITBILD_STAAT_UND_VERTRAUEN.md)*
