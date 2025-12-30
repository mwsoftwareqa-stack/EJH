import {Locator, Page, TestInfo} from '@playwright/test';

import {test} from '../core/fixtures/baseFixture';
import {shouldBeVisible} from '../helpers/assertionHelper';
import {BasePage} from './core/basePage';
import {Footer} from './elements/managePage/footer/footer';
import {ManageCustomerDetailsSection} from './elements/managePage/manageCustomerDetailsSection';
import {ManageDatesSection} from './elements/managePage/manageDatesSection';
import {ManageFlightsSection} from './elements/managePage/manageFlightsSection';
import {ManageRoomBoardSection} from './elements/managePage/manageRoomBoardSection';
import {ManageSeatsSection} from './elements/managePage/manageSeatsSection';
import {ManageSpecialRequestSection} from './elements/managePage/manageSpecialRequestSection';
import {ManageTransferSection} from './elements/managePage/manageTransferSection';

import {BookingContext} from '../contexts/bookingContext';
import {GuestsContext} from '../contexts/guestsContext';
import {ManageSections} from '../core/enums/manageSections';
import {attachBookingDetails} from '../helpers/allureHelper';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {WebApiClient} from '../services/webApi/webApiClient';

export class ManagePage extends BasePage {
    private readonly tradePortalHeader: Locator;

    public readonly transferSection: ManageTransferSection;
    public readonly flightsSection: ManageFlightsSection;
    public readonly datesSection: ManageDatesSection;
    public readonly seatsSection: ManageSeatsSection;
    public readonly roomBoardSection: ManageRoomBoardSection;
    public readonly specialRequestSection: ManageSpecialRequestSection;
    public readonly customerDetailsSection: ManageCustomerDetailsSection;
    public readonly footer: Footer;

    constructor(page: Page, webApiClient: WebApiClient) {
        super(page);
        this.pagePath = '/manage';

        this.tradePortalHeader = page.locator("[alt='easyJet Holidays Trade Portal']");

        this.transferSection = new ManageTransferSection(page, 'change-transfer-drawer');
        this.flightsSection = new ManageFlightsSection(page, webApiClient, 'change-flight-drawer');
        this.datesSection = new ManageDatesSection(page, 'change-dates-drawer');
        this.seatsSection = new ManageSeatsSection(page, 'change-seats-drawer');
        this.roomBoardSection = new ManageRoomBoardSection(page, 'change-room-and-board-drawer');
        this.specialRequestSection = new ManageSpecialRequestSection(page, 'special-request-drawer');
        this.customerDetailsSection = new ManageCustomerDetailsSection(page, 'customer-details-drawer');
        this.footer = new Footer(page, 'footer', true);
    }

    async open(
        bookingContext: BookingContext,
        guestsContext: GuestsContext,
        waitUntilShimmerDisappears: boolean = true,
    ) {
        await test.step('Open Manage page', async () => {
            await this.goToUrl(`/${bookingContext.bookingResponse.bookingReference}`);
            if (waitUntilShimmerDisappears) {
                await this.waitUntilShimmerDisappears();
            }

            await attachBookingDetails(guestsContext, bookingContext);
        });
    }

    async expandSection(section: ManageSections) {
        await test.step(`Expand ${section} section on the Manage page`, async () => {
            switch (section) {
                case ManageSections.Transfer:
                    await this.transferSection.clickRootElement();
                    break;
                case ManageSections.Flights:
                    await this.flightsSection.clickRootElement();
                    break;
                case ManageSections.Dates:
                    await this.datesSection.clickRootElement();
                    break;
                case ManageSections.Seats:
                    await this.seatsSection.clickRootElement();
                    break;
                case ManageSections.RoomAndBoard:
                    await this.roomBoardSection.clickRootElement();
                    break;
                case ManageSections.SpecialRequest:
                    await this.specialRequestSection.clickRootElement();
                    break;
                case ManageSections.CustomerDetails:
                    await this.customerDetailsSection.clickRootElement();
                    break;
            }
        });
    }

    async clickChangeButton(section: ManageSections) {
        await test.step(`Click Change button in ${section} section`, async () => {
            switch (section) {
                case ManageSections.Transfer:
                    await this.transferSection.clickChangeButton();
                    break;
                case ManageSections.Flights:
                    await this.flightsSection.clickChangeButton();
                    break;
                case ManageSections.Dates:
                    await this.datesSection.clickChangeButton();
                    break;
                case ManageSections.Seats:
                    await this.seatsSection.clickChangeButton();
                    break;
                case ManageSections.RoomAndBoard:
                    await this.roomBoardSection.clickChangeButton();
                    break;
                case ManageSections.SpecialRequest:
                    await this.specialRequestSection.clickChangeButton();
                    break;
                case ManageSections.CustomerDetails:
                    await this.customerDetailsSection.clickChangeButton();
                    break;
            }
            await this.waitUntilShimmerDisappears();
        });
    }

    async shouldBeOpened() {
        await test.step('Manage page should be opened', async () => {
            await this.transferSection.shouldBeVisible();
            await this.pageUrlShouldBeOpened();
        });
    }

    async tradePortalHeaderShouldBeDisplayedForDesktop(testInfo: TestInfo) {
        await test.step('Trade Portal header should be displayed for Desktop on Manage page', async () => {
            if (!isMobileBrowser(testInfo)) {
                await shouldBeVisible(this.tradePortalHeader);
            }
        });
    }

}
