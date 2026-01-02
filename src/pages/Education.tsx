import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Droplets, Syringe, Apple, Pill, Shield, Baby, Brain, BriefcaseMedical, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AudioIcon } from "@/components/ui/AudioIcon";

// Unsplash images for categories
const educationTopics = [
  {
    id: 'hygiene',
    icon: Droplets,
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop", // Washing hands
  },
  {
    id: "vaccination",
    icon: Syringe,
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1611694449252-02453c27856a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Local image
  },
  {
    id: "nutrition",
    icon: Apple,
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop", // Healthy food
  },
  {
    id: "mentalHealth",
    icon: Brain,
    color: "bg-purple-500",
    image: "https://plus.unsplash.com/premium_photo-1689177356594-b988a1cc45ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww", // Local image
  },
  {
    id: "firstAid",
    icon: BriefcaseMedical,
    color: "bg-red-500",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop", // First aid kit (Updated)
  },
  {
    id: "lifestyle",
    icon: Activity,
    color: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop", // Exercise (Updated)
  },
  {
    id: "commonDiseases",
    icon: Pill,
    color: "bg-red-500",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=800&auto=format&fit=crop", // Medicines
  },
  {
    id: "diseasePrevention",
    icon: Shield,
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=800&auto=format&fit=crop", // Mask/Prevention (Updated)
  },
  {
    id: "motherChild",
    icon: Baby,
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop", // Mother and baby
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Unavailable";
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/10 to-secondary/10 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">{t('education.headerTitle')}</h1>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
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
                  className="group cursor-pointer overflow-hidden border-0 relative h-64 transition-all duration-300 hover:scale-105 hover:shadow-strong"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={topic.image}
                      alt={data.title}
                      onError={handleImageError}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                  </div>

                  <div className="relative h-full flex flex-col justify-end p-6">
                    <div className="mb-auto flex justify-between items-start">
                      <div className={`rounded-xl ${topic.color} p-2 shadow-md bg-opacity-90 backdrop-blur-sm`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <AudioIcon text={data.description} className="text-white hover:bg-white/20" />
                      </div>
                    </div>

                    <CardTitle className="text-2xl font-bold text-white mb-2">{data.title}</CardTitle>
                    <p className="text-white/80 line-clamp-2 text-sm">{data.description}</p>
                  </div>
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
                <div className="relative h-48 w-[calc(100%+3rem)] -mx-6 -mt-6 mb-6 overflow-hidden">
                  <img
                    src={selectedTopic.image}
                    alt={selectedTopic.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-3">
                    <div className={`rounded-xl ${selectedTopic.color} p-3 shadow-md`}>
                      {(() => {
                        const IconComponent = selectedTopic.icon;
                        return <IconComponent className="h-8 w-8 text-white" />;
                      })()}
                    </div>
                    <DialogTitle className="text-3xl font-bold text-foreground drop-shadow-md">{selectedTopic.title}</DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 px-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                    {t('education.overview')}
                    <AudioIcon text={selectedTopic.description} />
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{selectedTopic.description}</p>
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
