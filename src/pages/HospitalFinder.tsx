import HospitalMap from "@/components/HospitalMap";
import { useTranslation } from "react-i18next";
import { Phone, AlertTriangle, Info, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const HospitalFinder = () => {
    const { t } = useTranslation();
    const [hospitals, setHospitals] = useState<any[]>([]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="border-b border-border bg-gradient-to-br from-blue-500/10 to-purple-500/10 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="mb-4 text-4xl font-bold text-foreground">
                        Hospital Finder
                    </h1>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Locate nearby hospitals, clinics, and emergency centers using our live map.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Map Section */}
                <div className="lg:col-span-2 space-y-6">
                    <HospitalMap onHospitalsUpdate={setHospitals} />

                    <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4 flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                                <p className="font-semibold mb-1">How to use this map</p>
                                <ul className="list-disc list-inside space-y-1 opacity-90">
                                    <li>Allow location access to see your position (Blue dot).</li>
                                    <li>Red markers indicate hospitals found within the radius.</li>
                                    <li>Click a marker to see the hospital name.</li>
                                    <li>Use the "Search Radius" dropdown to look further.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Complementary Features */}
                <div className="space-y-6">

                    {/* Emergency Quick Actions */}
                    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Emergency Help
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                If this is a life-threatening emergency, do not wait for the map. Call immediately.
                            </p>
                            <Button
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-lg animate-pulse"
                                onClick={() => window.open('tel:108')}
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Call Ambulance (108)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Hospitals List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Hospitals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hospitals.length > 0 ? (
                                <>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Found {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''} in selected range
                                    </p>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                        {hospitals.map((hospital, index) => {
                                            const name = hospital.tags?.name || "Healthcare Facility";
                                            const hLat = hospital.lat || hospital.center?.lat;
                                            const hLon = hospital.lon || hospital.center?.lon;

                                            return (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                                                >
                                                    <h4 className="font-semibold text-sm text-foreground mb-1">
                                                        {name}
                                                    </h4>
                                                    {(hLat && hLon) && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {hLat.toFixed(4)}, {hLon.toFixed(4)}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No hospitals found in the selected range. Try increasing the search radius.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default HospitalFinder;
