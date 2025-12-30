import {Locator, Page} from '@playwright/test';

import {waitUntil} from '../../../helpers/waitHelper';
import {PageWidget} from '../../core/pageWidget';

export class TransfersSection extends PageWidget {
    private readonly changeTransferButton: Locator;

    constructor(page: Page, selector: string) {
        super(page, selector);
        this.changeTransferButton = this.findInside('.holiday-summary-item__btn-amend button');
    }

    async clickChangeTransferButton() {
        await waitUntil(
            async () => {
                const classAtr = await this.changeTransferButton.getAttribute('class');
                return classAtr !== null && !classAtr.includes('placeholder-shimmer');
            },
            {customMessage: 'Change Transfer button still is not clickable.'},
        );

        await this.changeTransferButton.click();
    }
}
