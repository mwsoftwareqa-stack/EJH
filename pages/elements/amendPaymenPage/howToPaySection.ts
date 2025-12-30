import {Locator, Page} from '@playwright/test';

import {test} from '../../../core/fixtures/baseFixture';
import {PageWidget} from '../../core/pageWidget';

export class HowToPaySection extends PageWidget {
    private readonly continueButton: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.continueButton = this.findInside('.btn');
    }

    async clickContinueButton() {
        await test.step('Click Continue button in How To Pay section', async () => {
            await this.continueButton.click();
        });
    }
}
