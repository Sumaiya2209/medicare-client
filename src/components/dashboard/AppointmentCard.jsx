"use client";

export default function AppointmentCard({ appointment }) {
  const {
    doctorName,
    specialty,
    hospital,
    date,
    time,
    status,
    icon,
  } = appointment;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {doctorName}
          </h3>

          <p className="text-sm text-zinc-400">
            {specialty} · {hospital}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-medium text-white">
          {date}, {time}
        </p>

        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium
            ${
              status === "Confirmed"
                ? "bg-green-900/40 text-green-400"
                : "bg-yellow-900/40 text-yellow-400"
            }
          `}
        >
          {status}
        </span>
      </div>
    </div>
  );
}