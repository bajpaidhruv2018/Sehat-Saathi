import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLongPressSpeech } from "@/hooks/useLongPressSpeech";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SOSButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Clean translation of label for TTS
  const buttonLabel = t('sos.button');

  const { onClick, ...handlers } = useLongPressSpeech({
    textToSpeak: t('tts.buttonDesc', { label: buttonLabel }),
    onClick: () => setIsOpen(true)
  });

  const handleEmergencyCall = () => {
    window.location.href = "tel:108";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        {...handlers}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white font-bold tracking-wide shadow-[0_4px_16px_rgba(229,57,53,0.4)] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-[3px] focus:ring-[#E53935] focus:ring-offset-2 animate-pulse-sos"
        aria-label="Emergency SOS - Call Ambulance"
      >
        <div className="flex flex-col items-center">
          <Phone className="h-6 w-6 mb-1" />
          <span className="text-xs font-bold">SOS</span>
        </div>
      </button>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            {t('sos.button')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            {t('sos.calling')}
            <br />
            <span className="font-semibold text-foreground mt-2 block">
              {t('sos.warning')}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="m-0">{t('sos.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 m-0"
          >
            {t('sos.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSButton;
