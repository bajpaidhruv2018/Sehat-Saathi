import { useState } from "react";
import { Card } from "@/components/ui/card";
import { XCircle, CheckCircle } from "lucide-react";
import { AudioIcon } from "@/components/ui/AudioIcon";

import { useTranslation } from "react-i18next";

import { misconceptions } from "@/data/misconceptions";

const MythCard = ({ misconception }: { misconception: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t, i18n } = useTranslation();

  // Map ID to icon - we keep icons in code as they are React components
  const Icon = misconception.icon;
  const isHindi = i18n.language === 'hi';

  // Helper to get text content
  const mythText = t(`misconceptions.items.${misconception.id - 1}.myth`);
  const factText = t(`misconceptions.items.${misconception.id - 1}.fact`);
  const tipText = t(`misconceptions.items.${misconception.id - 1}.tip`);
  const vernacularMyth = isHindi ? misconception.mythEn : t(`misconceptions.items.${misconception.id - 1}.mythHi`);

  const handleAudioClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Prevent card flip
    // AudioIcon handles the speak call internally, but we need to stop propagation here effectively
    // Actually AudioIcon already does stopPropagation.
    // But since the parent div has onClick, we need to be careful.
    // The AudioIcon component does e.stopPropagation().
  };

  return (
    <div
      className="flip-card h-96 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner relative h-full w-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180 scale-105' : 'scale-100'}`}>
        {/* Front - Myth */}
        <Card className="flip-card-face flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden border-2 border-destructive bg-gradient-to-br from-destructive/10 to-background shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-4 rounded-full bg-destructive/20 p-4">
            <Icon className="h-12 w-12 text-destructive" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <h3 className="text-xl font-bold text-destructive">Myth / गलत धारणा</h3>
          </div>
          <div className="flex flex-col items-center gap-2 mb-2 w-full">
            <p className="text-center text-lg font-semibold text-foreground">
              {mythText}
            </p>
            <AudioIcon text={mythText} className="hover:bg-destructive/10 text-destructive" />
          </div>
          <p className="text-center text-base text-muted-foreground">
            {vernacularMyth}
          </p>

          <p className="mt-4 text-sm text-muted-foreground italic animate-pulse">
            {t('misconceptions.tapHint')}
          </p>
        </Card>

        {/* Back - Fact */}
        <Card className="flip-card-face flip-card-back absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180 border-2 border-secondary bg-gradient-to-br from-secondary/10 to-background shadow-lg hover:shadow-xl transition-shadow overflow-y-auto">
          <div className="mb-4 rounded-full bg-secondary/20 p-4">
            <Icon className="h-12 w-12 text-secondary" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-secondary" />
            <h3 className="text-xl font-bold text-secondary">Fact / सच्चाई</h3>
          </div>
          <div className="flex flex-col items-center gap-2 mb-2 w-full">
            <p className="text-center text-lg font-semibold text-foreground">
              {factText}
            </p>
            <AudioIcon text={factText} className="hover:bg-secondary/10 text-secondary" />
          </div>

          <div className="mt-2 w-full rounded-lg bg-accent/50 p-3 border border-accent">
            <div className="flex items-start justify-between gap-2">
              <p className="mb-1 text-sm font-medium text-accent-foreground">
                📘 {tipText}
              </p>
              <AudioIcon text={tipText} className="h-6 w-6 shrink-0" />
            </div>
          </div>
          <a
            href={misconception.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-light transition-colors shadow-soft"
          >
            {t('misconceptions.learnMore')}
          </a>
        </Card>
      </div>
    </div>
  );
};

const Misconceptions = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-16 animate-slide-in-right">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-5xl animate-scale-in">
            {t('misconceptions.title')}
          </h1>
          <h2 className="font-heading mb-6 text-lg font-semibold text-muted-foreground md:text-2xl animate-scale-in" style={{ animationDelay: '100ms' }}>
            {t('misconceptions.subtitle')}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
            {t('misconceptions.description')}
          </p>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 p-6 shadow-soft animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/20 p-3">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-heading mb-2 text-xl font-bold text-primary">
                  {t('misconceptions.didYouKnow.title')}
                </h3>
                <p className="text-foreground">
                  <strong>{t('misconceptions.didYouKnow.text')}</strong>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Misconceptions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {misconceptions.map((misconception, index) => (
              <div
                key={misconception.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MythCard misconception={misconception} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="mx-auto max-w-3xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-background p-8 shadow-lg">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-secondary" />
            <h3 className="font-heading mb-4 text-2xl font-bold text-foreground">
              {t('misconceptions.cta.title')}
            </h3>
            <h4 className="font-heading mb-4 text-xl font-semibold text-muted-foreground">
              {t('misconceptions.cta.subtitle')}
            </h4>
            <p className="mb-2 text-lg text-foreground">
              {t('misconceptions.cta.text')}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Misconceptions;
