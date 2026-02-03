import { Phone, AlertCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLongPressSpeech } from "@/hooks/useLongPressSpeech";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmergencyAccessTab from "./EmergencyAccessTab";

const SOSButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Clean translation of label for TTS
  const buttonLabel = t('sos.button');

  const { onClick, ...handlers } = useLongPressSpeech({
    textToSpeak: t('tts.buttonDesc', { label: buttonLabel }),
    onClick: () => setIsOpen(true)
  });

  const handleAmbulanceCall = () => {
    window.location.href = "tel:108";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          {...handlers}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white font-bold tracking-wide shadow-[0_4px_16px_rgba(229,57,53,0.4)] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-[3px] focus:ring-[#E53935] focus:ring-offset-2 animate-pulse-sos"
          aria-label={t('sos.button')}
        >
          <div className="flex flex-col items-center">
            <Phone className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 flex flex-col gap-0 overflow-hidden bg-background border-none rounded-none sm:rounded-xl">
        <DialogHeader className="p-4 md:p-6 pb-2 shrink-0 border-b bg-white dark:bg-background z-10 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              {t('sos.title')}
            </DialogTitle>
            <DialogDescription>
              {t('sos.description')}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Main Content Area: form and response sheet */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-black/20">
          <div className="h-full w-full mx-auto">
            <EmergencyAccessTab />
          </div>
        </div>

        {/* Compact Footer: Call 108 Button */}
        <div className="p-3 bg-white dark:bg-background border-t shrink-0">
          <Button
            onClick={handleAmbulanceCall}
            variant="destructive"
            className="w-full h-12 text-lg font-bold bg-red-600 hover:bg-red-700 shadow-sm flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            <span>{t('sos.access.callButton')}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SOSButton;
