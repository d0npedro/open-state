# 02 – Benutzerrollen und Akteure: Arbeitsverwaltung

---

## Übersicht

Die Domäne Arbeitsverwaltung kennt mehrere Rollen mit klar unterschiedlichen Sichtrechten, Handlungsmöglichkeiten und Verantwortlichkeiten. Das Rollenmodell ist Grundlage für Datenschutz, Zugriffskontrolle und die Definition aller Transparenz- und Sichtbarkeitsregeln.

```
ROLLENÜBERSICHT
────────────────────────────────────────────────────────────────────
 Bürger (Antragsteller/Leistungsberechtigte)
 Bevollmächtigte (gesetzliche Vertreter, Betreuungspersonen)
 Sachbearbeitung (Erstprüfung, Fallführung)
 Teamleitung / Fachaufsicht
 Spezialisten (Vermittlung, Beratung, Reha, Härtefälle)
 Träger-/Partnerorganisationen
 Arbeitgeber (eingeschränkte Rolle)
 Systemadministration
────────────────────────────────────────────────────────────────────
```

---

## 1. Bürger / Antragsteller

**Beschreibung:** Die Person, die Leistungen beantragt, eine Meldung vornimmt oder in einem Vermittlungsprozess begleitet wird.

**Sichtrechte:**
- Eigene Fallakte (Statusübersicht, Dokumentenstatus, Kommunikationshistorie)
- Eigene To-do-Liste (offene Mitwirkungspflichten mit Fristen)
- Eigene Bescheide, erklärbar abrufbar
- Bearbeitungshistorie: wer hat wann gehandelt (ohne interne Bewertungen)
- Aktuelle Zuständigkeit: welche Stelle/Person ist für den Fall zuständig

**Handlungsmöglichkeiten:**
- Dokumente hochladen und Kategorie benennen
- Änderungen melden (Adresse, Einkommen, Haushalt)
- Termine anfragen oder bestätigen
- Auf Rückfragen antworten (strukturiert, nicht formlos)
- Bescheid einsehen und Widerspruch einleiten
- Datentresor-Auszug exportieren

**Was Bürger nicht sehen:**
- Interne Bewertungen, Gesprächsnotizen der Sachbearbeitung
- Systempriorität / Scorecard-Werte
- Persönliche Einschätzungen von Sachbearbeitenden
- Daten anderer Personen

**Besondere Gruppen:**
- Personen mit eingeschränkter Deutschkompetenz: App in 12 Sprachen, Einfache Sprache verfügbar
- Personen mit Behinderung: WCAG 2.1 AA, Screenreader, Spracheingabe
- Personen ohne Smartphone: Kiosk-Zugang in Bürgerämtern, Bibliotheken

---

## 2. Bevollmächtigte / Betreuungspersonen

**Beschreibung:** Personen, die im Auftrag oder als gesetzliche Vertretung handeln (Betreuer, Rechtsanwälte, Sozialberater mit Vollmacht).

**Sichtrechte:** Wie Bürger, aber nur auf den Vorgang, für den die Vollmacht gilt – nicht auf die gesamte Fallakte.

**Handlungsmöglichkeiten:** Wie Bürger, eingeschränkt auf bevollmächtigte Vorgänge.

**Besondere Anforderung:** Digitale Vollmachtserteilung und -prüfung mit eID; Vollmachtenregister wird im Datentresor geführt.

> **Rechtliche Offenheit:** Die Anforderungen an digitale Vollmachten in sozialrechtlichen Verfahren sind rechtlich zu klären (§ 13 SGB X). Fachliche und juristische Abstimmung erforderlich.

---

## 3. Sachbearbeitung (Erstprüfung und Fallführung)

**Beschreibung:** Mitarbeitende der zuständigen Leistungs- und Vermittlungsstelle, die Anträge prüfen, Rückfragen stellen, Entscheidungen vorbereiten und Bescheide erstellen.

**Sichtrechte:**
- Vollständige Fallakte des zugewiesenen Falls
- Alle eingereichten Dokumente (kategorisiert, datiert)
- Kommunikationshistorie (alle Kanäle, zeitlich geordnet)
- Systemhinweise (Vollständigkeitsprüfung, Plausibilitätswarnungen)
- Fristen und Wiedervorlagen
- Bearbeitungshistorie (wer hat was wann getan)
- Priorisierungsmarkierungen

**Was Sachbearbeitung nicht sieht:**
- Daten anderer Fälle (außer bei expliziter Fallübertragung)
- Bewerberdaten aus Jobvermittlungsplattformen, die Bürger nicht freigegeben haben

**Handlungsmöglichkeiten:**
- Rückfragen stellen (strukturiert, mit Begründung und Frist)
- Dokumente anfordern (mit Erklärung, warum dieses Dokument benötigt wird)
- Entscheidungen vorbereiten (Prüfprotokoll mit Erläuterung)
- Bescheid generieren (mit verständlicher Erklärungsschicht)
- Fall priorisieren / Eskalation markieren
- Fall weitergeben (mit dokumentiertem Übergabeprotokoll)
- Wiedervorlage setzen

**Pflichten:**
- Jede Rückfrage erfordert eine Begründung (kann nicht formlos gestellt werden)
- Jede Entscheidung erfordert ein Prüfprotokoll (auditierbar)
- Jede Fristverlängerung erfordert eine Begründung

---

## 4. Teamleitung / Fachaufsicht

**Beschreibung:** Führungskräfte, die für Qualitätssicherung, Eskalationen und Priorisierungsüberprüfung zuständig sind.

**Sichtrechte:**
- Aggregierte Fallübersicht des Teams (anonymisiert für Qualitätssteuerung)
- Eskalationsmarker aller Fälle im Zuständigkeitsbereich
- Priorisierungsliste
- Qualitätskennzahlen (Bearbeitungszeiten, Rückfragequoten, Widerspruchsquoten)
- Einzelfall-Detailansicht bei Eskalation (mit Protokoll)

**Handlungsmöglichkeiten:**
- Eskalation bestätigen / aufheben
- Fallzuweisung ändern
- Priorisierung manuell anpassen (dokumentiert)
- Qualitätsbericht abrufen

---

## 5. Spezialisten (Vermittlung, Beratung, Reha, Härtefälle)

**Beschreibung:** Fachkräfte mit spezifischen Zuständigkeiten, die bei komplexen Fällen hinzugezogen werden.

**Sichtrechte:** Wie Sachbearbeitung, jedoch nur auf die freigegebene Fallteilakte (Need-to-know-Prinzip).

**Handlungsmöglichkeiten:** Spezifisch auf ihren Fachbereich begrenzt. Jede Einsichtnahme wird im Audit-Log protokolliert.

---

## 6. Träger- und Partnerorganisationen

**Beschreibung:** Externe Träger, die Eingliederungsmaßnahmen, Qualifizierungen oder Beratungen durchführen (Bildungsträger, Maßnahmenträger, Schuldnerberatung).

**Sichtrechte:** Nur auf explizit freigegebene Daten des Bürgers – nach digitaler Einwilligung.

**Handlungsmöglichkeiten:**
- Maßnahmenteilnahme rückmelden
- Abschlusszertifikate hochladen
- Gesprächsnotizen mit Bürgerfreigabe eintragen

**Besondere Anforderung:** Alle Partnerzugänge werden über definierte API-Endpunkte mit OAuth2-Scopes geregelt. Keine Direktzugriffe auf die Bürger-Fallakte.

---

## 7. Arbeitgeber (eingeschränkte Rolle)

**Beschreibung:** Arbeitgeber treten in bestimmten Vorgängen auf (Kurzarbeitergeld, Ausbildungsförderung, Bescheinigungen).

**Sichtrechte:** Ausschließlich auf die für den jeweiligen Vorgang relevanten Daten – nach Bürger-Einwilligung oder gesetzlicher Grundlage.

**Handlungsmöglichkeiten:**
- Arbeitgeberbescheinigungen einreichen
- Kurzarbeit-Anträge stellen
- Status eigener Anträge einsehen

> **Rechtliche Offenheit:** Die datenschutzkonforme Gestaltung des Arbeitgeberportals erfordert eine sorgfältige Prüfung nach SGB III § 312 ff. und den einschlägigen Datenschutzbestimmungen.

---

## 8. Systemadministration

**Beschreibung:** Technisches Personal für Betrieb, Wartung und Sicherheit.

**Sichtrechte:** Systemtechnische Metriken, Logs (pseudonymisiert), Infrastruktur – KEINE inhaltlichen Falldaten.

**Pflichten:**
- Vier-Augen-Prinzip bei Wartungszugriffen auf produktive Systeme
- Vollständige Protokollierung aller administrativen Aktionen
- Keine Einsicht in Bürger-Klartextdaten (Zero-Knowledge-Architektur)

---

## Rollenmatrix: Sichtbarkeit

| Datenelement | Bürger | Bevollm. | Sachb. | Teamltg. | Spezialist | Träger | Arbeitgeber |
|-------------|:------:|:--------:|:------:|:--------:|:----------:|:------:|:-----------:|
| Eigene Stammdaten | ✓ | ✓ | ✓ | – | – | – | – |
| Fallstatus | ✓ | ✓ | ✓ | ✓ | Teils | – | – |
| Dokumente | ✓ | ✓ | ✓ | Bei Eskl. | Teils | Teils | – |
| To-do-Liste | ✓ | ✓ | ✓ | – | – | – | – |
| Interne Notizen | – | – | ✓ | ✓ | – | – | – |
| Prüfprotokoll | – | – | ✓ | ✓ | Bei Eskl. | – | – |
| Kommunikation | ✓ | ✓ | ✓ | Bei Eskl. | – | – | – |
| Audit-Log | ✓ (eigen) | ✓ (eigen) | ✓ (Fall) | ✓ | – | – | – |
| Priorisierung | – | – | ✓ | ✓ | – | – | – |
| Bescheid | ✓ | ✓ | ✓ | ✓ | – | – | – |

---

*Weiter: [03_KERNPROZESSE.md](03_KERNPROZESSE.md)*
