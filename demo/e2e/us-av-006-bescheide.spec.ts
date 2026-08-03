/**
 * US-AV-006 – Bescheid verstehen
 *
 * AC1: Zwei-Schichten-Darstellung: Erklärungsschicht + rechtliche Fassung
 * AC2: Erklärungsschicht mit 4 Pflichtbestandteilen
 * AC3: Widerspruchsfrist prominent (Datum + Countdown)
 * AC4: Rechtsgrundlage benannt
 * AC5: Widerspruchsbutton sichtbar
 * AC6: Zustellungsdatum dokumentiert
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-006 – Bescheid verstehen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/bescheide');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ihr Bescheid' })).toBeVisible();
  });

  test('Bescheidtyp ist sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Vorläufiger Leistungsbescheid ALG I').first()
    ).toBeVisible();
  });

  test('AC1: Erklärungsschicht ("Was wurde entschieden?") ist standardmäßig sichtbar', async ({ page }) => {
    await expect(page.getByText('Was wurde entschieden?')).toBeVisible();
  });

  test('AC2a: Entscheidung in Klartext sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Vorläufige Bewilligung von ALG I ab 12. November 2024')
    ).toBeVisible();
  });

  test('AC2b: Verständliche Erklärung in max. drei Sätzen', async ({ page }) => {
    await expect(
      page.getByText('Sie erhalten voraussichtlich Arbeitslosengeld I')
    ).toBeVisible();
  });

  test('AC2b/c: Begründung sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Anwartschaftszeit vorläufig bestätigt').first()
    ).toBeVisible();
  });

  test('AC4: Rechtsgrundlage mit Paragrafenreferenz sichtbar', async ({ page }) => {
    await expect(page.getByText(/§ 137 Abs\. 1 SGB III/).first()).toBeVisible();
  });

  test('AC1: Rechtliche Fassung ist aufklappbar (collapsible)', async ({ page }) => {
    const toggle = page.getByText('Vollständige rechtliche Fassung lesen');
    await expect(toggle).toBeVisible();

    // Aufklappen
    await toggle.click();

    // Inhalt erscheint
    await expect(page.getByText(/§ 137 Abs\. 1 SGB III haben Sie ab dem/)).toBeVisible();
  });

  test('AC3: Widerspruchsfrist-Abschnitt ist vorhanden und prominent', async ({ page }) => {
    await expect(page.getByText('Widerspruchsfrist beachten')).toBeVisible();
    await expect(page.getByTestId('bescheid-widerspruch-BSC-001')).toBeVisible();
  });

  test('AC3: Widerspruchsfrist als konkretes Datum angezeigt', async ({ page }) => {
    await expect(page.getByTestId('bescheid-widerspruch-datum-BSC-001')).toContainText(
      '16. Dezember 2024'
    );
  });

  test('AC3: Widerspruchsfrist-Countdown ggü. FIKTIVES_HEUTE (Q-203)', async ({ page }) => {
    // Ablauf 2024-12-16 · FIKTIVES_HEUTE 2024-11-24 → noch 22 Tage (Parität RQ/Unterlagen)
    const countdown = page.getByTestId('bescheid-widerspruch-countdown-BSC-001');
    await expect(countdown).toBeVisible();
    await expect(countdown).toContainText(/noch 22 Tage/i);
    await expect(page.getByTestId('bescheid-widerspruch-countdown-zeile-BSC-001')).toContainText(
      /Fristende/i
    );
  });

  test('AC5: Widerspruch-Button ist sichtbar und erklärt den Schritt', async ({ page }) => {
    await expect(page.getByTestId('bescheid-widerspruch-button-BSC-001')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Widerspruch einlegen/i })
    ).toBeVisible();
    await expect(
      page.getByText(/formeller Antrag auf erneute Prüfung/i)
    ).toBeVisible();
  });

  test('Q-620: Widerspruch session-lokal – Quittung, kein alert, Verlauf-Tiefenlink', async ({
    page,
  }) => {
    // US-AV-006 UI-Zustand „Widerspruch eingereicht“ (Demo-Session, kein Formular-Backend)
    await expect(page.getByTestId('bescheid-widerspruch-button-BSC-001')).toBeVisible();
    await expect(page.getByTestId('bescheid-widerspruch-quittung-BSC-001')).toHaveCount(0);

    page.once('dialog', () => {
      throw new Error('Unerwarteter alert bei Widerspruch (soll Session-State sein)');
    });
    await page.getByTestId('bescheid-widerspruch-button-BSC-001').click();

    await expect(page.getByTestId('bescheid-widerspruch-quittung-BSC-001')).toBeVisible();
    await expect(page.getByText(/Ihr Widerspruch ist eingegangen/i)).toBeVisible();
    await expect(page.getByTestId('bescheid-widerspruch-button-BSC-001')).toHaveCount(0);

    // Demo-Session-Bar (Reset möglich)
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toBeVisible();

    const verlaufCta = page.getByTestId('bescheid-widerspruch-verlauf-BSC-001');
    await expect(verlaufCta).toBeVisible();
    await expect(verlaufCta).toHaveAttribute('href', '/fall/verlauf#ere-E-DEMO-WID-BSC-001');

    // Session-Nav: CTA klicken (kein page.goto nach Interaktion, DEC-012)
    await verlaufCta.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-WID-BSC-001/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-WID-BSC-001');
    await expect(card).toBeVisible();
    await expect(card).toContainText(/Widerspruch/i);
  });

  test('Q-620: Demo zurücksetzen stellt Widerspruch-Button wieder her', async ({ page }) => {
    await page.getByTestId('bescheid-widerspruch-button-BSC-001').click();
    await expect(page.getByTestId('bescheid-widerspruch-quittung-BSC-001')).toBeVisible();

    await page
      .getByRole('region', { name: /Demo-Session/i })
      .getByRole('button', { name: /Demo zurücksetzen/i })
      .click();

    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    await expect(page.getByTestId('bescheid-widerspruch-quittung-BSC-001')).toHaveCount(0);
    await expect(page.getByTestId('bescheid-widerspruch-button-BSC-001')).toBeVisible();
  });

  test('AC6: Zustellungsdatum ist dokumentiert', async ({ page }) => {
    await expect(page.getByText('Zugestellt am 15. November 2024').first()).toBeVisible();
  });

  test('Kein interner Bescheid-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('BSC-001')).not.toBeVisible();
  });

  test('Fairness-Hinweis für vorläufigen Bescheid vorhanden', async ({ page }) => {
    // Fairness-Regelwerk: vorläufiger Bescheid soll einen Hinweis auslösen
    await expect(
      page.getByText(/vorläufig/i).first()
    ).toBeVisible();
  });

  test('Q-200: Fairness-Signal mit Verlauf-Tiefenlink und Bescheid-Anker', async ({ page }) => {
    // US-AV-006/007: Fairness → #ere-E-007; Anker #bes-BSC-001
    const fairness = page.getByTestId('bescheid-fairness-FH-BESCHEID-VORLAEUFIG');
    await expect(fairness).toBeVisible();
    await expect(page.getByTestId('bescheid-fairness-titel-FH-BESCHEID-VORLAEUFIG')).toContainText(
      /Vorläufiger Bescheid/i
    );

    const besCta = page.getByTestId('bescheid-fairness-bes-cta-FH-BESCHEID-VORLAEUFIG');
    await expect(besCta).toBeVisible();
    await expect(besCta).toHaveAttribute('href', '#bes-BSC-001');

    // Zwei Fairness-Signale (vorläufig + Begründung) teilen denselben Verlauf-Anker E-007
    const verlaufCta = fairness.getByTestId('bescheid-verlauf-cta-E-007');
    await expect(verlaufCta).toBeVisible();
    await expect(verlaufCta).toHaveAttribute('href', '/fall/verlauf#ere-E-007');
    await expect(verlaufCta).toContainText(/Im Verlauf ansehen/i);
    await expect(page.getByTestId('bescheid-verlauf-cta-E-007')).toHaveCount(2);

    await verlaufCta.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-007/);
    const card = page.getByTestId('verlauf-ereignis-E-007');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toContainText(/zugestellt|Bescheid/i);
  });

  test('Q-207: Fairness BESCHEID_VORLAEUFIG Widerspruchsfrist-Countdown-Chip', async ({ page }) => {
    // US-AV-006: Parität Übersicht Q-206 / Hinweise Q-205 — Chip im Fairness-Panel
    // Ablauf 2024-12-16 · FIKTIVES_HEUTE 2024-11-24 → noch 22 Tage
    const chip = page.getByTestId(
      'bescheid-fairness-widerspruch-countdown-FH-BESCHEID-VORLAEUFIG'
    );
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 22 Tage/i);
    // Regelwerk-Text im naechsterSchritt (Q-203) + Chip konsistent
    await expect(
      page.getByTestId('bescheid-fairness-naechster-FH-BESCHEID-VORLAEUFIG')
    ).toContainText(/noch 22 Tage/i);
    // Begründung-Signal ohne eigenen Widerspruch-Chip
    await expect(
      page.getByTestId('bescheid-fairness-widerspruch-countdown-FH-BSC-001-BEGRUENDUNG')
    ).toHaveCount(0);
  });

  test('Q-200: Bescheid-Karte Anker und Zustellungs-Tiefenlink', async ({ page }) => {
    await expect(page.locator('#bes-BSC-001')).toBeVisible();
    await expect(page.getByTestId('bescheid-karte-BSC-001')).toBeVisible();

    const karteLink = page.getByTestId('bescheid-karte-verlauf-BSC-001');
    await expect(karteLink).toBeVisible();
    await expect(karteLink).toHaveAttribute('href', '/fall/verlauf#ere-E-007');
    await expect(karteLink).toContainText(/Zustellung im Verlauf ansehen/i);

    await karteLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-007/);
    await expect(page.getByTestId('verlauf-ereignis-E-007')).toBeVisible();
  });

  test('Aktiver Tab "Bescheid" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Bescheid');
  });

});
