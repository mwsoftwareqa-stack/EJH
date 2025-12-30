import {Page} from '@playwright/test';

import {PageWidget} from '../../../../core/pageWidget';
import {AmendFlightItem} from './amendFlightItem';

export class AmendSeatsDetails extends PageWidget {
    public readonly outboundFlight: AmendFlightItem;
    public readonly inboundFlight: AmendFlightItem;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});

        this.outboundFlight = new AmendFlightItem(page, 'outbound-flight-seats-selection-column', false);
        this.inboundFlight = new AmendFlightItem(page, 'return-flight-seats-selection-column', false);
    }
}
