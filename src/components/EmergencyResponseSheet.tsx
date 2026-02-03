import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";

// Initialize Supabase client with specific credentials for this component
const supabaseUrl = "https://nqiyyailhxmavrcokrmv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXl5YWlsaHhtYXZyY29rcm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTMzNzQsImV4cCI6MjA4NTUyOTM3NH0.py8zZIE91mqXq3SDw6BIDJEFw5qCLuCMAISTZrnzt7M";
const supabase = createClient(supabaseUrl, supabaseKey);

interface HospitalResponse {
    id: string;
    hospital_name: string;
    status: "BED AVAILABLE" | "HOSPITAL FULL";
    bed_availability: boolean; // true = Available, false = Full
    medical_advice: string;
    created_at: string;
    responded_at: string;
    eta: string;
    emergency_id: string;
}

interface EmergencyResponseSheetProps {
    emergencyId: string | null;
}

const EmergencyResponseSheet = ({ emergencyId }: EmergencyResponseSheetProps) => {
    const { t } = useTranslation();
    const [responses, setResponses] = useState<HospitalResponse[]>([]);

    useEffect(() => {
        if (!emergencyId) return;

        // Initial fetch of existing responses
        const fetchResponses = async () => {
            console.log("Fetching initial responses for emergency ID:", emergencyId);
            const { data, error } = await supabase
                .from("Hospital_Responses")
                .select("*")
                .eq("emergency_id", emergencyId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching responses:", error);
            } else if (data) {
                setResponses(data as unknown as HospitalResponse[]);
            }
        };

        fetchResponses();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('hospital_replies')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Hospital_Responses',
                    filter: `emergency_id=eq.${emergencyId}`,
                },
                (payload) => {
                    console.log('New response received:', payload);
                    const newResponse = payload.new as HospitalResponse;
                    setResponses((prev) => [newResponse, ...prev]);
                }
            )
            .subscribe();

        // Cleanup subscription on unmount or id change
        return () => {
            supabase.removeChannel(channel);
        };
    }, [emergencyId]);

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
                    <p className="text-base text-gray-500 mt-2">{t('sos.access.id')} {emergencyId}</p>
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
                            <div key={response.id} className={`p-6 border-l-8 transition-all ${cardBg} ${isAvailable ? 'border-l-green-600' : isFull ? 'border-l-red-600' : 'border-l-gray-300'}`}>
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

                                    <div className={`text-sm font-medium opacity-60 text-right ${textColor}`}>
                                        {t('sos.access.responded')} {response.responded_at
                                            ? new Date(response.responded_at).toLocaleTimeString()
                                            : new Date(response.created_at).toLocaleTimeString()}
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
