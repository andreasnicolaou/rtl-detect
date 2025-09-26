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
    'pk-PK', // Panjabi-Shahmuki (Pakistan)
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
   * Auto-detects the user's preferred locale using multiple strategies, in order:
   * 1. `navigator.languages[0]` (if available, browser only)
   * 2. `navigator.language` (browser only)
   * 3. Legacy IE properties: `navigator.userLanguage` or `navigator.browserLanguage` or `navigator.systemLanguage`
   * 4. `Intl.DateTimeFormat().resolvedOptions().locale` (cross-platform, may throw)
   * 5. `<html lang="">` attribute (browser only)
   * 6. Returns an empty string if no locale can be detected
   * This method is robust across browsers and Node.js. It will not throw if a step fails; it will fall back to the next available method.
   * @returns {string} The detected locale string (e.g., 'en-US', 'ar', etc.), or an empty string if none found.
   * @memberof RtlLanguageDetector
   */
  public static detectLocale(): string {
    if (typeof navigator !== 'undefined') {
      if (navigator.languages?.length) return navigator.languages[0];
      if (navigator.language) return navigator.language;
      // Legacy IE props
      const legacyLang =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any)?.['userLanguage'] ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any)?.['browserLanguage'] ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any)?.['systemLanguage'];
      if (legacyLang) return legacyLang;
    }

    // Try Intl API
    try {
      const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      if (intlLocale) return intlLocale;
    } catch {
      /* empty */
    }

    // Try: <html lang="">
    if (typeof document !== 'undefined') {
      const htmlLang = document.documentElement?.lang;
      if (htmlLang) return htmlLang;
    }

    return '';
  }

  /**
   * Auto-detects the user's preferred text direction ('rtl' or 'ltr').
   * @returns {'rtl' | 'ltr'} The detected text direction for the current environment.
   * @memberof RtlLanguageDetector
   */
  public static detectTextDirection(): TextDirection {
    const locale = RtlLanguageDetector.detectLocale();
    return RtlLanguageDetector.getTextDirection(locale);
  }

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

// Detects the user's preferred text direction and locale
export const detectTextDirection = RtlLanguageDetector.detectTextDirection;
export const detectLocale = RtlLanguageDetector.detectLocale;
