/**
 * Kita Meldekette E2E (Q-402) — US-KJ-004 → US-KJ-005
 *
 * Session-Freigabe in /kita/meldung → Meldeeingang im Steuerungslagebild.
 * Nach Interaktion nur Client-Nav (DEC-012); Session liegt in localStorage.
 */

import { test, expect } from '@playwright/test';
import { goKitaNav } from './helpers/sessionNav';

const SESSION_KEY = 'os-kita-meldeeingang-session';

test.describe('Kita Meldekette – Freigabe → Meldeeingang (Q-402)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kita/meldung');
    await page.evaluate(key => localStorage.removeItem(key), SESSION_KEY);
    // Remount nach clear, damit UI ohne Alt-Session startet
    await page.goto('/kita/meldung');
  });

  test('Freigabe Meldung → Client-Nav Lagebild zeigt Session-Eingang Sonnenwinkel', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Monatsmeldung prüfen und freigeben/i })
    ).toBeVisible();
    // screen-only Meldeinhalt (print-only-Treffer vermeiden)
    await expect(
      page.locator('.no-print').getByText(/Kita Sonnenwinkel/).first()
    ).toBeVisible();

    await page.getByRole('button', { name: /Zur Freigabe/i }).click();
    await expect(page.getByRole('heading', { name: /Aktive Freigabe/i })).toBeVisible();

    await page
      .getByRole('checkbox', {
        name: /Ich habe den Meldeinhalt geprüft und gebe die Monatsmeldung/i,
      })
      .check();

    await page.getByRole('button', { name: /Jetzt freigeben und übermitteln/i }).click();

    // Erfolg: Freigabe protokolliert (screen); print-only-Doppel vermeiden
    await expect(page.getByText(/Freigabe protokolliert/i)).toBeVisible();
    // Q-622: Leerzustand nach Freigabe + Methodik
    await expect(page.getByTestId('meldung-freigabe-ruhezustand')).toBeVisible();
    await expect(page.getByTestId('meldung-freigabe-ruhezustand')).toContainText(
      /Keine weitere Freigabe-Handlung/i
    );
    await expect(page.getByTestId('meldung-freigabe-methodik')).toContainText(
      /ohne Interpolation|DEC-004/i
    );
    // Seite + SessionBar (Q-412) haben beide „Demo zurücksetzen“
    await expect(
      page.getByRole('region', { name: /Demo-Session/i }).getByRole('button', { name: /Demo zurücksetzen/i })
    ).toBeVisible();

    const stored = await page.evaluate(key => localStorage.getItem(key), SESSION_KEY);
    expect(stored).toBeTruthy();
    const payload = JSON.parse(stored!);
    expect(payload.einrichtungId).toBe('EINR-DEMO-01');
    expect(payload.freigabeId).toMatch(/^FG-/);

    // DEC-012: nach Interaktion Client-Nav, kein page.goto
    await goKitaNav(page, /Steuerungslagebild/i, /\/kita\/lagebild/);

    await expect(
      page.getByRole('heading', { level: 1, name: /Steuerungslagebild Kindertagesbetreuung/i })
    ).toBeVisible();

    // Meldeeingang-Panel (u. a. Planungsraum-Meldebeitrag hat denselben Titel)
    const sessionBanner = page.getByTestId('meldeeingang-session-neu');
    await expect(sessionBanner).toBeVisible();
    await expect(sessionBanner).toContainText(payload.freigabeId);
    await expect(sessionBanner).toContainText(
      /Freigabe von\s+Kita Sonnenwinkel ist im Lagebild angekommen/i
    );

    // Q-622: Session-Hinweis zur geschlossenen Meldelücke + Methodik
    await expect(page.getByTestId('meldeeingang-session-luecke-hinweis')).toBeVisible();
    await expect(page.getByTestId('meldeeingang-session-luecke-hinweis')).toContainText(
      /Meldelücke Kita Sonnenwinkel geschlossen/i
    );

    // Sonnenwinkel nicht mehr in der Lückenliste; verbleibende Lücken mit Methodik
    const lueckenBox = page.getByTestId('meldeeingang-luecken-liste');
    if (await lueckenBox.count()) {
      await expect(lueckenBox.getByText(/Kita Sonnenwinkel/)).toHaveCount(0);
      await expect(page.getByTestId('meldeeingang-luecken-methodik')).toContainText(
        /keine Interpolation|nicht mit Schätzwerten/i
      );
    }

    // Q-412: SessionBar nach Meldefreigabe (Parität AV/UG)
    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    await expect(sessionBar.getByRole('button', { name: /Demo zurücksetzen/i })).toBeVisible();
  });

  test('Q-412: Demo zurücksetzen entfernt Session-Eingang', async ({ page }) => {
    const { goKitaNav } = await import('./helpers/sessionNav');

    await page.getByRole('button', { name: /Zur Freigabe/i }).click();
    await page
      .getByRole('checkbox', {
        name: /Ich habe den Meldeinhalt geprüft und gebe die Monatsmeldung/i,
      })
      .check();
    await page.getByRole('button', { name: /Jetzt freigeben und übermitteln/i }).click();
    await expect(page.getByText(/Freigabe protokolliert/i)).toBeVisible();

    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    await sessionBar.getByRole('button', { name: /Demo zurücksetzen/i }).click();

    // Reload nach Reset – SessionBar und Meldeeingang-Session weg
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    const storedAfter = await page.evaluate(key => localStorage.getItem(key), SESSION_KEY);
    expect(storedAfter).toBeNull();

    await goKitaNav(page, /Steuerungslagebild/i, /\/kita\/lagebild/);
    await expect(page.getByText(/Neu im Meldeeingang \(Demo-Session\)/)).toHaveCount(0);
  });

  test('Q-442: Session-Reset auf Lagebild entfernt freigegebene Session-Meldung', async ({
    page,
  }) => {
    // Happy-Path: Freigabe → Client-Nav Lagebild (Session sichtbar) → DemoSessionBar Reset
    // → kein Session-Meldeeingang, Sonnenwinkel wieder Lücke (localStorage leer)
    await page.getByRole('button', { name: /Zur Freigabe/i }).click();
    await page
      .getByRole('checkbox', {
        name: /Ich habe den Meldeinhalt geprüft und gebe die Monatsmeldung/i,
      })
      .check();
    await page.getByRole('button', { name: /Jetzt freigeben und übermitteln/i }).click();
    await expect(page.getByText(/Freigabe protokolliert/i)).toBeVisible();

    const freigabeId = await page.evaluate(key => {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { freigabeId: string }).freigabeId : null;
    }, SESSION_KEY);
    expect(freigabeId).toBeTruthy();

    // DEC-012: Client-Nav nach Interaktion
    await goKitaNav(page, /Steuerungslagebild/i, /\/kita\/lagebild/);

    const sessionBanner = page
      .getByRole('status')
      .filter({ hasText: /Freigabe von\s+Kita Sonnenwinkel ist im Lagebild angekommen/i })
      .first();
    await expect(sessionBanner).toBeVisible();
    await expect(sessionBanner).toContainText(freigabeId!);

    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    // Kita-Reset löst reload aus (clear localStorage + Remount)
    await Promise.all([
      page.waitForLoadState('networkidle'),
      sessionBar.getByRole('button', { name: /Demo zurücksetzen/i }).click(),
    ]);

    await expect(page).toHaveURL(/\/kita\/lagebild/);
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    const storedAfter = await page.evaluate(key => localStorage.getItem(key), SESSION_KEY);
    expect(storedAfter).toBeNull();

    await expect(
      page
        .getByRole('status')
        .filter({ hasText: /Freigabe von\s+Kita Sonnenwinkel ist im Lagebild angekommen/i })
    ).toHaveCount(0);
    await expect(page.getByText(/Neu im Meldeeingang \(Demo-Session\)/)).toHaveCount(0);
    if (freigabeId) {
      await expect(page.getByText(freigabeId)).toHaveCount(0);
    }
    // Ausgangsstand: Sonnenwinkel wieder als offene Meldelücke
    await expect(
      page.locator('.notice-box-warn').getByText(/Kita Sonnenwinkel/)
    ).toBeVisible();
  });

  test('Ohne Freigabe: Sonnenwinkel bleibt Lücke im Meldeeingang', async ({ page }) => {
    await goKitaNav(page, /Steuerungslagebild/i, /\/kita\/lagebild/);
    await expect(page.getByText(/Neu im Meldeeingang \(Demo-Session\)/)).toHaveCount(0);
    await expect(
      page.locator('.notice-box-warn').getByText(/Kita Sonnenwinkel/)
    ).toBeVisible();
  });
});
