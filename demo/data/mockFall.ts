import { Fall } from '@/types';

export const demoFall: Fall = {
  id: 'AV-2024-0042',
  typ: 'Arbeitslosengeld I – Erstantrag',
  status: 'RUECKFRAGE_OFFEN',
  statusBeschreibung: 'Ihr Antrag wird geprüft. Es liegt eine offene Rückfrage vor, die Ihre Antwort erfordert.',
  angelegtAm: '12. November 2024',
  letzteAktivitaet: '19. November 2024',
  naechsterSchritt: 'Bitte beantworten Sie die offene Rückfrage zur Arbeitgeberbescheinigung bis zum 26. November 2024.',
  offeneAufgaben: [
    'Rückfrage zur Arbeitgeberbescheinigung beantworten',
    'Formular SG1 vollständig hochladen'
  ],
  dokumente: [
    {
      id: 'DOK-001',
      bezeichnung: 'Arbeitgeberbescheinigung',
      status: 'IN_PRUEFUNG',
      begründung: 'Pflichtdokument nach § 312 SGB III. Bestätigt Ihren letzten Arbeitgeber, Ihre Kündigungsart und Ihr letztes Bruttoentgelt.',
      hochgeladenAm: '14. November 2024'
    },
    {
      id: 'DOK-002',
      bezeichnung: 'Personalausweis (Kopie Vorder- und Rückseite)',
      status: 'AKZEPTIERT',
      begründung: 'Identitätsnachweis erforderlich.',
      hochgeladenAm: '12. November 2024'
    },
    {
      id: 'DOK-003',
      bezeichnung: 'Einkommensteuerbescheid letztes Jahr',
      status: 'ANGEFORDERT',
      begründung: 'Für die korrekte Berechnung der Bemessungsgrundlage Ihres ALG I nach § 132 SGB III.',
      frist: '3. Dezember 2024'
    },
    {
      id: 'DOK-004',
      bezeichnung: 'Formular SG1 (Selbstauskunft)',
      status: 'ANGEFORDERT',
      begründung: 'Standardformular der Bundesagentur für Arbeit zur Erfassung von Qualifikationen und Vermittlungspräferenzen.',
      frist: '3. Dezember 2024'
    }
  ],
  rueckfragen: [
    {
      id: 'RQ-001',
      text: 'Ihre hochgeladene Arbeitgeberbescheinigung enthält kein Datum der Beschäftigungsaufnahme. Dieses Datum ist für die Berechnung Ihrer Anwartschaftszeit nach § 142 SGB III erforderlich.',
      begründung: 'Das Datum der Beschäftigungsaufnahme ist notwendig, um zu prüfen, ob die Rahmenfrist von 30 Monaten und die Anwartschaftszeit von 12 Monaten erfüllt sind.',
      konsequenz: 'Ohne diese Angabe kann die Leistungsberechnung nicht abgeschlossen werden und Ihr Antrag pausiert.',
      frist: '26. November 2024',
      fristDatum: '2024-11-26',
      beantwortet: false,
      gestelltAm: '19. November 2024'
    }
  ],
  termine: [
    {
      id: 'T-001',
      zweck: 'Erstgespräch mit persönlicher Ansprechpartnerin',
      datum: '3. Dezember 2024',
      uhrzeit: '10:00 Uhr',
      format: 'PERSOENLICH',
      ort: 'Agentur für Arbeit, Schanzenstraße 24, Zimmer 204',
      vorbereitung: [
        'Personalausweis mitbringen',
        'Lebenslauf aktuell halten',
        'Vorstellungen zu angestrebter Tätigkeit formulieren',
        'Fragen zu Ihrem Anspruch gerne mitbringen'
      ],
      status: 'BESTAETIGT'
    }
  ],
  bescheide: [
    {
      id: 'BSC-001',
      typ: 'Vorläufiger Leistungsbescheid ALG I',
      datum: '15. November 2024',
      rechtlicheFassung: 'Gemäß § 137 Abs. 1 SGB III haben Sie ab dem 12.11.2024 Anspruch auf Arbeitslosengeld I, sofern die gesetzlichen Voraussetzungen nach §§ 137–142 SGB III vorliegen. Die Bewilligung erfolgt vorbehaltlich der vollständigen Prüfung der Anwartschaftszeit und der Bemessungsgrundlage. Dieser Bescheid ergeht unter dem Vorbehalt der Nachprüfung gemäß § 164 SGB III.',
      erklaerung: 'Sie erhalten voraussichtlich Arbeitslosengeld I, weil Sie in den letzten zweieinhalb Jahren mindestens 12 Monate sozialversicherungspflichtig beschäftigt waren. Wie hoch der genaue Betrag sein wird, steht noch nicht fest – dafür fehlen noch einige Dokumente.',
      entscheidung: 'Vorläufige Bewilligung von ALG I ab 12. November 2024',
      begruendung: 'Anwartschaftszeit vorläufig bestätigt. Bemessungsgrundlage noch offen (fehlende Unterlagen).',
      rechtsgrundlage: '§ 137 Abs. 1 SGB III, § 164 SGB III (Vorbehalt der Nachprüfung)',
      widerspruchsfristTage: 1,
      widerspruchsfristAblauf: '16. Dezember 2024'
    }
  ],
  timeline: [
    { id: 'E-001', typ: 'FALL_ANGELEGT', zeitstempel: '12.11.2024, 09:14', handelndeStelle: 'BUERGER', beschreibung: 'Fall angelegt', details: 'Antrag auf ALG I digital eingereicht. Fallnummer AV-2024-0042 vergeben.' },
    { id: 'E-002', typ: 'DOKUMENT_EINGEREICHT', zeitstempel: '12.11.2024, 09:18', handelndeStelle: 'BUERGER', beschreibung: 'Personalausweis hochgeladen', details: 'Dokument DOK-002 eingereicht und akzeptiert.' },
    { id: 'E-003', typ: 'STATUS_GEAENDERT', zeitstempel: '12.11.2024, 09:20', handelndeStelle: 'SYSTEM', beschreibung: 'Status geändert: ANGELEGT → EINGEGANGEN', details: 'Automatische Eingangsbestätigung generiert.' },
    { id: 'E-004', typ: 'DOKUMENT_ANGEFORDERT', zeitstempel: '13.11.2024, 11:30', handelndeStelle: 'SACHBEARBEITUNG', beschreibung: 'Arbeitgeberbescheinigung angefordert', details: 'Pflichtdokument gemäß § 312 SGB III.' },
    { id: 'E-005', typ: 'DOKUMENT_EINGEREICHT', zeitstempel: '14.11.2024, 16:42', handelndeStelle: 'BUERGER', beschreibung: 'Arbeitgeberbescheinigung hochgeladen', details: 'Dokument DOK-001 eingereicht, in Prüfung.' },
    { id: 'E-006', typ: 'BESCHEID_ERSTELLT', zeitstempel: '15.11.2024, 08:00', handelndeStelle: 'SACHBEARBEITUNG', beschreibung: 'Vorläufiger Leistungsbescheid erstellt', details: 'BSC-001 unter Vorbehalt der Nachprüfung.' },
    { id: 'E-007', typ: 'BESCHEID_ZUGESTELLT', zeitstempel: '15.11.2024, 08:05', handelndeStelle: 'SYSTEM', beschreibung: 'Vorläufiger Bescheid zugestellt', details: 'Digital zugestellt. Widerspruchsfrist beginnt.' },
    { id: 'E-008', typ: 'TERMIN_ZUGETEILT', zeitstempel: '15.11.2024, 09:00', handelndeStelle: 'SACHBEARBEITUNG', beschreibung: 'Erstgespräch terminiert', details: '03.12.2024, 10:00 Uhr, Schanzenstraße 24, Zimmer 204.' },
    { id: 'E-009', typ: 'STATUS_GEAENDERT', zeitstempel: '15.11.2024, 09:00', handelndeStelle: 'SYSTEM', beschreibung: 'Status geändert: EINGEGANGEN → IN_PRUEFUNG', details: 'Fallprüfung durch Sachbearbeitung begonnen.' },
    { id: 'E-010', typ: 'RUECKFRAGE_GESTELLT', zeitstempel: '19.11.2024, 14:17', handelndeStelle: 'SACHBEARBEITUNG', beschreibung: 'Rückfrage zur Arbeitgeberbescheinigung', details: 'Fehlendes Datum der Beschäftigungsaufnahme. Frist: 26.11.2024.' },
    { id: 'E-011', typ: 'STATUS_GEAENDERT', zeitstempel: '19.11.2024, 14:17', handelndeStelle: 'SYSTEM', beschreibung: 'Status geändert: IN_PRUEFUNG → RUECKFRAGE_OFFEN', details: 'Fall pausiert bis zur Beantwortung der Rückfrage.' }
  ]
};
