import {Locator, Page} from '@playwright/test';
import {test} from '../../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldBe} from '../../../../helpers/assertionHelper';
import {PageWidget} from '../../../core/pageWidget';

export class PriceBreakdownTPItem extends PageWidget {
    private readonly amount: Locator;
    private readonly label: Locator;
    private readonly toolTipIcon: Locator;

    constructor(
        page: Page,
        selector: string,
        options?: {isSelector?: boolean; numberOfElement?: number; locator?: Locator},
    ) {
        super(page, selector, options);
        this.amount = this.findInsideByTestId('amount');
        this.label = this.findInside('span').first();
        this.toolTipIcon = this.findInside('[aria-label="More info"]');
    }

    async getAmountText(): Promise<string> {
        return (await this.amount.textContent()) ?? '';
    }

    async labelShouldBe(text: string) {
        await test.step(`Price Breakdown Item should be: ${text}`, async () => {
            await textShouldBe(this.label, text);
        });
    }

    async toolTipIconShouldBeVisible() {
        await test.step('Price Breakdown Item tool tip icon should be visible', async () => {
            await shouldBeVisible(this.toolTipIcon);
        });
    }
}
