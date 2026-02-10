import React, { useState, useEffect } from 'react';
import EmergencyResponseSheet from './EmergencyResponseSheet';
import EmergencyForm from './EmergencyForm';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatusView = ({ activeEmergencyId, t }: { activeEmergencyId: string | null, t: any }) => (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in pl-1">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex-shrink-0 flex items-center justify-between shadow-sm dark:bg-green-950/20 dark:border-green-900">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                {t('sos.access.header')}
            </h3>
            <div className="text-xs text-green-700 font-mono dark:text-green-500">{t('sos.access.id')} {activeEmergencyId}</div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <EmergencyResponseSheet key={activeEmergencyId} emergencyId={activeEmergencyId} />
        </div>
    </div>
);

const EmergencyAccessTab = () => {
    const { t } = useTranslation();
    const [emergencyType, setEmergencyType] = useState('Snake Bite');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [activeEmergencyId, setActiveEmergencyId] = useState<string | null>(null);
    const [patientName, setPatientName] = useState('');
    const [isNameTouched, setIsNameTouched] = useState(false);
    const [activeTab, setActiveTab] = useState("form");

    // Geolocation state
    const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError(t('sos.access.geoError'));
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
                console.error("Error getting location:", error);
                setLocationError(t('sos.access.locationError'));
            }
        );
    }, [t]);

    const handleEmergency = async () => {
        setIsLoading(true);
        try {
            const payload = {
                type: emergencyType,
                name: patientName,
                message: message,
                location: `${coords.lat}, ${coords.lng}`,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('https://n8n-qi63.onrender.com/webhook/emergency-trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Emergency response data:", data);
                if (data.id) {
                    setActiveEmergencyId(data.id);
                } else {
                    console.warn("No ID returned from webhook, using mock ID for demo");
                    setActiveEmergencyId("demo-" + Date.now());
                }

                alert(t('sos.access.success'));
                setMessage(''); // Clear message on success

                // Auto switch to status tab on mobile
                setActiveTab("status");
            } else {
                alert(t('sos.access.fail'));
            }
        } catch (error) {
            console.error('Error sending emergency signal:', error);
            alert(t('sos.access.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            {/* Mobile View with Tabs (Visible on small screens) */}
            <div className="lg:hidden h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
                        <TabsTrigger value="form">{t('sos.access.requestHelp', 'Request Help')}</TabsTrigger>
                        <TabsTrigger value="status" disabled={!activeEmergencyId}>
                            {t('sos.access.liveStatus', 'Live Status')}
                            {activeEmergencyId && <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="form" className="h-full mt-0 overflow-y-auto data-[state=inactive]:hidden">
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

                        <TabsContent value="status" className="h-full mt-0 data-[state=inactive]:hidden">
                            {activeEmergencyId && <StatusView activeEmergencyId={activeEmergencyId} t={t} />}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Desktop View with Grid (Visible on large screens) */}
            <div className="hidden lg:grid gap-6 h-full transition-all duration-300 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">

                {/* Left Side: Form */}
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

                {/* Right Side: Response Sheet */}
                {activeEmergencyId && <StatusView activeEmergencyId={activeEmergencyId} t={t} />}
            </div>
        </div>
    );
};

export default EmergencyAccessTab;
