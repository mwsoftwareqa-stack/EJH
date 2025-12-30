import type {APIRequestContext, Page} from '@playwright/test';
import {TestContext} from '../contexts/testContext';
import {AuthenticationFactory} from '../factories/authenticationFactory';
import {BookingFactory} from '../factories/bookingFactory';
import {AmendPaymentPage} from '../pages/amendPaymentPage';
import {ChangeDatesPage} from '../pages/changeDatesPage';
import {ChangeDatesSummaryPage} from '../pages/changeDatesSummaryPage';
import {ChangeFlightsPage} from '../pages/changeFlightsPage';
import {ChangeNamePage} from '../pages/changeNamePage';
import {ChangeRoomBoardPage} from '../pages/changeRoomBoardPage';
import {ChangeSeatsPage} from '../pages/changeSeatsPage';
import {ChangeSpecialRequestPage} from '../pages/changeSpecialRequestPage';
import {ChangeTransferPage} from '../pages/changeTransferPage';
import {ContactUsPage} from '../pages/contactUsPage';
import {CreateAccountPage} from '../pages/createAccountPage';
import {DualAuthorizationPage} from '../pages/dualAuthorizationPage';
import {HomePage} from '../pages/homePage';
import {LoginPage} from '../pages/loginPage';
import {ManagePage} from '../pages/managePage';
import {SSOLoginPage} from '../pages/ssoLoginPage';
import {TPFindBookingPage} from '../pages/tpFindBookingPage';
import {TradePortalConfirmationPage} from '../pages/tradePortalConfirmationPage';
import {TradePortalLoginPage} from '../pages/tradePortalLoginPage';
import {ViewBookingPage} from '../pages/viewBookingPage';
import {FlightService} from '../services/flightService';
import {WebApiClient} from '../services/webApi/webApiClient';
import {TradePortalFeedbackFormPage} from '../pages/tradePortalFeedbackFormPage';

export function createTestContext(request: APIRequestContext, page: Page): TestContext {
    const cache: Partial<TestContext> = {};
    const ctx = {} as TestContext;

    const defineLazy = <K extends keyof TestContext>(key: K, factory: () => TestContext[K]) => {
        Object.defineProperty(ctx, key, {
            get: () => {
                if (!cache[key]) {
                    cache[key] = factory();
                }
                return cache[key]!;
            },
            enumerable: true,
            configurable: false,
        });
    };

    defineLazy('amendPaymentPage', () => new AmendPaymentPage(page));
    defineLazy('authenticationFactory', () => new AuthenticationFactory(ctx.webApiClient));
    defineLazy('bookingFactory', () => new BookingFactory(ctx.webApiClient));
    defineLazy('changeFlightPage', () => new ChangeFlightsPage(page, ctx.webApiClient));
    defineLazy('changeTransferPage', () => new ChangeTransferPage(page));
    defineLazy('contactUsPage', () => new ContactUsPage(page));
    defineLazy('createAccountPage', () => new CreateAccountPage(page));
    defineLazy('loginPage', () => new LoginPage(page));
    defineLazy('viewBookingPage', () => new ViewBookingPage(page));
    defineLazy('webApiClient', () => new WebApiClient(request, page));
    defineLazy('ssoLoginPage', () => new SSOLoginPage(page));
    defineLazy('changeDatesPage', () => new ChangeDatesPage(page));
    defineLazy('homePage', () => new HomePage(page));
    defineLazy('changeSeatsPage', () => new ChangeSeatsPage(page));
    defineLazy('dualAuthorizationPage', () => new DualAuthorizationPage(page));
    defineLazy('tradePortalConfirmationPage', () => new TradePortalConfirmationPage(page));
    defineLazy('changeNamePage', () => new ChangeNamePage(page));
    defineLazy('changeRoomBoardPage', () => new ChangeRoomBoardPage(page));
    defineLazy('changeSpecialRequestPage', () => new ChangeSpecialRequestPage(page));
    defineLazy('changeDatesSummaryPage', () => new ChangeDatesSummaryPage(page));
    defineLazy('tpFindBookingPage', () => new TPFindBookingPage(page));
    defineLazy('tradePortalLoginPage', () => new TradePortalLoginPage(page));
    defineLazy('managePage', () => new ManagePage(page, ctx.webApiClient));
    defineLazy('tradePortalFeedbackFormPage', () => new TradePortalFeedbackFormPage(page));
    defineLazy('flightService', () => new FlightService(ctx.webApiClient));

    return ctx;
}
