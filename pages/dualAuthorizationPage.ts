import test, {Page} from '@playwright/test';

import {BasePage} from './core/basePage';

export class DualAuthorizationPage extends BasePage {
    constructor(page: Page) {
        super(page);
        this.pagePath = '/manage/dual-authorization';
    }

    // Step will be updated once MAN-2150 is done and page is created
    async shouldBeOpened() {
        await test.step('Dual Authorization page should be opened', async () => {
            await this.pageUrlShouldBeOpened();
        });
    }
}
