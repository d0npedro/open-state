/**
 * Kita Monatsbericht – Druck/CSV a11y (Q-512 / US-KJ-003)
 *
 * Export-Buttons erreichbar und mit zugänglichem Namen (DEC-004 in aria-label).
 * Parität Tagesstand Q-491 / Vorlage Q-511.
 * Keine Session-Interaktion → page.goto ok.
 */

import { test, expect } from '@playwright/test';

test.describe('Kita Monatsbericht – Druck/CSV a11y (Q-512)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita/monatsbericht');
    await expect(page.getByRole('heading', { level: 1, name: /Monatsbericht/i })).toBeVisible();
  });

  test('Druck- und CSV-Buttons labeled und per Rolle findbar', async ({ page }) => {
    const druckBtn = page.getByTestId('kita-monatsbericht-druck');
    await expect(druckBtn).toBeVisible();
    await expect(druckBtn).toBeEnabled();
    await expect(druckBtn).toHaveAttribute(
      'aria-label',
      /Monatsbericht.*drucken oder als PDF speichern.*keine Kind- oder Personennamen/i
    );
    await expect(druckBtn).toContainText(/Drucken \/ als PDF speichern/i);
    await expect(druckBtn).toHaveAccessibleName(
      /Monatsbericht drucken oder als PDF speichern/i
    );

    const csvBtn = page.getByTestId('kita-monatsbericht-csv-download');
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();
    await expect(csvBtn).toHaveAttribute(
      'aria-label',
      /Monatsbericht.*CSV herunterladen.*keine Kind- oder Personennamen/i
    );
    await expect(csvBtn).toContainText(/CSV exportieren/i);
    await expect(csvBtn).toHaveAccessibleName(/Monatsbericht als CSV herunterladen/i);

    // Per Rolle findbar (zugänglicher Name)
    await expect(
      page.getByRole('button', { name: /Monatsbericht drucken oder als PDF speichern/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Monatsbericht als CSV herunterladen/i }).first()
    ).toBeVisible();
  });

  test('CSV-Download löst Datei-Download aus', async ({ page }) => {
    const csvBtn = page.getByTestId('kita-monatsbericht-csv-download');
    const downloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await csvBtn.click();
    const download = await downloadPromise;
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.csv$/i);
    expect(name.toLowerCase()).toMatch(/monatsbericht|csv/);
  });
});
