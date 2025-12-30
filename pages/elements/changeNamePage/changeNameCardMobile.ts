import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeNameCardMobile extends PageWidget {
    private readonly changeDetailsButton: Locator;

    constructor(page: Page, testIdOrSelector: string, numberOfElement: number) {
        super(page, testIdOrSelector, {numberOfElement: numberOfElement});
        this.changeDetailsButton = this.findInsideByTestId('mobile-name-change-btn');
    }

    async clickChangeDetailsButton() {
        await this.changeDetailsButton.click();
    }
}
