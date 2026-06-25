"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  getPatientAppointments,
  cancelAppointment,
  rescheduleAppointment,
} from "@/lib/api/appointments";
import { Stethoscope } from "@gravity-ui/icons";
import toast from "react-hot-toast";

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

// Reschedule Modal
function RescheduleModal({ appointment, onClose, onSuccess, slots }) {
  const [date, setDate] = useState(appointment.appointmentDate);
  const [time, setTime] = useState(appointment.appointmentTime);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await rescheduleAppointment(appointment._id, date, time);
      toast.success("Appointment rescheduled!");
      onSuccess(appointment._id, date, time);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Reschedule Appointment
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          With: {appointment.doctorInfo?.doctorName || "Doctor"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">New Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Time</label>
            {slots && slots.length > 0 ? (
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full border rounded-lg p-2 mt-1 bg-white"
              >
                <option value="">Select time slot</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            ) : (
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-700 text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    getPatientAppointments(session.user.id)
      .then(setAppointments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, appointmentStatus: "cancelled" } : a
        )
      );
      toast.success("Appointment cancelled!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRescheduleSuccess = (id, newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a._id === id
          ? { ...a, appointmentDate: newDate, appointmentTime: newTime, appointmentStatus: "pending" }
          : a
      )
    );
  };

  const filteredAppointments = useMemo(
    () =>
      filter === "all"
        ? appointments
        : appointments.filter((a) => a.appointmentStatus === filter),
    [appointments, filter]
  );

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading appointments...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
      <p className="text-gray-500 mb-6">{appointments.length} total appointments</p>

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
            {f !== "all" && (
              <span className="ml-1 text-xs opacity-70">
                ({appointments.filter((a) => a.appointmentStatus === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointment list */}
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
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                {/* Doctor info */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Stethoscope />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {appointment.doctorInfo?.doctorName || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.doctorInfo?.specialization || "N/A"} ·{" "}
                      {appointment.doctorInfo?.hospitalName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 {appointment.appointmentDate} at {appointment.appointmentTime}
                    </p>
                    {appointment.symptoms && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        🩺 {appointment.symptoms}
                      </p>
                    )}
                  </div>
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

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      appointment.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    💳 {appointment.paymentStatus || "unpaid"}
                  </span>

                  {/* Action buttons */}
                  {appointment.appointmentStatus !== "cancelled" &&
                    appointment.appointmentStatus !== "completed" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRescheduleTarget(appointment)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 font-medium"
                        >
                          📅 Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 font-medium"
                        >
                          ✗ Cancel
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          slots={rescheduleTarget.doctorInfo?.availableSlots || []}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
}