import {Locator, Page} from '@playwright/test';

import {PageWidget} from '../../core/pageWidget';

export class ChangeNameCardDrawer extends PageWidget {
    private readonly firstNameField: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.firstNameField = this.findInsideByTestId('name-change-input-first-name');
        // Update locator once MAN-2839 is done
        this.saveButton = this.findInsideByText('button', 'Save');
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
