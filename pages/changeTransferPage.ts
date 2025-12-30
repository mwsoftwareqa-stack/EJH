import {Locator, Page} from '@playwright/test';

import {GetAlternativeOptionsResponse} from '@easyjet-dev/ejh-domain-models';
import {TestInfo} from '@playwright/test';
import {test} from '../core/fixtures/baseFixture';
import {
    shouldBeVisible,
    shouldHaveAttribute,
    shouldNotBeDisplayed,
    textShouldBe,
    textShouldContain,
} from '../helpers/assertionHelper';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {AmendNoAvailableTransferBanner} from './elements/changeTransferPage/amendNoAvailableTransferBanner';
import {AmendTransferCard} from './elements/changeTransferPage/amendTransferCard';
import {AmendHeroBanner} from './elements/common/amendHeroBanner';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';

export class ChangeTransferPage extends BasePage {
    private readonly continueButton: Locator;
    private readonly transferIcon: Locator;
    private readonly transferTitle: Locator;
    private readonly heroBannerDescription: Locator;
    private readonly transferPill: Locator;
    private readonly goBackWithNoChangesButton: Locator;

    public readonly privateTransferCard: AmendTransferCard;
    public readonly ownWayTransferCard: AmendTransferCard;
    public readonly sharedTransferCard: AmendTransferCard;
    public readonly selectedTransferCard: AmendTransferCard;
    public readonly noAvailableTransferBanner: AmendNoAvailableTransferBanner;
    public readonly heroBanner: AmendHeroBanner;
    public readonly basketFooter: ChangeBasketFooter;

    constructor(page: Page) {
        super(page);
        this.continueButton = this.page.getByTestId('confirm-transfer-button');
        this.transferIcon = this.page.getByTestId('summary-item-icon');
        this.transferTitle = this.page.getByTestId('summary-item-title');
        this.heroBannerDescription = this.page.getByTestId('hero-banner-description');
        // Update locator in the future
        this.transferPill = this.page.locator("[data-testid='pill-content']", {hasText: 'Upgrade'});
        this.goBackWithNoChangesButton = this.page.getByTestId('go-back-button');

        this.privateTransferCard = new AmendTransferCard(page, 'transfer-card', 'Private');
        this.ownWayTransferCard = new AmendTransferCard(page, 'transfer-card', 'Own way');
        this.sharedTransferCard = new AmendTransferCard(page, 'transfer-card', 'Shared');
        this.heroBanner = new AmendHeroBanner(page, 'hero-banner');
        this.selectedTransferCard = new AmendTransferCard(page, 'selected-transfer-card');
        this.noAvailableTransferBanner = new AmendNoAvailableTransferBanner(page, 'no-alternatives-banner');
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');
    }

    async clickGoBackWithNoChangesButton(testInfo: TestInfo) {
        await test.step('Click Go Back With No Changes button on Change Transfer page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.basketFooter.clickGoBackButton();
            } else {
                await this.goBackWithNoChangesButton.click();
            }
        });
    }

    async selectTransferAndClickContinueButton(
        testInfo: TestInfo,
        transferType: 'Private' | 'Shared' | 'Own way',
    ) {
        await test.step(`Select ${transferType} transfer and click Continue button`, async () => {
            switch (transferType) {
                case 'Private':
                    await this.privateTransferCard.clickSelectButton();
                    break;
                case 'Shared':
                    await this.sharedTransferCard.clickSelectButton();
                    break;
                case 'Own way':
                    await this.ownWayTransferCard.clickSelectButton();
                    break;
            }
            await this.clickContinueButton(testInfo);
        });
    }

    async heroBannerDescriptionShouldBe(description: string) {
        await test.step(`Hero banner description on Change Transfer page should be: ${description}`, async () => {
            await textShouldBe(this.heroBannerDescription, description);
        });
    }

    async upsellingMessageShouldBe(altTransfersResponse: GetAlternativeOptionsResponse, text: string) {
        await test.step(`Upselling message on Change Transfer page should be: ${text} + £..`, async () => {
            await this.waitUntilShimmerDisappears();

            let price = altTransfersResponse.transfers.alternativeTransfers?.find(
                (t) => t.name === 'Private Transfer',
            )?.amendmentPaymentInfo?.amendmentChargesWithFees;

            let expectedPrice = Math.ceil(price!);

            await textShouldContain(this.transferPill, `${text} £${expectedPrice}`);
        });
    }

    async changeTransferPageShouldBeOpenedWithRelevantDetails() {
        await test.step('Change Transfer page should be opened with relevant details', async () => {
            await shouldBeVisible(this.transferIcon, 15000);
            await textShouldBe(this.transferTitle, 'Shared Transfer');
            await this.heroBanner.shouldBeVisible();
        });
    }

    async continueButtonShouldBeDisabled() {
        await test.step('Continue button should be disabled', async () => {
            await shouldHaveAttribute(this.continueButton, 'disabled');
        });
    }

    async transferPillShouldNotBeDisplayed() {
        await test.step('Transfer pill should not be displayed', async () => {
            await shouldNotBeDisplayed(this.transferPill);
        });
    }

    async selectedTransferCardShouldBeDisplayed() {
        await test.step('Selected transfer card should be displayed', async () => {
            await shouldBeVisible(this.selectedTransferCard.locator, 15000);
        });
    }

    async shouldBeOpened(options?: {waitForShimmerToDisappear: boolean}) {
        await test.step('Change transfer page should be opened', async () => {
            if (options?.waitForShimmerToDisappear) {
                await this.waitUntilShimmerDisappears();
            }

            await this.heroBanner.shouldBeVisible();
            await this.pageUrlShouldBeOpened();
        });
    }

    async clickContinueButton(testInfo: TestInfo) {
        if (isMobileBrowser(testInfo)) {
            await this.basketFooter.clickContinueButton();
        } else {
            await this.continueButton.click();
        }

        await this.waitUntilSpinnerButtonDisappears();
        await this.waitUntilSpinnerDisappears();
    }
}
