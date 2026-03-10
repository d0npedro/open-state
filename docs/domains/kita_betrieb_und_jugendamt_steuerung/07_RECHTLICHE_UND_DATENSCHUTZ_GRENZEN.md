# 07 – Rechtliche und Datenschutz-Grenzen

## Vorbemerkung

> Diese Domäne berührt hochsensible Bereiche: Kindesdaten, Personalien, behördliche Aufsichtspflichten
> und kommunale Hoheitsrechte. Die nachstehenden Aussagen sind konzeptionelle Einschätzungen,
> keine rechtsverbindlichen Gutachten. Vor jeder Umsetzung ist rechtliche Fachberatung erforderlich.

---

## Datenschutz: Grundsätze

### Kindeswohl hat Vorrang

Jede Datenverarbeitung im Kontext von Kindertagesbetreuung ist am Kindeswohl zu messen.

- Keine Aufzeichnung von Verhaltensmerkmalen, Entwicklungseinschätzungen oder persönlichen Angaben zu Kindern im zentralen System
- Personenbezogene Kinderdaten (Name, Geburtsdatum, Adresse) verbleiben in der Einrichtung oder im lokalen Fachverfahren – sie fließen nicht in übergeordnete Berichte
- Aggregierte Berichte enthalten ausschließlich anonymisierte Gruppengrößen

### Datensparsamkeit

Nur Daten, die für den Betrieb und die Steuerung tatsächlich notwendig sind, werden verarbeitet. Kein Aufbau von Datenprofilen, die über den gesetzlichen Zweck hinausgehen.

### DSGVO-relevante Grundlagen

| Verarbeitung | Rechtsgrundlage (voraussichtlich) |
|-------------|----------------------------------|
| Operative Betriebsdaten (Kita-intern) | Berechtigtes Interesse des Trägers / Betriebsführungspflicht |
| Meldedaten an das Jugendamt | Gesetzliche Pflicht nach SGB VIII / Landesausführungsgesetz |
| Aggregierte Kennzahlen (JA-intern) | Gesetzliche Aufgabe des Jugendamts (§ 80 SGB VIII Bedarfsplanung) |
| Öffentliche Transparenzberichte | Öffentlichkeitspflicht kommunaler Träger (je nach Landesrecht zu prüfen) |

Jede Datenverarbeitungsstufe erfordert eine eigene rechtliche Grundlage – auch wenn Daten bereits für eine andere Stufe verarbeitet wurden.

---

## Besonders sensible Bereiche

### Inklusionsdaten

Die Erfassung von Kindern mit Förderbedarf ist besonders sensibel. Auch aggregierte Zahlen können bei kleinen Einrichtungen oder Gruppen Rückschlüsse auf Einzelpersonen ermöglichen.

**Konsequenz für das System:**
- Inklusionskennzahlen werden nur ab einer Mindestgruppengröße ausgewiesen
- Regionen mit sehr wenigen Fällen werden zusammengefasst oder nicht ausgewiesen

### Personalausfälle

Ausfallmuster (z. B. gehäufte Kurzkrankheiten) können indirekt Rückschlüsse auf Arbeitsbedingungen oder einzelne Personen ermöglichen.

**Konsequenz:**
- Personalausfallquoten werden nur als Aggregat ausgewiesen
- Keine einrichtungsbezogene Ausfalldarstellung ohne ausdrückliche Einwilligung / rechtliche Grundlage
- Kein Personenname in jeglichem Bericht

### Wartelistendaten

Wartelistenanfragen können personenbezogene Daten enthalten.

**Konsequenz:**
- Nur aggregierte Zählwerte (Anzahl Anfragen je Region) fließen in Berichte
- Keine Identifikatoren in übergeordneten Systemen
- Eltern-Schnittstelle (Wartelistenregistrierung) ist ein eigenständig datenschutzrechtlich zu gestaltender Bereich

---

## Rechtliche Rahmenbedingungen (Auswahl)

| Rechtsbereich | Relevanz |
|--------------|---------|
| SGB VIII §§ 22–26 | Rechtsgrundlage für Kindertagesbetreuung, Förderauftrag |
| SGB VIII § 45 | Betriebserlaubnis für Einrichtungen (Aufsicht) |
| SGB VIII § 80 | Pflicht zur Bedarfsplanung durch Jugendamt |
| Landesausführungsgesetze (KiTaG, KiBiz etc.) | Unterschiedlich je Bundesland – stark heterogen |
| DSGVO Art. 5–9 | Grundsätze der Datenverarbeitung, besondere Kategorien |
| KDG / Kirchliches Datenschutzrecht | Relevant für konfessionelle Träger |
| Informationsfreiheitsgesetze (IFG) | Öffentliche Transparenz – je Bundesland unterschiedlich |
| Haushaltsrecht / Förderrecht | Relevant für öffentliche Finanzierung und Berichtspflichten |

---

## Zuständigkeiten und Föderalismus

Die Kindertagesbetreuung ist Ländersache. Es gibt kein bundeseinheitliches Kindertagesstättengesetz.

Konsequenz für Open State:
- Kennzahlendefinitionen (z. B. Personalschlüssel) müssen je Bundesland konfigurierbar sein
- Meldepflichten und Fristen unterscheiden sich je Land
- Ein bundesweiter Einsatz erfordert eine länderübergreifende Konfigurierbarkeit des Systems

---

## Freigabe und Verantwortung

| Schritt | Verantwortung |
|--------|--------------|
| Einrichtungsdaten freigeben | Kita-Leitung |
| Steuerungsdaten intern freigeben | Sachgebiet Planung |
| Politische Vorlagen freigeben | Jugendamtsleitung |
| Öffentlichen Bericht freigeben | Jugendamtsleitung (oder beauftragte Person) |

Keine dieser Freigaben erfolgt automatisch. Jede Freigabe ist dokumentiert, mit Zeitstempel und Rollenbezug.

**Vier-Augen-Prinzip:** Für den öffentlichen Bericht wird empfohlen, dass Erstellung und Freigabe durch unterschiedliche Personen erfolgen.

---

## Offene Rechtsfragen (fachlich zu klären)

1. **Zulässigkeit einer zentralisierten Datenhaltung für kommunale Kita-Daten** – auch bei vollständiger Anonymisierung in Berichten bleibt die Frage, wer Auftragsverarbeiter und wer Verantwortlicher ist.

2. **Öffentliche Berichtspflicht** – besteht eine gesetzliche Pflicht zur öffentlichen Berichterstattung über Kindertagesbetreuung? In welchem Umfang? Dies variiert je Bundesland.

3. **Datenschutz-Folgeabschätzung (DSFA)** – für die operative Erfassung von Kinderdaten (auch wenn nur in der Einrichtung) ist eine DSFA erforderlich.

4. **Betriebsrat / Personalrat** – die Einführung digitaler Erfassungssysteme für Personal (Anwesenheitszeiten, Ausfälle) ist mitbestimmungspflichtig.

5. **Trägerautonomie** – freie und konfessionelle Träger haben Eigenständigkeitsrechte. Eine Pflicht zur Nutzung eines bestimmten Systems ist rechtlich zu prüfen.

6. **Datenschutzrechtliche Zulässigkeit des Exports** – ein öffentlicher Dateiexport aus dem Berichtssystem erfordert rechtliche Klärung (insbesondere für Open-Data-Bereitstellung).
