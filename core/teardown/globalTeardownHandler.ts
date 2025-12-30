import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {stopLocal} from '../../helpers/browserstackHelper';
import {FailedTestInfo} from './failedTestInfo';
import {TestResult} from './testResult';

export class GlobalTeardownHandler {
    private readonly allureDir: string;
    private readonly rerunInProgressFlag = 'PLAYWRIGHT_RERUN_IN_PROGRESS';
    private readonly rerunErrorMessages = ['NoTestDataException'];

    constructor() {
        this.allureDir = path.join(process.cwd(), 'allure-results');
    }

    isRerunInProgress(): boolean {
        return process.env[this.rerunInProgressFlag] === 'true';
    }

    async performCleanup(): Promise<void> {
        if (process.env.USE_BROWSERSTACK_LOCAL === 'true') {
            console.log('BrowserStack Local is enabled. Attempting to stop BrowserStack Local...');
            try {
                await stopLocal();
                console.log('BrowserStack Local stopped successfully.');
            } catch (error) {
                console.error('Error stopping BrowserStack Local:', error);
            }
        } else {
            console.log('BrowserStack Local is not enabled. Skipping stopLocal.');
        }

        await this.runUpdateScript();
    }

    async runUpdateScript(): Promise<void> {
        const rootDir = process.cwd();
        console.log(`Root directory: ${rootDir}`);
        const scriptPath = path.join(rootDir, 'scripts/updateAllureResults.cjs');
        console.log(`Executing Allure results update script: ${scriptPath}`);

        try {
            execSync(`node "${scriptPath}"`, {stdio: 'inherit'});
            console.log('Allure results updated successfully.');
        } catch (error) {
            console.error('Error executing Allure results update script:', error);
        }
    }

    getFailedTestsToRerun(): FailedTestInfo[] {
        const files = fs.readdirSync(this.allureDir).filter((f) => f.endsWith('-result.json'));
        const failedTests: FailedTestInfo[] = [];
        const foundErrors = new Set<string>();

        for (const file of files) {
            const data: TestResult = JSON.parse(fs.readFileSync(path.join(this.allureDir, file), 'utf8'));

            if (this.shouldTestsBeRerun(data)) {
                failedTests.push({
                    testName: data.name,
                    projectName: data.parameters[0].value,
                });

                // Track which errors were found
                if (data.statusDetails?.message) {
                    this.rerunErrorMessages.forEach((errorMsg) => {
                        if (data.statusDetails!.message!.includes(errorMsg)) {
                            foundErrors.add(errorMsg);
                        }
                    });
                }
            }
        }

        // Store found errors for use in logging
        (failedTests as any).foundErrors = Array.from(foundErrors);
        return failedTests;
    }

    shouldTestsBeRerun(testResult: TestResult): boolean {
        return (
            testResult.status === 'failed' &&
            !!testResult.statusDetails?.message &&
            this.rerunErrorMessages.some((errorMsg) => testResult.statusDetails!.message!.includes(errorMsg))
        );
    }

    async rerunFailedTests(failedTests: FailedTestInfo[]): Promise<void> {
        if (!process.env.BS_BUILD_NAME) return;

        // Set flag to prevent infinite reruns
        process.env[this.rerunInProgressFlag] = 'true';

        const uniqueTests = [...new Set(failedTests.map((test) => test.testName))];
        const projectName = failedTests[0].projectName;
        const testPattern = uniqueTests.map((testName) => testName.replace(/"/g, '\\"')).join('|');

        const foundErrors = (failedTests as any).foundErrors || [];
        console.log(`Rerunning tests due to errors: ${foundErrors.join(', ')}`);
        console.log(uniqueTests);
        console.log(`Project: ${projectName}`);

        const command = `npx playwright test --project="${projectName}" --grep="${testPattern}"`;
        console.log(`Running command: ${command}`);

        try {
            execSync(command, {
                stdio: 'inherit',
                env: {...process.env, [this.rerunInProgressFlag]: 'true'},
            });
        } finally {
            // Reset flag after rerun completes
            delete process.env[this.rerunInProgressFlag];
        }
    }
}
