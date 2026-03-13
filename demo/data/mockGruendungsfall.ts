/**
 * Mock-Daten: Gründungsakte UG-2024-0117
 *
 * Fiktiver Fall: Einzelunternehmen IT-Dienstleistungen
 * Vorgangstyp: Gewerbeanmeldung
 *
 * Fallstand: Gewerbeamt hat Gewerbeschein erteilt.
 * Finanzamt hat Rückfrage gestellt (§ 19 UStG Kleinunternehmerregelung).
 * IHK-Pflichtmitgliedschaft wird bearbeitet.
 * Berufsgenossenschaft-Anmeldung steht noch aus.
 *
 * Realistische § SGB- und GewO-Referenzen.
 * Kein Personenbezug (keine echten Namen, Adressen, Steuer-IDs).
 */

import type { GruendungsAkte } from '@/types/gruendung';

export const demoGruendungsAkte: GruendungsAkte = {
  id: 'UG-2024-0117',
  vorgangstyp: 'Gewerbeanmeldung',
  rechtsform: 'EINZELUNTERNEHMEN',
  gewerbebezeichnung: 'IT-Beratung und Softwareentwicklung',
  wzCode: '62.01.0',
  wzBezeichnung: 'Entwicklung und Produktion von Software',

  status: 'RUECKFRAGE_AUSSTEHEND',
  statusBeschreibung:
    'Das Gewerbeamt hat den Gewerbeschein erteilt. Das Finanzamt wartet auf Ihre Antwort zu einer Rückfrage zur steuerlichen Erfassung. Die IHK-Mitgliedschaft wird parallel bearbeitet.',
  naechsterSchritt:
    'Bitte beantworten Sie die Rückfrage des Finanzamts zur Kleinunternehmerregelung im Bereich „Rückfragen".',
  offeneAufgaben: [
    'Rückfrage des Finanzamts zur Umsatzsteuer beantworten (Frist: 10.12.2024)',
    'Nachweis beruflicher Qualifikation hochladen (Gewerbeamt, angefordert)',
    'Anmeldung bei der Berufsgenossenschaft Holz und Metall – BG ETEM (eigenständig, kein Systemvorgang)',
  ],

  ersteinreichung: '01.11.2024',
  letzteAktualisierung: '15.11.2024',
  geplantesBetriebsdatum: '01.12.2024',

  // ─── Beteiligte Behörden ──────────────────────────────────────────────────

  beteiligteBehörden: [
    {
      id: 'BEH-01',
      bezeichnung: 'Gewerbeamt Musterstadt',
      typ: 'GEWERBEAMT',
      status: 'ABGESCHLOSSEN',
      zustaendigeStelle: 'Gewerbeamt, Sachgebiet Gewerbemeldewesen',
      adresse: 'Rathausplatz 1, 12345 Musterstadt',
      kontakt: 'gewerbeamt@musterstadt.de · 04321 / 555-200',
      rolle:
        'Entgegennahme und Bearbeitung der Gewerbeanmeldung nach § 14 GewO. Erteilt den Gewerbeschein als Nachweis der Anmeldung.',
    },
    {
      id: 'BEH-02',
      bezeichnung: 'Finanzamt Musterstadt',
      typ: 'FINANZAMT',
      status: 'RUECKFRAGE_OFFEN',
      zustaendigeStelle: 'Finanzamt Musterstadt, Veranlagungsstelle Unternehmen',
      adresse: 'Finanzstraße 12, 12345 Musterstadt',
      kontakt: 'poststelle@fa-musterstadt.de · 04321 / 888-0',
      rolle:
        'Steuerliche Ersterfassung nach § 138 AO. Vergibt Steuernummer und klärt Umsatzsteuerpflicht. Entscheidet über Anwendung der Kleinunternehmerregelung (§ 19 UStG).',
    },
    {
      id: 'BEH-03',
      bezeichnung: 'IHK Musterregion',
      typ: 'IHK',
      status: 'IN_BEARBEITUNG',
      zustaendigeStelle: 'IHK Musterregion, Mitgliederservice',
      adresse: 'Handelshof 3, 12345 Musterstadt',
      kontakt: 'service@ihk-musterregion.de · 04321 / 777-100',
      rolle:
        'Pflichtmitgliedschaft nach § 2 IHKG. Erteilt Mitgliedsnummer, informiert über Beiträge und Beratungsangebote.',
    },
    {
      id: 'BEH-04',
      bezeichnung: 'BG ETEM – Berufsgenossenschaft Energie Textil Elektro Medienerzeugnisse',
      typ: 'BERUFSGENOSSENSCHAFT',
      status: 'NICHT_GESTARTET',
      zustaendigeStelle: 'BG ETEM, Mitgliedschaft und Beitrag',
      kontakt: 'mitgliedschaft@bgetem.de · 0221 / 3778-0',
      rolle:
        'Gesetzliche Unfallversicherung nach § 2 SGB VII. Anmeldung binnen einer Woche nach Betriebsaufnahme (§ 192 SGB VII). Wird außerhalb von Open State direkt angemeldet.',
    },
  ],

  // ─── Verfahrensschritte ───────────────────────────────────────────────────

  verfahrensSchritte: [
    {
      id: 'VS-01',
      bezeichnung: 'Gewerbeanmeldung einreichen',
      beschreibung:
        'Gewerbeanmeldeformular (digital) mit Angaben zur Tätigkeit, Betriebsstätte und Rechtsform beim Gewerbeamt einreichen.',
      behördeId: 'BEH-01',
      status: 'ABGESCHLOSSEN',
      rechtsgrundlage: '§ 14 Abs. 1 GewO – Anzeigepflicht bei Aufnahme eines Gewerbebetriebs',
      erledigtAm: '01.11.2024',
      ergebnis: 'Anmeldung vollständig eingereicht. Eingangsbestätigung erteilt.',
    },
    {
      id: 'VS-02',
      bezeichnung: 'Gewerbeschein erhalten',
      beschreibung:
        'Das Gewerbeamt prüft die Angaben und erteilt den Gewerbeschein als Nachweis der gemeldeten Tätigkeit.',
      behördeId: 'BEH-01',
      status: 'ABGESCHLOSSEN',
      rechtsgrundlage: '§ 15 GewO – Empfangsbescheinigung',
      erledigtAm: '08.11.2024',
      ergebnis: 'Gewerbeschein Nr. GS-2024-1847 erteilt.',
    },
    {
      id: 'VS-03',
      bezeichnung: 'Fragebogen steuerliche Erfassung einreichen',
      beschreibung:
        'Fragebogen zur steuerlichen Erfassung (§ 138 AO) mit Angaben zu erwarteten Umsätzen, Gewinnermittlungsart und Umsatzsteuer an das Finanzamt übermitteln.',
      behördeId: 'BEH-02',
      status: 'ABGESCHLOSSEN',
      rechtsgrundlage: '§ 138 AO – Anzeige der Erwerbstätigkeit',
      erledigtAm: '10.11.2024',
      ergebnis: 'Fragebogen vollständig übermittelt.',
    },
    {
      id: 'VS-04',
      bezeichnung: 'Rückfrage Finanzamt: Kleinunternehmerregelung klären',
      beschreibung:
        'Das Finanzamt bittet um Klärung, ob die Kleinunternehmerregelung nach § 19 UStG angewendet werden soll. Antwort mit Angabe des erwarteten Jahresumsatzes erforderlich.',
      behördeId: 'BEH-02',
      status: 'IN_BEARBEITUNG',
      rechtsgrundlage: '§ 19 UStG – Besteuerung der Kleinunternehmer',
    },
    {
      id: 'VS-05',
      bezeichnung: 'Steuernummer erhalten',
      beschreibung:
        'Nach Klärung der Rückfrage vergibt das Finanzamt die steuerliche Identifikationsnummer für das Unternehmen.',
      behördeId: 'BEH-02',
      status: 'AUSSTEHEND',
      rechtsgrundlage: '§ 139a AO – Identifikationsmerkmal',
    },
    {
      id: 'VS-06',
      bezeichnung: 'IHK-Pflichtmitgliedschaft abschließen',
      beschreibung:
        'Als Einzelunternehmer mit Gewerbeschein entsteht automatisch die Pflichtmitgliedschaft in der zuständigen IHK. Mitgliedsnummer und Beitragsinformation folgen.',
      behördeId: 'BEH-03',
      status: 'IN_BEARBEITUNG',
      rechtsgrundlage: '§ 2 Abs. 1 IHKG – Zugehörigkeit zur Industrie- und Handelskammer',
    },
    {
      id: 'VS-07',
      bezeichnung: 'Anmeldung Berufsgenossenschaft (außerhalb Open State)',
      beschreibung:
        'Die gesetzliche Unfallversicherung muss eigenständig bei der zuständigen Berufsgenossenschaft angemeldet werden. Open State informiert über die Pflicht, übermittelt aber keine Daten ohne Einwilligung.',
      behördeId: 'BEH-04',
      status: 'AUSSTEHEND',
      rechtsgrundlage: '§ 192 SGB VII – Anzeigepflicht beim Unfallversicherungsträger',
    },
  ],

  // ─── Dokumente ────────────────────────────────────────────────────────────

  dokumente: [
    {
      id: 'DOK-01',
      bezeichnung: 'Lichtbildausweis (Personalausweis oder Reisepass)',
      begründung:
        'Zur Feststellung der Identität der anmeldenden Person nach § 14 GewO. Pflichtunterlage für jede Gewerbeanmeldung.',
      konsequenz: 'Ohne Identitätsnachweis kann die Gewerbeanmeldung nicht bearbeitet werden.',
      status: 'AKZEPTIERT',
      anforderndeBehördeId: 'BEH-01',
      hochgeladenAm: '01.11.2024',
    },
    {
      id: 'DOK-02',
      bezeichnung: 'Ausgefülltes Gewerbeanmeldeformular',
      begründung:
        'Standardisiertes Anmeldeformular nach bundeseinheitlichem XGewerbeanmeldung-Standard. Enthält Tätigkeitsbeschreibung, Betriebsstätte und Rechtsform.',
      konsequenz: 'Ohne vollständiges Formular keine Bearbeitung durch das Gewerbeamt.',
      status: 'AKZEPTIERT',
      anforderndeBehördeId: 'BEH-01',
      hochgeladenAm: '01.11.2024',
    },
    {
      id: 'DOK-03',
      bezeichnung: 'Nachweis beruflicher Qualifikation (optional, aber empfohlen)',
      begründung:
        'Bei IT-Beratung und Software-Entwicklung ist kein Zulassungserfordernis vorgeschrieben (kein erlaubnispflichtiges Gewerbe). Ein Qualifikationsnachweis stärkt jedoch die Glaubwürdigkeit gegenüber Kunden und Kreditinstituten.',
      konsequenz:
        'Fehlt kein Pflichtdokument — das Gewerbeamt kann die Anmeldung ohne diesen Nachweis abschließen.',
      status: 'ANGEFORDERT',
      anforderndeBehördeId: 'BEH-01',
      frist: '15.12.2024',
      fristDatum: '2024-12-15',
    },
    {
      id: 'DOK-04',
      bezeichnung: 'Fragebogen zur steuerlichen Erfassung',
      begründung:
        'Pflichtformular nach § 138 AO. Enthält Angaben zu Tätigkeitsart, erwarteten Umsätzen, Gewinnermittlungsart und Umsatzsteuervoranmeldungsrhythmus.',
      konsequenz:
        'Ohne diesen Fragebogen kann das Finanzamt keine Steuernummer vergeben. Betrieb ohne Steuernummer ist rechtlich riskant.',
      status: 'IN_PRUEFUNG',
      anforderndeBehördeId: 'BEH-02',
      hochgeladenAm: '10.11.2024',
    },
  ],

  // ─── Rückfragen ───────────────────────────────────────────────────────────

  rueckfragen: [
    {
      id: 'RQ-01',
      text: 'Bitte geben Sie an, ob Sie die Kleinunternehmerregelung nach § 19 UStG in Anspruch nehmen möchten. Teilen Sie dazu Ihren voraussichtlichen Jahresumsatz für das laufende und das kommende Kalenderjahr mit.',
      begründung:
        'Kleinunternehmer nach § 19 UStG sind von der Umsatzsteuerpflicht befreit, wenn der Umsatz im Vorjahr 22.000 € nicht überstiegen hat und im laufenden Jahr voraussichtlich 50.000 € nicht übersteigen wird. Ihre Antwort entscheidet, ob Ihnen eine Umsatzsteuer-Identifikationsnummer zugeteilt wird.',
      konsequenz:
        'Ohne Ihre Antwort kann das Finanzamt die steuerliche Erfassung nicht abschließen und keine Steuernummer vergeben. Ohne Steuernummer sind Rechnungsstellung und Betriebsaufnahme rechtlich nicht vollständig abgesichert.',
      anforderndeBehördeId: 'BEH-02',
      frist: '10.12.2024',
      fristDatum: '2024-12-10',
      beantwortet: false,
      gestelltAm: '15.11.2024',
    },
  ],

  // ─── Ereignisse (Audit-Log) ───────────────────────────────────────────────

  ereignisse: [
    {
      id: 'ERE-01',
      typ: 'vorgang_erstellt',
      zeitstempel: '01.11.2024, 09:14 Uhr',
      handelndeStelle: 'GRUENDER',
      beschreibung: 'Gründungsakte angelegt.',
      details: 'Vorgangstyp: Gewerbeanmeldung · Rechtsform: Einzelunternehmen · WZ-Code 62.01.0',
    },
    {
      id: 'ERE-02',
      typ: 'vorgang_eingereicht',
      zeitstempel: '01.11.2024, 10:02 Uhr',
      handelndeStelle: 'GRUENDER',
      beschreibung: 'Gewerbeanmeldung vollständig eingereicht.',
      details: 'Dokumente: Lichtbildausweis, Gewerbeanmeldeformular. Übermittlung an Gewerbeamt Musterstadt.',
    },
    {
      id: 'ERE-03',
      typ: 'eingang_bestaetigt',
      zeitstempel: '04.11.2024, 11:35 Uhr',
      handelndeStelle: 'BEHOERDE',
      behördeId: 'BEH-01',
      beschreibung: 'Gewerbeamt Musterstadt: Eingang bestätigt, Bearbeitung aufgenommen.',
    },
    {
      id: 'ERE-04',
      typ: 'bescheid_erteilt',
      zeitstempel: '08.11.2024, 14:08 Uhr',
      handelndeStelle: 'BEHOERDE',
      behördeId: 'BEH-01',
      beschreibung: 'Gewerbeschein erteilt.',
      details: 'Gewerbeschein Nr. GS-2024-1847. Gewerbetyp: IT-Beratung und Softwareentwicklung (WZ 62.01.0). Gültig ab 01.11.2024.',
    },
    {
      id: 'ERE-05',
      typ: 'dokument_hochgeladen',
      zeitstempel: '10.11.2024, 08:55 Uhr',
      handelndeStelle: 'GRUENDER',
      beschreibung: 'Fragebogen zur steuerlichen Erfassung an Finanzamt übermittelt.',
      details: '§ 138 AO. Angaben zu Umsatz, Gewinnermittlung, Voranmeldungsrhythmus.',
    },
    {
      id: 'ERE-06',
      typ: 'rueckfrage_gestellt',
      zeitstempel: '15.11.2024, 09:22 Uhr',
      handelndeStelle: 'BEHOERDE',
      behördeId: 'BEH-02',
      beschreibung: 'Finanzamt Musterstadt: Rückfrage zur Kleinunternehmerregelung gestellt.',
      details: 'Frist zur Beantwortung: 10.12.2024 · Rechtsgrundlage: § 19 UStG',
    },
  ],
};
