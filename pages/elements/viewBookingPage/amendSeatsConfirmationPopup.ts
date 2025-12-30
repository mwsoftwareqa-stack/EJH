import test, {Page} from '@playwright/test';

import {BaseConfirmationPopup} from '../base/baseConfirmationPopup';
import {AmendSeatsDetails} from './confirmationPopupElements/amendSeatsPopup/amendSeatsDetails';

export class AmendSeatsConfirmationPopup extends BaseConfirmationPopup {
    public readonly amendSeatsDetails: AmendSeatsDetails;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);

        //TODO [08.10.2025 MB] update selector once MAN-2839 is completed
        this.amendSeatsDetails = new AmendSeatsDetails(
            page,
            '[class^="SuccessfulAmendmentPopup_itemSeatsDetails"]',
            true,
        );
    }

    //TODO [17.19.2025 MB] seats number validation will be added once we got implemented search inside nested elements
    async shouldBeDisplayedWithRelevantDetails(
        email: string,
        expectedOutboundSeats: string[],
        expectedInboundSeats: string[],
    ) {
        await test.step('Amend Seats Confirmation popup should be displayed', async () => {
            await this.waitUntilAttached();
            await this.titleShouldBe("We've successfully updated your seats");
            await this.subTitleShouldContainText('seat');
            await this.messageShouldContainText(email);
        });
    }
}
