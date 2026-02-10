import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface HospitalResponse {
    response_id: string; // Changed from id
    hospital_name: string;
    // status: "BED AVAILABLE" | "HOSPITAL FULL"; // Removed as not in DB
    bed_availability: boolean; // true = Available, false = Full
    medical_advice: string;
    // created_at: string; // Removed as not in DB
    responded_at: string;
    eta: string;
    emergency_id: string;
    doctor_access?: {
        contact: string;
        loc_lat: number;
        loc_long: number;
    };
}

interface EmergencyResponseSheetProps {
    emergencyId: string | null;
}

const EmergencyResponseSheet = ({ emergencyId }: EmergencyResponseSheetProps) => {
    const { t } = useTranslation();
    const [responses, setResponses] = useState<HospitalResponse[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [channelStatus, setChannelStatus] = useState<string>("CONNECTING");

    useEffect(() => {
        if (!emergencyId) return;

        // Reset responses on new ID to prevent flash of old data
        setResponses([]);

        // Shared fetch function
        const fetchResponses = async () => {
            console.log("Fetching responses for emergency ID:", emergencyId);
            // @ts-ignore - Table not in types yet
            const { data, error } = await supabase
                .from("Hospital_Responses") // User confirmed Uppercase
                // Changed to LEFT JOIN (removed !responded_by_id enforcement) to show responses even if doctor info is missing
                .select("*, doctor_access(contact, loc_lat, loc_long)")
                .eq("emergency_id", emergencyId)
                .order("responded_at", { ascending: false });

            if (error) {
                console.error("Error fetching responses:", error);
                setFetchError(JSON.stringify(error));
            } else if (data) {
                console.log("Fetched responses:", data.length);
                // Clear error if success
                setFetchError(null);
                setResponses(prev => {
                    const simulated = prev.filter(r => r.response_id.startsWith('sim-'));
                    return [...simulated, ...(data as unknown as HospitalResponse[])];
                });
            }
        };

        // Initial fetch
        fetchResponses();

        // Rapid retry for the first few seconds to catch immediate webhook updates
        const shyRetry1 = setTimeout(fetchResponses, 1000);
        const shyRetry2 = setTimeout(fetchResponses, 2000);

        // Subscribe to real-time changes
        const channel = supabase
            .channel('hospital_replies')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Hospital_Responses', // User confirmed
                    filter: `emergency_id=eq.${emergencyId}`,
                },
                (payload) => {
                    console.log('New response received (realtime):', payload);
                    const newResponse = payload.new as HospitalResponse;
                    setResponses((prev) => [newResponse, ...prev]);
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status);
                setChannelStatus(status);
            });

        // Cleanup subscription on unmount or id change
        return () => {
            supabase.removeChannel(channel);
            clearTimeout(shyRetry1);
            clearTimeout(shyRetry2);
        };
    }, [emergencyId]);

    // Separate Polling Effect
    useEffect(() => {
        if (!emergencyId) return;

        let pollInterval: NodeJS.Timeout;

        // Poll if we are NOT successfully subscribed (covers CONNECTING, ERROR, CLOSED, TIMED_OUT)
        if (channelStatus !== 'SUBSCRIBED') {
            console.log("Realtime not ready (Status: " + channelStatus + "), using polling...");

            // Define fetch function again for polling scope
            const pollResponses = async () => {
                // @ts-ignore - Table not in types yet
                const { data, error } = await supabase
                    .from("Hospital_Responses")
                    // Changed to LEFT JOIN (removed !responded_by_id enforcement)
                    .select("*, doctor_access(contact, loc_lat, loc_long)")
                    // .select("*")
                    .eq("emergency_id", emergencyId)
                    .order("responded_at", { ascending: false });

                if (data) {
                    setResponses(prev => {
                        const simulated = prev.filter(r => r.response_id.startsWith('sim-'));
                        return [...simulated, ...(data as unknown as HospitalResponse[])];
                    });
                } else if (error) {
                    // Retry logic not needed in poll as much, but good for consistency
                    console.warn("Polling error:", error);
                }
            };

            // Poll every 1 second for faster updates
            pollInterval = setInterval(pollResponses, 1000);
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [emergencyId, channelStatus]);

    if (!emergencyId) return null;

    return (
        <div className="mt-8 border rounded-lg overflow-hidden shadow-sm bg-white" style={{ fontFamily: 'sans-serif' }}>
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{t('sos.access.sheetTitle', 'Hospital Responses')}</h3>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-700">{t('sos.access.liveTracking', 'Live Tracking Active')}</span>
                </div>
            </div>

            {responses.length === 0 ? (
                <div className="p-12 text-center bg-blue-50/50">
                    <div className="inline-block relative mb-6">
                        <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping absolute"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full relative"></div>
                    </div>
                    <p className="text-xl text-gray-700 font-bold animate-pulse">{t('sos.access.loading')}</p>
                    <p className="text-base text-gray-500 mt-2 font-mono bg-gray-100 p-1 rounded inline-block">
                        ID: {emergencyId}
                    </p>


                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {responses.map((response) => {
                        const isAvailable = response.bed_availability === true;
                        const isFull = response.bed_availability === false;

                        let cardBg = "bg-white";
                        let textColor = "text-gray-900";

                        if (isAvailable) {
                            cardBg = "bg-green-100 border-green-300";
                            textColor = "text-green-900";
                        } else if (isFull) {
                            cardBg = "bg-red-100 border-red-300";
                            textColor = "text-red-900";
                        }

                        return (
                            <div key={response.response_id} className={`p-6 border-l-8 transition-all ${cardBg} ${isAvailable ? 'border-l-green-600' : isFull ? 'border-l-red-600' : 'border-l-gray-300'}`}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`font-black text-2xl ${textColor} uppercase tracking-tight`}>
                                                {response.hospital_name}
                                            </h4>
                                            {response.eta && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-2xl">🚑</span>
                                                    <span className={`text-xl font-bold ${textColor}`}>
                                                        {t('sos.access.eta')} {response.eta}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            {isAvailable && (
                                                <span className="inline-block px-4 py-2 bg-green-600 text-white text-lg font-bold rounded-lg shadow-sm border border-green-700 animate-pulse">
                                                    {t('sos.access.bed')}
                                                </span>
                                            )}
                                            {isFull && (
                                                <span className="inline-block px-4 py-2 bg-red-600 text-white text-lg font-bold rounded-lg shadow-sm border border-red-700">
                                                    {t('sos.access.full')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-lg border-2 ${isAvailable ? 'bg-green-50 border-green-200' : isFull ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <p className={`text-sm font-bold uppercase mb-2 opacity-75 ${textColor}`}>{t('sos.access.advice')}</p>
                                        <p className={`text-xl font-medium leading-relaxed ${textColor}`}>
                                            {response.medical_advice}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {response.doctor_access?.contact && (
                                            <a
                                                href={`tel:${response.doctor_access.contact}`}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <span>📞</span> Call Hospital
                                            </a>
                                        )}
                                        {response.doctor_access?.loc_lat && response.doctor_access?.loc_long && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${response.doctor_access.loc_lat},${response.doctor_access.loc_long}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <span>🗺️</span> Navigate
                                            </a>
                                        )}
                                    </div>

                                    <div className={`text-sm font-medium opacity-60 text-right ${textColor}`}>
                                        {t('sos.access.responded')} {new Date(response.responded_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EmergencyResponseSheet;
