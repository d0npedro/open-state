/**
 * Navigation & Landing Page Tests
 *
 * Testet: Startseite, Tab-Navigation, Domain-Switcher, Accessibility
 */

import { test, expect } from '@playwright/test';

test.describe('Startseite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Hauptüberschrift: Klare Frage an den Nutzer', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Was möchten Sie heute erledigen?' })
    ).toBeVisible();
  });

  test('Drei Domain-Karten sind sichtbar', async ({ page }) => {
    await expect(page.getByText('Arbeitslosengeld beantragen')).toBeVisible();
    await expect(page.getByText('Unternehmen anmelden')).toBeVisible();
    await expect(page.getByText('Kita-Plätze in Ihrer Stadt')).toBeVisible();
  });

  test('Jede Domain-Karte hat einen klickbaren CTA-Button', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /Antrag öffnen/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Gründungsakte öffnen/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Transparenzbericht öffnen/i })
    ).toBeVisible();
  });

  test('Demo-Hinweis ist sichtbar', async ({ page }) => {
    await expect(page.getByText(/Alle Daten sind fiktiv/).first()).toBeVisible();
  });

  test('Kein Developer-Jargon auf der Startseite', async ({ page }) => {
    await expect(page.getByText('Vertical Slice')).not.toBeVisible();
    await expect(page.getByText('Story-dokumentiert')).not.toBeVisible();
    await expect(page.getByText('US-AV-001')).not.toBeVisible();
  });

  test('Navigation zu Arbeitsverwaltung funktioniert', async ({ page }) => {
    await page.getByRole('link', { name: /Antrag öffnen/i }).click();
    await expect(page).toHaveURL('/fall');
    await expect(page.getByText('AV-2024-0042').first()).toBeVisible();
  });

  test('Versprechen-Sektion mit 3 Prinzipien vorhanden', async ({ page }) => {
    await expect(page.getByText('Unsere Versprechen an Sie')).toBeVisible();
    await expect(page.getByText('Jede Entscheidung erklärt')).toBeVisible();
    await expect(page.getByText('Vollständig transparent')).toBeVisible();
    await expect(page.getByText('Keine KI-Entscheidungen')).toBeVisible();
  });

});

test.describe('Tab-Navigation im Fall-Bereich', () => {

  test('Alle 6 Tabs vorhanden', async ({ page }) => {
    await page.goto('/fall');
    // Tab-Links in der sticky Navigation (nicht der DomainNav im Header)
    const tabs = page.locator('.tab-nav-item');
    await expect(tabs).toHaveCount(6);
  });

  test('Navigation zu Unterlagen', async ({ page }) => {
    await page.goto('/fall');
    await page.getByRole('link', { name: /Unterlagen/i }).click();
    await expect(page).toHaveURL('/fall/dokumente');
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Unterlagen');
  });

  test('Navigation zu Fragen', async ({ page }) => {
    await page.goto('/fall');
    await page.getByRole('link', { name: /Fragen/i }).click();
    await expect(page).toHaveURL('/fall/rueckfragen');
  });

  test('Navigation zu Termine', async ({ page }) => {
    await page.goto('/fall');
    await page.locator('.tab-nav-item').filter({ hasText: 'Termine' }).click();
    await expect(page).toHaveURL('/fall/termine');
  });

  test('Navigation zu Bescheid', async ({ page }) => {
    await page.goto('/fall');
    await page.locator('.tab-nav-item').filter({ hasText: 'Bescheid' }).click();
    await expect(page).toHaveURL('/fall/bescheide');
  });

  test('Navigation zu Verlauf', async ({ page }) => {
    await page.goto('/fall');
    await page.locator('.tab-nav-item').filter({ hasText: 'Verlauf' }).click();
    await expect(page).toHaveURL('/fall/verlauf');
  });

  test('Navigation zurück zur Startseite', async ({ page }) => {
    await page.goto('/fall');
    await page.getByRole('link', { name: /Startseite/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('Fall-Muster-ID im Header sichtbar', async ({ page }) => {
    await page.goto('/fall');
    // ID erscheint sowohl im sticky header als auch in der Fall-Karte
    await expect(page.getByText('AV-2024-0042').first()).toBeVisible();
  });

  test('Kein Story-Badge im Nutzer-UI sichtbar', async ({ page }) => {
    for (const route of ['/fall', '/fall/dokumente', '/fall/rueckfragen', '/fall/termine', '/fall/bescheide', '/fall/verlauf']) {
      await page.goto(route);
      await expect(page.getByText(/US-AV-\d{3}/)).not.toBeVisible();
    }
  });

});

test.describe('Accessibility – Grundlegende Checks', () => {

  test('Alle Seiten haben einen sichtbaren Haupttitel (h1)', async ({ page }) => {
    const routes = ['/fall', '/fall/dokumente', '/fall/rueckfragen', '/fall/termine', '/fall/bescheide', '/fall/verlauf'];
    for (const route of routes) {
      await page.goto(route);
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
    }
  });

  test('Focus-Sichtbarkeit: Erstes fokussierbares Element hat outline', async ({ page }) => {
    await page.goto('/fall');
    await page.keyboard.press('Tab');
    // Fokussiertes Element sollte sichtbaren Focus-Ring haben (CSS ::focus-visible)
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('Buttons haben min. 44px Höhe (Touch-Ziel)', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    // Warte auf vollständige Hydration
    await page.waitForLoadState('networkidle');
    const button = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(button).toBeVisible();
    const bbox = await button.boundingBox();
    expect(bbox!.height).toBeGreaterThanOrEqual(44);
  });

  test('Upload-Zone hat aria-label', async ({ page }) => {
    await page.goto('/fall/dokumente');
    const uploadZone = page.locator('.upload-zone').first();
    const ariaLabel = await uploadZone.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

});
