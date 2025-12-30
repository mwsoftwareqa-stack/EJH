import test, {Locator, Page, TestInfo} from '@playwright/test';
import {BookingContext} from '../contexts/bookingContext';
import {GuestsContext} from '../contexts/guestsContext';
import {textShouldContain} from '../helpers/assertionHelper';
import {isMobileBrowser} from '../helpers/testInfoHelper';
import {BasePage} from './core/basePage';
import {AmendHeroBanner} from './elements/common/amendHeroBanner';
import {ChangeBasketFooter} from './elements/common/changeBasketFooter';
import {ChangeFeesBanner} from './elements/common/changeFeesBanner';
import {InformationBanner} from './elements/common/informationBanner';
import {BoardList} from './elements/changeRoomBoardPage/boardList';
import {RoomBoardSummaryBar} from './elements/changeRoomBoardPage/roomBoardSummaryBar';
import {RoomList} from './elements/changeRoomBoardPage/roomList';

export class ChangeRoomBoardPage extends BasePage {
    private readonly heroBannerDescription: Locator;
    private readonly confirmButton: Locator;
    private readonly closeButton: Locator;

    public readonly heroBanner: AmendHeroBanner;
    public readonly informationBanner: InformationBanner;
    public readonly changeFeesBanner: ChangeFeesBanner;
    public readonly boardList: BoardList;
    public readonly roomList: RoomList;
    public readonly summaryBar: RoomBoardSummaryBar;
    public readonly basketFooter: ChangeBasketFooter;

    constructor(page: Page) {
        super(page);
        this.heroBannerDescription = this.page.getByTestId('hero-banner-description');
        this.confirmButton = this.page.getByTestId('confirm-RoomAndBoard-button');
        this.closeButton = this.page.getByRole('button', {name: 'Close'});

        this.heroBanner = new AmendHeroBanner(page, 'hero-banner');
        this.informationBanner = new InformationBanner(
            page,
            "(//p[@data-testid='hero-banner-description']//following::div[@data-testid='collapsible-container'])[1]",
            true,
        );
        this.changeFeesBanner = new ChangeFeesBanner(page, 'change-fees-banner', false);
        this.boardList = new BoardList(page, '[data-test-id="change-board-list"]', {isSelector: true});
        this.roomList = new RoomList(page, '[data-test-id="change-rooms-list"]', {isSelector: true});
        this.summaryBar = new RoomBoardSummaryBar(page, 'summary-bar');
        this.basketFooter = new ChangeBasketFooter(page, 'basket-static-footer');

        this.pagePath = '/change-room-and-board';
    }

    async open(bookingContext: BookingContext, guestsContext: GuestsContext) {
        await test.step('Open Change Room & Board page', async () => {
            await this.goToUrl(`/manage/${bookingContext.bookingResponse.bookingReference}/change-room-and-board`);
            await this.waitUntilShimmerDisappears();
        });
    }

    async shouldBeOpened() {
        await test.step('Change Room & Board page should be opened', async () => {
            await this.boardList.shouldBeDisplayed();
            await this.roomList.shouldBeDisplayed();
            await this.pageUrlShouldBeOpened();
        });
    }

    async heroBannerDescriptionShouldContainText(text: string) {
        await test.step(`Hero banner description should contain: ${text}`, async () => {
            await textShouldContain(this.heroBannerDescription, text);
        });
    }

    async expandInformationBanner() {
        await test.step('Expand information banner', async () => {
            await this.informationBanner.expand();
        });
    }

    async informationBannerShouldContainText(text: string) {
        await test.step(`Information banner should contain: ${text}`, async () => {
            await this.informationBanner.infoBannerShouldBeDisplayedOnChangePageWithState({
                state: 'open',
                description: text,
            });
        });
    }

    async clickBoardByPrice(priceText: string) {
        await test.step(`Click board with price: ${priceText}`, async () => {
            await this.boardList.clickBoardByPrice(priceText);
            await this.waitUntilShimmerDisappears();
            // Wait for network to be idle to ensure price updates are complete
            await this.page.waitForLoadState('networkidle');
        });
    }

    async clickRoomByPrice(priceText: string) {
        await test.step(`Click room with price: ${priceText}`, async () => {
            await this.roomList.clickRoomByPrice(priceText);
            await this.waitUntilShimmerDisappears();
            // Wait for network to be idle to ensure price updates are complete
            await this.page.waitForLoadState('networkidle');
        });
    }

    async selectFirstAvailableBoard(): Promise<string> {
        let boardText: string = '';
        await test.step('Select first available board option', async () => {
            boardText = await this.boardList.selectFirstAvailableBoard();
            await this.waitUntilShimmerDisappears();
            // Wait for network to be idle to ensure price updates are complete
            await this.page.waitForLoadState('networkidle');
        });
        return boardText;
    }

    async selectFirstAvailableRoom(): Promise<string> {
        let roomText: string = '';
        await test.step('Select first available room option', async () => {
            roomText = await this.roomList.selectFirstAvailableRoom();
            await this.waitUntilShimmerDisappears();
            // Wait for network to be idle to ensure price updates are complete
            await this.page.waitForLoadState('networkidle');
        });
        return roomText;
    }

    async clickSeeAlternativeRoomsButton() {
        await test.step('Click See alternative rooms button', async () => {
            const button = this.page.getByRole('button', {name: 'See alternative rooms'});
            await this.click(button);
            await this.waitUntilShimmerDisappears();
        });
    }

    async clickConfirmButton(testInfo: TestInfo) {
        await test.step('Click Confirm button on Change Room & Board page', async () => {
            if (isMobileBrowser(testInfo)) {
                await this.basketFooter.clickContinueButton();
            } else {
                await this.confirmButton.click();
            }
            await this.waitUntilShimmerDisappears();
        });
    }

    async summaryBarShouldDisplayPrice(price: string) {
        await test.step(`Summary bar should display price: ${price}`, async () => {
            await this.summaryBar.shouldDisplayPrice(price);
        });
    }

    async getSummaryBarPrice(): Promise<string> {
        let price: string = '';
        await test.step('Get current price from summary bar', async () => {
            price = await this.summaryBar.getCurrentPrice();
        });
        return price;
    }

    async confirmationModalShouldBeVisible() {
        await test.step('Confirmation modal should be visible', async () => {
            await this.closeButton.waitFor({state: 'visible'});
        });
    }

    async confirmationModalShouldContainPrice(price: string) {
        await test.step(`Confirmation modal should contain price: ${price}`, async () => {
            await textShouldContain(this.page.locator('section'), price);
        });
    }

    async confirmationModalShouldContainRoomDetails(roomDetails: string) {
        await test.step(`Confirmation modal should contain room details: ${roomDetails}`, async () => {
            await textShouldContain(this.page.locator('section'), roomDetails);
        });
    }

    async confirmationModalShouldContainBoardDetails(boardDetails: string) {
        await test.step(`Confirmation modal should contain board details: ${boardDetails}`, async () => {
            await textShouldContain(this.page.locator('section'), boardDetails);
        });
    }

    async getConfirmationModalPrice(): Promise<string> {
        let price: string = '';
        await test.step('Get price from confirmation modal', async () => {
            const section = this.page.locator('section');
            await section.waitFor({state: 'visible'});
            const text = await section.textContent();
            if (!text) {
                throw new Error('Could not get confirmation modal text');
            }
            // Extract price using regex (format: £XXX.XX)
            const priceMatch = text.match(/£[\d,]+\.?\d*/);
            if (!priceMatch) {
                throw new Error('Could not extract price from confirmation modal');
            }
            price = priceMatch[0];
        });
        return price;
    }

    async getConfirmationModalRoomDetails(): Promise<string> {
        let roomDetails: string = '';
        await test.step('Get room details from confirmation modal', async () => {
            const section = this.page.locator('section');
            await section.waitFor({state: 'visible'});
            // Look for "Room X:" pattern
            const roomText = await section.locator('text=/Room \\d+:/').textContent();
            if (!roomText) {
                throw new Error('Could not get room details from confirmation modal');
            }
            roomDetails = roomText.trim();
        });
        return roomDetails;
    }

    async getConfirmationModalBoardDetails(): Promise<string> {
        let boardDetails: string = '';
        await test.step('Get board details from confirmation modal', async () => {
            const section = this.page.locator('section');
            await section.waitFor({state: 'visible'});
            // Look for board types (Half Board, Full Board, etc.)
            const boardText = await section
                .locator('text=/Half Board|Full Board|All Inclusive|Bed & Breakfast/')
                .first()
                .textContent();
            if (!boardText) {
                throw new Error('Could not get board details from confirmation modal');
            }
            boardDetails = boardText.trim();
        });
        return boardDetails;
    }

    async clickContinueInConfirmationModal() {
        await test.step('Click Continue button in confirmation modal', async () => {
            const continueButton = this.page.getByRole('button', {name: 'Continue'});
            await this.click(continueButton);
            await this.waitUntilShimmerDisappears();
        });
    }
}
