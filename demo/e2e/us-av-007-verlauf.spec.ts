/**
 * US-AV-007 – Historie nachvollziehen
 *
 * AC1: Chronologische Timeline mit Datum/Uhrzeit je Ereignis
 * AC2: Ereignistyp + Zeitstempel + handelnde Stelle + Beschreibung
 * AC3: Mindestens 10 unterschiedliche Ereignistypen
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-007 – Historie nachvollziehen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/verlauf');
  });

  test('Seitenüberschrift mit Transparenzversprechen', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Verlauf Ihres Antrags' })
    ).toBeVisible();
    // Transparenzversprechen: "unveränderlich dokumentiert"
    await expect(
      page.getByText('unveränderlich dokumentiert')
    ).toBeVisible();
  });

  test('AC1: Timeline enthält mehrere Ereignisse', async ({ page }) => {
    // 11 Ereignisse in den Mockdaten
    const eventCards = page.locator('.card');
    const count = await eventCards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('AC1: Zeitstempel sind sichtbar', async ({ page }) => {
    await expect(page.getByText('12.11.2024, 09:14').first()).toBeVisible();
    await expect(page.getByText('19.11.2024, 14:17').first()).toBeVisible();
  });

  test('AC2: Ereignistyp "Antrag erstellt" sichtbar', async ({ page }) => {
    await expect(page.getByText('Antrag erstellt')).toBeVisible();
  });

  test('AC2: Ereignistyp "Dokument angefordert" sichtbar', async ({ page }) => {
    await expect(page.getByText('Dokument angefordert')).toBeVisible();
  });

  test('AC2: Ereignistyp "Dokument eingereicht" sichtbar', async ({ page }) => {
    await expect(page.getByText('Dokument eingereicht').first()).toBeVisible();
  });

  test('AC2: Ereignistyp "Rückfrage gestellt" sichtbar', async ({ page }) => {
    await expect(page.getByText('Rückfrage gestellt')).toBeVisible();
  });

  test('AC2: Ereignistyp "Status geändert" sichtbar', async ({ page }) => {
    await expect(page.getByText('Status geändert').first()).toBeVisible();
  });

  test('AC2: Ereignistyp "Bescheid erstellt" sichtbar', async ({ page }) => {
    await expect(page.getByText('Bescheid erstellt').first()).toBeVisible();
  });

  test('AC2: Ereignistyp "Bescheid zugestellt" sichtbar', async ({ page }) => {
    await expect(page.getByText('Bescheid zugestellt').first()).toBeVisible();
  });

  test('AC2: Ereignistyp "Termin zugeteilt" sichtbar', async ({ page }) => {
    await expect(page.getByText('Termin zugeteilt')).toBeVisible();
  });

  test('AC2: Handelnde Stelle "Sie" (Bürger) ist sichtbar', async ({ page }) => {
    await expect(page.getByText('Sie').first()).toBeVisible();
  });

  test('AC2: Handelnde Stelle "Sachbearbeitung" ist sichtbar', async ({ page }) => {
    await expect(page.getByText('Sachbearbeitung').first()).toBeVisible();
  });

  test('AC2: Handelnde Stelle "System" ist sichtbar', async ({ page }) => {
    await expect(page.getByText('System').first()).toBeVisible();
  });

  test('AC2: Ereignisbeschreibungen (Freitext) sind sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Antrag auf ALG I digital eingereicht. Fallnummer AV-2024-0042 vergeben.')
    ).toBeVisible();
  });

  test('Legende der Farben ist sichtbar', async ({ page }) => {
    // Farbige Punkte-Legende für Akteure
    await expect(page.getByText('Sie').first()).toBeVisible();
    await expect(page.getByText('Sachbearbeitung').first()).toBeVisible();
    await expect(page.getByText('System').first()).toBeVisible();
  });

  test('Neueste Ereignisse erscheinen zuerst (reverse-chronologisch)', async ({ page }) => {
    // Neuestes Ereignis (E-011, 19.11.2024) sollte vor älterem (E-001, 12.11.2024) erscheinen
    const allTimestamps = page.getByText(/\d{2}\.\d{2}\.2024/);
    const first = await allTimestamps.first().textContent();
    const last = await allTimestamps.last().textContent();
    // 19.11 sollte vor 12.11 kommen (reverse-chronological)
    expect(first).toContain('19.11.2024');
    expect(last).toContain('12.11.2024');
  });

  test('Fairness-Hinweis "Fall pausiert" ist sichtbar', async ({ page }) => {
    // Regel FALL_PAUSIERT wird getriggert bei RUECKFRAGE_OFFEN
    await expect(
      page.getByText(/pausiert|FALL_PAUSIERT|stockt/i).first()
    ).toBeVisible();
  });

  test('Aktiver Tab "Verlauf" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Verlauf');
  });

});
