import {Locator, Page} from '@playwright/test';

import {BookingContext} from '../../../contexts/bookingContext';
import {test} from '../../../core/fixtures/baseFixture';
import {
    shouldBeVisible,
    textShouldBe,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ManageTransferSection extends PageWidget {
    private readonly title: Locator;
    private readonly icon: Locator;
    private readonly changeButton: Locator;
    private readonly transferTitle: Locator;
    private readonly transferDescription: Locator;
    private readonly durationTooltip: Locator;
    private readonly durationDescription: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.title = this.findInsideByTestId('change-transfer-drawer-title');
        this.icon = this.findInsideByTestId('change-transfer-drawer-icon');
        this.changeButton = this.findInsideByTestId('change-transfer-button');
        this.transferTitle = this.findInsideByTestId('transfer-title');
        this.transferDescription = this.findInsideByTestId('transfer-description');
        this.durationTooltip = this.findInsideByTestId('time-access-time-solid-icon');
        this.durationDescription = this.findInsideByTestId('pill-content');
    }

    async transferSectionShouldBeDisplayedWithRelevantDetails(bookingContext: BookingContext) {
        await test.step('Transfer section should be displayed with relevant details', async () => {
            let transferTitle = bookingContext.bookingResponse.transfers[0].name;

            await this.waitUntilAttached();

            await shouldBeVisible(this.icon);
            await textShouldBe(this.title, 'Transfer');
            await textShouldBe(this.transferTitle, transferTitle);
            // await shouldBeVisible(this.durationTooltip);
            // Hardcoded duration for the test, should be replaced with dynamic value if available
            // await textShouldContain(this.durationDescription, '2h 45min');
            await textShouldNotBeNullOrEmptyByLocator(this.transferDescription);
        });
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
