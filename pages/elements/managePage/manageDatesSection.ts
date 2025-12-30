import test, {Locator, Page} from '@playwright/test';

import {BookingContext} from '../../../contexts/bookingContext';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getDayOfWeekDayMonthDate, getDaysBetween, getYear} from '../../../helpers/dateHelper';
import {PageWidget} from '../../core/pageWidget';

export class ManageDatesSection extends PageWidget {
    private readonly title: Locator;
    private readonly icon: Locator;
    private readonly changeButton: Locator;
    private readonly dates: Locator;
    private readonly days: Locator;

    constructor(page: Page, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.title = this.findInsideByTestId('change-dates-drawer-title');
        this.icon = this.findInsideByTestId('calendar-solid-icon');
        this.changeButton = this.findInsideByTestId('change-dates-button');
        this.dates = this.findInsideByTestId('date-range');
        this.days = this.findInsideByTestId('nights-duration');
    }

    async datesSectionShouldBeDisplayedWithRelevantDetails(bookingContext: BookingContext) {
        await test.step('Dates section should be displayed with relevant details', async () => {
            let accomStartDate = bookingContext.bookingResponse.package.accom.startDate;
            let accomEndDate = bookingContext.bookingResponse.package.accom.endDate;

            let expectedOutboundDate = getDayOfWeekDayMonthDate(accomStartDate);
            let expectedInboundDate = getDayOfWeekDayMonthDate(accomEndDate);
            let expectedOutboundYear = getYear(accomStartDate);
            let expectedInboundYear = getYear(accomEndDate);

            let expectedDates;
            if (expectedOutboundYear !== expectedInboundYear) {
                expectedDates = `${expectedOutboundDate} ${expectedOutboundYear} - ${expectedInboundDate} ${expectedInboundYear}`;
            } else {
                expectedDates = `${expectedOutboundDate} - ${expectedInboundDate} ${expectedInboundYear}`;
            }

            let daysDifference = getDaysBetween(accomStartDate, accomEndDate);
            let expectedNights = daysDifference === 1 ? `${daysDifference} night` : `${daysDifference} nights`;

            await shouldBeVisible(this.icon);
            await textShouldBe(this.title, 'Dates');
            await textShouldBe(this.dates, expectedDates);
            await textShouldBe(this.days, expectedNights);
        });
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
