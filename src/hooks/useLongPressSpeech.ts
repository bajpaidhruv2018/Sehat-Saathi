import { useRef, useCallback, useState } from 'react';
import { speechService } from '../services/SpeechService';
import { useTranslation } from 'react-i18next';

interface LongPressOptions {
    textToSpeak: string;
    onClick?: () => void;
    delay?: number;
}

export const useLongPressSpeech = ({ textToSpeak, onClick, delay = 800 }: LongPressOptions) => {
    const [isLongPress, setIsLongPress] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isPressedRef = useRef(false);
    const { i18n } = useTranslation();

    const start = useCallback(() => {
        isPressedRef.current = true;
        setIsLongPress(false);
        timeoutRef.current = setTimeout(() => {
            if (isPressedRef.current) {
                // Long press triggering
                setIsLongPress(true);
                // Vibrate if available for feedback
                if (navigator.vibrate) navigator.vibrate(50);

                speechService.speak(textToSpeak, i18n.language);
            }
        }, delay);
    }, [textToSpeak, delay, i18n.language]);

    const clear = useCallback(() => {
        isPressedRef.current = false;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        // If it was a long press, we prevent the Click action
        if (isLongPress) {
            e.preventDefault();
            e.stopPropagation();
            // Reset state
            setIsLongPress(false);
            return;
        }

        // Otherwise, execute normal click
        if (onClick) {
            onClick();
        }
    }, [isLongPress, onClick]);

    return {
        onMouseDown: (e: React.MouseEvent) => {
            start();
        },
        onMouseUp: (e: React.MouseEvent) => {
            clear();
        },
        onMouseLeave: (e: React.MouseEvent) => {
            clear();
        },
        onTouchStart: (e: React.TouchEvent) => {
            start();
        },
        onTouchEnd: (e: React.TouchEvent) => {
            clear();
            // Note: Touch devices might fire onClick after onTouchEnd, handled by state
        },
        onClick: handleClick
    };
};
