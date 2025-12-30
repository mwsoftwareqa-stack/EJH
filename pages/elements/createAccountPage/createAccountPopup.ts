import test, {expect, Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class CreateAccountPopup extends PageWidget {
    private readonly emailMessage: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector});
        this.emailMessage = this.findInsideByTestId('email-message', {isOldTestId: true});
    }

    async shouldBeDisplayed(email: string) {
        await test.step('I should see Account Created Successfully popup', async () => {
            await expect(this.emailMessage).toContainText(email);
        });
    }
}
