import test, {Locator, Page} from '@playwright/test';

import {GuestsContext} from '../../../contexts/guestsContext';
import {HolidayContext} from '../../../contexts/holidayContext';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getDay, getMonth, getYear} from '../../../helpers/dateHelper';
import {BaseTPConfirmationPopup} from '../base/baseTPConfirmationPopup';
export class AmendDatesTPConfirmationPopup extends BaseTPConfirmationPopup {
    private readonly newDates: Locator;
    private readonly newDatesIcon: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.newDates = this.findInsideByTestId('pill-content');
        this.newDatesIcon = this.findInsideByTestId('calendar-solid-icon');
    }

    async shouldBeDisplayedWithRelevantDetails(
        date: Date,
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
    ) {
        await test.step('Amend Dates Confirmation popup should be displayed for Trade Portal', async () => {
            let startDate = date.toString();
            let endDate = new Date(date);
            endDate.setDate(endDate.getDate() + holidayContext.stayDuration);
            let endDateString = endDate.toString();
            let expectedDate = `${getDay(startDate)} ${getMonth(startDate)} ${getYear(startDate)} - ${getDay(
                endDateString,
            )} ${getMonth(endDateString)} ${getYear(endDateString)}`;

            await this.waitUntilAttached();
            await this.titleShouldBe('We’ve successfully updated the dates');
            await this.subTitleShouldNotBeNullOrEmpty();
            await shouldBeVisible(this.newDatesIcon);
            await textShouldBe(this.newDates, expectedDate);
            await shouldBeVisible(this.icon);
            await this.messageShouldContainText(guestsContext.leadPassenger.email);
        });
    }
}
