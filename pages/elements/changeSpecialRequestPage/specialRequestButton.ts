import {expect, Locator, Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';

export class SpecialRequestButton extends PageWidget {
    
    constructor(
        page: Page,
        testId: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number},
    ) {
        super(page, testId, options);

    }
    public async click() {
        await this.waitUntilAttached();
        await this.clickRootElement();
    }

    public async isVisible(): Promise<boolean> {
        try {
            await this.locator.waitFor({state: 'visible', timeout: 1000});
            return true;
        } catch {
            return false;
        }
    }
    
    public async shouldBeSelected(): Promise<void> {
        await this.waitUntilAttached();
        await expect(this.locator).toHaveAttribute(
            'aria-label',
            /Remove special request/
        );
    }
    
    public async shouldBeDeselected(): Promise<void> {
        await this.waitUntilAttached();
        await expect(this.locator).toHaveAttribute(
            'aria-label',
            /Add special request/
        );
    }
}

