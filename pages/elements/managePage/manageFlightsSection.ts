import {Locator, Page} from '@playwright/test';

import {BookingContext} from '../../../contexts/bookingContext';
import {test} from '../../../core/fixtures/baseFixture';
import {shouldBeVisible, textShouldBe} from '../../../helpers/assertionHelper';
import {getFullDate, getLocalTime} from '../../../helpers/dateHelper';
import {WebApiClient} from '../../../services/webApi/webApiClient';
import {PageWidget} from '../../core/pageWidget';
import {ManageFlightDetailsSection} from './manageFlightDetailsSection';

export class ManageFlightsSection extends PageWidget {
    private readonly webApiClient: WebApiClient;

    private readonly title: Locator;
    private readonly icon: Locator;
    private readonly changeButton: Locator;

    public readonly outboundSection: ManageFlightDetailsSection;
    public readonly inboundSection: ManageFlightDetailsSection;

    constructor(page: Page, webApiClient: WebApiClient, testIdOrSelector: string) {
        super(page, testIdOrSelector);
        this.webApiClient = webApiClient;

        this.title = this.findInsideByTestId('change-flight-drawer-title');
        this.icon = this.findInsideByTestId('flight-general-icon');
        this.changeButton = this.findInsideByTestId('change-flights-button');

        this.outboundSection = new ManageFlightDetailsSection(page, 'flight-details-outbound');
        this.inboundSection = new ManageFlightDetailsSection(page, 'flight-details-inbound');
    }

    async flightsSectionShouldBeDisplayedWithRelevantDetails(bookingContext: BookingContext) {
        await test.step('Flights section should be displayed with relevant details', async () => {
            let bookingData = await this.webApiClient.getBooking(
                bookingContext.bookingResponse.bookingReference,
                bookingContext.bookingResponse.guests[0].lastName,
                bookingContext.bookingResponse.package.transport.routes[0].depDate!,
            );

            let outboundSection = this.outboundSection;
            let inboundSection = this.inboundSection;

            let outboundflight = bookingData.package.transport.routes[0];
            let inboundflight = bookingData.package.transport.routes[1];
            let expectedOutboundDate = getFullDate(outboundflight.depDate);
            let expectedInboundDate = getFullDate(inboundflight.depDate);
            let outboundDepTime = getLocalTime(outboundflight.depDate);
            let outboundArrTime = getLocalTime(outboundflight.arrDate);
            let inboundDepTime = getLocalTime(inboundflight.depDate);
            let inboundArrTime = getLocalTime(inboundflight.arrDate);

            await shouldBeVisible(this.icon);
            await textShouldBe(this.title, 'Flights');
            await outboundSection.dateShouldBe(expectedOutboundDate);
            await outboundSection.timeShouldBe(`${outboundDepTime} - ${outboundArrTime}`);
            await outboundSection.routeShouldBe(`${outboundflight.depName} (${outboundflight.depPt})`);
            await inboundSection.dateShouldBe(expectedInboundDate);
            await inboundSection.timeShouldBe(`${inboundDepTime} - ${inboundArrTime}`);
            await inboundSection.routeShouldBe(`${inboundflight.depName} (${inboundflight.depPt})`);
        });
    }

    public async clickChangeButton() {
        await this.click(this.changeButton);
    }
}
