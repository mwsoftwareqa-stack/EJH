import {Locator, Page} from '@playwright/test';

import {
    textShouldBe,
    textShouldContain,
    textShouldNotBeNullOrEmptyByLocator,
} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export abstract class BaseConfirmationPopup extends PageWidget {
    protected readonly title: Locator;
    protected readonly subTitle: Locator;
    protected readonly message: Locator;
    protected readonly backButton: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.title = this.findInsideByTestId('successful-amendment-popup-title', {isOldTestId: true});
        this.subTitle = this.findInsideByTestId('successful-amendment-popup-subtitle', {isOldTestId: true});
        this.message = this.findInsideByTestId('successful-amendment-popup-confirmation-message', {
            isOldTestId: true,
        });
        this.backButton = this.findInsideByTestId('successful-amendment-popup-close-button', {isOldTestId: true});
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    async titleShouldBe(title: string) {
        await this.title.waitFor({state: 'attached'});
        await textShouldBe(this.title, title);
    }

    async subTitleShouldContainText(subTitle: string) {
        await this.subTitle.waitFor({state: 'attached'});
        await textShouldContain(this.subTitle, subTitle);
    }

    async subTitleShouldNotBeNullOrEmpty() {
        await this.subTitle.waitFor({state: 'attached'});
        await textShouldNotBeNullOrEmptyByLocator(this.subTitle);
    }

    async messageShouldContainText(message: string) {
        await this.message.waitFor({state: 'attached'});
        await textShouldContain(this.message, message);
    }
}
