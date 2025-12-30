import test, {Locator, Page, TestInfo} from '@playwright/test';

import {GetAlternativeFlightsResponse} from '@easyjet-dev/ejh-domain-models';
import {shouldHaveExactNumberOfElements, textShouldBe, textShouldContain} from '../helpers/assertionHelper';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {WebApiClient} from '../services/webApi/webApiClient';
import {BasePage} from './core/basePage';
import {AmendFlightCard} from './elements/changeFlightsPage/amendFlightCard';
import {AmendHeroBanner} from './elements/common/amendHeroBanner';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';
import {InformationBanner} from './elements/common/informationBanner';

export class ChangeFlightsPage extends BasePage {
    private readonly description: Locator;
    private readonly continueButton: Locator;
    private readonly alertBanner: Locator;
    private readonly changeFlightTitle: Locator;
    private readonly altFlightsAmount: Locator;
    private readonly seeFlightsButton: Locator;
    private readonly altFlightCards: Locator;

    public readonly heroBanner: AmendHeroBanner;
    public readonly informationBanner: InformationBanner;
    public readonly selectedFlightCard: AmendFlightCard;
    public readonly firstAltFlightCard: AmendFlightCard;
    public readonly basketFooter: ChangeBasketFooter;

    constructor(page: Page, webApiClient: WebApiClient) {
        super(page);
        this.continueButton = this.page.getByTestId('confirm-flight-button');
        this.description = this.page.getByTestId('hero-banner-description');
        this.alertBanner = this.page.getByTestId('collapsible-banner-content-container');
        this.changeFlightTitle = this.page.getByTestId('change-flight-title');
        this.altFlightsAmount = this.page.getByTestId('alternative-flights-amount');
        this.seeFlightsButton = this.page.getByTestId('see-flights-button');
        this.altFlightCards = this.page.getByTestId('flight-card');

        this.heroBanner = new AmendHeroBanner(page, 'hero-banner');
        this.informationBanner = new InformationBanner(
            page,
            '[data-testid="flight-alert-banner"] [data-testid="collapsible-container"]',
            true,
        );
        this.selectedFlightCard = new AmendFlightCard(page, 'selected-flight-card', webApiClient);
        this.firstAltFlightCard = new AmendFlightCard(page, 'flight-card', webApiClient, 1);
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');
    }

    async clickSeeFlightsButtonIfNoOtherFlightsAvailablePopupIsDisplayed() {
        await test.step('Click See flights button if No other flights available popup is displayed', async () => {
            // Button may not exist
            if ((await this.seeFlightsButton.count()) > 0) {
                await this.click(this.seeFlightsButton);
            }
            await this.waitUntilShimmerDisappears();
        });
    }

    async selectFirstAltFlightCardAndClickContinueButton(testInfo: TestInfo) {
        await test.step('Select first alternative flight card on Change Flights page', async () => {
            await this.clickSeeFlightsButtonIfNoOtherFlightsAvailablePopupIsDisplayed();
            await this.firstAltFlightCard.clickSelectButton();

            if (isMobileBrowser(testInfo)) {
                await this.basketFooter.clickContinueButton();
            } else {
                await this.continueButton.click();
            }

            await this.waitUntilSpinnerDisappears();
        });
    }

    async shouldBeOpened({isTradeAgent}: {isTradeAgent: boolean}) {
        await test.step('Change Flights page should be opened with relevant details', async () => {
            const expectedTitle = isTradeAgent ? 'Change flights' : 'Change your flights';

            await this.heroBanner.shouldBeDisplayedWithRelevantDetails({
                breadcrumbLink: 'Manage holiday',
                breadcrumb: 'Change your flights',
                title: expectedTitle,
            });

            await textShouldBe(this.changeFlightTitle, 'Your flights');
            // TODO [18/09/2025, KV]: Check text under selected flight card once MAN-2537 is done
        });
    }

    async correctNumberOfAlternativeFlightsShouldBeDisplayed(response: GetAlternativeFlightsResponse) {
        await test.step('Correct number of alternative flights should be displayed', async () => {
            let expectedNumber = response.flights.alternativeFlights?.length || 0;

            // If there are no alternative flights, we don't see any flight cards
            if (expectedNumber === 0) return;

            await textShouldContain(this.altFlightsAmount, `${expectedNumber} flight`);
            // If number of alternative flights is more than 3, then Click More flights button should be clicked.
            // It will be checked later when mock for 4 alt flighs is created.
            if (expectedNumber <= 3) {
                await shouldHaveExactNumberOfElements(this.altFlightCards, expectedNumber);
            }
        });
    }
}
