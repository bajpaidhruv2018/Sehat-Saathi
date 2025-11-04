import { Phone } from "lucide-react";
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
  const handleEmergencyCall = () => {
    window.location.href = "tel:108";
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white font-bold tracking-wide shadow-[0_4px_16px_rgba(229,57,53,0.4)] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-[3px] focus:ring-[#E53935] focus:ring-offset-2 animate-pulse-sos"
          aria-label="Emergency SOS - Call Ambulance"
        >
          <div className="flex flex-col items-center">
            <Phone className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Emergency Ambulance Call
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            Are you sure you want to call an ambulance?
            <br />
            <span className="font-semibold text-foreground mt-2 block">
              This will dial 108 (Emergency Services)
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 m-0"
          >
            Yes, Call Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSButton;
