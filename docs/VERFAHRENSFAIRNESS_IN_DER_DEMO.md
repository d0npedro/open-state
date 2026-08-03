# Verfahrensfairness in der Demo

**Stand:** Q-611 (Code-Abgleich AV/UG)  
**Führend für Konzept:** [`docs/engines/verfahrensfairness/`](engines/verfahrensfairness/)  
**Führend für Code:** `demo/lib/fairness/rules.ts`, `demo/lib/fairness/gruendung-rules.ts`, `demo/types/fairness.ts`

Dieses Dokument beschreibt **nur den Demo-Ist-Stand**: Signale, CTAs, Session-Verhalten. Keine zweite Engine-Spezifikation.

---

## Was die Schicht tut

Aus dem **aktuellen** Fall- bzw. Aktenzustand (inkl. Session-Änderungen) werden sachliche Hinweise abgeleitet:

- offene Rückfragen und Unterlagen mit Fristlage
- Pausierung / Blockaden im Verfahren
- vorläufige Bescheide und Begründungslücken (AV)
- BG-Anmeldung, Steuernummer, Betriebsdatum, parallele Behörden (UG)

Jeder Hinweis enthält: **Titel**, **Erklärung**, **Auswirkung**, **möglicher nächster Schritt**, **Bezug** (auslösender Datenpunkt).

---

## Was sie ausdrücklich nicht tut

- keine Leistungs- oder Verfahrensentscheidungen
- keine Personenbewertung, keine Fairness-Scores
- kein ML / keine Vorhersagen
- keine Rechtsberatung, kein Ersatz behördlicher Auskunft

---

## Domänen und Code-Einstieg

| Domäne | Berechnung | Fiktives Heute | Story |
|--------|------------|----------------|-------|
| Arbeitsverwaltung (AV) | `berechneFairnessSignale(fall)` in `rules.ts` | `FIKTIVES_HEUTE` = `2024-11-24` | US-AV-008 |
| Unternehmensgründung (UG) | `berechneFairnessSignaleGruendung(akte)` in `gruendung-rules.ts` | `FIKTIVES_HEUTE_GRUENDUNG` = `2024-12-07` | US-UG-006 |

Fristen: **ISO-Datumsdelta** über `berechneFristTage(fristDatum, heute)` — nicht mehr das alte Mock-Feld `fristTage` allein.  
Schwelle „fristrelevant“: Resttage ≤ **10**. Priorität **RELEVANT** typisch bei Resttage ≤ **3** (bzw. abgelehnte Unterlage).

Session-State: AV `DemoStateContext`, UG `GruendungStateContext`. Nach RQ-Antwort, Upload, Terminbestätigung (AV) bzw. RQ/Upload/BG-Demo (UG) werden Signale **neu berechnet** — kein `page.goto()` nötig (DEC-012).

---

## Signale AV

| Typ | Priorität (typisch) | Auslösebedingung (Ist) |
|-----|---------------------|------------------------|
| `RUECKFRAGE_OFFEN_FRIST_RELEVANT` | RELEVANT / HINWEIS | Unbeantwortete RQ, Resttage ≤ 10 |
| `UNTERLAGE_FEHLT_BLOCKIERT` | RELEVANT / HINWEIS | Dokument `ANGEFORDERT` oder `ABGELEHNT`; Titel mit nächster Frist |
| `FALL_PAUSIERT` | INFO | Status `RUECKFRAGE_OFFEN`, `UNTERLAGEN_FEHLEN` oder `PAUSIERT` |
| `BESCHEID_VORLAEUFIG` | HINWEIS | Bescheid-Typ enthält „vorläufig“; Widerspruchs-Countdown im Text |
| `BESCHEID_BEGRUENDUNG_ERWEITERBAR` | INFO | Begründung mit „offen“/„fehlende“ **und** noch offene Unterlagen (entfällt nach Upload aller offenen) |

Prioritätsfarben im UI: RELEVANT amber, HINWEIS blau, INFO grau — nur Darstellung.

---

## Signale UG

| Typ | Priorität (typisch) | Auslösebedingung (Ist) |
|-----|---------------------|------------------------|
| `UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT` | RELEVANT / HINWEIS | Unbeantwortete RQ, Resttage ≤ 10 |
| `UG_UNTERLAGE_FEHLT` | RELEVANT / HINWEIS | `ANGEFORDERT`/`ABGELEHNT`, optional Fristdruck |
| `UG_BG_ANMELDUNG_AUSSTEHEND` | RELEVANT / HINWEIS | BG `NICHT_GESTARTET`, Anmeldefrist (Betriebsdatum + 7 Tage) ≤ 10 Resttage |
| `UG_STEUERNUMMER_FEHLT` | HINWEIS | VS-05 AUSSTEHEND/IN_BEARBEITUNG und Betriebsdatum erreicht |
| `UG_BETRIEBSDATUM_UEBERSCHRITTEN` | HINWEIS | Betriebsdatum in der Vergangenheit, Status noch nicht genehmigt/aktiv |
| `UG_PARALLELE_BEHOERDEN_AKTIV` | INFO | >1 Behörde `IN_BEARBEITUNG` oder `RUECKFRAGE_OFFEN` |

Texte und `naechsterSchritt` sind **session-sensitiv** (z. B. nach FA-Antwort keine „zuerst RQ beantworten“-Anweisung mehr bei Steuernummer/Betriebsdatum/parallelen Behörden).

---

## CTAs und Tiefenlinks

### Primär-CTA (Handlung)

| Domäne | Funktion | Zielbeispiele |
|--------|----------|---------------|
| UG | `fairnessSignalZiel(signal, akte)` | `#rq-…`, `#dok-…`, `#beh-…`, `/gruendung#verfahrensstatus`, Behördenliste |
| AV | handlungsbezogene Links auf Übersicht/Hinweise (Anker `#dok-…`, RQ, Bescheid) | `/fall/dokumente#dok-…`, Rückfragen, Bescheide |

UG: CTA-Hilfstexte (`rqCtaHilfstext`, `unterlagenCtaHilfstext`, `bgCtaHilfstext`, …) und `naechsterSchrittZiel` / `aufgabeZiel` für Übersicht.  
UNTERLAGE-CTA folgt der **nächsten offenen** Unterlage (Resttage, dann ID).

### Sekundär-CTA (Audit)

| Domäne | Funktion | Ziel |
|--------|----------|------|
| AV | `fairnessSignalVerlaufZiel` in `rules.ts` | `/fall/verlauf#ere-…` |
| UG | `fairnessSignalVerlaufZiel` in `gruendung-rules.ts` | `/gruendung/verlauf#ere-…` |

Primär bleibt handlungsbezogen; „Im Verlauf ansehen“ ist optional, wenn ein Timeline-Ereignis im Mock/Session-State existiert.

---

## UI-Orte (Ist)

### Arbeitsverwaltung

| Route | Integration |
|-------|-------------|
| `/fall` | Fairness-Kurzblock mit Signalen, CTAs, Verlauf-Tiefenlinks; live nach Session |
| `/fall/hinweise` | Vollansicht, gruppiert; `FairnessPanel` + CTAs/Countdown-Chips |
| `/fall/rueckfragen` | RQ-Signal / Fristlage kontextbezogen |
| `/fall/dokumente` | Unterlagen-Signal |
| `/fall/bescheide` | Vorläufig/Begründung + Verlauf-Link |
| `/fall/verlauf` | kompakte Pause-Signale |

### Unternehmensgründung

| Route | Integration |
|-------|-------------|
| `/gruendung` | Fairness-Kurz-CTAs (gefiltert), Verlauf-Tiefenlinks |
| `/gruendung/hinweise` | Vollansicht + `fairnessSignalZiel` / Verlauf |
| `/gruendung/dokumente` | Unterlagen-Signal |
| `/gruendung/rueckfragen` | RQ-Kontext |
| `/gruendung/behoerden` | BG/Steuernummer-Ankerziele der CTAs |
| `/gruendung/verlauf` | Audit-Anker `#ere-…` |

Komponenten: `demo/components/fairness/FairnessPanel.tsx` (`FairnessPanel`, `FairnessSummaryCard`). Domänenseiten rendern oft **eigene** Signal-Karten mit stabilen `data-testid` (Parität AV/UG).

---

## Session-Verhalten (Demo)

| Aktion | Effekt auf Fairness |
|--------|---------------------|
| RQ beantworten | RQ-Signal entfällt; abhängige UG-Texte/CTAs wechseln (Steuernummer, Parallel, Betriebsdatum) |
| Unterlage „hochladen“ (Mock, keine Datei) | Status → eingereicht; `UNTERLAGE_*` / Begründung-erweiterbar schrumpft oder entfällt |
| Termin bestätigen (AV) | Badges/Quittungen; Fairness-Regeln primär RQ/Unterlagen/Bescheid |
| BG-Demo-Markierung (UG) | `UG_BG_ANMELDUNG_AUSSTEHEND` entfällt wenn BG nicht mehr `NICHT_GESTARTET` |
| Demo zurücksetzen | Ausgangs-Signale wie Mock |

Leerzustand: nach Erledigung offener Aktionen leere bzw. reduzierte Fairness-Blöcke (siehe E2E US-AV-008).

---

## Grenzen (Phase 0)

1. **Mock-Daten** — ein Musterfall bzw. eine Musterakte; kein Behördenbackend.  
2. **Fiktives Heute** — fest pro Domäne, nicht `new Date()`.  
3. **Kein Lernen** — manuelle Regeln, kein Scoring.  
4. **Keine Persistenz** von „Hinweis gelesen“.  
5. **Kita** — keine Fairness-Signalschicht analog AV/UG (Transparenz/Methodik dort eigenständig).

---

## Verwandte Quellen (keine Doppelpflege)

| Thema | Quelle |
|-------|--------|
| Engine-Konzept | `docs/engines/verfahrensfairness/` |
| Typen | `demo/types/fairness.ts` |
| AV-Regeln + Verlauf | `demo/lib/fairness/rules.ts` |
| UG-Regeln + CTA/Verlauf | `demo/lib/fairness/gruendung-rules.ts` |
| Stories | US-AV-008, US-UG-006 · Registry `demo/data/storyRegistry.ts` |
| UI-Komponenten | `demo/components/fairness/FairnessPanel.tsx` |
| E2E | `demo/e2e/us-av-008-*.spec.ts`, `us-ug-gruendung.spec.ts` (Fairness-CTAs) |
