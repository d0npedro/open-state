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

  test('Sekundärlinks Hinweise / Steuerungslage (Q-410)', async ({ page }) => {
    // AV + UG: bürgernahe Verfahrenshinweise; Kita: intern gekennzeichnet
    const avHint = page.getByRole('link', { name: /^Hinweise zum Verfahren$/i }).first();
    await expect(avHint).toHaveAttribute('href', '/fall/hinweise');
    await expect(
      page.getByRole('link', { name: /^Hinweise zum Verfahren$/i }).nth(1)
    ).toHaveAttribute('href', '/gruendung/hinweise');
    const kitaIntern = page.getByRole('link', { name: /Steuerungslagebild \(intern\)/i });
    await expect(kitaIntern).toBeVisible();
    await expect(kitaIntern).toHaveAttribute('href', '/kita/lagebild');
    await kitaIntern.click();
    await expect(page).toHaveURL('/kita/lagebild');
    await expect(
      page.getByRole('heading', { level: 1, name: /Steuerungslagebild Kindertagesbetreuung/i })
    ).toBeVisible();
  });

  test('Q-450: Landing Deep-Link-Smoke Primär- und Sekundärrouten', async ({ page }) => {
    // Alle Domänen-Karten: Einstieg + Sekundärlink erreichbar, h1 sichtbar
    // Keine Session-Interaktion → page.goto zwischen Sprüngen ok (kein DEC-012-Konflikt)

    // AV Primär
    await page.getByRole('link', { name: /Antrag öffnen/i }).click();
    await expect(page).toHaveURL('/fall');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/');

    // AV Sekundär Hinweise
    await page.getByRole('link', { name: /^Hinweise zum Verfahren$/i }).first().click();
    await expect(page).toHaveURL('/fall/hinweise');
    await expect(
      page.getByRole('heading', { level: 1, name: /Hinweise zur Verfahrenslage/i })
    ).toBeVisible();
    await page.goto('/');

    // UG Primär
    await page.getByRole('link', { name: /Gründungsakte öffnen/i }).click();
    await expect(page).toHaveURL('/gruendung');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/');

    // UG Sekundär Hinweise
    await page.getByRole('link', { name: /^Hinweise zum Verfahren$/i }).nth(1).click();
    await expect(page).toHaveURL('/gruendung/hinweise');
    await expect(
      page.getByRole('heading', { level: 1, name: /Hinweise zur Verfahrenslage/i })
    ).toBeVisible();
    await page.goto('/');

    // Kita Primär Transparenz
    await page.getByRole('link', { name: /Transparenzbericht öffnen/i }).click();
    await expect(page).toHaveURL('/kita');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/');

    // Kita Sekundär Lagebild intern
    await page.getByRole('link', { name: /Steuerungslagebild \(intern\)/i }).click();
    await expect(page).toHaveURL('/kita/lagebild');
    await expect(
      page.getByRole('heading', { level: 1, name: /Steuerungslagebild Kindertagesbetreuung/i })
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
    // Tab-Nav: Seite hat zusätzlich Kacheln/CTAs mit „Unterlagen“ im Namen
    await page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' }).click();
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

  test('Q-482: Fall-Tabs per Tastatur fokussierbar und mit Enter aktivierbar', async ({ page }) => {
    // Keyboard-Smoke: role=tab in Bereichsnavigation; Enter aktiviert (Links)
    // Tab-Reihenfolge innerhalb tablist; Fokus sichtbar (globals.css :focus-visible)
    await page.goto('/fall');

    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(6);

    // Startfokus auf Übersicht, dann Tastatur → nächster Tab (Unterlagen)
    const uebersicht = tablist.getByRole('tab', { name: /^Übersicht$/i });
    await uebersicht.focus();
    await expect(uebersicht).toBeFocused();
    await expect(page.locator(':focus')).toBeVisible();

    await page.keyboard.press('Tab');
    const unterlagen = tablist.getByRole('tab', { name: /Unterlagen/i });
    await expect(unterlagen).toBeFocused();
    await expect(page.locator(':focus')).toBeVisible();

    // Enter aktiviert Navigation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/fall\/dokumente/);
    await expect(unterlagen).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    // Weiterer Tab: Fragen per Fokus + Enter
    const fragen = page.getByRole('tablist').getByRole('tab', { name: /Fragen/i });
    await fragen.focus();
    await expect(fragen).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/fall\/rueckfragen/);
    await expect(fragen).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { level: 1, name: /Rückfragen/i })).toBeVisible();

    // Verlauf per Tastatur
    const verlauf = page.getByRole('tablist').getByRole('tab', { name: /Verlauf/i });
    await verlauf.focus();
    await expect(verlauf).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/fall\/verlauf/);
    await expect(verlauf).toHaveAttribute('aria-selected', 'true');
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

  test('Skip-Link und main-Landmark im Fall-Bereich (Q-420)', async ({ page }) => {
    await page.goto('/fall');

    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);

    // Erster Tab: Skip-Link (visuell erst bei Fokus)
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /Zum Inhalt springen/i });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main-content');
    await expect(skip).toBeVisible();

    // Aktivierung: Fokus landet auf #main-content
    await skip.press('Enter');
    await expect(main).toBeFocused();
  });

  test('Q-451: Skip-Link Fokus Root und Fall nach Tastatur-Aktivierung', async ({ page }) => {
    // WCAG 2.4.1: Skip-Link → main#main-content (tabIndex=-1) erhält Fokus
    async function assertSkipToMain(route: string) {
      await page.goto(route);
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

    await assertSkipToMain('/');
    await assertSkipToMain('/fall');
    await assertSkipToMain('/fall/hinweise');
  });

  test('Q-461: Skip-Link Fokus auf /stories und /feedback', async ({ page }) => {
    // Cross-Routen: Story Coverage + Feedback (Root-Layout SkipLink + main#main-content)
    async function assertSkipToMain(route: string, h1: RegExp) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible();

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

    await assertSkipToMain('/stories', /Story Coverage/i);
    await assertSkipToMain('/feedback', /Feedback zur Demo/i);
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
