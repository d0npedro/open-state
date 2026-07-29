/**
 * Unternehmensgründung (UG) E2E Tests
 *
 * Testet die Gründungsakte UG-2024-0117 quer durch alle Tabs:
 * Übersicht, Behörden, Unterlagen, Rückfragen, Verlauf
 */

import { test, expect } from '@playwright/test';

// ─── Übersicht ────────────────────────────────────────────────────────────────

test.describe('UG – Übersicht', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung');
  });

  test('Seitenheader zeigt "Meine Gewerbeanmeldung"', async ({ page }) => {
    await expect(page.getByText('Meine Gewerbeanmeldung')).toBeVisible();
  });

  test('Gewerbebezeichnung ist sichtbar', async ({ page }) => {
    await expect(page.getByText('IT-Beratung und Softwareentwicklung')).toBeVisible();
  });

  test('Action-Banner erscheint bei offener Rückfrage', async ({ page }) => {
    const banner = page.locator('.action-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Jetzt handeln');
  });

  test('Direktlink zur Rückfrage im Banner vorhanden', async ({ page }) => {
    const link = page.getByRole('link', { name: /Frage jetzt beantworten/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/gruendung/rueckfragen');
  });

  test('Status-Chip zeigt Klartext (kein interner Code)', async ({ page }) => {
    await expect(page.getByText('RUECKFRAGE_AUSSTEHEND')).not.toBeVisible();
    await expect(page.getByText('Ihre Antwort wird erwartet')).toBeVisible();
  });

  test('Fortschrittsbalken mit Prozentangabe sichtbar', async ({ page }) => {
    await expect(page.getByText(/%/).first()).toBeVisible();
  });

  test('Vertikale Schritteliste mit "Sie sind hier" sichtbar', async ({ page }) => {
    await expect(page.getByText('In Bearbeitung').first()).toBeVisible();
    await expect(page.getByText('Sie sind hier').first()).toBeVisible();
  });

  test('Vier Schnellzugriff-Kacheln vorhanden', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Behörden/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Unterlagen/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Offene Fragen/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Verlauf/i }).first()).toBeVisible();
  });

  test('Beteiligte Behörden-Übersicht sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('Finanzamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('IHK Musterregion').first()).toBeVisible();
  });

  test('5 Tabs in der Navigation vorhanden', async ({ page }) => {
    const tabs = page.locator('.tab-nav-item');
    await expect(tabs).toHaveCount(5);
  });

  test('Tab "Übersicht" ist aktiv hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Übersicht');
  });

  test('Kein Developer-Jargon sichtbar (keine Story-Badges)', async ({ page }) => {
    await expect(page.getByText('US-UG-001')).not.toBeVisible();
    await expect(page.getByText('Story geplant')).not.toBeVisible();
  });

  test('Demo-Hinweis sichtbar', async ({ page }) => {
    await expect(page.getByText(/Alle Daten sind fiktiv/).first()).toBeVisible();
  });

});

// ─── Tab-Navigation ───────────────────────────────────────────────────────────

test.describe('UG – Tab-Navigation', () => {

  test('Navigation zu Behörden', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Behörden' }).click();
    await expect(page).toHaveURL('/gruendung/behoerden');
    await expect(page.locator('.tab-nav-item.active')).toContainText('Behörden');
  });

  test('Navigation zu Unterlagen', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' }).click();
    await expect(page).toHaveURL('/gruendung/dokumente');
    await expect(page.locator('.tab-nav-item.active')).toContainText('Unterlagen');
  });

  test('Navigation zu Fragen', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Fragen' }).click();
    await expect(page).toHaveURL('/gruendung/rueckfragen');
  });

  test('Navigation zu Verlauf', async ({ page }) => {
    await page.goto('/gruendung');
    await page.locator('.tab-nav-item').filter({ hasText: 'Verlauf' }).click();
    await expect(page).toHaveURL('/gruendung/verlauf');
  });

  test('Navigation zurück zur Startseite', async ({ page }) => {
    await page.goto('/gruendung');
    await page.getByRole('link', { name: /Startseite/i }).click();
    await expect(page).toHaveURL('/');
  });

});

// ─── Behörden ─────────────────────────────────────────────────────────────────

test.describe('UG – Behörden & Verfahrensschritte', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/behoerden');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Behörden & Verfahrensschritte' })).toBeVisible();
  });

  test('Alle 4 Behörden sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('Finanzamt Musterstadt').first()).toBeVisible();
    await expect(page.getByText('IHK Musterregion').first()).toBeVisible();
    await expect(page.getByText(/BG ETEM/).first()).toBeVisible();
  });

  test('Verfahrensschritte mit Rechtsgrundlagen sichtbar', async ({ page }) => {
    await expect(page.getByText('Gewerbeanmeldung einreichen')).toBeVisible();
    await expect(page.getByText(/§ 14 GewO/).first()).toBeVisible();
  });

  test('Status-Chips für Behörden sichtbar', async ({ page }) => {
    await expect(page.locator('.status-chip').first()).toBeVisible();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RUECKFRAGE_OFFEN')).not.toBeVisible();
    await expect(page.getByText('NICHT_GESTARTET')).not.toBeVisible();
  });

  test('Aktiver Tab "Behörden" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Behörden');
  });

  test('CTA zur offenen Rückfrage des Finanzamts sichtbar', async ({ page }) => {
    const cta = page.getByTestId('behoerde-rueckfrage-cta-BEH-02');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Offene Rückfrage dieser Behörde');
    await expect(cta).toContainText('Kleinunternehmerregelung');
    const link = cta.getByRole('link', { name: /Frage beantworten|Offene Rückfrage von Finanzamt/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/gruendung\/rueckfragen#rq-RQ-01/);
  });

  test('CTA führt zur Rückfragen-Seite mit Anker', async ({ page }) => {
    const cta = page.getByTestId('behoerde-rueckfrage-cta-BEH-02');
    await cta.getByRole('link', { name: /Frage beantworten|Offene Rückfrage von Finanzamt/i }).click();
    await expect(page).toHaveURL(/\/gruendung\/rueckfragen#rq-RQ-01/);
    await expect(page.locator('#rq-RQ-01')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rückfragen der Behörden' })).toBeVisible();
  });

  test('Keine CTA bei Behörden ohne offene Rückfrage', async ({ page }) => {
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-01')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-03')).toHaveCount(0);
    await expect(page.getByTestId('behoerde-rueckfrage-cta-BEH-04')).toHaveCount(0);
  });

});

// ─── Unterlagen ───────────────────────────────────────────────────────────────

test.describe('UG – Unterlagen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/dokumente');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ihre Unterlagen' })).toBeVisible();
  });

  test('Fortschrittsanzeige sichtbar', async ({ page }) => {
    await expect(page.locator('.progress-bar-wrap')).toBeVisible();
  });

  test('Alle 4 Dokumente sichtbar', async ({ page }) => {
    await expect(page.getByText('Lichtbildausweis').first()).toBeVisible();
    await expect(page.getByText('Gewerbeanmeldeformular')).toBeVisible();
    await expect(page.getByText('Nachweis beruflicher Qualifikation')).toBeVisible();
    await expect(page.getByText('Fragebogen zur steuerlichen Erfassung')).toBeVisible();
  });

  test('Begründung für jedes Dokument sichtbar', async ({ page }) => {
    const boxes = page.locator('.notice-box');
    const count = await boxes.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('Upload-Zone für ausstehende Dokumente vorhanden', async ({ page }) => {
    const uploadZone = page.locator('.upload-zone').first();
    await expect(uploadZone).toBeVisible();
    const ariaLabel = await uploadZone.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('Kamera-Hinweis in Upload-Zone sichtbar', async ({ page }) => {
    await expect(page.getByText(/Handykamera/).first()).toBeVisible();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('ANGEFORDERT', { exact: true })).not.toBeVisible();
    await expect(page.getByText('IN_PRUEFUNG', { exact: true })).not.toBeVisible();
  });

  test('Aktiver Tab "Unterlagen" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Unterlagen');
  });

});

// ─── Rückfragen ───────────────────────────────────────────────────────────────

test.describe('UG – Rückfragen (Anzeige)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Rückfragen der Behörden' })).toBeVisible();
  });

  test('Fragetext sichtbar', async ({ page }) => {
    await expect(page.getByText('Kleinunternehmerregelung').first()).toBeVisible();
  });

  test('Begründung sichtbar (Warum fragt die Behörde das?)', async ({ page }) => {
    await expect(page.getByText('Warum fragt die Behörde das?')).toBeVisible();
  });

  test('Konsequenz sichtbar (Was passiert wenn nicht geantwortet?)', async ({ page }) => {
    await expect(page.getByText('Was passiert, wenn Sie nicht antworten?')).toBeVisible();
  });

  test('Frist sichtbar', async ({ page }) => {
    await expect(page.getByText('10.12.2024')).toBeVisible();
  });

  test('Zeitstempel "Gefragt am" sichtbar', async ({ page }) => {
    await expect(page.getByText(/Gefragt am 15.11.2024/)).toBeVisible();
  });

  test('Antwort-Button sichtbar und zugänglich', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('Antwort-Formular mit Label und Fristcountdown sichtbar', async ({ page }) => {
    await expect(page.getByLabel(/Ihre Antwort an/i)).toBeVisible();
    await expect(page.getByText(/Noch \d+ Tag/)).toBeVisible();
  });

  test('Kein interner Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RQ-01')).not.toBeVisible();
    await expect(page.getByText('RUECKFRAGE_AUSSTEHEND')).not.toBeVisible();
  });

  test('Aktiver Tab "Fragen" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Fragen');
  });

});

test.describe('UG – Rückfragen (Interaktion)', () => {

  test('Klick auf "Rückfrage beantworten" → Bestätigung erscheint', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    const btn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.getByText(/die Behörde wurde informiert/)).toBeVisible();
    await expect(btn).not.toBeVisible();
  });

  test('Freitext-Antwort wird nach Absenden angezeigt', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    const antwort = 'Demo: Kleinunternehmerregelung ja, Umsatz unter 22.000 Euro.';
    await page.getByLabel(/Ihre Antwort an/i).fill(antwort);
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await expect(page.getByText('Ihre übermittelte Antwort')).toBeVisible();
    await expect(page.getByText(antwort)).toBeVisible();
  });

  test('Nach Beantworten: Übersicht zeigt keinen Action-Banner mehr', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/gruendung');
    await expect(page.locator('.action-banner')).not.toBeVisible();
  });

  test('Nach Beantworten: Status wechselt zu "Wird bearbeitet"', async ({ page }) => {
    await page.goto('/gruendung/rueckfragen');
    await page.getByRole('button', { name: /Rückfrage beantworten/i }).click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page.getByText('Ihre Antwort wird erwartet')).not.toBeVisible();
    await expect(page.getByText('Wird bearbeitet').first()).toBeVisible();
  });

});

// ─── Verlauf ──────────────────────────────────────────────────────────────────

test.describe('UG – Verlauf', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/gruendung/verlauf');
  });

  test('Seitenüberschrift mit Transparenzversprechen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Verlauf Ihrer Akte' })).toBeVisible();
    await expect(page.getByText('unveränderlich dokumentiert')).toBeVisible();
  });

  test('Zeitstempel sichtbar', async ({ page }) => {
    await expect(page.getByText('01.11.2024, 09:14 Uhr').first()).toBeVisible();
  });

  test('Ereignistypen sichtbar', async ({ page }) => {
    await expect(page.getByText('Vorgang erstellt').first()).toBeVisible();
    await expect(page.getByText('Eingang bestätigt').first()).toBeVisible();
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
  });

  test('Akteure sichtbar', async ({ page }) => {
    await expect(page.getByText('Sie').first()).toBeVisible();
    await expect(page.getByText('Behörde').first()).toBeVisible();
  });

  test('Filter nach handelnder Stelle sichtbar', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await expect(group).toBeVisible();
    await expect(group.getByRole('button', { name: /Alle/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Sie/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /Behörde/i })).toBeVisible();
    await expect(group.getByRole('button', { name: /System/i })).toBeVisible();
  });

  test('Filter „Sie“ zeigt nur Gründer-Ereignisse', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /Sie/i }).click();
    await expect(group.getByRole('button', { name: /Sie/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Vorgang erstellt').first()).toBeVisible();
    await expect(page.getByText('Vorgang eingereicht').first()).toBeVisible();
    // Behörden-Ereignis muss ausgeblendet sein
    await expect(page.getByText('Rückfrage gestellt')).not.toBeVisible();
    await expect(page.getByText(/von \d+ Einträgen · Filter: Sie/)).toBeVisible();
  });

  test('Filter „Behörde“ blendet Gründer-Ereignisse aus', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /Behörde/i }).click();
    await expect(page.getByText('Rückfrage gestellt').first()).toBeVisible();
    await expect(page.getByText('Eingang bestätigt').first()).toBeVisible();
    await expect(page.getByText('Vorgang erstellt')).not.toBeVisible();
  });

  test('Filter „System“ zeigt Leerzustand ohne System-Events', async ({ page }) => {
    const group = page.getByRole('group', { name: /Verlauf filtern nach handelnder Stelle/i });
    await group.getByRole('button', { name: /System/i }).click();
    await expect(page.getByRole('status')).toContainText(/Keine System-Einträge|Noch keine System/i);
  });

  test('Kein interner Ereignis-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('vorgang_erstellt')).not.toBeVisible();
    await expect(page.getByText('GRUENDER')).not.toBeVisible();
  });

  test('Aktiver Tab "Verlauf" ist hervorgehoben', async ({ page }) => {
    await expect(page.locator('.tab-nav-item.active')).toContainText('Verlauf');
  });

});
