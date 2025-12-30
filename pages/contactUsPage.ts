import test, {Locator, Page} from '@playwright/test';

import {shouldBeVisible} from '../helpers/assertionHelper';
import {BasePage} from './core/basePage';

export class ContactUsPage extends BasePage {
    private readonly promoBlockItem: Locator;

    constructor(page: Page) {
        super(page);
        this.promoBlockItem = this.getByDataTid('promo-block-item').first();
    }

    async contactUsPageShouldBeOpened() {
        await test.step('Contact Us page should be opened', async () => {
            await shouldBeVisible(this.promoBlockItem);
        });
    }
}
