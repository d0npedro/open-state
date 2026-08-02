/**
 * Kita öffentlicher Transparenzbericht – Filter + CSV (Q-422 / US-KJ-009)
 *
 * Planungsraum-Filter bedienbar; CSV-Download erreichbar und labeled.
 * Keine Session-Interaktion → page.goto ok.
 */

import { test, expect } from '@playwright/test';

test.describe('Kita Transparenzbericht – Filter & CSV (Q-422)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita');
    await expect(
      page.getByRole('heading', { level: 1, name: /Transparenzbericht Kindertagesbetreuung/i })
    ).toBeVisible();
  });

  test('Planungsraum-Filtergruppe und Raumauswahl Innenstadt', async ({ page }) => {
    // exact: Zeitreihe hat "… nach Planungsraum filtern"
    const filterGroup = page.getByRole('group', { name: 'Planungsraum filtern', exact: true });
    await expect(filterGroup).toBeVisible();

    await expect(filterGroup.getByRole('button', { name: /Alle Räume/i })).toBeVisible();
    const innenstadt = filterGroup.getByRole('button', { name: /Innenstadt/i });
    await expect(innenstadt).toBeVisible();
    await innenstadt.click();
    await expect(innenstadt).toHaveAttribute('aria-pressed', 'true');

    // Status und Detailkarte folgen dem Filter
    await expect(page.getByRole('status').filter({ hasText: /Gefiltert:\s*Innenstadt/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: /Innenstadt — Detail/i })
    ).toBeVisible();

    // Anderer Raum nicht als Detail-Überschrift
    await expect(
      page.getByRole('heading', { level: 3, name: /Nordwest — Detail/i })
    ).toHaveCount(0);
  });

  test('CSV-Download-Button erreichbar und labeled', async ({ page }) => {
    const csvBtn = page.getByRole('button', {
      name: /Transparenzbericht-Aggregate als CSV herunterladen/i,
    });
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();
    await expect(csvBtn).toHaveAttribute(
      'aria-label',
      /CSV herunterladen.*keine Kind- oder Personennamen/i
    );
    // Sichtbarer Button-Text
    await expect(csvBtn).toContainText(/CSV exportieren/i);

    // Filter-Gruppe am Export hat Label
    await expect(
      page.getByRole('group', { name: /CSV-Export-Filter Meldelücke/i })
    ).toBeVisible();
  });

  test('CSV-Download löst Datei-Download aus', async ({ page }) => {
    const csvBtn = page.getByRole('button', {
      name: /Transparenzbericht-Aggregate als CSV herunterladen/i,
    });

    const downloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await csvBtn.click();
    const download = await downloadPromise;
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.csv$/i);
    expect(name.toLowerCase()).toContain('transparenz');
  });
});
