import test, {Locator, Page} from '@playwright/test';

import {
    shouldBeVisible,
    shouldHaveAttribute,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class InformationBanner extends PageWidget {
    private readonly icon: Locator;
    private readonly description: Locator;
    private readonly expandButton: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector});
        this.icon = this.findInsideByTestId('warning-info-with-padding-icon');
        this.description = this.findInsideByTestId('collapsible-banner-content-container');
        this.expandButton = this.findInsideByTestId('collapsible-trigger-button');
    }

    async infoBannerShouldBeDisplayedOnChangePageWithState(options: {
        state: 'closed' | 'open';
        description?: string;
    }) {
        await test.step('Change Flights page should have collapsed information banner displayed', async () => {
            // Check if banner is present and visible
            const isVisible = await this.rootLocator.isVisible().catch(() => false);
            if (!isVisible) {
                throw new Error(
                    'Information banner is not visible or not present on the page. Expected collapsible container element',
                );
            }

            await shouldBeVisible(this.icon);
            if (options.description === undefined) {
                await textShouldNotBeNullOrEmptyByLocator(this.description);
            } else {
                await textShouldContain(this.description, options.description);
            }
            await shouldHaveAttribute(this.rootLocator, 'data-state', options.state);
        });
    }

    async infoBannerShouldBeDisplayedOnChangeNamePageWithState(state: 'closed' | 'open') {
        await test.step(`Change Name page should have ${state} Information Banner displayed`, async () => {
            // Check if banner is present and visible
            const isVisible = await this.rootLocator.isVisible().catch(() => false);
            if (!isVisible) {
                throw new Error(
                    'Information banner is not visible or not present on the page. Expected collapsible container element',
                );
            }

            await shouldBeVisible(this.icon);
            await textShouldContain(
                this.description,
                'Just so you know...If you need to change more than 3 characters',
            );
            await shouldHaveAttribute(this.rootLocator, 'data-state', state);
        });
    }

    async expand() {
        await test.step('Expand information banner', async () => {
            // Check if banner is present and visible
            const isVisible = await this.rootLocator.isVisible().catch(() => false);
            if (!isVisible) {
                throw new Error(
                    'Information banner is not visible or not present on the page. Cannot expand banner that does not exist.',
                );
            }

            // Check if expand button exists
            const buttonCount = await this.expandButton.count();
            if (buttonCount === 0) {
                throw new Error(
                    'Information banner expand button is not found. Expected element with data-testid="collapsible-trigger-button"',
                );
            }

            await this.expandButton.click();
        });
    }
}
