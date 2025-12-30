import test, {expect, Locator, Page} from '@playwright/test';

import {BasePage} from './core/basePage';
import {CreateAccountForm} from './elements/createAccountPage/createAccountForm';
import {CreateAccountPopup} from './elements/createAccountPage/createAccountPopup';

export class CreateAccountPage extends BasePage {
    // [TODO] Will be replaced with Array<Locator> in the future
    private readonly errorMessage: Locator;

    public readonly createAccountForm: CreateAccountForm;
    public readonly createAccountPopup: CreateAccountPopup;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/create-account';

        this.errorMessage = page.locator('.error-message');

        this.createAccountPopup = new CreateAccountPopup(page, '.create-account-success-popup', true);
        this.createAccountForm = new CreateAccountForm(page, '.create-account', true);
    }

    async open() {
        await test.step('Open Create Account page', async () => {
            await this.goToUrl();
        });
    }

    async errorMessageShouldBeDisplayed(message: string) {
        await test.step(`I should see the error message: ${message}`, async () => {
            await expect(this.errorMessage).toBeVisible();
        });
    }
}
