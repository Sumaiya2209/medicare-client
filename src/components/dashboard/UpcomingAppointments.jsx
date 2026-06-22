"use client";

import AppointmentCard from "./PatientAppointmentCard";

export default function UpcomingAppointments({ appointments }) {
  return (
    <div className="rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold ">Upcoming Appointments</h2>
        <button className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {appointments.length === 0 && (
          <p className="text-sm text-gray-500">No upcoming appointments.</p>
        )}
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment._id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}