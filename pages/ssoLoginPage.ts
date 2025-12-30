import {Locator, Page} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {getEnvVar} from '../helpers/envVariablesHelper';
import {BasePage} from './core/basePage';

export class SSOLoginPage extends BasePage {
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly signInButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameField = page.locator('#username');
        this.passwordField = page.locator('#password');
        this.signInButton = page.locator('#kc-login');
    }

    async logIn() {
        await test.step('Log in Trade Portal', async () => {
            let testAgentUsername = getEnvVar('TEST_AGENT_USERNAME');
            let testAgentPassword = getEnvVar('TEST_AGENT_PASSWORD');

            await this.usernameField.fill(testAgentUsername);
            await this.passwordField.fill(testAgentPassword);
            await this.signInButton.click();
        });
    }
}
