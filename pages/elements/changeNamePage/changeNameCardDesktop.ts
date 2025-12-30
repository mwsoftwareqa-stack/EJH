import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeNameCardDesktop extends PageWidget {
    private readonly changeDetailsButton: Locator;
    private readonly firstNameField: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page, testIdOrSelector: string, numberOfElement: number) {
        super(page, testIdOrSelector, {numberOfElement: numberOfElement});
        this.changeDetailsButton = this.findInsideByTestId('name-change-button');
        this.firstNameField = this.findInsideByTestId('name-change-input-first-name');
        this.saveButton = this.findInsideByTestId('name-change-save');
    }

    async clickChangeDetailsButton() {
        await this.changeDetailsButton.click();
    }

    async focusFirstNameField() {
        await this.firstNameField.focus();
    }

    async moveCursorLeftInFirstNameField() {
        await this.page.keyboard.press('ArrowLeft');
    }

    async removeCharacterFromFirstNameField() {
        await this.page.keyboard.press('Backspace');
    }

    async clickSaveButton() {
        await this.saveButton.click();
    }
}
