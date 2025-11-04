import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MAGNETIC_DISTANCE = 6;

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClass?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconBgClass }: FeatureCardProps) => {
  const [magneticStyle, setMagneticStyle] = React.useState({});
  const [spotlightStyle, setSpotlightStyle] = React.useState({});
  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.max(rect.width, rect.height) / 2;
    const factor = Math.min(distance / maxDistance, 1);

    const translateX = (x / maxDistance) * MAGNETIC_DISTANCE * (1 - factor);
    const translateY = (y / maxDistance) * MAGNETIC_DISTANCE * (1 - factor);

    setMagneticStyle({
      transform: `translate(${translateX}px, ${translateY}px)`,
    });

    setSpotlightStyle({
      background: `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(76,175,80,0.15), transparent 65%)`,
    });
  };

  const handleMouseLeave = () => {
    setMagneticStyle({});
    setSpotlightStyle({});
  };

  return (
    <Card 
      ref={cardRef}
      className={`group relative overflow-hidden border-2 border-border bg-card rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        ...magneticStyle,
        transition: isVisible ? 'opacity 400ms ease-out, transform 400ms ease-out' : 'all 200ms ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="absolute inset-0 pointer-events-none transition-all duration-200" style={spotlightStyle} />
      <CardContent className="pt-6 space-y-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass || "bg-primary/10"}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
