import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { AudioIcon } from "@/components/ui/AudioIcon";

interface HealthTip {
  id: string;
  tip_english: string;
  tip_hindi: string;
  category: string;
}

interface HealthTipsBannerProps { }

const HealthTipsBanner = ({ }: HealthTipsBannerProps) => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { toast } = useToast();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    if (tips.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips]);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-tips');

      if (error) throw error;
      if (data?.tips) {
        setTips(data.tips);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);

    }
  };

  if (tips.length === 0) return null;

  const currentTip = tips[currentTipIndex];
  const displayText = i18n.language === 'en' ? currentTip.tip_english : currentTip.tip_hindi;

  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <span className="text-2xl">💡</span>
          <p className="text-sm md:text-base font-medium text-foreground text-center">
            {displayText}
          </p>
          <AudioIcon text={displayText} />
        </div>
      </div>
    </div>
  );
};

export default HealthTipsBanner;
