import {Page} from '@playwright/test';

import {TestContext} from '../../contexts/testContext';
import {addDefaultCookiesToBrowser} from '../../helpers/cookiesHelper';
import {createTestContext} from '../../helpers/testContextHelper';
import {test as base} from '../fixtures/baseFixture';
import {getEnvConfig} from '../config/envConfigHelper';

type Fixtures = {
    tc: TestContext;
    page: Page;
};

export const testWithCookies = base.extend<Fixtures>({
    page: async ({page}, use) => {
        const envConfig = getEnvConfig();
        await addDefaultCookiesToBrowser(page.context(), envConfig);
        await use(page);
    },

    tc: async ({request, page}, use) => {
        const ctx = createTestContext(request, page);
        await use(ctx);
    },
});
