/**
 * US-AV-003 – Unterlagen nachreichen
 *
 * AC1: Anforderung zeigt: Dokument, Begründung, Frist, Format
 * AC3: Statusliste ANGEFORDERT / IN_PRUEFUNG / AKZEPTIERT / ABGELEHNT
 * AC5: Upload dem richtigen Fall zugeordnet (Upload-Zone vorhanden)
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-003 – Unterlagen nachreichen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/dokumente');
  });

  test('Seitenüberschrift ist verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ihre Unterlagen' })).toBeVisible();
  });

  test('Fortschrittsanzeige zeigt eingereichte / gesamt Unterlagen', async ({ page }) => {
    // "1 von 4 Unterlagen eingereicht" o.ä.
    await expect(page.getByText(/von \d+ Unterlagen/)).toBeVisible();
  });

  test('AC1: Alle vier Dokumente sind aufgeführt', async ({ page }) => {
    await expect(page.getByText('Arbeitgeberbescheinigung')).toBeVisible();
    await expect(page.getByText(/Personalausweis/)).toBeVisible();
    await expect(page.getByText('Einkommensteuerbescheid letztes Jahr')).toBeVisible();
    await expect(page.getByText('Formular SG1')).toBeVisible();
  });

  test('AC1: Jedes Dokument hat eine Begründung (Warum wird das benötigt?)', async ({ page }) => {
    const begründungen = page.getByText('Warum wird das benötigt?');
    await expect(begründungen.first()).toBeVisible();
    // Alle 4 Dokumente müssen eine Begründung haben
    await expect(begründungen).toHaveCount(4);
  });

  test('AC1: Frist ist für Pflichtdokumente sichtbar', async ({ page }) => {
    // Einkommensteuerbescheid + Formular SG1 haben Frist 3. Dezember 2024
    await expect(page.getByText('3. Dezember 2024').first()).toBeVisible();
  });

  test('AC1: Begründung für Arbeitgeberbescheinigung enthält Paragrafenreferenz', async ({ page }) => {
    await expect(page.getByText(/§ 312 SGB III/)).toBeVisible();
  });

  test('AC3: Status-Chip "Wird noch benötigt" für ANGEFORDERT Dokumente', async ({ page }) => {
    await expect(page.getByText('Wird noch benötigt').first()).toBeVisible();
  });

  test('AC3: Status-Chip "Wird geprüft" für IN_PRUEFUNG Dokument', async ({ page }) => {
    await expect(page.getByText('Wird geprüft')).toBeVisible();
  });

  test('AC3: Status-Chip "Akzeptiert" für AKZEPTIERT Dokument', async ({ page }) => {
    await expect(page.getByText('Akzeptiert')).toBeVisible();
  });

  test('AC3: Hochgeladensdatum für abgegebene Dokumente sichtbar', async ({ page }) => {
    await expect(page.getByText('14. November 2024')).toBeVisible();
    await expect(page.getByText('12. November 2024').first()).toBeVisible();
  });

  test('AC5: Upload-Zone für ausstehende Dokumente vorhanden', async ({ page }) => {
    const uploadZones = page.locator('.upload-zone');
    // 2 Dokumente haben Status ANGEFORDERT → 2 Upload-Zonen
    await expect(uploadZones).toHaveCount(2);
  });

  test('Upload-Zone enthält Hinweis auf Kamera (Handy-Upload)', async ({ page }) => {
    await expect(page.getByText(/Handykamera/i).first()).toBeVisible();
  });

  test('Upload-Zone enthält erlaubte Formate', async ({ page }) => {
    await expect(page.getByText(/PDF, JPG, PNG/i).first()).toBeVisible();
  });

  test('Kein Upload-Button für bereits akzeptierte Dokumente', async ({ page }) => {
    // Personalausweis ist AKZEPTIERT – darf KEINE Upload-Zone haben
    // Prüfen: weniger Upload-Zonen als Gesamt-Dokumente
    const uploadZones = page.locator('.upload-zone');
    const count = await uploadZones.count();
    expect(count).toBeLessThan(4);
  });

  test('Dringende Dokumente erscheinen zuerst (Sortierung nach Priorität)', async ({ page }) => {
    // ANGEFORDERT Dokumente sollen vor AKZEPTIERT erscheinen
    const allCards = page.locator('.card');
    const firstCardText = await allCards.first().textContent();
    // Das erste Dokument sollte ein ausstehendes sein
    expect(firstCardText).toContain('Wird noch benötigt');
  });

  test('Aktiver Tab "Unterlagen" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Unterlagen');
  });

});
