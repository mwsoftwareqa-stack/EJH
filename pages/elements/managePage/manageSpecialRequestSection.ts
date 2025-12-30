import {Locator, Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';

export class ManageSpecialRequestSection extends PageWidget {
    private readonly changeButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.changeButton = page.getByRole('button', { name: 'Add Special Requests' });
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
