import test, {Locator, Page} from '@playwright/test';

import {shouldBeVisible, textShouldBe} from '../helpers/assertionHelper';
import {BasePage} from './core/basePage';
import {AmedSeatsTPConfirmationPopup} from './elements/tradePortalConfirmationPage/amedSeatsTPConfirmationPopup';
import {AmendDatesTPConfirmationPopup} from './elements/tradePortalConfirmationPage/amendDatesTPConfirmationPopup';
import {AmendFlightsTPConfirmationPopup} from './elements/tradePortalConfirmationPage/amendFlightsTPConfirmationPopup';
import {AmendTransferTPConfirmationPopup} from './elements/tradePortalConfirmationPage/amendTransferTPConfirmationPopup';
import {ConfirmationHeroBanner} from './elements/tradePortalConfirmationPage/confirmationPageHeroBanner';
import {ConfirmationTransferTPCard} from './elements/tradePortalConfirmationPage/confirmationTransferTPCard';
import {PriceBreakdownTPComponent} from './elements/tradePortalConfirmationPage/Price Breakdown/priceBreakdownTPComponent';
import {TPConfirmationPromoCodeSection} from './elements/tradePortalConfirmationPage/TPConfirmationPromoCodeSection';

export class TradePortalConfirmationPage extends BasePage {
    private readonly confirmNowButton: Locator;
    private readonly confirmNowSeatsButton: Locator;
    private readonly bookingReferenceField: Locator;
    private readonly title: Locator;
    private readonly icon: Locator;

    public readonly datesConfirmationPopup: AmendDatesTPConfirmationPopup;
    public readonly transferConfirmationPopup: AmendTransferTPConfirmationPopup;
    public readonly flightsConfirmationPopup: AmendFlightsTPConfirmationPopup;
    public readonly seatsConfirmationPopup: AmedSeatsTPConfirmationPopup;
    public readonly heroBanner: ConfirmationHeroBanner;
    public readonly priceBreakdown: PriceBreakdownTPComponent;
    public readonly transferCard: ConfirmationTransferTPCard;
    public readonly promoCodeSection: TPConfirmationPromoCodeSection;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/find-booking';

        this.confirmNowButton = page.getByTestId('confirm-now-button');
        this.confirmNowSeatsButton = page.getByTestId('confirm-change-seats');
        this.bookingReferenceField = this.getByDataTid('bookingReference');
        // [TODO 25/11/2025 AW] Update locators once MAN-3162 is implemented
        this.title = page.locator('h3[class*="title"]').first();
        this.icon = page.locator('svg[class*="text-interactive-hover"]');

        this.datesConfirmationPopup = new AmendDatesTPConfirmationPopup(page, 'success-modal');
        this.transferConfirmationPopup = new AmendTransferTPConfirmationPopup(page, 'success-modal');
        this.flightsConfirmationPopup = new AmendFlightsTPConfirmationPopup(page, 'success-modal');
        this.seatsConfirmationPopup = new AmedSeatsTPConfirmationPopup(page, 'success-modal');
        this.heroBanner = new ConfirmationHeroBanner(page, 'hero-banner-secondary');
        this.priceBreakdown = new PriceBreakdownTPComponent(page, 'desktop-price-breakdown');
        this.transferCard = new ConfirmationTransferTPCard(page, 'transfer-card');
        // Update locator once MAN-3016 is done
        this.promoCodeSection = new TPConfirmationPromoCodeSection(
            page,
            '[data-testId="collapsible-container"][aria-live="polite"]',
            true,
        );
    }

    async clickConfirmNowButton() {
        await test.step('Click Confirm Now button on Trade Portal Confirmation page', async () => {
            await this.confirmNowButton.click();
            await this.waitUntilSpinnerButtonDisappears();
        });
    }

    async clickConfirmNowSeatsButton() {
        await test.step('Click Confirm Now Seats button on Trade Portal Confirmation page', async () => {
            await this.confirmNowSeatsButton.click();
            await this.waitUntilSpinnerButtonDisappears();
        });
    }

    async transferConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Transfer Confirmation popup should not be displayed for Trade Portal', async () => {
            await this.transferConfirmationPopup.shouldNotBeVisible();
        });
    }

    async datesConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Dates Confirmation popup should not be displayed for Trade Portal', async () => {
            await this.datesConfirmationPopup.shouldNotBeVisible();
        });
    }

    async seatsConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Seats Confirmation popup should not be displayed for Trade Portal', async () => {
            await this.seatsConfirmationPopup.shouldNotBeVisible();
        });
    }

    async flightsConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Flights Confirmation popup should not be displayed for Trade Portal', async () => {
            await this.flightsConfirmationPopup.shouldNotBeVisible();
        });
    }

    async findBookingPageShouldBeOpened() {
        await test.step('Find Booking page should be opened', async () => {
            await shouldBeVisible(this.bookingReferenceField);
            await this.pageUrlShouldBeOpened();
        });
    }

    async titleSectionShouldBeDisplayedWithRelevantDetails(options: {expectedTitle: string}) {
        await test.step('Title section should be displayed with relevant details', async () => {
            await textShouldBe(this.title, options?.expectedTitle, {ignoreCase: true});
            await this.icon.waitFor({state: 'visible'});
        });
    }
}
