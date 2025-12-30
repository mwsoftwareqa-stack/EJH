import test, {Locator, Page, TestInfo} from '@playwright/test';

import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';

export class ChangeDatesSummaryPage extends BasePage {
    private readonly continueButton: Locator;

    public readonly basketFooter: ChangeBasketFooter;

    constructor(page: Page) {
        super(page);
        this.continueButton = this.page.getByTestId('confirm-date-button');
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');
    }

    async clickContinueButton(testInfo: TestInfo) {
        await test.step('Click Continue button on Change Dates Summary page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.basketFooter.clickContinueButton();
            } else {
                await this.click(this.continueButton);
            }

            await this.waitUntilSpinnerDisappears();
        });
    }
}
