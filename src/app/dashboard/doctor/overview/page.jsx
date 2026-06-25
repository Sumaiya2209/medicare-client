"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getDoctorByUserId } from "@/lib/api/doctors";
import { getDoctorAppointments } from "@/lib/api/appointments";

export default function DoctorOverviewPage() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    getDoctorByUserId(session.user.id)
      .then((doctor) => getDoctorAppointments(doctor._id))
      .then((data) => setAppointments(data))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  // Bangladesh timezone onujayi today
  const today = new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
  // en-CA format dey "YYYY-MM-DD" — exactly MongoDB format er moto

  const todayAppointments = appointments.filter((a) => {
    const apptDate = a.appointmentDate?.slice(0, 10); // "2026-06-25T..." hole o handle korbe
    return apptDate === today;
  });

  const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;

  const stats = [
    { title: "Total Patients", value: uniquePatients },
    { title: "Today's Appointments", value: todayAppointments.length },
    { title: "Total Appointments", value: appointments.length },
    {
      title: "Completed",
      value: appointments.filter((a) => a.appointmentStatus === "completed").length,
    },
  ];

  console.log("Today:", today);
  console.log("All dates:", appointments.map(a => a.appointmentDate));

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-5 shadow-sm text-center"
          >
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">
          Today's Appointments
          <span className="ml-2 text-sm font-normal text-gray-400">({today})</span>
        </h2>

        {todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No appointments today.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {a.patientInfo?.name || "Patient"}
                  </p>
                  <p className="text-sm text-gray-500">
                    🕐 {a.appointmentTime}
                  </p>
                  {a.symptoms && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      🩺 {a.symptoms}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${a.appointmentStatus === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : a.appointmentStatus === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : a.appointmentStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {a.appointmentStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}