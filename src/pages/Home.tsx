import { Link } from "react-router-dom";
import { Heart, BookOpen, MapPin, Users, Smartphone, Shield, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/rural-healthcare.jpg";
import communityImage from "@/assets/healthcare-clinic.jpg";
import elderImage from "@/assets/mobile-clinic.jpg";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl shadow-medium hover:shadow-strong transition-all">
                  <Link to="/education">{t('home.hero.explore')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link to="/healthcare">{t('home.hero.find')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroImage}
                alt="Healthcare worker helping rural community"
                className="rounded-2xl shadow-strong w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={BookOpen}
              title={t('home.features.education.title')}
              description={t('home.features.education.desc')}
              iconBgClass="bg-primary/10 text-primary"
            />

            <FeatureCard
              icon={Smartphone}
              title={t('home.features.literacy.title')}
              description={t('home.features.literacy.desc')}
              iconBgClass="bg-secondary/10 text-secondary"
            />

            <FeatureCard
              icon={MapPin}
              title={t('home.features.healthcare.title')}
              description={t('home.features.healthcare.desc')}
              iconBgClass="bg-accent-foreground/10 text-accent-foreground"
            />

            <FeatureCard
              icon={Shield}
              title={t('home.features.emergency.title')}
              description={t('home.features.emergency.desc')}
              iconBgClass="bg-secondary/10 text-secondary"
            />

            <FeatureCard
              icon={Users}
              title={t('home.features.offline.title')}
              description={t('home.features.offline.desc')}
              iconBgClass="bg-primary/10 text-primary"
            />

            <FeatureCard
              icon={Heart}
              title={t('home.features.voice.title')}
              description={t('home.features.voice.desc')}
              iconBgClass="bg-accent-foreground/10 text-accent-foreground"
            />
          </div>
        </div>
      </section>

      {/* Health Myths Shortcut */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <Link to="/misconceptions" className="block max-w-4xl mx-auto">
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-background hover:border-primary hover:shadow-strong transition-all duration-500 overflow-hidden animate-pulse-slow cursor-pointer">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <XCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {t('home.myths.title')}
                    </h3>
                    <h4 className="font-heading text-xl md:text-2xl font-semibold text-muted-foreground">
                      {t('home.myths.titleHi')}
                    </h4>
                    <p className="text-base md:text-lg text-muted-foreground">
                      {t('home.myths.desc')}
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {t('home.myths.descHi')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      size="lg"
                      className="rounded-xl shadow-medium group-hover:shadow-strong group-hover:scale-105 transition-all duration-300"
                    >
                      {t('home.myths.cta')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {t('home.impact.title')}
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              {t('home.impact.desc')}
            </p>
            <div className="grid gap-8 md:grid-cols-3 pt-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">{t('home.impact.stat1.val')}</div>
                <div className="text-white/80">{t('home.impact.stat1.label')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">{t('home.impact.stat2.val')}</div>
                <div className="text-white/80">{t('home.impact.stat2.label')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">{t('home.impact.stat3.val')}</div>
                <div className="text-white/80">{t('home.impact.stat3.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {t('home.story.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {t('home.story.p1')}
                </p>
                <p>
                  {t('home.story.p2')}
                </p>
                <p className="font-medium text-foreground">
                  {t('home.story.p3')}
                </p>
              </div>
            </div>
            <div>
              <img
                src={elderImage}
                alt="Elderly person using smartphone for healthcare"
                className="rounded-2xl shadow-medium w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {t('home.vision.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('home.vision.p1')}
            </p>
            <p className="text-lg text-foreground font-medium pt-4">
              {t('home.vision.p2')}
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-xl shadow-medium hover:shadow-strong transition-all">
                <Link to="/education">{t('home.vision.cta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Home;