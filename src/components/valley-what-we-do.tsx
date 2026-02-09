import { motion } from "framer-motion";
import { Search, Calendar, WifiOff, Stethoscope } from "lucide-react";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeInOut" as const,
        },
    },
};

const steps = [
    {
        icon: Search,
        title: "Find Nearby Help",
        description: "Instantly locate hospitals, clinics, and pharmacies with our AI-powered geolocation finder.",
        gradient: "bg-gradient-to-br from-cyan-300/40 via-blue-200/40 to-white/30",
        border: "border-2 border-white/70",
        shadow: "shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]",
        iconColor: "text-slate-800",
    },
    {
        icon: Calendar,
        title: "Book Appointments",
        description: "Schedule consultations with verified doctors. Telemedicine support for remote diagnosis.",
        gradient: "bg-gradient-to-br from-orange-300/40 via-rose-200/40 to-amber-100/30",
        border: "border-2 border-white/70",
        shadow: "shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]",
        iconColor: "text-slate-800",
    },
    {
        icon: WifiOff,
        title: "Offline Access",
        description: "Access critical health education and first aid guides even without an internet connection.",
        gradient: "bg-gradient-to-br from-blue-300/40 via-indigo-200/40 to-sky-100/30",
        border: "border-2 border-white/70",
        shadow: "shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]",
        iconColor: "text-slate-800",
    },
    {
        icon: Stethoscope,
        title: "Symptom Checker",
        description: "AI-powered analysis to understand symptoms and recommend immediate next steps.",
        gradient: "bg-gradient-to-br from-yellow-300/40 via-lime-200/40 to-green-100/30",
        border: "border-2 border-white/70",
        shadow: "shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]",
        iconColor: "text-slate-800",
    },
];

const WhatValleyDoes = () => {
    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden bg-[image:radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-4"
                >
                    <span className="font-mono-label text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full border border-white/50 inline-block">BRIDGING THE GAP</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold text-center mb-6"
                >
                    What Sehat Saathi Does
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-muted-foreground max-w-3xl mx-auto mb-16 text-lg"
                >
                    Sehat Saathi connects the underserved with essential healthcare services, leveraging technology to overcome geographical and connectivity barriers.
                </motion.p>

                {/* Steps grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className={`group relative rounded-3xl ${step.border} p-8 ${step.gradient} ${step.shadow} backdrop-blur-[12px] hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden aspect-[4/5] flex flex-col justify-between`}
                        >
                            {/* Inner Glass shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Icon at top-left - Animated */}
                            <motion.div
                                className="relative z-10 w-fit"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                            >
                                <step.icon className={`w-8 h-8 ${step.iconColor} stroke-[1.5]`} />
                            </motion.div>

                            {/* Text content at bottom */}
                            <div className="relative z-10">
                                <motion.h3
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3 + (i * 0.1),
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10
                                    }}
                                    className="text-2xl font-semibold mb-3 text-slate-800"
                                >
                                    {step.title}
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4 + (i * 0.1),
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10
                                    }}
                                    className="text-sm font-medium text-slate-600 leading-relaxed"
                                >
                                    {step.description}
                                </motion.p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhatValleyDoes;
