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
    // Nächster Schritt wechselt von Rückfrage zu Unterlagen
    const cta = page.getByTestId('uebersicht-naechster-schritt-cta');
    await expect(cta).toHaveAttribute('href', /\/gruendung\/dokumente#dok-/);
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

    const dokCta = page.getByTestId('uebersicht-fairness-cta-dok-DOK-03');
    await expect(dokCta).toBeVisible();
    await expect(dokCta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
    await expect(dokCta).toContainText(/Zu den Unterlagen/i);

    const bgCta = page.getByTestId('uebersicht-fairness-cta-beh-BEH-04');
    await expect(bgCta).toBeVisible();
    await expect(bgCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-04');
    await expect(bgCta).toContainText(/Zur Behördenkarte/i);

    const steuernummerCta = page.getByTestId('uebersicht-fairness-cta-steuernummer-BEH-02');
    await expect(steuernummerCta).toBeVisible();
    await expect(steuernummerCta).toHaveAttribute('href', '/gruendung/behoerden#beh-BEH-02');
    await expect(steuernummerCta).toContainText(/Zum Finanzamt/i);

    const betriebsdatumCta = page.getByTestId('uebersicht-fairness-cta-betriebsdatum');
    await expect(betriebsdatumCta).toBeVisible();
    await expect(betriebsdatumCta).toHaveAttribute('href', '/gruendung#verfahrensstatus');
    await expect(betriebsdatumCta).toContainText(/Zum Verfahrensstatus/i);
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
    // Betriebsdatum-Signal: keine „zuerst Rückfrage beantworten“-Anweisung mehr
    const betriebsSignal = page.getByTestId('uebersicht-fairness-UG-BETRIEBSDATUM');
    await expect(betriebsSignal).toContainText(/Rückfrage des Finanzamts ist beantwortet/i);
    await expect(betriebsSignal).not.toContainText(/zuerst Rückfrage Finanzamt beantworten/i);
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
    await expect(page.getByText(/Noch \d+ Tag/)).toBeVisible();
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
  });

  test('CTA aus RELEVANT-Signal führt zur Rückfrage-Karte', async ({ page }) => {
    await page.getByTestId('hinweise-rq-cta-RQ-01').click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
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
  });

  test('CTA aus BG-Signal führt zur Berufsgenossenschaft-Karte', async ({ page }) => {
    await page.getByTestId('hinweise-bg-cta-BEH-04').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden#beh-BEH-04/);
    await expect(page.locator('#beh-BEH-04')).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-04')).toContainText(/Berufsgenossenschaft|BG ETEM/i);
  });

  test('HINWEIS-Unterlagen-Signal hat CTA „Zu den Unterlagen“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-unterlagen-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zu den Unterlagen/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/dokumente#dok-DOK-03');
  });

  test('CTA aus Unterlagen-Signal führt zur Dokumentenkarte', async ({ page }) => {
    await page.getByTestId('hinweise-unterlagen-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/dokumente#dok-DOK-03/);
    await expect(page.locator('#dok-DOK-03')).toBeVisible();
    await expect(page.getByTestId('dokument-karte-DOK-03')).toContainText(/Qualifikation/i);
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
    await expect(page.getByTestId('hinweise-steuernummer-cta-wrap-BEH-02')).toContainText(
      /nach Abschluss der steuerlichen Erfassung/i
    );
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
  });

  test('HINWEIS-Betriebsdatum-Signal hat CTA „Zum Verfahrensstatus“ mit Anker', async ({ page }) => {
    const cta = page.getByTestId('hinweise-betriebsdatum-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zum Verfahrensstatus/i);
    await expect(cta).toHaveAttribute('href', '/gruendung#verfahrensstatus');
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
  });

  test('INFO-Parallele-Behörden-Signal hat CTA „Zu den Behörden“', async ({ page }) => {
    const cta = page.getByTestId('hinweise-parallele-behoerden-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Zu den Behörden/i);
    await expect(cta).toHaveAttribute('href', '/gruendung/behoerden');
  });

  test('CTA aus parallelen Behörden führt zur Behörden-Übersicht', async ({ page }) => {
    await page.getByTestId('hinweise-parallele-behoerden-cta').click();
    await expect(page).toHaveURL(/\/gruendung\/behoerden/);
    await expect(page.getByRole('heading', { name: 'Behörden & Verfahrensschritte' })).toBeVisible();
    await expect(page.getByTestId('behoerde-karte-BEH-02')).toBeVisible();
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
