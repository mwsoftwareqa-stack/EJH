import test, {Locator, Page} from '@playwright/test';

import {ValidateFlightsResponse} from '@easyjet-dev/ejh-domain-models';
import {textShouldBe} from '../../../helpers/assertionHelper';
import {getDay, getDayOfWeek, getDaySuffix, getLocalTime, getMonth} from '../../../helpers/dateHelper';
import {BaseConfirmationPopup} from '../base/baseConfirmationPopup';

export class AmendFlightsConfirmationPopup extends BaseConfirmationPopup {
    private readonly outboundFlightDate: Locator;
    private readonly outboundFlightAirports: Locator;
    private readonly outboundFlightTime: Locator;
    private readonly inboundFlightDate: Locator;
    private readonly inboundFlightAirports: Locator;
    private readonly inboundFlightTime: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);

        this.outboundFlightDate = this.findInsideByTwoTestIds('flight-outbound', 'flight-date', {
            isOldTestId: true,
        });
        this.outboundFlightAirports = this.findInsideByTwoTestIds('flight-outbound', 'airports-name-code', {
            isOldTestId: true,
        });
        this.outboundFlightTime = this.findInsideByTwoTestIds('flight-outbound', 'arr-time', {isOldTestId: true});
        this.inboundFlightDate = this.findInsideByTwoTestIds('flight-inbound', 'flight-date', {isOldTestId: true});
        this.inboundFlightAirports = this.findInsideByTwoTestIds('flight-inbound', 'airports-name-code', {
            isOldTestId: true,
        });
        this.inboundFlightTime = this.findInsideByTwoTestIds('flight-inbound', 'arr-time', {isOldTestId: true});
    }

    async clickBackToViewBookingButton() {
        await test.step('Click Back To View Bookking button in Flights Confirmation popup', async () => {
            await this.clickBackButton();
        });
    }

    async shouldBeDisplayedWithRelevantDetails(email: string, validateFlightsResponse: ValidateFlightsResponse) {
        await test.step('Amend Flights Confrimation popup should be displayed', async () => {
            let firstFlight = validateFlightsResponse.validatedAlternativeFlights[0];
            let outboundFlightApi = firstFlight.routes[0];
            let inboundFlightApi = firstFlight.routes[1];
            let outboundFlightDate =
                `${getDayOfWeek(outboundFlightApi.localDepartureTime)} ` +
                `${getDay(outboundFlightApi.localDepartureTime)}${getDaySuffix(
                    getDay(outboundFlightApi.localDepartureTime),
                )} ` +
                `${getMonth(outboundFlightApi.localDepartureTime)}`;
            let outboundAirports =
                `${outboundFlightApi.departureAirportName} (${outboundFlightApi.departureAirportCode})` +
                ` - ${outboundFlightApi.arrivalAirportName} (${outboundFlightApi.arrivalAirportCode})`;
            let outboundTime = getLocalTime(outboundFlightApi.localDepartureTime);
            let inboundFlightDate =
                `${getDayOfWeek(inboundFlightApi.localDepartureTime)} ` +
                `${getDay(inboundFlightApi.localDepartureTime)}${getDaySuffix(
                    getDay(inboundFlightApi.localDepartureTime),
                )} ` +
                `${getMonth(inboundFlightApi.localDepartureTime)}`;
            let inboundAirports =
                `${inboundFlightApi.departureAirportName} (${inboundFlightApi.departureAirportCode})` +
                ` - ${inboundFlightApi.arrivalAirportName} (${inboundFlightApi.arrivalAirportCode})`;
            let inboundTime = getLocalTime(inboundFlightApi.localDepartureTime);

            await this.waitUntilAttached();
            await this.titleShouldBe("We've successfully changed your flights");
            await this.subTitleShouldNotBeNullOrEmpty();
            await this.messageShouldContainText(email);
            await textShouldBe(this.outboundFlightDate, outboundFlightDate);
            await textShouldBe(this.outboundFlightAirports, outboundAirports);
            await textShouldBe(this.outboundFlightTime, outboundTime);
            await textShouldBe(this.inboundFlightDate, inboundFlightDate);
            await textShouldBe(this.inboundFlightAirports, inboundAirports);
            await textShouldBe(this.inboundFlightTime, inboundTime);
        });
    }
}
