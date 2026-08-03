/**
 * Unternehmensgründung (UG) E2E Tests
 *
 * Testet die Gründungsakte UG-2024-0117 quer durch alle Tabs:
 * Übersicht, Behörden, Unterlagen, Rückfragen, Verlauf
 */

import { test, expect } from '@playwright/test';

// ─── Übersicht ────────────────────────────────────────────────────────────────

test.describe('UG – Übersicht', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung');
  });

  test('Seitenheader zeigt "Meine Gewerbeanmeldung"', async ({ page }) => {
    await expect(page.getByText('Meine Gewerbeanmeldung')).toBeVisible();
  });

  test('Gewerbebezeichnung ist sichtbar', async ({ page }) => {
    await expect(page.getByText('IT-Beratung und Softwareentwicklung')).toBeVisible();
  });

  test('Action-Banner erscheint bei offener Rückfrage', async ({ page }) => {
    const banner = page.locator('.action-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Jetzt handeln');
  });

  test('Direktlink zur Rückfrage im Banner vorhanden', async ({ page }) => {
    const link = page.getByRole('link', { name: /Frage jetzt beantworten/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/gruendung/rueckfragen');
  });

  test('Status-Chip zeigt Klartext (kein interner Code)', async ({ page }) => {
    await expect(page.getByText('RUECKFRAGE_AUSSTEHEND')).not.toBeVisible();
    await expect(page.getByText('Ihre Antwort wird erwartet')).toBeVisible();
  });

  test('Fortschrittsbalken mit Prozentangabe sichtbar', async ({ page }) => {
    await expect(page.getByText(/%/).first()).toBeVisible();
  });

  test('Vertikale Schritteliste mit "Sie sind hier" sichtbar', async ({ page }) => {
    await expect(page.getByText('In Bearbeitung').first()).toBeVisible();
    await expect(page.getByText('Sie sind hier').first()).toBeVisible();
  });

  test('Vier Schnellzugriff-Kacheln vorhanden', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Behörden/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Unterlagen/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Offene Fragen/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Verlauf/i }).first()).toBeVisible();
  });

  test('Fristen-Countdown offener Unterlagen auf Übersicht (Q-208)', async ({ page }) => {
    // DOK-03: Frist 2024-12-15 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 8 Tage (Parität AV Q-086)
    const block = page.getByTestId('dok-fristen-uebersicht');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: /Fristen offener Unterlagen/i })).toBeVisible();
    await expect(page.getByTestId('dok-frist-DOK-03')).toBeVisible();
    await expect(page.getByTestId('dok-frist-countdown-DOK-03')).toContainText(/noch 8 Tage/i);
    await expect(page.getByTestId('kachel-unterlagen')).toContainText(/noch 8 Tage/i);
    const cta = page.getByTestId('dok-fristen-cta');
    await expect(cta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    await cta.click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
  });

  test('Fristen-Countdown offener Rückfragen auf Übersicht (Q-210)', async ({ page }) => {
    // RQ-01: Frist 2024-12-10 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 3 Tage (Parität Q-208)
    const block = page.getByTestId('rq-fristen-uebersicht');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: /Fristen offener Rückfragen/i })).toBeVisible();
    await expect(page.getByTestId('rq-frist-RQ-01')).toBeVisible();
    await expect(page.getByTestId('rq-frist-RQ-01')).toContainText(/Finanzamt|Kleinunternehmer/i);
    await expect(page.getByTestId('rq-frist-countdown-RQ-01')).toContainText(/noch 3 Tage/i);
    await expect(page.getByTestId('kachel-fragen')).toContainText(/noch 3 Tage/i);
    const cta = page.getByTestId('rq-fristen-cta');
    await expect(cta).toHaveAttribute('href', '/gruendung/rueckfragen#rq-RQ-01');
    await cta.click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('Beteiligte Behörden-Übersicht sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('Finanzamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('IHK Musterregion').first()).toBeVisible();
  });

  test('6 Tabs in der Navigation vorhanden', async ({ page }) => {
    const tabs = page.locator('.tab-nav-item');
    await expect(tabs).toHaveCount(6);
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Hinweise' })).toBeVisible();
  });

  test('Behörden-Zeile mit offener Rückfrage verlinkt zur Frage', async ({ page }) => {
    const link = page.getByTestId('uebersicht-rq-link-BEH-02');
    await expect(link).toBeVisible();
    await expect(link).toContainText(/Offene Frage beantworten/i);
    await expect(link).toHaveAttribute('href', /\/gruendung\/rueckfragen#rq-/);
    await link.click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen/);
  });

  test('Behörden ohne offene Rückfrage haben keinen Frage-Link', async ({ page }) => {
    await expect(page.getByTestId('uebersicht-rq-link-BEH-01')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-behoerde-BEH-01')).toBeVisible();
  });

  test('Nächster Schritt und offene Aufgaben mit Links sichtbar', async ({ page }) => {
    const block = page.getByTestId('uebersicht-naechste-schritte');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: 'Was als Nächstes?' })).toBeVisible();

    const schritt = page.getByTestId('uebersicht-naechster-schritt');
    await expect(schritt).toBeVisible();
    await expect(schritt).toContainText(/Rückfrage des Finanzamts|Kleinunternehmerregelung|Rückfragen/i);

    const cta = page.getByTestId('uebersicht-naechster-schritt-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/gruendung\/rueckfragen#rq-/);
    await expect(cta).toContainText(/Rückfrage beantworten/i);
    // Hilfstext Primär-CTA: gleicher RQ-Frist/Konsequenz-Wortlaut wie Fairness-CTA
    const schrittHint = page.getByTestId('uebersicht-naechster-schritt-cta-hint');
    await expect(schrittHint).toBeVisible();
    await expect(schrittHint).toContainText(/Antwortfrist/i);
    await expect(schrittHint).toContainText(/10\.12\.2024|noch 3 Tage/i);
    await expect(schrittHint).toContainText(/Steuernummer|steuerliche Erfassung/i);
    await expect(schrittHint).toContainText(/Rückfragen/i);

    const aufgaben = page.getByTestId('uebersicht-offene-aufgaben');
    await expect(aufgaben).toBeVisible();
    await expect(page.getByTestId('uebersicht-aufgabe-0')).toBeVisible();
    await expect(page.getByTestId('uebersicht-aufgabe-link-rq-RQ-01')).toHaveAttribute(
      'href',
      '/gruendung/rueckfragen#rq-RQ-01'
    );
    await expect(page.getByTestId('uebersicht-aufgabe-link-dok-DOK-03')).toHaveAttribute(
      'href',
      '/gruendung/dokumente#dok-DOK-03'
    );
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toHaveAttribute(
      'href',
      '/gruendung/behoerden#beh-BEH-04'
    );
  });

  test('CTA Nächster Schritt führt zur offenen Rückfrage', async ({ page }) => {
    await page.getByTestId('uebersicht-naechster-schritt-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('Aufgaben-Link Unterlagen führt zur Dokumentenkarte', async ({ page }) => {
    await page.getByTestId('uebersicht-aufgabe-link-dok-DOK-03').click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
  });

  test('Ohne Session-Upload keine Upload-Quittung auf Übersicht', async ({ page }) => {
    await expect(page.getByTestId('upload-quittung')).toHaveCount(0);
  });

  test('Nach Session-Upload: Übersicht zeigt Quittung und Vollständigkeit', async ({ page }) => {
    // US-UG-001/003: nach Upload muss klar sein, was einging; Mock hat nur DOK-03 offen
    // Kein page.goto nach State-Interaktion (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    const quittung = page.getByTestId('upload-quittung');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('upload-quittung-titel')).toHaveText('Unterlage eingegangen');
    await expect(page.getByTestId('upload-quittung-item-DOK-03')).toContainText(
      /Nachweis beruflicher Qualifikation/i
    );
    await expect(page.getByTestId('upload-quittung-item-DOK-03')).toContainText(
      /eingereicht am 07\.\s*12\.2024|eingereicht am 07\.12\.2024/i
    );
    // Mock: nur eine offene Unterlage → Vollständigkeit, keine „nächste“
    await expect(page.getByTestId('upload-quittung-vollstaendig')).toContainText(
      /Alle angeforderten Unterlagen liegen vor/i
    );
    await expect(page.getByTestId('upload-quittung-naechste')).toHaveCount(0);
  });

  test('Upload-Quittung bleibt nach Tab-Wechsel auf Übersicht (kein page.goto)', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await goUgTab(page, 'Übersicht', /\/gruendung$/);
    await expect(page.getByTestId('upload-quittung')).toBeVisible();

    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);
    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    await expect(page.getByTestId('upload-quittung')).toBeVisible();
    await expect(page.getByTestId('upload-quittung-item-DOK-03')).toBeVisible();
    await expect(page.getByTestId('upload-quittung-vollstaendig')).toBeVisible();
  });

  test('Übersicht Upload-Quittung: Verlauf-Tiefenlink zum Session-Upload (Q-195)', async ({ page }) => {
    // US-UG-001/003/005: Quittung pro Session-Upload mit Tiefenlink #ere-UG-DEMO-DOK-…
    // Parität AV Q-194 — kein page.goto nach State (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Übersicht', /\/gruendung$/);
    await expect(page.getByTestId('upload-quittung')).toBeVisible();

    const verlaufLink = page.getByTestId('upload-quittung-verlauf-DOK-03');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/gruendung/verlauf#ere-UG-DEMO-DOK-DOK-03'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-UG-DEMO-DOK-DOK-03/);

    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-DOK-DOK-03');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-upload', 'true');
    await expect(page.getByTestId('verlauf-session-upload-badge-UG-DEMO-DOK-DOK-03')).toContainText(
      /Ihr Upload/i
    );
  });

  test('Nach Beantworten entfällt Rückfrage-Aufgabe auf Übersicht', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    await expect(page.getByTestId('uebersicht-naechste-schritte')).toBeVisible();
    await expect(page.getByTestId('uebersicht-aufgabe-link-rq-RQ-01')).toHaveCount(0);
    // Unterlagen und BG bleiben als offene Aufgaben
    await expect(page.getByTestId('uebersicht-aufgabe-link-dok-DOK-03')).toBeVisible();
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toBeVisible();
    // Nächster Schritt wechselt von Rückfrage zu Unterlagen; Hilfstext session-sensitiv
    const cta = page.getByTestId('uebersicht-naechster-schritt-cta');
    await expect(cta).toHaveAttribute('href', /\/gruendung\/dokumente#dok-/);
    const schrittHint = page.getByTestId('uebersicht-naechster-schritt-cta-hint');
    await expect(schrittHint).toBeVisible();
    await expect(schrittHint).toContainText(/Keine offene Rückfrage mehr/i);
    await expect(schrittHint).toContainText(/Unterlage/i);
    await expect(schrittHint).not.toContainText(/Antwortfrist/i);
  });

  test('Q-199: Übersicht RQ-Quittung mit Verlauf-Tiefenlink', async ({ page }) => {
    // US-UG-004/005: nach Session-Antwort Quittung auf Übersicht + #ere-UG-DEMO-RQ-…
    // Parität AV Q-198 — kein page.goto nach State (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-antwort-quittung-RQ-01')).toBeVisible();

    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    const quittung = page.getByTestId('rq-quittung');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('rq-quittung-titel')).toHaveText('Antwort übermittelt');
    await expect(page.getByTestId('rq-quittung-item-RQ-01')).toContainText(
      /Kleinunternehmerregelung|§ 19 UStG/i
    );
    await expect(page.getByTestId('rq-quittung-item-RQ-01')).toContainText(
      /beantwortet am 07\.\s*12\.2024|beantwortet am 07\.12\.2024/i
    );

    const verlaufLink = page.getByTestId('rq-quittung-verlauf-RQ-01');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/gruendung/verlauf#ere-UG-DEMO-RQ-RQ-01'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await expect(page.getByTestId('rq-quittung-fragen-cta')).toHaveAttribute(
      'href',
      '/gruendung/rueckfragen'
    );
    await expect(page.getByTestId('rq-quittung-unterlagen-cta')).toHaveAttribute(
      'href',
      '/gruendung/dokumente#dok-DOK-03'
    );

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-UG-DEMO-RQ-RQ-01/);
    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-RQ-RQ-01');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(page.getByTestId('verlauf-session-antwort-badge-UG-DEMO-RQ-RQ-01')).toContainText(
      /Ihre Antwort/i
    );
  });

  test('Nach RQ + Upload: Primär-CTA wechselt zu BG-Hinweis (gruendung-rules)', async ({ page }) => {
    // Bürger-Reihenfolge in naechsterSchrittZiel: RQ → Unterlagen → BG
    // Kein page.goto nach State (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    const cta = page.getByTestId('uebersicht-naechster-schritt-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/gruendung\/behoerden#beh-BEH-04/);
    await expect(cta).toContainText(/BG-Hinweis ansehen/i);
    const schrittHint = page.getByTestId('uebersicht-naechster-schritt-cta-hint');
    await expect(schrittHint).toBeVisible();
    await expect(schrittHint).toContainText(/Keine offene Rückfrage mehr/i);
    await expect(schrittHint).toContainText(/BG-Anmeldung|Berufsgenossenschaft|Behördenkarte/i);
    // RQ- und Unterlagen-Aufgaben entfallen; BG bleibt
    await expect(page.getByTestId('uebersicht-aufgabe-link-rq-RQ-01')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-aufgabe-link-dok-DOK-03')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toBeVisible();
  });

  test('Nach RQ + Upload + BG: Primär-CTA fällt auf Steuernummer durch (Fairness-Fallthrough)', async ({
    page,
  }) => {
    // naechsterSchrittZiel: RQ → Unterlagen → BG → fairnessSignalZiel (Steuernummer)
    // Kein page.goto nach State (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);
    await expect(page.getByTestId('behoerde-bg-demo-aktion')).toBeVisible();
    await page.getByTestId('behoerde-bg-erledigt-btn').click();
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Abgeschlossen/i);
    await expect(page.getByTestId('behoerde-schritt-VS-07')).toContainText(/Erledigt/i);

    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    // Primär-CTA: Fairness-Fallthrough → Steuernummer (VS-05 IN_BEARBEITUNG)
    const cta = page.getByTestId('uebersicht-naechster-schritt-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/gruendung\/behoerden#beh-BEH-02/);
    await expect(cta).toContainText(/Steuernummer-Stand ansehen/i);
    const schrittHint = page.getByTestId('uebersicht-naechster-schritt-cta-hint');
    await expect(schrittHint).toBeVisible();
    await expect(schrittHint).toContainText(/in Bearbeitung/i);
    await expect(schrittHint).toContainText(/Steuernummer|Behördenkarte/i);
    await expect(schrittHint).not.toContainText(/BG-Anmeldung/i);

    // BG-Aufgabe und Fairness-BG-CTA entfallen; Steuernummer + Betriebsdatum bleiben
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-fairness-cta-beh-BEH-04')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-fairness-UG-BG-ANMELDUNG')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02')).toBeVisible();
    await expect(page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02')).toContainText(
      /Steuernummer-Stand ansehen/i
    );
    await expect(page.getByTestId('uebersicht-fairness-cta-betriebsdatum')).toBeVisible();
    // Betriebsdatum-Signal: nach RQ + BG keine RQ-Priorität; Steuernummer/offene Punkte
    const betriebsSignal = page.getByTestId('uebersicht-fairness-UG-BETRIEBSDATUM');
    await expect(betriebsSignal).toContainText(/Steuernummer-Vergabe läuft|Rückfrage des Finanzamts ist beantwortet/i);
    await expect(betriebsSignal).not.toContainText(/zuerst Rückfrage Finanzamt beantworten/i);
  });

  test('Q-421: Nach RQ+Upload+BG kein hängender Action-Banner auf Übersicht', async ({ page }) => {
    // Regression: erledigte RQ/Unterlage/BG dürfen keinen „Jetzt handeln“-Banner zurücklassen.
    // Fairness-CTAs (z. B. Steuernummer) bleiben erlaubt — kein page.goto (DEC-012).
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);
    await page.getByTestId('behoerde-bg-erledigt-btn').click();
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();

    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    // Kein Action-Banner für offene Rückfrage
    await expect(page.locator('.action-banner')).toHaveCount(0);
    await expect(page.getByText(/Jetzt handeln/i)).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Frage jetzt beantworten/i })).toHaveCount(0);

    // Erledigte Handlungsstränge nicht mehr als offene Aufgaben
    await expect(page.getByTestId('uebersicht-aufgabe-link-rq-RQ-01')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-aufgabe-link-dok-DOK-03')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toHaveCount(0);

    // Status-Ruhe: Antwort erwartet → wird bearbeitet; Quittungen sichtbar
    await expect(page.getByText('Ihre Antwort wird erwartet')).not.toBeVisible();
    await expect(page.getByText('Wird bearbeitet').first()).toBeVisible();
    await expect(page.getByTestId('rq-quittung')).toBeVisible();
    await expect(page.getByTestId('upload-quittung')).toBeVisible();
  });

  test('Fairness-Kurzblock mit Link zu Hinweise', async ({ page }) => {
    const block = page.getByTestId('uebersicht-fairness-kurzblock');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: 'Hinweise zu Ihrem Verfahren' })).toBeVisible();
    await expect(block.getByText(/Rückfrage offen/i).first()).toBeVisible();
    const link = page.getByTestId('uebersicht-fairness-hinweise-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/gruendung/hinweise');
    await link.click();
    await expect(page).toHaveURL('/gruendung/hinweise');
    await expect(page.getByRole('heading', { name: 'Hinweise zur Verfahrenslage' })).toBeVisible();
  });

  test('Fairness RQ-Signal: Tiefenlink Im Verlauf ansehen (ERE-06)', async ({ page }) => {
    // US-UG-005 Transparenz: Fairness → passendes Audit-Ereignis
    const verlauf = page.getByTestId('uebersicht-fairness-verlauf-ERE-06');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/gruendung/verlauf#ere-ERE-06');
    await expect(verlauf).toContainText(/Im Verlauf ansehen/i);
    await verlauf.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-ERE-06/);
    const card = page.getByTestId('verlauf-ereignis-ERE-06');
    await expect(card).toBeVisible();
    await expect(card).toContainText(/Rückfrage gestellt/i);
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

  test('Fairness-Kurzblock zeigt nur RELEVANT und HINWEIS, nicht INFO', async ({ page }) => {
    const block = page.getByTestId('uebersicht-fairness-kurzblock');
    await expect(block).toBeVisible();

    // INFO-Signal „parallele Behörden“ darf auf der Übersicht nicht erscheinen
    await expect(page.getByTestId('uebersicht-fairness-UG-PARALLELE-BEHOERDEN')).toHaveCount(0);
    await expect(block.getByText(/Behördenverfahren laufen parallel/i)).toHaveCount(0);

    // Handlungsrelevante Signale bleiben sichtbar (Mock: Rückfrage RELEVANT, mehrere HINWEIS)
    const liste = page.getByTestId('uebersicht-fairness-liste');
    const items = liste.locator('[data-prioritaet]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const prio = await items.nth(i).getAttribute('data-prioritaet');
      expect(['RELEVANT', 'HINWEIS']).toContain(prio);
    }

    // Link weist auf weitere (INFO-)Hinweise hin
    const link = page.getByTestId('uebersicht-fairness-hinweise-link');
    await expect(link).toContainText(/weitere Hinweis/i);
  });

  test('Fairness-Einträge haben Kurz-CTAs für Rückfrage, Unterlagen, BG, Steuernummer und Betriebsdatum', async ({ page }) => {
    const block = page.getByTestId('uebersicht-fairness-kurzblock');
    await expect(block).toBeVisible();

    const rqCta = page.getByTestId('uebersicht-fairness-cta-rq-RQ-01');
    await expect(rqCta).toBeVisible();
    await expect(rqCta).toHaveAttribute('href', '/gruendung/rueckfragen#rq-RQ-01');
    await expect(rqCta).toContainText(/Frage beantworten/i);
    // Hilfstext RQ-CTA: Frist + kurze Konsequenz (Steuernummer/Erfassung)
    const rqHint = page.getByTestId('uebersicht-fairness-cta-hint-rq-RQ-01');
    await expect(rqHint).toBeVisible();
    await expect(rqHint).toContainText(/Antwortfrist/i);
    await expect(rqHint).toContainText(/10\.12\.2024|noch 3 Tage/i);
    await expect(rqHint).toContainText(/Steuernummer|steuerliche Erfassung/i);
    await expect(rqHint).toContainText(/Rückfragen/i);

    const dokCta = page.getByTestId('uebersicht-fairness-cta-dok-DOK-03');
    await expect(dokCta).toBeVisible();
    await expect(dokCta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    await expect(dokCta).toContainText(/Zu den Unterlagen/i);
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const dokHint = page.getByTestId('uebersicht-fairness-cta-hint-dok-DOK-03');
    await expect(dokHint).toBeVisible();
    await expect(dokHint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(dokHint).toContainText(/Unterlagen/i);

    const bgCta = page.getByTestId('uebersicht-fairness-cta-beh-BEH-04');
    await expect(bgCta).toBeVisible();
    await expect(bgCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-04');
    await expect(bgCta).toContainText(/Zur Behördenkarte/i);
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const bgHint = page.getByTestId('uebersicht-fairness-cta-hint-beh-BEH-04');
    await expect(bgHint).toBeVisible();
    await expect(bgHint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(bgHint).toContainText(/BG-Anmeldung|außerhalb von Open State/i);

    const steuernummerCta = page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02');
    await expect(steuernummerCta).toBeVisible();
    await expect(steuernummerCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-02');
    await expect(steuernummerCta).toContainText(/Zum Finanzamt/i);
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const steuernummerHint = page.getByTestId('uebersicht-fairness-cta-hint-steuernummer-BEH-02');
    await expect(steuernummerHint).toBeVisible();
    await expect(steuernummerHint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(steuernummerHint).toContainText(/Behördenkarte/i);

    const betriebsdatumCta = page.getByTestId('uebersicht-fairness-cta-betriebsdatum');
    await expect(betriebsdatumCta).toBeVisible();
    await expect(betriebsdatumCta).toHaveAttribute('href', '/gruendung#verfahrensstatus');
    await expect(betriebsdatumCta).toContainText(/Zum Verfahrensstatus/i);
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const betriebsHint = page.getByTestId('uebersicht-fairness-cta-hint-betriebsdatum');
    await expect(betriebsHint).toBeVisible();
    await expect(betriebsHint).toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('Übersicht Fairness: RQ-Countdown-Chip + CTA (Q-220)', async ({ page }) => {
    // US-UG-004: Parität Hinweise Q-218 + AV Übersicht Q-215
    // RQ-01 Frist 2024-12-10 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 3 Tage
    await page.goto('/gruendung');
    const block = page.getByTestId('uebersicht-fairness-UG-RQ-RQ-01-FRIST');
    await expect(block).toBeVisible();
    await expect(block).toContainText(/noch 3 Tage/i);
    const chip = page.getByTestId('uebersicht-fairness-rq-countdown-UG-RQ-RQ-01-FRIST');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 3 Tage/i);
    const rqCta = page.getByTestId('uebersicht-fairness-cta-rq-RQ-01');
    await expect(rqCta).toHaveAttribute('href', '/gruendung/rueckfragen#rq-RQ-01');
    await rqCta.click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('Übersicht Fairness: UNTERLAGE-Countdown-Chip + CTA (Q-221)', async ({ page }) => {
    // US-UG-003: Parität Hinweise Q-219 + AV Übersicht Q-217
    // DOK-03 Frist 2024-12-15 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 8 Tage
    await page.goto('/gruendung');
    const block = page.getByTestId('uebersicht-fairness-UG-UNTERLAGEN-FEHLEND');
    await expect(block).toBeVisible();
    await expect(block).toContainText(/noch 8 Tage/i);
    const chip = page.getByTestId(
      'uebersicht-fairness-unterlage-countdown-UG-UNTERLAGEN-FEHLEND'
    );
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 8 Tage/i);
    const dokCta = page.getByTestId('uebersicht-fairness-cta-dok-DOK-03');
    await expect(dokCta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    await dokCta.click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
  });

  test('Fairness-CTA Rückfrage führt zur Rückfragen-Karte', async ({ page }) => {
    await page.getByTestId('uebersicht-fairness-cta-rq-RQ-01').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('Fairness-CTA Unterlagen führt zur Dokumentenkarte', async ({ page }) => {
    await page.getByTestId('uebersicht-fairness-cta-dok-DOK-03').click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
  });

  test('Fairness-CTA Steuernummer führt zur Finanzamt-Karte', async ({ page }) => {
    await page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden#beh-BEH-02/);
    await expect(page.locator('#beh-BEH-02')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-02')).toContainText(/Finanzamt/i);
  });

  test('Fairness-CTA Betriebsdatum führt zum Statusblock der Übersicht', async ({ page }) => {
    await page.getByTestId('uebersicht-fairness-cta-betriebsdatum').click();
    await expect(page).toHaveURL(/\/gruendung#verfahrensstatus/);
    await expect(page.locator('#verfahrensstatus')).toBeVisible();
    await expect(page.getByTestId('uebersicht-verfahrensstatus')).toContainText(
      /IT-Beratung|Verfahrensfortschritt|Sie sind hier/i
    );
  });

  test('Nach Beantworten entfällt Fairness-CTA Rückfrage', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Übersicht', /\/gruendung$/);

    await expect(page.getByTestId('uebersicht-fairness-cta-rq-RQ-01')).toHaveCount(0);
    // Unterlagen-, BG-, Steuernummer- und Betriebsdatum-CTAs bleiben
    await expect(page.getByTestId('uebersicht-fairness-cta-dok-DOK-03')).toBeVisible();
    await expect(page.getByTestId('uebersicht-fairness-cta-beh-BEH-04')).toBeVisible();
    await expect(page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02')).toBeVisible();
    await expect(page.getByTestId('uebersicht-fairness-cta-betriebsdatum')).toBeVisible();
    // Steuernummer-Signal wechselt auf „in Bearbeitung“; CTA-Text differenziert
    await expect(page.getByTestId('uebersicht-fairness-UG-STEUERNUMMER-FEHLT')).toContainText(
      /Steuernummer in Bearbeitung/i
    );
    await expect(page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02')).toContainText(
      /Steuernummer-Stand ansehen/i
    );
    await expect(page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02')).not.toContainText(
      /^Zum Finanzamt/i
    );
    // Steuernummer-CTA-Hilfstext nach RQ-Antwort: Vergabe in Bearbeitung, keine RQ-Priorität
    const steuernummerHint = page.getByTestId('uebersicht-fairness-cta-hint-steuernummer-BEH-02');
    await expect(steuernummerHint).toBeVisible();
    await expect(steuernummerHint).toContainText(/in Bearbeitung/i);
    await expect(steuernummerHint).toContainText(/Behördenkarte/i);
    await expect(steuernummerHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
    // Betriebsdatum-Signal: keine „zuerst Rückfrage beantworten“-Anweisung mehr
    const betriebsSignal = page.getByTestId('uebersicht-fairness-UG-BETRIEBSDATUM');
    await expect(betriebsSignal).toContainText(/Rückfrage des Finanzamts ist beantwortet/i);
    await expect(betriebsSignal).not.toContainText(/zuerst Rückfrage Finanzamt beantworten/i);
    // CTA-Hilfstext nach RQ-Antwort: Fokus Steuernummer/offene Punkte, nicht RQ-Priorität
    const betriebsHint = page.getByTestId('uebersicht-fairness-cta-hint-betriebsdatum');
    await expect(betriebsHint).toBeVisible();
    await expect(betriebsHint).toContainText(/Rückfrage beantwortet/i);
    await expect(betriebsHint).toContainText(/Steuernummer-Vergabe|offene Punkte/i);
    await expect(betriebsHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
    // BG-CTA-Hilfstext nach RQ-Antwort: kein RQ-Vorrang, Fokus BG-Anmeldung
    const bgHint = page.getByTestId('uebersicht-fairness-cta-hint-beh-BEH-04');
    await expect(bgHint).toBeVisible();
    await expect(bgHint).toContainText(/Keine offene Rückfrage mehr|BG-Anmeldung/i);
    await expect(bgHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
    // Unterlagen-CTA-Hilfstext nach RQ-Antwort: Nachreichung, kein RQ-Vorrang
    const dokHint = page.getByTestId('uebersicht-fairness-cta-hint-dok-DOK-03');
    await expect(dokHint).toBeVisible();
    await expect(dokHint).toContainText(/Keine offene Rückfrage mehr|nachreichen/i);
    await expect(dokHint).toContainText(/Unterlagen/i);
    await expect(dokHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('INFO-Signal parallele Behörden erscheint auf Hinweise-Seite', async ({ page }) => {
    await page.goto('/gruendung/hinweise');
    await expect(page.getByText(/Behördenverfahren laufen parallel/i).first()).toBeVisible();
  });

  test('Tab "Übersicht" ist aktiv hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Übersicht');
  });

  test('Kein Developer-Jargon sichtbar (keine Story-Badges)', async ({ page }) => {
    await expect(page.getByText('US-UG-001')).not.toBeVisible();
    await expect(page.getByText('Story geplant')).not.toBeVisible();
  });

  test('Demo-Hinweis sichtbar', async ({ page }) => {
    await expect(page.getByText(/Alle Daten sind fiktiv/).first()).toBeVisible();
  });

});

// ─── Tab-Navigation ───────────────────────────────────────────────────────────

test.describe('UG – Tab-Navigation', () => {

  test('Navigation zu Behörden', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Behörden' }).click();
    await expect(page).toHaveURL('/gruendung/behoerden');
    await expect(page.locator('.tab-nav-item.active')).toContainText('Behörden');
  });

  test('Navigation zu Unterlagen', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' }).click();
    await expect(page).toHaveURL('/gruendung/dokumente');
    await expect(page.locator('.tab-nav-item.active')).toContainText('Unterlagen');
  });

  test('Navigation zu Fragen', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Fragen' }).click();
    await expect(page).toHaveURL('/gruendung/rueckfragen');
  });

  test('Navigation zu Hinweise', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Hinweise' }).click();
    await expect(page).toHaveURL('/gruendung/hinweise');
    await expect(page.locator('.tab-nav-item.active')).toContainText('Hinweise');
    await expect(page.getByRole('heading', { name: 'Hinweise zur Verfahrenslage' })).toBeVisible();
  });

  test('Navigation zu Verlauf', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Verlauf' }).click();
    await expect(page).toHaveURL('/gruendung/verlauf');
  });

  test('Navigation zurück zur Startseite', async ({ page }) => {
    await page.goto('/gruendung');
    await page.getByRole('link', { name: /Startseite/i }).click();
    await expect(page).toHaveURL('/');
  });

});

// ─── Skip-Link (Q-472) ────────────────────────────────────────────────────────

test.describe('UG Skip-Link – Übersicht und Hinweise (Q-472)', () => {
  test('Skip-Link Fokus auf /gruendung und /gruendung/hinweise', async ({ page }) => {
    // WCAG 2.4.1: Root-SkipLink + UG-Layout main#main-content (tabIndex=-1)
    // Parität Q-451 (Fall) / Q-471 (Kita) — kein Session-State
    async function assertSkipToMain(route: string, h1: RegExp) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: h1 }).first()).toBeVisible();

      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);

      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: /Zum Inhalt springen/i });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main-content');
      await skip.press('Enter');
      await expect(main).toBeFocused();
    }

    await assertSkipToMain('/gruendung', /IT-Beratung und Softwareentwicklung/i);
    await assertSkipToMain('/gruendung/hinweise', /Hinweise zur Verfahrenslage/i);
  });
});

// ─── Skip-Link (Q-531) ────────────────────────────────────────────────────────

test.describe('UG Skip-Link – Dokumente und Behörden (Q-531)', () => {
  test('Skip-Link Fokus auf /gruendung/dokumente und /gruendung/behoerden', async ({ page }) => {
    // WCAG 2.4.1: Root-SkipLink + UG-Layout main#main-content (tabIndex=-1); Parität Q-472
    async function assertSkipToMain(route: string, h1: RegExp) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: h1 }).first()).toBeVisible();

      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);

      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: /Zum Inhalt springen/i });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main-content');
      await skip.press('Enter');
      await expect(main).toBeFocused();
    }

    await assertSkipToMain('/gruendung/dokumente', /Ihre Unterlagen/i);
    await assertSkipToMain('/gruendung/behoerden', /Behörden & Verfahrensschritte/i);
  });
});

// ─── Keyboard-Smoke Tabs (Q-490) ──────────────────────────────────────────────

test.describe('UG Keyboard-Smoke – Tabs (Q-490)', () => {
  test('Tabs per Tastatur fokussierbar und mit Enter aktivierbar', async ({ page }) => {
    // Parität AV Q-482: role=tablist/tab, Fokus sichtbar, Enter-Navigation
    await page.goto('/gruendung');

    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(6);

    const uebersicht = tablist.getByRole('tab', { name: /^Übersicht$/i });
    await uebersicht.focus();
    await expect(uebersicht).toBeFocused();
    await expect(page.locator(':focus')).toBeVisible();
    await expect(uebersicht).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Tab');
    const behoerden = tablist.getByRole('tab', { name: /^Behörden$/i });
    await expect(behoerden).toBeFocused();
    await expect(page.locator(':focus')).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/gruendung\/behoerden/);
    await expect(behoerden).toHaveAttribute('aria-selected', 'true');
    await expect(
      page.getByRole('heading', { name: 'Behörden & Verfahrensschritte' })
    ).toBeVisible();

    const fragen = page.getByRole('tablist').getByRole('tab', { name: /^Fragen$/i });
    await fragen.focus();
    await expect(fragen).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen/);
    await expect(fragen).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: /Rückfragen der Behörden/i })).toBeVisible();

    const hinweise = page.getByRole('tablist').getByRole('tab', { name: /^Hinweise$/i });
    await hinweise.focus();
    await expect(hinweise).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/gruendung\/hinweise/);
    await expect(hinweise).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: /Hinweise zur Verfahrenslage/i })).toBeVisible();
  });
});

// ─── Behörden ─────────────────────────────────────────────────────────────────

test.describe('UG – Behörden & Verfahrensschritte', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/behoerden');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Behörden & Verfahrensschritte' })).toBeVisible();
  });

  test('Alle 4 Behörden sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('Finanzamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('IHK Musterregion').first()).toBeVisible();
    await expect(page.getByText(/BG ETEM/).first()).toBeVisible();
  });

  test('Q-452: Behördenkarten und BG-Demo-Button zugängliche Namen/Labels', async ({ page }) => {
    // Karten: aria-labelledby → h2; BG-Button: sichtbarer Name + aria-label
    const cards = page.locator('[data-testid^="behoerde-karte-"]');
    await expect(cards).toHaveCount(4);

    const expectedTitles = [
      /Gewerbeamt/i,
      /Finanzamt/i,
      /IHK/i,
      /Berufsgenossenschaft|BG ETEM/i,
    ];

    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i);
      await expect(card).toBeVisible();
      const labelledBy = await card.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const heading = page.locator(`#${labelledBy}`);
      await expect(heading).toBeVisible();
      await expect(heading).toHaveRole('heading', { level: 2 });
      const title = (await heading.textContent())?.trim() ?? '';
      expect(title.length).toBeGreaterThan(2);
      expect(expectedTitles.some(re => re.test(title))).toBeTruthy();
    }

    // Explizite h2-Rollen für Screenreader-Navigation
    await expect(page.getByRole('heading', { level: 2, name: /Gewerbeamt/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Finanzamt/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /IHK/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /Berufsgenossenschaft|BG ETEM/i })
    ).toBeVisible();

    const bgBtn = page.getByTestId('behoerde-bg-erledigt-btn');
    await expect(bgBtn).toBeVisible();
    await expect(bgBtn).toHaveAttribute(
      'aria-label',
      /BG-Anmeldung in der Demo als erledigt markieren/i
    );
    // Zugänglicher Name (aria-label hat Vorrang) und findbar per role
    await expect(bgBtn).toHaveAccessibleName(/BG-Anmeldung in der Demo als erledigt markieren/i);
    await expect(
      page.getByRole('button', { name: /BG-Anmeldung in der Demo als erledigt markieren/i })
    ).toBeVisible();
    // Sichtbarer Button-Text bleibt verständlich
    await expect(bgBtn).toContainText(/Anmeldung als erledigt markieren/i);
  });

  test('Verfahrensschritte mit Rechtsgrundlagen sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeanmeldung einreichen')).toBeVisible();
    await expect(page.getByText(/§ 14 GewO/).first()).toBeVisible();
  });

  test('Status-Chips für Behörden sichtbar', async ({ page }) => {
    await expect(page.locator('.status-chip').first()).toBeVisible();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RUECKFRAGE_OFFEN')).not.toBeVisible();
    await expect(page.getByText('NICHT_GESTARTET')).not.toBeVisible();
  });

  test('Aktiver Tab "Behörden" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Behörden');
  });

  test('CTA zur offenen Rückfrage des Finanzamts sichtbar', async ({ page }) => {
    const cta = page.getByTestId('behoerde-rueckfrage-cta-BEH-02');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Offene Rückfrage dieser Behörde');
    await expect(cta).toContainText('Kleinunternehmerregelung');
    const link = cta.getByRole('link', { name: /Frage beantworten|Offene Rückfrage von Finanzamt/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/gruendung\/rueckfragen#rq-RQ-01/);
  });

  test('CTA führt zur Rückfragen-Seite mit Anker', async ({ page }) => {
    const cta = page.getByTestId('behoerde-rueckfrage-cta-BEH-02');
    await cta.getByRole('link', { name: /Frage beantworten|Offene Rückfrage von Finanzamt/i }).click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rückfragen der Behörden' })).toBeVisible();
  });

  test('Keine CTA bei Behörden ohne offene Rückfrage', async ({ page }) => {
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-01')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-03')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-04')).toHaveCount(0);
  });

  test('BG-Karte: Demo-Aktion Anmeldung als erledigt markieren', async ({ page }) => {
    const aktion = page.getByTestId('behoerde-bg-demo-aktion');
    await expect(aktion).toBeVisible();
    await expect(aktion).toContainText(/außerhalb von Open State/i);
    const btn = page.getByTestId('behoerde-bg-erledigt-btn');
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();
    await expect(page.getByTestId('behoerde-bg-demo-aktion')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Abgeschlossen/i);
    await expect(page.getByTestId('behoerde-schritt-VS-07')).toContainText(/Erledigt/i);
    // Session bleibt nach Tab-Nav (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Verlauf', /\/gruendung\/verlauf/);
    await expect(page.getByText(/BG-Anmeldung als erledigt markiert/i).first()).toBeVisible();
    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();
  });

  test('Verfahrensschritt VS-04 hat Link zur offenen Rückfrage', async ({ page }) => {
    const schritt = page.getByTestId('behoerde-schritt-VS-04');
    await expect(schritt).toBeVisible();
    await expect(schritt).toContainText(/Kleinunternehmerregelung/i);
    const link = page.getByTestId('behoerde-schritt-rq-link-VS-04');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/gruendung/rueckfragen#rq-RQ-01');
    await expect(link).toContainText(/Zur Rückfrage/i);
  });

  test('VS-04-Link führt zur Rückfragen-Karte', async ({ page }) => {
    await page.getByTestId('behoerde-schritt-rq-link-VS-04').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rückfragen der Behörden' })).toBeVisible();
  });

  test('Keine Schritt-Rückfrage-Links bei erledigten oder unbezogenen Schritten', async ({ page }) => {
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-01')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-02')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-03')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-05')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-06')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-07')).toHaveCount(0);
  });

  test('Nach Beantworten entfällt VS-04-Link und Behörden-CTA', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-04')).toBeVisible();
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-02')).toBeVisible();

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);

    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-04')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-02')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-schritt-VS-04')).toBeVisible();
  });

  test('Nach Beantworten ist VS-04 als erledigt markiert', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    const schritt = page.getByTestId('behoerde-schritt-VS-04');
    await expect(schritt).toBeVisible();
    await expect(schritt).toContainText(/In Bearbeitung/i);
    await expect(schritt).not.toContainText(/Erledigt am/i);

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);

    const vs04 = page.getByTestId('behoerde-schritt-VS-04');
    await expect(vs04).toBeVisible();
    await expect(vs04.getByText('Erledigt', { exact: true })).toBeVisible();
    await expect(vs04).toContainText(/Erledigt am/);
    await expect(vs04).toContainText(/Rückfrage beantwortet/i);
    // VS-05 startet als nächster Finanzamt-Schritt
    await expect(page.getByTestId('behoerde-schritt-VS-05')).toContainText(/In Bearbeitung/i);
    // Finanzamt-Zähler: 2 von 3 Schritten erledigt (VS-03, VS-04)
    await expect(page.getByTestId('behoerde-karte-BEH-02')).toContainText(/2\/3 Schritte erledigt/);
  });

  test('Nach Beantworten startet VS-05 Steuernummer in Bearbeitung', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    const vs05 = page.getByTestId('behoerde-schritt-VS-05');
    await expect(vs05).toBeVisible();
    await expect(vs05).toContainText(/Ausstehend/i);
    await expect(vs05).toContainText(/Steuernummer/i);

    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);

    const gestartet = page.getByTestId('behoerde-schritt-VS-05');
    await expect(gestartet).toBeVisible();
    await expect(gestartet.getByText('In Bearbeitung', { exact: true })).toBeVisible();
    await expect(gestartet).toContainText(/Steuernummer/i);
    // VS-04 bleibt erledigt; kein Rückfrage-Link mehr
    await expect(page.getByTestId('behoerde-schritt-VS-04').getByText('Erledigt', { exact: true })).toBeVisible();
    await expect(page.getByTestId('behoerde-schritt-rq-link-VS-04')).toHaveCount(0);
  });

  test('Verlauf zeigt erledigten Rückfrage-Schritt und gestarteten Folgeschritt', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Verlauf', /\/gruendung\/verlauf/);

    await expect(page.getByText(/Verfahrensschritt erledigt:/i)).toBeVisible();
    await expect(page.getByText(/Kleinunternehmerregelung/i).first()).toBeVisible();
    await expect(page.getByText(/Verfahrensschritt gestartet:/i)).toBeVisible();
    await expect(page.getByText(/Steuernummer erhalten/i).first()).toBeVisible();
  });

});

// ─── Unterlagen ───────────────────────────────────────────────────────────────

test.describe('UG – Unterlagen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/dokumente');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ihre Unterlagen' })).toBeVisible();
  });

  test('Fortschrittsanzeige sichtbar', async ({ page }) => {
    await expect(page.locator('.progress-bar-wrap')).toBeVisible();
  });

  test('Alle 4 Dokumente sichtbar', async ({ page }) => {
    // Headings: Fairness-Hinweis listet dieselben Namen nochmals im Fließtext
    await expect(page.getByRole('heading', { name: /Lichtbildausweis/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Gewerbeanmeldeformular/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Nachweis beruflicher Qualifikation/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Fragebogen zur steuerlichen Erfassung/ })).toBeVisible();
  });

  test('Begründung für jedes Dokument sichtbar', async ({ page }) => {
    const boxes = page.locator('.notice-box');
    const count = await boxes.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('Upload-Zone für ausstehende Dokumente vorhanden', async ({ page }) => {
    const uploadZone = page.locator('.upload-zone').first();
    await expect(uploadZone).toBeVisible();
    const ariaLabel = await uploadZone.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('Kamera-Hinweis in Upload-Zone sichtbar', async ({ page }) => {
    await expect(page.getByText(/Handykamera/).first()).toBeVisible();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('ANGEFORDERT', { exact: true })).not.toBeVisible();
    await expect(page.getByText('IN_PRUEFUNG', { exact: true })).not.toBeVisible();
  });

  test('Aktiver Tab "Unterlagen" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Unterlagen');
  });

  test('Fairness-Signal UNTERLAGE enthält berechnete Dokumenten-Frist', async ({ page }) => {
    // DOK-03: Frist 15.12.2024 · Demo-Heute 07.12.2024 → noch 8 Tage
    await expect(page.getByTestId('fairness-signal-unterlagen')).toBeVisible();
    await expect(page.getByTestId('fairness-signal-unterlagen-titel')).toContainText(
      /Unterlage\(n\) offen – Frist noch 8 Tage/i
    );
    await expect(page.getByTestId('fairness-signal-unterlagen-erklaerung')).toContainText(
      /Nächste Einreichungsfrist:\s*15\.12\.2024\s*\(noch 8 Tage/i
    );
    await expect(page.getByTestId('dok-hinweise-link')).toHaveAttribute(
      'href',
      '/gruendung/hinweise'
    );
  });

  test('Frist-Countdown pro Dokumentenkarte (Q-209)', async ({ page }) => {
    // US-UG-003: Parität AV-Dokumente + Übersicht Q-208
    // DOK-03: fristDatum 2024-12-15 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 8 Tage
    await expect(page.getByTestId('dok-seite-frist-DOK-03')).toBeVisible();
    await expect(page.getByTestId('dok-seite-frist-DOK-03')).toContainText(/15\.12\.2024|15\.12\./i);
    await expect(page.getByTestId('dok-seite-countdown-DOK-03')).toContainText(/noch 8 Tage/i);
    // Nicht-ausstehende Karten ohne Countdown-Chip
    await expect(page.getByTestId('dok-seite-countdown-DOK-04')).toHaveCount(0);
  });

  test('Ohne Session-Upload keine lokale Upload-Quittung', async ({ page }) => {
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toHaveCount(0);
    await expect(page.getByTestId('dokument-karte-DOK-03')).toBeVisible();
    await expect(page.locator('.upload-zone')).toHaveCount(1);
  });

  test('Nach Session-Upload: lokale Quittung auf der Dokumentenkarte', async ({ page }) => {
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toHaveCount(0);

    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();

    const quittung = page.getByTestId('dok-upload-quittung-DOK-03');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('dok-upload-quittung-titel-DOK-03')).toHaveText('Upload bestätigt');
    await expect(page.getByTestId('dok-upload-quittung-text-DOK-03')).toContainText(
      /Nachweis beruflicher Qualifikation/i
    );
    await expect(page.getByTestId('dok-upload-quittung-text-DOK-03')).toContainText(
      /07\.12\.2024/
    );
    await expect(quittung).toContainText(/keine Datei gespeichert/i);

    // Upload-Zone entfällt; Status „Hochgeladen“
    await expect(page.locator('.upload-zone')).toHaveCount(0);
    await expect(page.getByTestId('dokument-karte-DOK-03')).toContainText(/Hochgeladen/i);

    // Vollständigkeit + Session-Hinweis (Mock: nur DOK-03 war ausstehend)
    await expect(page.getByTestId('dok-alle-vorliegend')).toBeVisible();
    await expect(page.getByTestId('dok-alle-vorliegend-session')).toContainText(
      /1 Unterlage.*markiert/i
    );
  });

  test('Session-Upload bleibt nach Tab-Wechsel erhalten (kein page.goto)', async ({ page }) => {
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    // DEC-012: Tab-Nav erhält Session; page.goto() würde Provider remounten
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);
    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);

    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();
    await expect(page.getByTestId('dok-alle-vorliegend')).toBeVisible();
  });

});

// ─── Rückfragen ───────────────────────────────────────────────────────────────

test.describe('UG – Rückfragen (Anzeige)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Rückfragen der Behörden' })).toBeVisible();
  });

  test('Fragetext sichtbar', async ({ page }) => {
    await expect(page.getByText('Kleinunternehmerregelung').first()).toBeVisible();
  });

  test('Begründung sichtbar (Warum fragt die Behörde das?)', async ({ page }) => {
    await expect(page.getByText('Warum fragt die Behörde das?')).toBeVisible();
  });

  test('Konsequenz sichtbar (Was passiert wenn nicht geantwortet?)', async ({ page }) => {
    await expect(page.getByText('Was passiert, wenn Sie nicht antworten?')).toBeVisible();
  });

  test('Frist sichtbar', async ({ page }) => {
    await expect(page.getByText('10.12.2024')).toBeVisible();
  });

  test('Frist-Countdown-Chip pro Rückfragekarte (Q-211)', async ({ page }) => {
    // RQ-01: fristDatum 2024-12-10 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 3 Tage
    // Parität Dokumente Q-209 / Übersicht Q-210
    await expect(page.getByTestId('rq-seite-frist-RQ-01')).toBeVisible();
    await expect(page.getByTestId('rq-seite-frist-RQ-01')).toContainText(/10\.12\.2024/);
    await expect(page.getByTestId('rq-seite-countdown-RQ-01')).toContainText(/noch 3 Tage/i);
  });

  test('Zeitstempel "Gefragt am" sichtbar', async ({ page }) => {
    await expect(page.getByText(/Gefragt am 15.11.2024/)).toBeVisible();
  });

  test('Antwort-Button sichtbar und zugänglich', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('Antwort-Formular mit Label und Fristcountdown sichtbar', async ({ page }) => {
    await expect(page.getByLabel(/Ihre Antwort an/i)).toBeVisible();
    await expect(page.getByTestId('rq-seite-countdown-RQ-01')).toContainText(/noch 3 Tage/i);
  });

  test('Kein interner Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RQ-01')).not.toBeVisible();
    await expect(page.getByText('RUECKFRAGE_AUSSTEHEND')).not.toBeVisible();
  });

  test('Aktiver Tab "Fragen" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Fragen');
  });

});

test.describe('UG – Rückfragen (Interaktion)', () => {

  test('Klick auf "Rückfrage beantworten" → Bestätigung erscheint', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    const btn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.getByText(/die Behörde wurde informiert/)).toBeVisible();
    await expect(btn).not.toBeVisible();
  });

  test('Freitext-Antwort wird nach Absenden angezeigt', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    const antwort = 'Demo: Kleinunternehmerregelung ja, Umsatz unter 22.000 Euro.';
    await page.getByLabel(/Ihre Antwort an/i).fill(antwort);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText('Ihre übermittelte Antwort')).toBeVisible();
    await expect(page.getByText(antwort)).toBeVisible();
  });

  test('Nach Beantworten: Übersicht zeigt keinen Action-Banner mehr', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/gruendung');
    await expect(page.locator('.action-banner')).not.toBeVisible();
  });

  test('Nach Beantworten: Status wechselt zu "Wird bearbeitet"', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page.getByText('Ihre Antwort wird erwartet')).not.toBeVisible();
    await expect(page.getByText('Wird bearbeitet').first()).toBeVisible();
  });

  test('Nach Beantworten: Verlauf-Tiefenlink zur Session-Antwort (US-UG-005)', async ({ page }) => {
    // Quittung verlinkt auf Session-Ereignis; Hash-Hervorhebung + Badge im Verlauf
    // Kein page.goto nach State (DEC-012) – Link navigiert innerhalb des Layouts
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-antwort-quittung-RQ-01')).toBeVisible();
    await expect(page.getByText(/die Behörde wurde informiert/i)).toBeVisible();

    const verlaufLink = page.getByTestId('rq-verlauf-link-RQ-01');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/gruendung/verlauf#ere-UG-DEMO-RQ-RQ-01'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-UG-DEMO-RQ-RQ-01/);

    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-RQ-RQ-01');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(card).toContainText(/Rückfrage beantwortet/i);
    await expect(page.getByTestId('verlauf-session-antwort-badge-UG-DEMO-RQ-RQ-01')).toBeVisible();
    await expect(page.getByTestId('verlauf-session-antwort-badge-UG-DEMO-RQ-RQ-01')).toContainText(
      /Ihre Antwort/i
    );
  });

  test('Session-Antwort bleibt im Verlauf nach Tab-Nav (kein page.goto)', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-antwort-quittung-RQ-01')).toBeVisible();

    await goUgTab(page, 'Verlauf', /\/gruendung\/verlauf/);
    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-RQ-RQ-01');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(page.getByTestId('verlauf-session-antwort-badge-UG-DEMO-RQ-RQ-01')).toContainText(
      /Ihre Antwort/i
    );

    // Filter „Rückfragen“ zeigt gestellte + beantwortete
    const typGroup = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await typGroup.getByRole('button', { name: /Rückfragen/i }).click();
    await expect(card).toBeVisible();
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
    await expect(page.getByText('Rückfrage beantwortet').first()).toBeVisible();
  });

  test('Nach Upload: Verlauf-Tiefenlink zum Session-Upload (US-UG-003/005)', async ({ page }) => {
    // Quittung verlinkt auf Session-Ereignis; Hash-Hervorhebung + Badge im Verlauf
    // Kein page.goto nach State (DEC-012) – Link navigiert innerhalb des Layouts
    await page.goto('/gruendung/dokumente');
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    const verlaufLink = page.getByTestId('dok-verlauf-link-DOK-03');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/gruendung/verlauf#ere-UG-DEMO-DOK-DOK-03'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-UG-DEMO-DOK-DOK-03/);

    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-DOK-DOK-03');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-upload', 'true');
    await expect(card).toContainText(/hochgeladen/i);
    await expect(page.getByTestId('verlauf-session-upload-badge-UG-DEMO-DOK-DOK-03')).toBeVisible();
    await expect(page.getByTestId('verlauf-session-upload-badge-UG-DEMO-DOK-DOK-03')).toContainText(
      /Ihr Upload/i
    );
  });

  test('Session-Upload bleibt im Verlauf nach Tab-Nav (kein page.goto)', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await page.goto('/gruendung/dokumente');
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-03')).toBeVisible();

    await goUgTab(page, 'Verlauf', /\/gruendung\/verlauf/);
    const card = page.getByTestId('verlauf-ereignis-UG-DEMO-DOK-DOK-03');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-session-upload', 'true');
    await expect(page.getByTestId('verlauf-session-upload-badge-UG-DEMO-DOK-DOK-03')).toContainText(
      /Ihr Upload/i
    );

    // Filter „Dokumente“ zeigt Session-Upload
    const typGroup = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await typGroup.getByRole('button', { name: /Dokumente/i }).click();
    await expect(card).toBeVisible();
    await expect(page.getByText(/Dokument übermittelt/i).first()).toBeVisible();
  });

});

// ─── Hinweise ─────────────────────────────────────────────────────────────────

test.describe('UG – Hinweise zur Verfahrenslage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/hinweise');
  });

  test('Seitenüberschrift und Fairness-Erklärung sichtbar', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Hinweise zur Verfahrenslage' })).toBeVisible();
    await expect(page.getByText(/ersetzen keine Entscheidung/i)).toBeVisible();
  });

  test('Aktiver Tab „Hinweise“ ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Hinweise');
  });

  test('Mindestens ein Relevanter Hinweis bei offener Rückfrage', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Relevant/i })).toBeVisible();
    await expect(page.getByText(/Rückfrage offen/i).first()).toBeVisible();
  });

  test('Kein interner Signal-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT')).not.toBeVisible();
    await expect(page.getByText('US-UG-007')).not.toBeVisible();
  });

  test('RELEVANT-Rückfrage-Signal hat CTA „Frage beantworten“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-rq-cta-RQ-01');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Frage beantworten/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/rueckfragen#rq-RQ-01');
    // Hilfstext: Frist + kurze Konsequenz (wie Übersicht-Fairness-CTA)
    const hint = page.getByTestId('hinweise-rq-cta-hint-RQ-01');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Antwortfrist/i);
    await expect(hint).toContainText(/10\.12\.2024|noch 3 Tage/i);
    await expect(hint).toContainText(/Steuernummer|steuerliche Erfassung/i);
    await expect(hint).toContainText(/Rückfragen/i);
  });

  test('Hinweise: RQ-Countdown-Chip am CTA (Q-218)', async ({ page }) => {
    // US-UG-004: Parität AV Q-214 — Chip + Tiefenlink #rq-…
    // RQ-01 Frist 2024-12-10 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 3 Tage
    const wrap = page.getByTestId('hinweise-rq-cta-wrap-RQ-01');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta-hint-RQ-01')).toContainText(
      /10\.12\.2024|noch 3 Tage/i
    );
    const chip = page.getByTestId('hinweise-rq-countdown-RQ-01');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 3 Tage/i);
    await page.getByTestId('hinweise-rq-cta-RQ-01').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('CTA aus RELEVANT-Signal führt zur Rückfrage-Karte', async ({ page }) => {
    await page.getByTestId('hinweise-rq-cta-RQ-01').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
  });

  test('Hinweise RQ: Tiefenlink Im Verlauf ansehen führt zu ERE-06', async ({ page }) => {
    // Primär-CTA bleibt handlungsbezogen; Sekundär-CTA → Audit (US-UG-005)
    const verlauf = page.getByTestId('hinweise-verlauf-cta-ERE-06');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/gruendung/verlauf#ere-ERE-06');
    await expect(verlauf).toContainText(/Im Verlauf ansehen/i);
    await verlauf.click();
    await expect(page).toHaveURL(/\/gruendung\/verlauf#ere-ERE-06/);
    const card = page.getByTestId('verlauf-ereignis-ERE-06');
    await expect(card).toBeVisible();
    await expect(card).toContainText(/Rückfrage gestellt/i);
    await expect(card).toContainText(/Kleinunternehmerregelung|Finanzamt/i);
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

  test('Nach Beantworten entfällt RELEVANT-CTA auf Hinweise', async ({ page }) => {
    // Session-State: NIE page.goto nach Antwort — Layout-Provider remountet sonst
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);
    await expect(page.getByTestId('hinweise-rq-cta-RQ-01')).toHaveCount(0);
  });

  test('RELEVANT-BG-Signal hat CTA „Zur Behördenkarte“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-bg-cta-BEH-04');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zur Behördenkarte/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-04');
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const hint = page.getByTestId('hinweise-bg-cta-hint-BEH-04');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(hint).toContainText(/BG-Anmeldung|außerhalb von Open State/i);
  });

  test('CTA aus BG-Signal führt zur Berufsgenossenschaft-Karte', async ({ page }) => {
    await page.getByTestId('hinweise-bg-cta-BEH-04').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden#beh-BEH-04/);
    await expect(page.locator('#beh-BEH-04')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Berufsgenossenschaft|BG ETEM/i);
  });

  test('Nach Antwort: BG-CTA-Hilfstext ohne RQ-Priorität', async ({ page }) => {
    // Session-State: NIE page.goto nach Antwort (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    // CTA bleibt (BG noch NICHT_GESTARTET); Hilfstext session-sensitiv
    await expect(page.getByTestId('hinweise-bg-cta-BEH-04')).toBeVisible();
    const hint = page.getByTestId('hinweise-bg-cta-hint-BEH-04');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Keine offene Rückfrage mehr|BG-Anmeldung/i);
    await expect(hint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('HINWEIS-Unterlagen-Signal hat CTA „Zu den Unterlagen“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-unterlagen-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zu den Unterlagen/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären
    const hint = page.getByTestId('hinweise-unterlagen-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(hint).toContainText(/Unterlagen/i);
  });

  test('UNTERLAGE-Signal enthält berechnete Dokumenten-Frist', async ({ page }) => {
    // Mock DOK-03: Frist 15.12.2024 · FIKTIVES_HEUTE_GRUENDUNG 07.12.2024 → 8 Tage
    await expect(page.getByTestId('hinweise-signal-count')).toContainText(/Aktuell \d+ Hinweise/i);

    const signal = page.getByTestId('hinweise-signal-unterlagen');
    await expect(signal).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-unterlagen-titel')).toContainText(
      /Unterlage\(n\) offen – Frist noch 8 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).toContainText(
      /Nächste Einreichungsfrist:\s*15\.12\.2024\s*\(noch 8 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).toContainText(
      /Qualifikation/i
    );
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toBeVisible();
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveAttribute(
      'href',
      '/gruendung/dokumente#dok-DOK-03'
    );
    await expect(page.getByTestId('hinweise-unterlagen-cta-hint')).toContainText(/Unterlagen/i);
  });

  test('Hinweise: UNTERLAGE-Countdown-Chip am CTA (Q-219)', async ({ page }) => {
    // US-UG-003: Parität AV Q-216 — Chip + Tiefenlink #dok-…
    // DOK-03 Frist 2024-12-15 · FIKTIVES_HEUTE_GRUENDUNG 2024-12-07 → noch 8 Tage
    const wrap = page.getByTestId('hinweise-unterlagen-cta-wrap');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-unterlagen-cta-hint')).toContainText(/Unterlagen/i);
    const chip = page.getByTestId('hinweise-unterlagen-countdown');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 8 Tage/i);
    await page.getByTestId('hinweise-unterlagen-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
  });

  test('Hinweise: UNTERLAGE-CTA data-next-dok-id + nächste Bezeichnung (Q-224)', async ({
    page,
  }) => {
    // US-UG-003: Parität AV Hinweise Q-222 — live nächste offene Karte
    // Mock: nur DOK-03 ANGEFORDERT (Qualifikation)
    const wrap = page.getByTestId('hinweise-unterlagen-cta-wrap');
    await expect(wrap).toBeVisible();
    await expect(wrap).toHaveAttribute('data-next-dok-id', 'DOK-03');
    const hint = page.getByTestId('hinweise-unterlagen-cta-hint');
    await expect(hint).toContainText(/Qualifikation/i);
    await expect(hint).toContainText(/Nächste|offene Unterlage|Unterlagen/i);
    const cta = page.getByTestId('hinweise-unterlagen-cta');
    await expect(cta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    await expect(cta).toHaveAttribute('aria-label', /Qualifikation/i);
  });

  test('CTA aus Unterlagen-Signal führt zur Dokumentenkarte', async ({ page }) => {
    await page.getByTestId('hinweise-unterlagen-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
    await expect(page.getByTestId('dokument-karte-DOK-03')).toContainText(/Qualifikation/i);
  });

  test('Nach Upload entfällt UNTERLAGE-Signal und CTA auf Hinweise (live)', async ({ page }) => {
    // Kein page.goto nach State (DEC-012) — Session-Nav über Tabs + Link
    const { goUgTab } = await import('./helpers/sessionNav');

    await goUgTab(page, 'Unterlagen', /\/gruendung\/dokumente/);
    await expect(page.getByTestId('fairness-signal-unterlagen')).toBeVisible();
    await expect(page.getByTestId('fairness-signal-unterlagen-titel')).toContainText(
      /Unterlage\(n\) offen – Frist noch 8 Tage/i
    );
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    // Mock: nur DOK-03 offen → Signal auf Dokumente entfällt
    await expect(page.getByTestId('fairness-signal-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('dok-alle-vorliegend')).toBeVisible();

    // Zur Verfahrenslage über Dok-Link (Session bleibt)
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    await expect(page.getByTestId('hinweise-signal-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toContainText(/Unterlagen/i);
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
  });

  test('Nach Upload entfällt Unterlagen-CTA auf Hinweise', async ({ page }) => {
    // Client-Navigation: Session-State bleibt im Layout-Provider
    await page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' }).click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Hinweise' }).click();
    await expect(page).toHaveURL(/\/gruendung\/hinweise/);
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveCount(0);
  });

  test('Nach Beantworten: Unterlagen-CTA-Hilfstext ohne RQ-Vorrang', async ({ page }) => {
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    // CTA bleibt (Unterlage noch ANGEFORDERT); Hilfstext session-sensitiv
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toBeVisible();
    const hint = page.getByTestId('hinweise-unterlagen-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Keine offene Rückfrage mehr|nachreichen/i);
    await expect(hint).toContainText(/Unterlagen/i);
    await expect(hint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('HINWEIS-Steuernummer-Signal hat CTA „Zum Finanzamt“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-steuernummer-cta-BEH-02');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zum Finanzamt/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-02');
  });

  test('Steuernummer-Signal bei VS-05 ausstehend: Text zu offener Rückfrage', async ({ page }) => {
    const panel = page.getByTestId('hinweise-hinweis-UG-STEUERNUMMER-FEHLT');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/Steuernummer noch nicht erteilt/i);
    await expect(panel).toContainText(/blockiert durch die offene Rückfrage/i);
    // CTA-Hilfstext bei offener RQ: zuerst klären (wie Übersicht)
    const hint = page.getByTestId('hinweise-steuernummer-cta-hint-BEH-02');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/offene Rückfrage des Finanzamts klären/i);
    await expect(hint).toContainText(/Behördenkarte/i);
    await expect(hint).not.toContainText(/nach Abschluss der steuerlichen Erfassung/i);
  });

  test('CTA aus Steuernummer-Signal führt zur Finanzamt-Karte', async ({ page }) => {
    await page.getByTestId('hinweise-steuernummer-cta-BEH-02').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden#beh-BEH-02/);
    await expect(page.locator('#beh-BEH-02')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-02')).toContainText(/Finanzamt/i);
  });

  test('Nach Antwort: Steuernummer-Signal bleibt bei VS-05 in Bearbeitung', async ({ page }) => {
    // Session: NIE page.goto nach State-Interaktion (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    const panel = page.getByTestId('hinweise-hinweis-UG-STEUERNUMMER-FEHLT');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/Steuernummer in Bearbeitung/i);
    await expect(panel).toContainText(/Rückfrage zur Kleinunternehmerregelung ist beantwortet/i);
    await expect(panel).not.toContainText(/blockiert durch die offene Rückfrage/i);

    const ctaWrap = page.getByTestId('hinweise-steuernummer-cta-wrap-BEH-02');
    await expect(ctaWrap).toBeVisible();
    await expect(ctaWrap).toContainText(/in Bearbeitung/i);
    const steuernummerCta = page.getByTestId('hinweise-steuernummer-cta-BEH-02');
    await expect(steuernummerCta).toBeVisible();
    await expect(steuernummerCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-02');
    // CTA-Label spiegelt Übersicht: bei VS-05 IN_BEARBEITUNG „Steuernummer-Stand ansehen“
    await expect(steuernummerCta).toContainText(/Steuernummer-Stand ansehen/i);
    await expect(steuernummerCta).not.toContainText(/^Zum Finanzamt/i);
    // CTA-Hilfstext nach RQ-Antwort: Vergabe in Bearbeitung, keine RQ-Priorität
    const steuernummerHint = page.getByTestId('hinweise-steuernummer-cta-hint-BEH-02');
    await expect(steuernummerHint).toBeVisible();
    await expect(steuernummerHint).toContainText(/in Bearbeitung/i);
    await expect(steuernummerHint).toContainText(/Behördenkarte/i);
    await expect(steuernummerHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('HINWEIS-Betriebsdatum-Signal hat CTA „Zum Verfahrensstatus“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-betriebsdatum-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zum Verfahrensstatus/i);
    await expect(cta).toHaveAttribute('href', '/gruendung#verfahrensstatus');
    // Hilfstext bei offener RQ: zuerst Finanzamt-Rückfrage klären (wie Übersicht)
    const hint = page.getByTestId('hinweise-betriebsdatum-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('Betriebsdatum-Signal bei offener Rückfrage: zuerst Rückfrage beantworten', async ({ page }) => {
    const panel = page.getByTestId('hinweise-hinweis-UG-BETRIEBSDATUM');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/steuerliche Erfassung durch das Finanzamt steht noch aus/i);
    await expect(panel).toContainText(/zuerst Rückfrage Finanzamt beantworten/i);
  });

  test('CTA aus Betriebsdatum-Signal führt zum Statusblock der Übersicht', async ({ page }) => {
    await page.getByTestId('hinweise-betriebsdatum-cta').click();
    await expect(page).toHaveURL(/\/gruendung#verfahrensstatus/);
    await expect(page.locator('#verfahrensstatus')).toBeVisible();
    await expect(page.getByTestId('uebersicht-verfahrensstatus')).toContainText(/IT-Beratung|Verfahrensfortschritt|Sie sind hier/i);
  });

  test('Nach Antwort: Betriebsdatum-Signal ohne „zuerst Rückfrage beantworten“', async ({ page }) => {
    // Session: NIE page.goto nach State-Interaktion (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    const panel = page.getByTestId('hinweise-hinweis-UG-BETRIEBSDATUM');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/Rückfrage des Finanzamts ist beantwortet/i);
    await expect(panel).toContainText(/Steuernummer-Vergabe läuft|BG-Anmeldung/i);
    await expect(panel).not.toContainText(/zuerst Rückfrage Finanzamt beantworten/i);
    await expect(panel).toContainText(/keine Antwort-Rückfrage mehr nötig/i);
    // CTA zum Verfahrensstatus bleibt
    await expect(page.getByTestId('hinweise-betriebsdatum-cta')).toBeVisible();
    await expect(page.getByTestId('hinweise-betriebsdatum-cta')).toHaveAttribute(
      'href',
      '/gruendung#verfahrensstatus'
    );
    // CTA-Hilfstext nach RQ-Antwort: Fokus Steuernummer/offene Punkte (wie Übersicht)
    const hint = page.getByTestId('hinweise-betriebsdatum-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Rückfrage beantwortet/i);
    await expect(hint).toContainText(/Steuernummer-Vergabe|offene Punkte/i);
    await expect(hint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('Nach RQ + BG: BG-Signal entfällt, Steuernummer- und Betriebsdatum-CTAs bleiben', async ({
    page,
  }) => {
    // Fairness-Fallthrough nach BG (US-UG fairness / naechsterSchrittZiel)
    // Kein page.goto nach State (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();

    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);
    await page.getByTestId('behoerde-bg-erledigt-btn').click();
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();

    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    // BG-Signal und -CTA entfallen nach Markierung
    await expect(page.getByTestId('hinweise-hinweis-UG-BG-ANMELDUNG')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-bg-cta-BEH-04')).toHaveCount(0);

    // Steuernummer: VS-05 IN_BEARBEITUNG nach RQ-Antwort
    const steuernummerPanel = page.getByTestId('hinweise-hinweis-UG-STEUERNUMMER-FEHLT');
    await expect(steuernummerPanel).toBeVisible();
    await expect(steuernummerPanel).toContainText(/Steuernummer in Bearbeitung/i);
    const steuernummerCta = page.getByTestId('hinweise-steuernummer-cta-BEH-02');
    await expect(steuernummerCta).toBeVisible();
    await expect(steuernummerCta).toContainText(/Steuernummer-Stand ansehen/i);
    await expect(steuernummerCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-02');
    const steuernummerHint = page.getByTestId('hinweise-steuernummer-cta-hint-BEH-02');
    await expect(steuernummerHint).toContainText(/in Bearbeitung/i);
    await expect(steuernummerHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);

    // Betriebsdatum bleibt mit session-sensitivem Hilfstext (Steuernummer-Fokus)
    await expect(page.getByTestId('hinweise-hinweis-UG-BETRIEBSDATUM')).toBeVisible();
    await expect(page.getByTestId('hinweise-betriebsdatum-cta')).toBeVisible();
    const betriebsHint = page.getByTestId('hinweise-betriebsdatum-cta-hint');
    await expect(betriebsHint).toContainText(/Steuernummer-Vergabe|offene Punkte/i);
    await expect(betriebsHint).not.toContainText(/offene Rückfrage des Finanzamts klären/i);
  });

  test('Q-441: BG-Happy-Path Hinweise-CTA → Markierung → Mehrflächen (DEC-012)', async ({ page }) => {
    // Happy-Path: Fairness-CTA → Behördenkarte → Demo-Markierung → Session bleibt
    // auf Hinweise / Verlauf / Übersicht sichtbar erledigt (kein page.goto nach Interaktion)
    // Signal-Prefix: RELEVANT oder HINWEIS je nach Frist (data-signal-id ist stabil)
    const { goUgTab } = await import('./helpers/sessionNav');
    const bgSignal = page.locator('[data-signal-id="UG-BG-ANMELDUNG"]');

    await expect(bgSignal).toBeVisible();
    await expect(page.getByTestId('hinweise-bg-cta-BEH-04')).toBeVisible();
    await page.getByTestId('hinweise-bg-cta-BEH-04').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden#beh-BEH-04/);
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toBeVisible();
    await expect(page.getByTestId('behoerde-bg-demo-aktion')).toBeVisible();

    await page.getByTestId('behoerde-bg-erledigt-btn').click();
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Abgeschlossen/i);
    await expect(page.getByTestId('behoerde-schritt-VS-07')).toContainText(/Erledigt/i);
    await expect(page.getByTestId('behoerde-bg-demo-aktion')).toHaveCount(0);

    // Hinweise: BG-Signal und -CTA entfallen
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);
    await expect(page.locator('[data-signal-id="UG-BG-ANMELDUNG"]')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-bg-cta-BEH-04')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();

    // Verlauf: Session-Ereignis der Markierung
    await goUgTab(page, 'Verlauf', /\/gruendung\/verlauf/);
    await expect(page.getByText(/BG-Anmeldung als erledigt markiert/i).first()).toBeVisible();

    // Übersicht: keine BG-Aufgabe / kein BG-Fairness-CTA
    await goUgTab(page, 'Übersicht', /\/gruendung$/);
    await expect(page.getByTestId('uebersicht-aufgabe-link-beh-BEH-04')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-fairness-cta-beh-BEH-04')).toHaveCount(0);
    await expect(page.getByTestId('uebersicht-fairness-UG-BG-ANMELDUNG')).toHaveCount(0);

    // Behörden: Quittung bleibt nach Tab-Runde (Session)
    await goUgTab(page, 'Behörden', /\/gruendung\/behoerden/);
    await expect(page.getByTestId('behoerde-bg-erledigt-quittung')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Abgeschlossen/i);
  });

  test('INFO-Parallele-Behörden-Signal hat CTA „Zu den Behörden“', async ({ page }) => {
    const cta = page.getByTestId('hinweise-parallele-behoerden-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zu den Behörden/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/behoerden');
    // Initial: Hilfstext priorisiert offene Rückfrage (session-sensitiv)
    const hint = page.getByTestId('hinweise-parallele-behoerden-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Offene Rückfragen zuerst klären/i);
    await expect(hint).toContainText(/Behörden & Verfahrensschritte/i);
    // Signal-Text: nächster Schritt mit RQ-Priorität
    const panel = page.getByTestId('hinweise-info-UG-PARALLELE-BEHOERDEN');
    await expect(panel).toContainText(/Offene Rückfragen zuerst beantworten/i);
  });

  test('CTA aus parallelen Behörden führt zur Behörden-Übersicht', async ({ page }) => {
    await page.getByTestId('hinweise-parallele-behoerden-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden/);
    await expect(page.getByRole('heading', { name: 'Behörden & Verfahrensschritte' })).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-02')).toBeVisible();
  });

  test('Nach Antwort: parallele Behörden ohne RQ-Priorität, CTA bleibt', async ({ page }) => {
    // Session: Rückfrage beantworten, dann Hinweise (kein page.goto nach State – DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);

    // Signal bleibt (FA + IHK weiter parallel aktiv), aber keine RQ-Priorität mehr
    const panel = page.getByTestId('hinweise-info-UG-PARALLELE-BEHOERDEN');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/Behördenverfahren laufen parallel/i);
    await expect(panel).toContainText(/Keine offene Rückfrage mehr/i);
    await expect(panel).not.toContainText(/Offene Rückfragen zuerst beantworten/i);

    // CTA bleibt sichtbar (mehrere Behörden aktiv); Hilfstext session-sensitiv
    await expect(page.getByTestId('hinweise-parallele-behoerden-cta')).toBeVisible();
    const hint = page.getByTestId('hinweise-parallele-behoerden-cta-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/Keine offene Rückfrage/i);
    await expect(hint).toContainText(/parallele Verfahren/i);
    await expect(hint).not.toContainText(/Offene Rückfragen zuerst klären/i);
  });

  test('Q-470: DemoSessionBar-Reset nach RQ stellt Fairness-RQ-Signal wieder her', async ({
    page,
  }) => {
    // Parität AV Q-462: Session-Antwort → Signal weg → Reset → Mock/RQ-Signal zurück
    // Kein page.goto nach Interaktion (DEC-012)
    const { goUgTab } = await import('./helpers/sessionNav');

    // 1) Ausgang: offenes RQ-Signal auf Hinweise
    await expect(page.getByTestId('hinweise-rq-cta-RQ-01')).toBeVisible();
    await expect(
      page.locator('[data-signal-typ="UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT"]')
    ).toHaveCount(1);
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);

    // 2) RQ beantworten (UG: ein Klick) → Session-Bar an
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText(/die Behörde wurde informiert|beantwortet/i).first()).toBeVisible();
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();

    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    await expect(sessionBar.getByRole('button', { name: /Demo zurücksetzen/i })).toBeVisible();

    // 3) Session-Nav → Hinweise: RQ-CTA/Signal entfallen, Regelwerk-Reaktion
    await goUgTab(page, 'Hinweise', /\/gruendung\/hinweise/);
    await expect(page.getByTestId('hinweise-rq-cta-RQ-01')).toHaveCount(0);
    await expect(
      page.locator('[data-signal-typ="UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT"]')
    ).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toBeVisible();

    // 4) Demo zurücksetzen (UG-Reset remountet nicht)
    await page
      .getByRole('region', { name: /Demo-Session/i })
      .getByRole('button', { name: /Demo zurücksetzen/i })
      .click();

    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-geloest')).toHaveCount(0);

    // Fairness-RQ wieder Ausgangs-Mock
    await expect(page.getByTestId('hinweise-rq-cta-RQ-01')).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta-RQ-01')).toHaveAttribute(
      'href',
      '/gruendung/rueckfragen#rq-RQ-01'
    );
    await expect(
      page.locator('[data-signal-typ="UG_RUECKFRAGE_OFFEN_FRIST_RELEVANT"]')
    ).toHaveCount(1);
    await expect(page.getByTestId('hinweise-relevant-UG-RQ-RQ-01-FRIST')).toBeVisible();
    await expect(page.getByTestId('hinweise-relevant-UG-RQ-RQ-01-FRIST')).toContainText(
      /Rückfrage offen/i
    );

    // 5) Rückfragen-Seite konsistent (Session-Nav)
    await goUgTab(page, 'Fragen', /\/gruendung\/rueckfragen/);
    await expect(page.getByRole('button', { name: /Rückfrage beantworten/i })).toBeVisible();
    await expect(page.getByText('Alle Fragen sind beantwortet')).toHaveCount(0);
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
  });

});

// ─── Verlauf ──────────────────────────────────────────────────────────────────

test.describe('UG – Verlauf', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/verlauf');
  });

  test('Seitenüberschrift mit Transparenzversprechen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Verlauf Ihrer Akte' })).toBeVisible();
    await expect(page.getByText('unveränderlich dokumentiert')).toBeVisible();
  });

  test('Ereignis-Anker #ere-ERE-06 für Fairness-Tiefenlink', async ({ page }) => {
    // Anker/Testid für Fairness-Tiefenlinks (US-UG-005)
    const card = page.getByTestId('verlauf-ereignis-ERE-06');
    await expect(card).toBeVisible();
    await expect(page.locator('#ere-ERE-06')).toBeVisible();
    await expect(card).toContainText(/Rückfrage gestellt/i);
    // Hash setzen (wie Browser nach Fairness-Klick) – hashchange-Handler setzt aria-current
    await page.evaluate(() => {
      window.location.hash = 'ere-ERE-06';
    });
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

  test('Zeitstempel sichtbar', async ({ page }) => {
    await expect(page.getByText('01.11.2024, 09:14 Uhr').first()).toBeVisible();
  });

  test('Ereignistypen sichtbar', async ({ page }) => {
    await expect(page.getByText('Vorgang erstellt').first()).toBeVisible();
    await expect(page.getByText('Eingang bestätigt').first()).toBeVisible();
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
  });

  test('Akteure sichtbar', async ({ page }) => {
    await expect(page.getByText('Sie').first()).toBeVisible();
    await expect(page.getByText('Behörde').first()).toBeVisible();
  });

  test('Filter nach handelnder Stelle sichtbar', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await expect(group).toBeVisible();
    await expect(group.getByRole('button', { name: /Alle/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Sie/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Behörde/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /System/i })).toBeVisible();
  });

  test('Filter „Sie“ zeigt nur Gründer-Ereignisse', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /Sie/i }).click();
    await expect(group.getByRole('button', { name: /Sie/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Vorgang erstellt').first()).toBeVisible();
    await expect(page.getByText('Vorgang eingereicht').first()).toBeVisible();
    // Behörden-Ereignis muss ausgeblendet sein
    await expect(page.getByText('Rückfrage gestellt')).not.toBeVisible();
    await expect(page.getByText(/von \d+ Einträgen · Filter: Sie/)).toBeVisible();
  });

  test('Filter „Behörde“ blendet Gründer-Ereignisse aus', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /Behörde/i }).click();
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
    await expect(page.getByText('Eingang bestätigt').first()).toBeVisible();
    await expect(page.getByText('Vorgang erstellt')).not.toBeVisible();
  });

  test('Filter „System“ zeigt Leerzustand ohne System-Events', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /System/i }).click();
    await expect(page.getByRole('status')).toContainText(/Keine System-Einträge|Noch keine System/i);
  });

  test('Filter nach Ereignistyp sichtbar', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await expect(group).toBeVisible();
    await expect(group.getByRole('button', { name: /Alle/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Vorgang/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Dokumente/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Rückfragen/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Bescheide/i })).toBeVisible();
  });

  test('Filter „Rückfragen“ zeigt nur Rückfrage-Ereignisse', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await group.getByRole('button', { name: /Rückfragen/i }).click();
    await expect(group.getByRole('button', { name: /Rückfragen/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
    await expect(page.getByText('Vorgang erstellt')).not.toBeVisible();
    await expect(page.getByText('Bescheid erteilt')).not.toBeVisible();
    await expect(page.getByText(/von \d+ Einträgen · Filter: Rückfragen/)).toBeVisible();
  });

  test('Filter „Dokumente“ zeigt nur Dokument-Ereignisse', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await group.getByRole('button', { name: /Dokumente/i }).click();
    await expect(page.getByText('Dokument übermittelt').first()).toBeVisible();
    await expect(page.getByText('Rückfrage gestellt')).not.toBeVisible();
    await expect(page.getByText('Vorgang erstellt')).not.toBeVisible();
  });

  test('Filter „Bescheide“ zeigt nur Bescheid-Ereignisse', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await group.getByRole('button', { name: /Bescheide/i }).click();
    await expect(page.getByText('Bescheid erteilt').first()).toBeVisible();
    await expect(page.getByText('Rückfrage gestellt')).not.toBeVisible();
    await expect(page.getByText('Dokument übermittelt')).not.toBeVisible();
  });

  test('Stelle- und Typ-Filter kombinierbar', async ({ page }) => {
    const stelle = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    const typ = page.getByRole('group', { name: /Verlauf filtern nach Ereignistyp/i });
    await stelle.getByRole('button', { name: /Sie/i }).click();
    await typ.getByRole('button', { name: /Dokumente/i }).click();
    await expect(page.getByText('Dokument übermittelt').first()).toBeVisible();
    await expect(page.getByText('Vorgang erstellt')).not.toBeVisible();
    await expect(page.getByText(/von \d+ Einträgen · Filter: Sie · Dokumente/)).toBeVisible();
  });

  test('Kein interner Ereignis-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('vorgang_erstellt')).not.toBeVisible();
    await expect(page.getByText('GRUENDER')).not.toBeVisible();
  });

  test('Aktiver Tab "Verlauf" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Verlauf');
  });

});
