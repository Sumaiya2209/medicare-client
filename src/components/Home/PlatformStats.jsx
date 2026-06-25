"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPlatformStats } from "@/lib/api/home";

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function PlatformStats() {
  const [stats, setStats] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  const statItems = stats
    ? [
        { label: "Verified Doctors", value: stats.totalDoctors, suffix: "+" },
        { label: "Happy Patients", value: stats.totalPatients, suffix: "+" },
        { label: "Appointments", value: stats.totalAppointments, suffix: "+" },
        { label: "Reviews", value: stats.totalReviews, suffix: "+" },
      ]
    : [];

  return (
    <section className="bg-emerald-700 py-16 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onViewportEnter={() => setInView(true)}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Trusted by Thousands
        </h2>
        <p className="text-emerald-100 mb-10">
          Our platform stats speak for themselves
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 rounded-2xl p-6 text-white"
            >
              <p className="text-4xl font-bold">
                {inView ? (
                  <>
                    <CountUp target={item.value} />
                    {item.suffix}
                  </>
                ) : (
                  "0+"
                )}
              </p>
              <p className="text-emerald-100 mt-1 text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}