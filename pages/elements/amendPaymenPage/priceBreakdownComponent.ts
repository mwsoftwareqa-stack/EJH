import test, {Locator, Page} from '@playwright/test';

import {numberShouldBe, shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {toCurrencyNumber} from '../../../helpers/stringHelper';
import {PageWidget} from '../../core/pageWidget';

export class PriceBreakdownComponent extends PageWidget {
    private readonly price: Locator;
    private readonly summaryLabel: Locator;
    private readonly title: Locator;
    private readonly transferChangeLabel: Locator;
    private readonly transferChangeTooltip: Locator;
    private readonly transferChangePrice: Locator;
    private readonly totalCostOfChangeLabel: Locator;
    private readonly totalCostOfChangePrice: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.price = this.findInsideByTestId('price-breakdown-transaction-amount', {isOldTestId: true});
        this.summaryLabel = this.findInsideByTestId('price-breakdown-payment-instructions', {isOldTestId: true});
        this.title = this.findInsideByTestId('price-breakdown-title', {isOldTestId: true});
        this.transferChangeLabel = this.findInsideByTestId('price-breakdown-details-change-title', {
            isOldTestId: true,
        });
        this.transferChangeTooltip = this.findInsideByTestId('callout-parent', {isOldTestId: true});
        this.transferChangePrice = this.findInsideByTestId('price-breakdown-details-change-amount', {
            isOldTestId: true,
        });
        this.totalCostOfChangeLabel = this.findInsideByTestId('price-breakdown-details-total-title', {
            isOldTestId: true,
        });
        this.totalCostOfChangePrice = this.findInsideByTestId('price-breakdown-details-total-amount', {
            isOldTestId: true,
        });
    }

    async getPrice() {
        return await this.price.textContent();
    }

    async getSummaryLabel() {
        return await this.summaryLabel.textContent();
    }

    async shouldBeDisplayedWithTotalAmount(price: number, change: string) {
        await test.step(`Price Breakdown Price should be displayed with Total Price: ${price}`, async () => {
            await this.waitUntilAttached();

            const expectedPrice = Math.round(price * 100) / 100;

            await textShouldBe(this.title, 'Price Breakdown');
            await textShouldBe(this.transferChangeLabel, `${change} change`);
            await textShouldBe(this.totalCostOfChangeLabel, 'Total cost of change');
            await textShouldBe(this.summaryLabel, 'Pay now');
            await shouldBeVisible(this.transferChangeTooltip);

            await numberShouldBe(
                toCurrencyNumber((await this.transferChangePrice.textContent()) ?? ''),
                expectedPrice,
            );
            await numberShouldBe(
                toCurrencyNumber((await this.totalCostOfChangePrice.textContent()) ?? ''),
                expectedPrice,
            );
            await numberShouldBe(toCurrencyNumber((await this.price.textContent()) ?? ''), expectedPrice);
        });
    }

    async shouldBeDisplayedWithRefundAmount(price: number, change: string) {
        await test.step(`Price Breakdown should show Refund Amount: ${price}`, async () => {
            await this.waitUntilAttached();

            const expectedPrice = Math.round(price * 100) / 100;

            await textShouldBe(this.title, 'Price Breakdown');
            await textShouldBe(this.transferChangeLabel!, `${change} change`);
            await textShouldBe(this.totalCostOfChangeLabel, 'Total cost of change', {
                timeout: 30000,
            });
            await textShouldBe(this.summaryLabel, 'Refund amount');
            await shouldBeVisible(this.transferChangeTooltip);

            const transferAmount = toCurrencyNumber((await this.transferChangePrice.textContent()) ?? '');
            await numberShouldBe(transferAmount, expectedPrice);

            const totalCostAmount = toCurrencyNumber((await this.totalCostOfChangePrice.textContent()) ?? '');
            await numberShouldBe(totalCostAmount, expectedPrice);

            const refundAmount = toCurrencyNumber((await this.price.textContent()) ?? '');
            await numberShouldBe(refundAmount, Math.abs(expectedPrice));
        });
    }
}
