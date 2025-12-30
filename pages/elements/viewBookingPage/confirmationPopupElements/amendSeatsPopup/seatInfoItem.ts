import {Locator, Page} from '@playwright/test';
import {PageWidget} from '../../../../core/pageWidget';

export class SeatInfoItem extends PageWidget {
    private readonly seatNumber: Locator;
    private readonly priceBand: Locator;

    constructor(page: Page, selector: string, isSelector: boolean, numberOfElement?: number) {
        super(page, selector, {isSelector, numberOfElement});

        this.seatNumber = this.findInside('[data-testid*="seat-number"]');
        this.priceBand = this.findInside('[data-testid*="seat-label"]');
    }

    public async getSeatNumber(): Promise<string> {
        await this.seatNumber.waitFor({state: 'visible'});
        return (await this.seatNumber.innerText()).trim();
    }

    public async getPriceBand(): Promise<string> {
        await this.priceBand.waitFor({state: 'visible'});
        return (await this.priceBand.innerText()).trim();
    }
}
