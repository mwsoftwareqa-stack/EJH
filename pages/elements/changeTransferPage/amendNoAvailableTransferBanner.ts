import {Locator, Page, TestInfo} from '@playwright/test';

import {test} from '../../../core/fixtures/baseFixture';
import {
    shouldBeVisible,
    shouldHaveAttribute,
    shouldNotBeDisplayed,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {isMobileBrowser} from '../../../helpers/testInfoHelper';
import {PageWidget} from '../../core/pageWidget';

export class AmendNoAvailableTransferBanner extends PageWidget {
    private readonly exclamationMarkIcon: Locator;
    private readonly subText: Locator;
    private readonly contactUsLink: Locator;
    private readonly contactUsLinkMobile: Locator;
    private readonly viewLessButton: Locator;
    private readonly viewMoreButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.exclamationMarkIcon = this.findInsideByTestId('exclamation-mark');
        this.subText = this.findInsideByTestId('collapsible-banner-content');
        this.contactUsLink = this.findInside('[data-testid="top-content"] [data-testid="contact-link"]');
        this.contactUsLinkMobile = this.findInside(
            '[data-testid="bottom-content"] [data-testid="contact-link-mobile"]',
        );
        this.viewMoreButton = this.findInside(
            '[data-testid="collapsible-trigger-button"][aria-label="View more"]',
        );
        this.viewLessButton = this.findInside(
            '[data-testid="collapsible-trigger-button"][aria-label="View less"]',
        );
    }

    async shouldBeDisplayedWithRelevantDetails() {
        await test.step('No Available Transfer banner should be displayed with all relevant details', async () => {
            await shouldBeVisible(this.exclamationMarkIcon);
            await textShouldNotBeNullOrEmptyByLocator(this.subText);
            await textShouldContain(this.subText, "We're sorry, there's no other available transfer.");
            await shouldNotBeDisplayed(this.viewMoreButton);
            await shouldBeVisible(this.viewLessButton);
        });
    }

    async contactUsLinkShouldBeDisplayed(testInfo: TestInfo) {
        await test.step('Contact Us link should be displayed', async () => {
            if (isMobileBrowser(testInfo)) {
                await shouldBeVisible(this.contactUsLinkMobile);
            } else {
                await shouldBeVisible(this.contactUsLink);
            }
        });
    }

    async clickViewMoreButton() {
        await test.step('Click View More in No Other Available Transfer banner', async () => {
            await this.viewMoreButton.click();
        });
    }

    async clickViewLessButton() {
        await test.step('Click View Less in No Other Available Transfer banner', async () => {
            await this.viewLessButton.click();
        });
    }

    async clickContactUsLink() {
        await test.step('Click Contact Us link in No Other Available Transfer banner', async () => {
            await this.contactUsLink.click();
        });
    }

    async clickContactUsLinkMobile() {
        await test.step('Click Contact Us link in No Other Available Transfer banner', async () => {
            await this.contactUsLinkMobile.click();
        });
    }

    async viewMoreButtonShouldBeDisplayed() {
        await test.step('View More button should be displayed', async () => {
            await shouldBeVisible(this.viewMoreButton);
        });
    }

    async viewLessButtonShouldBeDisplayed() {
        await test.step('View Less button should be displayed', async () => {
            await shouldBeVisible(this.viewLessButton);
        });
    }

    async viewMoreButtonShouldNotBeDisplayed() {
        await test.step('View More button should not be displayed', async () => {
            await shouldNotBeDisplayed(this.viewMoreButton);
        });
    }

    async viewLessButtonShouldNotBeDisplayed() {
        await test.step('View Less button should not be displayed', async () => {
            await shouldNotBeDisplayed(this.viewLessButton);
        });
    }

    async shouldBeCollapsed() {
        await test.step('No Available Transfer banner should be collapsed', async () => {
            await shouldHaveAttribute(this.rootLocator, 'data-state', 'closed');
        });
    }

    async shouldBeExpanded() {
        await test.step('No Available Transfer banner should be expanded', async () => {
            await shouldHaveAttribute(this.rootLocator, 'data-state', 'open');
        });
    }
}
