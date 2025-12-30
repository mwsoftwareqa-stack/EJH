import {Locator, Page} from '@playwright/test';
import {PageWidget} from '../../../core/pageWidget';

export class MobileFooterLinkBlock extends PageWidget {
    private readonly title: Locator;

    constructor(
        page: Page,
        selector: string,
        options?: {isSelector?: boolean; numberOfElement?: number; locator?: Locator},
    ) {
        super(page, selector, options);
        this.title = this.findInside('h3');
    }

    public async getTitleText(): Promise<string> {
        await this.title.waitFor({state: 'visible'});
        return (await this.title.textContent()) ?? '';
    }
}
