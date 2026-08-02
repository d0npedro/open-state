# Domäne: Kita-Betrieb & Jugendamt-Steuerung

**Status:** Konzeptphase · Demo demonstrierbar  
**SSOT Stories:** [`demo/data/storyRegistry.ts`](../../../demo/data/storyRegistry.ts) · Dashboard [`/stories`](../../../demo/app/stories/page.tsx)

Einheitliche Andock-Schablone (Q-430): Problem · Demo-Routen · Stories · API · Grenzen.

---

## Problem

Kitas führen Betrieb (Belegung, Personal, Anwesenheit) oft in Excel/Papier. Meldungen an das Jugendamt sind manuell und verzögert. Steuerung und Öffentlichkeit fehlen belastbare, freigegebene Aggregate — ohne Kind- oder Personendaten in die Breite zu tragen.

**Zielbild (kurz):** Betriebsdaten nutzen der Einrichtung selbst; freigegebene Aggregate speisen JA-Lagebild und öffentlichen Transparenzbericht. Kein automatischer Durchgriff auf Rohdaten.

Detail: [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md)

**Schichten:** Betrieb (Einrichtung) → Steuerung (JA) → Transparenz (öffentlich, freigegeben).

---

## Demo-Routen

| Route | Schicht | Stories |
|-------|---------|---------|
| `/kita` | Transparenz (öffentlich) | US-KJ-009, 010 |
| `/kita/lagebild` | Steuerung JA | US-KJ-005, 006, 010 |
| `/kita/bedarfsplanung` | Steuerung | US-KJ-007 |
| `/kita/vorlage` | Steuerung / Gremien | US-KJ-008 |
| `/kita/einrichtung` | Betrieb | US-KJ-002 |
| `/kita/tagesstand` | Betrieb | US-KJ-001 |
| `/kita/monatsbericht` | Betrieb | US-KJ-003 |
| `/kita/meldung` | Betrieb → Freigabe | US-KJ-004 |

Einstieg: Landing → Transparenzbericht; intern Lagebild. Mocks: `demo/data/mockKita*.ts`.  
Session: Meldefreigabe → Meldeeingang (localStorage); `DemoSessionBar` im Kita-Layout (Q-412).

---

## Stories

| ID | Titel | Route |
|----|-------|-------|
| US-KJ-001 | Tagesstand erfassen | `/kita/tagesstand` |
| US-KJ-002 | Belegungsstand einsehen | `/kita/einrichtung` |
| US-KJ-003 | Monatsbericht abrufen | `/kita/monatsbericht` |
| US-KJ-004 | Meldung prüfen und freigeben | `/kita/meldung` |
| US-KJ-005 | Versorgungslagebild | `/kita/lagebild` |
| US-KJ-006 | Engpass-Regionen | `/kita/lagebild` |
| US-KJ-007 | Bedarfsplanung | `/kita/bedarfsplanung` |
| US-KJ-008 | Politische Vorlage | `/kita/vorlage` |
| US-KJ-009 | Öffentlicher Transparenzbericht | `/kita` |
| US-KJ-010 | Kennzahlen / Vergleich | `/kita`, `/kita/lagebild` |

Story-Dateien: [`docs/stories/kita_betrieb_und_jugendamt_steuerung/`](../../stories/kita_betrieb_und_jugendamt_steuerung/)

---

## API

| Artefakt | Rolle |
|----------|--------|
| [`docs/api/kita-meldung-api.yaml`](../../api/kita-meldung-api.yaml) | API-Skizze Meldung |
| [`docs/api/kita-betriebsdaten-aggregation-vertrag.md`](../../api/kita-betriebsdaten-aggregation-vertrag.md) | Aggregationsvertrag Betrieb → Steuerung/Öffentlichkeit |
| [06_DATENMODELL_UND_KENNZAHLENLOGIK.md](06_DATENMODELL_UND_KENNZAHLENLOGIK.md) | Kennzahlenlogik |

---

## Grenzen

- Demo-only: Mock, kein Backend, keine produktive Jugendamts-Anbindung
- DEC-004: keine Kind-/Personennamen in Aggregaten und Exporten
- Open-Data-Lizenz final (Bundesland) fachlich offen; Demo mit vorläufigem Hinweis
- Kein automatisierter Planungsentscheid; Freigabe durch Menschen
- Detail: [07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md](07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md)

---

## Dokumentenübersicht (Fachkonzept)

| Datei | Inhalt |
|-------|--------|
| [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md) | Problem und Zielbild |
| [02_BENUTZERROLLEN_UND_AKTEURE.md](02_BENUTZERROLLEN_UND_AKTEURE.md) | Rollen |
| [03_OPERATIVE_PROZESSE_IN_DER_KITA.md](03_OPERATIVE_PROZESSE_IN_DER_KITA.md) | Betrieb |
| [04_JUGENDAMT_STEUERUNG_UND_BERICHTSWESEN.md](04_JUGENDAMT_STEUERUNG_UND_BERICHTSWESEN.md) | Steuerung |
| [05_OEFFENTLICHE_TRANSPARENZBERICHTE.md](05_OEFFENTLICHE_TRANSPARENZBERICHTE.md) | Öffentlichkeit |
| [06_DATENMODELL_UND_KENNZAHLENLOGIK.md](06_DATENMODELL_UND_KENNZAHLENLOGIK.md) | Daten / Kennzahlen |
| [07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md](07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md) | Recht / Datenschutz |

---

## Related (Querschnitt, ohne Inhaltsduplikat)

Diese Domäne deckt **Kita-Betrieb, JA-Steuerung und öffentliche Aggregate** ab (Demo `/kita/*`).  
Breitere Jugendhilfe-Module und Fachverfahrens-Integration leben in eigenen SSOT-Dokumenten — hier nur Verweis:

| Dokument | Rolle | Abgrenzung zur Domäne |
|----------|--------|------------------------|
| [`docs/13_Jugendamt_Module.md`](../../13_Jugendamt_Module.md) | Konzept-Überblick weiterer JA-Prozesse (HzE, Beratung, UVG, § 8a u. a.) | **Nicht** Demo-Umfang dieser Domäne; kein Ersatz für 01–07 hier |
| [`docs/14_KiJuP_Integration.md`](../../14_KiJuP_Integration.md) | Integrationsarchitektur KiJuP-online (read-only Referenz) vs. lokale Fachverfahren | **Keine** operative Kita-Meldung; keine Kinddaten an KiJuP |
| [`docs/adr/2026-03-09-kijup-reference-source.md`](../../adr/2026-03-09-kijup-reference-source.md) | ADR: KiJuP nur Referenzquelle | Entscheidungsstand; Details in 14 |

Inhalte von 13/14 hier **nicht** wiederholen. Fachkonzept Betrieb/Steuerung/Transparenz bleibt in den Dateien 01–07 dieses Ordners.

---

## Weiterführend

- Architektur: [`architecture/05_Systemarchitektur.md`](../../../architecture/05_Systemarchitektur.md)
- Leitbild: [`docs/LEITBILD_STAAT_UND_VERTRAUEN.md`](../../LEITBILD_STAAT_UND_VERTRAUEN.md)
- Demo-Ist: [`docs/BUILD_STATE.md`](../../BUILD_STATE.md) (Kita-Routen)
