import {EnvironmentName} from '../types/environmentName';
import {EnvironmentConfig} from './environmentConfig';

export const ENV_CONFIG: Record<EnvironmentName, EnvironmentConfig> = {
    uat2: {
        baseUrl: 'https://uat2.webdev.ejholidays.ejcloud.net',
        redHat: {
            url: 'https://ejh-identity-dev-int.shareddev.ejholidays.ejcloud.net',
            clientId: 'trade-portal-dev',
        },
    },
    ppd: {
        baseUrl: 'https://test.easyjet.com',
        redHat: {
            url: 'https://identity.holidays.test.easyjet.com',
            clientId: 'trade-portal-test',
        },
    },
};
