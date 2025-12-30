import {faker} from '@faker-js/faker';

import {HolidayContext} from '../contexts/holidayContext';

export function createDefaultHolidayContext(): HolidayContext {
    const context = new HolidayContext();
    const departure = getRandomDepartureDateExceptChristmas();

    context.origin = 'LGW,LTN,SEN,STN';
    context.geography = 'ES';
    context.departure = departure;
    context.stayDuration = 7;
    context.isFlexible = false;
    context.freeForKidsOnly = false;

    return context;
}

export function createHolidayContextWithSeatsAvailable(): HolidayContext {
    const context = createDefaultHolidayContext();
    context.withSeatsAvailable = true;
    return context;
}

export function createHolidayContextForPromoCode(options?: {
    priceFrom?: number;
    priceTo?: number;
}): HolidayContext {
    const context = createDefaultHolidayContext();
    const baseDeparture = new Date(2026, 3, 5);
    const offsetDays = faker.number.int({min: 0, max: 15});

    context.departure = addDays(baseDeparture, offsetDays);
    context.priceFrom = options?.priceFrom;
    context.priceTo = options?.priceTo;

    return context;
}

function getRandomDepartureDateExceptChristmas(): Date {
    let departure = addDays(new Date(), 140 + faker.number.int({min: 0, max: 8}));
    const year = departure.getFullYear();
    const christmas = new Date(year, 12, 25);
    const weekBefore = new Date(year, 12, 18);

    while (
        departure.toDateString() === christmas.toDateString() ||
        departure.toDateString() === weekBefore.toDateString()
    ) {
        departure = addDays(new Date(), 120 + faker.number.int({min: 0, max: 60}));
    }

    return departure;
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
