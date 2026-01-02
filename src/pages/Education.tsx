import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Droplets, Syringe, Apple, Pill, Shield, Baby } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AudioIcon } from "@/components/ui/AudioIcon";

const educationTopics = [
  {
    id: 'hygiene',
    icon: Droplets,
    color: "bg-blue-500",
  },
  {
    id: "vaccination",
    icon: Syringe,
    color: "bg-green-500",
  },
  {
    id: "nutrition",
    icon: Apple,
    color: "bg-orange-500",
  },
  {
    id: "commonDiseases",
    icon: Pill,
    color: "bg-red-500",
  },
  {
    id: "diseasePrevention",
    icon: Shield,
    color: "bg-purple-500",
  },
  {
    id: "motherChild",
    icon: Baby,
    color: "bg-pink-500",
  },
];

const Education = () => {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const getTopicData = (id: string) => ({
    title: t(`education.items.${id}.title`),
    description: t(`education.items.${id}.desc`),
    topics: t(`education.items.${id}.sub`, { returnObjects: true }) as string[],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground">{t('education.headerTitle')}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t('education.headerDesc')}
          </p>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {educationTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              const data = getTopicData(topic.id);
              return (
                <Card
                  key={index}
                  onClick={() => setSelectedTopic({ ...topic, ...data })}
                  className="group cursor-pointer overflow-hidden border-2 border-border transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-soft"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl ${topic.color} p-3 shadow-md`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl">{data.title}</CardTitle>
                      </div>
                      <AudioIcon text={data.description} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{data.description}</p>
                    <div className="space-y-2">
                      {/* AudioIcon removed from here to reduce clutter, added to Header for the card description */}
                      <p className="text-sm font-semibold text-foreground">{t('education.topicsCovered')}</p>
                      <ul className="space-y-1">
                        {data.topics.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {item}
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

      {/* Info Banner */}
      <section className="border-t border-border bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              {t('education.offlineTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('education.offlineDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Topic Detail Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedTopic && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl ${selectedTopic.color} p-3 shadow-md`}>
                    {(() => {
                      const IconComponent = selectedTopic.icon;
                      return <IconComponent className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <DialogTitle className="text-2xl">{selectedTopic.title}</DialogTitle>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{t('education.overview')}</h3>
                  <p className="text-muted-foreground">{selectedTopic.description}</p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">{t('education.covered')}</h3>
                  <div className="space-y-3">
                    {selectedTopic.topics.map((item: string, i: number) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">{item}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {t('education.items.hygiene.subDesc')} {item.toLowerCase()}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    {t('education.offlineNote')}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Education;
