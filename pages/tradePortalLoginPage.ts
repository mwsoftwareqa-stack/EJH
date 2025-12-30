import {Locator, Page} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {BasePage} from './core/basePage';

export class TradePortalLoginPage extends BasePage {
    private readonly logInButton: Locator;
    acceptCookiesButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/trade-portal/log-in';
        this.acceptCookiesButton = this.page.getByRole('button', {name: 'Accept Cookies'});
        this.logInButton = this.getByDataTid('sso-sign-in-button');
    }

    async openLoginPageAndClickLoginButton() {
        await test.step('Open Trade Portal Login page and click Login button', async () => {
            await this.goToUrl();
            // wait the page to be loaded
            await this.page.waitForLoadState('networkidle');
            // if accept cookies button is visible, click it
            if (await this.acceptCookiesButton.isVisible()) {
                await this.acceptCookiesButton.click();
            }
            await this.logInButton.click();
        });
    }
}
