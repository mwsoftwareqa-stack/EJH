import test, {Locator, Page, TestInfo} from '@playwright/test';

import {shouldBeVisible, textShouldBe, textShouldContain} from '../../../helpers/assertionHelper';
import {isMobileBrowser} from '../../../helpers/testInfoHelper';
import {PageWidget} from '../../core/pageWidget';

export class AnyChangesWillBeLostPopup extends PageWidget {
    private readonly titleDesktop: Locator;
    private readonly titleMobile: Locator;
    private readonly icon: Locator;
    private readonly description: Locator;
    private readonly cancelButton: Locator;
    private readonly leaveWithoutSavingButton: Locator;

    constructor(page: Page, testId: string) {
        super(page, testId);
        this.titleDesktop = this.findInsideByTestId('change-name-warning-modal-title-desktop');
        this.titleMobile = this.findInsideByTestId('change-name-warning-modal-title-mobile');
        this.icon = this.findInsideByTestId('exclamation-mark');
        this.description = this.findInsideByTestId('change-name-warning-modal-description');
        this.cancelButton = this.findInsideByTestId('change-name-warning-modal-close-cta');
        this.leaveWithoutSavingButton = this.findInsideByTestId('change-name-warning-modal-cta');
    }

    async shouldBeDisplayedWithRelevantDetails(testInfo: TestInfo) {
        await test.step('Any Changes Will Be Lost popup should be displayed', async () => {
            await this.waitUntilAttached();

            let expectedTitle = `Any changes will be lost`;
            if (isMobileBrowser(testInfo)) {
                await textShouldBe(this.titleMobile, expectedTitle);
            } else {
                await textShouldBe(this.titleDesktop, expectedTitle);
            }
            await shouldBeVisible(this.icon);
            await textShouldContain(
                this.description,
                `If you go back now, all changes to the traveller names will be lost.`,
            );
        });
    }

    async clickCancelButton() {
        await test.step('Click Cancel button in Any Changes Will Be Lost popup', async () => {
            await this.cancelButton.click();
        });
    }

    async clickLeaveWithoutSavingButton() {
        await test.step('Click Leave Without Saving button in Any Changes Will Be Lost popup', async () => {
            await this.leaveWithoutSavingButton.click();
        });
    }
}
