import test, {Locator, Page} from '@playwright/test';

import {shouldBeVisible} from '../helpers/assertionHelper';
import {BasePage} from './core/basePage';

export class HomePage extends BasePage {
    private readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.searchButton = page.locator('#search-button');
    }

    async shouldBeOpened() {
        await test.step('Home page should be opened', async () => {
            await shouldBeVisible(this.searchButton, 10000);
            await this.pageUrlShouldBeOpened();
        });
    }
}
