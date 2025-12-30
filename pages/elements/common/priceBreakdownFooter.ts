import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class PriceBreakdownFooter extends PageWidget {
    private readonly label: Locator;
    private readonly amount: Locator;

    constructor(page: Page, testIdOrSelector: string, isSelector: boolean) {
        super(page, testIdOrSelector, {isSelector: isSelector});
        this.label = this.findInsideByTestId('price-breakdown-payment-instructions', {isOldTestId: true});
        this.amount = this.findInsideByTestId('price-breakdown-transaction-amount', {isOldTestId: true});
    }

    async getLabel() {
        return await this.label.textContent();
    }

    async getAmount() {
        return await this.amount.textContent();
    }
}
