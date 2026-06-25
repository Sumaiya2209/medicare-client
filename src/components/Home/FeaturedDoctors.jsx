"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedDoctors } from "@/lib/api/home";
import { IconClockHour4 } from "@tabler/icons-react";

const specialtyColors = {
  cardiology: "bg-rose-700",
  neurology: "bg-purple-700",
  orthopedics: "bg-slate-700",
  pediatrics: "bg-emerald-700",
  dermatology: "bg-amber-700",
};

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-gray-900">
          Meet Our Featured Doctors
        </h2>
        <p className="text-gray-500 mt-2">
          Verified professionals ready to help you
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => {
            const badgeColor =
              specialtyColors[doctor.specialization?.toLowerCase()] ||
              "bg-emerald-700";

            return (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/find-doctors/${doctor._id}`}
                  className="block overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={doctor.profileImage || "/placeholder-doctor.jpg"}
                      alt={doctor.doctorName}
                      fill
                      className="object-cover"
                    />
                    <span className={`absolute top-2 left-2 ${badgeColor} text-white text-[10px] font-semibold uppercase px-2 py-1 rounded`}>
                      {doctor.specialization}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{doctor.doctorName}</h3>
                    <p className="text-sm text-gray-500">{doctor.qualifications}</p>
                    <p className="text-sm text-gray-500">{doctor.hospitalName}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <span className="text-xs flex items-center gap-1 text-gray-500">
                        <IconClockHour4 size={14} />
                        {doctor.experience} yrs
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/find-doctors"
          className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
        >
          View All Doctors →
        </Link>
      </div>
    </section>
  );
}