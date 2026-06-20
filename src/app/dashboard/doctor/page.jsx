import StatsGrid from "@/components/dashboard/StatsGrid";
import DoctorAppointmentCard from "@/components/dashboard/DoctorAppointmentCard";

const todaySchedule = [
  {
    id: 1,
    patientName: "Rafiul Karim",
    issue: "Chest pain, shortness of breath",
    time: "09:00",
    status: "Confirmed",
    initials: "RK",
  },
  {
    id: 2,
    patientName: "Sumaiya Akter",
    issue: "Routine follow-up",
    time: "10:30",
    status: "Confirmed",
    initials: "SA",
  },
  {
    id: 3,
    patientName: "Tanvir Islam",
    issue: "Irregular heartbeat",
    time: "11:15",
    status: "Pending",
    initials: "TI",
  },
];

const doctorStats = [
  {
    title: "Total Patients",
    value: 214,
  },
  {
    title: "Today's Appointments",
    value: 7,
  },
  {
    title: "Reviews Received",
    value: 132,
    suffix: " (4.8★)",
  },
];

const DoctorHomePage = () => {
  return (
    <div>
      <StatsGrid stats={doctorStats} />
      <div className="mt-6 space-y-4">
        {todaySchedule.map((appointment) => (
          <DoctorAppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>

    </div>
  );
};

export default DoctorHomePage;