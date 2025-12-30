import {Locator, Page} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {BasePage} from './core/basePage';
import {shouldBeVisible} from '../helpers/assertionHelper';

export class TradePortalFeedbackFormPage extends BasePage {
    private readonly agentTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/trade-portal/feedback-form';

        this.agentTitle = this.getByDataTid('feedback-agent-title');
    }

    async agentTitleShouldBeVisible() {
        await test.step('Agent title should be visible', async () => {
            await shouldBeVisible(this.agentTitle);
        });
    }
}
