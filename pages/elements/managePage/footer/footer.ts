import test, {Locator, Page} from '@playwright/test';
import {shouldBeTrue, shouldHaveAttribute, textShouldContain} from '../../../../helpers/assertionHelper';
import {PageWidget} from '../../../core/pageWidget.ts';
import {FooterLinksSection} from './footerLinksSection.ts';

export class Footer extends PageWidget {
    private readonly bookingConditionLink: Locator;
    private readonly privacyPolicyLink: Locator;
    private readonly cookiePolicyLink: Locator;
    private readonly helpCentreLink: Locator;
    private readonly paymentIcons: Locator;
    private readonly offerConditionsButton: Locator;

    public readonly footerLinksSection: FooterLinksSection;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.bookingConditionLink = this.findInsideByText('a[href]', 'Booking conditions');
        this.privacyPolicyLink = this.findInsideByText('a[href]', 'Privacy policy');
        this.cookiePolicyLink = this.findInsideByText('a[href]', 'Cookie policy');
        this.helpCentreLink = this.findInsideByText('a[href]', 'Help centre');
        this.paymentIcons = this.findInsideByTestId('payment-icons-container');
        this.offerConditionsButton = this.findInside(
            "[data-testid='collapsible-trigger-button'][aria-label*='Offer conditions']",
        );
        // Update locator once MAN-3016 is done
        this.footerLinksSection = new FooterLinksSection(page, '.py-5', true);
    }

    async shouldBeDisplayedWithRelevantDetails() {
        await test.step('Footer should be displayed with relevant details', async () => {
            let footerLinksSection = this.footerLinksSection;
            let expectedFooterLinksCount = 6;

            await shouldHaveAttribute(this.bookingConditionLink, 'href', '/info/booking-conditions', true);
            await shouldHaveAttribute(this.privacyPolicyLink, 'href', '/policy/privacy-notice', true);
            await shouldHaveAttribute(this.cookiePolicyLink, 'href', '/info/cookie-policy', true);
            await shouldHaveAttribute(this.helpCentreLink, 'href', '/help', true);
            await textShouldContain(this.offerConditionsButton, 'Offer conditions', undefined);
            let attribute = await this.offerConditionsButton.getAttribute('aria-expanded');
            await shouldBeTrue(attribute === 'false');
            await this.paymentIcons.waitFor({state: 'visible'});

            await footerLinksSection.exploreMoreLabelShouldContainText('Explore more holidays and flights');
            await footerLinksSection.amountOfFooterLinkButtonsShouldBe(expectedFooterLinksCount);
            await footerLinksSection.footerLinkButtonsShouldNotBePressed();
        });
    }
}
