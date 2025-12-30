import test, {Page} from '@playwright/test';
import {
    shouldBeVisible,
    textShouldBe,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {BaseTPConfirmationPopup} from '../base/baseTPConfirmationPopup';
import {AmendSeatsDetails} from '../viewBookingPage/confirmationPopupElements/amendSeatsPopup/amendSeatsDetails';

export class AmedSeatsTPConfirmationPopup extends BaseTPConfirmationPopup {
    public readonly amendSeatsDetails: AmendSeatsDetails;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.amendSeatsDetails = new AmendSeatsDetails(page, 'new-seats-confirmed', false);
    }

    //TODO [17.19.2025 MB] seats number validation will be added once we got implemented search inside nested elements
    async shouldBeDisplayedWithRelevantDetails(
        email: string,
        expectedOutboundSeats: string[],
        expectedInboundSeats: string[],
    ) {
        await test.step('Amend Seats Confirmation popup should be displayed for Trade Portal', async () => {
            await this.waitUntilAttached();
            await textShouldBe(this.title, 'We’ve successfully updated the seats');
            await textShouldNotBeNullOrEmptyByLocator(this.subTitle);
            await shouldBeVisible(this.icon);
            await textShouldContain(this.message, email);
        });
    }
}
