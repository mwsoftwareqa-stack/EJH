import {Page} from 'playwright-core';

export async function waitUntil(
    condition: () => Promise<boolean> | boolean,
    options?: {
        timeout?: number;
        retryInterval?: number;
        customMessage?: string;
    },
): Promise<void> {
    const {timeout = 30_000, retryInterval = 1_000, customMessage} = options || {};

    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
        const attempt = async () => {
            try {
                const result = await condition();

                if (result) {
                    return resolve();
                }

                if (Date.now() - startTime >= timeout) {
                    return reject(new Error(customMessage || 'Timed out waiting for custom condition'));
                }

                setTimeout(attempt, retryInterval);
            } catch (error) {
                if (Date.now() - startTime >= timeout) {
                    return reject(
                        new Error(
                            customMessage || `Timed out waiting for custom condition: ${(error as Error).message}`,
                        ),
                    );
                }

                setTimeout(attempt, retryInterval);
            }
        };

        attempt();
    });
}

export async function waitForNewTab(currentPage: Page, action: () => Promise<void>) {
    const [newPage] = await Promise.all([currentPage.context().waitForEvent('page'), action()]);
    await newPage.waitForLoadState();
    return newPage;
}
