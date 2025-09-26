# @andreasnicolaou/rtl-detect

Modern, standards-based RTL (Right-to-Left) language detection for JavaScript/TypeScript. Detects if a locale is RTL, gets text direction, and lists all Unicode/ISO RTL languages.

![TypeScript](https://img.shields.io/badge/TS-TypeScript-3178c6?logo=typescript&logoColor=white)
![GitHub contributors](https://img.shields.io/github/contributors/andreasnicolaou/rtl-detect)
![GitHub License](https://img.shields.io/github/license/andreasnicolaou/rtl-detect)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/andreasnicolaou/rtl-detect/build.yaml)
![GitHub package.json version](https://img.shields.io/github/package-json/v/andreasnicolaou/rtl-detect)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasnicolaou/rtl-detect/badge.svg)](https://snyk.io/test/github/andreasnicolaou/rtl-detect)
![Bundle Size](https://deno.bundlejs.com/badge?q=@andreasnicolaou/rtl-detect&treeshake=[*])

![ESLint](https://img.shields.io/badge/linter-eslint-4B32C3.svg?logo=eslint)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)
![Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)
![Maintenance](https://img.shields.io/maintenance/yes/2025)
[![codecov](https://codecov.io/gh/andreasnicolaou/rtl-detect/graph/badge.svg?token=ELH4YWG68O)](https://codecov.io/gh/andreasnicolaou/rtl-detect)

![NPM Downloads](https://img.shields.io/npm/dm/%40andreasnicolaou%2Frtl-detect)

## Features

- Detect if a locale or language code is right-to-left (RTL)
- Get the text direction (`'rtl'` or `'ltr'`) for any locale
- List all supported RTL language codes (Unicode/ISO-compliant)
- Fully immutable, type-safe, and fast
- Works in Node.js, browsers, and TypeScript projects

## Installation & CDN Usage

### Package Managers

```bash
# npm
npm install @andreasnicolaou/rtl-detect

# yarn
yarn add @andreasnicolaou/rtl-detect

# pnpm
pnpm add @andreasnicolaou/rtl-detect
```

### CDN Usage

For direct browser usage without a build step:

```html
<!-- unpkg CDN (latest version, unminified) -->
<script src="https://unpkg.com/@andreasnicolaou/rtl-detect/dist/index.umd.js"></script>

<!-- unpkg CDN (latest version, minified) -->
<script src="https://unpkg.com/@andreasnicolaou/rtl-detect/dist/index.umd.min.js"></script>

<!-- jsDelivr CDN (unminified) -->
<script src="https://cdn.jsdelivr.net/npm/@andreasnicolaou/rtl-detect/dist/index.umd.js"></script>

<!-- jsDelivr CDN (minified) -->
<script src="https://cdn.jsdelivr.net/npm/@andreasnicolaou/rtl-detect/dist/index.umd.min.js"></script>
```

> **Note:** The library will be available as `rtlLanguageDetector` on the global scope when loaded via CDN in the browser.

## Usage

### ESM (ECMAScript Modules)

```js
import {
  isRtlLanguage,
  getTextDirection,
  getRtlLanguageCodes,
  parseLocale,
  RtlLanguageDetector,
} from '@andreasnicolaou/rtl-detect';

isRtlLanguage('ar'); // true
getTextDirection('fa-IR'); // 'rtl'
const rtlCodes = getRtlLanguageCodes();
const parsed = parseLocale('ar-EG');
RtlLanguageDetector.isRtlLanguage('he'); // true
```

### CommonJS (Node.js require)

```js
const {
  isRtlLanguage,
  getTextDirection,
  getRtlLanguageCodes,
  parseLocale,
  RtlLanguageDetector,
} = require('@andreasnicolaou/rtl-detect');

isRtlLanguage('ar'); // true
getTextDirection('fa-IR'); // 'rtl'
const rtlCodes = getRtlLanguageCodes();
const parsed = parseLocale('ar-EG');
RtlLanguageDetector.isRtlLanguage('he'); // true
```

### UMD (CDN/Browser)

```html
<script src="https://unpkg.com/@andreasnicolaou/rtl-detect/dist/index.umd.min.js"></script>
<script>
  const { isRtlLanguage, getTextDirection, getRtlLanguageCodes, parseLocale } = rtlLanguageDetector;
  isRtlLanguage('ar'); // true
  getTextDirection('fa-IR'); // 'rtl'
  const rtlCodes = getRtlLanguageCodes();
  const parsed = parseLocale('ar-EG');
  rtlLanguageDetector.isRtlLanguage('he'); // true
</script>
```

## API

| Function/Export         | Signature                                         | Description                                                                                                                                                   |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **isRtlLanguage**       | `(locale: string): boolean`                       | Returns `true` if the locale or language code is right-to-left.                                                                                               |
| **getTextDirection**    | `(locale: string): 'rtl' \| 'ltr'`                | Returns the text direction for the given locale.                                                                                                              |
| **getRtlLanguageCodes** | `(): readonly string[]`                           | Returns a frozen array of all supported RTL language codes.                                                                                                   |
| **parseLocale**         | `(locale: string): ParsedLocaleInfo \| undefined` | Parses a locale string into its language and country code components. Automatically strips encoding/variant suffixes (e.g., `.UTF-8`, `@calendar=gregorian`). |
| **RtlLanguageDetector** | `class`                                           | Static class with all the above as static methods.                                                                                                            |

### Types

| Type               | Definition                                   | Description                                                  |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------ |
| `TextDirection`    | `'rtl' \| 'ltr'`                             | Text direction, either right-to-left or left-to-right        |
| `ParsedLocaleInfo` | `{ language: string; countryCode?: string }` | Parsed locale object with language and optional country code |

## How it works

This library uses an immutable list of RTL language codes (Unicode/ISO-compliant) to determine text direction for any locale or language code. It works in Node.js, browsers, and TypeScript projects, and is fully type-safe.

## License

MIT

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or new features.

## Examples

```js
parseLocale('en_US.UTF-8'); // { language: 'en', countryCode: 'US' }
parseLocale('ar_EG@calendar=islamic'); // { language: 'ar', countryCode: 'EG' }
```
