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

/**
 * US-AV-007 / US-AV-004 – Antworttext im Verlauf lesbar (Quittungsblock)
 * Nach Beantworten erscheint der volle Wortlaut, nicht gekürzt mit „…“.
 */
test.describe('US-AV-007 – Antworttext in Timeline lesbar', () => {

  test('Freitext-Antwort erscheint ungekürzt im Verlauf-Quittungsblock', async ({ page }) => {
    const freitext =
      'Beschäftigungsaufnahme war der 15.01.2021. Zusätzlich: Probezeit endete am 15.04.2021 ohne Verlängerung.';

    await page.goto('/fall/rueckfragen');
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
    await page.getByTestId('rq-antwort-textarea').fill(freitext);
    await page.getByTestId('rq-antwort-absenden').click();
    await expect(page.getByTestId('rq-antwort-quittung')).toBeVisible();

    // Session-State: NIE page.goto nach Antwort — Layout-Provider remountet sonst
    const { goFallTab } = await import('./helpers/sessionNav');
    await goFallTab(page, 'Verlauf', /\/fall\/verlauf/);
    const block = page.getByTestId('timeline-antwort-block');
    await expect(block).toBeVisible();
    await expect(block).toContainText('Ihre übermittelte Antwort');
    await expect(block).toContainText('15.01.2021');
    await expect(block).toContainText('Probezeit endete am 15.04.2021');
    // Kein Truncation-Marker aus der früheren 80-Zeichen-Kürzung
    await expect(block).not.toContainText('…');
    await expect(page.getByText(/Antwort zur Rückfrage/i).first()).toBeVisible();
  });

});

/**
 * US-AV-007 / US-AV-008 / Q-191 – Fairness-Tiefenlink zum Verlauf-Ereignis
 * Parität UG Q-181: Sekundär-CTA „Im Verlauf ansehen“ → #ere-…
 */
test.describe('US-AV-007/008 – Fairness-Tiefenlink zum Verlauf', () => {

  test('Hinweise RQ: Im Verlauf ansehen führt zu E-010', async ({ page }) => {
    await page.goto('/fall/hinweise');
    const verlauf = page.getByTestId('hinweise-verlauf-cta-E-010');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/fall/verlauf#ere-E-010');
    await expect(verlauf).toContainText(/Im Verlauf ansehen/i);
    await verlauf.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-010/);
    const card = page.getByTestId('verlauf-ereignis-E-010');
    await expect(card).toBeVisible();
    await expect(card).toContainText(/Rückfrage gestellt/i);
    await expect(card).toContainText(/Arbeitgeberbescheinigung/i);
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

  test('Hinweise UNTERLAGE: Im Verlauf ansehen führt zu E-004', async ({ page }) => {
    await page.goto('/fall/hinweise');
    const verlauf = page.getByTestId('hinweise-verlauf-cta-E-004');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/fall/verlauf#ere-E-004');
    await verlauf.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-004/);
    const card = page.getByTestId('verlauf-ereignis-E-004');
    await expect(card).toBeVisible();
    await expect(card).toContainText(/Dokument angefordert/i);
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

  test('Übersicht Fairness: Tiefenlink RQ → E-010', async ({ page }) => {
    await page.goto('/fall');
    const verlauf = page.getByTestId('uebersicht-fairness-verlauf-E-010');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/fall/verlauf#ere-E-010');
    await verlauf.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-010/);
    await expect(page.getByTestId('verlauf-ereignis-E-010')).toBeVisible();
  });

  test('Ereignis-Anker #ere-E-010 für Fairness-Tiefenlink', async ({ page }) => {
    // Direkter Anker-Load (wie Browser nach Fairness-Klick mit Full-Navigation)
    await page.goto('/fall/verlauf#ere-E-010');
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-010/);
    const card = page.getByTestId('verlauf-ereignis-E-010');
    await expect(card).toBeVisible();
    await expect(page.locator('#ere-E-010')).toBeVisible();
    await expect(card).toContainText(/Rückfrage gestellt/i);
    await expect(card).toHaveAttribute('aria-current', 'location');
  });

});

/**
 * US-AV-007 / Q-105 – Upload-Ereignisse mit Dokumentbezeichnung hervorheben
 */
test.describe('US-AV-007 – Upload-Ereignisse mit Dokumentbezeichnung', () => {

  test('Mock-Uploads zeigen hervorgehobene Dokumentbezeichnung im Verlauf', async ({ page }) => {
    await page.goto('/fall/verlauf');
    const blocks = page.getByTestId('timeline-upload-block');
    // Mock: Personalausweis + Arbeitgeberbescheinigung
    await expect(blocks).toHaveCount(2);
    await expect(blocks.first()).toContainText('Eingereichtes Dokument');
    const names = page.getByTestId('timeline-upload-name');
    await expect(names).toHaveCount(2);
    await expect(page.getByTestId('timeline-upload-name').filter({ hasText: 'Personalausweis' })).toBeVisible();
    await expect(page.getByTestId('timeline-upload-name').filter({ hasText: 'Arbeitgeberbescheinigung' })).toBeVisible();
  });

  test('Session-Upload erscheint im Verlauf mit Dokumentbezeichnung (kein page.goto)', async ({ page }) => {
    await page.goto('/fall/dokumente');
    // Erstes ausstehendes Dokument (Einkommensteuerbescheid)
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    // Session: Upload-Button für dieses Dokument verschwindet / Status wechselt
    await expect(page.getByText(/Eingereicht am/i).first()).toBeVisible();

    const { goFallTab } = await import('./helpers/sessionNav');
    await goFallTab(page, 'Verlauf', /\/fall\/verlauf/);

    // Demo-Session-Banner + Upload-Block mit voller Bezeichnung (kein page.goto, DEC-012)
    await expect(page.getByText(/neues Ereignis/i).first()).toBeVisible();
    const sessionBlock = page.getByTestId('timeline-upload-block').filter({
      hasText: 'Einkommensteuerbescheid letztes Jahr',
    });
    await expect(sessionBlock).toBeVisible();
    await expect(sessionBlock).toContainText('Eingereichtes Dokument');
    await expect(sessionBlock.getByTestId('timeline-upload-name')).toHaveText(
      'Einkommensteuerbescheid letztes Jahr'
    );
  });

});
