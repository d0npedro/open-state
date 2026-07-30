/**
 * US-AV-004 – Rückfrage verstehen
 *
 * AC1: Vier Pflichtbestandteile je Rückfrage:
 *      (a) Inhalt der Anforderung
 *      (b) Begründung
 *      (c) Frist als konkretes Datum
 *      (d) Konsequenz bei Nichtantwort
 * AC4: Frist < 3 Tage visuell hervorgehoben
 * AC5: Zeitstempel (gestellt am)
 *
 * + Interaktionstest: Beantworten ändert den Zustand
 */

import { test, expect } from '@playwright/test';

test.describe('US-AV-004 – Rückfrage verstehen (Anzeige)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/fall/rueckfragen');
  });

  test('Seitenüberschrift verständlich', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Rückfragen der Behörde' })
    ).toBeVisible();
  });

  test('Anzahl offener Rückfragen wird angezeigt', async ({ page }) => {
    await expect(page.getByText(/1 Frage braucht Ihre Antwort/)).toBeVisible();
  });

  test('AC1a: Inhalt der Anforderung (Was wird gefragt?) sichtbar', async ({ page }) => {
    await expect(page.getByText('Was wird gefragt?')).toBeVisible();
    // Konkreter Fragetext aus den Mockdaten
    await expect(
      page.getByText('Ihre hochgeladene Arbeitgeberbescheinigung enthält kein Datum')
    ).toBeVisible();
  });

  test('AC1b: Begründung (Warum fragt die Behörde das?) sichtbar', async ({ page }) => {
    await expect(page.getByText('Warum fragt die Behörde das?')).toBeVisible();
    await expect(
      page.getByText(/Datum der Beschäftigungsaufnahme ist notwendig/)
    ).toBeVisible();
  });

  test('AC1c: Frist als konkretes Datum sichtbar', async ({ page }) => {
    // Datum erscheint in Karten-Frist und Live-Fairness-Signal — mind. ein Treffer
    await expect(page.getByText(/26\.\s*November 2024/).first()).toBeVisible();
    await expect(page.getByTestId('rq-seite-frist-RQ-001')).toContainText(/26\.\s*November 2024/);
  });

  test('AC1c: Anzahl verbleibender Tage sichtbar', async ({ page }) => {
    await expect(page.getByTestId('rq-seite-countdown-RQ-001')).toContainText(/Tag/i);
  });

  test('Frist-Countdown-Chip pro Rückfragekarte (Q-213)', async ({ page }) => {
    // RQ-001: fristDatum 2024-11-26 · FIKTIVES_HEUTE 2024-11-24 → noch 2 Tage
    // Parität UG Q-211 / Dokumente dok-seite-countdown / Übersicht Q-212
    await expect(page.getByTestId('rq-seite-frist-RQ-001')).toBeVisible();
    await expect(page.getByTestId('rq-seite-frist-RQ-001')).toContainText(/Antworten bis/i);
    await expect(page.getByTestId('rq-seite-frist-RQ-001')).toContainText(/26\.\s*November 2024/);
    await expect(page.getByTestId('rq-seite-countdown-RQ-001')).toContainText(/noch 2 Tage/i);
    await expect(page.getByTestId('rueckfrage-karte-RQ-001')).toBeVisible();
  });

  test('AC1d: Konsequenz bei Nichtantwort sichtbar', async ({ page }) => {
    await expect(
      page.getByText('Was passiert, wenn Sie nicht antworten?')
    ).toBeVisible();
    await expect(
      page.getByText(/Ohne diese Angabe kann die Leistungsberechnung nicht abgeschlossen werden/)
    ).toBeVisible();
  });

  test('AC5: Zeitstempel "Gestellt am" vorhanden', async ({ page }) => {
    await expect(page.getByText('Gefragt am 19. November 2024')).toBeVisible();
  });

  test('Antwort-Button ist sichtbar und zugänglich', async ({ page }) => {
    const button = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('Kein interner Status-Code sichtbar', async ({ page }) => {
    await expect(page.getByText('RQ-001')).not.toBeVisible();
    await expect(page.getByText('RUECKFRAGE_OFFEN')).not.toBeVisible();
  });

  test('Aktiver Tab "Fragen" ist hervorgehoben', async ({ page }) => {
    const activeTab = page.locator('.tab-nav-item.active');
    await expect(activeTab).toContainText('Fragen');
  });

  test('Tab-Badge zeigt 1 offene Frage', async ({ page }) => {
    await expect(page.getByTestId('tab-badge-fragen')).toHaveText('1');
  });

});

/** Zwei-Schritt: öffnen → absenden (Bestätigungsdialog). */
async function rueckfrageBeantworten(page: import('@playwright/test').Page, freitext?: string) {
  await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
  await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
  if (freitext) {
    await page.getByTestId('rq-antwort-textarea').fill(freitext);
  }
  await page.getByTestId('rq-antwort-absenden').click();
}

test.describe('US-AV-004 – Rückfrage beantworten (Interaktion)', () => {

  test('Bestätigungsdialog: öffnen, Frage zeigen, absenden → beantwortet', async ({ page }) => {
    await page.goto('/fall/rueckfragen');

    const openBtn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Bestätigung zeigt die Frage (was wird übermittelt?)
    const dialog = page.getByTestId('rq-bestaetigung');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Antwort bestätigen' })).toBeVisible();
    await expect(page.getByTestId('rq-bestaetigung-frage')).toContainText(
      'Arbeitgeberbescheinigung enthält kein Datum'
    );

    await page.getByTestId('rq-antwort-absenden').click();

    await expect(
      page.getByText('Beantwortet — die Sachbearbeitung wurde informiert')
    ).toBeVisible();
    await expect(openBtn).not.toBeVisible();
    // Beispielantwort erscheint als Quittung
    await expect(page.getByTestId('rq-antwort-quittung')).toBeVisible();
    await expect(page.getByTestId('rq-antwort-quittung')).toContainText(
      'Beschäftigungsaufnahme'
    );
  });

  test('Bestätigung abbrechen lässt Rückfrage offen', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    // Accessible name aus aria-label „Rückfrage beantworten: …“ (nicht sichtbarer Text allein)
    const openBtn = page.getByRole('button', { name: /Rückfrage beantworten/i });
    await openBtn.click();
    await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
    await page.getByTestId('rq-bestaetigung-abbrechen').click();
    await expect(page.getByTestId('rq-bestaetigung')).toHaveCount(0);
    await expect(page.getByText(/1 Frage braucht Ihre Antwort/)).toBeVisible();
    await expect(openBtn).toBeVisible();
  });

  test('Freitext-Antwort wird in der Quittung angezeigt', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page, 'Beschäftigungsaufnahme war der 15.01.2021.');
    await expect(page.getByTestId('rq-antwort-quittung')).toContainText(
      '15.01.2021'
    );
  });

  test('Nach Beantworten: Anzahl offener Fragen sinkt auf 0', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();
  });

  test('Nach Beantworten: Fallübersicht zeigt keinen Rückfrage-Banner mehr', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();

    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');

    await expect(
      page.getByRole('link', { name: /Frage jetzt beantworten/i })
    ).not.toBeVisible();
  });

  test('Statusänderung: Nach Beantworten wechselt Status auf "Wird geprüft"', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await rueckfrageBeantworten(page);

    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');

    await expect(page.getByText('Ihre Antwort wird erwartet')).not.toBeVisible();
    await expect(page.getByText('Wird geprüft').first()).toBeVisible();
  });

});

// ─── US-AV-008: Hinweise / RQ-Signal live nach Session-Antwort ─────────────

test.describe('US-AV-008 – Hinweise RQ-Frist live (Parität UNTERLAGE)', () => {

  test('Hinweise: RQ-Signal enthält berechnete Antwort-Frist', async ({ page }) => {
    // Mock: RQ-001 Frist 26.11. ggü. FIKTIVES_HEUTE 24.11. → noch 2 Tage
    await page.goto('/fall/hinweise');
    await expect(page.getByRole('heading', { name: 'Hinweise zur Verfahrenslage' })).toBeVisible();

    const signal = page.getByTestId('hinweise-signal-rueckfrage');
    await expect(signal).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-rueckfrage-titel')).toContainText(
      /Rückfrage offen – Frist noch 2 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-rueckfrage-erklaerung')).toContainText(
      /Antwortfrist endet am\s*26\.\s*November 2024\s*\(noch 2 Tage\)/i
    );
    await expect(page.getByTestId('hinweise-rq-cta')).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta')).toHaveAttribute(
      'href',
      '/fall/rueckfragen#rq-RQ-001'
    );
    await expect(page.getByTestId('hinweise-rq-cta-hint')).toContainText(
      /noch 2 Tage|26\.\s*November 2024/i
    );
  });

  test('Hinweise: RQ-Countdown-Chip am CTA (Q-214)', async ({ page }) => {
    // US-AV-004/008: Parität Widerspruch Q-205 + Karte Q-213
    // RQ-001 Frist 2024-11-26 · FIKTIVES_HEUTE 2024-11-24 → noch 2 Tage
    await page.goto('/fall/hinweise');
    const wrap = page.getByTestId('hinweise-rq-cta-wrap');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta-hint')).toContainText(
      /26\.\s*November 2024|noch 2 Tage/i
    );
    const chip = page.getByTestId('hinweise-rq-countdown-FH-RQ-001-FRIST');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 2 Tage/i);
    await page.getByTestId('hinweise-rq-cta').click();
    await expect(page).toHaveURL(/\/fall\/rueckfragen#rq-RQ-001/);
    await expect(page.locator('#rq-RQ-001')).toBeVisible();
  });

  test('Rückfragen-Seite: Live-Signal mit Frist und Link zur Verfahrenslage', async ({ page }) => {
    await page.goto('/fall/rueckfragen');
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toBeVisible();
    await expect(page.getByTestId('fairness-signal-rueckfrage-titel')).toContainText(
      /Frist noch 2 Tage/i
    );
    await expect(page.getByTestId('fairness-signal-rueckfrage-erklaerung')).toContainText(
      /26\.\s*November 2024/i
    );
    await expect(page.getByTestId('rq-hinweise-link')).toHaveAttribute('href', '/fall/hinweise');
  });

  test('Hinweise: nach Session-Antwort entfällt RQ-Signal', async ({ page }) => {
    // Kein page.goto nach State (DEC-012) — Session-Nav über Tabs + Link
    const { goFallTab } = await import('./helpers/sessionNav');

    await page.goto('/fall/rueckfragen');
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toBeVisible();
    await rueckfrageBeantworten(page);
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();

    await goFallTab(page, 'Übersicht', /\/fall$/);
    await page.getByTestId('uebersicht-fairness-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-rq-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toContainText(/Rückfrage/i);
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
    // UNTERLAGE bleibt offen (nur RQ beantwortet)
    await expect(page.getByTestId('hinweise-signal-unterlagen')).toBeVisible();
  });

});
