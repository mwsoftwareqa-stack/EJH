import {ValidateFlightsResponse} from '@easyjet-dev/ejh-domain-models';

type Route = ValidateFlightsResponse['validatedAlternativeFlights'][number]['routes'][number];

export function convertDateToString(date: Date | undefined): string {
    return Intl.DateTimeFormat('en-GB').format(date);
}

// Example: Saturday 18th Oct 2025
export function getFullDate(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);

    const dayOfWeek = date.toLocaleDateString('en-GB', {weekday: 'long'});
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', {month: 'short'});
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);

    return `${dayOfWeek} ${day}${suffix} ${month} ${year}`;
}

// Example: Sat Feb 7th 2026
export function getShortDayOfWeekAndFullDate(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);

    const dayOfWeek = date.toLocaleDateString('en-GB', {weekday: 'short'});
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', {month: 'short'});
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);

    return `${dayOfWeek} ${month} ${day}${suffix} ${year}`;
}

//Example: Sat 18 Oct
export function getDayOfWeekDayMonthDate(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);

    const dayOfWeek = date.toLocaleDateString('en-GB', {weekday: 'short'});
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', {month: 'short'});

    return `${dayOfWeek} ${day} ${month}`;
}

export function getYear(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);
    return date.getFullYear().toString();
}

export function getMonth(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {month: 'short'});
}

export function getDay(dateString: string | undefined): number {
    if (!dateString) throw new Error('Date is undefined');

    return new Date(dateString).getDate();
}

export function getDayOfWeek(dateString: string | undefined): string {
    if (!dateString) throw new Error('Date is undefined');

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {weekday: 'short'});
}

export function getUTCTime(dateString?: string): string {
    if (!dateString) throw new Error('Date is undefined');

    const d = new Date(dateString.trim());
    if (isNaN(d.getTime())) throw new Error('Date is undefined');

    const hh = d.getUTCHours().toString().padStart(2, '0');
    const mm = d.getUTCMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

// Example: 18:20
export function getLocalTime(dateString?: string): string {
    if (!dateString) throw new Error('Date is undefined');

    // Extract only the date and time part (ignore any timezone info)
    const match = dateString.trim().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    if (!match) throw new Error("Date wasn't found");

    const [, , time] = match;
    return time;
}

/**
 * Extracts local time from Route object with next-day indicator
 * @param route - Route object containing localArrivalTime and localDepartureTime
 * @param timeType - Whether to extract 'departure' or 'arrival' time
 * @returns Formatted time string (e.g., "18:20" or "00:05+1" for next-day arrivals)
 * @example
 * Same day flight
 * getRouteLocalTime(route, 'departure') // "20:45"
 * getRouteLocalTime(route, 'arrival')   // "22:30"
 *
 * Overnight flight
 * getRouteLocalTime(route, 'arrival')   // "00:05+1"
 */
export function getRouteLocalTime(route: Route, timeType: 'departure' | 'arrival'): string {
    if (!route) throw new Error('Route is undefined');

    const dateString = timeType === 'arrival' ? route.localArrivalTime : route.localDepartureTime;
    // Extract date and time parts
    const match = dateString.trim().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
    if (!match) throw new Error(`Invalid ${timeType} time format`);

    const [, date, time] = match;
    // For arrival time, check if arrival date is different from departure date
    if (timeType === 'departure') return time;

    const departureMatch = route.localDepartureTime.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (departureMatch && departureMatch[1] !== date) {
        return `${time}+1`;
    }

    return time;
}

export function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

export function getDaysBetween(date1: string, date2: string): number {
    const oneDayMs = 1000 * 60 * 60 * 24; // milliseconds in a day
    const difference = new Date(date2).getTime() - new Date(date1).getTime();
    return Math.round(difference / oneDayMs); // round in case of timezone differences
}
