import { Page } from '@playwright/test';

import { test } from '../../core/fixtures/baseFixture';

export async function accountRequestFailsWith500Error(page: Page) {
    await test.step('Account request returns 500 error', async () => {
        await page.route('**/account', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Mocked 500 Internal Server Error' }),
            });
        });
    });
}
