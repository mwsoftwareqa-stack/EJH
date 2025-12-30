import {expect, Locator, Page} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {BasePage} from './core/basePage';
import {ManageSpecialRequestSection} from './elements/managePage/manageSpecialRequestSection';
import {SpecialRequestList} from './elements/changeSpecialRequestPage/specialRequestList';

export class ChangeSpecialRequestPage extends BasePage {
    private readonly cancelButton: Locator;
    public readonly addSpecialRequestsButton: Locator;
    private readonly confirmSpecialRequestsButton: Locator;
    public readonly changeButton: Locator;
    public readonly needToMakeAnotherChangeArticle: Locator;

    public readonly specialRequestSection: ManageSpecialRequestSection;
    public readonly specialRequestList: SpecialRequestList;

    constructor(page: Page) {
        super(page);
        this.specialRequestSection = new ManageSpecialRequestSection(page, 'special-request-drawer');
        this.specialRequestList = new SpecialRequestList(page, 'special-request-drawer');

        this.cancelButton = this.page.getByText('Cancel', { exact: true });
        this.addSpecialRequestsButton = this.page.getByRole('button', { name: 'Add Special Requests' });
        this.confirmSpecialRequestsButton = this.page.getByRole('button', { name: 'Confirm special requests' });
        this.changeButton = this.page.getByText('Change', { exact: true });
        this.needToMakeAnotherChangeArticle = this.page.getByRole('article', { name: 'Need to make another change?' });
    }

    async checkSpecialRequests() {
        await test.step('Check if Special Request list is visible', async () => {
            await this.specialRequestSection.shouldBeVisible();
            await this.specialRequestList.shouldButtonBeVisible('sr-button-EGFR');
        });
    }

    async checkSpecialRequestConfirmed(buttonCode: string) {
        await test.step('Check if Special Request option is visible after confirmation', async () => {
            const testId = `sr-button-${buttonCode}`;
            await this.specialRequestList.shouldButtonBeVisible(testId);
        });
    }

    async clickSpecialRequestButton(buttonCode: string) {
        await test.step(`Click special request button: ${buttonCode}`, async () => {
            const testId = `sr-button-${buttonCode}`;
            await this.specialRequestList.clickButton(testId);
        });
    }

    async clickCancelButton() {
        await test.step('Click Cancel button on Change Special Request page', async () => {
            await this.cancelButton.click();
        });
    }

    async clickConfirmSpecialRequestsButton() {
        await test.step('Click Confirm special requests button on Change Special Request page', async () => {
            await this.confirmSpecialRequestsButton.click();
        });
    }

    public async shouldBeSelected(buttonCode: string) {
        await test.step(`Special request button ${buttonCode} should be selected`, async () => {
            const testId = `sr-button-${buttonCode}`;
            const button = this.specialRequestList.getButton(testId);
            await button.shouldBeSelected();
        });
    }
    
    public async shouldBeDeselected(buttonCode: string) {
        await test.step(`Special request button ${buttonCode} should be deselected`, async () => {
            const testId = `sr-button-${buttonCode}`;
            const button = this.specialRequestList.getButton(testId);
            await button.shouldBeDeselected();
        });
    }
    

    // async cancelAddingSpecialRequest(testId: string) {
    //     await test.step('Cancel adding Special Request to your hotel', async () => {
    //         await this.clickSpecialRequestButton('GFR');
            
    //         await this.clickCancelButton();
    //         await this.specialRequestSection.shouldBeVisible();
    //         await this.specialRequestList.shouldButtonNotBeVisible('sr-button-GFR');
    //     });
    // }

}

