# i18n Scalability & Vernacular Expansion

- [x] **Infrastructure & Optimization**
    - [x] Verify `src/i18n.ts` configuration for lazy loading and efficient caching (remove cache busters if present).
    - [x] Ensure `react-i18next` and `i18next-http-backend` are correctly set up for on-demand loading.

- [x] **UI Components**
    - [x] Refactor `LanguageSwitcher.tsx` to a scalable Dropdown (Select) component.
    - [x] Style the switcher to be "clean, greenish".
    - [x] Audit UI for text overflow issues and apply `flex-wrap` / dynamic sizing globally where needed.

- [x] **Marathi Language Support**
    - [x] Generate `public/locales/mr/translation.json` based on English keys.
    - [x] Update `src/i18n.ts` to include 'mr' in `supportedLngs`.

- [x] **Verification & Scan**
    - [x] Scan for any remaining hardcoded strings (cursory check).
    - [x] Verify lazy loading (network tab).
    - [x] Verify persistence/caching of translations.
    - [x] Verify Marathi text rendering.
