"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getDoctorById } from "@/lib/api/doctors";
import BookingForm from "@/components/doctors/BookingForm";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDoctorById(id)
      .then((data) => setDoctor(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!doctor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* Doctor Info */}
      <div>
        <div className="relative h-72 w-full rounded-xl overflow-hidden">
          <Image
            src={doctor.profileImage || "/placeholder-doctor.jpg"}
            alt={doctor.doctorName}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">{doctor.doctorName}</h1>
        <p className="text-gray-500">{doctor.qualifications}</p>
        <p className="text-gray-500">{doctor.hospitalName}</p>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            {doctor.specialization}
          </span>
          <span className="text-gray-600">{doctor.experience} yrs experience</span>
          <span className="font-semibold">${doctor.consultationFee} fee</span>
        </div>
      </div>

      {/* Booking Form */}
      <div>
        <BookingForm doctor={doctor} />
      </div>
    </div>
  );
}