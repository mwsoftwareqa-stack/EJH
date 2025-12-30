import test, {Locator, Page} from '@playwright/test';

import {GuestsContext} from '../../../contexts/guestsContext';
import {PaymentContext} from '../../../contexts/paymentContext';
import {PageWidget} from '../../core/pageWidget';

export class PaymentForm extends PageWidget {
    private readonly nameOnCard: Locator;
    private readonly cardNumber: Locator;
    private readonly expirationDate: Locator;
    private readonly cvv: Locator;
    private readonly fullName: Locator;
    private readonly address: Locator;
    private readonly city: Locator;
    private readonly postcode: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.nameOnCard = this.findInside('#nameOnCard');
        this.cardNumber = this.findInside('#cardNumber');
        this.expirationDate = this.findInside('#expirationDate');
        this.cvv = this.findInside('#cvv');
        this.fullName = this.findInside('#fullName');
        this.address = this.findInside('#address');
        this.city = this.findInside('#city');
        this.postcode = this.findInside('#postCode');
    }

    async fillInPaymentDetailsForm(paymentContext: PaymentContext) {
        await test.step('Fill in Payment Details form', async () => {
            await this.nameOnCard.fill(paymentContext.nameOnCard);
            await this.cardNumber.fill(paymentContext.cardNumber);
            await this.expirationDate.fill(paymentContext.expiration);
            await this.cvv.fill(paymentContext.cvv);
        });
    }

    // Can be used in the future
    async fillInBillingAddressForm(guestsContext: GuestsContext) {
        await test.step('Fill in Billing address form', async () => {
            await this.fullName.fill(
                guestsContext.leadPassenger.firstName + ' ' + guestsContext.leadPassenger.lastName,
            );
            await this.address.fill(guestsContext.leadPassenger.address);
            await this.city.fill(guestsContext.leadPassenger.town);
            await this.postcode.fill(guestsContext.leadPassenger.postcode);
        });
    }
}
