"use client";

export default function DoctorAppointmentCard({ appointment }) {
  const {
    patientName,
    issue,
    time,
    status,
    initials,
  } = appointment;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 mx-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-semibold">
          {initials}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {patientName}
          </h3>

          <p className="text-sm text-gray-500">
            {issue}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-medium text-gray-800">
          {time}
        </p>

        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
            status === "Confirmed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}