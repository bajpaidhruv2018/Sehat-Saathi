import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HospitalResponse {
    id: string;
    hospital_name: string;
    status: "BED AVAILABLE" | "HOSPITAL FULL";
    medical_advice: string;
    created_at: string;
}

interface EmergencyResponseSheetProps {
    emergencyId: string | null;
}

const EmergencyResponseSheet = ({ emergencyId }: EmergencyResponseSheetProps) => {
    const [responses, setResponses] = useState<HospitalResponse[]>([]);

    // Poll for responses
    useEffect(() => {
        if (!emergencyId) return;

        const fetchResponses = async () => {
            console.log("Polling for responses for emergency ID:", emergencyId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from("hospital_responses")
                .select("*")
                .eq("emergency_id", emergencyId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching responses:", error);
            } else if (data) {
                // Cast to match our interface since it's not in the generated types yet
                setResponses(data as unknown as HospitalResponse[]);
            }
        };

        // Initial fetch
        fetchResponses();

        // Poll every 5 seconds
        const interval = setInterval(fetchResponses, 5000);

        return () => clearInterval(interval);
    }, [emergencyId]);

    if (!emergencyId) return null;

    return (
        <div className="mt-8 border rounded-lg overflow-hidden shadow-sm bg-white" style={{ fontFamily: 'sans-serif' }}>
            <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Hospital Responses</h3>
            </div>

            {responses.length === 0 ? (
                <div className="p-8 text-center bg-blue-50/50">
                    <div className="inline-block relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full relative"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium animate-pulse">Waiting for nearby hospitals...</p>
                    <p className="text-sm text-gray-400 mt-2">Emergency ID: {emergencyId}</p>
                </div>
            ) : (
                <div className="divide-y">
                    {responses.map((response) => (
                        <div key={response.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-xl text-gray-900">{response.hospital_name}</h4>
                                {response.status === "BED AVAILABLE" ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full border border-green-200">
                                        BED AVAILABLE
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full border border-red-200">
                                        HOSPITAL FULL
                                    </span>
                                )}
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                                <p className="text-sm font-bold text-blue-700 mb-1">Medical Advice:</p>
                                <p className="text-gray-700">{response.medical_advice}</p>
                            </div>

                            <div className="mt-3 text-xs text-gray-400 text-right">
                                Received: {new Date(response.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmergencyResponseSheet;
