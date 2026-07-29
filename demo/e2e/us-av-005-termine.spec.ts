/**
 * US-AV-005 – Termin einsehen und verstehen
 *
 * AC1: Zweck in Klarsprache
 * AC2: Mitzubringende Unterlagen als konkrete Liste
 * AC3: Ort und Format eindeutig (persönlich mit Adresse / digital)
 * Q-092: session-lokale Terminbestätigung (Badge entfällt live)
 */

import { test, expect } from '@playwright/test';
import { goFallTab } from './helpers/sessionNav';

test.describe('US-AV-005 – Termin einsehen und verstehen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/termine');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Ihre Termine' })
    ).toBeVisible();
  });

  test('AC1: Zweck des Termins ist in Klarsprache angezeigt', async ({ page }) => {
    await expect(
      page.getByText('Erstgespräch mit persönlicher Ansprechpartnerin')
    ).toBeVisible();
  });

  test('Termin-Status "Ausstehend" ist sichtbar (unbestätigt → Tab-Badge)', async ({ page }) => {
    await expect(page.getByTestId('termin-status-T-001')).toContainText('Ausstehend');
    await expect(page.getByText('BESTAETIGT')).not.toBeVisible();
  });

  test('Tab-Badge Termine bei unbestätigtem Termin (Q-089)', async ({ page }) => {
    const badge = page.getByTestId('tab-badge-termine');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');
    await expect(page.getByRole('tab', { name: /Termine,\s*1 offen/i })).toBeVisible();
  });

  test('Q-092: Termin bestätigen → Status Bestätigt, Tab-Badge weg (session-nav)', async ({ page }) => {
    const badge = page.getByTestId('tab-badge-termine');
    await expect(badge).toBeVisible();
    await expect(page.getByTestId('termin-status-T-001')).toContainText('Ausstehend');

    await page.getByTestId('termin-bestaetigen-T-001').click();

    await expect(page.getByTestId('termin-status-T-001')).toContainText('Bestätigt');
    await expect(page.getByTestId('termin-bestaetigt-hinweis-T-001')).toBeVisible();
    await expect(page.getByTestId('termin-bestaetigen-T-001')).toHaveCount(0);
    await expect(badge).toHaveCount(0);

    // Session-State muss Tab-Wechsel überstehen (kein page.goto nach Interaktion)
    await goFallTab(page, /^Übersicht/, /\/fall\/?$/);
    await expect(page.getByTestId('tab-badge-termine')).toHaveCount(0);

    await goFallTab(page, /Termine/, /\/fall\/termine/);
    await expect(page.getByTestId('termin-status-T-001')).toContainText('Bestätigt');
    await expect(page.getByTestId('tab-badge-termine')).toHaveCount(0);
  });

  test('Q-196: Termin-Quittung mit Verlauf-Tiefenlink (US-AV-005/007)', async ({ page }) => {
    // Quittung verlinkt auf Session-Ereignis; Hash-Hervorhebung + Badge im Verlauf
    // Kein page.goto nach State (DEC-012)
    await page.getByTestId('termin-bestaetigen-T-001').click();

    await expect(page.getByTestId('termin-bestaetigt-quittung-T-001')).toBeVisible();
    await expect(page.getByTestId('termin-bestaetigt-hinweis-T-001')).toContainText(
      /Teilnahme bestätigt/i
    );
    await expect(page.getByTestId('termin-bestaetigt-text-T-001')).toContainText(
      /Erstgespräch mit persönlicher Ansprechpartnerin/i
    );

    const verlaufLink = page.getByTestId('termin-verlauf-link-T-001');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-DEMO-TERM-T-001'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-TERM-T-001/);

    const card = page.getByTestId('verlauf-ereignis-E-DEMO-TERM-T-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-termin', 'true');
    await expect(card).toContainText(/Termin bestätigt/i);
    await expect(page.getByTestId('verlauf-session-termin-badge-E-DEMO-TERM-T-001')).toBeVisible();
    await expect(page.getByTestId('verlauf-session-termin-badge-E-DEMO-TERM-T-001')).toContainText(
      /Ihre Bestätigung/i
    );
  });

  test('Q-196: Session-Terminbestätigung bleibt im Verlauf nach Tab-Nav', async ({ page }) => {
    await page.getByTestId('termin-bestaetigen-T-001').click();
    await expect(page.getByTestId('termin-bestaetigt-quittung-T-001')).toBeVisible();

    await goFallTab(page, 'Verlauf', /\/fall\/verlauf/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-TERM-T-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-session-termin', 'true');
    await expect(page.getByTestId('verlauf-session-termin-badge-E-DEMO-TERM-T-001')).toContainText(
      /Ihre Bestätigung/i
    );
  });

  test('Q-104: Übersicht-Kachel zeigt Termin-Status live nach Bestätigung', async ({ page }) => {
    // Initial: unbestätigt → Kachel auf Übersicht „Ausstehend“
    await goFallTab(page, /^Übersicht/, /\/fall\/?$/);
    const kachel = page.getByTestId('kachel-naechster-termin');
    await expect(kachel).toBeVisible();
    await expect(kachel).toContainText('3. Dezember 2024');
    await expect(page.getByTestId('kachel-termin-status')).toHaveText('Ausstehend');

    // Bestätigen auf Termine-Tab (Session bleibt)
    await goFallTab(page, /Termine/, /\/fall\/termine/);
    await page.getByTestId('termin-bestaetigen-T-001').click();
    await expect(page.getByTestId('termin-status-T-001')).toContainText('Bestätigt');

    // Zurück Übersicht: Kachel live „Bestätigt“ (kein page.goto)
    await goFallTab(page, /^Übersicht/, /\/fall\/?$/);
    await expect(page.getByTestId('kachel-naechster-termin')).toContainText('Bestätigt');
    await expect(page.getByTestId('kachel-termin-status')).toHaveText('Bestätigt');
    await expect(page.getByTestId('tab-badge-termine')).toHaveCount(0);
  });

  test('Q-197: Übersicht Termin-Quittung mit Verlauf-Tiefenlink', async ({ page }) => {
    // US-AV-005/007: nach Session-Bestätigung Quittung auf Übersicht + #ere-E-DEMO-TERM-…
    // Kein page.goto nach State (DEC-012)
    await page.getByTestId('termin-bestaetigen-T-001').click();
    await expect(page.getByTestId('termin-bestaetigt-quittung-T-001')).toBeVisible();

    await goFallTab(page, /^Übersicht/, /\/fall\/?$/);

    const quittung = page.getByTestId('termin-quittung');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('termin-quittung-titel')).toHaveText('Terminteilnahme bestätigt');
    await expect(page.getByTestId('termin-quittung-item-T-001')).toContainText(
      /Erstgespräch mit persönlicher Ansprechpartnerin/i
    );
    await expect(page.getByTestId('termin-quittung-item-T-001')).toContainText(/3\.\s*Dezember 2024/i);

    const verlaufLink = page.getByTestId('termin-quittung-verlauf-T-001');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-DEMO-TERM-T-001'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await expect(page.getByTestId('termin-quittung-termine-cta')).toHaveAttribute(
      'href',
      '/fall/termine'
    );

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-TERM-T-001/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-TERM-T-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-termin', 'true');
    await expect(page.getByTestId('verlauf-session-termin-badge-E-DEMO-TERM-T-001')).toContainText(
      /Ihre Bestätigung/i
    );
  });

  test('Datum des Termins klar sichtbar', async ({ page }) => {
    await expect(page.getByText('3. Dezember 2024')).toBeVisible();
  });

  test('Uhrzeit des Termins klar sichtbar', async ({ page }) => {
    await expect(page.getByText('10:00 Uhr')).toBeVisible();
  });

  test('AC3: Format "Persönlich" ist als Chip angezeigt', async ({ page }) => {
    await expect(page.locator('.status-chip').filter({ hasText: 'Persönlich' })).toBeVisible();
  });

  test('AC3: Vollständige Adresse ist sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Agentur für Arbeit, Schanzenstraße 24, Zimmer 204')
    ).toBeVisible();
  });

  test('AC2: Vorbereitung als Checkliste vorhanden', async ({ page }) => {
    await expect(page.getByText('Das bringen Sie bitte mit:')).toBeVisible();
  });

  test('AC2: Alle vier Vorbereitungspunkte aufgelistet', async ({ page }) => {
    await expect(page.getByText('Personalausweis mitbringen')).toBeVisible();
    await expect(page.getByText('Lebenslauf aktuell halten')).toBeVisible();
    await expect(
      page.getByText('Vorstellungen zu angestrebter Tätigkeit formulieren')
    ).toBeVisible();
    await expect(
      page.getByText('Fragen zu Ihrem Anspruch gerne mitbringen')
    ).toBeVisible();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('BESTAETIGT')).not.toBeVisible();
    await expect(page.getByText('PERSOENLICH')).not.toBeVisible();
  });

  test('Aktiver Tab "Termine" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Termine');
  });

  test('Terminüberschriften-Datum und Uhrzeit deutlich prominent', async ({ page }) => {
    // Datum und Zeit müssen als separate, klare Elemente erscheinen
    const datumLabel = page.getByText('Datum');
    const uhrzeitLabel = page.getByText('Uhrzeit');
    await expect(datumLabel).toBeVisible();
    await expect(uhrzeitLabel).toBeVisible();
  });

});
