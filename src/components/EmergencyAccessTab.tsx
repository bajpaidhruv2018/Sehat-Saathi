import React, { useState, useEffect } from 'react';
import EmergencyResponseSheet from './EmergencyResponseSheet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';

const EmergencyAccessTab = () => {
    const { t } = useTranslation();
    const [emergencyType, setEmergencyType] = useState('Snake Bite');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [activeEmergencyId, setActiveEmergencyId] = useState<string | null>(null);
    const [patientName, setPatientName] = useState('');
    const [isNameTouched, setIsNameTouched] = useState(false);

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

            const response = await fetch('http://localhost:5678/webhook/emergency-trigger', {
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
            <div className={`grid gap-6 h-full transition-all duration-300 ${activeEmergencyId ? 'grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]' : 'grid-cols-1 max-w-2xl mx-auto'}`}>

                {/* Left Side: Form */}
                <div className="space-y-6 h-full flex flex-col">
                    <div className="bg-background border-2 border-red-600 rounded-xl p-6 shadow-sm dark:border-red-500 overflow-y-auto">
                        <div className="mb-6 flex items-center gap-2 border-b border-red-100 pb-2 text-2xl font-bold text-red-600 dark:border-red-900 dark:text-red-500">
                            <span>🚨</span> {t('sos.access.title')}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient-name" className="text-sm font-semibold text-foreground">
                                    {t('sos.access.patientName')} <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="patient-name"
                                    type="text"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    onBlur={() => setIsNameTouched(true)}
                                    placeholder={t('sos.access.patientNamePlaceholder')}
                                    className={`w-full ${isNameTouched && !patientName ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergency-type" className="text-sm font-semibold text-foreground">
                                    {t('sos.access.type')}
                                </Label>
                                <Select value={emergencyType} onValueChange={setEmergencyType}>
                                    <SelectTrigger id="emergency-type" className="w-full">
                                        <SelectValue placeholder={t('sos.access.typePlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Snake Bite">{t('sos.access.types.snakeBite')}</SelectItem>
                                        <SelectItem value="Accident / Trauma">{t('sos.access.types.accident')}</SelectItem>
                                        <SelectItem value="Cardiac / Chest Pain">{t('sos.access.types.cardiac')}</SelectItem>
                                        <SelectItem value="Pregnancy Emergency">{t('sos.access.types.pregnancy')}</SelectItem>
                                        <SelectItem value="Severe Fever / Infection">{t('sos.access.types.fever')}</SelectItem>
                                        <SelectItem value="Other">{t('sos.access.types.other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergency-message" className="text-sm font-semibold text-foreground">
                                    {t('sos.access.message')}
                                </Label>
                                <Textarea
                                    id="emergency-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('sos.access.messagePlaceholder')}
                                    className="min-h-[80px] resize-y"
                                />
                            </div>

                            {locationError && (
                                <div className="mb-2 text-sm font-bold text-red-600 dark:text-red-400">
                                    ⚠️ {locationError}
                                </div>
                            )}

                            <Button
                                onClick={handleEmergency}
                                disabled={isLoading || !patientName || coords.lat === null}
                                className="w-full bg-red-600 py-6 text-lg font-bold uppercase hover:bg-red-700 disabled:opacity-60 dark:text-white mt-4"
                            >
                                {isLoading ? t('sos.access.sending') : t('sos.access.pushButton')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Response Sheet */}
                {activeEmergencyId && (
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
                            <EmergencyResponseSheet emergencyId={activeEmergencyId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyAccessTab;
