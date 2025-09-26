import {
  isRtlLanguage,
  getTextDirection,
  getRtlLanguageCodes,
  TextDirection,
  RtlLanguageDetector,
  parseLocale,
} from './index';
describe('RtlLanguageDetector', () => {
  describe('isRtlLanguage', () => {
    describe('RTL languages', () => {
      test.each([
        { locale: 'ar', name: 'Arabic' },
        { locale: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
        { locale: 'he', name: 'Hebrew' },
        { locale: 'he-IL', name: 'Hebrew (Israel)' },
        { locale: 'fa', name: 'Persian' },
        { locale: 'fa-IR', name: 'Persian (Iran)' },
        { locale: 'ur', name: 'Urdu' },
        { locale: 'ur-PK', name: 'Urdu (Pakistan)' },
        { locale: 'ps', name: 'Pashto' },
        { locale: 'ku', name: 'Kurdish' },
        { locale: 'dv', name: 'Dhivehi' },
        { locale: 'sd', name: 'Sindhi' },
        { locale: 'yi', name: 'Yiddish' },
        { locale: 'ug', name: 'Uyghur' },
        { locale: 'arc', name: 'Aramaic' },
        { locale: 'ae', name: 'Avestan' },
        { locale: 'bcc', name: 'Southern Balochi' },
        { locale: 'bqi', name: 'Bakthiari' },
        { locale: 'ckb', name: 'Sorani' },
        { locale: 'glk', name: 'Gilaki' },
        { locale: 'mzn', name: 'Mazanderani' },
        { locale: 'nqo', name: "N'Ko" },
        { locale: 'pnb', name: 'Western Punjabi' },
        { locale: 'prs', name: 'Darī' },
        { locale: 'syr', name: 'Syriac' },
      ])('should detect $name ($locale) as RTL', ({ locale }: { locale: string }) => {
        expect(RtlLanguageDetector.isRtlLanguage(locale)).toBe(true);
        expect(isRtlLanguage(locale)).toBe(true);
      });
    });

    describe('LTR languages', () => {
      test.each([
        { locale: 'en', name: 'English' },
        { locale: 'en-US', name: 'English (United States)' },
        { locale: 'fr', name: 'French' },
        { locale: 'fr-FR', name: 'French (France)' },
        { locale: 'de', name: 'German' },
        { locale: 'de-DE', name: 'German (Germany)' },
        { locale: 'es', name: 'Spanish' },
        { locale: 'es-ES', name: 'Spanish (Spain)' },
        { locale: 'ja', name: 'Japanese' },
        { locale: 'ja-JP', name: 'Japanese (Japan)' },
        { locale: 'zh', name: 'Chinese' },
        { locale: 'zh-CN', name: 'Chinese (Simplified)' },
        { locale: 'ru', name: 'Russian' },
        { locale: 'ru-RU', name: 'Russian (Russia)' },
        { locale: 'it', name: 'Italian' },
        { locale: 'pt', name: 'Portuguese' },
        { locale: 'ko', name: 'Korean' },
        { locale: 'th', name: 'Thai' },
        { locale: 'vi', name: 'Vietnamese' },
        { locale: 'hi', name: 'Hindi' },
      ])('should detect $name ($locale) as LTR', ({ locale }: { locale: string }) => {
        expect(RtlLanguageDetector.isRtlLanguage(locale)).toBe(false);
        expect(isRtlLanguage(locale)).toBe(false);
      });
    });

    describe('edge cases', () => {
      test('should return false for empty string', () => {
        expect(RtlLanguageDetector.isRtlLanguage('')).toBe(false);
      });

      test('should return undefined for single-character language code', () => {
        expect(parseLocale('a-US')).toBeUndefined();
        expect(parseLocale('a')).toBeUndefined();
        expect(parseLocale('_')).toBeUndefined();
        expect(parseLocale('-')).toBeUndefined();
        expect(parseLocale('')).toBeUndefined();
      });

      test('should return false for invalid locale', () => {
        expect(RtlLanguageDetector.isRtlLanguage('invalid')).toBe(false);
        expect(RtlLanguageDetector.isRtlLanguage('123')).toBe(false);
        expect(RtlLanguageDetector.isRtlLanguage('!')).toBe(false);
      });

      test('should handle case variations', () => {
        expect(RtlLanguageDetector.isRtlLanguage('AR')).toBe(true);
        expect(RtlLanguageDetector.isRtlLanguage('Ar')).toBe(true);
        expect(RtlLanguageDetector.isRtlLanguage('aR')).toBe(true);
      });

      test('should handle different separators', () => {
        expect(RtlLanguageDetector.isRtlLanguage('ar-SA')).toBe(true);
        expect(RtlLanguageDetector.isRtlLanguage('ar_SA')).toBe(true);
        expect(RtlLanguageDetector.isRtlLanguage('ar-sa')).toBe(true);
        expect(RtlLanguageDetector.isRtlLanguage('ar_sa')).toBe(true);
      });
    });
  });

  describe('getTextDirection', () => {
    describe('RTL direction', () => {
      test.each(['ar', 'ar-SA', 'he', 'he-IL', 'fa', 'fa-IR', 'ur', 'ur-PK'])(
        'should return "rtl" for %s',
        (locale) => {
          expect(RtlLanguageDetector.getTextDirection(locale)).toBe('rtl');
          expect(getTextDirection(locale)).toBe('rtl');
        }
      );
    });

    describe('LTR direction', () => {
      test.each(['en', 'en-US', 'fr', 'fr-FR', 'de', 'de-DE', 'es', 'es-ES'])(
        'should return "ltr" for %s',
        (locale) => {
          expect(RtlLanguageDetector.getTextDirection(locale)).toBe('ltr');
          expect(getTextDirection(locale)).toBe('ltr');
        }
      );
    });

    describe('edge cases', () => {
      test('should return "ltr" for empty string', () => {
        expect(RtlLanguageDetector.getTextDirection('')).toBe('ltr');
      });

      test('should return "ltr" for invalid locale', () => {
        expect(RtlLanguageDetector.getTextDirection('invalid')).toBe('ltr');
        expect(RtlLanguageDetector.getTextDirection('123')).toBe('ltr');
      });
    });
  });

  describe('getRtlLanguageCodes', () => {
    test('should return array of RTL language codes', () => {
      const rtlLanguages = RtlLanguageDetector.getRtlLanguageCodes();
      const namedExportLanguages = getRtlLanguageCodes();

      expect(Array.isArray(rtlLanguages)).toBe(true);
      expect(Array.isArray(namedExportLanguages)).toBe(true);
      expect(rtlLanguages).toEqual(namedExportLanguages);

      expect(rtlLanguages).toContain('ar');
      expect(rtlLanguages).toContain('he');
      expect(rtlLanguages).toContain('fa');
      expect(rtlLanguages).toContain('ur');
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rtlLanguages as any).push('test');
      }).toThrow();
    });

    test('should have expected number of RTL languages', () => {
      const rtlLanguages = RtlLanguageDetector.getRtlLanguageCodes();
      expect(rtlLanguages.length).toBe(24);
    });
  });

  describe('method validation (through public interface)', () => {
    test('should handle locale parsing correctly', () => {
      // Test through public methods to verify parseLocale works
      expect(RtlLanguageDetector.isRtlLanguage('ar-EG-x-variant')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('en-US-x-variant')).toBe(false);
    });

    test('should handle trimming in locale parsing', () => {
      // These should all be parsed as the same language
      expect(RtlLanguageDetector.isRtlLanguage('ar-SA')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('ar_SA')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('ar---SA')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('ar___SA')).toBe(true);
    });
  });

  describe('TypeScript types', () => {
    test('should export correct types', () => {
      const direction: TextDirection = RtlLanguageDetector.getTextDirection('ar');
      expect(direction).toBe('rtl');

      const isRtl: boolean = RtlLanguageDetector.isRtlLanguage('ar');
      expect(isRtl).toBe(true);
    });
  });

  describe('backwards compatibility', () => {
    test('should work with default export', () => {
      expect(typeof RtlLanguageDetector.isRtlLanguage).toBe('function');
      expect(typeof RtlLanguageDetector.getTextDirection).toBe('function');
      expect(typeof RtlLanguageDetector.getRtlLanguageCodes).toBe('function');
    });

    test('should work with named exports', () => {
      expect(typeof isRtlLanguage).toBe('function');
      expect(typeof getTextDirection).toBe('function');
      expect(typeof getRtlLanguageCodes).toBe('function');
    });
  });

  describe('performance and edge cases', () => {
    test('should handle many rapid calls', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        RtlLanguageDetector.isRtlLanguage('ar-SA');
        RtlLanguageDetector.isRtlLanguage('en-US');
        RtlLanguageDetector.getTextDirection('he-IL');
        RtlLanguageDetector.getTextDirection('fr-FR');
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    test('should handle special characters in locale', () => {
      expect(RtlLanguageDetector.isRtlLanguage('ar@calendar=islamic')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('ar.UTF-8')).toBe(true);
      expect(RtlLanguageDetector.isRtlLanguage('en_US.UTF-8')).toBe(false);
      expect(RtlLanguageDetector.isRtlLanguage('ar#variant')).toBe(false);
    });

    test('parseLocale returns undefined countryCode for language-only and empty country code', () => {
      expect(parseLocale('ar')).toEqual({ language: 'ar', countryCode: undefined });
      expect(parseLocale('en')).toEqual({ language: 'en', countryCode: undefined });
      expect(parseLocale('ar-')).toEqual({ language: 'ar', countryCode: undefined });
      expect(parseLocale('ar_')).toEqual({ language: 'ar', countryCode: undefined });
    });

    test('parseLocale handles missing language part', () => {
      expect(parseLocale('-US')).toBeUndefined();
      expect(parseLocale('_')).toBeUndefined();
    });

    test('parseLocale valid cases', () => {
      expect(parseLocale('en-US')).toEqual({ language: 'en', countryCode: 'US' });
      expect(parseLocale('ar')).toEqual({ language: 'ar', countryCode: undefined });
    });
  });
});
