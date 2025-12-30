import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import {test as base, Browser, webkit} from '@playwright/test';

import * as allureHelper from '../../helpers/allureHelper';

import {chromium, Page} from '@playwright/test';
import {isChromeBsBrowser, isMobileBsBrowser, isSafariBsBrowser} from '../../helpers/testInfoHelper';

dotenv.config();

const browserStackCapsBase = {
    build: process.env.BS_BUILD_NAME,
    'browserstack.username': process.env.BROWSERSTACK_USERNAME,
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.local': process.env.USE_BROWSERSTACK_LOCAL,
    'browserstack.networkLogs': true,
    'browserstack.idleTimeout': 300,
};

const additionalCaps: Record<string, Record<string, unknown>> = {
    'BS Chrome': {
        os: 'Windows',
        osVersion: '11',
        browser: 'chrome',
        browserVersion: 'latest',
        resolution: '1920x1080',
    },
    'BS Mobile Emulation': {
        os: 'Windows',
        osVersion: '11',
        browser: 'chrome',
        browserVersion: 'latest',
        resolution: '1920x1080',
    },
    'BS Safari': {
        os: 'OS X',
        osVersion: 'Sonoma',
        browser: 'playwright-webkit',
        browserVersion: 'latest',
        resolution: '1920x1080',
    },
};

export const test = base.extend<{page: Page}>({
    page: async ({page: localPage}, use, testInfo) => {
        if (process.env.USE_BROWSERSTACK_LOCAL !== 'true') {
            return await use(localPage);
        }

        const projectName = testInfo.project.name;
        const caps = {
            ...browserStackCapsBase,
            ...(additionalCaps[projectName] ?? {}),
            name: `${testInfo.title} - ${projectName}`,
        };
        let browser: Browser;

        if (isChromeBsBrowser(testInfo)) {
            browser = await chromium.connect({
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                    JSON.stringify(caps),
                )}`,
            });
        } else if (isMobileBsBrowser(testInfo)) {
            browser = await chromium.connect({
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                    JSON.stringify(caps),
                )}`,
            });
        } else if (isSafariBsBrowser(testInfo)) {
            browser = await webkit.connect({
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                    JSON.stringify(caps),
                )}`,
            });
        } else {
            throw new Error(`Unknown project name: ${projectName}`);
        }

        const context = await browser!.newContext(
            isMobileBsBrowser(testInfo)
                ? {
                      viewport: {width: 360, height: 640},
                      isMobile: true,
                      deviceScaleFactor: 3,
                      userAgent:
                          'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36',
                      ignoreHTTPSErrors: true,
                  }
                : {viewport: {width: 1920, height: 1080}, ignoreHTTPSErrors: true},
        );

        const page = await context.newPage();

        await use(page);

        const status = testInfo.status === 'passed' ? 'passed' : 'failed';
        const reason = testInfo.error?.message || 'Completed';

        await page.evaluate(
            () => {},
            `browserstack_executor: ${JSON.stringify({
                action: 'setSessionStatus',
                arguments: {status, reason},
            })}`,
        );

        if (testInfo.status === 'failed' && process.env.BS_BUILD_NAME && page.url() !== 'about:blank') {
            console.log('Test failed. Capturing screenshot...');
            const path = `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;

            await page.screenshot({path: path, fullPage: true});
            await allureHelper.attachScreenshotToAllure(path);
            console.log('Screenshot attached to Allure report.');
        }

        await browser!.close();
    },
});

test.beforeEach(async () => {
    // Remove api-calls.log file to create a new one with fresh data
    const logFile = path.join(process.cwd(), 'api-calls.log');
    if (!process.env.BS_BUILD_NAME) {
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
        }
    }
});
