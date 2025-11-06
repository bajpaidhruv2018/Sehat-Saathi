import { Link } from "react-router-dom";
import { Heart, BookOpen, MapPin, Users, Smartphone, Shield, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/rural-healthcare.jpg";
import communityImage from "@/assets/healthcare-clinic.jpg";
import elderImage from "@/assets/mobile-clinic.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Your Family Compounder - SehatSaathi
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                Sehat Saathi is like your that relative who has got those clutch connections to help you in different fields of human endeavour when all hope is lost.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl shadow-medium hover:shadow-strong transition-all">
                  <Link to="/education">Explore Health Topics</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <Link to="/healthcare">Find Healthcare</Link>
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
              What You Can Do Here
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple tools designed for real people facing real challenges.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={BookOpen}
              title="Health Education"
              description="Learn about hygiene, vaccinations, nutrition, and preventing common diseases in simple, visual guides."
              iconBgClass="bg-primary/10 text-primary"
            />
            
            <FeatureCard
              icon={Smartphone}
              title="Digital Literacy"
              description="Easy tutorials on booking appointments online, reading digital prescriptions, and using health apps."
              iconBgClass="bg-secondary/10 text-secondary"
            />
            
            <FeatureCard
              icon={MapPin}
              title="Find Healthcare"
              description="Locate nearby hospitals, clinics, and pharmacies. Connect with doctors through chat or video."
              iconBgClass="bg-accent-foreground/10 text-accent-foreground"
            />
            
            <FeatureCard
              icon={Shield}
              title="Emergency Help"
              description="Quick access to emergency numbers and nearby emergency facilities when every second counts."
              iconBgClass="bg-secondary/10 text-secondary"
            />
            
            <FeatureCard
              icon={Users}
              title="Offline Access"
              description="Once you've opened any section, the information saves on your device and works without internet."
              iconBgClass="bg-primary/10 text-primary"
            />
            
            <FeatureCard
              icon={Heart}
              title="Voice Support"
              description="Use voice search and navigation for those who find typing difficult or are still learning."
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
                      Explore Health Myths
                    </h3>
                    <h4 className="font-heading text-xl md:text-2xl font-semibold text-muted-foreground">
                      स्वास्थ्य से जुड़ी गलतफहमियाँ जानें
                    </h4>
                    <p className="text-base md:text-lg text-muted-foreground">
                      Discover the truth about common health misconceptions. Tap interactive cards to learn facts that can save lives.
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground">
                      आम स्वास्थ्य गलतफहमियों की सच्चाई जानें। इंटरैक्टिव कार्ड्स को टैप करें और जानें वो तथ्य जो जीवन बचा सकते हैं।
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button 
                      size="lg" 
                      className="rounded-xl shadow-medium group-hover:shadow-strong group-hover:scale-105 transition-all duration-300"
                    >
                      Learn Now / अभी जानें →
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
              The Difference We Hope to Make
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Every person who learns to check symptoms online, every family that finds a nearby clinic, every elderly person who books their first telemedicine appointment—that's progress. 
              Small steps toward making healthcare accessible to everyone, everywhere.
            </p>
            <div className="grid gap-8 md:grid-cols-3 pt-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">10,000+</div>
                <div className="text-white/80">People we aim to reach</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">50+</div>
                <div className="text-white/80">Villages we want to serve</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold font-heading">24/7</div>
                <div className="text-white/80">Access to health info</div>
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
                Why We Built This
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We're a small team of students who've seen family members struggle to access basic healthcare. Whether it was a grandmother who couldn't read her prescription or a cousin who had to travel 50 kilometers for a simple checkup—we've all experienced the gap.
                </p>
                <p>
                  During a college hackathon, we decided to stop talking about the problem and actually do something. We're not healthcare experts or professional developers—just people who believe technology should make life easier, not harder.
                </p>
                <p className="font-medium text-foreground">
                  This is our small attempt to bridge that gap. To make healthcare feel a little less distant for people who need it most.
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
              Our Vision for the Future
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We imagine a world where your location doesn't determine your access to healthcare. Where a farmer in a remote village can video-call a doctor as easily as someone in a city. 
              Where health literacy isn't a privilege, but a right everyone can exercise from their phone.
            </p>
            <p className="text-lg text-foreground font-medium pt-4">
              One app, one village, one person at a time—we're working toward that future.
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-xl shadow-medium hover:shadow-strong transition-all">
                <Link to="/education">Start Learning Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;