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
 * US-AV-007 / US-AV-004 / Q-192 – Session-Antwort im Verlauf + Tiefenlink von Rückfragen
 * Parität UG Q-185: Badge „Ihre Antwort“, data-session-antwort, #ere-E-DEMO-RQ-…
 */
test.describe('US-AV-007/004 – Session-Antwort Verlauf-Tiefenlink (Q-192)', () => {

  test('Nach Beantworten: Verlauf-Tiefenlink zur Session-Antwort', async ({ page }) => {
    // Quittung verlinkt auf Session-Ereignis; Hash-Hervorhebung + Badge im Verlauf
    // Kein page.goto nach State (DEC-012) – Link navigiert innerhalb des Layouts
    await page.goto('/fall/rueckfragen');
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
    await page.getByTestId('rq-antwort-absenden').click();

    await expect(page.getByTestId('rq-antwort-quittung-RQ-001')).toBeVisible();
    await expect(page.getByText(/die Sachbearbeitung wurde informiert/i)).toBeVisible();

    const verlaufLink = page.getByTestId('rq-verlauf-link-RQ-001');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-DEMO-RQ-RQ-001'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-RQ-RQ-001/);

    const card = page.getByTestId('verlauf-ereignis-E-DEMO-RQ-RQ-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(card).toContainText(/Rückfrage beantwortet/i);
    await expect(page.getByTestId('verlauf-session-antwort-badge-E-DEMO-RQ-RQ-001')).toBeVisible();
    await expect(page.getByTestId('verlauf-session-antwort-badge-E-DEMO-RQ-RQ-001')).toContainText(
      /Ihre Antwort/i
    );
  });

  test('Session-Antwort bleibt im Verlauf nach Tab-Nav (kein page.goto)', async ({ page }) => {
    const { goFallTab } = await import('./helpers/sessionNav');
    await page.goto('/fall/rueckfragen');
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await expect(page.getByTestId('rq-bestaetigung')).toBeVisible();
    await page.getByTestId('rq-antwort-absenden').click();
    await expect(page.getByTestId('rq-antwort-quittung-RQ-001')).toBeVisible();

    await goFallTab(page, 'Verlauf', /\/fall\/verlauf/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-RQ-RQ-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(page.getByTestId('verlauf-session-antwort-badge-E-DEMO-RQ-RQ-001')).toContainText(
      /Ihre Antwort/i
    );
    await expect(page.getByTestId('timeline-antwort-block')).toBeVisible();
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

  test('Übersicht BESCHEID: Zum Bescheid + Verlauf-Tiefenlink (Q-202)', async ({ page }) => {
    // US-AV-006/007: Parität Hinweise Q-201 — vorläufiger Bescheid auf Übersicht
    await page.goto('/fall');
    const block = page.getByTestId('uebersicht-fairness-FH-BESCHEID-VORLAEUFIG');
    await expect(block).toBeVisible();
    await expect(block).toContainText(/Vorläufiger Bescheid/i);

    const besCta = page.getByTestId('uebersicht-fairness-bes-cta-FH-BESCHEID-VORLAEUFIG');
    await expect(besCta).toBeVisible();
    await expect(besCta).toHaveAttribute('href', '/fall/bescheide#bes-BSC-001');

    const verlauf = page.getByTestId('uebersicht-fairness-verlauf-FH-BESCHEID-VORLAEUFIG');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/fall/verlauf#ere-E-007');
    await expect(verlauf).toContainText(/Im Verlauf ansehen/i);

    await verlauf.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-007/);
    const card = page.getByTestId('verlauf-ereignis-E-007');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toContainText(/zugestellt|Bescheid/i);
  });

  test('Übersicht BESCHEID: Widerspruchsfrist-Countdown-Chip (Q-206)', async ({ page }) => {
    // US-AV-006 AC3: Parität Hinweise Q-205 — Chip im Fairness-Block (nicht nur Kurzblock Q-204)
    // Ablauf 2024-12-16 · FIKTIVES_HEUTE 2024-11-24 → noch 22 Tage
    await page.goto('/fall');
    const block = page.getByTestId('uebersicht-fairness-FH-BESCHEID-VORLAEUFIG');
    await expect(block).toBeVisible();
    const chip = page.getByTestId(
      'uebersicht-fairness-widerspruch-countdown-FH-BESCHEID-VORLAEUFIG'
    );
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 22 Tage/i);
    // Fairness-Text enthält Resttage aus Regelwerk (Q-203)
    await expect(block).toContainText(/noch 22 Tage/i);
  });

  test('Übersicht BESCHEID: Zum Bescheid führt zu #bes-BSC-001', async ({ page }) => {
    await page.goto('/fall');
    await page.getByTestId('uebersicht-fairness-bes-cta-FH-BESCHEID-VORLAEUFIG').click();
    await expect(page).toHaveURL(/\/fall\/bescheide#bes-BSC-001/);
    await expect(page.locator('#bes-BSC-001')).toBeVisible();
    await expect(page.getByTestId('bescheid-karte-BSC-001')).toContainText(
      /Vorläufiger Leistungsbescheid/i
    );
  });

  test('Übersicht BESCHEID-Begründung: Unterlagen-CTA', async ({ page }) => {
    await page.goto('/fall');
    const block = page.getByTestId('uebersicht-fairness-FH-BSC-001-BEGRUENDUNG');
    await expect(block).toBeVisible();
    await expect(page.getByTestId('uebersicht-fairness-bes-cta-FH-BSC-001-BEGRUENDUNG')).toHaveAttribute(
      'href',
      '/fall/bescheide#bes-BSC-001'
    );
    await expect(page.getByTestId('uebersicht-fairness-unterlagen-cta-FH-BSC-001-BEGRUENDUNG')).toHaveAttribute(
      'href',
      '/fall/dokumente'
    );
    await expect(page.getByTestId('uebersicht-fairness-verlauf-FH-BSC-001-BEGRUENDUNG')).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-007'
    );
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

  test('Hinweise BESCHEID: Zum Bescheid + Verlauf-Tiefenlink E-007 (Q-201)', async ({ page }) => {
    // US-AV-006/007/008: BESCHEID_VORLAEUFIG → #bes-BSC-001 und #ere-E-007
    await page.goto('/fall/hinweise');
    const wrap = page.getByTestId('hinweise-bescheid-cta-wrap-FH-BESCHEID-VORLAEUFIG');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-bescheid-cta-hint-FH-BESCHEID-VORLAEUFIG')).toContainText(
      /Vorläufiger Bescheid|Widerspruchsfrist|Widerspruch/i
    );

    const besCta = page.getByTestId('hinweise-bescheid-cta-FH-BESCHEID-VORLAEUFIG');
    await expect(besCta).toBeVisible();
    await expect(besCta).toHaveAttribute('href', '/fall/bescheide#bes-BSC-001');

    const verlauf = wrap.getByTestId('hinweise-verlauf-cta-E-007');
    await expect(verlauf).toBeVisible();
    await expect(verlauf).toHaveAttribute('href', '/fall/verlauf#ere-E-007');
    await expect(verlauf).toContainText(/Im Verlauf ansehen/i);

    await verlauf.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-007/);
    const card = page.getByTestId('verlauf-ereignis-E-007');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toContainText(/zugestellt|Bescheid/i);
  });

  test('Hinweise BESCHEID: Widerspruchsfrist-Countdown-Chip (Q-205)', async ({ page }) => {
    // US-AV-006 AC3 / US-AV-008: Parität Bescheid Q-203 + Übersicht Q-204
    // Ablauf 2024-12-16 · FIKTIVES_HEUTE 2024-11-24 → noch 22 Tage
    await page.goto('/fall/hinweise');
    const wrap = page.getByTestId('hinweise-bescheid-cta-wrap-FH-BESCHEID-VORLAEUFIG');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-bescheid-cta-hint-FH-BESCHEID-VORLAEUFIG')).toContainText(
      /16\. Dezember 2024|noch 22 Tage/i
    );
    const chip = page.getByTestId('hinweise-widerspruch-countdown-FH-BESCHEID-VORLAEUFIG');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 22 Tage/i);
  });

  test('Hinweise BESCHEID: Zum Bescheid führt zum Anker #bes-BSC-001', async ({ page }) => {
    await page.goto('/fall/hinweise');
    await page.getByTestId('hinweise-bescheid-cta-FH-BESCHEID-VORLAEUFIG').click();
    await expect(page).toHaveURL(/\/fall\/bescheide#bes-BSC-001/);
    await expect(page.locator('#bes-BSC-001')).toBeVisible();
    await expect(page.getByTestId('bescheid-karte-BSC-001')).toContainText(
      /Vorläufiger Leistungsbescheid/i
    );
  });

  test('Hinweise BESCHEID-Begründung: Unterlagen-CTA und Verlauf', async ({ page }) => {
    await page.goto('/fall/hinweise');
    const wrap = page.getByTestId('hinweise-bescheid-cta-wrap-FH-BSC-001-BEGRUENDUNG');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-bescheid-unterlagen-cta-FH-BSC-001-BEGRUENDUNG')).toHaveAttribute(
      'href',
      '/fall/dokumente'
    );
    await expect(page.getByTestId('hinweise-bescheid-cta-FH-BSC-001-BEGRUENDUNG')).toHaveAttribute(
      'href',
      '/fall/bescheide#bes-BSC-001'
    );
    await expect(wrap.getByTestId('hinweise-verlauf-cta-E-007')).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-007'
    );
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
