import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TTSButtonProps {
  text: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
}

export const TTSButton = ({ text, size = "sm", variant = "ghost" }: TTSButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const handleFallbackTTS = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Error",
        description: "Text-to-speech not supported in this browser",
        variant: "destructive",
      });
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTTS = async () => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, language }
      });

      if (error) throw error;

      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);

      audioElement.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audioElement.onerror = () => {
        console.error('Audio element error, falling back');
        handleFallbackTTS();
      };

      setAudio(audioElement);
      await audioElement.play();
    } catch (error) {
      console.error('TTS error, falling back:', error);
      handleFallbackTTS();
    }
  };

  return (
    <Button
      onClick={handleTTS}
      size={size}
      variant={variant}
      className="transition-all duration-200"
      aria-label={isPlaying ? t('tts.stop') : t('tts.readAloud')}
    >
      {isPlaying ? (
        <VolumeX className="h-4 w-4 mr-1" />
      ) : (
        <Volume2 className="h-4 w-4 mr-1" />
      )}
      <span className="text-xs">{isPlaying ? t('tts.stop') : t('tts.readAloud')}</span>
    </Button>
  );
};
