/**
 * US-AV-001 – Fall anlegen (demonstrierbare Kriterien)
 * US-AV-002 – Status einsehen
 *
 * Beide Stories teilen sich den /fall Screen.
 * Getestet werden die Akzeptanzkriterien, die im Demo-Umfang
 * tatsächlich implementiert und auf der Oberfläche sichtbar sind.
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-001 – Fall anlegen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall');
  });

  test('AC1: Fallnummer ist sichtbar', async ({ page }) => {
    // Die systemgenerierte Fallnummer muss sofort ohne Navigation sichtbar sein
    // .first() weil die ID sowohl im Header als auch in der Karte erscheint
    await expect(page.getByText('AV-2024-0042').first()).toBeVisible();
  });

  test('AC1: Falltyp wird angezeigt', async ({ page }) => {
    await expect(page.getByText('Arbeitslosengeld I – Erstantrag')).toBeVisible();
  });

  test('AC3: Nächste Schritte in Klarsprache sichtbar', async ({ page }) => {
    // Action-Banner enthält den nächsten Schritt; .first() weil Text auch in Fairness erscheint
    await expect(
      page.locator('.action-banner').getByText('Bitte beantworten Sie die offene Rückfrage')
    ).toBeVisible();
  });

  test('AC3: Einreichungsdatum angezeigt', async ({ page }) => {
    await expect(page.getByText('12. November 2024')).toBeVisible();
  });

});

test.describe('US-AV-002 – Status einsehen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall');
  });

  test('AC1: Status in Klartext – kein internes Kürzel RUECKFRAGE_OFFEN sichtbar', async ({ page }) => {
    // Interner Code darf NIE auf der Oberfläche erscheinen
    await expect(page.getByText('RUECKFRAGE_OFFEN')).not.toBeVisible();
    // Stattdessen muss ein verständlicher Text erscheinen
    await expect(page.getByText('Ihre Antwort wird erwartet')).toBeVisible();
  });

  test('AC2: Datum der letzten Aktivität ist sichtbar', async ({ page }) => {
    // Datum erscheint in mehreren Kontexten; mindestens einer muss sichtbar sein
    await expect(page.getByText('19. November 2024').first()).toBeVisible();
  });

  test('AC3: Nächster Schritt ist erklärt', async ({ page }) => {
    // Spezifisch im Action-Banner suchen
    await expect(
      page.locator('.action-banner').getByText('Rückfrage')
    ).toBeVisible();
  });

  test('AC4: Offene Aufgaben werden hervorgehoben angezeigt', async ({ page }) => {
    // Action-Banner muss als prominentes Element erscheinen
    const actionBanner = page.locator('.action-banner');
    await expect(actionBanner).toBeVisible();

    // Aufgabe "Rückfrage beantworten" im Banner
    await expect(actionBanner).toContainText('Jetzt handeln');
  });

  test('AC5: Statusbeschreibung ist vorhanden', async ({ page }) => {
    await expect(
      page.getByText('Ihr Antrag wird geprüft').first()
    ).toBeVisible();
  });

  test('AC6: Direkter Link zur Handlung vorhanden (Frage beantworten)', async ({ page }) => {
    // Bei offenem Status muss ein direkter Link zur Rückfrage-Ansicht existieren
    const actionLink = page.getByRole('link', { name: /Frage jetzt beantworten/i });
    await expect(actionLink).toBeVisible();
    await expect(actionLink).toHaveAttribute('href', '/fall/rueckfragen');
  });

  test('Fortschrittsanzeige in Prozent ist sichtbar', async ({ page }) => {
    // Bürger soll wissen, wie weit der Antrag ist
    await expect(page.getByText(/%/)).toBeVisible();
  });

  test('Fortschrittsschritte sind als vertikale Liste sichtbar', async ({ page }) => {
    await expect(page.getByText('Antrag erstellt')).toBeVisible();
    await expect(page.getByText('Sie sind hier')).toBeVisible();
  });

  test('Schnellzugriff-Kacheln für alle Bereiche vorhanden', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Unterlagen/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Fragen/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Nächster Termin/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Letzte Aktivität/i })).toBeVisible();
  });

  test('Navigation enthält alle Bereiche mit Icons', async ({ page }) => {
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' })).toBeVisible();
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' })).toBeVisible();
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Fragen' })).toBeVisible();
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Termine' })).toBeVisible();
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Bescheid' })).toBeVisible();
    await expect(page.locator('.tab-nav-item').filter({ hasText: 'Verlauf' })).toBeVisible();
  });

  test('Navigation: aktiver Tab ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toBeVisible();
    await expect(activeTab).toContainText('Übersicht');
  });

});
