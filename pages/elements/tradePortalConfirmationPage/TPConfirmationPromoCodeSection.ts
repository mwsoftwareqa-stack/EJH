import {Locator, Page} from '@playwright/test';
import {BasePromoCodeSection} from '../base/basePromoCodeSection';

export class TPConfirmationPromoCodeSection extends BasePromoCodeSection {
    protected icon: Locator;
    protected title: Locator;
    protected status: Locator;
    protected description: Locator;

    constructor(page: Page, testIdOrSelector: string, isSelector?: boolean) {
        super(page, testIdOrSelector, {isSelector});
        this.icon = this.findInsideByTestId('promo-icon');
        // Update locators once MAN-3016 is done
        this.title = this.findInside('p').nth(0);
        this.status = this.findInside('[id^="radix-"] p').nth(0);
        this.description = this.findInside('[id^="radix-"] p').nth(1);
    }

    protected textMap = {
        upgrade: {
            title: 'Promo code updated',
            status: 'Your promo code has changed',
            description: 'upgraded to AUTOTESTM200TP',
        },
        downgrade: {
            title: 'Promo code updated',
            status: 'Your promo code has changed',
            description: 'downgraded to AUTOTESTM100TP',
        },
        removal: {
            title: 'Promo code removed',
            status: 'Your promo code is no longer valid',
            description: 'no longer meets the criteria for this change',
        },
    };
}
