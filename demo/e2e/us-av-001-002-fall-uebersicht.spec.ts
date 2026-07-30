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
    // .first(): Label erscheint im Status-Chip und im Fortschrittsschritt
    await expect(page.getByText('Ihre Antwort wird erwartet').first()).toBeVisible();
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

  test('Termin-Kachel zeigt Status Ausstehend (Q-104 initial)', async ({ page }) => {
    const kachel = page.getByTestId('kachel-naechster-termin');
    await expect(kachel).toBeVisible();
    await expect(kachel).toContainText('3. Dezember 2024');
    await expect(page.getByTestId('kachel-termin-status')).toHaveText('Ausstehend');
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

  test('Tab-Badges: offene Fragen, Unterlagen und Termine als Zähler sichtbar', async ({ page }) => {
    // Mock: 1 offene Rückfrage, 2 angeforderte Unterlagen, 1 unbestätigter Termin
    const fragenBadge = page.getByTestId('tab-badge-fragen');
    const unterlagenBadge = page.getByTestId('tab-badge-unterlagen');
    const termineBadge = page.getByTestId('tab-badge-termine');
    await expect(fragenBadge).toBeVisible();
    await expect(fragenBadge).toHaveText('1');
    await expect(unterlagenBadge).toBeVisible();
    await expect(unterlagenBadge).toHaveText('2');
    await expect(termineBadge).toBeVisible();
    await expect(termineBadge).toHaveText('1');
    // Tabs mit Handlungsbedarf tragen Zähler im accessible name
    await expect(page.getByRole('tab', { name: /Fragen,\s*1 offen/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Unterlagen,\s*2 offen/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Termine,\s*1 offen/i })).toBeVisible();
  });

  test('Fristen-Countdown offener Unterlagen auf Übersicht (Q-086)', async ({ page }) => {
    // FIKTIVES_HEUTE 2024-11-24, Frist 2024-12-03 → noch 9 Tage
    const block = page.getByTestId('dok-fristen-uebersicht');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: /Fristen offener Unterlagen/i })).toBeVisible();
    await expect(page.getByTestId('dok-frist-DOK-003')).toBeVisible();
    await expect(page.getByTestId('dok-frist-DOK-004')).toBeVisible();
    await expect(page.getByTestId('dok-frist-countdown-DOK-003')).toContainText(/noch 9 Tage/i);
    await expect(page.getByTestId('dok-frist-countdown-DOK-004')).toContainText(/noch 9 Tage/i);
    // Schnellzugriff-Kachel Unterlagen zeigt Countdown der nächsten Frist
    await expect(page.getByRole('link', { name: /Unterlagen/i }).first()).toContainText(/noch 9 Tage/i);
  });

  test('Widerspruchsfrist-Countdown auf Übersicht (Q-204)', async ({ page }) => {
    // Ablauf 2024-12-16 · FIKTIVES_HEUTE 2024-11-24 → noch 22 Tage (Parität Bescheid Q-203)
    const block = page.getByTestId('widerspruch-frist-uebersicht');
    await expect(block).toBeVisible();
    await expect(block.getByRole('heading', { name: /Widerspruchsfrist/i })).toBeVisible();
    await expect(page.getByTestId('widerspruch-frist-BSC-001')).toContainText(/16\. Dezember 2024/i);
    await expect(page.getByTestId('widerspruch-frist-countdown-BSC-001')).toContainText(/noch 22 Tage/i);

    const kachel = page.getByTestId('kachel-bescheid');
    await expect(kachel).toBeVisible();
    await expect(kachel).toHaveAttribute('href', '/fall/bescheide');
    await expect(page.getByTestId('kachel-bescheid-countdown')).toContainText(/noch 22 Tage/i);

    const cta = page.getByTestId('widerspruch-frist-bes-cta');
    await expect(cta).toHaveAttribute('href', '/fall/bescheide#bes-BSC-001');
    await cta.click();
    await expect(page).toHaveURL(/\/fall\/bescheide#bes-BSC-001/);
    await expect(page.locator('#bes-BSC-001')).toBeVisible();
  });

  test('Tab-Badge Fragen entfällt nach Beantworten (Client-Navigation)', async ({ page }) => {
    await page.locator('.tab-nav-item').filter({ hasText: 'Fragen' }).click();
    await expect(page).toHaveURL(/\/fall\/rueckfragen/);
    // Accessible name: aria-label „Rückfrage beantworten: …“; sichtbarer Text „Jetzt beantworten“
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();
    // Badge-Fragen muss live verschwinden; Unterlagen bleibt
    await expect(page.getByTestId('tab-badge-fragen')).toHaveCount(0);
    await expect(page.getByTestId('tab-badge-unterlagen')).toHaveText('2');
  });

  test('Nach Rückfrage-Antwort: Fortschritt bleibt stabil und zeigt Unterlagen-Phase', async ({ page }) => {
    // Initial: RUECKFRAGE_OFFEN → Fortschritt ~57 % (Schritt 4/7), nie 0 %
    await expect(page.getByText(/57\s*%|%/).first()).toBeVisible();
    const before = await page.locator('.progress-bar-fill').getAttribute('style');
    expect(before).toMatch(/width:\s*5[0-9]%/);

    // Demo: Rückfrage beantworten (Bestätigung) → Status UNTERLAGEN_FEHLEN
    // Client-Navigation (Tab), damit DemoStateProvider den Session-State behält
    await page.locator('.tab-nav-item').filter({ hasText: 'Fragen' }).click();
    await expect(page).toHaveURL(/\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');

    // Fortschritt darf nicht auf 0 % kollabieren (Bug: Status nicht in statusFlow)
    const after = await page.locator('.progress-bar-fill').getAttribute('style');
    expect(after).toMatch(/width:\s*5[0-9]%/);
    await expect(page.getByText('Unterlagen fehlen noch')).toBeVisible();
    await expect(page.getByText('Sie sind hier')).toBeVisible();
    // Primärer CTA im Action-Banner (Fristen-Karte hat denselben Linktext)
    await expect(
      page.locator('.action-banner').getByRole('link', { name: /Unterlagen hochladen/i })
    ).toBeVisible();
  });

  test('Q-198: Übersicht RQ-Quittung mit Verlauf-Tiefenlink', async ({ page }) => {
    // US-AV-004/007: nach Session-Antwort Quittung auf Übersicht + #ere-E-DEMO-RQ-…
    // Kein page.goto nach State (DEC-012)
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();
    await expect(page.getByTestId('rq-antwort-quittung-RQ-001')).toBeVisible();

    await goFallTab(page, 'Übersicht', /\/fall$/);

    const quittung = page.getByTestId('rq-quittung');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('rq-quittung-titel')).toHaveText('Antwort übermittelt');
    await expect(page.getByTestId('rq-quittung-item-RQ-001')).toContainText(
      /Arbeitgeberbescheinigung/i
    );
    await expect(page.getByTestId('rq-quittung-item-RQ-001')).toContainText(
      /beantwortet am 24\.\s*November 2024/i
    );

    const verlaufLink = page.getByTestId('rq-quittung-verlauf-RQ-001');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-DEMO-RQ-RQ-001'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await expect(page.getByTestId('rq-quittung-fragen-cta')).toHaveAttribute(
      'href',
      '/fall/rueckfragen'
    );
    await expect(page.getByTestId('rq-quittung-unterlagen-cta')).toHaveAttribute(
      'href',
      '/fall/dokumente'
    );

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-RQ-RQ-001/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-RQ-RQ-001');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-antwort', 'true');
    await expect(page.getByTestId('verlauf-session-antwort-badge-E-DEMO-RQ-RQ-001')).toContainText(
      /Ihre Antwort/i
    );
  });

  test('Nach allen Bürger-Aktionen: Ruhezustand-Banner sichtbar', async ({ page }) => {
    // Client-Navigation: DemoState liegt im Fall-Layout und geht bei page.goto() verloren
    await page.locator('.tab-nav-item').filter({ hasText: 'Fragen' }).click();
    await expect(page).toHaveURL(/\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();
    await page.locator('.tab-nav-item').filter({ hasText: 'Unterlagen' }).click();
    await expect(page).toHaveURL(/\/fall\/dokumente/);
    // Beide ausstehenden Unterlagen als hochgeladen markieren
    const uploadButtons = page.getByRole('button', { name: /Als hochgeladen markieren/i });
    const count = await uploadButtons.count();
    for (let i = 0; i < count; i++) {
      await uploadButtons.nth(0).click();
    }
    await page.locator('.tab-nav-item').filter({ hasText: 'Übersicht' }).click();
    await expect(page).toHaveURL('/fall');
    await expect(page.getByTestId('ruhezustand-banner')).toBeVisible();
    await expect(page.getByText('Kein Handeln von Ihnen erforderlich')).toBeVisible();
    await expect(page.locator('.action-banner')).toHaveCount(0);
    // Upload-Quittung listet Session-Uploads und meldet Vollständigkeit
    await expect(page.getByTestId('upload-quittung')).toBeVisible();
    await expect(page.getByTestId('upload-quittung-vollstaendig')).toContainText(
      /Alle angeforderten Unterlagen liegen vor/i
    );
    await expect(page.getByTestId('upload-quittung-naechste')).toHaveCount(0);
  });

  test('Nach Session-Upload: Übersicht zeigt Quittung und nächste offene Unterlage', async ({ page }) => {
    // US-AV-002/003: nach Teil-Upload muss klar sein, was einging und was noch fehlt
    // Kein page.goto nach State-Interaktion (DEC-012)
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    // Erstes ausstehendes Dokument (Einkommensteuerbescheid)
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    await expect(page.getByText(/Eingereicht am/i).first()).toBeVisible();

    await goFallTab(page, 'Übersicht', /\/fall$/);

    const quittung = page.getByTestId('upload-quittung');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('upload-quittung-titel')).toHaveText('Unterlage eingegangen');
    await expect(page.getByTestId('upload-quittung-item-DOK-003')).toContainText(
      'Einkommensteuerbescheid letztes Jahr'
    );
    await expect(page.getByTestId('upload-quittung-item-DOK-003')).toContainText(
      /eingereicht am 24\.\s*November 2024/i
    );

    const naechste = page.getByTestId('upload-quittung-naechste');
    await expect(naechste).toBeVisible();
    await expect(naechste).toContainText('Formular SG1');
    await expect(page.getByTestId('upload-quittung-naechste-countdown')).toContainText(/noch 9 Tage/i);
    await expect(page.getByTestId('upload-quittung-naechste-cta')).toHaveAttribute(
      'href',
      '/fall/dokumente#dok-DOK-004'
    );

    // Fristen-Block enthält nur noch die verbliebene Unterlage
    await expect(page.getByTestId('dok-frist-DOK-003')).toHaveCount(0);
    await expect(page.getByTestId('dok-frist-DOK-004')).toBeVisible();
  });

  test('Übersicht Upload-Quittung: Verlauf-Tiefenlink zum Session-Upload (Q-194)', async ({ page }) => {
    // US-AV-001/003/007: Quittung pro Session-Upload mit Tiefenlink #ere-E-DEMO-DOK-…
    // Kein page.goto nach State (DEC-012) – Link navigiert im Layout
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toBeVisible();

    await goFallTab(page, 'Übersicht', /\/fall$/);
    await expect(page.getByTestId('upload-quittung')).toBeVisible();

    const verlaufLink = page.getByTestId('upload-quittung-verlauf-DOK-003');
    await expect(verlaufLink).toBeVisible();
    await expect(verlaufLink).toHaveAttribute(
      'href',
      '/fall/verlauf#ere-E-DEMO-DOK-DOK-003'
    );
    await expect(verlaufLink).toContainText(/Im Verlauf ansehen/i);

    await verlaufLink.click();
    await expect(page).toHaveURL(/\/fall\/verlauf#ere-E-DEMO-DOK-DOK-003/);

    const card = page.getByTestId('verlauf-ereignis-E-DEMO-DOK-DOK-003');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-current', 'location');
    await expect(card).toHaveAttribute('data-session-upload', 'true');
    await expect(page.getByTestId('verlauf-session-upload-badge-E-DEMO-DOK-DOK-003')).toContainText(
      /Ihr Upload/i
    );
  });

  test('Übersicht Upload-Quittung: nächste Unterlage springt zum Dokument-Anker', async ({ page }) => {
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();

    await goFallTab(page, 'Übersicht', /\/fall$/);
    const cta = page.getByTestId('upload-quittung-naechste-cta');
    await expect(cta).toHaveAttribute('href', '/fall/dokumente#dok-DOK-004');
    await cta.click();
    await expect(page).toHaveURL(/\/fall\/dokumente#dok-DOK-004/);
    await expect(page.locator('#dok-DOK-004')).toBeVisible();
    await expect(page.getByTestId('dok-karte-DOK-004')).toContainText(/Formular SG1|Wird noch benötigt/i);
  });

});
