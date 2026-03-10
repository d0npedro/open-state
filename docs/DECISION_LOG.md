# DECISION_LOG.md – Architektur- und Strategieentscheidungen

Kurze, nachvollziehbare Dokumentation strategischer und architektonischer Entscheidungen.
Format: Entscheidung → Begründung → Alternativen → Status.

Neue Einträge am Ende hinzufügen. Bestehende Einträge nicht rückwirkend ändern.

---

## DEC-001: Next.js 14 (App Router) als Demo-Framework

**Entscheidung:** Die Demo-App wird mit Next.js 14 und dem App Router gebaut.

**Begründung:**
- Statisches Pre-rendering ermöglicht einfaches Deployment ohne Backend
- TypeScript-First mit strengem Modus
- Vercel-Deployment ohne Konfiguration
- Komponenten-Isolation durch Server/Client-Trennung

**Alternativen erwogen:** SvelteKit, Astro, Remix
**Gewählt wegen:** TypeScript-Qualität, Vercel-Integration, breite Bekanntheit

**Status:** Fest. Kein Wechsel geplant.

---

## DEC-002: Keine Testbibliothek in der Demo

**Entscheidung:** Die Demo enthält keine automatisierten Tests.

**Begründung:**
- Demo ist konzeptioneller Demonstrator, kein Produktionscode
- TypeScript strict mode deckt die wichtigsten Typfehler ab
- `npm run build` als minimaler Qualitätsnachweis ausreichend

**Konsequenz:** Bewusste technische Schuld. Wenn die Demo in Richtung Produktionssystem geht, muss das Testsetup nachgezogen werden.

**Status:** Bewusste Entscheidung. Überprüfbar wenn Produktionsphase beginnt.

---

## DEC-003: Mock-Daten statt Backend

**Entscheidung:** Alle Demo-Daten sind statische TypeScript-Objekte. Es gibt keinen API-Server.

**Begründung:**
- Konzeptphase: Datenmodell muss noch mit Fachexperten validiert werden
- Keine Infrastrukturkosten
- Fokus auf UX, Transparenz-Logik und Story-Traceability

**Konsequenz:** Benutzerinteraktionen haben keinen persistenten Effekt.
Verbesserung vorgesehen in Q-031 (React State) und später durch echte API.

**Status:** Gilt für Demo. Für Produktionssystem auflösbar.

---

## DEC-004: Drei-Schichten-Modell für öffentliche Berichtsschicht (Kita-Domäne)

**Entscheidung:** Operative Daten / Steuerungsdaten / Öffentliche Berichte sind strikt getrennte Schichten mit expliziten Freigabeübergängen.

**Begründung:**
- Datenschutz: Kein direkter Durchgriff auf operative Rohdaten
- Kindeswohl: Personenbezogene Daten verlassen nie die Einrichtungsebene
- Vertrauen: Öffentlichkeit sieht nur freigegebene Aggregate mit nachvollziehbarer Methodik
- Verantwortung: Jeder Schichtenübergang ist einer Person zugeordnet

**Alternativen erwogen:** Direktzugriff des Jugendamts auf Einrichtungsdaten (datenschutzrechtlich problematisch), vollständig öffentliche Rohdaten (Kindeswohl-Problem)

**Status:** Fest. Designprinzip der Kita-Domäne.

---

## DEC-005: Verfahrensfairness als regelbasiertes System, kein ML

**Entscheidung:** Fairness-Signale werden durch lesbare if-Regeln aus Falldaten abgeleitet.

**Begründung:**
- Erklärbarkeit: Jede Regel ist im Code lesbar und kommentierbar
- Vertrauen: Kein Blackbox-Effekt
- Datenschutz: Kein Modell-Training auf Bürgerdaten
- Angemessenheit: Für Demo-Zwecke ist Regellogik präzise genug

**Status:** Gilt für Demo. Das Prinzip der Erklärbarkeit bleibt verbindlich, auch wenn spätere Systeme komplexere Logik nutzen.

---

## DEC-006: Story-IDs als Pflichtannotation für UI-Komponenten

**Entscheidung:** Jede sichtbare Funktion in der Demo trägt eine Story-ID (Badge oder Kommentar im Code).

**Begründung:**
- Traceability: Demo zeigt was, Stories erklären warum
- Transparenz gegenüber Betrachtern der Demo
- Verknüpfung von UI und Konzept ohne zusätzliche Dokumentation

**Status:** Gilt für alle Domänen. Story-IDs folgen dem Muster `US-[DOMAIN]-[NNN]`.

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
- Nur `demo/` enthält lauffähigen Code
- `demo/vercel.json` definiert Build- und Output-Config

**Status:** Fest. Konfiguration in `demo/vercel.json`.

---

## DEC-009: Domänencode-Schema für Story-IDs

**Entscheidung:** Story-IDs folgen dem Muster `US-[DOMAINCODE]-[NNN]`.

| Code | Domäne |
|------|--------|
| AV | Arbeitsverwaltung |
| UG | Unternehmensgründung |
| KJ | Kita-Betrieb & Jugendamt-Steuerung |

**Status:** Gilt. Erweiterbar für weitere Domänen.

---

## DEC-010: Theme-Architektur als rein visuelle Querschnittskomponente

**Entscheidung:** Das Theme-System steuert ausschließlich die visuelle Darstellung. Es hat keinen Einfluss auf Fachlogik, Geschäftsregeln, Zugriffsrechte oder Routen.

**Begründung:**
- Trennung von Concern: Visuelle Präferenzen und fachliche Korrektheit sind orthogonale Dimensionen
- Barrierefreiheit: Themes und Density Modes sind Zugänglichkeitswerkzeuge, keine Funktionsschalter
- Testbarkeit: Fachlogik bleibt testbar unabhängig vom aktiven Theme
- Vertrauen: Nutzer können sicher sein, dass das Wechseln des Themes keine Fachwerte verändert

**Implementierung:** 4 Themes via `[data-theme]`-Attribut auf `<html>`, 2 Density Modes via `[data-density]`, localStorage-Persistenz via `os-theme` / `os-density`.

**Status:** Implementiert in Commit `d6fc0c7`. Gilt für alle weiteren Komponenten.

---

## DEC-011: Agenten-Betriebssystem als Steuerungsebene

**Entscheidung:** Das Repository erhält ein eigenes Betriebssystem für kontrollierte Weiterentwicklung: AGENTS.md, DELIVERY_SYSTEM.md, NEXT_STEPS_QUEUE.md, BUILD_STATE.md, DECISION_LOG.md.

**Begründung:**
- Konsistenz: Jede Iteration folgt denselben Schritten, unabhängig vom ausführenden Agenten
- Nachvollziehbarkeit: Entscheidungen, Zustand und nächste Schritte sind jederzeit lesbar
- Kontrolle: Kein Schritt ohne dokumentierten Grund; kein Push ohne Anweisung
- Skalierbarkeit: Kurze Steuerbefehle wie „Entwickle weiter" reichen für eine vollständige Iteration

**Status:** Gilt. Überarbeitbar wenn sich Projektstruktur grundlegend ändert.

---

## Offene Entscheidungen (noch nicht getroffen)

| Thema | Frage | Bezug |
|-------|-------|-------|
| Eltern-Wartelistenportal | Wie werden Eltern-Daten datenschutzkonform verwaltet? | Kita-Domäne |
| Träger-Mandantentrennung | Wie werden verschiedene Träger in einem System getrennt? | Kita-Domäne |
| Open-Data-Lizenz | Welche Lizenz gilt für öffentlich freigegebene Berichte? | Kita-Transparenzschicht |
| Chart-Bibliothek | Wird eine JS-Chart-Bibliothek eingeführt? | Demo / Q-024 |
| State-Management | React Context vs. Zustand vs. lokaler useState? | Demo / Q-031 |
| Zweite Vercel-Instanz | Separate Demo-URL für Kita-/UG-Domäne? | Deployment |
