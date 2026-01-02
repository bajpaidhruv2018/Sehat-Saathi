# i18n Scalability & Vernacular Expansion

- [x] **Infrastructure & Optimization**
    - [x] Verify `src/i18n.ts` configuration for lazy loading.
    - [x] Ensure `react-i18next` set up.

- [x] **UI Components**
    - [x] Refactor `LanguageSwitcher.tsx`.
    - [x] Style the switcher.
    - [x] Audit UI for text overflow.

- [x] **Marathi Language Support**
    - [x] Generate `public/locales/mr/translation.json`.
    - [x] Update `src/i18n.ts`.

- [x] **Verification & Scan**
    - [x] Scan for hardcoded strings.
    - [x] Verify lazy loading.

# Phase 2: Pan-India Expansion

- [x] **Infrastructure Update**
    - [x] Update `src/i18n.ts`.
    - [x] Update `LanguageSwitcher.tsx`.

- [x] **Translation Generation**
    - [x] Create translation files for 5 new languages.

- [x] **UI Scalability Audit**
    - [x] Audit cards for text overflow.

# Phase 3: Text-to-Speech Overhaul
- [x] **Infrastructure & Utilities**
    - [x] Create `SpeechService.ts`.
    - [x] Create `useLongPressSpeech.ts`.

- [x] **New Components**
    - [x] Create `AudioIcon.tsx`.

- [x] **Integration**
    - [x] Integrate AudioIcon everywhere.
    - [x] Implement Long-Press.
    - [x] Cleanup legacy code.

- [x] **Voice Tuning & Robustness**
    - [x] Robust Voice Selection (ISO mapping).
    - [x] Regional Fallback.
    - [x] Pre-fetch `getVoices`.

# Phase 4: Education Expansion & UI Polish
- [x] **Mobile UI Fixes**
    - [x] Fix Navbar clipping/viewport issue (Moved Controls to Mobile Menu).
    - [x] ensure all controls are accessible.

- [x] **Education Content**
    - [x] Add Mental Health, First Aid, Lifestyle topics.
    - [x] Add visuals (SVG/Images).
    - [x] Update translations for ALL languages (en, hi, bn, te, ta, or, pa).
    - [x] Fix missing English keys for new topics.
