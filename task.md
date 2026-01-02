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

# Phase 2: Pan-India Expansion (5 New Languages)

- [x] **Infrastructure Update**
    - [x] Update `src/i18n.ts` to include `bn`, `te`, `ta`, `or`, `pa`.
    - [x] Update `LanguageSwitcher.tsx` with native names and check dropdown scalability.

- [x] **Translation Generation**
    - [x] Create `public/locales/bn/translation.json` (Bengali).
    - [x] Create `public/locales/te/translation.json` (Telugu).
    - [x] Create `public/locales/ta/translation.json` (Tamil).
    - [x] Create `public/locales/or/translation.json` (Odia).
    - [x] Create `public/locales/pa/translation.json` (Punjabi).

- [x] **UI Scalability Audit**
    - [x] Audit 'Health Education' cards for text overflow with longer scripts (Tamil/Telugu).
    - [x] Audit 'Myth vs Fact' flip-cards for content fitting.

# Phase 3: Text-to-Speech Overhaul
- [x] **Infrastructure & Utilities**
    - [x] Create `src/services/SpeechService.ts` (Singleton, Language-Aware).
    - [x] Create `src/hooks/useLongPressSpeech.ts`.

- [x] **New Components**
    - [x] Create `src/components/ui/AudioIcon.tsx`.

- [x] **Integration**
    - [x] Integrate AudioIcon into `Misconceptions.tsx` (Myths/Facts).
    - [x] Integrate AudioIcon into `Education.tsx` (Cards).
    - [x] Implement Long-Press for `Home.tsx` buttons.
    - [x] Cleanup: Remove `GlobalTTSPlayer.tsx` and `TTSButton.tsx`.
    - [x] Global: Stop audio on route change.

- [x] **Voice Tuning & Robustness**
    - [x] Robust Voice Selection (ISO mapping, Google voice preference).
    - [x] Regional Fallback (Marathi -> Hindi).
    - [x] "No Voice" Warning (Toast/Console).
    - [x] Pre-fetch `getVoices` on app load.
