import test, {Locator, Page, TestInfo} from '@playwright/test';

import {PaymentContext} from '../contexts/paymentContext';
import {shouldBeVisible, textShouldBe} from '../helpers/assertionHelper';
import {isMobileBrowser, isSafariBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {AmendPaymentHeroBanner} from './elements/amendPaymenPage/amendPaymentHeroBanner';
import {AmendPaymentTransferCard} from './elements/amendPaymenPage/amendPaymentTransferCard';
import {AmendPromoCodeSection} from './elements/amendPaymenPage/amendPromoCodeSection';
import {ConfirmSelectionSection} from './elements/amendPaymenPage/confirmSelectionSection';
import {HowToPaySection} from './elements/amendPaymenPage/howToPaySection';
import {PaymentForm} from './elements/amendPaymenPage/paymentForm';
import {PriceBreakdownComponent} from './elements/amendPaymenPage/priceBreakdownComponent';
import {PriceBreakdownFooter} from './elements/common/priceBreakdownFooter';

export class AmendPaymentPage extends BasePage {
    private readonly confirmationCheckbox: Locator;
    private readonly confirmButton: Locator;
    private readonly cardOption: Locator;
    private readonly title: Locator;
    private readonly icon: Locator;

    public readonly confirmSelectionSection: ConfirmSelectionSection;
    public readonly howToPaySection: HowToPaySection;
    public readonly paymentForm: PaymentForm;
    public readonly heroBanner: AmendPaymentHeroBanner;
    public readonly priceBreakdownComponent: PriceBreakdownComponent;
    public readonly priceBreakdownFooter: PriceBreakdownFooter;
    public readonly transferCard: AmendPaymentTransferCard;
    public readonly promoCodeSection: AmendPromoCodeSection;

    constructor(page: Page) {
        super(page);
        this.confirmationCheckbox = this.page.locator('#confirmation-checkbox');
        this.confirmButton = this.getByDataTid('amend-payment-confirm-button');
        this.cardOption = this.getByDataTid('card-payment-type');
        this.title = this.getByDataTid('accordion-title');
        this.icon = this.getByDataTid('accordion-container-icon');

        this.confirmSelectionSection = new ConfirmSelectionSection(page, '#Entity', true);
        this.howToPaySection = new HowToPaySection(page, '#Option', true);
        this.paymentForm = new PaymentForm(page, '.payment-form', true);
        this.heroBanner = new AmendPaymentHeroBanner(page, "[data-tid='amend-payment-header']", true);
        this.priceBreakdownComponent = new PriceBreakdownComponent(
            page,
            "[data-tid='price-breakdown-desktop']",
            true,
        );
        this.priceBreakdownFooter = new PriceBreakdownFooter(
            page,
            "[data-tid='price-breakdown-mobile-footer']",
            true,
        );
        this.transferCard = new AmendPaymentTransferCard(page, "[data-tid='amend-transfer-card']", true);
        this.promoCodeSection = new AmendPromoCodeSection(page, "[data-tid='amend-promo-code-item']", true);
    }

    async confirmChangesDependingOnPaymentOptionOnAmendPaymentPage(
        paymentContext: PaymentContext,
        testInfo: TestInfo,
    ) {
        await test.step('Confirm changes depending on payment option on Amend Payment page', async () => {
            let amount: string | null | undefined = undefined;
            let summaryLabel: string | null | undefined = undefined;

            await this.confirmSelectionSection.clickContinueButton();

            if (isMobileBrowser(testInfo)) {
                amount = await this.priceBreakdownFooter.getAmount();
                summaryLabel = await this.priceBreakdownFooter.getLabel();
            } else {
                amount = await this.priceBreakdownComponent.getPrice();
                summaryLabel = await this.priceBreakdownComponent.getSummaryLabel();
            }

            if (amount === '£0.00') {
                await this.checkConfirmationCheckbox();
                await this.clickConfirmButton();
            } else if (summaryLabel === 'Refund amount') {
                await this.howToPaySection.clickContinueButton();
                await this.checkConfirmationCheckbox();
                await this.clickConfirmButton();
            } else {
                await this.howToPaySection.clickContinueButton();
                // For all browsers except Safari, the card payment option is selected by default.
                // Apple Pay is default payment option for Safari browser
                if (isSafariBrowser(testInfo)) {
                    await this.cardOption.click();
                }
                await this.paymentForm.fillInPaymentDetailsForm(paymentContext);
                await this.checkConfirmationCheckbox();
                await this.clickConfirmButton();
            }
        });
    }

    async checkConfirmationCheckbox() {
        await test.step('Check Confirmation checkbox on Amend Payment page', async () => {
            await this.confirmationCheckbox.waitFor({state: 'attached'});
            await this.confirmationCheckbox.check();
        });
    }

    async clickConfirmButton() {
        await test.step('Click Confirm button on Amend Payment page', async () => {
            await this.confirmButton.click();
            await this.waitUntilSpinnerDisappears();
        });
    }

    async titleSectionShouldBeDisplayedWithRelevantDetails(options: {expectedTitle: string}) {
        await test.step('Title section should be displayed with relevant details', async () => {
            await textShouldBe(this.title, options?.expectedTitle, {ignoreCase: true});
            await shouldBeVisible(this.icon);
        });
    }
}
