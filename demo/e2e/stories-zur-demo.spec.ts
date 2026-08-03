/**
 * /stories – „Zur Demo“-CTA pro Story mit Route (Q-411 / Q-612)
 * /stories – Domain-Sektionen a11y (Q-530)
 *
 * Q-612: alle Registry-Einträge haben route; Pfade existieren; Stichproben AV/UG/KJ.
 */

import { test, expect } from '@playwright/test';
import { storyRegistry } from '../data/storyRegistry';

/** Bekannte App-Router-Pfade der Demo (ohne Hash). Hash-Anker optional an Registry-route. */
const KNOWN_DEMO_PATHS = new Set([
  '/',
  '/fall',
  '/fall/dokumente',
  '/fall/rueckfragen',
  '/fall/termine',
  '/fall/bescheide',
  '/fall/verlauf',
  '/fall/hinweise',
  '/gruendung',
  '/gruendung/dokumente',
  '/gruendung/rueckfragen',
  '/gruendung/behoerden',
  '/gruendung/verlauf',
  '/gruendung/hinweise',
  '/kita',
  '/kita/lagebild',
  '/kita/bedarfsplanung',
  '/kita/vorlage',
  '/kita/einrichtung',
  '/kita/tagesstand',
  '/kita/monatsbericht',
  '/kita/meldung',
  '/stories',
  '/feedback',
]);

function pathOnly(route: string): string {
  const q = route.indexOf('?');
  const h = route.indexOf('#');
  let end = route.length;
  if (q >= 0) end = Math.min(end, q);
  if (h >= 0) end = Math.min(end, h);
  return route.slice(0, end) || '/';
}

test.describe('Story Coverage – Zur Demo (Q-411 / Q-612)', () => {
  test('jede Story hat route und CTA Zur Demo mit korrektem href', async ({ page }) => {
    await page.goto('/stories');
    await expect(page.getByRole('heading', { level: 1, name: /Story Coverage/i })).toBeVisible();

    expect(storyRegistry.length).toBeGreaterThanOrEqual(24);

    for (const story of storyRegistry) {
      expect(story.route, `${story.id} muss route haben`).toBeTruthy();
      const path = pathOnly(story.route!);
      expect(
        KNOWN_DEMO_PATHS.has(path),
        `${story.id}: route-Pfad „${path}“ ist keine bekannte Demo-Seite`
      ).toBe(true);

      const cta = page.getByTestId(`story-demo-cta-${story.id}`);
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', story.route!);
      await expect(cta).toContainText(/Zur Demo/i);
    }

    // Keine „Noch kein Demo-Screen“-Platzhalter bei vollständiger Registry
    await expect(page.getByTestId(/story-demo-cta-missing-/)).toHaveCount(0);
  });

  test('CTA navigiert zur Demo-Route (Stichprobe AV US-AV-001)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-AV-001');
    await expect(cta).toHaveAttribute('href', '/fall');
    await cta.click();
    await expect(page).toHaveURL(/\/fall\/?$/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('CTA navigiert zur Demo-Route (Stichprobe UG US-UG-001)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-UG-001');
    await expect(cta).toHaveAttribute('href', '/gruendung');
    await cta.click();
    await expect(page).toHaveURL(/\/gruendung\/?$/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('CTA navigiert zur Demo-Route (Stichprobe KJ US-KJ-009)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-KJ-009');
    await expect(cta).toHaveAttribute('href', '/kita');
    await cta.click();
    await expect(page).toHaveURL(/\/kita\/?$/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('CTA mit Hash-Tiefenlink (Stichprobe US-KJ-006 Engpass)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-KJ-006');
    await expect(cta).toHaveAttribute('href', '/kita/lagebild#kita-lagebild-engpass');
    await cta.click();
    await expect(page).toHaveURL(/\/kita\/lagebild#kita-lagebild-engpass/);
    await expect(page.locator('#kita-lagebild-engpass')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Engpass-Rangliste/i })
    ).toBeVisible();
  });

  test('CTA mit Hash-Tiefenlink (Stichprobe US-KJ-010 Zeitreihe)', async ({ page }) => {
    await page.goto('/stories');
    const cta = page.getByTestId('story-demo-cta-US-KJ-010');
    await expect(cta).toHaveAttribute('href', '/kita#kita-transparenz-zeitreihe');
    await cta.click();
    await expect(page).toHaveURL(/\/kita#kita-transparenz-zeitreihe/);
    await expect(page.locator('#kita-transparenz-zeitreihe')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Entwicklung der letzten 12 Monate/i })
    ).toBeVisible();
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
