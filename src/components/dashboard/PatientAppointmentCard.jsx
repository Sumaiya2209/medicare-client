"use client";

import { Stethoscope } from "@gravity-ui/icons";

const statusStyles = {
  confirmed: "bg-green-900 text-green-400",
  pending: "bg-yellow-900 text-yellow-400",
  cancelled: "bg-red-900 text-red-400",
  completed: "bg-blue-900 text-blue-400",
};

export default function AppointmentCard({ appointment }) {
  const { doctorInfo, appointmentDate, appointmentTime, appointmentStatus } =
    appointment;

  const statusKey = (appointmentStatus || "pending").toLowerCase();
  const statusLabel =
    appointmentStatus?.charAt(0).toUpperCase() + appointmentStatus?.slice(1);

  return (
    <div className="flex items-center justify-between rounded-2xl shadow-lg px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Stethoscope />
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {doctorInfo?.doctorName || "Doctor"}
          </h3>

          <p className="text-sm text-gray-800">
            {doctorInfo?.specialization || "N/A"} · {doctorInfo?.hospitalName || "N/A"}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-medium text-gray-800">
          {appointmentDate}, {appointmentTime}
        </p>

        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[statusKey] || statusStyles.pending
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}