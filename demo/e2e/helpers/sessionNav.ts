/**
 * Session-erhaltende Navigation für Demo-E2E.
 *
 * DemoStateProvider / GruendungStateProvider sitzen im Domain-Layout.
 * page.goto() remountet das Layout und löscht Session-State (Antworten, Uploads).
 * Nach Interaktionen IMMER Tab-Nav (Link-Click) statt page.goto() verwenden.
 */
import { expect, type Page } from '@playwright/test';

/** Klickt den Tab in der Domain-Navigation (`.tab-nav-item`). */
export async function clickDomainTab(page: Page, label: string | RegExp) {
  const tab = page.locator('.tab-nav-item').filter({ hasText: label });
  await expect(tab.first()).toBeVisible();
  await tab.first().click();
}

/** AV: nach State-Änderung zu einem Fall-Tab navigieren. */
export async function goFallTab(page: Page, label: string | RegExp, urlPart: string | RegExp) {
  await clickDomainTab(page, label);
  await expect(page).toHaveURL(urlPart);
}

/** UG: nach State-Änderung zu einem Gründungs-Tab navigieren. */
export async function goUgTab(page: Page, label: string | RegExp, urlPart: string | RegExp) {
  await clickDomainTab(page, label);
  await expect(page).toHaveURL(urlPart);
}
