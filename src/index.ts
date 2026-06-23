export interface ParsedLocaleInfo {
  language: string;
  script?: string;
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
  // Language subtag: 2-8 letters (ISO 639-1/2/3, with room for registered subtags).
  private static readonly REGEX_LANGUAGE = /^[a-zA-Z]{2,8}$/;
  // Region subtag: 2-3 letters (ISO 3166-1 alpha-2/3) or 3 digits (UN M.49).
  private static readonly REGEX_REGION = /^([a-zA-Z]{2,3}|\d{3})$/;
  // Script subtag: exactly 4 letters (ISO 15924), e.g. Arab, Hebr.
  private static readonly REGEX_SCRIPT = /^[a-zA-Z]{4}$/;
  // References:
  // https://help.smartling.com/hc/en-us/articles/1260802028830-Right-to-left-RTL-Languages
  // https://en.wikipedia.org/wiki/Script_(Unicode)
  // https://en.wikipedia.org/wiki/Writing_system#Directionality_and_orientation
  private static readonly RTL_LANGUAGE_CODES = new Set([
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
    'ku', // Kurdish (generic)
    'mzn', // Mazanderani
    'nqo', // N'Ko
    'pnb', // Western Punjabi
    'prs', // Darī
    'ps', // Pashto
    'sd', // Sindhi
    'syr', // Syriac
    'ug', // Uighur; Uyghur
    'ur', // Urdu
    'yi', // Yiddish
  ]);

  // RTL scripts (ISO 15924). A locale carrying one of these script subtags is
  // right-to-left regardless of its base language (e.g. az-Arab, pa-Arab).
  private static readonly RTL_SCRIPT_CODES = new Set([
    'Adlm', // Adlam
    'Arab', // Arabic
    'Aran', // Arabic (Nastaliq variant)
    'Armi', // Imperial Aramaic
    'Avst', // Avestan
    'Chrs', // Chorasmian
    'Elym', // Elymaic
    'Hatr', // Hatran
    'Hebr', // Hebrew
    'Mand', // Mandaic
    'Mani', // Manichaean
    'Mend', // Mende Kikakui
    'Narb', // Old North Arabian
    'Nbat', // Nabataean
    'Nkoo', // N'Ko
    'Orkh', // Old Turkic
    'Ougr', // Old Uyghur
    'Palm', // Palmyrene
    'Phli', // Inscriptional Pahlavi
    'Phlp', // Psalter Pahlavi
    'Phnx', // Phoenician
    'Prti', // Inscriptional Parthian
    'Rohg', // Hanifi Rohingya
    'Samr', // Samaritan
    'Sarb', // Old South Arabian
    'Sogd', // Sogdian
    'Sogo', // Old Sogdian
    'Syrc', // Syriac
    'Thaa', // Thaana
    'Yezi', // Yezidi
  ]);

  /**
   * Returns a frozen array of all supported RTL (right-to-left) language codes (ISO 639-1/2/3).
   * @returns {readonly string[]} Array of RTL language codes.
   * @memberof RtlLanguageDetector
   */
  public static getRtlLanguageCodes(): readonly string[] {
    return Object.freeze(Array.from(RtlLanguageDetector.RTL_LANGUAGE_CODES));
  }

  /**
   * Returns a frozen array of all supported RTL (right-to-left) script codes (ISO 15924).
   * @returns {readonly string[]} Array of RTL script codes (e.g. 'Arab', 'Hebr').
   * @memberof RtlLanguageDetector
   */
  public static getRtlScriptCodes(): readonly string[] {
    return Object.freeze(Array.from(RtlLanguageDetector.RTL_SCRIPT_CODES));
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
   * A locale is RTL if its base language is an RTL language, or if it carries an
   * RTL script subtag (e.g. 'az-Arab', 'pa-Arab').
   * @param {string} locale - The locale or language code (e.g., 'ar', 'fa-IR', 'az-Arab').
   * @returns {boolean} True if the language is RTL, false otherwise.
   * @memberof RtlLanguageDetector
   */
  public static isRtlLanguage(locale: string): boolean {
    const parsed = RtlLanguageDetector.parseLocale(locale);
    if (!parsed) return false;
    if (parsed.script && RtlLanguageDetector.RTL_SCRIPT_CODES.has(parsed.script)) return true;
    return RtlLanguageDetector.RTL_LANGUAGE_CODES.has(parsed.language);
  }

  /**
   * Parses a locale string into its language, script, and country code components.
   * Subtags are classified by shape (BCP 47 order language-script-region), so the
   * separator (`-` or `_`), casing, empty subtags, and encoding/variant suffixes
   * (e.g. `.UTF-8`, `@calendar=gregorian`) are all tolerated.
   * @param {string} locale - The locale string (e.g., 'en-US', 'ar_EG', 'az-Arab-IR').
   * @returns {ParsedLocaleInfo | undefined} An object with `language`, optional `script`
   *   (title-cased, e.g. 'Arab') and optional `countryCode` (upper-cased), or undefined if invalid.
   * @memberof RtlLanguageDetector
   */
  public static parseLocale(locale: string): ParsedLocaleInfo | undefined {
    if (!locale) return undefined;
    // Normalize: strip encoding/variant suffixes (e.g., .UTF-8, @calendar=gregorian)
    const normalized = locale.split(/[.@]/)[0];
    const parts = normalized.split(/[-_]/);
    const language = parts[0].toLowerCase();
    if (!RtlLanguageDetector.REGEX_LANGUAGE.test(language)) return undefined;

    let script: string | undefined;
    let countryCode: string | undefined;
    for (const part of parts.slice(1)) {
      if (!part) continue;
      if (!script && RtlLanguageDetector.REGEX_SCRIPT.test(part)) {
        // Title-case per ISO 15924 convention (e.g. 'arab' -> 'Arab').
        script = part[0].toUpperCase() + part.slice(1).toLowerCase();
      } else if (!countryCode && RtlLanguageDetector.REGEX_REGION.test(part)) {
        countryCode = part.toUpperCase();
      }
    }
    return {
      language,
      script,
      countryCode,
    };
  }
}

export const parseLocale = RtlLanguageDetector.parseLocale;
export const isRtlLanguage = RtlLanguageDetector.isRtlLanguage;
export const getTextDirection = RtlLanguageDetector.getTextDirection;
export const getRtlLanguageCodes = RtlLanguageDetector.getRtlLanguageCodes;
export const getRtlScriptCodes = RtlLanguageDetector.getRtlScriptCodes;
