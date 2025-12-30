import {Locator, Page} from '@playwright/test';
import {shouldBeVisible, textShouldBe} from '../../../../../helpers/assertionHelper';
import {PageWidget} from '../../../../core/pageWidget';
import {SeatInfoItem} from './seatInfoItem';

export class AmendFlightItem extends PageWidget {
    private readonly direction: Locator;
    private readonly icon: Locator;

    public seatInfoItems: SeatInfoItem[] = [];

    constructor(page: Page, selector: string, isSelector: boolean, numberOfElement?: number) {
        super(page, selector, {isSelector: isSelector, numberOfElement: numberOfElement});
        this.direction = this.findInside('[data-testid*="flight-seats-selection-title"]');
        this.icon = this.findInside('flight-icon');
    }

    public async getSeatInfoItems(): Promise<SeatInfoItem[]> {
        if (this.seatInfoItems.length === 0) {
            this.seatInfoItems = await this.findAllInsidePageWidgetsBySelector(
                SeatInfoItem,
                '[class="flex items-center"]',
            );
        }

        return this.seatInfoItems;
    }

    async directionShouldBe(direction: string) {
        await textShouldBe(this.direction, direction);
    }

    async iconShouldBeVisible() {
        await shouldBeVisible(this.icon);
    }
}
