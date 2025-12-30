import { faker } from '@faker-js/faker';

import { PersonType } from '../../core/enums/personType';
import { getEnvVarOrDefault } from '../../helpers/envVariablesHelper';
import { getDateOfBirth, GuestData } from '../domain/guestData';

export interface LeadGuestData extends GuestData {
    email: string;
    phone: string;
    address: string;
    address2: string;
    town: string;
    postcode: string;
    dialingCode: string;
    countryCode: string;
    country: string;
    password: string;
    easyJetMailingFlag: boolean;
    thirdPartyMailingFlag?: boolean;
}

export function createLeadPassenger(): LeadGuestData {
    const age = faker.number.int({min:20, max: 80});
    
    // Get email configuration from environment variables with defaults
    const emailPrefix = getEnvVarOrDefault('TEST_EMAIL_PREFIX', 'qa-auto-test');
    const emailDomain = getEnvVarOrDefault('TEST_EMAIL_DOMAIN', 'test.com');
    
    // Check if both env vars are explicitly set (not using defaults)
    const isEmailConfigured = process.env['TEST_EMAIL_PREFIX'] && process.env['TEST_EMAIL_DOMAIN'];
    
    // If both env vars are set, use email without faker number; otherwise include random number for uniqueness
    const email = isEmailConfigured 
        ? `${emailPrefix}@${emailDomain}`
        : `${emailPrefix}-${faker.number.int()}@${emailDomain}`;
    
    // Get password from environment variable with default
    const password = getEnvVarOrDefault('TEST_USER_PASSWORD', 'Password100%');
    
    return {
      guestType: PersonType.Adult,
      isLead: true,
      title: 'Mr',
      firstName: 'Test',
      lastName: 'Tester',
      age,
      dateOfBirth: getDateOfBirth(age),
      email,
      phone: `${faker.number.int({min: 100, max: 99999999})}`,
      address: 'Capability Green',
      address2: `apt ${faker.number.int({min: 1, max: 1000})}`,
      dialingCode: '44',
      countryCode: 'GBR',
      country: 'United Kingdom',
      town: 'Luton',
      postcode: 'LU1 3GG',
      password,
      easyJetMailingFlag: true
    };
}
