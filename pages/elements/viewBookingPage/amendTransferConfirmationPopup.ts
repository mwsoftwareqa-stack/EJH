import {Page} from '@playwright/test';

import {test} from '../../../core/fixtures/baseFixture';
import {BaseConfirmationPopup} from '../base/baseConfirmationPopup';

export class AmendTransferConfirmationPopup extends BaseConfirmationPopup {
    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
    }

    async clickBackToViewBookingButton() {
        await test.step('Click Back To View Booking button in Transfer Confirmation popup', async () => {
            await this.clickBackButton();
        });
    }

    async shouldBeDisplayedWithRelevantDetails(email: string) {
        await test.step('Amend Transfer Confrimation popup should be displayed', async () => {
            await this.waitUntilAttached();
            await this.titleShouldBe("We've successfully changed your transfer");
            await this.subTitleShouldContainText('Private transfer');
            await this.messageShouldContainText(email);
        });
    }
}
