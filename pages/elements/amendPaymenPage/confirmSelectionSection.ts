import test, {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ConfirmSelectionSection extends PageWidget {
    private readonly continueButton: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.continueButton = this.findInside('.btn');
    }

    async clickContinueButton() {
        await test.step('Click Continue button in Confirm Your Selection section', async () => {
            await this.waitUntilAttached();
            await this.continueButton.click({timeout: 60000});
        });
    }
}
