import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ManageCustomerDetailsSection extends PageWidget {
    private readonly changeButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.changeButton = this.findInsideByTestId('change-name-button');
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
