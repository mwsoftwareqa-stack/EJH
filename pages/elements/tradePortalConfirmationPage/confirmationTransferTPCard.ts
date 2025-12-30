import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {
    shouldBeVisible,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ConfirmationTransferTPCard extends PageWidget {
    private readonly title: Locator;
    private readonly description: Locator;
    private readonly privateTransferIcon: Locator;
    private readonly sharedTransferIcon: Locator;
    private readonly ownWayTransferIcon: Locator;

    constructor(page: Page, testIdOrSelector: string, isSelector?: boolean) {
        super(page, testIdOrSelector, {isSelector: isSelector});
        this.title = this.findInsideByTestId('transfer-card-title');
        this.description = this.findInsideByTestId('transfer-card-content');
        this.privateTransferIcon = this.findInsideByTestId('transfer-taxi-solid-icon');
        this.sharedTransferIcon = this.findInsideByTestId('transfer-solid-icon');
        this.ownWayTransferIcon = this.findInsideByTestId('no-transfer-icon');
    }

    async shouldBeDisplayedWithRelevantDetails(options: {title: string}) {
        await test.step('Confirmation transfer card on trade portal should be displayed with relevant details', async () => {
            await textShouldContain(this.title, options.title);
            await textShouldNotBeNullOrEmptyByLocator(this.description);

            switch (options.title) {
                case 'Private taxi':
                    await shouldBeVisible(this.privateTransferIcon);
                    break;
                case 'Shared transfer':
                    await shouldBeVisible(this.sharedTransferIcon);
                    break;
                case 'own way':
                    await shouldBeVisible(this.ownWayTransferIcon);
                    break;
            }
        });
    }
}
