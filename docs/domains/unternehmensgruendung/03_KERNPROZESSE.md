# Unternehmensgründung – Kernprozesse

---

## Vorbemerkung

Die Kernprozesse beschreiben die wichtigsten Verfahrensabläufe in der Domäne Unternehmensgründung. Sie sind als Referenz für die technische Implementierung und als Grundlage für Verfahrensdokumentation gegenüber Behörden konzipiert.

Alle Prozesse sind als zustandsbasierte Abläufe beschrieben. Zeitangaben werden ausdrücklich nicht genannt – die tatsächliche Dauer hängt von behördlichen Kapazitäten und rechtlichen Rahmenbedingungen ab, die außerhalb des direkten Systemeinflussbereichs liegen.

---

## Prozess A: Gewerbeanmeldung / Unternehmensanmeldung

**Auslöser:** Gründerin oder Gründer möchte ein Gewerbe anmelden oder eine selbstständige Tätigkeit aufnehmen.

**Schritte:**

1. Gründer initiiert Vorgang in Open State (Vorgangstyp: Gewerbeanmeldung)
2. System erfragt Eckdaten: Gewerbetyp, geplante Tätigkeit, Rechtsform, Betriebsstätte, Personalangaben
3. System generiert auf Basis der Angaben eine fallspezifische Anforderungsliste (welche Dokumente, welche Behörden, welche Reihenfolge)
4. Gründer lädt erforderliche Dokumente hoch und gibt Freigabe zur Einreichung
5. System übermittelt Anmeldung digital an das zuständige Gewerbeamt (via XGewerbeanmeldung-Standard)
6. Gewerbeamt empfängt Anmeldung, prüft Vollständigkeit
7. Bei Vollständigkeit: Gewerbeamt nimmt Bearbeitung auf, Status wechselt auf "In Bearbeitung"
8. Bei Unvollständigkeit: Gewerbeamt stellt dokumentierte Rückfrage, Status wechselt auf "Rückfrage ausstehend"
9. Gewerbeamt erteilt Gewerbeschein, Status wechselt auf "Gewerbeschein erteilt"
10. System informiert Gründer und bereitet nächste Schritte (Finanzamt, IHK) vor

**Besonderheiten:**
- Freiberufliche Tätigkeiten erfordern keine Gewerbeanmeldung, aber steuerliche Erfassung (abweichender Flow)
- Erlaubnispflichtige Gewerbe (z.B. Gaststätten, bestimmte Handwerke) haben zusätzliche Vorprüfungsschritte

---

## Prozess B: Statusverfolgung

**Auslöser:** Gründer möchte wissen, wo sein Vorgang steht.

**Schritte:**

1. Gründer öffnet Gründungsakte in Open State
2. System zeigt aktuellen Status je Verfahrensschritt an
3. Für jeden offenen Schritt: Erklärung, was als nächstes passiert und wer handeln muss
4. Bei Statusänderungen: automatische Push-Benachrichtigung (konfigurierbar)
5. Bei Verfahrensstillstand über definierten Zeitraum: System informiert Gründer proaktiv mit Hinweis auf nächste Schritte

**Statusanzeige enthält:**
- Gesamtstatus des Gründungsvorgangs
- Status je Behörde (Gewerbeamt, Finanzamt, IHK/HWK)
- Offene Anforderungen mit Frist (falls vorhanden)
- Erledigte Schritte mit Datum
- Nächster erwarteter Schritt

---

## Prozess C: Dokumentennachreichung

**Auslöser:** Behörde fordert ein fehlendes oder ergänzendes Dokument an.

**Schritte:**

1. Behörde hinterlegt Anforderung in der Akte: welches Dokument, welcher Grund, welche Frist
2. Gründer erhält Benachrichtigung mit verständlicher Erklärung der Anforderung
3. Gründer lädt Dokument hoch
4. System prüft Dateityp, Lesbarkeit und Vollständigkeit (technische Vorprüfung)
5. System bestätigt Eingang und informiert die anfragende Behörde
6. Behörde prüft Dokument
7. Bei Akzeptanz: Status des betreffenden Schritts wird aktualisiert
8. Bei Ablehnung: Behörde dokumentiert Grund, Gründer erhält Erklärung und Möglichkeit zur erneuten Einreichung

---

## Prozess D: Rückfragen-Management

**Auslöser:** Behörde hat eine inhaltliche Rückfrage zum Vorgang.

**Schritte:**

1. Behörde hinterlegt Rückfrage in der Akte: konkrete Frage, Bezug auf welchen Vorgang oder welches Dokument, Frist für Antwort
2. Gründer erhält Benachrichtigung mit der Rückfrage in Alltagssprache
3. Gründer beantwortet die Frage schriftlich in der Akte oder reicht ergänzende Dokumente ein
4. Antwort wird in der Akte dokumentiert und der Behörde zugestellt
5. Behörde bestätigt Eingang und nimmt Bearbeitung wieder auf
6. Alle Rückfragen und Antworten sind dauerhaft in der Kommunikationshistorie der Akte einsehbar

**Besonderheit:** Rückfragen können nicht telefonisch beantwortet werden, ohne dass das Ergebnis in der Akte dokumentiert wird. Mündliche Auskünfte können festgehalten werden, haben aber nur beratenden Charakter.

---

## Prozess E: Steuerliche Erstregistrierung

**Auslöser:** Gewerbeschein ist erteilt, oder freiberufliche Tätigkeit soll aufgenommen werden.

**Schritte:**

1. System informiert Gründer, dass steuerliche Erfassung als nächster Schritt fällig ist
2. Gründer füllt Fragebogen zur steuerlichen Erfassung aus (digital, im System)
3. System übermittelt Fragebogen an das zuständige Finanzamt (mit Einwilligung des Gründers)
4. Finanzamt prüft Angaben
5. Bei Rückfragen: Rückfragen-Management (Prozess D)
6. Finanzamt vergibt Steuernummer und teilt diese mit
7. Steuernummer wird in der Gründungsakte gespeichert
8. Gründer kann bei Bedarf USt-IdNr. beantragen (automatischer Hinweis)

**Hinweis:** Die steuerliche Ersterfassung ist datenschutzsensibel. Angaben werden ausschließlich an das zuständige Finanzamt übermittelt, nicht an andere Behörden ohne explizite Einwilligung.

---

## Prozess F: Pflichtenerklärung in verständlicher Sprache

**Auslöser:** Vorgang enthält rechtliche Pflichten, über die der Gründer informiert werden muss (z.B. Buchführungspflicht, Meldepflichten, Unfallversicherungspflicht).

**Schritte:**

1. System identifiziert auf Basis des Gründungstyps, welche Pflichten gelten
2. System stellt für jede Pflicht eine verständliche Erklärung bereit:
   - Was ist die Pflicht?
   - Wann tritt sie ein?
   - Was muss der Gründer konkret tun?
   - Welche Konsequenzen hat Nichterfüllung?
   - Wo findet der Gründer weitere Information?
3. Gründer kann Erklärungen als PDF speichern
4. Gründer bestätigt Kenntnisnahme (dokumentiert in der Akte)

**Wichtig:** Die Erklärung ist eine Informationsleistung, keine rechtliche Beratung. Sie ersetzt nicht den Rat eines Steuerberaters oder Rechtsanwalts.

---

## Prozess G: Betriebsaufnahme-Bestätigung

**Auslöser:** Gründer hat alle Pflichtschritte abgeschlossen und nimmt Betrieb auf.

**Schritte:**

1. System prüft, ob alle Pflichtschritte für den konkreten Gründungstyp abgeschlossen sind
2. Wenn vollständig: System stellt Zusammenfassung "Gründungsakte abgeschlossen" bereit
3. Übersicht: alle erteilten Genehmigungen und Bescheide, alle relevanten Kennzahlen (Steuernummer, ggf. USt-IdNr., Gewerbeschein-Nr.), offene Folgeverpflichtungen
4. Gründer bestätigt Betriebsaufnahme
5. Gründungsakte wechselt in Status "Aktiver Betrieb"
6. System gibt Hinweis auf regelmäßige Folgeverpflichtungen (z.B. Steuererklärung, IHK-Beitrag)

---

## Prozess H: Änderungsmitteilungen

**Auslöser:** Gründer möchte eine Änderung an bestehenden Betriebsangaben melden (z.B. neuer Betriebssitz, Erweiterung des Gewerbes, Aufnahme weiterer Gesellschafter).

**Schritte:**

1. Gründer initiiert Änderungsvorgang, wählt Art der Änderung
2. System identifiziert, welche Behörden über die Änderung informiert werden müssen
3. Gründer gibt Änderungsdetails ein und lädt ggf. neue Dokumente hoch
4. System übermittelt Änderung koordiniert an alle betroffenen Behörden
5. Behörden bestätigen Änderung, Status je Behörde wird aktualisiert
6. Änderung wird in der Gründungsakte dokumentiert (Änderungshistorie)

---

*Alle Prozesse setzen voraus, dass die notwendigen technischen Schnittstellen zu den beteiligten Behörden (XGewerbeanmeldung, ELSTER, XÖV) implementiert und rechtlich vereinbart sind.*
