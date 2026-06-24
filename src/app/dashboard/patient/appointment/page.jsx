"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getPatientAppointments } from "@/lib/api/appointments";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";

export default function AppointmentPage() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    getPatientAppointments(session.user.id)
      .then((data) => setAppointments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const today = new Date().toISOString().split("T")[0];

  // ✅ useMemo early return er AGE thakte hobe
  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (a) =>
          a.appointmentDate >= today && a.appointmentStatus !== "cancelled"
      ),
    [appointments, today]
  );

  // early return gulo NICHE
  if (loading) return (
    <p className="text-center py-20 text-gray-500">Loading appointments...</p>
  );

  if (error) return (
    <p className="text-center py-20 text-red-500">Error: {error}</p>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>
      <UpcomingAppointments appointments={upcomingAppointments} />
    </div>
  );
}