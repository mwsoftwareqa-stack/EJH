import test, {Locator, Page} from '@playwright/test';
import {numberShouldBe, textShouldBe} from '../../../../helpers/assertionHelper';
import {toCurrencyNumber} from '../../../../helpers/stringHelper';
import {PageWidget} from '../../../core/pageWidget';
import {PriceBreakdownTPItem} from './priceBreakdownTPItem';

export class PriceBreakdownTPComponent extends PageWidget {
    private readonly title: Locator;

    private priceBreakdownItems: PriceBreakdownTPItem[] = [];
    private transferChangeItem?: PriceBreakdownTPItem;
    private totalCostOfChangeItem?: PriceBreakdownTPItem;
    private totalItem?: PriceBreakdownTPItem;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.title = this.findInsideByTestId('desktop-price-breakdown-title');
    }

    async shouldBeDisplayedWithTotalAmount(price: number, change: string) {
        await test.step(`Price Breakdown Price should be displayed with Total Price: ${price}`, async () => {
            await this.waitUntilAttached();

            const expectedPrice = Math.round(price * 100) / 100;
            const priceBreakdownItems = await this.getPriceBreakdownItems();

            await textShouldBe(this.title, 'Price Breakdown');
            await this.transferChangeItem!.labelShouldBe(`${change} change`);
            await this.totalCostOfChangeItem!.labelShouldBe('Total cost of change');
            await this.totalItem!.labelShouldBe('Total');
            await this.transferChangeItem!.toolTipIconShouldBeVisible();

            for (const item of priceBreakdownItems) {
                const itemAmountText = await item.getAmountText();
                const itemAmountNumber = toCurrencyNumber(itemAmountText);
                await numberShouldBe(itemAmountNumber, expectedPrice);
            }
        });
    }

    async shouldBeDisplayedWithRefundAmount(price: number, change: string) {
        await test.step(`Price Breakdown should show Refund Amount: ${price}`, async () => {
            await this.waitUntilAttached();

            const expectedPrice = Math.round(price * 100) / 100;
            await this.getPriceBreakdownItems();

            await textShouldBe(this.title, 'Price Breakdown');
            await this.transferChangeItem!.labelShouldBe(`${change} change`);
            await this.totalCostOfChangeItem!.labelShouldBe('Total cost of change');
            await this.totalItem!.labelShouldBe('Refund amount');
            await this.transferChangeItem!.toolTipIconShouldBeVisible();

            const transferAmount = toCurrencyNumber(await this.transferChangeItem!.getAmountText());
            await numberShouldBe(transferAmount, expectedPrice);

            const totalCostAmount = toCurrencyNumber(await this.totalCostOfChangeItem!.getAmountText());
            await numberShouldBe(totalCostAmount, expectedPrice);

            //Total amount refunded is a positive value, so we use absolute value for comparison
            const refundAmount = toCurrencyNumber(await this.totalItem!.getAmountText());
            await numberShouldBe(refundAmount, Math.abs(expectedPrice));
        });
    }

    private async getPriceBreakdownItems(): Promise<PriceBreakdownTPItem[]> {
        if (this.priceBreakdownItems.length === 0) {
            this.priceBreakdownItems = await this.findAllInsidePageWidgets(
                PriceBreakdownTPItem,
                'desktop-price-breakdown-item',
            );

            this.transferChangeItem = this.priceBreakdownItems[0];
            this.totalCostOfChangeItem = this.priceBreakdownItems[1];
            this.totalItem = this.priceBreakdownItems[2];
        }
        return this.priceBreakdownItems;
    }
}
