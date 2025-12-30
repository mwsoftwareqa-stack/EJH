import {Locator} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {PromoCodeOption} from '../../../core/types/promoCodeOption';
import {shouldBeVisible, textShouldBe, textShouldContain} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export abstract class BasePromoCodeSection extends PageWidget {
    protected abstract icon: Locator;
    protected abstract title: Locator;
    protected abstract status: Locator;
    protected abstract description: Locator;

    protected abstract textMap: Record<
        PromoCodeOption,
        {
            title: string;
            status: string;
            description: string;
        }
    >;

    async shouldBeDisplayedForPromoCode(option: PromoCodeOption) {
        await test.step(`Promo Code section should be displayed for promo code ${option}`, async () => {
            const expectedData = this.textMap[option];

            await shouldBeVisible(this.icon);
            await textShouldBe(this.title, expectedData.title);
            await textShouldBe(this.status, expectedData.status);
            await textShouldContain(this.description, expectedData.description);
        });
    }
}
