import test, {Locator, Page} from '@playwright/test';

import {GuestsContext} from '../../../contexts/guestsContext';
import {
    shouldBeVisible,
    textShouldBe,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ChangeNameConfirmationPopup extends PageWidget {
    private readonly title: Locator;
    private readonly icon: Locator;
    private readonly subTitle: Locator;
    private readonly newDetails: Locator;
    private readonly newDetailsIcon: Locator;
    private readonly description: Locator;
    private readonly backButton: Locator;

    constructor(page: Page, testId: string) {
        super(page, testId);
        this.title = this.findInsideByTestId('change-name-success-modal-title-desktop');
        this.subTitle = this.findInsideByTestId('change-name-success-modal-subtitle');
        this.icon = this.findInsideByTestId('change-name-success-modal-icon');
        this.newDetails = this.findInsideByTestId('pill-content');
        this.newDetailsIcon = this.findInside("[data-testid='change-name-success-modal-passenger-2'] svg");
        this.description = this.findInsideByTestId('change-name-success-modal-description');
        this.backButton = this.findInsideByTestId('change-name-success-modal-cta');
    }

    async clickBackToViewBookingButton() {
        await test.step('Click Back To View Bookling button in Name Confirmation popup', async () => {
            await this.backButton.click();
        });
    }

    async shouldBeDisplayedWithRelevantDetails(guestsContext: GuestsContext, params: {isTradePortal: boolean}) {
        await test.step('Change Name Confirmation popup should be displayed', async () => {
            let firstNonLeadGuest = guestsContext.adultGuests[1];
            let expectedDetails = `${firstNonLeadGuest.title} ${firstNonLeadGuest.firstName} ${firstNonLeadGuest.lastName}`;
            let text = params.isTradePortal ? 'the' : 'your';

            await this.waitUntilAttached();
            await textShouldBe(this.title, `We’ve successfully updated ${text} customer details`);
            await textShouldNotBeNullOrEmptyByLocator(this.subTitle);
            await shouldBeVisible(this.icon);
            await shouldBeVisible(this.newDetailsIcon);
            await textShouldContain(this.newDetails, expectedDetails);
            await textShouldContain(this.description, guestsContext.leadPassenger.email);
        });
    }
}
