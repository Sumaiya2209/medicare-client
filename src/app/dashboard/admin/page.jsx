"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/admin/overview");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  const dotVariants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="flex items-center gap-3"
        animate="jump"
        transition={{
          staggerChildren: 0.15,
          staggerDirection: 1,
        }}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-emerald-600"
          variants={dotVariants}
        />

        <motion.div
          className="w-5 h-5 rounded-full bg-emerald-600"
          variants={dotVariants}
        />

        <motion.div
          className="w-5 h-5 rounded-full bg-emerald-600"
          variants={dotVariants}
        />
      </motion.div>
    </div>
  );
}