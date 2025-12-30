import {expect, Locator, Page} from '@playwright/test';

export async function textShouldNotBeNullOrEmptyByLocator(locator: Locator) {
    const text = await locator.textContent();
    await textShouldNotBeNullOrEmptyByString(text);
}

export async function textShouldNotBeNullOrEmptyByString(text: string | null | undefined) {
    expect(text).not.toBeNull();
    expect(text?.trim().length).toBeGreaterThan(0);
}

export async function textShouldBe(
    locator: Locator,
    expectedText: string,
    options?: {ignoreCase?: boolean; timeout?: number},
) {
    await expect(locator).toHaveText(expectedText, {
        ignoreCase: options?.ignoreCase,
        timeout: options?.timeout,
    });
}

export async function shouldBeTrue(value: boolean) {
    expect(value).toBe(true);
}

export async function shouldBeFalse(value: boolean) {
    expect(value).toBe(false);
}

export async function numberShouldBe(value: number, expectedNumber: number) {
    expect(value).toBe(expectedNumber);
}

export async function textShouldContain(locator: Locator, expectedText: string, timeout?: number) {
    await expect(locator).toContainText(expectedText, {timeout: timeout});
}

export async function shouldBeVisible(locator: Locator, timeout: number = 5000) {
    await expect(locator).toBeVisible({timeout: timeout});
}

export async function shouldNotBeDisplayed(locator: Locator) {
    await expect(locator).not.toBeVisible();
}

export async function shouldHaveAttribute(
    locator: Locator,
    attribute: string,
    value?: string,
    shouldContain: boolean = false,
) {
    if (value === undefined) {
        await expect(locator).toHaveAttribute(attribute);
    } else {
        if (shouldContain) {
            await expect(locator).toHaveAttribute(attribute, new RegExp(value));
        } else {
            await expect(locator).toHaveAttribute(attribute, value);
        }
    }
}

export async function pageUrlShouldEndWith(page: Page, expectedUrl: string) {
    expect(page.url().endsWith(expectedUrl)).toBe(true);
}

export async function stringArraysShouldBeEqual(
    actualTitles: string[] | Promise<string[]>,
    expectedTitles: string[],
) {
    const resolvedActual = await actualTitles;
    expect(resolvedActual).toEqual(expectedTitles);
}

// Asserts that the given locator has the specified number of elements.
// @param locator - The Playwright Locator.
// @param number - The expected number of elements.
export async function shouldHaveExactNumberOfElements(locator: Locator, number: number) {
    await expect(locator).toHaveCount(number);
}
