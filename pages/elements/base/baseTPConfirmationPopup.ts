import test, {Locator, Page} from '@playwright/test';

import {
    textShouldBe,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export abstract class BaseTPConfirmationPopup extends PageWidget {
    protected readonly icon: Locator;
    protected readonly title: Locator;
    protected readonly subTitle: Locator;
    protected readonly message: Locator;
    protected readonly backButton: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.icon = this.findInsideByTestId('success-modal-icon');
        this.title = this.findInsideByTestId('success-modal-title-desktop');
        this.subTitle = this.findInsideByTestId('success-modal-changed-to');
        this.message = this.findInsideByTestId('success-modal-email-message');
        this.backButton = this.findInsideByTestId('success-modal-back-cta');
    }

    async clickBackToViewBookingButton() {
        await test.step('Click Back To View Booking button inside Confirmation popup', async () => {
            await this.backButton.click();
        });
    }

    async titleShouldBe(title: string) {
        await this.title.waitFor({state: 'attached'});
        await textShouldBe(this.title, title);
    }

    async subTitleShouldContainText(subTitle: string) {
        await this.subTitle.waitFor({state: 'attached'});
        await textShouldContain(this.subTitle, subTitle);
    }

    async subTitleShouldNotBeNullOrEmpty() {
        await this.subTitle.waitFor({state: 'attached'});
        await textShouldNotBeNullOrEmptyByLocator(this.subTitle);
    }

    async messageShouldContainText(message: string) {
        await this.message.waitFor({state: 'attached'});
        await textShouldContain(this.message, message);
    }
}
