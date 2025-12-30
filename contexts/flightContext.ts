import { SeatMapSeat } from '../services/webApi/models/seatMapData/seatMapSeat';
import { GetSeatsMapResponse } from '../services/webApi/models/seatMapData/getSeatsMapResponse';
import { GuestsContext } from './guestsContext';

    export class FlightContext {
        outboundSeatsApiQuery: string = '';
        inboundSeatsApiQuery: string = '';
        outboundSeatsUrlQuery: string = '';
        inboundSeatsUrlQuery: string = '';
        outboundSeats: SeatMapSeat[] = [];
        inboundSeats: SeatMapSeat[] = [];

    getPriceForAllSeatsSelected(): number {
        const outboundTotal = this.outboundSeats.reduce((sum, seat) => sum + seat.price, 0);
        const inboundTotal = this.inboundSeats.reduce((sum, seat) => sum + seat.price, 0);
        return outboundTotal + inboundTotal;
    }

    assignSeatsToGuests(
        seatsMap: GetSeatsMapResponse,
        guestsContext: GuestsContext,
        isOutbound: boolean = true,
        standardAdultSeat: boolean = true,
        mixedSeats: boolean = false
    ) {
        const seats = isOutbound ? this.outboundSeats : this.inboundSeats;
        let adultGuests = guestsContext.adults;
        const infantGuests = guestsContext.infants;

        if (infantGuests > 0) {
            // Infant seat is always combined with adult, so we reduce adult seat needed by one
            adultGuests -= infantGuests;
            for (let i = 0; i < infantGuests; i++) {
                seats.push(this.getAdultWithInfantSeatNumber(seatsMap));
            }
        }

        for (let i = 0; i < adultGuests; i++) {
            seats.push(
                standardAdultSeat
                    ? this.getStandardAdultSeatNumber(seatsMap)
                    : this.getPremiumAdultSeatNumber(seatsMap)
            );
            if (mixedSeats) standardAdultSeat = !standardAdultSeat;
        }

        for (let i = 0; i < guestsContext.children; i++) {
            seats.push(this.getChildrenSeatNumber(seatsMap));
        }

        this.buildSelectedSeatsApiQuery(isOutbound);
        this.buildSelectedSeatsUrlQuery(isOutbound);
        this.replaceEmptyPriceBandWithStandard();
    }

    clearSeatsSelection() {
        this.outboundSeats = [];
        this.inboundSeats = [];
        this.outboundSeatsApiQuery = '';
        this.inboundSeatsApiQuery = '';
        this.outboundSeatsUrlQuery = '';
        this.inboundSeatsUrlQuery = '';
    }

    private replaceEmptyPriceBandWithStandard() {
        for (const seat of this.outboundSeats.filter(seat => seat.priceBand === '')) {
            seat.priceBand = 'Standard';
        }
        for (const seat of this.inboundSeats.filter(seat => seat.priceBand === '')) {
            seat.priceBand = 'Standard';
        }
    }

    private buildSelectedSeatsApiQuery(isOutbound: boolean = true) {
        const seats = isOutbound ? this.outboundSeats : this.inboundSeats;
        const query = seats.map(seat => seat.number).join('|');
        if (isOutbound) {
            this.outboundSeatsApiQuery = query;
        } else {
            this.inboundSeatsApiQuery = query;
        }
    }

    private buildSelectedSeatsUrlQuery(isOutbound: boolean = true) {
        const seats = isOutbound ? this.outboundSeats : this.inboundSeats;
        let url = '';
        for (let i = 0; i < seats.length; i++) {
            url += `${i + 1}-${seats[i].number}|`;
        }
        url = url.slice(0, -1); // Remove last '|'
        if (isOutbound) {
            this.outboundSeatsUrlQuery = url;
        } else {
            this.inboundSeatsUrlQuery = url;
        }
    }

    private getAdultWithInfantSeatNumber(seatsMap: GetSeatsMapResponse): SeatMapSeat {
        const infantSeats = seatsMap.rows
            .flatMap(row =>
                row.blocks.flatMap(block =>
                    block.seats.filter(seat => seat.isAvailableForInfant && seat.isAvailable)
                )
            );
        if (infantSeats.length === 0) throw new Error('No available infant seats');
        const infantSeat = infantSeats[Math.floor(Math.random() * infantSeats.length)];
        infantSeat.isAvailable = false;
        return infantSeat;
    }

    private getChildrenSeatNumber(seatsMap: GetSeatsMapResponse): SeatMapSeat {
        const childSeats = seatsMap.rows
            .flatMap(row =>
                row.blocks.flatMap(block =>
                    block.seats.filter(seat => seat.isAvailableForChild && seat.isAvailable)
                )
            );
        if (childSeats.length === 0) throw new Error('No available child seats');
        const childSeat = childSeats[Math.floor(Math.random() * childSeats.length)];
        childSeat.isAvailable = false;
        return childSeat;
    }

    private getStandardAdultSeatNumber(seatsMap: GetSeatsMapResponse): SeatMapSeat {
        const adultSeats = seatsMap.rows
            .flatMap(row =>
                row.blocks.flatMap(block =>
                    block.seats.filter(seat => seat.isAvailable && !seat.isPremiumSeat)
                )
            );
        if (adultSeats.length === 0) throw new Error('No available standard adult seats');
        const adultSeat = adultSeats[Math.floor(Math.random() * adultSeats.length)];
        adultSeat.isAvailable = false;
        return adultSeat;
    }

    private getPremiumAdultSeatNumber(seatsMap: GetSeatsMapResponse): SeatMapSeat {
        const adultSeats = seatsMap.rows
            .flatMap(row =>
                row.blocks.flatMap(block =>
                    block.seats.filter(
                        seat => seat.isAvailable && seat.isPremiumSeat && seat.priceBand !== 'Extra legroom'
                    )
                )
            );
        if (adultSeats.length === 0) throw new Error('No available premium adult seats');
        const adultSeat = adultSeats[Math.floor(Math.random() * adultSeats.length)];
        adultSeat.isAvailable = false;
        return adultSeat;
    }
}