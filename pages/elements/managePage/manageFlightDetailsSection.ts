import {Locator, Page} from '@playwright/test';

import {textShouldBe} from '../../../helpers/assertionHelper';
import {PageWidget} from '../../core/pageWidget';

export class ManageFlightDetailsSection extends PageWidget {
    private readonly date: Locator;
    private readonly time: Locator;
    private readonly route: Locator;

    constructor(page: Page, selectorOrTestId: string) {
        super(page, selectorOrTestId);
        this.date = this.findInsideByTestId('date');
        this.time = this.findInsideByTestId('time');
        this.route = this.findInsideByTestId('route');
    }

    public async dateShouldBe(title: string) {
        await textShouldBe(this.date, title);
    }

    public async timeShouldBe(title: string) {
        await textShouldBe(this.time, title);
    }

    public async routeShouldBe(title: string) {
        await textShouldBe(this.route, title);
    }
}
