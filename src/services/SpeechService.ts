import i18n from '../i18n';

class SpeechService {
    private synthesis: SpeechSynthesis;
    private utterance: SpeechSynthesisUtterance | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private voicesLoaded: boolean = false;

    constructor() {
        this.synthesis = window.speechSynthesis;
        this.init();
    }

    private init() {
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.voices = this.synthesis.getVoices();
                this.voicesLoaded = true;
                console.log(`TTS: Voices loaded: ${this.voices.length}`);
            };
        }
        // Attempt initial load
        this.voices = this.synthesis.getVoices();
        if (this.voices.length > 0) {
            this.voicesLoaded = true;
        }
    }

    public speak(text: string, langCode?: string) {
        this.stop(); // Stop any currently playing audio

        if (!text) return;

        // Ensure voices are loaded if possible (simulated sync check)
        if (!this.voicesLoaded) {
            this.voices = this.synthesis.getVoices();
            if (this.voices.length > 0) this.voicesLoaded = true;
        }

        const currentLang = langCode || i18n.language;
        const targetIso = this.mapLanguageCode(currentLang);

        this.utterance = new SpeechSynthesisUtterance(text);

        // Settings for "natural and calm" voice
        this.utterance.rate = 0.9;
        this.utterance.pitch = 1.0;

        // Voice Selection Logic
        const voice = this.getVoiceForLanguage(currentLang);

        if (voice) {
            this.utterance.voice = voice;
            this.utterance.lang = voice.lang;
            console.log(`TTS: Speaking in ${voice.lang} using ${voice.name}`);
            this.synthesis.speak(this.utterance);
        } else {
            console.warn(`TTS: No suitable voice found for language '${currentLang}' (${targetIso}). Staying silent.`);
            // Optional: Show a toast here if we had access to the toast hook, 
            // but services shouldn't use hooks directly. 
            // We'll rely on the console warning as per "remain silent" instruction.
        }
    }

    public stop() {
        if (this.synthesis.speaking || this.synthesis.pending) {
            this.synthesis.cancel();
        }
    }

    private getVoiceForLanguage(lang: string): SpeechSynthesisVoice | undefined {
        const targetIso = this.mapLanguageCode(lang); // e.g., 'te-IN'
        const shortLang = targetIso.split('-')[0];    // e.g., 'te'

        // 1. Exact Match (e.g. 'te-IN')
        let voice = this.voices.find(v => v.lang === targetIso);

        // 2. Google Voice exact match (often better quality)
        if (!voice) {
            voice = this.voices.find(v => v.lang === targetIso && v.name.includes('Google'));
        }

        // 3. Match by short code (e.g. 'te')
        if (!voice) {
            voice = this.voices.find(v => v.lang.startsWith(shortLang));
        }

        // 4. FALLBACK LOGIC
        if (!voice) {
            // Marathi Fallback -> Hindi
            if (shortLang === 'mr') {
                console.log("TTS: Marathi voice not found, falling back to Hindi.");
                // Try to find a Hindi voice
                return this.getVoiceForLanguage('hi');
            }

            // Other languages: Do NOT fallback to English. Return undefined.
            return undefined;
        }

        return voice;
    }

    private mapLanguageCode(lang: string): string {
        // Map i18n codes to standard BCP 47 tags
        const map: Record<string, string> = {
            'en': 'en-IN', // Prefer Indian English
            'hi': 'hi-IN',
            'bn': 'bn-IN',
            'te': 'te-IN',
            'ta': 'ta-IN',
            'mr': 'mr-IN',
            'pa': 'pa-IN',
            'or': 'or-IN', // Odia
            'gu': 'gu-IN', // Gujarati (if added later)
            'kn': 'kn-IN', // Kannada (if added later)
            'ml': 'ml-IN'  // Malayalam (if added later)
        };
        // If exact match in map, use it. Else check if the lang itself looks like a tag, otherwise default to passed lang.
        // We do NOT default to 'en-IN' blindly anymore.
        return map[lang] || lang;
    }
}

export const speechService = new SpeechService();
