import {Locator, Page} from '@playwright/test';

import {test} from '../../../core/fixtures/baseFixture';
import {waitUntil} from '../../../helpers/waitHelper';
import {PageWidget} from '../../core/pageWidget';

export class ViewBookingFlightsSection extends PageWidget {
    private readonly changeFlightsButton: Locator;

    constructor(page: Page, selector: string) {
        super(page, selector);
        this.changeFlightsButton = this.findInside('.holiday-summary-item__btn-amend button');
    }

    async clickChangeFlightsButton() {
        await test.step('Click change flights button', async () => {
            await waitUntil(
                async () => {
                    const classAtr = await this.changeFlightsButton.getAttribute('class');
                    return classAtr !== null && !classAtr.includes('placeholder-shimmer');
                },
                {customMessage: 'Change Transfer button still is not clickable.'},
            );

            await this.changeFlightsButton.click();
        });
    }
}
