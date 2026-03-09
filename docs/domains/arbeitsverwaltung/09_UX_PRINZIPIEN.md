# 09 – UX-Prinzipien: Arbeitsverwaltung

---

## Leitgedanke

> Eine staatliche Anwendung ist dann gut gestaltet, wenn ein Bürger in einer belastenden Lebenssituation sie ohne Hilfe und ohne Frustration nutzen kann.

UX in der Arbeitsverwaltung ist kein Ästhetikprojekt. Es ist eine Haltungsentscheidung: Respekt gegenüber Bürgerinnen und Bürgern, die gerade etwas Schwieriges durchleben.

---

## Prinzip 1: Klare Sprache statt Behördensprech

**Regel:** Kein Begriff, der nicht erklärt wird. Kein Fachbegriff ohne Alternativformulierung.

**Beispiele:**

| Behördensprache | Open State Formulierung |
|----------------|------------------------|
| Anwartschaftszeit | Die Zeit, die Sie vor Ihrer Arbeitslosigkeit versichert sein müssen |
| Bemessungszeitraum | Der Zeitraum, aus dem Ihr bisheriges Einkommen berechnet wird |
| Verfügbarkeit für den Arbeitsmarkt | Sie sind bereit, eine neue Stelle anzutreten |
| Arbeitsbescheinigung (§ 312 SGB III) | Bestätigung Ihres Arbeitgebers über Ihre Beschäftigung |
| Leistungsminderung | Kürzung Ihrer monatlichen Zahlung |

**Implementierung:**
- Jedes Fachfeld hat einen Tooltip mit Erklärung in Alltagssprache
- Bescheide werden in zwei Fassungen geliefert: rechtliche Fassung + erklärte Fassung
- Einfache Sprache (Leichte Sprache auf Anfrage) ist für alle Hauptbildschirme verfügbar

---

## Prinzip 2: Jeder Status muss eine Bedeutung haben

**Regel:** Kein Status, der nicht erklärt, was er für den Bürger bedeutet und was als nächstes passiert.

**Verbotene Statusanzeigen:**
- „In Bearbeitung" (ohne weitere Information)
- „Auf Wiedervorlage" (interner Begriff)
- „Fachlich geprüft" (ohne Konsequenz)
- Leere Statusfelder

**Anforderung für jeden Status:**
```
Status: [Bezeichnung]
Das bedeutet: [Erklärung in einem Satz]
Nächster Schritt: [Was passiert als nächstes?]
Ihr Handlungsbedarf: [Was müssen Sie tun? / Nichts – wir melden uns]
Erwartbare Dauer: [Orientierungswert, wenn bekannt]
```

---

## Prinzip 3: Jede Anforderung braucht einen Grund

**Regel:** Kein Dokument wird angefordert, ohne zu erklären, warum es benötigt wird.

**Verbotenes Format:**
> „Bitte reichen Sie einen Kontoauszug ein."

**Erforderliches Format:**
> „Wir benötigen Ihren Kontoauszug der letzten drei Monate, um Ihre aktuellen Einnahmen und Ausgaben zu überprüfen. Dies ist erforderlich, um die Höhe Ihrer Leistung korrekt zu berechnen (§ 60 SGB I)."

**Implementierung:** Das Rückfrage-Formular erzwingt die Befüllung des Feldes „Begründung". Leere Begründungen sind technisch nicht speicherbar.

---

## Prinzip 4: Jede Frist muss sichtbar sein

**Regel:** Fristen werden immer mit Datum, Kontext und Konsequenz angezeigt.

**Anforderung:**
```
Frist: [Datum, z.B. „15. April"]
Wofür: [z.B. „Einreichung Ihrer Arbeitsbescheinigung"]
Was passiert wenn: [z.B. „Wir werden Sie einmal erinnern. Danach wird geprüft,
ob eine Fristverlängerung möglich ist."]
```

**Visuell:** Fristanzeige wird farblich hervorgehoben, wenn sie < 5 Werktage entfernt ist. Push-Notification 3 Tage vor Fristablauf (sofern aktiviert).

---

## Prinzip 5: Keine Sackgassen

**Regel:** Jeder Bildschirm hat einen klaren nächsten Schritt. Kein Endpunkt, der den Nutzer allein lässt.

**Verbotene Situationen:**
- Fehlermeldung ohne Erklärung und Handlungsoption
- „Ihr Antrag wurde abgelehnt." ohne Erklärung und Widerspruchsweg
- Leere Seite nach dem Einreichen ohne Bestätigung
- „Bitte wenden Sie sich an Ihre zuständige Stelle" ohne Kontaktdaten

**Anforderung für jeden Endpunkt (Bescheid, Ablehnung, Fehler):**
- Was ist passiert?
- Was bedeutet das?
- Was können Sie jetzt tun?
- Wo finden Sie Hilfe, wenn Sie unsicher sind?

---

## Prinzip 6: Keine dunklen Muster (Dark Patterns)

**Verbotene Gestaltung:**
- Bestätigungsschaltflächen für ungewollte Handlungen (z.B. ungewollter Datenteilung zustimmen)
- Versteckte Einwilligungen in vorausgefüllten Feldern
- Opt-out-Formulierungen, die Verweigerung erschweren
- Fristvorgaben, die künstlich Druck erzeugen, ohne gesetzliche Grundlage
- Bedrohungston bei Erinnerungen: „Sie müssen sofort handeln, sonst..."

**Erlaubt und erwünscht:**
- Klare, prominente Hinweise auf nahe Fristen
- Erinnerungen mit sachlichem Ton: „Ihre Frist läuft in 3 Tagen ab."
- Deutliche Bestätigung, bevor Aktionen mit Konsequenzen ausgelöst werden

---

## Prinzip 7: Hilfe vor Sanktionston

**Regel:** Die erste Reaktion auf fehlende Mitwirkung ist immer ein Hilfsangebot, nicht eine Sanktionsandrohung.

**Verbotener Ton:**
> „Sie haben die Frist versäumt. Wir behalten uns rechtliche Schritte vor."

**Erwünschter Ton:**
> „Wir haben Ihre Arbeitsbescheinigung noch nicht erhalten. Wenn Sie Schwierigkeiten haben, das Dokument zu beschaffen, können wir Ihnen helfen. Bitte melden Sie sich, damit wir gemeinsam eine Lösung finden."

**Implementierung:** Alle Standardtexte für Fristversäumnisse und Rückfragen werden durch ein Redaktionsteam auf Ton und Verständlichkeit geprüft. Keine automatisierten Drohbriefe ohne vorherige menschliche Freigabe.

---

## Prinzip 8: Respektvolle Kommunikation

**Grundregeln:**
- Kein Vorwurfs-Ton in Systemtexten
- Kein impliziter Betrugsvorwurf (z.B. „Bitte belegen Sie, dass...")
- Höfliche Anrede, auch wenn Mitwirkungspflichten verletzt wurden
- Klare Formulierung ohne Herablassung
- Keine Überheblichkeit des Systems gegenüber dem Bürger

**Beispiel für Nachreichungsanforderung:**

Falsch: „Ihre bisher eingereichten Unterlagen sind unvollständig und entsprechen nicht den Anforderungen."

Richtig: „Für die weitere Bearbeitung benötigen wir noch eine vollständige Version Ihrer Arbeitsbescheinigung. Die eingereichte Version enthält leider nicht alle erforderlichen Angaben – konkret fehlt: [...]."

---

## Prinzip 9: Sichtbarkeit von Fortschritt

**Regel:** Bürger sollen jederzeit das Gefühl haben, dass sich etwas bewegt – oder verstehen, warum es sich gerade nicht bewegt.

**Implementierung:**
- Fortschrittsanzeige in der Fallakte (z.B. „Schritt 3 von 5: Unterlagen vollständig")
- Jeder Statuswechsel ist sichtbar (Notification)
- Wenn ein Fall > 5 Werktage in einem Status verbleibt: automatischer Info-Text an Bürger mit Erklärung und Kontaktangebot
- „Zuletzt aktualisiert am: [Datum]" bei jedem Fall

---

## Prinzip 10: Sichtbarkeit von Blockaden

**Regel:** Wenn ein Fall blockiert ist, sieht der Bürger die Blockade – nicht nur ein statisches Status-Label.

**Anforderung:**
```
⚠ IHR VORGANG IST DERZEIT BLOCKIERT

Grund: Wir warten auf Ihre Antwort zur Rückfrage vom [Datum].
Solange diese Rückfrage unbeantwortet ist, können wir die
Prüfung nicht fortsetzen.

Was Sie tun können:
[Jetzt antworten] [Fristverlängerung beantragen] [Frage stellen]
```

---

## Prinzip 11: Bürgerwürde als Produktprinzip

**Grundsatz:** Das Design dieses Systems respektiert den Bürger als mündige Person, die in einer schwierigen Situation Unterstützung benötigt – nicht als Verdächtigen, der überführt werden muss, und nicht als Datenpunkt, der optimiert werden soll.

**Konkrete Konsequenzen:**
- Keine Scorecards, Rankings oder Vergleiche mit anderen Nutzern
- Keine unnötige Datenerhebung (Datensparsamkeit als UX-Prinzip)
- Kein Design, das Bürger in Abhängigkeit vom System drängt
- Immer: ein klarer Weg zur menschlichen Unterstützung (Telefon, Termin, Kiosk)
- Offline-Fallback: alle kritischen Funktionen funktionieren auch ohne App (Kiosk, Sachbearbeitung-Eingang)

---

## Prinzip 12: Barrierefreiheit als Standard, nicht als Zusatz

**Anforderung:** WCAG 2.1 AA als Mindeststandard für alle Komponenten der Arbeitsverwaltungs-Domäne.

**Konkret:**
- Screenreader-Kompatibilität für alle Formulare und Statusanzeigen
- Ausreichender Farbkontrast (mind. 4,5:1)
- Keine Zeitlimits ohne Verlängerungsmöglichkeit
- Spracheingabe für alle Texteingaben
- Einfache Sprache auf Anfrage (kein verstecktes Feature)
- Kiosk-Modus für Bürger ohne Smartphone (Bürgeramt, Bibliothek)
- 12 Sprachen für alle Hauptbildschirme

---

## Prinzip 13: Konsistenz über alle Kontaktpunkte

**Regel:** Ein Bürger, der sowohl die App als auch einen Kiosk oder ein persönliches Gespräch nutzt, findet überall denselben Informationsstand seines Falls.

**Implementierung:** Alle Kanäle schreiben in dieselbe Fallakte. Kein Kanal hat einen Informationsvorsprung. Keine Information, die nur persönlich mitgeteilt wird und nicht in der Akte erscheint.

---

*Diese Prinzipien gelten für alle UX-Entscheidungen in der Domäne Arbeitsverwaltung.*
*Weiterführend: [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](../../LEITBILD_STAAT_UND_VERTRAUEN.md)*
