import { Link, useLocation } from "react-router-dom";
import { Heart, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLongPressSpeech } from "@/hooks/useLongPressSpeech";
import React, { useState, useRef } from "react";

const MAGNETIC_DISTANCE = 6;

const NavButtonWithSpeech = ({ item, isActive, className, children, to, ...props }: any) => {
  const { t } = useTranslation();
  const { onClick, ...handlers } = useLongPressSpeech({
    textToSpeak: t('tts.buttonDesc', { label: item.name })
  });

  // Magnetic & Spotlight Logic (Ported from Button.tsx)
  const [magneticStyle, setMagneticStyle] = useState({});
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const ref = useRef<HTMLAnchorElement>(null);
  const isMagnetic = !props.disabled;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMagnetic || window.innerWidth < 768) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
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
      background: `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.2), transparent 65%)`,
    });
  };

  const handleMouseLeave = () => {
    setMagneticStyle({});
    setSpotlightStyle({});
    // Also clear from useLongPressSpeech if needed? 
    // hook handles its own leave via handlers.onMouseLeave, so we compose them.
    if (handlers.onMouseLeave) {
      handlers.onMouseLeave(null as any);
    }
  };

  return (
    <Link
      to={to}
      ref={ref}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size: "sm"
        }),
        "relative overflow-hidden", // Needed for spotlight positioning
        className
      )}
      onClick={onClick}
      style={magneticStyle}
      onMouseMove={handleMouseMove}
      {...handlers}
      onMouseLeave={(e) => {
        handleMouseLeave();
        handlers.onMouseLeave(e);
      }}
      {...props}
    >
      {isMagnetic && (
        <span
          className="absolute inset-0 pointer-events-none transition-all duration-150"
          style={spotlightStyle}
        />
      )}
      {children}
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.education'), path: "/education" },
    { name: t('nav.healthcare'), path: "/healthcare" },
    { name: t('nav.literacy'), path: "/literacy" },
    { name: t('nav.misconceptions'), path: "/misconceptions", special: true },
    { name: t('nav.emergency'), path: "/emergency" },
    { name: t('nav.dashboard'), path: "/dashboard" },
    { name: t('nav.askDoctor'), path: "/ask-doctor" },
    { name: t('nav.locator'), path: "/locator" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="rounded-full bg-gradient-primary p-2">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">SehatSaathi</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 xl:flex xl:flex-1 xl:overflow-x-auto xl:px-4 xl:min-w-0 xl:pr-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {navItems.map((item) => (
            <NavButtonWithSpeech
              key={item.path}
              item={item}
              to={item.path}
              isActive={location.pathname === item.path}
              className={`font-medium h-9 px-3 text-xs transition-all duration-300 shrink-0 ${item.special
                ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 animate-pulse-slow border-2 border-transparent hover:border-primary/50"
                : ""
                }`}
            >
              {item.name}
              {item.special && <span className="ml-1 text-[10px]">✨</span>}
            </NavButtonWithSpeech>
          ))}
        </div>

        <div className="hidden items-center gap-1 ml-2 pl-2 border-l border-border xl:flex shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="font-semibold">{t('nav.settings', { defaultValue: 'Settings' })}</span>
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <NavButtonWithSpeech
                      key={item.path}
                      item={item}
                      to={item.path}
                      isActive={location.pathname === item.path}
                      className={`w-full justify-start text-lg transition-all duration-300 ${item.special
                        ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg border-2 border-transparent hover:border-primary/50"
                        : ""
                        }`}
                    >
                      {item.name}
                      {item.special && <span className="ml-2">✨</span>}
                    </NavButtonWithSpeech>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;