import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class LoginForm extends PageWidget {
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly logInButton: Locator;

    constructor(page: Page, selector: string) {
        super(page, selector);
        this.emailField = this.findInside('[data-tid="email"] input');
        this.passwordField = this.findInside('input#password');
        this.logInButton = this.findInsideByTestId('sign-in-button');
    }

    async fillEmailField(email: string) {
        await this.emailField.fill(email);
    }

    async fillPasswordField(password: string) {
        await this.passwordField.fill(password);
    }

    async clickLogInButton() {
        await this.logInButton.click();
    }
}
