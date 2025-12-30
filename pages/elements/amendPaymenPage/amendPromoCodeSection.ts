import {Locator, Page} from '@playwright/test';
import {BasePromoCodeSection} from '../base/basePromoCodeSection';

export class AmendPromoCodeSection extends BasePromoCodeSection {
    protected icon: Locator;
    protected title: Locator;
    protected status: Locator;
    protected description: Locator;

    constructor(page: Page, testIdOrSelector: string, isSelector?: boolean) {
        super(page, testIdOrSelector, {isSelector});
        this.icon = this.findInsideByTestId('amend-promo-code-icon', {isOldTestId: true});
        this.title = this.findInsideByTestId('expand-item-title', {isOldTestId: true});
        this.status = this.findInsideByTestId('amend-promo-code-status', {isOldTestId: true});
        this.description = this.findInsideByTestId('amend-promo-code-description', {isOldTestId: true});
    }

    protected textMap = {
        upgrade: {
            title: 'Promo code updated',
            status: 'Your promo code discount has changed',
            description: 'has been upgraded to AUTOTEST200',
        },
        downgrade: {
            title: 'Promo code updated',
            status: 'Your promo code discount has changed',
            description: 'has been downgraded to AUTOTEST100',
        },
        removal: {
            title: 'Promo code removed',
            status: 'Your promo code is no longer valid',
            description: 'no longer valid and has been removed',
        },
    };
}
