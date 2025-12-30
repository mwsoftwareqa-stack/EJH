import test, {expect, Locator, Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';
import {SpecialRequestButton} from './specialRequestButton';

export class SpecialRequestList extends PageWidget {
    private specialRequestButtons: Map<string, SpecialRequestButton> = new Map();
  
    constructor(
        page: Page,
        selectorOrTestId: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number},
    ) {
        super(page, selectorOrTestId, options);
    }

    public getButton(testId: string): SpecialRequestButton {
        if (!this.specialRequestButtons.has(testId)) {
            const button = new SpecialRequestButton(this.page, testId);
            this.specialRequestButtons.set(testId, button);
        }
        return this.specialRequestButtons.get(testId)!;
    }

    public async clickButton(testId: string) {
        await test.step(`Click special request button: ${testId}`, async () => {
            const button = this.getButton(testId);
            await button.click();
        });
    }

    public async shouldButtonBeVisible(testId: string) {
        await test.step(`Special request button ${testId} should be visible`, async () => {
            const button = this.getButton(testId);
            await button.shouldBeVisible();
        });
    }

    public async shouldButtonNotBeVisible(testId: string) {
        await test.step(`Special request button ${testId} should not be visible`, async () => {
            const button = this.getButton(testId);
            await button.shouldNotBeVisible();
        });
    }
}

