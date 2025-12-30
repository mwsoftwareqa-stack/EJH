import {Locator, Page} from '@playwright/test';

import {test} from '../../../core/fixtures/baseFixture';
import {textShouldBe, textShouldNotBeNullOrEmptyByString} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class AmendHeroBanner extends PageWidget {
    private readonly breadcrumbLink: Locator;
    private readonly breadcrumb: Locator;
    private readonly title: Locator;
    private readonly image: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.breadcrumbLink = this.findInsideByTestId('manage-holiday-link');
        this.breadcrumb = this.findInsideByTestId('current-page-link');
        this.title = this.findInsideByTestId('hero-banner-title');
        this.image = this.findInside('img');
    }

    async shouldBeDisplayedWithRelevantDetails(options: {
        breadcrumbLink: string;
        breadcrumb: string;
        title: string;
    }) {
        await test.step('Change page Hero Banner should be displayed with relevant details', async () => {
            await textShouldBe(this.breadcrumbLink, options.breadcrumbLink);
            await textShouldBe(this.breadcrumb, options.breadcrumb);
            await textShouldBe(this.title, options.title);

            await this.image.waitFor({state: 'attached'});
            const srcset = await this.image.getAttribute('srcset');
            await textShouldNotBeNullOrEmptyByString(srcset);
        });
    }

    async clickBreadcrumbLink() {
        await test.step('Click on breadcrumb link on Change page', async () => {
            await this.breadcrumbLink.click();
        });
    }
}
