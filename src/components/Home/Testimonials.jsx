"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from "@/lib/api/home";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Patient Success Stories
          </h2>
          <p className="text-gray-500 mt-2">
            What our patients say about their experience
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <StarRating rating={review.rating || 5} />

                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                  "{review.reviewText}"
                </p>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {review.patientInfo?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {review.patientInfo?.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.doctorInfo?.doctorName
                        ? `Patient of ${review.doctorInfo.doctorName}`
                        : "Verified Patient"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}