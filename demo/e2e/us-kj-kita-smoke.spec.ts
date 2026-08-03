/**
 * Kita E2E-Smoke (Q-401, Q-481) + Skip-Link (Q-471, Q-540+)
 *
 * Kern- und Erweiterungsrouten erreichbar, h1, DEC-004-Hinweis wo sichtbar.
 * Skip-Link → main#main-content auf Kern- und Erweiterungsrouten.
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

/** Q-481: Bedarfsplanung, Vorlage, Monatsbericht, Meldung */
const ERWEITERTE_ROUTEN = [
  {
    path: '/kita/bedarfsplanung',
    h1: /Bedarfsplanungsentwurf/i,
    dec004: true,
    label: 'Bedarfsplanung',
  },
  {
    path: '/kita/vorlage',
    h1: /Politische Vorlage/i,
    dec004: true,
    label: 'Gremienvorlage',
  },
  {
    path: '/kita/monatsbericht',
    h1: /Monatsbericht Oktober 2024/i,
    dec004: true,
    label: 'Monatsbericht',
  },
  {
    path: '/kita/meldung',
    h1: /Monatsmeldung prüfen und freigeben/i,
    dec004: true,
    label: 'Meldung freigeben',
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

test.describe('Kita E2E-Smoke – Erweiterungsrouten (Q-481)', () => {
  for (const route of ERWEITERTE_ROUTEN) {
    test(`${route.label}: erreichbar, h1, DEC-004`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.path);
      await expect(page.getByRole('heading', { level: 1, name: route.h1 }).first()).toBeVisible();
      if (route.dec004) {
        await expect(page.getByText(/DEC-004/).first()).toBeVisible();
      }
      await expect(page.getByText(/Kindertagesbetreuung/).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Transparenzbericht/i }).first()).toBeVisible();
    });
  }

  test('Tab-Navigation Erweiterungsrouten (Client-Nav)', async ({ page }) => {
    await page.goto('/kita/bedarfsplanung');
    await expect(
      page.getByRole('heading', { level: 1, name: /Bedarfsplanungsentwurf/i })
    ).toBeVisible();

    await page.getByRole('link', { name: /Gremienvorlage/i }).first().click();
    await expect(page).toHaveURL('/kita/vorlage');
    await expect(page.getByRole('heading', { level: 1, name: /Politische Vorlage/i })).toBeVisible();

    await page.getByRole('link', { name: /^Monatsbericht/i }).first().click();
    await expect(page).toHaveURL('/kita/monatsbericht');
    await expect(
      page.getByRole('heading', { level: 1, name: /Monatsbericht Oktober 2024/i })
    ).toBeVisible();

    await page.getByRole('link', { name: /Meldung freigeben/i }).first().click();
    await expect(page).toHaveURL('/kita/meldung');
    await expect(
      page.getByRole('heading', { level: 1, name: /Monatsmeldung prüfen und freigeben/i })
    ).toBeVisible();
  });
});

test.describe('Kita Skip-Link – Kernrouten (Q-471)', () => {
  test('Skip-Link Fokus auf /kita und /kita/lagebild', async ({ page }) => {
    // WCAG 2.4.1: Root-SkipLink + Kita-Layout main#main-content (tabIndex=-1)
    // Parität Q-451 (Fall) / Q-461 (stories/feedback) — kein Session-State
    async function assertSkipToMain(route: string, h1: RegExp) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: h1 }).first()).toBeVisible();

      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);

      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: /Zum Inhalt springen/i });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main-content');
      await skip.press('Enter');
      await expect(main).toBeFocused();
    }

    await assertSkipToMain('/kita', /Transparenzbericht Kindertagesbetreuung/i);
    await assertSkipToMain('/kita/lagebild', /Steuerungslagebild Kindertagesbetreuung/i);
  });
});

test.describe('Kita Skip-Link – Bedarfsplanung und Vorlage (Q-540)', () => {
  test('Skip-Link Fokus auf /kita/bedarfsplanung und /kita/vorlage', async ({ page }) => {
    // WCAG 2.4.1: Root-SkipLink + Kita-Layout main#main-content (tabIndex=-1); Parität Q-471
    async function assertSkipToMain(route: string, h1: RegExp) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: h1 }).first()).toBeVisible();

      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);

      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: /Zum Inhalt springen/i });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main-content');
      await skip.press('Enter');
      await expect(main).toBeFocused();
    }

    await assertSkipToMain('/kita/bedarfsplanung', /Bedarfsplanungsentwurf/i);
    await assertSkipToMain('/kita/vorlage', /Politische Vorlage/i);
  });
});
