import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class BoardList extends PageWidget {
    private readonly title: Locator;

    constructor(
        page: Page,
        testIdOrSelector: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number},
    ) {
        super(page, testIdOrSelector, options);
        this.title = this.findInside('h2');
    }

    async shouldBeDisplayed() {
        await test.step('Board list should be displayed', async () => {
            await shouldBeVisible(this.title);
            await textShouldBe(this.title, 'Your board');
        });
    }

    async selectedCardShouldBeVisible() {
        await test.step('Selected board card should be visible', async () => {
            const selectedLabel = this.rootLocator.locator('div').filter({hasText: /^Selected$/});
            await shouldBeVisible(selectedLabel);
        });
    }

    async clickBoardByPrice(priceText: string) {
        await test.step(`Click board with price: ${priceText}`, async () => {
            const priceButton = this.rootLocator.getByRole('button', {name: new RegExp(priceText)});
            await this.click(priceButton);
        });
    }

    async selectFirstAvailableBoard(): Promise<string> {
        let selectedText: string = '';
        await test.step('Select first available board option', async () => {
            // Get all board buttons
            const allButtons = this.rootLocator.locator('button');
            const buttonCount = await allButtons.count();
            
            if (buttonCount === 0) {
                throw new Error('No board options found');
            }

            // Find the first button that is not in a selected card
            for (let i = 0; i < buttonCount; i++) {
                const button = allButtons.nth(i);
                const buttonText = await button.textContent();
                
                if (!buttonText) continue;
                
                // Check if this button is in a card with "Selected" label
                const parentCard = button.locator('..').locator('..');
                const hasSelectedLabel = await parentCard.locator('div').filter({hasText: /^Selected$/}).count() > 0;
                
                if (!hasSelectedLabel) {
                    // This is an available (non-selected) board option
                    await this.click(button);
                    selectedText = buttonText.trim();
                    return;
                }
            }

            throw new Error('No available (non-selected) board options found');
        });
        return selectedText;
    }
}
