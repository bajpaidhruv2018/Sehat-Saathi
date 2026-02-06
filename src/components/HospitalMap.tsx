import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

// Fix for TypeScript errors regarding L.Routing
declare global {
    interface Window {
        L: any;
    }
}

interface HospitalMapProps {
    onHospitalsUpdate?: (hospitals: any[]) => void;
}

const HospitalMap = ({ onHospitalsUpdate }: HospitalMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null); // This will now hold the MarkerClusterGroup
    const activeRoutingControlRef = useRef<any>(null); // Track active route

    // Track dependencies loading state
    const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

    // Data State
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [activeHospital, setActiveHospital] = useState<{ lat: number, lng: number } | null>(null);
    const [isFetching, setIsFetching] = useState(false); // Loader state

    const [error, setError] = useState<string | null>(null);
    const [radius, setRadius] = useState<number>(5000);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // 1. Inject Dependencies (Leaflet + Routing Machine + MarkerCluster)
    useEffect(() => {
        const loadDependencies = async () => {
            // Load Leaflet CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                link.crossOrigin = '';
                document.head.appendChild(link);
            }

            // Load Routing Machine CSS
            if (!document.querySelector('link[href*="leaflet-routing-machine.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
                link.crossOrigin = '';
                document.head.appendChild(link);
            }

            // Load MarkerCluster CSS (Default + Base)
            if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
                const link1 = document.createElement('link');
                link1.rel = 'stylesheet';
                link1.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
                link1.crossOrigin = '';
                document.head.appendChild(link1);

                const link2 = document.createElement('link');
                link2.rel = 'stylesheet';
                link2.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
                link2.crossOrigin = '';
                document.head.appendChild(link2);
            }

            // Load Leaflet JS
            if (!window.L) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.crossOrigin = '';
                    script.async = true;
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            const loadLibrary = (check: () => boolean, src: string) => {
                return new Promise<void>((resolve) => {
                    if (check()) {
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = src;
                    script.crossOrigin = '';
                    script.async = true;
                    script.onload = () => resolve();
                    document.head.appendChild(script);
                });
            };

            await Promise.all([
                // Load Routing Machine JS
                loadLibrary(() => !!(window.L as any).Routing, 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'),
                // Load MarkerCluster JS
                loadLibrary(() => !!(window.L as any).markerClusterGroup, 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js')
            ]);

            setDependenciesLoaded(true);
        };

        loadDependencies();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 2. Initialize Map once dependencies are loaded
    useEffect(() => {
        if (dependenciesLoaded && !mapInstanceRef.current && mapContainerRef.current) {
            initializeMap();
        }
    }, [dependenciesLoaded]);

    // 3. Fetch Data when Radius/Location changes
    useEffect(() => {
        if (userLocation && mapInstanceRef.current && window.L) {
            fetchHospitalsData(userLocation.lat, userLocation.lng, radius);
        }
    }, [radius, userLocation]);

    // 4. Render Markers when Hospitals or Active Hospital changes
    useEffect(() => {
        if (mapInstanceRef.current && window.L && markersLayerRef.current) {
            renderMarkers();
        }
    }, [hospitals, activeHospital]);

    // 5. Notify parent component of hospital data changes
    useEffect(() => {
        if (onHospitalsUpdate) {
            onHospitalsUpdate(hospitals);
        }
    }, [hospitals, onHospitalsUpdate]);

    const initializeMap = () => {
        const L = window.L;
        if (!mapContainerRef.current) return;

        // Initialize map (default center India)
        const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
        mapInstanceRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Initialize MarkerClusterGroup
        // Check if markerClusterGroup is available, otherwise fall back to layerGroup
        if (L.markerClusterGroup) {
            markersLayerRef.current = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 50
            }).addTo(map);
        } else {
            console.warn("MarkerCluster not loaded, falling back to LayerGroup");
            markersLayerRef.current = L.layerGroup().addTo(map);
        }

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setUserLocation({ lat: latitude, lng: longitude });
                    map.setView([latitude, longitude], 13);

                    // User Marker (Blue)
                    const userMarker = L.marker([latitude, longitude]).addTo(map)
                        .bindPopup("<b>You are here</b>");

                    userMarker.on('click', () => {
                        userMarker.openPopup();
                    });

                },
                (err) => {
                    console.error("Location access denied:", err);
                    setError("Location access denied. Please enable location services.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const fetchHospitalsData = async (lat: number, lng: number, searchRadius: number) => {
        // Clear active route when fetching new data
        handleClearRoute();
        setIsFetching(true); // Start Loading

        // Optimize: node centers only
        const query = `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:${searchRadius}, ${lat}, ${lng});
              way["amenity"="hospital"](around:${searchRadius}, ${lat}, ${lng});
              relation["amenity"="hospital"](around:${searchRadius}, ${lat}, ${lng});
            );
            out center;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.elements.length === 0) {
                console.log("No hospitals found.");
            }

            setHospitals(data.elements);

        } catch (err) {
            console.error("Error fetching hospitals:", err);
            setError("Failed to fetch hospitals. Please try again.");
        } finally {
            setIsFetching(false); // End Loading
        }
    };

    const renderMarkers = () => {
        const L = window.L;
        if (!markersLayerRef.current) return;

        markersLayerRef.current.clearLayers();

        // Prepare Icons (Memoize conceptually)
        const redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const blackIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Batch marker creation for performance
        const markers: any[] = [];

        hospitals.forEach((element: any) => {
            const hLat = element.lat || element.center?.lat;
            const hLon = element.lon || element.center?.lon;
            const name = element.tags?.name || "Healthcare Facility";

            if (hLat && hLon) {
                const isActive = activeHospital &&
                    Math.abs(activeHospital.lat - hLat) < 0.000001 &&
                    Math.abs(activeHospital.lng - hLon) < 0.000001;

                const marker = L.marker([hLat, hLon], {
                    icon: isActive ? blackIcon : redIcon
                });

                // Construct Popup
                const container = document.createElement('div');
                container.className = "flex flex-col gap-2 min-w-[200px]";

                const title = document.createElement('h3');
                title.className = "font-bold text-gray-900 text-sm mb-1";
                title.innerText = name;
                container.appendChild(title);

                if (isActive) {
                    const btnClear = document.createElement('button');
                    btnClear.className = "bg-gray-800 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-black transition-colors w-full shadow-sm flex items-center justify-center gap-1";
                    btnClear.innerHTML = "<span>❌</span> Stop Preview";
                    btnClear.onclick = (e) => {
                        e.stopPropagation();
                        handleClearRoute();
                        marker.closePopup();
                    };
                    container.appendChild(btnClear);
                } else {
                    const btnPreview = document.createElement('button');
                    btnPreview.className = "bg-blue-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-blue-700 transition-colors w-full shadow-sm flex items-center justify-center gap-1";
                    btnPreview.innerHTML = "<span>⚡</span> Preview Route";
                    btnPreview.onclick = (e) => {
                        e.stopPropagation();
                        handlePreviewRoute(hLat, hLon);
                        marker.closePopup();
                    };
                    container.appendChild(btnPreview);
                }

                const btnGoogle = document.createElement('button');
                btnGoogle.className = "bg-green-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-green-700 transition-colors w-full shadow-sm flex items-center justify-center gap-1";
                btnGoogle.innerHTML = "<span>🗺️</span> Google Maps";
                btnGoogle.onclick = () => {
                    if (userLocation) {
                        const gMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hLat},${hLon}`;
                        window.open(gMapsUrl, '_blank');
                    } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${hLat},${hLon}`, '_blank');
                    }
                };
                container.appendChild(btnGoogle);

                marker.bindPopup(container);
                markers.push(marker);
            }
        });

        // Add all markers to cluster group at once
        markersLayerRef.current.addLayers(markers);
    };

    const handlePreviewRoute = (destLat: number, destLng: number) => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!map || !userLocation || !L.Routing) return;

        if (activeRoutingControlRef.current) {
            map.removeControl(activeRoutingControlRef.current);
            activeRoutingControlRef.current = null;
        }

        setActiveHospital({ lat: destLat, lng: destLng });

        const control = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(destLat, destLng)
            ],
            show: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#2563eb', opacity: 0.8, weight: 6 }]
            },
            containerClassName: 'hidden-routing-container'
        }).addTo(map);

        activeRoutingControlRef.current = control;
    };

    const handleClearRoute = () => {
        const map = mapInstanceRef.current;
        if (activeRoutingControlRef.current && map) {
            map.removeControl(activeRoutingControlRef.current);
            activeRoutingControlRef.current = null;
        }
        setActiveHospital(null);
    };

    return (
        <Card className="w-full bg-card border-2 shadow-lg overflow-hidden">
            {/* Add a style tag to hide the routing container completely */}
            <style>{`
                .hidden-routing-container { display: none !important; }
                .leaflet-routing-container { display: none !important; }
            `}</style>

            <CardHeader className="pb-3 bg-secondary/10 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        Nearby Hospitals
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                            Live Map
                        </span>
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        {isFetching && (
                            <div className="flex items-center gap-2 text-blue-600 text-xs mr-2 animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Fetching Data...</span>
                            </div>
                        )}
                        <label htmlFor="radius-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            Search Radius:
                        </label>
                        <div className="relative">
                            <select
                                id="radius-select"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                disabled={isFetching}
                                className="h-9 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                            >
                                <option value={5000}>5 km</option>
                                <option value={10000}>10 km</option>
                                <option value={20000}>20 km</option>
                                <option value={50000}>50 km</option>
                                <option value={100000}>100 km</option>
                            </select>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 relative">
                {error && (
                    <div className="absolute top-2 left-2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md max-w-[90%]">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Loader Overlay */}
                {isFetching && (
                    <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-card border shadow-lg rounded-lg px-6 py-4 flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="font-medium text-sm">Searching hospitals...</p>
                        </div>
                    </div>
                )}

                <div
                    id="hospital-map"
                    ref={mapContainerRef}
                    className="h-[500px] w-full z-0"
                    style={{ background: '#f0f2f5' }}
                ></div>

                <div className="bg-background/95 backdrop-blur border-t p-3 flex flex-wrap justify-between items-center text-sm gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <span className="font-medium">You</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
                            <span className="font-medium">Hospital</span>
                        </div>
                        {activeHospital && (
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 rounded-full bg-black shadow-sm border border-white"></span>
                                <span className="font-medium">Destination</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(110,204,57,0.6)] text-[10px] font-bold text-white shadow-sm ring-1 ring-[rgba(110,204,57,0.6)]">
                                <span className="drop-shadow-sm">#</span>
                            </div>
                            <span className="font-medium">Cluster</span>
                        </div>
                    </div>
                    {(activeHospital || radius) && (
                        <div className="flex items-center gap-4 text-xs">
                            {activeHospital && <span className="text-blue-600 font-medium">⚡ OSRM Preview</span>}
                            <span className="text-muted-foreground">Radius: {radius / 1000} km</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default HospitalMap;
