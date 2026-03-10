# 02 – Benutzerrollen und Akteure

## Rollenübersicht

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ROLLENMODELL                                 │
│                                                                     │
│  EINRICHTUNGSEBENE          BEHÖRDENEBENE         EXTERN            │
│  ─────────────────          ─────────────         ──────            │
│  Kita-Leitung               Jugendamtsleitung     Öffentlichkeit    │
│  Fachkraft / Verwaltung     Planung/Bericht       Gremien           │
│  Trägerverantwortliche      Sachbearbeitung       Eltern*           │
└─────────────────────────────────────────────────────────────────────┘

* Eltern-Schnittstelle (Anmeldung, Warteliste) ist konzeptionell vorgesehen,
  aber in dieser Domäne noch nicht ausgearbeitet.
```

---

## Rolle: Kita-Leitung

**Beschreibung:** Leitung einer Kindertageseinrichtung. Verantwortlich für Betrieb, Personal, Kommunikation mit dem Träger und Meldungen an das Jugendamt.

**Kernaufgaben im System:**
- Belegungsstand aktuell halten und freigeben
- Personalverfügbarkeit pflegen und Ausfälle dokumentieren
- Meldungen an das Jugendamt freigeben (kein automatischer Versand)
- Auswertungen für eigene Betriebsplanung abrufen
- Wartelistenanfragen verwalten

**Datenzugriff:**
- Vollständige operative Daten der eigenen Einrichtung
- Kein Zugriff auf Daten anderer Einrichtungen
- Kein Zugriff auf personenbezogene Angaben anderer Träger

**Freigabeverantwortung:** Ja – Meldungen an das Jugendamt werden erst nach aktiver Freigabe durch die Leitung übermittelt.

---

## Rolle: Fachkraft / Verwaltung in der Kita

**Beschreibung:** Pädagogische Fachkräfte oder Verwaltungskräfte, die im Alltag operative Daten erfassen.

**Kernaufgaben im System:**
- Tägliche Anwesenheitserfassung (Kinder, Personal)
- Krankheitsmeldungen und Abwesenheiten dokumentieren
- Kurzfristige Belegungsänderungen erfassen
- Unterlagen hochladen (z. B. Betreuungsverträge)

**Datenzugriff:**
- Operative Daten der eigenen Einrichtung, eingeschränkter Umfang
- Keine Steuerungs- oder Berichtsdaten

**Freigabeverantwortung:** Nein – Erfassung nur; Freigabe durch Leitung.

---

## Rolle: Trägerverantwortliche

**Beschreibung:** Träger von Kindertageseinrichtungen (freie, konfessionelle, kommunale Träger). Verantwortlich für mehrere Einrichtungen.

**Kernaufgaben im System:**
- Überblick über Belegungsstand aller eigenen Einrichtungen
- Einrichtungsübergreifende Auswertungen
- Koordination bei Personalengpässen
- Abstimmung mit Jugendamt auf Trägerebene

**Datenzugriff:**
- Operative Daten aller eigenen Einrichtungen (aggregiert und einrichtungsbezogen)
- Kein Zugriff auf andere Träger

---

## Rolle: Jugendamtsleitung

**Beschreibung:** Leitungsebene des kommunalen Jugendamts. Strategische Steuerung, Gremienarbeit, politische Verantwortung.

**Kernaufgaben im System:**
- Lagebilder zur Versorgungslage abrufen
- Bedarfsplanung auf Basis aktueller Daten führen
- Berichtsentwürfe prüfen und freigeben
- Öffentliche Transparenzberichte autorisieren

**Datenzugriff:**
- Aggregierte Kennzahlen aller Einrichtungen im Zuständigkeitsbereich
- Keine personenbezogenen Einrichtungsdaten
- Zugriff auf Berichtsentwürfe und Zeitreihenanalysen

**Freigabeverantwortung:** Ja – politisch relevante Vorlagen und öffentliche Berichte erfordern aktive Freigabe.

---

## Rolle: Sachgebiet Planung und Berichtswesen

**Beschreibung:** Fachbereich im Jugendamt, der operative Steuerungsdaten auswertet und Berichte erstellt.

**Kernaufgaben im System:**
- Laufende Analyse der Versorgungslage nach Planungsräumen
- Bedarfsplanung vorbereiten und mit Daten unterlegen
- Politische Vorlagen und Gremienberichte erstellen
- Methodik dokumentieren und Definitionen pflegen
- Qualitätsprüfung eingehender Einrichtungsdaten

**Datenzugriff:**
- Alle aggregierten Steuerungsdaten
- Zeitreihen und regionale Vergleichsanalysen
- Keine direkten Kinderdaten

---

## Rolle: Politische Gremien

**Beschreibung:** Jugendhilfeausschuss, Stadtrat, Kreistag – Gremien, die auf Basis von Berichten Entscheidungen treffen.

**Kernaufgaben im System:**
- Berichtsentwürfe einsehen und abstimmen
- Kennzahlenberichte für politische Entscheidungen nutzen
- Keine direkte Dateneingabe

**Datenzugriff:**
- Freigegebene Berichtsvorlagen
- Öffentliche Transparenzberichte (dieselbe Datenbasis wie Öffentlichkeit, plus ggf. nicht-öffentliche Ergänzungen)

---

## Rolle: Öffentlichkeit / interessierte Bürger

**Beschreibung:** Eltern, Journalisten, Forschende, Engagierte.

**Kernaufgaben im System:**
- Öffentlichen Transparenzbericht einsehen
- Kennzahlen nach Zeitraum und Region filtern
- Methodik und Definitionen nachvollziehen
- Daten exportieren / herunterladen

**Datenzugriff:**
- Ausschließlich freigegeben-aggregierte Kennzahlen
- Keine einrichtungsbezogenen Rohdaten
- Keine personenbezogenen Daten

---

## Zugriffsmatrix (vereinfacht)

| Funktion | Kita-Fachkraft | Kita-Leitung | Träger | Planung | JA-Leitung | Gremien | Öffentlichkeit |
|----------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Tageserfassung (eigene Einrichtung) | ✓ | ✓ | – | – | – | – | – |
| Belegungsstand freigeben | – | ✓ | – | – | – | – | – |
| Einrichtungsüberblick (eigener Träger) | – | ✓ | ✓ | – | – | – | – |
| Aggregiertes Lagebild (regional) | – | – | – | ✓ | ✓ | – | – |
| Bedarfsplanung erstellen | – | – | – | ✓ | ✓ | – | – |
| Politische Vorlage freigeben | – | – | – | (Entwurf) | ✓ | – | – |
| Öffentlichen Bericht einsehen | – | – | – | – | – | ✓ | ✓ |

---

## Offene Rollenfragen

- Wie werden Einrichtungen mit mehreren Standorten eines Trägers abgebildet?
- Welche Rollen haben überregionale Jugendamtsverbände oder Landesjugendämter?
- Wie werden externe Prüfer (Aufsichtsbehörde) eingebunden, ohne operative Rohdaten offenzulegen?
- Eltern-Schnittstelle (Wartelistenportal, Platzzusage): noch nicht ausgearbeitet, fachlich sensibel.
