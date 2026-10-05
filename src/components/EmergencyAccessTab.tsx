import React, { useState, useEffect } from 'react';
import EmergencyResponseSheet from './EmergencyResponseSheet';
import EmergencyForm from './EmergencyForm';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const StatusView = ({
    activeEmergencyId,
    t
}: {
    activeEmergencyId: string | null;
    t: any;
}) => (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in pl-1">

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex-shrink-0 flex items-center justify-between shadow-sm dark:bg-green-950/20 dark:border-green-900">

            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 flex items-center gap-2">

                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>

                {t('sos.access.header')}
            </h3>

            <div className="text-xs text-green-700 font-mono dark:text-green-500">
                {t('sos.access.id')} {activeEmergencyId}
            </div>

        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

            <EmergencyResponseSheet
                key={activeEmergencyId}
                emergencyId={activeEmergencyId}
            />

        </div>
    </div>
);

const EmergencyAccessTab = () => {

    const { t } = useTranslation();

    const [emergencyType, setEmergencyType] = useState('Snake Bite');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [activeEmergencyId, setActiveEmergencyId] =
        useState<string | null>(null);

    const [patientName, setPatientName] = useState('');

    const [isNameTouched, setIsNameTouched] = useState(false);

    const [activeTab, setActiveTab] = useState("form");

    // Geolocation
    const [coords, setCoords] = useState<{
        lat: number | null;
        lng: number | null;
    }>({
        lat: null,
        lng: null
    });

    const [locationError, setLocationError] =
        useState<string | null>(null);


    /*
     * ---------------------------------------------------------
     * GET USER LOCATION
     * ---------------------------------------------------------
     */

    useEffect(() => {

        if (!navigator.geolocation) {

            setLocationError(
                t('sos.access.geoError')
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

                setLocationError(null);
            },

            (error) => {

                console.error(
                    "Error getting location:",
                    error
                );

                setLocationError(
                    t('sos.access.locationError')
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );

    }, [t]);


    /*
     * ---------------------------------------------------------
     * SEND EMERGENCY
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     * n8n has been completely removed.
     *
     * Emergency is now inserted directly into:
     *
     * public."Emergencies"
     *
     * ---------------------------------------------------------
     */

    const handleEmergency = async () => {

        // Validate patient name
        if (!patientName.trim()) {

            setIsNameTouched(true);

            alert(
                t(
                    'sos.access.nameRequired',
                    'Please enter the patient name.'
                )
            );

            return;
        }

        setIsLoading(true);

        try {

            /*
             * Build location string using the exact
             * format expected by your database.
             *
             * Example:
             *
             * "23.0735, 76.8589"
             */

            const location =
                coords.lat !== null && coords.lng !== null
                    ? `${coords.lat}, ${coords.lng}`
                    : null;


            /*
             * This matches your actual Supabase schema:
             *
             * patient_name
             * emergency_type
             * user_message
             * location_lat_long
             * status
             * created_at
             */

            const emergencyPayload = {

                patient_name:
                    patientName.trim(),

                emergency_type:
                    emergencyType,

                user_message:
                    message.trim() || null,

                location_lat_long:
                    location,

                status:
                    'active',

                created_at:
                    new Date().toISOString()
            };


            console.log(
                "Creating emergency:",
                emergencyPayload
            );


            /*
             * DIRECT SUPABASE INSERT
             *
             * No n8n.
             * No Render.
             * No webhook.
             * No CORS problem.
             */

            const { data, error } = await supabase

                .from('Emergencies')

                .insert(emergencyPayload)

                .select('id')

                .single();


            /*
             * Supabase returned an error
             */

            if (error) {

                console.error(
                    "Supabase emergency error:",
                    error
                );

                throw error;
            }


            /*
             * Make sure Supabase actually returned
             * the emergency ID.
             */

            if (!data?.id) {

                throw new Error(
                    "Emergency was created but no ID was returned."
                );
            }


            console.log(
                "Emergency created successfully:",
                data.id
            );


            /*
             * Save emergency ID.
             *
             * EmergencyResponseSheet will now use
             * this ID to look for hospital responses.
             */

            setActiveEmergencyId(data.id);


            // Clear message
            setMessage('');


            // Move to Live Status
            setActiveTab("status");


            alert(
                t(
                    'sos.access.success',
                    'Emergency request sent successfully.'
                )
            );

        } catch (error: any) {

            console.error(
                "Error sending emergency signal:",
                error
            );


            /*
             * Display the actual Supabase error.
             *
             * This is useful during development.
             */

            const errorMessage =
                error?.message ||
                t(
                    'sos.access.networkError',
                    'Unable to send emergency request.'
                );


            alert(errorMessage);

        } finally {

            setIsLoading(false);

        }
    };


    return (
        <div className="w-full h-full">


            {/* =================================================
                MOBILE VIEW
            ================================================= */}

            <div className="lg:hidden h-full">

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="h-full flex flex-col"
                >

                    <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">

                        <TabsTrigger value="form">

                            {t(
                                'sos.access.requestHelp',
                                'Request Help'
                            )}

                        </TabsTrigger>


                        <TabsTrigger
                            value="status"
                            disabled={!activeEmergencyId}
                        >

                            {t(
                                'sos.access.liveStatus',
                                'Live Status'
                            )}

                            {activeEmergencyId && (

                                <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />

                            )}

                        </TabsTrigger>

                    </TabsList>


                    <div className="flex-1 overflow-hidden">


                        {/* -----------------------------------------
                            FORM
                        ------------------------------------------ */}

                        <TabsContent
                            value="form"
                            className="h-full mt-0 overflow-y-auto data-[state=inactive]:hidden"
                        >

                            <EmergencyForm

                                patientName={patientName}
                                setPatientName={setPatientName}

                                emergencyType={emergencyType}
                                setEmergencyType={setEmergencyType}

                                message={message}
                                setMessage={setMessage}

                                handleEmergency={handleEmergency}

                                isLoading={isLoading}

                                locationError={locationError}
                                coords={coords}

                                isNameTouched={isNameTouched}
                                setIsNameTouched={setIsNameTouched}

                            />

                        </TabsContent>


                        {/* -----------------------------------------
                            STATUS
                        ------------------------------------------ */}

                        <TabsContent
                            value="status"
                            className="h-full mt-0 data-[state=inactive]:hidden"
                        >

                            {activeEmergencyId && (

                                <StatusView
                                    activeEmergencyId={activeEmergencyId}
                                    t={t}
                                />

                            )}

                        </TabsContent>

                    </div>

                </Tabs>

            </div>



            {/* =================================================
                DESKTOP VIEW
            ================================================= */}

            <div className="hidden lg:grid gap-6 h-full transition-all duration-300 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">


                {/* -----------------------------------------
                    LEFT — EMERGENCY FORM
                ------------------------------------------ */}

                <div className="space-y-6 h-full flex flex-col">

                    <EmergencyForm

                        patientName={patientName}
                        setPatientName={setPatientName}

                        emergencyType={emergencyType}
                        setEmergencyType={setEmergencyType}

                        message={message}
                        setMessage={setMessage}

                        handleEmergency={handleEmergency}

                        isLoading={isLoading}

                        locationError={locationError}
                        coords={coords}

                        isNameTouched={isNameTouched}
                        setIsNameTouched={setIsNameTouched}

                    />

                </div>



                {/* -----------------------------------------
                    RIGHT — HOSPITAL RESPONSES
                ------------------------------------------ */}

                {activeEmergencyId && (

                    <StatusView
                        activeEmergencyId={activeEmergencyId}
                        t={t}
                    />

                )}

            </div>

        </div>
    );
};

export default EmergencyAccessTab;