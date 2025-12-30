import test, {Locator, Page} from '@playwright/test';

import {
    shouldBeVisible,
    shouldHaveAttribute,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ChangeFeesBanner extends PageWidget {
    private readonly description: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector});
        this.description = this.findInsideByTestId('collapsible-banner-content');
    }

    async changeFeesBannerShouldBeDisplayedWithDescription(description: string) {
        await test.step('Change Fees banner should be displayed with description', async () => {
            // Wait for banner to be visible (will throw if not found or not visible)
            await shouldBeVisible(this.rootLocator);

            // Check if description element exists
            const descriptionCount = await this.description.count();
            if (descriptionCount === 0) {
                throw new Error(
                    'Change Fees banner description element is not found. Expected element with data-testid="collapsible-banner-content" inside change-fees-banner',
                );
            }

            await textShouldContain(this.description.first(), description);
        });
    }
}
