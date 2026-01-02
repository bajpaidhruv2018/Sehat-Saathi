# Walkthrough - TTS Overhaul

I have completely overhauled the TTS system to be granular, language-aware, and lightweight using the native Web Speech API.

## Changes

### 1. New Infrastructure
- **`SpeechService`**: A singleton service that manages `speechSynthesis`.
    - **Robust Voice Selection**: Now strictly prefers Indian voices (e.g., `te-IN` for Telugu) and avoids defaulting to English.
    - **Fallback Logic**: If a regional voice is missing, it stays silent (and warns in console) rather than using a confusing British/American accent. Exception: Marathi falls back to Hindi.
    - **Pre-fetching**: Voices are loaded immediately to prevent delay on first click.
- **`useLongPressSpeech`**: A custom hook that enables "Long Press to Speak" functionality. It intelligently prevents accidental clicks when a long-press is detected.

### 2. Components
- **`AudioIcon`**: A small speaker icon added to text blocks. Clicking it reads the specific text.
- **`SOSButton`**: Updated with a long-press feature that announces "This button is for SOS..." before confirming the call.

### 3. Integration
- **Misconceptions & Education**: Replaced generic "Read Page" with specific `AudioIcon`s next to Myths, Facts, and Topic Cards.
- **Navbar**: All navigation buttons now support long-press to describe their function.
- **Global**: Audio automatically stops when navigating between pages.

## Verification Results

### Manual Verification Steps
1.  **Strict Voice**: 
    - Switch to **Telugu**.
    - Click any audio icon.
    - **Expected**: Speaks in Telugu (or stays silent if voice missing). Does NOT speak in British English.
2.  **Fallback**:
    - Switch to **Marathi** (if device lacks Marathi voice).
    - **Expected**: Speaks in Hindi.
3.  **Visuals**:
    - Hover over Navbar buttons.
    - **Expected**: "Magnetic" white spotlight effect + gray background, restoring invalid state instantly on mouse leave.

## Translation & UI Fixes
- **Hindi Translations**: Added missing keys for "Mental Health", "First Aid", and "Lifestyle" to `public/locales/hi/translation.json`.

- **Navbar Layout**: Fixed desktop overflow issue with Tamil language by enabling horizontal scrolling (`overflow-x-auto`) for navigation items and separating the settings toggles to ensure they remain accessible. Fixed "Find Hospitals" link overlap with language dropdown by adding padding and better flex handling.

## Asset Integration

- **Education Images**: Updated "Mental Health" and "Vaccination" topics to use local images (`mentalhealth_image.png`, `vaccination_image.jpeg`) instead of Unsplash URLs.

## Content Expansion
-4.  **Expanded Myth vs Fact Section**:
    *   Increased the number of health myths from 5 to 15.
    *   Added 10 new myths covering topics like pregnancy, mental health, antibiotics, and more.
    *   **Completed**: Propagated these new items to all supported languages (Hindi, Telugu, Bengali, Tamil, Odia, Punjabi, Marathi) with **native translations** (replacing initial placeholders).
    *   **Fixed**: Resolved issue where Hindi translations were not appearing by updating `public/locales/hi/translation.json` to use correct primary keys.
    *   **Icons**: Replaced generic icons with specific ones for the new myths (e.g., `Brain` for mental health, `Baby` for pregnancy, `Sun` for dengue).
    *   Updated `Misconceptions.tsx` to handle dynamic icons for the new items.

5.  **Navbar UI Fixes**:
    *   Solved desktop overflow issues for languages with longer text (e.g., Tamil).
    *   Enabled horizontal scrolling for navigation items while hiding scrollbars for a clean look.
    *   Fixed overlap between navigation links and the language switcher by adjusting container width constraints.
