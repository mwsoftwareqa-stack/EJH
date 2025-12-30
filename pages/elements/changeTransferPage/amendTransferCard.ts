import test, {Locator, Page} from '@playwright/test';

import {
    shouldBeVisible,
    textShouldBe,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class AmendTransferCard extends PageWidget {
    private readonly icon: Locator;
    private readonly title: Locator;
    private readonly description: Locator;
    private readonly selectButton: Locator;

    constructor(page: Page, testIdOrSelector: string, text?: string) {
        super(page, testIdOrSelector, {text});
        this.icon = this.findInsideByTestId('transfer-solid-icon');
        this.title = this.findInsideByTestId('transfer-card-title');
        this.description = this.findInsideByTestId('transfer-card-content');
        this.selectButton = this.findInsideByTestId('transfer-button');
    }

    async selectedTransferCardShouldBeDisplayedWithRelevantDetails() {
        await test.step('Selected transfer card should be displayed with relevant details', async () => {
            await shouldBeVisible(this.icon);
            await textShouldBe(this.title, 'Shared - Shuttle Bus');
            await textShouldNotBeNullOrEmptyByLocator(this.description);
            await textShouldBe(this.selectButton, 'Selected');
        });
    }

    async clickSelectButton() {
        await this.selectButton.click();
    }
}
