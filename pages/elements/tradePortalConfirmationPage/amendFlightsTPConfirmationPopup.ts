import test, {Locator, Page} from '@playwright/test';

import {ValidateFlightsResponse} from '@easyjet-dev/ejh-domain-models';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getFullDate, getRouteLocalTime} from '../../../helpers/dateHelper';
import {BaseTPConfirmationPopup} from '../base/baseTPConfirmationPopup';

// TODO [16/10/2025, KV]: Refactor class when logic to find widget inside another widget is implemented
export class AmendFlightsTPConfirmationPopup extends BaseTPConfirmationPopup {
    // Will be replaced with departure flight widget
    private readonly departureDetailsIcon: Locator;
    private readonly departureDetailsFlightDate: Locator;
    private readonly departureDetailsNumber: Locator;
    private readonly departureDetailsDepartureTime: Locator;
    private readonly departureDetailsArrivalTime: Locator;
    private readonly departureDetailsDepartureAirportName: Locator;
    private readonly departureDetailsArrivalAirportName: Locator;
    private readonly departureDetailsDepartureAirportCode: Locator;
    private readonly departureDetailsArrivalAirportCode: Locator;
    // Will be replaced with arrival flight widget
    private readonly arrivalDetailsIcon: Locator;
    private readonly arrivalDetailsFlightDate: Locator;
    private readonly arrivalDetailsNumber: Locator;
    private readonly arrivalDetailsDepartureTime: Locator;
    private readonly arrivalDetailsArrivalTime: Locator;
    private readonly arrivalDetailsDepartureAirportName: Locator;
    private readonly arrivalDetailsArrivalAirportName: Locator;
    private readonly arrivalDetailsDepartureAirportCode: Locator;
    private readonly arrivalDetailsArrivalAirportCode: Locator;

    constructor(page: Page, selector: string, options?: {isSelector?: boolean}) {
        super(page, selector, options);
        this.departureDetailsIcon = this.findInsideByTwoTestIds('departure-route-details', 'flight-icon');
        this.departureDetailsFlightDate = this.findInsideByTwoTestIds('departure-route-details', 'flight-date');
        this.departureDetailsNumber = this.findInsideByTwoTestIds('departure-route-details', 'flight-number');
        this.departureDetailsDepartureTime = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-time',
        );
        this.departureDetailsArrivalTime = this.findInsideByTwoTestIds('departure-route-details', 'arrival-time');
        this.departureDetailsDepartureAirportName = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-airport-name',
        );
        this.departureDetailsArrivalAirportName = this.findInsideByTwoTestIds(
            'departure-route-details',
            'arrival-airport-name',
        );
        this.departureDetailsDepartureAirportCode = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-airport-code',
        );
        this.departureDetailsArrivalAirportCode = this.findInsideByTwoTestIds(
            'departure-route-details',
            'arrival-airport-code',
        );
        this.arrivalDetailsIcon = this.findInsideByTwoTestIds('arrival-route-details', 'flight-icon');
        this.arrivalDetailsFlightDate = this.findInsideByTwoTestIds('arrival-route-details', 'flight-date');
        this.arrivalDetailsNumber = this.findInsideByTwoTestIds('arrival-route-details', 'flight-number');
        this.arrivalDetailsDepartureTime = this.findInsideByTwoTestIds('arrival-route-details', 'departure-time');
        this.arrivalDetailsArrivalTime = this.findInsideByTwoTestIds('arrival-route-details', 'arrival-time');
        this.arrivalDetailsDepartureAirportName = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'departure-airport-name',
        );
        this.arrivalDetailsArrivalAirportName = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'arrival-airport-name',
        );
        this.arrivalDetailsDepartureAirportCode = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'departure-airport-code',
        );
        this.arrivalDetailsArrivalAirportCode = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'arrival-airport-code',
        );
    }

    async shouldBeDisplayedWithRelevantDetails(email: string, validateFlightsResponse: ValidateFlightsResponse) {
        await test.step('Amend Flights Confirmation popup should be displayed', async () => {
            // First flight is taken, because first flight in UI was selected in previous step
            let firstFlight = validateFlightsResponse.validatedAlternativeFlights[0];
            let outboundFlightApi = firstFlight.routes[0];
            let inboundFlightApi = firstFlight.routes[1];
            let outboundFlightDate = `${getFullDate(outboundFlightApi.localDepartureTime)}`;
            let outboundDepartureTime = getRouteLocalTime(outboundFlightApi, 'departure');
            let outboundArrivalTime = getRouteLocalTime(outboundFlightApi, 'arrival');
            let inboundFlightDate = `${getFullDate(inboundFlightApi.localDepartureTime)}`;
            let inboundDepartureTime = getRouteLocalTime(inboundFlightApi, 'departure');
            let inboundArrivalTime = getRouteLocalTime(inboundFlightApi, 'arrival');

            await this.waitUntilAttached();
            await this.titleShouldBe('We’ve successfully updated the flight');
            await this.subTitleShouldNotBeNullOrEmpty();
            await this.messageShouldContainText(email);
            await shouldBeVisible(this.icon);

            // Departure route details
            await shouldBeVisible(this.departureDetailsIcon);
            await textShouldBe(this.departureDetailsFlightDate, outboundFlightDate);
            await textShouldBe(this.departureDetailsNumber, outboundFlightApi.flightNumber);
            await textShouldBe(this.departureDetailsDepartureTime, outboundDepartureTime);
            await textShouldBe(this.departureDetailsArrivalTime, outboundArrivalTime);
            await textShouldBe(
                this.departureDetailsDepartureAirportName,
                `${outboundFlightApi.departureAirportName}`,
            );
            await textShouldBe(this.departureDetailsArrivalAirportName, `${outboundFlightApi.arrivalAirportName}`);
            await textShouldBe(
                this.departureDetailsDepartureAirportCode,
                `(${outboundFlightApi.departureAirportCode})`,
            );
            await textShouldBe(
                this.departureDetailsArrivalAirportCode,
                `(${outboundFlightApi.arrivalAirportCode})`,
            );

            // Arrival route details
            await shouldBeVisible(this.arrivalDetailsIcon);
            await textShouldBe(this.arrivalDetailsFlightDate, inboundFlightDate);
            await textShouldBe(this.arrivalDetailsNumber, inboundFlightApi.flightNumber);
            await textShouldBe(this.arrivalDetailsDepartureTime, inboundDepartureTime);
            await textShouldBe(this.arrivalDetailsArrivalTime, inboundArrivalTime);
            await textShouldBe(
                this.arrivalDetailsDepartureAirportName,
                `${inboundFlightApi.departureAirportName}`,
            );
            await textShouldBe(this.arrivalDetailsArrivalAirportName, `${inboundFlightApi.arrivalAirportName}`);
            await textShouldBe(
                this.arrivalDetailsDepartureAirportCode,
                `(${inboundFlightApi.departureAirportCode})`,
            );
            await textShouldBe(this.arrivalDetailsArrivalAirportCode, `(${inboundFlightApi.arrivalAirportCode})`);
        });
    }
}
