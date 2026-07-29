/**
 * US-AV-004 – Rückfrage verstehen
 *
 * AC1: Vier Pflichtbestandteile je Rückfrage:
 *      (a) Inhalt der Anforderung
 *      (b) Begründung
 *      (c) Frist als konkretes Datum
 *      (d) Konsequenz bei Nichtantwort
 * AC4: Frist < 3 Tage visuell hervorgehoben
 * AC5: Zeitstempel (gestellt am)
 *
 * + Interaktionstest: Beantworten ändert den Zustand
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-004 – Rückfrage verstehen (Anzeige)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/rueckfragen');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Rückfragen der Behörde' })
    ).toBeVisible();
  });

  test('Anzahl offener Rückfragen wird angezeigt', async ({ page }) => {
    await expect(page.getByText(/1 Frage braucht Ihre Antwort/)).toBeVisible();
  });

  test('AC1a: Inhalt der Anforderung (Was wird gefragt?) sichtbar', async ({ page }) => {
    await expect(page.getByText('Was wird gefragt?')).toBeVisible();
    // Konkreter Fragetext aus den Mockdaten
    await expect(
      page.getByText('Ihre hochgeladene Arbeitgeberbescheinigung enthält kein Datum')
    ).toBeVisible();
  });

  test('AC1b: Begründung (Warum fragt die Behörde das?) sichtbar', async ({ page }) => {
    await expect(page.getByText('Warum fragt die Behörde das?')).toBeVisible();
    await expect(
      page.getByText(/Datum der Beschäftigungsaufnahme ist notwendig/)
    ).toBeVisible();
  });

  test('AC1c: Frist als konkretes Datum sichtbar', async ({ page }) => {
    await expect(page.getByText('26. November 2024')).toBeVisible();
  });

  test('AC1c: Anzahl verbleibender Tage sichtbar', async ({ page }) => {
    await expect(page.getByText(/Tag/).first()).toBeVisible();
  });

  test('AC1d: Konsequenz bei Nichtantwort sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Was passiert, wenn Sie nicht antworten?')
    ).toBeVisible();
    await expect(
      page.getByText(/Ohne diese Angabe kann die Leistungsberechnung nicht abgeschlossen werden/)
    ).toBeVisible();
  });

  test('AC5: Zeitstempel "Gestellt am" vorhanden', async ({ page }) => {
    await expect(page.getByText('Gefragt am 19. November 2024')).toBeVisible();
  });

  test('Antwort-Button ist sichtbar und zugänglich', async ({ page }) => {
    const button = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RQ-001')).not.toBeVisible();
    await expect(page.getByText('RUECKFRAGE_OFFEN')).not.toBeVisible();
  });

  test('Aktiver Tab "Fragen" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Fragen');
  });

  test('Tab-Badge zeigt 1 offene Frage', async ({ page }) => {
    await expect(page.getByTestId('tab-badge-fragen')).toHaveText('1');
  });

});

/** Zwei-Schritt: öffnen → absenden (Bestätigungsdialog). */
async function rueckfrageBeantworten(page: import('@playwright/test').Page, freitext?: string) {
  await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
  await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
  if (freitext) {
    await page.getByTestId('rq-antwort-textarea').fill(freitext);
  }
  await page.getByTestId('rq-antwort-absenden').click();
}

test.describe('US-AV-004 – Rückfrage beantworten (Interaktion)', () => {

  test('Bestätigungsdialog: öffnen, Frage zeigen, absenden → beantwortet', async ({ page }) => {
    await page.goto('/fall/rueckfragen');

    const openBtn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Bestätigung zeigt die Frage (was wird übermittelt?)
    const dialog = page.getByTestId('rq-bestaetigung');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Antwort bestätigen' })).toBeVisible();
    await expect(page.getByTestId('rq-bestaetigung-frage')).toContainText(
      'Arbeitgeberbescheinigung enthält kein Datum'
    );

    await page.getByTestId('rq-antwort-absenden').click();

    await expect(
      page.getByText('Beantwortet — die Sachbearbeitung wurde informiert')
    ).toBeVisible();
    await expect(openBtn).not.toBeVisible();
    // Beispielantwort erscheint als Quittung
    await expect(page.getByTestId('rq-antwort-quittung')).toBeVisible();
    await expect(page.getByTestId('rq-antwort-quittung')).toContainText(
      'Beschäftigungsaufnahme'
    );
  });

  test('Bestätigung abbrechen lässt Rückfrage offen', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await page.getByRole('button', { name: /Jetzt beantworten/i }).click();
    await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
    await page.getByTestId('rq-bestaetigung-abbrechen').click();
    await expect(page.getByTestId('rq-bestaetigung')).toHaveCount(0);
    await expect(page.getByText(/1 Frage braucht Ihre Antwort/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Jetzt beantworten/i })).toBeVisible();
  });

  test('Freitext-Antwort wird in der Quittung angezeigt', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page, 'Beschäftigungsaufnahme war der 15.01.2021.');
    await expect(page.getByTestId('rq-antwort-quittung')).toContainText(
      '15.01.2021'
    );
  });

  test('Nach Beantworten: Anzahl offener Fragen sinkt auf 0', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();
  });

  test('Nach Beantworten: Fallübersicht zeigt keinen Rückfrage-Banner mehr', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();

    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');

    await expect(
      page.getByRole('link', { name: /Frage jetzt beantworten/i })
    ).not.toBeVisible();
  });

  test('Statusänderung: Nach Beantworten wechselt Status auf "Wird geprüft"', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);

    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');

    await expect(page.getByText('Ihre Antwort wird erwartet')).not.toBeVisible();
    await expect(page.getByText('Wird geprüft').first()).toBeVisible();
  });

});
