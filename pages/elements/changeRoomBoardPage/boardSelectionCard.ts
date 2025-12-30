import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class BoardSelectionCard extends PageWidget {
    private readonly title: Locator;
    private readonly priceButton: Locator;
    private readonly selectedLabel: Locator;

    constructor(page: Page, testIdOrSelector: string, options?: {isSelector?: boolean}) {
        super(page, testIdOrSelector, options);
        this.title = this.findInside('h2');
        this.priceButton = this.findInside('button');
        this.selectedLabel = this.findInside('div').filter({hasText: /^Selected$/});
    }

    async shouldBeDisplayedWithDetails(options: {title: string}) {
        await test.step('Board selection card should be displayed with relevant details', async () => {
            await shouldBeVisible(this.title);
            await textShouldBe(this.title, options.title);
        });
    }

    async shouldBeSelected() {
        await test.step('Board selection card should be marked as selected', async () => {
            await shouldBeVisible(this.selectedLabel);
        });
    }

    async clickPriceButton() {
        await test.step('Click price button on board card', async () => {
            await this.click(this.priceButton);
        });
    }
}
