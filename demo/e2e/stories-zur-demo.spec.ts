/**
 * /stories – „Zur Demo“-CTA pro Story mit Route (Q-411)
 * /stories – Domain-Sektionen a11y (Q-530)
 */

import { test, expect } from '@playwright/test';
import { storyRegistry } from '../data/storyRegistry';

test.describe('Story Coverage – Zur Demo (Q-411)', () => {
  test('jede Story mit route hat CTA Zur Demo und korrekten href', async ({ page }) => {
    await page.goto('/stories');
    await expect(page.getByRole('heading', { level: 1, name: /Story Coverage/i })).toBeVisible();

    const withRoute = storyRegistry.filter(s => Boolean(s.route));
    expect(withRoute.length).toBeGreaterThan(0);

    for (const story of withRoute) {
      const cta = page.getByTestId(`story-demo-cta-${story.id}`);
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', story.route!);
      await expect(cta).toContainText(/Zur Demo/i);
    }
  });

  test('CTA navigiert zur Demo-Route (Stichprobe US-AV-001)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-AV-001');
    await expect(cta).toHaveAttribute('href', '/fall');
    await cta.click();
    await expect(page).toHaveURL('/fall');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });
});

test.describe('Story Coverage – Domain-Sektionen a11y (Q-530)', () => {
  test('jede Domain-Sektion ist Landmark mit zugänglichem Namen (aria-labelledby)', async ({
    page,
  }) => {
    await page.goto('/stories');
    await expect(page.getByRole('heading', { level: 1, name: /Story Coverage/i })).toBeVisible();

    const domains = [...new Set(storyRegistry.map(s => s.domain))];
    expect(domains.length).toBeGreaterThanOrEqual(3);

    for (const domain of domains) {
      // region = section with accessible name
      const section = page.getByRole('region', { name: domain });
      await expect(section).toBeVisible();
      await expect(section).toHaveAttribute('aria-labelledby', /story-domain-/i);
      await expect(section.getByRole('heading', { level: 2, name: domain })).toBeVisible();
      await expect(page.getByTestId(`story-domain-section-${domain}`)).toBeVisible();
    }

    // Kern-Domänen explizit (Registry-Labels)
    await expect(page.getByRole('region', { name: /Arbeitsverwaltung/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /Unternehmensgründung/i })).toBeVisible();
    await expect(
      page.getByRole('region', { name: /Kita-Betrieb & Jugendamt-Steuerung/i })
    ).toBeVisible();
  });
});
