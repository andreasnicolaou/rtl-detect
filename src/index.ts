export interface ParsedLocaleInfo {
  language: string;
  countryCode?: string;
}
export type TextDirection = 'rtl' | 'ltr';

/**
 * RTL (Right-to-Left) language detection library
 * @author Andreas Nicolaou
 * @license MIT
 * @description A library for detecting RTL (Right-to-Left) languages and their text direction.
 */
export class RtlLanguageDetector {
  private static readonly REGEX_PARSE_LOCALE = /^([a-zA-Z]*)([_\-a-zA-Z]*)$/;
  // References:
  // https://help.smartling.com/hc/en-us/articles/1260802028830-Right-to-left-RTL-Languages
  // https://en.wikipedia.org/wiki/Script_(Unicode)
  // https://en.wikipedia.org/wiki/Writing_system#Directionality_and_orientation
  private static readonly RTL_LANGUAGE_CODES = Object.freeze([
    'ae', // Avestan
    'ar', // Arabic (generic)
    'arc', // Aramaic
    'bcc', // Southern Balochi
    'bqi', // Bakthiari
    'ckb', // Sorani Kurdish
    'dv', // Dhivehi
    'fa', // Persian (generic)
    'glk', // Gilaki
    'he', // Hebrew (he)
    'iw', // Hebrew (iw, legacy)
    'kd', // Kurdish (Sorani) RTL
    'ku', // Kurdish (generic)
    'mzn', // Mazanderani
    'nqo', // N'Ko
    'pk', // Panjabi-Shahmuki (generic)
    'pnb', // Western Punjabi
    'prs', // Darī
    'ps', // Pashto
    'sd', // Sindhi
    'syr', // Syriac
    'ug', // Uighur; Uyghur
    'ur', // Urdu
    'yi', // Yiddish
  ]);

  /**
   * Returns a frozen array of all supported RTL (right-to-left) language codes (ISO 639-1/2/3).
   * @returns {readonly string[]} Array of RTL language codes.
   * @memberof RtlLanguageDetector
   */
  public static getRtlLanguageCodes(): readonly string[] {
    return RtlLanguageDetector.RTL_LANGUAGE_CODES;
  }

  /**
   * Returns the text direction ('rtl' or 'ltr') for a given locale or language code.
   * @param {string} locale - The locale or language code (e.g., 'ar', 'en-US').
   * @returns {'rtl' | 'ltr'} The text direction for the locale.
   * @memberof RtlLanguageDetector
   */
  public static getTextDirection(locale: string): TextDirection {
    return RtlLanguageDetector.isRtlLanguage(locale) ? 'rtl' : 'ltr';
  }

  /**
   * Determines if a locale or language code is right-to-left (RTL).
   * @param {string} locale - The locale or language code (e.g., 'ar', 'fa-IR').
   * @returns {boolean} True if the language is RTL, false otherwise.
   * @memberof RtlLanguageDetector
   */
  public static isRtlLanguage(locale: string): boolean {
    const parsed = RtlLanguageDetector.parseLocale(locale);
    if (!parsed) {
      return false;
    }
    return RtlLanguageDetector.RTL_LANGUAGE_CODES.includes(parsed.language);
  }

  /**
   * Parses a locale string into its language and country code.
   * @param {string} locale - The locale string (e.g., 'en-US', 'ar_EG').
   * @returns {ParsedLocaleInfo | undefined} An object with `lang` and optional `countryCode`, or undefined if invalid.
   * @memberof RtlLanguageDetector
   */
  public static parseLocale(locale: string): ParsedLocaleInfo | undefined {
    if (!locale) {
      return undefined;
    }
    const matches = RtlLanguageDetector.REGEX_PARSE_LOCALE.exec(locale);
    if (!matches) {
      return undefined;
    }
    const language = (matches[1] || '').toLowerCase();
    const rawCountryCode = matches[2] || '';
    const countryCode = rawCountryCode.replace(/[-_]/g, '').toUpperCase() || undefined;
    return {
      language,
      countryCode,
    };
  }
}

export const parseLocale = RtlLanguageDetector.parseLocale;
export const isRtlLanguage = RtlLanguageDetector.isRtlLanguage;
export const getTextDirection = RtlLanguageDetector.getTextDirection;
export const getRtlLanguageCodes = RtlLanguageDetector.getRtlLanguageCodes;
