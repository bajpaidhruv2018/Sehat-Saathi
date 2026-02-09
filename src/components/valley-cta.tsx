import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ValleyCTA = () => {
    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-4"
                >
                    <span className="font-mono-label text-muted-foreground">REAL CARE, REAL RESULTS</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold text-center mb-6"
                >
                    Here's Why Patients<br />Love Sehat Saathi
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-muted-foreground max-w-2xl mx-auto mb-8"
                >
                    Sehat Saathi makes healthcare access less anxiety inducing. Get top 1% care that makes you say "Sehat Saathi's there for me!"
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <Link
                        to="/education"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Get Started →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ValleyCTA;
