import { Smartphone, Calendar, FileText, CreditCard, Wifi, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const Literacy = () => {
  const { t } = useTranslation();

  const tutorials = [
    {
      icon: Smartphone,
      title: t('literacy.tutorials.apps.title'),
      level: t('literacy.levels.beginner'),
      duration: "10 min",
      description: t('literacy.tutorials.apps.desc'),
      steps: t('literacy.tutorials.apps.steps', { returnObjects: true }) as string[],
    },
    {
      icon: Calendar,
      title: t('literacy.tutorials.booking.title'),
      level: t('literacy.levels.beginner'),
      duration: "8 min",
      description: t('literacy.tutorials.booking.desc'),
      steps: t('literacy.tutorials.booking.steps', { returnObjects: true }) as string[],
    },
    {
      icon: FileText,
      title: t('literacy.tutorials.prescriptions.title'),
      level: t('literacy.levels.beginner'),
      duration: "6 min",
      description: t('literacy.tutorials.prescriptions.desc'),
      steps: t('literacy.tutorials.prescriptions.steps', { returnObjects: true }) as string[],
    },
    {
      icon: CreditCard,
      title: t('literacy.tutorials.payment.title'),
      level: t('literacy.levels.intermediate'),
      duration: "12 min",
      description: t('literacy.tutorials.payment.desc'),
      steps: t('literacy.tutorials.payment.steps', { returnObjects: true }) as string[],
    },
    {
      icon: Wifi,
      title: t('literacy.tutorials.telemedicine.title'),
      level: t('literacy.levels.intermediate'),
      duration: "15 min",
      description: t('literacy.tutorials.telemedicine.desc'),
      steps: t('literacy.tutorials.telemedicine.steps', { returnObjects: true }) as string[],
    },
    {
      icon: Shield,
      title: t('literacy.tutorials.privacy.title'),
      level: t('literacy.levels.intermediate'),
      duration: "10 min",
      description: t('literacy.tutorials.privacy.desc'),
      steps: t('literacy.tutorials.privacy.steps', { returnObjects: true }) as string[],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case t('literacy.levels.beginner'):
      case "Beginner":
      case "शुरुआती":
        return "bg-green-500";
      case t('literacy.levels.intermediate'):
      case "Intermediate":
      case "मध्यम":
        return "bg-orange-500";
      case t('literacy.levels.advanced'):
      case "Advanced":
      case "उन्नत":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-accent/10 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground">{t('literacy.title')}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t('literacy.subtitle')}
          </p>
        </div>
      </section>

      {/* Progress Banner */}
      <section className="border-b border-border bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('literacy.progress.title')}</p>
              <p className="text-2xl font-bold text-foreground">{t('literacy.progress.status')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-green-500 text-green-700">
                {t('literacy.progress.beginner')}
              </Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                {t('literacy.progress.intermediate')}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial, index) => {
              const IconComponent = tutorial.icon;
              return (
                <Card
                  key={index}
                  className="group cursor-pointer overflow-hidden border-2 border-border transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-soft"
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className={`${getLevelColor(tutorial.level)} text-white`}>
                        {tutorial.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-xl bg-gradient-hero p-3 shadow-md">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{tutorial.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">{t('literacy.learn')}</p>
                      <ul className="space-y-1">
                        {tutorial.steps.map((step, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">{t('literacy.help.title')}</h2>
            <p className="mb-6 text-muted-foreground">
              {t('literacy.help.desc')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Badge variant="outline" className="py-2 text-sm">
                {t('literacy.help.audio')}
              </Badge>
              <Badge variant="outline" className="py-2 text-sm">
                {t('literacy.help.offline')}
              </Badge>
              <Badge variant="outline" className="py-2 text-sm">
                {t('literacy.help.lang')}
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Literacy;
