import {BrowserContext} from '@playwright/test';
import {EnvironmentConfig} from '../core/config/environmentConfig';

/**
 * Extracts a specific cookie value by its name from raw Set-Cookie headers.
 * @param rawHeaders The raw "Set-Cookie" headers as a single string (separated by `\n`).
 * @param cookieName The name of the cookie you want to extract.
 * @returns The cookie value if found, otherwise null.
 */
export function getCookieByName(rawHeaders: string, cookieName: string): string | null {
    const lines = rawHeaders.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith(cookieName + '=')) {
            const cookieValue = trimmedLine.split(';')[0].split('=').slice(1).join('=').trim();
            return cookieValue;
        }
    }

    return null;
}

export async function addDefaultCookiesToBrowser(context: BrowserContext, envConfig: EnvironmentConfig) {
    const cookieDomain = getCookieDomainFromUrl(envConfig.baseUrl);

    await context.addCookies([
        {name: 'cookiePolicy', value: '1', domain: cookieDomain, path: '/'},
        {name: 'EASYJET_ENSIGHTEN_PRIVACY_MODAL_VIEWED', value: '1', domain: cookieDomain, path: '/'},
        {name: 'EASYJET_ENSIGHTEN_PRIVACY_BANNER_LOADED', value: '1', domain: cookieDomain, path: '/'},
        {name: 'EASYJET_ENSIGHTEN_PRIVACY_BANNER_VIEWED', value: '1', domain: cookieDomain, path: '/'},
        {
            name: 'EASYJET_ENSIGHTEN_PRIVACY_Performance_and_Personalisation',
            value: '1',
            domain: cookieDomain,
            path: '/',
        },
        {name: 'EASYJET_ENSIGHTEN_PRIVACY_easyJet_Marketing', value: '1', domain: cookieDomain, path: '/'},
    ]);

    if (process.env.ENV_NAME === 'ppd') {
        await context.addCookies([
            {name: 'EASYJET_ENSIGHTEN_PRIVACY_ensPrivConsentV', value: '1.0', domain: cookieDomain, path: '/'},
        ]);
    }
}

/**
 * Derives a cookie domain (e.g., ".ejcloud.net") from a full URL e.g. uat2.webdev.ejholidays.ejcloud.net
 */
export function getCookieDomainFromUrl(url: string): string {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    if (parts.length <= 2) {
        return `.${hostname}`;
    }

    const base = parts.slice(-2).join('.');
    return `.${base}`;
}
