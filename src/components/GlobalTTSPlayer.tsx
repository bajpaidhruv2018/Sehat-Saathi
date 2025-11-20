import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Paragraph {
  element: HTMLElement;
  text: string;
  index: number;
}

export const GlobalTTSPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const highlightClassRef = useRef<string>("tts-highlight");

  // Collect all readable paragraphs from the page
  const collectParagraphs = () => {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    const collected: Paragraph[] = [];
    
    elements.forEach((el, idx) => {
      const text = el.textContent?.trim();
      if (text && text.length > 10 && !el.closest('.global-tts-player')) {
        collected.push({
          element: el as HTMLElement,
          text,
          index: idx
        });
      }
    });
    
    setParagraphs(collected);
    return collected;
  };

  // Highlight current paragraph
  const highlightParagraph = (index: number) => {
    // Remove previous highlights
    paragraphs.forEach(p => p.element.classList.remove(highlightClassRef.current));
    
    if (index >= 0 && index < paragraphs.length) {
      const element = paragraphs[index].element;
      element.classList.add(highlightClassRef.current);
      
      // Smooth scroll to element
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Play paragraph
  const playParagraph = async (index: number) => {
    if (index >= paragraphs.length) {
      stopReading();
      return;
    }

    const paragraph = paragraphs[index];
    setCurrentIndex(index);
    highlightParagraph(index);

    try {
      // Try backend TTS first
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: paragraph.text.substring(0, 3000), language }
      });

      if (error) throw error;

      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
        // Auto-play next paragraph
        if (index + 1 < paragraphs.length) {
          playParagraph(index + 1);
        } else {
          stopReading();
        }
      };

      audioElement.onerror = () => {
        // Fallback to Web Speech API
        useSpeechSynthesis(paragraph.text, index);
      };

      setAudio(audioElement);
      await audioElement.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to Web Speech API
      useSpeechSynthesis(paragraph.text, index);
    }
  };

  // Fallback: Web Speech API
  const useSpeechSynthesis = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Error",
        description: "Text-to-speech not supported in this browser",
        variant: "destructive",
      });
      stopReading();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => {
      if (index + 1 < paragraphs.length) {
        playParagraph(index + 1);
      } else {
        stopReading();
      }
    };

    utterance.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to play audio. Using offline voice temporarily.",
      });
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    toast({
      title: "Offline Mode",
      description: "Using offline voice temporarily",
    });
  };

  // Start reading
  const startReading = () => {
    const collected = collectParagraphs();
    if (collected.length === 0) {
      toast({
        title: "No Content",
        description: "No readable content found on this page",
      });
      return;
    }
    setIsOpen(true);
    playParagraph(0);
  };

  // Stop reading
  const stopReading = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsOpen(false);
    
    // Remove all highlights
    paragraphs.forEach(p => p.element.classList.remove(highlightClassRef.current));
  };

  // Pause/Resume
  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      // If using speech synthesis
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
    }
  };

  // Skip forward
  const skipForward = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    window.speechSynthesis.cancel();
    
    if (currentIndex + 1 < paragraphs.length) {
      playParagraph(currentIndex + 1);
    }
  };

  // Skip backward
  const skipBackward = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    window.speechSynthesis.cancel();
    
    if (currentIndex > 0) {
      playParagraph(currentIndex - 1);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, [audio]);

  return (
    <>
      <style>
        {`
          .tts-highlight {
            background: rgba(255, 230, 150, 0.3);
            transition: background 0.2s ease;
            border-radius: 4px;
            padding: 2px 4px;
          }
          
          .dark .tts-highlight {
            background: rgba(100, 200, 255, 0.2);
          }
        `}
      </style>

      {/* Floating Read Aloud Button */}
      {!isOpen && (
        <Button
          onClick={startReading}
          className="fixed bottom-48 right-6 z-40 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary to-secondary hover:scale-110"
          size="lg"
          aria-label={language === 'en' ? 'Read Aloud' : 'ज़ोर से पढ़ें'}
        >
          <Volume2 className="h-6 w-6" />
        </Button>
      )}

      {/* Mini Player */}
      {isOpen && (
        <div className="global-tts-player fixed bottom-48 right-6 z-40 bg-background border border-border rounded-2xl shadow-xl p-4 w-80 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <VolumeX className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {language === 'en' ? 'Reading Aloud' : 'ज़ोर से पढ़ रहे हैं'}
              </span>
            </div>
            <Button
              onClick={stopReading}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            {language === 'en' 
              ? `Paragraph ${currentIndex + 1} of ${paragraphs.length}`
              : `पैराग्राफ ${currentIndex + 1} में से ${paragraphs.length}`
            }
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={skipBackward}
              disabled={currentIndex === 0}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 rounded-full"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={togglePlayPause}
              variant="default"
              size="sm"
              className="h-12 w-12 p-0 rounded-full bg-gradient-to-br from-primary to-secondary"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            <Button
              onClick={skipForward}
              disabled={currentIndex >= paragraphs.length - 1}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 rounded-full"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
