import {Page} from '@playwright/test';

import {test} from '../../core/fixtures/baseFixture';
import {PromoCodeOption} from '../../core/types/promoCodeOption';

export async function validatePriceResponseReturnsPromoCode(page: Page, option: PromoCodeOption) {
    return createMockForPromoCode(
        page,
        '**/validate-price',
        option,
        false,
        (body) => body.transfers[0].promoCodeBreakDown,
        `Mocked: Alternative price response returns promo code ${option}`,
    );
}

export async function validateAlternativeTransfersResponseReturnsPromoCode(page: Page, option: PromoCodeOption) {
    return createMockForPromoCode(
        page,
        '**/validate-alternative-transfers',
        option,
        true,
        (body) => body.validateTransfer.promoCodeBreakdown,
        `Mocked: Validate alternative transfers response returns promo code ${option}`,
    );
}

function resolvePromoCodeData(option: PromoCodeOption, isTradePortal: boolean): {code?: string; status: string} {
    switch (option) {
        case 'upgrade':
            return {code: isTradePortal ? 'AUTOTESTM200TP' : 'AUTOTEST200', status: 'TIER_UPGRADE'};
        case 'downgrade':
            return {code: isTradePortal ? 'AUTOTESTM100TP' : 'AUTOTEST100', status: 'TIER_DOWNGRADE'};
        case 'removal':
            return {status: 'PROMOCODE_REMOVED'};
    }
}

async function createMockForPromoCode(
    page: Page,
    urlPattern: string,
    option: PromoCodeOption,
    isTradePortal: boolean,
    breakdownAccessor: (body: any) => any,
    stepTitle: string,
) {
    await test.step(stepTitle, async () => {
        await page.route(urlPattern, async (route) => {
            const response = await route.fetch();
            const body = await response.json();
            const breakdown = breakdownAccessor(body);

            if (!breakdown) {
                throw new Error('Promo code breakdown not found in response');
            }

            const {code, status} = resolvePromoCodeData(option, isTradePortal);
            breakdown.promoCode = code;
            breakdown.promoCodeStatus = status;

            await route.fulfill({
                status: response.status(),
                contentType: 'application/json',
                body: JSON.stringify(body),
            });
        });
    });
}
