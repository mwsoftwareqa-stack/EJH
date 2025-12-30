import {Locator, Page} from '@playwright/test';
import {test} from '../../../core/fixtures/baseFixture';
import {textShouldBe, textShouldContain} from '../../../helpers/assertionHelper';
import {BaseConfirmationPopup} from '../base/baseConfirmationPopup';

export class AmendRoomBoardConfirmationPopup extends BaseConfirmationPopup {
    private readonly roomType: Locator;
    private readonly boardType: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        // Room and board details are within the popup
        this.roomType = this.rootLocator.locator('text=/Room \\d+:/').locator('..');
        this.boardType = this.rootLocator.getByText('Half Board').or(this.rootLocator.getByText('Full Board'));
    }

    async shouldBeDisplayedWithRelevantDetails(options: {roomType: string; boardType: string}) {
        await test.step('Amend Room & Board Confirmation popup should be displayed with relevant details', async () => {
            await this.waitUntilAttached();
            await this.titleShouldBe("We've successfully updated your room and board");
            await textShouldContain(this.rootLocator, options.roomType);
            await textShouldContain(this.rootLocator, options.boardType);
        });
    }

    async roomTypeShouldContainText(roomType: string) {
        await test.step(`Room type should contain: ${roomType}`, async () => {
            await textShouldContain(this.rootLocator, roomType);
        });
    }

    async boardTypeShouldContainText(boardType: string) {
        await test.step(`Board type should contain: ${boardType}`, async () => {
            await textShouldContain(this.rootLocator, boardType);
        });
    }
}
