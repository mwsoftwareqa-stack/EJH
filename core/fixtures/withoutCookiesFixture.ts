import { Page } from '@playwright/test';

import { TestContext } from '../../contexts/testContext';
import { createTestContext } from '../../helpers/testContextHelper';
import { test as base } from '../fixtures/baseFixture';

type Fixtures = {
    tc: TestContext;
    page: Page;
}

export const testWithoutCookies = base.extend<Fixtures>({
    tc: async ({request, page}, use) => {
        const ctx = createTestContext(request, page)
        await use(ctx);
    }
})
