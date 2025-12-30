import {Locator, Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';

export class ManageSeatsSection extends PageWidget {
    private readonly changeButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.changeButton = this.findInsideByTestId('change-seats-button');
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
