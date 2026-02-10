import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import valleyBg from "@/assets/hero-bg.jpg"; // Temporary fallback (aliased) until valley-bg.jpg is saved
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

// Social proof items relevant to Sehat Saathi
const socialProofItems = [
  { text: "Over 500 villages connected to healthcare" },
  { text: "10,000+ consultations provided remotely" },
  { text: "Reduced emergency response time by 40%" },
  { text: "Partnered with 50+ regional hospitals" },
];

const ValleyHero = () => {
  const { t } = useTranslation();
  const [currentProof, setCurrentProof] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof((prev) => (prev + 1) % socialProofItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center overflow-hidden pt-16 min-h-screen bg-background">
      {/* Background image - extends through signal diagram */}
      <div className="absolute inset-0 z-0">
        <img src={valleyBg} alt="" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-8">
        {/* Demo badge replacing "Watch a 90 Second Demo" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono-label tracking-wider">Empowering Rural Healthcare</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
        >
          Healthcare for All
          <br />
          <span className="inline-flex items-center gap-2">
            <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              Accessible
            </span>
          </span>{" "}
          & Affordable
          <br />
          No Matter Where You Are
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {t('home.hero.subtitle') || "Sehat Saathi connects rural communities with top-tier healthcare facilities through AI-driven diagnostics and telemedicine."}
        </motion.p>

        {/* Email + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-10"
        >
          <Link to="/education" className="w-full sm:w-auto">
            <button className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background text-base font-medium hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg hover:shadow-xl">
              Get Started <span>→</span>
            </button>
          </Link>
          <Link to="/hospital-finder" className="w-full sm:w-auto">
            <button className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background border border-input text-foreground text-base font-medium hover:bg-accent transition-colors whitespace-nowrap">
              Find Hospital
            </button>
          </Link>
        </motion.div>

        {/* Social proof ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 text-sm border border-border/50 bg-background/50 backdrop-blur-sm px-6 py-2 rounded-full w-fit mx-auto"
        >
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-background" />
            <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-background" />
            <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-background" />
          </div>
          <div className="h-6 overflow-hidden flex items-center">
            <motion.div
              key={currentProof}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-muted-foreground font-medium"
            >
              {socialProofItems[currentProof].text}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===== Signal Flow Diagram Replica ===== */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 mt-6 mb-0 hidden md:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative"
          style={{ height: 500 }}
        >
          {/* SVG Lines - exact replica coordinates */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1100 500"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Main trunk lines */}
            <motion.path d="M550 24 L550 95" stroke="currentColor" className="text-border" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.4 }} />
            <motion.path d="M550 95 L350 95 L350 154" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.4 }} />
            <motion.path d="M550 95 L750 95 L750 154" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.4 }} />

            {/* Secondary branches */}
            <motion.path d="M350 154 L350 205 L230 205 L230 256" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.4 }} />
            <motion.path d="M750 154 L750 205 L870 205 L870 256" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.4 }} />

            {/* Converging lines */}
            <motion.path d="M230 256 L230 355 L480 355 L480 425" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.7, duration: 0.5 }} />
            <motion.path d="M870 256 L870 355 L620 355 L620 425" stroke="currentColor" className="text-border" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.7, duration: 0.5 }} />

            {/* Junction dots */}
            {[
              [550, 95], [350, 95], [750, 95], [350, 205], [230, 205], [750, 205], [870, 205],
              [230, 355], [870, 355], [480, 355], [620, 355]
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" className="text-border" />
            ))}

            {/* Animated flowing dots */}
            <defs>
              <path id="flow-left" d="M550 24 L550 95 L350 95 L350 154 L350 205 L230 205 L230 256 L230 355 L480 355 L480 425" />
              <path id="flow-right" d="M550 24 L550 95 L750 95 L750 154 L750 205 L870 205 L870 256 L870 355 L620 355 L620 425" />
            </defs>
            <circle r="3" className="text-primary fill-current">
              <animateMotion dur="4.5s" repeatCount="indefinite" begin="2s"><mpath href="#flow-left" /></animateMotion>
            </circle>
            <circle r="3" className="text-primary fill-current">
              <animateMotion dur="4.5s" repeatCount="indefinite" begin="2.3s"><mpath href="#flow-right" /></animateMotion>
            </circle>
          </svg>

          {/* Nodes */}
          <SignalNode x="40%" y="0" label="Patient Inquiries" icon="user" delay={1.0} />
          <SignalNode x="22.8%" y="130px" label="Local Clinics" icon="building" delay={1.2} />
          <SignalNode x="60.18%" y="130px" label="Specialist Doctors" icon="doctor" delay={1.2} />
          <SignalNode x="12.9%" y="232px" label="Lab Reports" icon="file" delay={1.4} />
          <SignalNode x="70.09%" y="232px" label="Telemedicine" icon="video" delay={1.4} />

          {/* Central Hub Logo - Sehat Saathi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.6, type: "spring", stiffness: 120, damping: 14 }}
            className="absolute"
            style={{ left: "42.5%", top: "365px", transform: "translateX(-50%)" }}
          >
            <div className="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-2xl flex items-center justify-center flex-col gap-2">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary fill-primary" />
              </div>
              <span className="font-bold text-foreground">Sehat Saathi</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="relative z-10 py-12 text-sm text-muted-foreground animate-bounce"
      >
        Continue Scrolling ↓
      </motion.div>
    </section>
  );
};

const SignalNode = ({ label, icon, x, y, delay }: { label: string; icon: string; x: string; y: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="absolute"
    style={{ left: x, top: y, transform: "translateX(-50%)" }}
  >
    <div className="animate-signal-pulse inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-border bg-background/50 backdrop-blur-md shadow-lg hover:bg-background/80 transition-all duration-300 whitespace-nowrap">
      {/* Icons mapped to simple SVGs */}
      <span className="text-foreground/80">
        {icon === 'user' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
        {icon === 'building' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" /></svg>}
        {icon === 'doctor' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /><path d="M2 2l20 20M22 2L2 22" opacity="0" /></svg>}
        {/* Doctor uses generic plus for now, customized later if needed */}
        {icon === 'file' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>}
        {icon === 'video' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>}
      </span>
      <span className="font-mono-label text-foreground font-semibold tracking-tight">{label}</span>
    </div>
  </motion.div>
);

export default ValleyHero;
