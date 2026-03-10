# DECISION_LOG.md – Architektur- und Strategieentscheidungen

Kurze, nachvollziehbare Dokumentation wichtiger Entscheidungen.
Format: Datum (approximate), Entscheidung, Begründung, Alternativen, Status.

---

## DEC-001: Next.js 14 (App Router) als Demo-Framework

**Entscheidung:** Die Demo-App wird mit Next.js 14 und dem App Router gebaut.

**Begründung:**
- Statisches Pre-rendering ermöglicht einfaches Deployment ohne Backend
- TypeScript-First mit strengem Modus
- Vercel-Deployment ohne Konfiguration
- Bekanntes Ökosystem, gute Komponenten-Isolation

**Alternativen erwogen:** SvelteKit, Astro, Remix
**Gewählt wegen:** Popularität, Vercel-Integration, TypeScript-Qualität

**Status:** Fest. Kein Wechsel geplant.

---

## DEC-002: Keine Testbibliothek in der Demo

**Entscheidung:** Die Demo enthält keine automatisierten Tests (kein Jest, kein Vitest, kein Playwright).

**Begründung:**
- Demo ist ein konzeptioneller Demonstrator, kein Produktionscode
- Typsicherheit via TypeScript strict mode deckt die wichtigsten Fehler ab
- Build-Check (`npm run build`) als minimaler Qualitätsnachweis ausreichend

**Konsequenz:** Wenn die Demo zum produktionsfähigen System wird, muss das Testsetup nachgezogen werden. Dieser Schuldenposten ist bewusst.

**Status:** Bewusste Entscheidung. Überprüfbar in Q-062 (CI) oder wenn Produktionsphase beginnt.

---

## DEC-003: Mock-Daten statt Backend

**Entscheidung:** Alle Demo-Daten sind statische TypeScript-Objekte. Es gibt keinen API-Server.

**Begründung:**
- Konzeptphase – Datenmodell muss noch validiert werden
- Keine Infrastrukturkosten
- Einfacheres Deployment
- Fokus auf UX und Transparenz-Logik, nicht auf Datenpersistenz

**Konsequenz:** Benutzerinteraktionen (z. B. „Rückfrage beantworten") haben keinen persistenten Effekt.
Verbesserung vorgesehen in Q-031 (React State) und später durch echte API.

**Status:** Gilt für Demo. Für Produktionssystem auflösbar.

---

## DEC-004: Drei-Schichten-Modell für öffentliche Berichtsschicht (Kita-Domäne)

**Entscheidung:** Operative Daten / Steuerungsdaten / Öffentliche Berichte sind strikt getrennte Schichten mit expliziten Freigabeübergängen.

**Begründung:**
- Datenschutz: Kein direkter Durchgriff auf operative Rohdaten
- Kindeswohl: Personenbezogene Daten verlassen nie die Einrichtungsebene
- Vertrauen: Öffentlichkeit sieht nur freigegebene Aggregate mit Methodik
- Verantwortung: Jeder Übergang ist einer Person zugeordnet

**Alternativen erwogen:** Direktzugriff des Jugendamts auf Einrichtungsdaten (abgelehnt – datenschutzrechtlich problematisch), vollständig öffentliche Rohdaten (abgelehnt – Kindeswohl)

**Status:** Fest. Designprinzip der Domäne.

---

## DEC-005: Verfahrensfairness als regelbasiertes System, kein ML

**Entscheidung:** Fairness-Signale werden durch lesbare if-Regeln aus Falldaten abgeleitet, nicht durch Machine Learning.

**Begründung:**
- Erklärbarkeit: Jede Regel ist im Code lesbar und kommentiert
- Vertrauen: Kein Blackbox-Effekt
- Datenschutz: Kein Modell-Training auf Bürgerdaten
- Angemessenheit: Für Demo-Zwecke ist Regellogik ausreichend präzise

**Status:** Gilt für Demo-Implementierung. Für produktive Systeme könnte komplexere Logik hinzukommen, aber das Prinzip der Erklärbarkeit bleibt verbindlich.

---

## DEC-006: Story-IDs als Pflichtannotation für UI-Komponenten

**Entscheidung:** Jede sichtbare Funktion in der Demo trägt eine Story-ID als Annotation (Badge oder Kommentar).

**Begründung:**
- Traceability: Demo zeigt was, Stories erklären warum
- Transparenz gegenüber Betrachtern der Demo
- Verknüpfung von UI und Konzept ohne zusätzliche Dokumentation

**Status:** Gilt für Arbeitsverwaltungs-Demo. Konvention für alle weiteren Domänen übernehmen.

---

## DEC-007: Kein automatischer Push, kein automatisches Deployment

**Entscheidung:** Kein Schritt im Agent-System führt automatisch `git push` oder Deployment-Trigger aus.

**Begründung:**
- Kontrolle: Entwickler sieht jeden Commit, bevor er öffentlich wird
- Sicherheit: Kein versehentliches Veröffentlichen von Entwürfen
- Praxis: Deployment auf Vercel erfolgt manuell oder über Branch-Push

**Status:** Fest. Teil des Agenten-Betriebssystems.

---

## DEC-008: Deployment aus `demo/`-Unterverzeichnis

**Entscheidung:** Vercel deployed aus dem Unterverzeichnis `demo/`, nicht aus dem Root.

**Begründung:**
- Repo-Root ist Dokumentations-/Konzeptebene, nicht Deployment-Artefakt
- Nur der `demo/`-Pfad enthält lauffähigen Code
- `demo/vercel.json` definiert Build- und Output-Config

**Status:** Fest. Konfiguration in `demo/vercel.json`.

---

## DEC-009: Domänencode `KJ` für Kita-Betrieb & Jugendamt-Steuerung

**Entscheidung:** Story-IDs der neuen Domäne erhalten das Präfix `US-KJ-NNN`.

**Begründung:** Konsistenz mit bestehendem Schema (AV = Arbeitsverwaltung, UG = Unternehmensgründung).

**Status:** Gilt. Erweiterbar für weitere Domänen.

---

## Offene Entscheidungen (noch nicht getroffen)

| Thema | Frage | Bezug |
|-------|-------|-------|
| Eltern-Wartelistenportal | Wie werden Eltern-Daten datenschutzkonform verwaltet? | Kita-Domäne |
| Träger-Mandantentrennung | Wie werden verschiedene Träger in einem System getrennt? | Kita-Domäne |
| Open-Data-Lizenz | Welche Lizenz gilt für öffentlich freigegebene Berichte? | Kita-Transparenzschicht |
| Chart-Bibliothek | Wird eine JS-Chart-Bibliothek in die Demo eingeführt? | Demo / Q-024 |
| State-Management | React Context vs. Zustand vs. lokaler useState? | Demo / Q-031 |
