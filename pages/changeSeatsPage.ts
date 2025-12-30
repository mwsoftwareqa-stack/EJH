import test, {Locator, Page, TestInfo} from '@playwright/test';

import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {SeatMap} from './elements/changeSeatsPage/seatMap';

export class ChangeSeatsPage extends BasePage {
    private readonly desktopContinueButton: Locator;
    private readonly mobileContinueButton: Locator;

    public readonly seatMap: SeatMap;

    constructor(page: Page) {
        super(page);
        // Shadow host element (contains the open shadow root)
        this.seatMap = new SeatMap(page, '#seat-map-widget', {isSelector: true});
        this.desktopContinueButton = this.page.getByTestId('seats-widget-action-button');
        this.mobileContinueButton = this.page.getByTestId('continue-seat-widget-btn');
    }

    // Outbound flight
    async clickContinueButton(testInfo: TestInfo) {
        await test.step('Click Continue button', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.mobileContinueButton.click();
            } else {
                await this.desktopContinueButton.click();
            }
        });
    }

    // Inbound flight
    async clickConfirmButton(testInfo: TestInfo) {
        await test.step('Click Confirm button', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.mobileContinueButton.click();
            } else {
                await this.desktopContinueButton.click();
            }

            await this.waitUntilSpinnerDisappears();
        });
    }
}
