/**
 * Kita Politische Vorlage – Druck/CSV a11y (Q-511 / US-KJ-008)
 *
 * Export-Buttons erreichbar und mit zugänglichem Namen (DEC-004 in aria-label).
 * Parität Bedarfsplanung Q-502 / Lagebild Q-460.
 * Keine Session-Interaktion → page.goto ok.
 */

import { test, expect } from '@playwright/test';

test.describe('Kita Vorlage – Druck/CSV a11y (Q-511)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita/vorlage');
    await expect(
      page.getByRole('heading', { level: 1, name: /Politische Vorlage/i })
    ).toBeVisible();
  });

  test('Druck- und CSV-Buttons labeled und per Rolle findbar', async ({ page }) => {
    const druckBtn = page.getByRole('button', {
      name: /Politische Vorlage drucken oder als PDF speichern/i,
    });
    await expect(druckBtn).toBeVisible();
    await expect(druckBtn).toBeEnabled();
    await expect(druckBtn).toHaveAttribute(
      'aria-label',
      /drucken oder als PDF speichern.*keine Kind- oder Personennamen/i
    );
    await expect(druckBtn).toContainText(/Drucken \/ als PDF speichern/i);
    await expect(druckBtn).toHaveAccessibleName(
      /Politische Vorlage drucken oder als PDF speichern/i
    );
    await expect(page.getByTestId('kita-vorlage-druck')).toBeVisible();

    const csvBtn = page.getByRole('button', {
      name: /Vorlage-Aggregate als CSV herunterladen/i,
    });
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();
    await expect(csvBtn).toHaveAttribute(
      'aria-label',
      /CSV herunterladen.*keine Kind- oder Personennamen/i
    );
    await expect(csvBtn).toContainText(/CSV exportieren/i);
    await expect(csvBtn).toHaveAccessibleName(
      /Vorlage-Aggregate als CSV herunterladen/i
    );
    await expect(page.getByTestId('kita-vorlage-csv-download')).toBeVisible();
  });

  test('CSV-Download löst Datei-Download aus', async ({ page }) => {
    const csvBtn = page.getByRole('button', {
      name: /Vorlage-Aggregate als CSV herunterladen/i,
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await csvBtn.click();
    const download = await downloadPromise;
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.csv$/i);
    expect(name.toLowerCase()).toMatch(/vorlage|csv/);
  });
});
