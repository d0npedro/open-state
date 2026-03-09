# arc42 – Kapitel 6: Laufzeitsicht

---

Die Laufzeitsicht beschreibt, was zur Laufzeit passiert – nicht statisch als Struktur, sondern dynamisch als Abläufe. Die drei folgenden Szenarien sind direkt aus den wichtigsten User Stories abgeleitet.

---

## Szenario 1: Fall anlegen (US-AV-001)

**Ausgangssituation:** Ein Bürger hat seine Arbeit verloren und möchte sich digital arbeitslos melden. Er öffnet die Open State App zum ersten Mal für diesen Zweck.

**Beteiligte Komponenten:** Frontend (App), API Gateway, Identitätsdienst, Process Orchestrator, Domänenmodul Arbeitsverwaltung, Fallakte, Statusmodell, Audit-Log, Benachrichtigungsdienst

**Ablauf:**

**Schritt 1 – Einstieg und Erklärung**
Der Bürger wählt „Arbeitslosmeldung" in der App. Das Frontend lädt den Einstiegsscreen mit einer Erklärung des Prozesses, dem Hinweis auf die 3-Tage-Frist (§ 141 SGB III) und einem „Jetzt starten"-Button, der die eID-Verifikation initiiert.

**Schritt 2 – eID-Verifikation**
Das Frontend kommuniziert über das API Gateway mit dem Identitätsdienst. Der Identitätsdienst startet den eID-Flow via AusweisApp2-SDK. Der Bürger hält seinen Personalausweis ans Smartphone (NFC). Der eID-Server der Bundesdruckerei verifiziert die Identität. Der Identitätsdienst gibt ein signiertes Auth-Token zurück. Ohne erfolgreiche Verifikation ist keine Fallanlage möglich.

**Schritt 3 – Zuständigkeitsermittlung**
Das API Gateway leitet die authentifizierte Anfrage an den Process Orchestrator weiter. Der Process Orchestrator ruft das Domänenmodul Arbeitsverwaltung auf. Das Domänenmodul ermittelt via Behörden-Adapter-Layer (Zuständigkeits-API) anhand des Wohnorts, ob die Zuständigkeit bei der Bundesagentur für Arbeit oder einem Jobcenter liegt. Das Ergebnis wird im Formular vorbelegt.

**Schritt 4 – Dateneingabe**
Das Frontend zeigt das Fallanlage-Formular mit vorausgefüllten Feldern. Pflichtfelder werden beim Verlassen des Feldes validiert. Bei fehlenden Angaben erscheint ein konkreter, feldbezogener Fehlerhinweis.

**Schritt 5 – Fallanlage**
Der Bürger sendet das Formular ab. Der Process Orchestrator empfängt die Anfrage und orchestriert:
1. Domänenmodul Arbeitsverwaltung legt den Fall in der Fallakte an (`POST /api/v1/cases`)
2. Fallakte erhält eine UUID-basierte Fall-ID (Format: `AV-[UUID]`)
3. Statusmodell setzt den initialen Zustand: `EINGEGANGEN`
4. Audit-Log erhält den ersten Eintrag: `FALL_ANGELEGT` mit Zeitstempel, Fallnummer, Akteur=Bürger, Zustand=EINGEGANGEN

**Schritt 6 – Eingangsbestätigung**
Das Frontend zeigt die Eingangsbestätigung auf demselben Screen:
- Fallnummer prominent
- Zeitstempel der Anlage
- Zuständige Stelle (systemseitig ermittelt)
- Nächste drei Schritte in Klarsprache
- Fristenhinweis, sofern die 3-Tage-Frist noch nicht abgelaufen ist

Parallel sendet der Benachrichtigungsdienst eine Push-Benachrichtigung und E-Mail-Bestätigung.

**Fehlerzustand:** Schlägt die eID-Verifikation fehl, zeigt das Frontend einen erklärten Alternativweg (z.B. persönlicher Besuch im Bürgeramt). Schlägt die Fallanlage technisch fehl, zeigt das Frontend eine verständliche Fehlermeldung mit konkreter Handlungsanweisung – kein technischer Fehlertext.

---

## Szenario 2: Unterlagen nachreichen (US-AV-003)

**Ausgangssituation:** Der Bürger hat eine Benachrichtigung erhalten, dass ein Dokument für seinen laufenden Fall eingereicht werden soll. Er öffnet die App, um das Dokument hochzuladen.

**Beteiligte Komponenten:** Frontend, API Gateway, Process Orchestrator, Domänenmodul Arbeitsverwaltung, Fallakte, Dokumentenverwaltung, OCR-Service (optional), Audit-Log, Benachrichtigungsdienst

**Ablauf:**

**Schritt 1 – Anforderung einsehen**
Der Bürger öffnet seinen Fall in der App. Der Fallstatus zeigt eine offene Anforderung: welches Dokument benötigt wird, warum (Begründung), bis wann (Frist) und was passiert, wenn es nicht eingereicht wird. Die Dokumentenanforderung ist in Klarsprache formuliert (Erklärschicht).

**Schritt 2 – Dokument auswählen**
Der Bürger wählt das Dokument aus seinem Gerät (Foto, PDF, Scan). Das Frontend zeigt eine Vorschau und ermöglicht eine Qualitätsprüfung (lesbar? vollständig?).

**Schritt 3 – Upload**
Das Frontend sendet das Dokument über das API Gateway an die Dokumentenverwaltung (`POST /api/v1/cases/{id}/documents`). Die Dokumentenverwaltung:
1. Weist dem Dokument eine Dokument-ID zu
2. Speichert das Dokument im Dokumentenspeicher (verschlüsselt)
3. Setzt den Dokumentenstatus: `EINGEGANGEN`
4. Verknüpft das Dokument mit der Fallakte
5. Schreibt einen Audit-Event: `DOKUMENT_EINGEREICHT` mit Zeitstempel, Dokument-ID, Akteur=Bürger

**Schritt 4 – Fallakte aktualisiert**
Der Process Orchestrator aktualisiert die Checkliste in der Fallakte: Das Dokument ist von `AUSSTEHEND` auf `EINGEGANGEN` gesetzt. Falls alle geforderten Dokumente eingereicht sind, prüft das Domänenmodul, ob ein Statusübergang ausgelöst werden soll.

**Schritt 5 – Sachbearbeitung benachrichtigt**
Der Benachrichtigungsdienst sendet eine Benachrichtigung an die zuständige Stelle: neues Dokument eingegangen, Fallnummer, Dokumenttyp. Der Bürger erhält eine Bestätigung mit Upload-Zeitstempel und Dokumentenstatus.

**Fehlerzustand:** Schlägt der Upload fehl (Netzwerkfehler, Dateiformat nicht unterstützt), zeigt das Frontend eine verständliche Fehlermeldung mit der Handlungsoption, es erneut zu versuchen oder ein alternatives Format zu verwenden.

---

## Szenario 3: Bescheid einsehen (US-AV-006)

**Ausgangssituation:** Die Sachbearbeitung hat einen Bescheid erstellt und in der Fallakte abgelegt. Der Bürger erhält eine Benachrichtigung.

**Beteiligte Komponenten:** Benachrichtigungsdienst, Frontend, API Gateway, Process Orchestrator, Bescheid-Verwaltung (Teil der Kommunikationshistorie), Erklärschicht, Statusmodell, Audit-Log

**Ablauf:**

**Schritt 1 – Push-Benachrichtigung**
Der Benachrichtigungsdienst sendet eine Push-Benachrichtigung: „Ihr Bescheid ist eingegangen." Der Zeitpunkt dieser Benachrichtigung wird im Audit-Log als `BESCHEID_ZUGESTELLT` mit Zeitstempel protokolliert – dieser Zeitstempel ist rechtlich relevant für den Fristbeginn.

**Schritt 2 – Bescheid öffnen**
Der Bürger öffnet die App und navigiert zum Bescheid. Das Frontend ruft den Bescheid ab (`GET /api/v1/cases/{id}/notices/{noticeId}`). Das Audit-Log erhält einen `BESCHEID_GEÖFFNET`-Eintrag mit Zeitstempel.

**Schritt 3 – Zwei-Schichten-Ansicht**
Das Frontend zeigt den Bescheid in der Erklärschicht-Standardansicht:
- Erklärungsschicht (standardmäßig aktiv): Was wurde entschieden / Warum / Was bedeutet das / Was kann ich tun
- Toggle für juristische Fassung: vollständige, unveränderte Originalfassung
- Rechtsgrundlage: benannter Paragraph mit Einzeiler-Erklärung
- Widerspruchsfrist: konkretes Datum und Countdown in Tagen
- Widerspruchsbutton: aktiv, solange Frist läuft

**Schritt 4 – Widerspruchsoption**
Der Widerspruchsbutton ist für den Bürger sichtbar mit einem Begleittext, der erklärt, was ein Widerspruch ist und welche Schritte folgen. Klickt der Bürger den Button, wird der Widerspruchsprozess initiiert (separate Story).

**Schritt 5 – Zustellung dokumentiert**
Alle relevanten Zeitpunkte sind im Audit-Log und in der Fallakte dokumentiert: Erstellungszeitpunkt des Bescheids, Zeitpunkt der Zustellung (=Benachrichtigung), Zeitpunkt der ersten Öffnung, Widerspruchsfrist-Ende. Diese Daten sind für den Bürger in der Timeline einsehbar.

**Fehlerzustand (Frist abgelaufen):** Ist die Widerspruchsfrist verstrichen, ist der Widerspruchsbutton deaktiviert. Das Frontend zeigt einen sachlichen Hinweis auf mögliche weitere Rechtsmittel (Klage) mit Empfehlung, rechtliche Beratung zu suchen.

---

*Verweis: [docs/stories/arbeitsverwaltung/US-AV-001_Fall_anlegen.md](../../docs/stories/arbeitsverwaltung/US-AV-001_Fall_anlegen.md)*
*Verweis: [docs/stories/arbeitsverwaltung/US-AV-003_Unterlagen_nachreichen.md](../../docs/stories/arbeitsverwaltung/US-AV-003_Unterlagen_nachreichen.md)*
*Verweis: [docs/stories/arbeitsverwaltung/US-AV-006_Bescheid_verstehen.md](../../docs/stories/arbeitsverwaltung/US-AV-006_Bescheid_verstehen.md)*
