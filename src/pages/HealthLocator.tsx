import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Navigation, Star, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface Hospital {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  isOpen?: boolean;
}

const HealthLocator = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => initializeMap();
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
      });

      mapInstanceRef.current = map;
      getUserLocation();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setError('Failed to load map');
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(13);

            // Add user location marker
            new google.maps.Marker({
              position: location,
              map: mapInstanceRef.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
              title: "Your Location",
            });
          }
          fetchNearbyHospitals(location.lat, location.lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t('locator.allowLocation'));
          toast({
            title: "Location Error",
            description: t('locator.allowLocation'),
            variant: "destructive",
          });
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('nearby-hospitals', {
        body: { latitude: lat, longitude: lng, radius: 5000 }
      });

      if (error) throw error;

      setHospitals(data.hospitals);
      displayHospitalsOnMap(data.hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError(t('locator.error'));
      toast({
        title: "Error",
        description: t('locator.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayHospitalsOnMap = (hospitals: Hospital[]) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add hospital markers
    hospitals.forEach((hospital) => {
      const marker = new google.maps.Marker({
        position: hospital.location,
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#DC2626",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: hospital.name,
      });

      marker.addListener('click', () => {
        setSelectedHospital(hospital);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(hospital.location);
        }
      });

      markersRef.current.push(marker);
    });
  };

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: t('locator.call'),
      description: `${t('locator.call')} ${name}`,
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('locator.title')}
          </h1>
          <Button onClick={getUserLocation} variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" />
            {t('locator.refresh')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <Card className="overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t('locator.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapRef} className="w-full h-[500px] rounded-b-lg" />
            </CardContent>
          </Card>

          {/* Hospitals List Section */}
          <div className="space-y-4">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>{t('locator.nearbyList')}</CardTitle>
                <CardDescription>
                  {loading ? t('locator.loading') : `${hospitals.length} ${t('locator.nearbyList')}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
                {error && (
                  <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('locator.loading')}
                  </div>
                )}

                {!loading && hospitals.length === 0 && !error && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('locator.allowLocation')}
                  </div>
                )}

                {hospitals.map((hospital) => (
                  <Card
                    key={hospital.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedHospital?.id === hospital.id ? 'ring-2 ring-primary' : ''
                      }`}
                    onClick={() => {
                      setSelectedHospital(hospital);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setCenter(hospital.location);
                        mapInstanceRef.current.setZoom(15);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{hospital.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{hospital.address}</p>

                      <div className="flex items-center gap-4 mb-3">
                        {hospital.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm">{hospital.rating}</span>
                          </div>
                        )}
                        {userLocation && (
                          <span className="text-sm text-muted-foreground">
                            {calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              hospital.location.lat,
                              hospital.location.lng
                            )}{' '}
                            {t('locator.distance')}
                          </span>
                        )}
                        {hospital.isOpen !== undefined && (
                          <span className={`text-sm ${hospital.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {hospital.isOpen ? t('locator.open') : t('locator.closed')}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall('108', hospital.name);
                        }}
                        size="sm"
                        className="w-full gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {t('locator.call')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthLocator;
