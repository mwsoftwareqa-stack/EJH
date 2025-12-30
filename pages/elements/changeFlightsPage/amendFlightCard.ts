import test, {Locator, Page} from '@playwright/test';

import {BookingContext} from '../../../contexts/bookingContext';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getLocalTime, getShortDayOfWeekAndFullDate} from '../../../helpers/dateHelper';
import {WebApiClient} from '../../../services/webApi/webApiClient';
import {PageWidget} from '../../core/pageWidget';

export class AmendFlightCard extends PageWidget {
    private readonly webApiClient: WebApiClient;

    // Departure route locators
    private readonly departureRouteIcon: Locator;
    private readonly departureRouteDate: Locator;
    private readonly departureRouteDepartureTime: Locator;
    private readonly departureRouteArrivalTime: Locator;
    private readonly departureRouteDepartureAirportName: Locator;
    private readonly departureRouteArivalAirportName: Locator;
    private readonly departureRouteDepartureAirporCode: Locator;
    private readonly departureRouteArrivalAirporCode: Locator;

    // Arrival route locators
    private readonly arrivalRouteIcon: Locator;
    private readonly arrivalRouteDate: Locator;
    private readonly arrivalRouteDepartureTime: Locator;
    private readonly arrivalRouteArrivalTime: Locator;
    private readonly arrivalRouteDepartureAirportName: Locator;
    private readonly arrivalRouteArivalAirportName: Locator;
    private readonly arrivalRouteDepartureAirporCode: Locator;
    private readonly arrivalRouteArrivalAirporCode: Locator;

    private readonly selectButton: Locator;

    constructor(page: Page, testIdOrSelector: string, webApiClient: WebApiClient, index?: number) {
        super(page, testIdOrSelector, {isSelector: undefined, text: undefined, numberOfElement: index});
        this.webApiClient = webApiClient;
        // Departure
        this.departureRouteIcon = this.findInsideByTwoTestIds('departure-route-details', 'flight-icon');
        this.departureRouteDate = this.findInsideByTwoTestIds('departure-route-details', 'flight-date');
        this.departureRouteDepartureTime = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-time',
        );
        this.departureRouteArrivalTime = this.findInsideByTwoTestIds('departure-route-details', 'arrival-time');
        this.departureRouteDepartureAirportName = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-airport-name',
        );
        this.departureRouteArivalAirportName = this.findInsideByTwoTestIds(
            'departure-route-details',
            'arrival-airport-name',
        );
        this.departureRouteDepartureAirporCode = this.findInsideByTwoTestIds(
            'departure-route-details',
            'departure-airport-code',
        );
        this.departureRouteArrivalAirporCode = this.findInsideByTwoTestIds(
            'departure-route-details',
            'arrival-airport-code',
        );

        // Arrival
        this.arrivalRouteIcon = this.findInsideByTwoTestIds('arrival-route-details', 'flight-icon');
        this.arrivalRouteDate = this.findInsideByTwoTestIds('arrival-route-details', 'flight-date');
        this.arrivalRouteDepartureTime = this.findInsideByTwoTestIds('arrival-route-details', 'departure-time');
        this.arrivalRouteArrivalTime = this.findInsideByTwoTestIds('arrival-route-details', 'arrival-time');
        this.arrivalRouteDepartureAirportName = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'departure-airport-name',
        );
        this.arrivalRouteArivalAirportName = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'arrival-airport-name',
        );
        this.arrivalRouteDepartureAirporCode = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'departure-airport-code',
        );
        this.arrivalRouteArrivalAirporCode = this.findInsideByTwoTestIds(
            'arrival-route-details',
            'arrival-airport-code',
        );

        this.selectButton = this.findInsideByTestId('flight-card-button');
    }

    async selectedFlightCardShouldBeDisplayedWithRelevantDetails(bookingContext: BookingContext) {
        await test.step('Selected flight card should be displayed with relevant details', async () => {
            let bookingData = await this.webApiClient.getBooking(
                bookingContext.bookingResponse.bookingReference,
                bookingContext.bookingResponse.guests[0].lastName,
                bookingContext.bookingResponse.package.transport.routes[0].depDate!,
            );

            let outboundflight = bookingData.package.transport.routes[0];
            let inboundflight = bookingData.package.transport.routes[1];
            let expectedOutboundDate = getShortDayOfWeekAndFullDate(outboundflight.depDate);
            let expectedInboundDate = getShortDayOfWeekAndFullDate(inboundflight.depDate);
            let outboundDepTime = getLocalTime(outboundflight.depDate);
            let outboundArrTime = getLocalTime(outboundflight.arrDate);
            let inboundDepTime = getLocalTime(inboundflight.depDate);
            let inboundArrTime = getLocalTime(inboundflight.arrDate);

            // Departure route assertions
            await shouldBeVisible(this.departureRouteIcon, 15000);
            await textShouldBe(this.departureRouteDate, expectedOutboundDate);
            await textShouldBe(this.departureRouteDepartureTime, outboundDepTime);
            await textShouldBe(this.departureRouteArrivalTime, outboundArrTime);
            await textShouldBe(this.departureRouteDepartureAirportName, outboundflight.depName);
            await textShouldBe(this.departureRouteArivalAirportName, outboundflight.arrName);
            await textShouldBe(this.departureRouteDepartureAirporCode, `(${outboundflight.depPt})`);
            await textShouldBe(this.departureRouteArrivalAirporCode, `(${outboundflight.arrPt})`);

            // Arrival route assertions
            await shouldBeVisible(this.arrivalRouteIcon);
            await textShouldBe(this.arrivalRouteDate, expectedInboundDate);
            await textShouldBe(this.arrivalRouteDepartureTime, inboundDepTime);
            await textShouldBe(this.arrivalRouteArrivalTime, inboundArrTime);
            await textShouldBe(this.arrivalRouteDepartureAirportName, inboundflight.depName);
            await textShouldBe(this.arrivalRouteArivalAirportName, inboundflight.arrName);
            await textShouldBe(this.arrivalRouteDepartureAirporCode, `(${inboundflight.depPt})`);
            await textShouldBe(this.arrivalRouteArrivalAirporCode, `(${inboundflight.arrPt})`);
        });
    }

    async clickSelectButton() {
        await this.selectButton.click();
    }
}
