import { LanguageConstant } from '../../../core/constants/languageConstant';

export class GuestDetailsCommonTranslations {
    static getManTitle(language: string): string {
      const translations: Record<string, string> = {
        [LanguageConstant.English]: 'Mr',
        [LanguageConstant.SwissGerman]: 'Herr',
        [LanguageConstant.SwissFrench]: 'M.',
        [LanguageConstant.French]: 'M.',
        [LanguageConstant.German]: 'Herr'
      };
      return translations[language];
    }

    static getWomanTitle(language: string): string {
      const translations: Record<string, string> = {
        [LanguageConstant.English]: 'Miss',
        [LanguageConstant.SwissGerman]: 'Frau',
        [LanguageConstant.SwissFrench]: 'Mlle',
        [LanguageConstant.French]: 'Mlle',
        [LanguageConstant.German]: 'Frau'
      };
      return translations[language];
    }
  }
