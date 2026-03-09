# 13_Jugendamt_Module – Vollständige Implementierung in Open State

**Status:** Implementiert März 2026 | Priorität: Hoch (sozial sensibel + hohes Einsparungspotenzial)

## 1. Vision
Das Jugendamt wird in Open State zum schnellsten und transparentesten Unterstützungssystem für Familien in Deutschland.  
Eltern, Jugendliche und Fachkräfte erledigen 90 % der Vorgänge per Handy – von der Beratungsanfrage bis zur Ratenzahlung von Unterhaltsvorschüssen.  
KI schlägt passgenaue Hilfen aus 10 Jahren anonymisierter Fälle vor – immer mit menschlicher Freigabe bei Kindeswohlgefährdung.

## 2. Rechtliche Grundlage (SGB VIII + OZG)
- Kern: Hilfen zur Erziehung (§§ 27 ff. SGB VIII), Beratung (§ 28), Kindeswohlgefährdung (§ 8a), Vormundschaft, Unterhaltsvorschuss (UVG)
- Digitalisierungspflicht seit OZG 2.0 (2024) – jetzt in Open State bundesweit einheitlich
- Sonderregeln: SGB X (Sozialdatenschutz), § 35a SGB VIII (elektronische Akte), DSGVO Art. 9 (besondere Kategorien personenbezogener Daten bei Minderjährigen)

## 3. Automatisierbare Prozesse (95 % in < 3 Min.)
1. Beratungstermin buchen + Online-Beratung (Chat/Video)
2. Antrag auf Hilfen zur Erziehung (HzE) inkl. Dokumenten-Upload
3. Meldung von Kindeswohlgefährdung (anonym oder namentlich – Sofort-Weiterleitung)
4. Unterhaltsvorschuss beantragen + Ratenzahlung einrichten (AI-berechnete Höhe)
5. Vormundschafts-/Pflegschaftsantrag + Status-Tracking
6. Beschwerdemanagement gegen Jugendamt-Entscheidungen

## 4. User-Journey-Beispiele (App-Flows)
**Beispiel 1: HzE-Antrag**
1. Open State App → „Jugend & Familie“ → „Unterstützung beantragen“
2. eID + Kinderdaten (automatisch aus Meldeamt)
3. KI fragt 5 kurze Fragen → schlägt Hilfe vor (z. B. Erziehungsberatung + ambulante Familienhilfe)
4. Dokumente anhängen
5. Sofortige Vorab-Prüfung + Weiterleitung an lokales Jugendamt (Hürth / Rhein-Erft-Kreis)
6. Termin in 48 h vorgeschlagen

**Beispiel 2: Unterhaltsvorschuss**
- AI berechnet Höhe aus anonymisierten identischen Fällen
- Direkte Ratenzahlung per Klick
- Live-Status in der App

## 5. CaseMatch AI – Erweiterung für Jugendamt
- Datensatz: anonymisierte Jugendhilfe-Akten (10+ Jahre)
- Ausgabe: Erfolgsprognose + Kosten-Schätzung + Alternativen
- Immer: „Menschliche Prüfung erforderlich“ bei Gefährdung (§ 8a)
- Erklärbarkeit: SHAP-Werte + Verweis auf anonymisierte Entscheidungen

## 6. Technische Integration
- Neuer Microservice: `jugendamt-service`
- Getrennter, hochgesicherter Datenbereich
- Schnittstelle zu KiJuP-online und lokalen Fachanwendungen

## 7. Transparenz & Haftung
- Jede KI-Empfehlung protokolliert & erklärbar
- „Menschliche Bearbeitung“ per Klick forderbar
- Werbeeinnahmen (z. B. von geprüften Familien-Apps) klar ausgewiesen

## 8. Pilot in Hürth
- Start Q3 2026: HzE + Unterhaltsvorschuss + Beratung
- 3 Monate Test mit Jugendamt Rhein-Erft-Kreis (Standort Hürth)
- KPIs: 80 % Anträge digital, Bearbeitungszeit von 14 Tagen → 48 h
- Vorteil: Hürth als kreisangehörige Stadt → repräsentativ für ~70 % der deutschen Kommunen

**Nächste Schritte:**
- UI-Flows ergänzen (in 07_UI_UX_User_Flows.md)
- Midjourney-Prompts für Jugendamt-Screens (in 08_Prototyp_Prompts.md)
- CaseMatch-Prompt-Erweiterung (in 06_CaseMatch_Engine.md)

**Ende des Moduls.**
