/**
 * Kita Einrichtung Belegungsstand – Druck/CSV a11y (Q-480 / US-KJ-002)
 *
 * Export-Buttons erreichbar und mit zugänglichem Namen (DEC-004 in aria-label).
 * Parität Lagebild Q-460 / Transparenz Q-422.
 * Keine Session-Interaktion → page.goto ok.
 */

import { test, expect } from '@playwright/test';

test.describe('Kita Einrichtung – Druck/CSV a11y (Q-480)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita/einrichtung');
    await expect(page.getByRole('heading', { level: 1, name: /Kita Sonnenwinkel/i })).toBeVisible();
  });

  test('Druck- und CSV-Buttons labeled und per Rolle findbar', async ({ page }) => {
    const druckBtn = page.getByRole('button', {
      name: /Belegungsstand drucken oder als PDF speichern/i,
    });
    await expect(druckBtn).toBeVisible();
    await expect(druckBtn).toBeEnabled();
    await expect(druckBtn).toHaveAttribute(
      'aria-label',
      /drucken oder als PDF speichern.*keine Kind- oder Personennamen/i
    );
    await expect(druckBtn).toContainText(/Drucken \/ als PDF speichern/i);
    await expect(druckBtn).toHaveAccessibleName(
      /Belegungsstand drucken oder als PDF speichern/i
    );
    await expect(page.getByTestId('kita-einrichtung-druck')).toBeVisible();

    const csvBtn = page.getByRole('button', {
      name: /Belegungsstand-Aggregate als CSV herunterladen/i,
    });
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();
    await expect(csvBtn).toHaveAttribute(
      'aria-label',
      /CSV herunterladen.*keine Kind- oder Personennamen/i
    );
    await expect(csvBtn).toContainText(/CSV exportieren/i);
    await expect(csvBtn).toHaveAccessibleName(
      /Belegungsstand-Aggregate als CSV herunterladen/i
    );
    await expect(page.getByTestId('kita-einrichtung-csv-download')).toBeVisible();
  });

  test('CSV-Download löst Datei-Download aus', async ({ page }) => {
    const csvBtn = page.getByRole('button', {
      name: /Belegungsstand-Aggregate als CSV herunterladen/i,
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await csvBtn.click();
    const download = await downloadPromise;
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.csv$/i);
    expect(name.toLowerCase()).toMatch(/belegung|csv/);
  });
});
