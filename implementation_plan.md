# Implementation Plan - i18n Scalability

## Goal Description
Scale the current i18n implementation to support multiple vernacular languages (starting with Marathi 'mr'), optimize for performance (lazy loading), and improve the UI scalability for language switching.

## Proposed Changes

### Infrastructure
#### [MODIFY] [i18n.ts](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/i18n.ts)
- Update `supportedLngs` to include `mr`.
- Verify `backend` configuration ensures no cache-busting timestamp is appended unnecessarily (allow browser caching).

### Components
#### [MODIFY] [LanguageSwitcher.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/components/LanguageSwitcher.tsx)
- Replace button toggle with a `Select` (Dropdown) component.
- Apply custom styling (clean, greenish palette).

### Translations
#### [NEW] [public/locales/mr/translation.json](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/public/locales/mr/translation.json)
- Create new translation file for Marathi.
- Populate with high-quality translations corresponding to `en/translation.json`.

### UI Hardening
- specific components to be identified during audit (e.g., `Home.tsx`, `Dashboard.tsx` cards) will have `flex-wrap` or dynamic sizing classes added.

## Verification Plan
### Automated Tests
- `npm run build` to ensure no regression.
- Manual verification of Network tab in DevTools:
    - Load page -> check `en.json` loaded.
    - Switch to Marathi -> check `mr.json` loaded (lazy load).
    - Reload -> Check if cached (304 Not Modified or disk cache).
### Manual Verification
- Visual inspection of Marathi text layout.
- Test dropdown functionality.
