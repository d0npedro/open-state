/**
 * Kita E2E-Smoke (Q-401)
 *
 * Kernrouten erreichbar, h1, DEC-004-Hinweis wo sichtbar.
 * Keine Session-Interaktion → page.goto je Test ok (DEC-012 gilt bei Session-Flows).
 */

import { test, expect } from '@playwright/test';

const KERNROUTEN = [
  {
    path: '/kita',
    h1: /Transparenzbericht Kindertagesbetreuung/i,
    dec004: true,
    label: 'Transparenzbericht (öffentlich)',
  },
  {
    path: '/kita/lagebild',
    h1: /Steuerungslagebild Kindertagesbetreuung/i,
    dec004: true,
    label: 'Steuerungslagebild',
  },
  {
    path: '/kita/einrichtung',
    h1: /Kita Sonnenwinkel/i,
    dec004: true,
    label: 'Einrichtung Belegung',
  },
  {
    path: '/kita/tagesstand',
    h1: /Tagesstand erfassen/i,
    dec004: true,
    label: 'Tagesstand',
  },
] as const;

test.describe('Kita E2E-Smoke – Kernrouten (Q-401)', () => {
  for (const route of KERNROUTEN) {
    test(`${route.label}: erreichbar, h1, DEC-004`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.path);
      await expect(page.getByRole('heading', { level: 1, name: route.h1 }).first()).toBeVisible();
      if (route.dec004) {
        await expect(page.getByText(/DEC-004/).first()).toBeVisible();
      }
      // Domain-Header und Tab-Nav
      await expect(page.getByText(/Kindertagesbetreuung/).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Transparenzbericht/i }).first()).toBeVisible();
    });
  }

  test('Landing → Transparenzbericht CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Transparenzbericht öffnen/i }).click();
    await expect(page).toHaveURL('/kita');
    await expect(
      page.getByRole('heading', { level: 1, name: /Transparenzbericht Kindertagesbetreuung/i })
    ).toBeVisible();
  });

  test('Tab-Navigation zwischen Kernrouten (Client-Nav)', async ({ page }) => {
    await page.goto('/kita');
    await page.getByRole('link', { name: /Steuerungslagebild/i }).first().click();
    await expect(page).toHaveURL('/kita/lagebild');
    await expect(
      page.getByRole('heading', { level: 1, name: /Steuerungslagebild Kindertagesbetreuung/i })
    ).toBeVisible();

    await page.getByRole('link', { name: /^Einrichtung/i }).first().click();
    await expect(page).toHaveURL('/kita/einrichtung');
    await expect(page.getByRole('heading', { level: 1, name: /Kita Sonnenwinkel/i })).toBeVisible();

    await page.getByRole('link', { name: /^Tagesstand/i }).first().click();
    await expect(page).toHaveURL('/kita/tagesstand');
    await expect(page.getByRole('heading', { level: 1, name: /Tagesstand erfassen/i })).toBeVisible();
  });
});
