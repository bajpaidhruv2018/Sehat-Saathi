import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// Mapped to Sehat Saathi testimonials/feedback
const testimonials = [
    {
        quote: "I found myself looking at some of the messages that it's created and thinking like, wow, where did it find this? This went really deep to find information that you could never do in just a cursory search.",
        name: "Dr. Rajesh Kumar",
        title: "Chief Medical Officer",
        company: "District Hospital, MP",
        stat: "40%",
        statLabel: "FASTER DIAGNOSIS",
    },
    {
        quote: "A real response to a message Valley sent a prospect: 'I was never considering anything until you reached out with a message that literally spoke to me.' The automation is great but the sauce within Valley is the messaging itself.",
        name: "Priya Singh",
        title: "Community Health Worker",
        company: "Bihar Rural Mission",
        stat: "500+",
        statLabel: "PATIENTS SERVED",
    },
    {
        quote: "The GTM landscape is evolving daily, and Valley peaked my interest early on as a company that will be the future of GTM tools.",
        name: "Amit Patel",
        title: "Director of Operations",
        company: "TeleHealth India",
        stat: "24/7",
        statLabel: "AVAILABILITY",
    },
    {
        quote: "Valley is a cheat code. If I was using a different platform, I'd probably get a lot more meetings that were just a complete waste of my time. Those 10 Valley accounts are booking fewer meetings, but the quality is 10-15 times better.",
        name: "Sarah Johnson",
        title: "NGO Coordinator",
        company: "Health For All",
        stat: "15k",
        statLabel: "LIVES IMPACTED",
    },
    {
        quote: "If you don't have an active, engaged LinkedIn pipeline and you have a clearly defined ICP and persona, you need to add Valley to your tech stack immediately to supplement your sales.",
        name: "Dr. Anjali Gupta",
        title: "Pediatrician",
        company: "Child Care Trust",
        stat: "98%",
        statLabel: "SATISFACTION RATE",
    },
    {
        quote: "The messages it writes are actually really high-taste. I was really surprised by the personalization. I don't want to be a bottleneck for those connection requests going out - it's that good.",
        name: "Ramesh Yadav",
        title: "Village Sarpanch",
        company: "Uttar Pradesh",
        stat: "Zero",
        statLabel: "CONNECTIVITY ISSUES",
    },
];

const ValleyTestimonials = () => {
    return (
        <section id="customers" className="py-24 px-6 bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Big quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 max-w-4xl mx-auto"
                >
                    <p className="text-xl md:text-2xl italic text-muted-foreground leading-relaxed mb-8">
                        "Sehat Saathi has revolutionized how we deliver healthcare in remote areas. It's not just an app; it's a lifeline for thousands of villagers who previously had no access to doctors."
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">AS</div>
                        <div className="text-left">
                            <p className="font-semibold text-sm">Dr. Anita Sharma</p>
                            <p className="text-xs text-muted-foreground">HEAD OF RURAL HEALTH INITIATIVE</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-4"
                >
                    <span className="font-mono-label text-muted-foreground">TRUSTED BY HEALTHCARE LEADERS</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold text-center mb-6"
                >
                    Unbelievably Good Healthcare Access
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
                >
                    Most rural initiatives struggle with connectivity and adoption. Sehat Saathi solves it in a week.
                </motion.p>

                {/* Wall of Love header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-4"
                >
                    <span className="font-mono-label text-muted-foreground">REAL STORIES, REAL IMPACT</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold text-center mb-4"
                >
                    Wall of Loooooveee
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
                >
                    Automatically connect & book qualified consultations from your local network without manual travel.
                </motion.p>

                {/* Testimonial grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="rounded-2xl border border-border bg-background p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm font-semibold text-muted-foreground">{t.company}</span>
                            </div>

                            <Quote className="w-5 h-5 text-muted-foreground/30 mb-3" />

                            <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                                {t.quote}
                            </p>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center font-bold text-xs text-muted-foreground">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.title}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t.stat}</p>
                                <p className="text-xs text-muted-foreground font-mono-label">{t.statLabel}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValleyTestimonials;
