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
