import {Locator, Page} from '@playwright/test';
import {getEnvConfig} from '../../core/config/envConfigHelper';
import {test} from '../../core/fixtures/baseFixture';
import {waitForNewTab} from '../../helpers/waitHelper';

export abstract class BasePage {
    readonly page: Page;
    readonly spinner: Locator;
    readonly spinnerButton: Locator;
    readonly shimmer: Locator;

    private readonly envConfig = getEnvConfig();
    private readonly basePath = `${this.envConfig.baseUrl}/en/holidays`;
    protected pagePath: string = '';

    constructor(page: Page) {
        this.page = page;
        this.spinner = page.locator('.overlay-spinner');
        this.spinnerButton = page.locator('.\\!text-transparent').first();
        this.shimmer = page.locator('.animate-shimmer').first();
    }

    protected get getFullUrl() {
        return `${this.basePath}${this.pagePath}`;
    }

    async goToUrl(url?: string) {
        await this.page.goto(this.getFullUrl + (url || ''));
    }

    async pageUrlShouldBeOpened() {
        await test.step(`'${this.getFullUrl}' url should be opened`, async () => {
            this.page.url() === this.getFullUrl;
        });
    }

    async waitUntilSpinnerDisappears(timeout: number = 5000) {
        // Wait for spinner to appear (up to 5 seconds by default)
        try {
            await this.spinner.waitFor({
                state: 'visible',
                timeout: timeout,
            });
        } catch (e) {}

        await this.spinner.waitFor({
            state: 'detached',
            timeout: 60000,
        });
    }

    async waitUntilSpinnerButtonDisappears(timeout: number = 5000) {
        // Wait for spinner button to appear (up to 5 seconds by default)
        try {
            await this.spinnerButton.waitFor({
                state: 'visible',
                timeout: timeout,
            });
        } catch (e) {}

        await this.spinnerButton.waitFor({
            state: 'detached',
            timeout: 90000,
        });
    }

    async waitUntilShimmerDisappears(timeout: number = 5000) {
        // Wait for shimmer to appear (up to 5 seconds by default)
        try {
            await this.shimmer.waitFor({
                state: 'visible',
                timeout: timeout,
            });
        } catch (e) {}

        await this.shimmer.waitFor({
            state: 'detached',
            timeout: 90000,
        });
    }

    getByDataTid(dataTid: string) {
        return this.page.locator(`[data-tid='${dataTid}']`);
    }

    async click(locator: Locator) {
        await locator.waitFor({state: 'attached'});
        await locator.click();
    }

    async shouldBeOpenedInNewTab<T>(action: () => Promise<void>, pageClass: new (page: Page) => T): Promise<T> {
        return await test.step(`${pageClass.name} should be opened in a new tab`, async () => {
            let newPage = await waitForNewTab(this.page, action);
            return new pageClass(newPage);
        });
    }
}
