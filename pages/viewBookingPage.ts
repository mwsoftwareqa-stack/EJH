import test, {expect, Locator, Page} from '@playwright/test';

import {BookingContext} from '../contexts/bookingContext';
import {GuestsContext} from '../contexts/guestsContext';
import * as allureHelper from '../helpers/allureHelper';
import {BasePage} from './core/basePage';
import {AmendDatesConfirmationPopup} from './elements/viewBookingPage/amendDatesConfirmationPopup';
import {AmendFlightsConfirmationPopup} from './elements/viewBookingPage/amendFlightsConfirmationPopup';
import {AmendRoomBoardConfirmationPopup} from './elements/viewBookingPage/amendRoomBoardConfirmationPopup';
import {AmendSeatsConfirmationPopup} from './elements/viewBookingPage/amendSeatsConfirmationPopup';
import {AmendTransferConfirmationPopup} from './elements/viewBookingPage/amendTransferConfirmationPopup';
import {TransfersSection} from './elements/viewBookingPage/transfersSection';
import {ViewBookingFlightsSection} from './elements/viewBookingPage/viewBookingFlightsSection';

export class ViewBookingPage extends BasePage {
    private readonly holidayReference: Locator;
    private readonly manageYourHolidayButton: Locator;

    public readonly transfersSection: TransfersSection;
    public readonly flightsSection: ViewBookingFlightsSection;
    public readonly amendTransferConfirmationPopup: AmendTransferConfirmationPopup;
    public readonly amendFlightsConfirmationPopup: AmendFlightsConfirmationPopup;
    public readonly amendDatesConfirmationPopup: AmendDatesConfirmationPopup;
    public readonly amendSeatsConfirmationPopup: AmendSeatsConfirmationPopup;
    public readonly amendRoomBoardConfirmationPopup: AmendRoomBoardConfirmationPopup;

    constructor(page: Page) {
        super(page);
        this.holidayReference = this.page.locator("[data-tid='booking-ref'] [data-tid='ref-number']");
        this.manageYourHolidayButton = this.getByDataTid('manage-holiday-btn');

        this.transfersSection = new TransfersSection(page, '.confirmed-transfer');
        this.flightsSection = new ViewBookingFlightsSection(page, "[data-tid='booking-flights']");
        this.amendTransferConfirmationPopup = new AmendTransferConfirmationPopup(
            page,
            "[data-tid='successful-amend-popup-Transfer-dialog-content']",
            {isSelector: true},
        );
        this.amendFlightsConfirmationPopup = new AmendFlightsConfirmationPopup(
            page,
            "[data-tid='successful-amend-popup-Flight-dialog-content']",
            {isSelector: true},
        );
        this.amendSeatsConfirmationPopup = new AmendSeatsConfirmationPopup(
            page,
            "[data-tid='successful-amend-popup-Seats-dialog-content']",
            {isSelector: true},
        );
        this.amendDatesConfirmationPopup = new AmendDatesConfirmationPopup(
            page,
            "[data-tid='successful-amend-popup-Dates-dialog-content']",
            {isSelector: true},
        );
        this.amendRoomBoardConfirmationPopup = new AmendRoomBoardConfirmationPopup(
            page,
            '#successful-amend-popup-RoomAndBoard',
            {isSelector: true},
        );
    }

    async clickManageYourHolidayButton() {
        await test.step('Click Manage Your Holiday button on View Booking page', async () => {
            await this.manageYourHolidayButton.click();
            await this.waitUntilSpinnerButtonDisappears();
            await this.waitUntilShimmerDisappears();
        });
    }

    async shouldBeOpened(
        guestsContext: GuestsContext,
        bookingContext: BookingContext,
        attachDetails: boolean = true,
    ) {
        await test.step('View Booking page should be opened', async () => {
            await expect(this.holidayReference).toBeVisible({timeout: 15000});

            if (attachDetails) {
                allureHelper.attachBookingDetails(guestsContext, bookingContext);
            }
        });
    }

    async amendTransferConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Amend Transfer Confirmation popup should not be displayed', async () => {
            this.amendTransferConfirmationPopup.shouldNotBeVisible();
        });
    }

    async amendFlightsConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Amend Flights Confirmation popup should not be displayed', async () => {
            this.amendFlightsConfirmationPopup.shouldNotBeVisible();
        });
    }

    async amendDatesConfirmationPopupShouldNotBeDisplayed() {
        await test.step('Amend Dates Confirmation popup should not be displayed', async () => {
            this.amendDatesConfirmationPopup.shouldNotBeVisible();
        });
    }
}
