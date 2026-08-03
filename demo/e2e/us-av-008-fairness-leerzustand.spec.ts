/**
 * US-AV-008 / Q-440 – Fairness nach Erledigung offener Aktionen
 * US-AV-008 / Q-462 – Session-Reset nach RQ-Antwort stellt Fairness-RQ wieder her
 * US-AV-008 / Q-500 – Session-Reset nach RQ+Upload+Termin stellt Tab-Badges und Aktions-Signale wieder her
 *
 * Nach Session-Antwort auf Rückfrage + Upload aller offenen Unterlagen:
 * - keine hängenden Aktions-Signale (RQ, Unterlagen, Fall pausiert)
 * - keine RELEVANT-Sektion / keine Aktions-CTAs
 * - Regelwerk-Reaktion sichtbar
 * - Session-Nav (kein page.goto nach Interaktion, DEC-012)
 *
 * Nach nur RQ-Antwort + DemoSessionBar-Reset:
 * - Session-Delta (Antwort, „gelöst“) weg
 * - Fairness-RQ-Signal wieder Ausgangs-Mock (offen mit Frist)
 *
 * Nach vollem Ruhezustand (RQ+Upload+Termin) + DemoSessionBar-Reset:
 * - Tab-Badges Fragen/Unterlagen/Termine wieder Mock-Ausgang
 * - Ruhezustand-Banner und Upload-Quittung weg
 * - Fairness-Aktions-Signale (RQ, Unterlagen) wieder sichtbar
 *
 * Hinweis: BESCHEID_VORLAEUFIG kann bleiben (Sachlage, keine Bürger-Aktion in der Demo).
 */

import { test, expect } from '@playwright/test';
import { goFallTab } from './helpers/sessionNav';

const AKTIONS_TYPEN = [
  'RUECKFRAGE_OFFEN_FRIST_RELEVANT',
  'UNTERLAGE_FEHLT_BLOCKIERT',
  'FALL_PAUSIERT',
] as const;

async function rueckfrageBeantworten(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Jetzt beantworten|Rückfrage beantworten/i }).click();
  await page.getByTestId('rq-antwort-absenden').click();
}

async function erledigeOffeneAktionen(page: import('@playwright/test').Page) {
  await page.goto('/fall/rueckfragen');
  await expect(page.getByTestId('fairness-signal-rueckfrage')).toBeVisible();

  await rueckfrageBeantworten(page);
  await expect(page.getByTestId('fairness-signal-rueckfrage')).toHaveCount(0);

  await goFallTab(page, 'Unterlagen', /\/fall\/dokumente/);
  const uploadButtons = page.getByRole('button', { name: /Als hochgeladen markieren/i });
  const count = await uploadButtons.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await uploadButtons.nth(0).click();
  }
  await expect(page.getByTestId('fairness-signal-unterlagen')).toHaveCount(0);

  // Optional: Termin bestätigen, falls noch AUSSTEHEND (kein hängender Tab-Handlungsbedarf)
  await goFallTab(page, 'Termine', /\/fall\/termine/);
  const terminBtn = page.getByRole('button', { name: /Termin bestätigen|Bestätigen/i });
  if ((await terminBtn.count()) > 0) {
    await terminBtn.first().click();
  }
}

test.describe('US-AV-008 – Fairness-Leerzustand nach offenen Aktionen (Q-440)', () => {
  test('nach RQ+Upload: keine hängenden Aktions-Signale, Session-konsistent', async ({ page }) => {
    await erledigeOffeneAktionen(page);

    // Session-Nav → Hinweise (kein page.goto)
    await goFallTab(page, 'Übersicht', /\/fall$/);
    await page.getByTestId('uebersicht-fairness-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    await expect(page.getByRole('heading', { name: /Hinweise zur Verfahrenslage/i })).toBeVisible();

    // Aktions-Signale und CTAs weg
    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-rq-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-unterlagen-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-section-relevant')).toHaveCount(0);

    // Keine data-signal-typ der Aktions-Klasse
    for (const typ of AKTIONS_TYPEN) {
      await expect(page.locator(`[data-signal-typ="${typ}"]`)).toHaveCount(0);
    }

    // Regelwerk hat reagiert (Signale entfallen)
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-count')).toContainText(/Aktuell \d+ Hinweise?/i);

    // Verbleibende Signale (falls vorhanden) nur Bescheid-Lage, keine hängende Bürger-Aktion
    const remaining = page.locator('[data-signal-typ]');
    const n = await remaining.count();
    for (let i = 0; i < n; i++) {
      const typ = await remaining.nth(i).getAttribute('data-signal-typ');
      expect(typ?.startsWith('BESCHEID_')).toBeTruthy();
    }
  });
});

test.describe('US-AV-008 – Session-Reset nach RQ-Antwort (Q-462)', () => {
  test('DemoSessionBar-Reset leert Session-Delta und stellt Fairness-RQ-Signal wieder her', async ({
    page,
  }) => {
    // 1) Ausgang: offenes RQ-Signal
    await page.goto('/fall/rueckfragen');
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toBeVisible();
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);

    // 2) RQ beantworten → Signal weg, Session-Bar an
    await rueckfrageBeantworten(page);
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByText('Alle Fragen sind beantwortet')).toBeVisible();

    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    await expect(sessionBar.getByRole('button', { name: /Demo zurücksetzen/i })).toBeVisible();

    // 3) Session-Nav → Hinweise: RQ-Signal entfallen, Regelwerk-Reaktion sichtbar
    await goFallTab(page, 'Übersicht', /\/fall$/);
    await page.getByTestId('uebersicht-fairness-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);

    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-rq-cta')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toBeVisible();

    // 4) Demo zurücksetzen (kein page.goto; AV-Reset remountet nicht)
    await page
      .getByRole('region', { name: /Demo-Session/i })
      .getByRole('button', { name: /Demo zurücksetzen/i })
      .click();

    // Session-Bar weg; Session-Delta (Antwort / „gelöst“) geleert
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-geloest')).toHaveCount(0);

    // Fairness-RQ-Signal wieder Ausgangs-Mock (offen mit Frist)
    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-rueckfrage-titel')).toContainText(
      /Rückfrage offen – Frist noch 2 Tage/i
    );
    await expect(page.getByTestId('hinweise-rq-cta')).toBeVisible();
    await expect(page.locator('[data-signal-typ="RUECKFRAGE_OFFEN_FRIST_RELEVANT"]')).toHaveCount(1);

    // 5) Auch auf Rückfragen-Seite konsistent (Session-Nav, DEC-012)
    await goFallTab(page, 'Fragen', /\/fall\/rueckfragen/);
    await expect(page.getByTestId('fairness-signal-rueckfrage')).toBeVisible();
    await expect(page.getByRole('button', { name: /Rückfrage beantworten/i })).toBeVisible();
    await expect(page.getByText('Alle Fragen sind beantwortet')).toHaveCount(0);
    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
  });
});

test.describe('US-AV-008 – Session-Reset nach vollem Ruhezustand (Q-500)', () => {
  test('DemoSessionBar-Reset nach RQ+Upload+Termin stellt Badges und Aktions-Signale wieder her', async ({
    page,
  }) => {
    // 1) Alle Bürger-Aktionen erledigen (Session-Nav, DEC-012)
    await erledigeOffeneAktionen(page);

    // 2) Übersicht: Ruhezustand, keine Handlungs-Badges
    await goFallTab(page, 'Übersicht', /\/fall$/);
    await expect(page.getByTestId('ruhezustand-banner')).toBeVisible();
    await expect(page.getByText('Kein Handeln von Ihnen erforderlich')).toBeVisible();
    await expect(page.getByTestId('tab-badge-fragen')).toHaveCount(0);
    await expect(page.getByTestId('tab-badge-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('tab-badge-termine')).toHaveCount(0);
    await expect(page.getByTestId('upload-quittung')).toBeVisible();
    await expect(page.getByTestId('upload-quittung-vollstaendig')).toBeVisible();

    const sessionBar = page.getByRole('region', { name: /Demo-Session/i });
    await expect(sessionBar).toBeVisible();
    await expect(sessionBar.getByRole('button', { name: /Demo zurücksetzen/i })).toBeVisible();

    // 3) Fairness-Hinweise: Aktions-Signale weg (Session-Nav)
    await page.getByTestId('uebersicht-fairness-hinweise-link').click();
    await expect(page).toHaveURL(/\/fall\/hinweise/);
    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-unterlagen')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-regelwerk-reaktion')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-geloest')).toBeVisible();

    // 4) Demo zurücksetzen (kein page.goto)
    await page
      .getByRole('region', { name: /Demo-Session/i })
      .getByRole('button', { name: /Demo zurücksetzen/i })
      .click();

    await expect(page.getByRole('region', { name: /Demo-Session/i })).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-geloest')).toHaveCount(0);
    await expect(page.getByTestId('hinweise-signal-rueckfrage')).toBeVisible();
    await expect(page.getByTestId('hinweise-signal-unterlagen')).toBeVisible();
    await expect(page.getByTestId('hinweise-rq-cta')).toBeVisible();
    await expect(page.locator('[data-signal-typ="RUECKFRAGE_OFFEN_FRIST_RELEVANT"]')).toHaveCount(1);
    await expect(page.locator('[data-signal-typ="UNTERLAGE_FEHLT_BLOCKIERT"]')).toHaveCount(1);

    // 5) Übersicht: Mock-Ausgang Badges + kein Ruhezustand (Session-Nav)
    await goFallTab(page, 'Übersicht', /\/fall$/);
    await expect(page.getByTestId('ruhezustand-banner')).toHaveCount(0);
    await expect(page.getByTestId('upload-quittung')).toHaveCount(0);
    await expect(page.getByTestId('tab-badge-fragen')).toHaveText('1');
    await expect(page.getByTestId('tab-badge-unterlagen')).toHaveText('2');
    await expect(page.getByTestId('tab-badge-termine')).toHaveText('1');
    await expect(page.getByRole('tab', { name: /Fragen,\s*1 offen/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Unterlagen,\s*2 offen/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Termine,\s*1 offen/i })).toBeVisible();

    // 6) Termine: wieder unbestätigt (kein page.goto)
    await goFallTab(page, 'Termine', /\/fall\/termine/);
    await expect(page.getByRole('button', { name: /Termin bestätigen|Bestätigen/i })).toBeVisible();
    await expect(page.getByText(/Ausstehend/i).first()).toBeVisible();
  });
});
