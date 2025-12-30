import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {textShouldBe} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ConfirmationHeroBanner extends PageWidget {
    private readonly breadcrumbLink: Locator;
    private readonly breadcrumb: Locator;
    private readonly title: Locator;
    private readonly subtitle: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.breadcrumbLink = this.findInside('[aria-label="Breadcrumb navigation"] a');
        this.breadcrumb = this.findInsideByTestId('current-page-link');
        this.title = this.findInsideByTestId('hero-banner-title');
        this.subtitle = this.findInsideByTestId('hero-banner-description');
    }

    async shouldBeDisplayedWithRelevantDetails(options: {
        breadcrumbLink: string;
        breadcrumb: string;
        title: string;
        subtitle: string;
    }) {
        await test.step('Confirmation page Hero Banner should be displayed with relevant details', async () => {
            await textShouldBe(this.breadcrumbLink, options.breadcrumbLink);
            await textShouldBe(this.breadcrumb, options.breadcrumb);
            await textShouldBe(this.title, options.title);
            await textShouldBe(this.subtitle, options.subtitle);
        });
    }

    async clickBreadcrumbLink() {
        await test.step('Click on breadcrumb link on Confirmation page', async () => {
            await this.breadcrumbLink.click();
        });
    }
}
