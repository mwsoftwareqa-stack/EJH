import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {
    shouldBeVisible,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class AmendPaymentTransferCard extends PageWidget {
    private readonly title: Locator;
    private readonly description: Locator;
    private readonly transferIcon: Locator;

    constructor(page: Page, testIdOrSelector: string, isSelector?: boolean) {
        super(page, testIdOrSelector, {isSelector: isSelector});
        this.title = this.findInside('.card__title');
        this.description = this.findInside('.amend-transfer-card__content');
        this.transferIcon = this.findInside('.card__icon');
    }

    async shouldBeDisplayedWithRelevantDetails(options: {title: string}) {
        await test.step('Amend payment transfer card should be displayed with relevant details', async () => {
            await textShouldContain(this.title, options.title);
            await textShouldNotBeNullOrEmptyByLocator(this.description);
            await shouldBeVisible(this.transferIcon);
        });
    }
}
