import test, {Locator, Page} from '@playwright/test';

import {LeadGuestData} from '../../../contexts/domain/leadGuestData';
import {PageWidget} from '../../core/pageWidget';

export class CreateAccountForm extends PageWidget {
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly titleDropdown: Locator;
    private readonly titleMrsOption: Locator;
    private readonly firstNameField: Locator;
    private readonly surnameField: Locator;
    private readonly addressField: Locator;
    private readonly address2Field: Locator;
    private readonly townField: Locator;
    private readonly postCodeField: Locator;
    private readonly mobileNumberField: Locator;
    private readonly airport1Dropdown: Locator;
    private readonly bristolAirport: Locator;
    private readonly airport2Dropdown: Locator;
    private readonly jerseyAirport: Locator;
    private readonly airport3Dropdown: Locator;
    private readonly glasgowAirport: Locator;
    private readonly noOption: Locator;
    private readonly registerNowButton: Locator;

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector});
        this.emailField = this.findInside('#customer-email');
        this.passwordField = this.findInside('#customer-password');
        this.titleDropdown = this.findInside('#customer-title');
        this.titleMrsOption = this.findInsideByText('div[class*="option"]', 'Mrs');
        this.firstNameField = this.findInside('#customer-firstName');
        this.surnameField = this.findInside('#customer-lastName');
        this.addressField = this.findInside('#customer-address1');
        this.address2Field = this.findInside('#customer-address2');
        this.townField = this.findInside('#customer-city');
        this.postCodeField = this.findInside('#customer-postalCode');
        this.mobileNumberField = this.findInside('#customer-mobilePhone');
        this.airport1Dropdown = this.findInside('#customer-airport1');
        this.bristolAirport = this.findInsideByText('div[class*="option"]', 'Bristol');
        this.airport2Dropdown = this.findInside('#customer-airport2');
        this.jerseyAirport = this.findInsideByText('div[class*="option"]', 'Jersey');
        this.airport3Dropdown = this.findInside('#customer-airport3');
        this.glasgowAirport = this.findInsideByText('div[class*="option"]', 'Glasgow');
        this.noOption = this.findInside("[data-tid='no-option']");
        this.registerNowButton = this.findInside('.create-account__submit button');
    }

    async clickRegisterNowButton() {
        await test.step('Click Register button in Create Account form', async () => {
            await this.registerNowButton.click();
        });
    }

    async clickNoOption() {
        await test.step('Click No option in Create Account form', async () => {
            await this.noOption.click();
        });
    }

    async setGuestDetails(guestData: LeadGuestData) {
        await test.step('Set Guest Details data on Create Account page', async () => {
            await this.emailField.fill(guestData.email);
            await this.passwordField.fill(guestData.password);
            // Title dropdown selection
            await this.titleDropdown.click();
            await this.titleMrsOption.click();
            await this.firstNameField.fill(guestData.firstName);
            await this.surnameField.fill(guestData.lastName);
            await this.addressField.fill(guestData.address);
            await this.address2Field.fill(guestData.address2);
            await this.townField.fill(guestData.town);
            await this.postCodeField.fill(guestData.postcode);
            await this.mobileNumberField.fill(guestData.phone);
        });
    }

    async setAirports() {
        await test.step('Set airports on Create Account page', async () => {
            // Select Bristol airport
            await this.airport1Dropdown.click();
            await this.bristolAirport.click();
            // Select Jersey airport
            await this.airport2Dropdown.click();
            await this.jerseyAirport.click();
            // Select Glasgow airport
            await this.airport3Dropdown.click();
            await this.glasgowAirport.click();
        });
    }
}
