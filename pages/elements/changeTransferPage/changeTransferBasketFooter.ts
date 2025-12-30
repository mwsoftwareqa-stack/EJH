import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeTransferBasketFooter extends PageWidget {
    private readonly continueButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.continueButton = this.findInside('button');
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }
}
