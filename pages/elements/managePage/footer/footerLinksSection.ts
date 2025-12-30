import test, {Locator, Page} from '@playwright/test';
import {
    shouldBeFalse,
    shouldBeTrue,
    shouldHaveExactNumberOfElements,
    stringArraysShouldBeEqual,
    textShouldBe,
    textShouldContain,
} from '../../../../helpers/assertionHelper';
import {PageWidget} from '../../../core/pageWidget';
import {MobileFooterLinkBlock} from './mobileFooterLinkBlock';

export class FooterLinksSection extends PageWidget {
    private readonly exploreMoreLabel: Locator;
    private readonly footerLinkButtons: Locator;
    private readonly expandedSectionTitle: Locator;
    private readonly expandSectionButtonMobile: Locator;

    private mobileFooterLinkBlocks: MobileFooterLinkBlock[] = [];

    constructor(page: Page, selector: string, isSelector: boolean) {
        super(page, selector, {isSelector: isSelector});
        this.exploreMoreLabel = this.findInsideByTestId('explore-more-label');
        this.footerLinkButtons = this.findInsideByTestId('footer-link-button');
        this.expandedSectionTitle = this.findInsideByTestId('footer-active-tab-title');
        this.expandSectionButtonMobile = this.findInsideByTestId('collapsible-trigger-button');
    }

    async expandMobileFooterSection() {
        await test.step('Expand mobile footer section', async () => {
            await this.expandSectionButtonMobile.click();
        });
    }

    async expandFooterLink(buttonName: string) {
        await test.step(`Expand footer link "${buttonName}"`, async () => {
            if (!(await this.isFooterLinkButtonPressed(buttonName))) {
                const count = await this.footerLinkButtons.count();

                for (let i = 0; i < count; i++) {
                    const button = this.footerLinkButtons.nth(i);
                    const buttonText = await button.textContent();

                    if (buttonText?.trim() === buttonName) {
                        await button.click();
                        return;
                    }
                }

                throw new Error(`Footer link button with name "${buttonName}" not found`);
            }
        });
    }

    async shouldBeExpanded(sectionName: string) {
        await test.step(`Footer section should be expanded: "${sectionName}"`, async () => {
            await textShouldBe(this.expandedSectionTitle, sectionName);
            await shouldBeTrue(await this.isFooterLinkButtonPressed(sectionName));
        });
    }

    async shouldBeCollapsed(sectionName: string) {
        await test.step(`Footer section should be collapsed: "${sectionName}"`, async () => {
            await shouldBeFalse(await this.isFooterLinkButtonPressed(sectionName));
        });
    }

    async mobileFooterSectionShouldBeCollapsed() {
        await test.step('Mobile footer section should be collapsed', async () => {
            await shouldBeFalse(await this.isExpandSectionButtonMobileExpanded());
        });
    }

    async mobileFooterSectionShouldBeExpanded() {
        await test.step('Mobile footer section should be expanded', async () => {
            await shouldBeTrue(await this.isExpandSectionButtonMobileExpanded());
        });
    }

    async assertFooterLinks(expanded: string, sectionsInOrder: string[]) {
        for (const name of sectionsInOrder) {
            if (name === expanded) {
                await this.shouldBeExpanded(name);
            } else {
                await this.shouldBeCollapsed(name);
            }
        }
    }

    async mobileFooterBlockTitlesShouldBe(expectedMobileFooterBlockTitles: string[]) {
        await test.step(`Mobile footer block titles should be: ${expectedMobileFooterBlockTitles.join(
            ', ',
        )}`, async () => {
            const actualTitles = await this.getAllMobileFooterLinkBlockTitles();
            await stringArraysShouldBeEqual(actualTitles, expectedMobileFooterBlockTitles);
        });
    }

    async exploreMoreLabelShouldContainText(text: string) {
        await textShouldContain(this.exploreMoreLabel, text, undefined);
    }

    async amountOfFooterLinkButtonsShouldBe(expectedCount: number) {
        await shouldHaveExactNumberOfElements(this.footerLinkButtons, expectedCount);
    }

    async footerLinkButtonsShouldNotBePressed() {
        const count = await this.footerLinkButtons.count();

        for (let i = 0; i < count; i++) {
            const button = this.footerLinkButtons.nth(i);
            const pressed = await button.getAttribute('aria-pressed');

            await shouldBeFalse(pressed === 'true');
        }
    }

    private async getMobileFooterLinkBlocks(): Promise<MobileFooterLinkBlock[]> {
        if (this.mobileFooterLinkBlocks.length === 0) {
            this.mobileFooterLinkBlocks = await this.findAllInsidePageWidgets(
                MobileFooterLinkBlock,
                'mobile-footer-link-block',
            );
        }

        return this.mobileFooterLinkBlocks;
    }

    private async isFooterLinkButtonPressed(buttonName: string): Promise<boolean> {
        const count = await this.footerLinkButtons.count();

        for (let i = 0; i < count; i++) {
            const button = this.footerLinkButtons.nth(i);
            const buttonText = await button.textContent();

            if (buttonText?.trim() === buttonName) {
                const pressed = await button.getAttribute('aria-pressed');
                return pressed === 'true';
            }
        }

        throw new Error(`Footer link button with name "${buttonName}" not found`);
    }

    private async isExpandSectionButtonMobileExpanded(): Promise<boolean> {
        const expanded = await this.expandSectionButtonMobile.getAttribute('aria-expanded');
        return expanded === 'true';
    }

    private async getAllMobileFooterLinkBlockTitles(): Promise<string[]> {
        const blocks = await this.getMobileFooterLinkBlocks();
        const titles: string[] = [];

        for (const block of blocks) {
            const title = await block.getTitleText();
            titles.push(title);
        }

        return titles;
    }
}
