import * as allure from 'allure-js-commons';
import fs from 'fs';
import fetch from 'node-fetch';

import {TestInfo} from '@playwright/test';
import {BookingContext} from '../contexts/bookingContext';
import {GuestsContext} from '../contexts/guestsContext';

type AutomationBuild = {
    name: string;
    hashed_id: string;
};

type AutomationSession = {
    hashed_id: string;
    name: string;
};

type BuildResponse = {
    automation_build: AutomationBuild;
};

type SessionResponse = {
    automation_session: AutomationSession;
};

export async function attachBrowserStackSession(testInfo: TestInfo) {
    const username = process.env.BROWSERSTACK_USERNAME!;
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY!;
    const buildName = process.env.BS_BUILD_NAME;

    if (!buildName) return;

    const authHeader = 'Basic ' + Buffer.from(`${username}:${accessKey}`).toString('base64');

    const buildsRes = await fetch('https://api.browserstack.com/automate/builds.json', {
        headers: {Authorization: authHeader},
    });

    const builds = (await buildsRes.json()) as BuildResponse[];

    const matchedBuild = builds.find((b) => b.automation_build.name === buildName);

    if (!matchedBuild) {
        console.warn(`No build found with name "${buildName}".`);
        return;
    }

    const buildId = matchedBuild.automation_build.hashed_id;

    const sessionsRes = await fetch(
        `https://api.browserstack.com/automate/builds/${buildId}/sessions.json?limit=500`,
        {
            headers: {Authorization: authHeader},
        },
    );

    const sessions = (await sessionsRes.json()) as SessionResponse[];

    const session = sessions.find(
        (s) => s.automation_session.name === `${testInfo.title} - ${testInfo.project.name}`,
    );
    const sessionId = session?.automation_session?.hashed_id;

    if (!sessionId) {
        console.warn('No session found in the build.');
        return;
    }

    const sessionOverviewUrl = `https://automate.browserstack.com/sessions/${sessionId}`;

    allure.link(sessionOverviewUrl, 'View on BrowserStack');
}

export async function attachScreenshotToAllure(screenshotPath: string) {
    if (!fs.existsSync(screenshotPath)) {
        console.warn(`Screenshot not found at path: ${screenshotPath}`);
        return;
    }

    const buffer = fs.readFileSync(screenshotPath);
    allure.attachment('Screenshot', buffer, 'image/png');
}

export async function attachBugTag(issueNumber: string) {
    await allure.issue(`https://easyjet.atlassian.net/browse/${issueNumber}`, issueNumber);
}

export async function attachClickUpTag(issueNumber: string) {
    await allure.issue(`https://app.clickup.com/t/2553597/${issueNumber}`, issueNumber);
}

export async function attachBookingDetails(guestsContext: GuestsContext, bookingContext: BookingContext) {
    const data = {
        email: guestsContext.leadPassenger.email,
        password: guestsContext.leadPassenger.password,
        surname: guestsContext.leadPassenger.lastName,
        depDate: bookingContext.bookingResponse.bookingDate,
        bookingRef: bookingContext.bookingResponse.bookingReference,
    };

    allure.attachment('Booking Context', JSON.stringify(data, null, 2), 'application/json');
}
