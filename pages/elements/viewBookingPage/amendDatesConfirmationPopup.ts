import {Locator, Page} from '@playwright/test';

import {GuestsContext} from '../../../contexts/guestsContext';
import {HolidayContext} from '../../../contexts/holidayContext';
import {test} from '../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getDay, getDayOfWeek, getDaySuffix, getMonth, getYear} from '../../../helpers/dateHelper';
import {BaseConfirmationPopup} from '../base/baseConfirmationPopup';

export class AmendDatesConfirmationPopup extends BaseConfirmationPopup {
    protected readonly startDate: Locator;
    protected readonly endDate: Locator;
    protected readonly nightsNumber: Locator;
    protected readonly icon: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.startDate = this.findInsideByTestId('dpc-start-date', {isOldTestId: true});
        this.endDate = this.findInsideByTestId('dpc-end-date', {isOldTestId: true});
        this.nightsNumber = this.findInsideByTestId('dpc-nights', {isOldTestId: true});
        this.icon = this.findInsideByTestId('calendar-lined-icon', {isOldTestId: true});
    }

    async clickBackToViewBookingButton() {
        await test.step('Click Back To View Booking button in Dates Confirmation popup', async () => {
            await this.clickBackButton();
        });
    }

    async shouldBeDisplayedWithRelevantDetails(
        date: Date,
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
    ) {
        await test.step('Amend Dates Confirmation popup should be displayed', async () => {
            let startDate = date.toString();
            let endDate = new Date(date);
            endDate.setDate(endDate.getDate() + holidayContext.stayDuration);
            let endDateString = endDate.toString();
            let expectedStartDate = `${getDayOfWeek(startDate)} ${getDay(startDate)}${getDaySuffix(
                getDay(startDate),
            )} ${getMonth(startDate)} ${getYear(startDate)}`;
            let expectedEndDate = `${getDayOfWeek(endDateString)} ${getDay(endDateString)}${getDaySuffix(
                getDay(endDateString),
            )} ${getMonth(endDateString)} ${getYear(endDateString)}`;

            await this.waitUntilAttached();
            await this.titleShouldBe("We've successfully changed your dates");
            await this.subTitleShouldNotBeNullOrEmpty();
            await this.messageShouldContainText(guestsContext.leadPassenger.email);
            await shouldBeVisible(this.icon);
            await textShouldBe(this.startDate, expectedStartDate);
            await textShouldBe(this.endDate, expectedEndDate);
            await textShouldBe(this.nightsNumber, `${holidayContext.stayDuration} nights`);
        });
    }
}
