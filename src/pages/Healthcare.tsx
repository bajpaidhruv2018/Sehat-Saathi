import { useState } from "react";
import { MapPin, Phone, Search, Video, MessageSquare, Hospital, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const Healthcare = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const nearbyFacilities = [
    {
      name: t('healthcare.nearby.facilities.chc.name'),
      type: t('healthcare.nearby.facilities.chc.type'),
      distance: "2.3 km",
      phone: "1800-XXX-XXXX",
      hours: "24/7 Emergency",
      services: t('healthcare.nearby.facilities.chc.services', { returnObjects: true }) as string[],
    },
    {
      name: t('healthcare.nearby.facilities.district.name'),
      type: t('healthcare.nearby.facilities.district.type'),
      distance: "8.5 km",
      phone: "1800-YYY-YYYY",
      hours: "24/7",
      services: t('healthcare.nearby.facilities.district.services', { returnObjects: true }) as string[],
    },
    {
      name: t('healthcare.nearby.facilities.clinic.name'),
      type: t('healthcare.nearby.facilities.clinic.type'),
      distance: "5.1 km",
      phone: "1800-ZZZ-ZZZZ",
      hours: "8 AM - 6 PM",
      services: t('healthcare.nearby.facilities.clinic.services', { returnObjects: true }) as string[],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-secondary/10 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground">{t('healthcare.title')}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t('healthcare.subtitle')}
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="border-b border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('healthcare.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="default">{t('healthcare.search.button')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Teleconsultation Options */}
      <section className="border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{t('healthcare.teleconsultation.title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-primary/20 transition-all hover:border-primary hover:shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  {t('healthcare.teleconsultation.video.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('healthcare.teleconsultation.video.desc')}
                </p>
                <Button variant="default" className="w-full">
                  {t('healthcare.teleconsultation.video.button')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 transition-all hover:border-secondary hover:shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/10 p-2">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  {t('healthcare.teleconsultation.chat.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('healthcare.teleconsultation.chat.desc')}
                </p>
                <Button variant="secondary" className="w-full">
                  {t('healthcare.teleconsultation.chat.button')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nearby Facilities */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{t('healthcare.nearby.title')}</h2>
          <div className="space-y-4">
            {nearbyFacilities.map((facility, index) => (
              <Card key={index} className="border-2 border-border transition-all hover:border-primary hover:shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-start gap-3">
                        <div className="rounded-lg bg-accent/10 p-2">
                          <Hospital className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{facility.name}</h3>
                          <p className="text-sm text-muted-foreground">{facility.type}</p>
                        </div>
                      </div>
                      <div className="ml-14 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{facility.distance} {t('healthcare.nearby.away')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{facility.hours}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {facility.services.map((service, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Phone className="mr-2 h-4 w-4" />
                        {t('healthcare.nearby.call')}
                      </Button>
                      <Button variant="soft" size="sm" className="flex-1 md:flex-none">
                        <MapPin className="mr-2 h-4 w-4" />
                        {t('healthcare.nearby.directions')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


export default Healthcare;
