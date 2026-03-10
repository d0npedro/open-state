# 04 – Jugendamt-Steuerung und Berichtswesen

## Leitgedanke

Das Jugendamt erhält keine direkte Sicht auf operative Rohdaten der Einrichtungen.
Es erhält laufend aktualisierte, strukturierte Lagebilder – abgeleitet aus freigegebenen Einrichtungsdaten.

Kein Planungsentscheid wird automatisiert getroffen. Das System bereitet vor. Menschen entscheiden.

---

## Schicht 2: Steuerungsdaten (intern, Jugendamt)

Steuerungsdaten entstehen durch Aggregation freigegebener Einrichtungsdaten. Sie sind für Jugendamt und zuständige Planungsstellen zugänglich – nicht öffentlich.

```
Einrichtungsdaten (freigegeben)
       ↓
  Aggregation nach:
  - Einrichtung
  - Planungsraum / Region
  - Trägertyp
  - Zeitraum
       ↓
  Steuerungsdaten (Jugendamt intern)
       ↓
  Freigabe durch JA-Leitung
       ↓
  Politische Vorlagen / Öffentlicher Bericht
```

---

## Kernkennzahlen im Steuerungslagebild

### Versorgungsstruktur

| Kennzahl | Beschreibung |
|---------|-------------|
| Genehmigte Plätze | Summe der behördlich genehmigten Betreuungsplätze |
| Real nutzbare Plätze | Genehmigte Plätze abzüglich dauerhaft nicht nutzbarer Plätze (Umbau, Schließung) |
| Belegte Plätze | Vertraglich gebundene Plätze |
| Freie Plätze | Real nutzbare minus belegte Plätze |
| Auslastungsgrad | Belegte / real nutzbare Plätze (in %) |
| Betreuungsquote | Belegte Plätze je Altersgruppe im Verhältnis zur Einwohnerzahl |

### Wartelisten

| Kennzahl | Beschreibung |
|---------|-------------|
| Wartelistenbestand | Anzahl registrierter Anfragen ohne Platzzusage |
| Ø Wartezeit | Durchschnittliche Zeit zwischen Anmeldung und Platzzusage |
| Betreuungszeitwunsch (Verteilung) | Anteil kurzer / mittlerer / langer Betreuungszeiten auf der Warteliste |

### Personallagen

| Kennzahl | Beschreibung |
|---------|-------------|
| Ausfallquote Personal | Anteil ausgefallener Personalstunden an geplanten Stunden |
| Unterschreitung Personalschlüssel | Anzahl und Häufigkeit von Tagen mit Unterschreitung (nach Einrichtung und Region) |
| Fachkraftquote | Anteil pädagogischer Fachkräfte an Gesamtpersonal |

### Inklusion

| Kennzahl | Beschreibung |
|---------|-------------|
| Inklusionsplätze genehmigt | Anzahl genehmigter Inklusionsplätze |
| Inklusionsplätze belegt | Tatsächlich belegte Inklusionsplätze |
| Förderbedarf-Warteliste | Anfragen mit dokumentiertem Unterstützungsbedarf ohne Platzzusage |

---

## Analyseformen im Steuerungslagebild

### Zeitreihen

- Monatlicher Verlauf aller Kernkennzahlen
- Jahresvergleich (aktuelles Quartal vs. Vorjahresquartal)
- Trendanzeige: Entwicklung Auslastung, Warteliste, Personalausfälle

### Regionale Vergleiche

- Kennzahlen je Planungsraum / Sozialraum / Stadtbezirk
- Engpasskarte: welche Regionen zeigen kritische Belegungsgrade oder lange Wartelisten
- Einrichtungsvergleich (anonymisiert innerhalb der Behörde)

### Maßnahmenstände

- Status laufender Neubau- und Erweiterungsvorhaben
- Erwartete neue Plätze je Planungsraum und Zeitraum
- Planungslücken: Bedarfsindikator vs. geplante Platzerweiterung

---

## Bedarfsplanungsentwurf

Das System bereitet einen Bedarfsplanungsentwurf vor, der:

1. den aktuellen Versorgungsgrad je Planungsraum und Altersgruppe zeigt
2. demografische Entwicklung (Einwohnerzahlen, Altersstruktur) einbindet – sofern extern bereitgestellt
3. Wartelistendruck und Betreuungszeitwunsch als Bedarfsindikator einbezieht
4. Lücken zwischen aktuellem Angebot und Bedarf sichtbar macht
5. laufende Maßnahmen und deren voraussichtlichen Effekt aufzeigt

**Was der Entwurf ausdrücklich nicht tut:**
- Er trifft keine Entscheidung, wo und wie viele Plätze geschaffen werden sollen
- Er enthält keine automatischen Handlungsempfehlungen ohne Begründung
- Er ersetzt keine fachliche Abwägung durch Planungsfachleute

---

## Politische Vorlagen

Das Sachgebiet Planung/Berichtswesen erstellt auf Basis der Steuerungsdaten strukturierte Vorlagen für politische Gremien.

Diese Vorlagen:
- enthalten Kennzahlen mit Quellenangabe und Berechnungsbeschreibung
- benennen Engpässe und Risikolagen klar und ohne Weichzeichnung
- trennen Darstellung (Sachverstand) von Bewertung (politisches Ermessen)
- werden von der Jugendamtsleitung vor Einreichung freigegeben

**Freigabelogik:** Kein Automatismus. Jede politische Vorlage wird aktiv durch eine benannte verantwortliche Person freigegeben. Freigabe-Zeitstempel und Freigabe-Person werden dokumentiert.

---

## Meldeketten und Datenflüsse

```
EINRICHTUNG
  Kita-Leitung gibt Meldedaten frei
          ↓
JUGENDAMT (intern)
  Steuerungslagebild wird aktualisiert
  Sachgebiet Planung wertet aus
  Bedarfsplanungsentwurf wird vorbereitet
          ↓
FREIGABE (JA-Leitung)
  Vorlage für Gremien wird erstellt und freigegeben
  Öffentlicher Berichtsstand wird freigegeben
          ↓
GREMIEN / ÖFFENTLICHKEIT
  Freigegebener Inhalt wird zugänglich
```

---

## Qualitätssicherung der Steuerungsdaten

- Eingehende Einrichtungsdaten werden auf Plausibilität geprüft (z. B. Belegung > genehmigte Plätze → Hinweis)
- Fehlende oder stark verspätete Meldungen werden markiert
- Einrichtungen mit unvollständigen Daten werden im Lagebild als „Datenlücke" ausgewiesen – nicht als Ausfall
- Die Methodik jeder Kennzahl ist in einem Definitions-Glossar hinterlegt
