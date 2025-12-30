import test, {Locator, Page, TestInfo} from '@playwright/test';
import {textShouldBe} from '../helpers/assertionHelper';

import {GuestsContext} from '../contexts/guestsContext';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {AnyChangesWillBeLostPopup} from './elements/changeNamePage/anyChangesWillBeLostPopup';
import {ChangeNameCardDesktop} from './elements/changeNamePage/changeNameCardDesktop';
import {ChangeNameCardDrawer} from './elements/changeNamePage/changeNameCardDrawer';
import {ChangeNameCardMobile} from './elements/changeNamePage/changeNameCardMobile';
import {ChangeNameConfirmationPopup} from './elements/changeNamePage/changeNameConfirmationPopup';
import {AmendHeroBanner} from './elements/common/amendHeroBanner';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';
import {InformationBanner} from './elements/common/informationBanner';

export class ChangeNamePage extends BasePage {
    private readonly confirmChangesButton: Locator;
    private readonly goBackWithNoChangesButton: Locator;
    private readonly heroBannerDescription: Locator;
    // Update locator and move to widget once MAN-2839 is done
    private readonly confirmChangesButtonMobile: Locator;
    private readonly goBackButtonMobile: Locator;

    // 1st card is for lead passenger
    public readonly secondNameCardDesktop: ChangeNameCardDesktop;
    public readonly secondNameCardMobile: ChangeNameCardMobile;
    public readonly nameCardDrawer: ChangeNameCardDrawer;
    public readonly basketFooter: ChangeBasketFooter;
    public readonly heroBanner: AmendHeroBanner;
    public readonly infoBanner: InformationBanner;
    public readonly anyChangesWillBeLostPopup: AnyChangesWillBeLostPopup;
    public readonly changeNameConfirmationPopup: ChangeNameConfirmationPopup;

    constructor(page: Page) {
        super(page);
        this.confirmChangesButton = page.getByTestId('confirm-name-button');
        this.goBackWithNoChangesButton = page.getByTestId('go-back-button');
        // Update locator and move to widget once MAN-2839 is done
        this.confirmChangesButtonMobile = page.locator("[data-testid='basket-static-footer'] button").nth(1);
        this.goBackButtonMobile = page.locator("[data-testid='basket-static-footer'] button").nth(0);
        this.heroBannerDescription = page.getByTestId('hero-banner-description');

        this.secondNameCardDesktop = new ChangeNameCardDesktop(page, 'name-change-card', 2);
        this.secondNameCardMobile = new ChangeNameCardMobile(page, 'mobile-name-change-card', 2);
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');
        this.nameCardDrawer = new ChangeNameCardDrawer(page, 'modal');
        this.changeNameConfirmationPopup = new ChangeNameConfirmationPopup(page, 'change-name-success-modal');
        this.anyChangesWillBeLostPopup = new AnyChangesWillBeLostPopup(page, 'change-name-warning-modal');
        this.heroBanner = new AmendHeroBanner(page, 'hero-banner');
        // TODO [20/10/2025 AC] Need better selector (check an example of ChangeFlights)
        this.infoBanner = new InformationBanner(
            page,
            "(//p[@data-testid='hero-banner-description']//following::div[@data-testid='collapsible-container'])[1]",
            true,
        );
    }

    async clickChangeDetailsButtonForTheFirstNonLeadPassenger(testInfo: TestInfo) {
        await test.step('Click Change Details button for the first non-lead passenger on Change Name page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.secondNameCardMobile.clickChangeDetailsButton();
            } else {
                await this.secondNameCardDesktop.clickChangeDetailsButton();
            }
        });
    }

    async moveCursorLeftFromTheEndOfFirstNameForTheFirstNotLeadPassengerAndRemoveCharacters(
        guestsContext: GuestsContext,
        testInfo: TestInfo,
        params: {
            moveLeftCount: number;
            removeCharactersCount: number;
        },
    ) {
        await test.step('Move cursor left from the end of First Name for the first non-lead passenger and remove characters', async () => {
            let card: ChangeNameCardDesktop | ChangeNameCardDrawer = isMobileBrowser(testInfo)
                ? this.nameCardDrawer
                : this.secondNameCardDesktop;

            await card.focusFirstNameField();

            for (let i = 0; i < params.moveLeftCount; i++) {
                await card.moveCursorLeftInFirstNameField();
            }
            for (let i = 0; i < params.removeCharactersCount; i++) {
                await card.removeCharacterFromFirstNameField();
            }

            // Save new data to use it later
            // 1st one is a lead guest
            let oldFirstName = guestsContext.adultGuests[1].firstName;
            let startIndex = oldFirstName.length - params.moveLeftCount - params.removeCharactersCount;
            guestsContext.adultGuests[1].firstName =
                oldFirstName.slice(0, startIndex) + oldFirstName.slice(startIndex + params.removeCharactersCount);
        });
    }

    async clickSaveButtonForTheFirstNonLeadPassenger(testInfo: TestInfo) {
        await test.step('Click Save button for the first non-lead passenger On Change Name page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.nameCardDrawer.clickSaveButton();
            } else {
                await this.secondNameCardDesktop.clickSaveButton();
            }
        });
    }

    async clickConfirmChangesButton(testInfo: TestInfo) {
        await test.step('Click Confirm Changes button on Change Name page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.confirmChangesButtonMobile.click();
                await this.waitUntilSpinnerButtonDisappears();
            } else {
                await this.confirmChangesButton.click();
                await this.waitUntilSpinnerButtonDisappears();
            }
        });
    }

    async clickGoBackWithNoChangesButton(testInfo: TestInfo) {
        await test.step('Click Go Back With No Changes button on Change Name page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.goBackButtonMobile.click();
            } else {
                await this.goBackWithNoChangesButton.click();
            }
        });
    }

    async anyChangesWillBeLostPopupShouldNotBeDisplayed() {
        await test.step('Any Changes Will Be Lost popup should not be displayed', async () => {
            await this.anyChangesWillBeLostPopup.shouldNotBeVisible();
        });
    }

    async changeNameConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Change Name Confirmation popup should not be displayed', async () => {
            await this.changeNameConfirmationPopup.shouldNotBeVisible();
        });
    }

    async heroBannerDescriptionShouldBe(description: string) {
        await test.step(`Hero banner description on Change Name page should be: ${description}`, async () => {
            await textShouldBe(this.heroBannerDescription, description);
        });
    }
}
