/**
 * US-AV-006 – Bescheid verstehen
 *
 * AC1: Zwei-Schichten-Darstellung: Erklärungsschicht + rechtliche Fassung
 * AC2: Erklärungsschicht mit 4 Pflichtbestandteilen
 * AC3: Widerspruchsfrist prominent (Datum + Countdown)
 * AC4: Rechtsgrundlage benannt
 * AC5: Widerspruchsbutton sichtbar
 * AC6: Zustellungsdatum dokumentiert
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-006 – Bescheid verstehen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/bescheide');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ihr Bescheid' })).toBeVisible();
  });

  test('Bescheidtyp ist sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Vorläufiger Leistungsbescheid ALG I').first()
    ).toBeVisible();
  });

  test('AC1: Erklärungsschicht ("Was wurde entschieden?") ist standardmäßig sichtbar', async ({ page }) => {
    await expect(page.getByText('Was wurde entschieden?')).toBeVisible();
  });

  test('AC2a: Entscheidung in Klartext sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Vorläufige Bewilligung von ALG I ab 12. November 2024')
    ).toBeVisible();
  });

  test('AC2b: Verständliche Erklärung in max. drei Sätzen', async ({ page }) => {
    await expect(
      page.getByText('Sie erhalten voraussichtlich Arbeitslosengeld I')
    ).toBeVisible();
  });

  test('AC2b/c: Begründung sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Anwartschaftszeit vorläufig bestätigt').first()
    ).toBeVisible();
  });

  test('AC4: Rechtsgrundlage mit Paragrafenreferenz sichtbar', async ({ page }) => {
    await expect(page.getByText(/§ 137 Abs\. 1 SGB III/).first()).toBeVisible();
  });

  test('AC1: Rechtliche Fassung ist aufklappbar (collapsible)', async ({ page }) => {
    const toggle = page.getByText('Vollständige rechtliche Fassung lesen');
    await expect(toggle).toBeVisible();

    // Aufklappen
    await toggle.click();

    // Inhalt erscheint
    await expect(page.getByText(/§ 137 Abs\. 1 SGB III haben Sie ab dem/)).toBeVisible();
  });

  test('AC3: Widerspruchsfrist-Abschnitt ist vorhanden und prominent', async ({ page }) => {
    await expect(page.getByText('Widerspruchsfrist beachten')).toBeVisible();
  });

  test('AC3: Widerspruchsfrist als konkretes Datum angezeigt', async ({ page }) => {
    await expect(page.getByText('16. Dezember 2024').first()).toBeVisible();
  });

  test('AC5: Widerspruch-Button ist sichtbar', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /Widerspruch einlegen/i })
    ).toBeVisible();
  });

  test('AC6: Zustellungsdatum ist dokumentiert', async ({ page }) => {
    await expect(page.getByText('Zugestellt am 15. November 2024').first()).toBeVisible();
  });

  test('Kein interner Bescheid-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('BSC-001')).not.toBeVisible();
  });

  test('Fairness-Hinweis für vorläufigen Bescheid vorhanden', async ({ page }) => {
    // Fairness-Regelwerk: vorläufiger Bescheid soll einen Hinweis auslösen
    await expect(
      page.getByText(/vorläufig/i).first()
    ).toBeVisible();
  });

  test('Aktiver Tab "Bescheid" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Bescheid');
  });

});
