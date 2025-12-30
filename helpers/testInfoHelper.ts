import {TestInfo} from '@playwright/test';

export function isChromeBsBrowser(testInfo: TestInfo) {
    return testInfo.project.name === 'BS Chrome';
}

export function isMobileBrowser(testInfo: TestInfo) {
    return testInfo.project.name === 'mobile' || testInfo.project.name === 'BS Mobile Emulation';
}

export function isMobileBsBrowser(testInfo: TestInfo) {
    return testInfo.project.name === 'BS Mobile Emulation';
}

export function isSafariBrowser(testInfo: TestInfo) {
    return testInfo.project.name === 'webkit' || testInfo.project.name === 'BS Safari';
}

export function isSafariBsBrowser(testInfo: TestInfo) {
    return testInfo.project.name === 'BS Safari';
}
