"use client";

import { useEffect, useMemo, useState } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { getPatientAppointments } from "@/lib/api/appointments";
import { authClient } from "@/lib/auth-client";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";

const PatientHomePage = () => {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    getPatientAppointments(session.user.id)
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  // Today's date diye upcoming filter koro (only future/today dates, not cancelled)
  const today = new Date().toISOString().split("T")[0];

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => a.appointmentDate >= today && a.appointmentStatus !== "cancelled"
      ),
    [appointments, today]
  );

  const pastAppointments = useMemo(
    () => appointments.filter((a) => a.appointmentDate < today),
    [appointments, today]
  );

  const totalPaid = useMemo(
    () =>
      appointments
        .filter((a) => a.paymentStatus === "paid")
        .reduce((sum, a) => sum + (a.doctorInfo?.consultationFee || 0), 0),
    [appointments]
  );

  const favoriteDoctorsCount = useMemo(() => {
    const uniqueDoctorIds = new Set(appointments.map((a) => a.doctorId));
    return uniqueDoctorIds.size;
  }, [appointments]);

  const patientStats = [
    { title: "Upcoming", value: upcomingAppointments.length },
    { title: "Past Visits", value: pastAppointments.length },
    { title: "Total Paid", value: totalPaid, suffix: "$" },
    { title: "Favorite Doctors", value: favoriteDoctorsCount },
  ];

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <StatsGrid stats={patientStats} />
      <UpcomingAppointments appointments={upcomingAppointments} />
    </div>
  );
};

export default PatientHomePage;