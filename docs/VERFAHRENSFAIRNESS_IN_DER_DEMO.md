# Verfahrensfairness in der Demo

Dieses Dokument beschreibt, was die Verfahrensfairness-Hinweisschicht in der
Arbeitsverwaltungs-Demo tut, was sie ausdrücklich nicht tut, und wie sie
technisch umgesetzt ist.

---

## Was diese Schicht tut

Die Verfahrensfairness-Schicht leitet aus dem aktuellen Fallzustand sachliche,
nachvollziehbare Hinweise ab. Sie macht sichtbar:

- warum ein Fall aktuell pausiert oder in der Bearbeitung wartet
- welche Informationen noch fehlen und den nächsten Schritt blockieren
- ob eine Frist zeitnah relevant wird
- ob ein Bescheid vorläufig ist und was das bedeutet
- ob die Begründung eines Bescheids auf noch ausstehende Informationen verweist

Jeder Hinweis enthält:
- **Titel** – kurz und sachlich
- **Erklärung** – was trifft zu und warum wird dieser Hinweis gezeigt?
- **Auswirkung** – was bedeutet das für den Fall?
- **Möglicher nächster Schritt** – Orientierung, keine Vorschrift
- **Bezug** – welcher konkrete Falldatenpunkt hat den Hinweis ausgelöst?

---

## Was diese Schicht ausdrücklich nicht tut

- Sie trifft **keine Entscheidungen** über Leistungsansprüche oder Verfahrensausgänge.
- Sie **bewertet keine Personen** – weder Bürger noch Sachbearbeitung.
- Sie verwendet **keine KI** im Sinne von ML-Inferenz, Scoring oder Vorhersagen.
- Sie vergibt **keine Fairness-Scores** oder generische „fair/unfair"-Urteile.
- Sie ersetzt **keine Rechtsberatung** und keine behördliche Auskunft.
- Sie basiert nicht auf Vergleichen mit anderen Fällen oder statistischen Mustern.

---

## Unterstützte Signale

| Signal-Typ | Priorität | Auslösebedingung |
|---|---|---|
| `RUECKFRAGE_OFFEN_FRIST_RELEVANT` | RELEVANT / HINWEIS | Offene Rückfrage mit Frist ≤ 10 Tage |
| `UNTERLAGE_FEHLT_BLOCKIERT` | HINWEIS | Mindestens ein Dokument mit Status `ANGEFORDERT` |
| `FALL_PAUSIERT` | INFO | Fallstatus ist `RUECKFRAGE_OFFEN`, `UNTERLAGEN_FEHLEN` oder `PAUSIERT` |
| `BESCHEID_VORLAEUFIG` | HINWEIS | Bescheid-Typ enthält „vorläufig" (case-insensitive) |
| `BESCHEID_BEGRUENDUNG_ERWEITERBAR` | INFO | Bescheid-Begründung enthält „offen" oder „fehlende" |

Die Prioritätsstufen bestimmen nur die visuelle Darstellung:
- **RELEVANT** → Amberfarben (Hinweis, nicht Alarm)
- **HINWEIS** → Blau (Standard-Hinweisfarbe)
- **INFO** → Grau (neutrale Information)

---

## Technische Ableitung der Signale

Regelwerk: `demo/lib/fairness/rules.ts`

Die Funktion `berechneFairnessSignale(fall: Fall): FairnessSignal[]` verarbeitet
ein `Fall`-Objekt und gibt alle zutreffenden Signale zurück. Die Regeln sind
einzeln lesbar und kommentiert. Keine externe Bibliothek, kein ML-Modell.

Typdefinitionen: `demo/types/fairness.ts`

---

## Wo Hinweise im UI sichtbar sind

| Seite | Route | Art der Integration |
|---|---|---|
| Fallübersicht | `/fall` | `FairnessSummaryCard`: Überblick mit Anzahl der Signale, Link zu `/fall/hinweise` |
| Rückfragen | `/fall/rueckfragen` | `FairnessPanel` (vollständig): Frist-Hinweise für offene Rückfragen |
| Bescheide | `/fall/bescheide` | `FairnessPanel` (vollständig): Hinweise zu vorläufigem Bescheid und Begründungslücken |
| Verlauf | `/fall/verlauf` | `FairnessPanel` (kompakt): Pausierungshinweis oben |
| Hinweise (dediziert) | `/fall/hinweise` | Vollständige Übersicht aller Signale, gruppiert nach Priorität |

---

## Komponenten

`demo/components/fairness/FairnessPanel.tsx` enthält zwei Komponenten:

- **`FairnessPanel`**: Rendert eine Liste von `FairnessSignal`-Objekten als
  Karten. Über den `kompakt`-Prop können Auswirkung, nächster Schritt und Bezug
  ausgeblendet werden.
- **`FairnessSummaryCard`**: Kleine Einstiegskarte für die Fallübersicht mit
  Zähler nach Priorität und Link zur Hinweisseite.

---

## Grenzen dieser Demo-Implementierung

1. **Statische Daten**: Alle Hinweise basieren auf dem statischen `demoFall`.
   In einer Produktimplementierung würde die Funktion mit echten, serverseitig
   geladenen Falldaten aufgerufen.

2. **Kein Zeitvergleich**: Fristen werden anhand des Mock-Felds `fristTage`
   berechnet, nicht aus einem echten Datumsdelta. In Produktion würde das
   Regelwerk gegen ein aktuelles Datum abgleichen.

3. **Kein Lernmechanismus**: Die Regeln sind manuell definiert. Sie spiegeln
   Fachdomänenwissen wider, keine statistische Mustererkennung.

4. **Keine Personalisierung**: Alle Nutzer der Demo sehen die gleichen Hinweise,
   da nur ein Musterdatensatz verwendet wird.

5. **Keine Persistenz**: Nutzer können Hinweise nicht als „gelesen" markieren
   oder ausblenden.

---

## Verwandte Dokumente

- `docs/engines/verfahrensfairness/` – Konzeptdokumentation der Fairness Engine
- `architecture/arc42/08_QUERSCHNITTSKONZEPTE.md` – Cross-cutting concerns
- `demo/lib/fairness/rules.ts` – Technische Implementierung der Regeln
- `demo/types/fairness.ts` – Typdefinitionen
