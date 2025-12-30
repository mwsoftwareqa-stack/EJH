import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeBasketFooter extends PageWidget {
    private readonly continueButton: Locator;
    private readonly goBackButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);

        this.continueButton = this.findInside("[data-testid$='continue-button']");
        this.goBackButton = this.findInside("[data-testid$='go-back-button']");
    }

    async clickContinueButton() {
        await this.click(this.continueButton);
    }

    async clickGoBackButton() {
        await this.click(this.goBackButton);
    }
}
