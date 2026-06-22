"use client";

import Image from "next/image";
import { IconClockHour4 } from "@tabler/icons-react";
import Link from "next/link";

const specialtyColors = {
  cardiology: "bg-rose-700",
  neurology: "bg-purple-700",
  orthopedics: "bg-slate-700",
  pediatrics: "bg-emerald-700",
  dermatology: "bg-amber-700",
};

export default function DoctorCard({ doctor, layout = "grid" }) {
  const {
    _id,
    doctorName: name,
    specialization,
    qualifications,
    experience,
    consultationFee,
    hospitalName,
    profileImage,
  } = doctor;

  const badgeColor =
    specialtyColors[specialization?.toLowerCase()] || "bg-emerald-700";

  return (
    <Link href={`/auth/finddoctors/${_id}`} className="border rounded-xl overflow-hidden bg-white hover:shadow-md">

      {/* IMAGE */}
      <div className="relative h-60 w-full">
        <Image
          src={profileImage || "/placeholder-doctor.jpg"}
          alt={name || "Doctor"}
          fill
          className="object-cover"
        />

        <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${badgeColor}`}>
          {specialization || "General"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-sm text-gray-500">{qualifications}</p>
        <p className="text-sm text-gray-500">{hospitalName}</p>

        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <span className="text-xs flex items-center gap-1 text-gray-500">
            <IconClockHour4 size={14} />
            {experience || 0} years of experience
          </span>

          <span className="font-semibold">
            ${consultationFee || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}


