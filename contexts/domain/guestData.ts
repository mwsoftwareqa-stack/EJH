import { faker } from '@faker-js/faker';

import { PersonType } from '../../core/enums/personType';
import { GuestDetailsCommonTranslations } from '../translations/commonTranslations/guestDetailsCommonTranslations';

export interface GuestData {
    title: string;
    guestType: PersonType;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    age: number;
    isSurnameTheSame?: boolean;
    isLead?: boolean;
  }

  export function createAdult(language = 'English'): GuestData {
    const age = faker.number.int({min: 18, max: 80})
    return {
      guestType: PersonType.Adult,
      title: getRandomTitle(language),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: getDateOfBirth(age),
      age,
      isLead: false
    };
  }

  export function createChild(age: number, language = 'English'): GuestData {
    return {
      guestType: PersonType.Child,
      title: getRandomTitle(language),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: getDateOfBirth(age),
      age,
      isSurnameTheSame: true
    };
  }

  export function createInfant(language = 'English'): GuestData {
    const age = faker.number.int({min: 0, max: 1})
    return {
      guestType: PersonType.Infant,
      title: getRandomTitle(language),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: getDateOfBirth(age),
      age,
      isSurnameTheSame: true
    };
  }

  export function getDateOfBirth(age: number): Date {
    const today = new Date();
    const dob = new Date(today);
    dob.setFullYear(today.getFullYear() - age);
    dob.setDate(dob.getDate() - faker.number.int({min: 0, max: 30}));
    return dob;
  }

  function getRandomTitle(language: string = 'English'): string {
    const manTitle = GuestDetailsCommonTranslations.getManTitle(language);
    const womanTitle = GuestDetailsCommonTranslations.getWomanTitle(language);

    return Math.random() > 0.5 ? manTitle : womanTitle;
  }
