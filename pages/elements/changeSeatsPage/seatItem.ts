import {Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';

export class SeatItem extends PageWidget {
    constructor(
        page: Page,
        selectorOrTestId: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number},
    ) {
        super(page, selectorOrTestId, options);
    }

    public async isSeatFree(): Promise<boolean> {
        return this.hasClass('seat-item--free');
    }

    public async isSelected(): Promise<boolean> {
        return this.hasClass('seat-item--selected');
    }

    public async getSeatNumber(): Promise<string | null> {
        return this.locator.getAttribute('aria-label');
    }

    public async select(): Promise<string> {
        await this.waitUntilAttached();

        const number = await this.getSeatNumber();
        if (!number) {
            throw new Error('Seat number (aria-label) was not found on the seat element.');
        }

        await this.clickRootElement();
        return number;
    }
}
