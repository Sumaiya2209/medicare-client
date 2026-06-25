"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getDoctorAppointments, updateAppointmentStatus } from "@/lib/api/appointments";
import { getDoctorByUserId } from "@/lib/api/doctors";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function DoctorAppointmentsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!session?.user?.id) return;

    getDoctorByUserId(session.user.id)
      .then((doctor) => {
        setDoctorId(doctor._id);
        return getDoctorAppointments(doctor._id);
      })
      .then((data) => setAppointments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);

      // Local state update koro (refetch na kore)
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId
            ? { ...a, appointmentStatus: newStatus }
            : a
        )
      );

      toast.success(`Appointment ${newStatus}!`);

      // Complete hole prescription page e pathao
      if (newStatus === "completed") {
        router.push(`/dashboard/doctor/prescription/${appointmentId}`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.appointmentStatus === filter);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Appointment Requests
      </h1>
      <p className="text-gray-500 mb-6">
        Manage your patient appointments
      </p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                {/* Patient info */}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {appointment.patientInfo?.name || "Patient"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.patientInfo?.email || ""}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {appointment.appointmentDate} at{" "}
                    {appointment.appointmentTime}
                  </p>
                  {appointment.symptoms && (
                    <p className="text-sm text-gray-500 mt-1">
                      🩺 Symptoms: {appointment.symptoms}
                    </p>
                  )}
                </div>

                {/* Status + actions */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[appointment.appointmentStatus] ||
                      statusStyles.pending
                    }`}
                  >
                    {appointment.appointmentStatus}
                  </span>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap justify-end">
                    {appointment.appointmentStatus === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(appointment._id, "confirmed")
                          }
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(appointment._id, "cancelled")
                          }
                          className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}

                    {appointment.appointmentStatus === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(appointment._id, "completed")
                        }
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                      >
                        ✓ Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}