import test, {Page} from '@playwright/test';
import {PageWidget} from '../../core/pageWidget';
import {SeatItem} from './seatItem';

export class SeatMap extends PageWidget {
    private seatItems: SeatItem[] = [];

    constructor(
        page: Page,
        selectorOrTestId: string,
        options?: {isSelector?: boolean; text?: string; numberOfElement?: number},
    ) {
        super(page, selectorOrTestId, options);
    }

    async selectFreeSeat(numberOfSeatsToSelect: number): Promise<string[]> {
        const selectedSeatCodes: string[] = [];
        await test.step(`Select ${numberOfSeatsToSelect} free seat(s)`, async () => {
            if (numberOfSeatsToSelect <= 0) {
                return;
            }

            await this.waitUntilAttached();

            for (let i = 0; i < numberOfSeatsToSelect; i++) {
                const freeSeats = await this.getFreeSeats();

                if (freeSeats.length === 0) {
                    throw new Error(
                        `Requested ${numberOfSeatsToSelect} free seats but only ${i} could be selected (none left).`,
                    );
                }

                // Pick the first free seat (could randomize if desired)
                const seatCode = await freeSeats[0].select();
                selectedSeatCodes.push(seatCode);
            }
        });

        return selectedSeatCodes;
    }

    private async getStandardSeatItems(): Promise<SeatItem[]> {
        const selector = '.seat-item--standard';

        if (this.seatItems.length === 0) {
            await this.waitForLoaded(selector);

            const baseLocator = this.locator.locator(selector);
            const count = await baseLocator.count();

            for (let i = 0; i < count; i++) {
                const seatItem = new SeatItem(this['page'], selector, {
                    isSelector: true,
                    numberOfElement: i + 1, // numberOfElement is 1-based
                });
                this.seatItems.push(seatItem);
            }
        }
        return this.seatItems;
    }

    public async getFreeSeats(): Promise<SeatItem[]> {
        const seats = await this.getStandardSeatItems();
        const freeSeats: SeatItem[] = [];
        for (const seat of seats) {
            if (await seat.isSeatFree()) {
                freeSeats.push(seat);
            }
        }
        return freeSeats;
    }

    public async getFirstFreeSeat(): Promise<SeatItem> {
        const free = await this.getFreeSeats();
        if (!free.length) {
            throw new Error('No free standard seats available');
        }
        return free[0];
    }
}
