export class HolidayContext {
    private _originAirportCodes: string[] = [];
    private _destinationCountries: Set<string> = new Set();
    private _destinationRegions: Set<string> = new Set();
    private _destinationResorts: Set<string> = new Set();
    private _roomCodes: string[] = [];
    departure?: Date;
    stayDuration: number = 0;
    withSeatsAvailable: boolean = false;
    withExtraHoldLuggage: boolean = false;
    withLargeCabinBags: boolean = false;
    cabinBagsAvailable: boolean = false;
    isFlexible: boolean = false;
    freeForKidsOnly: boolean = false;
    directHotel: boolean = false;
    hotelBeds: boolean = false;
    skipPackageValidation: boolean = false;
    automaticAllocation: boolean = true;
    accomCodes?: string;
    accomPackageId?: string;
    altAccommodation?: string;
    altPackageId?: string;
    boardType?: string;
    outboundRoute?: string;
    inboundRoute?: string;
    skipDiHotels: boolean = true;
    cityBreakProm: boolean = false;
    cabinBagForOneGuest: boolean = false;
    isFlexibile: boolean = true;
    priceFrom?: number;
    priceTo?: number;

    // Origin (computed)
    get origin(): string {
        return this._originAirportCodes.join(',');
    }

    set origin(value: string) {
        this._originAirportCodes = value.split(',');
    }

    get originAirportCodes(): string[] {
        return [...this._originAirportCodes];
    }

    // Destination (computed)
    get destination(): string {
        const geographyParts = this.geography.split(',');
        return geographyParts.length > 1 ? geographyParts[1].replace(/\|/g, ',') : '';
    }

    // Geography (computed)
    get geography(): string {
        let geography = [...this._destinationCountries].join('|');

        if (this._destinationRegions.size > 0) {
            geography += ',' + [...this._destinationRegions].join('|');
        }

        if (this._destinationResorts.size > 0) {
            geography += ',' + [...this._destinationResorts].join('|');
        }

        return geography;
    }

    set geography(value: string) {
        this._destinationCountries.clear();
        this._destinationRegions.clear();
        this._destinationResorts.clear();

        this.appendDestination(value);
    }

    appendDestination(code: string): void {
        const parts = code.split(',');

        if (parts[0]) {
            this._destinationCountries.add(parts[0]);
        }
        if (parts.length > 1 && parts[1]) {
            parts[1].split('|').forEach((r) => this._destinationRegions.add(r));
        }
        if (parts.length > 2 && parts[2]) {
            parts[2].split('|').forEach((r) => this._destinationResorts.add(r));
        }
    }

    removeDestination(code: string): void {
        const parts = code.split(',');

        if (parts.length === 2) {
            this._destinationRegions.delete(parts[1]);
        }

        if (parts.length === 3) {
            this._destinationResorts.delete(parts[2]);
        }
    }

    // RoomCodes (computed)
    get roomCode(): string {
        return this._roomCodes.join(',');
    }

    set roomCode(value: string) {
        this._roomCodes = value.split(',');
    }

    get roomCodes(): string[] {
        return [...this._roomCodes];
    }

    get returning(): Date | undefined {
        return this.departure ? new Date(this.departure.getTime() + this.stayDuration * 86400000) : undefined;
    }

    randomizeDepartureDateForMockedSearchResults(): void {
        const today = new Date();
        const base = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        const christmas = new Date(today.getFullYear(), 12, 25);
        const weekBeforeChristmas = new Date(today.getFullYear(), 12, 18);

        do {
            const offset = Math.floor(Math.random() * 30);
            this.departure = new Date(base.getTime() + offset * 86400000);
        } while (
            this.datesAreEqual(this.departure, christmas) ||
            this.datesAreEqual(this.departure, weekBeforeChristmas)
        );
    }

    private datesAreEqual(a?: Date, b?: Date): boolean {
        if (!a || !b) return false;
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
}
