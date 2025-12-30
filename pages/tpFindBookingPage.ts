import {Locator, Page} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {BasePage} from './core/basePage';

export class TPFindBookingPage extends BasePage {
    private readonly bookingReferenceField: Locator;
    private readonly findBookingButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/trade-portal/find-booking';

        this.bookingReferenceField = page.locator('#bookingReference');
        // TODO [28/10/2025, KV]: Update locator once MAN-3016 is done
        this.findBookingButton = page.locator('[type="submit"]');
    }

    async open() {
        await test.step('Open Find Booking Page for Trade Portal', async () => {
            await this.goToUrl();
        });
    }

    async enterBookingReferenceAndClickFindBookingButton(bookingReference: string) {
        await test.step('Enter booking reference and click Find Booking Button', async () => {
            await this.bookingReferenceField.fill(bookingReference);
            await this.findBookingButton.click();
            await this.waitUntilSpinnerButtonDisappears();
        });
    }
}
