import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldContain} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class RoomBoardSummaryBar extends PageWidget {
    private readonly priceValue: Locator;
    private readonly confirmButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.priceValue = this.findInsideByTestId('product-price-value');
        this.confirmButton = this.page.getByTestId('confirm-RoomAndBoard-button');
    }

    async shouldDisplayPrice(price: string) {
        await test.step(`Summary bar should display price: ${price}`, async () => {
            await shouldBeVisible(this.priceValue);
            await textShouldContain(this.priceValue, price);
        });
    }

    async getCurrentPrice(): Promise<string> {
        await test.step('Get current price from summary bar', async () => {
            await shouldBeVisible(this.priceValue);
            const priceText = await this.priceValue.textContent();
            if (!priceText) {
                throw new Error('Could not get price from summary bar');
            }
            return priceText.trim();
        });
    }

    async clickConfirmButton() {
        await test.step('Click Confirm button in summary bar', async () => {
            await this.click(this.confirmButton);
        });
    }
}
