import {Locator, Page} from '@playwright/test';

import {BookingContext} from '../contexts/bookingContext';
import {HolidayContext} from '../contexts/holidayContext';
import {test} from '../core/fixtures/baseFixture';
import {convertDateToString} from '../helpers/dateHelper';
import {BasePage} from './core/basePage';
import {LoginForm} from './elements/loginPage/loginForm';

export class LoginPage extends BasePage {
    private readonly departureDateField: Locator;
    private readonly bookingRefField: Locator;
    private readonly viewBookingButton: Locator;

    public readonly loginForm: LoginForm;

    constructor(page: Page) {
        super(page);
        this.pagePath = '/login';

        this.departureDateField = page.locator('[data-tid="departureDate"] input');
        this.bookingRefField = page.locator('[data-tid="bookingReference"] input');
        this.viewBookingButton = this.getByDataTid('view-booking-button');

        this.loginForm = new LoginForm(page, '#login-form__sign-in');
    }

    async open() {
        await test.step('Open Login Page', async () => {
            await this.goToUrl();
        });
    }

    async enterBookingDetailsAndClickViewBookingButton(
        holidayContext: HolidayContext,
        bookingContext: BookingContext,
    ) {
        await test.step('Enter booking details and click View Button', async () => {
            const departureDate = convertDateToString(holidayContext.departure);

            await this.departureDateField.fill(departureDate);
            await this.bookingRefField.fill(bookingContext.bookingResponse.bookingReference);
            await this.viewBookingButton.click();

            await this.waitUntilSpinnerDisappears();
        });
    }
}
