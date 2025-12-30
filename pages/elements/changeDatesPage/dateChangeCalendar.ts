import test, {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeDatesCalendar extends PageWidget {
    private readonly availableDates: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.availableDates = this.findInside('button[data-day][data-disabled="false"][data-selected="false"]');
    }

    async selectFirstAvailableDate() {
        return await test.step('Select first available date on Change Dates page', async () => {
            let date = await this.availableDates.first().getAttribute('data-day');
            await this.availableDates.first().click();

            return new Date(date!);
        });
    }

    async selectDate(newDate: Date) {
        return await test.step(`Select ${newDate.toDateString()} date on Change Dates page`, async () => {
            await this.findInside(`[data-day="${newDate.toLocaleDateString('en-US')}"]`).click();
        });
    }
}
