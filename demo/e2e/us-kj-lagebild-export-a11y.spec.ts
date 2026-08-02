/**
 * Kita Steuerungslagebild – Druck/CSV a11y (Q-460 / US-KJ-005)
 *
 * Export-Buttons erreichbar und mit zugänglichem Namen (DEC-004-Hinweis in aria-label).
 * Keine Session-Interaktion → page.goto ok.
 */

import { test, expect } from '@playwright/test';

test.describe('Kita Lagebild – Druck/CSV a11y (Q-460)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita/lagebild');
    await expect(
      page.getByRole('heading', { level: 1, name: /Steuerungslagebild Kindertagesbetreuung/i })
    ).toBeVisible();
  });

  test('Druck- und CSV-Buttons labeled und per Rolle findbar', async ({ page }) => {
    const druckBtn = page.getByRole('button', {
      name: /Steuerungslagebild drucken oder als PDF speichern/i,
    });
    await expect(druckBtn).toBeVisible();
    await expect(druckBtn).toBeEnabled();
    await expect(druckBtn).toHaveAttribute(
      'aria-label',
      /drucken oder als PDF speichern.*keine Kind- oder Personennamen/i
    );
    await expect(druckBtn).toContainText(/Drucken \/ als PDF speichern/i);
    await expect(druckBtn).toHaveAccessibleName(
      /Steuerungslagebild drucken oder als PDF speichern/i
    );

    const csvBtn = page.getByRole('button', {
      name: /Steuerungslagebild-Aggregate als CSV herunterladen/i,
    });
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();
    await expect(csvBtn).toHaveAttribute(
      'aria-label',
      /CSV herunterladen.*keine Kind- oder Personennamen/i
    );
    await expect(csvBtn).toContainText(/CSV exportieren/i);
    await expect(csvBtn).toHaveAccessibleName(
      /Steuerungslagebild-Aggregate als CSV herunterladen/i
    );
    await expect(page.getByTestId('kita-lagebild-csv-download')).toBeVisible();

    // Filtergruppe am Export hat Label
    await expect(
      page.getByRole('group', { name: /CSV-Export-Filter Meldelücke/i })
    ).toBeVisible();
  });

  test('CSV-Download löst Datei-Download aus', async ({ page }) => {
    const csvBtn = page.getByRole('button', {
      name: /Steuerungslagebild-Aggregate als CSV herunterladen/i,
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await csvBtn.click();
    const download = await downloadPromise;
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.csv$/i);
    expect(name.toLowerCase()).toMatch(/lagebild|steuerung|csv/);
  });
});
