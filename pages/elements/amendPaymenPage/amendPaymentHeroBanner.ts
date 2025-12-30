import test, {Locator, Page} from '@playwright/test';
import {textShouldBe} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class AmendPaymentHeroBanner extends PageWidget {
    private readonly breadcrumbLink: Locator;
    private readonly breadcrumb: Locator;
    private readonly title: Locator;
    private readonly description: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.breadcrumbLink = this.findInsideByTestId('link-to-previous-page', {isOldTestId: true});
        this.breadcrumb = this.findInsideByTestId('current-page', {isOldTestId: true});
        this.title = this.findInsideByTestId('amend-payment-header-title', {isOldTestId: true});
        this.description = this.findInsideByTestId('amend-payment-header-subtitle', {isOldTestId: true});
    }

    async shouldBeDisplayedWithAllRelevantData(options: {
        breadcrumbLink: string;
        breadcrumb: string;
        title: string;
        subtitle: string;
    }) {
        await test.step('Hero banner should be displayed on Change Confirmation page with all relevant data', async () => {
            await textShouldBe(this.breadcrumbLink, options.breadcrumbLink);
            await textShouldBe(this.breadcrumb, options.breadcrumb);
            await textShouldBe(this.title, options.title);
            await textShouldBe(this.description, options.subtitle);
        });
    }

    async clickBreadcrumbLink() {
        await this.breadcrumbLink.click();
    }
}
