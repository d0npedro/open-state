/**
 * /stories – „Zur Demo“-CTA pro Story mit Route (Q-411)
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
