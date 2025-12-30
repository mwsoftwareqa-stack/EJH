import test, {Locator, Page} from '@playwright/test';

import {GuestsContext} from '../../../contexts/guestsContext';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {BaseTPConfirmationPopup} from '../base/baseTPConfirmationPopup';

export class AmendTransferTPConfirmationPopup extends BaseTPConfirmationPopup {
    private readonly transferIcon: Locator;
    private readonly newTransfer: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.transferIcon = this.findInsideByTestId('transfer-taxi-solid-icon');
        this.newTransfer = this.findInsideByTestId('pill-content');
    }

    async confirmationPopupForPrivateTransferShouldBeDisplayed(guestsContext: GuestsContext) {
        await test.step('Confirmation popup for private transfer should be displayed', async () => {
            await this.waitUntilAttached();

            await shouldBeVisible(this.icon);
            await this.titleShouldBe('We’ve successfully updated the transfer');
            await this.subTitleShouldNotBeNullOrEmpty();
            await shouldBeVisible(this.transferIcon);
            await textShouldBe(this.newTransfer, 'Private taxi');
            await this.messageShouldContainText(guestsContext.leadPassenger.email);
        });
    }
}
