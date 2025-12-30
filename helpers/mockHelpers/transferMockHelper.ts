import {Page} from '@playwright/test';

import {test} from '../../core/fixtures/baseFixture';

export async function alternativeTransfersResponseReturnsZeroTransfers(page: Page) {
    await test.step('Mocked: Alternative transfers response returns zero transfers', async () => {
        await page.route('**/alternative-transfers', async (route) => {
            const response = await route.fetch();
            const body = await response.json();

            body.transfers.alternativeTransfers = [];

            await route.fulfill({
                status: response.status(),
                contentType: 'application/json',
                body: JSON.stringify(body),
            });
        });
    });
}
