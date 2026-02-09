import ValleyHero from "@/components/valley-hero";
import WhatValleyDoes from "@/components/valley-what-we-do";
import ValleyFeatures from "@/components/valley-features";
import ValleyCTA from "@/components/valley-cta";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ValleyHero />
      <WhatValleyDoes />
      <ValleyFeatures />
      <ValleyCTA />
    </div>
  );
};

export default Home;