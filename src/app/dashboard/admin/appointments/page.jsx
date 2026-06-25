"use client";

import { useEffect, useState } from "react";
import { getAllAppointmentsAdmin } from "@/lib/api/admin";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllAppointmentsAdmin()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.appointmentStatus === filter);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Manage Appointments
      </h1>
      <p className="text-gray-500 mb-6">{appointments.length} total appointments</p>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              filter === f
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Patient</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Doctor</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Date & Time</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">
                    {a.patientInfo?.name || "Patient"}
                  </p>
                  <p className="text-xs text-gray-400">{a.patientInfo?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">
                    {a.doctorInfo?.doctorName || "Doctor"}
                  </p>
                  <p className="text-xs text-gray-400">{a.doctorInfo?.specialization}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {a.appointmentDate}
                  <br />
                  <span className="text-xs text-gray-400">{a.appointmentTime}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${a.appointmentStatus === "confirmed" ? "bg-green-100 text-green-700"
                    : a.appointmentStatus === "completed" ? "bg-blue-100 text-blue-700"
                    : a.appointmentStatus === "cancelled" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                    {a.appointmentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${a.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"}`}>
                    {a.paymentStatus || "unpaid"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}