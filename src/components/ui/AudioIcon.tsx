import { Volume2 } from "lucide-react";
import { speechService } from "@/services/SpeechService";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface AudioIconProps {
    text: string;
    className?: string;
}

export const AudioIcon = ({ text, className }: AudioIconProps) => {
    const { i18n } = useTranslation();

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        speechService.speak(text, i18n.language);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handlePlay}
            className={`h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary/10 rounded-full transition-colors ${className}`}
            aria-label="Read aloud"
        >
            <Volume2 className="h-4 w-4" />
        </Button>
    );
};
