# TTS Overhaul - Voice Tuning

## Goal Description
Improve the `SpeechService` to strictly select Indian vernacular voices and avoid defaulting to British/American English accents when a specific language voice is missing.

## User Review Required
> [!IMPORTANT]
> If a requested language voice (e.g., Odia) is missing, the system will now remain silent or show a warning instead of reading in English. This is a design change to prevent "wrong accent" issues.

## Proposed Changes

### Infrastructure
#### [MODIFY] [SpeechService.ts](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/services/SpeechService.ts)
- **Pre-fetch**: Ensure `getVoices()` is called immediately and listens to `onvoiceschanged`.
- **Selection Logic**:
    1.  Map i18n code to ISO (e.g., `te` -> `te-IN`).
    2.  Search for exact `lang` match (e.g., `te-IN`).
    3.  Search for "Google" voices with that `lang` (e.g., `Google Telugu`).
    4.  Search for any voice starting with the short code (e.g., `te`).
- **Fallback Logic**:
    -   **Marathi (`mr`)**: If no Marathi voice, try `hi-IN` (Hindi).
    -   **Others**: If no voice found, **Log Warning/Show Toast** and **Do Not Speak**.
- **Native Detection**: Strictly use `i18n.language`.




### Content Expansion
#### [MODIFY] [translation.json](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/public/locales/en/translation.json)
- Add 10 new items to `misconceptions.items` array.
- Ensure unique IDs.


#### [MODIFY] [translation.json](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/public/locales/hi/translation.json)
- Add corresponding Hindi translations for the new myths.

#### [MODIFY] Vernacular Files (bn, te, ta, or, pa)
- Propagate the 10 new myth items to all other translation files to prevent empty cards.
- Use English/Hindi as placeholders where native translation is unavailable.

### Image Integration
#### [MODIFY] [Education.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/pages/Education.tsx)
- Update `mentalHealth` item to use `/mentalhealth_image.png`.
- Update `vaccination` item to use `/vaccination_image.jpeg`.

### Navbar Layout
#### [MODIFY] [Navbar.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/components/Navbar.tsx)
- Add `min-w-0` to the scrollable navigation container to correctly handle flex shrinking and trigger scrolling.
- Add `pr-6` to ensure the last navigation item doesn't touch the settings divider.

## Verification Plan
### Automated Tests
- Unit tests not applicable in this environment.

### Manual Verification
1.  **Console Logging**: Verify logs show "Selected voice: Google Telugu" or "No voice found for or-IN".
2.  **Language Switching**: Switch to Telugu -> Click Audio Icon -> Verify not English.
3.  **Fallback**: Switch to Marathi -> Disable Marathi voice (simulated) -> Verify Hindi voice used.
