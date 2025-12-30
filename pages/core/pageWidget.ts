import {expect, Locator, Page} from '@playwright/test';

export abstract class PageWidget {
    protected readonly page: Page;
    protected readonly rootLocator: Locator;

    constructor(
        page: Page,
        testIdOrSelector: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number; rootLocator?: Locator},
    ) {
        this.page = page;

        const selector = options?.isSelector ? testIdOrSelector : `[data-testid='${testIdOrSelector}']`;

        let foundLocator = page.locator(selector, options?.text ? {hasText: options.text} : {});

        if (options?.numberOfElement !== undefined) {
            // index is equal to number - 1
            foundLocator = foundLocator.nth(options.numberOfElement - 1);
        }

        this.rootLocator = options?.rootLocator ?? foundLocator;
    }

    get locator(): Locator {
        return this.rootLocator;
    }

    findInside(selectorOrLocator: string | Locator) {
        return this.rootLocator.locator(selectorOrLocator);
    }

    findInsideByTwoTestIds(
        selectorOrLocator1: string | Locator,
        selectorOrLocator2: string | Locator,
        options?: {isOldTestId?: boolean},
    ) {
        if (options?.isOldTestId) {
            return this.rootLocator.locator(
                `[data-tid='${selectorOrLocator1}'] [data-tid='${selectorOrLocator2}']`,
            );
        } else {
            return this.rootLocator.locator(
                `[data-testid='${selectorOrLocator1}'] [data-testid='${selectorOrLocator2}']`,
            );
        }
    }

    findInsideByTestId(selectorOrLocator: string | RegExp, options?: {isOldTestId: boolean}) {
        if (options?.isOldTestId) {
            return this.rootLocator.locator(`[data-tid='${selectorOrLocator}']`);
        } else {
            return this.rootLocator.getByTestId(selectorOrLocator);
        }
    }

    findInsideByText(selectorOrLocator: string | Locator, text: string) {
        return this.rootLocator.locator(selectorOrLocator, {hasText: text});
    }

    protected async findAllInsidePageWidgets<T extends PageWidget>(
        widgetClass: new (
            page: Page,
            selector: string,
            options?: {isSelector?: boolean; text?: string; numberOfElement?: number; locator?: Locator},
        ) => T,
        testId: string,
    ): Promise<T[]> {
        const locator = this.findInsideByTestId(testId);
        const count = await locator.count();
        const widgets: T[] = [];

        for (let i = 0; i < count; i++) {
            let locatorItem = locator.nth(i + 1);
            const widget = new widgetClass(this.page, testId, {
                isSelector: false,
                numberOfElement: i + 1,
                locator: locatorItem,
            });
            widgets.push(widget);
        }

        return widgets;
    }

    protected async findAllInsidePageWidgetsBySelector<T extends PageWidget>(
        widgetClass: new (page: Page, selector: string, isSelector: boolean) => T,
        selector: string,
    ): Promise<T[]> {
        const locator = this.findInside(selector);
        const count = await locator.count();
        const widgets: T[] = [];

        for (let i = 0; i < count; i++) {
            const nthSelector = `${selector}:nth-child(${i + 1})`;
            const widget = new widgetClass(this.page, nthSelector, true);
            widgets.push(widget);
        }

        return widgets;
    }

    public async waitForLoaded(selector: string, timeoutMs = 10000) {
        await this.locator.locator(selector).first().waitFor({
            state: 'attached',
            timeout: timeoutMs,
        });
    }

    async getClass() {
        return await this.rootLocator.getAttribute('class');
    }

    public async hasClass(className: string): Promise<boolean> {
        return await this.rootLocator.evaluate((element, name) => element.classList.contains(name), className);
    }

    async clickRootElement() {
        await this.waitUntilAttached();
        await this.rootLocator.click();
    }

    async click(locator: Locator) {
        await locator.waitFor({state: 'attached'});
        await locator.click();
    }

    async shouldBeVisible() {
        await expect(this.rootLocator).toBeVisible();
    }

    async shouldNotBeVisible() {
        await expect(this.rootLocator).not.toBeVisible();
    }

    async waitUntilAttached() {
        await this.rootLocator.waitFor({state: 'attached'});
    }
}
