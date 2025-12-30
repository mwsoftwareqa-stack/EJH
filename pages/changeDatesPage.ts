import test, {Locator, Page, TestInfo} from '@playwright/test';

import {textShouldBe} from '../helpers/assertionHelper';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {ChangeDatesCalendar} from './elements/changeDatesPage/dateChangeCalendar';
import {AmendHeroBanner} from './elements/common/amendHeroBanner';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';

export class ChangeDatesPage extends BasePage {
    private readonly heroBannerDescription: Locator;
    private readonly continueButton: Locator;

    public readonly heroBanner: AmendHeroBanner;
    public readonly calendar: ChangeDatesCalendar;
    public readonly basketFooter: ChangeBasketFooter;

    constructor(page: Page) {
        super(page);
        this.heroBannerDescription = this.page.getByTestId('hero-banner-description');
        this.continueButton = this.page.getByTestId('confirm-date-button');

        this.heroBanner = new AmendHeroBanner(page, 'hero-banner');
        this.calendar = new ChangeDatesCalendar(page, 'calendar-root');
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');
    }

    async clickContinueButton(testInfo: TestInfo) {
        await test.step('Click Continue button on Change Dates page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.basketFooter.clickContinueButton();
            } else {
                await this.continueButton.click();
            }

            // Shimmer appears 2 times with a short delay
            await this.waitUntilShimmerDisappears();
            await this.waitUntilShimmerDisappears();
        });
    }

    async heroBannerDescriptionShouldBe(description: string) {
        await test.step(`Hero banner description on Change Dates page should be: ${description}`, async () => {
            await textShouldBe(this.heroBannerDescription, description);
        });
    }
}
