import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import healthcareClinic from "@/assets/healthcare-clinic.jpg";
import communityLearning from "@/assets/community-learning.jpg";
import heroHealthcare from "@/assets/hero-healthcare.jpg";
import mobileClinic from "@/assets/mobile-clinic.jpg";

const features = [
    {
        id: "f1",
        icon: Search,
        title: "Hospital & Clinic Finder",
        description: "Locate medical facilities instantly. Filter by specialty, insurance acceptance, and emergency services availability.",
        route: "/hospital-finder",
        image: healthcareClinic,
    },
    {
        id: "f2",
        icon: BookOpen,
        title: "Health Education Hub",
        description: "Visual and audio guides on hygiene, nutrition, and disease prevention. Available offline for remote areas.",
        route: "/education",
        image: communityLearning,
    },
    {
        id: "f3",
        icon: Activity,
        title: "Symptom Diagnosis AI",
        description: "Advanced AI analysis of symptoms to suggest potential conditions and urgency levels. Supports local languages.",
        route: "/ask-doctor",
        image: heroHealthcare,
    },
    {
        id: "f4",
        icon: Heart,
        title: "Emergency Response",
        description: "One-touch SOS button connects to nearest ambulance and notifies emergency contacts with location data.",
        route: "/emergency",
        image: mobileClinic,
    },
];

const ValleyFeatures = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const navigate = useNavigate();

    return (
        <section id="features" className="py-24 px-6 bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <span className="font-mono-label text-muted-foreground">Comprehensive Care</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Feature tabs */}
                    <div className="space-y-3">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                onClick={() => setActiveFeature(i)}
                                onDoubleClick={() => navigate(feature.route)}
                                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${activeFeature === i
                                    ? "bg-background border-border shadow-md"
                                    : "bg-transparent border-transparent hover:bg-background/50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeFeature === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.a
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            href="/education"
                            className="inline-flex items-center gap-2 mt-4 ml-5 text-sm font-medium text-foreground hover:text-accent transition-colors"
                        >
                            Explore Guidelines →
                        </motion.a>
                    </div>

                    {/* Right: Feature visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-border bg-background overflow-hidden shadow-lg sticky top-24"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative aspect-[4/3]"
                            >
                                <img
                                    src={features[activeFeature].image}
                                    alt={features[activeFeature].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <div className="text-white">
                                        {(() => {
                                            const Icon = features[activeFeature].icon;
                                            return <Icon className="w-8 h-8 mb-3 text-white/90" />;
                                        })()}
                                        <p className="text-xl font-semibold">
                                            {features[activeFeature].title}
                                        </p>
                                        <p className="text-sm text-white/70 mt-1">
                                            Double-click to navigate
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ValleyFeatures;
