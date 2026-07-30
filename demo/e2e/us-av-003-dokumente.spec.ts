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
    // Headings: Fairness-Hinweis listet dieselben Namen nochmals im Fließtext
    await expect(page.getByRole('heading', { name: 'Arbeitgeberbescheinigung' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Personalausweis/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Einkommensteuerbescheid letztes Jahr' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Formular SG1' })).toBeVisible();
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

  test('Frist-Countdown für ausstehende Unterlagen (analog RQ)', async ({ page }) => {
    // FIKTIVES_HEUTE 2024-11-24 → 2024-12-03 = noch 9 Tage
    await expect(page.getByTestId('dok-seite-countdown-DOK-003')).toContainText(/noch 9 Tage/i);
    await expect(page.getByTestId('dok-seite-countdown-DOK-004')).toContainText(/noch 9 Tage/i);
  });

  test('Fairness-Signal UNTERLAGE enthält berechnete Dokumenten-Frist', async ({ page }) => {
    // Parität zu Rückfrage-Signal: Resttage gegen FIKTIVES_HEUTE im Signal-Text
    const signal = page.getByTestId('fairness-signal-unterlagen');
    await expect(signal).toBeVisible();
    await expect(page.getByTestId('fairness-signal-unterlagen-titel')).toContainText(
      /Unterlage\(n\) offen – Frist noch 9 Tage/i
    );
    await expect(page.getByTestId('fairness-signal-unterlagen-erklaerung')).toContainText(
      /Nächste Einreichungsfrist:\s*3\.\s*Dezember 2024\s*\(noch 9 Tage/i
    );
    await expect(page.getByTestId('fairness-signal-unterlagen-erklaerung')).toContainText(
      /Einkommensteuerbescheid|Formular SG1/
    );
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

  test('Nach Session-Upload: lokale Quittung auf der Dokumentenkarte', async ({ page }) => {
    // US-AV-003: sofortige Quittung pro Karte nach Markieren (kein page.goto, DEC-012)
    const { goFallTab } = await import('./helpers/sessionNav');

    // Offene Unterlagen freischalten: zuerst Rückfrage beantworten
    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    // Noch keine Session-Quittung vor dem Upload
    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toHaveCount(0);

    // Erstes ausstehendes Dokument (Einkommensteuerbescheid DOK-003)
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();

    const quittung = page.getByTestId('dok-upload-quittung-DOK-003');
    await expect(quittung).toBeVisible();
    await expect(page.getByTestId('dok-upload-quittung-titel-DOK-003')).toHaveText('Upload bestätigt');
    await expect(page.getByTestId('dok-upload-quittung-text-DOK-003')).toContainText(
      'Einkommensteuerbescheid letztes Jahr'
    );
    await expect(page.getByTestId('dok-upload-quittung-text-DOK-003')).toContainText(
      /eingereicht am 24\.\s*November 2024/i
    );
    // Status-Chip der Karte
    await expect(page.getByTestId('dok-karte-DOK-003')).toContainText('Hochgeladen');
    // Upload-Zone für dieses Dokument entfällt
    await expect(page.locator('.upload-zone')).toHaveCount(1);
    // Fairness-Signal bleibt, solange Formular SG1 fehlt
    await expect(page.getByTestId('fairness-signal-unterlagen')).toBeVisible();
    await expect(page.getByTestId('fairness-signal-unterlagen-titel')).toContainText(
      /1 Unterlage\(n\) offen/i
    );
  });

  test('Nach Upload: Verlauf-Tiefenlink zum Session-Upload (US-AV-003/007, Q-193)', async ({ page }) => {
    // Quittung verlinkt auf Session-Ereignis; Hash-Hervorhebung + Badge im Verlauf
    // Parität UG Q-188 — kein page.goto nach State (DEC-012)
    await page.goto('/fall/dokumente');
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toBeVisible();

    const verlaufLink = page.getByTestId('dok-verlauf-link-DOK-003');
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
    await expect(card).toContainText(/hochgeladen/i);
    await expect(page.getByTestId('verlauf-session-upload-badge-E-DEMO-DOK-DOK-003')).toBeVisible();
    await expect(page.getByTestId('verlauf-session-upload-badge-E-DEMO-DOK-DOK-003')).toContainText(
      /Ihr Upload/i
    );
  });

  test('Session-Upload bleibt im Verlauf nach Tab-Nav (kein page.goto)', async ({ page }) => {
    const { goFallTab } = await import('./helpers/sessionNav');
    await page.goto('/fall/dokumente');
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toBeVisible();

    await goFallTab(page, 'Verlauf', /\/fall\/verlauf/);
    const card = page.getByTestId('verlauf-ereignis-E-DEMO-DOK-DOK-003');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-session-upload', 'true');
    await expect(page.getByTestId('verlauf-session-upload-badge-E-DEMO-DOK-DOK-003')).toContainText(
      /Ihr Upload/i
    );
  });

  test('Nach allen Session-Uploads: Vollständigkeits-Hinweis mit Session-Zähler', async ({ page }) => {
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    const uploadButtons = page.getByRole('button', { name: /Als hochgeladen markieren/i });
    const count = await uploadButtons.count();
    for (let i = 0; i < count; i++) {
      await uploadButtons.nth(0).click();
    }

    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toBeVisible();
    await expect(page.getByTestId('dok-upload-quittung-DOK-004')).toBeVisible();
    await expect(page.getByTestId('dok-alle-vorliegend')).toBeVisible();
    await expect(page.getByTestId('dok-alle-vorliegend-session')).toContainText(
      /2 Unterlagen.*markiert/i
    );
    await expect(page.getByTestId('fairness-signal-unterlagen')).toHaveCount(0);
    await expect(page.locator('.upload-zone')).toHaveCount(0);
  });

  // ─── US-AV-008: Hinweise / UNTERLAGE live nach Session-Upload ─────────────

  test('Hinweise: UNTERLAGE-Signal enthält berechnete Dokumenten-Frist', async ({ page }) => {
    // Initialer Mock: 2 offene Unterlagen, Frist 3.12. ggü. FIKTIVES_HEUTE → 9 Tage
    await page.goto('/fall/hinweise');
    await expect(page.getByRole('heading', { name: 'Hinweise zur Verfahrenslage' })).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-count')).toContainText(/Aktuell \d+ Hinweise/i);

    const signal = page.getByTestId('hinweise-signal-unterlagen');
    await expect(signal).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-unterlagen-titel')).toContainText(
      /Unterlage\(n\) offen – Frist noch 9 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).toContainText(
      /Nächste Einreichungsfrist:\s*3\.\s*Dezember 2024\s*\(noch 9 Tage/i
    );
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toBeVisible();
    // Nächste Frist DOK-003 (gleich DOK-004) → Tiefenlink zur ersten Karte
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveAttribute(
      'href',
      '/fall/dokumente#dok-DOK-003'
    );
    await expect(page.getByTestId('hinweise-unterlagen-cta-hint')).toContainText(
      /noch 9 Tage|3\.\s*Dezember 2024|Unterlagen/i
    );
  });

  test('Hinweise: UNTERLAGE-Countdown-Chip am CTA (Q-216)', async ({ page }) => {
    // US-AV-003/008: Parität RQ Q-214 — Chip + Tiefenlink #dok-…
    // DOK-003/004 Frist 2024-12-03 · FIKTIVES_HEUTE 2024-11-24 → noch 9 Tage
    await page.goto('/fall/hinweise');
    const wrap = page.getByTestId('hinweise-unterlagen-cta-wrap');
    await expect(wrap).toBeVisible();
    await expect(page.getByTestId('hinweise-unterlagen-cta-hint')).toContainText(
      /3\.\s*Dezember 2024|noch 9 Tage/i
    );
    const chip = page.getByTestId('hinweise-unterlagen-countdown-FH-UNTERLAGEN-FEHLEND');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/noch 9 Tage/i);
    await page.getByTestId('hinweise-unterlagen-cta').click();
    await expect(page).toHaveURL(/\/fall\/dokumente#dok-DOK-003/);
    await expect(page.locator('#dok-DOK-003')).toBeVisible();
  });

  test('Hinweise: Session-Teil-Upload aktualisiert UNTERLAGE-Count und behält Frist', async ({ page }) => {
    // Kein page.goto nach State (DEC-012) — Session-Nav über Tabs + Link
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    // Solange SG1 fehlt: Signal auf Dokumente-Seite + Link zur Verfahrenslage
    await expect(page.getByTestId('fairness-signal-unterlagen-titel')).toContainText(
      /1 Unterlage\(n\) offen/i
    );
    await page.getByTestId('dok-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    // UNTERLAGE live: 1 offen, Fristtext bleibt (nächste = verbleibende Unterlage)
    await expect(page.getByTestId('hinweise-signal-unterlagen')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-unterlagen-titel')).toContainText(
      /1 Unterlage\(n\) offen – Frist noch 9 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).toContainText(
      /Nächste Einreichungsfrist:\s*3\.\s*Dezember 2024\s*\(noch 9 Tage/i
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).toContainText(
      /Formular SG1/
    );
    await expect(page.getByTestId('hinweise-signal-unterlagen-erklaerung')).not.toContainText(
      /Einkommensteuerbescheid letztes Jahr/
    );
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toBeVisible();
    // RQ-Signal entfallen → Reaktions-Banner
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta')).toHaveCount(0);
  });

  test('Hinweise: nach Teil-Upload CTA-Tiefenlink auf nächste offene Unterlage (Q-222)', async ({
    page,
  }) => {
    // US-AV-003/008: CTA #dok-… folgt live dem nächsten offenen Dokument (Parität Übersicht Q-194)
    // Initial DOK-003+DOK-004 → nach Upload DOK-003 bleibt DOK-004 (SG1)
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    // Erstes offenes = DOK-003 (Einkommensteuerbescheid)
    await page.getByRole('button', { name: /Als hochgeladen markieren/i }).first().click();
    await expect(page.getByTestId('dok-upload-quittung-DOK-003')).toBeVisible();

    await page.getByTestId('dok-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    const wrap = page.getByTestId('hinweise-unterlagen-cta-wrap');
    await expect(wrap).toBeVisible();
    await expect(wrap).toHaveAttribute('data-next-dok-id', 'DOK-004');
    await expect(page.getByTestId('hinweise-unterlagen-cta-hint')).toContainText(
      /Noch 1 Unterlage|Formular SG1/i
    );
    await expect(page.getByTestId('hinweise-unterlagen-countdown-FH-UNTERLAGEN-FEHLEND')).toContainText(
      /noch 9 Tage/i
    );
    const cta = page.getByTestId('hinweise-unterlagen-cta');
    await expect(cta).toHaveAttribute('href', '/fall/dokumente#dok-DOK-004');
    await cta.click();
    await expect(page).toHaveURL(/\/fall\/dokumente#dok-DOK-004/);
    await expect(page.locator('#dok-DOK-004')).toBeVisible();
    await expect(page.getByTestId('dok-karte-DOK-004')).toContainText(/Formular SG1|Wird noch benötigt/i);
  });

  test('Hinweise: nach allen Session-Uploads entfällt UNTERLAGE-Signal', async ({ page }) => {
    const { goFallTab } = await import('./helpers/sessionNav');

    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
    await page.getByTestId('rq-antwort-absenden').click();

    await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
    const uploadButtons = page.getByRole('button', { name: /Als hochgeladen markieren/i });
    const count = await uploadButtons.count();
    for (let i = 0; i < count; i++) {
      await uploadButtons.nth(0).click();
    }
    await expect(page.getByTestId('fairness-signal-unterlagen')).toHaveCount(0);

    // Zur Verfahrenslage über Übersicht-Link (kein page.goto, DEC-012)
    await goFallTab(page, 'Übersicht', /\/fall$/);
    await page.getByTestId('uebersicht-fairness-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    await expect(page.getByTestId('hinweise-signal-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toContainText(/Unterlagen/i);
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
  });

});
