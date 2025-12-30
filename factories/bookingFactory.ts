import {GetAlternativeOptionsResponse, ValidateFlightsResponse} from '@easyjet-dev/ejh-domain-models';
import fs from 'fs';
import path from 'path';

import {BookingContext} from '../contexts/bookingContext';
import {FlightContext} from '../contexts/flightContext';
import {GuestsContext} from '../contexts/guestsContext';
import {HolidayContext} from '../contexts/holidayContext';
import {PaymentContext} from '../contexts/paymentContext';
import {getEnvConfig} from '../core/config/envConfigHelper';
import {PersonType} from '../core/enums/personType';
import {PaymentMethod} from '../core/enums/paymentMethod';
import {NoTestDataException} from '../core/exeptions/noTestDataException';
import {test} from '../core/fixtures/baseFixture';
import {getEnvVar} from '../helpers/envVariablesHelper';
import {DateService} from '../services/dateService';
import {AmendTransferItemType} from '../services/webApi/enums/amendTransferItemType';
import {TransferItemType} from '../services/webApi/enums/transferItemType';
import {BookingResponse} from '../services/webApi/models/bookingResponse';
import {Location} from '../services/webApi/models/offerData/location';
import {Offer} from '../services/webApi/models/offer';
import {ValidateBookingResponse} from '../services/webApi/models/validateBookingResponse';
import {WebApiClient} from '../services/webApi/webApiClient';

const testAgentUsername = getEnvVar('TEST_AGENT_USERNAME');
const testAgentPassword = getEnvVar('TEST_AGENT_PASSWORD');
const envConfig = getEnvConfig();

export class BookingFactory {
    constructor(private webApiClient: WebApiClient) {
        this.webApiClient = webApiClient;
    }

    async createAnyBooking(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        options?: {
            isTradeAgent?: boolean;
            outboundIsExt?: boolean;
            inboundIsExt?: boolean;
        },
    ): Promise<{bookingContext: BookingContext}> {
        return await test.step('Create any booking', async () => {
            const allowedCommitAttempts = 2;
            let commitAttemptsCount = 1;
            let accessToken = undefined;

            let offers = await this.searhForPackages(guestsContext, holidayContext);

            // Filter offers by isExt if specified
            if (options?.outboundIsExt !== undefined || options?.inboundIsExt !== undefined) {
                offers = offers.filter((o) => {
                    const outboundMatches =
                        options?.outboundIsExt === undefined ||
                        (o.transport.routes[0]?.isExt === options.outboundIsExt);
                    const inboundMatches =
                        options?.inboundIsExt === undefined ||
                        (o.transport.routes[1]?.isExt === options.inboundIsExt);
                    return outboundMatches && inboundMatches;
                });
            }

            if (options?.isTradeAgent) {
                let response = await this.webApiClient.getAccessToken(
                    testAgentUsername,
                    testAgentPassword,
                    envConfig,
                );
                accessToken = response.access_token;
            }

            const bookingContext = new BookingContext();

            for (const offer of offers) {
                let validateResponse = await this.webApiClient.validatePackage(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    undefined,
                    options?.isTradeAgent,
                    accessToken,
                );

                if (!validateResponse?.paymentInfo) {
                    continue;
                }

                let bookingResponse = await this.bookOfferWithoutValidation(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    validateResponse,
                    undefined,
                    undefined,
                    options?.isTradeAgent,
                    options?.isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                    accessToken,
                );

                commitAttemptsCount++;

                if (bookingResponse) {
                    bookingContext.offer = offer;
                    bookingContext.validateResponse = validateResponse;
                    bookingContext.bookingResponse = bookingResponse;
                    return {bookingContext};
                }

                if (commitAttemptsCount > allowedCommitAttempts) {
                    throw new NoTestDataException(
                        `Can't find any valid packages after ${allowedCommitAttempts} commit attempts`,
                    );
                }
            }

            console.log('bookingContext', bookingContext);

            throw new NoTestDataException("Can't find any valid packages");
        });
    }

    async createBookingWithValidAltDate(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        options?: {isTradeAgent?: boolean; priceChange?: 'increase' | 'decrease'},
    ): Promise<{bookingContext: BookingContext; altDate: Date; priceDifference?: number}> {
        return await test.step('Create booking with date amendment changing price', async () => {
            const allowedCommitAttempts = 5;
            let commitAttemptsCount = 1;
            let accessToken = undefined;

            let offers = await this.searhForPackages(guestsContext, holidayContext);

            if (options?.isTradeAgent) {
                let response = await this.webApiClient.getAccessToken(
                    testAgentUsername,
                    testAgentPassword,
                    envConfig,
                );
                accessToken = response.access_token;
            }

            const bookingContext = new BookingContext();

            for (const offer of offers) {
                let validateResponse = await this.webApiClient.validatePackage(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    undefined,
                    options?.isTradeAgent,
                    accessToken,
                );

                if (!validateResponse?.paymentInfo) {
                    continue;
                }

                let bookingResponse = await this.bookOfferWithoutValidation(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    validateResponse,
                    undefined,
                    undefined,
                    options?.isTradeAgent,
                    options?.isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                    accessToken,
                );

                commitAttemptsCount++;

                if (bookingResponse) {
                    bookingContext.offer = offer;
                    bookingContext.validateResponse = validateResponse;
                    bookingContext.bookingResponse = bookingResponse;
                }

                let bookingDate = new Date(offer.date ?? Date.now());
                let isNewDateFound = false;
                let priceDifference = 0;

                if (!accessToken) {
                    throw new Error('Access token is required for date amendment operations');
                }

                let availableDates = await DateService.getAvailableAlternativeDates(
                    bookingContext,
                    this.webApiClient,
                    accessToken,
                );

                // Calculate first day of month of bookingDate
                const firstDayOfMonth = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), 1);
                // Calculate last day of month after bookingDate
                const lastDayOfNextMonth = new Date(bookingDate.getFullYear(), bookingDate.getMonth() + 2, 0);

                const filteredDates =
                    availableDates?.filter((date) => {
                        return (
                            date >= firstDayOfMonth &&
                            date <= lastDayOfNextMonth &&
                            date.getDate() !== bookingDate.getDate()
                        );
                    }) ?? [];

                if (options?.priceChange === undefined && filteredDates.length > 0) {
                    // Get a random element from filteredDates
                    const randomIndex = Math.floor(Math.random() * filteredDates.length);
                    const randomAltDate = filteredDates[randomIndex];
                    return {bookingContext, altDate: randomAltDate};
                }

                for (let i = 0; i < filteredDates.length; i++) {
                    let newDate = filteredDates[i];

                    priceDifference = await DateService.getPriceDifferenceForDateChange(
                        bookingContext,
                        newDate,
                        this.webApiClient,
                        accessToken,
                    );

                    const condition =
                        options?.priceChange === 'decrease' ? priceDifference < 0 : priceDifference > 0;

                    if (condition) {
                        isNewDateFound = true;
                        return {bookingContext, altDate: newDate, priceDifference};
                    }
                }

                if (!isNewDateFound && commitAttemptsCount > allowedCommitAttempts) {
                    throw new NoTestDataException(
                        `Can't find package with alt date decreasing price after ${allowedCommitAttempts}`,
                    );
                }
            }

            throw new NoTestDataException("Can't find any valid packages");
        });
    }

    // Method used to create booking with private transfer and shared alternative
    async createBookingWithChangedDefaultTransferAndAltTransfer(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        options?: {
            isTradeAgent?: boolean;
            transferType: TransferItemType;
            altTransferType: TransferItemType;
            altAmendTransferType: AmendTransferItemType;
        },
    ): Promise<{bookingContext: BookingContext; altTransfersResponse: GetAlternativeOptionsResponse}> {
        return await test.step('Create booking with alternative transfer selected', async () => {
            const allowedCommitAttempts = 2;
            let commitAttemptsCount = 1;
            let accessToken = undefined;

            let offers = await this.searhForPackages(guestsContext, holidayContext);

            offers = offers.filter(
                (o) => o.transfers.length > 0 && o.transfers[0].type == options?.altTransferType,
            );

            if (options?.isTradeAgent) {
                let response = await this.webApiClient.getAccessToken(
                    testAgentUsername,
                    testAgentPassword,
                    envConfig,
                );
                accessToken = response.access_token;
            }

            const bookingContext = new BookingContext();

            for (const offer of offers) {
                if (commitAttemptsCount > allowedCommitAttempts)
                    throw new NoTestDataException(
                        `Can't find valid booking after ${commitAttemptsCount} commit attempts`,
                    );

                const extrasResponse = await this.webApiClient.getHolidayExtras(offer);
                const altTransfer = extrasResponse.transfers.find((t) => t.type === options?.transferType);

                if (!altTransfer) continue;

                // Replacing default transfer with alternative desired one
                offer.transfers[0] = altTransfer;

                const validateResponse = await this.webApiClient.validatePackage(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    undefined,
                    options?.isTradeAgent,
                    accessToken,
                );

                if (!validateResponse?.paymentInfo) continue;

                const bookingResponse = await this.bookOfferWithoutValidation(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    validateResponse,
                    undefined,
                    undefined,
                    options?.isTradeAgent,
                    options?.isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                    accessToken,
                );

                commitAttemptsCount++;

                if (!bookingResponse) continue;

                const altTransfersResponse = await this.webApiClient.getAmendAlternativeTransfers(
                    bookingResponse.bookingReference,
                    accessToken,
                );
                let amendPrivateTransfer = altTransfersResponse.transfers.alternativeTransfers?.find(
                    (t) => t.transferType === options?.altAmendTransferType,
                );

                if (!amendPrivateTransfer) continue;

                bookingContext.offer = offer;
                bookingContext.validateResponse = validateResponse;
                bookingContext.bookingResponse = bookingResponse;

                return {bookingContext, altTransfersResponse};
            }

            throw new NoTestDataException("Can't find valid packages");
        });
    }

    async createBookingWithAltTransfer(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        options: {
            isTradeAgent?: boolean;
            defaultTransferType?: TransferItemType;
            altTransferType: TransferItemType;
            altAmendTransferType: AmendTransferItemType;
        },
    ): Promise<{bookingContext: BookingContext; altTransfersResponse: GetAlternativeOptionsResponse}> {
        return await test.step(`Create booking with default ${options.defaultTransferType} transfer and alternative ${options.altTransferType} via Web API`, async () => {
            const allowedCommitAttempts = 2;
            let commitAttemptsCount = 1;
            let accessToken = undefined;

            let offers = await this.searhForPackages(guestsContext, holidayContext);

            if (options.defaultTransferType) {
                offers = offers.filter(
                    (o) => o.transfers.length > 0 && o.transfers[0].type === options.defaultTransferType,
                );
            } else {
                offers = offers.filter(
                    (o) => o.transfers.length > 0 && o.transfers[0].type !== options.altTransferType,
                );
            }

            if (options.isTradeAgent) {
                let response = await this.webApiClient.getAccessToken(
                    testAgentUsername,
                    testAgentPassword,
                    envConfig,
                );
                accessToken = response.access_token;
            }

            const bookingContext = new BookingContext();

            for (const offer of offers) {
                if (commitAttemptsCount > allowedCommitAttempts)
                    throw new NoTestDataException(
                        `Can't find valid booking after ${commitAttemptsCount} commit attempts`,
                    );

                const extrasResponse = await this.webApiClient.getHolidayExtras(offer);
                const altTransfer = extrasResponse.transfers.find((t) => t.type === options.altTransferType);

                if (!altTransfer) continue;

                const validateResponse = await this.webApiClient.validatePackage(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    undefined,
                    options?.isTradeAgent,
                    accessToken,
                );

                if (!validateResponse?.paymentInfo) continue;
                if (holidayContext.priceFrom && validateResponse.paymentInfo.totalPrice < holidayContext.priceFrom)
                    continue;
                if (holidayContext.priceTo && validateResponse.paymentInfo.totalPrice > holidayContext.priceTo)
                    continue;

                const bookingResponse = await this.bookOfferWithoutValidation(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    validateResponse,
                    undefined,
                    undefined,
                    options?.isTradeAgent,
                    options?.isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                    accessToken,
                );

                commitAttemptsCount++;

                if (!bookingResponse) continue;

                const altTransfersResponse = await this.webApiClient.getAmendAlternativeTransfers(
                    bookingResponse.bookingReference,
                    accessToken,
                );
                let amendAltTransfer = altTransfersResponse.transfers.alternativeTransfers?.find(
                    (t) => t.transferType === options.altAmendTransferType,
                );

                if (!amendAltTransfer) continue;

                bookingContext.offer = offer;
                bookingContext.validateResponse = validateResponse;
                bookingContext.bookingResponse = bookingResponse;

                return {bookingContext, altTransfersResponse};
            }

            throw new NoTestDataException("Can't find valid packages");
        });
    }

    async createBookingWithAltFlights(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        options?: {isTradeAgent: boolean},
    ): Promise<{bookingContext: BookingContext; validateAltFlightsResponse: ValidateFlightsResponse}> {
        return await test.step('Create booking with alternative flights via Web API', async () => {
            let allowedCommitAttempts = 2;
            let commitAttemptsCount = 0;
            let accessToken = undefined;

            let offers = await this.searhForPackages(guestsContext, holidayContext);

            if (options?.isTradeAgent) {
                let response = await this.webApiClient.getAccessToken(
                    testAgentUsername,
                    testAgentPassword,
                    envConfig,
                );
                accessToken = response.access_token;
            }

            let bookingContext = new BookingContext();

            for (let offer of offers) {
                if (commitAttemptsCount >= allowedCommitAttempts) break;

                let altFlightsResponse = await this.webApiClient.getAlternativeFlights(
                    offer,
                    holidayContext,
                    guestsContext,
                );
                let altFlightsCount = altFlightsResponse.offers.length;

                if (altFlightsCount < 1) continue;

                let validateResponse = await this.webApiClient.validatePackage(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    undefined,
                    options?.isTradeAgent,
                    accessToken,
                );

                if (!validateResponse) continue;

                let bookingResponse = await this.bookOfferWithoutValidation(
                    offer,
                    guestsContext,
                    holidayContext,
                    paymentContext,
                    validateResponse,
                    undefined,
                    undefined,
                    options?.isTradeAgent,
                    options?.isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                    accessToken,
                );

                commitAttemptsCount++;

                if (!bookingResponse) continue;

                let amendAltFlightsResponse = await this.webApiClient.getAmendAlternativeFlights(
                    bookingResponse.bookingReference,
                    accessToken,
                );

                if (
                    !amendAltFlightsResponse.flights.alternativeFlights ||
                    amendAltFlightsResponse.flights.alternativeFlights.length < 1
                )
                    continue;

                let validateAltFlightsResponse = await this.webApiClient.validateAlternativeFlights(
                    bookingResponse.bookingReference,
                    amendAltFlightsResponse,
                    accessToken,
                );

                if (!validateAltFlightsResponse) continue;

                const validFlights = validateAltFlightsResponse.validatedAlternativeFlights.filter(
                    (v) =>
                        v.routes[0].departureAirportName ===
                            amendAltFlightsResponse.flights.booking.selectedFlights.routes[0]
                                .departureAirportName &&
                        v.routes[0].arrivalAirportName ===
                            amendAltFlightsResponse.flights.booking.selectedFlights.routes[0].arrivalAirportName,
                );

                if (validFlights.length === 0) continue;

                bookingContext.offer = offer;
                bookingContext.validateResponse = validateResponse;
                bookingContext.bookingResponse = bookingResponse;

                return {bookingContext, validateAltFlightsResponse};
            }

            throw new NoTestDataException(
                `Can't find valid booking with alternative flights after ${commitAttemptsCount} commit attempts`,
            );
        });
    }

    async getAlternativeTransfers(bookingReference: string): Promise<GetAlternativeOptionsResponse> {
        return await test.step('Get alternative transfers for booking', async () => {
            const response = await this.webApiClient.getAmendAlternativeTransfers(bookingReference);
            return response;
        });
    }

    async createBookingWithSeatsSelected(
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        flightContext: FlightContext,
        options?: {isTradeAgent?: boolean},
    ): Promise<BookingContext> {
        return await test.step(
            options?.isTradeAgent
                ? 'Create Trade Portal booking with seats selected'
                : 'Create booking with seats selected',
            async () => {
                const isTradeAgent = options?.isTradeAgent === true;
                const allowedCommitAttempts = 2;
                let commitAttemptsCount = 1;

                let offers = await this.searhForPackages(guestsContext, holidayContext);
                offers = offers.filter((o) => o.transport.routes[0].isExt || o.transport.routes[1].isExt);

                let accessToken: string | undefined;
                if (isTradeAgent) {
                    const tokenResponse = await this.webApiClient.getAccessToken(
                        testAgentUsername,
                        testAgentPassword,
                        envConfig,
                    );
                    accessToken = tokenResponse.access_token;
                }

                const bookingContext = new BookingContext();

                for (const offer of offers) {
                    const seatMapValid = await this.webApiClient.areGetSeatMapRequestsValid(
                        this.webApiClient,
                        offer,
                        holidayContext,
                    );
                    if (!seatMapValid) continue;

                    await this.webApiClient.assignSeatsToGuests(
                        offer,
                        guestsContext,
                        holidayContext,
                        flightContext,
                    );

                    const validateResponse = await this.webApiClient.validatePackage(
                        offer,
                        guestsContext,
                        holidayContext,
                        paymentContext,
                        flightContext,
                        isTradeAgent,
                        accessToken,
                    );

                    if (!validateResponse?.paymentInfo) {
                        continue;
                    }

                    let bookingResponse = await this.bookOfferWithoutValidation(
                        offer,
                        guestsContext,
                        holidayContext,
                        paymentContext,
                        validateResponse,
                        flightContext,
                        undefined,
                        isTradeAgent,
                        isTradeAgent ? PaymentMethod.TradeAgent : PaymentMethod.Cash,
                        accessToken,
                    );

                    commitAttemptsCount++;

                    if (bookingResponse) {
                        bookingContext.offer = offer;
                        bookingContext.validateResponse = validateResponse;
                        bookingContext.bookingResponse = bookingResponse;
                        return bookingContext;
                    }

                    if (commitAttemptsCount > allowedCommitAttempts) {
                        throw new NoTestDataException(
                            `Can't find any valid packages after ${allowedCommitAttempts} commit attempts`,
                        );
                    }
                }

                throw new NoTestDataException("Can't find any valid packages");
            },
        );
    }

    async bookOfferWithoutValidation(
        offer: Offer,
        guestsContext: GuestsContext,
        holidayContext: HolidayContext,
        paymentContext: PaymentContext,
        validateResponse: ValidateBookingResponse,
        flightContext: FlightContext = null as any,
        specialRequests: string | null = null,
        isTradeAgent: boolean = false,
        paymentMethod: PaymentMethod = PaymentMethod.Cash,
        token?: string,
    ): Promise<BookingResponse | undefined> {
        let paymentAmount: number;

        if (isTradeAgent) {
            paymentAmount = 0;
        } else {
            paymentAmount = paymentContext.payWithDeposit
                ? validateResponse.paymentInfo?.depositPrice ?? 0
                : validateResponse.paymentInfo?.totalPrice ?? 0;
        }

        offer.price = validateResponse.paymentInfo?.totalPrice ?? 0;
        offer.pricePP = validateResponse.paymentInfo?.pricePP ?? 0;

        const commitBookingResponse = await this.webApiClient.commitOffer(
            offer,
            paymentAmount,
            holidayContext,
            guestsContext,
            paymentContext,
            specialRequests ?? '',
            isTradeAgent,
            flightContext,
            paymentMethod,
            token,
        );

        // Save booking response to JSON file
        if (commitBookingResponse) {
            this.saveBookingResponseToFile(commitBookingResponse);
        }

        return commitBookingResponse;
    }

    /**
     * Searches for a booking in the booking-responses directory that matches the provided contexts.
     * Matches bookings based on guest counts, departure date, origin airport, and destination.
     * 
     * @param guestsContext - Optional guests context to match guest counts
     * @param holidayContext - Optional holiday context to match dates and destinations
     * @param paymentContext - Optional payment context (currently not used for matching)
     * @returns An object with bookingContext property, matching the structure of createBookingWithAltFlights
     */
    async findMatchingBooking(
        guestsContext?: GuestsContext,
        holidayContext?: HolidayContext,
        paymentContext?: PaymentContext,
    ): Promise<{bookingContext: BookingContext}> {
        return await test.step('Find matching booking from saved files', async () => {
            const bookingResponsesDir = path.join(process.cwd(), 'booking-responses');
            
            if (!fs.existsSync(bookingResponsesDir)) {
                throw new NoTestDataException(
                    `Booking responses directory not found: ${bookingResponsesDir}`,
                );
            }

            // Get all booking JSON files
            const files = fs.readdirSync(bookingResponsesDir).filter((file) => 
                file.startsWith('booking-') && file.endsWith('.json')
            );

            if (files.length === 0) {
                throw new NoTestDataException('No booking files found in booking-responses directory');
            }

            // Load and check each booking file
            const matchingBookings: Array<{file: string; path: string; mtime: Date; booking: BookingResponse}> = [];

            for (const file of files) {
                try {
                    const filePath = path.join(bookingResponsesDir, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const booking: BookingResponse = JSON.parse(fileContent);
                    const stats = fs.statSync(filePath);

                    // Check if booking matches criteria
                    if (this.bookingMatchesContexts(booking, guestsContext, holidayContext)) {
                        matchingBookings.push({
                            file,
                            path: filePath,
                            mtime: stats.mtime,
                            booking,
                        });
                    }
                } catch (error) {
                    // Skip files that can't be parsed
                    console.warn(`- Skipping invalid booking file: ${file}`);
                    continue;
                }
            }

            if (matchingBookings.length === 0) {
                throw new NoTestDataException(
                    'No matching booking found in saved files. Consider creating a new booking or adjusting search criteria.',
                );
            }

            // Sort by modification time (most recent first) and get the first one
            matchingBookings.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
            const mostRecentMatch = matchingBookings[0];

            // Create BookingContext with the loaded booking response
            const bookingContext = new BookingContext();
            bookingContext.bookingResponse = mostRecentMatch.booking;
            bookingContext.offer = {} as Offer;
            bookingContext.validateResponse = {} as ValidateBookingResponse;

            console.log(`- Found matching booking ${mostRecentMatch.booking.bookingReference} from: ${mostRecentMatch.file}`);
            
            return {bookingContext};
        });
    }

    /**
     * Checks if a booking matches the provided contexts.
     * 
     * @param booking - The booking to check
     * @param guestsContext - Optional guests context to match
     * @param holidayContext - Optional holiday context to match
     * @returns True if the booking matches all provided contexts
     */
    private bookingMatchesContexts(
        booking: BookingResponse,
        guestsContext?: GuestsContext,
        holidayContext?: HolidayContext,
    ): boolean {
        // Match guest counts if guestsContext is provided
        if (guestsContext) {
            const bookingAdults = booking.guests.filter((g) => g.type === PersonType.Adult).length;
            const bookingChildren = booking.guests.filter((g) => g.type === PersonType.Child).length;
            const bookingInfants = booking.guests.filter((g) => g.type === PersonType.Infant).length;

            if (bookingAdults !== guestsContext.adults) return false;
            if (bookingChildren !== guestsContext.children) return false;
            if (bookingInfants !== guestsContext.infants) return false;
        }

        // Match holiday context if provided
        if (holidayContext) {
            // Match departure date (if provided)
            if (holidayContext.departure) {
                const bookingDeparture = new Date(booking.package.accom.startDate);
                const expectedDeparture = new Date(holidayContext.departure);
                
                // Compare dates (ignore time)
                if (
                    bookingDeparture.getFullYear() !== expectedDeparture.getFullYear() ||
                    bookingDeparture.getMonth() !== expectedDeparture.getMonth() ||
                    bookingDeparture.getDate() !== expectedDeparture.getDate()
                ) {
                    return false;
                }
            }

            // Match origin airport (if provided)
            if (holidayContext.originAirportCodes.length > 0) {
                const bookingOrigin = booking.package.transport.routes[0]?.depPt;
                if (!bookingOrigin || !holidayContext.originAirportCodes.includes(bookingOrigin)) {
                    return false;
                }
            }

            // Match destination country (if provided)
            // Parse geography to get country codes (format: "ES" or "ES,region")
            const geography = holidayContext.geography;
            if (geography) {
                const countryCode = geography.split(',')[0]; // Get first part (country code)
                if (countryCode) {
                    // Type assertion needed because BookingPackage.location type may not be explicitly typed
                    const bookingLocation = booking.package.location as any;
                    const bookingCountry = bookingLocation?.country;
                    if (!bookingCountry || bookingCountry !== countryCode) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Loads a booking from a JSON file in the booking-responses directory.
     * Finds the most recent file matching the booking reference.
     * 
     * @param bookingReference - The booking reference to load
     * @returns An object with bookingContext property, matching the structure of createBookingWithAltFlights
     */
    async loadBookingFromFile(bookingReference: string): Promise<{bookingContext: BookingContext}> {
        return await test.step(`Load booking ${bookingReference} from file`, async () => {
            const bookingResponsesDir = path.join(process.cwd(), 'booking-responses');
            
            if (!fs.existsSync(bookingResponsesDir)) {
                throw new NoTestDataException(
                    `Booking responses directory not found: ${bookingResponsesDir}`,
                );
            }

            // Find all files matching the booking reference pattern
            const files = fs.readdirSync(bookingResponsesDir);
            const matchingFiles = files.filter((file) => {
                const match = file.match(/^booking-(\d+)-/);
                return match && match[1] === bookingReference;
            });

            if (matchingFiles.length === 0) {
                throw new NoTestDataException(
                    `No booking file found for booking reference: ${bookingReference}`,
                );
            }

            // Sort files by modification time (most recent first) and get the first one
            const filePaths = matchingFiles.map((file) => ({
                name: file,
                path: path.join(bookingResponsesDir, file),
                mtime: fs.statSync(path.join(bookingResponsesDir, file)).mtime,
            }));

            filePaths.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
            const mostRecentFile = filePaths[0];

            // Read and parse the JSON file
            const fileContent = fs.readFileSync(mostRecentFile.path, 'utf-8');
            const bookingResponse: BookingResponse = JSON.parse(fileContent);

            // Create BookingContext with the loaded booking response
            // Note: offer and validateResponse are minimal stubs since they're not used
            // by changeRoomBoardPage.open() which only needs bookingResponse.bookingReference
            const bookingContext = new BookingContext();
            bookingContext.bookingResponse = bookingResponse;
            
            // Create minimal stub objects for offer and validateResponse to satisfy type requirements
            bookingContext.offer = {} as Offer;
            bookingContext.validateResponse = {} as ValidateBookingResponse;

            console.log(`- Loaded booking ${bookingReference} from: ${mostRecentFile.name}`);
            
            return {bookingContext};
        });
    }

    /**
     * Saves the booking response to a JSON file in the booking-responses directory.
     * File name format: booking-{bookingReference}-{timestamp}.json
     * 
     * @param bookingResponse - The booking response to save
     */
    private saveBookingResponseToFile(bookingResponse: BookingResponse): void {
        try {
            const bookingResponsesDir = path.join(process.cwd(), 'booking-responses');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(bookingResponsesDir)) {
                fs.mkdirSync(bookingResponsesDir, { recursive: true });
            }

            // Generate filename with booking reference and timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const bookingReference = bookingResponse.bookingReference || 'unknown';
            const filename = `booking-${bookingReference}-${timestamp}.json`;
            const filePath = path.join(bookingResponsesDir, filename);

            // Save the booking response as formatted JSON
            fs.writeFileSync(filePath, JSON.stringify(bookingResponse, null, 2), 'utf-8');
            
            console.log(`- Booking response saved to: ${filePath}`);
        } catch (error) {
            console.error('- Failed to save booking response to file:', error);
            // Don't throw error - saving to file is not critical for test execution
        }
    }

    private async searhForPackages(guestsContext: GuestsContext, holidayContext: HolidayContext) {
        const searchResponse = await this.webApiClient.searchPackages(guestsContext, holidayContext, 100, 1);
        // Exclude HBG, DI and Luxury offers. Luxury offers can't be amended
        const offers = searchResponse.offers.filter(
            (o) =>
                !o.accom.code.startsWith('X') &&
                !o.accom.code.startsWith('Z') &&
                !o.altAcc?.some((alt: {accomCode: string}) => alt.accomCode.startsWith('X')) &&
                !o.altAcc?.some((alt: {accomCode: string}) => alt.accomCode.startsWith('Z')) &&
                o.accom.prom !== 'EUBX',
        );

        if (offers.length === 0) {
            throw new NoTestDataException("Can't find any packages with required parameters.");
        }

        return offers;
    }
}
